import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  ShoppingCart,
  Home,
  Edit3,
  Star,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import logo from "../assets/fine-dine-logo.png";

const Navbar = ({ hidden = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const { user, logout, token } = useAuthStore();
  const navigate = useNavigate();
  const isAuth = !!token && !!user;

  const fetchCartCount = async () => {
    if (!isAuth) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) {
        setCartCount(
          result.cart.items.reduce((sum, item) => sum + item.quantity, 0)
        );
      }
    } catch (err) {
      console.error("Error fetching cart count:", err);
    }
  };

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    navigate("/");
  };

  const handleLogin = () => navigate("/login");

  useEffect(() => {
    fetchCartCount();
  }, [isAuth, token]);

  useEffect(() => {
    const update = () => fetchCartCount();
    window.addEventListener("cartUpdated", update);
    return () => window.removeEventListener("cartUpdated", update);
  }, [isAuth, token]);

  return (
    <div className="relative py-4">
      {/* TOP NAV */}
      <nav
        className={`bg-white/90 backdrop-blur-md border-b border-gray-200 fixed top-0 left-0 w-full z-20 h-[68px] flex items-center shadow-sm transition-all ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="w-11/12 mx-auto flex items-center justify-between">
          {/* LOGO */}
          <NavLink to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-10 rounded-full shadow hover:scale-105 transition-transform"
            />
          </NavLink>

          {/* TITLE */}
          <h2 className="hidden sm:block text-xl font-semibold text-gray-800 tracking-wide">
            Fine Dine Menu
          </h2>

          {/* RIGHT ICONS */}
          <div className="flex items-center space-x-4">
            {isAuth && (
              <NavLink
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-all hover:scale-110"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            )}

            {/* DESKTOP AUTH BUTTON */}
            <div
              className="hidden md:flex items-center space-x-2 cursor-pointer p-2 rounded-full hover:bg-gray-100 transition hover:scale-105"
              onClick={isAuth ? handleLogout : handleLogin}
            >
              {isAuth ? (
                <LogOut size={20} className="text-red-500" />
              ) : (
                <User size={20} />
              )}
              {/* Show username only on desktop */}
              <span className="font-medium text-gray-700">
                {isAuth ? `Hi, ${user.name || user.email}` : "Login"}
              </span>
            </div>

            {/* SIDEBAR TOGGLE BUTTON (ALL DEVICES) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="py-2 text-gray-600 hover:text-[#E6034B] hover:scale-110 transition"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </nav>

      {/* SIDEBAR OVERLAY (Desktop + Mobile) */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* SIDEBAR PANEL (Desktop + Mobile) */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-90 p-6 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Menu</h3>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* NAV ITEMS */}
        <nav className="space-y-3">
          <SidebarLink to="/" label="Home" Icon={Home} close={setSidebarOpen} />

          {isAuth && (
            <>
              <SidebarLink
                to="/my-menu"
                label="My Menu"
                Icon={Edit3}
                close={setSidebarOpen}
              />
              <SidebarLink
                to="/add-review"
                label="Add Review"
                Icon={Star}
                close={setSidebarOpen}
              />
              <SidebarLink
                to="/profile"
                label="Profile"
                Icon={User}
                close={setSidebarOpen}
              />

              {/* MOBILE + DESKTOP LOGOUT */}
              <button
                onClick={handleLogout}
                className="w-full mt-6 items-center gap-3 p-3 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition lg:hidden flex"
              >
                <LogOut size={20} />
                Logout
              </button>
            </>
          )}

          {!isAuth && (
            <SidebarLink
              to="/login"
              label="Login"
              Icon={User}
              close={setSidebarOpen}
            />
          )}
        </nav>
      </div>
    </div>
  );
};

const SidebarLink = ({ to, label, Icon, close }) => (
  <NavLink
    to={to}
    onClick={() => close(false)}
    className={({ isActive }) =>
      `flex items-center gap-3 p-3 rounded-lg transition group ${
        isActive
          ? "bg-blue-100 text-blue-600"
          : "hover:bg-gray-100 text-gray-700"
      }`
    }
  >
    {({ isActive }) => (
      <>
        <Icon
          size={20}
          className={`${
            isActive
              ? "text-blue-600"
              : "text-gray-600 group-hover:text-blue-600"
          }`}
        />
        <span className="font-medium group-hover:text-blue-600">{label}</span>
      </>
    )}
  </NavLink>
);

export default Navbar;
