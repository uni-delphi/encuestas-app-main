import { authOptions } from "@/auth.config";
import { Session, User, getServerSession } from "next-auth";
import { getAllEncuestas, getEnunciado, getSlugs } from "@/lib/actions";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { IENUNCIADO } from "@/types/encuestas";
import { surveyHasEnded } from "@/utils/date-formatter";

import EncuestaForm from "@/components/encuesta-form/encuesta-form";
import NavBar from "@/components/nav-bar/nav-bar";
import RedirectButtons from "@/components/redirect-buttons/redirect-buttons";

export default async function Encuestas({
  params,
}: {
  params: { slug: string[] };
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");

  const { user } = session;
  const [techSlug, enunciadoSlug] = params.slug;
  let emptyEnunciadoSlug: string = "";
  let emptyEnunciadoId: number = 0;

  const encuestas: any = await getAllEncuestas(session.user.id);
  const { hasEnded, endDate, isActive } = encuestas[0];

  if (surveyHasEnded({ endDate, isActive, hasEnded })) {
    redirect("/finalizado");
  }

  const slugs = await getSlugs();

  const techElegida = encuestas[0]?.tecnologias.find(
    (data: any) => data.slug === techSlug
  );

  if (!techElegida) redirect("/estado");

  const enunciadoElegido = techElegida.enunciados.find(
    (data: any) => data.slug === enunciadoSlug
  );

  if (!enunciadoElegido) {
    emptyEnunciadoSlug = techElegida.enunciados[0].slug;
    emptyEnunciadoId = techElegida.enunciados[0].id;
  }

  const enunciados = await getEnunciado({
    dataSlug: enunciadoElegido?.slug ?? emptyEnunciadoSlug,
    dataUserId: session?.user.id,
    dataEnunciadoId: enunciadoElegido?.id ?? emptyEnunciadoId,
  });

  return (
    <main className="relative">
      <NavBar
        encuesta={encuestas}
        title={techElegida?.title as string}
        session={session as Session}
        user={user as User}
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
            enunciado={enunciados as IENUNCIADO}
            user={user as User}
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
