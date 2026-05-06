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
  enunciado: Enunciados;
  user: User;
}) {
  const singleChoice = await getSampleRespuestasByEnunciado(
    enunciado.id,
    user.id,
    "SINGLE_CHOICE",
  );
  const checkbox = await getSampleRespuestasByEnunciado(
    enunciado.id,
    user.id,
    "CHECKBOX",
  );

  const { questions, ...props }: any = enunciado;

  return (
    <>
      {questions &&
        questions.filter((question: any) => question.isVisibleInEnunciado !== false).map((question: any) =>
          question.type === "SINGLE_CHOICE" ? (
            <QuestionRadioField
              key={question.id}
              data={data[question.inputType]}
              values={question}
              enunciadoData={props}
              user={user}
              singleChoiceResponse={singleChoice}
            />
          ) : (
            <QuestionCheckboxField
              key={question.id}
              data={data[question.inputType]}
              values={question}
              enunciadoData={props}
              user={user}
              checkboxResponse={checkbox}
            />
          ),
        )}
    </>
  );
}
