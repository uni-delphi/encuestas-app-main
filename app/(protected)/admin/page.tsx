import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";

import { getResponsesForCSV, getAllEnunciados, getAllUsers } from "@/lib/actions";
import { TRESPONSE } from "@/types/respuestas";

import { Button } from "@/components/ui/button";
import NavBar from "@/components/nav-bar/nav-bar";
import LayoutDefault from "@/components/image-layout/image-layout";
import BarChart from "@/components/chart-bar/chart-bar";
import ModalCloseSurvey from "@/components/close-survey-modal/close-survey-modal";
import DescargarCsv from "@/components/descargar-csv/descargar-csv";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");

  const respuestas: TRESPONSE[] = await getResponsesForCSV();
  const enunciados = await getAllEnunciados();  
  const users = await getAllUsers();
  
  const enunciadosLabels = enunciados.map(enunciado => ({
    label: enunciado.title,
    porcents: (enunciado.response.length/(enunciado.questions.length * users.length)) * 100,
  }));
  
  const chartData = {
    labels: enunciadosLabels.map((_, index: number) => `Enunciado ${index + 1}`),
    datasets: [
      {
        label: "Respuestas en %",
        data: enunciadosLabels.map(enunciado => +enunciado.porcents.toFixed(2)),
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
    <>
      <NavBar
        encuesta={[]}
        user={session.user}
        title={"Dashboard" as string}
        session={session as Session}
      />
      <main>
        <LayoutDefault>
          <h2 className="font-bold text-center my-10 text-2xl">
            <span className="block line-clamp-2">Estudio de</span>
            <span className="block line-clamp-2">
              Prospectiva tecnológica-ocupacional
            </span>
          </h2>
          <p>
            Hola {session.user.name} {session.user.lastName}!
          </p>
          <p>
            Estos son los resultados parciales en el avance de las respuestas
          </p>
          <BarChart chartData={chartData} chartOptions={chartOptions} />
          <div className="flex md:block items-center gap-2">
            <Button className="border  text-white py-2 font-bold rounded bg-[#087B38] hover:bg-[#087B38]">
              Finalizar cuestionario
            </Button>
            <ModalCloseSurvey visible={false} />
            <DescargarCsv props={datas} />
          </div>
        </LayoutDefault>
      </main>
    </>
  );
}
