const fs = require('fs');
const path = require('path');

const hooksDir = path.join('src', 'modules', 'admin', 'system', 'hooks');

const hooks = {
  'useSystemHealth.js': `import { useEffect } from 'react';
import { useSystemStore } from '../store/systemStore';

export const useSystemHealth = () => {
  const { healthMetrics, isLoading, error, fetchSystemHealth } = useSystemStore();

  useEffect(() => {
    fetchSystemHealth();
  }, []);

  return { healthMetrics, isLoading, error, fetchSystemHealth };
};
`,
  'useFeatureFlags.js': `import { useEffect } from 'react';
import { useSystemStore } from '../store/systemStore';

export const useFeatureFlags = () => {
  const { featureFlags, isLoading, error, fetchFeatureFlags, toggleFeatureFlag } = useSystemStore();

  useEffect(() => {
    fetchFeatureFlags();
  }, []);

  return { featureFlags, isLoading, error, fetchFeatureFlags, toggleFeatureFlag };
};
`,
  'useAuditLogs.js': `import { useEffect } from 'react';
import { useSystemStore } from '../store/systemStore';

export const useAuditLogs = () => {
  const { auditLogs, isLoading, error, fetchAuditLogs } = useSystemStore();

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  return { auditLogs, isLoading, error, fetchAuditLogs };
};
`
};

for (const [filename, content] of Object.entries(hooks)) {
  fs.writeFileSync(path.join(hooksDir, filename), content);
}
console.log('Hooks created successfully.');
