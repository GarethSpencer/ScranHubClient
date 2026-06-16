import { Navigate, Outlet } from "react-router-dom";
import { useGetCurrentUser } from "../api/controllerHooks/useUserController";

const AdminRoutes = () => {
  const { data, isLoading } = useGetCurrentUser();
  if (isLoading) return null;

  if (!data?.user?.admin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRoutes;
