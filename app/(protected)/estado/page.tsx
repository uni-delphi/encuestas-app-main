import { authOptions } from "@/auth.config";

import NavBar from "@/components/nav-bar/nav-bar";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import { TUser } from "@/types/user";
import { Session, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getAllEncuestas } from "@/lib/actions";
import LogosUnc from "@/components/logos-unc/logos-unc";

export default async function Encuestas() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");
  const { name, lastName } = session.user;

  const encuestas: any = await getAllEncuestas();
  const { title, description, tecnologias } = encuestas[0];
  console.log("🚀 ~ encuestaUrl:", title);

  return (
    <main className="">
      <NavBar
        tecnologia={{}}
        title={"Dashboard" as string}
        session={session as Session}
      />
      <div className="grid grid-cols-1 xl:grid-cols-2 h-screen">
        <section className="w-full">
          <Image
            src={"/eccampus-temporal.jpg"}
            alt="image"
            width={200}
            height={160}
            sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
            className="lg:h-lvh  w-full hidden md:block md:sticky top-0"
            style={{ objectFit: "cover" }}
          />
        </section>
        <section
          style={{
            marginTop: "8rem",
          }}
          className="w-full px-12 text-textColor my-4"
        >
          <div>
            <LogosUnc />
            <h2 className="font-bold  mt-10 text-2xl ">
              <span className="block line-clamp-2">
                Hola {name} {lastName}!
              </span>
              <span className="block line-clamp-2">
                Tu contribución a {title} es del 83%
              </span>
            </h2>
            <div className="max-w-[80%] mt-1">
              <p className="mb-4">
                Puedes volver a completar, ampliar o modificar la justifiacion
                de tus respuestas.
              </p>
              <p className="pb-4 mb-4">
                A continuación te mostraremos el estado de tu encuesta.
              </p>
              <p className="pb-4 mb-4">
                Al estudio le restan nn días para finalizar
              </p>
            </div>
          </div>
          <div className="max-w-3xl">
            {tecnologias &&
              tecnologias.map((tecnologia: any, index: number) => (
                <div key={tecnologia.id} className="my-4">
                  <h1 className="text-2xl font-bold mb-4">
                    {index + 1}-{tecnologia.title}
                  </h1>
                  <div className="grid">
                    {tecnologia.enunciados &&
                      tecnologia.enunciados.map((enunciado: any) => (
                        <div
                          key={enunciado.id}
                          className="bg-[#EAEAEA] shadow-md rounded-lg p-4 flex flex-col md:flex-row cols-12 items-center"
                        >
                          <p className="text-gray-800 font-semibold py-2 md:py-0 flex-auto w-full md:w-1/3">
                            Por Empezar
                          </p>
                          <p className="text-gray-600 flex-auto py-2 md:py-0 w-full md:w-1/3">
                            {enunciado.title}
                          </p>
                          <div className="flex-auto w-full py-2 md:py-0 md:w-1/3 text-right">
                            <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                              Responder
                            </Button>
                          </div>
                        </div>
                      ))}
                    {/*
                    <div className="bg-[#CCE8D4] shadow-md rounded-lg p-4 flex items-center">
                        <p className="text-gray-800 font-semibold flex-auto w-1/3">
                          Completa
                        </p>
                        <p className="text-gray-600 flex-auto w-1/3">
                          Enunciado 1
                        </p>
                        <div className="flex-auto w-1/3 text-center">
                          <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Editar
                          </Button>
                        </div>
                      </div>
                    <div className="bg-[#FFFFBF] shadow-md rounded-lg p-4 flex cols-12 items-center">
                      <p className="text-gray-800 font-semibold flex-auto w-1/3">
                        Casi Listo
                      </p>
                      <p className="text-gray-600 flex-auto w-1/3">
                        Enunciado 2
                      </p>
                      <div className="flex-auto w-1/3 text-center">
                        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                          Ampliar
                        </Button>
                      </div>
                    </div>
                    */}
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}
