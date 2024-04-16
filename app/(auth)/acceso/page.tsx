import React from "react";

import Image from "next/image";
import LogInForm from "@/components/login-form/login-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LogIn() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2">
      <div className="w-full">
        <Image
          src={"/gente.jpg"}
          alt="image"
          width={50}
          height={160}
          sizes="(max-width: 768px) 100vw,              
              33vw"
          className="lg:h-lvh  w-full"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="w-full px-12 text-center">
        <Image
          src={"/logos-unc.png"}
          alt="image"
          width={400}
          height={250}
          style={{
            height: "auto",
            width: "auto",
            objectFit: "cover",
            margin: "20px auto",
          }}
        />
        <h2 className="font-bold">Login</h2>
        <LogInForm />
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
    </div>
  );
}
