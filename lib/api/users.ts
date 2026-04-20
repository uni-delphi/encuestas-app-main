import { prisma } from "../prisma";

export async function getAllUsersActions(page = 0, pageSize = 10) {
  const [usuarios, total] = await Promise.all([
    prisma.user.findMany({
      skip: page * pageSize,
      take: pageSize,
      select: {
        email: true,
        name: true,
        lastName: true,
        role: true,
      },
      where: {
        NOT: {
          role: "ADMIN",
        },
      },
    }),
    prisma.user.count(),
  ]);
  return { usuarios: usuarios, total, pageCount: Math.ceil(total / pageSize) };
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
  const { id }: any = await getUserByEmail(email as string);
  return await prisma.user.update({
    where: {
      id,
    },
    data,
  });
}
