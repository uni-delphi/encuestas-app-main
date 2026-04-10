import { authOptions } from "@/auth.config";
import { CreateEncuestaForm } from "@/components/create-encuesta-form/create-encuesta-form";
import NavBar from "@/components/nav-bar/nav-bar";
import { getServerSession, Session, User } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");

  const { user } = session;
  return (
    <section className="px-10 py-20">
      <h1 className="font-bold text-4xl mb-10">Nueva encuesta</h1>
      <CreateEncuestaForm />
    </section>
  );
}
