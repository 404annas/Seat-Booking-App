import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === "true";
  const token = localStorage.getItem('token');

  if (!isAdmin || !token) {
    // Redirect to admin login if not authenticated as admin
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedAdminRoute; 