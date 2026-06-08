import Button from "react-bootstrap/Button";
import { useAuth0 } from "@auth0/auth0-react";

interface LoginType {
  type: "login" | "signup";
}

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();

  const auth0Signup = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    type: LoginType,
  ) => {
    e.preventDefault();
    loginWithRedirect({
      authorizationParams: {
        screen_hint: type.type === "signup" ? "signup" : "login",
      },
    });
  };

  return (
    <div className="container">
      <h1 className="text-center mt-5">Login</h1>
      <div className="w-75 mx-auto mt-5">
        <Button
          variant="primary"
          className="w-100"
          onClick={(event) => auth0Signup(event, { type: "login" })}
        >
          Get Scranning
        </Button>
        <p className="mt-3 text-center">
          Need to create an account?{" "}
          <a
            href="#"
            onClick={(event) => auth0Signup(event, { type: "signup" })}
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
