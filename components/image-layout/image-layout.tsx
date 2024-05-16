import React from "react";
import Image from "next/image";
import LogosUnc from "../logos-unc/logos-unc";
import imageUnc from "/public/ecampus.jpg";

export default function LayoutDefault(props: any) {
  const { children } = props;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:h-screen">
      <div className="w-full">
        <Image
          src={imageUnc}
          alt="image"
          width={1800}
          height={1013}
          className="lg:h-lvh  md:h-dvh w-full md:sticky top-0 overflow-hidden"
          style={{
            objectFit: "cover",
            border: "35px solid #fff",
            borderRadius: "60px",
          }}
          priority
        />
      </div>
      <div className="w-full px-6 md:px-12 text-textColor my-4 text-center">
        <LogosUnc />
        {children}
      </div>
    </div>
  );
}
