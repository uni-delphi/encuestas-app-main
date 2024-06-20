"use client";
import React, { useRef, useState } from "react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createUser } from "@/lib/actions";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Checkbox } from "../ui/checkbox";

const education: string[] = [
  "Secundaria",
  "Terciario",
  "Universitario",
  "Posgrado",
];

const sectors: string[] = [
  "Ingeniero Electricista",
  "Ingeniero Electrónico",
  "Ingeniero de Sistemas",
  "Ingeniero Industrial",
  "Diseñador Industrial",
  "Ingeniero Agrónomo",
  "Mecánico de Sistemas Electrónicos",
  "Mecánico Electricista",
  "Mecánico Chapista",
  "Pintor",
  "Preparador de Pintura",
  "Médico Veterinario",
  "Gerentes de ventas",
  "Comercializadores de tecnologías",
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
    sector: z.string(),
    otherSector: z.boolean(),
    otherSectorText: z.string(),
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
  .refine(
    (values) => {
      return values.otherSector === true || values.sector !== "";
    },
    {
      message: "Este campo es requerido",
      path: ["sector"],
    }
  )
  .refine(
    (values) => {
      return !values.otherSector || values.otherSectorText !== "";
    },
    {
      message: "Este campo es requerido",
      path: ["otherSectorText"],
    }
  )
  .refine((values) => values.password === values.validatedPassword, {
    message: "Las contraseñas deben coincidir",
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
  )
  .refine(
    (values) => {
      // Verificar si el valor es un año válido (cuatro dígitos)
      return /^\d{4}$/.test(values.years);
    },
    {
      message: "Ingrese un año válido en formato 2003",
      path: ["years"],
    }
  );

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [isOtherCheckboxDisabled, setIsOtherCheckboxDisabled] =
    useState<boolean>(false);
  const [isOtherSectorSelected, setIsOtherSectorSelected] =
    useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lastName: "",
      country: "",
      state: "",
      education: "",
      sector: "",
      otherSector: false,
      otherSectorText: "",
      institution: "",
      expertees: "",
      years: "",
      email: "",
      password: "",
      validatedPassword: "",
    },
  });

  const handleOtherChecked = (value: boolean) => {
    setIsOtherCheckboxDisabled(value);
    form.setValue("otherSector", value);
    setIsOtherSectorSelected(value);
    if (value) {
      form.setValue("sector", ""); // Reiniciar el valor del sector
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    createUser({
      name: values.name,
      lastName: values.lastName,
      country: values.country,
      state: values.state,
      education: values.education,
      sector: values.otherSector ? values.otherSectorText : values.sector,
      institution: values.institution,
      expertees: values.expertees,
      years: values.years,
      email: values.email,
      password: values.password,
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
          className="space-y-8 text-left"
        >
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
                  <Input type="password" placeholder="Contraseña*" {...field} />
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
                  <Input
                    type="password"
                    placeholder="Repetir contraseña*"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <hr className="w-full position-absolute" />
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
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Elige nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    {education &&
                      education.map((edu: string, index: number) => (
                        <SelectGroup key={index}>
                          <SelectItem value={edu}>{edu}</SelectItem>
                        </SelectGroup>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sector"
            render={({ field }) => (
              <FormItem className="xl:w-[40%] sm:w-[60%] mx-auto text-left">
                <FormLabel>Actividad principal de su desempeño* </FormLabel>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-full"
                    disabled={isOtherSectorSelected}
                  >
                    <SelectValue placeholder="Elige actividad" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors &&
                      sectors.map((edu: string, index: number) => (
                        <SelectGroup key={index}>
                          <SelectItem value={edu}>{edu}</SelectItem>
                        </SelectGroup>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center xl:w-[40%] sm:w-[60%] mx-auto text-left">
            <FormField
              control={form.control}
              name="otherSector"
              render={({ field }) => (
                <FormItem className="text-left pr-4">
                  <FormControl>
                    <div className="flex items-center ">
                      <Checkbox
                        checked={isOtherCheckboxDisabled}
                        onCheckedChange={handleOtherChecked}
                        className="mr-2"
                      />
                      <FormLabel className="text-xs">Otra actividad</FormLabel>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="otherSectorText"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      disabled={!isOtherCheckboxDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                <FormLabel>
                  Año de inicio en el sector de maquinaria agrícola
                </FormLabel>
                <FormControl>
                  <Input placeholder="Ej: 2006" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="gap-4 xl:w-[40%] sm:w-[60%] mx-auto flex items-center justify-center">
            <Link
              href={"/"}
              className="text-blue-600 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-white hover:bg-gray-200 border my-4"
            >
              Volver
            </Link>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white hover:bg-gray-200 hover:text-blue-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cargando...
                </>
              ) : (
                "Registrar"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
