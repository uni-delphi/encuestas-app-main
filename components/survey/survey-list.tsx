"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Calendar, Users } from "lucide-react"
import type { Survey } from "./survey-form"

interface SurveyListProps {
  surveys: Survey[]
  onDelete: (id: number) => void
}

export function SurveyList({ surveys, onDelete }: SurveyListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date()
  }

  if (surveys.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No hay encuestas creadas aun. Crea tu primera encuesta arriba.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Encuestas ({surveys.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-4">
          {surveys.map((survey) => {
            const expired = isExpired(survey.endDate)
            
            return (
              <li
                key={survey.id}
                className="flex flex-col gap-3 rounded-lg border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {survey.title}
                      </h3>
                      <div className="flex gap-1">
                        {survey.isActive && !expired ? (
                          <Badge variant="default">Activa</Badge>
                        ) : expired ? (
                          <Badge variant="destructive">Finalizada</Badge>
                        ) : (
                          <Badge variant="secondary">Inactiva</Badge>
                        )}
                      </div>
                    </div>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      /{survey.slug}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(survey.id)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar encuesta</span>
                  </Button>
                </div>

                {survey.description && (
                  <p className="text-sm text-muted-foreground">
                    {survey.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Finaliza: {formatDate(survey.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{survey.responseCount} respuestas</span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}