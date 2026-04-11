
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Mail, Calendar, Shield, Pencil, Trash2, UserCog } from "lucide-react"

interface User {
  id: string
  name?: string | null
  email: string
  image?: string | null
  role?: string
  createdAt?: Date | string
  isActive?: boolean
}

interface UserCardProps {
  user: User
  onEdit?: (user: User) => void
  onDelete?: (user: User) => void
  onManageRole?: (user: User) => void
}

function getInitials(name?: string | null, email?: string): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
  return email?.charAt(0).toUpperCase() || "U"
}

function formatDate(date?: Date | string): string {
  if (!date) return "N/A"
  const d = new Date(date)
  return d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function getRoleBadgeVariant(role?: string): "default" | "secondary" | "destructive" | "outline" {
  switch (role?.toLowerCase()) {
    case "admin":
      return "default"
    case "moderator":
      return "secondary"
    default:
      return "outline"
  }
}

export function UserCard({ user, onEdit, onDelete, onManageRole }: UserCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.image || undefined} alt={user.name || user.email} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {getInitials(user.name, user.email)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground truncate">
              {user.name || "Sin nombre"}
            </h3>
            {user.role && (
              <Badge variant={getRoleBadgeVariant(user.role)} className="shrink-0">
                <Shield className="mr-1 h-3 w-3" />
                {user.role}
              </Badge>
            )}
            {user.isActive !== undefined && (
              <Badge
                variant={user.isActive ? "default" : "destructive"}
                className={`shrink-0 ${user.isActive ? "bg-green-500 hover:bg-green-600" : ""}`}
              >
                {user.isActive ? "Activo" : "Inactivo"}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 truncate">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{user.email}</span>
            </span>
            {user.createdAt && (
              <span className="flex items-center gap-1 shrink-0">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(user.createdAt)}
              </span>
            )}
          </div>
        </div>

        {(onEdit || onDelete || onManageRole) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Acciones del usuario</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(user)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
              )}
              {onManageRole && (
                <DropdownMenuItem onClick={() => onManageRole(user)}>
                  <UserCog className="mr-2 h-4 w-4" />
                  Gestionar rol
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(user)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardContent>
    </Card>
  )
}
