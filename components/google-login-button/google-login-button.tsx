"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await signIn("google");
  };

  return (
    <div className="md:flex-col">
      <p className="mt-4">Si estas registrado</p>
      <Button onClick={handleGoogleLogin}>
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
