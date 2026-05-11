"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Copy, Check, UserPlus, Link2 } from "lucide-react"

// Tipos
interface User {
  id: string
  email: string
  name: string
}

interface AssignedUser extends User {
  token: string
  assignedAt: Date
  status: "pending" | "completed" | "expired"
}

// Datos de ejemplo - usuarios registrados
const REGISTERED_USERS: User[] = [
  { id: "1", email: "maria.garcia@example.com", name: "María García" },
  { id: "2", email: "juan.perez@example.com", name: "Juan Pérez" },
  { id: "3", email: "ana.martinez@example.com", name: "Ana Martínez" },
  { id: "4", email: "carlos.lopez@example.com", name: "Carlos López" },
  { id: "5", email: "laura.sanchez@example.com", name: "Laura Sánchez" },
  { id: "6", email: "pedro.fernandez@example.com", name: "Pedro Fernández" },
  { id: "7", email: "sofia.rodriguez@example.com", name: "Sofía Rodríguez" },
  { id: "8", email: "diego.moreno@example.com", name: "Diego Moreno" },
]

// Datos de ejemplo - usuarios ya asignados
const INITIAL_ASSIGNED: AssignedUser[] = [
  { id: "1", email: "maria.garcia@example.com", name: "María García", token: "abc123def456", assignedAt: new Date("2024-01-15"), status: "completed" },
  { id: "2", email: "juan.perez@example.com", name: "Juan Pérez", token: "xyz789ghi012", assignedAt: new Date("2024-01-16"), status: "pending" },
  { id: "5", email: "laura.sanchez@example.com", name: "Laura Sánchez", token: "mno345pqr678", assignedAt: new Date("2024-01-10"), status: "expired" },
]

const ITEMS_PER_PAGE = 5

function generateToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
}

export function SurveyInvitation({encuesta, usuarios}: any) {
    console.log("🚀 ~ SurveyInvitation ~ encuesta:", encuesta)
    
  // Estado para búsqueda de usuarios
  const [searchEmail, setSearchEmail] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [baseUrl, setBaseUrl] = useState("https://midominio.com/encuesta")

  // Estado para lista de asignados
  const [assignedUsers, setAssignedUsers] = useState<any[]>(usuarios)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterSearch, setFilterSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Buscar usuarios que coincidan con el email
  const searchResults = useMemo(() => {
    if (searchEmail.length < 2) return []
    return usuarios.filter(
      (user: any) => 
        user.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
        !assignedUsers.some(a => a.id === user.id)
    )
  }, [searchEmail, assignedUsers])

  // Filtrar usuarios asignados
  const filteredAssigned = useMemo(() => {
    return assignedUsers.filter(user => {
      
      const matchesSearch = 
        user.email.toLowerCase().includes(filterSearch.toLowerCase()) ||
        user.name.toLowerCase().includes(filterSearch.toLowerCase())
      return matchesSearch
    })
  }, [assignedUsers, filterStatus, filterSearch])

  // Paginación
  const totalPages = Math.ceil(filteredAssigned.length / ITEMS_PER_PAGE)
  const paginatedUsers = assignedUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Generar enlace de invitación
  const handleGenerateLink = () => {
    if (!selectedUser) return
    
    const token = generateToken()
    const link = `${baseUrl}?p=${token}`
    setGeneratedLink(link)

    // Agregar a la lista de asignados
    const newAssigned: AssignedUser = {
      ...selectedUser,
      token,
      assignedAt: new Date(),
      status: "pending",
    }
    setAssignedUsers(prev => [newAssigned, ...prev])
  }

  // Copiar enlace al portapapeles
  const handleCopyLink = async () => {
    if (!generatedLink) return
    await navigator.clipboard.writeText(generatedLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Limpiar selección
  const handleClearSelection = () => {
    setSelectedUser(null)
    setGeneratedLink(null)
    setSearchEmail("")
  }

  // Status badge
  const getStatusBadge = (status: AssignedUser["status"]) => {
    const variants: Record<AssignedUser["status"], { label: string; className: string }> = {
      pending: { label: "Pendiente", className: "bg-amber-100 text-amber-800 hover:bg-amber-100" },
      completed: { label: "Completada", className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" },
      expired: { label: "Expirada", className: "bg-slate-100 text-slate-600 hover:bg-slate-100" },
    }
    return variants[status]
  }

  return (
    <div className="space-y-6">
      {/* Sección de invitación */}
      {/*<Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invitar Usuario a Encuesta
          </CardTitle>
          <CardDescription>
            Busca un usuario registrado por email y genera un enlace de invitación único
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* URL base configurable /}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">URL base del enlace</label>
            <Input
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://midominio.com/encuesta"
            />
          </div>

          {/* Búsqueda de usuario */}
          {/*!selectedUser ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Buscar usuario por email</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="Escribe el email del usuario..."
                  className="pl-10"
                />
              </div>

              {/* Resultados de búsqueda }
              {searchResults.length > 0 && (
                <div className="rounded-md border bg-card">
                  {searchResults.map(user => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setSelectedUser(user)
                        setSearchEmail("")
                      }}
                      className="flex w-full items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors first:rounded-t-md last:rounded-b-md border-b last:border-b-0"
                    >
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}

              {searchEmail.length >= 2 && searchResults.length === 0 && (
                <p className="text-sm text-muted-foreground py-2">
                  No se encontraron usuarios con ese email o ya fueron asignados
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Usuario seleccionado /}
              <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleClearSelection}>
                  Cambiar
                </Button>
              </div>

              {/* Generar enlace /}
              {!generatedLink ? (
                <Button onClick={handleGenerateLink} className="w-full">
                  <Link2 className="mr-2 h-4 w-4" />
                  Generar Enlace de Invitación
                </Button>
              ) : (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Enlace generado</label>
                  <div className="flex gap-2">
                    <Input
                      value={generatedLink}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button onClick={handleCopyLink} variant="outline" className="shrink-0">
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4 text-emerald-600" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copiar
                        </>
                      )}
                    </Button>
                  </div>
                  <Button variant="outline" onClick={handleClearSelection} className="w-full">
                    Invitar otro usuario
                  </Button>
                </div>
              )}
            </div>
          )/}
        </CardContent>
      </Card>*/}

      {/* Sección de usuarios asignados */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Asignados</CardTitle>
          <CardDescription>
            Lista de usuarios que han recibido una invitación a mis encuestas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={filterSearch}
                onChange={(e) => {
                  setFilterSearch(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Filtrar por nombre o email..."
                className="pl-10"
              />
            </div>
            {/*<Select
              value={filterStatus}
              onValueChange={(value) => {
                setFilterStatus(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="completed">Completada</SelectItem>
                <SelectItem value="expired">Expirada</SelectItem>
              </SelectContent>
            </Select>*/}
          </div>

          {/* Tabla */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead className="hidden md:table-cell">Token</TableHead>
                  <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No se encontraron usuarios asignados
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map(user => {
                    const status = getStatusBadge(user.status)
                    return (
                      <TableRow key={user.id + user.name}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {user.assignedAt?.toLocaleDateString("es-ES")}
                        </TableCell>
                        <TableCell className="hidden">
                          <Badge className={status?.className}>
                            {status?.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredAssigned.length)} de {filteredAssigned.length}
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
