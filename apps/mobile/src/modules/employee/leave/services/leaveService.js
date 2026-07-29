import { apiClient } from '@/api/client/apiClient';
import { API_ROUTES } from '@/shared/constants/apiRoutes';
import { executeOrQueue } from '@/shared/utils/offlineUtils';
import { SYNC_EVENTS } from '@/shared/models/offlineModels';

const buildDuration = (startDate, endDate, halfDay) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayCount = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
  return halfDay ? 0.5 : dayCount;
};

export const leaveService = {
  getLeaveBalance: async () => {
    const response = await apiClient.get(API_ROUTES.LEAVE.BALANCE);
    return response?.data || response;
  },

  getLeaveHistory: async () => {
    const response = await apiClient.get(API_ROUTES.LEAVE.HISTORY);
    return response?.data || response;
  },

  getLeaveDetails: async (requestId) => {
    const endpoint = `${API_ROUTES.LEAVE.HISTORY}/${requestId}`;
    const response = await apiClient.get(endpoint);
    return response?.data || response;
  },

  applyLeave: async (payload) => {
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
    const response = await apiClient.get(API_ROUTES.LEAVE.TYPES);
    return response?.data || response;
  },

  getLeaveStatus: async () => {
    return ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];
  },
};
