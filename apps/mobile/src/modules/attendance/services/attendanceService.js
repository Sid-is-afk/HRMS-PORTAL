import api from '@/api/axios';

// Placeholder service functions simulating backend calls
// In the future, these will map to actual endpoints documented in TRD.md

export const attendanceService = {
  getTodayAttendance: async () => {
    // Simulated delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    // Simulate fetching today's attendance record
    // Return mock data for MVP
    return {
      status: 'NOT_MARKED', // NOT_MARKED, CLOCKED_IN, CLOCKED_OUT
      checkIn: null,
      checkOut: null,
      hoursWorked: 0,
    };
  },

  checkIn: async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    // Simulate API response
    const now = new Date();
    return {
      status: 'CLOCKED_IN',
      checkIn: now.toISOString(),
      checkOut: null,
      hoursWorked: 0,
    };
  },

  checkOut: async (checkInTime) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const now = new Date();
    
    // Calculate hours worked
    let hoursWorked = 0;
    if (checkInTime) {
      const inTime = new Date(checkInTime);
      const diff = Math.abs(now - inTime);
      hoursWorked = (diff / (1000 * 60 * 60)).toFixed(2);
    }

    return {
      status: 'CLOCKED_OUT',
      checkIn: checkInTime,
      checkOut: now.toISOString(),
      hoursWorked: parseFloat(hoursWorked),
    };
  },

  getAttendanceHistory: async (params) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Mock history data
    const history = Array.from({ length: 10 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (index + 1));
      
      // Randomly assign a status for demo
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      let status = 'Present';
      let checkIn = new Date(date.setHours(9, Math.floor(Math.random() * 30), 0)).toISOString();
      let checkOut = new Date(date.setHours(17, Math.floor(Math.random() * 30), 0)).toISOString();
      let hoursWorked = 8 + Math.random();

      if (isWeekend) {
        status = 'Weekend';
        checkIn = null;
        checkOut = null;
        hoursWorked = 0;
      } else if (Math.random() > 0.8) {
        status = 'Absent';
        checkIn = null;
        checkOut = null;
        hoursWorked = 0;
      } else if (Math.random() > 0.6) {
        status = 'On Leave';
        checkIn = null;
        checkOut = null;
        hoursWorked = 0;
      }

      return {
        id: `att-${index}`,
        date: date.toISOString().split('T')[0],
        status,
        checkIn,
        checkOut,
        hoursWorked: parseFloat(hoursWorked.toFixed(2)),
      };
    });

    return {
      data: history,
      total: 10,
    };
  },

  getAttendanceSummary: async (period) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    // Mock summary data
    return {
      totalDays: 30,
      present: 20,
      absent: 2,
      onLeave: 2,
      late: 1,
      holidays: 1,
      weekends: 4,
    };
  },
};
