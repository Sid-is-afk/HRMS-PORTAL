import axios from 'axios';
import { API_BASE_URL } from '@/constants/env';
import { logger } from '@/utils/logger';

const DEFAULT_TIMEOUT = 10000;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

const requestInterceptor = (config) => {
  const normalizedConfig = { ...config };
  if (!normalizedConfig.timeout) {
    normalizedConfig.timeout = DEFAULT_TIMEOUT;
  }
  return normalizedConfig;
};

const responseErrorInterceptor = (error) => {
  if (error?.config?.url) {
    logger.warn('API request failed', error.config.url, error.message);
  }
  return Promise.reject(error);
};

axiosInstance.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error));
axiosInstance.interceptors.response.use((response) => response, responseErrorInterceptor);

export default axiosInstance;
