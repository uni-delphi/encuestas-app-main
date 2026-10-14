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

type QuestionLink = {
  questionId: number;
  isActive: boolean;
};

type EnunciadoIn = {
  id: number;
  questionsEnunciados: QuestionLink[];
};

type TecnologiaIn = {
  id: number;
  enunciados: EnunciadoIn[];
};

type MyResponse = {
  enunciadosId: number;
  questionId: number;
};

export type Progress = {
  total: number;
  answered: number;
  percent: number;
};

export type EnunciadoProgress = Progress & {
  enunciadoId: number;
  pendingQuestionIds: number[];
};

export type TecnologiaProgress = Progress & {
  tecnologiaId: number;
  enunciados: EnunciadoProgress[];
};

export type SurveyProgress = Progress & {
  tecnologias: TecnologiaProgress[];
};

const toPercent = (answered: number, total: number) =>
  total === 0 ? 0 : +((answered * 100) / total).toFixed(2);

export function getSurveyProgress(
  tecnologias: TecnologiaIn[],
  myResponses: MyResponse[]
): SurveyProgress {
  // Clave única: la misma que el @@unique del schema (sin respondentId)
  const answeredSet = new Set(
    myResponses.map((r) => `${r.enunciadosId}-${r.questionId}`)
  );

  const tecnologiasProgress: TecnologiaProgress[] = tecnologias.map((tec) => {
    const enunciados: EnunciadoProgress[] = (tec.enunciados ?? []).map((e) => {
      const activeQuestions = (e.questionsEnunciados ?? []).filter(
        (q) => q.isActive
      );
      const pendingQuestionIds = activeQuestions
        .filter((q) => !answeredSet.has(`${e.id}-${q.questionId}`))
        .map((q) => q.questionId);

      const total = activeQuestions.length;
      const answered = total - pendingQuestionIds.length;

      return {
        enunciadoId: e.id,
        total,
        answered,
        percent: toPercent(answered, total),
        pendingQuestionIds,
      };
    });

    const total = enunciados.reduce((acc, e) => acc + e.total, 0);
    const answered = enunciados.reduce((acc, e) => acc + e.answered, 0);

    return {
      tecnologiaId: tec.id,
      total,
      answered,
      percent: toPercent(answered, total),
      enunciados,
    };
  });

  const total = tecnologiasProgress.reduce((acc, t) => acc + t.total, 0);
  const answered = tecnologiasProgress.reduce((acc, t) => acc + t.answered, 0);

  return {
    total,
    answered,
    percent: toPercent(answered, total),
    tecnologias: tecnologiasProgress,
  };
} 

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