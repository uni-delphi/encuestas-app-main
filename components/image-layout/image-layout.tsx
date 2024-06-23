import React, { Suspense } from "react";
import Image from "next/image";
import LogosUnc from "../logos-unc/logos-unc";
import imageUnc from "/public/ecampus.jpg";

export default function LayoutDefault(props: any) {
  const { children } = props;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:h-screen">
      <div className="w-full">
        <Suspense
          fallback={
            <div className="max-w-[80%] mx-auto">
              <div className="flex flex-col h-[8rem]">
                <span className="w-9/12 bg-gray-300 h-4 rounded-full animate-pulse"></span>
                <span className="w-11/12 border border-input rounded-md h-[6rem] rounded-4 animate-pulse"></span>
              </div>
            </div>
          }
        >
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
            priority={false}
          />
        </Suspense>
      </div>
      <div className="w-full px-6 md:px-12 text-textColor my-4 text-center">
        <Suspense
          fallback={
            <div className="max-w-[80%] mx-auto">
              <div className="flex flex-col h-[8rem]">
                <span className="w-12/12 border border-input rounded-md h-[6rem] rounded-4 animate-pulse"></span>
              </div>
            </div>
          }
        >
          <LogosUnc />
        </Suspense>
        {children}
      </div>
    </div>
  );
}
