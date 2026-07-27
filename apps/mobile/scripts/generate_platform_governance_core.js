const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'platform', 'governance');

const files = {
  'models/governanceModels.js': `/**
 * @typedef {Object} GovernanceDashboardSummary
 * @property {number} activeFeatures
 * @property {number} totalModules
 * @property {number} activeSubscriptions
 * @property {number} expiringLicenses
 */

/**
 * @typedef {Object} PlatformFeature
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {boolean} enabled
 * @property {string} category
 * @property {string} rolloutStage - Preview, Beta, GA, Deprecated
 */

/**
 * @typedef {Object} ModuleDefinition
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {boolean} isCore
 * @property {string} status - Available, Beta, Development
 */

/**
 * @typedef {Object} SubscriptionPlan
 * @property {string} id
 * @property {string} name
 * @property {number} userLimit
 * @property {number} storageLimitGb
 * @property {string[]} includedModules
 */
`,

  'validation/governanceSchema.js': `import { z } from 'zod';

export const featureToggleSchema = z.object({
  featureId: z.string(),
  enabled: z.boolean(),
});

export const defaultPolicySchema = z.object({
  passwordMinLength: z.number().min(8).max(64),
  sessionTimeoutMinutes: z.number().min(5).max(1440),
});
`,

  'store/governanceStore.js': `import { create } from 'zustand';

export const useGovernanceStore = create((set) => ({
  dashboardSummary: null,
  features: [],
  modules: [],
  subscriptions: [],
  
  isLoading: false,
  error: null,

  setDashboardSummary: (summary) => set({ dashboardSummary: summary }),
  setFeatures: (features) => set({ features }),
  setModules: (modules) => set({ modules }),
  setSubscriptions: (subscriptions) => set({ subscriptions }),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
`,

  'services/governanceService.js': `const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const mockFeatures = [
  { id: 'F-001', name: 'AI Resume Parsing', description: 'Automatically extract skills from uploaded PDFs', enabled: true, category: 'Talent Acquisition', rolloutStage: 'GA' },
  { id: 'F-002', name: 'Advanced Org Chart', description: 'Interactive 3D organizational structure viewer', enabled: false, category: 'Core HR', rolloutStage: 'Beta' },
  { id: 'F-003', name: 'Predictive Attrition', description: 'ML-driven risk scoring for employee departure', enabled: true, category: 'Analytics', rolloutStage: 'Preview' },
];

const mockModules = [
  { id: 'M-001', name: 'Employee Workspace', description: 'Core self-service platform', isCore: true, status: 'Available' },
  { id: 'M-002', name: 'Talent Acquisition', description: 'Full lifecycle recruiting pipeline', isCore: false, status: 'Available' },
  { id: 'M-003', name: 'Performance Management', description: 'OKRs and 360 reviews', isCore: false, status: 'Beta' },
];

const mockSubscriptions = [
  { id: 'SUB-1', name: 'Starter', userLimit: 50, storageLimitGb: 10, includedModules: ['M-001'] },
  { id: 'SUB-2', name: 'Professional', userLimit: 500, storageLimitGb: 100, includedModules: ['M-001', 'M-002'] },
  { id: 'SUB-3', name: 'Enterprise', userLimit: 99999, storageLimitGb: 5000, includedModules: ['M-001', 'M-002', 'M-003'] },
];

export const governanceService = {
  getDashboardSummary: async () => {
    await delay();
    return {
      activeFeatures: 42,
      totalModules: 14,
      activeSubscriptions: 3,
      expiringLicenses: 5
    };
  },

  getFeatures: async () => {
    await delay();
    return mockFeatures;
  },

  getModules: async () => {
    await delay();
    return mockModules;
  },

  getSubscriptions: async () => {
    await delay();
    return mockSubscriptions;
  },
};
`,

  'hooks/useGovernance.js': `import { useCallback } from 'react';
import { useGovernanceStore } from '../store/governanceStore';
import { governanceService } from '../services/governanceService';

export function useGovernance() {
  const store = useGovernanceStore();

  const fetchDashboard = useCallback(async () => {
    try {
      store.setLoading(true);
      store.setError(null);
      const summary = await governanceService.getDashboardSummary();
      store.setDashboardSummary(summary);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch dashboard');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchFeatures = useCallback(async () => {
    try {
      store.setLoading(true);
      const features = await governanceService.getFeatures();
      store.setFeatures(features);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch features');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchModules = useCallback(async () => {
    try {
      store.setLoading(true);
      const modules = await governanceService.getModules();
      store.setModules(modules);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch modules');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchSubscriptions = useCallback(async () => {
    try {
      store.setLoading(true);
      const subs = await governanceService.getSubscriptions();
      store.setSubscriptions(subs);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch subscriptions');
    } finally {
      store.setLoading(false);
    }
  }, []);

  return { 
    ...store, 
    fetchDashboard, 
    fetchFeatures, 
    fetchModules, 
    fetchSubscriptions 
  };
}
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('Governance core files created successfully.');
