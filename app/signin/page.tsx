import React from "react";
import Image from "next/image";
import SignInForm from "@/components/signin-form/signin-form";

export default function SignIn() {
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
      <div className="w-full">
        <h2 className="font-bold">¿Primera vez en la plataforma?</h2>
        <p className="pb-4 mb-4">Te pedimos que complete asdasdasdasd</p>
        <SignInForm />
      </div>
    </div>
  );
}
