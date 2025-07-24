import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

interface JWTPayload {
  sub: string;
  authorities: string;
  exp: number;
  iat: number;
  email: string;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode<JWTPayload>(token);
    
    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('authToken');
      return <Navigate to="/login" replace />;
    }
    
    // Check if user has admin role
    if (!decoded.authorities || !decoded.authorities.includes('ROLE_ADMIN')) {
      return <Navigate to="/dashboard" replace />;
    }
    
    return <>{children}</>;
  } catch (error) {
    console.error('Invalid token:', error);
    localStorage.removeItem('authToken');
    return <Navigate to="/login" replace />;
  }
};

export default AdminProtectedRoute;
