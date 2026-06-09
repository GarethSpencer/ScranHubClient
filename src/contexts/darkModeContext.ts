import type { Dispatch } from "react";
import type { SetAction } from "../reducers/darkModeReducer";
import React from "react";

interface DarkModeContextType {
  state: boolean;
  toggleDarkMode: Dispatch<SetAction>;
}

const DarkModeContext = React.createContext<DarkModeContextType>(
  {} as DarkModeContextType,
);

export default DarkModeContext;
