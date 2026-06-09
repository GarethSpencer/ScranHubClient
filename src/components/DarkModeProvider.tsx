import React, { useEffect, useReducer } from "react";
import darkModeReducer from "../reducers/darkModeReducer";
import DarkModeContext from "../contexts/darkModeContext";

interface Props {
  children: React.ReactNode;
}

const DarkModeProvider = ({ children }: Props) => {
  const [state, toggleDarkMode] = useReducer(
    darkModeReducer,
    null,
    () => document.documentElement.getAttribute("data-bs-theme") === "dark",
  );

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
