const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const systemService = {
  getSystemHealth: async () => {
    await delay(500);
    return {
      data: [
        { service_name: 'Database', status: 'healthy', latency_ms: 24, last_checked: new Date().toISOString() },
        { service_name: 'Auth API', status: 'healthy', latency_ms: 110, last_checked: new Date().toISOString() },
        { service_name: 'Storage', status: 'degraded', latency_ms: 450, last_checked: new Date().toISOString() },
      ]
    };
  },
  
  getApplicationSettings: async () => {
    await delay(500);
    return {
      data: [
        { key: 'session_timeout', category: 'Security', label: 'Session Timeout (mins)', value: 30, type: 'number' },
        { key: 'default_timezone', category: 'Regional', label: 'Default Timezone', value: 'UTC', type: 'string' },
      ]
    };
  },
  
  updateSettings: async (settings) => {
    await delay(500);
    return { success: true, data: settings };
  },
  
  getAuditLogs: async () => {
    await delay(500);
    return { data: [] }; // Placeholder for actual logs
  },
  
  getActivityLogs: async () => {
    await delay(500);
    return { data: [] }; // Placeholder for activity feed
  },

  getFeatureFlags: async () => {
    await delay(500);
    return {
      data: [
        { id: '1', name: 'New Reports Engine', description: 'Enable the D3-based charting engine.', is_enabled: true, category: 'Analytics' },
        { id: '2', name: 'Beta Push Notifications', description: 'Send push alerts for Workflow approvals.', is_enabled: false, category: 'Communication' },
      ]
    };
  },

  updateFeatureFlag: async (id, is_enabled) => {
    await delay(500);
    return { success: true, data: { id, is_enabled } };
  }
};
