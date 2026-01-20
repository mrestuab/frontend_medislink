import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; 

    if (decoded.exp < currentTime) {
      localStorage.removeItem('token'); 
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      if (decoded.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    }

    return <Outlet />;

  } catch (error) {
    console.error(error);
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;