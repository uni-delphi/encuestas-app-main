import React from "react";
import { Session, getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import LayoutDefault from "@/components/image-layout/image-layout";
import FinishOrClose from "@/components/finish-or-close/finish-or-close";
import { getAllEncuestasInfo } from "@/lib/actions";
import { surveyHasEnded } from "@/utils/date-formatter";
import NavBar from "@/components/nav-bar/nav-bar";

export default async function Bienvenido() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");
  const { name } = session.user;

  return (
    <>
      <NavBar
        encuesta={[]}
        user={session.user}
        title={""}
        session={session as Session}
        slugs={[]}
      />
      <main>
        <LayoutDefault>
          <h2 className="font-bold text-center mt-28 text-2xl ">
            Estudio de Prospectiva tecnológica-ocupacional
          </h2>
          <h4 className="font-bold  text-center mt-14">
            Gracias por haber participado!
          </h4>
          <FinishOrClose />
        </LayoutDefault>
      </main>
    </>
  );
}
