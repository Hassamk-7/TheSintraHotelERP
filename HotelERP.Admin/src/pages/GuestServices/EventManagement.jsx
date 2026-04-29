import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import { 
  CalendarDaysIcon, 
  CalendarIcon, 
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const EventManagement = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      eventName: 'Corporate Annual Conference',
      eventType: 'Conference',
      clientName: 'Tech Solutions Ltd',
      clientContact: '+92-300-1234567',
      clientEmail: 'events@techsolutions.pk',
      eventDate: '2024-01-25',
      startTime: '09:00',
      endTime: '17:00',
      venue: 'Grand Ballroom',
      expectedGuests: 150,
      actualGuests: 145,
      eventStatus: 'Confirmed',
      totalCost: 250000,
      advancePaid: 100000,
      balance: 150000,
      services: ['Audio/Visual', 'Catering', 'Decoration', 'Photography'],
      specialRequests: 'Vegetarian menu, Stage setup for presentations',
      eventManager: 'Sarah Ahmed',
      notes: 'High-profile corporate event, VIP treatment required'
    },
    {
      id: 2,
      eventName: 'Wedding Reception',
      eventType: 'Wedding',
      clientName: 'Ahmed & Fatima',
      clientContact: '+92-301-2345678',
      clientEmail: 'ahmed.fatima@email.com',
      eventDate: '2024-01-28',
      startTime: '19:00',
      endTime: '23:00',
      venue: 'Garden Pavilion',
      expectedGuests: 200,
      actualGuests: 0,
      eventStatus: 'Confirmed',
      totalCost: 400000,
      advancePaid: 200000,
      balance: 200000,
      services: ['Catering', 'Decoration', 'Music', 'Photography', 'Flowers'],
      specialRequests: 'Traditional Pakistani setup, Halal menu only',
      eventManager: 'Ali Hassan',
      notes: 'Premium wedding package with full decoration'
    },
    {
      id: 3,
      eventName: 'Birthday Celebration',
      eventType: 'Birthday',
      clientName: 'Khan Family',
      clientContact: '+92-302-3456789',
      clientEmail: 'khan.family@email.com',
      eventDate: '2024-01-22',
      startTime: '18:00',
      endTime: '22:00',
      venue: 'Rooftop Terrace',
      expectedGuests: 50,
      actualGuests: 48,
      eventStatus: 'Completed',
      totalCost: 80000,
      advancePaid: 80000,
      balance: 0,
      services: ['Catering', 'Decoration', 'Music'],
      specialRequests: 'Kids-friendly setup, Birthday cake arrangement',
      eventManager: 'Zara Sheikh',
      notes: 'Family celebration, casual atmosphere'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [formData, setFormData] = useState({
    eventName: '',
    eventType: '',
    clientName: '',
    clientPhone: '',
    eventDate: '',
    venue: '',
    guestCount: '',
    budget: '',
    status: 'planning',
    assignedManager: ''
  });

  // Load events on component mount
  useEffect(() => {
    // API calls disabled to show mock data
    console.log('EventManagement component loaded with mock data:', events.length, 'events');
  }, []);

  // Fetch events - PURE API CALL
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/GuestServices/events');
      
      if (response.data?.success) {
        setEvents(response.data.data);
      } else {
        setError('No events data received');
        setEvents([]);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.response?.data?.message || 'Failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.eventName.trim()) newErrors.eventName = 'Event name is required';
    if (!formData.eventType) newErrors.eventType = 'Event type is required';
    if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required';
    if (!formData.guestCount || formData.guestCount <= 0) newErrors.guestCount = 'Valid guest count is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create/Update event - PURE API CALL
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const eventData = {
        ...formData,
        eventId: editingEvent ? formData.eventId : `EV-${Date.now().toString().slice(-6)}`
      };

      const response = editingEvent 
        ? await axios.put(`/api/GuestServices/events/${editingEvent.id}`, eventData)
        : await axios.post('/api/GuestServices/events', eventData);
      
      if (response.data?.success) {
        setSuccess(editingEvent ? 'Event updated successfully' : 'Event created successfully');
        fetchEvents();
        setShowAddModal(false);
        resetForm();
      } else {
        setError('Failed to save event');
      }
    } catch (err) {
      console.error('Error saving event:', err);
      setError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  // Delete event - PURE API CALL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      setLoading(true);
      const response = await axios.delete(`/api/GuestServices/events/${id}`);
      
      if (response.data?.success) {
        setSuccess('Event deleted successfully');
        fetchEvents();
      } else {
        setError('Failed to delete event');
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err.response?.data?.message || 'Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      eventName: '',
      eventType: '',
      clientName: '',
      clientPhone: '',
      eventDate: '',
      venue: '',
      guestCount: '',
      budget: '',
      status: 'planning',
      assignedManager: ''
    });
    setEditingEvent(null);
    setErrors({});
  };

  // Handle edit
  const handleEdit = (event) => {
    setFormData(event);
    setEditingEvent(event);
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <CalendarDaysIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
                <p className="text-gray-600">Plan and manage hotel events</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>New Event</span>
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

        {/* Events List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-gray-600">Loading events...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CalendarDaysIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No events found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{event.eventName}</h3>
                      <p className="text-gray-600">{event.clientName} - {event.eventDate}</p>
                      <p className="text-sm text-gray-500">{event.venue} - {event.guestCount} guests</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="p-2 text-purple-600 hover:bg-purple-100 rounded"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
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
                {editingEvent ? 'Edit Event' : 'New Event'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
                  <input
                    type="text"
                    value={formData.eventName}
                    onChange={(e) => setFormData({...formData, eventName: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.eventName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.eventName && <p className="text-red-500 text-xs mt-1">{errors.eventName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type *</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.eventType ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select type</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Conference">Conference</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.eventType && <p className="text-red-500 text-xs mt-1">{errors.eventType}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.clientName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.eventDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.eventDate && <p className="text-red-500 text-xs mt-1">{errors.eventDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue *</label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({...formData, venue: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.venue ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.venue && <p className="text-red-500 text-xs mt-1">{errors.venue}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guest Count *</label>
                  <input
                    type="number"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({...formData, guestCount: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.guestCount ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.guestCount && <p className="text-red-500 text-xs mt-1">{errors.guestCount}</p>}
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
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingEvent ? 'Update' : 'Create'}
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

export default EventManagement;
