import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  const location = useLocation();

  useEffect(() => {
    // Log authentication status for debugging
    console.log('ProtectedRoute: Checking authentication at', location.pathname);
    console.log('ProtectedRoute: Token exists:', !!token);
  }, [location.pathname, token]);

  if (!token) {
    // Redirect to login page, but save the current location they were trying to go to
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the children (which could be a component that renders an Outlet)
  console.log('ProtectedRoute: Authentication successful, rendering', location.pathname);
  return children;
};

export default ProtectedRoute;
