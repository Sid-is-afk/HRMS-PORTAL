import { apiClient } from '@/api/client/apiClient';
import { USE_REAL_PLATFORM_API } from '@/shared/constants/env';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockSummary = {
  totalOrganizations: 15,
  platformUsers: 340,
  systemHealth: 'Healthy',
  apiHealth: 'Healthy',
  healthServices: [
    { name: 'Core API', status: 'Healthy', latency: '42ms' },
    { name: 'Authentication', status: 'Healthy', latency: '24ms' },
    { name: 'Background Workers', status: 'Healthy', latency: '150ms' },
    { name: 'Database', status: 'Healthy', latency: '8ms' },
  ],
  pendingActions: [
    { id: '1', label: 'Review Tenant Request', count: 1, iconName: 'Building2', bg: '#EFF6FF', color: '#2563EB' },
    { id: '2', label: 'SSL Expiry Warning', count: 1, iconName: 'ShieldAlert', bg: '#FEF3C7', color: '#D97706' },
  ],
  orgGrowth: [
    { date: 'Jan', value: 8 },
    { date: 'Feb', value: 10 },
    { date: 'Mar', value: 12 },
    { date: 'Apr', value: 15 },
  ],
  userDistribution: [
    { name: 'Admin', value: 30 },
    { name: 'Employee', value: 290 },
    { name: 'HR', value: 20 },
  ],
  apiUsage: [
    { name: 'Mon', value: 2400 },
    { name: 'Tue', value: 1398 },
    { name: 'Wed', value: 9800 },
    { name: 'Thu', value: 3908 },
    { name: 'Fri', value: 4800 },
  ],
};

const mockActivities = [
  { id: 'act-1', description: 'New organization "Globex Corp" provisioned successfully', timestamp: '10 mins ago', type: 'provision' },
  { id: 'act-2', description: 'System backup completed successfully', timestamp: '1 hour ago', type: 'backup' },
  { id: 'act-3', description: 'Admin password changed for aarav.patel@company.com', timestamp: '2 hours ago', type: 'security' },
];

const mockNotifications = [
  { id: 'not-1', title: 'New Tenant Provisioned', message: 'Globex Corp is now active.', read: false, createdAt: '10 mins ago' },
  { id: 'not-2', title: 'High API Latency Alert', message: 'Core API latency exceeded 500ms.', read: true, createdAt: '3 hours ago' },
];

export const platformService = {
  getDashboardSummary: async () => {
    if (!USE_REAL_PLATFORM_API) {
      await delay(300);
      return mockSummary;
    }
    const response = await apiClient.get('/platform/dashboard/summary');
    return response.data;
  },

  getActivities: async () => {
    if (!USE_REAL_PLATFORM_API) {
      await delay(200);
      return mockActivities;
    }
    const response = await apiClient.get('/platform/dashboard/activities');
    return response.data;
  },

  getNotifications: async () => {
    if (!USE_REAL_PLATFORM_API) {
      await delay(200);
      return mockNotifications;
    }
    const response = await apiClient.get('/platform/dashboard/notifications');
    return response.data;
  },

  searchPlatform: async (query) => {
    if (!USE_REAL_PLATFORM_API) {
      await delay(300);
      return { success: true, data: [] };
    }
    const response = await apiClient.get('/platform/search', { params: { q: query } });
    return response.data;
  }
};

