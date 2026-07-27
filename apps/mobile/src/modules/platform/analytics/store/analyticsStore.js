import { create } from 'zustand';

export const useAnalyticsStore = create((set) => ({
  executiveSummary: null,
  trendMetrics: [],
  usageMetrics: [],
  
  isLoading: false,
  error: null,

  setExecutiveSummary: (summary) => set({ executiveSummary: summary }),
  setTrendMetrics: (metrics) => set({ trendMetrics: metrics }),
  setUsageMetrics: (metrics) => set({ usageMetrics: metrics }),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
