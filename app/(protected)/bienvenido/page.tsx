import React from "react";
import Image from "next/image";

import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";

import CreateEncuestaButton from "@/components/create-encuesta-button/create-encuesta-button";
import { getAllEncuestasInfo } from "@/lib/actions";
import LayoutDefault from "@/components/image-layout/image-layout";
import { surveyHasEnded } from "@/utils/date-formatter";

export default async function Bienvenido() {
  const session: Session | null = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");

  const encuestas: any = await getAllEncuestasInfo();
  const { hasEnded, endDate, isActive } = encuestas[0];

  if (surveyHasEnded({ endDate, isActive, hasEnded })) {
    redirect("/finalizado");
  }

  const encuestaUrl = `/${encuestas[0]?.tecnologias[0]?.slug}/${encuestas[0]?.tecnologias[0]?.enunciados[0].slug}`;

  return (
    <main>
      <LayoutDefault>
        <h2 className="font-bold text-center my-10 text-2xl ">
          <span className="block line-clamp-2">Estudio de</span>
          <span className="block line-clamp-2">
            Prospectiva tecnológica-ocupacional
          </span>
        </h2>
        <div className="max-w-[80%] mx-auto">
          <p className="pb-4 mb-4">
            Tenemos el agrado de dirigirnos a usted a fin de informarle que
            Campus Norte, UNC, a través de su Dirección de Prospectiva
            Institucional, junto al INTA Córdoba han puesto en marcha{" "}
            <b>
              el estudio de prospectiva tecnológica-ocupacional del sector de la
              agrobioindustria alimentaria de la provincia de Córdoba al 2035.
            </b>
          </p>
          <p className="pb-4 mb-4">
            El estudio se focaliza en construir conocimiento prospectivo sobre
            las demandas de competencias profesionales del sector de la
            agrobioindustria alimentaria, priorizado por Campus Norte de la
            Universidad Nacional de Córdoba en la pluri-temporalidad de 1, 3, 5,
            7 y 10 años, a través del análisis tecnológico e impactos
            ocupacionales de acuerdo con el modelo prospectivo del SENAI-
            Brasil.
          </p>
          <p className="pb-4 mb-4">
            La encuesta Delphi apunta a la exploración y anticipación de
            tecnologías críticas del sector de maquinaria agrícola y sus
            implicancias, actuales y potenciales, en el empleo.
          </p>
          <p className="pb-4 mb-4">
            En este marco, lo invitamos y agradecemos su valiosa participación,
            que será de gran utilidad para priorizar las tecnológicas emergentes
            específicas.
          </p>
          <p className="pb-4 mb-4">
            La encuesta demora unos <b>20 minutos en ser finalizada</b>{" "}
            totalmente y deberá ser completada{" "}
            <b>antes del 26 de julio de 2024</b> (fecha límite) para ser
            incorporada en el procesamiento general y, por ende, en los
            resultados del Estudio.
          </p>
          <p className="pb-4 mb-4">
            <b>
              Solo debe responder aquellas preguntas que considere puede
              contestar en función de sus conocimientos y/o experiencias. Se
              acepta dejar preguntas sin contestar. Siéntase libre de compartir
              las argumentaciones o justificaciones que estime pertinente en
              cada enunciado.
            </b>
          </p>
          <p className="pb-4 mb-4">
            Asimismo, conforme a las previsiones de la Ley 17.622 se garantiza
            el secreto de informante, estableciendo que toda la información
            provista será considera estrictamente confidencial. Los datos serán
            ingresados en una base sin realizar ninguna atribución personal,
            pero los expertos que respondan el cuestionario serán listados como
            participantes (a menos que explícitamente soliciten lo contrario).
          </p>
          <p className="pb-4 mb-4">
            Esperamos contar con sus opiniones, compartiendo los resultados
            finales una vez que el estudio sea publicado. Asimismo, siéntase
            libre de compartir está invitación con otros expertos que pudieran
            estar interesados.
          </p>
          <p className="pb-4 mb-4">
            Nuevamente agradecemos su participación y saludamos a usted con
            nuestra mayor consideración.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row max-w-[80%] mx-auto">
          <div className="w-full lg:w-1/2">
            <p>
              <b>Juan Marcelo CONRERO</b>
              <br />
              Prorrector de Desarrollo Territorial
              <br />
              Responsable de Campus Norte
              <br />
              Universidad Nacional de Córdoba
            </p>
          </div>
          <div className="w-full lg:w-1/2">
            <p>
              <b>Aquiles SALINAS</b>
              <br />
              Director Centro Regional
              <br />
              Córdoba
              <br />
              INTA
            </p>
          </div>
        </div>
        {encuestas[0] && <CreateEncuestaButton url={encuestaUrl} />}
      </LayoutDefault>
    </main>
  );
}
