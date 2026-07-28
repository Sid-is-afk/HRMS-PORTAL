import { useTalentAcquisitionStore } from '../store/talentAcquisitionStore';
import { useShallow } from 'zustand/react/shallow';

export function useRecruitmentFilters() {
  const { filters, setFilters, resetFilters } = useTalentAcquisitionStore(useShallow((state) => ({
    filters: state.filters,
    setFilters: state.setFilters,
    resetFilters: state.resetFilters,
  })));

  return {
    filters,
    setFilters,
    resetFilters,
  };
}
