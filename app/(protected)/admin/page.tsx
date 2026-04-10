// app/(protected)/admin/page.tsx
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";

import {
  getResponsesForCSV,
  getAllEnunciados,
  getAllUsers,
  getEncuesta,
} from "@/lib/actions";


export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");
  
  return (
    <>
      <h2 className="font-bold text-center my-10 text-2xl">
        aca viene el dashboard del admin, con las encuestas, resultados, etc
      </h2>
    </>
  );
}
