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
