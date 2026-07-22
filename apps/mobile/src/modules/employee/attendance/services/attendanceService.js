import { apiClient } from '@/api/client/apiClient';
import { API_ROUTES } from '@/shared/constants/apiRoutes';
import { USE_MOCK_DATA } from '@/shared/constants/env';
import { mockData } from '@/tests/mocks/mockData';
import { executeOrQueue } from '@/shared/utils/offlineUtils';
import { SYNC_EVENTS } from '@/shared/models/offlineModels';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const attendanceService = {
  getTodayAttendance: async () => {
    if (USE_MOCK_DATA) {
      await delay(800);
      return mockData.attendance.today;
    }
    const response = await apiClient.get(API_ROUTES.ATTENDANCE.TODAY);
    return response?.data || response;
  },

  checkIn: async () => {
    const apiCall = async () => {
      if (USE_MOCK_DATA) {
        await delay(800);
        return {
          success: true,
          data: {
            status: 'CLOCKED_IN',
            checkIn: new Date().toISOString(),
            checkOut: null,
            hoursWorked: 0,
          },
        };
      }
      return apiClient.post(API_ROUTES.ATTENDANCE.CHECK_IN);
    };

    const response = await executeOrQueue(
      apiCall,
      SYNC_EVENTS.ATTENDANCE_CLOCK_IN,
      API_ROUTES.ATTENDANCE.CHECK_IN,
      'POST',
      {}
    );

    if (response?.offline) {
      return {
        status: 'CLOCKED_IN',
        checkIn: new Date().toISOString(),
        checkOut: null,
        hoursWorked: 0,
        offline: true,
      };
    }
    return response?.data || response;
  },

  checkOut: async (checkInTime) => {
    const apiCall = async () => {
      if (USE_MOCK_DATA) {
        await delay(800);
        const now = new Date();
        let hoursWorked = 0;
        if (checkInTime) {
          const inTime = new Date(checkInTime);
          const diff = Math.abs(now - inTime);
          hoursWorked = (diff / (1000 * 60 * 60)).toFixed(2);
        }
        return {
          success: true,
          data: {
            status: 'CLOCKED_OUT',
            checkIn: checkInTime,
            checkOut: now.toISOString(),
            hoursWorked: parseFloat(hoursWorked),
          },
        };
      }
      return apiClient.post(API_ROUTES.ATTENDANCE.CHECK_OUT, { checkInTime });
    };

    const response = await executeOrQueue(
      apiCall,
      SYNC_EVENTS.ATTENDANCE_CLOCK_OUT,
      API_ROUTES.ATTENDANCE.CHECK_OUT,
      'POST',
      { checkInTime }
    );

    if (response?.offline) {
      const now = new Date();
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
        offline: true,
      };
    }
    return response?.data || response;
  },

  getAttendanceHistory: async () => {
    if (USE_MOCK_DATA) {
      await delay(1000);
      return {
        data: mockData.attendance.history,
        total: mockData.attendance.history.length,
      };
    }
    const response = await apiClient.get(API_ROUTES.ATTENDANCE.HISTORY);
    return response?.data || response;
  },

  getAttendanceSummary: async () => {
    if (USE_MOCK_DATA) {
      await delay(600);
      return mockData.attendance.summary;
    }
    const response = await apiClient.get(API_ROUTES.ATTENDANCE.SUMMARY);
    return response?.data || response;
  },
};

