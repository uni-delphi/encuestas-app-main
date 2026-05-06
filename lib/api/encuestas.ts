import { Enunciados, Survey, Tecnologias } from "@/generated/prisma";
import { prisma } from "../prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { generateSlug } from "@/utils/text-helper";

export async function getAllEncuestas() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("No autenticado");

  const { id: userId, role } = session.user;
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

export async function getMyEncuestas(page = 0, pageSize = 10) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("No autenticado");

  const { id: userId, role } = session.user;
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

export async function getMyEncuestasByAssignedAction(page = 0, pageSize = 10) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("No autenticado");
  const { id: userId, role } = session.user;
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

export async function getEnunciado({
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
    questions: enunciado.questionsEnunciados.map((qe) => qe.question),
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
  console.log("🚀 ~ updateEncuestaAction ~ data:", {
    title: data.title!,
    description: data.description,
    slug: generateSlug(data.title!),
    isActive: data.isActive,
    endDate: data.endDate!,
    createdById: session?.user.id!,
    aboutLink: data.aboutLink,
  });
  // return

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
        questions: e.questionsEnunciados.map((qe) => qe.question),
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
