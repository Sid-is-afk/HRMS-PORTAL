const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'platform', 'identity');

const files = {
  'models/identityModels.js': `/**
 * @typedef {Object} IdentityDashboardSummary
 * @property {number} activeUsers
 * @property {number} globalRoles
 * @property {number} activeSessions
 * @property {number} suspiciousLogins
 */

/**
 * @typedef {Object} PlatformUser
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} role
 * @property {string} status - Active, Suspended
 * @property {string} lastLogin
 */

/**
 * @typedef {Object} PlatformRole
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} assignedUsers
 * @property {string} status
 */

/**
 * @typedef {Object} Session
 * @property {string} id
 * @property {string} userId
 * @property {string} userName
 * @property {string} device
 * @property {string} ipAddress
 * @property {string} startedAt
 * @property {string} status - Active, Revoked
 */
`,

  'validation/identitySchema.js': `import { z } from 'zod';

export const platformUserSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  role: z.string().min(1, 'Role is required'),
});
`,

  'store/identityStore.js': `import { create } from 'zustand';

export const useIdentityStore = create((set) => ({
  dashboardSummary: null,
  platformUsers: [],
  globalRoles: [],
  sessions: [],
  
  isLoading: false,
  error: null,

  setDashboardSummary: (summary) => set({ dashboardSummary: summary }),
  setPlatformUsers: (users) => set({ platformUsers: users }),
  setGlobalRoles: (roles) => set({ globalRoles: roles }),
  setSessions: (sessions) => set({ sessions }),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
`,

  'services/identityService.js': `const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

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
`,

  'hooks/useIdentity.js': `import { useCallback } from 'react';
import { useIdentityStore } from '../store/identityStore';
import { identityService } from '../services/identityService';

export function useIdentity() {
  const store = useIdentityStore();

  const fetchDashboard = useCallback(async () => {
    try {
      store.setLoading(true);
      store.setError(null);
      const summary = await identityService.getDashboardSummary();
      store.setDashboardSummary(summary);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch dashboard');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      store.setLoading(true);
      const users = await identityService.getPlatformUsers();
      store.setPlatformUsers(users);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch users');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      store.setLoading(true);
      const roles = await identityService.getGlobalRoles();
      store.setGlobalRoles(roles);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch roles');
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchSessions = useCallback(async () => {
    try {
      store.setLoading(true);
      const sessions = await identityService.getSessions();
      store.setSessions(sessions);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch sessions');
    } finally {
      store.setLoading(false);
    }
  }, []);

  return { 
    ...store, 
    fetchDashboard, 
    fetchUsers, 
    fetchRoles, 
    fetchSessions 
  };
}
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('Identity core files created successfully.');
