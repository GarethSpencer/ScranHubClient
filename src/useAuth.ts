import { useAuth0 } from "@auth0/auth0-react";

const useAuth = () => {
  const { isAuthenticated, isLoading, user, getAccessTokenSilently, logout } =
    useAuth0();
  return { isAuthenticated, isLoading, user, getAccessTokenSilently, logout };
};

export default useAuth;
