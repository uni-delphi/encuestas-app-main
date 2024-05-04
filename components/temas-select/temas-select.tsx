"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Form, FormField, FormItem } from "../ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const FormSchema = z.object({
  email: z.string(),
});

export default function TemasSelect({ tecnologias }: { tecnologias: any }) {
  const router = useRouter();
  const params = useParams<{ slug: any }>();
  const [techSlug, enunciadoSlug] = params.slug;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleChange = (url: any) => {
    router.push(url);
  };

  const indexEnunciados = tecnologias.map((item: any) => item.enunciados.map((enunciado: any) => enunciado.slug))[0];
  const index = indexEnunciados.findIndex((enunciado: any) => enunciado === enunciadoSlug);
  
  return (
    <div className="flex justify-center gap-4 items-center">
      <span>{index+1} de {indexEnunciados?.length}: ir a</span>
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={handleChange}
                  defaultValue={`/${techSlug}/${enunciadoSlug}`}
                >
                  <SelectTrigger className="w-[280px] my-2">
                    <SelectValue placeholder="Elija un enunciado" />
                  </SelectTrigger>
                  <SelectContent>
                    {tecnologias &&
                      tecnologias.map((tecnologia: any) => (
                        <SelectGroup key={tecnologia.id}>
                          <SelectLabel>{tecnologia.title}</SelectLabel>
                          {tecnologia.enunciados &&
                            tecnologia.enunciados.map((enunciado: any) => (
                              <SelectItem
                                onChange={handleChange}
                                key={enunciado.id}
                                value={`/${tecnologia.slug}/${enunciado.slug}`}
                              >
                                {enunciado.title}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
