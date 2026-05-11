import { Enunciados, Survey, Tecnologias } from "@/generated/prisma";
import { prisma } from "../prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { generateSlug } from "@/utils/text-helper";

export async function getAllEncuestas(userId: string) {
  /*const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("No autenticado");

  const { id: userId, role } = session.user;*/
  return await prisma.survey.findMany({
    include: {
      tecnologias: {
        include: {
          enunciados: {
            include: {
              response: {
                where: {
                  respondentId: userId,
                },
                /*_count: {
                  select: { questionsEnunciados: true },
                },*/
              },
            },
          },
        },
        orderBy: {
          id: "asc", // or 'desc' for descending order
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

// actions.ts
export async function getEncuestasAction(page = 0, pageSize = 10) {
  const [encuestas, total] = await Promise.all([
    prisma.survey.findMany({
      skip: page * pageSize,
      take: pageSize,
      include: {
        tecnologias: {
          select: {
            id: true,
            title: true,
            _count: { select: { enunciados: true } },
          },
          orderBy: { id: "asc" },
        },
        createdBy: {
          select: { id: true, name: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.survey.count(),
  ]);

  return { encuestas, total, pageCount: Math.ceil(total / pageSize) };
}

export async function getMyEncuestas(userId: any, page:number = 0, pageSize:number = 10) {
 /* const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("No autenticado");

  const { id: userId, role } = session.user;*/
  const [encuestas, total] = await Promise.all([
    prisma.survey.findMany({
      where: {
        createdById: userId,
      },
      orderBy: { createdAt: "desc" },
      include: {
        tecnologias: {
          select: {
            id: true,
            title: true,
            _count: { select: { enunciados: true } },
          },
          orderBy: { id: "asc" },
        },
        createdBy: {
          select: { id: true, name: true, lastName: true, email: true },
        },
      },
      skip: page * pageSize,
      take: pageSize,
    }),
    prisma.survey.count({
      where: {
        createdById: userId,
      },
    }),
  ]);

  return { encuestas, total, pageCount: Math.ceil(total / pageSize) };
}

export async function getMyEncuestasByAssignedAction(userId: string, page: number = 0, pageSize: number = 10) {
  /*const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("No autenticado");
  const { id: userId, role } = session.user;*/
  const [encuestas, total] = await Promise.all([
    prisma.survey.findMany({
      where: {
        assignedUsers: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        tecnologias: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: page * pageSize,
      take: pageSize,
    }),
    prisma.survey.count({
      where: {
        assignedUsers: {
          some: {
            id: userId,
          },
        },
      },
    }),
  ]);

  return { encuestas, total, pageCount: Math.ceil(total / pageSize) };
}

export async function getEncuestaBySlugAction(slug: string) {
  return await prisma.survey.findUnique({
    where: {
      slug,
    },
    /*include: {
      tecnologias: {
        include: {
          enunciados: {
            select: {
              slug: true,
            },
          },
        },
        orderBy: {
          id: "asc", // or 'desc' for descending order
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          lastName: true,
          email: true,
        },
      },
    },*/
  });
}

export async function getFullEncuestaBySlugAction(slug: string) {
  return await prisma.survey.findUnique({
    where: {
      slug,
    },
    include: {
      tecnologias: {
        include: {
          enunciados: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
}

export async function getEncuestaInfo() {
  return await prisma.survey.findMany({
    include: {
      tecnologias: {
        include: {
          enunciados: {
            select: {
              slug: true,
            },
          },
        },
        orderBy: {
          id: "asc", // or 'desc' for descending order
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
}

export async function getTecnologia(slug: string) {
  return await prisma.tecnologias.findFirst({
    where: {
      slug,
    },
    include: {
      enunciados: true,
    },
  });
}

export async function getEnunciadoAction({
  dataSlug,
  dataUserId,
  dataEnunciadoId,
}: {
  dataSlug: string;
  dataUserId: string;
  dataEnunciadoId: number;
}) {
  const enunciado = await prisma.enunciados.findFirst({
    where: { slug: dataSlug },
    include: {
      questionsEnunciados: {
        orderBy: { questionId: "asc" },
        include: {
          question: {
            include: {
              responses: {
                where: {
                  respondentId: dataUserId,
                  enunciadosId: dataEnunciadoId,
                },
                include: {
                  singleChoice: true,
                  checkbox: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!enunciado) return null;

  // Misma forma que antes — los componentes no se enteran del cambio
  return {
    ...enunciado,
    questions: enunciado.questionsEnunciados.map((qe) => ({
      ...qe.question,
      isVisibleInEnunciado: qe.isActive,
    })),
  };
}

export async function getAllEnunciados() {
  const enunciados = await prisma.enunciados.findMany({
    include: {
      response: true,
      questionsEnunciados: {
        orderBy: { questionId: "asc" },
        include: { question: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return enunciados.map((e) => ({
    ...e,
    questions: e.questionsEnunciados.map((qe) => qe.question),
  }));
}

export async function getExampleResponses(
  //questionId: number,
  enunciadosId: number,
) {
  return await prisma.response.findFirst({
    where: {
      enunciadosId,
      //questionId,
    },
    include: {
      question: true,
    },
  });
}

export async function updateEncuestaAction(
  surveyId: number,
  data: Partial<Survey>,
) {
  const session = await getServerSession(authOptions);
  return await prisma.survey.update({
    where: {
      id: surveyId,
    },
    data: {
      title: data.title!,
      description: data.description,
      slug: generateSlug(data.title!),
      isActive: data.isActive,
      endDate: new Date(data.endDate!),
      createdById: session?.user.id!,
      aboutLink: data.aboutLink,
    },
  });
}

export async function getSlugs(surveyId: number) {
  let index = 0;
  const response = await prisma.tecnologias.findMany({
    where: {
      surveyId,
    },
    select: {
      slug: true,
      enunciados: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return response.reduce((acc: any, item: any) => {
    item.enunciados.forEach((enunciado: any) => {
      acc.push({
        index: index++,
        tecnologiaSlug: item.slug,
        enunciadoSlug: enunciado.slug,
      });
    });
    return acc;
  }, []);
}

export async function createEncuestaAction(surveyInfo: any) {
  const session = await getServerSession(authOptions);
  const { data } = surveyInfo;

  return await prisma.survey.create({
    data: {
      title: data.title!,
      description: data.description,
      slug: generateSlug(data.title!),
      isActive: data.isActive,
      endDate: new Date(data.endDate!),
      createdById: session?.user.id!,
      aboutLink: data.aboutLink,
    },
  });
}

export async function createTecnologiaAction(data: Partial<Tecnologias>) {
  return await prisma.tecnologias.create({
    data: {
      title: data.title!,
      description: data.description!,
      slug: data.slug!,
      surveyId: data.surveyId!,
    },
  });
}

export async function updateTecnologiaAction(data: Partial<Tecnologias>) {
  return await prisma.tecnologias.update({
    where: {
      id: data.id!,
    },
    data: {
      title: data.title,
      description: data.description,
      slug: data.slug,
    },
  });
}

export async function getEncuestaByIdAction(params: { id: number }) {
  const survey = await prisma.survey.findUnique({
    where: {
      id: params.id,
    },
    include: {
      tecnologias: {
        include: {
          enunciados: {
            include: {
              questionsEnunciados: {
                orderBy: { questionId: "asc" },
                include: { question: true },
              },
            },
          },
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          lastName: true,
          email: true,
        },
      },
      assignedUsers: {
        select: {
          id: true,
          name: true,
          lastName: true,
          email: true,
        },
        orderBy: [{ name: "asc" }, { lastName: "asc" }],
      },
    },
  });

  if (!survey) return null;

  return {
    ...survey,
    tecnologias: survey.tecnologias.map((t) => ({
      ...t,
      enunciados: t.enunciados.map((e) => ({
        ...e,
        questions: e.questionsEnunciados.map((qe) => ({
          ...qe.question,
          isVisibleInEnunciado: qe.isActive, // 👈 agregás esto
        })),
      })),
    })),
  };
}

export async function getFullEncuestaByIdAction(params: { id: number }) {
  const survey = await prisma.survey.findUnique({
    where: {
      id: params.id,
    },
    include: {
      tecnologias: {
        include: {
          enunciados: {
            include: {
              response: {
                include: {
                  respondent: true,
                  singleChoice: true,
                  checkbox: true,
                  question: true,
                },
              },
              questionsEnunciados: {
                orderBy: { questionId: "asc" },
                include: { question: true },
              },
            },
          },
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          lastName: true,
          email: true,
        },
      },
      assignedUsers: {
        select: {
          id: true,
          name: true,
          lastName: true,
          email: true,
        },
        orderBy: [{ name: "asc" }, { lastName: "asc" }],
      },
    },
  });

  if (!survey) return null;

  return {
    ...survey,
    tecnologias: survey.tecnologias.map((t) => ({
      ...t,
      enunciados: t.enunciados.map((e) => ({
        ...e,
        questions: e.questionsEnunciados.map((qe) => ({
          ...qe.question,
          isVisibleInEnunciado: qe.isActive, // 👈 agregás esto
        })),
      })),
    })),
  };
}

// Cache en módulo — persiste entre llamadas en el mismo proceso
let cachedQuestionIds: number[] | null = null;

async function getQuestionIds(): Promise<number[]> {
  if (cachedQuestionIds) return cachedQuestionIds;

  const questions = await prisma.question.findMany({
    select: { id: true },
    orderBy: { id: "asc" },
  });

  cachedQuestionIds = questions.map((q) => q.id);
  return cachedQuestionIds;
}

export async function createEnunciadoAction(data: Partial<Enunciados>) {
  const questionIds = await getQuestionIds();
  return prisma.$transaction(async (tx) => {
    const enunciado = await tx.enunciados.create({
      data: {
        title: data.title!,
        description: data.description!,
        slug: data.slug!,
        tecnologiaId: data.tecnologiaId!,
      },
    });

    await tx.questionEnunciado.createMany({
      data: questionIds.map((questionId) => ({
        enunciadoId: enunciado.id,
        questionId,
      })),
      skipDuplicates: true,
    });

    return enunciado;
  });
}

export async function updateEnunciadoAction(data: Partial<Enunciados>) {
  return await prisma.enunciados.update({
    where: {
      id: data.id!,
    },
    data: {
      title: data.title,
      description: data.description,
      slug: data.slug,
    },
  });
}

export async function toggleQuestionEnunciadoAction(
  enunciadoId: number,
  questionId: number,
  isActive: boolean,
) {
  return await prisma.questionEnunciado.update({
    where: { enunciadoId_questionId: { enunciadoId, questionId } },
    data: { isActive },
  });
}

// actions/tecnologia.ts
export async function deleteTecnologiaAction(tecnologiaId: number) {
  return await prisma.$transaction(async (tx) => {

    // 1. Obtener todos los enunciados de la tecnología
    const enunciados = await tx.enunciados.findMany({
      where: { tecnologiaId },
      select: { id: true }
    })
    const enunciadoIds = enunciados.map(e => e.id)

    if (enunciadoIds.length > 0) {
      // 2. Borrar SingleChoiceResponse y CheckboxResponse primero
      await tx.singleChoiceResponse.deleteMany({
        where: { enunciadosId: { in: enunciadoIds } }
      })
      await tx.checkboxResponse.deleteMany({
        where: { enunciadosId: { in: enunciadoIds } }
      })

      // 3. Borrar Responses
      await tx.response.deleteMany({
        where: { enunciadosId: { in: enunciadoIds } }
      })

      // 4. Borrar QuestionEnunciado
      await tx.questionEnunciado.deleteMany({
        where: { enunciadoId: { in: enunciadoIds } }
      })

      // 5. Borrar Enunciados
      await tx.enunciados.deleteMany({
        where: { tecnologiaId }
      })
    }

    // 6. Borrar la Tecnología
    return await tx.tecnologias.delete({
      where: { id: tecnologiaId }
    })
  })
}

// actions/enunciado.ts
export async function deleteEnunciadoAction(enunciadoId: number) {
  return await prisma.$transaction(async (tx) => {

    // 1. Borrar SingleChoiceResponse y CheckboxResponse
    await tx.singleChoiceResponse.deleteMany({
      where: { enunciadosId: enunciadoId }
    })
    await tx.checkboxResponse.deleteMany({
      where: { enunciadosId: enunciadoId }
    })

    // 2. Borrar Responses
    await tx.response.deleteMany({
      where: { enunciadosId: enunciadoId }
    })

    // 3. Borrar QuestionEnunciado
    await tx.questionEnunciado.deleteMany({
      where: { enunciadoId }
    })

    // 4. Borrar el Enunciado
    return await tx.enunciados.delete({
      where: { id: enunciadoId }
    })
  })
}

// actions/survey.ts
export async function deleteSurveyAction(surveyId: number) {
  return await prisma.$transaction(async (tx) => {

    // 1. Obtener todas las tecnologías de la encuesta
    const tecnologias = await tx.tecnologias.findMany({
      where: { surveyId },
      select: { id: true }
    })
    const tecnologiaIds = tecnologias.map(t => t.id)

    if (tecnologiaIds.length > 0) {
      // 2. Obtener todos los enunciados de esas tecnologías
      const enunciados = await tx.enunciados.findMany({
        where: { tecnologiaId: { in: tecnologiaIds } },
        select: { id: true }
      })
      const enunciadoIds = enunciados.map(e => e.id)

      if (enunciadoIds.length > 0) {
        // 3. Borrar SingleChoiceResponse y CheckboxResponse
        await tx.singleChoiceResponse.deleteMany({
          where: { enunciadosId: { in: enunciadoIds } }
        })
        await tx.checkboxResponse.deleteMany({
          where: { enunciadosId: { in: enunciadoIds } }
        })

        // 4. Borrar Responses
        await tx.response.deleteMany({
          where: { enunciadosId: { in: enunciadoIds } }
        })

        // 5. Borrar QuestionEnunciado
        await tx.questionEnunciado.deleteMany({
          where: { enunciadoId: { in: enunciadoIds } }
        })

        // 6. Borrar Enunciados
        await tx.enunciados.deleteMany({
          where: { tecnologiaId: { in: tecnologiaIds } }
        })
      }

      // 7. Borrar Tecnologías
      await tx.tecnologias.deleteMany({
        where: { surveyId }
      })
    }

    // 8. Borrar invitaciones de la encuesta
    await tx.surveyInvitation.deleteMany({
      where: { surveyId }
    })

    // 9. Borrar la Survey
    return await tx.survey.delete({
      where: { id: surveyId }
    })
  })
}