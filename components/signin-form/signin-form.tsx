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
/**
 * name?: string | null;
  lastName?: string | null;
  country: string;
  state: string;
  education: string;
  sector: string;
  institution: string;
  expertees: string;
  years: number;
  email: string;
  password: string;
  validatedPassword: string;
 */
const formSchema = z.object({
  name: z.string(),
  lastName: z.string(),
  country: z.string(),
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
    
    //setIsLoading(true);

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
          className="space-y-8 w-[100%]"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
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
              <FormItem>
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
              <FormItem>
                <FormControl>
                  <Input placeholder="País*" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Provincia / Región*" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Educación Formal* <br></br> (máximo nivel alcanzado)</FormLabel>                
                <FormControl>
                  <Input placeholder="Elige nivel" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Sector en donde desarrolla su actividad principal*
                </FormLabel>
                <FormControl>
                  <Input placeholder="Elige sector" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="institution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institución / empresa*</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expertees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area de especialidad*</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="years"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Años de experiencia en la especialidad*</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <hr />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Mail*" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Contraseña*" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="validatedPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Repetir contraseña*" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
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
