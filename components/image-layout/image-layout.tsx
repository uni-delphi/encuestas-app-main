import React from "react";
import Image from "next/image";

export default function LayoutDefault(props: any) {
  const { children } = props;
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
          className="lg:h-lvh  w-full"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="w-full overflow-y-auto px-12 text-textColor my-4 text-center ">
        <Image
          src={"/logos-unc.png"}
          alt="image"
          width={450}
          height={250}
          style={{
            height: "auto",
            width: "auto",
            objectFit: "cover",
            margin: "0 auto",
          }}
        />
        {children}
      </div>
    </div>
  );
}
