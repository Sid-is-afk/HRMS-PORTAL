import { useMasterDataStore } from '../store/masterDataStore';

export function useConfigurationFilters() {
  const { filters, setFilters, resetFilters } = useMasterDataStore((state) => ({
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
