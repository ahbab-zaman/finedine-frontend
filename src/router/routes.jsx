import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../MainLayout";
import Login from "../pages/login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
