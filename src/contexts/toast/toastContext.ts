import React from "react";
import type { ToastVariant } from "./toastReducer";

interface ToastContextType {
  showToast: (message: string, variant: ToastVariant) => void;
}

const ToastContext = React.createContext<ToastContextType>(
  {} as ToastContextType,
);

export default ToastContext;
