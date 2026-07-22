import React from 'react';
import { useAuthorization } from '../hooks/useAuthorization';
import ForbiddenScreen from './ForbiddenScreen';
import { ProtectedRoute } from './ProtectedRoute';

export function PermissionGuard({ requiredPermissions, fallback = <ForbiddenScreen />, children }) {
  const { hasPermission } = useAuthorization();

  return (
    <ProtectedRoute>
      {hasPermission(requiredPermissions) ? children : fallback}
    </ProtectedRoute>
  );
}
