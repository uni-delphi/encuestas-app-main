import React from "react";

import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import LogInForm from "@/components/login-form/login-form";
import GoogleLoginButton from "@/components/google-login-button/google-login-button";
import LayoutDefault from "@/components/image-layout/image-layout";

export default function LogIn() {
  return (
    <LayoutDefault>
      <h2 className="font-bold text-3xl my-4 pb-4">Ingresar</h2>
      <LogInForm />
      <div className="md:flex justify-center">
        <Button className="bg-transparent text-black hover:bg-gray-200">
          No recuerdo mi contraseña
        </Button>
        <Link
          href={"/registro"}
          className="bg-transparent text-black hover:bg-gray-200 font-bold py-2 px-4 rounded"
        >
          Registrarme
        </Link>
      </div>
    </LayoutDefault>
  );
}
