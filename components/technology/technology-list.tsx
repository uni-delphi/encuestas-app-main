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
import { Tecnologias } from "@/generated/prisma";

function toDatetimeLocal(date: Date): string {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

interface TechnologyListProps {
  tecnologias: Tecnologias[];
  onDelete: (id: number) => void;
  onEdit: (tech: Tecnologias) => void;
}

export function TechnologyList({
  tecnologias,
  onDelete,
  onEdit,
}: TechnologyListProps) {
  if (tecnologias.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            No hay tecnologias creadas. Agrega una usando el formulario.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">
        Tecnologias Creadas ({tecnologias.length})
      </h2>
      <div className="grid gap-4">
        {tecnologias.map((tech) => (
          <Card key={tech.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{tech.title}</CardTitle>
                    {/*<Badge variant={tech.isActive ? "default" : "secondary"}>
                      {tech.isActive ? "Activo" : "Inactivo"}
                    </Badge>*/}
                  </div>
                  <CardDescription className="font-mono text-xs">
                    /{tech.slug}
                  </CardDescription>
                </div>
                <ul className="flex gap-2">
                  <li>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(tech)} // 👈 callback nuevo
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(tech.id)}
                      aria-label={`Eliminar ${tech.title}`}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </li>
                </ul>
              </div>
            </CardHeader>
            <CardContent>
              {tech.description && (
                <p className="text-sm text-muted-foreground">
                  {tech.description}
                </p>
              )}
              <div className="mt-3 flex flex-col gap-1 text-xs text-muted-foreground">
                {/*<p>Finaliza: {formatDate(tech?.endDate)}</p>
                
                */}
                <p>Creado: {tech?.createdAt?.toLocaleDateString("es-ES")}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
