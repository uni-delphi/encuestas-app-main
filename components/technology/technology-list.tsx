"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"

export interface Tecnologia {
  id: number
  title: string
  description?: string
  slug: string
  endDate: string
  isActive: boolean
  createdAt: Date
}

interface TechnologyListProps {
  tecnologias: Tecnologia[]
  onDelete: (id: number) => void
}

export function TechnologyList({ tecnologias, onDelete }: TechnologyListProps) {
  if (tecnologias.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            No hay tecnologias creadas. Agrega una usando el formulario.
          </p>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Tecnologias Creadas ({tecnologias.length})</h2>
      <div className="grid gap-4">
        {tecnologias.map((tech) => (
          <Card key={tech.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{tech.title}</CardTitle>
                    <Badge variant={tech.isActive ? "default" : "secondary"}>
                      {tech.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <CardDescription className="font-mono text-xs">
                    /{tech.slug}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(tech.id)}
                  aria-label={`Eliminar ${tech.title}`}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {tech.description && (
                <p className="text-sm text-muted-foreground">{tech.description}</p>
              )}
              <div className="mt-3 flex flex-col gap-1 text-xs text-muted-foreground">
                <p>Finaliza: {formatDate(tech.endDate)}</p>
                <p>Creado: {tech.createdAt.toLocaleDateString("es-ES")}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
