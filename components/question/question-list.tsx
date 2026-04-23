"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { questionTypeLabels, inputQuestionTypeLabels } from "@/lib/schemas/question"
import { Question } from "@/generated/prisma";

interface QuestionListProps {
  questions: Question[]
  onDelete: (id: number) => void
}

export default function QuestionList({ questions, onDelete }: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay preguntas creadas. Agrega la primera pregunta.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {questions.map((question) => (
        <Card key={question.id} className="relative">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <CardTitle className="text-base font-medium">
                  {question.text}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Enunciado: {question.text}
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Eliminar pregunta</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar pregunta</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminará permanentemente
                      la pregunta &quot;{question.text}&quot;.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(question.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {/*question.description && (
              <p className="text-sm text-muted-foreground mb-3">
                {question.description}
              </p>
            )*/}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {questionTypeLabels[question.type]}
              </Badge>
              {question.inputType && (
                <Badge variant="outline">
                  {inputQuestionTypeLabels[question.inputType]}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
