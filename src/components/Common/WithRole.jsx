import React from 'react';
import { useSelector } from 'react-redux';
import { selectUserRole, hasRole } from '../../store/slices/authSlice';

const WithRole = ({ allowedRoles, children, fallback = null }) => {
  const userRole = useSelector(selectUserRole);
  const hasAccess = hasRole(userRole, allowedRoles);

  if (!hasAccess) {
    return fallback;
  }

  return children;
};

export default WithRole;