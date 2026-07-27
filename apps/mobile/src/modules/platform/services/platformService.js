const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

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

  searchPlatform: async (_query) => {
    await delay();
    return [
      { id: 'RES-1', type: 'Organization', title: 'TechCorp Solutions', subtitle: 'Active Tenant' },
      { id: 'RES-2', type: 'User', title: 'Jane Doe', subtitle: 'Platform Admin' }
    ];
  }
};
