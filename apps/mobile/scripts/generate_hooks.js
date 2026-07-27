const fs = require('fs');
const path = require('path');

const hooksDir = path.join('src', 'modules', 'admin', 'workforce', 'hooks');

const hooks = {
  'useShifts.js': `import { useEffect } from 'react';
import { useWorkforceStore } from '../store/workforceStore';

export const useShifts = () => {
  const { shifts, isLoading, error, fetchShifts, createShift } = useWorkforceStore();

  useEffect(() => {
    fetchShifts();
  }, []);

  return { shifts, isLoading, error, fetchShifts, createShift };
};
`,
  'useHolidayCalendar.js': `import { useEffect } from 'react';
import { useWorkforceStore } from '../store/workforceStore';

export const useHolidayCalendar = () => {
  const { holidayCalendars, isLoading, error, fetchHolidayCalendars } = useWorkforceStore();

  useEffect(() => {
    fetchHolidayCalendars();
  }, []);

  return { holidayCalendars, isLoading, error, fetchHolidayCalendars };
};
`,
  'useAttendancePolicies.js': `import { useEffect } from 'react';
import { useWorkforceStore } from '../store/workforceStore';

export const useAttendancePolicies = () => {
  const { attendancePolicies, isLoading, error, fetchAttendancePolicies } = useWorkforceStore();

  useEffect(() => {
    fetchAttendancePolicies();
  }, []);

  return { attendancePolicies, isLoading, error, fetchAttendancePolicies };
};
`
};

for (const [filename, content] of Object.entries(hooks)) {
  fs.writeFileSync(path.join(hooksDir, filename), content);
}
console.log('Hooks created successfully.');
