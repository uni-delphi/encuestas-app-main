import React from "react";
import { User } from "next-auth";
import Link from "next/link";

import { getSampleRespuestasByEnunciado } from "@/lib/actions";
import { IDATATYPE, IENUNCIADO, IQUESTION } from "@/types/encuestas";

import { Button } from "@/components/ui/button";
import QuestionCheckboxField from "@/components/question-checkbox-field/question-checkbox-field";
import QuestionRadioField from "@/components/question-radio-field/question-radio-field";

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
  const singleChoice = await getSampleRespuestasByEnunciado(enunciado.id, user.id, "SINGLE_CHOICE");
  const checkbox = await getSampleRespuestasByEnunciado(enunciado.id, user.id, "CHECKBOX");

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
      <div className="flex justify-center items-center gap-5 p-4">
        <Link href="/estado" >
          Ver avance
        </Link>

        <Button className="bg-blue-600 text-white md:mx-10 hover:bg-gray-200 hover:text-blue-600">Siguiente</Button>
      </div>
    </>
  );
}
