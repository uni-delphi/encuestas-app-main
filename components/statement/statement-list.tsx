"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import type { Statement } from "./statement-form"

interface StatementListProps {
  statements: Statement[]
  onDelete: (id: number) => void
}

export function StatementList({ statements, onDelete }: StatementListProps) {
  if (statements.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            No hay enunciados creados. Agrega uno usando el formulario.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Enunciados Creados ({statements.length})</h2>
      <div className="grid gap-4">
        {statements.map((statement) => (
          <Card key={statement.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{statement.title}</CardTitle>
                    <Badge variant="outline">{statement.tecnologiaTitle}</Badge>
                  </div>
                  <CardDescription className="font-mono text-xs">
                    /{statement.slug}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(statement.id)}
                  aria-label={`Eliminar ${statement.title}`}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {statement.description}
              </p>
              <div className="mt-3 text-xs text-muted-foreground">
                <p>Creado: {statement.createdAt.toLocaleDateString("es-ES")}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
