import { User } from "next-auth";
import { getSampleRespuestasByEnunciado } from "@/lib/actions";

import QuestionCheckboxField from "@/components/question-checkbox-field/question-checkbox-field";
import QuestionRadioField from "@/components/question-radio-field/question-radio-field";
import { Enunciados, Question, QuestionEnunciado } from "@/generated/prisma";
import { data } from "@/lib/constants";

export default async function EncuestaForm({
  enunciado,
  user,
}: {
  enunciado: Enunciados & { questionsEnunciados: QuestionEnunciado & { questions: Question[] } };
  user: User;
}) {
  const { questions, ...props }: any = enunciado;

  const visibleQuestions: any[] = (questions ?? []).filter(
    (q: any) => q.isVisibleInEnunciado !== false,
  );

  const samples = await Promise.all(
    visibleQuestions.map(async (q) => {
      const sample = await getSampleRespuestasByEnunciado(
        enunciado.id,
        q.id,
        user.id,
        q.type,
      );
      return [q.id, sample] as const;
    }),
  );
  const samplesByQuestion = new Map(samples);

   return (
    <>
      {visibleQuestions.map((question) =>
        question.type === "SINGLE_CHOICE" ? (
          <QuestionRadioField
            key={question.id}
            data={data[question.inputType!]}
            values={question}
            enunciadoData={props}
            user={user}
            singleChoiceResponse={samplesByQuestion.get(question.id) ?? []}
          />
        ) : (
          <QuestionCheckboxField
            key={question.id}
            data={data[question.inputType!]}
            values={question}
            enunciadoData={props}
            user={user}
            checkboxResponse={samplesByQuestion.get(question.id) ?? []}
          />
        ),
      )}
    </>
  );
}
