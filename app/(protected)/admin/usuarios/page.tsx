// app/(protected)/admin/usuarios/page.tsx

import { authOptions } from "@/auth.config";
import { getAllUsers } from "@/lib/api/users";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function Page() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");

  const data = await getAllUsers();
  return (
    <section>
      <h1 className='text-4xl font-bold'>Usuarios</h1>
      <p>Filtros y paginado</p>
      <div className="my-10 flex flex-col gap-4 pl-[20vw]">
        {data.map((user: any, i: number) => (
          <div key={i} className="bg-gray-300 p-5 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{user.email}</h2>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Page;
