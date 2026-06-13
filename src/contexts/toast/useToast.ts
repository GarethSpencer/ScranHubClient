import { useContext } from "react";
import ToastContext from "./toastContext";

const useToast = () => useContext(ToastContext);

export default useToast;
