import { create } from 'zustand';

export const useIntelligenceStore = create((set) => ({
  executiveKpis: [],
  workforceMetrics: [],
  insights: [],
  filters: { dateRange: '90d' },
  isLoading: false,
  error: null,

  setExecutiveKpis: (kpis) => set({ executiveKpis: kpis }),
  setWorkforceMetrics: (metrics) => set({ workforceMetrics: metrics }),
  setInsights: (insights) => set({ insights }),
  setFilters: (filters) => set({ filters }),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
