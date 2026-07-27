const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'hr', 'people-intelligence');

const files = {
  'models/intelligenceModels.js': `/**
 * @typedef {Object} KPI
 * @property {string} id
 * @property {string} title
 * @property {string} value
 * @property {string} trend - up, down, flat
 * @property {string} percentage
 */

/**
 * @typedef {Object} Insight
 * @property {string} id
 * @property {string} category
 * @property {string} summary
 * @property {string} impact - High, Medium, Low
 * @property {string} date
 */

/**
 * @typedef {Object} ChartData
 * @property {string} label
 * @property {number} value
 */
`,

  'validation/intelligenceSchema.js': `import { z } from 'zod';

export const analyticsFilterSchema = z.object({
  departmentId: z.string().optional(),
  locationId: z.string().optional(),
  dateRange: z.enum(['30d', '90d', '6m', '1y', 'ytd']),
});
`,

  'store/intelligenceStore.js': `import { create } from 'zustand';

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
`,

  'services/intelligenceService.js': `const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const mockKpis = [
  { id: 'KPI-1', title: 'Total Headcount', value: '1,245', trend: 'up', percentage: '+5.2%' },
  { id: 'KPI-2', title: 'Retention Rate', value: '92.4%', trend: 'up', percentage: '+1.1%' },
  { id: 'KPI-3', title: 'Time to Hire', value: '24 Days', trend: 'down', percentage: '-3.5%' },
  { id: 'KPI-4', title: 'Compliance Score', value: '98%', trend: 'flat', percentage: '0%' }
];

const mockWorkforce = [
  { label: 'Engineering', value: 450 },
  { label: 'Sales', value: 320 },
  { label: 'Marketing', value: 150 },
  { label: 'HR', value: 45 },
  { label: 'Operations', value: 280 }
];

const mockInsights = [
  { id: 'INS-1', category: 'Recruitment', summary: 'Offer acceptance rate in Engineering increased by 15% this quarter.', impact: 'High', date: new Date().toISOString() },
  { id: 'INS-2', category: 'Compliance', summary: '30 employees in Sales have expiring data privacy certifications next week.', impact: 'Medium', date: new Date().toISOString() },
  { id: 'INS-3', category: 'Performance', summary: 'Goal completion rate is lagging in the Marketing department.', impact: 'High', date: new Date().toISOString() }
];

export const intelligenceService = {
  getExecutiveDashboard: async () => { await delay(); return mockKpis; },
  getWorkforceAnalytics: async () => { await delay(); return mockWorkforce; },
  getInsights: async () => { await delay(); return mockInsights; }
};
`,

  'hooks/usePeopleIntelligence.js': `import { useEffect } from 'react';
import { useIntelligenceStore } from '../store/intelligenceStore';
import { intelligenceService } from '../services/intelligenceService';

export function usePeopleIntelligence() {
  const store = useIntelligenceStore();

  const fetchData = async () => {
    try {
      store.setLoading(true);
      store.setError(null);
      const [kpis, workforce, insights] = await Promise.all([
        intelligenceService.getExecutiveDashboard(),
        intelligenceService.getWorkforceAnalytics(),
        intelligenceService.getInsights()
      ]);
      store.setExecutiveKpis(kpis);
      store.setWorkforceMetrics(workforce);
      store.setInsights(insights);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch analytics data');
    } finally {
      store.setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [store.filters]);

  return { ...store, refresh: fetchData };
}
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('HR Intelligence core files created successfully.');
