// app/(protected)/admin/usuarios/page.tsx

import { authOptions } from "@/auth.config";
import { Breadcrumbs } from "@/components/breadcrombs/breadcrumbs";
import { PaginationControls } from "@/components/pagination-controls/pagination-controls";
import { UserCard } from "@/components/user-card/user-card";
import { getAllUsers } from "@/lib/actions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");

  const pageParams = await searchParams;
  const page = Math.max(0, Number(pageParams.page ?? 0));
  const { usuarios, total, pageCount } = await getAllUsers(page, 10);
  console.log("🚀 ~ Page ~ data:", usuarios)
  
  return (
    <section>
      <div className="flex gap-14 items-end justify-between">
        <h1 className="text-4xl font-bold leading-[1]">Usuarios ({total})</h1>
        <Breadcrumbs items={[{ label: "Panel", href: "/admin" }]} />
      </div>
      <div className="my-10 flex flex-col gap-4 pl-[20vw]">
        {usuarios.map((user: any, i: number) => (
          <UserCard key={i} user={user} />
        ))}
        <PaginationControls page={page} pageCount={pageCount} />
      </div>
    </section>
  );
}

export default Page;
