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
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white text-[#575962] select-none">
      {/* Navbar */}
      <Navbar hidden={navbarHidden} />

      {/* Content Wrapper */}
      <div
        className="transition-all duration-300"
        style={{
          paddingTop: "40px",
          minHeight: "calc(100vh - 68px)",
        }}
      >
        <ToastProvider>
          <Outlet />
        </ToastProvider>
      </div>
    </div>
  );
};

export default MainLayout;
