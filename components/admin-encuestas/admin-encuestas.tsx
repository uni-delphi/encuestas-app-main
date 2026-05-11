import Link from "next/link";
import type { Prisma, Survey, Tecnologias } from "@/generated/prisma";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaginationControls } from "@/components/pagination-controls/pagination-controls";
import { ArrowRight, Calendar, Layers } from "lucide-react";


type Props = {
  encuesta: Survey & { tecnologias: Tecnologias[]};
};

function EncuestaCard({ encuesta }: Props) {
  return (
    <Card className="border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <Badge
                variant={encuesta.isActive ? "default" : "destructive"}
                className="rounded-full px-3 py-1 text-xs font-medium"
              >
                {encuesta.isActive ? "Activo" : "Inactivo"}
              </Badge>
            </div>
            <CardTitle className="text-xl text-card-foreground flex items-center justify-between">
              <span className="text-pretty">{encuesta.title}</span>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </CardTitle>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Creada:</span>
            <span className="font-semibold text-card-foreground">
              {new Date(encuesta.createdAt).toLocaleDateString("es-ES")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Finaliza:</span>
            <span className="font-semibold text-card-foreground">
              {new Date(encuesta.endDate).toLocaleDateString("es-ES")}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <CardDescription className="text-muted-foreground text-sm mb-4 pb-4 border-b border-border">
          {encuesta.description}
        </CardDescription>

        <div>
          <h3 className="text-sm font-medium text-card-foreground mb-3">Tecnologias</h3>
          {encuesta.tecnologias?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {encuesta.tecnologias.map((tecnologia: any) => (
                <div
                  key={tecnologia.id}
                  className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-1.5 text-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-card-foreground">{tecnologia.title} - </span>
                  {tecnologia._count?.enunciados > 0 && (
                    <span className="text-muted-foreground">
                     Enunciados ({tecnologia._count.enunciados}) 
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No hay tecnologias asociadas</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function AdminEncuestas({
  encuestas = [],
  urlLink = "/admin/encuestas",
  page = 0,
  pageCount = 10,
}: {
  encuestas: Survey[];
  urlLink?: string;
  page?: number;
  pageCount?: number;
}) {
  return (
    <div className="flex flex-col gap-4">
      {encuestas.map((encuesta: any, index: number) => (
        <Link key={index} href={`${urlLink}/${encuesta.id}`} className="block">
          <EncuestaCard encuesta={encuesta} />
        </Link>
      ))}
      <PaginationControls page={page} pageCount={pageCount} />
    </div>
  );
}
