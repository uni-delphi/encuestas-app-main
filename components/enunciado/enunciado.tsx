
import { IENUNCIADO } from "@/types/encuestas";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface IComponentProps {
  color: string;
  text: string;
  buttonText: string;
}

const COMPLETION_LEVELS: { [key: string]: IComponentProps } = {
  empty: {
    color: "bg-[#EAEAEA]",
    text: "Por Empezar",
    buttonText: "Responder",
  },
  partial: {
    color: "bg-[#FFFFBF]",
    text: "Casi Listo",
    buttonText: "Ampliar",
  },
  complete: {
    color: "bg-[#CCE8D4]",
    text: "Completa",
    buttonText: "Editar",
  },
};

const levelOfCompletion = (responses: number | undefined): IComponentProps => {
  if (!responses || responses === 0) return COMPLETION_LEVELS.empty;
  if (responses >= 8) return COMPLETION_LEVELS.complete;
  return COMPLETION_LEVELS.partial;
};

export default function Enunciado({
  tecnologia,
  enunciado,
}: {
  tecnologia: any;
  enunciado: IENUNCIADO;
}) {
  //console.log("🚀 ~ Enunciado ~ enunciado:", enunciado.response)
  const index = enunciado.response?.length ?? 0;
  const level = levelOfCompletion(index);
//agregar en la prop de enunciado el numero de respuestas para cada pregunta, en base a la cantidad de preguntas que tiene el enunciado.
  return (
    <div
      className={cn(
        level.color,
        "shadow-md rounded-lg px-4 py-2 flex flex-col md:flex-row cols-12 items-center mb-2",
      )}
    >
      <p className="text-gray-800 font-semibold text-left py-2 md:py-0 flex-auto w-full md:w-1/3">
        {level.text}
      </p>
      <p className="text-gray-600 text-sm text-left flex-auto py-2 md:py-0 w-full md:w-1/3">
        {enunciado.title}
      </p>
      <div className="flex-auto w-full py-2 md:py-0 md:w-1/3 text-right">
        <Link
          href={`/${tecnologia.slug}/${enunciado.slug}`}
          className="bg-blue-500 hover:bg-gray-200 hover:text-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          {level.buttonText}
        </Link>
      </div>
    </div>
  );
}
