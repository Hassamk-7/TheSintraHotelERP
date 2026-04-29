import { useState } from 'react'
import {
  CalendarDaysIcon,
  FunnelIcon,
  DocumentTextIcon,
  PrinterIcon,
  HomeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const ReservationReport = () => {
  const [filters, setFilters] = useState({
    venueType: '',
    status: '',
    eventType: '',
    dateRange: { start: '', end: '' },
    amountRange: { min: '', max: '' }
  })

  const [reservations] = useState([
    {
      id: 1,
      reservationId: 'RES-2024-001',
      venueType: 'Hall',
      venueName: 'Grand Ballroom',
      guestName: 'Ahmed Hassan',
      guestPhone: '+92-300-1234567',
      guestEmail: 'ahmed.hassan@email.com',
      eventType: 'Wedding',
      eventDate: '2024-02-15',
      eventTime: '18:00',
      duration: 8,
      guestCount: 300,
      reservationDate: '2024-01-10',
      totalAmount: 150000,
      advanceAmount: 50000,
      remainingAmount: 100000,
      status: 'Confirmed',
      paymentStatus: 'Partial',
      specialRequests: 'Stage setup, Sound system, Floral decoration',
      cateringIncluded: true,
      cateringAmount: 75000,
      decorationIncluded: true,
      decorationAmount: 25000,
      equipmentRental: 15000,
      serviceCharges: 10000,
      taxes: 15000,
      contactPerson: 'Fatima Hassan',
      contactPhone: '+92-300-7654321'
    },
    {
      id: 2,
      reservationId: 'RES-2024-002',
      venueType: 'Garden',
      venueName: 'Rose Garden',
      guestName: 'Sarah Johnson',
      guestPhone: '+1-555-123-4567',
      guestEmail: 'sarah.johnson@email.com',
      eventType: 'Corporate Event',
      eventDate: '2024-02-20',
      eventTime: '14:00',
      duration: 6,
      guestCount: 150,
      reservationDate: '2024-01-15',
      totalAmount: 85000,
      advanceAmount: 25000,
      remainingAmount: 60000,
      status: 'Confirmed',
      paymentStatus: 'Partial',
      specialRequests: 'Outdoor seating, Weather backup plan',
      cateringIncluded: true,
      cateringAmount: 45000,
      decorationIncluded: false,
      decorationAmount: 0,
      equipmentRental: 12000,
      serviceCharges: 8000,
      taxes: 8500,
      contactPerson: 'John Johnson',
      contactPhone: '+1-555-987-6543'
    },
    {
      id: 3,
      reservationId: 'RES-2024-003',
      venueType: 'Room',
      venueName: 'Executive Suite',
      guestName: 'Ali Khan',
      guestPhone: '+92-321-9876543',
      guestEmail: 'ali.khan@email.com',
      eventType: 'Business Meeting',
      eventDate: '2024-01-25',
      eventTime: '10:00',
      duration: 4,
      guestCount: 20,
      reservationDate: '2024-01-20',
      totalAmount: 25000,
      advanceAmount: 25000,
      remainingAmount: 0,
      status: 'Completed',
      paymentStatus: 'Paid',
      specialRequests: 'Projector, Whiteboard, Coffee service',
      cateringIncluded: true,
      cateringAmount: 8000,
      decorationIncluded: false,
      decorationAmount: 0,
      equipmentRental: 5000,
      serviceCharges: 2000,
      taxes: 2500,
      contactPerson: 'Ali Khan',
      contactPhone: '+92-321-9876543'
    },
    {
      id: 4,
      reservationId: 'RES-2024-004',
      venueType: 'Hall',
      venueName: 'Crystal Hall',
      guestName: 'Emma Wilson',
      guestPhone: '+44-20-1234-5678',
      guestEmail: 'emma@weddingplanners.co.uk',
      eventType: 'Reception',
      eventDate: '2024-03-10',
      eventTime: '19:00',
      duration: 6,
      guestCount: 200,
      reservationDate: '2024-01-18',
      totalAmount: 120000,
      advanceAmount: 30000,
      remainingAmount: 90000,
      status: 'Pending',
      paymentStatus: 'Advance',
      specialRequests: 'Live music setup, Dance floor, Photography area',
      cateringIncluded: true,
      cateringAmount: 60000,
      decorationIncluded: true,
      decorationAmount: 20000,
      equipmentRental: 18000,
      serviceCharges: 10000,
      taxes: 12000,
      contactPerson: 'James Wilson',
      contactPhone: '+44-20-9876-5432'
    },
    {
      id: 5,
      reservationId: 'RES-2024-005',
      venueType: 'Garden',
      venueName: 'Sunset Garden',
      guestName: 'Hassan Ahmed',
      guestPhone: '+92-333-5555555',
      guestEmail: 'hassan@email.com',
      eventType: 'Birthday Party',
      eventDate: '2024-01-30',
      eventTime: '16:00',
      duration: 5,
      guestCount: 80,
      reservationDate: '2024-01-22',
      totalAmount: 45000,
      advanceAmount: 0,
      remainingAmount: 45000,
      status: 'Cancelled',
      paymentStatus: 'Unpaid',
      specialRequests: 'Kids play area, Balloon decoration',
      cateringIncluded: true,
      cateringAmount: 20000,
      decorationIncluded: true,
      decorationAmount: 8000,
      equipmentRental: 5000,
      serviceCharges: 4000,
      taxes: 4500,
      contactPerson: 'Sana Ahmed',
      contactPhone: '+92-333-1234567'
    }
  ])

  const venueTypes = ['All Venues', 'Hall', 'Garden', 'Room']
  const statuses = ['All Status', 'Confirmed', 'Pending', 'Completed', 'Cancelled']
  const eventTypes = ['All Events', 'Wedding', 'Corporate Event', 'Business Meeting', 'Reception', 'Birthday Party', 'Conference']

  const filteredReservations = reservations.filter(reservation => {
    const matchesVenue = filters.venueType === '' || filters.venueType === 'All Venues' || reservation.venueType === filters.venueType
    const matchesStatus = filters.status === '' || filters.status === 'All Status' || reservation.status === filters.status
    const matchesEventType = filters.eventType === '' || filters.eventType === 'All Events' || reservation.eventType === filters.eventType
    
    let matchesDateRange = true
    if (filters.dateRange.start && filters.dateRange.end) {
      const eventDate = new Date(reservation.eventDate)
      const startDate = new Date(filters.dateRange.start)
      const endDate = new Date(filters.dateRange.end)
      matchesDateRange = eventDate >= startDate && eventDate <= endDate
    }
    
    let matchesAmountRange = true
    if (filters.amountRange.min || filters.amountRange.max) {
      const min = parseFloat(filters.amountRange.min) || 0
      const max = parseFloat(filters.amountRange.max) || Infinity
      matchesAmountRange = reservation.totalAmount >= min && reservation.totalAmount <= max
    }

    return matchesVenue && matchesStatus && matchesEventType && matchesDateRange && matchesAmountRange
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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800'
      case 'Partial': return 'bg-yellow-100 text-yellow-800'
      case 'Advance': return 'bg-blue-100 text-blue-800'
      case 'Unpaid': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getVenueTypeColor = (venueType) => {
    switch (venueType) {
      case 'Hall': return 'bg-purple-100 text-purple-800'
      case 'Garden': return 'bg-green-100 text-green-800'
      case 'Room': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEventTypeColor = (eventType) => {
    switch (eventType) {
      case 'Wedding': return 'bg-pink-100 text-pink-800'
      case 'Corporate Event': return 'bg-indigo-100 text-indigo-800'
      case 'Business Meeting': return 'bg-gray-100 text-gray-800'
      case 'Reception': return 'bg-orange-100 text-orange-800'
      case 'Birthday Party': return 'bg-yellow-100 text-yellow-800'
      case 'Conference': return 'bg-cyan-100 text-cyan-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const exportReport = () => {
    alert(`Exporting reservation report with ${filteredReservations.length} reservations...`)
  }

  const printReport = () => {
    window.print()
  }

  // Calculate statistics
  const totalReservations = filteredReservations.length
  const confirmedReservations = filteredReservations.filter(r => r.status === 'Confirmed').length
  const completedReservations = filteredReservations.filter(r => r.status === 'Completed').length
  const totalRevenue = filteredReservations.reduce((sum, r) => sum + r.totalAmount, 0)
  const totalAdvanceReceived = filteredReservations.reduce((sum, r) => sum + r.advanceAmount, 0)
  const totalPendingAmount = filteredReservations.reduce((sum, r) => sum + r.remainingAmount, 0)
  const averageEventSize = totalReservations > 0 ? filteredReservations.reduce((sum, r) => sum + r.guestCount, 0) / totalReservations : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Garden/Hall/Room Reservation Report</h1>
            <p className="text-emerald-100">Track venue bookings and event management</p>
          </div>
          <CalendarDaysIcon className="h-12 w-12 text-emerald-200" />
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
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Venue Type</label>
            <select
              value={filters.venueType}
              onChange={(e) => setFilters({...filters, venueType: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {venueTypes.map(venue => (
                <option key={venue} value={venue === 'All Venues' ? '' : venue}>{venue}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {statuses.map(status => (
                <option key={status} value={status === 'All Status' ? '' : status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
            <select
              value={filters.eventType}
              onChange={(e) => setFilters({...filters, eventType: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {eventTypes.map(event => (
                <option key={event} value={event === 'All Events' ? '' : event}>{event}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, start: e.target.value}})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, end: e.target.value}})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-emerald-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-emerald-600" />
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
              <CalendarDaysIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">{confirmedReservations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <HomeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedReservations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Guests</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(averageEventSize)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Reservation Records ({filteredReservations.length} reservations)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reservation Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Information</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Financial Summary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services & Add-ons</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{reservation.reservationId}</div>
                      <div className="text-sm text-gray-500">Booked: {reservation.reservationDate}</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVenueTypeColor(reservation.venueType)}`}>
                        {reservation.venueType}
                      </span>
                      <div className="text-sm font-medium text-gray-900 mt-1">{reservation.venueName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEventTypeColor(reservation.eventType)}`}>
                        {reservation.eventType}
                      </span>
                      <div className="flex items-center text-sm text-gray-900">
                        <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-1" />
                        {reservation.eventDate}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                        {reservation.eventTime} ({reservation.duration}h)
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <UserGroupIcon className="h-4 w-4 text-gray-400 mr-1" />
                        {reservation.guestCount} guests
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">{reservation.guestName}</div>
                      <div className="text-sm text-gray-500">{reservation.guestPhone}</div>
                      <div className="text-sm text-gray-500">{reservation.guestEmail}</div>
                      <div className="text-sm text-blue-600">
                        Contact: {reservation.contactPerson}
                      </div>
                      <div className="text-sm text-gray-500">{reservation.contactPhone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-green-600">
                        Total: {formatCurrency(reservation.totalAmount)}
                      </div>
                      <div className="text-sm text-blue-600">
                        Advance: {formatCurrency(reservation.advanceAmount)}
                      </div>
                      <div className="text-sm text-orange-600">
                        Remaining: {formatCurrency(reservation.remainingAmount)}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(reservation.paymentStatus)}`}>
                        {reservation.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {reservation.cateringIncluded && (
                        <div className="text-sm text-green-600">
                          Catering: {formatCurrency(reservation.cateringAmount)}
                        </div>
                      )}
                      {reservation.decorationIncluded && (
                        <div className="text-sm text-purple-600">
                          Decoration: {formatCurrency(reservation.decorationAmount)}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        Equipment: {formatCurrency(reservation.equipmentRental)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Service: {formatCurrency(reservation.serviceCharges)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Tax: {formatCurrency(reservation.taxes)}
                      </div>
                      {reservation.specialRequests && (
                        <div className="text-sm text-blue-600 italic">
                          "{reservation.specialRequests.substring(0, 30)}..."
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
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
            <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No reservations found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>

      {/* Summary Analytics */}
      {filteredReservations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
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
                <span className="text-gray-600">Average Booking Value:</span>
                <span className="font-medium">{formatCurrency(totalRevenue/totalReservations)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Confirmation Rate:</span>
                <span className="font-medium">{((confirmedReservations/totalReservations)*100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completion Rate:</span>
                <span className="font-medium">{((completedReservations/totalReservations)*100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Event Duration:</span>
                <span className="font-medium">{(filteredReservations.reduce((sum, r) => sum + r.duration, 0) / totalReservations).toFixed(1)} hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Guest Count:</span>
                <span className="font-medium">{Math.round(averageEventSize)} guests</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReservationReport;
