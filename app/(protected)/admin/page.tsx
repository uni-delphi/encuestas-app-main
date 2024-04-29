import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import NavBar from "@/components/nav-bar/nav-bar";
import LayoutDefault from "@/components/image-layout/image-layout";
import BarChart from "@/components/chart-bar/chart-bar";
import ModalCloseSurvey from "@/components/close-survey-modal/close-survey-modal";
import DescargarCsv from "@/components/descargar-csv/descargar-csv";
import { getResponses } from "@/lib/actions";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");

  const encuestas: any = await getResponses();

  const chartData = {
    labels: [
      "Enunciado 1",
      "Enunciado 2",
      "Enunciado 3",
      "Enunciado 4",
      "Enunciado 5",
    ],
    datasets: [
      {
        label: "Respuestas en %",
        data: [12.52, 19.55, 83.33, 5, 2],
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

  const handleCloseSurvey = () => {
    console.log("dasdasdsa");
  };

  const datas = {
    headers: [
      { displayName: "enunciados", id: "enunciado" },
      { displayName: "question", id: "question" },
      { displayName: "Seleccionado", id: "checkboxChoises" },
      { displayName: "Respuesta", id: "respuestas" },
      { displayName: "createdAt", id: "createdAt" },
      { displayName: "respondent name", id: "respondentName" },
      { displayName: "respondent email", id: "respondentEmail" },
    ],
    data: encuestas,
  };
  console.log("🚀 ~ Dashboard ~ datas.encuestas:", encuestas);

  return (
    <>
      <NavBar
        tecnologia={{}}
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
            <DescargarCsv props={datas} />
          </div>
        </LayoutDefault>
        <ModalCloseSurvey visible={false} />
      </main>
    </>
  );
}
