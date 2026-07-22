

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const workforceService = {
  // Shift Management
  getShifts: async () => {
    await delay(500);
    return { data: [], total: 0 }; // Placeholder
  },
  createShift: async (shiftData) => {
    await delay(500);
    return { success: true, data: shiftData };
  },
  updateShift: async (id, shiftData) => {
    await delay(500);
    return { success: true, data: shiftData };
  },

  // Holiday Calendars
  getHolidayCalendars: async () => {
    await delay(500);
    return { data: [], total: 0 };
  },
  createHoliday: async (calendarId, holidayData) => {
    await delay(500);
    return { success: true, data: holidayData };
  },

  // Attendance Policies
  getAttendancePolicies: async () => {
    await delay(500);
    return { data: [], total: 0 };
  },
  updateAttendancePolicy: async (id, policyData) => {
    await delay(500);
    return { success: true, data: policyData };
  },

  // Weekly Off
  getWeeklyOffConfig: async () => {
    await delay(500);
    return { data: { days: ['Saturday', 'Sunday'] } };
  },
  updateWeeklyOffConfig: async (days) => {
    await delay(500);
    return { success: true, data: { days } };
  },

  // Working Hours
  getWorkingHoursConfig: async () => {
    await delay(500);
    return { data: { standardDailyHours: 8, standardWeeklyHours: 40 } };
  },
  updateWorkingHoursConfig: async (config) => {
    await delay(500);
    return { success: true, data: config };
  }
};
