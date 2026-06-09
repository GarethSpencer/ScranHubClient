import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ScranhubAuth0Provider from "./auth0/ScranhubAuth0Provider";
import "bootstrap/dist/css/bootstrap.min.css";
import router from "./routes";
import { RouterProvider } from "react-router-dom";
import DarkModeProvider from "./components/DarkModeProvider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ScranhubAuth0Provider>
      <QueryClientProvider client={queryClient}>
        <DarkModeProvider>
          <RouterProvider router={router} />
          <ReactQueryDevtools />
        </DarkModeProvider>
      </QueryClientProvider>
    </ScranhubAuth0Provider>
  </StrictMode>,
);
