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
import { Tecnologias } from "@/generated/prisma";

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
});

export type SurveyFormValues = z.infer<typeof surveySchema>;

export interface Survey {
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
}

interface SurveyFormProps {
  onSubmit: (data: SurveyFormValues) => void;
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
    },
  });

  const handleSubmit = (data: SurveyFormValues) => {
    const slug = generateSlug(data.title);
    onSubmit(data);
    form.reset();
  };

  const watchTitle = form.watch("title");
  const previewSlug = generateSlug(watchTitle || "");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva Encuesta</CardTitle>
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
                      value={defaultValues?.title || ""}
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
                      value={defaultValues?.description || ""}
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
                    <Input
                      type="datetime-local"
                      {...field}
                      value={defaultValues?.endDate ? toDatetimeLocal(new Date(defaultValues?.endDate ?? field.value)) : ""}
                    />
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
                      checked={defaultValues?.isActive ?? field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
