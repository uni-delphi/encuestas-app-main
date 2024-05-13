import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./global.scss";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/session-provider/session-provider";
import { authOptions } from "@/auth.config";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Entrevistas Delphi - Campus Norte UNC",
  description: "Estudios e investigaciones.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionProvider session={session}>
        {/*<NavBar user={user} session={session as Session} />*/}
          {children}
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
