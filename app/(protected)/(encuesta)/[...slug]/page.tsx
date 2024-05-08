import { authOptions } from "@/auth.config";
import { Session, User, getServerSession } from "next-auth";
import { getAllEncuestas, getEnunciado } from "@/lib/actions";
import EncuestaForm from "@/components/encuesta-form/encuesta-form";
import NavBar from "@/components/nav-bar/nav-bar";

import { redirect } from "next/navigation";
import { IENUNCIADO } from "@/types/encuestas";
import { Suspense } from "react";
import { surveyHasEnded } from "@/utils/date-formatter";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Encuestas({
  params,
}: {
  params: { slug: string[] };
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");

  const { user } = session;
  const [techTitle, enunciadoTitle] = params.slug;
  let emptyEnunciadoSlug: string = "";
  let emptyEnunciadoId: number = 0;

  const encuestas: any = await getAllEncuestas(session.user.id);
  const { hasEnded, endDate, isActive } = encuestas[0];

  if (surveyHasEnded({ endDate, isActive, hasEnded })) {
    redirect("/finalizado");
  }

  const techElegida = encuestas[0]?.tecnologias.find(
    (data: any) => data.slug === techTitle
  );

  if (!techElegida) redirect("/estado");

  const enunciadoElegido = techElegida.enunciados.find(
    (data: any) => data.slug === enunciadoTitle
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
  //console.log(encuestas);
  return (
    <main className="">
      <NavBar
        encuesta={encuestas}
        title={techElegida?.title as string}
        session={session as Session}
        user={user as User}
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
        <div className="flex justify-center items-center gap-5 p-4">
          <Link href="/estado">Ver avance</Link>

          <Button className="bg-blue-600 text-white md:mx-10 hover:bg-gray-200 hover:text-blue-600 font-bold">
            Siguiente
          </Button>
        </div>
      </div>
    </main>
  );
}
