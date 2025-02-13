import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  userRole: number | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isAuthenticated,
  userRole,
}) => {
  const token = isAuthenticated || sessionStorage.getItem("accessToken"); // Persist authentication
  const role = userRole ?? Number(sessionStorage.getItem("userRole")); // Persist role

  if (!token) {
    return <Navigate to="/" />; // Redirect to login page if not logged in
  }

  if (role !== 1) {
    // Ensure user is a System Admin
    return <Navigate to="/" />; // Redirect non-admins to login
  }

  return <>{children}</>;
};

export default ProtectedRoute;
