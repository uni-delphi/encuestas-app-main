"use client";
import React, { useState } from "react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createUser } from "@/lib/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

import { TUser } from "@/types/user";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type TEducation = "Secundaria" | "Terciario" | "Universitario";

type TSector = "Pública - gubernamental" | "Privada - empresarial" | "Cientifica - académica" | "Gremial - sindicalia";

const education: TEducation[] = ["Secundaria", "Terciario", "Universitario"];

const sectors: TSector[] = [
  "Pública - gubernamental",
  "Privada - empresarial",
  "Cientifica - académica",
  "Gremial - sindicalia",
];

const formSchema = z
  .object({
    name: z.string(),
    lastName: z.string(),
    country: z.string().min(1, {
      message: "Este campo es requerido",
    }),
    state: z.string().min(1, {
      message: "Este campo es requerido",
    }),
    education: z.string().min(1, {
      message: "Este campo es requerido",
    }),
    sector: z.string().min(1, {
      message: "Este campo es requerido",
    }),
    institution: z.string().min(1, {
      message: "Este campo es requerido",
    }),
    expertees: z.string().min(1, {
      message: "Este campo es requerido",
    }),
    years: z.string().min(1, {
      message: "Este campo es requerido",
    }),
    email: z.string().email({ message: "Agregue un mail válido" }),
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
    validatedPassword: z.string().min(1, {
      message: "Este campo es requerido",
    }),
  })
  .refine((values) => values.password === values.validatedPassword, {
    message: "Confirme el password",
    path: ["validatedPassword"],
  })
  .refine(
    (values) => {
      // Comprobación de al menos una letra mayúscula y un número
      return /[A-Z]/.test(values.password) && /\d/.test(values.password);
    },
    {
      message:
        "La contraseña debe contener al menos una letra mayúscula y un número",
      path: ["password"],
    }
  );

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lastName: "",
      country: "",
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
    setIsLoading(true);

    createUser({
      name: values.name,
      lastName: values.lastName,
      country: values.country,
      state: values.state,
      education: values.education,
      sector: values.sector,
      institution: values.institution,
      expertees: values.expertees,
      years: values.years,
      email: values.email,
      password: values.password,
      //validatedPassword: values.validatedPassword,
    })
      .then(() => {
        signIn("credentials", {
          email: values?.email,
          password: values?.password,
          callbackUrl: "/bienvenido",
        });
      })
      .catch((error: any) => {
        setIsLoading(false);
        console.log("error creando el usuario", error);
        toast({
          variant: "destructive",
          title: "Error creando el usuario",
        });
      });
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => onSubmit(values))}
          className="space-y-8 "
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="xl:w-[40%] sm:w-[60%] mx-auto">
                <FormControl>
                  <Input placeholder="Nombre" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="xl:xl:w-[40%] sm:w-[60%] mx-auto">
                <FormControl>
                  <Input placeholder="Apellido" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="xl:w-[40%] sm:w-[60%] mx-auto">
                <FormControl>
                  <Input placeholder="País*" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="xl:w-[40%] sm:w-[60%] mx-auto">
                <FormControl>
                  <Input placeholder="Provincia / Región*" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem className="xl:w-[40%] sm:w-[60%] mx-auto text-left">
                <FormLabel>
                  Educación Formal* <br></br> (máximo nivel alcanzado)
                </FormLabel>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Elige nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    {education &&
                      education.map((edu: TEducation, index: number) => (
                        <SelectGroup key={index}>
                          <SelectItem value={edu}>{edu}</SelectItem>
                        </SelectGroup>
                      ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sector"
            render={({ field }) => (
              <FormItem className="xl:w-[40%] sm:w-[60%] mx-auto text-left">
                <FormLabel>
                  Sector en donde desarrolla su actividad principal*
                </FormLabel>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Elige sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors &&
                      sectors.map((edu: TSector, index: number) => (
                        <SelectGroup key={index}>
                          <SelectItem value={edu}>{edu}</SelectItem>
                        </SelectGroup>
                      ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="institution"
            render={({ field }) => (
              <FormItem className="xl:w-[40%] sm:w-[60%] mx-auto text-left">
                <FormLabel>Institución / empresa*</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expertees"
            render={({ field }) => (
              <FormItem className="xl:w-[40%] sm:w-[60%] mx-auto text-left">
                <FormLabel>Area de especialidad*</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="years"
            render={({ field }) => (
              <FormItem className="xl:w-[40%] sm:w-[60%] mx-auto text-left">
                <FormLabel>Años de experiencia en la especialidad*</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <hr className="w-full position-absolute" />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="xl:w-[40%] sm:w-[60%] mx-auto">
                <FormControl>
                  <Input placeholder="Mail*" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="xl:w-[40%] sm:w-[60%] mx-auto">
                <FormControl>
                  <Input placeholder="Contraseña*" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="validatedPassword"
            render={({ field }) => (
              <FormItem className="xl:w-[40%] sm:w-[60%] mx-auto">
                <FormControl>
                  <Input placeholder="Repetir contraseña*" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2 xl:w-[40%] sm:w-[60%] mx-auto text-center">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cargando...
                </>
              ) : (
                "Confirmar mail"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
