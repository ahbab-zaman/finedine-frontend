import React, { useState } from "react";
import { Menu, X, User } from "lucide-react";
import logo from "../assets/fine-dine-logo.png";
const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative py-4">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-300 px-4 py-3 flex items-center justify-between fixed top-0 left-0 w-full z-50 h-[70px]">
        {/* Left (empty) */}
        <div className="w-1/3"></div>

        {/* Center (Logo) */}
        <div className="w-1/3 flex justify-center">
          <img src={logo} alt="Logo" className="h-[60px]" />
        </div>

        {/* Right (Login + Menu/X toggle) */}
        <div className="w-1/3 flex justify-end items-center space-x-4">
          <div className="flex items-center space-x-1 cursor-pointer">
            <User size={20} />
            <span className="font-medium">Login</span>
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
        className={`fixed top-14 right-0 h-[calc(100%-56px)] w-64 bg-white border-l border-gray-300 transform transition-transform duration-300 z-40 ${
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

      {/* Overlay below navbar */}
      {sidebarOpen && (
        <div
          className="fixed top-14 left-0 w-full h-[calc(100%-56px)] bg-white bg-opacity-50 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Navbar;
