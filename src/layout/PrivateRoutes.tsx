import { useEffect, useState } from "react";
import useAuth from "../auth/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useConfigureApiAuth from "../api/useConfigureApiAuth";
import RealtimeProvider from "../realtime/RealtimeProvider";

const PrivateRoutes = () => {
  useConfigureApiAuth();
  const location = useLocation();
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth();
  const returnTo = `${location.pathname}${location.search}${location.hash}`;
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
    return <Navigate to="/login" state={{ returnTo }} replace />;
  }

  const tokenStatus =
    tokenCheck?.getter === getAccessTokenSilently
      ? tokenCheck.status
      : "checking";

  if (tokenStatus === "invalid") {
    return <Navigate to="/login" state={{ returnTo }} replace />;
  }
  if (tokenStatus !== "valid") return null;

  return (
    <RealtimeProvider>
      <Outlet />
    </RealtimeProvider>
  );
};

export default PrivateRoutes;
