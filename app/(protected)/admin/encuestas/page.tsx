// app/(protected)/admin/encuestas/page.tsx

import { authOptions } from "@/auth.config";
import AdminEncuestas from "@/components/admin-encuestas/admin-encuestas";
import { Breadcrumbs } from "@/components/breadcrombs/breadcrumbs";
import {
  getResponsesForCSV,
  getAllEnunciados,
  getAllUsers,
  getEncuesta,
} from "@/lib/actions";

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");
  const encuestas = await getEncuesta();
  console.log("🚀 ~ Page ~ encuestas:", encuestas)

  return (
    <section>
      <div className="flex gap-14 justify-between items-end">
        <h1 className="text-4xl font-bold leading-[1]">Encuestas /</h1>
        <Breadcrumbs items={[{ label: "Dashboard", href: "/admin" }]} />
      </div>
      <div className="my-10">
        <AdminEncuestas encuestas={encuestas} />
      </div>
    </section>
  );
}
