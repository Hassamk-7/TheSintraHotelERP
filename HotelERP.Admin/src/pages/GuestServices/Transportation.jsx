import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import { 
  TruckIcon, 
  CalendarIcon, 
  ClockIcon,
  UserIcon,
  MapPinIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const Transportation = () => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      bookingNumber: 'TRP001',
      guestName: 'Ahmed Ali',
      roomNumber: '205',
      serviceType: 'Airport Transfer',
      vehicleType: 'Sedan',
      pickupLocation: 'Hotel Lobby',
      dropoffLocation: 'Allama Iqbal International Airport',
      pickupDate: '2024-01-17',
      pickupTime: '14:00',
      returnDate: '',
      returnTime: '',
      passengers: 2,
      luggage: 'Standard',
      driverName: 'Hassan Ali',
      driverContact: '+92-300-1234567',
      vehicleNumber: 'LES-1234',
      fare: 3500,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      specialInstructions: 'Flight departure at 16:30, please arrive early',
      bookingDate: '2024-01-15',
      bookedBy: 'Front Desk'
    },
    {
      id: 2,
      bookingNumber: 'TRP002',
      guestName: 'Sarah Khan',
      roomNumber: '301',
      serviceType: 'City Tour',
      vehicleType: 'SUV',
      pickupLocation: 'Hotel Lobby',
      dropoffLocation: 'Multiple Locations',
      pickupDate: '2024-01-20',
      pickupTime: '09:00',
      returnDate: '2024-01-20',
      returnTime: '17:00',
      passengers: 4,
      luggage: 'Light',
      driverName: 'Ali Raza',
      driverContact: '+92-301-2345678',
      vehicleNumber: 'LES-5678',
      fare: 8000,
      status: 'Confirmed',
      paymentStatus: 'Pending',
      specialInstructions: 'Include Lahore Fort, Badshahi Mosque, Shalimar Gardens',
      bookingDate: '2024-01-18',
      bookedBy: 'Guest Services'
    },
    {
      id: 3,
      bookingNumber: 'TRP003',
      guestName: 'John Smith',
      roomNumber: '102',
      serviceType: 'Business Meeting',
      vehicleType: 'Executive Car',
      pickupLocation: 'Hotel Lobby',
      dropoffLocation: 'Business District, Gulberg',
      pickupDate: '2024-01-19',
      pickupTime: '10:30',
      returnDate: '2024-01-19',
      returnTime: '15:00',
      passengers: 1,
      luggage: 'Briefcase only',
      driverName: 'Muhammad Zubair',
      driverContact: '+92-302-3456789',
      vehicleNumber: 'LES-9012',
      fare: 4500,
      status: 'Completed',
      paymentStatus: 'Paid',
      specialInstructions: 'Professional attire required for driver',
      bookingDate: '2024-01-18',
      bookedBy: 'Concierge'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransport, setEditingTransport] = useState(null);

  const [formData, setFormData] = useState({
    guestName: '',
    serviceType: '',
    vehicleType: '',
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    pickupTime: '',
    passengers: '',
    driverName: '',
    vehicleNumber: '',
    fare: '',
    status: 'scheduled'
  });

  // Load transportation bookings on component mount
  useEffect(() => {
    // API calls disabled to show mock data
    console.log('Transportation component loaded with mock data:', bookings.length, 'bookings');
  }, []);

  // Fetch transportation bookings - PURE API CALL
  const fetchTransportationBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/GuestServices/transportation');
      
      if (response.data?.success) {
        setBookings(response.data.data);
      } else {
        setError('No transportation bookings data received');
        setBookings([]);
      }
    } catch (err) {
      console.error('Error fetching transportation bookings:', err);
      setError(err.response?.data?.message || 'Failed to load transportation bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.guestName.trim()) newErrors.guestName = 'Guest name is required';
    if (!formData.serviceType) newErrors.serviceType = 'Service type is required';
    if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required';
    if (!formData.pickupLocation.trim()) newErrors.pickupLocation = 'Pickup location is required';
    if (!formData.dropoffLocation.trim()) newErrors.dropoffLocation = 'Dropoff location is required';
    if (!formData.pickupDate) newErrors.pickupDate = 'Pickup date is required';
    if (!formData.pickupTime) newErrors.pickupTime = 'Pickup time is required';
    if (!formData.passengers || formData.passengers <= 0) newErrors.passengers = 'Valid passenger count is required';
    if (!formData.fare || formData.fare <= 0) newErrors.fare = 'Valid fare is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create/Update transportation booking - PURE API CALL
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const transportData = {
        ...formData,
        bookingId: editingTransport ? formData.bookingId : `TP-${Date.now().toString().slice(-6)}`
      };

      const response = editingTransport 
        ? await axios.put(`/api/GuestServices/transportation/${editingTransport.id}`, transportData)
        : await axios.post('/api/GuestServices/transportation', transportData);
      
      if (response.data?.success) {
        setSuccess(editingTransport ? 'Transportation booking updated successfully' : 'Transportation booking created successfully');
        fetchTransportationBookings();
        setShowAddModal(false);
        resetForm();
      } else {
        setError('Failed to save transportation booking');
      }
    } catch (err) {
      console.error('Error saving transportation booking:', err);
      setError(err.response?.data?.message || 'Failed to save transportation booking');
    } finally {
      setLoading(false);
    }
  };

  // Delete transportation booking - PURE API CALL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transportation booking?')) return;

    try {
      setLoading(true);
      const response = await axios.delete(`/api/GuestServices/transportation/${id}`);
      
      if (response.data?.success) {
        setSuccess('Transportation booking deleted successfully');
        fetchTransportationBookings();
      } else {
        setError('Failed to delete transportation booking');
      }
    } catch (err) {
      console.error('Error deleting transportation booking:', err);
      setError(err.response?.data?.message || 'Failed to delete transportation booking');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      guestName: '',
      serviceType: '',
      vehicleType: '',
      pickupLocation: '',
      dropoffLocation: '',
      pickupDate: '',
      pickupTime: '',
      passengers: '',
      driverName: '',
      vehicleNumber: '',
      fare: '',
      status: 'scheduled'
    });
    setEditingTransport(null);
    setErrors({});
  };

  // Handle edit
  const handleEdit = (transport) => {
    setFormData(transport);
    setEditingTransport(transport);
    setShowAddModal(true);
  };

  const serviceTypes = ['Airport Transfer', 'City Transfer', 'Sightseeing', 'Business Trip', 'Shopping'];
  const vehicleTypes = ['Sedan', 'SUV', 'Van', 'Bus', 'Luxury Car'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <TruckIcon className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Transportation</h1>
                <p className="text-gray-600">Manage transportation bookings and transfers</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Book Transport</span>
            </button>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-green-700">{success}</span>
            </div>
          </div>
        )}

        {/* Transportation Bookings List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <span className="ml-2 text-gray-600">Loading transportation bookings...</span>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <TruckIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No transportation bookings found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{booking.serviceType}</h3>
                      <p className="text-gray-600">{booking.guestName} - {booking.vehicleType}</p>
                      <p className="text-sm text-gray-500">{booking.pickupLocation} → {booking.dropoffLocation}</p>
                      <p className="text-sm text-gray-500">{booking.pickupDate} at {booking.pickupTime} - Rs {booking.fare?.toLocaleString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(booking)}
                        className="p-2 text-orange-600 hover:bg-orange-100 rounded"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingTransport ? 'Edit Transportation' : 'Book Transportation'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name *</label>
                  <input
                    type="text"
                    value={formData.guestName}
                    onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.guestName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.guestName && <p className="text-red-500 text-xs mt-1">{errors.guestName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.serviceType ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select service type</option>
                    {serviceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.serviceType && <p className="text-red-500 text-xs mt-1">{errors.serviceType}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type *</label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.vehicleType ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select vehicle type</option>
                    {vehicleTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.vehicleType && <p className="text-red-500 text-xs mt-1">{errors.vehicleType}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location *</label>
                  <input
                    type="text"
                    value={formData.pickupLocation}
                    onChange={(e) => setFormData({...formData, pickupLocation: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.pickupLocation ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.pickupLocation && <p className="text-red-500 text-xs mt-1">{errors.pickupLocation}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dropoff Location *</label>
                  <input
                    type="text"
                    value={formData.dropoffLocation}
                    onChange={(e) => setFormData({...formData, dropoffLocation: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.dropoffLocation ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.dropoffLocation && <p className="text-red-500 text-xs mt-1">{errors.dropoffLocation}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date *</label>
                  <input
                    type="date"
                    value={formData.pickupDate}
                    onChange={(e) => setFormData({...formData, pickupDate: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.pickupDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.pickupDate && <p className="text-red-500 text-xs mt-1">{errors.pickupDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time *</label>
                  <input
                    type="time"
                    value={formData.pickupTime}
                    onChange={(e) => setFormData({...formData, pickupTime: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.pickupTime ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.pickupTime && <p className="text-red-500 text-xs mt-1">{errors.pickupTime}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passengers *</label>
                  <input
                    type="number"
                    value={formData.passengers}
                    onChange={(e) => setFormData({...formData, passengers: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.passengers ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.passengers && <p className="text-red-500 text-xs mt-1">{errors.passengers}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fare (Rs) *</label>
                  <input
                    type="number"
                    value={formData.fare}
                    onChange={(e) => setFormData({...formData, fare: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.fare ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.fare && <p className="text-red-500 text-xs mt-1">{errors.fare}</p>}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingTransport ? 'Update' : 'Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transportation;
