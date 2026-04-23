import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { RoleType } from "@/generated/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: RoleType;
      name: string;
      lastName: string;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    id: string;
    role: RoleType;
    lastName: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: RoleType;
    lastName: string;  // faltaba en tu versión
  }
}