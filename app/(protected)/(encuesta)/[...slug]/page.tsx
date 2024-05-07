import { authOptions } from "@/auth.config";
import { Session, User, getServerSession } from "next-auth";
import { getAllEncuestas, getEnunciado } from "@/lib/actions";
import EncuestaForm from "@/components/encuesta-form/encuesta-form";
import NavBar from "@/components/nav-bar/nav-bar";

import { redirect } from "next/navigation";
import { IENUNCIADO } from "@/types/encuestas";
import { Suspense } from "react";
import { surveyHasEnded } from "@/utils/date-formatter";

interface IDATA {
  id: number;
  title: string;
  description: string;
  aceleran: IQUESTIONCHECKBOX;
  frenan: IQUESTIONCHECKBOX;
  impacto: IQUESTIONCHECKBOX;
  nivel: IQUESTIONRADIO;
  importancia: IQUESTIONRADIO;
  difusion: IQUESTIONRADIO;
}
interface IQUESTIONCHECKBOX {
  statement?: string;
  question_number: string;
  answers: { id: string; label: string }[];
}

interface IQUESTIONRADIO {
  statement?: string;
  question_number: string;
  answers: { id: string; name: string }[];
}

// const data: IDATA[] = [
//   {
//     id: 1,
//     title: "Impresoras 3D",
//     description:
//       "Uso y aplicación de tecnologías 3D en producción y mantenimiento de repuestos o componentes.",
//     aceleran: {
//       statement:
//         "Principales factores que aceleran la adopción de la tecnología",
//       question_number: "1.d",
//       answers: [
//         {
//           id: "social",
//           label: "Social",
//         },
//         {
//           id: "tecnológica",
//           label: "Tecnológica",
//         },
//         {
//           id: "económica",
//           label: "Económica",
//         },
//         {
//           id: "ambiental",
//           label: "Ambiental",
//         },
//         {
//           id: "política",
//           label: "Política",
//         },
//         {
//           id: "cultural",
//           label: "Cultural",
//         },
//       ],
//     },
//     frenan: {
//       statement: "Principales factores que frenan la adopción de la tecnología",
//       question_number: "1.e",
//       answers: [
//         {
//           id: "social",
//           label: "Social",
//         },
//         {
//           id: "tecnológica",
//           label: "Tecnológica",
//         },
//         {
//           id: "económica",
//           label: "Económica",
//         },
//         {
//           id: "ambiental",
//           label: "Ambiental",
//         },
//         {
//           id: "política",
//           label: "Política",
//         },
//         {
//           id: "cultural",
//           label: "Cultural",
//         },
//       ],
//     },
//     impacto: {
//       statement: "Mayor impacto de la tecnología",
//       question_number: "1.f",
//       answers: [
//         {
//           id: "social",
//           label: "Social",
//         },
//         {
//           id: "tecnológica",
//           label: "Tecnológica",
//         },
//         {
//           id: "económica",
//           label: "Económica",
//         },
//         {
//           id: "ambiental",
//           label: "Ambiental",
//         },
//         {
//           id: "política",
//           label: "Política",
//         },
//         {
//           id: "cultural",
//           label: "Cultural",
//         },
//       ],
//     },
//     nivel: {
//       statement:
//         "Nivel de conocimiento y/o experiencia sobre la tecnología en cuestión",
//       question_number: "1.a",
//       answers: [
//         {
//           id: "alto",
//           name: "Alto",
//         },
//         {
//           id: "medioAlto",
//           name: "Medio alto",
//         },
//         {
//           id: "medioBajo",
//           name: "Medio bajo",
//         },
//         {
//           id: "bajo",
//           name: "Bajo",
//         },
//         {
//           id: "ninguno",
//           name: "Ninguno",
//         },
//       ],
//     },
//     importancia: {
//       statement:
//         "Importancia de esa tecnología para el desarrollo del sector de maquinaria agrícola de la provincia de Córdoba",
//       question_number: "1.b",
//       answers: [
//         {
//           id: "alto",
//           name: "Alto",
//         },
//         {
//           id: "medioAlto",
//           name: "Medio alto",
//         },
//         {
//           id: "medioBajo",
//           name: "Medio bajo",
//         },
//         {
//           id: "bajo",
//           name: "Bajo",
//         },
//         {
//           id: "ninguno",
//           name: "Ninguno",
//         },
//       ],
//     },
//     difusion: {
//       statement:
//         "Tasa de difusión de esa tecnología en la provincia de Córdoba",
//       question_number: "1.c",
//       answers: [
//         {
//           id: "alto",
//           name: "Alto",
//         },
//         {
//           id: "medioAlto",
//           name: "Medio alto",
//         },
//         {
//           id: "medioBajo",
//           name: "Medio bajo",
//         },
//         {
//           id: "bajo",
//           name: "Bajo",
//         },
//         {
//           id: "ninguno",
//           name: "Ninguno",
//         },
//       ],
//     },
//   },
//   {
//     id: 2,
//     title: "Vehículos autónomos",
//     description:
//       "Uso de sistemas automatizados para el manejo autónomo de vehículos e intercomunicación entre los mismos",
//     aceleran: {
//       statement:
//         "Principales factores que aceleran la adopción de la tecnología",
//       question_number: "1.d",
//       answers: [
//         {
//           id: "social",
//           label: "Social",
//         },
//         {
//           id: "tecnológica",
//           label: "Tecnológica",
//         },
//         {
//           id: "económica",
//           label: "Económica",
//         },
//         {
//           id: "ambiental",
//           label: "Ambiental",
//         },
//         {
//           id: "política",
//           label: "Política",
//         },
//         {
//           id: "cultural",
//           label: "Cultural",
//         },
//       ],
//     },
//     frenan: {
//       statement: "Principales factores que frenan la adopción de la tecnología",
//       question_number: "1.e",
//       answers: [
//         {
//           id: "social",
//           label: "Social",
//         },
//         {
//           id: "tecnológica",
//           label: "Tecnológica",
//         },
//         {
//           id: "económica",
//           label: "Económica",
//         },
//         {
//           id: "ambiental",
//           label: "Ambiental",
//         },
//         {
//           id: "política",
//           label: "Política",
//         },
//         {
//           id: "cultural",
//           label: "Cultural",
//         },
//       ],
//     },
//     impacto: {
//       statement: "Mayor impacto de la tecnología",
//       question_number: "1.f",
//       answers: [
//         {
//           id: "social",
//           label: "Social",
//         },
//         {
//           id: "tecnológica",
//           label: "Tecnológica",
//         },
//         {
//           id: "económica",
//           label: "Económica",
//         },
//         {
//           id: "ambiental",
//           label: "Ambiental",
//         },
//         {
//           id: "política",
//           label: "Política",
//         },
//         {
//           id: "cultural",
//           label: "Cultural",
//         },
//       ],
//     },
//     nivel: {
//       statement:
//         "Nivel de conocimiento y/o experiencia sobre la tecnología en cuestión",
//       question_number: "1.a",
//       answers: [
//         {
//           id: "alto",
//           name: "Alto",
//         },
//         {
//           id: "medioAlto",
//           name: "Medio alto",
//         },
//         {
//           id: "medioBajo",
//           name: "Medio bajo",
//         },
//         {
//           id: "bajo",
//           name: "Bajo",
//         },
//         {
//           id: "ninguno",
//           name: "Ninguno",
//         },
//       ],
//     },
//     importancia: {
//       statement:
//         "Importancia de esa tecnología para el desarrollo del sector de maquinaria agrícola de la provincia de Córdoba",
//       question_number: "1.b",
//       answers: [
//         {
//           id: "alto",
//           name: "Alto",
//         },
//         {
//           id: "medioAlto",
//           name: "Medio alto",
//         },
//         {
//           id: "medioBajo",
//           name: "Medio bajo",
//         },
//         {
//           id: "bajo",
//           name: "Bajo",
//         },
//         {
//           id: "ninguno",
//           name: "Ninguno",
//         },
//       ],
//     },
//     difusion: {
//       statement:
//         "Tasa de difusión de esa tecnología en la provincia de Córdoba",
//       question_number: "1.c",
//       answers: [
//         {
//           id: "alto",
//           name: "Alto",
//         },
//         {
//           id: "medioAlto",
//           name: "Medio alto",
//         },
//         {
//           id: "medioBajo",
//           name: "Medio bajo",
//         },
//         {
//           id: "bajo",
//           name: "Bajo",
//         },
//         {
//           id: "ninguno",
//           name: "Ninguno",
//         },
//       ],
//     },
//   },
// ];

export default async function Encuestas({
  params,
}: {
  params: { slug: string[] };
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");

  const { user } = session;
  const [techTitle, enunciadoTitle] = params.slug;
  let emptyEnunciadoSlug: string = "";
  let emptyEnunciadoId: number = 0;

  const encuestas: any = await getAllEncuestas(session.user.id);
  const { hasEnded, endDate, isActive } = encuestas[0];
  
  if(surveyHasEnded({ endDate, isActive, hasEnded })) {
    redirect("/finalizado")
  }

  const techElegida = encuestas[0]?.tecnologias.find(
    (data: any) => data.slug === techTitle
  );

  if (!techElegida) redirect("/estado");

  const enunciadoElegido = techElegida.enunciados.find(
    (data: any) => data.slug === enunciadoTitle
  );

  if (!enunciadoElegido) {
    emptyEnunciadoSlug = techElegida.enunciados[0].slug;
    emptyEnunciadoId = techElegida.enunciados[0].id;
  }

  const enunciados = await getEnunciado({
    dataSlug: enunciadoElegido?.slug ?? emptyEnunciadoSlug,
    dataUserId: session?.user.id,
    dataEnunciadoId: enunciadoElegido?.id ?? emptyEnunciadoId,
  });

  return (
    <main className="">
      <NavBar
        encuesta={encuestas}
        title={techElegida?.title as string}
        session={session as Session}
        user={user as User}
      />

      <div className="py-5 overflow-hidden">
        <div className="shadow-lg border-b-4 border-gray-300">
          <h2 className="pt-20 mt-5 pb-2 text-center text-xl font-bold">
            {enunciadoElegido?.title ?? techElegida.enunciados[0].title}
          </h2>
        </div>
        <Suspense
          fallback={Array(6)
            .fill(0)
            .map((el, index) => (
              <div key={index} className="max-w-[80%] mx-auto">
                <div className="flex flex-row bg-white items-center gap-2 p-2">
                  <div className="flex flex-col gap-2 w-9/12 h-[8rem]">
                    <span className="w-11/12 bg-gray-300 h-4 rounded-full animate-pulse"></span>
                    <span className="w-9/12 bg-gray-300 h-4 rounded-full animate-pulse"></span>
                    <span className="w-9/12 bg-gray-300 h-4 rounded-full animate-pulse"></span>
                    <span className="w-9/12 bg-gray-300 h-4 rounded-full animate-pulse"></span>
                    <span className="w-9/12 bg-gray-300 h-4 rounded-full animate-pulse"></span>
                  </div>
                  <div className="flex flex-col gap-2 w-9/12 h-[8rem]">
                    <span className="w-9/12 bg-gray-300 h-4 rounded-full animate-pulse"></span>
                    <span className="w-11/12 border border-input rounded-md h-[6rem] rounded-4 animate-pulse"></span>
                  </div>
                  <div className="flex flex-col gap-2 w-9/12 h-[8rem]">
                    <span className="w-9/12 bg-gray-300 h-4 rounded-full animate-pulse"></span>
                    <span className="w-11/12 bg-gray-300 h-[8rem] rounded-4 animate-pulse"></span>
                  </div>
                </div>
              </div>
            ))}
        >
          <EncuestaForm
            enunciado={enunciados as IENUNCIADO}
            user={user as User}
          />
        </Suspense>
      </div>
    </main>
  );
}
