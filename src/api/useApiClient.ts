import { useAuth0 } from "@auth0/auth0-react";
import { axiosInstance } from "./apiClient";
import { useEffect } from "react";

const useApiClient = () => {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await getAccessTokenSilently();
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
    );

    return () => axiosInstance.interceptors.request.eject(interceptor);
  }, [getAccessTokenSilently]);
};

export default useApiClient;
