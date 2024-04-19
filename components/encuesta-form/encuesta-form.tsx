"use client";
import React, { useState } from "react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createUser } from "@/lib/actions";
import { Form } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

import QuestionCheckboxField from "../question-checkbox-field/question-checkbox-field";
import QuestionRadioField from "../question-radio-field/question-radio-field";

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

export default function EncuestaForm({ data }: { data: any }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    //setIsLoading(true);

    createUser({
      //name: values.name,
      lastName: values.lastName,
      country: values.type,
      state: values.state,
      education: values.education,
      sector: values.sector,
      institution: values.institution,
      expertees: values.expertees,
      years: values.years,
      email: values.email,
      password: values.password,
      validatedPassword: values.validatedPassword,
    })
      .then(() => {
        toast({
          title: "Evento editado!",
        });
        setIsLoading(false);
      })
      .catch((error: any) => {
        console.log("error editando el evento", error);
        toast({
          variant: "destructive",
          title: "Error editando el evento",
        });
      });
  }

  const { nivel, importancia, difusion, aceleran, frenan, impacto } = data[0];
  
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => onSubmit(values))}
          className="max-w-[80%] mx-auto"
        >
          <QuestionRadioField
            data={nivel?.answers || ""}
            statement={nivel?.statement}
            question_number={nivel?.question_number}
          />
          <QuestionRadioField
            data={importancia?.answers}
            statement={importancia?.statement}
            question_number={importancia?.question_number}
          />
          <QuestionRadioField
            data={difusion?.answers}
            statement={difusion?.statement}
            question_number={difusion?.question_number}
          />
          <QuestionCheckboxField
            data={aceleran?.answers}
            statement={aceleran?.statement}
            question_number={aceleran?.question_number}
          />
          <QuestionCheckboxField
            data={frenan?.answers}
            statement={frenan?.statement}
            question_number={frenan?.question_number}
          />
          <QuestionCheckboxField
            data={impacto?.answers}
            statement={impacto?.statement}
            question_number={impacto?.question_number}
          />
        </form>
        <div className="flex justify-center items-center gap-2 p-4">
        <Link className="" href="/estado">
          Ver avance
        </Link>

        <Button disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Siguiente"
          )}
        </Button>

        </div>
      </Form>
    </>
  );
}
