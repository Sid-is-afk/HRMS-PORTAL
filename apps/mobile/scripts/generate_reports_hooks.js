const fs = require('fs');
const path = require('path');

const hooksDir = path.join('src', 'modules', 'admin', 'reports', 'hooks');

const hooks = {
  'useReports.js': `import { useEffect } from 'react';
import { useReportsStore } from '../store/reportsStore';

export const useReports = () => {
  const { reports, isLoading, error, fetchReports } = useReportsStore();

  useEffect(() => {
    fetchReports();
  }, []);

  return { reports, isLoading, error, fetchReports };
};
`,
  'useSavedReports.js': `import { useEffect } from 'react';
import { useReportsStore } from '../store/reportsStore';

export const useSavedReports = () => {
  const { savedReports, isLoading, error, fetchSavedReports } = useReportsStore();

  useEffect(() => {
    fetchSavedReports();
  }, []);

  return { savedReports, isLoading, error, fetchSavedReports };
};
`,
  'useAnalytics.js': `import { useEffect } from 'react';
import { useReportsStore } from '../store/reportsStore';

export const useAnalytics = () => {
  const { analyticsSummary, isLoading, error, fetchAnalyticsSummary } = useReportsStore();

  useEffect(() => {
    fetchAnalyticsSummary();
  }, []);

  return { analyticsSummary, isLoading, error, fetchAnalyticsSummary };
};
`
};

for (const [filename, content] of Object.entries(hooks)) {
  fs.writeFileSync(path.join(hooksDir, filename), content);
}
console.log('Hooks created successfully.');
