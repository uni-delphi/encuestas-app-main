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
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

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
/*
(alias) type Tecnologias = {
    id: number;
    title: string;
    description: string;
    slug: string | null;
    surveyId: number;
    createdAt: Date;
    updatedAt: Date;
}
import Tecnologias
*/
const tecnologiaSchema = z.object({
  title: z
    .string()
    .min(1, "El titulo es requerido")
    .max(100, "Maximo 100 caracteres"),
  description: z
    .string()
    .max(500, "Maximo 500 caracteres")
    .optional()
    .or(z.literal("")),
  surveyId: z.number().int(),
});

export type TecnologiaFormValues = z.infer<typeof tecnologiaSchema>;

export interface TecnologiaWithSlug extends TecnologiaFormValues {
  slug: string;
}

interface TechnologyFormProps {
  onSubmit: (data: TecnologiaWithSlug) => void | Promise<void>;
  defaultValues?: Partial<TecnologiaWithSlug>; // 👈
}

export function TechnologyForm({
  onSubmit,
  defaultValues,
}: TechnologyFormProps) {
  const [encuestaId, setEncuestaId] = useState<number | undefined>();
  // Reset cuando cambian los defaultValues (usuario edita otra tech):
  useEffect(() => {
    if (defaultValues) {
      const { slug, ...rest } = defaultValues;
      setEncuestaId(rest.surveyId);
      form.reset(rest);
    }
  }, [defaultValues]);

  const form = useForm<TecnologiaFormValues>({
    resolver: zodResolver(tecnologiaSchema),
    defaultValues: {
      title: "",
      description: "",
      surveyId: defaultValues?.surveyId ?? 0,
    },
  });

  const handleSubmit = (data: TecnologiaFormValues) => {
    const slug = generateSlug(data.title);
    onSubmit({ ...data, slug, surveyId: encuestaId ?? data.surveyId });
    form.reset();
  };

  const watchTitle = form.watch("title");
  const previewSlug = generateSlug(watchTitle || "");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva Tecnologia</CardTitle>
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
                    <Input placeholder="Ej: React" {...field} />
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
                  <FormLabel>Descripcion (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe la tecnologia..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Agregar Tecnologia
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
