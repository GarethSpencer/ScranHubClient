import { isAxiosError } from "axios";
import { showGlobalToast } from "./toastBridge";
import type CommonResponse from "../../models/responses/generic/CommonResponse";

const getValidationErrorMessage = (data: unknown): string | undefined => {
  if (typeof data !== "object" || data === null) return undefined;

  for (const value of Object.values(data)) {
    if (Array.isArray(value) && typeof value[0] === "string") {
      return value[0];
    }
  }
  return undefined;
};

export const queryErrorHandler = (error: unknown) => {
  const fallbackMessage = "Something went wrong. Please try again.";
  if (isAxiosError<CommonResponse>(error)) {
    const message =
      error.response?.data?.message ??
      getValidationErrorMessage(error.response?.data) ??
      fallbackMessage;
    showGlobalToast(message, "danger");
    return;
  }
  showGlobalToast(fallbackMessage, "danger");
};
