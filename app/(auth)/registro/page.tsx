import React from "react";
import Image from "next/image";
import SignInForm from "@/components/signin-form/signin-form";

export default function SignIn() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 xl:h-screen">
      <section className="w-full">
        <Image
          src={"/eccampus-temporal.jpg"}
          alt="image"
          width={200}
          height={160}
          sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
          className="lg:h-lvh w-full md:sticky top-0"
          style={{ objectFit: "cover" }}
        />
      </section>
      <section className="w-full px-12 text-textColor my-4 text-center">
        <div>
          <Image
            src={"/logos-unc.png"}
            alt="image"
            width={500}
            height={160}
            style={{
              height: "auto",
              width: "auto",
              objectFit: "cover",
              margin: "0 auto",
            }}
          />
          <h2 className="font-bold text-3xl my-4 pb-4">
            ¿Primera vez en la plataforma?
          </h2>
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
