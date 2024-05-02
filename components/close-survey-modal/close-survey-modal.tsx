"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { useSearchParams } from "next/navigation";

type Props = {
  action: () => void;
  open: boolean;
};

export default function ModalCloseSurvey({ action, open }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsOpen(open);
  }, [open, isOpen]);

  const [password, setPassword] = useState<string>("");

  return (
    isOpen && (
      <>
        <dialog open={isOpen}>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black/40">
            <div className="relative w-auto max-w-lg p-5 mx-auto my-6 bg-white border border-gray-300 rounded-lg shadow-lg">
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  Detiene el estudio [nombre de estudio] completando el
                  siguiente campo
                </h3>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introduce tu contraseña"
                  className="block w-full px-4 py-2 mt-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={action}
                  className="px-4 py-2 mr-4 text-sm bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:border-blue-500"
                >
                  Volver
                </Button>
                <Button
                  /* onClick={handleConfirm} */
                  className="px-4 py-2 text-sm text-white bg-red-500 border border-transparent rounded-md hover:bg-red-600 focus:outline-none focus:border-red-700"
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </div>
        </dialog>
      </>
    )
  );
}
