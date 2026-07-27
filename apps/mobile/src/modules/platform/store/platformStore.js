import { create } from 'zustand';

export const usePlatformStore = create((set) => ({
  dashboardSummary: null,
  activities: [],
  notifications: [],
  searchQuery: '',
  searchResults: [],
  
  isLoading: false,
  error: null,

  setDashboardSummary: (summary) => set({ dashboardSummary: summary }),
  setActivities: (activities) => set({ activities }),
  setNotifications: (notifications) => set({ notifications }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
