import Link from "next/link";
import type { Prisma } from "@/generated/prisma";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authOptions } from "@/auth.config";
import { getServerSession } from "next-auth";

type EncuestaConRelaciones = Prisma.SurveyGetPayload<{
  include: {
    createdBy: true
    tecnologias: {
      include: { enunciados: true }
    }
  }
}>

type Props = {
  encuestas: EncuestaConRelaciones[]
}

function EncuestaCard({ encuesta }: any) {
  return (
    <Card className="bg-muted/50 hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-2xl text-pretty">{encuesta?.title}</CardTitle>
        <div className="flex flex-col items-end gap-2">
          <span className="text-sm text-muted-foreground">
            Finaliza {encuesta?.endDate?.toLocaleDateString()}
          </span>
          <Badge
            variant={encuesta?.isActive ? "default" : "destructive"}
            className="rounded-full px-4"
          >
            {encuesta?.isActive ? "Activo" : "Inactivo"}
          </Badge>
        </div>
        <CardDescription className="text-sm">
          {encuesta?.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="text-sm font-medium mb-2">Tecnologías</h3>
        <ul className="space-y-1">
          {encuesta?.tecnologias?.map((tecnologia: any, index: number) => (
            <li key={index} className="text-sm text-muted-foreground">
              - {tecnologia.title}
              {tecnologia.enunciados.length > 0 && (
                <span className="ml-1">
                  - {tecnologia.enunciados.length} enunciados
                </span>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default async function AdminEncuestas({ encuestas = [] }: any) {
  const session = await getServerSession(authOptions);
  const dir = session?.user.role === "ADMIN" ? "/admin/encuestas" : "/investigador/encuestas";  
  return (
    <div className="flex flex-col gap-4">
      {encuestas.map((encuesta: any, index: number) => (
        <Link
          key={index}
          href={`${dir}/${encuesta.id}`}
          className="block"
        >
          <EncuestaCard encuesta={encuesta} />
        </Link>
      ))}
    </div>
  );
}
