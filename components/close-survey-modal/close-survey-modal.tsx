"use client";
import { useState } from "react";
import { Button } from "../ui/button";

export default function ModalCloseSurvey({ visible = false }: { visible : boolean }) { 
  const [isVisible, setIsVisible] = useState<boolean>(visible); // Estado para controlar la visibilidad del modal
  const [password, setPassword] = useState<string>("");
  
  const closeModal = () => {
    setIsVisible(false); // Función para ocultar el modal
  };

  const handleConfirm = () => {
    // Aquí puedes agregar la lógica para confirmar y cerrar el modal si la contraseña es correcta
    // Por ahora, simplemente cerramos el modal
    closeModal();
  };


  return (
    <>      
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-auto max-w-lg p-5 mx-auto my-6 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                Detiene el estudio [nombre de estudio] completando el siguiente campo
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
              <Button onClick={closeModal} className="px-4 py-2 mr-4 text-sm bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:border-blue-500">
                Volver
              </Button>
              <Button onClick={handleConfirm} className="px-4 py-2 text-sm text-white bg-red-500 border border-transparent rounded-md hover:bg-red-600 focus:outline-none focus:border-red-700">
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
