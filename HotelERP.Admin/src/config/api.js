// API Configuration for Hotel ERP
const API_CONFIG = {
  // Development API URL (local)
  development: {
    baseURL: 'http://localhost:5146/api',
    timeout: 10000
  },
  
  // Production API URL (live server)
  production: {
    baseURL: 'https://api.thesintrahotel.com/api',
    timeout: 30000
  }
};

// Get current environment - Use actual environment for local development
// import.meta.env.PROD is true in production builds
const environment = import.meta.env.PROD ? 'production' : 'development';

console.log('[API Config] Environment:', environment, 'Mode:', import.meta.env.MODE);

// Export current configuration
export const apiConfig = API_CONFIG[environment];

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh-token'
  },
  
  // Front Office
  checkins: '/checkins',
  checkouts: '/checkouts',
  reservations: '/reservations',
  guests: '/guests',
  
  // Rooms
  rooms: '/rooms',
  roomTypes: '/roomtypes',
  
  // Restaurant
  menu: '/menu',
  orders: '/orders',
  tables: '/tables',
  
  // Reports
  reports: {
    checkin: '/reports/checkin',
    checkout: '/reports/checkout',
    revenue: '/reports/revenue',
    occupancy: '/reports/occupancy'
  },
  
  // Master Data
  master: {
    hotels: '/master/hotels',
    currencies: '/master/currencies',
    suppliers: '/master/suppliers'
  },
  
  // HR & Payroll
  employees: '/employees',
  attendance: '/attendance',
  payroll: '/payroll',
  
  // Inventory
  inventory: '/inventory',
  suppliers: '/suppliers',
  
  // Health Check
  health: '/health'
};

// Default headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Request timeout
export const REQUEST_TIMEOUT = apiConfig.timeout;

// Export API_BASE_URL for backward compatibility
export const API_BASE_URL = apiConfig.baseURL;

// Get base URL without /api suffix for image paths
export const getImageBaseUrl = () => {
  return apiConfig.baseURL.replace('/api', '');
};

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    console.warn('[getImageUrl] No image path provided');
    return null; // Return null instead of placeholder
  }
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;

  let normalized = String(imagePath).trim();

  // Handle malformed absolute URLs sometimes stored as `https:/domain/...` (single slash)
  // which the browser treats as a relative URL under the current route (e.g. /admin/https:/...)
  normalized = normalized.replace(/^https?:\/(?!\/)/, (m) => m.replace(':/', '://'));

  // Handle cases like `/https://domain/...`
  if (normalized.startsWith('/https://')) normalized = normalized.slice(1);
  if (normalized.startsWith('/http://')) normalized = normalized.slice(1);

  // If it became a valid absolute URL, return it
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) return normalized;

  // Some APIs/DB values may include server-side physical folder prefix
  // e.g. /wwwroot/uploads/restaurant/xyz.jpg
  if (normalized.startsWith('/wwwroot/')) normalized = normalized.replace('/wwwroot', '');
  if (normalized.startsWith('wwwroot/')) normalized = normalized.replace('wwwroot', '');

  // Some values may incorrectly include /api prefix in the stored path
  if (normalized.startsWith('/api/')) normalized = normalized.replace('/api', '');
  if (normalized.startsWith('api/')) normalized = normalized.replace('api', '');

  // Ensure leading slash for consistent URL construction
  if (!normalized.startsWith('/')) normalized = `/${normalized}`;
  
  // Get base URL (e.g., https://api.thesintrahotel.com)
  const baseUrl = getImageBaseUrl();
  
  // Construct full URL
  const fullUrl = `${baseUrl}${normalized}`;
  
  console.log('[getImageUrl] Constructed URL:', { imagePath, normalized, baseUrl, fullUrl });
  return fullUrl;
};

export default apiConfig;
