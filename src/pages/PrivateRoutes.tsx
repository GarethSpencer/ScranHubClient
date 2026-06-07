import useAuth from "../useAuth";
import { Navigate } from "react-router-dom";

const PrivateRoutes = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoutes;
