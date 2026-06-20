import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import SectionLayout from "./layout/SectionLayout";
import HomePage from "./pages/HomePage";
import PrivateRoutes from "./layout/PrivateRoutes";
import AdminRoutes from "./layout/AdminRoutes";
import ErrorPage from "./pages/ErrorPage";
import LoginLayout from "./layout/LoginLayout";
import Todo from "./components/Todo";
import MyFriendsPage from "./pages/friends/MyFriendsPage";
import FindFriendsPage from "./pages/friends/FindFriendsPage";
import ManageRequestsPage from "./pages/friends/ManageRequestsPage";
import FindGroupsPage from "./pages/groups/FindGroupsPage";
import JoinedGroupsPage from "./pages/groups/JoinedGroupsPage";
import ManageCreatedGroupsPage from "./pages/groups/ManageCreatedGroupsPage";

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
            path: "friends",
            element: (
              <SectionLayout
                tabs={[
                  { label: "My Friends", to: "/friends", end: true },
                  { label: "Find Friends", to: "/friends/find" },
                  { label: "Manage Requests", to: "/friends/manage" },
                ]}
              />
            ),
            children: [
              {
                index: true,
                element: <MyFriendsPage />,
              },
              {
                path: "find",
                element: <FindFriendsPage />,
              },
              {
                path: "manage",
                element: <ManageRequestsPage />,
              },
            ],
          },
          {
            path: "groups",
            element: (
              <SectionLayout
                tabs={[
                  { label: "My Groups", to: "/groups", end: true },
                  { label: "Find Groups", to: "/groups/find" },
                  { label: "Manage Created Groups", to: "/groups/manage" },
                ]}
              />
            ),
            children: [
              {
                index: true,
                element: <JoinedGroupsPage />,
              },
              {
                path: "find",
                element: <FindGroupsPage />,
              },
              {
                path: "manage",
                element: <ManageCreatedGroupsPage />,
              },
            ],
          },
          {
            element: <AdminRoutes />,
            children: [
              {
                path: "admin",
                element: <SectionLayout />,
                children: [
                  {
                    index: true,
                    element: <Todo />,
                  },
                ],
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
