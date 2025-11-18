import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastProvider } from "./components/ToastProvider";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-[#575962]">
      <div>
        <Navbar />
      </div>
      <div className="pt-16">
        <ToastProvider>
          <Outlet />
        </ToastProvider>
      </div>
    </div>
  );
};

export default MainLayout;
