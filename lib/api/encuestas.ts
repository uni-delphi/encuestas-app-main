import { db } from "../prisma";

export async function getAllEncuestas() {
  return await db.survey.findMany({
    include: {
      tecnologias: {
        include: {            
            enunciados: {
                include: {
                    questions: true,
                },
            },
          },
          orderBy: {
            id: 'asc', // or 'desc' for descending order
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
            enunciados: true,
          },
          orderBy: {
            id: 'asc', // or 'desc' for descending order
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
    }
   });
}

export async function getEnunciados(slug: string) {
  return await db.enunciados.findFirst({ 
    where: {
      slug,
    },
    include: {
      questions: true,
    }
   });
 }