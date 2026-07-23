import { useEffect } from 'react';
import { useMasterDataStore } from '../store/masterDataStore';

export function useMasterData() {
  const {
    categories,
    selectedCategoryId,
    isLoading,
    isRefreshing,
    error,
    loadCategories,
    selectCategory,
    refreshAll,
  } = useMasterDataStore((state) => ({
    categories: state.categories,
    selectedCategoryId: state.selectedCategoryId,
    isLoading: state.isLoading,
    isRefreshing: state.isRefreshing,
    error: state.error,
    loadCategories: state.loadCategories,
    selectCategory: state.selectCategory,
    refreshAll: state.refreshAll,
  }));

  useEffect(() => {
    if (categories.length === 0) {
      loadCategories();
    }
  }, [loadCategories, categories.length]);

  return {
    categories,
    selectedCategoryId,
    isLoading,
    isRefreshing,
    error,
    selectCategory,
    refreshAll,
    loadCategories,
  };
}
