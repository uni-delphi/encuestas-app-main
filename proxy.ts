import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

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
      return NextResponse.rewrite(new URL('/admin', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin", "/estado/:path*", "/bienvenido", "/finalizado"],
};
