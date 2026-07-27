const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

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
