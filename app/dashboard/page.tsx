"use client"
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/auth.config";
import { getUserByEmail } from "@/lib/api/users";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default async function Dashboard() {
  /*const session = await getServerSession(authOptions);
  console.log("🚀 ~ Dashboard ~ session:", session);
  const { id } = await getUserByEmail(session?.user?.email as string);
  console.log("🚀 ~ Dashboard ~ id:", id);*/

  return (
    <>
      <div className="flex flex-col items-center gap-8 p-4 md:p-8 ">
        Dashboard
        <Button onClick={() => signOut({
          redirect: true,
          callbackUrl: '/'
        })}>sign out</Button>
      </div>
    </>
  );
}
