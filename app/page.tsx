import Image from "next/image";
import { authOptions } from "@/auth.config";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Session } from "next-auth";

import LogInForm from "@/components/login-form/login-form";
import { Button } from "@/components/ui/button";
import GoogleLoginButton from "@/components/google-login-button/google-login-button";
import { useToast } from "@/components/ui/use-toast";
import LayoutDefault from "@/components/image-layout/image-layout";

export default async function Home({ searchParams }: any) {
  const session: Session | null = await getServerSession(authOptions);
  const redirectUrl = session?.user.role === "ADMIN" ? "/admin" : "/estado/1";

  if (session) redirect(redirectUrl);

  if (searchParams.error === "AccessDenied") {
    console.log("Access Denied");
  }

  return (
    <main>
      <LayoutDefault>
        <h2 className="font-bold text-3xl my-4 pb-4">
          Es tu primera vez en la plataforma, registrate acá!
        </h2>
        <div className="md:flex justify-center mt-4">
          <Button className="bg-transparent text-black hover:bg-gray-200">
            Recuperar contraseña
          </Button>
          <Link
            href={"/registro"}
            className="bg-transparent text-black hover:bg-gray-200 font-bold py-2 px-4 rounded"
          >
            Registrarme
          </Link>
        </div>
        <h2 className="font-bold text-3xl my-4 pb-4">Ingresar</h2>
        <LogInForm />
        <GoogleLoginButton />
      </LayoutDefault>
    </main>
  );
}
