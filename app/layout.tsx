import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "./global.scss";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/session-provider/session-provider";
import { authOptions } from "@/auth.config";
import { Toaster } from "@/components/ui/toaster";
import {
  GOOGLE_ANALYTICS_ID,
  IS_PROD,
  SITE_DESCRPTION,
  SITE_LANG,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_NAME}`,
    default: SITE_NAME,
  },
  description: SITE_DESCRPTION,
  metadataBase: new URL(SITE_URL),
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
    <html lang={SITE_LANG}>
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
        {IS_PROD && GOOGLE_ANALYTICS_ID && (
          <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
        )}
        <Toaster />
        <Analytics/>
        <SpeedInsights/>
      </body>
    </html>
  );
}
