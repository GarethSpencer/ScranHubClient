import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import HomePage from "./pages/HomePage";
import PrivateRoutes from "./layout/PrivateRoutes";
import AdminRoutes from "./layout/AdminRoutes";
import ErrorPage from "./pages/ErrorPage";
import LoginLayout from "./layout/LoginLayout";
import Todo from "./components/Todo";
import ManageFriendsPage from "./pages/ManageFriendsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoutes />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "/friends",
            element: <ManageFriendsPage />,
          },
          {
            path: "/groups",
            element: <Todo />,
          },
          {
            element: <AdminRoutes />,
            children: [
              {
                path: "/admin",
                element: <Todo />,
              },
            ],
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
