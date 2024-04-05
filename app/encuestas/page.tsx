import EncuestaForm from "@/components/encuesta-form/encuesta-form";
import NavBar from "@/components/nav-bar/nav-bar";

import { TUser } from "@/types/user";
import { Session } from "next-auth";


export default async function Encuestas() {
  // const { events } = await getData() || {};

  return (
    <main className="">
      <NavBar user={{} as TUser} session={{} as Session} />

      <div className="px-4 overflow-hidden">
        <h2 className="pt-20 mt-5 pb-2 text-center mx-auto">Uso y aplicación de tecnologías 3D en producción y mantenimiento de repuestos o componentes</h2>
        <hr />
        <EncuestaForm />
      </div>
    </main>
  );
}
