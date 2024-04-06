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
  answers: { id: string; label: string }[];
}

interface IQUESTIONRADIO {
  statement?: string;
  answers: { id: string; name: string }[];
}

const data: IDATA[] = [
  {
    id: 1,
    title: "Impresoras 3D",
    description:
      "Uso y aplicación de tecnologías 3D en producción y mantenimiento de repuestos o componentes",
    aceleran: {
      statement: "Vacio",
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
      statement: "Vacio",
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
      statement: "vacio",
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
        "Nivel de conocimiento y/o experiencia sobre la tecnología en cuestión",
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
        "Nivel de conocimiento y/o experiencia sobre la tecnología en cuestión",
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
      statement: "Vacio",
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
      statement: "Vacio",
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
      statement: "vacio",
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
        "Nivel de conocimiento y/o experiencia sobre la tecnología en cuestión",
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
        "Nivel de conocimiento y/o experiencia sobre la tecnología en cuestión",
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

      <div className="px-4 overflow-hidden">
        <h2 className="pt-20 mt-5 pb-2 text-center mx-auto">
          {dataReal?.description}
        </h2>
        <hr />
        <EncuestaForm data={props} />
      </div>
    </main>
  );
}
