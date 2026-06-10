import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AuthProvider from "./auth/AuthProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import router from "./routes";
import { RouterProvider } from "react-router-dom";
import DarkModeProvider from "./contexts/darkMode/DarkModeProvider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <DarkModeProvider>
          <RouterProvider router={router} />
          <ReactQueryDevtools />
        </DarkModeProvider>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
);
