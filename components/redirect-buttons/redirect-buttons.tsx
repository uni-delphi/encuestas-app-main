"use client";

import React from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const nextSlugFinder = (slug: string, encuesta: any[]) => {
  const currentIndex = encuesta.findIndex(
    (item: any) => item.enunciadoSlug === slug
  );
  if (currentIndex === -1) {
    return "/estado";
  }

  const nextIndex = currentIndex + 1;
  if (nextIndex < encuesta.length) {
    return `/${encuesta[nextIndex].tecnologiaSlug}/${encuesta[nextIndex].enunciadoSlug}`;
  } else {
    return "/finalizado";
  }
};

export default function RedirectButtons({
  encuesta,
  techActual,
  enunActual,
}: {
  encuesta: any;
  techActual: string;
  enunActual: string;
}) {
  const router = useRouter();

  const handleClic = () => {
    const nextSlug = nextSlugFinder(enunActual, encuesta);
    router.push(`${nextSlug}`);
  };

  return (
    <div className="flex justify-center items-center gap-5 p-4">
      <Link href="/estado">Ver avance</Link>
      <Button
        onClick={() => handleClic()}
        className="bg-blue-600 text-white md:mx-10 hover:bg-gray-200 hover:text-blue-600 font-bold"
      >
        Siguiente
      </Button>
    </div>
  );
}
