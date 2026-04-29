import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import {
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const RoomReservationSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const [reservations, setReservations] = useState([
    {
      id: 1,
      reservationId: 'RES001',
      guestName: 'Ahmed Ali',
      roomType: 'Deluxe Room',
      roomNumber: '205',
      checkInDate: '2024-01-15',
      checkOutDate: '2024-01-17',
      nights: 2,
      adults: 2,
      children: 1,
      status: 'Confirmed',
      totalAmount: 24000,
      paidAmount: 10000,
      balance: 14000,
      bookingDate: '2024-01-10',
      phone: '+92-300-1234567',
      email: 'ahmed.ali@email.com'
    },
    {
      id: 2,
      reservationId: 'RES002',
      guestName: 'Sarah Khan',
      roomType: 'Executive Suite',
      roomNumber: '301',
      checkInDate: '2024-01-18',
      checkOutDate: '2024-01-22',
      nights: 4,
      adults: 1,
      children: 0,
      status: 'Pending',
      totalAmount: 72000,
      paidAmount: 0,
      balance: 72000,
      bookingDate: '2024-01-12',
      phone: '+92-301-2345678',
      email: 'sarah.khan@email.com'
    },
    {
      id: 3,
      reservationId: 'RES003',
      guestName: 'John Smith',
      roomType: 'Standard Room',
      roomNumber: '102',
      checkInDate: '2024-01-20',
      checkOutDate: '2024-01-25',
      nights: 5,
      adults: 2,
      children: 2,
      status: 'Cancelled',
      totalAmount: 60000,
      paidAmount: 0,
      balance: 60000,
      bookingDate: '2024-01-08',
      phone: '+1-555-123-4567',
      email: 'john.smith@email.com'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Load reservations on component mount and filter changes
  useEffect(() => {
    // API calls disabled to show mock data
    console.log('RoomReservationSearch component loaded with mock data:', reservations.length, 'reservations');
  }, []);

  // Fetch reservations - PURE API CALL
  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (roomTypeFilter) params.append('roomType', roomTypeFilter);
      if (statusFilter) params.append('status', statusFilter);
      if (dateRange.start) params.append('checkInFrom', dateRange.start);
      if (dateRange.end) params.append('checkInTo', dateRange.end);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await axios.get(`/api/SearchRecords/room-reservations?${params}`);
      
      if (response.data?.success) {
        setReservations(response.data.data);
      } else {
        setError('No reservation data received');
        setReservations([]);
      }
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError(err.response?.data?.message || 'Failed to load reservations');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    fetchReservations();
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setRoomTypeFilter('');
    setStatusFilter('');
    setDateRange({ start: '', end: '' });
  };

  // Filter reservations based on search term and filters
  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = !searchTerm || 
      reservation.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.reservationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.phone?.includes(searchTerm);
    
    const matchesRoomType = !roomTypeFilter || reservation.roomType === roomTypeFilter;
    const matchesStatus = !statusFilter || reservation.status === statusFilter;
    
    return matchesSearch && matchesRoomType && matchesStatus;
  });

  // View reservation details
  const viewReservationDetails = (reservation) => {
    setSelectedReservation(reservation);
    setShowDetails(true);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Checked In': return 'bg-blue-100 text-blue-800';
      case 'Checked Out': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-2xl p-8 text-white shadow-2xl mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                <BuildingOfficeIcon className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Room Reservation Search</h1>
                <p className="text-purple-100 text-lg">Search and manage room reservations</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{filteredReservations.length}</div>
                <div className="text-purple-200 text-sm">Total Reservations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">Rs. {filteredReservations.reduce((sum, res) => sum + res.totalAmount, 0).toLocaleString()}</div>
                <div className="text-purple-200 text-sm">Total Value</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Search by guest name, reservation ID, room number..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
              <select
                value={roomTypeFilter}
                onChange={(e) => setRoomTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Room Types</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
                <option value="Presidential">Presidential</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Checked In">Checked In</option>
                <option value="Checked Out">Checked Out</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in From</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in To</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end space-x-2">
              <button
                onClick={handleSearch}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2 transition-colors"
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
              Search Results ({filteredReservations.length} reservations found)
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Searching reservations...</p>
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <BuildingOfficeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No reservations found matching your criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reservation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in/out</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nights</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{reservation.reservationId}</div>
                          <div className="text-sm text-gray-500">
                            <ClockIcon className="h-4 w-4 inline mr-1" />
                            {reservation.bookingDate}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-purple-100 p-2 rounded-full mr-3">
                            <UserIcon className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{reservation.guestName}</div>
                            <div className="text-sm text-gray-500">{reservation.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{reservation.roomNumber}</div>
                          <div className="text-sm text-gray-500">{reservation.roomType}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="flex items-center">
                            <CalendarDaysIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {reservation.checkInDate}
                          </div>
                          <div className="flex items-center text-gray-500">
                            <CalendarDaysIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {reservation.checkOutDate}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reservation.nights}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1 text-gray-400" />
                          Rs {reservation.totalAmount?.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                          {reservation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => viewReservationDetails(reservation)}
                          className="text-purple-600 hover:text-purple-900"
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

        {/* Reservation Details Modal */}
        {showDetails && selectedReservation && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Reservation Details</h3>
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
                      <label className="block text-sm font-medium text-gray-700">Reservation ID</label>
                      <p className="text-sm text-gray-900">{selectedReservation.reservationId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Reservation Date</label>
                      <p className="text-sm text-gray-900">{selectedReservation.reservationDate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Guest Name</label>
                      <p className="text-sm text-gray-900">{selectedReservation.guestName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{selectedReservation.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Room Number</label>
                      <p className="text-sm text-gray-900">{selectedReservation.roomNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Room Type</label>
                      <p className="text-sm text-gray-900">{selectedReservation.roomType}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
                      <p className="text-sm text-gray-900">{selectedReservation.checkInDate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
                      <p className="text-sm text-gray-900">{selectedReservation.checkOutDate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Number of Nights</label>
                      <p className="text-sm text-gray-900">{selectedReservation.nights}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Number of Guests</label>
                      <p className="text-sm text-gray-900">{selectedReservation.guests}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                      <p className="text-sm text-gray-900">Rs {selectedReservation.totalAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedReservation.status)}`}>
                        {selectedReservation.status}
                      </span>
                    </div>
                  </div>

                  {selectedReservation.specialRequests && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Special Requests</label>
                      <p className="text-sm text-gray-900">{selectedReservation.specialRequests}</p>
                    </div>
                  )}

                  {selectedReservation.paymentStatus && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                      <p className="text-sm text-gray-900">{selectedReservation.paymentStatus}</p>
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

export default RoomReservationSearch;
