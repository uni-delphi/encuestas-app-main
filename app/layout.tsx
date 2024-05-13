import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./global.scss";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/session-provider/session-provider";
import { authOptions } from "@/auth.config";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Delphi - Campus Norte UNC",
  description: "Herramienta desarrollada por Campus Norte UNC que utiliza el modelo SENAI de Prospectiva Ocupacional para anticipar los efectos de tecnologías emergentes en el trabajo y la formación.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <title>Delphi - Campus Norte UNC</title>
        <meta
          name="description"
          content="Herramienta desarrollada por Campus Norte UNC que utiliza el Modelo SENAI de Prospectiva Ocupacional para anticipar los efectos de tecnologías emergentes en el trabajo y la formación"
        />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
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
