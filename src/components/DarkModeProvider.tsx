import React, { useEffect, useReducer } from "react";
import darkModeReducer from "../reducers/darkModeReducer";
import DarkModeContext from "../contexts/darkModeContext";

interface Props {
  children: React.ReactNode;
}

const DarkModeProvider = ({ children }: Props) => {
  const [state, toggleDarkMode] = useReducer(darkModeReducer, null, () => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) {
      return stored === "true";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", String(state));
  }, [state]);

  return (
    <DarkModeContext.Provider value={{ state, toggleDarkMode }}>
      <div data-bs-theme={state ? "dark" : "light"}>{children}</div>
    </DarkModeContext.Provider>
  );
};

export default DarkModeProvider;
