import { useRbacStore } from '../store/rbacStore';
import { useCallback } from 'react';

export function useAuthorization() {
  const { role, permissions } = useRbacStore((state) => ({
    role: state.role,
    permissions: state.permissions,
  }));

  const hasRole = useCallback((allowedRoles) => {
    if (!role) return false;
    if (Array.isArray(allowedRoles)) {
      return allowedRoles.includes(role);
    }
    return role === allowedRoles;
  }, [role]);

  const hasPermission = useCallback((requiredPermissions) => {
    if (!permissions || permissions.length === 0) return false;
    if (Array.isArray(requiredPermissions)) {
      return requiredPermissions.every((perm) => permissions.includes(perm));
    }
    return permissions.includes(requiredPermissions);
  }, [permissions]);

  return { hasRole, hasPermission };
}
