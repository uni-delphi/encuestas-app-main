import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { getAllEncuestasInfo } from "@/lib/actions";
import { surveyHasEnded } from "@/utils/date-formatter";

export default async function FinishOrClose() {
  
  const encuestas: any = await getAllEncuestasInfo();
  const { hasEnded, endDate, isActive } = encuestas[0];

  return surveyHasEnded({ endDate, isActive, hasEnded }) ? (
    <>
      <div className="w-full md:max-w-[80%] md:mx-auto mt-14">
        <p className="pb-4 mb-4 text-justify md:text-center">
          El cuestionario se encuentra cerrado y no se podrán sumar ni modificar
          respuestas. Puedes informarte más sobre los resultados o los avances
          haciendo click en el siguiente botón.
        </p>
      </div>
      <div className="flex justify-center gap-5">
        <Link
          target="_blank"
          href={`https://campusnorte.unc.edu.ar/prospectiva-tecnologica-ocupacional/agrobioindustria-alimentaria/`}
          className="hover:text-blue-600 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-blue-600 text-white md:mx-10 hover:bg-gray-200 my-4"
        >
          Ver más del estudio
        </Link>
      </div>
    </>
  ) : (
    <>
      <div className="w-full md:max-w-[80%] md:mx-auto mt-14">
        <p className="pb-4 mb-4 text-justify md:text-center">
          Te recordamos que hasta el 26 de julio puedes volver a ingresar al
          estudio y modificar o ampliar la información según consideres.
        </p>
        <p className="pb-4 mb-4 text-justify md:text-center">
          Al finalizar la investigacion compartiremos por mail el resultado
          final. Tambien lo invitamos a estar atentos a los avances en nuestra
          pagina web
        </p>
        <p className="pb-4 mb-4 text-justify md:text-center">
          Tambien lo invitamos a estar atentos a los avances en nuestra pagina
          web
        </p>
      </div>
      <div className="flex justify-center gap-5">
        <Link
          href="/estado"
          className="hover:text-blue-600 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-blue-600 text-white md:mx-10 hover:bg-gray-200 my-4"
        >
          Ver mis respuestas
        </Link>
        <Link
          target="_blank"
          href={`https://campusnorte.unc.edu.ar/prospectiva-tecnologica-ocupacional/agrobioindustria-alimentaria/`}
          className="hover:text-blue-600 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-white text-blue-600 md:mx-10 hover:bg-gray-200 my-4 border"
        >
          Ver más del estudio
        </Link>
      </div>
    </>
  );
}
