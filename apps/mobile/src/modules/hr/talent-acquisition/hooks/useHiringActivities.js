import { useTalentAcquisitionStore } from '../store/talentAcquisitionStore';

export function useHiringActivities() {
  const activities = useTalentAcquisitionStore((state) => state.activities);
  const isLoading = useTalentAcquisitionStore((state) => state.isLoading);
  const error = useTalentAcquisitionStore((state) => state.error);

  return {
    activities,
    isLoading,
    error,
  };
}
