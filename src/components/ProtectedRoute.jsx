// components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import useLoginStore from "../../store/useLoginStore";

const ProtectedRoute = ({ children, role }) => {
  const user = useLoginStore((state) => state.user);

  // No user logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role check (optional)
  if (role && user.attendee?.role !== role) {
    return <Navigate to="/" replace />;
  }

  // Passed checks
  return children;
};

export default ProtectedRoute;
