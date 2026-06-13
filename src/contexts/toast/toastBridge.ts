import type { ToastVariant } from "./toastReducer";

type ShowToast = (message: string, variant: ToastVariant) => void;

let showToast: ShowToast | null = null;

export const setToastBridge = (fn: ShowToast) => {
  showToast = fn;
};

export const showGlobalToast: ShowToast = (message, variant) => {
  showToast?.(message, variant);
};
