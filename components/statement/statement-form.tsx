"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Enunciados, Tecnologias } from "@/generated/prisma";
import { useEffect } from "react";

// Funcion para generar slug automaticamente desde el titulo
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, "") // Solo letras, numeros, espacios y guiones
    .trim()
    .replace(/\s+/g, "-") // Espacios a guiones
    .replace(/-+/g, "-"); // Multiples guiones a uno solo
}

const statementSchema = z.object({
  title: z
    .string()
    .min(1, "El titulo es requerido")
    .max(200, "Maximo 200 caracteres"),
  description: z
    .string()
    .min(1, "La descripcion es requerida")
    .max(1000, "Maximo 1000 caracteres"),
  tecnologiaId: z.string().min(1, "Debes seleccionar una tecnologia"),
});

export type StatementFormValues = z.infer<typeof statementSchema>;

export interface Statement {
  id: number;
  title: string;
  description: string;
  slug: string;
  tecnologiaId: number;
  tecnologiaTitle: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tecnologia {
  id: number;
  title: string;
}

interface StatementFormProps {
  onSubmit: (data: StatementFormValues & { slug: string }) => void;
  tecnologias: Tecnologia[];
  defaultValues?: Partial<Enunciados>;
}

export function StatementForm({
  onSubmit,
  tecnologias,
  defaultValues,
}: StatementFormProps) {
  const form = useForm<StatementFormValues>({
    resolver: zodResolver(statementSchema), // 👈 faltaba
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      tecnologiaId: defaultValues?.tecnologiaId
        ? String(defaultValues.tecnologiaId) // 👈 number → string
        : "",
    },
  });

  useEffect(() => {
    form.reset({
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      tecnologiaId: defaultValues?.tecnologiaId
        ? String(defaultValues.tecnologiaId) // 👈 number → string
        : "",
    });
  }, [defaultValues]);

  const handleSubmit = (data: StatementFormValues) => {
    const slug = generateSlug(data.title);
    onSubmit({ ...data, slug });
    form.reset();
  };

  const watchTitle = form.watch("title");
  const previewSlug = generateSlug(watchTitle || "");
  const isEditing = !!defaultValues?.id;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo Enunciado</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titulo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Fundamentos de React Hooks"
                      {...field}
                    />
                  </FormControl>
                  {previewSlug && (
                    <FormDescription className="font-mono text-xs">
                      Slug: /{previewSlug}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripcion</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe el enunciado en detalle..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tecnologiaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tecnologia</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una tecnologia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tecnologias.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No hay tecnologias disponibles
                        </SelectItem>
                      ) : (
                        tecnologias.map((tech) => (
                          <SelectItem key={tech.id} value={String(tech.id)}>
                            {tech.title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Asocia este enunciado a una tecnologia existente
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={tecnologias.length === 0}
            >
              {isEditing ? "Guardar cambios" : "Crear Enunciado"} {/* 👈 */}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
