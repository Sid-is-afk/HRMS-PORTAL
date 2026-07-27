const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'platform');

const files = {
  'models/platformModels.js': `/**
 * @typedef {Object} PlatformDashboardSummary
 * @property {number} totalOrganizations
 * @property {number} activeOrganizations
 * @property {number} inactiveOrganizations
 * @property {number} platformUsers
 * @property {string} systemHealth - e.g., 'Healthy', 'Degraded', 'Offline'
 * @property {string} apiHealth - e.g., 'Operational'
 * @property {string} platformVersion
 */

/**
 * @typedef {Object} PlatformActivity
 * @property {string} id
 * @property {string} description
 * @property {string} timestamp
 * @property {string} severity
 */

/**
 * @typedef {Object} PlatformNotification
 * @property {string} id
 * @property {string} title
 * @property {string} message
 * @property {string} date
 * @property {boolean} read
 * @property {string} type - e.g., 'Update', 'Alert', 'System'
 */

/**
 * @typedef {Object} PlatformQuickAction
 * @property {string} id
 * @property {string} label
 * @property {string} route
 * @property {string} iconName
 */
`,

  'validation/platformSchema.js': `import { z } from 'zod';

export const platformSearchSchema = z.object({
  query: z.string().min(1, 'Search query cannot be empty'),
  filter: z.enum(['All', 'Organizations', 'Users', 'Logs']).optional()
});
`,

  'store/platformStore.js': `import { create } from 'zustand';

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
`,

  'services/platformService.js': `const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const platformService = {
  getDashboardSummary: async () => {
    await delay();
    return {
      totalOrganizations: 145,
      activeOrganizations: 132,
      inactiveOrganizations: 13,
      platformUsers: 48,
      systemHealth: 'Healthy',
      apiHealth: 'Operational',
      platformVersion: 'v2.4.1'
    };
  },

  getActivities: async () => {
    await delay();
    return [
      { id: 'ACT-1', description: 'Acme Corp organization created', timestamp: new Date().toISOString(), severity: 'Info' },
      { id: 'ACT-2', description: 'Global API latency spike detected', timestamp: new Date(Date.now() - 3600000).toISOString(), severity: 'Warning' }
    ];
  },

  getNotifications: async () => {
    await delay();
    return [
      { id: 'NOT-1', title: 'Platform Update Scheduled', message: 'v2.5.0 deployment tonight at 2AM UTC.', date: new Date().toISOString(), read: false, type: 'System' },
      { id: 'NOT-2', title: 'New Tenant Registered', message: 'GlobalTech Ltd has completed onboarding.', date: new Date(Date.now() - 86400000).toISOString(), read: true, type: 'Update' }
    ];
  },

  searchPlatform: async (query) => {
    await delay();
    return [
      { id: 'RES-1', type: 'Organization', title: 'TechCorp Solutions', subtitle: 'Active Tenant' },
      { id: 'RES-2', type: 'User', title: 'Jane Doe', subtitle: 'Platform Admin' }
    ];
  }
};
`,

  'hooks/usePlatformDashboard.js': `import { useEffect } from 'react';
import { usePlatformStore } from '../store/platformStore';
import { platformService } from '../services/platformService';

export function usePlatformDashboard() {
  const store = usePlatformStore();

  const fetchDashboard = async () => {
    try {
      store.setLoading(true);
      store.setError(null);
      const [summary, activities, notifications] = await Promise.all([
        platformService.getDashboardSummary(),
        platformService.getActivities(),
        platformService.getNotifications()
      ]);
      store.setDashboardSummary(summary);
      store.setActivities(activities);
      store.setNotifications(notifications);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch platform dashboard');
    } finally {
      store.setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return { ...store, refresh: fetchDashboard };
}
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('Platform core files created successfully.');
