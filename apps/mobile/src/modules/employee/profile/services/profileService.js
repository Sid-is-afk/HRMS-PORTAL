import { apiClient } from '@/api/client/apiClient';
import { API_ROUTES } from '@/shared/constants/apiRoutes';
import { executeOrQueue } from '@/shared/utils/offlineUtils';
import { SYNC_EVENTS } from '@/shared/models/offlineModels';

export const profileService = {
  getProfile: async () => {
    const response = await apiClient.get(API_ROUTES.PROFILE.GET);
    return response?.data || response;
  },

  updateProfile: async (payload) => {
    const apiCall = async () => {
      return apiClient.put(API_ROUTES.PROFILE.UPDATE, payload);
    };

    const response = await executeOrQueue(
      apiCall,
      SYNC_EVENTS.PROFILE_UPDATE,
      API_ROUTES.PROFILE.UPDATE,
      'PUT',
      payload
    );

    if (response?.offline) {
      return { ...payload, offline: true };
    }
    return response?.data || response;
  },

  getEmploymentDetails: async () => {
    const response = await apiClient.get(API_ROUTES.PROFILE.EMPLOYMENT);
    return response?.data || response;
  },

  getEmergencyContacts: async () => {
    const response = await apiClient.get(API_ROUTES.PROFILE.EMERGENCY_CONTACTS);
    return response?.data || response;
  },

  updateEmergencyContact: async (payload) => {
    const apiCall = async () => {
      return apiClient.put(API_ROUTES.PROFILE.EMERGENCY_CONTACTS, payload);
    };

    const response = await executeOrQueue(
      apiCall,
      SYNC_EVENTS.PROFILE_UPDATE, // Reuse profile update sync event
      API_ROUTES.PROFILE.EMERGENCY_CONTACTS,
      'PUT',
      payload
    );

    if (response?.offline) {
      return { ...payload, offline: true };
    }
    return response?.data || response;
  },

  uploadProfileImage: async () => {
    const response = await apiClient.post(API_ROUTES.PROFILE.AVATAR);
    return response?.data || response;
  },

  changePassword: async (payload) => {
    const apiCall = async () => {
      return apiClient.post(API_ROUTES.PROFILE.CHANGE_PASSWORD, payload);
    };

    const response = await executeOrQueue(
      apiCall,
      SYNC_EVENTS.PROFILE_UPDATE, // Reuse profile update event or just call it online-only
      API_ROUTES.PROFILE.CHANGE_PASSWORD,
      'POST',
      payload
    );

    if (response?.offline) {
      return { success: false, message: 'Password change is queued. It will update when online.', offline: true };
    }
    return response?.data || response;
  },

  getDocuments: async () => {
    const response = await apiClient.get(API_ROUTES.PROFILE.DOCUMENTS);
    return response?.data || response;
  },

  getAccountInfo: async () => {
    const response = await apiClient.get(API_ROUTES.PROFILE.ACCOUNT);
    return response?.data || response;
  },
};
