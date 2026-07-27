import { create } from 'zustand';

export const useTenantStore = create((set) => ({
  dashboardSummary: null,
  tenants: [],
  selectedTenant: null,
  lifecycleEvents: [],
  provisioningQueue: [],
  searchQuery: '',
  
  isLoading: false,
  error: null,

  setDashboardSummary: (summary) => set({ dashboardSummary: summary }),
  setTenants: (tenants) => set({ tenants }),
  setSelectedTenant: (tenant) => set({ selectedTenant: tenant }),
  setLifecycleEvents: (events) => set({ lifecycleEvents: events }),
  setProvisioningQueue: (queue) => set({ provisioningQueue: queue }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
