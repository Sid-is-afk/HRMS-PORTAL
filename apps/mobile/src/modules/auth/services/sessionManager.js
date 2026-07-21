import axiosInstance from '@/api/axios';
import { useAuthStore } from '../store/authStore';
import { getToken } from '@/storage/authStorage';
import { authService } from '../api/authService';

export const sessionManager = {
  initialize: async () => {
    try {
      const { accessToken, refreshToken } = getToken();
      if (!accessToken) {
        useAuthStore.getState().hydrate(null, null, null);
        return false;
      }

      // If token exists, try to validate or fetch profile
      // For now we assume if token exists, user is logged in
      useAuthStore.getState().hydrate(accessToken, refreshToken, { id: 'temp' });
      return true;
    } catch {
      useAuthStore.getState().logoutAction();
      return false;
    }
  },

  setupInterceptors: () => {
    axiosInstance.interceptors.request.use(
      (config) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Handle 401 Unauthorized for token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const { refreshToken } = useAuthStore.getState();
            if (refreshToken) {
              const res = await authService.refreshToken(refreshToken);
              useAuthStore.getState().setTokens(res.accessToken, res.refreshToken);
              originalRequest.headers.Authorization = `Bearer ${res.accessToken}`;
              return axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            useAuthStore.getState().logoutAction();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }
};
