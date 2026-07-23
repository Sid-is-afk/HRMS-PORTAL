import { useEffect } from 'react';
import { useIamStore } from '../store/iamStore';

export function usePermissions() {
  const {
    permissions,
    permissionGroups,
    isLoading,
    error,
    loadPermissions,
  } = useIamStore((state) => ({
    permissions: state.permissions,
    permissionGroups: state.permissionGroups,
    isLoading: state.isLoading,
    error: state.error,
    loadPermissions: state.loadPermissions,
  }));

  useEffect(() => {
    if (permissions.length === 0) {
      loadPermissions();
    }
  }, [loadPermissions, permissions.length]);

  return {
    permissions,
    permissionGroups,
    isLoading,
    error,
    loadPermissions,
  };
}
