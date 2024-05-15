import React from "react";
import { IENUNCIADO } from "@/types/encuestas";
import Link from "next/link";

interface IComponentProps {
  color: string;
  text: string;
  buttonText: string;
}

const levelOfCompletion = (responses: number | undefined) => {
  const resp: { [key: number]: IComponentProps } = {
    0: {
      color: "bg-[#EAEAEA]",
      text: "Por Empezar",
      buttonText: "Responder",
    },
    1: { color: "bg-[#FFFFBF]", text: "Casi Listo", buttonText: "Ampliar" },
    2: { color: "bg-[#FFFFBF]", text: "Casi Listo", buttonText: "Ampliar" },
    3: { color: "bg-[#FFFFBF]", text: "Casi Listo", buttonText: "Ampliar" },
    4: { color: "bg-[#FFFFBF]", text: "Casi Listo", buttonText: "Ampliar" },
    5: { color: "bg-[#FFFFBF]", text: "Casi Listo", buttonText: "Ampliar" },
    6: { color: "bg-[#FFFFBF]", text: "Casi Listo", buttonText: "Ampliar" },
    7: { color: "bg-[#FFFFBF]", text: "Casi Listo", buttonText: "Ampliar" },
    8: {
      color: "bg-[#CCE8D4]",
      text: "Completa",
      buttonText: "Editar",
    },
    9: {
      color: "bg-[#CCE8D4]",
      text: "Completa",
      buttonText: "Editar",
    },
  };

  return resp[responses || 0];
};

export default function Enunciado({
  tecnologia,
  enunciado,
}: {
  tecnologia: any;
  enunciado: IENUNCIADO;
}) {
  
  return (
    <div
      className={`${
        levelOfCompletion(enunciado.response?.length).color
      } shadow-md rounded-lg px-4 py-2 flex flex-col md:flex-row cols-12 items-center mb-2`}
    >
      <p className="text-gray-800 font-semibold text-left py-2 md:py-0 flex-auto w-full md:w-1/3">
        {levelOfCompletion(enunciado.response?.length).text}
      </p>
      <p className="text-gray-600 text-sm text-left flex-auto py-2 md:py-0 w-full md:w-1/3">
        {enunciado.title}
      </p>
      <div className="flex-auto w-full py-2 md:py-0 md:w-1/3 text-right">
        <Link
          href={`/${tecnologia.slug}/${enunciado.slug}`}
          className="bg-blue-500 hover:bg-gray-200 hover:text-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          {levelOfCompletion(enunciado.response?.length).buttonText}
        </Link>
      </div>
    </div>
  );
}
