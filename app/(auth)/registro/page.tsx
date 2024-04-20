import React from "react";
import Image from "next/image";
import SignInForm from "@/components/signin-form/signin-form";
import LogosUnc from "@/components/logos-unc/logos-unc";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session: Session | null = await getServerSession(authOptions);
  const redirectUrl = session?.user.role === "ADMIN" ? "/admin" : "/estado/1";

  if (session) redirect(redirectUrl);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:h-screen">
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
          <LogosUnc />
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
