import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UserPlusIcon,
  CalendarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const CheckInReport = () => {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    roomType: 'all',
    guestType: 'all',
    searchTerm: ''
  });

  const [checkInRecords, setCheckInRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hotelInfo, setHotelInfo] = useState(null);

  // Load data on component mount
  useEffect(() => {
    fetchCheckInRecords();
    fetchHotelInfo();
  }, [filters.dateFrom, filters.dateTo, filters.roomType, filters.guestType]);

  // Fetch check-in records - PURE API CALL
  const fetchCheckInRecords = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.roomType !== 'all') params.append('roomType', filters.roomType);
      if (filters.guestType !== 'all') params.append('guestType', filters.guestType);
      if (filters.searchTerm) params.append('search', filters.searchTerm);
      
      const response = await axios.get(`/api/Reports/check-in-records?${params}`);
      
      if (response.data?.success) {
        setCheckInRecords(response.data.data);
      } else {
        setError('No check-in records data received');
        setCheckInRecords([]);
      }
    } catch (err) {
      console.error('Error fetching check-in records:', err);
      setError(err.response?.data?.message || 'Failed to load check-in records');
      setCheckInRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch hotel information - PURE API CALL
  const fetchHotelInfo = async () => {
    try {
      const response = await axios.get('/Settings/hotel-info');
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
    const headers = ['Check-in Date', 'Guest Name', 'Room Number', 'Room Type', 'Check-in Time', 'Guest Type', 'Phone', 'Total Amount'];
    const csvData = checkInRecords.map(record => [
      record.checkInDate,
      record.guestName,
      record.roomNumber,
      record.roomType,
      record.checkInTime,
      record.guestType,
      record.phone,
      `Rs ${record.totalAmount?.toLocaleString()}`
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `check-in-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Filter records based on search term
  const filteredRecords = checkInRecords.filter(record =>
    record.guestName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
    record.roomNumber?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
    record.phone?.includes(filters.searchTerm)
  );

  // Calculate totals
  const totalRecords = filteredRecords.length;
  const totalAmount = filteredRecords.reduce((sum, record) => sum + (record.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <UserPlusIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Check-In Report</h1>
                <p className="text-gray-600">Guest check-in records and analytics</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handlePrint}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
              >
                <PrinterIcon className="h-5 w-5" />
                <span>Print</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 transition-colors"
              >
                <DocumentArrowDownIcon className="h-5 w-5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
              <select
                value={filters.roomType}
                onChange={(e) => setFilters({...filters, roomType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Room Types</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
                <option value="Presidential">Presidential</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guest Type</label>
              <select
                value={filters.guestType}
                onChange={(e) => setFilters({...filters, guestType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search guests..."
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <UserPlusIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Check-ins</p>
                <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">Rs {totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average per Check-in</p>
                <p className="text-2xl font-bold text-gray-900">
                  Rs {totalRecords > 0 ? Math.round(totalAmount / totalRecords).toLocaleString() : '0'}
                </p>
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
            <h2 className="text-xl font-bold">Check-In Report</h2>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span className="ml-2 text-gray-600">Loading check-in records...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                        No check-in records found
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.checkInDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{record.guestName}</div>
                          <div className="text-sm text-gray-500">{record.nationality}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.roomNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {record.roomType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {record.checkInTime}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            record.guestType === 'VIP' ? 'bg-purple-100 text-purple-800' :
                            record.guestType === 'Corporate' ? 'bg-green-100 text-green-800' :
                            record.guestType === 'Group' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {record.guestType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Rs {record.totalAmount?.toLocaleString()}
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

export default CheckInReport;
