import Link from "next/link";
import type { Prisma, Survey } from "@/generated/prisma";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaginationControls } from "@/components/pagination-controls/pagination-controls";

type EncuestaConRelaciones = Prisma.SurveyGetPayload<{
  include: {
    createdBy: true;
    tecnologias: {
      include: { enunciados: true };
    };
  };
}>;

type Props = {
  encuestas: Survey[];
};

function EncuestaCard({ encuesta }: any) {
  return (
    <Card className="bg-muted/50 hover:shadow-lg transition-shadow">
      <CardHeader className="w-full flex flex-row justify-between">
        <CardTitle className="text-xl text-pretty w-2/3">
          {encuesta?.title}
          {"   "}
          <Badge
            variant={encuesta?.isActive ? "default" : "destructive"}
            className="rounded-full px-4"
          >
            {encuesta?.isActive ? "Activo" : "Inactivo"}
          </Badge>
        </CardTitle>
        <div className="w-1/3 text-right flex flex-col gap-1">
          <span className="text-sm font-semibold text-muted-foreground">
            Creada{" "}
            <span className="font-bold text-black">
              {encuesta?.createdAt?.toLocaleDateString()}
            </span>
          </span>
          <span className="text-sm font-semibold text-muted-foreground">
            Finaliza{" "}
            <span className="font-bold text-black">
              {encuesta?.endDate?.toLocaleDateString()}
            </span>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm mb-4 p-2 border-b-2 border-muted">
          {encuesta?.description}
        </CardDescription>
        <h3 className="text-sm font-medium mb-1">Tecnologías</h3>
        <ul className="space-y-1 pl-2">
          {encuesta?.tecnologias?.map((tecnologia: any, index: number) => (
            <li key={index} className="text-sm text-muted-foreground">
              {tecnologia.title}
              {tecnologia._count.enunciados > 0 && (
                <span className="ml-1">
                  - {tecnologia._count.enunciados} enunciados
                </span>
              )}
            </li>
          ))}
          {encuesta?.tecnologias.length === 0 && (
            <li className="text-sm text-muted-foreground">
              No hay tecnologías asociadas
            </li>
          )}
        </ul>
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
  encuestas: EncuestaConRelaciones[];
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
