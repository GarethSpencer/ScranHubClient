import useAuth from "../auth/useAuth";
import { setAccessTokenGetter } from "./apiClient";
import { useEffect } from "react";

const useApiClient = () => {
  const { getAccessTokenSilently } = useAuth();

  useEffect(() => {
    setAccessTokenGetter(getAccessTokenSilently);
  }, [getAccessTokenSilently]);
};

export default useApiClient;
