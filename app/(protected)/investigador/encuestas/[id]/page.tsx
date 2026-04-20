import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";

import {
  getResponsesForCSV,
  getAllEnunciados,
  getAllUsers,
  getEncuestas,
} from "@/lib/actions";
import { TCSVRESPONSE } from "@/types/respuestas";

import NavBar from "@/components/nav-bar/nav-bar";
import LayoutDefault from "@/components/image-layout/image-layout";
import BarChart from "@/components/chart-bar/chart-bar";
import DescargarCsv from "@/components/descargar-csv/descargar-csv";
import CloseSurvey from "@/components/close-survey/close-survey";
import { getEncuestaById } from "@/lib/api/encuestas";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");

  const encuestaId = await params;

  const [encuesta, respuestas, enunciados, users] = await Promise.all([
    getEncuestaById({ id: parseInt(encuestaId.id) }),
    getResponsesForCSV() as Promise<TCSVRESPONSE[]>,
    getAllEnunciados(),
    getAllUsers(),
  ]);
  console.log("🚀 ~ Page ~ encuesta:", encuesta);

  const enunciadosLabels = enunciados.map((enunciado) => ({
    label: enunciado.title,
    porcents:
      (enunciado.response.length /
        (enunciado.questions.length * users.length)) *
      100,
  }));

  const chartData = {
    labels: enunciadosLabels.map(
      (_, index: number) => `Enunciado ${index + 1}`,
    ),
    datasets: [
      {
        label: "Respuestas en %",
        data: enunciadosLabels.map(
          (enunciado) => +enunciado.porcents.toFixed(2),
        ),
      },
    ],
  };

  const chartOptions = {
    // Opciones del gráfico (puedes personalizar según tu necesidad)
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 100,
      },
    },
  };

  const datas = {
    headers: [
      { displayName: "Tecnologia", id: "technology" },
      { displayName: "Enunciados", id: "enunciado" },
      { displayName: "Pregunta", id: "question" },
      { displayName: "Seleccionado", id: "checkboxChoises" },
      { displayName: "Respuesta", id: "respuestas" },
      { displayName: "Fecha creada", id: "createdAt" },
      { displayName: "Nombre del experto", id: "respondentName" },
      { displayName: "Email del experto", id: "respondentEmail" },
      { displayName: "Pais del experto", id: "respondentCountry" },
      { displayName: "Provincia del experto", id: "respondentState" },
      { displayName: "Education del experto", id: "respondentEducation" },
      { displayName: "Sector del experto", id: "respondentSector" },
      { displayName: "Institución del experto", id: "respondentInstitution" },
      { displayName: "Expertees del experto", id: "respondentExpertees" },
      { displayName: "Años del experto", id: "respondentYears" },
    ],
    data: respuestas,
  };

  return (
    <section className="">
      <div className="flex gap-10 justify-between items-center">
        <h2 className="font-bold my-10 text-4xl">
          <span className="block line-clamp-2">Estudio de</span>
          <span className="block line-clamp-2">{encuesta?.title}</span>
        </h2>
        <Button asChild>
          <Link
            href={`/investigador/encuestas/${encuestaId.id}/editar`}
            className="mb-4"
          >
            Editar encuesta
          </Link>
        </Button>
      </div>
      <p>
        Hola {session.user.name} {session.user.lastName}!
      </p>
      <p>Estos son los resultados parciales en el avance de las respuestas</p>
      <BarChart chartData={chartData} chartOptions={chartOptions} />
      <div className="flex md:block items-center gap-2">
        <CloseSurvey encuesta={encuesta || []} />
        <DescargarCsv props={datas} />
      </div>
    </section>
  );
}
