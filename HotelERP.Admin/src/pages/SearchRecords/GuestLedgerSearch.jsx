import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  UserIcon,
  FunnelIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  BanknotesIcon,
  HomeIcon
} from '@heroicons/react/24/outline'

const GuestLedgerSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [roomFilter, setRoomFilter] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [amountRange, setAmountRange] = useState({ min: '', max: '' })
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('')

  const [guestLedgers] = useState([
    {
      id: 1,
      guestId: 'GST-001',
      guestName: 'Ahmed Hassan',
      email: 'ahmed.hassan@email.com',
      phone: '+92-300-1234567',
      roomNumber: '101',
      checkInDate: '2024-01-10',
      checkOutDate: '2024-01-15',
      totalStay: 5,
      roomCharges: 75000,
      foodCharges: 12000,
      serviceCharges: 3000,
      laundryCharges: 1500,
      otherCharges: 2500,
      totalCharges: 94000,
      payments: 94000,
      balance: 0,
      status: 'Checked Out',
      paymentMethod: 'Credit Card',
      nationality: 'Pakistani',
      idType: 'CNIC',
      idNumber: '42101-1234567-1'
    },
    {
      id: 2,
      guestId: 'GST-002',
      guestName: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1-555-123-4567',
      roomNumber: '205',
      checkInDate: '2024-01-12',
      checkOutDate: '2024-01-18',
      totalStay: 6,
      roomCharges: 120000,
      foodCharges: 18000,
      serviceCharges: 4500,
      laundryCharges: 2000,
      otherCharges: 3000,
      totalCharges: 147500,
      payments: 100000,
      balance: 47500,
      status: 'Checked In',
      paymentMethod: 'Bank Transfer',
      nationality: 'American',
      idType: 'Passport',
      idNumber: 'US123456789'
    },
    {
      id: 3,
      guestId: 'GST-003',
      guestName: 'Ali Khan',
      email: 'ali.khan@email.com',
      phone: '+92-321-9876543',
      roomNumber: '301',
      checkInDate: '2024-01-14',
      checkOutDate: '2024-01-20',
      totalStay: 6,
      roomCharges: 90000,
      foodCharges: 15000,
      serviceCharges: 3750,
      laundryCharges: 1800,
      otherCharges: 2200,
      totalCharges: 112750,
      payments: 112750,
      balance: 0,
      status: 'Checked Out',
      paymentMethod: 'Cash',
      nationality: 'Pakistani',
      idType: 'CNIC',
      idNumber: '42101-9876543-2'
    },
    {
      id: 4,
      guestId: 'GST-004',
      guestName: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      phone: '+44-20-1234-5678',
      roomNumber: '102',
      checkInDate: '2024-01-16',
      checkOutDate: null,
      totalStay: 1,
      roomCharges: 25000,
      foodCharges: 4500,
      serviceCharges: 1125,
      laundryCharges: 0,
      otherCharges: 500,
      totalCharges: 31125,
      payments: 25000,
      balance: 6125,
      status: 'Checked In',
      paymentMethod: 'Credit Card',
      nationality: 'British',
      idType: 'Passport',
      idNumber: 'GB987654321'
    },
    {
      id: 5,
      guestId: 'GST-005',
      guestName: 'Muhammad Usman',
      email: 'usman@email.com',
      phone: '+92-333-5555555',
      roomNumber: '203',
      checkInDate: '2024-01-08',
      checkOutDate: '2024-01-12',
      totalStay: 4,
      roomCharges: 60000,
      foodCharges: 8000,
      serviceCharges: 2000,
      laundryCharges: 1200,
      otherCharges: 1500,
      totalCharges: 72700,
      payments: 70000,
      balance: 2700,
      status: 'Pending Payment',
      paymentMethod: 'Bank Transfer',
      nationality: 'Pakistani',
      idType: 'CNIC',
      idNumber: '42101-5555555-3'
    }
  ])

  const statuses = ['Checked In', 'Checked Out', 'Pending Payment', 'Cancelled']
  const rooms = ['101', '102', '203', '205', '301']
  const transactionTypes = ['Room Charges', 'Food Charges', 'Service Charges', 'Laundry Charges', 'Other Charges']

  const filteredLedgers = guestLedgers.filter(ledger => {
    const matchesSearch = ledger.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ledger.guestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ledger.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ledger.phone.includes(searchTerm) ||
                         ledger.idNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '' || ledger.status === statusFilter
    const matchesRoom = roomFilter === '' || ledger.roomNumber === roomFilter
    
    let matchesDateRange = true
    if (dateRange.start && dateRange.end) {
      const checkInDate = new Date(ledger.checkInDate)
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      matchesDateRange = checkInDate >= startDate && checkInDate <= endDate
    }
    
    let matchesAmountRange = true
    if (amountRange.min || amountRange.max) {
      const min = parseFloat(amountRange.min) || 0
      const max = parseFloat(amountRange.max) || Infinity
      matchesAmountRange = ledger.totalCharges >= min && ledger.totalCharges <= max
    }
    
    return matchesSearch && matchesStatus && matchesRoom && matchesDateRange && matchesAmountRange
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Checked In': return 'bg-blue-100 text-blue-800'
      case 'Checked Out': return 'bg-green-100 text-green-800'
      case 'Pending Payment': return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getNationalityColor = (nationality) => {
    switch (nationality) {
      case 'Pakistani': return 'bg-green-100 text-green-800'
      case 'American': return 'bg-blue-100 text-blue-800'
      case 'British': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const exportResults = () => {
    alert(`Exporting ${filteredLedgers.length} guest ledger records...`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    setRoomFilter('')
    setDateRange({ start: '', end: '' })
    setAmountRange({ min: '', max: '' })
    setTransactionTypeFilter('')
  }

  // Calculate statistics
  const totalRecords = filteredLedgers.length
  const checkedInGuests = filteredLedgers.filter(l => l.status === 'Checked In').length
  const checkedOutGuests = filteredLedgers.filter(l => l.status === 'Checked Out').length
  const totalRevenue = filteredLedgers.reduce((sum, l) => sum + l.totalCharges, 0)
  const totalPayments = filteredLedgers.reduce((sum, l) => sum + l.payments, 0)
  const totalOutstanding = filteredLedgers.reduce((sum, l) => sum + l.balance, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Guest Ledger Search</h1>
            <p className="text-teal-100">Search and analyze guest financial records and transactions</p>
          </div>
          <UserIcon className="h-12 w-12 text-teal-200" />
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
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Export Results
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search guests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Rooms</option>
            {rooms.map(room => (
              <option key={room} value={room}>Room {room}</option>
            ))}
          </select>

          <select
            value={transactionTypeFilter}
            onChange={(e) => setTransactionTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Transaction Types</option>
            {transactionTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex space-x-2">
            <input
              type="date"
              placeholder="From Date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="date"
              placeholder="To Date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Amount"
              value={amountRange.min}
              onChange={(e) => setAmountRange({...amountRange, min: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="number"
              placeholder="Max Amount"
              value={amountRange.max}
              onChange={(e) => setAmountRange({...amountRange, max: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-teal-100 rounded-lg p-3">
              <BanknotesIcon className="h-6 w-6 text-teal-600" />
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
              <CreditCardIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPayments)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <DocumentTextIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOutstanding)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Guests</p>
              <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Guest Ledger Records</h3>
            <p className="text-gray-600">Found {filteredLedgers.length} guest records</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-1" />
              Total: {guestLedgers.length}
            </div>
            <div className="flex items-center">
              <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
              Filtered: {filteredLedgers.length}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stay Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charges Breakdown</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLedgers.map((ledger) => (
                <tr key={ledger.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-teal-100 rounded-full p-2 mr-3">
                        <UserIcon className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{ledger.guestName}</div>
                        <div className="text-sm text-gray-500">{ledger.guestId}</div>
                        <div className="text-sm text-gray-500">{ledger.phone}</div>
                        <div className="text-sm text-gray-500">{ledger.email}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getNationalityColor(ledger.nationality)}`}>
                          {ledger.nationality}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <HomeIcon className="h-4 w-4 text-gray-400 mr-2" />
                        Room {ledger.roomNumber}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {ledger.checkInDate}
                      </div>
                      {ledger.checkOutDate && (
                        <div className="text-sm text-gray-500">
                          to {ledger.checkOutDate}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        {ledger.totalStay} night(s)
                      </div>
                      <div className="text-sm text-gray-500">
                        {ledger.idType}: {ledger.idNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">Room: {formatCurrency(ledger.roomCharges)}</div>
                      <div className="text-sm text-gray-500">Food: {formatCurrency(ledger.foodCharges)}</div>
                      <div className="text-sm text-gray-500">Service: {formatCurrency(ledger.serviceCharges)}</div>
                      <div className="text-sm text-gray-500">Laundry: {formatCurrency(ledger.laundryCharges)}</div>
                      <div className="text-sm text-gray-500">Other: {formatCurrency(ledger.otherCharges)}</div>
                      <div className="text-sm font-medium text-gray-900 border-t pt-1">
                        Total: {formatCurrency(ledger.totalCharges)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-green-600">
                        Paid: {formatCurrency(ledger.payments)}
                      </div>
                      <div className="text-sm text-gray-500">{ledger.paymentMethod}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm font-medium ${ledger.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {ledger.balance > 0 ? formatCurrency(ledger.balance) : 'Paid'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ledger.status)}`}>
                      {ledger.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLedgers.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No guest records found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search criteria or date range.
            </p>
          </div>
        )}
      </div>

      {/* Additional Stats */}
      {filteredLedgers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{checkedInGuests}</div>
              <div className="text-sm text-gray-600">Currently Checked In</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{checkedOutGuests}</div>
              <div className="text-sm text-gray-600">Checked Out</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {totalRecords > 0 ? formatCurrency(totalRevenue / totalRecords) : formatCurrency(0)}
              </div>
              <div className="text-sm text-gray-600">Average Bill</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GuestLedgerSearch;
