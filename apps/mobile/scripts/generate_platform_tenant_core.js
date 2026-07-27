const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'platform', 'tenant');

const files = {
  'models/tenantModels.js': `/**
 * @typedef {Object} TenantDashboardSummary
 * @property {number} totalTenants
 * @property {number} activeTenants
 * @property {number} provisioning
 * @property {number} suspended
 * @property {number} archived
 */

/**
 * @typedef {Object} Tenant
 * @property {string} id
 * @property {string} name
 * @property {string} orgCode
 * @property {string} status - Prospect, Provisioning, Active, Maintenance, Suspended, Archived, Deleted
 * @property {string} createdAt
 * @property {string} industry
 * @property {string} primaryContact
 */

/**
 * @typedef {Object} TenantLifecycleEvent
 * @property {string} id
 * @property {string} tenantId
 * @property {string} status
 * @property {string} timestamp
 * @property {string} actor
 * @property {string} notes
 */

/**
 * @typedef {Object} ProvisioningStep
 * @property {string} id
 * @property {string} name
 * @property {string} status - Pending, InProgress, Completed, Failed
 * @property {string} errorDetails
 */
`,

  'validation/tenantSchema.js': `import { z } from 'zod';

export const tenantCreationSchema = z.object({
  name: z.string().min(2, 'Organization Name is required'),
  orgCode: z.string().min(3, 'Organization Code is required').max(10),
  industry: z.string().min(1, 'Industry is required'),
  primaryContact: z.string().email('Valid email is required for primary contact'),
});
`,

  'store/tenantStore.js': `import { create } from 'zustand';

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
`,

  'services/tenantService.js': `const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

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
`,

  'hooks/useTenants.js': `import { useEffect, useCallback } from 'react';
import { useTenantStore } from '../store/tenantStore';
import { tenantService } from '../services/tenantService';

export function useTenants() {
  const store = useTenantStore();

  const fetchDashboard = useCallback(async () => {
    try {
      store.setLoading(true);
      store.setError(null);
      const summary = await tenantService.getDashboardSummary();
      store.setDashboardSummary(summary);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch dashboard');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchTenants = useCallback(async () => {
    try {
      store.setLoading(true);
      store.setError(null);
      const tenants = await tenantService.getTenants();
      store.setTenants(tenants);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch tenants');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const getTenantDetails = async (id) => {
    try {
      store.setLoading(true);
      store.setError(null);
      const [tenant, events] = await Promise.all([
        tenantService.getTenantById(id),
        tenantService.getLifecycleTimeline(id)
      ]);
      store.setSelectedTenant(tenant);
      store.setLifecycleEvents(events);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch tenant details');
    } finally {
      store.setLoading(false);
    }
  };

  return { ...store, fetchDashboard, fetchTenants, getTenantDetails };
}
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('Tenant Lifecycle core files created successfully.');
