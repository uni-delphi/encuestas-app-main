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

type TQUESTIONRADIO = {
  id: string;
  name: string;
}

type TQUESTIONCHECKBOX = {
  id: string;
  label: string;
}

const nivel: TQUESTIONRADIO[] = [
  {
    id: "alto",
    name: "Alto",
  },
  {
    id: "medioAlto",
    name: "Medio alto",
  },
  {
    id: "medioBajo",
    name: "Medio bajo",
  },
  {
    id: "bajo",
    name: "Bajo",
  },
  {
    id: "ninguno",
    name: "Ninguno",
  },
];

const importancia: TQUESTIONRADIO[] = [
  {
    id: "muyAlto",
    name: "Muy alto",
  },
  {
    id: "alto",
    name: "Alto",
  },
  {
    id: "medioAlto",
    name: "Medio alto",
  },
  {
    id: "medioBajo",
    name: "Medio bajo",
  },
  {
    id: "bajo",
    name: "Bajo",
  },
  {
    id: "muyBajo",
    name: "Muy bajo",
  },
  {
    id: "irrelevante",
    name: "Irrelevante",
  },
];

const difusion: TQUESTIONRADIO[] = [
  {
    id: "1ano",
    name: "12 Meses",
  },
  {
    id: "3anos",
    name: "3 Años",
  },
  {
    id: "5anos",
    name: "5 Años",
  },
  {
    id: "7anos",
    name: "7 Años",
  },
  {
    id: "10anos",
    name: "10 Años",
  },
];

const aceleran: TQUESTIONCHECKBOX[] = [
  {
    id: "social",
    label: "Social",
  },
  {
    id: "tecnológica",
    label: "Tecnológica",
  },
  {
    id: "económica",
    label: "Económica",
  },
  {
    id: "ambiental",
    label: "Ambiental",
  },
  {
    id: "política",
    label: "Política",
  },
  {
    id: "cultural",
    label: "Cultural",
  },
];

const frenan: TQUESTIONCHECKBOX[] = [
  {
    id: "social",
    label: "Social",
  },
  {
    id: "tecnológica",
    label: "Tecnológica",
  },
  {
    id: "económica",
    label: "Económica",
  },
  {
    id: "ambiental",
    label: "Ambiental",
  },
  {
    id: "política",
    label: "Política",
  },
  {
    id: "cultural",
    label: "Cultural",
  },
];

const impacto: TQUESTIONCHECKBOX[] = [
  {
    id: "social",
    label: "Social",
  },
  {
    id: "tecnológica",
    label: "Tecnológica",
  },
  {
    id: "económica",
    label: "Económica",
  },
  {
    id: "ambiental",
    label: "Ambiental",
  },
  {
    id: "política",
    label: "Política",
  },
  {
    id: "cultural",
    label: "Cultural",
  },
];

export default function EncuestaForm() {
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

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => onSubmit(values))}
          className="w-[100%]"
        >
          <QuestionRadioField data={nivel} />
          <QuestionRadioField data={importancia} />
          <QuestionRadioField data={difusion} />
          <QuestionCheckboxField data={aceleran} />
          <QuestionCheckboxField data={frenan} />
          <QuestionCheckboxField data={impacto} />
        </form>

        <Link className="" href="/bienvenido">
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
      </Form>
    </>
  );
}
