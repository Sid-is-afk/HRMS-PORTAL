const fs = require('fs');
const path = require('path');

const hooksDir = path.join('src', 'modules', 'admin', 'leave', 'hooks');

const hooks = {
  'useLeave.js': `import { useEffect } from 'react';
import { useLeaveStore } from '../store/leaveStore';

export const useLeave = (filters = {}) => {
  const { leaveRequests, isLoading, error, fetchLeaveRequests } = useLeaveStore();

  useEffect(() => {
    fetchLeaveRequests(filters);
  }, [JSON.stringify(filters)]);

  return { leaveRequests, isLoading, error, fetchLeaveRequests };
};
`,
  'useLeaveBalances.js': `import { useEffect } from 'react';
import { useLeaveStore } from '../store/leaveStore';

export const useLeaveBalances = (employeeId) => {
  const { leaveBalances, isLoading, error, fetchLeaveBalances } = useLeaveStore();

  useEffect(() => {
    if (employeeId) {
      fetchLeaveBalances(employeeId);
    }
  }, [employeeId]);

  return { leaveBalances, isLoading, error, fetchLeaveBalances };
};
`,
  'useLeaveApprovals.js': `import { useLeaveStore } from '../store/leaveStore';

export const useLeaveApprovals = () => {
  const { approveLeave, rejectLeave, isLoading, error } = useLeaveStore();

  return { approveLeave, rejectLeave, isLoading, error };
};
`
};

for (const [filename, content] of Object.entries(hooks)) {
  fs.writeFileSync(path.join(hooksDir, filename), content);
}
console.log('Hooks created successfully.');
