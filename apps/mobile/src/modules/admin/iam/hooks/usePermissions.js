import { useEffect } from 'react';
import { useIamStore } from '../store/iamStore';
import { useShallow } from 'zustand/react/shallow';

export function usePermissions() {
  const {
    permissions,
    permissionGroups,
    isLoading,
    error,
    loadPermissions,
  } = useIamStore(useShallow((state) => ({
    permissions: state.permissions,
    permissionGroups: state.permissionGroups,
    isLoading: state.isLoading,
    error: state.error,
    loadPermissions: state.loadPermissions,
  })));

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
