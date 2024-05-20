import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "./global.scss";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/session-provider/session-provider";
import { authOptions } from "@/auth.config";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Delphi - Campus Norte UNC",
  description:
    "Herramienta desarrollada por Campus Norte UNC que utiliza el modelo SENAI de Prospectiva Ocupacional para anticipar los efectos de tecnologías emergentes en el trabajo y la formación.",
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  maximumScale: 1,
  viewportFit: "cover",
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
          {children}
        </SessionProvider>
        <Toaster />
        <Analytics/>
        <SpeedInsights/>
      </body>
    </html>
  );
}
