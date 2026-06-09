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
    <div className="text-center mt-5">
      <h1 className="display-4">ScranHub</h1>
      <h2 className="lead">
        Plan and rate your scranning adventures with your friends!
      </h2>
      <div className="w-75 mx-auto mt-5">
        <Button
          size="lg"
          variant="primary"
          className="w-100"
          onClick={(event) => auth0Signup(event, { type: "login" })}
        >
          Login
        </Button>
        <p className="mt-3 text-center text-muted">
          Need to create an account?
          <a
            className="ms-1 d-block"
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
