"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

import { TUser } from "@/types/user";
import AdminDropDown from "../admin-dropdown/admin-dropdown";
import { Session } from "next-auth";
import TemasSelect from "../temas-select/temas-select";

export default function NavBar({
  tecnologia,
  user,
  session,
  title,
}: {
  tecnologia: any;
  user?: TUser;
  session: Session;
  title: string;
}) {

  return (
    <header className="fixed grid bg-white h-20 w-full z-10">
      <TemasSelect enunciados={tecnologia?.enunciados} />
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
  );
}
