import { useTalentAcquisitionStore } from '../store/talentAcquisitionStore';

export function useRecruitmentFilters() {
  const filters = useTalentAcquisitionStore((state) => state.filters);
  const setFilters = useTalentAcquisitionStore((state) => state.setFilters);
  const resetFilters = useTalentAcquisitionStore((state) => state.resetFilters);

  return {
    filters,
    setFilters,
    resetFilters,
  };
}
