import { useEffect } from 'react';
import { useOrganizationStore } from '../store/organizationStore';
import { useShallow } from 'zustand/react/shallow';

export function useTeams() {
  const { teams, isLoading, error, loadTeams } = useOrganizationStore(useShallow((state) => ({
    teams: state.teams,
    isLoading: state.isLoading,
    error: state.error,
    loadTeams: state.loadTeams,
  })));

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  return {
    teams,
    isLoading,
    error,
  };
}
