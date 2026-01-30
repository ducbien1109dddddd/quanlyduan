import React from 'react';
import { useSelector } from 'react-redux';
import { selectUserPermissions, hasPermission } from '../../store/slices/authSlice';

const WithPermission = ({ permission, children, fallback = null }) => {
  const permissions = useSelector(selectUserPermissions);
  const hasAccess = hasPermission(permissions, permission);

  if (!hasAccess) {
    return fallback;
  }

  return children;
};

export default WithPermission;