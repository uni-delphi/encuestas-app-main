import EncuestaForm from "@/components/encuesta-form/encuesta-form";
import NavBar from "@/components/nav-bar/nav-bar";

import { TUser } from "@/types/user";
import { Session } from "next-auth";
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

const data: IDATA[] = [
  {
    id: 1,
    title: "Impresoras 3D",
    description:
      "Uso y aplicación de tecnologías 3D en producción y mantenimiento de repuestos o componentes.",
    aceleran: {
      statement:
        "Principales factores que aceleran la adopción de la tecnología",
      question_number: "1.d",
      answers: [
        {
          id: "social",
          label: "Social",
        },
        {
          id: "tecnológica",
          label: "Tecnológica",
        },
        {
          id: "económica",
          label: "Económica",
        },
        {
          id: "ambiental",
          label: "Ambiental",
        },
        {
          id: "política",
          label: "Política",
        },
        {
          id: "cultural",
          label: "Cultural",
        },
      ],
    },
    frenan: {
      statement: "Principales factores que frenan la adopción de la tecnología",
      question_number: "1.e",
      answers: [
        {
          id: "social",
          label: "Social",
        },
        {
          id: "tecnológica",
          label: "Tecnológica",
        },
        {
          id: "económica",
          label: "Económica",
        },
        {
          id: "ambiental",
          label: "Ambiental",
        },
        {
          id: "política",
          label: "Política",
        },
        {
          id: "cultural",
          label: "Cultural",
        },
      ],
    },
    impacto: {
      statement: "Mayor impacto de la tecnología",
      question_number: "1.f",
      answers: [
        {
          id: "social",
          label: "Social",
        },
        {
          id: "tecnológica",
          label: "Tecnológica",
        },
        {
          id: "económica",
          label: "Económica",
        },
        {
          id: "ambiental",
          label: "Ambiental",
        },
        {
          id: "política",
          label: "Política",
        },
        {
          id: "cultural",
          label: "Cultural",
        },
      ],
    },
    nivel: {
      statement:
        "Nivel de conocimiento y/o experiencia sobre la tecnología en cuestión",
      question_number: "1.a",
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
    importancia: {
      statement:
        "Importancia de esa tecnología para el desarrollo del sector de maquinaria agrícola de la provincia de Córdoba",
      question_number: "1.b",
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
    difusion: {
      statement:
        "Tasa de difusión de esa tecnología en la provincia de Córdoba",
      question_number: "1.c",
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
  },
  {
    id: 2,
    title: "Vehículos autónomos",
    description:
      "Uso de sistemas automatizados para el manejo autónomo de vehículos e intercomunicación entre los mismos",
    aceleran: {
      statement:
        "Principales factores que aceleran la adopción de la tecnología",
      question_number: "1.d",
      answers: [
        {
          id: "social",
          label: "Social",
        },
        {
          id: "tecnológica",
          label: "Tecnológica",
        },
        {
          id: "económica",
          label: "Económica",
        },
        {
          id: "ambiental",
          label: "Ambiental",
        },
        {
          id: "política",
          label: "Política",
        },
        {
          id: "cultural",
          label: "Cultural",
        },
      ],
    },
    frenan: {
      statement: "Principales factores que frenan la adopción de la tecnología",
      question_number: "1.e",
      answers: [
        {
          id: "social",
          label: "Social",
        },
        {
          id: "tecnológica",
          label: "Tecnológica",
        },
        {
          id: "económica",
          label: "Económica",
        },
        {
          id: "ambiental",
          label: "Ambiental",
        },
        {
          id: "política",
          label: "Política",
        },
        {
          id: "cultural",
          label: "Cultural",
        },
      ],
    },
    impacto: {
      statement: "Mayor impacto de la tecnología",
      question_number: "1.f",
      answers: [
        {
          id: "social",
          label: "Social",
        },
        {
          id: "tecnológica",
          label: "Tecnológica",
        },
        {
          id: "económica",
          label: "Económica",
        },
        {
          id: "ambiental",
          label: "Ambiental",
        },
        {
          id: "política",
          label: "Política",
        },
        {
          id: "cultural",
          label: "Cultural",
        },
      ],
    },
    nivel: {
      statement:
        "Nivel de conocimiento y/o experiencia sobre la tecnología en cuestión",
      question_number: "1.a",
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
    importancia: {
      statement:
        "Importancia de esa tecnología para el desarrollo del sector de maquinaria agrícola de la provincia de Córdoba",
      question_number: "1.b",
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
    difusion: {
      statement:
        "Tasa de difusión de esa tecnología en la provincia de Córdoba",
      question_number: "1.c",
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
  },
];

export default async function Encuestas({
  params,
}: {
  params: { slug: string };
}) {
  // const { events } = await getData() || {};
  console.log(params.slug);
  const dataReal: IDATA | undefined = data.find(
    (item) => +params.slug === item.id
  );
  console.log(dataReal);
  const { ...props } = dataReal;
  return (
    <main className="">
      <NavBar
        title={dataReal?.title as string}
        user={{} as TUser}
        session={{} as Session}
      />

      <div className="py-5 overflow-hidden">
        <div className="shadow-lg border-b-4 border-gray-300">
          <h2 className="pt-20 mt-5 pb-2 text-center text-xl font-bold">
            {dataReal?.description}
          </h2>
        </div>
        <EncuestaForm data={props} />
      </div>
    </main>
  );
}
