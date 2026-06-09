import "./Layout.css";
import LoginPage from "../LoginPage";
import DarkModeContext from "../../contexts/darkModeContext";
import { useContext } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const LoginLayout = () => {
  const { state: isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const copyrightYear = new Date().getFullYear();

  return (
    <div className="main-layout-container flex-column">
      <div className="login-content-wrapper">
        <button
          className="position-absolute top-0 end-0 m-3 border-0 bg-transparent fs-4 theme-toggle-btn"
          onClick={() => toggleDarkMode({ type: "SET" })}
        >
          {isDarkMode ? <MdLightMode /> : <MdDarkMode />}
        </button>
        <LoginPage />
      </div>
      <div className="content-footer">
        <a href="https://www.magnific.com">
          Background image designed by Freepik - Magnific.com
        </a>
        <p>© {copyrightYear} Gareth Spencer. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LoginLayout;
