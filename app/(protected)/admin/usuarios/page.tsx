// app/(protected)/admin/usuarios/page.tsx

import { authOptions } from "@/auth.config";
import { Breadcrumbs } from "@/components/breadcrombs/breadcrumbs";
import { UserCard } from "@/components/user-card/user-card";
import { getAllUsers } from "@/lib/api/users";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function Page() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");

  const data = await getAllUsers();
  console.log("🚀 ~ Page ~ data:", data)
  
  return (
    <section>
      <div className="flex gap-14 items-end">
        <h1 className="text-4xl font-bold leading-[1]">Usuarios /</h1>
        <Breadcrumbs items={[{ label: "Dashboard", href: "/admin" }]} />
      </div>
      <div className="my-10 flex flex-col gap-4 pl-[20vw]">
        {data.map((user: any, i: number) => (
          <UserCard key={i} user={user} />
        ))}
      </div>
    </section>
  );
}

export default Page;
