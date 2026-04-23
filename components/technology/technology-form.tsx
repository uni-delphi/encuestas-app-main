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
  endDate: z.string().min(1, "La fecha de finalizacion es requerida"),
  isActive: z.boolean().default(true),
});

export type TecnologiaFormValues = z.infer<typeof tecnologiaSchema>;

export interface TecnologiaWithSlug extends TecnologiaFormValues {
  slug: string;
}

interface TechnologyFormProps {
  onSubmit: (data: TecnologiaWithSlug) => void;
  defaultValues?: Partial<TecnologiaWithSlug>; // 👈
}


export function TechnologyForm({
  onSubmit,
  defaultValues,
}: TechnologyFormProps) {
  

  // Reset cuando cambian los defaultValues (usuario edita otra tech):
  useEffect(() => {
    if (defaultValues) form.reset(defaultValues);
  }, [defaultValues]);

  const form = useForm<TecnologiaFormValues>({
    resolver: zodResolver(tecnologiaSchema),
    defaultValues: {
      title: "",
      description: "",
      endDate: "",
      isActive: true,
    },
  });

  const handleSubmit = (data: TecnologiaFormValues) => {
    const slug = generateSlug(data.title);
    onSubmit({ ...data, slug });
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

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de finalizacion</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Activo</FormLabel>
                    <FormDescription>
                      Determina si la tecnologia esta disponible
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
