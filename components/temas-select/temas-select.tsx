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
import { FormControl } from "../ui/form";

export default function TemasSelect({ enunciados }: { enunciados: any }) {
  //console.log("🚀 ~ TemasSelect ~ tech:", enunciados);

  return (
    <div className="flex justify-center gap-4 items-center">
      <span>1 de {enunciados?.length}: ir a</span>
      <Select>
        <SelectTrigger className="w-[280px] my-2">
          <SelectValue placeholder="Elija un enunciado" />
        </SelectTrigger>
        <SelectContent>
          {enunciados &&
            enunciados.map((enunciado: any) => (
              <SelectGroup key={enunciado.id}>
                <SelectItem value={enunciado.id}>{enunciado.title}</SelectItem>
              </SelectGroup>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
