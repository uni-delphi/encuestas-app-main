"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";

import { Enunciados } from "@/generated/prisma";

export type QuestionType = "OPEN" | "SINGLE_CHOICE" | "CHECKBOX";
export type InputQuestionType = "TEXT" | "TEXTAREA" | "NUMBER" | "DATE";

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  inputType?: InputQuestionType | null;
  additionalInfo?: string | null;
  createdAt: Date;
  updatedAt: Date;
  isActive?: boolean;
}

interface StatementListProps {
  enunciados: (Enunciados & { 
    tecnologiaTitle: string;
    questions?: Question[];
  })[];
  onDelete: (id: number) => void;
  onEdit: (statement: Enunciados) => void;
  onToggleQuestion?: (enunciadoId: number, questionId: number, isActive: boolean) => void;
}

export function StatementList({
  enunciados,
  onDelete,
  onEdit,
  onToggleQuestion,
}: StatementListProps) {
  console.log("🚀 ~ StatementList ~ enunciados:", enunciados)
  
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});

  const toggleExpanded = (id: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getQuestionTypeBadge = (type: QuestionType) => {
    const variants: Record<QuestionType, { label: string; variant: "default" | "secondary" | "outline" }> = {
      OPEN: { label: "Abierta", variant: "secondary" },
      SINGLE_CHOICE: { label: "Opción única", variant: "default" },
      CHECKBOX: { label: "Múltiple", variant: "outline" },
    };
    return variants[type] || { label: type, variant: "secondary" };
  };

  if (enunciados.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            No hay enunciados creados. Agrega uno usando el formulario.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">
        Enunciados Creados ({enunciados.length})
      </h2>
      <div className="grid gap-4">
        {enunciados.map((enunciado) => (
          <Card key={enunciado.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col gap-2 mb-4">
                    <CardTitle className="text-lg text-balance">
                      {enunciado.title}
                    </CardTitle>
                    <span>
                      <Badge variant="default" className="rounded-full px-4">
                        {enunciado?.tecnologiaTitle ?? "Sin tecnología"}
                      </Badge>
                    </span>
                  </div>
                  <CardDescription className="font-mono text-xs">
                    /{enunciado.slug}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(enunciado)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(enunciado.id)}
                  aria-label={`Eliminar ${enunciado.title}`}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {enunciado.description}
              </p>
              <div className="mt-3 text-xs text-muted-foreground">
                <p>Creado: {enunciado.createdAt.toLocaleDateString("es-ES")}</p>
              </div>

              {/* Questions Section */}
              {enunciado.questions && enunciado.questions.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <button
                    onClick={() => toggleExpanded(enunciado.id)}
                    className="flex w-full items-center justify-between text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      Preguntas
                      <Badge variant="secondary" className="rounded-full text-xs">
                        {enunciado.questions.length}
                      </Badge>
                    </span>
                    {expandedCards[enunciado.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {expandedCards[enunciado.id] && (
                    <div className="mt-3 space-y-3">
                      {enunciado.questions.map((question) => {
                        console.log("🚀 ~ StatementList ~ question:", question)
                        
                        const typeBadge = getQuestionTypeBadge(question.type);
                        return (
                          <div
                            key={question.id}
                            className="flex items-start justify-between gap-4 rounded-lg border bg-muted/30 p-3"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground line-clamp-2">
                                {question.text}
                              </p>
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <Badge variant={typeBadge.variant} className="text-xs">
                                  {typeBadge.label}
                                </Badge>
                                {question.inputType && (
                                  <Badge variant="outline" className="text-xs">
                                    {question.inputType}
                                  </Badge>
                                )}
                              </div>
                              {question.additionalInfo && (
                                <p className="mt-2 text-xs text-muted-foreground line-clamp-1">
                                  {question.additionalInfo}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {question.isActive ? "Activa" : "Inactiva"}
                              </span>
                              <Switch
                                checked={question.isActive ?? true}
                                onCheckedChange={(checked) =>
                                  onToggleQuestion?.(enunciado.id, question.id, checked)
                                }
                                aria-label={`Activar/desactivar pregunta: ${question.text}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {enunciado.questions && enunciado.questions.length === 0 && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    No hay preguntas asociadas a este enunciado.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
