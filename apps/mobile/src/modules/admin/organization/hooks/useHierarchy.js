import { useEffect } from 'react';
import { useOrganizationStore } from '../store/organizationStore';
import { useShallow } from 'zustand/react/shallow';

export function useHierarchy() {
  const { hierarchy, isLoading, error, loadHierarchy } = useOrganizationStore(useShallow((state) => ({
    hierarchy: state.hierarchy,
    isLoading: state.isLoading,
    error: state.error,
    loadHierarchy: state.loadHierarchy,
  })));

  useEffect(() => {
    loadHierarchy();
  }, [loadHierarchy]);

  return {
    hierarchy,
    isLoading,
    error,
  };
}
