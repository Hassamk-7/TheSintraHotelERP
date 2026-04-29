import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  BuildingLibraryIcon,
  FunnelIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  UserIcon,
  CreditCardIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const HallGardenReservationSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [venueTypeFilter, setVenueTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [eventTypeFilter, setEventTypeFilter] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [amountRange, setAmountRange] = useState({ min: '', max: '' })

  const [reservations] = useState([
    {
      id: 1,
      reservationId: 'HGR-2024-001',
      customerName: 'Ahmed Wedding Services',
      contactPerson: 'Ahmed Hassan',
      phone: '+92-300-1234567',
      email: 'ahmed@weddingservices.com',
      venueType: 'Hall',
      venueName: 'Grand Ballroom',
      eventType: 'Wedding',
      eventDate: '2024-02-15',
      startTime: '18:00',
      endTime: '23:00',
      duration: 5,
      guestCount: 300,
      reservationDate: '2024-01-10',
      totalAmount: 150000,
      advanceAmount: 50000,
      balanceAmount: 100000,
      paymentStatus: 'Advance Paid',
      status: 'Confirmed',
      decorationRequired: true,
      cateringRequired: true,
      soundSystemRequired: true,
      specialRequests: 'Stage decoration with flowers',
      processedBy: 'Event Manager'
    },
    {
      id: 2,
      reservationId: 'HGR-2024-002',
      customerName: 'Corporate Solutions Ltd',
      contactPerson: 'Sarah Johnson',
      phone: '+92-321-9876543',
      email: 'sarah@corpsolutions.com',
      venueType: 'Hall',
      venueName: 'Conference Hall A',
      eventType: 'Conference',
      eventDate: '2024-02-20',
      startTime: '09:00',
      endTime: '17:00',
      duration: 8,
      guestCount: 150,
      reservationDate: '2024-01-15',
      totalAmount: 80000,
      advanceAmount: 80000,
      balanceAmount: 0,
      paymentStatus: 'Fully Paid',
      status: 'Confirmed',
      decorationRequired: false,
      cateringRequired: true,
      soundSystemRequired: true,
      specialRequests: 'Projector and screen setup',
      processedBy: 'Event Coordinator'
    },
    {
      id: 3,
      reservationId: 'HGR-2024-003',
      customerName: 'Ali Family',
      contactPerson: 'Ali Khan',
      phone: '+92-333-5555555',
      email: 'ali.khan@email.com',
      venueType: 'Garden',
      venueName: 'Rose Garden',
      eventType: 'Birthday Party',
      eventDate: '2024-02-25',
      startTime: '16:00',
      endTime: '20:00',
      duration: 4,
      guestCount: 80,
      reservationDate: '2024-01-20',
      totalAmount: 45000,
      advanceAmount: 15000,
      balanceAmount: 30000,
      paymentStatus: 'Advance Paid',
      status: 'Confirmed',
      decorationRequired: true,
      cateringRequired: true,
      soundSystemRequired: false,
      specialRequests: 'Kids play area setup',
      processedBy: 'Event Coordinator'
    },
    {
      id: 4,
      reservationId: 'HGR-2024-004',
      customerName: 'Tech Innovators',
      contactPerson: 'Emma Wilson',
      phone: '+92-300-7777777',
      email: 'emma@techinnovators.com',
      venueType: 'Hall',
      venueName: 'Executive Boardroom',
      eventDate: '2024-02-28',
      eventType: 'Product Launch',
      startTime: '14:00',
      endTime: '18:00',
      duration: 4,
      guestCount: 50,
      reservationDate: '2024-02-01',
      totalAmount: 35000,
      advanceAmount: 0,
      balanceAmount: 35000,
      paymentStatus: 'Unpaid',
      status: 'Pending',
      decorationRequired: true,
      cateringRequired: true,
      soundSystemRequired: true,
      specialRequests: 'Product display area',
      processedBy: 'Event Manager'
    },
    {
      id: 5,
      reservationId: 'HGR-2024-005',
      customerName: 'Usman Enterprises',
      contactPerson: 'Muhammad Usman',
      phone: '+92-321-1111111',
      email: 'usman@enterprises.com',
      venueType: 'Garden',
      venueName: 'Lawn Area',
      eventType: 'Corporate Dinner',
      eventDate: '2024-01-30',
      startTime: '19:00',
      endTime: '22:00',
      duration: 3,
      guestCount: 120,
      reservationDate: '2024-01-05',
      totalAmount: 65000,
      advanceAmount: 65000,
      balanceAmount: 0,
      paymentStatus: 'Fully Paid',
      status: 'Completed',
      decorationRequired: true,
      cateringRequired: true,
      soundSystemRequired: true,
      specialRequests: 'Outdoor lighting arrangement',
      processedBy: 'Event Manager'
    }
  ])

  const venueTypes = ['Hall', 'Garden', 'Rooftop', 'Poolside']
  const statuses = ['Confirmed', 'Pending', 'Completed', 'Cancelled']
  const eventTypes = ['Wedding', 'Conference', 'Birthday Party', 'Product Launch', 'Corporate Dinner', 'Anniversary']

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.reservationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.venueName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesVenueType = venueTypeFilter === '' || reservation.venueType === venueTypeFilter
    const matchesStatus = statusFilter === '' || reservation.status === statusFilter
    const matchesEventType = eventTypeFilter === '' || reservation.eventType === eventTypeFilter
    
    let matchesDateRange = true
    if (dateRange.start && dateRange.end) {
      const eventDate = new Date(reservation.eventDate)
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      matchesDateRange = eventDate >= startDate && eventDate <= endDate
    }
    
    let matchesAmountRange = true
    if (amountRange.min || amountRange.max) {
      const min = parseFloat(amountRange.min) || 0
      const max = parseFloat(amountRange.max) || Infinity
      matchesAmountRange = reservation.totalAmount >= min && reservation.totalAmount <= max
    }
    
    return matchesSearch && matchesVenueType && matchesStatus && matchesEventType && matchesDateRange && matchesAmountRange
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Completed': return 'bg-blue-100 text-blue-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'Fully Paid': return 'bg-green-100 text-green-800'
      case 'Advance Paid': return 'bg-blue-100 text-blue-800'
      case 'Unpaid': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getVenueTypeColor = (venueType) => {
    switch (venueType) {
      case 'Hall': return 'bg-purple-100 text-purple-800'
      case 'Garden': return 'bg-green-100 text-green-800'
      case 'Rooftop': return 'bg-blue-100 text-blue-800'
      case 'Poolside': return 'bg-cyan-100 text-cyan-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEventTypeColor = (eventType) => {
    switch (eventType) {
      case 'Wedding': return 'bg-pink-100 text-pink-800'
      case 'Conference': return 'bg-blue-100 text-blue-800'
      case 'Birthday Party': return 'bg-yellow-100 text-yellow-800'
      case 'Product Launch': return 'bg-purple-100 text-purple-800'
      case 'Corporate Dinner': return 'bg-indigo-100 text-indigo-800'
      case 'Anniversary': return 'bg-rose-100 text-rose-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const exportResults = () => {
    alert(`Exporting ${filteredReservations.length} hall/garden reservation records...`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setVenueTypeFilter('')
    setStatusFilter('')
    setEventTypeFilter('')
    setDateRange({ start: '', end: '' })
    setAmountRange({ min: '', max: '' })
  }

  // Calculate statistics
  const totalRecords = filteredReservations.length
  const confirmedReservations = filteredReservations.filter(r => r.status === 'Confirmed').length
  const completedReservations = filteredReservations.filter(r => r.status === 'Completed').length
  const totalRevenue = filteredReservations.reduce((sum, r) => sum + r.totalAmount, 0)
  const totalAdvance = filteredReservations.reduce((sum, r) => sum + r.advanceAmount, 0)
  const totalBalance = filteredReservations.reduce((sum, r) => sum + r.balanceAmount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Hall/Garden Reservation Search</h1>
            <p className="text-emerald-100">Search and manage venue reservations and event bookings</p>
          </div>
          <BuildingLibraryIcon className="h-12 w-12 text-emerald-200" />
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
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
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
              placeholder="Search reservations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={venueTypeFilter}
            onChange={(e) => setVenueTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Venue Types</option>
            {venueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Event Types</option>
            {eventTypes.map(type => (
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
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="date"
              placeholder="To Date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Amount"
              value={amountRange.min}
              onChange={(e) => setAmountRange({...amountRange, min: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="number"
              placeholder="Max Amount"
              value={amountRange.max}
              onChange={(e) => setAmountRange({...amountRange, max: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-emerald-100 rounded-lg p-3">
              <BuildingLibraryIcon className="h-6 w-6 text-emerald-600" />
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
              <p className="text-sm font-medium text-gray-600">Advance Received</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAdvance)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-lg p-3">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Balance Due</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">{confirmedReservations}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Venue Reservation Records</h3>
            <p className="text-gray-600">Found {filteredReservations.length} reservations</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <BuildingLibraryIcon className="h-4 w-4 mr-1" />
              Total: {reservations.length}
            </div>
            <div className="flex items-center">
              <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
              Filtered: {filteredReservations.length}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer & Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount & Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-emerald-100 rounded-full p-2 mr-3">
                        <UserIcon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{reservation.customerName}</div>
                        <div className="text-sm text-gray-500">{reservation.reservationId}</div>
                        <div className="text-sm text-gray-500">{reservation.contactPerson}</div>
                        <div className="text-sm text-gray-500">{reservation.phone}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEventTypeColor(reservation.eventType)}`}>
                          {reservation.eventType}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">{reservation.venueName}</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVenueTypeColor(reservation.venueType)}`}>
                        {reservation.venueType}
                      </span>
                      <div className="text-sm text-gray-500">Guests: {reservation.guestCount}</div>
                      <div className="text-sm text-gray-500">Duration: {reservation.duration} hours</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {reservation.eventDate}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.startTime} - {reservation.endTime}
                      </div>
                      <div className="text-sm text-gray-500">
                        Reserved: {reservation.reservationDate}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        Total: {formatCurrency(reservation.totalAmount)}
                      </div>
                      <div className="text-sm text-green-600">
                        Advance: {formatCurrency(reservation.advanceAmount)}
                      </div>
                      <div className="text-sm text-red-600">
                        Balance: {formatCurrency(reservation.balanceAmount)}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(reservation.paymentStatus)}`}>
                        {reservation.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap gap-1">
                        {reservation.decorationRequired && (
                          <span className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                            Decoration
                          </span>
                        )}
                        {reservation.cateringRequired && (
                          <span className="inline-flex px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                            Catering
                          </span>
                        )}
                        {reservation.soundSystemRequired && (
                          <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Sound System
                          </span>
                        )}
                      </div>
                      {reservation.specialRequests && (
                        <div className="text-sm text-blue-600">
                          {reservation.specialRequests}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        By: {reservation.processedBy}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReservations.length === 0 && (
          <div className="text-center py-12">
            <BuildingLibraryIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No reservations found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search criteria or date range.
            </p>
          </div>
        )}
      </div>

      {/* Additional Stats */}
      {filteredReservations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{completedReservations}</div>
              <div className="text-sm text-gray-600">Completed Events</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {totalRecords > 0 ? (filteredReservations.reduce((sum, r) => sum + r.guestCount, 0) / totalRecords).toFixed(0) : 0}
              </div>
              <div className="text-sm text-gray-600">Average Guests</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {totalRevenue > 0 ? ((totalAdvance / totalRevenue) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-gray-600">Advance Collection Rate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HallGardenReservationSearch;
