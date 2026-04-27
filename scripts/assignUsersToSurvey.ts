// scripts/assignUsersToSurvey.ts
import { prisma } from "@/lib/prisma";

async function main() {
  const surveyId = 2;

  const users = await prisma.user.findMany({
    where: { role: "USER" },
    select: { id: true },
  });

  if (users.length === 0) {
    console.log("No hay usuarios con rol USER");
    return;
  }

  const result = await prisma.survey.update({
    where: { id: surveyId },
    data: {
      assignedUsers: {
        connect: users.map((u) => ({ id: u.id })),
      },
    },
  });

  console.log(`✅ ${users.length} usuarios asignados al survey ${result.id}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());