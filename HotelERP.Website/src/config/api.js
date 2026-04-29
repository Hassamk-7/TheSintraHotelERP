// API Configuration for Customer Website
const API_CONFIG = {
  // Development API URL (local)
  development: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5146/api',
    timeout: 10000
  },
  
  // Production API URL (live server)
  production: {
    baseURL: process.env.REACT_APP_API_URL || 'https://api.thesintrahotel.com/api',
    timeout: 30000
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export current configuration
export const apiConfig = API_CONFIG[environment];

// Log the configuration for debugging
console.log('API Config:', {
  environment,
  baseURL: apiConfig.baseURL,
  NODE_ENV: process.env.NODE_ENV,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL
});

// API endpoints for customer website
export const API_ENDPOINTS = {
  // Room search and booking
  rooms: {
    search: '/rooms/search',
    available: '/rooms/available',
    details: '/rooms',
    types: '/roomtypes'
  },
  
  // Reservations
  reservations: {
    create: '/reservations',
    check: '/reservations/check-availability',
    details: '/reservations'
  },
  
  // Restaurant
  restaurant: {
    menu: '/menu',
    categories: '/menu/categories'
  },
  
  // Gallery
  gallery: {
    images: '/gallery',
    roomImages: '/roomtypes/images'
  },
  
  // Contact
  contact: {
    send: '/contact/send',
    info: '/contact/info'
  },
  
  // Payment
  payment: {
    process: '/payment/process',
    verify: '/payment/verify'
  }
};

// Default headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Request timeout
export const REQUEST_TIMEOUT = apiConfig.timeout;

export default apiConfig;
