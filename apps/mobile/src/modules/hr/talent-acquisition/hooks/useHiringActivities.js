import { useTalentAcquisitionStore } from '../store/talentAcquisitionStore';

export function useHiringActivities() {
  const { activities, isLoading, error } = useTalentAcquisitionStore((state) => ({
    activities: state.activities,
    isLoading: state.isLoading,
    error: state.error,
  }));

  return {
    activities,
    isLoading,
    error,
  };
}
