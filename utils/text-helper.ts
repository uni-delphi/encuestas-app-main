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
  responses: number,
  enunciados: { response: IRESPONSES[]; questions: IQUESTION[] }[]
): number => {
  let questionsLength = 0;
  enunciados.forEach(
    (enunciado: { response: IRESPONSES[]; questions: IQUESTION[] }) =>
      (questionsLength = enunciado.questions.length)
  );
  return +((responses * 100) / (enunciados.length * questionsLength)).toFixed(
    2
  );
};
