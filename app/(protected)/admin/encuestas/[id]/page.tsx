// app/(protected)/admin/encuestas/[id]/page.tsx

import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  getResponsesForCSV,
  getAllEnunciados,
  getAllUsers,
  getEncuestas,
  getEncuestaById,
} from "@/lib/actions";
import { TCSVRESPONSE } from "@/types/respuestas";

import { Button } from "@/components/ui/button";

import NavBar from "@/components/nav-bar/nav-bar";
import LayoutDefault from "@/components/image-layout/image-layout";
import BarChart from "@/components/chart-bar/chart-bar";
import DescargarCsv from "@/components/descargar-csv/descargar-csv";
import CloseSurvey from "@/components/close-survey/close-survey";
import { Breadcrumbs } from "@/components/breadcrombs/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");

  const encuestaId = await params;
  const [encuesta, respuestas, enunciados, users] = await Promise.all([
    getEncuestaById(Number(encuestaId.id)),
    getResponsesForCSV() as Promise<TCSVRESPONSE[]>,
    getAllEnunciados(),
    getAllUsers(),
  ]);

  /*const enunciadosLabels = enunciados.map((enunciado: any) => ({
    label: enunciado.title,
    porcents:
      (enunciado.response.length /
        (enunciado.questions.length * users.usuarios.length)) *
      100,
  }));

  const chartData = {
    labels: enunciadosLabels.map(
      (_: any, index: number) => `Enunciado ${index + 1}`,
    ),
    datasets: [
      {
        label: "Respuestas en %",
        data: enunciadosLabels.map(
          (enunciado: any) => +enunciado.porcents.toFixed(2),
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
    data: respuestas ?? [],
  };
*/
  return (
    <section>
      <div className="flex flex-col gap-14 justify-center ">
        <div className="flex gap-4 items-right ml-auto items-center">
          <Breadcrumbs
            items={[
              { label: "Panel", href: "/admin" },
              { label: "Encuestas", href: "/admin/encuestas" },
            ]}
          />
          <Button asChild>
            <Link
              href={`/admin/encuestas/${encuesta?.id}/editar`}
              className="ml-4"
            >
              Editar encuesta
            </Link>
          </Button>
          <CloseSurvey encuesta={encuesta || []} />
        </div>
        <h2 className="font-bold my-10 text-2xl">
          <span className="block line-clamp-2 text-balance">
            {encuesta?.title}
          </span>
        </h2>
      </div>
      <p>{encuesta?.description}</p>
      {/*<BarChart chartData={chartData} chartOptions={chartOptions} />*/}
      <div className="flex md:block items-center gap-2">
        {/*<CloseSurvey encuesta={encuesta || []} />*/}
        {/*<DescargarCsv props={datas} />*/}
      </div>
      {encuesta && (
        <div>
          <h3>Detalles de la encuesta</h3>
          <p>
            Fecha de creación:{" "}
            <strong>{encuesta.createdAt.toLocaleDateString()}</strong>
          </p>
          <p>
            Fecha de finalización:{" "}
            <strong>{encuesta.endDate?.toLocaleDateString()}</strong>
          </p>
          <p>
            Estado:{" "}
            <strong>{encuesta.hasEnded ? "Finalizada" : "En curso"}</strong>
          </p>
        </div>
      )}

      <div className=" mt-10">
        <h3 className="text-xl text-pretty w-2/3">
          Tecnologias ({encuesta?.tecnologias.length})
        </h3>
        <div>
          {encuesta?.tecnologias.map((tecnologia: any, index: number) => (
            <div key={tecnologia.id} className="p-6 flex flex-col gap-2 border-b">
              <h4 className="text-lg font-semibold">{index + 1} - {tecnologia.title}</h4>
              <p className="text-muted-foreground pl-2">
                {tecnologia.description}
              </p>
              <ul className="space-y-1 pl-4">
                <li>
                  <h5 className="text-sm font-semibold">Enunciados</h5>
                </li>
                {tecnologia.enunciados.map((enunciado: any, idx: number) => (
                  <li
                    key={enunciado.id}
                    className="text-sm text-muted-foreground pl-2"
                  >
                    {enunciado.title}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
