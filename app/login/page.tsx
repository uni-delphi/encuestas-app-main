import React from "react";

import Image from "next/image";
import LogInForm from "@/components/login-form/login-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LogIn() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 h-screen">
      <div className="w-full">
        <Image
          src={"/gente.jpg"}
          alt="image"
          width={200}
          height={160}
          sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
          style={{ height: "100vh", width: "100%", objectFit: "cover" }}
        />
      </div>
      <section className="w-full overflow-y-auto px-4 text-textColor my-4">
        <div className="w-full text-center">
          <Image
            src={"/logos-unc.png"}
            alt="image"
            width={200}
            height={160}
            style={{
              height: "auto",
              width: "100%",
              objectFit: "cover",
              padding: "0 200px",
            }}
          />
          <div className="w-[70%] mx-auto my-6">
            <h2 className="font-bold">Login</h2>
            <LogInForm />
          </div>
          <Button className="bg-transparent text-black hover:bg-gray-200">
            No recuerdo mi contraseña
          </Button>
          <Link
            href={"/signin"}
            className="bg-transparent text-black hover:bg-gray-200 font-bold py-2 px-4 rounded"
          >
            Registrarme
          </Link>
        </div>
      </section>
    </div>
  );
}
