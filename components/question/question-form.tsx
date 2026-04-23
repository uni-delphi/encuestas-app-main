"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
  questionFormSchema,
  QuestionFormValues,
  QuestionType,
  InputQuestionType,
  questionTypeLabels,
  inputQuestionTypeLabels,
} from "@/lib/schemas/question"

interface StatementOption {
  id: number
  title: string
}

interface QuestionFormProps {
  onSubmit: (data: QuestionFormValues) => void
  statements: StatementOption[]
  defaultValues?: Partial<QuestionFormValues>
  isLoading?: boolean
}

export function QuestionForm({
  onSubmit,
  statements,
  defaultValues,
  isLoading = false,
}: QuestionFormProps) {
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      text: "",
      type: "SINGLE_CHOICE",
      inputType: undefined,
      ...defaultValues,
    },
  })

  const handleSubmit = (data: QuestionFormValues) => {
    //const slug = generateSlug(data.text)
    onSubmit(data)
    form.reset()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Nueva Pregunta</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Campo: Enunciado <FormField
              control={form.control}
              name="statement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Enunciado <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un enunciado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statements.map((statement) => (
                        <SelectItem key={statement.id} value={String(statement.id)}>
                          {statement.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Enunciado al que pertenece esta pregunta
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            

            {/* Campo: Título */}
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Texto de la pregunta <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Escribe el texto de la pregunta..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Máximo 500 caracteres ({field.value?.length || 0}/500)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo: Descripción <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción opcional de la pregunta..."
                      className="min-h-[80px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Opcional. Máximo 1000 caracteres
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            

            {/* Campo: Tipo de pregunta */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tipo de pregunta <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {QuestionType.options.map((type) => (
                        <SelectItem key={type} value={type}>
                          {questionTypeLabels[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo: Tipo de input */}
            <FormField
              control={form.control}
              name="inputType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de input</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona (opcional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Sin especificar</SelectItem>
                      {InputQuestionType.options.map((type) => (
                        <SelectItem key={type} value={type}>
                          {inputQuestionTypeLabels[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isLoading}
              >
                Limpiar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Crear Pregunta"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export { type QuestionFormValues } from "@/lib/schemas/question"
