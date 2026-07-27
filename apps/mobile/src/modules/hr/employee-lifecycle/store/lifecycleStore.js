import { create } from 'zustand';

export const useLifecycleStore = create((set) => ({
  conversions: [],
  onboardingTasks: [],
  probations: [],
  isLoading: false,
  error: null,
  searchQuery: '',

  setConversions: (conversions) => set({ conversions }),
  setOnboardingTasks: (tasks) => set({ onboardingTasks: tasks }),
  setProbations: (probations) => set({ probations }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  addConversion: (conversion) => set((state) => ({ conversions: [conversion, ...state.conversions] })),
  updateTaskStatus: (taskId, is_completed) => set((state) => ({
    onboardingTasks: state.onboardingTasks.map(t => t.id === taskId ? { ...t, is_completed } : t)
  })),
}));
