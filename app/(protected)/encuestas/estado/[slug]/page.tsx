import { authOptions } from "@/auth.config";
import { Session, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  getAllEncuestas,
  getAllEnunciados,
  getAllMyResponses,
  getEncuestaBySlug,
} from "@/lib/actions";

import NavBar from "@/components/nav-bar/nav-bar";
import LayoutDefault from "@/components/image-layout/image-layout";
import Enunciado from "@/components/enunciado/enunciado";
import { IENUNCIADO, ISURVEY } from "@/types/encuestas";
import { Survey, Tecnologias, Enunciados } from "@/generated/prisma";

import { calculateRemainingDays, surveyHasEnded } from "@/utils/date-formatter";
import { calculateResponsesPercents } from "@/utils/text-helper";

export default async function Page({ pageParam }: { pageParam: { slug?: string | undefined } }) {
  const session: Session | null = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");
  const { name, lastName } = session.user;

  const surveySlug: any = await pageParam;

  const [encuesta, responses, enunciados] = await Promise.all([
    getEncuestaBySlug(surveySlug.slug),
    getAllMyResponses(surveySlug.slug),//refactor
    getAllEnunciados(),
  ]);
  // get encuesta by slug, if not found redirect to estado
  const { title, tecnologias, endDate, hasEnded, isActive, ...props }: any =
    encuesta;//ref

  if (surveyHasEnded({ endDate, isActive, hasEnded })) {
    redirect("/encuestas/finalizado");
  }

  return (
    <>
      <NavBar
        encuesta={[]}
        user={session.user}
        title={""}
        session={session as Session}
        slugs={[]}
      />
      <main className="">
        <LayoutDefault>
          <h2 className="font-bold  mt-10 text-2xl ">
            <span className="block line-clamp-2">
              Hola {name} {lastName}!
            </span>
            <span className="block line-clamp-2">
              Tu contribución a {title} es del{" "}
              {calculateResponsesPercents(enunciados as any)}%
            </span>
          </h2>
          <div className="mt-4">
            <p className="mb-4">
              Puedes volver a completar, ampliar o modificar la justifiacion de
              tus respuestas.
            </p>
            <p className="pb-4 mb-4">
              A continuación te mostraremos el estado de tu encuesta.
            </p>
            <p className="pb-4 mb-4">
              Al estudio le restan {calculateRemainingDays(endDate)} días para
              finalizar
            </p>
          </div>
          <div className="max-w-3xl">
            {tecnologias &&
              tecnologias?.map((tecnologia: any) => (
                <div key={tecnologia.id} className="my-4">
                  <h2 className="text-2xl text-left font-bold mb-4">
                    {tecnologia.title}
                  </h2>
                  <div className="grid">
                    {enunciados.length > 0 &&
                      enunciados.map((enunciado: any) => (
                        <Enunciado
                          key={enunciado.id}
                          tecnologia={tecnologia}
                          enunciado={enunciado}
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
