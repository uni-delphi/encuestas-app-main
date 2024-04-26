import NextAuth from "next-auth"
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      /** The user's postal address. */
      id: string,
      role: string,
      name: string,
      lastName: string,
    } & DefaultSession
  }

  interface User extends DefaultUser { 
    id: string
    lastName: string
    role: string
  }

}

declare module "next-auth/jwt" { 
  interface JWT extends DefaultJWT {
    id: string
    role: string,
  }
}