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
  ACELERAN: {
    order: "c",
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
  IMPACTO: {
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
  DIFUSION_2024:{
    order: "f",
    answers: [
      {
        id: "hasta30",
        name: "Baja (hasta 30%)",
      },
      {
        id: "hasta50",
        name: "Media (hasta 50%)",
      },
      {
        id: "hasta70",
        name: "Alta (hasta 70%)",
      }
    ],
  },
  DIFUSION_2027:{
    order: "g",
    answers: [
      {
        id: "hasta30",
        name: "Baja (hasta 30%)",
      },
      {
        id: "hasta50",
        name: "Media (hasta 50%)",
      },
      {
        id: "hasta70",
        name: "Alta (hasta 70%)",
      }
    ],
  },
  DIFUSION_2030:{
    order: "h",
    answers: [
      {
        id: "hasta30",
        name: "Baja (hasta 30%)",
      },
      {
        id: "hasta50",
        name: "Media (hasta 50%)",
      },
      {
        id: "hasta70",
        name: "Alta (hasta 70%)",
      }
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
  const singleChoice = await getSampleRespuestasByEnunciado(
    enunciado.id,
    user.id,
    "SINGLE_CHOICE"
  );
  const checkbox = await getSampleRespuestasByEnunciado(
    enunciado.id,
    user.id,
    "CHECKBOX"
  );

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
      
    </>
  );
}
