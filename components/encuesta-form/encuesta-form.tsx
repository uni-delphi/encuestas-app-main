import React from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import QuestionCheckboxField from "../question-checkbox-field/question-checkbox-field";
import QuestionRadioField from "../question-radio-field/question-radio-field";
import { getAllRespuestasByEnunciado, getExampleResponses } from "@/lib/actions";
import { User } from "next-auth";
import { IDATATYPE, IENUNCIADO, IQUESTION } from "@/types/encuestas";

const data: IDATATYPE = {
  NIVEL: {
    order: "a",
    answers: [
      {
        id: "alto",
        name: "Alto",
      },
      {
        id: "medioAlto",
        name: "Medio alto",
      },
      {
        id: "medioBajo",
        name: "Medio bajo",
      },
      {
        id: "bajo",
        name: "Bajo",
      },
      {
        id: "ninguno",
        name: "Ninguno",
      },
    ],
  },
  IMPORTANCIA: {
    order: "b",
    answers: [
      {
        id: "muyAlto",
        name: "Muy Alto",
      },
      {
        id: "alto",
        name: "Alto",
      },
      {
        id: "medioAlto",
        name: "Medio alto",
      },
      {
        id: "medioBajo",
        name: "Medio bajo",
      },
      {
        id: "bajo",
        name: "Bajo",
      },
      {
        id: "muyBajo",
        name: "Muy Bajo",
      },
      {
        id: "irrelevante",
        name: "Irrelevante",
      },
    ],
  },
  DIFUSION: {
    order: "c",
    answers: [
      {
        id: "12Meses",
        name: "12 Meses",
      },
      {
        id: "3Años",
        name: "3 Años",
      },
      {
        id: "5Años",
        name: "5 Años",
      },
      {
        id: "7Años",
        name: "7 Años",
      },
      {
        id: "10Años",
        name: "10 Años",
      },
    ],
  },
  ACELERAN: {
    order: "d",
    answers: [
      {
        id: "social",
        name: "Social",
      },
      {
        id: "tecnológica",
        name: "Tecnológica",
      },
      {
        id: "económica",
        name: "Económica",
      },
      {
        id: "ambiental",
        name: "Ambiental",
      },
      {
        id: "política",
        name: "Política",
      },
      {
        id: "cultural",
        name: "Cultural",
      },
    ],
  },
  FRENAN: {
    order: "e",
    answers: [
      {
        id: "social",
        name: "Social",
      },
      {
        id: "tecnológica",
        name: "Tecnológica",
      },
      {
        id: "económica",
        name: "Económica",
      },
      {
        id: "ambiental",
        name: "Ambiental",
      },
      {
        id: "política",
        name: "Política",
      },
      {
        id: "cultural",
        name: "Cultural",
      },
    ],
  },
  IMPACTO: {
    order: "f",
    answers: [
      {
        id: "social",
        name: "Social",
      },
      {
        id: "tecnológica",
        name: "Tecnológica",
      },
      {
        id: "económica",
        name: "Económica",
      },
      {
        id: "ambiental",
        name: "Ambiental",
      },
      {
        id: "política",
        name: "Política",
      },
      {
        id: "cultural",
        name: "Cultural",
      },
    ],
  },
};

export default async function EncuestaForm({
  enunciado,
  user,
}: {
  enunciado: IENUNCIADO;
  user: User;
}) {
  const respuestas = await getAllRespuestasByEnunciado(enunciado.id, user.id);
  const singleChoice = respuestas.filter(respuest => respuest.responseType === "SINGLE_CHOICE");
  const checkbox = respuestas.filter(respuest => respuest.responseType === "CHECKBOX");

  const { questions, ...props } = enunciado;

  return (
    <>
      {questions &&
        questions.map((question: IQUESTION) =>
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
          )
        )}
      <div className="flex justify-center items-center gap-2 p-4">
        <Link href="/estado" >
          Ver avance
        </Link>

        <Button>Siguiente</Button>
      </div>
    </>
  );
}
