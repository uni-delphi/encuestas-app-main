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
            width={500}
            height={160}
            style={{
              height: "auto",
              width: "100%",
              objectFit: "cover",
              padding: "0 200px",
            }}
          />
          <h2 className="font-bold text-center mt-28 text-2xl ">
            Estudio de Prospectiva tecnológica-ocupacional
          </h2>
          <h4 className="font-bold text-center mt-14">
            Gracias por participar
          </h4>
          <div className="max-w-[80%] mx-auto mt-14">
            <p className="pb-4 mb-4 text-center">
              Te recordamos que hasta el 14 de mayo puedes volver a ingresar al
              estudio y modificar o ampliar la información según consideres.
            </p>
            <p className="pb-4 mb-4 text-center">
              Al finalizar la investigacion compartiremos por mail el resultado
              final. Tambien lo invitamos a estar atentos a los avances en
              nuestra pagina web
            </p>
            <p className="pb-4 mb-4 text-center">
              Tambien lo invitamos a estar atentos a los avances en nuestra
              pagina web
            </p>
          </div>
        </div>
        <div className="flex justify-center ">
          <Button className="bg-blue-600 text-white mx-10 hover:bg-gray-200  my-4">
            Ver mis respuestas
          </Button>
          <Button className="bg-blue-600 text-white mx-10 hover:bg-gray-200  my-4">
            Ver más del estudio
          </Button>
        </div>
      </section>
    </div>
  );
}
