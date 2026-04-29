import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import { 
  GlobeAltIcon, 
  CalendarIcon, 
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  StarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const ToursTravel = () => {
  const [tours, setTours] = useState([
    {
      id: 1,
      title: 'Lahore Heritage Tour',
      description: 'Explore the rich history of Lahore including Badshahi Mosque, Lahore Fort, and Shalimar Gardens',
      tourType: 'Cultural',
      duration: '8 hours',
      maxParticipants: 15,
      price: 5000,
      includes: 'Transportation, Guide, Lunch, Entry Tickets',
      excludes: 'Personal expenses, Tips',
      startTime: '09:00',
      endTime: '17:00',
      meetingPoint: 'Hotel Lobby',
      difficulty: 'Easy',
      language: 'English, Urdu',
      status: 'Active',
      rating: 4.8,
      totalBookings: 45,
      availableDates: ['2024-01-20', '2024-01-22', '2024-01-25'],
      images: ['/tour-lahore-1.jpg', '/tour-lahore-2.jpg'],
      guide: 'Hassan Ali',
      contactNumber: '+92-300-1234567'
    },
    {
      id: 2,
      title: 'Murree Hill Station Adventure',
      description: 'Day trip to beautiful Murree hills with scenic views, chairlift rides, and local shopping',
      tourType: 'Adventure',
      duration: '12 hours',
      maxParticipants: 20,
      price: 8000,
      includes: 'Transportation, Guide, Breakfast, Chairlift tickets',
      excludes: 'Lunch, Personal shopping, Tips',
      startTime: '06:00',
      endTime: '18:00',
      meetingPoint: 'Hotel Lobby',
      difficulty: 'Moderate',
      language: 'English, Urdu',
      status: 'Active',
      rating: 4.6,
      totalBookings: 32,
      availableDates: ['2024-01-21', '2024-01-23', '2024-01-26'],
      images: ['/tour-murree-1.jpg', '/tour-murree-2.jpg'],
      guide: 'Fatima Sheikh',
      contactNumber: '+92-301-2345678'
    },
    {
      id: 3,
      title: 'Islamabad City Tour',
      description: 'Modern capital city tour including Faisal Mosque, Pakistan Monument, and Daman-e-Koh',
      tourType: 'Sightseeing',
      duration: '6 hours',
      maxParticipants: 12,
      price: 4000,
      includes: 'Transportation, Guide, Refreshments',
      excludes: 'Meals, Personal expenses',
      startTime: '10:00',
      endTime: '16:00',
      meetingPoint: 'Hotel Lobby',
      difficulty: 'Easy',
      language: 'English, Urdu',
      status: 'Active',
      rating: 4.7,
      totalBookings: 28,
      availableDates: ['2024-01-19', '2024-01-24', '2024-01-27'],
      images: ['/tour-islamabad-1.jpg', '/tour-islamabad-2.jpg'],
      guide: 'Ahmed Khan',
      contactNumber: '+92-302-3456789'
    },
    {
      id: 4,
      title: 'Hunza Valley Expedition',
      description: '3-day expedition to breathtaking Hunza Valley with mountain views and local culture',
      tourType: 'Adventure',
      duration: '3 days',
      maxParticipants: 8,
      price: 25000,
      includes: 'Transportation, Accommodation, All meals, Guide',
      excludes: 'Personal gear, Tips, Insurance',
      startTime: '08:00',
      endTime: '18:00',
      meetingPoint: 'Hotel Lobby',
      difficulty: 'Challenging',
      language: 'English, Urdu',
      status: 'Seasonal',
      rating: 4.9,
      totalBookings: 12,
      availableDates: ['2024-04-15', '2024-05-01', '2024-05-15'],
      images: ['/tour-hunza-1.jpg', '/tour-hunza-2.jpg'],
      guide: 'Ali Raza',
      contactNumber: '+92-303-4567890'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: 'all',
    tourType: 'all',
    guide: 'all'
  });

  const [formData, setFormData] = useState({
    guestName: '',
    roomNumber: '',
    guestPhone: '',
    tourType: '',
    tourName: '',
    destination: '',
    tourDate: '',
    startTime: '',
    endTime: '',
    duration: '',
    groupSize: '',
    guide: '',
    cost: '',
    inclusions: '',
    exclusions: '',
    specialRequests: '',
    status: 'booked'
  });

  // Fetch tours from API
  const fetchTours = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/GuestServices/tours-travel');
      
      if (response.data?.success) {
        setTours(response.data.data);
      } else {
        setError('Failed to load tours data');
        // Set fallback mock data if API fails
        setTours([
          {
            id: 1,
            tourId: 'TOUR-2024-001',
            guestName: 'Ahmed Hassan',
            roomNumber: '201',
            guestPhone: '+92-300-1234567',
            tourType: 'Cultural',
            tourName: 'Karachi Heritage Tour',
            destination: 'Historical Karachi Sites',
            tourDate: '2024-01-25',
            startTime: '09:00',
            endTime: '17:00',
            duration: '8 hours',
            groupSize: 4,
            guide: 'Zara Khan',
            cost: 12000,
            inclusions: 'Transportation, Lunch, Guide, Entry Fees',
            exclusions: 'Personal expenses, Tips',
            specialRequests: 'Photography allowed, English guide',
            status: 'completed',
            rating: 5,
            feedback: 'Amazing tour! Learned so much about Karachi history.'
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching tours:', err);
      setError('Failed to load tours data');
      // Set fallback mock data if API fails
      setTours([
        {
          id: 1,
          tourId: 'TOUR-2024-001',
          guestName: 'Ahmed Hassan',
          roomNumber: '201',
          guestPhone: '+92-300-1234567',
          tourType: 'Cultural',
          tourName: 'Karachi Heritage Tour',
          destination: 'Historical Karachi Sites',
          tourDate: '2024-01-25',
          startTime: '09:00',
          endTime: '17:00',
          duration: '8 hours',
          groupSize: 4,
          guide: 'Zara Khan',
          cost: 12000,
          inclusions: 'Transportation, Lunch, Guide, Entry Fees',
          exclusions: 'Personal expenses, Tips',
          specialRequests: 'Photography allowed, English guide',
          status: 'completed',
          rating: 5,
          feedback: 'Amazing tour! Learned so much about Karachi history.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // API calls disabled to show mock data
    console.log('ToursTravel component loaded with mock data:', tours.length, 'tours');
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredTours = tours.filter(tour => {
    const matchesSearch = !filters.searchTerm || 
      tour.tourId.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      tour.guestName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      tour.tourName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      tour.destination.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || tour.status === filters.status;
    const matchesTourType = filters.tourType === 'all' || tour.tourType === filters.tourType;
    const matchesGuide = filters.guide === 'all' || tour.guide === filters.guide;

    return matchesSearch && matchesStatus && matchesTourType && matchesGuide;
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const tourData = {
        ...formData,
        groupSize: parseInt(formData.groupSize) || 1,
        cost: parseFloat(formData.cost) || 0
      };
      
      if (editingTour) {
        const response = await axios.put(`/GuestServices/tours-travel/${editingTour.id}`, tourData);
        if (response.data?.success) {
          setSuccess('Tour updated successfully!');
          fetchTours(); // Refresh data
        } else {
          setError('Failed to update tour');
        }
      } else {
        const response = await axios.post('/GuestServices/tours-travel', tourData);
        if (response.data?.success) {
          setSuccess('Tour booking created successfully!');
          fetchTours(); // Refresh data
        } else {
          setError('Failed to create tour booking');
        }
      }
      
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving tour:', err);
      setError(err.response?.data?.message || 'Failed to save tour booking');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      guestName: '',
      roomNumber: '',
      guestPhone: '',
      tourType: '',
      tourName: '',
      destination: '',
      tourDate: '',
      startTime: '',
      endTime: '',
      duration: '',
      groupSize: '',
      guide: '',
      cost: '',
      inclusions: '',
      exclusions: '',
      specialRequests: '',
      status: 'booked'
    });
    setEditingTour(null);
    setShowAddModal(false);
  };

  const handleEdit = (tour) => {
    setFormData(tour);
    setEditingTour(tour);
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this tour booking?')) return;
    
    try {
      setLoading(true);
      const response = await axios.delete(`/GuestServices/tours-travel/${id}`);
      
      if (response.data?.success) {
        setSuccess('Tour booking cancelled successfully!');
        fetchTours(); // Refresh data
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to cancel tour booking');
      }
    } catch (err) {
      console.error('Error deleting tour:', err);
      setError(err.response?.data?.message || 'Failed to cancel tour booking');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `Rs ${amount.toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100';
      case 'booked': return 'text-purple-600 bg-purple-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const calculateStats = () => {
    return {
      total: filteredTours.length,
      completed: filteredTours.filter(t => t.status === 'completed').length,
      confirmed: filteredTours.filter(t => t.status === 'confirmed').length,
      booked: filteredTours.filter(t => t.status === 'booked').length,
      totalRevenue: filteredTours.reduce((sum, t) => sum + (t.cost || 0), 0),
      totalTourists: filteredTours.reduce((sum, t) => sum + (t.groupSize || 0), 0)
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-green-700">{success}</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GlobeAltIcon className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">Tours & Travel</h1>
              <p className="text-emerald-100">Manage guest tour bookings and travel experiences</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Tour</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Total Tours</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <GlobeAltIcon className="h-8 w-8 text-emerald-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Completed</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Confirmed</p>
              <p className="text-2xl font-bold">{stats.confirmed}</p>
            </div>
            <CalendarIcon className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Booked</p>
              <p className="text-2xl font-bold">{stats.booked}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm font-medium">Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-teal-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Tourists</p>
              <p className="text-2xl font-bold">{stats.totalTourists}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <FunnelIcon className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tour ID, Guest, Tour Name..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="booked">Booked</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tour Type</label>
            <select
              value={filters.tourType}
              onChange={(e) => handleFilterChange('tourType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="Cultural">Cultural</option>
              <option value="Adventure">Adventure</option>
              <option value="Shopping">Shopping</option>
              <option value="Religious">Religious</option>
              <option value="Nature">Nature</option>
              <option value="Food">Food</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guide</label>
            <select
              value={filters.guide}
              onChange={(e) => handleFilterChange('guide', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Guides</option>
              <option value="Zara Khan">Zara Khan</option>
              <option value="Ali Raza">Ali Raza</option>
              <option value="Fatima Sheikh">Fatima Sheikh</option>
              <option value="Omar Malik">Omar Malik</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tours Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Tour Bookings</h2>
          <p className="text-sm text-gray-600">Showing {filteredTours.length} of {tours.length} tours</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guide & Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTours.map((tour) => (
                <tr key={tour.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{tour.tourId}</div>
                      <div className="text-sm text-gray-600">{tour.tourName}</div>
                      <div className="text-sm text-gray-500">{tour.tourType}</div>
                      <div className="text-sm text-gray-500">Group: {tour.groupSize} people</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{tour.guestName}</div>
                      <div className="text-sm text-gray-500">Room {tour.roomNumber}</div>
                      <div className="text-sm text-gray-500">{tour.guestPhone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900 flex items-center space-x-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{tour.destination}</span>
                      </div>
                      <div className="text-sm text-gray-500">Duration: {tour.duration}</div>
                      <div className="text-sm text-gray-500">Includes: {tour.inclusions}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900 flex items-center space-x-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{tour.tourDate}</span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{tour.startTime} - {tour.endTime}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">Guide: {tour.guide}</div>
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(tour.cost)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tour.status)}`}>
                        {tour.status}
                      </span>
                      {tour.rating > 0 && (
                        <div className="mt-2">
                          {renderStars(tour.rating)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(tour)}
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tour.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTours.length === 0 && (
          <div className="text-center py-12">
            <GlobeAltIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tours found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingTour ? 'Edit Tour Booking' : 'New Tour Booking'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.guestName}
                      onChange={(e) => handleInputChange('guestName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.roomNumber}
                      onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tour Type *</label>
                    <select
                      required
                      value={formData.tourType}
                      onChange={(e) => handleInputChange('tourType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="">Select Tour Type</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Religious">Religious</option>
                      <option value="Nature">Nature</option>
                      <option value="Food">Food</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tour Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.tourName}
                      onChange={(e) => handleInputChange('tourName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tour Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.tourDate}
                      onChange={(e) => handleInputChange('tourDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost *</label>
                    <input
                      type="number"
                      required
                      value={formData.cost}
                      onChange={(e) => handleInputChange('cost', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    {editingTour ? 'Update' : 'Add'} Tour
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToursTravel;
