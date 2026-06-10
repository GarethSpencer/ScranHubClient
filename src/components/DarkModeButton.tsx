import { MdDarkMode, MdLightMode } from "react-icons/md";
import useDarkMode from "../contexts/darkMode/useDarkMode";

const DarkModeButton = () => {
  const { state: isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      className="position-absolute top-0 end-0 m-3 border-0 bg-transparent fs-4 theme-toggle-btn"
      onClick={() => toggleDarkMode({ type: "SET" })}
    >
      {isDarkMode ? <MdLightMode /> : <MdDarkMode />}
    </button>
  );
};

export default DarkModeButton;
