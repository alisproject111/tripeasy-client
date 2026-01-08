"use client";

import { Navigate } from "react-router-dom";
import { useToast } from "../Toast";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { error: showError } = useToast();

  const isAuthenticated = () => {
    const token = localStorage.getItem("adminToken");
    const loginTime = localStorage.getItem("adminLoginTime");

    if (!token || !loginTime) {
      return false;
    }

    // Check if token is valid format
    try {
      const decodedToken = atob(token);
      if (!decodedToken.startsWith("authenticated_")) {
        return false;
      }
    } catch (e) {
      return false;
    }

    // Check if session is not older than 24 hours (optional security measure)
    const currentTime = Date.now();
    const sessionAge = currentTime - Number.parseInt(loginTime);
    const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours

    if (sessionAge > maxSessionAge) {
      // Session expired
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminLoginTime");
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      showError("Unauthorized access. Please login to continue.");
    }
  }, [showError]);

  return isAuthenticated() ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
