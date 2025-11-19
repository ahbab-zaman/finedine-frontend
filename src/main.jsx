import React, { useEffect } from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router/routes";
import { useAuthStore } from "./store/useAuthStore";
import "./index.css";
import Loading from "./components/Loading";

const App = () => {
  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return <RouterProvider router={router} />;
};

createRoot(document.getElementById("root")).render(<App />);
