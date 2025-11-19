import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "../utils/ProtectedRoute";
import GuestRoute from "../utils/GuestRoute";
import Home from "../layout/Home";
import MenuDetail from "../pages/MenuDetail";
import Cart from "../pages/Cart";
import MyMenu from "../pages/MyMenu";
import AddReview from "../pages/AddReview";
import ProfilePage from "../pages/ProfilePage";

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
        path: "my-menu",
        element: <MyMenu />,
      },
      {
        path: "/add-review",
        element: <AddReview />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
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
