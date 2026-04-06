import { prisma } from "../prisma";

export async function getAllUsers() { 
  return await prisma.user.findMany({
    select: {
      email: true,
    },
    where: {
      role: "USER",
    }
  });
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function getUserById(userId: string) {
  return await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  });
}

export async function createUser(data: any) {
  return await prisma.user.create({ data });
}

export async function logInUser(data: any) {
  return await prisma.user.findUnique({ where: { email: data.email } });
}

export async function updateUser(data: any, email: string) {
  const { id } : any = await getUserByEmail(email as string);
  return await prisma.user.update({
    where: {
      id,
    },
    data,
  });
}
