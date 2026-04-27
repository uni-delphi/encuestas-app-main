import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth.config";

import { getMyEncuestasByAssigned } from "@/lib/actions";
import { redirectStrategy } from "@/lib/constants";

import AdminLayoutComponent from "@/components/admin-layout/layout-component";
import NavBar from "@/components/nav-bar/nav-bar";
import UserEncuestas from "@/components/user-encuestas/user-encuestas";


export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/acceso");
  const { name, role } = session.user;
  if (role !== "USER") redirect(redirectStrategy[role]);

  const pageParams = await searchParams;
  const page = Math.max(0, Number(pageParams.page ?? 0));

  const {
    encuestas,
    total,
    pageCount,
  }: { encuestas: any[]; total: number; pageCount: number } =
    await getMyEncuestasByAssigned(page, 10);

  return (
    <>
      <NavBar
        encuesta={[]}
        user={session.user}
        title={""}
        session={session as Session}
        slugs={[]}
      />
      <div className="min-h-screen">
        <AdminLayoutComponent>
          <section className="px-10 py-20">
            <div className="flex items-center justify-between gap-4 mb-10">
              <h1 className="font-bold text-4xl">
                Todas mis encuestas ({total})
              </h1>
            </div>
            <div className="flex flex-col gap-5">
              <UserEncuestas
                encuestas={encuestas}
                urlLink={"encuestas/estado"}
                page={page}
                pageCount={pageCount}
              />
            </div>
          </section>
        </AdminLayoutComponent>
      </div>
    </>
  );
}
