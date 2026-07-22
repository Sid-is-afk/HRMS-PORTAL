import { useMemo } from 'react';

export function useEmployeeDetails(employee) {
  const attendanceSummary = useMemo(() => {
    if (!employee) return null;
    return {
      presentDays: 20,
      absentDays: 1,
      leaveDays: 2,
      lateDays: 1,
      attendancePercentage: '95%',
    };
  }, [employee]);

  const leaveSummary = useMemo(() => {
    if (!employee) return null;
    return {
      allocated: 15,
      availed: 6,
      pending: 1,
      remaining: 9,
    };
  }, [employee]);

  const activityTimeline = useMemo(() => {
    if (!employee) return [];
    return [
      { id: 't1', title: 'Joined the Organization', desc: `Joined as ${employee.employment.designation.title}`, date: employee.employment.joiningDate },
      { id: 't2', title: 'Emergency Contact Updated', desc: 'Updated contact details', date: new Date().toISOString() },
    ];
  }, [employee]);

  return {
    attendanceSummary,
    leaveSummary,
    activityTimeline,
  };
}
