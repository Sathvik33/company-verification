import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = () => {
  const { token } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" replace />;

  try {
    jwtDecode(token); // optional check
  } catch {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
