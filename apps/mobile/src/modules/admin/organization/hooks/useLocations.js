import { useEffect } from 'react';
import { useOrganizationStore } from '../store/organizationStore';
import { useShallow } from 'zustand/react/shallow';

export function useLocations() {
  const { locations, isLoading, error, loadLocations } = useOrganizationStore(useShallow((state) => ({
    locations: state.locations,
    isLoading: state.isLoading,
    error: state.error,
    loadLocations: state.loadLocations,
  })));

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  return {
    locations,
    isLoading,
    error,
  };
}
