"use client";
import { createContext, useContext, useState } from "react";

const ConfirmationContext = createContext();

export const ConfirmationProvider = ({ children }) => {
  const [confirmation, setConfirmation] = useState(null);

  const showConfirmation = ({
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    isDangerous = false,
  }) => {
    return new Promise((resolve) => {
      setConfirmation({
        title,
        message,
        confirmText,
        cancelText,
        isDangerous,
        onConfirm: async () => {
          if (onConfirm) await onConfirm();
          setConfirmation(null);
          resolve(true);
        },
        onCancel: () => {
          if (onCancel) onCancel();
          setConfirmation(null);
          resolve(false);
        },
      });
    });
  };

  return (
    <ConfirmationContext.Provider value={{ confirmation, showConfirmation }}>
      {children}
    </ConfirmationContext.Provider>
  );
};

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error("useConfirmation must be used within ConfirmationProvider");
  }
  return context;
};
