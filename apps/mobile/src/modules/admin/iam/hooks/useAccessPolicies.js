import { useEffect, useMemo } from 'react';
import { useIamStore } from '../store/iamStore';

export function useAccessPolicies() {
  const {
    accessPolicies,
    isLoading,
    error,
    filters,
    loadAccessPolicies,
    createAccessPolicy,
    updateAccessPolicy,
    setFilters
  } = useIamStore((state) => ({
    accessPolicies: state.accessPolicies,
    isLoading: state.isLoading,
    error: state.error,
    filters: state.filters,
    loadAccessPolicies: state.loadAccessPolicies,
    createAccessPolicy: state.createAccessPolicy,
    updateAccessPolicy: state.updateAccessPolicy,
    setFilters: state.setFilters
  }));

  useEffect(() => {
    if (accessPolicies.length === 0) {
      loadAccessPolicies();
    }
  }, [loadAccessPolicies, accessPolicies.length]);

  const filteredPolicies = useMemo(() => {
    let result = [...accessPolicies];
    if (filters.policySearch) {
      const q = filters.policySearch.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [accessPolicies, filters.policySearch]);

  return {
    accessPolicies: filteredPolicies,
    allAccessPolicies: accessPolicies,
    isLoading,
    error,
    filters,
    setFilters,
    loadAccessPolicies,
    createAccessPolicy,
    updateAccessPolicy,
  };
}
