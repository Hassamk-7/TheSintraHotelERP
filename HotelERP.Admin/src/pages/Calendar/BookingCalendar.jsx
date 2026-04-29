import React, { useState, useEffect } from 'react'
import axios from '../../utils/axios'
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  HomeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  PhoneIcon,
  EnvelopeIcon,
  IdentificationIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const BookingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [hoveredBooking, setHoveredBooking] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [bookings, setBookings] = useState([])
  const [rooms, setRooms] = useState([])
  const [viewMode, setViewMode] = useState('month') // 'month', 'week', 'day'
  const [showNewBookingModal, setShowNewBookingModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

  const getWeekStart = (d) => {
    const date = startOfDay(d)
    date.setDate(date.getDate() - date.getDay())
    return date
  }

  const getMonthStart = (d) => new Date(d.getFullYear(), d.getMonth(), 1)

  const getPeriodConfig = (mode, date) => {
    if (mode === 'month') {
      const periodStart = getMonthStart(date)
      const periodEnd = new Date(periodStart.getFullYear(), periodStart.getMonth() + 1, 0)
      const totalDays = periodEnd.getDate()
      const daysToShow = []
      for (let i = 0; i < totalDays; i++) {
        const day = new Date(periodStart)
        day.setDate(periodStart.getDate() + i)
        daysToShow.push(day)
      }
      return { periodStart, totalDays, daysToShow }
    }

    if (mode === 'week') {
      const periodStart = getWeekStart(date)
      const totalDays = 7
      const daysToShow = []
      for (let i = 0; i < totalDays; i++) {
        const day = new Date(periodStart)
        day.setDate(periodStart.getDate() + i)
        daysToShow.push(day)
      }
      return { periodStart, totalDays, daysToShow }
    }

    // day
    const periodStart = startOfDay(date)
    const totalDays = 1
    return { periodStart, totalDays, daysToShow: [periodStart] }
  }

  // Load calendar data on component mount
  useEffect(() => {
    fetchCalendarData()
  }, [currentDate])

  // Fetch calendar bookings data (real API; only rooms with bookings)
  const fetchCalendarData = async () => {
    try {
      setLoading(true)

      const [reservationsRes, checkInsRes, checkOutsRes] = await Promise.all([
        axios.get('/reservations', { params: { page: 1, pageSize: 500 } }),
        axios.get('/checkins', { params: { page: 1, pageSize: 500 } }),
        axios.get('/checkouts', { params: { page: 1, pageSize: 500 } })
      ])

      const reservations = reservationsRes.data?.data || []
      const checkIns = checkInsRes.data?.data || []
      const checkOuts = checkOutsRes.data?.data || []

      const checkInMap = new Map()
      const checkOutMap = new Map()

      checkIns.forEach((c) => {
        if (c.reservationId) {
          checkInMap.set(c.reservationId, c)
        }
      })

      checkOuts.forEach((co) => {
        if (co.checkIn?.reservationId) {
          checkOutMap.set(co.checkIn.reservationId, co)
        }
      })

      const transformedBookings = reservations.map((reservation) => {
        const checkIn = checkInMap.get(reservation.id)
        const checkOut = checkOutMap.get(reservation.id)

        let status = 'Reserved'
        if (checkOut) {
          status = reservation.paymentStatus === 'Paid' || reservation.totalPaid >= reservation.totalAmount
            ? 'Booked'
            : 'Pending'
        } else if (checkIn) {
          status = 'Occupied'
        } else if (reservation.paymentStatus === 'Paid' || reservation.totalPaid >= reservation.totalAmount) {
          status = 'Booked'
        } else if (reservation.totalPaid > 0) {
          status = 'Reserved'
        } else {
          status = 'Pending'
        }

        return {
          id: reservation.id,
          roomId: reservation.roomId,
          roomNumber: reservation.room?.roomNumber || reservation.roomNumber || `Room ${reservation.roomId || 'N/A'}`,
          roomType: reservation.room?.roomType?.name || reservation.roomType || 'Standard',
          guestName: reservation.guest?.fullName || reservation.guestName || `Guest ${reservation.guestId || 'Unknown'}`,
          checkInDate: reservation.checkInDate?.split('T')[0] || reservation.checkInDate,
          checkOutDate: reservation.checkOutDate?.split('T')[0] || reservation.checkOutDate,
          status,
          phone: reservation.guest?.phone || reservation.guestPhone || '+92-300-0000000',
          email: reservation.guest?.email || reservation.guestEmail || 'guest@hotel.com',
          adults: reservation.numberOfAdults || reservation.adults || 2,
          children: reservation.numberOfChildren || reservation.children || 0,
          totalAmount: reservation.totalAmount || 0,
          paidAmount: reservation.totalPaid || 0,
          source: reservation.source || 'Direct Booking',
          specialRequests: reservation.specialRequests || '',
          nationality: reservation.nationality || 'Pakistani',
          idType: 'CNIC',
          idNumber: '',
          paymentStatus: reservation.paymentStatus,
          hasCheckIn: !!checkIn,
          hasCheckOut: !!checkOut
        }
      })

      setBookings(transformedBookings)

      const bookingRoomIds = Array.from(
        new Set(
          transformedBookings
            .map((b) => b.roomId)
            .filter((id) => id !== null && id !== undefined)
        )
      )
      await fetchRooms(bookingRoomIds)
    } catch (err) {
      console.error('❌ Error loading calendar data:', err)
      setBookings([])
      setRooms([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch rooms data (real API, filtered to rooms that appear in bookings)
  const fetchRooms = async (bookingRoomIds = []) => {
    try {
      if (bookingRoomIds.length === 0) {
        setRooms([])
        return
      }

      const res = await axios.get('/rooms', { params: { page: 1, pageSize: 500 } })
      const apiRooms = res.data?.data || []
      const normalized = apiRooms.map((room) => ({
        id: room.id,
        roomNumber: room.roomNumber,
        roomType: room.roomType?.name || 'Standard',
        floor: room.floorNumber ?? room.floor ?? Math.ceil((room.id || 1) / 100),
        status: room.status || 'Available'
      }))

      const filtered = normalized.filter((r) => bookingRoomIds.includes(r.id))
      setRooms(filtered)
    } catch (err) {
      console.error('Error fetching rooms:', err)
      setRooms([])
    }
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Occupied': return 'bg-red-500 text-white'        // Currently checked in
      case 'Booked': return 'bg-green-500 text-white'        // Fully paid bookings
      case 'Reserved': return 'bg-yellow-500 text-white'     // Reserved but not checked in
      case 'Pending': return 'bg-orange-500 text-white'      // Pending payment
      case 'Available': return 'bg-blue-500 text-white'      // Available rooms
      case 'Out of Order': return 'bg-gray-500 text-white'   // Maintenance
      default: return 'bg-blue-500 text-white'
    }
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Occupied': return <UserGroupIcon className="w-4 h-4" />
      case 'Booked': return <CheckCircleIcon className="w-4 h-4" />
      case 'Reserved': return <ClockIcon className="w-4 h-4" />
      case 'Pending': return <ExclamationTriangleIcon className="w-4 h-4" />
      case 'Available': return <HomeIcon className="w-4 h-4" />
      case 'Out of Order': return <XCircleIcon className="w-4 h-4" />
      default: return <HomeIcon className="w-4 h-4" />
    }
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const current = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }

  // Get unique bookings that should be displayed as spanning bars with layer management
  const getSpanningBookings = () => {
    const days = generateCalendarDays()
    const spanningBookings = []
    
    // Group bookings by unique booking ID to avoid duplicates
    const processedBookings = new Set()
    
    // Track layers for each calendar position to stack overlapping bookings
    const layerTracker = {}
    
    bookings.forEach(booking => {
      if (processedBookings.has(booking.id)) return
      processedBookings.add(booking.id)
      
      const checkIn = new Date(booking.checkInDate)
      const checkOut = new Date(booking.checkOutDate)
      
      // Find the start position in the calendar grid
      let startIndex = -1
      for (let i = 0; i < days.length; i++) {
        if (days[i].toDateString() === checkIn.toDateString()) {
          startIndex = i
          break
        }
      }
      
      if (startIndex === -1) return // Booking not in current view
      
      // Calculate how many days the booking spans in the current view
      let spanDays = 0
      const startRow = Math.floor(startIndex / 7)
      const startCol = startIndex % 7
      
      for (let i = startIndex; i < days.length; i++) {
        const currentDay = days[i]
        if (currentDay >= checkIn && currentDay < checkOut) {
          const currentRow = Math.floor(i / 7)
          if (currentRow === startRow) {
            spanDays++
          } else {
            break // Stop at end of row
          }
        }
      }
      
      if (spanDays > 0) {
        // Find available layer for this booking
        const rowKey = `${startRow}-${startCol}-${spanDays}`
        if (!layerTracker[rowKey]) {
          layerTracker[rowKey] = []
        }
        
        // Find the first available layer
        let layer = 0
        while (layerTracker[rowKey].includes(layer)) {
          layer++
        }
        layerTracker[rowKey].push(layer)
        
        spanningBookings.push({
          ...booking,
          startIndex,
          startRow,
          startCol,
          spanDays,
          layer,
          totalDays: Math.ceil((checkOut - checkIn) / (24 * 60 * 60 * 1000))
        })
      }
      
      // Handle bookings that continue to next row
      if (checkOut > days[startIndex + spanDays]) {
        let nextRowStart = (startRow + 1) * 7
        if (nextRowStart < days.length) {
          let nextRowSpan = 0
          for (let i = nextRowStart; i < Math.min(nextRowStart + 7, days.length); i++) {
            const currentDay = days[i]
            if (currentDay >= checkIn && currentDay < checkOut) {
              nextRowSpan++
            }
          }
          
          if (nextRowSpan > 0) {
            // Find layer for continuation row
            const nextRowKey = `${startRow + 1}-0-${nextRowSpan}`
            if (!layerTracker[nextRowKey]) {
              layerTracker[nextRowKey] = []
            }
            
            let nextLayer = 0
            while (layerTracker[nextRowKey].includes(nextLayer)) {
              nextLayer++
            }
            layerTracker[nextRowKey].push(nextLayer)
            
            spanningBookings.push({
              ...booking,
              id: `${booking.id}-row2`,
              startIndex: nextRowStart,
              startRow: startRow + 1,
              startCol: 0,
              spanDays: nextRowSpan,
              layer: nextLayer,
              totalDays: Math.ceil((checkOut - checkIn) / (24 * 60 * 60 * 1000))
            })
          }
        }
      }
    })
    
    return spanningBookings
  }

  // Get bookings for a specific date (for click handling)
  const getBookingsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    const dayBookings = bookings.filter(booking => {
      const checkIn = new Date(booking.checkInDate)
      const checkOut = new Date(booking.checkOutDate)
      const currentDate = new Date(dateStr)
      const isInRange = currentDate >= checkIn && currentDate < checkOut
      return isInRange
    })

    return dayBookings
  }

  // Handle date click
  const handleDateClick = (date, dayBookings) => {
    setSelectedDate(date)
    if (dayBookings.length > 0) {
      setSelectedBooking(dayBookings[0])
      setShowBookingModal(true)
    }
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const days = generateCalendarDays()

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 via-cyan-600 to-blue-600 rounded-xl shadow-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
              <CalendarDaysIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Booking Calendar</h1>
              <p className="text-cyan-100">Advanced hotel booking management system</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* View Mode Selector */}
            <div className="flex bg-white bg-opacity-20 rounded-lg p-1 backdrop-blur-sm">
              {['month', 'week', 'day'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setViewMode(mode)
                    setCurrentDate((prev) => {
                      if (mode === 'month') return getMonthStart(prev)
                      if (mode === 'week') return getWeekStart(prev)
                      return startOfDay(prev)
                    })
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                    viewMode === mode
                      ? 'bg-white text-teal-600 shadow-sm'
                      : 'text-white hover:text-cyan-100'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowNewBookingModal(true)}
              className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg hover:bg-opacity-30 transition-colors flex items-center space-x-2 backdrop-blur-sm font-medium"
            >
              <PlusIcon className="w-5 h-5" />
              <span>New Booking</span>
            </button>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                const newDate = new Date(currentDate)
                if (viewMode === 'month') {
                  newDate.setMonth(currentDate.getMonth() - 1)
                  newDate.setDate(1)
                } else if (viewMode === 'week') {
                  newDate.setDate(currentDate.getDate() - 7)
                  const normalized = getWeekStart(newDate)
                  setCurrentDate(normalized)
                  return
                } else if (viewMode === 'day') {
                  newDate.setDate(currentDate.getDate() - 1)
                }
                setCurrentDate(newDate)
              }}
              className="p-3 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors text-white"
            >
              ← Previous
            </button>
            <h2 className="text-2xl font-bold text-white">
              {viewMode === 'month' ? 
                `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}` :
               viewMode === 'week' ? (() => {
                const endDate = new Date(currentDate)
                endDate.setDate(currentDate.getDate() + 6)
                return `${currentDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
              })() :
               currentDate.toLocaleDateString()}
            </h2>
            <button
              onClick={() => {
                const newDate = new Date(currentDate)
                if (viewMode === 'month') {
                  newDate.setMonth(currentDate.getMonth() + 1)
                  newDate.setDate(1)
                } else if (viewMode === 'week') {
                  newDate.setDate(currentDate.getDate() + 7)
                  const normalized = getWeekStart(newDate)
                  setCurrentDate(normalized)
                  return
                } else if (viewMode === 'day') {
                  newDate.setDate(currentDate.getDate() + 1)
                }
                setCurrentDate(newDate)
              }}
              className="p-3 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors text-white"
            >
              Next →
            </button>
          </div>
          
          <button
            onClick={() => {
              const today = new Date()
              if (viewMode === 'month') setCurrentDate(getMonthStart(today))
              else if (viewMode === 'week') setCurrentDate(getWeekStart(today))
              else setCurrentDate(startOfDay(today))
            }}
            className="px-6 py-3 bg-white text-teal-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            Today
          </button>
        </div>
      </div>

      {/* Status Legend */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <div className="w-1 h-6 bg-gradient-to-b from-teal-500 to-blue-600 rounded-full mr-3"></div>
          Room Status Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { status: 'Occupied', count: bookings.filter(b => b.status === 'Occupied').length, color: 'from-red-500 to-red-600', icon: '🏠' },
            { status: 'Booked', count: bookings.filter(b => b.status === 'Booked').length, color: 'from-green-500 to-green-600', icon: '✅' },
            { status: 'Reserved', count: bookings.filter(b => b.status === 'Reserved').length, color: 'from-yellow-500 to-orange-500', icon: '📅' },
            { status: 'Pending', count: bookings.filter(b => b.status === 'Pending').length, color: 'from-orange-500 to-red-500', icon: '⏰' },
            { status: 'Available', count: rooms.filter(r => r.status === 'Available').length, color: 'from-blue-500 to-blue-600', icon: '🔓' }
          ].map(({ status, count, color, icon }) => (
            <div key={status} className={`bg-gradient-to-r ${color} rounded-lg p-4 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{status}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
                <div className="text-2xl">{icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room-Based Timeline Calendar */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Timeline Header - Dates */}
        <div className="flex">
          {/* Room Header */}
          <div className="w-48 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 font-bold text-center border-r-2 border-blue-800">
            All Rooms
          </div>
          
          {/* Date Headers */}
          <div className={`flex-1 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200 ${
            viewMode === 'month' ? 'flex flex-wrap' : 
            viewMode === 'week' ? 'grid grid-cols-7' : 
            'grid grid-cols-1'
          }`}>
            {(() => {
              const { daysToShow } = getPeriodConfig(viewMode, currentDate)

              return daysToShow.map((day, index) => {
                const isToday = day.toDateString() === new Date().toDateString()
                const dayName = day.toLocaleDateString('en-US', { weekday: 'short' })
                const dayNumber = day.getDate()
                const monthName = day.toLocaleDateString('en-US', { month: 'short' })
                
                return (
                  <div key={index} className={`p-3 text-center border-r last:border-r-0 ${
                    isToday ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-700'
                  } ${viewMode === 'month' ? 'flex-1 min-w-0' : ''}`}>
                    <div className="text-xs font-medium">{dayName}</div>
                    <div className="text-lg font-bold">{dayNumber}</div>
                    <div className="text-xs">{monthName}</div>
                  </div>
                )
              })
            })()}
          </div>
        </div>

        {/* Room Timeline Body */}
        <div className="relative">
          {/* Room Rows */}
          {rooms.slice(0, 15).map((room, roomIndex) => {
            const roomBookings = bookings.filter(booking => {
              // Try multiple matching strategies
              const matches = booking.roomNumber === room.roomNumber || 
                             booking.roomNumber === `Room ${room.id}` ||
                             booking.roomId === room.id ||
                             booking.roomNumber === room.id.toString() ||
                             (booking.roomId && room.id && booking.roomId.toString() === room.id.toString())
              
              return matches
            })

            return (
              <div key={room.id} className="flex border-b border-gray-200 hover:bg-gray-50 transition-colors">
                {/* Room Info */}
                <div className="w-48 p-4 border-r border-gray-200 bg-gray-50">
                  <div className="font-semibold text-gray-800">Room {room.roomNumber}</div>
                  <div className="text-sm text-gray-600">{room.roomType}</div>
                  <div className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                    room.status === 'Available' ? 'bg-green-100 text-green-700' :
                    room.status === 'Occupied' ? 'bg-red-100 text-red-700' :
                    room.status === 'Maintenance' ? 'bg-gray-100 text-gray-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {roomBookings.length} booking{roomBookings.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                {/* Timeline Grid for this Room */}
                <div className="flex-1 relative min-h-[80px]">
                  {/* Date Grid Background */}
                  <div className={`h-full ${
                    viewMode === 'month' ? 'flex' : 
                    viewMode === 'week' ? 'grid grid-cols-7' : 
                    'grid grid-cols-1'
                  }`}>
                    {(() => {
                      const { daysToShow } = getPeriodConfig(viewMode, currentDate)

                      return daysToShow.map((day, dayIndex) => (
                        <div key={dayIndex} className={`border-r last:border-r-0 border-gray-100 min-h-[80px] ${
                          viewMode === 'month' ? 'flex-1' : ''
                        }`}></div>
                      ))
                    })()}
                  </div>
                  
                  {/* Booking Bars for this Room */}
                  <div className="absolute top-0 left-0 w-full h-full">
                    {roomBookings.map((booking, bookingIndex) => {
                      const checkIn = new Date(booking.checkInDate)
                      const checkOut = new Date(booking.checkOutDate)
                      
                      // Get the period start based on view mode
                      const { periodStart, totalDays } = getPeriodConfig(viewMode, currentDate)
                      
                      // Calculate position and width - Fix date calculation
                      // Normalize dates to avoid timezone issues
                      const checkInNormalized = new Date(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate())
                      const checkOutNormalized = new Date(checkOut.getFullYear(), checkOut.getMonth(), checkOut.getDate())
                      const periodStartNormalized = new Date(periodStart.getFullYear(), periodStart.getMonth(), periodStart.getDate())
                      
                      const startDay = Math.max(0, Math.floor((checkInNormalized - periodStartNormalized) / (24 * 60 * 60 * 1000)))
                      // For checkout, don't include the checkout day (hotel standard)
                      const endDay = Math.min(totalDays - 1, Math.floor((checkOutNormalized - periodStartNormalized) / (24 * 60 * 60 * 1000)) - 1)
                      const spanDays = endDay - startDay + 1
                      
                      if (startDay >= totalDays || endDay < 0 || spanDays <= 0) {
                        return null
                      }
                      
                      const left = `${(startDay / totalDays) * 100}%`
                      const width = `${(spanDays / totalDays) * 100}%`
                      const top = `${10 + (bookingIndex * 25)}px`

                      return (
                        <div
                          key={booking.id}
                          className={`absolute cursor-pointer transition-all duration-200 hover:shadow-lg hover:z-10 ${getStatusColor(booking.status)}`}
                          style={{
                            left,
                            top,
                            width: `calc(${width} - 4px)`,
                            minWidth: '50px', // Ensure minimum visibility
                            height: '20px',
                            borderRadius: '10px',
                            marginLeft: '2px',
                            zIndex: 5 + bookingIndex,
                            border: '2px solid rgba(255,255,255,0.8)' // Make more visible
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedBooking(booking)
                            setShowBookingModal(true)
                          }}
                          onMouseEnter={(e) => {
                            setHoveredBooking(booking)
                            setTooltipPosition({
                              x: e.clientX,
                              y: e.clientY
                            })
                          }}
                          onMouseLeave={() => {
                            setHoveredBooking(null)
                          }}
                        >
                          <div className="flex items-center h-full px-2">
                            <div className="text-xs font-semibold truncate">
                              {booking.guestName || 'Maintenance'}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Booking Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100">Total Bookings</p>
              <p className="text-3xl font-bold text-white">{bookings.length}</p>
              <p className="text-sm text-blue-100 mt-1">This month</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <CalendarDaysIcon className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-100">Occupied Rooms</p>
              <p className="text-3xl font-bold text-white">
                {bookings.filter(b => b.status === 'Occupied').length}
              </p>
              <p className="text-sm text-red-100 mt-1">Currently active</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <UserGroupIcon className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100">Available Rooms</p>
              <p className="text-3xl font-bold text-white">
                {rooms.filter(r => r.status === 'Available').length}
              </p>
              <p className="text-sm text-green-100 mt-1">Ready for booking</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <CheckCircleIcon className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className={`px-6 py-4 border-b ${
              selectedBooking.status === 'Occupied' ? 'bg-red-50 border-red-200' :
              selectedBooking.status === 'Reserved' ? 'bg-yellow-50 border-yellow-200' :
              selectedBooking.status === 'Out of Order' ? 'bg-gray-50 border-gray-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    selectedBooking.status === 'Occupied' ? 'bg-red-100' :
                    selectedBooking.status === 'Reserved' ? 'bg-yellow-100' :
                    selectedBooking.status === 'Out of Order' ? 'bg-gray-100' :
                    'bg-green-100'
                  }`}>
                    {getStatusIcon(selectedBooking.status)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedBooking.status === 'Out of Order' ? 'Room Maintenance' : selectedBooking.guestName}
                    </h3>
                    <p className="text-sm text-gray-600">Room {selectedBooking.roomNumber} • {selectedBooking.roomType}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircleIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {selectedBooking.status !== 'Out of Order' ? (
                <div className="space-y-6">
                  {/* Guest Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <UserGroupIcon className="w-5 h-5 mr-2 text-blue-600" />
                      Guest Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <PhoneIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Phone:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedBooking.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedBooking.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <IdentificationIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">ID:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedBooking.idType} - {selectedBooking.idNumber}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <UserGroupIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Guests:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedBooking.adults} Adults, {selectedBooking.children} Children</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <CalendarDaysIcon className="w-5 h-5 mr-2 text-green-600" />
                      Booking Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Check-in Date:</span>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(selectedBooking.checkInDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Check-out Date:</span>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(selectedBooking.checkOutDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Duration:</span>
                        <p className="text-sm font-medium text-gray-900">
                          {Math.ceil((new Date(selectedBooking.checkOutDate) - new Date(selectedBooking.checkInDate)) / (1000 * 60 * 60 * 24))} nights
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Booking Source:</span>
                        <p className="text-sm font-medium text-gray-900">{selectedBooking.source}</p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <CurrencyDollarIcon className="w-5 h-5 mr-2 text-yellow-600" />
                      Financial Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <span className="text-sm text-blue-600">Total Amount</span>
                        <p className="text-xl font-bold text-blue-900">Rs {selectedBooking.totalAmount.toLocaleString()}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <span className="text-sm text-green-600">Paid Amount</span>
                        <p className="text-xl font-bold text-green-900">Rs {selectedBooking.paidAmount.toLocaleString()}</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <span className="text-sm text-red-600">Balance Due</span>
                        <p className="text-xl font-bold text-red-900">Rs {(selectedBooking.totalAmount - selectedBooking.paidAmount).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {/* Payment Status Row */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Payment Status:</span>
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            selectedBooking.paymentStatus === 'Paid' || selectedBooking.paidAmount >= selectedBooking.totalAmount
                              ? 'bg-green-100 text-green-800'
                              : selectedBooking.paidAmount > 0
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {selectedBooking.paymentStatus === 'Paid' || selectedBooking.paidAmount >= selectedBooking.totalAmount
                              ? '✅ Paid'
                              : selectedBooking.paidAmount > 0
                              ? '🟡 Partial'
                              : '🔴 Pending'
                            }
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Booking Status:</span>
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            selectedBooking.status === 'Booked' ? 'bg-green-100 text-green-800' :
                            selectedBooking.status === 'Occupied' ? 'bg-red-100 text-red-800' :
                            selectedBooking.status === 'Reserved' ? 'bg-yellow-100 text-yellow-800' :
                            selectedBooking.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {getStatusIcon(selectedBooking.status)}
                            <span className="ml-1">{selectedBooking.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  {selectedBooking.specialRequests && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2 text-purple-600" />
                        Special Requests
                      </h4>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-purple-900">{selectedBooking.specialRequests}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4 border-t">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                      <EyeIcon className="w-4 h-4" />
                      <span>View Full Details</span>
                    </button>
                    <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                      <PencilIcon className="w-4 h-4" />
                      <span>Edit Booking</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Maintenance Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Room Status:</p>
                      <p className="text-lg font-medium text-gray-900">Out of Order</p>
                      <p className="text-sm text-gray-600 mt-2">Issue:</p>
                      <p className="text-sm text-gray-900">{selectedBooking.specialRequests}</p>
                      <p className="text-sm text-gray-600 mt-2">Duration:</p>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedBooking.checkInDate).toLocaleDateString()} - {new Date(selectedBooking.checkOutDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hover Tooltip */}
      {hoveredBooking && (
        <div
          className="fixed z-50 bg-gray-900 text-white p-3 rounded-lg shadow-xl max-w-xs pointer-events-none"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y - 10}px`,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="text-sm font-semibold mb-2">
            {hoveredBooking.status === 'Out of Order' ? 'Maintenance' : hoveredBooking.guestName}
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-300">Room:</span>
              <span>{hoveredBooking.roomNumber} ({hoveredBooking.roomType})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Status:</span>
              <span className={`px-2 py-1 rounded text-xs ${
                hoveredBooking.status === 'Occupied' ? 'bg-red-500' :
                hoveredBooking.status === 'Reserved' ? 'bg-yellow-500' :
                hoveredBooking.status === 'Out of Order' ? 'bg-gray-500' :
                'bg-blue-500'
              }`}>
                {hoveredBooking.status}
              </span>
            </div>
            {hoveredBooking.status !== 'Out of Order' && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-300">Check-in:</span>
                  <span>{new Date(hoveredBooking.checkInDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Check-out:</span>
                  <span>{new Date(hoveredBooking.checkOutDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Guests:</span>
                  <span>{hoveredBooking.adults + hoveredBooking.children} pax</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Amount:</span>
                  <span className="font-semibold">Rs {hoveredBooking.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Source:</span>
                  <span>{hoveredBooking.source}</span>
                </div>
                {hoveredBooking.specialRequests && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <span className="text-gray-300">Special Requests:</span>
                    <p className="text-xs mt-1">{hoveredBooking.specialRequests}</p>
                  </div>
                )}
              </>
            )}
            {hoveredBooking.status === 'Out of Order' && (
              <div className="mt-2 pt-2 border-t border-gray-700">
                <span className="text-gray-300">Issue:</span>
                <p className="text-xs mt-1">{hoveredBooking.specialRequests}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Booking Modal */}
      {showNewBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">New Booking</h3>
              <button
                onClick={() => setShowNewBookingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="text-center py-8">
              <CalendarDaysIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">New booking functionality will be implemented here.</p>
              <p className="text-sm text-gray-500">This will integrate with the booking system to create new reservations.</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowNewBookingModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNewBookingModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingCalendar;
