"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";

import Link from "next/link";

import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import Image from "next/image";

export default function AdminDropDown({
  session,
  title,
}: {
  session: Session;
  title: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative" asChild>
        <Avatar
          className={`h-9 w-9 ml-4 cursor-pointer ${
            title && "fixed top-16 right-2"
          }`}
        >
          {/* <AvatarImage alt="@shadcn" src={session.user?.image as string} /> */}
          <AvatarFallback className="text-blue-600">
            <Image src={"/menu.svg"} alt="hamburger" width={15} height={15} />
          </AvatarFallback>

          <span className="sr-only">Desplegar menú de usuario</span>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>¡Hola {session.user.name}!</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {session.user.role === "USER" ? (
          <>
            <DropdownMenuItem>
              <Link href={"/bienvenido"} className="cursor-pointer w-[100%]">
                Bienvenida
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={"/estado"} className="cursor-pointer w-[100%]">
                Estado
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={"/finalizado"} className="cursor-pointer w-[100%]">
                Más del estudio
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ) : null}
        <Button
          onClick={() =>
            signOut({
              redirect: true,
              callbackUrl: "/",
            })
          }
          className="bg-blue-600 text-white hover:bg-gray-200 hover:text-blue-600"
        >
          Cerrar sesión
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
