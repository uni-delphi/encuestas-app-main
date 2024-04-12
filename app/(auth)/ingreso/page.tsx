import React from "react";

import Image from "next/image";
import LogInForm from "@/components/login-form/login-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LogIn() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-9 px-4 py-4">
      <div className="w-full">
        <Image
          src={"/gente.jpg"}
          alt="image"
          width={200}
          height={160}
          sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
          style={{ height: "auto", width: "100%" }}
        />
      </div>
      <div className="w-full text-center">
        <h2 className="font-bold">Login</h2>
        <LogInForm />
        <Button className="bg-transparent text-black hover:bg-gray-200">
          No recuerdo mi contraseña
        </Button>
        <Link
          href={"/auth/signin"}
          className="bg-transparent text-black hover:bg-gray-200 font-bold py-2 px-4 rounded"
        >
          Registrarme
        </Link>
      </div>
    </div>
  );
}
