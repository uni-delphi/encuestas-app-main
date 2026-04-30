import { Enunciados, Survey, Tecnologias } from "@/generated/prisma";
import { prisma } from "../prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";

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
  dataEnunciadoId: any;
}) {
  return await prisma.enunciados.findFirst({
    where: {
      slug: dataSlug,
    },
    include: {
      questions: {
        include: {
          responses: {
            include: {
              singleChoice: true,
              checkbox: true,
            },
            where: {
              respondentId: dataUserId,
              enunciadosId: dataEnunciadoId,
            },
          },
        },
        orderBy: {
          id: "asc", // or 'desc' for descending order
        },
      },
    },
    orderBy: {
      id: "asc", // or 'desc' for descending order
    },
  });
}

export async function getAllEnunciados() {
  return await prisma.enunciados.findMany({
    include: {
      response: true,
      questions: true,
    },
    orderBy: {
      id: "asc", // or 'desc' for descending order
    },
  });
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

export async function updateEncuesta(surveyId: number, data: any) {
  return await prisma.survey.update({
    where: {
      id: surveyId,
    },
    data,
  });
}

export async function getSlugs() {
  let index = 0;
  const response = await prisma.tecnologias.findMany({
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

export async function createEncuesta(data: Partial<Survey>) {
  const session = await getServerSession(authOptions);

  return await prisma.survey.create({
    data: {
      title: data.title!,
      description: data.description,
      slug: data.slug!,
      isActive: data.isActive,
      endDate: data.endDate!,
      createdById: session?.user.id!,
    },
  });
}

export async function createTecnologiaAction(data: Partial<Tecnologias>) {
  console.log("🚀 ~ createTecnologiaAction ~ data:", data);

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
  console.log("🚀 ~ updateTecnologiaAction ~ data:", data);

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

export async function getEncuestaById(params: { id: number }) {
  return await prisma.survey.findUnique({
    where: {
      id: params.id,
    },
    include: {
      tecnologias: {
        include: {
          enunciados: true,
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
}

export async function createEnunciadoAction(data: Partial<Enunciados>) {
  console.log("🚀 ~ createEnunciadoAction ~ data:", data);

  return await prisma.enunciados.create({
    data: {
      title: data.title!,
      description: data.description!,
      slug: data.slug!,
      tecnologiaId: data.tecnologiaId!,
    },
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
