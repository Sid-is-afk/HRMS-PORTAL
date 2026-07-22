import React from 'react';
import { useAuthorization } from '../hooks/useAuthorization';
import ForbiddenScreen from './ForbiddenScreen';
import { ProtectedRoute } from './ProtectedRoute';

export function RoleGuard({ allowedRoles, fallback = <ForbiddenScreen />, children }) {
  const { hasRole } = useAuthorization();

  return (
    <ProtectedRoute>
      {hasRole(allowedRoles) ? children : fallback}
    </ProtectedRoute>
  );
}
