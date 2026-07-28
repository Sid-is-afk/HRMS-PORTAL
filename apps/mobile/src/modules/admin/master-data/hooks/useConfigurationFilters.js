import { useMasterDataStore } from '../store/masterDataStore';
import { useShallow } from 'zustand/react/shallow';

export function useConfigurationFilters() {
  const { filters, setFilters, resetFilters } = useMasterDataStore(useShallow((state) => ({
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
