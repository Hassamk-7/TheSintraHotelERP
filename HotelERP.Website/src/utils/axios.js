import axios from 'axios';
import { apiConfig, DEFAULT_HEADERS, REQUEST_TIMEOUT } from '../config/api';

// Create axios instance with configuration
const axiosInstance = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: REQUEST_TIMEOUT,
  headers: DEFAULT_HEADERS
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any custom headers or tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
