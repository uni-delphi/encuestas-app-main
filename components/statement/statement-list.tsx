"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

import { Enunciados } from "@/generated/prisma";

interface StatementListProps {
  enunciados: (Enunciados & { tecnologiaTitle: string })[];
  onDelete: (id: number) => void;
  onEdit: (statement: Enunciados) => void;
}

export function StatementList({
  enunciados,
  onDelete,
  onEdit,
}: StatementListProps) {
  console.log("🚀 ~ StatementList ~ enunciados:", enunciados);

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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
