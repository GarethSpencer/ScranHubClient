import "./Layout.css";
import { Outlet } from "react-router-dom";
import LayoutFooter from "../../components/LayoutFooter";
import DarkModeButton from "../../components/DarkModeButton";
import LogoutButton from "../../components/LogoutButton";

const Layout = () => {
  return (
    <div className="main-layout-container">
      <div className="content-wrapper">
        <div>
          <LogoutButton />
          <DarkModeButton />
        </div>
        <Outlet />
      </div>
      <LayoutFooter />
    </div>
  );
};

export default Layout;
