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
          Estudio de Prospectiva tecnológica-ocupacional{" "}
        </h2>
        <h4 className="font-bold  text-center mt-14">
          Gracias por haber participado!
        </h4>
        <div className="w-full md:max-w-[80%] md:mx-auto mt-14">
          <p className="pb-4 mb-4 text-justify md:text-center">
            El cuestionario se encuentra cerrado y no se podrán sumar ni
            modificar respuestas. Puedes informarte más sobre los resultados o
            los avances haciendo click en el siguiente botón.
          </p>
        </div>
        <div className="flex justify-center gap-5">
          <Button className="bg-blue-600 text-white md:mx-10 hover:bg-gray-200  my-4">
            Ver más del estudio
          </Button>
        </div>
      </LayoutDefault>
    </main>
  );
}
