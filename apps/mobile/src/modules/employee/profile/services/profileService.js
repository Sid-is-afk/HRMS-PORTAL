import { apiClient } from '@/api/client/apiClient';
import { API_ROUTES } from '@/shared/constants/apiRoutes';
import { executeOrQueue } from '@/shared/utils/offlineUtils';
import { SYNC_EVENTS } from '@/shared/models/offlineModels';
import { USE_REAL_EMPLOYEE_API } from '@/shared/constants/env';
import { mockData } from '@/tests/mocks/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let localProfile = { ...mockData.profile.main };
let localEmployment = { ...mockData.profile.employment };
let localContacts = [...mockData.profile.contacts];
let localDocuments = [...mockData.profile.documents];
let localAccount = { ...mockData.profile.account };

export const profileService = {
  getProfile: async () => {
    if (!USE_REAL_EMPLOYEE_API) {
      await delay(300);
      return localProfile;
    }
    const response = await apiClient.get(API_ROUTES.PROFILE.GET);
    return response?.data || response;
  },

  updateProfile: async (payload) => {
    if (!USE_REAL_EMPLOYEE_API) {
      await delay(400);
      localProfile = { ...localProfile, ...payload };
      return localProfile;
    }

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
    if (!USE_REAL_EMPLOYEE_API) {
      await delay(200);
      return localEmployment;
    }
    const response = await apiClient.get(API_ROUTES.PROFILE.EMPLOYMENT);
    return response?.data || response;
  },

  getEmergencyContacts: async () => {
    if (!USE_REAL_EMPLOYEE_API) {
      await delay(200);
      return localContacts;
    }
    const response = await apiClient.get(API_ROUTES.PROFILE.EMERGENCY_CONTACTS);
    return response?.data || response;
  },

  updateEmergencyContact: async (payload) => {
    if (!USE_REAL_EMPLOYEE_API) {
      await delay(300);
      localContacts = [payload];
      return localContacts;
    }

    const apiCall = async () => {
      return apiClient.put(API_ROUTES.PROFILE.EMERGENCY_CONTACTS, payload);
    };

    const response = await executeOrQueue(
      apiCall,
      SYNC_EVENTS.PROFILE_UPDATE,
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
    if (!USE_REAL_EMPLOYEE_API) {
      await delay(400);
      localProfile.avatarUrl = 'https://avatar.iran.liara.run/public/1';
      return { avatarUrl: localProfile.avatarUrl };
    }
    const response = await apiClient.post(API_ROUTES.PROFILE.AVATAR);
    return response?.data || response;
  },

  changePassword: async (payload) => {
    if (!USE_REAL_EMPLOYEE_API) {
      await delay(300);
      return { success: true, message: 'Password changed successfully.' };
    }

    const apiCall = async () => {
      return apiClient.post(API_ROUTES.PROFILE.CHANGE_PASSWORD, payload);
    };

    const response = await executeOrQueue(
      apiCall,
      SYNC_EVENTS.PROFILE_UPDATE,
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
    if (!USE_REAL_EMPLOYEE_API) {
      await delay(300);
      return localDocuments;
    }
    const response = await apiClient.get(API_ROUTES.PROFILE.DOCUMENTS);
    return response?.data || response;
  },

  getAccountInfo: async () => {
    if (!USE_REAL_EMPLOYEE_API) {
      await delay(200);
      return localAccount;
    }
    const response = await apiClient.get(API_ROUTES.PROFILE.ACCOUNT);
    return response?.data || response;
  },
};

