import { apiClient } from '@/api/client/apiClient';
import { API_ROUTES } from '@/shared/constants/apiRoutes';
import { USE_MOCK_DATA } from '@/shared/constants/env';
import { mockData } from '@/tests/mocks/mockData';
import { executeOrQueue } from '@/shared/utils/offlineUtils';
import { SYNC_EVENTS } from '@/shared/models/offlineModels';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buildDuration = (startDate, endDate, halfDay) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayCount = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
  return halfDay ? 0.5 : dayCount;
};

export const leaveService = {
  getLeaveBalance: async () => {
    if (USE_MOCK_DATA) {
      await delay(600);
      return mockData.leave.balance;
    }
    const response = await apiClient.get(API_ROUTES.LEAVE.BALANCE);
    return response?.data || response;
  },

  getLeaveHistory: async () => {
    if (USE_MOCK_DATA) {
      await delay(800);
      return { data: mockData.leave.history, total: mockData.leave.history.length };
    }
    const response = await apiClient.get(API_ROUTES.LEAVE.HISTORY);
    return response?.data || response;
  },

  getLeaveDetails: async (requestId) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return mockData.leave.history.find((item) => item.id === requestId) || mockData.leave.history[0];
    }
    const endpoint = `${API_ROUTES.LEAVE.HISTORY}/${requestId}`;
    const response = await apiClient.get(endpoint);
    return response?.data || response;
  },

  applyLeave: async (payload) => {
    const apiCall = async () => {
      if (USE_MOCK_DATA) {
        await delay(900);
        return {
          success: true,
          data: {
            id: `leave-${Date.now()}`,
            leaveType: payload.leaveType,
            startDate: payload.startDate,
            endDate: payload.endDate,
            halfDay: payload.halfDay || false,
            reason: payload.reason,
            status: 'PENDING',
            duration: buildDuration(payload.startDate, payload.endDate, payload.halfDay),
            createdAt: new Date().toISOString(),
          },
        };
      }
      return apiClient.post(API_ROUTES.LEAVE.APPLY, payload);
    };

    const response = await executeOrQueue(
      apiCall,
      SYNC_EVENTS.LEAVE_REQUEST_CREATE,
      API_ROUTES.LEAVE.APPLY,
      'POST',
      payload
    );

    if (response?.offline) {
      return {
        id: `leave-offline-${Date.now()}`,
        leaveType: payload.leaveType,
        startDate: payload.startDate,
        endDate: payload.endDate,
        halfDay: payload.halfDay || false,
        reason: payload.reason,
        status: 'PENDING',
        duration: buildDuration(payload.startDate, payload.endDate, payload.halfDay),
        createdAt: new Date().toISOString(),
        offline: true,
      };
    }
    return response?.data || response;
  },

  cancelLeave: async (requestId) => {
    const endpoint = `${API_ROUTES.LEAVE.CANCEL}/${requestId}`;
    const apiCall = async () => {
      if (USE_MOCK_DATA) {
        await delay(700);
        return {
          success: true,
          data: { id: requestId, status: 'CANCELLED' },
        };
      }
      return apiClient.post(endpoint);
    };

    const response = await executeOrQueue(
      apiCall,
      SYNC_EVENTS.LEAVE_REQUEST_CANCEL,
      endpoint,
      'POST',
      {}
    );

    if (response?.offline) {
      return { id: requestId, status: 'CANCELLED', offline: true };
    }
    return response?.data || response;
  },

  getLeaveTypes: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return mockData.leave.types;
    }
    const response = await apiClient.get(API_ROUTES.LEAVE.TYPES);
    return response?.data || response;
  },

  getLeaveStatus: async () => {
    return ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];
  },
};

