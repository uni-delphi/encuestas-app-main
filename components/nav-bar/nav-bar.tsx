"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

import AdminDropDown from "../admin-dropdown/admin-dropdown";
import { Session, User } from "next-auth";
import TemasSelect from "../temas-select/temas-select";

export default function NavBar({
  encuesta,
  user,
  session,
  title,
}: {
  encuesta: any[];
  user?: User;
  session: Session;
  title: string;
}) {
  
  return user?.role === "USER" ? (
    <header className="fixed grid bg-white h-20 w-full z-10">
      {encuesta[0]?.tecnologias?.length > 0 && (
        <TemasSelect tecnologias={encuesta[0]?.tecnologias} />
      )}
      <nav className="flex w-full bg-blue-700 text-white justify-center items-center p-3">
        <h1 className="scroll-m-20 text-2xl font-bold tracking-tight ">
          {title}
        </h1>
        {!session && (
          <Button
            className="ml-6"
            onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
          >
            Ingresar/Registrarse
          </Button>
        )}
        {session && <AdminDropDown session={session} />}
      </nav>
    </header>
  ) : (
    <header className="fixed right-2 top-2 md:right-5 md:top-5 ">
      <nav className="">{session && <AdminDropDown session={session} />}</nav>
    </header>
  );
}
