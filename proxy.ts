import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

import { RoleType } from "@/generated/prisma";
import { hasRole } from "@/lib/permissions";


// Rutas protegidas y el rol mínimo requerido
const PROTECTED_ROUTES: { pattern: RegExp; requiredRole: RoleType }[] = [
  // Solo ADMIN
  { pattern: /^\/admin(\/.*)?$/,           requiredRole: RoleType.ADMIN },
  { pattern: /^\/api\/admin(\/.*)?$/,      requiredRole: RoleType.ADMIN },
 
  // ADMIN o RESEARCHER
  { pattern: /^\/dashboard\/surveys\/new/, requiredRole: RoleType.RESEARCHER },
  { pattern: /^\/dashboard\/surveys\/\d+\/edit/, requiredRole: RoleType.RESEARCHER },
  { pattern: /^\/api\/surveys$/,           requiredRole: RoleType.RESEARCHER }, // POST
  { pattern: /^\/dashboard(\/.*)?$/,       requiredRole: RoleType.RESEARCHER },
 
  // Cualquier usuario autenticado
  { pattern: /^\/survey(\/.*)?$/,          requiredRole: RoleType.USER },
  { pattern: /^\/api\/responses(\/.*)?$/,  requiredRole: RoleType.USER },
];

export default withAuth(
  function middleware(req: NextRequestWithAuth, res) {
    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      req.nextauth.token?.role !== "ADMIN"
    ) {
      return NextResponse.rewrite(new URL("/denied", req.url));
    }

    if (
      (req.nextUrl.pathname.startsWith("/bienvenido") ||
        req.nextUrl.pathname.startsWith("/finalizado") ||
        req.nextUrl.pathname.startsWith("/estado")) &&
      req.nextauth.token?.role !== "USER"
    ) {
      return NextResponse.rewrite(new URL("/admin", req.url));
    }

    /**
     * 
     * const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;
 
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
 
    const userRole = token.role as RoleType;
 
    for (const route of PROTECTED_ROUTES) {
      if (route.pattern.test(pathname)) {
        if (!hasRole(userRole, route.requiredRole)) {
          // Redirigir con mensaje de error según rol
          const redirectUrl = new URL("/unauthorized", req.url);
          redirectUrl.searchParams.set("required", route.requiredRole);
          return NextResponse.redirect(redirectUrl);
        }
        break;
      }
    }
 
    return NextResponse.next();
     */
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/admin", "/estado/:path*", "/bienvenido", "/finalizado"],
};
