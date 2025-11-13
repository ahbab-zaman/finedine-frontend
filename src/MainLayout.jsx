import { Outlet } from "react-router-dom";
import { useAuthStore } from "../src/store/useAuthStore"; // Assuming store path
import Navbar from "./components/Navbar";

const MainLayout = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6">
        {/* Default content for "/" - renders when no child routes match */}
        {user && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome, {user.name}!
            </h1>
            <p className="text-gray-600 mb-6">
              This is your default dashboard. Add more features here as needed.
            </p>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
            >
              Logout
            </button>
          </div>
        )}
        {/* Outlet for future child routes - e.g., /dashboard, /profile */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
