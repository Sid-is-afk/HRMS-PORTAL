const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const leaveService = {
  getLeaveRequests: async (_filters) => {
    await delay(500);
    return { data: [], total: 0 }; // Placeholder
  },
  
  getLeaveDetails: async (_leaveId) => {
    await delay(500);
    return { data: null };
  },
  
  getLeaveBalances: async (_employeeId) => {
    await delay(500);
    return { data: [] };
  },
  
  getLeavePolicies: async () => {
    await delay(500);
    return { data: [] };
  },
  
  submitLeaveRequest: async (leaveData) => {
    await delay(500);
    return { success: true, data: leaveData };
  },
  
  approveLeave: async (_leaveId, _comments) => {
    await delay(500);
    return { success: true };
  },
  
  rejectLeave: async (_leaveId, _comments) => {
    await delay(500);
    return { success: true };
  },

  cancelLeave: async (_leaveId) => {
    await delay(500);
    return { success: true };
  },
  
  getLeaveCalendar: async (_startDate, _endDate) => {
    await delay(500);
    return { data: [] };
  }
};
