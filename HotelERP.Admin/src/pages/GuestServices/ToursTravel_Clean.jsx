import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  GlobeAltIcon, 
  CalendarIcon, 
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const ToursTravel = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTour, setEditingTour] = useState(null);

  const [formData, setFormData] = useState({
    guestName: '',
    tourName: '',
    tourType: '',
    destination: '',
    tourDate: '',
    duration: '',
    groupSize: '',
    pricePerPerson: '',
    totalPrice: '',
    guide: '',
    status: 'booked'
  });

  // Load tour bookings on component mount
  useEffect(() => {
    fetchTourBookings();
  }, []);

  // Fetch tour bookings - PURE API CALL
  const fetchTourBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/GuestServices/tours-travel');
      
      if (response.data?.success) {
        setBookings(response.data.data);
      } else {
        setError('No tour bookings data received');
        setBookings([]);
      }
    } catch (err) {
      console.error('Error fetching tour bookings:', err);
      setError(err.response?.data?.message || 'Failed to load tour bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.guestName.trim()) newErrors.guestName = 'Guest name is required';
    if (!formData.tourName.trim()) newErrors.tourName = 'Tour name is required';
    if (!formData.tourType) newErrors.tourType = 'Tour type is required';
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required';
    if (!formData.tourDate) newErrors.tourDate = 'Tour date is required';
    if (!formData.groupSize || formData.groupSize <= 0) newErrors.groupSize = 'Valid group size is required';
    if (!formData.pricePerPerson || formData.pricePerPerson <= 0) newErrors.pricePerPerson = 'Valid price per person is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create/Update tour booking - PURE API CALL
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const tourData = {
        ...formData,
        bookingId: editingTour ? formData.bookingId : `TR-${Date.now().toString().slice(-6)}`,
        totalPrice: formData.pricePerPerson * formData.groupSize
      };

      const response = editingTour 
        ? await axios.put(`/api/GuestServices/tours-travel/${editingTour.id}`, tourData)
        : await axios.post('/api/GuestServices/tours-travel', tourData);
      
      if (response.data?.success) {
        setSuccess(editingTour ? 'Tour booking updated successfully' : 'Tour booking created successfully');
        fetchTourBookings();
        setShowAddModal(false);
        resetForm();
      } else {
        setError('Failed to save tour booking');
      }
    } catch (err) {
      console.error('Error saving tour booking:', err);
      setError(err.response?.data?.message || 'Failed to save tour booking');
    } finally {
      setLoading(false);
    }
  };

  // Delete tour booking - PURE API CALL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tour booking?')) return;

    try {
      setLoading(true);
      const response = await axios.delete(`/api/GuestServices/tours-travel/${id}`);
      
      if (response.data?.success) {
        setSuccess('Tour booking deleted successfully');
        fetchTourBookings();
      } else {
        setError('Failed to delete tour booking');
      }
    } catch (err) {
      console.error('Error deleting tour booking:', err);
      setError(err.response?.data?.message || 'Failed to delete tour booking');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      guestName: '',
      tourName: '',
      tourType: '',
      destination: '',
      tourDate: '',
      duration: '',
      groupSize: '',
      pricePerPerson: '',
      totalPrice: '',
      guide: '',
      status: 'booked'
    });
    setEditingTour(null);
    setErrors({});
  };

  // Handle edit
  const handleEdit = (tour) => {
    setFormData(tour);
    setEditingTour(tour);
    setShowAddModal(true);
  };

  const tourTypes = ['City Tour', 'Historical Sites', 'Adventure', 'Cultural', 'Nature', 'Religious'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <GlobeAltIcon className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tours & Travel</h1>
                <p className="text-gray-600">Manage tour bookings and travel arrangements</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Book Tour</span>
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

        {/* Tour Bookings List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-2 text-gray-600">Loading tour bookings...</span>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <GlobeAltIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No tour bookings found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{booking.tourName}</h3>
                      <p className="text-gray-600">{booking.guestName} - {booking.destination}</p>
                      <p className="text-sm text-gray-500">{booking.tourDate} - {booking.groupSize} people</p>
                      <p className="text-sm text-gray-500">Rs {booking.totalPrice?.toLocaleString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(booking)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded"
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
                {editingTour ? 'Edit Tour Booking' : 'Book Tour'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tour Name *</label>
                  <input
                    type="text"
                    value={formData.tourName}
                    onChange={(e) => setFormData({...formData, tourName: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.tourName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.tourName && <p className="text-red-500 text-xs mt-1">{errors.tourName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tour Type *</label>
                  <select
                    value={formData.tourType}
                    onChange={(e) => setFormData({...formData, tourType: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.tourType ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select tour type</option>
                    {tourTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.tourType && <p className="text-red-500 text-xs mt-1">{errors.tourType}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.destination ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tour Date *</label>
                  <input
                    type="date"
                    value={formData.tourDate}
                    onChange={(e) => setFormData({...formData, tourDate: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.tourDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.tourDate && <p className="text-red-500 text-xs mt-1">{errors.tourDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group Size *</label>
                  <input
                    type="number"
                    value={formData.groupSize}
                    onChange={(e) => setFormData({...formData, groupSize: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.groupSize ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.groupSize && <p className="text-red-500 text-xs mt-1">{errors.groupSize}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per Person (Rs) *</label>
                  <input
                    type="number"
                    value={formData.pricePerPerson}
                    onChange={(e) => setFormData({...formData, pricePerPerson: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.pricePerPerson ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.pricePerPerson && <p className="text-red-500 text-xs mt-1">{errors.pricePerPerson}</p>}
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
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingTour ? 'Update' : 'Book'}
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

export default ToursTravel;
