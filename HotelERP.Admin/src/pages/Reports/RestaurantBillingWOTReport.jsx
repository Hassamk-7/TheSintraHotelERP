import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import { 
  DocumentTextIcon, 
  CalendarIcon, 
  UserIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const RestaurantBillingWOTReport = () => {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    billType: 'all',
    paymentMethod: 'all',
    waiter: 'all',
    searchTerm: ''
  });

  const [billingRecords, setBillingRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data for restaurant billing without tax
  const mockBillingData = [
    {
      id: 1,
      billNo: 'RB-2024-001',
      date: '2024-01-15',
      time: '14:30',
      tableNo: 'T-05',
      guestName: 'Ahmed Hassan',
      guestRoom: '201',
      waiterName: 'Muhammad Ali',
      billType: 'Dine-In',
      paymentMethod: 'Cash',
      items: [
        { name: 'Chicken Karahi', quantity: 2, rate: 800, amount: 1600 },
        { name: 'Naan', quantity: 4, rate: 50, amount: 200 },
        { name: 'Fresh Lime', quantity: 2, rate: 120, amount: 240 }
      ],
      subtotal: 2040,
      discount: 100,
      serviceCharge: 102,
      totalAmount: 2042,
      paidAmount: 2042,
      status: 'Paid'
    },
    {
      id: 2,
      billNo: 'RB-2024-002',
      date: '2024-01-15',
      time: '19:45',
      tableNo: 'T-12',
      guestName: 'Sarah Khan',
      guestRoom: '305',
      waiterName: 'Zain Ahmed',
      billType: 'Room Service',
      paymentMethod: 'Room Charge',
      items: [
        { name: 'Beef Biryani', quantity: 1, rate: 650, amount: 650 },
        { name: 'Raita', quantity: 1, rate: 80, amount: 80 },
        { name: 'Soft Drink', quantity: 2, rate: 60, amount: 120 }
      ],
      subtotal: 850,
      discount: 0,
      serviceCharge: 43,
      totalAmount: 893,
      paidAmount: 893,
      status: 'Paid'
    },
    {
      id: 3,
      billNo: 'RB-2024-003',
      date: '2024-01-16',
      time: '12:15',
      tableNo: 'T-08',
      guestName: 'Ali Raza',
      guestRoom: 'Walk-in',
      waiterName: 'Hassan Sheikh',
      billType: 'Walk-in',
      paymentMethod: 'Card',
      items: [
        { name: 'Fish Curry', quantity: 1, rate: 750, amount: 750 },
        { name: 'Rice', quantity: 2, rate: 100, amount: 200 },
        { name: 'Lassi', quantity: 2, rate: 90, amount: 180 }
      ],
      subtotal: 1130,
      discount: 50,
      serviceCharge: 54,
      totalAmount: 1134,
      paidAmount: 1134,
      status: 'Paid'
    },
    {
      id: 4,
      billNo: 'RB-2024-004',
      date: '2024-01-16',
      time: '20:30',
      tableNo: 'T-15',
      guestName: 'Fatima Sheikh',
      guestRoom: '412',
      waiterName: 'Omar Khan',
      billType: 'Dine-In',
      paymentMethod: 'Cash',
      items: [
        { name: 'Mutton Karahi', quantity: 1, rate: 900, amount: 900 },
        { name: 'Tandoori Roti', quantity: 6, rate: 40, amount: 240 },
        { name: 'Green Tea', quantity: 2, rate: 80, amount: 160 }
      ],
      subtotal: 1300,
      discount: 0,
      serviceCharge: 65,
      totalAmount: 1365,
      paidAmount: 1000,
      status: 'Partial'
    },
    {
      id: 5,
      billNo: 'RB-2024-005',
      date: '2024-01-17',
      time: '13:20',
      tableNo: 'T-03',
      guestName: 'Imran Malik',
      guestRoom: 'Walk-in',
      waiterName: 'Bilal Ahmad',
      billType: 'Walk-in',
      paymentMethod: 'Cash',
      items: [
        { name: 'Chicken Tikka', quantity: 1, rate: 550, amount: 550 },
        { name: 'Salad', quantity: 1, rate: 120, amount: 120 },
        { name: 'Mineral Water', quantity: 2, rate: 50, amount: 100 }
      ],
      subtotal: 770,
      discount: 30,
      serviceCharge: 37,
      totalAmount: 777,
      paidAmount: 0,
      status: 'Pending'
    }
  ];

  useEffect(() => {
    fetchBillingRecords();
  }, [filters.dateFrom, filters.dateTo]);

  // Fetch billing records from API
  const fetchBillingRecords = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.billType !== 'all') params.append('billType', filters.billType);
      if (filters.paymentMethod !== 'all') params.append('paymentMethod', filters.paymentMethod);
      
      const response = await axios.get(`/Reports/restaurant-billing-wot?${params}`);
      if (response.data?.success) {
        setBillingRecords(response.data.data);
      } else {
        setError('Failed to load billing records');
        setBillingRecords(mockBillingData);
      }
    } catch (err) {
      console.error('Error fetching billing records:', err);
      setError('Failed to load billing records');
      setBillingRecords(mockBillingData);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredRecords = billingRecords.filter(record => {
    const matchesDateFrom = !filters.dateFrom || record.date >= filters.dateFrom;
    const matchesDateTo = !filters.dateTo || record.date <= filters.dateTo;
    const matchesBillType = filters.billType === 'all' || record.billType.toLowerCase() === filters.billType.toLowerCase();
    const matchesPaymentMethod = filters.paymentMethod === 'all' || record.paymentMethod.toLowerCase() === filters.paymentMethod.toLowerCase();
    const matchesWaiter = filters.waiter === 'all' || record.waiterName.toLowerCase().includes(filters.waiter.toLowerCase());
    const matchesSearch = !filters.searchTerm || 
      record.billNo.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.guestName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.tableNo.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return matchesDateFrom && matchesDateTo && matchesBillType && matchesPaymentMethod && matchesWaiter && matchesSearch;
  });

  const formatCurrency = (amount) => {
    return `Rs ${amount.toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'text-green-600 bg-green-100';
      case 'Partial': return 'text-yellow-600 bg-yellow-100';
      case 'Pending': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid': return <CheckCircleIcon className="h-4 w-4" />;
      case 'Partial': return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'Pending': return <XCircleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getBillTypeColor = (type) => {
    switch (type) {
      case 'Dine-In': return 'text-blue-600 bg-blue-100';
      case 'Room Service': return 'text-purple-600 bg-purple-100';
      case 'Walk-in': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const calculateTotals = () => {
    return filteredRecords.reduce((acc, record) => ({
      totalBills: acc.totalBills + 1,
      totalAmount: acc.totalAmount + record.totalAmount,
      totalPaid: acc.totalPaid + record.paidAmount,
      totalPending: acc.totalPending + (record.totalAmount - record.paidAmount)
    }), { totalBills: 0, totalAmount: 0, totalPaid: 0, totalPending: 0 });
  };

  const totals = calculateTotals();

  const handleExport = () => {
    console.log('Exporting restaurant billing WOT report...');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">Restaurant Billing (WOT) Report</h1>
              <p className="text-purple-100">Restaurant billing without tax calculations</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
            >
              <PrinterIcon className="h-5 w-5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleExport}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <FunnelIcon className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bill Type</label>
            <select
              value={filters.billType}
              onChange={(e) => handleFilterChange('billType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="dine-in">Dine-In</option>
              <option value="room service">Room Service</option>
              <option value="walk-in">Walk-in</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              value={filters.paymentMethod}
              onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Methods</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="room charge">Room Charge</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Waiter</label>
            <input
              type="text"
              placeholder="Waiter name..."
              value={filters.waiter}
              onChange={(e) => handleFilterChange('waiter', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Bill No, Guest, Table..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Bills</p>
              <p className="text-2xl font-bold">{totals.totalBills}</p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Amount</p>
              <p className="text-2xl font-bold">{formatCurrency(totals.totalAmount)}</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Paid</p>
              <p className="text-2xl font-bold">{formatCurrency(totals.totalPaid)}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Pending</p>
              <p className="text-2xl font-bold">{formatCurrency(totals.totalPending)}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-red-200" />
          </div>
        </div>
      </div>

      {/* Billing Records Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Restaurant Billing Records (Without Tax)</h2>
          <p className="text-sm text-gray-600">Showing {filteredRecords.length} of {billingRecords.length} records</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest & Table</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Financial Summary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.billNo}</div>
                      <div className="text-sm text-gray-500 flex items-center space-x-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{record.date}</span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{record.time}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 flex items-center space-x-1">
                        <UserIcon className="h-4 w-4" />
                        <span>{record.guestName}</span>
                      </div>
                      <div className="text-sm text-gray-500">Room: {record.guestRoom}</div>
                      <div className="text-sm text-gray-500">Table: {record.tableNo}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBillTypeColor(record.billType)}`}>
                        {record.billType}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">Waiter: {record.waiterName}</div>
                      <div className="text-sm text-gray-500">Payment: {record.paymentMethod}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {record.items.map((item, index) => (
                        <div key={index} className="text-xs text-gray-600">
                          <span className="font-medium">{item.name}</span> - 
                          <span className="ml-1">{item.quantity} × {formatCurrency(item.rate)} = {formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(record.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-{formatCurrency(record.discount)}</span>
                      </div>
                      <div className="flex justify-between text-blue-600">
                        <span>Service:</span>
                        <span>+{formatCurrency(record.serviceCharge)}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-1">
                        <span>Total:</span>
                        <span>{formatCurrency(record.totalAmount)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)}
                        <span className="ml-1">{record.status}</span>
                      </span>
                      <div className="text-sm text-gray-500 mt-1">
                        Paid: {formatCurrency(record.paidAmount)}
                      </div>
                      {record.paidAmount < record.totalAmount && (
                        <div className="text-sm text-red-600">
                          Due: {formatCurrency(record.totalAmount - record.paidAmount)}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No billing records found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantBillingWOTReport;
