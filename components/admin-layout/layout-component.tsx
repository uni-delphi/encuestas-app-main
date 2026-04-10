import React from "react";
import Image from "next/image";
import LogosUnc from "../logos-unc/logos-unc";

export default function AdminLayoutComponent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="">
      <div className="relative h-52 overflow-hidden ">
        <div className="absolute top-4 left-4 z-20">
          <LogosUnc />
        </div>
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <Image
          src={"/ecampus.jpg"}
          alt="image"
          width={1800}
          height={1013}
          className="w-full h-full object-cover object-top"
          priority
        />

      </div>
      <div className="p-10">        
        {children}
      </div>
    </div>
  );
}
