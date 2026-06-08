import useAuth from "../useAuth";
import { Navigate, Outlet } from "react-router-dom";
import useApiClient from "../api/useApiClient";

const PrivateRoutes = () => {
  useApiClient();
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
