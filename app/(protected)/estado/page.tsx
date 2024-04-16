import { authOptions } from "@/auth.config";

import NavBar from "@/components/nav-bar/nav-bar";

import { TUser } from "@/types/user";
import { Session, getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Encuestas() {
  const session = await getServerSession(authOptions);  
  if (!session || !session.user) redirect("/");
  
  return (
    <main className="">
      <NavBar
        tecnologia={{}}
        title={"Dashboard" as string}
        session={session as Session}
      />

      <div className="overflow-hidden">
        <h1 style={{
        marginTop: "8rem",
      }}>Esta es estado</h1>
        <hr />
        <h2 className="pt-20 mt-5 pb-2 text-center mx-auto">
          Uso y aplicación de tecnologías 3D en producción y mantenimiento de
          repuestos o componentes
        </h2>
      </div>
    </main>
  );
}
