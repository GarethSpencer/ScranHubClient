export type ToastVariant = "success" | "danger";

export interface ToastMessage {
  id: number;
  message: string;
  variant: ToastVariant;
}

export interface AddToastAction {
  type: "ADD";
  toast: ToastMessage;
}

export interface RemoveToastAction {
  type: "REMOVE";
  id: number;
}

export type ToastAction = AddToastAction | RemoveToastAction;

const toastReducer = (
  state: ToastMessage[],
  action: ToastAction,
): ToastMessage[] => {
  switch (action.type) {
    case "ADD":
      return [...state, action.toast];
    case "REMOVE":
      return state.filter((toast) => toast.id !== action.id);
    default:
      return state;
  }
};

export default toastReducer;
