import Image from "next/image";

const LogosUnc = () => {
  return (
    <div className="mx-auto">
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
          maxWidth: "300px",
        }}
      />
    </div>
  );
};

export default LogosUnc;
