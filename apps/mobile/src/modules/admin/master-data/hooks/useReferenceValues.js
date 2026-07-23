import { useMemo, useCallback } from 'react';
import { useMasterDataStore } from '../store/masterDataStore';

export function useReferenceValues() {
  const {
    referenceValues,
    selectedReferenceValueId,
    isLoading,
    error,
    filters,
    selectedCategoryId,
    selectReferenceValue,
    createReferenceValue,
    updateReferenceValue,
    archiveReferenceValue,
    importValues,
    exportValues,
  } = useMasterDataStore((state) => ({
    referenceValues: state.referenceValues,
    selectedReferenceValueId: state.selectedReferenceValueId,
    isLoading: state.isLoading,
    error: state.error,
    filters: state.filters,
    selectedCategoryId: state.selectedCategoryId,
    selectReferenceValue: state.selectReferenceValue,
    createReferenceValue: state.createReferenceValue,
    updateReferenceValue: state.updateReferenceValue,
    archiveReferenceValue: state.archiveReferenceValue,
    importValues: state.importValues,
    exportValues: state.exportValues,
  }));

  const filteredValues = useMemo(() => {
    let result = [...referenceValues];

    // Filter by search query
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      result = result.filter(item => item.status === filters.status);
    }

    // Sort
    const { sortBy, sortOrder } = filters;
    result.sort((a, b) => {
      const valA = (a[sortBy] || '').toString().toLowerCase();
      const valB = (b[sortBy] || '').toString().toLowerCase();
      
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [referenceValues, filters]);

  const getReferenceValueById = useCallback((id) => {
    return referenceValues.find(v => v.id === id);
  }, [referenceValues]);

  return {
    referenceValues: filteredValues,
    allReferenceValues: referenceValues,
    selectedReferenceValueId,
    selectedCategoryId,
    isLoading,
    error,
    selectReferenceValue,
    getReferenceValueById,
    createReferenceValue: (data) => createReferenceValue(selectedCategoryId, data),
    updateReferenceValue: (id, data) => updateReferenceValue(selectedCategoryId, id, data),
    archiveReferenceValue: (id) => archiveReferenceValue(selectedCategoryId, id),
    importValues: (jsonString) => importValues(selectedCategoryId, jsonString),
    exportValues: () => exportValues(selectedCategoryId),
  };
}
