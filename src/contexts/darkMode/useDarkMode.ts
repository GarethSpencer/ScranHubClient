import { useContext } from "react";
import DarkModeContext from "./darkModeContext";

const useDarkMode = () => useContext(DarkModeContext);

export default useDarkMode;
