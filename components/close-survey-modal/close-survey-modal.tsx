"use client";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { updateEncuesta } from "@/lib/actions";

const formSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: "La contraseña debe tener al menos 1 caracter" }),
    eventTitle: z.string(),
  })
  .refine((values) => values.password.trim() === values.eventTitle.trim(), {
    message: "Ingrese la contraseña correcta",
    path: ["password"],
  });

type Props = {
  action: () => void;
  open: boolean;
  encuesta: any;
};

export default function ModalCloseSurvey({ action, open, encuesta }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      eventTitle: encuesta.title,
    },
  });

  useEffect(() => {
    setIsOpen(open);
  }, [open, isOpen]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const endedSurveyResponse = await updateEncuesta(encuesta.id, {
      isActive: false,
    });

    if (endedSurveyResponse) {
      toast({
        title: "La encuesta fue actualizada correctamente",
      });
    }
    setIsLoading(false);
    action();
  };

  return (
    isOpen && (
      <>
        <dialog open={isOpen}>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black/40">
            <div className="relative w-auto max-w-lg p-5 mx-auto my-6 bg-white border border-gray-300 rounded-lg shadow-lg">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((values) => onSubmit(values))}
                >
                  <div className="text-center p-5">
                    <h3 className="text-lg font-bold mb-2">
                      Estas por finalizar la recepción de respuestas del estudio {encuesta.title}. Esta acción es irreversible.
                    </h3>
                    <p className="text-sm mb-4">
                      Para detener el estudio escribe <b>{encuesta.title}</b> en el campo debajo y presiona confirmar.
                    </p>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="mx-auto">
                          <FormControl>
                            <Input
                              className="w-[100%]"
                              placeholder=""
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-6 flex justify-center">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        action();
                      }}
                      className="px-4 py-2 mr-4 text-sm bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:border-blue-500"
                    >
                      Volver
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 text-sm text-white bg-red-500 border border-transparent rounded-md hover:bg-red-600 focus:outline-none focus:border-red-700"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cargando...
                        </>
                      ) : (
                        "Confirmar"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </dialog>
      </>
    )
  );
}
