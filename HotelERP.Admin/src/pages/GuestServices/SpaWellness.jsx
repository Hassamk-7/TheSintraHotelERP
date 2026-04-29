import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import { 
  SparklesIcon, 
  CalendarIcon, 
  ClockIcon,
  UserIcon,
  StarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const SpaWellness = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      appointmentNumber: 'SPA001',
      guestName: 'Sarah Khan',
      roomNumber: '301',
      guestPhone: '+92-301-2345678',
      serviceType: 'Full Body Massage',
      therapist: 'Ayesha Ahmed',
      appointmentDate: '2024-01-20',
      appointmentTime: '14:00',
      duration: 90,
      price: 8000,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      specialRequests: 'Aromatherapy oils, relaxing music',
      bookingDate: '2024-01-18',
      bookedBy: 'Guest Services',
      notes: 'Regular customer, prefers lavender scent'
    },
    {
      id: 2,
      appointmentNumber: 'SPA002',
      guestName: 'Fatima Sheikh',
      roomNumber: '208',
      guestPhone: '+92-302-3456789',
      serviceType: 'Facial Treatment',
      therapist: 'Zara Ali',
      appointmentDate: '2024-01-21',
      appointmentTime: '11:00',
      duration: 60,
      price: 5000,
      status: 'Confirmed',
      paymentStatus: 'Pending',
      specialRequests: 'Sensitive skin, organic products only',
      bookingDate: '2024-01-19',
      bookedBy: 'Front Desk',
      notes: 'First-time spa visitor, provide detailed consultation'
    },
    {
      id: 3,
      appointmentNumber: 'SPA003',
      guestName: 'Ahmed Ali',
      roomNumber: '205',
      guestPhone: '+92-300-1234567',
      serviceType: 'Couples Massage',
      therapist: 'Hassan & Nadia Team',
      appointmentDate: '2024-01-22',
      appointmentTime: '16:00',
      duration: 120,
      price: 15000,
      status: 'Confirmed',
      paymentStatus: 'Partial',
      specialRequests: 'Anniversary celebration, rose petals decoration',
      bookingDate: '2024-01-20',
      bookedBy: 'Concierge',
      notes: 'Special anniversary package with champagne and chocolates'
    },
    {
      id: 4,
      appointmentNumber: 'SPA004',
      guestName: 'John Smith',
      roomNumber: '102',
      guestPhone: '+1-555-123-4567',
      serviceType: 'Deep Tissue Massage',
      therapist: 'Ali Raza',
      appointmentDate: '2024-01-19',
      appointmentTime: '10:00',
      duration: 75,
      price: 6500,
      status: 'Completed',
      paymentStatus: 'Paid',
      specialRequests: 'Focus on back and shoulders, firm pressure',
      bookingDate: '2024-01-18',
      bookedBy: 'Guest Direct',
      notes: 'Business traveler, prefers morning appointments'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const [formData, setFormData] = useState({
    guestName: '',
    roomNumber: '',
    guestPhone: '',
    serviceType: '',
    serviceName: '',
    duration: '',
    appointmentDate: '',
    appointmentTime: '',
    therapist: '',
    price: '',
    specialRequests: '',
    status: 'scheduled'
  });

  // Load appointments on component mount
  useEffect(() => {
    // API calls disabled to show mock data
    console.log('SpaWellness component loaded with mock data:', appointments.length, 'appointments');
  }, []);

  // Fetch spa appointments - PURE API CALL
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/GuestServices/spa-appointments');
      
      if (response.data?.success) {
        setAppointments(response.data.data);
      } else {
        setError('No spa appointments data received');
        setAppointments([]);
      }
    } catch (err) {
      console.error('Error fetching spa appointments:', err);
      setError(err.response?.data?.message || 'Failed to load spa appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.guestName.trim()) newErrors.guestName = 'Guest name is required';
    if (!formData.serviceType) newErrors.serviceType = 'Service type is required';
    if (!formData.serviceName.trim()) newErrors.serviceName = 'Service name is required';
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Appointment date is required';
    if (!formData.appointmentTime) newErrors.appointmentTime = 'Appointment time is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create/Update appointment - PURE API CALL
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const appointmentData = {
        ...formData,
        appointmentId: editingAppointment ? formData.appointmentId : `SPA-${Date.now().toString().slice(-6)}`
      };

      const response = editingAppointment 
        ? await axios.put(`/api/GuestServices/spa-appointments/${editingAppointment.id}`, appointmentData)
        : await axios.post('/api/GuestServices/spa-appointments', appointmentData);
      
      if (response.data?.success) {
        setSuccess(editingAppointment ? 'Appointment updated successfully' : 'Appointment booked successfully');
        fetchAppointments();
        setShowAddModal(false);
        resetForm();
      } else {
        setError('Failed to save appointment');
      }
    } catch (err) {
      console.error('Error saving appointment:', err);
      setError(err.response?.data?.message || 'Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  // Delete appointment - PURE API CALL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;

    try {
      setLoading(true);
      const response = await axios.delete(`/api/GuestServices/spa-appointments/${id}`);
      
      if (response.data?.success) {
        setSuccess('Appointment deleted successfully');
        fetchAppointments();
      } else {
        setError('Failed to delete appointment');
      }
    } catch (err) {
      console.error('Error deleting appointment:', err);
      setError(err.response?.data?.message || 'Failed to delete appointment');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      guestName: '',
      roomNumber: '',
      guestPhone: '',
      serviceType: '',
      serviceName: '',
      duration: '',
      appointmentDate: '',
      appointmentTime: '',
      therapist: '',
      price: '',
      specialRequests: '',
      status: 'scheduled'
    });
    setEditingAppointment(null);
    setErrors({});
  };

  // Handle edit
  const handleEdit = (appointment) => {
    setFormData(appointment);
    setEditingAppointment(appointment);
    setShowAddModal(true);
  };

  const serviceTypes = ['Massage', 'Facial', 'Body Treatment', 'Wellness', 'Beauty'];
  const durations = ['30 minutes', '60 minutes', '90 minutes', '120 minutes'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-pink-100 p-3 rounded-lg">
                <SparklesIcon className="h-8 w-8 text-pink-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Spa & Wellness</h1>
                <p className="text-gray-600">Manage spa appointments and wellness services</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Book Appointment</span>
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

        {/* Appointments List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
              <span className="ml-2 text-gray-600">Loading appointments...</span>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <SparklesIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No spa appointments found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{appointment.serviceName}</h3>
                      <p className="text-gray-600">{appointment.guestName} - Room {appointment.roomNumber}</p>
                      <p className="text-sm text-gray-500">{appointment.appointmentDate} at {appointment.appointmentTime}</p>
                      <p className="text-sm text-gray-500">{appointment.duration} - Rs {appointment.price?.toLocaleString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(appointment)}
                        className="p-2 text-pink-600 hover:bg-pink-100 rounded"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.id)}
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
                {editingAppointment ? 'Edit Appointment' : 'Book Spa Appointment'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
                  <input
                    type="text"
                    value={formData.serviceName}
                    onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.serviceName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.serviceName && <p className="text-red-500 text-xs mt-1">{errors.serviceName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.duration ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select duration</option>
                    {durations.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                  {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.appointmentDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.appointmentDate && <p className="text-red-500 text-xs mt-1">{errors.appointmentDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <input
                    type="time"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({...formData, appointmentTime: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.appointmentTime ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.appointmentTime && <p className="text-red-500 text-xs mt-1">{errors.appointmentTime}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.price ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
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
                    className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingAppointment ? 'Update' : 'Book'}
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

export default SpaWellness;
