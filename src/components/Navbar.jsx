import React, { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore"; // Adjust the import path as needed
import logo from "../assets/fine-dine-logo.png";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuthStore();
  const isAuth = isAuthenticated();

  const handleLogout = () => {
    logout();
    setSidebarOpen(false); // Optionally close sidebar on logout
  };

  const handleLoginClick = () => {
    // TODO: Implement login modal/form trigger here
    // For now, you can console.log or redirect to login page
    console.log("Open login modal");
  };

  return (
    <div className="relative py-4">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-300 px-4 py-11 flex items-center justify-between fixed top-0 left-0 w-full z-50 h-[70px]">
        <div className="w-1/3 flex">
          <img src={logo} alt="Logo" className="h-[60px]" />
        </div>

        <div className="text-center">
          <h2 className="text-center text-xl font-medium">Fine Dine Menu</h2>
        </div>

        {/* Right (Login/Logout + Menu/X toggle) */}
        <div className="w-1/3 flex justify-end items-center space-x-4">
          <div
            className="flex items-center space-x-1 cursor-pointer"
            onClick={isAuth ? handleLogout : handleLoginClick}
          >
            {isAuth ? <LogOut size={20} /> : <User size={20} />}
            <span className="font-medium">{isAuth ? "Logout" : "Login"}</span>
          </div>

          <button
            className="focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Sidebar (Right-to-Left, below navbar) */}
      <div
        className={`fixed top-[70px] right-0 h-[calc(100vh-70px)] w-64 bg-white border-l border-gray-300 transform transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="flex flex-col mt-10 space-y-6 px-6 text-lg">
          <li>
            <a
              href="#order"
              className="hover:text-blue-500 transition-colors duration-200"
            >
              Order Status
            </a>
          </li>
          <li>
            <a
              href="#feedback"
              className="hover:text-blue-500 transition-colors duration-200"
            >
              Give Feedback
            </a>
          </li>
        </ul>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed top-[70px] left-0 w-full h-[calc(100vh-70px)]
               bg-black opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Navbar;
