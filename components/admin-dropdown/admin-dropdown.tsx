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
          <AvatarFallback className="text-blue-700">
            <Image src={"/menu.svg"} alt="image" width={15} height={15} />
          </AvatarFallback>

          <span className="sr-only">Desplegar menú de usuario</span>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="pt-8">
        <Button className="bg-white absolute right-0 top-1">
          <Image src={"/x.svg"} alt="image" width={20} height={20} />
        </Button>
        <DropdownMenuLabel>
          ¡Hola {session.user.lastName} {session.user.name}!
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/estado"} className="font-bold cursor-pointer">
            Estado
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={"/finalizado"} className="font-bold cursor-pointer">
            Finalizado
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
