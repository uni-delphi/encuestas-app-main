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

import { Survey as PrismaSurvey, Tecnologias } from "@/generated/prisma";
import { useEffect } from "react";

export type Survey = PrismaSurvey;

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

function toDatetimeLocal(date: Date): string {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

const surveySchema = z.object({
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
  aboutLink: z
    .string()
    .url("Debe ser una URL válida")
    .optional()
    .or(z.literal("")),
});

export type SurveyFormValues = z.infer<typeof surveySchema>;

/*export interface Survey {
  id: number;
  title: string;
  description?: string;
  slug: string;
  endDate: string;
  isActive: boolean;
  hasEnded: boolean;
  responseCount: number;
  createdAt: Date;
  updatedAt: Date;
}*/

interface SurveyFormProps {
  onSubmit: ({ data, id }: {data: SurveyFormValues, id?: number}) => void | Promise<void>;
  defaultValues:
    | (Survey & {
        tecnologias: Tecnologias[];
      })
    | null;
}

export function SurveyForm({ onSubmit, defaultValues }: SurveyFormProps) {
  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      title: "",
      description: "",
      endDate: "",
      isActive: true,
      aboutLink: "",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        title: defaultValues.title ?? "",
        description: defaultValues.description ?? "",
        endDate: defaultValues.endDate
          ? toDatetimeLocal(new Date(defaultValues.endDate))
          : "",
        isActive: defaultValues.isActive ?? true,
        aboutLink: defaultValues.aboutLink ?? "",
      });
    }
  }, [defaultValues]);

  const handleSubmit = (data: SurveyFormValues) => {
    onSubmit({ data, id: defaultValues?.id });
    form.reset();
  };

  const watchTitle = form.watch("title");
  const previewSlug = generateSlug(watchTitle || "");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información principal</CardTitle>
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
                      placeholder="Ej: Encuesta de satisfaccion"
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
                  <FormLabel>Descripcion (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe el proposito de la encuesta..."
                      rows={3}
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
                  <FormDescription>
                    La encuesta se cerrara automaticamente en esta fecha
                  </FormDescription>
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
                    <FormLabel className="text-base">Activa</FormLabel>
                    <FormDescription>
                      Determina si la encuesta acepta respuestas
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

            <FormField
              control={form.control}
              name="aboutLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link de referencia (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://ejemplo.com"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    URL con información adicional sobre la encuesta
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Crear Encuesta
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
