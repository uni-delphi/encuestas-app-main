import React from "react";
import Image from "next/image";
import SignInForm from "@/components/signin-form/signin-form";

export default function SignIn() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-9 h-screen">
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
      <section className="w-full overflow-y-auto px-4 py-4">
        <div>
          <h2 className="font-bold">Hola *Nombre* !</h2>
          <h2 className="font-bold">
            Tu contribución a *Nombre del estudio* es del 83%
          </h2>
          <p className="pb-4 mb-4">
            Puedes volver a completar, ampliar o modificar la justifiacion de
            tus respuestas. A continuacion te mostraremos el estado de tu
            encuesta Al estudio le restan nn días para finalizar
          </p>
        </div>
      </section>
    </div>
  );
}
