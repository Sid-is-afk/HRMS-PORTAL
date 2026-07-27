import { create } from 'zustand';

export const useTalentStore = create((set) => ({
  goals: [],
  courses: [],
  complianceRecords: [],
  isLoading: false,
  error: null,
  searchQuery: '',

  setGoals: (goals) => set({ goals }),
  setCourses: (courses) => set({ courses }),
  setComplianceRecords: (records) => set({ complianceRecords: records }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  updateGoalProgress: (goalId, progress) => set((state) => ({
    goals: state.goals.map(g => g.id === goalId ? { ...g, progress_percentage: progress } : g)
  })),
}));
