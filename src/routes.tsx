import { createBrowserRouter } from "react-router-dom";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import PrivateRoutes from "./pages/PrivateRoutes";
import ErrorPage from "./pages/ErrorPage";
import LoginLayout from "./pages/LoginLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <PrivateRoutes />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginLayout />,
  },
]);

export default router;
