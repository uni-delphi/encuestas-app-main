// app/(researcher)/layout.tsx

import { redirect } from "next/navigation";
import { ROLE_HIERARCHY } from "@/lib/permissions";
import { authOptions } from "@/auth.config";
import { getServerSession, Session } from "next-auth";
import LayoutDefault from "@/components/image-layout/image-layout";
import AdminLayoutComponent from "@/components/admin-layout/layout-component";
import NavBar from "@/components/nav-bar/nav-bar";

export default async function ResearcherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");
  if (ROLE_HIERARCHY[session.user.role] < ROLE_HIERARCHY["RESEARCHER"]) {
    redirect("/unauthorized");
  }

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
