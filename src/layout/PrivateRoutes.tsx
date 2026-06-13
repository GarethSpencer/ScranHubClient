import useAuth from "../auth/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import useConfigureApiAuth from "../api/useConfigureApiAuth";

const PrivateRoutes = () => {
  useConfigureApiAuth();
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
