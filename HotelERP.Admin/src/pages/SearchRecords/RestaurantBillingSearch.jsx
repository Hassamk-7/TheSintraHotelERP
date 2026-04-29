import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import {
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ClockIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

const RestaurantBillingSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const [bills, setBills] = useState([
    {
      id: 1,
      billNumber: 'RB001',
      guestName: 'Ahmed Ali',
      roomNumber: '205',
      tableNumber: 'T-05',
      serviceType: 'Dine In',
      items: 'Chicken Karahi, Biryani Rice, Fresh Lime Water',
      quantity: 3,
      subtotal: 1800,
      tax: 306,
      serviceCharge: 180,
      totalAmount: 2286,
      paymentStatus: 'Paid',
      paymentMethod: 'Cash',
      billDate: '2024-01-15',
      billTime: '19:30',
      waiterName: 'Ali Hassan'
    },
    {
      id: 2,
      billNumber: 'RB002',
      guestName: 'Sarah Khan',
      roomNumber: '301',
      tableNumber: 'T-12',
      serviceType: 'Room Service',
      items: 'Daal Makhani, Naan, Gulab Jamun',
      quantity: 4,
      subtotal: 1200,
      tax: 204,
      serviceCharge: 120,
      totalAmount: 1524,
      paymentStatus: 'Pending',
      paymentMethod: 'Credit Card',
      billDate: '2024-01-15',
      billTime: '20:15',
      waiterName: 'Fatima Sheikh'
    },
    {
      id: 3,
      billNumber: 'RB003',
      guestName: 'John Smith',
      roomNumber: '102',
      tableNumber: 'T-08',
      serviceType: 'Dine In',
      items: 'Beef Steak, Mashed Potatoes, Caesar Salad',
      quantity: 2,
      subtotal: 2200,
      tax: 374,
      serviceCharge: 220,
      totalAmount: 2794,
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card',
      billDate: '2024-01-15',
      billTime: '21:00',
      waiterName: 'Muhammad Usman'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Load bills on component mount and filter changes
  useEffect(() => {
    // API calls disabled to show mock data
    console.log('Restaurant Billing Search component loaded with mock data:', bills.length, 'bills');
  }, []);

  // Fetch bills data - PURE API CALL
  const fetchBills = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (paymentStatusFilter) params.append('paymentStatus', paymentStatusFilter);
      if (serviceTypeFilter) params.append('serviceType', serviceTypeFilter);
      if (dateRange.start) params.append('billDateFrom', dateRange.start);
      if (dateRange.end) params.append('billDateTo', dateRange.end);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await axios.get(`/api/SearchRecords/restaurant-billing?${params}`);
      
      if (response.data?.success) {
        setBills(response.data.data);
      } else {
        setError('No restaurant billing data received');
        setBills([]);
      }
    } catch (err) {
      console.error('Error fetching restaurant bills:', err);
      setError(err.response?.data?.message || 'Failed to load restaurant bills');
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    fetchBills();
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setPaymentStatusFilter('');
    setServiceTypeFilter('');
    setDateRange({ start: '', end: '' });
  };

  // Filter bills based on search term
  const filteredBills = bills.filter(bill =>
    bill.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.billNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.tableNumber?.toString().includes(searchTerm)
  );

  // View bill details
  const viewBillDetails = (bill) => {
    setSelectedBill(bill);
    setShowDetails(true);
  };

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Partial': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get service type color
  const getServiceTypeColor = (type) => {
    switch (type) {
      case 'Dine In': return 'bg-blue-100 text-blue-800';
      case 'Room Service': return 'bg-green-100 text-green-800';
      case 'Takeaway': return 'bg-yellow-100 text-yellow-800';
      case 'Delivery': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                <BuildingStorefrontIcon className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Restaurant Billing</h1>
                <p className="text-orange-100 text-lg">Search and manage restaurant billing records</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{filteredBills.length}</div>
                <div className="text-orange-200 text-sm">Total Bills</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">Rs. {filteredBills.reduce((sum, bill) => sum + bill.totalAmount, 0).toLocaleString()}</div>
                <div className="text-orange-200 text-sm">Total Amount</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <MagnifyingGlassIcon className="h-6 w-6 text-orange-600 mr-2" />
              Search & Filter
            </h2>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search Bills</label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                  placeholder="Search by guest name, bill number, room/table..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Status</label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              >
                <option value="">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Service Type</label>
              <select
                value={serviceTypeFilter}
                onChange={(e) => setServiceTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              >
                <option value="">All Types</option>
                <option value="Dine In">Dine In</option>
                <option value="Room Service">Room Service</option>
                <option value="Takeaway">Takeaway</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bill Date From</label>
              <div className="relative">
                <CalendarDaysIcon className="h-5 w-5 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bill Date To</label>
              <div className="relative">
                <CalendarDaysIcon className="h-5 w-5 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-red-700 flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
                <span className="font-medium">Search Bills</span>
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
              <CurrencyDollarIcon className="h-8 w-8 text-orange-600 mr-3" />
              Restaurant Bills
              <span className="ml-3 px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                {filteredBills.length} found
              </span>
            </h3>
          </div>

          {loading ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600 mx-auto"></div>
              <p className="text-gray-600 mt-4 text-lg">Searching restaurant bills...</p>
            </div>
          ) : filteredBills.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center">
              <BuildingStorefrontIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h4 className="text-xl font-semibold text-gray-700 mb-2">No Bills Found</h4>
              <p className="text-gray-500">No restaurant bills found matching your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBills.map((bill) => (
                <div key={bill.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{bill.billNumber}</h4>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {bill.billDate} at {bill.billTime}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(bill.paymentStatus)}`}>
                      {bill.paymentStatus}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{bill.guestName}</p>
                        <p className="text-sm text-gray-600">Room {bill.roomNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <BuildingStorefrontIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getServiceTypeColor(bill.serviceType)}`}>
                          {bill.serviceType}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">Table {bill.tableNumber}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700 font-medium mb-1">Items Ordered:</p>
                      <p className="text-sm text-gray-600">{bill.items}</p>
                      <p className="text-xs text-gray-500 mt-1">Quantity: {bill.quantity} items</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">Total Amount:</span>
                      <span className="text-xl font-bold text-orange-600">Rs. {bill.totalAmount.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium text-gray-900">{bill.paymentMethod}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-600">Waiter:</span>
                      <span className="font-medium text-gray-900">{bill.waiterName}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => viewBillDetails(bill)}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 px-4 rounded-xl hover:from-orange-700 hover:to-red-700 flex items-center justify-center space-x-2 transition-all duration-200 font-medium"
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

        {/* Bill Details Modal */}
        {showDetails && selectedBill && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Restaurant Bill Details</h3>
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
                      <label className="block text-sm font-medium text-gray-700">Bill Number</label>
                      <p className="text-sm text-gray-900">{selectedBill.billNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bill Date & Time</label>
                      <p className="text-sm text-gray-900">{selectedBill.billDate} {selectedBill.billTime}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Guest Name</label>
                      <p className="text-sm text-gray-900">{selectedBill.guestName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Service Type</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getServiceTypeColor(selectedBill.serviceType)}`}>
                        {selectedBill.serviceType}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <p className="text-sm text-gray-900">
                        {selectedBill.serviceType === 'Room Service' ? `Room ${selectedBill.roomNumber}` :
                         selectedBill.serviceType === 'Dine In' ? `Table ${selectedBill.tableNumber}` : '-'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Quantity</label>
                      <p className="text-sm text-gray-900">{selectedBill.quantity}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Subtotal</label>
                      <p className="text-sm text-gray-900">Rs {selectedBill.subtotal?.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tax</label>
                      <p className="text-sm text-gray-900">Rs {selectedBill.tax?.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Service Charge</label>
                      <p className="text-sm text-gray-900">Rs {selectedBill.serviceCharge?.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                      <p className="text-lg font-bold text-orange-600">Rs {selectedBill.totalAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(selectedBill.paymentStatus)}`}>
                        {selectedBill.paymentStatus}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                      <p className="text-sm text-gray-900">{selectedBill.paymentMethod}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Items Ordered</label>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-900">{selectedBill.items}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Waiter</label>
                    <p className="text-sm text-gray-900">{selectedBill.waiterName}</p>
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

export default RestaurantBillingSearch;
