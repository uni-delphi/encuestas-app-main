// hooks/use-save-once.ts
import { useRef } from "react";

export function useSaveOnce<T>({
  initialId,
  create,
  update,
}: {
  initialId?: number;
  create: (value: T) => Promise<number | undefined>;
  update: (value: T, id: number) => Promise<unknown>;
}) {
  const idRef = useRef<number | undefined>(initialId);
  const pendingRef = useRef<Promise<number | undefined> | null>(null);

  return async (value: T) => {
    // Hay un create en curso: esperar a que termine para tener el id
    if (!idRef.current && pendingRef.current) {
      await pendingRef.current;
    }

    // Ya existe el registro: actualizar
    if (idRef.current) {
      await update(value, idRef.current);
      return;
    }

    // No existe: crear (una sola vez)
    pendingRef.current = create(value)
      .then((id) => {
        idRef.current = id;
        return id;
      })
      .finally(() => {
        pendingRef.current = null;
      });

    await pendingRef.current;
  };
}