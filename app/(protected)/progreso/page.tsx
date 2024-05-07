import React from "react";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";
import LayoutDefault from "@/components/image-layout/image-layout";
import { Button } from "@/components/ui/button";
import BarChart from "@/components/chart-bar/chart-bar";
import { getAllEncuestasInfo } from "@/lib/actions";
import { surveyHasEnded } from "@/utils/date-formatter";

export default async function Bienvenido() {
  const session: Session | null = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");

  const encuestas: any = await getAllEncuestasInfo();
  const { hasEnded, endDate, isActive } = encuestas[0];
  
  if(surveyHasEnded({ endDate, isActive, hasEnded })) {
    redirect("/finalizado")
  }

  const chartData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
    datasets: [
      {
        label: "Ventas",
        data: [12, 19, 3, 5, 2],
      },
    ],
  };
  const chartOptions = {
    // Opciones del gráfico (puedes personalizar según tu necesidad)
  };

  return (
    <main>
      <LayoutDefault>
        <h2 className="font-bold text-center my-10 text-2xl">
          <span className="block line-clamp-2">Estudio de</span>
          <span className="block line-clamp-2">
            Prospectiva tecnológica-ocupacional
          </span>
        </h2>
        <p>Hola *Nombre* !</p>
        <p>Estos son los resultados parciales en el avance de las respuestas</p>
        <BarChart chartData={chartData} chartOptions={chartOptions} />
        <div>
          <Button className="border  text-white py-2 px-4 font-bold rounded bg-[#087B38] hover:bg-[#087B38]">
            Finalizar cuestionario
          </Button>
          <Button className="bg-blue-600 text-white md:mx-10 hover:bg-gray-200  my-4">
            Descargar csv
          </Button>
        </div>
      </LayoutDefault>
    </main>
  );
}
