import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  CalendarDaysIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  ClockIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  HomeIcon,
  UserIcon
} from '@heroicons/react/24/outline'

 const getRoomTypeLabel = (rt) => {
   return (
     rt?.category ||
     rt?.typeName ||
     rt?.roomTypeName ||
     rt?.name ||
     rt?.title ||
     rt?.roomCategory ||
     'Room Category'
   )
 }

 const getCheckInLabel = (ci) => {
   const guestName =
     ci?.guestName ||
     ci?.GuestName ||
     ci?.guest?.fullName ||
     ci?.guest?.FullName ||
     ci?.Guest?.fullName ||
     ci?.Guest?.FullName ||
     ci?.guest?.name ||
     ci?.Guest?.name ||
     ci?.fullName ||
     ci?.FullName ||
     'Guest'
   const phone =
     ci?.phoneNumber ||
     ci?.PhoneNumber ||
     ci?.guestPhone ||
     ci?.GuestPhone ||
     ci?.guest?.phone ||
     ci?.guest?.Phone ||
     ci?.Guest?.phone ||
     ci?.Guest?.Phone ||
     ci?.phone ||
     ci?.Phone ||
     'No Phone'
   const roomNo =
     ci?.roomNumber ||
     ci?.RoomNumber ||
     ci?.roomNo ||
     ci?.RoomNo ||
     ci?.room?.roomNumber ||
     ci?.room?.RoomNumber ||
     ci?.Room?.roomNumber ||
     ci?.Room?.RoomNumber ||
     ci?.room?.number ||
     ci?.room?.roomNo ||
     ''
   return roomNo ? `${guestName} - ${phone} - Room ${roomNo}` : `${guestName} - ${phone}`
 }

const TableReservation = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedHotelId, setSelectedHotelId] = useState('')
  const [hotels, setHotels] = useState([])
  
  const [formData, setFormData] = useState({
    hotelId: '',
    roomTypeId: '',
    roomId: '',
    checkInId: '',
    guestId: '',
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    roomNumber: '',
    tableId: '',
    reservationDate: '',
    reservationTime: '',
    numberOfGuests: '',
    duration: '2',
    specialRequests: '',
    advanceAmount: '',
    status: 'Confirmed',
    isActive: true,
    guestEntryMode: 'search' // 'search' or 'manual'
  })

  // API Data states
  const [tables, setTables] = useState([])
  const [reservations, setReservations] = useState([])
  const [roomTypes, setRoomTypes] = useState([])
  const [rooms, setRooms] = useState([])
  const [checkIns, setCheckIns] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})
  const [filterRoomType, setFilterRoomType] = useState('')
  const [filterRoom, setFilterRoom] = useState('')
  const [filterRoomTypes, setFilterRoomTypes] = useState([])
  const [filterRooms, setFilterRooms] = useState([])

  // Load data on component mount
  useEffect(() => {
    fetchHotels()
  }, [])

  // Fetch room types for filter when hotel changes
  useEffect(() => {
    if (selectedHotelId) {
      fetchFilterRoomTypes(selectedHotelId)
    } else {
      setFilterRoomTypes([])
      setFilterRoomType('')
    }
  }, [selectedHotelId])

  // Fetch rooms for filter when room type changes
  useEffect(() => {
    if (selectedHotelId && filterRoomType) {
      fetchFilterRooms(selectedHotelId, filterRoomType)
    } else {
      setFilterRooms([])
      setFilterRoom('')
    }
  }, [selectedHotelId, filterRoomType])

  useEffect(() => {
    if (formData.hotelId) {
      fetchRoomTypes(formData.hotelId)
      fetchCheckIns(formData.hotelId)
    } else {
      setRoomTypes([])
      setCheckIns([])
    }
  }, [formData.hotelId])

  useEffect(() => {
    if (formData.hotelId && formData.roomTypeId) {
      fetchRooms(formData.hotelId, formData.roomTypeId)
    } else {
      setRooms([])
    }
  }, [formData.hotelId, formData.roomTypeId])

  useEffect(() => {
    if (formData.checkInId) {
      populateGuestFromCheckIn(formData.checkInId)
    }
  }, [formData.checkInId])

  useEffect(() => {
    if (selectedHotelId) {
      localStorage.setItem('selectedHotelId', String(selectedHotelId))
    }
    fetchTablesAndReservations()
  }, [selectedDate, selectedHotelId])

  const fetchHotels = async () => {
    try {
      const res = await axios.get('/hotels?page=1&pageSize=200')
      if (res.data?.success) {
        setHotels(res.data.data || [])
      }
    } catch (err) {
      console.error('Error fetching hotels:', err)
    }
  }

  const fetchFilterRoomTypes = async (hotelId) => {
    try {
      const res = await axios.get(`/roomtypes/by-hotel/${hotelId}`)
      if (res.data?.success) {
        setFilterRoomTypes(res.data.data || [])
        return
      }
      const res2 = await axios.get(`/roomtypes?hotelId=${hotelId}`)
      if (res2.data?.success) {
        setFilterRoomTypes(res2.data.data || [])
      }
    } catch (err) {
      console.error('Error fetching filter room types:', err)
      setFilterRoomTypes([])
    }
  }

  const fetchFilterRooms = async (hotelId, roomTypeId) => {
    try {
      const res = await axios.get(`/rooms?hotelId=${hotelId}`)
      if (res.data?.success) {
        const rtIdNum = Number(roomTypeId)
        const filtered = (res.data.data || []).filter((r) => {
          const rRoomTypeId =
            r?.roomTypeId ??
            r?.roomTypeID ??
            r?.RoomTypeId ??
            r?.RoomTypeID ??
            r?.roomType?.id ??
            r?.roomType?.Id ??
            r?.RoomType?.id ??
            r?.RoomType?.Id
          return !rtIdNum || Number(rRoomTypeId) === rtIdNum
        })
        setFilterRooms(filtered)
      }
    } catch (err) {
      console.error('Error fetching filter rooms:', err)
      setFilterRooms([])
    }
  }

  const fetchRoomTypes = async (hotelId) => {
    try {
      const res = await axios.get(`/roomtypes/by-hotel/${hotelId}`)
      if (res.data?.success) {
        setRoomTypes(res.data.data || [])
        return
      }
      const res2 = await axios.get(`/roomtypes?hotelId=${hotelId}`)
      if (res2.data?.success) {
        setRoomTypes(res2.data.data || [])
      }
    } catch (err) {
      console.error('Error fetching room types:', err)
      setRoomTypes([])
    }
  }

  const fetchRooms = async (hotelId, roomTypeId) => {
    try {
      const res = await axios.get(`/rooms?hotelId=${hotelId}`)
      if (res.data?.success) {
        const rtIdNum = Number(roomTypeId)
        const filtered = (res.data.data || []).filter((r) => {
          const rRoomTypeId =
            r?.roomTypeId ??
            r?.roomTypeID ??
            r?.RoomTypeId ??
            r?.RoomTypeID ??
            r?.roomType?.id ??
            r?.roomType?.Id ??
            r?.RoomType?.id ??
            r?.RoomType?.Id
          return !rtIdNum || Number(rRoomTypeId) === rtIdNum
        })
        setRooms(filtered)
      }
    } catch (err) {
      console.error('Error fetching rooms:', err)
      setRooms([])
    }
  }

  const fetchCheckIns = async (hotelId) => {
    try {
      const res = await axios.get('/checkins?page=1&pageSize=200&status=Active')
      if (res.data?.success) {
        // NOTE: API response uses PascalCase (Id/Guest/Room). Keep filtering minimal.
        const filtered = (res.data.data || []).filter((ci) => {
          const status = (ci?.status || ci?.Status || '').toString().toLowerCase()
          return status === '' || status === 'active'
        })
        setCheckIns(filtered)
      }
    } catch (err) {
      console.error('Error fetching check-ins:', err)
      setCheckIns([])
    }
  }

  const populateGuestFromCheckIn = (checkInId) => {
    const checkIn = checkIns.find((c) => (c?.id ?? c?.Id) === Number(checkInId))
    if (checkIn) {
      setFormData(prev => ({
        ...prev,
        guestId: String(checkIn?.guestId ?? checkIn?.GuestId ?? checkIn?.Guest?.Id ?? checkIn?.guest?.id ?? checkIn?.guest?.Id ?? ''),
        guestName:
          checkIn.guestName ||
          checkIn.GuestName ||
          checkIn.guest?.fullName ||
          checkIn.guest?.FullName ||
          checkIn.Guest?.fullName ||
          checkIn.Guest?.FullName ||
          checkIn.guest?.name ||
          checkIn.Guest?.name ||
          '',
        guestPhone:
          checkIn.phoneNumber ||
          checkIn.PhoneNumber ||
          checkIn.guestPhone ||
          checkIn.GuestPhone ||
          checkIn.guest?.phone ||
          checkIn.guest?.Phone ||
          checkIn.Guest?.phone ||
          checkIn.Guest?.Phone ||
          checkIn.phone ||
          checkIn.Phone ||
          '',
        guestEmail:
          checkIn.email ||
          checkIn.Email ||
          checkIn.guestEmail ||
          checkIn.GuestEmail ||
          checkIn.guest?.email ||
          checkIn.guest?.Email ||
          checkIn.Guest?.email ||
          checkIn.Guest?.Email ||
          '',
        roomNumber:
          checkIn.roomNumber ||
          checkIn.RoomNumber ||
          checkIn.roomNo ||
          checkIn.RoomNo ||
          checkIn.room?.roomNumber ||
          checkIn.room?.RoomNumber ||
          checkIn.Room?.roomNumber ||
          checkIn.Room?.RoomNumber ||
          checkIn.room?.number ||
          checkIn.room?.roomNo ||
          ''
      }))
    }
  }

  const handleClearCheckout = async (reservation) => {
    if (!window.confirm('Clear/Checkout this reservation and release the table?')) return

    try {
      setLoading(true)
      setError('')
      await axios.delete(`/RestaurantBar/table-reservations/${reservation.id}`)
      if (reservation.tableId) {
        await axios.put(`/tables/${reservation.tableId}`, { status: 'Available' })
      }
      setSuccess('Reservation cleared and table released')
      fetchTablesAndReservations()
    } catch (err) {
      console.error('Error clearing reservation:', err)
      setError(err.response?.data?.message || 'Failed to clear reservation')
    } finally {
      setLoading(false)
    }
  }

  // Fetch tables and reservations - PURE API CALLS
  const fetchTablesAndReservations = async () => {
    try {
      setLoading(true)
      setError('')
      
      const hotelQuery = selectedHotelId ? `hotelId=${selectedHotelId}` : ''
      const tablesUrl = hotelQuery ? `/tables?${hotelQuery}` : '/tables'
      const reservationsUrl = hotelQuery
        ? `/RestaurantBar/table-reservations?${hotelQuery}&date=${selectedDate}`
        : `/RestaurantBar/table-reservations?date=${selectedDate}`

      let tablesRes
      let resvRes
      try {
        ;[tablesRes, resvRes] = await Promise.all([axios.get(tablesUrl), axios.get(reservationsUrl)])
      } catch (e) {
        // Fallback for any casing/proxy differences
        ;[tablesRes, resvRes] = await Promise.all([
          axios.get(tablesUrl.replace('/tables', '/Tables')),
          axios.get(reservationsUrl)
        ])
      }

      if (tablesRes.data?.success) {
        const normalizedTables = (tablesRes.data.data || []).map((t) => {
          const id = t?.id ?? t?.Id
          const tableNumber = t?.tableNumber ?? t?.TableNumber ?? t?.tableName ?? t?.TableName
          const tableCode = t?.tableCode ?? t?.TableCode
          const location = t?.location ?? t?.Location
          const capacity = t?.capacity ?? t?.Capacity
          const status = t?.status ?? t?.Status

          return {
            ...t,
            id,
            tableNumber,
            tableName: t?.tableName ?? t?.TableName ?? tableNumber,
            tableCode,
            location,
            capacity,
            status
          }
        })
        setTables(normalizedTables)
      }
      if (resvRes.data?.success) setReservations(resvRes.data.data || [])
      
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load tables and reservations')
      setTables([])
      setReservations([])
    } finally {
      setLoading(false)
    }
  }

  // Form validation
  const validateForm = () => {
    const newErrors = {}
    if (!formData.guestName.trim()) newErrors.guestName = 'Guest name is required'
    if (!formData.guestPhone.trim()) newErrors.guestPhone = 'Guest phone is required'
    if (!formData.tableId) newErrors.tableId = 'Table selection is required'
    if (!formData.reservationDate) newErrors.reservationDate = 'Reservation date is required'
    if (!formData.reservationTime) newErrors.reservationTime = 'Reservation time is required'
    if (!formData.numberOfGuests || formData.numberOfGuests <= 0) newErrors.numberOfGuests = 'Valid number of guests is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Create/Update reservation - PURE API CALL
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)

      const reservationDateTime = formData.reservationDate && formData.reservationTime
        ? new Date(`${formData.reservationDate}T${formData.reservationTime}:00`)
        : null

      const payload = {
        hotelId: selectedHotelId,
        tableId: Number(formData.tableId),
        guestId: Number(formData.guestEntryMode === 'search' ? (formData.guestId || 0) : 0),
        checkInId: Number(formData.guestEntryMode === 'search' ? (formData.checkInId || 0) : 0),
        guestName: formData.guestName,
        guestPhone: formData.guestPhone,
        guestEmail: formData.guestEmail || null,
        roomNumber: formData.roomNumber || null,
        reservationDateTime: reservationDateTime ? reservationDateTime.toISOString() : null,
        numberOfGuests: Number(formData.numberOfGuests || 0),
        durationHours: Number(formData.duration || 2),
        specialRequests: formData.specialRequests || null,
        advanceAmount: Number(formData.advanceAmount || 0),
        status: formData.status || 'Confirmed',
        isCancelled: false
      }

      if (editingId) {
        await axios.put(`/RestaurantBar/table-reservations/${editingId}`, payload)
        setSuccess('Reservation updated successfully')
      } else {
        await axios.post('/RestaurantBar/table-reservations', payload)
        setSuccess('Reservation created successfully')
      }

      // Keep the list in sync with the date you just created/edited
      if (formData.reservationDate) {
        setSelectedDate(formData.reservationDate)
      }

      setShowForm(false)
      resetForm()
      fetchTablesAndReservations()
    } catch (err) {
      console.error('Error saving reservation:', err)
      setError(err.response?.data?.message || 'Failed to save reservation')
    } finally {
      setLoading(false)
    }
  }

  // Delete reservation - PURE API CALL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reservation?')) return

    try {
      setLoading(true)
      await axios.delete(`/RestaurantBar/table-reservations/${id}`)
      setSuccess('Reservation deleted successfully')
      fetchTablesAndReservations()
    } catch (err) {
      console.error('Error deleting reservation:', err)
      setError(err.response?.data?.message || 'Failed to delete reservation')
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      hotelId: selectedHotelId || '',
      roomTypeId: '',
      roomId: '',
      checkInId: '',
      guestId: '',
      guestName: '',
      guestPhone: '',
      guestEmail: '',
      roomNumber: '',
      tableId: '',
      reservationDate: '',
      reservationTime: '',
      numberOfGuests: '',
      duration: '2',
      specialRequests: '',
      advanceAmount: '',
      status: 'Confirmed',
      isActive: true,
      guestEntryMode: 'search'
    })
    setEditingId(null)
    setErrors({})
  }

  // Handle edit
  const handleEdit = (reservation) => {
    setFormData({
      hotelId: reservation.hotelId ? String(reservation.hotelId) : (selectedHotelId ? String(selectedHotelId) : ''),
      guestName: reservation.guestName || '',
      guestPhone: reservation.guestPhone || '',
      guestEmail: reservation.guestEmail || '',
      roomNumber: reservation.roomNumber || '',
      tableId: reservation.tableId ? String(reservation.tableId) : '',
      reservationDate: reservation.reservationDate || '',
      reservationTime: reservation.reservationTime || '',
      numberOfGuests: reservation.numberOfGuests || '',
      duration: reservation.duration ? String(reservation.duration) : '2',
      specialRequests: reservation.specialRequests || '',
      advanceAmount: reservation.advanceAmount || '',
      status: reservation.status || 'Confirmed',
      isActive: true,
      checkInId: reservation.checkInId ? String(reservation.checkInId) : '',
      guestId: reservation.guestId ? String(reservation.guestId) : '',
      guestEntryMode: reservation.checkInId ? 'search' : 'manual',
      roomTypeId: '',
      roomId: ''
    })
    setEditingId(reservation.id)
    setShowForm(true)
  }

  // Filter reservations based on search and filters
  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.guestPhone?.includes(searchTerm) ||
      reservation.tableName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRoomType = !filterRoomType || reservation.roomTypeId === Number(filterRoomType)
    const matchesRoom = !filterRoom || reservation.roomId === Number(filterRoom)
    
    return matchesSearch && matchesRoomType && matchesRoom
  })

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-[1.5rem] p-4 sm:p-6 border border-blue-200 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="bg-blue-100 p-3 rounded-2xl shrink-0">
              <CalendarDaysIcon className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">Table Reservations</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage restaurant table bookings</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="bg-blue-600 text-white px-4 py-3 rounded-2xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2 transition-colors w-full sm:w-auto font-medium"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Reservation</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hotel</label>
            <select
              value={selectedHotelId}
              onChange={(e) => setSelectedHotelId(Number(e.target.value) || '')}
              className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="">All Hotels</option>
              {hotels.map(h => (
                <option key={h.id} value={h.id}>{h.hotelName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Category</label>
            <select
              value={filterRoomType}
              onChange={(e) => setFilterRoomType(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              disabled={!selectedHotelId}
            >
              <option value="">All Categories</option>
              {filterRoomTypes.map(rt => (
                <option key={rt.id} value={rt.id}>{getRoomTypeLabel(rt)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
            <select
              value={filterRoom}
              onChange={(e) => setFilterRoom(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              disabled={!selectedHotelId || !filterRoomType}
            >
              <option value="">All Rooms</option>
              {filterRooms.map(r => (
                <option key={r.id} value={r.id}>{r.roomNumber || r.roomName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Search..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-green-700">{success}</span>
          </div>
        </div>
      )}

      {/* Reservations Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading reservations...</p>
                  </td>
                </tr>
              ) : filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No reservations found for selected date
                  </td>
                </tr>
              ) : (
                filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{reservation.guestName}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <PhoneIcon className="h-3 w-3 mr-1" />
                          {reservation.guestPhone}
                        </div>
                        {reservation.roomNumber && (
                          <div className="text-sm text-gray-500">Room: {reservation.roomNumber}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{reservation.tableName}</div>
                      <div className="text-sm text-gray-500">{reservation.tableLocation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{reservation.reservationDate}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {reservation.reservationTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <UserGroupIcon className="h-4 w-4 mr-1" />
                        {reservation.numberOfGuests}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.duration} hours
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        reservation.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        reservation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        reservation.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleClearCheckout(reservation)}
                          className="text-green-600 hover:text-green-900"
                          title="Clear/Checkout"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(reservation)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(reservation.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingId ? 'Edit Reservation' : 'New Table Reservation'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1: Hotel, Room Type, Room */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <BuildingOfficeIcon className="h-4 w-4 inline mr-1" />
                      Hotel *
                    </label>
                    <select
                      value={formData.hotelId}
                      onChange={(e) => {
                        const hid = Number(e.target.value) || ''
                        setSelectedHotelId(hid)
                        setFormData({ ...formData, hotelId: e.target.value, roomTypeId: '', roomId: '' })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Hotel</option>
                      {hotels.map(h => (
                        <option key={h.id} value={h.id}>{h.hotelName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <HomeIcon className="h-4 w-4 inline mr-1" />
                      Room Category *
                    </label>
                    <select
                      value={formData.roomTypeId}
                      onChange={(e) => setFormData({...formData, roomTypeId: e.target.value, roomId: ''})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={!formData.hotelId}
                    >
                      <option value="">Select Category</option>
                      {roomTypes.map(rt => (
                        <option key={rt.id} value={rt.id}>{getRoomTypeLabel(rt)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                    <select
                      value={formData.roomId}
                      onChange={(e) => setFormData({...formData, roomId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={!formData.roomTypeId}
                    >
                      <option value="">Select Room</option>
                      {rooms.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.roomNumber || r.roomName}{r.floor ? ` - Floor ${r.floor}` : ''}{r.block ? ` - Block ${r.block}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Guest Entry Mode Toggle */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-4 mb-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="guestEntryMode"
                        value="search"
                        checked={formData.guestEntryMode === 'search'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            guestEntryMode: e.target.value,
                            checkInId: '',
                            guestId: '',
                            guestName: '',
                            guestPhone: '',
                            guestEmail: ''
                          })
                        }
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Search from Check-Ins</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="guestEntryMode"
                        value="manual"
                        checked={formData.guestEntryMode === 'manual'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            guestEntryMode: e.target.value,
                            checkInId: '',
                            guestId: ''
                          })
                        }
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Manual Entry</span>
                    </label>
                  </div>

                  {formData.guestEntryMode === 'search' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <UserIcon className="h-4 w-4 inline mr-1" />
                        Select Guest from Check-Ins *
                      </label>
                      <select
                        value={formData.checkInId}
                        onChange={(e) => setFormData({...formData, checkInId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Search and select guest...</option>
                        {checkIns.map(ci => (
                          <option key={ci?.id ?? ci?.Id} value={ci?.id ?? ci?.Id}>
                            {getCheckInLabel(ci)}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}
                </div>

                {/* Row 2: Guest Name, Phone, Email */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name *</label>
                    <input
                      type="text"
                      value={formData.guestName}
                      onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.guestName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter guest name"
                      disabled={formData.guestEntryMode === 'search' && !formData.checkInId}
                    />
                    {errors.guestName && <p className="text-red-500 text-xs mt-1">{errors.guestName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.guestPhone}
                      onChange={(e) => setFormData({...formData, guestPhone: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.guestPhone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="+92-300-1234567"
                      disabled={formData.guestEntryMode === 'search' && !formData.checkInId}
                    />
                    {errors.guestPhone && <p className="text-red-500 text-xs mt-1">{errors.guestPhone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.guestEmail}
                      onChange={(e) => setFormData({...formData, guestEmail: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="guest@email.com"
                      disabled={formData.guestEntryMode === 'search' && !formData.checkInId}
                    />
                  </div>
                </div>

                {/* Row 3: Room Number, Table, Number of Guests */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                    <input
                      type="text"
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="101"
                      disabled={formData.guestEntryMode === 'search' && !formData.checkInId}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Table *</label>
                    <select
                      value={formData.tableId}
                      onChange={(e) => setFormData({...formData, tableId: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.tableId ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a table</option>
                      {tables.map(table => (
                        <option key={table.id} value={table.id}>
                          {(table.tableName || table.tableNumber || table.tableCode || `Table ${table.id}`)} - {table.location} (Cap: {table.capacity})
                        </option>
                      ))}
                    </select>
                    {errors.tableId && <p className="text-red-500 text-xs mt-1">{errors.tableId}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests *</label>
                    <input
                      type="number"
                      value={formData.numberOfGuests}
                      onChange={(e) => setFormData({...formData, numberOfGuests: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.numberOfGuests ? 'border-red-300' : 'border-gray-300'
                      }`}
                      min="1"
                      placeholder="4"
                    />
                    {errors.numberOfGuests && <p className="text-red-500 text-xs mt-1">{errors.numberOfGuests}</p>}
                  </div>
                </div>

                {/* Row 4: Reservation Date, Time, Duration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reservation Date *</label>
                    <input
                      type="date"
                      value={formData.reservationDate}
                      onChange={(e) => setFormData({...formData, reservationDate: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.reservationDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.reservationDate && <p className="text-red-500 text-xs mt-1">{errors.reservationDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reservation Time *</label>
                    <input
                      type="time"
                      value={formData.reservationTime}
                      onChange={(e) => setFormData({...formData, reservationTime: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.reservationTime ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.reservationTime && <p className="text-red-500 text-xs mt-1">{errors.reservationTime}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="1">1 hour</option>
                      <option value="2">2 hours</option>
                      <option value="3">3 hours</option>
                      <option value="4">4 hours</option>
                    </select>
                  </div>
                </div>

                {/* Row 5: Advance Amount, Status, Special Requests */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Advance Amount (Rs)</label>
                    <input
                      type="number"
                      value={formData.advanceAmount}
                      onChange={(e) => setFormData({...formData, advanceAmount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                    <input
                      type="text"
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any special requirements..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      resetForm()
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TableReservation;
