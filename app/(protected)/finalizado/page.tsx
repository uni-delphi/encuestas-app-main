import React from "react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import LayoutDefault from "@/components/image-layout/image-layout";

export default async function Bienvenido() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");
  const { name } = session.user;

  return (
    <main>
      <LayoutDefault>
        <h2 className="font-bold text-center mt-28 text-2xl ">
          Estudio de Prospectiva tecnológica-ocupacional
        </h2>
        <h4 className="font-bold  text-center mt-14">Gracias por participar</h4>
        <div className="w-full md:max-w-[80%] md:mx-auto mt-14">
          <p className="pb-4 mb-4 text-justify md:text-center">
            Te recordamos que hasta el 14 de mayo puedes volver a ingresar al
            estudio y modificar o ampliar la información según consideres.
          </p>
          <p className="pb-4 mb-4 text-justify md:text-center">
            Al finalizar la investigacion compartiremos por mail el resultado
            final. Tambien lo invitamos a estar atentos a los avances en nuestra
            pagina web
          </p>
          <p className="pb-4 mb-4 text-justify md:text-center">
            Tambien lo invitamos a estar atentos a los avances en nuestra pagina
            web
          </p>
        </div>
        <div className="flex justify-center gap-5">
          <Link
            href="/estado"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-blue-600 text-white md:mx-10 hover:bg-gray-200 my-4"
          >
            Ver mis respuestas
          </Link>
          <Button className="bg-blue-600 text-white md:mx-10 hover:bg-gray-200  my-4">
            Ver más del estudio
          </Button>
        </div>
      </LayoutDefault>
    </main>
  );
}
