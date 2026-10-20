export const SITE_NAME = `Delphi - Campus Norte UNC`;
export const SITE_DESCRPTION = `Herramienta desarrollada por Campus Norte UNC que utiliza el modelo SENAI de Prospectiva Ocupacional para anticipar los efectos de tecnologías emergentes en el trabajo y la formación.`;
export const SITE_LANG = "es";
export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://")
    ? process.env.NEXT_PUBLIC_SITE_URL
    : `https://${process.env.NEXT_PUBLIC_SITE_URL}`) ?? // Set this to your site URL in production env.
  (process.env.NEXT_PUBLIC_VERCEL_URL?.startsWith("https://")
    ? process.env.NEXT_PUBLIC_VERCEL_URL
    : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`) ?? // Automatically set by Vercel.
  "http://localhost:3000";

export const IS_DEV: boolean = process.env.NODE_ENV === "development";
export const IS_PROD: boolean = process.env.NODE_ENV === "production";

export const GOOGLE_ANALYTICS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "";

export const redirectStrategy: Record<string, string> = {
  ADMIN: "/admin",
  RESEARCHER: "/investigador",
  USER: "/encuestas",
};

export const data: Record<string, any> = {
  "NIVEL": {
    order: "a",
    answers: [
      {
        id: "1",
        name: "0 = Ningún conocimiento ni experiencia",
      },
      {
        id: "2",
        name: "1–3 = Conocimiento básico o exploratorio",
      },
      {
        id: "3",
        name: "4–6 = Conocimiento intermedio, con experiencia indirecta",
      },
      {
        id: "4",
        name: "7–9 = Conocimiento avanzado y experiencia aplicada en el sector",
      },
      {
        id: "5",
        name: "10 = Experto/a con experiencia directa en la tecnología evaluada",
      },
    ],
  },
  "IMPORTANCIA": {
    order: "b",
    answers: [
      {
        id: "6",
        name: "0 = Nada importante",
      },
      {
        id: "7",
        name: "1–3 = Baja importancia",
      },
      {
        id: "8",
        name: "4–6 = Importancia media",
      },
      {
        id: "9",
        name: "7–9 = Alta importancia",
      },
      {
        id: "10",
        name: "10 = Importancia crítica o transformadora",
      },
    ],
  },
  "HORIZONTE": {
    order: "c",
    answers: [
      {
        id: "11",
        name: "2026 – Ya se encuentra implementada o en proceso de consolidación",
      },
      {
        id: "12",
        name: "2027 – Corto plazo",
      },
      {
        id: "13",
        name: "2030 – Mediano plazo",
      },
      {
        id: "14",
        name: "2033 – Largo plazo, dentro del horizonte prospectivo",
      },
      {
        id: "15",
        name: "2035 – Al finalizar el horizonte del estudio",
      },
      {
        id: "16",
        name: "Después de 2035 – Adopción posterior al horizonte considerado",
      },
      {
        id: "17",
        name: "No se prevé su adopción en el sector",
      },
    ],
  },
  "CAPACIDADES": {
    order: "d",
    answers: [
      {
        id: "18",
        name: "Capacidades científico-tecnológicas y de investigación aplicada (INTA, universidades y centros de I+D)",
      },
      {
        id: "19",
        name: "Infraestructura productiva y tecnológica para cultivo, cosecha, henificación y procesamiento",
      },
      {
        id: "20",
        name: "Capital humano especializado y experiencia técnica de productores, contratistas y empresas",
      },
      {
        id: "21",
        name: "Articulación público-privada y cooperación entre actores de la cadena",
      },
      {
        id: "22",
        name: "Marco normativo, regulatorio y de certificación favorable",
      },
      {
        id: "23",
        name: "Acceso a financiamiento e instrumentos de inversión tecnológica",
      },
      {
        id: "24",
        name: "Disponibilidad de proveedores de maquinaria, equipamiento y servicios tecnológicos",
      },
      {
        id: "25",
        name: "Conectividad rural, digitalización y acceso a tecnologías emergentes",
      },
      {
        id: "26",
        name: "Capacidad exportadora, acceso a mercados internacionales y redes comerciales",
      },
      {
        id: "27",
        name: "Capacidades de formación profesional, capacitación continua y transferencia tecnológica",
      },
      {
        id: "28",
        name: "Otras (especificar)",
      }
    ],
  },
  "BARRERAS": {
    order: "e",
    answers: [
      {
        id: "29",
        name: "Elevados costos de inversión en maquinaria, equipamiento y tecnologías",
      },
      {
        id: "30",
        name: "Acceso limitado al financiamiento y al crédito productivo",
      },
      {
        id: "31",
        name: "Insuficiente conectividad rural e infraestructura digital",
      },
      {
        id: "32",
        name: "Escasez de personal especializado y competencias tecnológicas",
      },
      {
        id: "33",
        name: "Brechas de capacitación y formación profesional",
      },
      {
        id: "34",
        name: "Limitaciones de escala productiva y rentabilidad económica",
      },
      {
        id: "35",
        name: "Resistencia al cambio y baja cultura de innovación",
      },
      {
        id: "36",
        name: "Débil articulación institucional y coordinación entre actores",
      },
      {
        id: "37",
        name: "Restricciones normativas, regulatorias o de certificación",
      },
      {
        id: "38",
        name: "Problemas logísticos, de transporte e infraestructura industrial",
      },
      {
        id: "39",
        name: "Limitaciones en la disponibilidad y gestión de recursos hídricos",
      },
      {
        id: "40",
        name: "Incertidumbre climática, económica y de los mercados",
      },
      {
        id: "41",
        name: "Falta de información estratégica y asesoramiento tecnológico",
      },
      {
        id: "42",
        name: "Otras (especificar)",
      }
    ],
  },
  "AREAS": {
    order: "f",
    answers: [
      {
        id: "43",
        name: "Productividad y eficiencia de los sistemas productivos",
      },
      {
        id: "44",
        name: "Competitividad y posicionamiento comercial de la cadena",
      },
      {
        id: "45",
        name: "Generación de empleo y nuevas oportunidades ocupacionales",
      },
      {
        id: "46",
        name: "Transformación de perfiles profesionales y competencias laborales",
      },
      {
        id: "47",
        name: "Calidad, inocuidad y trazabilidad de los productos",
      },
      {
        id: "48",
        name: "Innovación tecnológica y digitalización de procesos",
      },
      {
        id: "49",
        name: "Automatización y eficiencia de la maquinaria y los procesos industriales",
      },
      {
        id: "50",
        name: "Sostenibilidad ambiental y eficiencia en el uso del agua y otros recursos",
      },
      {
        id: "51",
        name: "Agregado de valor, diversificación productiva y nuevos usos de los productos",
      },
      {
        id: "52",
        name: "Exportaciones e inserción en mercados internacionales",
      },
      {
        id: "53",
        name: "Desarrollo territorial y fortalecimiento de economías regionales",
      },
      {
        id: "54",
        name: "Seguridad y condiciones de trabajo",
      },
      {
        id: "55",
        name: "Otras (especificar)",
      },
    ],
  },
};
