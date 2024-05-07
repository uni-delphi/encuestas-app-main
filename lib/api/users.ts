import { db } from "../prisma";

export async function getAllUsers() { 
  return await db.user.findMany({
    select: {
      email: true,
    },
    where: {
      role: "USER",
    }
  });
}

export async function getUserByEmail(email: string) {
  return await db.user.findUnique({
    where: {
      email,
    },
  });
}

export async function getUserById(userId: string) {
  return await db.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  });
}

export async function createUser(data: any) {
  return await db.user.create({ data });
}

export async function logInUser(data: any) {
  return await db.user.findUnique({ where: { email: data.email } });
}

export async function updateUser(data: any, email: string) {
  const { id } : any = await getUserByEmail(email as string);
  return await db.user.update({
    where: {
      id,
    },
    data,
  });
}
