import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth.config";
import { getServerSession, Session } from "next-auth";

import LayoutDefault from "@/components/image-layout/image-layout";
import NavBar from "@/components/nav-bar/nav-bar";

import {
  getResponsesForCSV,
  getAllEnunciados,
  getAllUsers,
  getEncuesta,
} from "@/lib/actions";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");
  const { name } = session.user;
  const encuestas = await getEncuesta();
  console.log("🚀 ~ Page ~ encuestas:", encuestas[0]);

  return (
    <section className="px-10 py-20">
      <div className="flex items-center justify-between gap-4 mb-10">
        <h1 className="font-bold text-4xl">Todas mis encuestas</h1>
        <Button asChild>
          <Link href="/investigador/crear-encuesta">Crear encuesta</Link>
        </Button>
      </div>
      <div className="flex flex-col gap-5">
        {encuestas &&
          encuestas.map((encuesta: any, _: number) => (
            <Link
              key={_}
              href={`/encuestas/${encuesta.slug}`}
              className={cn(
                "border border-gray-200 shadow-md rounded-lg p-4 flex flex-col gap-5 bg-[#EAEAEA]",
              )}
            >
              <div className="flex flex-row gap-4">
                <h2 className="text-2xl text-gray-800 font-semibold text-left py-2 md:py-0 flex-auto w-full md:w-2/3 text-pretty">
                  {encuesta.title}
                </h2>
                <div className="w-full md:w-1/3 p-2 md:text-right">
                  <div className="mb-2">
                    Finaliza {encuesta.endDate?.toLocaleDateString()}
                  </div>
                  <span
                    className={cn(
                      encuesta.isActive
                        ? "bg-green-500 text-white px-4 py-1 rounded-full"
                        : "bg-red-500 text-white px-4 py-1 rounded-full",
                    )}
                  >
                    {encuesta.isActive ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
              <div className="flex gap-4">
                <p className="text-gray-600 text-sm text-left flex-auto py-2 md:py-0 w-full md:w-2/3">
                  {encuesta.description}
                </p>
              </div>
              <div>
                <h3 className="mb-2">
                  <span className="text-md">Tecnologías</span>
                </h3>
                <div className="flex flex-col gap-1">
                  {encuesta.tecnologias.map(
                    (tecnologia: any, index: number) => (
                      <ul
                        key={index}
                        className="flex flex-row items-center gap-2 text-sm"
                      >
                        <li className="">
                          - {tecnologia.title}
                          <span className="">
                            {tecnologia.enunciados.length > 0 &&
                              ` - ${tecnologia.enunciados.length} enunciados`}
                          </span>
                        </li>
                      </ul>
                    ),
                  )}
                </div>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}
