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
      console.log("🚀 ~ onSubmit ~ endedSurveyResponse:", endedSurveyResponse);
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
                  <div className="text-center">
                    <h3 className="text-md mb-4 p-5">
                      Detiene el estudio {encuesta.title} completando el
                      siguiente campo con el nombre del estudio.
                    </h3>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="xl:w-[40%] sm:w-[60%] mx-auto">
                          <FormControl>
                            <Input
                              placeholder="Contraseña"
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
