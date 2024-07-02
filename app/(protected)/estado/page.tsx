import { authOptions } from "@/auth.config";
import { Session, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  getAllEncuestas,
  getAllEnunciados,
  getAllMyResponses,
} from "@/lib/actions";

import NavBar from "@/components/nav-bar/nav-bar";
import LayoutDefault from "@/components/image-layout/image-layout";
import Enunciado from "@/components/enunciado/enunciado";
import { IENUNCIADO, ISURVEY } from "@/types/encuestas";

import { calculateRemainingDays, surveyHasEnded } from "@/utils/date-formatter";
import { calculateResponsesPercents } from "@/utils/text-helper";

export default async function Encuestas() {
  const session: Session | null = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");
  const { name, lastName } = session.user;

  const encuestas: ISURVEY[] = await getAllEncuestas(session.user.id);
  const { title, tecnologias, endDate, hasEnded, isActive, ...props } =
    encuestas[0] ?? [];

  const responses: any[] = await getAllMyResponses(session.user.id);
  const enunciados: any[] = await getAllEnunciados();
  
  if (surveyHasEnded({ endDate, isActive, hasEnded })) {
    redirect("/finalizado");
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
              Tu contribución a {title} es del {calculateResponsesPercents(responses.length, enunciados)}%
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
              tecnologias.map((tecnologia: any) => (
                <div key={tecnologia.id} className="my-4">
                  <h2 className="text-2xl text-left font-bold mb-4">
                    {tecnologia.title}
                  </h2>
                  <div className="grid">
                    {tecnologia.enunciados &&
                      tecnologia.enunciados.map((enunciado: IENUNCIADO) => (
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
