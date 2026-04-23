"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ModalCloseSurvey from "../close-survey-modal/close-survey-modal";

export default function CloseSurvey({ encuesta }: { encuesta: any }) {
  const [openModal, setOpenModal] = useState<boolean>(false);

  function handleModal(): void {
    setOpenModal(!openModal);
  }

  return (
    <>
      {encuesta && encuesta.isActive && (
        <Button
          variant="destructive"
          className=""
          onClick={() => handleModal()}
        >
          Finalizar encuesta
        </Button>
      )}
      <ModalCloseSurvey
        action={handleModal}
        open={openModal}
        encuesta={encuesta}
      />
    </>
  );
}
