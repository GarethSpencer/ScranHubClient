import "./Layout.scss";
import LoginPage from "../pages/LoginPage";
import DarkModeButton from "../components/layout/DarkModeButton";
import LoginLayoutFooter from "../components/layout/LoginLayoutFooter";

const LoginLayout = () => {
  return (
    <div className="main-layout-container">
      <div className="login-content-wrapper mx-2">
        <DarkModeButton />
        <LoginPage />
      </div>
      <LoginLayoutFooter />
    </div>
  );
};

export default LoginLayout;
