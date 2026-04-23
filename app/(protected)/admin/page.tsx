// app/(protected)/admin/page.tsx
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";

import {
  getResponsesForCSV,
  getAllEnunciados,
  getAllUsers,
  getEncuestas,
} from "@/lib/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");

  return (
    <section className="">
      <div>
        <h1 className="text-4xl font-bold mb-10">Panel</h1>
        
      </div>
      <div className="flex gap-4">
        <div className="w-1/2">
          <Link href="/admin/encuestas">
            <div className="border rounded-lg py-8 px-6 flex flex-col gap-4 shadow">
              <h3 className="text-2xl font-bold">Encuestas</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsam
                numquam repudiandae ducimus esse, tenetur sunt animi pariatur
                aperiam. Omnis nemo dicta aut. Soluta commodi obcaecati, ratione
                adipisci sapiente maiores recusandae.
              </p>
            </div>
          </Link>
        </div>
        <div className="w-1/2">
          <Link href="/admin/usuarios">
            <div className="border rounded-lg py-8 px-6 flex flex-col gap-4 shadow">
              <h3 className="text-2xl font-bold">Usuarios</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsam
                numquam repudiandae ducimus esse, tenetur sunt animi pariatur
                aperiam. Omnis nemo dicta aut. Soluta commodi obcaecati, ratione
                adipisci sapiente maiores recusandae.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
