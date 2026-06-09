import { useContext } from "react";
import "./Layout.css";
import { Outlet } from "react-router-dom";
import DarkModeContext from "../../contexts/darkModeContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";

const Layout = () => {
  const { state: isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const copyrightYear = new Date().getFullYear();
  const { logout } = useAuth0();

  return (
    <div className="main-layout-container">
      <div className="content-wrapper">
        <div>
          <Button
            className="btn-primary position-absolute top-0 start-0 m-3 border-0 bg-transparent logout-btn"
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Logout
          </Button>
          <button
            className="position-absolute top-0 end-0 m-3 border-0 bg-transparent fs-4 theme-toggle-btn"
            onClick={() => toggleDarkMode({ type: "SET" })}
          >
            {isDarkMode ? <MdLightMode /> : <MdDarkMode />}
          </button>
        </div>
        <Outlet />
      </div>
      <div className="content-footer">
        <p>© {copyrightYear} Gareth Spencer. Happy Scranning!</p>
      </div>
    </div>
  );
};

export default Layout;
