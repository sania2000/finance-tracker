
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

export default function PrivateRoute() {
  const user = getCurrentUser();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
