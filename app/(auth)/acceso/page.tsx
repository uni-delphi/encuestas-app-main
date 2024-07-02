import React from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import LogInForm from "@/components/login-form/login-form";
import GoogleLoginButton from "@/components/google-login-button/google-login-button";
import LayoutDefault from "@/components/image-layout/image-layout";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";

export default async function LogIn() {
  const session: Session | null = await getServerSession(authOptions);
  const redirectUrl = session?.user.role === "ADMIN" ? "/admin" : "/estado/1";

  if (session) redirect(redirectUrl);

  return (
    <main>
      <LayoutDefault>
        <h2 className="font-bold text-2xl mt-10 pb-4 w-[80%] mx-auto">
          ¿Es tu primera vez en la plataforma? ¡Regístrate aquí!
        </h2>
        <div className="md:flex justify-center my-4 gap-4">
          <Button className="hidden bg-transparent text-black hover:bg-gray-200">
            Recuperar contraseña
          </Button>
          <Link
            href={"/registro"}
            className="bg-transparent text-black hover:text-blue-600 hover:bg-gray-200 font-bold py-2 px-4 rounded"
          >
            Registrarme
          </Link>
        </div>
        <hr className="w-full position-absolute" />
        <div className="mt-10">
          <h2 className="font-bold text-2xl my-4 pb-4">Ingresar</h2>
          <LogInForm />
        </div>
      </LayoutDefault>
    </main>
  );
}
