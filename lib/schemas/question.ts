import { z } from "zod"

// Enum para los tipos de preguntas
export const QuestionType = z.enum(["CHECKBOX", "SINGLE_CHOICE"])
export type QuestionType = z.infer<typeof QuestionType>

// Enum para los tipos de input de pregunta
export const InputQuestionType = z.enum([
  "NIVEL",
  "IMPORTANCIA",
  "DIFUSION",
  "ACELERAN",
  "FRENAN",
  "IMPACTO",
  "DIFUSION_2024",
  "DIFUSION_2027",
  "DIFUSION_2030",
])
export type InputQuestionType = z.infer<typeof InputQuestionType>

// Schema para crear una nueva pregunta
export const questionFormSchema = z.object({
  text: z
    .string()
    .min(1, "El texto de la pregunta es requerido")
    .max(500, "El texto no puede exceder 500 caracteres"),
  type: QuestionType,
  inputType: InputQuestionType.optional(),
  additionalInfo: z
    .string()
    .max(1000, "La información adicional no puede exceder 1000 caracteres")
    .optional(),
  enunciadoIds: z
    .array(z.number())
    .optional()
    .default([]),
})

export type QuestionFormValues = z.infer<typeof questionFormSchema>

// Labels para los tipos de pregunta
export const questionTypeLabels: Record<z.infer<typeof QuestionType>, string> = {
  CHECKBOX: "Selección múltiple (Checkbox)",
  SINGLE_CHOICE: "Opción única",
}

// Labels para los tipos de input
export const inputQuestionTypeLabels: Record<z.infer<typeof InputQuestionType>, string> = {
  NIVEL: "Nivel",
  IMPORTANCIA: "Importancia",
  DIFUSION: "Difusión",
  ACELERAN: "Aceleran",
  FRENAN: "Frenan",
  IMPACTO: "Impacto",
  DIFUSION_2024: "Difusión 2024",
  DIFUSION_2027: "Difusión 2027",
  DIFUSION_2030: "Difusión 2030",
}
