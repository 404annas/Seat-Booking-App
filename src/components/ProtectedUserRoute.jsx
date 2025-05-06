import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedUserRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const isUser = localStorage.getItem('isAdmin') !== "true";

  if (!token || !isUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedUserRoute;