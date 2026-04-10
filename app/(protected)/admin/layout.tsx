// app/(admin)/layout.tsx

import { authOptions } from "@/auth.config";
import AdminLayoutComponent from "@/components/admin-layout/layout-component";
import LayoutDefault from "@/components/image-layout/image-layout";
import NavBar from "@/components/nav-bar/nav-bar";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/unauthorized");

  return (
    <main className="max-w-[1440px] mx-auto">
      <NavBar
        encuesta={[]}
        user={session.user}
        title={""}
        session={session as Session}
        slugs={[]}
      />
      <div className="min-h-screen">
        <AdminLayoutComponent>{children}</AdminLayoutComponent>
      </div>
    </main>
  );
}
