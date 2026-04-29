import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import { 
  ChatBubbleLeftRightIcon, 
  StarIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const GuestFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      guestName: 'Ahmed Ali',
      roomNumber: '205',
      email: 'ahmed.ali@email.com',
      phone: '+92-300-1234567',
      checkInDate: '2024-01-15',
      checkOutDate: '2024-01-17',
      category: 'Room Service',
      rating: 5,
      title: 'Excellent Room Service',
      feedback: 'The room service was outstanding! Food arrived hot and fresh, and the staff was very courteous. Highly recommend the hotel restaurant.',
      dateSubmitted: '2024-01-17',
      status: 'Reviewed',
      response: 'Thank you for your wonderful feedback! We are delighted to hear about your positive experience.',
      respondedBy: 'Guest Relations Manager',
      responseDate: '2024-01-18'
    },
    {
      id: 2,
      guestName: 'Sarah Khan',
      roomNumber: '301',
      email: 'sarah.khan@email.com',
      phone: '+92-301-2345678',
      checkInDate: '2024-01-12',
      checkOutDate: '2024-01-15',
      category: 'Housekeeping',
      rating: 4,
      title: 'Clean and Comfortable',
      feedback: 'Room was very clean and comfortable. Housekeeping staff was professional and efficient. Only minor issue was late towel replacement.',
      dateSubmitted: '2024-01-15',
      status: 'Reviewed',
      response: 'Thank you for your feedback. We have addressed the towel replacement timing with our housekeeping team.',
      respondedBy: 'Housekeeping Manager',
      responseDate: '2024-01-16'
    },
    {
      id: 3,
      guestName: 'John Smith',
      roomNumber: '102',
      email: 'john.smith@email.com',
      phone: '+1-555-123-4567',
      checkInDate: '2024-01-10',
      checkOutDate: '2024-01-14',
      category: 'Front Office',
      rating: 5,
      title: 'Exceptional Service',
      feedback: 'Front desk staff was incredibly helpful and professional. Check-in and check-out process was smooth. Great hospitality!',
      dateSubmitted: '2024-01-14',
      status: 'Reviewed',
      response: 'We truly appreciate your kind words! Our front office team takes pride in providing excellent service.',
      respondedBy: 'Front Office Manager',
      responseDate: '2024-01-15'
    },
    {
      id: 4,
      guestName: 'Fatima Sheikh',
      roomNumber: '208',
      email: 'fatima.sheikh@email.com',
      phone: '+92-302-3456789',
      checkInDate: '2024-01-18',
      checkOutDate: '2024-01-20',
      category: 'Restaurant',
      rating: 3,
      title: 'Good Food, Slow Service',
      feedback: 'Food quality was good, especially the Pakistani dishes. However, service was quite slow during dinner time. Could improve timing.',
      dateSubmitted: '2024-01-20',
      status: 'Pending',
      response: '',
      respondedBy: '',
      responseDate: ''
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    rating: 'all',
    category: 'all',
    status: 'all'
  });

  const [formData, setFormData] = useState({
    guestName: '',
    roomNumber: '',
    email: '',
    phone: '',
    category: '',
    rating: 5,
    feedback: '',
    suggestions: '',
    status: 'received',
    responseRequired: false,
    anonymous: false
  });

  // Load feedbacks on component mount
  useEffect(() => {
    // API calls disabled to show mock data
    console.log('GuestFeedback component loaded with mock data:', feedbacks.length, 'feedbacks');
  }, []);

  // Fetch feedbacks - PURE API CALL
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/GuestServices/feedback');
      
      if (response.data?.success) {
        setFeedbacks(response.data.data);
      } else {
        setError('No feedback data received');
        setFeedbacks([]);
      }
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError(err.response?.data?.message || 'Failed to load feedbacks');
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.guestName.trim()) newErrors.guestName = 'Guest name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.feedback.trim()) newErrors.feedback = 'Feedback is required';
    if (formData.rating < 1 || formData.rating > 5) newErrors.rating = 'Rating must be between 1 and 5';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create/Update feedback - PURE API CALL
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const feedbackData = {
        ...formData,
        feedbackId: editingFeedback ? formData.feedbackId : `FB-${Date.now().toString().slice(-6)}`,
        submissionDate: new Date().toISOString().split('T')[0]
      };

      const response = editingFeedback 
        ? await axios.put(`/api/GuestServices/feedback/${editingFeedback.id}`, feedbackData)
        : await axios.post('/api/GuestServices/feedback', feedbackData);
      
      if (response.data?.success) {
        setSuccess(editingFeedback ? 'Feedback updated successfully' : 'Feedback submitted successfully');
        fetchFeedbacks();
        setShowAddModal(false);
        resetForm();
      } else {
        setError('Failed to save feedback');
      }
    } catch (err) {
      console.error('Error saving feedback:', err);
      setError(err.response?.data?.message || 'Failed to save feedback');
    } finally {
      setLoading(false);
    }
  };

  // Delete feedback - PURE API CALL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;

    try {
      setLoading(true);
      const response = await axios.delete(`/api/GuestServices/feedback/${id}`);
      
      if (response.data?.success) {
        setSuccess('Feedback deleted successfully');
        fetchFeedbacks();
      } else {
        setError('Failed to delete feedback');
      }
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setError(err.response?.data?.message || 'Failed to delete feedback');
    } finally {
      setLoading(false);
    }
  };

  // Update feedback status - PURE API CALL
  const updateFeedbackStatus = async (feedbackId, newStatus) => {
    try {
      const response = await axios.put(`/api/GuestServices/feedback/${feedbackId}/status`, {
        status: newStatus
      });
      
      if (response.data?.success) {
        setSuccess(`Feedback ${newStatus} successfully`);
        fetchFeedbacks();
      } else {
        setError('Failed to update feedback status');
      }
    } catch (err) {
      console.error('Error updating feedback status:', err);
      setError(err.response?.data?.message || 'Failed to update feedback status');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      guestName: '',
      roomNumber: '',
      email: '',
      phone: '',
      category: '',
      rating: 5,
      feedback: '',
      suggestions: '',
      status: 'received',
      responseRequired: false,
      anonymous: false
    });
    setEditingFeedback(null);
    setErrors({});
  };

  // Handle edit
  const handleEdit = (feedback) => {
    setFormData(feedback);
    setEditingFeedback(feedback);
    setShowAddModal(true);
  };

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.guestName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         feedback.feedback?.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesRating = filters.rating === 'all' || feedback.rating.toString() === filters.rating;
    const matchesCategory = filters.category === 'all' || feedback.category === filters.category;
    const matchesStatus = filters.status === 'all' || feedback.status === filters.status;
    return matchesSearch && matchesRating && matchesCategory && matchesStatus;
  });

  // Get rating stars
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'received': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = [
    'all', 'Room Service', 'Housekeeping', 'Front Desk', 'Restaurant', 
    'Facilities', 'Staff Behavior', 'Overall Experience', 'Other'
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Guest Feedback</h1>
                <p className="text-gray-600">Manage guest reviews and feedback</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Feedback</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search feedback..."
              />
            </div>
            <select
              value={filters.rating}
              onChange={(e) => setFilters({...filters, rating: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="received">Received</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
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

        {/* Feedbacks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading feedback...</span>
              </div>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center text-gray-500">
                <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No feedback found</p>
              </div>
            </div>
          ) : (
            filteredFeedbacks.map((feedback) => (
              <div key={feedback.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Feedback Header */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-gray-900">
                      {feedback.anonymous ? 'Anonymous Guest' : feedback.guestName}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(feedback.status)}`}>
                      {feedback.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    {!feedback.anonymous && feedback.roomNumber && (
                      <div className="flex items-center text-sm text-gray-600">
                        <UserIcon className="h-4 w-4 mr-2" />
                        Room {feedback.roomNumber}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {feedback.submissionDate}
                    </div>
                    <div className="flex items-center">
                      {renderStars(feedback.rating)}
                      <span className="ml-2 text-sm text-gray-600">({feedback.rating}/5)</span>
                    </div>
                  </div>
                </div>

                {/* Feedback Content */}
                <div className="p-4">
                  <div className="mb-3">
                    <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mb-2">
                      {feedback.category}
                    </span>
                    <p className="text-sm text-gray-700 mb-2">{feedback.feedback}</p>
                    
                    {feedback.suggestions && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 font-medium">Suggestions:</p>
                        <p className="text-sm text-gray-600">{feedback.suggestions}</p>
                      </div>
                    )}
                  </div>

                  {feedback.responseRequired && (
                    <div className="mb-3">
                      <span className="inline-flex items-center px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        <HeartIcon className="h-3 w-3 mr-1" />
                        Response Required
                      </span>
                    </div>
                  )}
                </div>

                {/* Feedback Actions */}
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex space-x-2">
                    {feedback.status === 'received' && (
                      <button
                        onClick={() => updateFeedbackStatus(feedback.id, 'in-progress')}
                        className="flex-1 bg-yellow-600 text-white py-2 px-3 rounded-lg hover:bg-yellow-700 text-sm transition-colors"
                      >
                        Start Review
                      </button>
                    )}
                    
                    {feedback.status === 'in-progress' && (
                      <button
                        onClick={() => updateFeedbackStatus(feedback.id, 'resolved')}
                        className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 text-sm transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}

                    <button
                      onClick={() => handleEdit(feedback)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(feedback.id)}
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
                  {editingFeedback ? 'Edit Feedback' : 'Add Feedback'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name *</label>
                      <input
                        type="text"
                        value={formData.guestName}
                        onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.guestName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Ahmed Hassan"
                        disabled={formData.anonymous}
                      />
                      {errors.guestName && <p className="text-red-500 text-xs mt-1">{errors.guestName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                      <input
                        type="text"
                        value={formData.roomNumber}
                        onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="201"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating *</label>
                      <select
                        value={formData.rating}
                        onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.rating ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value={5}>5 - Excellent</option>
                        <option value={4}>4 - Very Good</option>
                        <option value={3}>3 - Good</option>
                        <option value={2}>2 - Fair</option>
                        <option value={1}>1 - Poor</option>
                      </select>
                      {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Feedback *</label>
                    <textarea
                      value={formData.feedback}
                      onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                      rows="4"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.feedback ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Please share your experience..."
                    />
                    {errors.feedback && <p className="text-red-500 text-xs mt-1">{errors.feedback}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Suggestions</label>
                    <textarea
                      value={formData.suggestions}
                      onChange={(e) => setFormData({...formData, suggestions: e.target.value})}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any suggestions for improvement..."
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.responseRequired}
                        onChange={(e) => setFormData({...formData, responseRequired: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Response Required</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.anonymous}
                        onChange={(e) => setFormData({...formData, anonymous: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Anonymous</span>
                    </label>
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
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : editingFeedback ? 'Update' : 'Submit'}
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

export default GuestFeedback;
