import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import {
  CurrencyDollarIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const RoomBillReport = () => {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    roomType: 'all',
    paymentStatus: 'all',
    guestType: 'all',
    searchTerm: ''
  });

  const [roomBills, setRoomBills] = useState([
    {
      id: 1,
      billNumber: 'RB001',
      guestName: 'Ahmed Ali',
      roomNumber: '205',
      roomType: 'Deluxe Room',
      checkInDate: '2024-01-15',
      checkOutDate: '2024-01-17',
      nights: 2,
      roomRate: 12000,
      roomCharges: 24000,
      extraBedCharges: 3000,
      extraPersonCharges: 2000,
      serviceCharges: 1500,
      subtotal: 30500,
      tax: 5185,
      discount: 0,
      totalAmount: 35685,
      paidAmount: 10000,
      balance: 25685,
      paymentStatus: 'Partial',
      guestType: 'Individual',
      nationality: 'Pakistani'
    },
    {
      id: 2,
      billNumber: 'RB002',
      guestName: 'Sarah Khan',
      roomNumber: '301',
      roomType: 'Executive Suite',
      checkInDate: '2024-01-12',
      checkOutDate: '2024-01-15',
      nights: 3,
      roomRate: 18000,
      roomCharges: 54000,
      extraBedCharges: 0,
      extraPersonCharges: 0,
      serviceCharges: 2700,
      subtotal: 56700,
      tax: 9639,
      discount: 5000,
      totalAmount: 61339,
      paidAmount: 61339,
      balance: 0,
      paymentStatus: 'Paid',
      guestType: 'Corporate',
      nationality: 'Pakistani'
    },
    {
      id: 3,
      billNumber: 'RB003',
      guestName: 'John Smith',
      roomNumber: '102',
      roomType: 'Standard Room',
      checkInDate: '2024-01-10',
      checkOutDate: '2024-01-14',
      nights: 4,
      roomRate: 8000,
      roomCharges: 32000,
      extraBedCharges: 4000,
      extraPersonCharges: 3000,
      serviceCharges: 2000,
      subtotal: 41000,
      tax: 6970,
      discount: 2000,
      totalAmount: 45970,
      paidAmount: 0,
      balance: 45970,
      paymentStatus: 'Unpaid',
      guestType: 'Tourist',
      nationality: 'American'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hotelInfo, setHotelInfo] = useState({
    name: 'Grand Palace Hotel',
    address: 'Main Boulevard, Gulberg III, Lahore',
    phone: '+92-42-1234567',
    email: 'info@grandpalace.pk',
    website: 'www.grandpalace.pk',
    logo: '/hotel-logo.png'
  });

  // Load data on component mount
  useEffect(() => {
    // API calls disabled to show mock data
    console.log('RoomBillReport component loaded with mock data:', roomBills.length, 'bills');
  }, []);

  // Fetch room bills - PURE API CALL
  const fetchRoomBills = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.roomType !== 'all') params.append('roomType', filters.roomType);
      if (filters.paymentStatus !== 'all') params.append('paymentStatus', filters.paymentStatus);
      if (filters.guestType !== 'all') params.append('guestType', filters.guestType);
      if (filters.searchTerm) params.append('search', filters.searchTerm);
      
      const response = await axios.get(`/api/Reports/room-bills?${params}`);
      
      if (response.data?.success) {
        setRoomBills(response.data.data);
      } else {
        setError('No room bills data received');
        setRoomBills([]);
      }
    } catch (err) {
      console.error('Error fetching room bills:', err);
      setError(err.response?.data?.message || 'Failed to load room bills');
      setRoomBills([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch hotel information - PURE API CALL
  const fetchHotelInfo = async () => {
    try {
      const response = await axios.get('/api/Settings/hotel-info');
      if (response.data?.success) {
        setHotelInfo(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching hotel info:', err);
    }
  };

  // Print report
  const handlePrint = () => {
    const printContent = document.getElementById('printable-report');
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Bill Date', 'Guest Name', 'Room Number', 'Room Type', 'Check-in', 'Check-out', 'Nights', 'Room Charges', 'Additional Charges', 'Tax', 'Total Amount', 'Payment Status'];
    const csvData = roomBills.map(bill => [
      bill.billDate,
      bill.guestName,
      bill.roomNumber,
      bill.roomType,
      bill.checkInDate,
      bill.checkOutDate,
      bill.nights,
      `Rs ${bill.roomCharges?.toLocaleString()}`,
      `Rs ${bill.additionalCharges?.toLocaleString()}`,
      `Rs ${bill.tax?.toLocaleString()}`,
      `Rs ${bill.totalAmount?.toLocaleString()}`,
      bill.paymentStatus
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `room-bill-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Filter records based on search term
  const filteredBills = roomBills.filter(bill =>
    bill.guestName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
    bill.roomNumber?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
    bill.billNumber?.toLowerCase().includes(filters.searchTerm.toLowerCase())
  );

  // Calculate totals
  const totalBills = filteredBills.length;
  const totalAmount = filteredBills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
  const totalRoomCharges = filteredBills.reduce((sum, bill) => sum + (bill.roomCharges || 0), 0);
  const totalTax = filteredBills.reduce((sum, bill) => sum + (bill.tax || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Room Bill Report</h1>
                <p className="text-gray-600">Guest room billing and revenue analytics</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handlePrint}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 transition-colors"
              >
                <PrinterIcon className="h-5 w-5" />
                <span>Print</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
              >
                <DocumentArrowDownIcon className="h-5 w-5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
              <select
                value={filters.roomType}
                onChange={(e) => setFilters({...filters, roomType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Room Types</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
                <option value="Presidential">Presidential</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select
                value={filters.paymentStatus}
                onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guest Type</label>
              <select
                value={filters.guestType}
                onChange={(e) => setFilters({...filters, guestType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Guest Types</option>
                <option value="Individual">Individual</option>
                <option value="Corporate">Corporate</option>
                <option value="Group">Group</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Search bills..."
                />
              </div>
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bills</p>
                <p className="text-2xl font-bold text-gray-900">{totalBills}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Room Charges</p>
                <p className="text-2xl font-bold text-gray-900">Rs {totalRoomCharges.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tax</p>
                <p className="text-2xl font-bold text-gray-900">Rs {totalTax.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">Rs {totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Printable Report */}
        <div id="printable-report">
          {/* Hotel Header for Print */}
          <div className="hidden print:block text-center mb-8">
            <h1 className="text-2xl font-bold">{hotelInfo?.name || 'Hotel Management System'}</h1>
            <p>{hotelInfo?.address || 'Hotel Address'}</p>
            <p>Phone: {hotelInfo?.phone || 'N/A'} | Email: {hotelInfo?.email || 'N/A'}</p>
            <hr className="my-4" />
            <h2 className="text-xl font-bold">Room Bill Report</h2>
            <p>Generated on: {new Date().toLocaleDateString()}</p>
            {(filters.dateFrom || filters.dateTo) && (
              <p>Period: {filters.dateFrom || 'Start'} to {filters.dateTo || 'End'}</p>
            )}
          </div>

          {/* Report Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stay Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nights</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Charges</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Additional</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="10" className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                          <span className="ml-2 text-gray-600">Loading room bills...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredBills.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="px-6 py-4 text-center text-gray-500">
                        No room bills found
                      </td>
                    </tr>
                  ) : (
                    filteredBills.map((bill) => (
                      <tr key={bill.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {bill.billDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{bill.guestName}</div>
                          <div className="text-sm text-gray-500">{bill.guestType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{bill.roomNumber}</div>
                          <div className="text-sm text-gray-500">{bill.roomType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{bill.checkInDate}</div>
                          <div className="text-gray-500">to {bill.checkOutDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {bill.nights}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Rs {bill.roomCharges?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Rs {bill.additionalCharges?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Rs {bill.tax?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          Rs {bill.totalAmount?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            bill.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                            bill.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            bill.paymentStatus === 'Partial' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {bill.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Print Footer */}
          <div className="hidden print:block mt-8 text-center text-sm text-gray-600">
            <p>This is a computer generated report from {hotelInfo?.name || 'Hotel Management System'}</p>
            <p>Generated on: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomBillReport;
