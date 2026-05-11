import { useState, useCallback } from "react";

type ConfirmOptions = {
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
};

export function useConfirmModal() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
  }, []);

  const handleConfirm = async () => {
    if (!options) return;
    setIsLoading(true);
    try {
      await options.onConfirm();
    } finally {
      setIsLoading(false);
      setOptions(null);
    }
  };

  const handleCancel = () => setOptions(null);

  return {
    confirmModalProps: {
      open: !!options,
      title: options?.title ?? "",
      description: options?.description ?? "",
      confirmLabel: options?.confirmLabel ?? "Eliminar",
      isLoading,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    },
    confirm,
  };
}