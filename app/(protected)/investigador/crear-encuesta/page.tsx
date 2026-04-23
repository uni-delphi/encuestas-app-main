import { authOptions } from "@/auth.config";
import { Breadcrumbs } from "@/components/breadcrombs/breadcrumbs";
import SurveyForm, { SurveyFormData } from "@/components/create-encuesta-form/create-encuesta-form";
import NavBar from "@/components/nav-bar/nav-bar";
import { getServerSession, Session, User } from "next-auth";
import { redirect } from "next/navigation";
import { createEncuestaAction } from "@/lib/actions";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");

  const { user } = session;

  return (
    <section className="px-10 py-20">
      <div className="flex gap-14 justify-between items-end">
        <h1 className="text-4xl font-bold leading-[1]">Crear nueva encuesta</h1>
        <Breadcrumbs items={[{ label: "Panel", href: "/investigador" }]} />
      </div>
      <div className="my-10">
        <SurveyForm availableTecnologias={[]} onSubmit={createEncuestaAction as any } />
      </div>
    </section>
  );
}
