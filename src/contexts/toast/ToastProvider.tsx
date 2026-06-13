import React, { useCallback, useEffect, useReducer } from "react";
import BootstrapToast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import toastReducer from "./toastReducer";
import ToastContext from "./toastContext";
import { setToastBridge } from "./toastBridge";

interface Props {
  children: React.ReactNode;
}

let nextToastId = 0;

const ToastProvider = ({ children }: Props) => {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const removeToast = useCallback((id: number) => {
    dispatch({ type: "REMOVE", id });
  }, []);

  const showToast = useCallback(
    (message: string, variant: "success" | "danger") => {
      dispatch({ type: "ADD", toast: { id: nextToastId++, message, variant } });
    },
    [],
  );

  useEffect(() => {
    setToastBridge(showToast);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer position="bottom-end" className="p-3">
        {toasts.map((toast) => (
          <BootstrapToast
            key={toast.id}
            show
            onClose={() => removeToast(toast.id)}
            delay={4000}
            autohide
            bg={toast.variant}
          >
            <BootstrapToast.Body className="text-white">
              {toast.message}
            </BootstrapToast.Body>
          </BootstrapToast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
