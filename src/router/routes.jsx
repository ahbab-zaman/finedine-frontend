import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "../utils/ProtectedRoute";
import GuestRoute from "../utils/GuestRoute";
import Home from "../layout/Home";
import MenuDetail from "../pages/MenuDetail";
import Cart from "../pages/Cart";
import CreateMenuItem from "../pages/CreateMenuItem";
import MyMenu from "../pages/MyMenu";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "menu/:id",
        element: <MenuDetail />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "create-menu",
        element: <CreateMenuItem />,
      },
      {
        path: "my-menu",
        element: <MyMenu />,
      },
    ],
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
