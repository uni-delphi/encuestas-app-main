"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGoogleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn("google");
  };

  return (
    <div className="md:flex-col">
      <p className="mt-4 text-sm mb-2">Si estas registrado</p>
      <Button
        onClick={handleGoogleLogin}
        className="bg-white text-blue-600 hover:bg-gray-200 border"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Cargando...
          </>
        ) : (
          "Ingresar con Google"
        )}
      </Button>
    </div>
  );
}
