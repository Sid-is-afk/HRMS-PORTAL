import axios from 'axios';
import { API_BASE_URL } from '@/constants/env';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor scaffolding
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token logic here later
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors, token refresh etc.
    return Promise.reject(error);
  }
);

export default axiosInstance;
