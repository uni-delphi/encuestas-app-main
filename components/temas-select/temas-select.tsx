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
  slug: z.string(),
});

export default function TemasSelect({
  tecnologias,
  slugs,
}: {
  tecnologias: any;
  slugs: any[];
}) {
  const router = useRouter();
  const params = useParams<{ slug: any }>();
  const [techSlug, enunciadoSlug] = params.slug;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleChange = (url: any) => router.push(url);

  const index: number = slugs.find(
    (item: any) => item.enunciadoSlug === enunciadoSlug
  ).index;

  return (
    <div className="flex justify-center gap-4 items-center bg-white px-2">
      <span className="text-xs">
        {index + 1} de {slugs?.length}: Si este enunciado no es de tu
        especialidad
      </span>
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={handleChange}
                  //defaultValue={`/${techSlug}/${enunciadoSlug}`}
                >
                  <SelectTrigger className="my-2 text-small">
                    <SelectValue placeholder="Seleccioná otro enunciado" />
                  </SelectTrigger>
                  <SelectContent className="p-2 text-small">
                    {tecnologias &&
                      tecnologias.map((tecnologia: any) => (
                        <SelectGroup key={tecnologia.id}>
                          <SelectLabel className="text-small">
                            {tecnologia.title}
                          </SelectLabel>
                          {tecnologia.enunciados &&
                            tecnologia.enunciados.map((enunciado: any) => (
                              <SelectItem
                                className="text-small"
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
