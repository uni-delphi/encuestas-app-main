import { db } from "../prisma";

export async function getAllRespuestasByEnunciado(id: number) {
  return await db.response.findMany({
    where: { enunciadosId: id },
    include: {
      singleChoice: true,
      checkbox: true
    },
    orderBy: {
      id: 'asc', 
    },
  });
}
