import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  userRole: number | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isAuthenticated, userRole }) => {
  if (!isAuthenticated) {
    return <Navigate to="/" />; // Redirect to login page if not logged in
  }

  if (userRole !== 1) { // Ensure userRole is 1 (System Admin)
    return <Navigate to="/" />; // Redirect to login page if not admin
  }

  return <>{children}</>;
};

export default ProtectedRoute;
