import { IENUNCIADO, IQUESTION, IRESPONSES } from "@/types/encuestas";

export const formatTitleToSlug = (title: string) => title.replace(" ", "-");

export const makeTitle = (slug: string) => {
  let words = slug.split("-");

  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    words[i] = word.charAt(0).toUpperCase() + word.slice(1);
  }

  return words.join(" ");
};

export const calculateResponsesPercents = (
  enunciados: { response: any[]; _count: { questionsEnunciados: number } }[]
): number => {
  const totalQuestions = enunciados.reduce(
    (acc, enunciado) => acc + enunciado._count.questionsEnunciados,
    0
  );
  const totalResponses = enunciados.reduce(
    (acc, enunciado) => acc + enunciado.response.length,
    0
  );

  if (totalQuestions === 0) return 0;

  return +((totalResponses * 100) / totalQuestions).toFixed(2);
};

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, "") // Solo letras, numeros, espacios y guiones
    .trim()
    .replace(/\s+/g, "-") // Espacios a guiones
    .replace(/-+/g, "-"); // Multiples guiones a uno solo
}