import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AuthProvider from "./auth/AuthProvider";
import "./layout/custom.scss";
import router from "./routes";
import { RouterProvider } from "react-router-dom";
import DarkModeProvider from "./contexts/darkMode/DarkModeProvider";
import ToastProvider from "./contexts/toast/ToastProvider";
import { queryErrorHandler } from "./contexts/toast/queryErrorHandler";

const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: queryErrorHandler }),
  mutationCache: new MutationCache({ onError: queryErrorHandler }),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <DarkModeProvider>
          <ToastProvider>
            <RouterProvider router={router} />
            <ReactQueryDevtools />
          </ToastProvider>
        </DarkModeProvider>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
);
