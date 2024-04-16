
import Image from "next/image";
import { authOptions } from '@/auth.config';
import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation'

import LogInForm from "@/components/login-form/login-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Session } from "next-auth";

export default async function Home() {
  
  const session: Session | null = await getServerSession(authOptions);  
  const redirectUrl = session?.user.role === "ADMIN" ? "/admin" : "/estado/1";

  if (session) redirect(redirectUrl);

  return (
    <main className="grid grid-cols-1 xl:grid-cols-2 gap-9 h-screen">
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
      <section className="w-full overflow-y-auto px-4 py-4 text-center">
        <div>
          <h2 className="font-bold">¿Primera vez en la plataforma?</h2>
          <p className="pb-4 mb-4">
            Te pedimos que completes los siguientes datos a fines de poder hacer
            cruces demográficos de las respuestas
          </p>
        </div>
        <LogInForm />
        <div className="w-full text-center mt-5">
          <Button className="bg-transparent text-black hover:bg-gray-200">
            No recuerdo mi contraseña
          </Button>
          <Link
            href={"/registro"}
            className="bg-transparent text-black hover:bg-gray-200 font-bold py-2 px-4 rounded"
          >
            Registrarme
          </Link>
        </div>
      </section>
    </main>
  );
}
