"use client";
import React from "react";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { formatTitleToSlug } from "@/utils/text-helper";

export default function CreateEncuestaButton({ url }: { url: string }) {
  const router = useRouter();
  console.log(formatTitleToSlug(url))
  return (
    <Button
      onClick={() => router.push(`/estado/${formatTitleToSlug(url)}`)}
      className="bg-blue-600 text-white hover:bg-gray-200 block mx-auto my-4"
    >
      Empezá
    </Button>
  );
}
