// app/(protected)/admin/encuestas/page.tsx

import { authOptions } from "@/auth.config";
import AdminEncuestas from "@/components/admin-encuestas/admin-encuestas";
import { Breadcrumbs } from "@/components/breadcrombs/breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  getResponsesForCSV,
  getAllEnunciados,
  getAllUsers,
  getEncuestas,
} from "@/lib/actions";

import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");
  //const encuestas = await getEncuestas();
  //console.log("🚀 ~ Page ~ encuestas:", encuestas);
  const pageParams = await searchParams;
  const page = Math.max(0, Number(pageParams.page ?? 0));
  const { encuestas, total, pageCount } = await getEncuestas(page);

  return (
    <section>
      <div className="flex gap-14 justify-between items-end">
        <h1 className="text-4xl font-bold leading-[1]">
          Encuestas ({encuestas.length})
        </h1>
        <div className="flex gap-8 items-center">
          <Breadcrumbs items={[{ label: "Panel", href: "/admin" }]} />
          <Button asChild>
            <Link href="/admin/crear-encuesta">Crear encuesta</Link>
          </Button>
        </div>
      </div>
      <div className="my-10">
        <AdminEncuestas
          encuestas={encuestas}
          session={session}
          page={page}
          pageCount={pageCount}
        />
      </div>
    </section>
  );
}
