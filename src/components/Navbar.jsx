import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  ShoppingCart,
  Home,
  ShoppingBag,
  Plus,
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

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    navigate("/");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (isAuth) {
      const fetchCartCount = async () => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/cart`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
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
      fetchCartCount();
    }
  }, [isAuth, token]);

  return (
    <div className="relative py-4">
      {/* Navbar */}
      <nav
        className={`bg-white/95 backdrop-blur-md border-b border-gray-200 py-3 fixed top-0 left-0 w-full z-50 h-[70px] transition-all duration-300 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="w-11/12 mx-auto flex items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <NavLink to="/" className="flex-shrink-0">
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-10 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
              />
            </NavLink>
          </div>

          <div className="flex-1 px-4">
            <h2 className="text-center text-xl font-semibold text-gray-800">
              Fine Dine Menu
            </h2>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isAuth && (
              <NavLink
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 hover:scale-110"
                title="Cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            )}
            <div
              className="flex items-center space-x-2 cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              onClick={isAuth ? handleLogout : handleLoginClick}
            >
              {isAuth ? (
                <LogOut size={20} className="text-red-500" />
              ) : (
                <User size={20} />
              )}
              <span className="hidden sm:inline font-medium text-gray-700">
                {isAuth ? `Hi, ${user.name || user.email}` : "Login"}
              </span>
            </div>

            <button
              className="p-2 text-gray-600 hover:text-blue-600 focus:outline-none transition-all duration-300 hover:scale-110"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-60 transform transition-transform duration-300 ease-in-out bg-black/50 backdrop-blur-sm ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <div
          className={`absolute right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-gray-800">Menu</h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-all duration-300 group ${
                    isActive ? "bg-blue-100 text-blue-600" : ""
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <Home
                      size={20}
                      className={`${
                        isActive
                          ? "text-blue-600"
                          : "text-gray-600 group-hover:text-blue-600"
                      }`}
                    />
                    <span className="text-gray-700 font-medium group-hover:text-blue-600">
                      Home
                    </span>
                  </>
                )}
              </NavLink>
              {isAuth && (
                <>
                  <NavLink
                    to="/my-menu"
                    className={({ isActive }) =>
                      `flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-all duration-300 group ${
                        isActive ? "bg-blue-100 text-blue-600" : ""
                      }`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    {({ isActive }) => (
                      <>
                        <Edit3
                          size={20}
                          className={`${
                            isActive
                              ? "text-blue-600"
                              : "text-gray-600 group-hover:text-blue-600"
                          }`}
                        />
                        <span className="text-gray-700 font-medium group-hover:text-blue-600">
                          My Menu
                        </span>
                      </>
                    )}
                  </NavLink>
                  <NavLink
                    to="/add-review"
                    className={({ isActive }) =>
                      `flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-all duration-300 group ${
                        isActive ? "bg-blue-100 text-blue-600" : ""
                      }`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    {({ isActive }) => (
                      <>
                        <Star
                          size={20}
                          className={`${
                            isActive
                              ? "text-blue-600"
                              : "text-gray-600 group-hover:text-blue-600"
                          }`}
                        />
                        <span className="text-gray-700 font-medium group-hover:text-blue-600">
                          Add Review
                        </span>
                      </>
                    )}
                  </NavLink>
                </>
              )}
              <div className="pt-4 border-t border-gray-200">
                <NavLink
                  to={isAuth ? "#" : "/login"}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-all duration-300 group ${
                      isActive ? "bg-blue-100 text-blue-600" : ""
                    }`
                  }
                  onClick={(e) => {
                    if (isAuth) {
                      e.preventDefault();
                      handleLogout();
                    } else {
                      setSidebarOpen(false);
                      handleLoginClick();
                    }
                  }}
                >
                  {({ isActive }) => (
                    <>
                      {isAuth ? (
                        <LogOut size={20} className="text-red-500" />
                      ) : (
                        <User
                          size={20}
                          className={`${
                            isActive
                              ? "text-blue-600"
                              : "text-gray-600 group-hover:text-blue-600"
                          }`}
                        />
                      )}
                      <span
                        className={`font-medium group-hover:text-blue-600 ${
                          isAuth ? "text-red-500" : "text-gray-700"
                        }`}
                      >
                        {isAuth ? "Logout" : "Login"}
                      </span>
                    </>
                  )}
                </NavLink>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
