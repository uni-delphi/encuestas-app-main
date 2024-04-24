import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { getAllEncuestas } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import NavBar from "@/components/nav-bar/nav-bar";
import { redirect } from "next/navigation";
/* import BarChartAdmin from "@/components/bar-chart/bar-chart"; */

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");
  /* const encuestas: any = await getAllEncuestas(); */
  return (
    <main className="flex flex-col items-center gap-8 p-4 md:p-8 ">
      <NavBar
        tecnologia={{}}
        title={"Dashboard" as string}
        session={session as Session}
      />
      {/* <section className="mt-32 w-full h-screen">
        <BarChartAdmin />
      </section> */}
      {/* {encuestas &&
        encuestas?.map((encuesta: any) => (
          <div key={encuesta?.id}>
            <h1
              style={{
                marginTop: "8rem",
              }}
            >
              {encuesta?.title}
            </h1>
            <p>{encuesta?.description}</p>
            {JSON.stringify(encuesta?.tecnologias)}
          </div>
        ))} */}
    </main>
  );
}
