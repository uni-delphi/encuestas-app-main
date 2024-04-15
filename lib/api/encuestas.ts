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
