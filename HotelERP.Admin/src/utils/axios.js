import axios from 'axios';
import { apiConfig, DEFAULT_HEADERS, REQUEST_TIMEOUT } from '../config/api.js';

// Create axios instance with production configuration
const axiosInstance = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: REQUEST_TIMEOUT,
  headers: DEFAULT_HEADERS
});

const isAuthRouteRequest = (url = '') => {
  const normalizedUrl = String(url || '').toLowerCase()
  return normalizedUrl.includes('/auth/login') ||
    normalizedUrl.includes('/auth/me') ||
    normalizedUrl.includes('/auth/logout') ||
    normalizedUrl.includes('/auth/refresh-token')
}

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If sending FormData, let the browser set the correct multipart boundary.
    // Our axios instance defaults Content-Type to application/json, which breaks file uploads.
    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
    if (isFormData) {
      if (config.headers) {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
      }
    }
    
    // Log request in development
    if (import.meta.env.MODE === 'development') {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        data: config.data
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.MODE === 'development') {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
    }
    
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const token = localStorage.getItem('token');
      const isMockToken = token && token.startsWith('mock-jwt-token');
      
      switch (status) {
        case 401:
          if (!isMockToken && !isAuthRouteRequest(error.config?.url)) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/admin/login';
          }
          break;
          
        case 403:
          console.error('❌ Forbidden: Insufficient permissions');
          break;
          
        case 404:
          console.error('❌ Not Found: Resource not found');
          break;
          
        case 500:
          console.error('❌ Server Error: Internal server error');
          break;
          
        default:
          console.error(`❌ Error ${status}:`, data?.message || error.message);
      }
    } else if (error.request) {
      // Network error
      console.error('❌ Network Error: Unable to connect to server');
    } else {
      // Other error
      console.error('❌ Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
