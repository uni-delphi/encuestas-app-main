import { authOptions } from "@/auth.config";
import { Session, User, getServerSession } from "next-auth";
import { getAllEncuestas, getEncuestaById, getEncuestaBySlug, getEnunciado, getFullEncuestaBySlug, getSlugs } from "@/lib/actions";
import { redirect } from "next/navigation";
import { Suspense } from "react";


import { calculateRemainingDays, surveyHasEnded } from "@/utils/date-formatter";

import EncuestaForm from "@/components/encuesta-form/encuesta-form";
import NavBar from "@/components/nav-bar/nav-bar";
import RedirectButtons from "@/components/redirect-buttons/redirect-buttons";
import { QuestionEnunciado, Enunciados  } from "@/generated/prisma";
import LayoutDefault from "@/components/image-layout/image-layout";
import { calculateResponsesPercents } from "@/utils/text-helper";
import Enunciado from "@/components/enunciado/enunciado";
import { redirectStrategy } from "@/lib/constants";

interface EncuestaFormProps {
  enunciado: QuestionEnunciado;
  user: User;
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session: Session | null = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");
  const { name, role } = session.user;
  if (role !== "USER") redirect(redirectStrategy[role]);

  const slugsArr = await params;
  const [encSlug, techSlug, enunciadoSlug] = slugsArr?.slug;
  console.log("🚀 ~ Page ~ slugsArr:", slugsArr)
  
  //const encuestas = await getAllEncuestas();
  const encuesta = await getFullEncuestaBySlug(encSlug); // o buscar por slug si tenés múltiples
  console.log("🚀 ~ Page ~ encuesta:", encuesta)

  if (!encuesta) redirect("/encuestas");
  
  const techElegida = encuesta?.tecnologias.find(
    (data: any) => data.slug === techSlug
  );

  if (!techElegida) redirect("/encuestas");

  const enunciadoElegido = techElegida.enunciados.find(
    (data: any) => data.slug === enunciadoSlug
  );
  const slugs = await getSlugs(encuesta.id);// pasar los slugs de la encuesta
  
  const { title, tecnologias, endDate, hasEnded, isActive } = encuesta;

  if (surveyHasEnded({ endDate, isActive, hasEnded })) {
    redirect(`/encuestas/finalizado/${encuesta.slug}`);
  }


  const enunciados = await getEnunciado({
    dataSlug: enunciadoElegido?.slug! ?? techElegida.enunciados[0].slug!,
    dataUserId: session?.user.id,
    dataEnunciadoId: enunciadoElegido?.id ?? techElegida.enunciados[0].id,
  });

  return (
    <main className="relative">
      <NavBar
        encuesta={encuesta}
        title={techElegida?.title as string}
        session={session as Session}
        user={session.user as User}
        slugs={slugs}
      />

      <div className="py-5 overflow-hidden">
        <div className="shadow-lg border-b-4 border-gray-300">
          <h2 className="pt-20 mt-5 pb-2 text-center text-md font-semibold">
            {enunciadoElegido?.title ?? techElegida.enunciados[0].title}
          </h2>
        </div>
        <Suspense
          fallback={Array(6)
            .fill(0)
            .map((el, index) => (
              <div key={index} className="max-w-[80%] mx-auto">
                <div className="flex flex-row bg-white items-center gap-2 p-2">
                  <div className="flex flex-col gap-2 w-9/12 h-[8rem]">
                    <span className="w-11/12 bg-gray-300 h-4 rounded-full animate-pulse"></span>
                    <span className="w-9/12 bg-gray-300 h-4 rounded-full animate-pulse"></span>
                    <span className="w-9/12 bg-gray-300 h-4 rounded-full animate-pulse"></span>
                    <span className="w-9/12 bg-gray-300 h-4 rounded-full animate-pulse"></span>
                    <span className="w-9/12 bg-gray-300 h-4 rounded-full animate-pulse"></span>
                  </div>
                  <div className="flex flex-col gap-2 w-9/12 h-[8rem]">
                    <span className="w-9/12 bg-gray-300 h-4 rounded-full animate-pulse"></span>
                    <span className="w-11/12 border border-input rounded-md h-[6rem] rounded-4 animate-pulse"></span>
                  </div>
                  <div className="flex flex-col gap-2 w-9/12 h-[8rem]">
                    <span className="w-9/12 bg-gray-300 h-4 rounded-full animate-pulse"></span>
                    <span className="w-11/12 bg-gray-300 h-[8rem] rounded-4 animate-pulse"></span>
                  </div>
                </div>
              </div>
            ))}
        >
          <EncuestaForm
            enunciado={enunciados as any}
            user={session.user as User}
          />
        </Suspense>
        <RedirectButtons
          encuesta={slugs}
          techActual={techSlug}
          enunActual={enunciadoSlug}
        />
      </div>
    </main>
  );
}
