const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const mockTenants = [
  { id: 'T-001', name: 'Acme Corp', orgCode: 'ACME', status: 'Active', createdAt: new Date(Date.now() - 30 * 86400000).toISOString(), industry: 'Technology', primaryContact: 'admin@acme.corp' },
  { id: 'T-002', name: 'GlobalTech Ltd', orgCode: 'GTECH', status: 'Provisioning', createdAt: new Date().toISOString(), industry: 'Manufacturing', primaryContact: 'it@globaltech.com' },
  { id: 'T-003', name: 'Legacy Systems', orgCode: 'LEGSYS', status: 'Suspended', createdAt: new Date(Date.now() - 365 * 86400000).toISOString(), industry: 'Finance', primaryContact: 'compliance@legsys.com' },
];

export const tenantService = {
  getDashboardSummary: async () => {
    await delay();
    return {
      totalTenants: 145,
      activeTenants: 132,
      provisioning: 5,
      suspended: 3,
      archived: 5
    };
  },

  getTenants: async () => {
    await delay();
    return mockTenants;
  },

  getTenantById: async (id) => {
    await delay();
    return mockTenants.find(t => t.id === id) || mockTenants[0];
  },

  getLifecycleTimeline: async (tenantId) => {
    await delay();
    return [
      { id: 'EV-1', tenantId, status: 'Prospect', timestamp: new Date(Date.now() - 7 * 86400000).toISOString(), actor: 'System', notes: 'Initial signup via website' },
      { id: 'EV-2', tenantId, status: 'Provisioning', timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), actor: 'Super Admin', notes: 'Contract signed, provisioning started' }
    ];
  }
};
