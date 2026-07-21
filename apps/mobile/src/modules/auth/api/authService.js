import axiosInstance from '@/api/axios';

const ENDPOINTS = {
  LOGIN: '/auth/login',
  REFRESH_TOKEN: '/auth/refresh',
  LOGOUT: '/auth/logout',
  VALIDATE_SESSION: '/auth/validate',
  PROFILE_BOOTSTRAP: '/auth/me',
};

export const authService = {
  login: async (identifier, password) => {
    // According to PRD, identifier can be email or phone
    const payload = { identifier, password };
    const response = await axiosInstance.post(ENDPOINTS.LOGIN, payload);
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await axiosInstance.post(ENDPOINTS.REFRESH_TOKEN, { refreshToken });
    return response.data;
  },

  logout: async () => {
    // Assuming backend invalidates token if needed
    const response = await axiosInstance.post(ENDPOINTS.LOGOUT);
    return response.data;
  },

  validateSession: async () => {
    const response = await axiosInstance.get(ENDPOINTS.VALIDATE_SESSION);
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get(ENDPOINTS.PROFILE_BOOTSTRAP);
    return response.data;
  },
};
