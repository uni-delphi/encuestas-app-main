// app/(protected)/investigador/encuestas/[id]/page.tsx

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

import BarChart from "@/components/chart-bar/chart-bar";
import DescargarCsv from "@/components/descargar-csv/descargar-csv";
import CloseSurvey from "@/components/close-survey/close-survey";
import { Breadcrumbs } from "@/components/breadcrombs/breadcrumbs";

import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
} from "lucide-react";

export default async function Page({ params }: { params: { id: number } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");

  const encuestaId = await params;
  const [encuesta, respuestas, enunciados, users] = await Promise.all([
    getEncuestaById(Number(encuestaId.id)),
    getResponsesForCSV() as Promise<TCSVRESPONSE[]>,
    getAllEnunciados(),
    getAllUsers(),
  ]);

  const enunciadosLabels = enunciados.map((enunciado: any) => ({
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

  return (
    <section>
      <div className="mx-auto px-6 py-10">
        {/* Header con breadcrumbs y acciones */}
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Breadcrumbs */}
            <Breadcrumbs
              items={[
                { label: "Panel", href: "/admin" },
                { label: "Encuestas", href: "/admin/encuestas" },
              ]}
            />

            {/* Acciones */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-border bg-secondary hover:bg-secondary/80 hover:border-primary/50 transition-all"
                asChild
              >
                <Link href={`/investigador/encuestas/${encuesta?.id}/editar`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar encuesta
                </Link>
              </Button>
              
              <CloseSurvey encuesta={encuesta || []} />
            </div>
          </div>

          {/* Botón volver */}
          <Link
            href="/investigador/encuestas"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a encuestas
          </Link>
        </div>

        {/* Título y descripción */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-4 text-balance">
            {encuesta?.title}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
            {encuesta?.description}
          </p>
        </div>

        {/* Gráfico de barras */}
        <div className="bg-card border border-border rounded-xl p-6 mb-10">
          <h2 className="text-lg font-semibold mb-6">
            Resultados de la encuesta
          </h2>
          <div className="space-y-4">
            <BarChart chartData={chartData} chartOptions={chartOptions} />
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Total de respuestas:{" "}
            <span className="text-foreground font-medium">{`totalResponses`}</span>
          </p>
        </div>

        {/* Detalles de la encuesta */}
        <div className="bg-card border border-border rounded-xl p-6 mb-10">
          <h2 className="text-lg font-semibold mb-6">
            Detalles de la encuesta
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Fecha de creación
                </p>
                <p className="text-foreground font-medium">
                  {encuesta?.createdAt.toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Fecha de finalización
                </p>
                <p className="text-foreground font-medium">
                  {encuesta?.endDate?.toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-lg ${encuesta?.hasEnded ? "bg-muted" : "bg-green-500/10"}`}
              >
                {encuesta?.hasEnded ? (
                  <AlertCircle className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <p
                  className={`font-medium ${encuesta?.hasEnded ? "text-muted-foreground" : "text-green-500"}`}
                >
                  {encuesta?.hasEnded ? "Finalizada" : "En curso"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tecnologías */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Tecnologías</h2>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {encuesta?.tecnologias.length} tecnologías
            </span>
          </div>

          <div className="space-y-0 divide-y divide-border">
            {encuesta?.tecnologias.map((tecnologia, index) => (
              <div key={tecnologia.id} className="py-6 first:pt-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary text-muted-foreground font-semibold text-sm shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {tecnologia.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {tecnologia.description}
                    </p>

                    <div className="pt-2">
                      <h4 className="text-sm font-medium text-foreground mb-3">
                        Enunciados
                      </h4>
                      <ul className="space-y-2">
                        {tecnologia.enunciados.map((enunciado, idx) => (
                          <li
                            key={enunciado.id}
                            className="flex items-start gap-3 text-sm text-muted-foreground"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                            {enunciado.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*<div className="flex flex-col gap-14 justify-center ">
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
      <BarChart chartData={chartData} chartOptions={chartOptions} />
      <div className="flex md:block items-center gap-2">
        
        {/*<CloseSurvey encuesta={encuesta || []} />
        <DescargarCsv props={datas} />}
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
          Tecnologias ({encuesta?.tecnologias?.length})
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
      </div>*/}
    </section>
  );
}
