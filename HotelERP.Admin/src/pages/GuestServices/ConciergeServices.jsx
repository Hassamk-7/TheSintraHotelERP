import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  ClockIcon,
  PhoneIcon,
  StarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const ConciergeServices = () => {
  const [services, setServices] = useState([
    {
      id: 1,
      serviceNumber: 'CON001',
      guestName: 'Ahmed Ali',
      roomNumber: '205',
      guestPhone: '+92-300-1234567',
      serviceType: 'Restaurant Reservation',
      category: 'Dining',
      description: 'Reservation for 4 people at Lahore Fort Restaurant for anniversary dinner',
      requestDate: '2024-01-18',
      requestTime: '10:30',
      preferredDate: '2024-01-20',
      preferredTime: '19:00',
      status: 'Confirmed',
      priority: 'High',
      assignedTo: 'Sarah Ahmed',
      estimatedCost: 8000,
      actualCost: 7500,
      notes: 'Special anniversary setup requested with flowers and cake',
      completionDate: '2024-01-20',
      guestRating: 5,
      guestFeedback: 'Excellent service! Perfect anniversary celebration.'
    },
    {
      id: 2,
      serviceNumber: 'CON002',
      guestName: 'John Smith',
      roomNumber: '102',
      guestPhone: '+1-555-123-4567',
      serviceType: 'City Tour Booking',
      category: 'Tourism',
      description: 'Full day Lahore heritage tour with English-speaking guide',
      requestDate: '2024-01-19',
      requestTime: '14:15',
      preferredDate: '2024-01-21',
      preferredTime: '09:00',
      status: 'Confirmed',
      priority: 'Medium',
      assignedTo: 'Ali Hassan',
      estimatedCost: 5000,
      actualCost: 5000,
      notes: 'Tourist from USA, interested in Mughal architecture',
      completionDate: '',
      guestRating: 0,
      guestFeedback: ''
    },
    {
      id: 3,
      serviceNumber: 'CON003',
      guestName: 'Fatima Sheikh',
      roomNumber: '208',
      guestPhone: '+92-302-3456789',
      serviceType: 'Shopping Assistance',
      category: 'Shopping',
      description: 'Personal shopping guide for traditional Pakistani clothing and jewelry',
      requestDate: '2024-01-20',
      requestTime: '11:00',
      preferredDate: '2024-01-22',
      preferredTime: '15:00',
      status: 'In Progress',
      priority: 'Medium',
      assignedTo: 'Zara Ali',
      estimatedCost: 2000,
      actualCost: 0,
      notes: 'Looking for wedding shopping, budget around Rs. 50,000',
      completionDate: '',
      guestRating: 0,
      guestFeedback: ''
    },
    {
      id: 4,
      serviceNumber: 'CON004',
      guestName: 'Sarah Khan',
      roomNumber: '301',
      guestPhone: '+92-301-2345678',
      serviceType: 'Medical Assistance',
      category: 'Healthcare',
      description: 'Arrange doctor consultation for minor illness',
      requestDate: '2024-01-21',
      requestTime: '08:30',
      preferredDate: '2024-01-21',
      preferredTime: '10:00',
      status: 'Completed',
      priority: 'Urgent',
      assignedTo: 'Hassan Ali',
      estimatedCost: 3000,
      actualCost: 2500,
      notes: 'Guest had fever, doctor visited room, prescribed medication',
      completionDate: '2024-01-21',
      guestRating: 4,
      guestFeedback: 'Quick response, professional doctor. Thank you!'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: 'all',
    category: 'all'
  });

  const [formData, setFormData] = useState({
    guestName: '',
    roomNumber: '',
    serviceType: '',
    category: '',
    description: '',
    requestDate: '',
    priority: 'medium',
    assignedTo: '',
    status: 'pending',
    estimatedCost: '',
    notes: ''
  });

  // Load services on component mount
  useEffect(() => {
    // API calls disabled to show mock data
    console.log('ConciergeServices component loaded with mock data:', services.length, 'services');
  }, []);

  // Fetch concierge services - PURE API CALL
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/GuestServices/concierge-services');
      
      if (response.data?.success) {
        setServices(response.data.data);
      } else {
        setError('No concierge services data received');
        setServices([]);
      }
    } catch (err) {
      console.error('Error fetching concierge services:', err);
      setError(err.response?.data?.message || 'Failed to load concierge services');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.guestName.trim()) newErrors.guestName = 'Guest name is required';
    if (!formData.roomNumber.trim()) newErrors.roomNumber = 'Room number is required';
    if (!formData.serviceType.trim()) newErrors.serviceType = 'Service type is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.requestDate) newErrors.requestDate = 'Request date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create/Update service - PURE API CALL
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const serviceData = {
        ...formData,
        serviceId: editingService ? formData.serviceId : `CS-${Date.now().toString().slice(-6)}`
      };

      const response = editingService 
        ? await axios.put(`/api/GuestServices/concierge-services/${editingService.id}`, serviceData)
        : await axios.post('/api/GuestServices/concierge-services', serviceData);
      
      if (response.data?.success) {
        setSuccess(editingService ? 'Service updated successfully' : 'Service created successfully');
        fetchServices(); // Refresh data
        setShowAddModal(false);
        resetForm();
      } else {
        setError('Failed to save service');
      }
    } catch (err) {
      console.error('Error saving service:', err);
      setError(err.response?.data?.message || 'Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  // Delete service - PURE API CALL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      setLoading(true);
      const response = await axios.delete(`/api/GuestServices/concierge-services/${id}`);
      
      if (response.data?.success) {
        setSuccess('Service deleted successfully');
        fetchServices(); // Refresh data
      } else {
        setError('Failed to delete service');
      }
    } catch (err) {
      console.error('Error deleting service:', err);
      setError(err.response?.data?.message || 'Failed to delete service');
    } finally {
      setLoading(false);
    }
  };

  // Update service status - PURE API CALL
  const updateServiceStatus = async (serviceId, newStatus) => {
    try {
      const response = await axios.put(`/api/GuestServices/concierge-services/${serviceId}/status`, {
        status: newStatus
      });
      
      if (response.data?.success) {
        setSuccess(`Service ${newStatus} successfully`);
        fetchServices(); // Refresh data
      } else {
        setError('Failed to update service status');
      }
    } catch (err) {
      console.error('Error updating service status:', err);
      setError(err.response?.data?.message || 'Failed to update service status');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      guestName: '',
      roomNumber: '',
      serviceType: '',
      category: '',
      description: '',
      requestDate: '',
      priority: 'medium',
      assignedTo: '',
      status: 'pending',
      estimatedCost: '',
      notes: ''
    });
    setEditingService(null);
    setErrors({});
  };

  // Handle edit
  const handleEdit = (service) => {
    setFormData(service);
    setEditingService(service);
    setShowAddModal(true);
  };

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.guestName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         service.serviceType?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         service.roomNumber?.includes(filters.searchTerm);
    const matchesStatus = filters.status === 'all' || service.status === filters.status;
    const matchesCategory = filters.category === 'all' || service.category === filters.category;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = ['all', 'Dining', 'Transportation', 'Tourism', 'Entertainment', 'Shopping', 'Business', 'Other'];
  const serviceTypes = [
    'Restaurant Reservation', 'Airport Transfer', 'Tour Booking', 'Ticket Booking', 
    'Shopping Assistance', 'Business Services', 'Translation Services', 'Medical Assistance'
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <UserGroupIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Concierge Services</h1>
                <p className="text-gray-600">Manage guest service requests and assistance</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center space-x-2 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>New Service Request</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Search services..."
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="ml-2 text-gray-600">Loading services...</span>
              </div>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center text-gray-500">
                <UserGroupIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No concierge services found</p>
              </div>
            </div>
          ) : (
            filteredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Service Header */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{service.serviceId}</h3>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(service.priority)}`}>
                        {service.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                        {service.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <UserGroupIcon className="h-4 w-4 mr-2" />
                      {service.guestName} - Room {service.roomNumber}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {service.requestDate}
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="p-4">
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900 mb-1">{service.serviceType}</h4>
                    <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                    <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {service.category}
                    </span>
                  </div>

                  {service.assignedTo && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">
                        <strong>Assigned to:</strong> {service.assignedTo}
                      </p>
                    </div>
                  )}

                  {service.estimatedCost > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">
                        <strong>Estimated Cost:</strong> Rs {service.estimatedCost?.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {service.notes && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">
                        <strong>Notes:</strong> {service.notes}
                      </p>
                    </div>
                  )}

                  {service.rating > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">Rating:</span>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < service.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      {service.feedback && (
                        <p className="text-sm text-gray-600 mt-1 italic">"{service.feedback}"</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Service Actions */}
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex space-x-2">
                    {service.status === 'pending' && (
                      <button
                        onClick={() => updateServiceStatus(service.id, 'in-progress')}
                        className="flex-1 bg-yellow-600 text-white py-2 px-3 rounded-lg hover:bg-yellow-700 text-sm transition-colors"
                      >
                        Start Service
                      </button>
                    )}
                    
                    {service.status === 'in-progress' && (
                      <button
                        onClick={() => updateServiceStatus(service.id, 'completed')}
                        className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 text-sm transition-colors"
                      >
                        Complete
                      </button>
                    )}

                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingService ? 'Edit Service Request' : 'New Service Request'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name *</label>
                      <input
                        type="text"
                        value={formData.guestName}
                        onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          errors.guestName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Ahmed Hassan"
                      />
                      {errors.guestName && <p className="text-red-500 text-xs mt-1">{errors.guestName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
                      <input
                        type="text"
                        value={formData.roomNumber}
                        onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          errors.roomNumber ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="201"
                      />
                      {errors.roomNumber && <p className="text-red-500 text-xs mt-1">{errors.roomNumber}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          errors.category ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select category</option>
                        {categories.filter(cat => cat !== 'all').map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows="3"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Detailed description of the service request..."
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Request Date *</label>
                      <input
                        type="date"
                        value={formData.requestDate}
                        onChange={(e) => setFormData({...formData, requestDate: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          errors.requestDate ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.requestDate && <p className="text-red-500 text-xs mt-1">{errors.requestDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost (Rs)</label>
                      <input
                        type="number"
                        value={formData.estimatedCost}
                        onChange={(e) => setFormData({...formData, estimatedCost: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="2500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                      <input
                        type="text"
                        value={formData.assignedTo}
                        onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Staff member name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Additional notes or special instructions..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : editingService ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConciergeServices;
