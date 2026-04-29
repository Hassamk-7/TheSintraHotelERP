import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  HomeIcon,
  FunnelIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  UserIcon,
  ClockIcon,
  KeyIcon
} from '@heroicons/react/24/outline'

const CheckInOutSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [roomTypeFilter, setRoomTypeFilter] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [operationFilter, setOperationFilter] = useState('')

  const [checkInOutRecords] = useState([
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
      checkOutDate: '2024-01-15',
      checkOutTime: '11:45',
      plannedCheckOut: '2024-01-15',
      actualStay: 5,
      plannedStay: 5,
      adults: 2,
      children: 1,
      totalGuests: 3,
      nationality: 'Pakistani',
      idType: 'CNIC',
      idNumber: '42101-1234567-1',
      operation: 'Check Out',
      status: 'Completed',
      processedBy: 'Front Desk Agent',
      totalBill: 94000,
      paymentStatus: 'Paid'
    },
    {
      id: 2,
      guestId: 'GST-002',
      guestName: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1-555-123-4567',
      roomNumber: '205',
      roomType: 'Suite',
      checkInDate: '2024-01-12',
      checkInTime: '15:15',
      checkOutDate: null,
      checkOutTime: null,
      plannedCheckOut: '2024-01-18',
      actualStay: 5,
      plannedStay: 6,
      adults: 2,
      children: 0,
      totalGuests: 2,
      nationality: 'American',
      idType: 'Passport',
      idNumber: 'US123456789',
      operation: 'Check In',
      status: 'Active',
      processedBy: 'Front Desk Manager',
      totalBill: 147500,
      paymentStatus: 'Partial'
    },
    {
      id: 3,
      guestId: 'GST-003',
      guestName: 'Ali Khan',
      email: 'ali.khan@email.com',
      phone: '+92-321-9876543',
      roomNumber: '301',
      roomType: 'Standard',
      checkInDate: '2024-01-14',
      checkInTime: '16:00',
      checkOutDate: '2024-01-20',
      checkOutTime: '10:30',
      plannedCheckOut: '2024-01-20',
      actualStay: 6,
      plannedStay: 6,
      adults: 1,
      children: 0,
      totalGuests: 1,
      nationality: 'Pakistani',
      idType: 'CNIC',
      idNumber: '42101-9876543-2',
      operation: 'Check Out',
      status: 'Completed',
      processedBy: 'Front Desk Agent',
      totalBill: 112750,
      paymentStatus: 'Paid'
    },
    {
      id: 4,
      guestId: 'GST-004',
      guestName: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      phone: '+44-20-1234-5678',
      roomNumber: '102',
      roomType: 'Deluxe',
      checkInDate: '2024-01-16',
      checkInTime: '13:45',
      checkOutDate: null,
      checkOutTime: null,
      plannedCheckOut: '2024-01-19',
      actualStay: 1,
      plannedStay: 3,
      adults: 1,
      children: 1,
      totalGuests: 2,
      nationality: 'British',
      idType: 'Passport',
      idNumber: 'GB987654321',
      operation: 'Check In',
      status: 'Active',
      processedBy: 'Front Desk Agent',
      totalBill: 31125,
      paymentStatus: 'Advance'
    },
    {
      id: 5,
      guestId: 'GST-005',
      guestName: 'Muhammad Usman',
      email: 'usman@email.com',
      phone: '+92-333-5555555',
      roomNumber: '203',
      roomType: 'Standard',
      checkInDate: '2024-01-08',
      checkInTime: '14:20',
      checkOutDate: '2024-01-12',
      checkOutTime: '12:15',
      plannedCheckOut: '2024-01-12',
      actualStay: 4,
      plannedStay: 4,
      adults: 2,
      children: 2,
      totalGuests: 4,
      nationality: 'Pakistani',
      idType: 'CNIC',
      idNumber: '42101-5555555-3',
      operation: 'Check Out',
      status: 'Pending Payment',
      processedBy: 'Front Desk Manager',
      totalBill: 72700,
      paymentStatus: 'Pending'
    }
  ])

  const statuses = ['Active', 'Completed', 'Pending Payment', 'Cancelled']
  const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Executive']
  const operations = ['Check In', 'Check Out']

  const filteredRecords = checkInOutRecords.filter(record => {
    const matchesSearch = record.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.guestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.roomNumber.includes(searchTerm) ||
                         record.phone.includes(searchTerm) ||
                         record.idNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '' || record.status === statusFilter
    const matchesRoomType = roomTypeFilter === '' || record.roomType === roomTypeFilter
    const matchesOperation = operationFilter === '' || record.operation === operationFilter
    
    let matchesDateRange = true
    if (dateRange.start && dateRange.end) {
      const checkInDate = new Date(record.checkInDate)
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      matchesDateRange = checkInDate >= startDate && checkInDate <= endDate
    }
    
    return matchesSearch && matchesStatus && matchesRoomType && matchesOperation && matchesDateRange
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-blue-100 text-blue-800'
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Pending Payment': return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getOperationColor = (operation) => {
    switch (operation) {
      case 'Check In': return 'bg-green-100 text-green-800'
      case 'Check Out': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoomTypeColor = (roomType) => {
    switch (roomType) {
      case 'Standard': return 'bg-gray-100 text-gray-800'
      case 'Deluxe': return 'bg-blue-100 text-blue-800'
      case 'Suite': return 'bg-purple-100 text-purple-800'
      case 'Executive': return 'bg-gold-100 text-gold-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'Paid': return 'bg-green-100 text-green-800'
      case 'Partial': return 'bg-yellow-100 text-yellow-800'
      case 'Advance': return 'bg-blue-100 text-blue-800'
      case 'Pending': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const exportResults = () => {
    alert(`Exporting ${filteredRecords.length} check-in/out records...`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    setRoomTypeFilter('')
    setDateRange({ start: '', end: '' })
    setOperationFilter('')
  }

  // Calculate statistics
  const totalRecords = filteredRecords.length
  const activeCheckIns = filteredRecords.filter(r => r.status === 'Active').length
  const completedCheckOuts = filteredRecords.filter(r => r.status === 'Completed').length
  const totalRevenue = filteredRecords.reduce((sum, r) => sum + r.totalBill, 0)
  const totalGuests = filteredRecords.reduce((sum, r) => sum + r.totalGuests, 0)
  const avgStayDuration = filteredRecords.length > 0 ? 
    (filteredRecords.reduce((sum, r) => sum + r.actualStay, 0) / filteredRecords.length).toFixed(1) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Check In/Out Search</h1>
            <p className="text-blue-100">Search and track guest check-in and check-out records</p>
          </div>
          <HomeIcon className="h-12 w-12 text-blue-200" />
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Search Filters
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={exportResults}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Export Results
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={roomTypeFilter}
            onChange={(e) => setRoomTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Room Types</option>
            {roomTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={operationFilter}
            onChange={(e) => setOperationFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Operations</option>
            {operations.map(operation => (
              <option key={operation} value={operation}>{operation}</option>
            ))}
          </select>

          <div className="flex space-x-2">
            <input
              type="date"
              placeholder="From Date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              placeholder="To Date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <HomeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Check-ins</p>
              <p className="text-2xl font-bold text-gray-900">{activeCheckIns}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <KeyIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedCheckOuts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <UserIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Guests</p>
              <p className="text-2xl font-bold text-gray-900">{totalGuests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-lg p-3">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Stay</p>
              <p className="text-2xl font-bold text-gray-900">{avgStayDuration} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Check In/Out Records</h3>
            <p className="text-gray-600">Found {filteredRecords.length} records</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <HomeIcon className="h-4 w-4 mr-1" />
              Total: {checkInOutRecords.length}
            </div>
            <div className="flex items-center">
              <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
              Filtered: {filteredRecords.length}
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In/Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stay Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill & Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-full p-2 mr-3">
                        <UserIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.guestName}</div>
                        <div className="text-sm text-gray-500">{record.guestId}</div>
                        <div className="text-sm text-gray-500">{record.phone}</div>
                        <div className="text-sm text-gray-500">{record.nationality}</div>
                        <div className="text-sm text-gray-500">{record.idType}: {record.idNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <HomeIcon className="h-4 w-4 text-gray-400 mr-2" />
                        Room {record.roomNumber}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoomTypeColor(record.roomType)}`}>
                        {record.roomType}
                      </span>
                      <div className="text-sm text-gray-500">
                        Guests: {record.adults}A + {record.children}C = {record.totalGuests}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                        In: {record.checkInDate} {record.checkInTime}
                      </div>
                      {record.checkOutDate ? (
                        <div className="text-sm text-gray-900">
                          Out: {record.checkOutDate} {record.checkOutTime}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Expected: {record.plannedCheckOut}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {record.actualStay} night(s)
                      </div>
                      <div className="text-sm text-gray-500">
                        Planned: {record.plannedStay} night(s)
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(record.totalBill)}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(record.paymentStatus)}`}>
                        {record.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOperationColor(record.operation)}`}>
                      {record.operation}
                    </span>
                    <div className="text-sm text-gray-500 mt-1">by {record.processedBy}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <HomeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No records found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search criteria or date range.
            </p>
          </div>
        )}
      </div>

      {/* Additional Stats */}
      {filteredRecords.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalRecords > 0 ? formatCurrency(totalRevenue / totalRecords) : formatCurrency(0)}
              </div>
              <div className="text-sm text-gray-600">Average Bill</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {totalRecords > 0 ? (totalGuests / totalRecords).toFixed(1) : 0}
              </div>
              <div className="text-sm text-gray-600">Avg Guests per Booking</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckInOutSearch;
