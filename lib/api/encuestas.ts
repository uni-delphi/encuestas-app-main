import { Survey } from "@/generated/prisma";
import { prisma } from "../prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";

export async function getAllEncuestas(userId: string) {
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

export async function getEncuesta() {
  return await prisma.survey.findMany({
    include: {
      tecnologias: {
        include: {
          enunciados: true,
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
      isActive: data.isActive,
      endDate: data.endDate!,
      createdById: session?.user.id!,
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
    },
  });
}