import React from "react";
import Image from "next/image";
import SignInForm from "@/components/signin-form/signin-form";

export default function SignIn() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 h-screen">
      <section className="w-full">
        <Image
          src={"/gente.jpg"}
          alt="image"
          width={50}
          height={160}
          sizes="(max-width: 768px) 100vw,              
              33vw"
          className="lg:h-lvh  w-full"
          style={{ objectFit: "cover" }}
        />
      </section>
      <section className="w-full overflow-y-auto px-4 py-4">
        <div>
          <Image
            src={"/logos-unc.png"}
            alt="image"
            width={400}
            height={250}
            style={{
              height: "auto",
              width: "auto",
              objectFit: "cover",
              margin: "20px auto",
            }}
          />
          <h2 className="font-bold">¿Primera vez en la plataforma?</h2>
          <p className="pb-4 mb-4">
            Te pedimos que completes los siguientes datos a fines de poder hacer
            cruces demográficos de las respuestas
          </p>
        </div>
        <SignInForm />
      </section>
    </div>
  );
}
