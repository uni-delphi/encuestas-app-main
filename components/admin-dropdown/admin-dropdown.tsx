"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { Session } from "next-auth";
import { TUser } from "@/types/user";

export default function AdminDropDown({
  session,
}: {
  session: Session;
}) {
  console.log("session", session);
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
            {session.user?.name}
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
