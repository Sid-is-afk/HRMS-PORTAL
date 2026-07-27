const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

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
