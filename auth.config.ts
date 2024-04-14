import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "@/lib/prisma";

import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any, req) {
        
        //console.log("🚀 ~ authorize ~ credentials:", credentials);
        // Add logic here to look up the user from the credentials supplied
        const user: any = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }
        // Any object returned will be saved in `user` property of the JWT
        const { password, validatedPassword, ...props } = user;
        const valid = await bcrypt.compare(credentials.password, password);

        if (!valid) {
          return null;
        }
        console.log("props", props)
        return props;
      },
    }),
  ],
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('token: ', token)
      
      if (user) {
        console.log('user: ', user)
        token.lastName = user?.lastName;
        token.role = user?.role;
      }
      return token;
    },
    async session({ session, token }) {
      //console.log('session: ', session.user)
      //console.log('token: ', token.user)

      if (session?.user) {
        session.user.lastName = token.lastName as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
