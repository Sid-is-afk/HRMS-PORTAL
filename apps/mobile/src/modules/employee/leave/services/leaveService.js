import { apiClient } from '@/api/client/apiClient';
import { API_ROUTES } from '@/shared/constants/apiRoutes';
import { executeOrQueue } from '@/shared/utils/offlineUtils';
import { SYNC_EVENTS } from '@/shared/models/offlineModels';
import { USE_REAL_EMPLOYEE_API } from '@/shared/constants/env';
import { mockData } from '@/tests/mocks/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buildDuration = (startDate, endDate, halfDay) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayCount = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
  return halfDay ? 0.5 : dayCount;
};

let localLeaveBalance = { ...mockData.leave.balance };
let localLeaveHistory = [...mockData.leave.history];
let localLeaveTypes = [...mockData.leave.types];

export const leaveService = {
  getLeaveBalance: async () => {
    if (!USE_REAL_EMPLOYEE_API) {
      await delay(300);
      return localLeaveBalance;
    }
    const response = await apiClient.get(API_ROUTES.LEAVE.BALANCE);
    return response?.data || response;
  },

  getLeaveHistory: async () => {
    if (!USE_REAL_EMPLOYEE_API) {
      await delay(400);
      return localLeaveHistory;
    }
    const response = await apiClient.get(API_ROUTES.LEAVE.HISTORY);
    return response?.data || response;
  },

  getLeaveDetails: async (requestId) => {
    if (!USE_REAL_EMPLOYEE_API) {
      await delay(200);
      const req = localLeaveHistory.find((h) => h.id === requestId);
      if (req) return req;
      throw new Error('Leave request not found');
    }
    const endpoint = `${API_ROUTES.LEAVE.HISTORY}/${requestId}`;
    const response = await apiClient.get(endpoint);
    return response?.data || response;
  },

  applyLeave: async (payload) => {
    if (!USE_REAL_EMPLOYEE_API) {
      await delay(500);
      const duration = buildDuration(payload.startDate, payload.endDate, payload.halfDay);
      const newLeave = {
        id: `leave-${Date.now()}`,
        leaveType: payload.leaveType,
        startDate: payload.startDate,
        endDate: payload.endDate,
        halfDay: payload.halfDay || false,
        reason: payload.reason,
        status: 'PENDING',
        duration,
        createdAt: new Date().toISOString(),
      };
      localLeaveHistory = [newLeave, ...localLeaveHistory];
      localLeaveBalance.pending += duration;
      localLeaveBalance.remaining -= duration;
      return newLeave;
    }

    const apiCall = async () => {
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
    if (!USE_REAL_EMPLOYEE_API) {
      await delay(400);
      const reqIndex = localLeaveHistory.findIndex((h) => h.id === requestId);
      if (reqIndex !== -1) {
        const req = localLeaveHistory[reqIndex];
        const updated = { ...req, status: 'CANCELLED' };
        localLeaveHistory[reqIndex] = updated;
        localLeaveBalance.pending = Math.max(0, localLeaveBalance.pending - req.duration);
        localLeaveBalance.remaining += req.duration;
        return updated;
      }
      throw new Error('Leave request not found');
    }

    const endpoint = `${API_ROUTES.LEAVE.CANCEL}/${requestId}`;
    const apiCall = async () => {
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
    if (!USE_REAL_EMPLOYEE_API) {
      await delay(200);
      return localLeaveTypes;
    }
    const response = await apiClient.get(API_ROUTES.LEAVE.TYPES);
    return response?.data || response;
  },

  getLeaveStatus: async () => {
    return ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];
  },
};

