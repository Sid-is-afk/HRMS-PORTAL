const fs = require('fs');
const path = require('path');

const hooksDir = path.join('src', 'modules', 'admin', 'attendance', 'hooks');

const hooks = {
  'useAttendance.js': `import { useEffect } from 'react';
import { useAttendanceStore } from '../store/attendanceStore';

export const useAttendance = (filters = {}) => {
  const { attendanceRecords, isLoading, error, fetchAttendance } = useAttendanceStore();

  useEffect(() => {
    fetchAttendance(filters);
  }, [JSON.stringify(filters)]);

  return { attendanceRecords, isLoading, error, fetchAttendance };
};
`,
  'useAttendanceSummary.js': `import { useEffect } from 'react';
import { useAttendanceStore } from '../store/attendanceStore';

export const useAttendanceSummary = (employeeId, period) => {
  const { attendanceSummary, isLoading, error, fetchAttendanceSummary } = useAttendanceStore();

  useEffect(() => {
    if (employeeId && period) {
      fetchAttendanceSummary(employeeId, period);
    }
  }, [employeeId, period]);

  return { attendanceSummary, isLoading, error, fetchAttendanceSummary };
};
`,
  'useRegularization.js': `import { useAttendanceStore } from '../store/attendanceStore';

export const useRegularization = () => {
  const { submitRegularization, isLoading, error } = useAttendanceStore();

  return { submitRegularization, isLoading, error };
};
`
};

for (const [filename, content] of Object.entries(hooks)) {
  fs.writeFileSync(path.join(hooksDir, filename), content);
}
console.log('Hooks created successfully.');
