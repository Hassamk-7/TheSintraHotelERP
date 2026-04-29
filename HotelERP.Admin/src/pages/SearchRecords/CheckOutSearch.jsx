import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import {
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  CalendarDaysIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ClockIcon,
  HomeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const CheckOutSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const [checkOutRecords, setCheckOutRecords] = useState([
    {
      id: 1,
      guestId: 'GST-001',
      guestName: 'Ahmed Hassan',
      email: 'ahmed.hassan@email.com',
      phone: '+92-300-1234567',
      roomNumber: '101',
      roomType: 'Deluxe',
      checkInDate: '2024-01-10',
      checkInTime: '14:30',
      checkOutDate: '2024-01-13',
      checkOutTime: '12:00',
      totalAmount: 15000,
      paidAmount: 15000,
      balanceAmount: 0,
      paymentStatus: 'Paid',
      status: 'Checked Out',
      nights: 3,
      adults: 2,
      children: 1
    },
    {
      id: 2,
      guestId: 'GST-002',
      guestName: 'Sarah Khan',
      email: 'sarah.khan@email.com',
      phone: '+92-301-2345678',
      roomNumber: '205',
      roomType: 'Suite',
      checkInDate: '2024-01-12',
      checkInTime: '15:00',
      checkOutDate: '2024-01-15',
      checkOutTime: '11:30',
      totalAmount: 25000,
      paidAmount: 20000,
      balanceAmount: 5000,
      paymentStatus: 'Partial',
      status: 'Checked Out',
      nights: 3,
      adults: 2,
      children: 0
    },
    {
      id: 3,
      guestId: 'GST-003',
      guestName: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+92-302-3456789',
      roomNumber: '302',
      roomType: 'Standard',
      checkInDate: '2024-01-14',
      checkInTime: '16:00',
      checkOutDate: '2024-01-16',
      checkOutTime: '10:45',
      totalAmount: 8000,
      paidAmount: 8000,
      balanceAmount: 0,
      paymentStatus: 'Paid',
      status: 'Checked Out',
      nights: 2,
      adults: 1,
      children: 0
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Load check-out records on component mount
  useEffect(() => {
    console.log('Check Out Search component loaded with mock data:', checkOutRecords.length, 'records');
  }, []);

  // Fetch check-out records - PURE API CALL
  const fetchCheckOutRecords = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (roomTypeFilter) params.append('roomType', roomTypeFilter);
      if (dateRange.start) params.append('checkOutDateFrom', dateRange.start);
      if (dateRange.end) params.append('checkOutDateTo', dateRange.end);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await axios.get(`/api/SearchRecords/check-out?${params}`);
      
      if (response.data?.success) {
        setCheckOutRecords(response.data.data);
      } else {
        setError('No check-out data received');
        setCheckOutRecords([]);
      }
    } catch (err) {
      console.error('Error fetching check-out records:', err);
      setError(err.response?.data?.message || 'Failed to load check-out records');
      setCheckOutRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    fetchCheckOutRecords();
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setRoomTypeFilter('');
    setDateRange({ start: '', end: '' });
  };

  // Filter records based on search term
  const filteredRecords = checkOutRecords.filter(record =>
    record.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.guestId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.phone?.includes(searchTerm) ||
    record.roomNumber?.toString().includes(searchTerm)
  );

  // View record details
  const viewRecordDetails = (record) => {
    setSelectedRecord(record);
    setShowDetails(true);
  };

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get room type color
  const getRoomTypeColor = (type) => {
    switch (type) {
      case 'Suite': return 'bg-purple-100 text-purple-800';
      case 'Deluxe': return 'bg-blue-100 text-blue-800';
      case 'Standard': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 rounded-2xl p-8 text-white shadow-2xl mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                <ArrowRightOnRectangleIcon className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Check Out Search</h1>
                <p className="text-red-100 text-lg">Search and manage guest check-out records</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{filteredRecords.length}</div>
                <div className="text-red-200 text-sm">Total Check-Outs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">Rs. {filteredRecords.reduce((sum, record) => sum + record.totalAmount, 0).toLocaleString()}</div>
                <div className="text-red-200 text-sm">Total Revenue</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <MagnifyingGlassIcon className="h-6 w-6 text-red-600 mr-2" />
              Search & Filter
            </h2>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search Check-Outs</label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                  placeholder="Search by guest name, ID, email, phone, room..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              >
                <option value="">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Room Type</label>
              <select
                value={roomTypeFilter}
                onChange={(e) => setRoomTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              >
                <option value="">All Room Types</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Check-Out Date From</label>
              <div className="relative">
                <CalendarDaysIcon className="h-5 w-5 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Check-Out Date To</label>
              <div className="relative">
                <CalendarDaysIcon className="h-5 w-5 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-orange-700 flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
                <span className="font-medium">Search Records</span>
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
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <ArrowRightOnRectangleIcon className="h-8 w-8 text-red-600 mr-3" />
              Check-Out Records
              <span className="ml-3 px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                {filteredRecords.length} found
              </span>
            </h3>
          </div>

          {loading ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-200 border-t-red-600 mx-auto"></div>
              <p className="text-gray-600 mt-4 text-lg">Searching check-out records...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center">
              <ArrowRightOnRectangleIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h4 className="text-xl font-semibold text-gray-700 mb-2">No Records Found</h4>
              <p className="text-gray-500">No check-out records found matching your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRecords.map((record) => (
                <div key={record.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{record.guestName}</h4>
                      <p className="text-sm text-gray-600">{record.guestId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(record.paymentStatus)}`}>
                      {record.paymentStatus}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                      <HomeIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Room {record.roomNumber}</p>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getRoomTypeColor(record.roomType)}`}>
                          {record.roomType}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-700">Check-Out: {record.checkOutDate}</p>
                        <p className="text-xs text-gray-500">at {record.checkOutTime}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Stay Duration:</span>
                        <span className="font-medium">{record.nights} nights</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Guests:</span>
                        <span className="font-medium">{record.adults} Adults, {record.children} Children</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">Total Amount:</span>
                      <span className="text-xl font-bold text-red-600">Rs. {record.totalAmount.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Paid:</span>
                      <span className="font-medium text-green-600">Rs. {record.paidAmount.toLocaleString()}</span>
                    </div>
                    
                    {record.balanceAmount > 0 && (
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">Balance:</span>
                        <span className="font-medium text-red-600">Rs. {record.balanceAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => viewRecordDetails(record)}
                      className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-2 px-4 rounded-xl hover:from-red-700 hover:to-orange-700 flex items-center justify-center space-x-2 transition-all duration-200 font-medium"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Record Details Modal */}
        {showDetails && selectedRecord && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Check-Out Details</h3>
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
                      <label className="block text-sm font-medium text-gray-700">Guest ID</label>
                      <p className="text-sm text-gray-900">{selectedRecord.guestId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Guest Name</label>
                      <p className="text-sm text-gray-900">{selectedRecord.guestName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedRecord.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{selectedRecord.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Room Number</label>
                      <p className="text-sm text-gray-900">{selectedRecord.roomNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Room Type</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoomTypeColor(selectedRecord.roomType)}`}>
                        {selectedRecord.roomType}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Check-In</label>
                      <p className="text-sm text-gray-900">{selectedRecord.checkInDate} at {selectedRecord.checkInTime}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Check-Out</label>
                      <p className="text-sm text-gray-900">{selectedRecord.checkOutDate} at {selectedRecord.checkOutTime}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stay Duration</label>
                      <p className="text-sm text-gray-900">{selectedRecord.nights} nights</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Guests</label>
                      <p className="text-sm text-gray-900">{selectedRecord.adults} Adults, {selectedRecord.children} Children</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                      <p className="text-lg font-bold text-red-600">Rs. {selectedRecord.totalAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(selectedRecord.paymentStatus)}`}>
                        {selectedRecord.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Paid Amount</label>
                      <p className="text-sm font-medium text-green-600">Rs. {selectedRecord.paidAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Balance Amount</label>
                      <p className={`text-sm font-medium ${selectedRecord.balanceAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        Rs. {selectedRecord.balanceAmount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckOutSearch;
