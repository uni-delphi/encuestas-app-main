import React from "react";
import Image from "next/image";
import LogosUnc from "../logos-unc/logos-unc";

export default function LayoutDefault(props: any) {
  const { children } = props;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:h-screen">
      <div className="w-full p-10">
        <Image
          src={"/ecampus.jpg"}
          alt="image"
          width={200}
          height={160}
          sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
          className="lg:h-lvh w-full md:sticky top-0 rounded-2xl"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="w-full px-6 md:px-12 text-textColor my-4 text-center">
        <LogosUnc />
        {children}
      </div>
    </div>
  );
}
