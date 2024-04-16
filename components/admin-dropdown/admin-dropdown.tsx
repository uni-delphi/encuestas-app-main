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
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export default function AdminDropDown({
  session,
}: {
  session: Session;
}) {
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative" asChild>
        <Avatar className="h-9 w-9 ml-4 cursor-pointer relative">
          {/* <AvatarImage alt="@shadcn" src={session.user?.image as string} /> */}
          <AvatarFallback className="text-blue-700">
            {session.user?.name?.charAt(0)}
          </AvatarFallback>

          <span className="sr-only">Desplegar menú de usuario</span>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link
            href={"/dashboard/configuracion/perfil"}
            className="font-bold cursor-pointer"
          >
            {session.user.lastName} {session.user.name}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button
            onClick={() =>
              signOut({
                redirect: true,
                callbackUrl: "/",
              })
            }
            className="cursor-pointer"
          >
            Cerrar sesión
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
