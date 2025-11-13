import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const GuestRoute = ({ children }) => {
  const { token, user, isLoading } = useAuthStore();
  const isAuthenticated = !!token && !!user;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export default GuestRoute;
