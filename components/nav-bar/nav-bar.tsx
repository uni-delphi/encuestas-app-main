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
  slugs,
}: {
  encuesta: any[];
  user?: User;
  session: Session;
  title: string;
  slugs: any[];
}) {
  return (
    <header className="fixed grid h-20 w-full z-10 bg-transparent">
      {encuesta[0]?.tecnologias?.length > 0 && (
        <TemasSelect tecnologias={encuesta[0]?.tecnologias} slugs={slugs} />
      )}
      <nav
        className={`${
          title
            ? "flex w-full bg-blue-700 text-white justify-center items-center p-3"
            : "fixed right-2 top-2 md:right-5 md:top-5 bg-transparent"
        }`}
      >
        {title && (
          <h1 className="scroll-m-20 text-xl font-semibold tracking-tight ">
            {title}
          </h1>
        )}
        {session && <AdminDropDown session={session} title={title} />}
      </nav>
    </header>
  );
}
