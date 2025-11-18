import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastProvider } from "./components/ToastProvider";

const MainLayout = () => {
  const location = useLocation();
  const [navbarHidden, setNavbarHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === "/") {
        setNavbarHidden(window.scrollY > 0);
      } else {
        setNavbarHidden(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Set initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 text-[#575962]">
      <div>
        <Navbar hidden={navbarHidden} />
      </div>
      <div
        className={`transition-all duration-300 ${
          navbarHidden ? "pt-0" : "pt-[70px]"
        }`}
      >
        <ToastProvider>
          <Outlet />
        </ToastProvider>
      </div>
    </div>
  );
};

export default MainLayout;
