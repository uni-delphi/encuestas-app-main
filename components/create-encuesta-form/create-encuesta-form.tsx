"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, X, Plus, Loader2 } from "lucide-react";
import { User, Survey } from "@/generated/prisma";

// --- Schema ---

const surveySchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional().default(""),
  isActive: z.boolean().default(true),
  endDate: z
    .date({ required_error: "La fecha de finalización es obligatoria" })
    .refine((d) => d > new Date(), "La fecha debe ser posterior a hoy"),
  tecnologiaIds: z.array(z.number()).default([]),
});

export type SurveyFormData = z.infer<typeof surveySchema>;

// --- Props ---

interface Tecnologia {
  id: number;
  title: string;
}

interface SurveyFormProps {
  availableTecnologias?: Tecnologia[];
  onSubmit?: (data: Partial<Survey>) => Promise<void>;
  initialData?: Partial<SurveyFormData>;
  isEditing?: boolean;
}

// --- Component ---

export default function SurveyForm({
  availableTecnologias = [],
  onSubmit,
  initialData,
  isEditing = false,
}: SurveyFormProps) {
  
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      isActive: initialData?.isActive ?? true,
      endDate: initialData?.endDate,
      tecnologiaIds: initialData?.tecnologiaIds ?? [],
    },
  });

  const tecnologiaIds = watch("tecnologiaIds");

  const selectedTecnologias = availableTecnologias.filter((t) =>
    tecnologiaIds.includes(t.id),
  );
  const unselectedTecnologias = availableTecnologias.filter(
    (t) => !tecnologiaIds.includes(t.id),
  );

  const toggleTecnologia = (id: number) => {
    setValue(
      "tecnologiaIds",
      tecnologiaIds.includes(id)
        ? tecnologiaIds.filter((t) => t !== id)
        : [...tecnologiaIds, id],
    );
  };

  const onFormSubmit = async (data: Partial<Survey>) => {
    console.log("🚀 ~ onFormSubmit ~ data:", data)
    
    setIsLoading(true);
    try {
      await onSubmit?.(data);
      router.push("/encuestas");
    } catch (error) {
      console.error("Error al guardar la encuesta:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          {isEditing ? "Editar Encuesta" : "Crear Nueva Encuesta"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Modifica los datos de la encuesta"
            : "Completa el formulario para crear una nueva encuesta"}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <CardContent className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Ingresa el título de la encuesta"
              className={cn(errors.title && "border-destructive")}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe brevemente el propósito de la encuesta (opcional)"
              rows={4}
              {...register("description")}
            />
          </div>

          {/* Fecha de finalización */}
          <div className="space-y-2">
            <Label>
              Fecha de finalización <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="endDate"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                        errors.endDate && "border-destructive",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value
                        ? format(field.value, "PPP", { locale: es })
                        : "Selecciona una fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.endDate && (
              <p className="text-sm text-destructive">
                {errors.endDate.message}
              </p>
            )}
          </div>

          {/* Estado activo */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-base">
                Encuesta activa
              </Label>
              <p className="text-sm text-muted-foreground">
                Los usuarios podrán responder la encuesta mientras esté activa
              </p>
            </div>
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <Switch
                  id="isActive"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {/* Tecnologías */}
          {availableTecnologias.length > 0 && (
            <div className="space-y-4">
              <Label>Tecnologías</Label>

              {selectedTecnologias.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Seleccionadas</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTecnologias.map((tech) => (
                      <Badge
                        key={tech.id}
                        variant="default"
                        className="cursor-pointer gap-1 pr-1"
                        onClick={() => toggleTecnologia(tech.id)}
                      >
                        {tech.title}
                        <X className="h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {unselectedTecnologias.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Disponibles</p>
                  <div className="flex flex-wrap gap-2">
                    {unselectedTecnologias.map((tech) => (
                      <Badge
                        key={tech.id}
                        variant="outline"
                        className="cursor-pointer gap-1"
                        onClick={() => toggleTecnologia(tech.id)}
                      >
                        <Plus className="h-3 w-3" />
                        {tech.title}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Guardar cambios" : "Crear encuesta"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
