import { useTalentAcquisitionStore } from '../store/talentAcquisitionStore';
import { useShallow } from 'zustand/react/shallow';

export function useHiringActivities() {
  const { activities, isLoading, error } = useTalentAcquisitionStore(useShallow((state) => ({
    activities: state.activities,
    isLoading: state.isLoading,
    error: state.error,
  })));

  return {
    activities,
    isLoading,
    error,
  };
}
