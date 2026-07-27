const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const mockUsers = [
  { id: 'PU-1', name: 'Alice Admin', email: 'alice@platform.local', role: 'Super Admin', status: 'Active', lastLogin: new Date().toISOString() },
  { id: 'PU-2', name: 'Bob Security', email: 'bob@platform.local', role: 'Security Admin', status: 'Suspended', lastLogin: new Date(Date.now() - 5 * 86400000).toISOString() },
];

const mockRoles = [
  { id: 'PR-1', name: 'Super Admin', description: 'Unrestricted platform access', assignedUsers: 3, status: 'Active' },
  { id: 'PR-2', name: 'Security Admin', description: 'Manage identity and policies', assignedUsers: 1, status: 'Active' },
];

const mockSessions = [
  { id: 'S-1', userId: 'PU-1', userName: 'Alice Admin', device: 'Chrome / Windows', ipAddress: '192.168.1.100', startedAt: new Date(Date.now() - 3600000).toISOString(), status: 'Active' },
  { id: 'S-2', userId: 'PU-2', userName: 'Bob Security', device: 'Safari / iOS', ipAddress: '10.0.0.5', startedAt: new Date(Date.now() - 7200000).toISOString(), status: 'Revoked' },
];

export const identityService = {
  getDashboardSummary: async () => {
    await delay();
    return {
      activeUsers: 48,
      globalRoles: 12,
      activeSessions: 320,
      suspiciousLogins: 2
    };
  },

  getPlatformUsers: async () => {
    await delay();
    return mockUsers;
  },

  getGlobalRoles: async () => {
    await delay();
    return mockRoles;
  },

  getSessions: async () => {
    await delay();
    return mockSessions;
  },
};
