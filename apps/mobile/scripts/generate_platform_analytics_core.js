const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'platform', 'analytics');

const files = {
  'models/analyticsModels.js': `/**
 * @typedef {Object} ExecutiveDashboardSummary
 * @property {number} totalOrganizations
 * @property {number} activeOrganizations
 * @property {number} dailyActiveUsers
 * @property {number} monthlyActiveUsers
 * @property {number} systemAvailability
 */

/**
 * @typedef {Object} TrendMetric
 * @property {string} id
 * @property {string} label
 * @property {number} value
 * @property {number} percentageChange
 * @property {string} trend - Up, Down, Flat
 */

/**
 * @typedef {Object} UsageMetric
 * @property {string} feature
 * @property {number} usageCount
 * @property {number} uniqueUsers
 */
`,

  'validation/analyticsSchema.js': `import { z } from 'zod';

export const analyticsFilterSchema = z.object({
  dateRange: z.enum(['7D', '30D', '90D', 'YTD', 'ALL']).optional(),
  tenantId: z.string().optional(),
});
`,

  'store/analyticsStore.js': `import { create } from 'zustand';

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
`,

  'services/analyticsService.js': `const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const mockSummary = {
  totalOrganizations: 142,
  activeOrganizations: 135,
  dailyActiveUsers: 84500,
  monthlyActiveUsers: 215000,
  systemAvailability: 99.99
};

const mockTrends = [
  { id: 'T-1', label: 'Organization Growth', value: 12, percentageChange: 8.5, trend: 'Up' },
  { id: 'T-2', label: 'User Retention', value: 94, percentageChange: -1.2, trend: 'Down' },
  { id: 'T-3', label: 'Storage Utilization', value: 4500, percentageChange: 15.4, trend: 'Up' },
];

const mockUsage = [
  { feature: 'Core HR Dashboard', usageCount: 1500000, uniqueUsers: 210000 },
  { feature: 'Performance Reviews', usageCount: 85000, uniqueUsers: 42000 },
  { feature: 'Recruitment Pipeline', usageCount: 45000, uniqueUsers: 12000 },
];

export const analyticsService = {
  getExecutiveSummary: async () => {
    await delay();
    return mockSummary;
  },

  getTrendMetrics: async () => {
    await delay();
    return mockTrends;
  },

  getUsageMetrics: async () => {
    await delay();
    return mockUsage;
  },
};
`,

  'hooks/useAnalytics.js': `import { useCallback } from 'react';
import { useAnalyticsStore } from '../store/analyticsStore';
import { analyticsService } from '../services/analyticsService';

export function useAnalytics() {
  const store = useAnalyticsStore();

  const fetchExecutiveSummary = useCallback(async () => {
    try {
      store.setLoading(true);
      store.setError(null);
      const summary = await analyticsService.getExecutiveSummary();
      store.setExecutiveSummary(summary);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch summary');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchTrendMetrics = useCallback(async () => {
    try {
      store.setLoading(true);
      const trends = await analyticsService.getTrendMetrics();
      store.setTrendMetrics(trends);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch trends');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchUsageMetrics = useCallback(async () => {
    try {
      store.setLoading(true);
      const usage = await analyticsService.getUsageMetrics();
      store.setUsageMetrics(usage);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch usage metrics');
    } finally {
      store.setLoading(false);
    }
  }, []);

  return { 
    ...store, 
    fetchExecutiveSummary, 
    fetchTrendMetrics, 
    fetchUsageMetrics 
  };
}
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('Analytics core files created successfully.');
