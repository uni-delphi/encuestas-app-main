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
        name: "0 = Ningún conocimiento y/o experiencia",
      },
      {
        id: "2",
        name: "1–3 = Bajo nivel de conocimiento",
      },
      {
        id: "3",
        name: "4–6 = Nivel medio",
      },
      {
        id: "4",
        name: "7–9 = Alto nivel",
      },
      {
        id: "5",
        name: "10 = Experto/a",
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
        name: "4–6 = Importancia media ",
      },
      {
        id: "9",
        name: "7–9 = Alta importancia",
      },
      {
        id: "10",
        name: "10 = Totalmente importante ",
      },
    ],
  },
  "HORIZONTE": {
    order: "c",
    answers: [
      {
        id: "11",
        name: "2025",
      },
      {
        id: "12",
        name: "2027",
      },
      {
        id: "13",
        name: "2030",
      },
      {
        id: "14",
        name: "2035",
      },
      {
        id: "15",
        name: "2040",
      },
    ],
  },
  "CAPACIDADES": {
    order: "d",
    answers: [
      {
        id: "16",
        name: "Capacidades científico-tecnológicas (I+D)",
      },
      {
        id: "17",
        name: "Infraestructura productiva",
      },
      {
        id: "18",
        name: "Capital humano calificado",
      },
      {
        id: "19",
        name: "Redes de articulación público-privada",
      },
      {
        id: "20",
        name: "Marco normativo favorable",
      },
      {
        id: "21",
        name: "Acceso a financiamiento",
      },
      {
        id: "22",
        name: "Desarrollo de proveedores locales",
      },
      {
        id: "23",
        name: "Digitalización y tecnologías emergentes",
      },
      {
        id: "24",
        name: "Inserción internacional / mercados",
      },
      {
        id: "25",
        name: "Otras (especificar)",
      },
    ],
  },
  "BARRERAS": {
    order: "e",
    answers: [
      {
        id: "26",
        name: "Inestabilidad macroeconómica",
      },
      {
        id: "27",
        name: "Falta de financiamiento",
      },
      {
        id: "28",
        name: "Débil articulación institucional",
      },
      {
        id: "29",
        name: "Limitaciones tecnológicas",
      },
      {
        id: "30",
        name: "Brechas de capital humano",
      },
      {
        id: "31",
        name: "Marco regulatorio inadecuado",
      },
      {
        id: "32",
        name: "Baja adopción tecnológica",
      },
      {
        id: "33",
        name: "Problemas logísticos / infraestructura",
      },
      {
        id: "34",
        name: "Restricciones ambientales",
      },
      {
        id: "35",
        name: "Falta de información estratégica",
      },
      {
        id: "36",
        name: "Otras (especificar)",
      },
    ],
  },
  "AREAS": {
    order: "f",
    answers: [
      {
        id: "37",
        name: "Productividad y eficiencia",
      },
      {
        id: "38",
        name: "Competitividad sectorial",
      },
      {
        id: "39",
        name: "Generación de empleo",
      },
      {
        id: "40",
        name: "Desarrollo territorial",
      },
      {
        id: "41",
        name: "Sustentabilidad ambiental",
      },
      {
        id: "42",
        name: "Innovación tecnológica",
      },
      {
        id: "43",
        name: "Exportaciones / inserción internacional",
      },
      {
        id: "44",
        name: "Inclusión de PyMEs",
      },
      {
        id: "45",
        name: "Seguridad alimentaria",
      },
      {
        id: "46",
        name: "Diversificación productiva",
      },
      {
        id: "47",
        name: "Otras (especificar)",
      },
    ],
  },
};
