import { create } from 'zustand';
import { masterDataService } from '../services/masterDataService';

export const useMasterDataStore = create((set, get) => ({
  categories: [],
  referenceValues: [],
  selectedCategoryId: null,
  selectedReferenceValueId: null,

  isLoading: false,
  isRefreshing: false,
  error: null,

  filters: {
    searchQuery: '',
    status: 'all', // 'all' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
    sortBy: 'name', // 'name' | 'code'
    sortOrder: 'asc', // 'asc' | 'desc'
  },

  // Actions
  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
  },

  resetFilters: () => {
    set({
      filters: {
        searchQuery: '',
        status: 'all',
        sortBy: 'name',
        sortOrder: 'asc',
      }
    });
  },

  selectCategory: (categoryId) => {
    set({ selectedCategoryId: categoryId, selectedReferenceValueId: null });
    if (categoryId) {
      get().loadReferenceValues(categoryId);
    } else {
      set({ referenceValues: [] });
    }
  },

  selectReferenceValue: (valueId) => set({ selectedReferenceValueId: valueId }),

  loadCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await masterDataService.getCategories();
      set({ categories: data, isLoading: false });
      
      // Auto-select first category if none selected
      const { selectedCategoryId } = get();
      if (!selectedCategoryId && data.length > 0) {
        get().selectCategory(data[0].id);
      }
    } catch (err) {
      set({ error: err.message || 'Failed to load categories', isLoading: false });
    }
  },

  loadReferenceValues: async (categoryId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await masterDataService.getReferenceValues(categoryId);
      set({ referenceValues: data, isLoading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load reference values', isLoading: false });
    }
  },

  refreshAll: async () => {
    set({ isRefreshing: true, error: null });
    try {
      const categories = await masterDataService.getCategories();
      set({ categories });
      
      const { selectedCategoryId } = get();
      const activeCategory = selectedCategoryId || (categories.length > 0 ? categories[0].id : null);
      
      if (activeCategory) {
        const values = await masterDataService.getReferenceValues(activeCategory);
        set({ referenceValues: values, selectedCategoryId: activeCategory });
      }
      set({ isRefreshing: false });
    } catch (err) {
      set({ error: err.message || 'Failed to refresh data', isRefreshing: false });
    }
  },

  createReferenceValue: async (categoryId, valueData) => {
    set({ isLoading: true, error: null });
    try {
      const newVal = await masterDataService.createReferenceValue(categoryId, valueData);
      set((state) => ({
        referenceValues: [...state.referenceValues, newVal],
        isLoading: false
      }));
      // Refresh categories count
      get().loadCategories();
      return newVal;
    } catch (err) {
      set({ error: err.message || 'Failed to create value', isLoading: false });
      throw err;
    }
  },

  updateReferenceValue: async (categoryId, valueId, valueData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedVal = await masterDataService.updateReferenceValue(categoryId, valueId, valueData);
      set((state) => ({
        referenceValues: state.referenceValues.map(v => v.id === valueId ? updatedVal : v),
        isLoading: false
      }));
      return updatedVal;
    } catch (err) {
      set({ error: err.message || 'Failed to update value', isLoading: false });
      throw err;
    }
  },

  archiveReferenceValue: async (categoryId, valueId) => {
    set({ isLoading: true, error: null });
    try {
      const archived = await masterDataService.archiveReferenceValue(categoryId, valueId);
      set((state) => ({
        referenceValues: state.referenceValues.map(v => v.id === valueId ? archived : v),
        isLoading: false
      }));
      // Refresh categories count
      get().loadCategories();
      return archived;
    } catch (err) {
      set({ error: err.message || 'Failed to archive value', isLoading: false });
      throw err;
    }
  },

  importValues: async (categoryId, jsonString) => {
    set({ isLoading: true, error: null });
    try {
      await masterDataService.importJSON(categoryId, jsonString);
      await get().loadReferenceValues(categoryId);
      await get().loadCategories();
      set({ isLoading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to import data', isLoading: false });
      throw err;
    }
  },

  exportValues: async (categoryId) => {
    set({ isLoading: true, error: null });
    try {
      const result = await masterDataService.exportJSON(categoryId);
      set({ isLoading: false });
      return result;
    } catch (err) {
      set({ error: err.message || 'Failed to export data', isLoading: false });
      throw err;
    }
  }
}));
