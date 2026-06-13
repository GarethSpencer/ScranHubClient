import useAuth from "../auth/useAuth";
import { setAccessTokenGetter } from "./apiClient";
import { useEffect } from "react";

const useConfigureApiAuth = () => {
  const { getAccessTokenSilently } = useAuth();

  useEffect(() => {
    setAccessTokenGetter(getAccessTokenSilently);
  }, [getAccessTokenSilently]);
};

export default useConfigureApiAuth;
