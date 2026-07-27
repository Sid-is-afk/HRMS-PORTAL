import { useTalentAcquisitionStore } from '../store/talentAcquisitionStore';

export function useRecruitmentFilters() {
  const { filters, setFilters, resetFilters } = useTalentAcquisitionStore((state) => ({
    filters: state.filters,
    setFilters: state.setFilters,
    resetFilters: state.resetFilters,
  }));

  return {
    filters,
    setFilters,
    resetFilters,
  };
}
