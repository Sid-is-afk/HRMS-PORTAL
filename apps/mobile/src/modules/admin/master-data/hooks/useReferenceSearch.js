import { useCallback } from 'react';
import { useMasterDataStore } from '../store/masterDataStore';

export function useReferenceSearch() {
  const searchQuery = useMasterDataStore((state) => state.filters.searchQuery);
  const setFilters = useMasterDataStore((state) => state.setFilters);

  const search = useCallback((query) => {
    setFilters({ searchQuery: query });
  }, [setFilters]);

  const clear = useCallback(() => {
    setFilters({ searchQuery: '' });
  }, [setFilters]);

  return {
    searchQuery,
    search,
    clear,
  };
}
