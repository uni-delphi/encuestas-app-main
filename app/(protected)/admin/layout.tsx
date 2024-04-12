import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";

import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Plataforma de venta de entradas online",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  /*if (!session || !session.user) {
    redirect("/");
  }*/
  return (
    <>
      {/* Agregar navecaion del dashboard aca */}
      <div className="flex flex-col items-center gap-8 p-4 md:p-8 mx-auto w-full">
        {children}
      </div>
      <Toaster />
    </>
  );
}
