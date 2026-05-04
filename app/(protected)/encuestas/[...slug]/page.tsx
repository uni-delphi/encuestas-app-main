import { authOptions } from "@/auth.config";
import { Session, User, getServerSession } from "next-auth";
import { getAllEncuestas, getEncuestaById, getEnunciado, getSlugs } from "@/lib/actions";
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

interface EncuestaFormProps {
  enunciado: QuestionEnunciado;
  user: User;
}

export default async function Page({ pageParam }: { pageParam: { id?: number } }) {
  const session: Session | null = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");
  const { name, lastName } = session.user;
  const params = await pageParam;

  const encuestas = await getAllEncuestas();

  const encuesta = await getEncuestaById(params.id!); // o buscar por slug si tenés múltiples
  console.log("🚀 ~ Page ~ encuesta:", encuesta)

  if (!encuesta) redirect("/encuestas/estado");

  const { title, tecnologias, endDate, hasEnded, isActive } = encuesta;

  if (surveyHasEnded({ endDate, isActive, hasEnded })) {
    redirect("/encuestas/finalizado");
  }

  // Total de enunciados y responses ya vienen en getAllEncuestas
  const enunciados = tecnologias.flatMap((t) => t.enunciados);

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
          <h2 className="font-bold mt-10 text-2xl">
            <span className="block line-clamp-2">
              Hola {name} {lastName}!
            </span>
            <span className="block line-clamp-2">
              Tu contribución a {title} es del{" "}
              {calculateResponsesPercents(enunciados as any)}%//ref
            </span>
          </h2>
          <div className="mt-4">
            <p className="mb-4">
              Puedes volver a completar, ampliar o modificar la justificación de
              tus respuestas.
            </p>
            <p className="pb-4 mb-4">
              A continuación te mostraremos el estado de tu encuesta.
            </p>
            <p className="pb-4 mb-4">
              Al estudio le restan {calculateRemainingDays(endDate)} días para finalizar
            </p>
          </div>
          <div className="max-w-3xl">
            {tecnologias.map((tecnologia) => (
              <div key={tecnologia.id} className="my-4">
                <h2 className="text-2xl text-left font-bold mb-4">
                  {tecnologia.title}
                </h2>
                <div className="grid">
                  {tecnologia.enunciados.map((enunciado) => (
                    <Enunciado
                      key={enunciado.id}
                      tecnologia={tecnologia}
                      enunciado={enunciado as any}//ref
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </LayoutDefault>
      </main>
    </>
  );
}
