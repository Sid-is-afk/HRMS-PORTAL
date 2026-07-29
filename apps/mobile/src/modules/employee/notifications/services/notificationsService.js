import { apiClient } from '@/api/client/apiClient';
import { API_ROUTES } from '@/shared/constants/apiRoutes';
import { executeOrQueue } from '@/shared/utils/offlineUtils';
import { SYNC_EVENTS } from '@/shared/models/offlineModels';

export const notificationsService = {
  getNotifications: async () => {
    const response = await apiClient.get(API_ROUTES.NOTIFICATIONS.LIST);
    return response?.data || response;
  },

  markAsRead: async (id) => {
    const endpoint = `${API_ROUTES.NOTIFICATIONS.MARK_READ}/${id}`;
    const apiCall = async () => {
      return apiClient.post(endpoint);
    };

    const response = await executeOrQueue(
      apiCall,
      SYNC_EVENTS.NOTIFICATION_MARK_READ,
      endpoint,
      'POST',
      { id }
    );

    if (response?.offline) {
      return { success: true, offline: true };
    }
    return response?.data || response;
  },

  markAllAsRead: async () => {
    const endpoint = `${API_ROUTES.NOTIFICATIONS.MARK_READ}/all`;
    const apiCall = async () => {
      return apiClient.post(endpoint);
    };

    const response = await executeOrQueue(
      apiCall,
      SYNC_EVENTS.NOTIFICATION_MARK_READ,
      endpoint,
      'POST',
      {}
    );

    if (response?.offline) {
      return { success: true, offline: true };
    }
    return response?.data || response;
  },
};
