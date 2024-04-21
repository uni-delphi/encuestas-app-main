"use client";
import React, { useState } from "react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
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
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  items: z.array(z.string()),
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
  lastName: z.string(),
  state: z.string(),
  education: z.string(),
  sector: z.string(),
  institution: z.string(),
  expertees: z.string(),
  years: z.string(),
  email: z.string(),
  password: z.string(),
  validatedPassword: z.string(),
});

export default function QuestionRadioField({
  data,
  statement,
  question_number,
  response,
}: {
  data: any;
  statement: any;
  question_number: any;
  response: any;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: ["recents", "home"],
      lastName: "",
      //country: "",
      state: "",
      education: "",
      sector: "",
      institution: "",
      expertees: "",
      years: "",
      email: "",
      password: "",
      validatedPassword: "",
    },
  });

  return (
    <>
      <div className="flex gap-5 py-5 flex-col md:flex-row">
        <div className="flex-auto w-full md:w-1/3">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <div className="flex">
                  <FormLabel className="mr-4 font-bold">
                    {question_number}
                  </FormLabel>
                  <FormDescription className="font-bold w-[80%]">
                    {statement}
                  </FormDescription>
                </div>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {data &&
                      data.map((item: any) => (
                        <FormItem
                          key={item.id}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={item.id} />
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
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-base">
                  Justifique de respuesta
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex-auto w-full md:w-1/3">
          <p className="font-bold">Otros comentarios</p>
          <Carousel
            opts={{
              align: "start",
            }}
          >
            <CarouselContent className="text-center h-100">
              <CarouselItem className="text-justify pt-2">
                Leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus
                vitae aliquet nec ollicitudin tempor id eu nisl nunc mi ipsum
                faucibus vitae aliquet.
              </CarouselItem>
              <CarouselItem className="text-justify pt-2">
                A cras semper auctor neque vitae tempus quam pellentesque nec
                nam aliquam sem et tortor consequat id porta nibh venenatis cras
                sed felis eget velit aliquet sagittis id consectetur purus ut
                faucibus pulvinar elementum integer enim neque volutpat ac
                tincidunt.
              </CarouselItem>
              <CarouselItem className="text-justify pt-2">
                Leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus
                vitae aliquet nec.
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      </div>
      <hr />
    </>
  );
}
