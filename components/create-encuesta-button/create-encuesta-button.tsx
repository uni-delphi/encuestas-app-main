"use client";
import React from "react";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function CreateEncuestaButton({ url }: { url: string }) {
  const router = useRouter();
  
  return (
    <Button
      onClick={() => router.push(url)}
      className="bg-blue-600 text-white hover:bg-gray-200 block mx-auto my-4"
    >
      Empezá
    </Button>
  );
}
