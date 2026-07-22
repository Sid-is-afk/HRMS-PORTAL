import axiosInstance from './axios';
import { parseApiError } from '../middleware/errorParser';
import { useOfflineStore } from '@/shared/stores/offlineStore';
import { cacheManager } from '@/core/storage/cacheManager';

/**
 * Generic API Client wrapper to standardize request handling,
 * error parsing, and offline cache fallbacks across the application.
 */
export const apiClient = {
  /**
   * Generic GET request with offline cache fallback
   */
  get: async (url, config = {}) => {
    const isOnline = useOfflineStore.getState().isOnline;
    const cacheKey = `GET_${url}`;

    if (isOnline) {
      try {
        const response = await axiosInstance.get(url, config);
        // Cache the successful response
        cacheManager.write(cacheKey, response.data);
        return response.data;
      } catch (error) {
        // Fallback to cache if request fails due to network
        if (error.code === 'ECONNABORTED' || !error.response) {
          const cachedData = cacheManager.readStale(cacheKey);
          if (cachedData) {
            console.log(`[apiClient] Network failed, serving stale cache for ${url}`);
            return cachedData;
          }
        }
        throw parseApiError(error);
      }
    } else {
      // Offline: serve from cache
      const cachedData = cacheManager.readStale(cacheKey);
      if (cachedData) {
        console.log(`[apiClient] Offline, serving cache for ${url}`);
        return cachedData;
      }
      throw { code: 'OFFLINE_NO_CACHE', message: 'You are offline and no cached data is available.' };
    }
  },

  /**
   * Generic POST request (Note: Queue logic is typically handled in the module layer via executeOrQueue,
   * but we can intercept it here for total abstraction in the future)
   */
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await axiosInstance.post(url, data, config);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  /**
   * Generic PUT request
   */
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await axiosInstance.put(url, data, config);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  /**
   * Generic DELETE request
   */
  delete: async (url, config = {}) => {
    try {
      const response = await axiosInstance.delete(url, config);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }
};
