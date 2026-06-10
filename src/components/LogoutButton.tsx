import Button from "react-bootstrap/Button";
import useAuth from "../auth/useAuth";

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <Button
      className="btn-primary position-absolute top-0 start-0 m-3 border-0 bg-transparent logout-btn"
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
