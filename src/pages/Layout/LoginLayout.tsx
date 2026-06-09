import "./Layout.css";
import LoginPage from "../LoginPage";
import DarkModeContext from "../../contexts/darkModeContext";
import { useContext } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const LoginLayout = () => {
  const { state: isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const copyrightYear = new Date().getFullYear();
  const magnificLink = "https://www.magnific.com";
  const frontendLink = "https://github.com/garethspencer/ScranHubClient";
  const backendLink = "https://github.com/garethspencer/ScranHub";

  return (
    <div className="main-layout-container flex-column">
      <div className="login-content-wrapper mx-2">
        <button
          className="position-absolute top-0 end-0 m-3 border-0 bg-transparent fs-4 theme-toggle-btn"
          onClick={() => toggleDarkMode({ type: "SET" })}
        >
          {isDarkMode ? <MdLightMode /> : <MdDarkMode />}
        </button>
        <LoginPage />
      </div>
      <div className="content-footer">
        <a href={magnificLink} className="d-block">
          Background image designed by Freepik - Magnific.com
        </a>
        <p className="d-block mt-2">
          © {copyrightYear} Gareth Spencer. Check out my{" "}
          <a href={frontendLink}>frontend</a> and{" "}
          <a href={backendLink}>backend</a> source code on GitHub.
        </p>
      </div>
    </div>
  );
};

export default LoginLayout;
