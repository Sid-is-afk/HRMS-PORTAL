import { useMemo, useCallback } from 'react';
import { useRoles } from './useRoles';
import { usePermissions } from './usePermissions';

export function usePermissionMatrix() {
  const { roles, updateRole, isLoading: rolesLoading, error: rolesError } = useRoles();
  const { permissions, isLoading: permsLoading, error: permsError } = usePermissions();

  const isLoading = rolesLoading || permsLoading;
  const error = rolesError || permsError;

  const matrix = useMemo(() => {
    const map = {};
    roles.forEach(role => {
      map[role.code] = {};
      permissions.forEach(perm => {
        map[role.code][perm.code] = role.permissions.includes(perm.code);
      });
    });
    return map;
  }, [roles, permissions]);

  const togglePermission = useCallback(async (roleId, permissionCode) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    let updatedPerms = [...role.permissions];
    if (updatedPerms.includes(permissionCode)) {
      updatedPerms = updatedPerms.filter(p => p !== permissionCode);
    } else {
      updatedPerms.push(permissionCode);
    }

    await updateRole(roleId, {
      ...role,
      permissions: updatedPerms,
    });
  }, [roles, updateRole]);

  return {
    matrix,
    roles,
    permissions,
    isLoading,
    error,
    togglePermission,
  };
}
