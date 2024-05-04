import { db } from "../prisma";

export async function getAllEncuestas() {
  return await db.survey.findMany({
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
  return await db.survey.findMany({
    include: {
      tecnologias: {
        include: {
          enunciados: {
            select: { 
              slug: true,
            }          
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
  return await db.tecnologias.findFirst({
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
  //console.log("🚀 ~ enunciadoId:", enunciadoId);
  return await db.enunciados.findFirst({
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
  return await db.enunciados.findMany({
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
  enunciadosId: number
) {
  return await db.response.findFirst({
    where: {
      enunciadosId,
      //questionId,
    },
    include: {
      question: true,
    },
  });
}
