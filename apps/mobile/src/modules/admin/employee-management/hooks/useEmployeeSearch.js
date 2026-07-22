import { useCallback, useState } from 'react';
import { useEmployeeManagementStore } from '../store/employeeManagementStore';

export function useEmployeeSearch() {
  const { searchQuery, setSearchQuery } = useEmployeeManagementStore((state) => ({
    searchQuery: state.searchQuery,
    setSearchQuery: state.setSearchQuery,
  }));

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const search = useCallback((text) => {
    setLocalSearch(text);
    setSearchQuery(text);
  }, [setSearchQuery]);

  const clear = useCallback(() => {
    setLocalSearch('');
    setSearchQuery('');
  }, [setSearchQuery]);

  return {
    query: localSearch,
    search,
    clear,
  };
}
