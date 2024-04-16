import { makeTitle } from "@/utils/text-helper";
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

export async function getTecnologia(encuestaTitle: string) {
  const title = makeTitle(encuestaTitle)
  console.log("🚀 ~ getTecnologia ~ title:", title)
  return await db.tecnologias.findFirst({ 
    where: {
      title,
    },
    include: {
      enunciados: true,
    }
   });
}
