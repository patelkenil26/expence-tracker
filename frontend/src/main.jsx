import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import store from "./store";
import { applyThemeVariables } from "./constants/theme";
import "./index.css";

// Immediate initial sync of active theme variables to prevent flash
const initialDark = localStorage.getItem("theme") !== "light";
applyThemeVariables(initialDark);

// Create and configure TanStack QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes fresh cache
      gcTime: 1000 * 60 * 10,   // 10 minutes garbage collection
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          {/* Toast container */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontSize: "0.85rem",
              },
            }}
          />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
