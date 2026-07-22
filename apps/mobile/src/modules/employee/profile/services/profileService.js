import { apiClient } from '@/api/client/apiClient';
import { API_ROUTES } from '@/shared/constants/apiRoutes';
import { USE_MOCK_DATA } from '@/shared/constants/env';
import { mockData } from '@/tests/mocks/mockData';
import { executeOrQueue } from '@/shared/utils/offlineUtils';
import { SYNC_EVENTS } from '@/shared/models/offlineModels';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const profileService = {
  getProfile: async () => {
    if (USE_MOCK_DATA) {
      await delay(700);
      return mockData.profile.main;
    }
    const response = await apiClient.get(API_ROUTES.PROFILE.GET);
    return response?.data || response;
  },

  updateProfile: async (payload) => {
    const apiCall = async () => {
      if (USE_MOCK_DATA) {
        await delay(600);
        return {
          success: true,
          data: payload,
        };
      }
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
    if (USE_MOCK_DATA) {
      await delay(500);
      return mockData.profile.employment;
    }
    const response = await apiClient.get(API_ROUTES.PROFILE.EMPLOYMENT);
    return response?.data || response;
  },

  getEmergencyContacts: async () => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return mockData.profile.contacts;
    }
    const response = await apiClient.get(API_ROUTES.PROFILE.EMERGENCY_CONTACTS);
    return response?.data || response;
  },

  updateEmergencyContact: async (payload) => {
    const apiCall = async () => {
      if (USE_MOCK_DATA) {
        await delay(500);
        return {
          success: true,
          data: payload,
        };
      }
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
    if (USE_MOCK_DATA) {
      await delay(500);
      return { avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' };
    }
    const response = await apiClient.post(API_ROUTES.PROFILE.AVATAR);
    return response?.data || response;
  },

  changePassword: async (payload) => {
    const apiCall = async () => {
      if (USE_MOCK_DATA) {
        await delay(500);
        return { success: true };
      }
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
    if (USE_MOCK_DATA) {
      await delay(500);
      return mockData.profile.documents;
    }
    const response = await apiClient.get(API_ROUTES.PROFILE.DOCUMENTS);
    return response?.data || response;
  },

  getAccountInfo: async () => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return mockData.profile.account;
    }
    const response = await apiClient.get(API_ROUTES.PROFILE.ACCOUNT);
    return response?.data || response;
  },
};

