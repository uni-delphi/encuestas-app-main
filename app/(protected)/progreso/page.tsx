import React from "react";
import Image from "next/image";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function Bienvenido() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");
  const { name } = session.user;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 h-screen">
      <section className="w-full">
        <Image
          src={"/gente.jpg"}
          alt="image"
          width={200}
          height={160}
          sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
          style={{ height: "100vh", width: "100%", objectFit: "cover" }}
        />
      </section>
      <section className="w-full overflow-y-auto px-4 text-textColor my-4">
        <div>
          <Image
            src={"/logos-unc.png"}
            alt="image"
            width={200}
            height={160}
            style={{
              height: "auto",
              width: "100%",
              objectFit: "cover",
              padding: "0 200px",
            }}
          />
          <h2 className="font-bold mx-20 mt-10 text-2xl ">
            <span className="block line-clamp-2">Hola {name}!</span>
            <span className="block line-clamp-2">
              Tu contribución a *Nombre del estudio* es del 83%
            </span>
          </h2>
          <div className="max-w-[80%] mx-auto mt-1">
            <p className="mb-4">
              Puedes volver a completar, ampliar o modificar la justifiacion de
              tus respuestas.
            </p>
            <p className="pb-4 mb-4">
              A continuacion te mostraremos el estado de tu encuesta.
            </p>
            <p className="pb-4 mb-4">
              Al estudio le restan nn días para finalizar
            </p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="my-4">
            <h1 className="text-2xl font-bold mb-4">Tecnología 1</h1>
            <div className="grid ">
              <div className="bg-[#CCE8D4] shadow-md rounded-lg p-4 flex items-center justify-between">
                <p className="text-gray-800 font-semibold">Completa</p>
                <p className="text-gray-600">Enunciado 1</p>
                <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Ampliar Respuesta
                </Button>
              </div>
              <div className="bg-[#FFFFBF] shadow-md rounded-lg p-4 flex cols-12 items-center justify-between">
                <p className="text-gray-800 font-semibold">Casi Listo</p>
                <p className="text-gray-600">Enunciado 2</p>
                <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Continuar
                </Button>
              </div>
              <div className="bg-[#EAEAEA] shadow-md rounded-lg p-4 flex cols-12 items-center justify-between">
                <p className="text-gray-800 font-semibold">Por Empezar</p>
                <p className="text-gray-600">Enunciado 3</p>
                <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Empezar Ahora
                </Button>
              </div>
            </div>
          </div>
          <div className="my-4">
            <h1 className="text-2xl font-bold mb-4">Tecnología 2</h1>
            <div className="grid ">
              <div className="bg-[#FFFFBF] shadow-md rounded-lg p-4 flex cols-12 items-center justify-between">
                <p className="text-gray-800 font-semibold">Casi Listo</p>
                <p className="text-gray-600">Enunciado 1</p>
                <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Ampliar Respuesta
                </Button>
              </div>
              <div className="bg-[#CCE8D4] shadow-md rounded-lg p-4 flex items-center justify-between">
                <p className="text-gray-800 font-semibold">Completa</p>
                <p className="text-gray-600">Enunciado 2</p>
                <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Continuar
                </Button>
              </div>
              <div className="bg-[#EAEAEA] shadow-md rounded-lg p-4 flex cols-12 items-center justify-between">
                <p className="text-gray-800 font-semibold">Por Empezar</p>
                <p className="text-gray-600">Enunciado 3</p>
                <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Empezar Ahora
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
