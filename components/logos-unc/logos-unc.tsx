import Image from "next/image";

const LogosUnc = () => {
  return (
    <div className="mx-auto md:w-[550px]">
      <Image
        src={"/logos-unc.png"}
        alt="image"
        width={500}
        height={250}
        style={{
          height: "auto",
          width: "auto",
          objectFit: "cover",
          margin: "0 auto",
          maxWidth: "350px",
        }}
      />
    </div>
  );
};

export default LogosUnc;
