import "./Layout.css";
import LoginPage from "../pages/LoginPage";
import DarkModeButton from "../components/DarkModeButton";
import LoginLayoutFooter from "../components/LoginLayoutFooter";

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
