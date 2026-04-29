import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import {
  MagnifyingGlassIcon,
  UserGroupIcon,
  FunnelIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  MapPinIcon,
  CreditCardIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const GuestsSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [guestTypeFilter, setGuestTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [nationalityFilter, setNationalityFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const [guests, setGuests] = useState([
    {
      id: 1,
      guestId: 'GST001',
      name: 'Ahmed Ali',
      email: 'ahmed.ali@email.com',
      phone: '+92-300-1234567',
      nationality: 'Pakistani',
      idType: 'CNIC',
      idNumber: '35202-1234567-1',
      guestType: 'Individual',
      status: 'Checked In',
      roomNumber: '205',
      checkInDate: '2024-01-15',
      checkOutDate: '2024-01-17',
      totalStay: 2,
      totalAmount: 24000,
      address: 'Gulberg, Lahore',
      registrationDate: '2024-01-15',
      totalStays: 3
    },
    {
      id: 2,
      guestId: 'GST002',
      name: 'Sarah Khan',
      email: 'sarah.khan@email.com',
      phone: '+92-301-2345678',
      nationality: 'Pakistani',
      idType: 'Passport',
      idNumber: 'AB1234567',
      guestType: 'Corporate',
      status: 'Checked Out',
      roomNumber: '301',
      checkInDate: '2024-01-12',
      checkOutDate: '2024-01-15',
      totalStay: 3,
      totalAmount: 54000,
      address: 'Model Town, Lahore',
      registrationDate: '2024-01-12',
      totalStays: 5
    },
    {
      id: 3,
      guestId: 'GST003',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-123-4567',
      nationality: 'American',
      idType: 'Passport',
      idNumber: 'US123456789',
      guestType: 'Tourist',
      status: 'Reserved',
      roomNumber: '102',
      checkInDate: '2024-01-18',
      checkOutDate: '2024-01-22',
      totalStay: 4,
      totalAmount: 72000,
      address: 'New York, USA',
      registrationDate: '2024-01-08',
      totalStays: 1
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Load guests on component mount and filter changes
  useEffect(() => {
    // API calls disabled to show mock data
    console.log('GuestsSearch component loaded with mock data:', guests.length, 'guests');
  }, []);

  // Fetch guests - PURE API CALL
  const fetchGuests = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (guestTypeFilter) params.append('guestType', guestTypeFilter);
      if (statusFilter) params.append('status', statusFilter);
      if (nationalityFilter) params.append('nationality', nationalityFilter);
      if (dateRange.start) params.append('registrationDateFrom', dateRange.start);
      if (dateRange.end) params.append('registrationDateTo', dateRange.end);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await axios.get(`/api/SearchRecords/guests?${params}`);
      
      if (response.data?.success) {
        setGuests(response.data.data);
      } else {
        setError('No guest data received');
        setGuests([]);
      }
    } catch (err) {
      console.error('Error fetching guests:', err);
      setError(err.response?.data?.message || 'Failed to load guests');
      setGuests([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    fetchGuests();
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setGuestTypeFilter('');
    setStatusFilter('');
    setNationalityFilter('');
    setDateRange({ start: '', end: '' });
  };

  // Filter guests based on search term and filters
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = !searchTerm || 
      guest.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.guestId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone?.includes(searchTerm) ||
      guest.idNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGuestType = !guestTypeFilter || guest.guestType === guestTypeFilter;
    const matchesStatus = !statusFilter || guest.status === statusFilter;
    const matchesNationality = !nationalityFilter || guest.nationality === nationalityFilter;
    
    return matchesSearch && matchesGuestType && matchesStatus && matchesNationality;
  });

  // View guest details
  const viewGuestDetails = (guest) => {
    setSelectedGuest(guest);
    setShowDetails(true);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Checked Out': return 'bg-blue-100 text-blue-800';
      case 'Blacklisted': return 'bg-red-100 text-red-800';
      case 'VIP': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get guest type color
  const getGuestTypeColor = (type) => {
    switch (type) {
      case 'Individual': return 'bg-blue-100 text-blue-800';
      case 'Corporate': return 'bg-green-100 text-green-800';
      case 'Group': return 'bg-yellow-100 text-yellow-800';
      case 'VIP': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-2xl mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                <UserGroupIcon className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Guest Search</h1>
                <p className="text-green-100 text-lg">Search and manage guest records</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{filteredGuests.length}</div>
                <div className="text-green-200 text-sm">Total Guests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{filteredGuests.filter(guest => guest.status === 'Checked In').length}</div>
                <div className="text-green-200 text-sm">Currently Staying</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <MagnifyingGlassIcon className="h-6 w-6 text-green-600 mr-2" />
              Search & Filter
            </h2>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search Guests</label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                  placeholder="Search by name, ID, email, phone, passport..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guest Type</label>
              <select
                value={guestTypeFilter}
                onChange={(e) => setGuestTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="Individual">Individual</option>
                <option value="Corporate">Corporate</option>
                <option value="Group">Group</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Checked Out">Checked Out</option>
                <option value="Blacklisted">Blacklisted</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <select
                value={nationalityFilter}
                onChange={(e) => setNationalityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Nationalities</option>
                <option value="Pakistani">Pakistani</option>
                <option value="Indian">Indian</option>
                <option value="American">American</option>
                <option value="British">British</option>
                <option value="Chinese">Chinese</option>
                <option value="German">German</option>
                <option value="French">French</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration From</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration To</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end space-x-2">
              <button
                onClick={handleSearch}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 transition-colors"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
                <span>Search</span>
              </button>
              <button
                onClick={clearFilters}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
            </div>
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

        {/* Results */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Search Results ({filteredGuests.length} guests found)
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Searching guests...</p>
            </div>
          ) : filteredGuests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <UserGroupIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No guests found matching your criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nationality</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Stays</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredGuests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-2 rounded-full mr-3">
                            <UserGroupIcon className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {guest.name}
                            </div>
                            <div className="text-sm text-gray-500">{guest.guestId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {guest.email}
                          </div>
                          <div className="flex items-center">
                            <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {guest.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGuestTypeColor(guest.guestType)}`}>
                          {guest.guestType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {guest.nationality}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <CalendarDaysIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {guest.registrationDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {guest.totalStays || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(guest.status)}`}>
                          {guest.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => viewGuestDetails(guest)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Guest Details Modal */}
        {showDetails && selectedGuest && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Guest Details</h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <p className="text-sm text-gray-900">{selectedGuest.firstName} {selectedGuest.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Guest ID</label>
                      <p className="text-sm text-gray-900">{selectedGuest.guestId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedGuest.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{selectedGuest.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Guest Type</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGuestTypeColor(selectedGuest.guestType)}`}>
                        {selectedGuest.guestType}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nationality</label>
                      <p className="text-sm text-gray-900">{selectedGuest.nationality}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Passport Number</label>
                      <p className="text-sm text-gray-900">{selectedGuest.passportNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Registration Date</label>
                      <p className="text-sm text-gray-900">{selectedGuest.registrationDate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedGuest.status)}`}>
                        {selectedGuest.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Stays</label>
                      <p className="text-sm text-gray-900">{selectedGuest.totalStays || 0}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="text-sm text-gray-900">{selectedGuest.address}</p>
                  </div>

                  {selectedGuest.preferences && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Preferences</label>
                      <p className="text-sm text-gray-900">{selectedGuest.preferences}</p>
                    </div>
                  )}

                  {selectedGuest.totalSpent && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Spent</label>
                      <p className="text-sm text-gray-900">Rs {selectedGuest.totalSpent?.toLocaleString()}</p>
                    </div>
                  )}

                  {selectedGuest.loyaltyPoints && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Loyalty Points</label>
                      <p className="text-sm text-gray-900">{selectedGuest.loyaltyPoints}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestsSearch;
