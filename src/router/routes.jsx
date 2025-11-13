import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "../utils/ProtectedRoute";
import GuestRoute from "../utils/GuestRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <Register />
      </GuestRoute>
    ),
  },
]);

export default router;
