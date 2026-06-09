import "./Layout.css";
import LoginPage from "./LoginPage";

const LoginLayout = () => {
  const copyrightYear = new Date().getFullYear();

  return (
    <div className="main-layout-container flex-column">
      <div className="login-content-wrapper">
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
