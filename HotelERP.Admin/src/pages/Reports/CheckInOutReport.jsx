import { useState } from 'react'
import {
  ArrowRightOnRectangleIcon,
  FunnelIcon,
  DocumentTextIcon,
  PrinterIcon,
  UserIcon,
  HomeIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const CheckInOutReport = () => {
  const [filters, setFilters] = useState({
    operationType: '',
    roomType: '',
    status: '',
    dateRange: { start: '', end: '' },
    withId: false
  })

  const [checkInOutRecords] = useState([
    {
      id: 1,
      transactionId: 'TXN-2024-001',
      operationType: 'Check In',
      guestName: 'Ahmed Hassan',
      guestId: 'GST-001',
      idType: 'CNIC',
      idNumber: '42101-1234567-1',
      roomNumber: '101',
      roomType: 'Deluxe',
      checkInDate: '2024-01-15',
      checkInTime: '14:30',
      expectedCheckOut: '2024-01-18',
      actualCheckOut: null,
      duration: 3,
      guestCount: 2,
      ratePerNight: 8500,
      totalAmount: 25500,
      advanceAmount: 10000,
      remainingAmount: 15500,
      status: 'Active',
      paymentMethod: 'Credit Card',
      specialRequests: 'Non-smoking room, Extra pillows',
      processedBy: 'Ahmed Khan',
      processedAt: '2024-01-15 14:30:00',
      nationality: 'Pakistani',
      contactNumber: '+92-300-1234567',
      email: 'ahmed.hassan@email.com'
    },
    {
      id: 2,
      transactionId: 'TXN-2024-002',
      operationType: 'Check Out',
      guestName: 'Sarah Johnson',
      guestId: 'GST-002',
      idType: 'Passport',
      idNumber: 'US123456789',
      roomNumber: '205',
      roomType: 'Suite',
      checkInDate: '2024-01-12',
      checkInTime: '15:00',
      expectedCheckOut: '2024-01-15',
      actualCheckOut: '2024-01-15',
      duration: 3,
      guestCount: 1,
      ratePerNight: 12000,
      totalAmount: 36000,
      advanceAmount: 15000,
      remainingAmount: 0,
      status: 'Completed',
      paymentMethod: 'Corporate Account',
      specialRequests: 'Late checkout, Business center access',
      processedBy: 'Fatima Sheikh',
      processedAt: '2024-01-15 12:00:00',
      nationality: 'American',
      contactNumber: '+1-555-123-4567',
      email: 'sarah.johnson@email.com'
    },
    {
      id: 3,
      transactionId: 'TXN-2024-003',
      operationType: 'Check In',
      guestName: 'Ali Khan',
      guestId: 'GST-003',
      idType: 'CNIC',
      idNumber: '42101-9876543-2',
      roomNumber: '301',
      roomType: 'Standard',
      checkInDate: '2024-01-18',
      checkInTime: '16:00',
      expectedCheckOut: '2024-01-20',
      actualCheckOut: null,
      duration: 2,
      guestCount: 3,
      ratePerNight: 6500,
      totalAmount: 13000,
      advanceAmount: 5000,
      remainingAmount: 8000,
      status: 'Active',
      paymentMethod: 'Cash',
      specialRequests: 'Ground floor room, Halal food only',
      processedBy: 'Omar Siddique',
      processedAt: '2024-01-18 16:00:00',
      nationality: 'Pakistani',
      contactNumber: '+92-321-9876543',
      email: 'ali.khan@email.com'
    },
    {
      id: 4,
      transactionId: 'TXN-2024-004',
      operationType: 'Check Out',
      guestName: 'Emma Wilson',
      guestId: 'GST-004',
      idType: 'Passport',
      idNumber: 'GB987654321',
      roomNumber: '102',
      roomType: 'Deluxe',
      checkInDate: '2024-01-10',
      checkInTime: '13:45',
      expectedCheckOut: '2024-01-14',
      actualCheckOut: '2024-01-14',
      duration: 4,
      guestCount: 2,
      ratePerNight: 8500,
      totalAmount: 34000,
      advanceAmount: 12000,
      remainingAmount: 0,
      status: 'Completed',
      paymentMethod: 'Credit Card',
      specialRequests: 'Baby cot, High floor room',
      processedBy: 'Ayesha Khan',
      processedAt: '2024-01-14 11:30:00',
      nationality: 'British',
      contactNumber: '+44-20-1234-5678',
      email: 'emma.wilson@email.com'
    },
    {
      id: 5,
      transactionId: 'TXN-2024-005',
      operationType: 'Check In',
      guestName: 'Hassan Ahmed',
      guestId: 'GST-005',
      idType: 'CNIC',
      idNumber: '42101-5555555-3',
      roomNumber: '203',
      roomType: 'Executive',
      checkInDate: '2024-01-20',
      checkInTime: '14:15',
      expectedCheckOut: '2024-01-22',
      actualCheckOut: null,
      duration: 2,
      guestCount: 1,
      ratePerNight: 10000,
      totalAmount: 20000,
      advanceAmount: 8000,
      remainingAmount: 12000,
      status: 'Active',
      paymentMethod: 'Bank Transfer',
      specialRequests: 'Executive lounge access, Early breakfast',
      processedBy: 'Sana Usman',
      processedAt: '2024-01-20 14:15:00',
      nationality: 'Pakistani',
      contactNumber: '+92-333-5555555',
      email: 'hassan@email.com'
    }
  ])

  const operationTypes = ['All Operations', 'Check In', 'Check Out']
  const roomTypes = ['All Room Types', 'Standard', 'Deluxe', 'Executive', 'Suite']
  const statuses = ['All Status', 'Active', 'Completed', 'Cancelled']

  const filteredRecords = checkInOutRecords.filter(record => {
    const matchesOperation = filters.operationType === '' || filters.operationType === 'All Operations' || record.operationType === filters.operationType
    const matchesRoomType = filters.roomType === '' || filters.roomType === 'All Room Types' || record.roomType === filters.roomType
    const matchesStatus = filters.status === '' || filters.status === 'All Status' || record.status === filters.status
    const matchesIdFilter = !filters.withId || (record.idType && record.idNumber)
    
    let matchesDateRange = true
    if (filters.dateRange.start && filters.dateRange.end) {
      const recordDate = new Date(record.checkInDate)
      const startDate = new Date(filters.dateRange.start)
      const endDate = new Date(filters.dateRange.end)
      matchesDateRange = recordDate >= startDate && recordDate <= endDate
    }

    return matchesOperation && matchesRoomType && matchesStatus && matchesIdFilter && matchesDateRange
  })

  const getOperationTypeColor = (operationType) => {
    switch (operationType) {
      case 'Check In': return 'bg-green-100 text-green-800'
      case 'Check Out': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Completed': return 'bg-blue-100 text-blue-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoomTypeColor = (roomType) => {
    switch (roomType) {
      case 'Standard': return 'bg-gray-100 text-gray-800'
      case 'Deluxe': return 'bg-blue-100 text-blue-800'
      case 'Executive': return 'bg-purple-100 text-purple-800'
      case 'Suite': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const exportReport = () => {
    alert(`Exporting check in/out report with ${filteredRecords.length} records...`)
  }

  const printReport = () => {
    window.print()
  }

  // Calculate statistics
  const totalRecords = filteredRecords.length
  const checkIns = filteredRecords.filter(r => r.operationType === 'Check In').length
  const checkOuts = filteredRecords.filter(r => r.operationType === 'Check Out').length
  const activeStays = filteredRecords.filter(r => r.status === 'Active').length
  const totalRevenue = filteredRecords.reduce((sum, r) => sum + r.totalAmount, 0)
  const totalAdvanceReceived = filteredRecords.reduce((sum, r) => sum + r.advanceAmount, 0)
  const totalPendingAmount = filteredRecords.reduce((sum, r) => sum + r.remainingAmount, 0)
  const averageStayDuration = totalRecords > 0 ? filteredRecords.reduce((sum, r) => sum + r.duration, 0) / totalRecords : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Check In/Out Report {filters.withId && '(with ID)'}</h1>
            <p className="text-blue-100">Track guest arrivals, departures, and room occupancy</p>
          </div>
          <ArrowRightOnRectangleIcon className="h-12 w-12 text-blue-200" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Report Filters
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={printReport}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </button>
            <button
              onClick={exportReport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Operation Type</label>
            <select
              value={filters.operationType}
              onChange={(e) => setFilters({...filters, operationType: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {operationTypes.map(type => (
                <option key={type} value={type === 'All Operations' ? '' : type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
            <select
              value={filters.roomType}
              onChange={(e) => setFilters({...filters, roomType: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {roomTypes.map(type => (
                <option key={type} value={type === 'All Room Types' ? '' : type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map(status => (
                <option key={status} value={status === 'All Status' ? '' : status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, start: e.target.value}})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, end: e.target.value}})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.withId}
              onChange={(e) => setFilters({...filters, withId: e.target.checked})}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Show only records with ID verification</span>
          </label>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <ArrowRightOnRectangleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Check Ins</p>
              <p className="text-2xl font-bold text-gray-900">{checkIns}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <ArrowRightOnRectangleIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Check Outs</p>
              <p className="text-2xl font-bold text-gray-900">{checkOuts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-lg p-3">
              <HomeIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Stays</p>
              <p className="text-2xl font-bold text-gray-900">{activeStays}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Check In/Out Records ({filteredRecords.length} records)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest & ID Information</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room & Stay Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In/Out Times</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Financial Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processing Info</th>
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
                        <div className="text-sm text-gray-500">{record.nationality}</div>
                        <div className="text-sm text-blue-600">{record.idType}: {record.idNumber}</div>
                        <div className="text-sm text-gray-500">{record.contactNumber}</div>
                        <div className="text-sm text-gray-500">{record.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <HomeIcon className="h-4 w-4 text-gray-400 mr-1" />
                        Room {record.roomNumber}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoomTypeColor(record.roomType)}`}>
                        {record.roomType}
                      </span>
                      <div className="text-sm text-gray-500">
                        Duration: {record.duration} nights
                      </div>
                      <div className="text-sm text-gray-500">
                        Guests: {record.guestCount}
                      </div>
                      <div className="text-sm text-gray-500">
                        Rate: {formatCurrency(record.ratePerNight)}/night
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOperationTypeColor(record.operationType)}`}>
                        {record.operationType}
                      </span>
                      <div className="flex items-center text-sm text-gray-900">
                        <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                        In: {record.checkInDate} {record.checkInTime}
                      </div>
                      <div className="text-sm text-gray-500">
                        Expected Out: {record.expectedCheckOut}
                      </div>
                      {record.actualCheckOut && (
                        <div className="text-sm text-blue-600">
                          Actual Out: {record.actualCheckOut}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-green-600">
                        Total: {formatCurrency(record.totalAmount)}
                      </div>
                      <div className="text-sm text-blue-600">
                        Advance: {formatCurrency(record.advanceAmount)}
                      </div>
                      <div className="text-sm text-orange-600">
                        Remaining: {formatCurrency(record.remainingAmount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Payment: {record.paymentMethod}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        Processed by: {record.processedBy}
                      </div>
                      <div className="text-sm text-gray-500">
                        {record.processedAt}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {record.transactionId}
                      </div>
                      {record.specialRequests && (
                        <div className="text-sm text-blue-600 italic">
                          "{record.specialRequests.substring(0, 30)}..."
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
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
            <ArrowRightOnRectangleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No check in/out records found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>

      {/* Summary Analytics */}
      {filteredRecords.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Revenue:</span>
                <span className="font-medium text-green-600">{formatCurrency(totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Advance Received:</span>
                <span className="font-medium">{formatCurrency(totalAdvanceReceived)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Amount:</span>
                <span className="font-medium text-orange-600">{formatCurrency(totalPendingAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Revenue per Stay:</span>
                <span className="font-medium">{formatCurrency(totalRevenue/totalRecords)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Occupancy Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Average Stay Duration:</span>
                <span className="font-medium">{averageStayDuration.toFixed(1)} nights</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check In Rate:</span>
                <span className="font-medium">{((checkIns/totalRecords)*100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check Out Rate:</span>
                <span className="font-medium">{((checkOuts/totalRecords)*100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Guests per Room:</span>
                <span className="font-medium">{(filteredRecords.reduce((sum, r) => sum + r.guestCount, 0) / totalRecords).toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckInOutReport;
