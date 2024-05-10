"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import ModalCloseSurvey from "../close-survey-modal/close-survey-modal";

export default function CloseSurvey({ encuesta }: { encuesta: any}) {
  const [openModal, setOpenModal] = useState<boolean>(false);

  function handleModal(): void {
    setOpenModal(!openModal);
  }

  return (
    <>
      { encuesta && encuesta.isActive && (<Button
        className="border  text-white py-2 font-bold rounded bg-[#087B38] hover:bg-[#087B38]"
        onClick={() => handleModal()}
      >
        Finalizar cuestionario
      </Button>)}
      <ModalCloseSurvey action={handleModal} open={openModal} encuesta={encuesta}/>
    </>
  );
}
