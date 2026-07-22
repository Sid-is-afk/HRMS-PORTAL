import { useEffect } from 'react';
import { useOrganizationStore } from '../store/organizationStore';

export function useLocations() {
  const { locations, isLoading, error, loadLocations } = useOrganizationStore((state) => ({
    locations: state.locations,
    isLoading: state.isLoading,
    error: state.error,
    loadLocations: state.loadLocations,
  }));

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  return {
    locations,
    isLoading,
    error,
  };
}
