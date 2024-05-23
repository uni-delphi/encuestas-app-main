"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  IANSWER,
  IDATAQUESTION,
  IENUNCIADOPROPS,
  IQUESTION,
} from "@/types/encuestas";
import { User } from "next-auth";

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
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import { useForm } from "react-hook-form";
import { createResponse, updateCheckboxResponse } from "@/lib/actions";

const formSchema = z.object({
  items: z.array(z.string()).max(3),
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
  textField: z.string().max(10),
});

export default function QuestionCheckboxField({
  data,
  values,
  enunciadoData,
  checkboxResponse,
  user,
}: {
  data: IDATAQUESTION;
  values: IQUESTION;
  enunciadoData: IENUNCIADOPROPS;
  checkboxResponse: any;
  user: User;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: values.responses[0]?.checkbox?.choices ?? [],
      textField: values.responses[0]?.checkbox?.answer ?? "",
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

  const handleChange = (checked: boolean, itemId: string) => {
    const currentItems = form.getValues("items");
    const updatedItems = checked
      ? [...currentItems, itemId]
      : currentItems.filter((value) => value !== itemId);

    // Check if the updated items exceed the limit of 3
    if (updatedItems.length > 3) {
      return;
    }
    form.setValue("items", updatedItems);

    updateDatabase({ choices: updatedItems });
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
      const response = await updateCheckboxResponse(
        value,
        values.responses[0]?.checkbox.id
      );
      return;
    }

    const { choices, answer } = value;

    const responseData: any = {
      respondentId: user.id,
      questionId: values.id,
      enunciadosId: enunciadoData.id,
      responseType: values.type,
      answer: "",
      singleChoice: {},
      checkbox: {
        questionId: values.id,
        choices: choices ?? [],
        answer: answer ?? "",
        enunciadosId: enunciadoData.id,
      },
    };

    const response = await createResponse(responseData);
  };

  const answersHasTexts = checkboxResponse.some(
    (item: any) => item.checkbox.answer.length > 0
  );

  return (
    <>
      <Form {...form}>
        <form className="max-w-[80%] mx-auto">
          <div className="flex gap-5 py-5 flex-col md:flex-row">
            <div className="flex-auto w-full md:w-1/3">
              <FormField
                control={form.control}
                name="items"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-4 flex">
                      <FormLabel className="text-base mr-4 font-bold text-muted-foreground">
                        {data.order}
                      </FormLabel>
                      <FormDescription className="font-bold w-[80%]">
                        {values.text}
                      </FormDescription>
                    </div>
                    {data.answers &&
                      data.answers.map((item: IANSWER) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="items"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={form
                                      .getValues("items")
                                      .includes(item.id)}
                                    onCheckedChange={(checked: boolean) =>
                                      handleChange(checked, item.id)
                                    }
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item.name}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
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

            <div className="flex-auto w-full md:w-1/3 h-100">
              <p className="font-bold">Otros comentarios</p>
              {(checkboxResponse.length === 0 || !answersHasTexts) && (
                <div className="text-center pt-2 italic h-100 select-none">
                  No hay respuestas
                </div>
              )}
              {checkboxResponse.length > 0 && answersHasTexts && (
                <>
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    setApi={setApi}
                    className="h-100"
                  >
                    <CarouselContent className="text-center h-100 cursor-grab">
                      {checkboxResponse &&
                        checkboxResponse.map((response: any, index: number) =>
                          values.id === response.questionId &&
                          response.checkbox.answer.length > 14 ? (
                            <CarouselItem
                              key={response.checkbox?.id}
                              className="text-justify pt-2 italic h-100 select-none"
                            >
                              {response.checkbox?.answer}
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
