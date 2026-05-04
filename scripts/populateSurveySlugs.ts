// scripts/populate-survey-slugs.ts
import { prisma } from "@/lib/prisma";

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFD")                        // descompone acentos
    .replace(/[\u0300-\u036f]/g, "")         // elimina diacríticos (á→a)
    .replace(/[^a-z0-9\s-]/g, "")           // elimina caracteres especiales
    .trim()
    .replace(/\s+/g, "-")                    // espacios → guiones
    .replace(/-+/g, "-");                    // guiones múltiples → uno

  return `${base}`;                    // sufijo con id para garantizar unicidad
}

async function main() {
  const surveys = await prisma.survey.findMany({
    select: { id: true, title: true, slug: true },
  });

  console.log(`📋 Encuestas encontradas: ${surveys.length}`);

  let updated = 0;
  let skipped = 0;

  for (const survey of surveys) {
    if (survey.slug) {
      console.log(`⏭️  Saltando Survey #${survey.id} — ya tiene slug: "${survey.slug}"`);
      skipped++;
      continue;
    }

    const slug = generateSlug(survey.title);

    await prisma.survey.update({
      where: { id: survey.id },
      data: { slug },
    });

    console.log(`✅ Survey #${survey.id} → "${slug}"`);
    updated++;
  }

  console.log(`\n🏁 Listo. Actualizados: ${updated} | Saltados: ${skipped}`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());