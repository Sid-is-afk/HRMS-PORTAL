const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
  getAttendance: async (_filters) => {
    await delay(500);
    return { data: [], total: 0 }; // Placeholder
  },
  
  getAttendanceSummary: async (employeeId, period) => {
    await delay(500);
    return { 
      data: {
        totalPresent: 0,
        totalAbsent: 0,
        totalHalfDays: 0,
        totalLeaves: 0,
        totalLateArrivals: 0,
        totalEarlyExits: 0,
        totalWorkingMinutes: 0,
        period
      } 
    };
  },
  
  getAttendanceTimeline: async (_employeeId, _date) => {
    await delay(500);
    return { data: [] };
  },
  
  getAttendanceExceptions: async (_filters) => {
    await delay(500);
    return { data: [], total: 0 };
  },
  
  submitRegularization: async (regularizationData) => {
    await delay(500);
    return { success: true, data: regularizationData };
  },
  
  getRegularizationHistory: async (_attendanceRecordId) => {
    await delay(500);
    return { data: [] };
  }
};
