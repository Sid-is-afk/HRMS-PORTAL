import { useEffect, useCallback, useMemo } from 'react';
import { useIamStore } from '../store/iamStore';

export function useRoles() {
  const {
    roles,
    isLoading,
    isRefreshing,
    error,
    selectedRoleId,
    filters,
    loadRoles,
    setSelectedRoleId,
    createRole,
    updateRole,
    archiveRole,
    cloneRole,
    setFilters
  } = useIamStore((state) => ({
    roles: state.roles,
    isLoading: state.isLoading,
    isRefreshing: state.isRefreshing,
    error: state.error,
    selectedRoleId: state.selectedRoleId,
    filters: state.filters,
    loadRoles: state.loadRoles,
    setSelectedRoleId: state.setSelectedRoleId,
    createRole: state.createRole,
    updateRole: state.updateRole,
    archiveRole: state.archiveRole,
    cloneRole: state.cloneRole,
    setFilters: state.setFilters
  }));

  useEffect(() => {
    if (roles.length === 0) {
      loadRoles();
    }
  }, [loadRoles, roles.length]);

  const filteredRoles = useMemo(() => {
    let result = [...roles];
    if (filters.roleSearch) {
      const q = filters.roleSearch.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q));
    }
    if (filters.roleStatus && filters.roleStatus !== 'all') {
      result = result.filter(r => r.status === filters.roleStatus);
    }
    return result;
  }, [roles, filters.roleSearch, filters.roleStatus]);

  const getRoleById = useCallback((id) => {
    return roles.find(r => r.id === id);
  }, [roles]);

  return {
    roles: filteredRoles,
    allRoles: roles, // unfiltered
    isLoading,
    isRefreshing,
    error,
    selectedRoleId,
    setSelectedRoleId,
    filters,
    setFilters,
    loadRoles,
    getRoleById,
    createRole,
    updateRole,
    archiveRole,
    cloneRole,
  };
}
