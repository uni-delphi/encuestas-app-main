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

const formSchema = z.object({
  name: z.string(),
  lastName: z.string(),
  country: z.string().min(1, {
    message: "country is required",
  }),
  state: z.string().min(1, {
    message: "state is required",
  }),
  education: z.string().min(1, {
    message: "education is required",
  }),
  sector: z.string().min(1, {
    message: "sector is required",
  }),
  institution: z.string().min(1, {
    message: "institution is required",
  }),
  expertees: z.string().min(1, {
    message: "expertees is required",
  }),
  years: z.string().min(1, {
    message: "years is required",
  }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, {
    message: "password is required",
  }),
  validatedPassword: z.string().min(1, {
    message: "validatedPassword is required",
  }),
}).refine((values) => values.password === values.validatedPassword, {
  message: "Confirme el password",
  path: ["validatedPassword"],
});

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
              <FormItem className="w-[40%] mx-auto">
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
              <FormItem className="w-[40%] mx-auto">
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
              <FormItem className="w-[40%] mx-auto">
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
              <FormItem className="w-[40%] mx-auto">
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
              <FormItem className="w-[40%] mx-auto">
                <FormLabel>
                  Educación Formal* <br></br> (máximo nivel alcanzado)
                </FormLabel>
                <FormControl>
                  <Input placeholder="Elige nivel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sector"
            render={({ field }) => (
              <FormItem className="w-[40%] mx-auto">
                <FormLabel>
                  Sector en donde desarrolla su actividad principal*
                </FormLabel>
                <FormControl>
                  <Input placeholder="Elige sector" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="institution"
            render={({ field }) => (
              <FormItem className="w-[40%] mx-auto">
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
              <FormItem className="w-[40%] mx-auto">
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
              <FormItem className="w-[40%] mx-auto">
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
              <FormItem className="w-[40%] mx-auto">
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
              <FormItem className="w-[40%] mx-auto">
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
              <FormItem className="w-[40%] mx-auto">
                <FormControl>
                  <Input placeholder="Repetir contraseña*" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="block mx-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Confirmar mail"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
