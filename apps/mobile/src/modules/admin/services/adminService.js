export const adminService = {
  getStats: async () => {
    return {
      activeEmployees: 0,
      todayAttendance: 0,
      pendingLeaves: 0,
    };
  },
};
