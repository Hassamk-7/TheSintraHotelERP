import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import { 
  ArrowLeftOnRectangleIcon, 
  CalendarIcon, 
  UserIcon, 
  ClockIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  BuildingOffice2Icon,
  CurrencyDollarIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const CheckOutReport = () => {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    roomType: 'all',
    paymentStatus: 'all',
    searchTerm: ''
  });

  const [checkOutRecords, setCheckOutRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data for check-out records
  const mockCheckOutData = [
    {
      id: 1,
      checkOutNo: 'CO-2024-001',
      date: '2024-01-20',
      time: '12:30',
      guestName: 'Ahmed Hassan',
      guestPhone: '+92-300-1234567',
      roomNumber: '201',
      roomType: 'Deluxe',
      checkInDate: '2024-01-15',
      checkOutDate: '2024-01-20',
      actualCheckOut: '2024-01-20 12:30',
      nights: 5,
      adults: 2,
      children: 1,
      roomCharges: 40000,
      extraCharges: 7500,
      tax: 4750,
      serviceCharge: 2375,
      totalBill: 54625,
      discount: 2625,
      netAmount: 52000,
      advancePaid: 15000,
      balanceAmount: 37000,
      finalPayment: 37000,
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      feedback: 'Excellent service, will visit again',
      rating: 5,
      checkedOutBy: 'Front Office Manager',
      status: 'Completed'
    },
    {
      id: 2,
      checkOutNo: 'CO-2024-002',
      date: '2024-01-18',
      time: '11:45',
      guestName: 'Sarah Khan',
      guestPhone: '+92-321-9876543',
      roomNumber: '305',
      roomType: 'Suite',
      checkInDate: '2024-01-16',
      checkOutDate: '2024-01-18',
      actualCheckOut: '2024-01-18 14:00',
      nights: 2,
      adults: 1,
      children: 0,
      roomCharges: 30000,
      extraCharges: 9500,
      tax: 3950,
      serviceCharge: 1975,
      totalBill: 45425,
      discount: 1425,
      netAmount: 44000,
      advancePaid: 30000,
      balanceAmount: 14000,
      finalPayment: 14000,
      paymentMethod: 'Bank Transfer',
      paymentStatus: 'Paid',
      feedback: 'Good stay, room was clean and comfortable',
      rating: 4,
      checkedOutBy: 'Front Office Staff',
      status: 'Completed'
    },
    {
      id: 3,
      checkOutNo: 'CO-2024-003',
      date: '2024-01-19',
      time: '10:15',
      guestName: 'Ali Raza',
      guestPhone: '+92-333-5555666',
      roomNumber: '108',
      roomType: 'Standard',
      checkInDate: '2024-01-17',
      checkOutDate: '2024-01-19',
      actualCheckOut: '2024-01-19 10:15',
      nights: 2,
      adults: 1,
      children: 0,
      roomCharges: 10000,
      extraCharges: 1300,
      tax: 1130,
      serviceCharge: 565,
      totalBill: 12995,
      discount: 995,
      netAmount: 12000,
      advancePaid: 5000,
      balanceAmount: 7000,
      finalPayment: 7000,
      paymentMethod: 'Cash',
      paymentStatus: 'Paid',
      feedback: 'Average experience, could be better',
      rating: 3,
      checkedOutBy: 'Front Office Staff',
      status: 'Completed'
    },
    {
      id: 4,
      checkOutNo: 'CO-2024-004',
      date: '2024-01-22',
      time: '13:20',
      guestName: 'Fatima Sheikh',
      guestPhone: '+92-345-7777888',
      roomNumber: '412',
      roomType: 'Executive',
      checkInDate: '2024-01-18',
      checkOutDate: '2024-01-22',
      actualCheckOut: '2024-01-22 15:30',
      nights: 4,
      adults: 2,
      children: 2,
      roomCharges: 48000,
      extraCharges: 13000,
      tax: 6100,
      serviceCharge: 3050,
      totalBill: 70150,
      discount: 2150,
      netAmount: 68000,
      advancePaid: 20000,
      balanceAmount: 48000,
      finalPayment: 30000,
      paymentMethod: 'Partial Payment',
      paymentStatus: 'Partial',
      feedback: 'Great facilities for family, kids loved the pool',
      rating: 4,
      checkedOutBy: 'Front Office Manager',
      status: 'Partial Payment'
    }
  ];

  useEffect(() => {
    fetchCheckOutRecords();
  }, [filters.dateFrom, filters.dateTo]);

  // Fetch check-out records from API
  const fetchCheckOutRecords = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.roomType !== 'all') params.append('roomType', filters.roomType);
      if (filters.paymentStatus !== 'all') params.append('paymentStatus', filters.paymentStatus);
      
      const response = await axios.get(`/Reports/check-out-report?${params}`);
      if (response.data?.success) {
        setCheckOutRecords(response.data.data);
      } else {
        setError('Failed to load check-out records');
        setCheckOutRecords(mockCheckOutData);
      }
    } catch (err) {
      console.error('Error fetching check-out records:', err);
      setError('Failed to load check-out records');
      setCheckOutRecords(mockCheckOutData);
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

  const filteredRecords = checkOutRecords.filter(record => {
    const matchesDateFrom = !filters.dateFrom || record.date >= filters.dateFrom;
    const matchesDateTo = !filters.dateTo || record.date <= filters.dateTo;
    const matchesRoomType = filters.roomType === 'all' || record.roomType.toLowerCase() === filters.roomType.toLowerCase();
    const matchesPaymentStatus = filters.paymentStatus === 'all' || record.paymentStatus.toLowerCase() === filters.paymentStatus.toLowerCase();
    const matchesSearch = !filters.searchTerm || 
      record.checkOutNo.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.guestName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.roomNumber.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.guestPhone.includes(filters.searchTerm);

    return matchesDateFrom && matchesDateTo && matchesRoomType && matchesPaymentStatus && matchesSearch;
  });

  const formatCurrency = (amount) => {
    return `Rs ${amount.toLocaleString()}`;
  };

  const getRoomTypeColor = (type) => {
    switch (type) {
      case 'Standard': return 'text-blue-600 bg-blue-100';
      case 'Deluxe': return 'text-green-600 bg-green-100';
      case 'Executive': return 'text-purple-600 bg-purple-100';
      case 'Suite': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'text-green-600 bg-green-100';
      case 'Partial': return 'text-yellow-600 bg-yellow-100';
      case 'Unpaid': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Pending Payment': return 'text-yellow-600 bg-yellow-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
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
        <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>
      </div>
    );
  };

  const calculateTotals = () => {
    return filteredRecords.reduce((acc, record) => ({
      totalCheckOuts: acc.totalCheckOuts + 1,
      totalNights: acc.totalNights + record.nights,
      totalGuests: acc.totalGuests + record.adults + record.children,
      totalRevenue: acc.totalRevenue + record.netAmount,
      totalAdvancePaid: acc.totalAdvancePaid + record.advancePaid,
      totalFinalPayment: acc.totalFinalPayment + record.finalPayment,
      totalOutstanding: acc.totalOutstanding + (record.balanceAmount - record.finalPayment),
      averageRating: acc.averageRating + record.rating,
      paidCheckOuts: acc.paidCheckOuts + (record.paymentStatus === 'Paid' ? 1 : 0)
    }), { 
      totalCheckOuts: 0, 
      totalNights: 0,
      totalGuests: 0,
      totalRevenue: 0,
      totalAdvancePaid: 0,
      totalFinalPayment: 0,
      totalOutstanding: 0,
      averageRating: 0,
      paidCheckOuts: 0
    });
  };

  const totals = calculateTotals();
  const avgRating = filteredRecords.length > 0 ? (totals.averageRating / filteredRecords.length).toFixed(1) : 0;

  const handleExport = () => {
    console.log('Exporting check-out report...');
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
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ArrowLeftOnRectangleIcon className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">Check Out Report</h1>
              <p className="text-red-100">Guest check-out records and departure tracking</p>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
            <select
              value={filters.roomType}
              onChange={(e) => handleFilterChange('roomType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="executive">Executive</option>
              <option value="suite">Suite</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <select
              value={filters.paymentStatus}
              onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Check-out No, Guest, Room..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
              <p className="text-blue-100 text-sm font-medium">Total Check-outs</p>
              <p className="text-2xl font-bold">{totals.totalCheckOuts}</p>
            </div>
            <ArrowLeftOnRectangleIcon className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(totals.totalRevenue)}</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Avg Rating</p>
              <p className="text-2xl font-bold">{avgRating}/5</p>
            </div>
            <StarIcon className="h-8 w-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Outstanding</p>
              <p className="text-2xl font-bold">{formatCurrency(totals.totalOutstanding)}</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-red-200" />
          </div>
        </div>
      </div>

      {/* Check-out Records Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Check-out Records</h2>
          <p className="text-sm text-gray-600">Showing {filteredRecords.length} of {checkOutRecords.length} records</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest & Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Summary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback & Rating</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.checkOutNo}</div>
                      <div className="text-sm text-gray-500 flex items-center space-x-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{record.date}</span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{record.time}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        By: {record.checkedOutBy}
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 flex items-center space-x-1">
                        <UserIcon className="h-4 w-4" />
                        <span>{record.guestName}</span>
                      </div>
                      <div className="text-sm text-gray-500">{record.guestPhone}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm font-medium text-gray-900">Room {record.roomNumber}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoomTypeColor(record.roomType)}`}>
                          <BuildingOffice2Icon className="h-3 w-3 mr-1" />
                          {record.roomType}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {record.nights} nights | {record.adults + record.children} guests
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Room:</span>
                        <span>{formatCurrency(record.roomCharges)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Extra:</span>
                        <span>{formatCurrency(record.extraCharges)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>{formatCurrency(record.tax)}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-{formatCurrency(record.discount)}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-1">
                        <span>Net:</span>
                        <span>{formatCurrency(record.netAmount)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(record.paymentStatus)}`}>
                        {record.paymentStatus}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">
                        Advance: {formatCurrency(record.advancePaid)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Final: {formatCurrency(record.finalPayment)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Method: {record.paymentMethod}
                      </div>
                      {record.balanceAmount > record.finalPayment && (
                        <div className="text-sm text-red-600">
                          Due: {formatCurrency(record.balanceAmount - record.finalPayment)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      {renderStars(record.rating)}
                      <div className="text-sm text-gray-600 mt-2">
                        {record.feedback}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <ArrowLeftOnRectangleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No check-out records found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckOutReport;
