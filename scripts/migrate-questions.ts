// scripts/migrate-questions.ts
import { prisma } from "@/lib/prisma";

async function main() {
  console.log("🔍 Verificando datos existentes...");

  const oldRelations = await prisma.$queryRaw<{ A: number; B: number }[]>`
    SELECT "A", "B" FROM "_EnunciadosToQuestion"
  `;

  console.log(`📊 Relaciones encontradas en _EnunciadosToQuestion: ${oldRelations.length}`);

  const existing = await prisma.questionEnunciado.count();
  console.log(`📊 Relaciones existentes en QuestionEnunciado: ${existing}`);

  if (oldRelations.length === 0) {
    console.log("⚠️  No hay datos para migrar.");
    return;
  }

  console.log("🚀 Migrando relaciones...");

  const result = await prisma.questionEnunciado.createMany({
    data: oldRelations.map((r) => ({
      enunciadoId: r.A,
      questionId: r.B,
    })),
    skipDuplicates: true,
  });

  console.log(`✅ Migradas: ${result.count} relaciones`);

  const final = await prisma.questionEnunciado.count();
  console.log(`📊 Total en QuestionEnunciado ahora: ${final}`);

  if (final === oldRelations.length) {
    console.log("✅ Migración exitosa. Podés correr: npx prisma db push --accept-data-loss");
  } else {
    console.log("⚠️  Los conteos no coinciden, revisá antes de hacer el push.");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());