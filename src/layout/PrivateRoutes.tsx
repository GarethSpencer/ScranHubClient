import { useEffect, useState } from "react";
import useAuth from "../auth/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import useConfigureApiAuth from "../api/useConfigureApiAuth";
import RealtimeProvider from "../realtime/RealtimeProvider";

const PrivateRoutes = () => {
  useConfigureApiAuth();
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth();
  const [tokenCheck, setTokenCheck] = useState<{
    getter: typeof getAccessTokenSilently;
    status: "valid" | "invalid";
  } | null>(null);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    let cancelled = false;

    getAccessTokenSilently()
      .then(() => {
        if (!cancelled) {
          setTokenCheck({ getter: getAccessTokenSilently, status: "valid" });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTokenCheck({ getter: getAccessTokenSilently, status: "invalid" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [getAccessTokenSilently, isAuthenticated, isLoading]);

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const tokenStatus =
    tokenCheck?.getter === getAccessTokenSilently
      ? tokenCheck.status
      : "checking";

  if (tokenStatus === "invalid") {
    return <Navigate to="/login" replace />;
  }
  if (tokenStatus !== "valid") return null;

  return (
    <RealtimeProvider>
      <Outlet />
    </RealtimeProvider>
  );
};

export default PrivateRoutes;
