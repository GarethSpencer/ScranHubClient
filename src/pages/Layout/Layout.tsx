import { useContext } from "react";
import "./Layout.css";
import { Outlet } from "react-router-dom";
import DarkModeContext from "../../contexts/darkModeContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const Layout = () => {
  const { state: isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const copyrightYear = new Date().getFullYear();

  return (
    <div className="main-layout-container">
      <div className="content-wrapper">
        <button
          className="position-absolute top-0 end-0 m-3 border-0 bg-transparent fs-4 theme-toggle-btn"
          onClick={() => toggleDarkMode({ type: "SET" })}
        >
          {isDarkMode ? <MdLightMode /> : <MdDarkMode />}
        </button>
        <Outlet />
      </div>
      <div className="content-footer">
        <p>© {copyrightYear} Gareth Spencer. Happy Scranning!</p>
      </div>
    </div>
  );
};

export default Layout;
