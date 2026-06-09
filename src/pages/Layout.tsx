import "./Layout.css";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const copyrightYear = new Date().getFullYear();

  return (
    <div className="main-layout-container">
      <div className="content-wrapper">
        <Outlet />
      </div>
      <div className="content-footer">
        <p>© {copyrightYear} Gareth Spencer. Happy Scranning!</p>
      </div>
    </div>
  );
};

export default Layout;
