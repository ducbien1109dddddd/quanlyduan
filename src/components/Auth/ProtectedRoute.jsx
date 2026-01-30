import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../store/slices/authSlice';

const ProtectedRoute = ({ children, requiredPermissions = [], allowedRoles = [] }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector((state) => state.auth.currentUser);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && currentUser) {
    if (!allowedRoles.includes(currentUser.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check permission-based access
  if (requiredPermissions.length > 0 && currentUser) {
    const userPermissions = currentUser.permissions || [];
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission) || userPermissions.includes('all')
    );

    if (!hasAllPermissions) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;