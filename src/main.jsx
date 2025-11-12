import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MainLayout from "./MainLayout";
import { RouterProvider } from "react-router-dom";
import router from "./router/routes";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}>
      <MainLayout />
    </RouterProvider>
  </StrictMode>
);
