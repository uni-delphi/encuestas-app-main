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
  getEncuestas,
} from "@/lib/actions";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import AdminEncuestas from "@/components/admin-encuestas/admin-encuestas";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");
  
  const pageParams = await searchParams;
  const page = Math.max(0, Number(pageParams.page ?? 0));

  const { name } = session.user;
  const {
    encuestas,
    total,
    pageCount,
  }: { encuestas: any[]; total: number; pageCount: number } =
    await getEncuestas(page);
  const urlLink =
    session?.user.role === "ADMIN"
      ? "/admin/encuestas"
      : "/investigador/encuestas";

  return (
    <section className="px-10 py-20">
      <div className="flex items-center justify-between gap-4 mb-10">
        <h1 className="font-bold text-4xl">Todas mis encuestas</h1>
        <Button asChild>
          <Link href="/investigador/crear-encuesta">Crear encuesta</Link>
        </Button>
      </div>
      <div className="flex flex-col gap-5">
        <AdminEncuestas encuestas={encuestas} urlLink={urlLink} page={page} pageCount={10} />
      </div>
    </section>
  );
}
