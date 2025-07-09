// src/ProtectedRoute.js

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"; // ✅ Fix path if needed

const PrivateRoute = () => {
  const { authToken } = useAuth();
  return authToken ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
