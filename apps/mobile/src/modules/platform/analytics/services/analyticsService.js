const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

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
