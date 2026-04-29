import React, { useState, useEffect } from 'react'
import axios from '../../utils/axios'
import {
  HomeIcon,
  UserGroupIcon,
  ClockIcon,
  CalendarDaysIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

const RoomTimeline = () => {
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewDays, setViewDays] = useState(30) // Default to monthly
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)

  useEffect(() => {
    fetchRoomsAndBookings()
  }, [selectedDate, viewDays])

  const fetchRoomsAndBookings = async () => {
    try {
      setLoading(true)
      
      // Fetch reservations from API
      const reservationsResponse = await axios.get('/reservations', { params: { page: 1, pageSize: 500 } })
      const reservations = reservationsResponse.data?.data || []

      const apiBookings = reservations.map((reservation) => ({
        id: reservation.id,
        roomId: reservation.roomId,
        roomNumber: reservation.room?.roomNumber || `Room ${reservation.roomId}`,
        guestName: reservation.guest?.fullName || reservation.guestName || `Guest ${reservation.guestId || 'Unknown'}`,
        checkInDate: reservation.checkInDate?.split('T')[0],
        checkOutDate: reservation.checkOutDate?.split('T')[0],
        status: reservation.status === 'CheckedIn'
          ? 'Occupied'
          : reservation.status === 'Confirmed'
          ? 'Reserved'
          : reservation.paymentStatus === 'Paid' || reservation.totalPaid >= reservation.totalAmount
          ? 'Booked'
          : reservation.totalPaid > 0
          ? 'Reserved'
          : 'Pending',
        amount: Number(reservation.totalAmount) || 0,
        phone: reservation.guest?.phone || reservation.guestPhone || '+92-300-0000000',
        email: reservation.guest?.email || reservation.guestEmail || '',
        adults: reservation.numberOfAdults || reservation.adults || 1,
        children: reservation.numberOfChildren || reservation.children || 0,
        checkInTime: '14:00',
        checkOutTime: '11:00',
        specialRequests: reservation.specialRequests || ''
      }))

      setBookings(apiBookings)
      console.log(`✅ Loaded ${apiBookings.length} timeline bookings from API`)

      const bookingRoomIds = Array.from(
        new Set(
          apiBookings
            .map((b) => b.roomId)
            .filter((id) => id !== null && id !== undefined)
        )
      )

      if (bookingRoomIds.length === 0) {
        setRooms([])
        return
      }

      // Fetch rooms from API and keep only ones with bookings
      const roomsResponse = await axios.get('/rooms', { params: { page: 1, pageSize: 500 } })
      const roomsResult = roomsResponse.data?.data || []

      const apiRooms = roomsResult.map((room) => ({
        id: room.id,
        roomNumber: room.roomNumber,
        roomType: room.roomType?.name || 'Standard',
        floor: room.floorNumber ?? room.floor ?? Math.ceil((room.id || 1) / 100),
        status: room.status || 'Available'
      }))

      const filteredRooms = apiRooms.filter((room) => bookingRoomIds.includes(room.id))

      setRooms(filteredRooms)
      console.log(`✅ Loaded ${filteredRooms.length} rooms from API (filtered to bookings)`)

    } catch (err) {
      console.error('❌ Error fetching timeline data:', err)
      setRooms([])
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  // Generate date range
  const generateDateRange = () => {
    const dates = []
    const current = new Date(selectedDate)
    
    for (let i = 0; i < viewDays; i++) {
      dates.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return dates
  }

  // Get booking for room on specific date
  const getBookingForRoomDate = (roomId, date) => {
    const dateStr = date.toISOString().split('T')[0]
    return bookings.find(booking => {
      if (booking.roomId !== roomId) return false
      const checkIn = new Date(booking.checkInDate)
      const checkOut = new Date(booking.checkOutDate)
      const currentDate = new Date(dateStr)
      return currentDate >= checkIn && currentDate < checkOut
    })
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Occupied': return 'bg-red-500 text-white border-red-600'
      case 'Reserved': return 'bg-yellow-500 text-white border-yellow-600'
      case 'Available': return 'bg-green-100 text-green-800 border-green-300'
      case 'Out of Order': return 'bg-gray-500 text-white border-gray-600'
      default: return 'bg-blue-100 text-blue-800 border-blue-300'
    }
  }

  // Get room type color
  const getRoomTypeColor = (roomType) => {
    switch (roomType) {
      case 'Standard': return 'bg-blue-100 text-blue-800'
      case 'Deluxe': return 'bg-purple-100 text-purple-800'
      case 'Suite': return 'bg-green-100 text-green-800'
      case 'Executive': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const dates = generateDateRange()
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl shadow-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
              <CalendarDaysIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Room Timeline</h1>
              <p className="text-purple-100">Professional booking timeline view like Booking.com</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* View Days Selector */}
            <div className="flex bg-white bg-opacity-20 rounded-lg p-1 backdrop-blur-sm">
              {[7, 14, 30].map((days) => (
                <button
                  key={days}
                  onClick={() => setViewDays(days)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewDays === days
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-white hover:text-purple-100'
                  }`}
                >
                  {days} Days
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowBookingModal(true)}
              className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg hover:bg-opacity-30 transition-colors flex items-center space-x-2 backdrop-blur-sm font-medium"
            >
              <PlusIcon className="w-5 h-5" />
              <span>New Booking</span>
            </button>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                const newDate = new Date(selectedDate)
                newDate.setDate(newDate.getDate() - viewDays)
                setSelectedDate(newDate)
              }}
              className="p-3 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors text-white"
            >
              ← Previous
            </button>
            <h2 className="text-2xl font-bold text-white">
              {selectedDate.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })} - {dates[dates.length - 1].toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </h2>
            <button
              onClick={() => {
                const newDate = new Date(selectedDate)
                newDate.setDate(newDate.getDate() + viewDays)
                setSelectedDate(newDate)
              }}
              className="p-3 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors text-white"
            >
              Next →
            </button>
          </div>
          
          <button
            onClick={() => setSelectedDate(new Date())}
            className="px-6 py-3 bg-white text-purple-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            Today
          </button>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 overflow-x-auto">
        {/* Header Row */}
        <div className="grid grid-cols-[200px_1fr] border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="p-4 font-bold text-gray-800 border-r bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-2">
              <HomeIcon className="w-5 h-5 text-blue-600" />
              <span>Rooms</span>
            </div>
          </div>
          <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${Math.min(viewDays, 30)}, minmax(0, 1fr))` }}>
            {dates.slice(0, viewDays).map((date, index) => {
              const isToday = date.toISOString().split('T')[0] === today
              return (
                <div
                  key={index}
                  className={`${viewDays <= 14 ? 'p-3' : 'p-1'} text-center border-r last:border-r-0 ${
                    isToday ? 'bg-gradient-to-b from-blue-100 to-blue-200 text-blue-800 font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {viewDays <= 14 ? (
                    <>
                      <div className="text-xs font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className={`text-lg ${isToday ? 'font-bold' : 'font-semibold'}`}>{date.getDate()}</div>
                      <div className="text-xs text-gray-500">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                    </>
                  ) : (
                    <>
                      <div className="text-xs font-medium">{date.getDate()}</div>
                      <div className="text-xs text-gray-500">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Room Rows */}
        <div className="max-h-[800px] overflow-y-auto">
          {rooms.map((room) => {
            // Get all bookings for this room
            const roomBookings = bookings.filter(b => b.roomId === room.id)
            
            return (
              <div key={room.id} className="grid grid-cols-[200px_1fr] border-b hover:bg-gray-50">
                {/* Room Info */}
                <div className="p-4 border-r bg-gradient-to-r from-slate-50 to-gray-50 sticky left-0">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2 mb-2">
                      <HomeIcon className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-lg text-gray-900">{room.roomNumber}</span>
                    </div>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${getRoomTypeColor(room.roomType)}`}>
                      {room.roomType}
                    </div>
                    <div className="text-xs text-gray-600">Floor {room.floor}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {roomBookings.length > 0 ? `${roomBookings.length} booking(s)` : 'Available'}
                    </div>
                  </div>
                </div>

                {/* Timeline Area */}
                <div className="relative min-h-[80px] bg-white">
                  {/* Date Grid Background */}
                  <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${Math.min(viewDays, 30)}, minmax(0, 1fr))` }}>
                    {dates.slice(0, viewDays).map((date, dateIndex) => {
                      const isToday = date.toISOString().split('T')[0] === today
                      return (
                        <div
                          key={dateIndex}
                          className={`border-r last:border-r-0 ${
                            isToday ? 'bg-blue-50' : ''
                          }`}
                        />
                      )
                    })}
                  </div>

                  {/* Booking Bars */}
                  {roomBookings.map((booking) => {
                    const checkInDate = new Date(booking.checkInDate)
                    const checkOutDate = new Date(booking.checkOutDate)
                    const startDate = dates[0]
                    const endDate = dates[dates.length - 1]
                    
                    // Calculate position and width
                    const dayWidth = 100 / viewDays // Each day width based on view
                    const startDay = Math.max(0, Math.floor((checkInDate - startDate) / (1000 * 60 * 60 * 24)))
                    const endDay = Math.min(viewDays, Math.ceil((checkOutDate - startDate) / (1000 * 60 * 60 * 24)))
                    const duration = endDay - startDay
                    
                    if (duration <= 0 || startDay >= viewDays || endDay <= 0) return null
                    
                    const leftPosition = (startDay / viewDays) * 100
                    const width = (duration / viewDays) * 100
                    
                    return (
                      <div
                        key={booking.id}
                        className={`absolute top-2 bottom-2 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg hover:z-10 ${
                          booking.status === 'Occupied' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                          booking.status === 'Reserved' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                          booking.status === 'Out of Order' ? 'bg-gradient-to-r from-gray-500 to-gray-600' :
                          'bg-gradient-to-r from-green-500 to-green-600'
                        } text-white`}
                        style={{
                          left: `${leftPosition}%`,
                          width: `${Math.max(width, 8)}%`, // Minimum width for visibility
                          zIndex: 1
                        }}
                        onClick={() => {
                          setSelectedBooking(booking)
                          setShowBookingModal(true)
                        }}
                        onMouseEnter={(e) => {
                          setSelectedBooking(booking)
                        }}
                        onMouseLeave={() => {
                          setSelectedBooking(null)
                        }}
                        title={`${booking.guestName} - ${booking.roomNumber}\nCheck-in: ${booking.checkInDate} ${booking.checkInTime}\nCheck-out: ${booking.checkOutDate} ${booking.checkOutTime}\nAmount: Rs ${(booking.amount || 0).toLocaleString()}\nPhone: ${booking.phone}`}
                      >
                        <div className="p-2 h-full flex flex-col justify-center">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold">
                              {booking.status === 'Out of Order' ? 'Maintenance' : booking.guestName}
                            </span>
                            {booking.status !== 'Out of Order' && (
                              <span className="text-xs opacity-90">
                                {booking.adults + booking.children} pax
                              </span>
                            )}
                          </div>
                          
                          <div className="text-xs opacity-90">
                            {booking.status === 'Occupied' && '🏠 Check-in'}
                            {booking.status === 'Reserved' && '📅 Reserved'}
                            {booking.status === 'Out of Order' && '🔧 OOO'}
                          </div>
                          
                          {booking.status !== 'Out of Order' && (
                            <div className="text-xs opacity-80 mt-1">
                              Rs {(booking.amount || 0).toLocaleString()}
                            </div>
                          )}
                          
                          {/* Check-in/Check-out indicators */}
                          <div className="flex justify-between text-xs opacity-75 mt-1">
                            <span>{booking.checkInTime || 'CI'}</span>
                            <span>{booking.checkOutTime || 'CO'}</span>
                          </div>
                        </div>
                        
                        {/* Status indicator on the left edge */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${
                          booking.status === 'Occupied' ? 'bg-red-700' :
                          booking.status === 'Reserved' ? 'bg-blue-700' :
                          booking.status === 'Out of Order' ? 'bg-gray-700' :
                          'bg-green-700'
                        }`} />
                      </div>
                    )
                  })}
                  
                  {/* Available space indicator */}
                  {roomBookings.length === 0 && (
                    <div className="absolute inset-2 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center">
                        <PlusIcon className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-xs">Available</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-700">Occupied</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-700">Reserved</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-sm text-gray-700">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
            <span className="text-sm text-gray-700">Out of Order</span>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>CI</strong> = Check-in | <strong>CO</strong> = Check-out | <strong>OOO</strong> = Out of Order</p>
          <p>Click on any booking to view details or click on available dates to create new bookings.</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Rooms</p>
              <p className="text-2xl font-bold text-gray-900">{rooms.length}</p>
            </div>
            <HomeIcon className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Occupied</p>
              <p className="text-2xl font-bold text-red-600">
                {bookings.filter(b => b.status === 'Occupied').length}
              </p>
            </div>
            <UserGroupIcon className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reserved</p>
              <p className="text-2xl font-bold text-yellow-600">
                {bookings.filter(b => b.status === 'Reserved').length}
              </p>
            </div>
            <ClockIcon className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {rooms.length > 0 ? Math.round((bookings.filter(b => b.status === 'Occupied').length / rooms.length) * 100) : 0}%
              </p>
            </div>
            <CalendarDaysIcon className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* New Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedBooking ? 'Booking Details' : 'New Booking'}
                </h3>
                <button
                  onClick={() => {
                    setShowBookingModal(false)
                    setSelectedBooking(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {selectedBooking ? (
                /* Booking Details View */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedBooking.guestName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedBooking.roomNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedBooking.checkInDate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedBooking.checkOutDate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <p className={`text-sm p-2 rounded ${
                        selectedBooking.status === 'Occupied' ? 'bg-red-100 text-red-800' :
                        selectedBooking.status === 'Reserved' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>{selectedBooking.status}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">Rs {(selectedBooking.amount || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedBooking.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedBooking.email || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {selectedBooking.specialRequests && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedBooking.specialRequests}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      onClick={() => {
                        // Redirect to reservations page
                        window.location.href = '/front-office/reservations'
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit Booking
                    </button>
                    <button
                      onClick={() => {
                        setShowBookingModal(false)
                        setSelectedBooking(null)
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                /* New Booking Form */
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    To create a new booking, you'll be redirected to the Reservations page.
                  </p>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        // Redirect to reservations page
                        window.location.href = '/front-office/reservations'
                      }}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span>Create New Booking</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowBookingModal(false)
                        setSelectedBooking(null)
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomTimeline;
