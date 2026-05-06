// app/(protected)/investigador/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";

import {
  getResponsesForCSV,
  getAllEnunciados,
  getAllUsers,
  getEncuestas,
} from "@/lib/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirectStrategy } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ClipboardList, Users } from "lucide-react";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/acceso");
  const { name, role } = session.user;
  if (role !== "RESEARCHER") redirect(redirectStrategy[role]);

  return (
    <section className="">
      <div>
        <h1 className="text-4xl font-bold mb-10">Panel</h1>
      </div>
      <div className="flex gap-4">
        <div className="w-1/2">
          <Link href="/investigador/encuestas">            
            <Card className="h-full border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <ClipboardList className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-2xl text-card-foreground flex items-center justify-between">
                  Encuestas
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  Crea, edita y administra tus encuestas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span>Crear nuevas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>Ver resultados</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
        <div className="w-1/2">
          <Link href="/investigador/usuarios">
            <Card className="h-full border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-2xl text-card-foreground flex items-center justify-between">
                  Usuarios
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  Gestiona los usuarios del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span>Agregar usuarios</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>Permisos</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}
