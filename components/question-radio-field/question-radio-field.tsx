"use client";
import React, { useEffect, useRef, useState } from "react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import { useForm } from "react-hook-form";
import { createResponse, updateSingleChoiceResponse } from "@/lib/actions";
import { IDATAQUESTION, IQUESTION, IENUNCIADOPROPS } from "@/types/encuestas";
import { User } from "next-auth";

const formSchema = z.object({
  items: z.array(z.string()),
  type: z.enum(["Any"], {
    required_error: "You need to select a notification type.",
  }),
  textField: z.string(),
});

export default function QuestionRadioField({
  data,
  values,
  enunciadoData,
  user,
  singleChoiceResponse,
}: {
  data: IDATAQUESTION;
  values: IQUESTION;
  enunciadoData: IENUNCIADOPROPS;
  singleChoiceResponse: any;
  user: User;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      textField: values.responses[0]?.singleChoice?.answer ?? "",
      type: values.responses[0]?.singleChoice?.choice ?? "none",
    },
  });

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  const [debouncedValue, setDebouncedValue] = useState<string>(
    form.getValues("textField")
  );
  const timerRef = useRef<number | undefined>();

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });

    return () => {
      if (timerRef.current !== undefined) {
        clearTimeout(timerRef.current);
      }
    };
  }, [api]);

  const handleChange = (value: any) => {
    form.setValue("type", value); // Actualiza el valor del campo type en el formulario
    updateDatabase({ choice: value }); // Envía los cambios a la base de datos
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    form.setValue("textField", e.target.value);
    // Se inicia el temporizador para activar el debouncer
    if (timerRef.current !== undefined) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setDebouncedValue(e.target.value);

      updateDatabase({ answer: e.target.value });
    }, 1500);
  };

  const updateDatabase = async (value: any) => {
    if (values.responses.length > 0) {
      const response = await updateSingleChoiceResponse(
        value,
        values.responses[0]?.singleChoice.id
      );
      return;
    }

    const { choice, answer } = value;

    const responseData: any = {
      respondentId: user.id,
      questionId: values.id,
      enunciadosId: enunciadoData.id,
      responseType: values.type,
      answer: "",
      singleChoice: {
        questionId: values.id,
        choice: choice ?? "",
        answer: answer ?? "",
        enunciadosId: enunciadoData.id,
      },
      checkbox: {},
    };

    const response = await createResponse(responseData);
  };

  const answersHasTexts = singleChoiceResponse.some(
    (item: any) => item.singleChoice.answer.length > 0
  );

  return (
    <>
      <Form {...form}>
        <form className="max-w-[80%] mx-auto">
          <div className="flex gap-5 py-5 flex-col md:flex-row">
            <div className="flex-auto w-full md:w-1/3">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <div className="flex">
                      <FormLabel className="mr-4 font-bold text-muted-foreground">
                        {data.order}
                      </FormLabel>
                      <FormDescription className="font-bold w-[80%]">
                        {values.text}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => handleChange(value)} // Llama a handleChange cuando cambia el valor del radio
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {data.answers &&
                          data.answers.map((item: any) => (
                            <FormItem
                              key={item.id}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={item.name} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.name}
                              </FormLabel>
                            </FormItem>
                          ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-auto w-full md:w-1/3">
              <FormField
                control={form.control}
                name="textField"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-base">
                      Justifique de respuesta
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder=""
                        defaultValue={field.value}
                        onChange={(value) => handleTextChange(value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-auto w-full md:w-1/3">
              <p className="font-bold">Otros comentarios</p>
              {(singleChoiceResponse.length === 0 || !answersHasTexts) && (
                <div className="text-center pt-2 italic h-100 select-none">
                  No hay respuestas
                </div>
              )}
              {singleChoiceResponse.length > 0 && answersHasTexts && (
                <>
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    setApi={setApi}
                  >
                    <CarouselContent className="text-center h-100 cursor-grab">
                      {singleChoiceResponse &&
                        singleChoiceResponse.map(
                          (response: any, index: number) =>
                            values.id === response.questionId &&
                            response.singleChoice.answer.length > 14 ? (
                              <CarouselItem
                                key={response.singleChoice?.id}
                                className="text-justify pt-2 italic h-100 select-none"
                              >
                                {response.singleChoice?.answer}
                              </CarouselItem>
                            ) : null
                        )}
                    </CarouselContent>
                  </Carousel>
                  <div className="py-2 text-center text-sm text-muted-foreground">
                    Respuesta {current} de {count}
                  </div>
                </>
              )}
            </div>
          </div>
        </form>
      </Form>
      <hr />
    </>
  );
}
