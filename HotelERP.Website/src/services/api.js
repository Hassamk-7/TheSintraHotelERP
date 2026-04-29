import axios from 'axios';
import { apiConfig } from '../config/api';

export const API_BASE_URL = apiConfig.baseURL;

// Hardcoded image base URL
export const IMAGE_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hotels API
export const getHotels = async () => {
  try {
    const response = await api.get('/CustomerWebsite/hotels');
    return response.data;
  } catch (error) {
    console.error('Error fetching hotels:', error);
    throw error;
  }
};

// Room Types API
export const getRoomTypes = async () => {
  try {
    const response = await api.get('/CustomerWebsite/room-types');
    return response.data;
  } catch (error) {
    console.error('Error fetching room types:', error);
    throw error;
  }
};

// Room Types API (RoomsManagement) - used by Reservation page for admin-driven room types
export const getRoomTypesRoomsManagement = async () => {
  try {
    const response = await api.get('/RoomsManagement/room-types');
    return response.data;
  } catch (error) {
    console.error('Error fetching room types (RoomsManagement):', error);
    throw error;
  }
};

// Room Rates API - Get pricing and rate details
export const getRoomRates = async () => {
  try {
    const response = await api.get('/RoomsManagement/room-rates');
    return response.data;
  } catch (error) {
    console.error('Error fetching room rates:', error);
    throw error;
  }
};

// Get Room Rates by Room Type
export const getRoomRatesByType = async (roomTypeName) => {
  try {
    const response = await api.get(`/RoomsManagement/room-rates?roomType=${roomTypeName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching room rates by type:', error);
    throw error;
  }
};

// Room Amenities API - filter by room type
export const getRoomAmenitiesByRoomTypeId = async (roomTypeId) => {
  try {
    const response = await api.get(`/RoomsManagement/room-amenities?roomTypeId=${roomTypeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching room amenities:', error);
    throw error;
  }
};

// Room Tax API - filter by room type
export const getRoomTaxesByRoomTypeId = async (roomTypeId) => {
  try {
    const response = await api.get(`/RoomTax/roomtype/${roomTypeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching room taxes:', error);
    throw error;
  }
};

// Search Rooms API
export const searchRooms = async (searchParams) => {
  try {
    const response = await api.post('/CustomerWebsite/search-rooms', searchParams);
    return response.data;
  } catch (error) {
    console.error('Error searching rooms:', error);
    throw error;
  }
};

// Get Room Type Detail
export const getRoomTypeDetail = async (id) => {
  try {
    const response = await api.get(`/CustomerWebsite/room-type/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching room type detail:', error);
    throw error;
  }
};

// Check Availability
export const checkAvailability = async (availabilityParams) => {
  try {
    const response = await api.post('/CustomerWebsite/check-availability', availabilityParams);
    return response.data;
  } catch (error) {
    console.error('Error checking availability:', error);
    throw error;
  }
};

// Rate Plans (Policies) API
export const getApplicablePlans = async ({ hotelId, roomTypeId, checkInDate, checkOutDate }) => {
  try {
    const query = new URLSearchParams({
      hotelId: String(hotelId),
      roomTypeId: String(roomTypeId),
    });

    if (checkInDate) {
      query.set('checkInDate', checkInDate);
    }

    if (checkOutDate) {
      query.set('checkOutDate', checkOutDate);
    }

    const response = await api.get(`/Plans/applicable?${query.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching applicable plans:', error);
    throw error;
  }
};

// Create Reservation
export const createReservation = async (reservationData) => {
  try {
    const response = await api.post('/CustomerReservation/create', reservationData);
    return response.data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    const responseData = error?.response?.data;
    const message =
      (typeof responseData === 'string' && responseData) ||
      responseData?.message ||
      responseData?.title ||
      (responseData?.errors ? Object.values(responseData.errors).flat().join(' ') : '') ||
      error?.message ||
      'Failed to create reservation';

    throw new Error(message);
  }
};

// Get Reservation by Number
export const getReservation = async (reservationNumber) => {
  try {
    const response = await api.get(`/CustomerReservation/${reservationNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reservation:', error);
    throw error;
  }
};

// Helper function to get full image URL
export const getImageUrl = (imagePath, folder = '') => {
  if (!imagePath) return `${IMAGE_BASE_URL}/uploads/default-image.jpg`;
  if (imagePath.startsWith('http')) return imagePath;
  
  // If path starts with / (absolute path from server root), use it as is
  if (imagePath.startsWith('/')) {
    const fullUrl = `${IMAGE_BASE_URL}${imagePath}`;
    console.log('[getImageUrl] Absolute path', { imagePath, IMAGE_BASE_URL, fullUrl });
    return fullUrl;
  }
  
  // If folder is provided, construct path with folder
  if (folder) {
    const fullUrl = `${IMAGE_BASE_URL}/uploads/${folder}/${imagePath}`;
    console.log('[getImageUrl] Using folder', { imagePath, folder, IMAGE_BASE_URL, fullUrl });
    return fullUrl;
  }
  
  // Default: treat as relative path
  const fullUrl = `${IMAGE_BASE_URL}/${imagePath}`;
  console.log('[getImageUrl] Relative path', { imagePath, IMAGE_BASE_URL, fullUrl });
  return fullUrl;
};

export default api;
