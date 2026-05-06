"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ModalCloseSurvey from "../close-survey-modal/close-survey-modal";
import { XCircle } from "lucide-react";

export default function CloseSurvey({ encuesta }: { encuesta: any }) {
  const [openModal, setOpenModal] = useState<boolean>(false);

  function handleModal(): void {
    setOpenModal(!openModal);
  }

  return (
    <>
      {encuesta && encuesta.isActive && (
        <Button
          variant="outline"
          className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive transition-all"
          onClick={() => handleModal()}
        >
          <XCircle className="w-4 h-4 mr-2" />
          Cerrar encuesta
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
