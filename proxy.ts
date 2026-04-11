import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { RoleType } from "@/generated/prisma";
import { hasRole } from "@/lib/permissions";

const PROTECTED_ROUTES: { pattern: RegExp; requiredRole: RoleType }[] = [
  // ADMIN only
  { pattern: /^\/admin(\/.*)?$/,                          requiredRole: RoleType.ADMIN },

  // RESEARCHER or above
  { pattern: /^\/investigador(\/.*)?$/,                   requiredRole: RoleType.RESEARCHER },

  // Any authenticated user
  { pattern: /^\/bienvenido$/,                            requiredRole: RoleType.USER },
  { pattern: /^\/estado(\/.*)?$/,                         requiredRole: RoleType.USER },
  { pattern: /^\/finalizado$/,                            requiredRole: RoleType.USER },
];

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const userRole = req.nextauth.token?.role as RoleType | undefined;

    if (!userRole) {
      const loginUrl = new URL("/acceso", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    for (const { pattern, requiredRole } of PROTECTED_ROUTES) {
      if (pattern.test(pathname)) {
        if (!hasRole(userRole, requiredRole)) {
          const loginUrl = new URL("/acceso", req.url);
          loginUrl.searchParams.set("callbackUrl", pathname);
          return NextResponse.redirect(loginUrl);
        }
        break;
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // False here means NextAuth redirects to /acceso before middleware even runs
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/acceso",
    },
  },
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/investigador/:path*",
    "/bienvenido",
    "/estado/:path*",
    "/finalizado",
  ],
};