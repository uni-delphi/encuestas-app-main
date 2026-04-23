// app/(protected)/admin/encuestas/page.tsx

import type { Prisma } from "@/generated/prisma";

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

type EncuestaConRelaciones = Prisma.SurveyGetPayload<{
  include: {
    createdBy: true;
    tecnologias: {
      include: { enunciados: true };
    };
  };
}>;

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");

  const pageParams = await searchParams;
  const page = Math.max(0, Number(pageParams.page ?? 0));
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
    <section>
      <div className="flex gap-14 justify-between items-end">
        <h1 className="text-4xl font-bold leading-[1]">Encuestas ({total})</h1>
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
          urlLink={urlLink}
          page={page}
          pageCount={pageCount}
        />
      </div>
    </section>
  );
}
