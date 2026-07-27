const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'platform', 'operations');

const files = {
  'models/operationsModels.js': `/**
 * @typedef {Object} OperationsDashboardSummary
 * @property {number} healthyServices
 * @property {number} warningServices
 * @property {number} openIncidents
 * @property {number} pendingJobs
 * @property {number} uptimePercentage
 */

/**
 * @typedef {Object} ServiceHealth
 * @property {string} id
 * @property {string} name
 * @property {string} status - Healthy, Warning, Critical, Maintenance
 * @property {string} lastChecked
 * @property {number} responseTimeMs
 */

/**
 * @typedef {Object} Incident
 * @property {string} id
 * @property {string} title
 * @property {string} status - Open, Investigating, Resolved
 * @property {string} severity - Low, Medium, High, Critical
 * @property {string} createdAt
 * @property {string[]} affectedServices
 */

/**
 * @typedef {Object} PlatformLog
 * @property {string} id
 * @property {string} timestamp
 * @property {string} level - INFO, WARN, ERROR
 * @property {string} source - API, Worker, Auth
 * @property {string} message
 */
`,

  'validation/operationsSchema.js': `import { z } from 'zod';

export const logFilterSchema = z.object({
  level: z.enum(['INFO', 'WARN', 'ERROR', 'ALL']).optional(),
  source: z.string().optional(),
  search: z.string().optional(),
});
`,

  'store/operationsStore.js': `import { create } from 'zustand';

export const useOperationsStore = create((set) => ({
  dashboardSummary: null,
  services: [],
  incidents: [],
  logs: [],
  
  isLoading: false,
  error: null,

  setDashboardSummary: (summary) => set({ dashboardSummary: summary }),
  setServices: (services) => set({ services }),
  setIncidents: (incidents) => set({ incidents }),
  setLogs: (logs) => set({ logs }),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
`,

  'services/operationsService.js': `const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const mockServices = [
  { id: 'SRV-1', name: 'Primary Database', status: 'Healthy', lastChecked: new Date().toISOString(), responseTimeMs: 12 },
  { id: 'SRV-2', name: 'Authentication API', status: 'Warning', lastChecked: new Date().toISOString(), responseTimeMs: 450 },
  { id: 'SRV-3', name: 'Blob Storage', status: 'Healthy', lastChecked: new Date().toISOString(), responseTimeMs: 45 },
];

const mockIncidents = [
  { id: 'INC-001', title: 'High latency on Authentication API', status: 'Investigating', severity: 'High', createdAt: new Date(Date.now() - 3600000).toISOString(), affectedServices: ['SRV-2'] },
  { id: 'INC-002', title: 'Scheduled Database Maintenance', status: 'Resolved', severity: 'Low', createdAt: new Date(Date.now() - 86400000).toISOString(), affectedServices: ['SRV-1'] },
];

const mockLogs = [
  { id: 'L-1', timestamp: new Date(Date.now() - 1000).toISOString(), level: 'ERROR', source: 'Auth', message: 'Connection timeout to IdP' },
  { id: 'L-2', timestamp: new Date(Date.now() - 5000).toISOString(), level: 'INFO', source: 'Worker', message: 'Batch job 4492 completed' },
  { id: 'L-3', timestamp: new Date(Date.now() - 15000).toISOString(), level: 'WARN', source: 'API', message: 'Rate limit approaching for tenant T-842' },
];

export const operationsService = {
  getDashboardSummary: async () => {
    await delay();
    return {
      healthyServices: 12,
      warningServices: 1,
      openIncidents: 1,
      pendingJobs: 42,
      uptimePercentage: 99.98
    };
  },

  getServices: async () => {
    await delay();
    return mockServices;
  },

  getIncidents: async () => {
    await delay();
    return mockIncidents;
  },

  getLogs: async () => {
    await delay();
    return mockLogs;
  },
};
`,

  'hooks/useOperations.js': `import { useCallback } from 'react';
import { useOperationsStore } from '../store/operationsStore';
import { operationsService } from '../services/operationsService';

export function useOperations() {
  const store = useOperationsStore();

  const fetchDashboard = useCallback(async () => {
    try {
      store.setLoading(true);
      store.setError(null);
      const summary = await operationsService.getDashboardSummary();
      store.setDashboardSummary(summary);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch dashboard');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      store.setLoading(true);
      const services = await operationsService.getServices();
      store.setServices(services);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch services');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchIncidents = useCallback(async () => {
    try {
      store.setLoading(true);
      const incidents = await operationsService.getIncidents();
      store.setIncidents(incidents);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch incidents');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      store.setLoading(true);
      const logs = await operationsService.getLogs();
      store.setLogs(logs);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch logs');
    } finally {
      store.setLoading(false);
    }
  }, []);

  return { 
    ...store, 
    fetchDashboard, 
    fetchServices, 
    fetchIncidents, 
    fetchLogs 
  };
}
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('Operations core files created successfully.');
