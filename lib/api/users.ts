import { prisma } from "../prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { RoleType } from "@/generated/prisma";
import { hasRole } from "@/lib/permissions";

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

export async function getAllUsersAssignedToMySurveysAction(
  page = 0,
  pageSize = 10,
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("No autenticado");

  const { id: userId, role } = session.user;

  if (!hasRole(role, RoleType.RESEARCHER)) throw new Error("Sin permisos");

  // Primero obtenemos los IDs de surveys creados por este usuario
  const mySurveys = await prisma.survey.findMany({
    where: { createdById: userId },
    select: { id: true },
  });
  
  // Si no tiene surveys, devolvemos vacío directamente
  if (mySurveys.length === 0) {
    return { usuarios: [], total: 0, pageCount: 0 };
  }

  const surveyIds = mySurveys.map((s) => s.id);
  const where = {
    assignedSurveys: {
      some: { id: { in: surveyIds } },
    },
  };

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
      where,
    }),
    prisma.user.count({ where }),
  ]);

  return { usuarios, total, pageCount: Math.ceil(total / pageSize) };
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
