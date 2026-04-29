import { useState, useEffect } from 'react'
import axios from '../../utils/axios'
import {
  KeyIcon,
  UserIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const CheckIn = () => {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [reservationSearch, setReservationSearch] = useState('')
  const [showReservationDropdown, setShowReservationDropdown] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [guestSearch, setGuestSearch] = useState('')
  const [showGuestDropdown, setShowGuestDropdown] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [expandedSections, setExpandedSections] = useState({
    pricing: false,
    companions: false,
    marketing: false,
    transport: false,
    folio: false,
    additional: false
  })
  const [formData, setFormData] = useState({
    reservationId: '',
    guestId: '',
    roomId: '',
    checkInDate: '', // ✅ Fix: Start empty, will be populated from reservation
    expectedCheckOutDate: '',
    numberOfGuests: 1,
    roomRate: '',
    totalAmount: '',
    advancePaid: '',
    specialRequests: '',
    checkedInBy: 'Reception Staff',
    remarks: '',

    // Optional fields (match backend DTO names)
    discount: 0,
    fbCredits: 0,
    paymentMethod: '',
    paymentAccount: '',
    ratePlanId: '',
    ntn: '',

    guestName2: '',
    guestName3: '',
    groupId: '',

    source: '',
    market: '',
    region: '',
    industry: '',
    purpose: '',
    referenceCompany: '',
    reservationMadeBy: '',

    pickup: false,
    pickupStation: '',
    pickupCarrier: '',
    pickupTime: '',
    dropOff: false,
    dropStation: '',

    btcFolio: '',
    folio1: '',
    folio2: '',
    folio3: '',

    btcComments: '',
    btcId: '',
    complimentary: false,
    company: '',
    comingFrom: '',
    newspaper: '',
    meals: '',
    vipStatus: '',
    reservationNotes: '',
    checkinNotes: '',
    noPost: false,
    enteredBy: '',
    inclusivePrivileges: ''
  })

  const [checkIns, setCheckIns] = useState([])
  const [reservations, setReservations] = useState([])
  const [guests, setGuests] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch check-ins
  const fetchCheckIns = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/checkins')
      if (response.data.success) {
        setCheckIns(response.data.data)
      }
    } catch (err) {
      setError('Error fetching check-ins')
      console.error('Error fetching check-ins:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch reservations for dropdown
  const fetchReservations = async () => {
    try {
      const response = await axios.get('/reservations?pageSize=100')
      if (response.data.success) {
        // Get confirmed reservations that haven't been checked in yet
        const availableReservations = response.data.data.filter(r => 
          r.status === 'Confirmed' || r.status === 'Pending'
        )
        setReservations(availableReservations)
        console.log(`✅ Loaded ${availableReservations.length} available reservations for check-in`)
      }
    } catch (err) {
      console.error('Error fetching reservations:', err)
    }
  }

  // Filter reservations based on search
  const filteredReservations = reservations.filter(reservation => {
    const searchLower = reservationSearch.toLowerCase()
    return (
      reservation.reservationNumber?.toLowerCase().includes(searchLower) ||
      reservation.guest?.fullName?.toLowerCase().includes(searchLower) ||
      reservation.guest?.firstName?.toLowerCase().includes(searchLower) ||
      reservation.guest?.lastName?.toLowerCase().includes(searchLower) ||
      reservation.room?.roomNumber?.toLowerCase().includes(searchLower)
    )
  })

  // Handle reservation selection
  const handleReservationSelect = (reservation) => {
    console.log('🏨 Selected reservation:', reservation)
    setSelectedReservation(reservation)
    setReservationSearch(`${reservation.reservationNumber} - ${reservation.guest?.fullName || 'Guest'} - Room ${reservation.room?.roomNumber}`)
    setShowReservationDropdown(false)
    
    // Auto-populate form fields
    const totalFromReservationRaw =
      reservation.totalAmount ??
      reservation.TotalAmount ??
      reservation.roomRate ??
      reservation.RoomRate ??
      reservation.room?.basePrice ??
      reservation.room?.BasePrice ??
      ''
    const totalFromReservation =
      totalFromReservationRaw === '' || totalFromReservationRaw === null || totalFromReservationRaw === undefined
        ? ''
        : parseFloat(totalFromReservationRaw)

    const draft = {
      ...formData,
      reservationId: reservation.id,
      guestId: reservation.guestId,
      roomId: reservation.roomId,
      checkInDate: reservation.checkInDate?.split('T')[0] || '',
      expectedCheckOutDate: reservation.checkOutDate?.split('T')[0] || '',
      numberOfGuests: reservation.numberOfAdults + (reservation.numberOfChildren || 0),
      roomRate: totalFromReservation,
      totalAmount: totalFromReservation,
      specialRequests: reservation.specialRequests || '',

      // Optional fields from reservation if available
      discount: reservation.discount ?? 0,
      fbCredits: reservation.fbCredits ?? 0,
      paymentMethod: reservation.paymentMethod || '',
      paymentAccount: reservation.paymentAccount || '',
      ratePlanId: reservation.ratePlanId || '',
      ntn: reservation.ntn || '',
      guestName2: reservation.guestName2 || '',
      guestName3: reservation.guestName3 || '',
      groupId: reservation.groupId || '',
      source: reservation.source || '',
      market: reservation.market || '',
      region: reservation.region || '',
      industry: reservation.industry || '',
      purpose: reservation.purpose || '',
      referenceCompany: reservation.referenceCompany || '',
      reservationMadeBy: reservation.reservationMadeBy || '',
      pickup: reservation.pickup ?? false,
      pickupStation: reservation.pickupStation || '',
      pickupCarrier: reservation.pickupCarrier || '',
      pickupTime: reservation.pickupTime || '',
      dropOff: reservation.dropOff ?? false,
      dropStation: reservation.dropStation || '',
      btcFolio: reservation.btcFolio || '',
      folio1: reservation.folio1 || '',
      folio2: reservation.folio2 || '',
      folio3: reservation.folio3 || '',
      btcComments: reservation.btcComments || '',
      btcId: reservation.btcId || '',
      complimentary: reservation.complimentary ?? false,
      company: reservation.company || '',
      comingFrom: reservation.comingFrom || '',
      newspaper: reservation.newspaper || '',
      meals: reservation.meals || '',
      vipStatus: reservation.vipStatus || '',
      reservationNotes: reservation.reservationNotes || '',
      checkinNotes: reservation.checkinNotes || '',
      noPost: reservation.noPost ?? false,
      enteredBy: reservation.enteredBy || '',
      inclusivePrivileges: reservation.inclusivePrivileges || ''
    }

    setFormData(draft)
  }

  // Filter guests based on search
  const filteredGuests = guests.filter(guest => {
    const searchLower = guestSearch.toLowerCase()
    return (
      guest.fullName?.toLowerCase().includes(searchLower) ||
      guest.firstName?.toLowerCase().includes(searchLower) ||
      guest.lastName?.toLowerCase().includes(searchLower) ||
      guest.phone?.toLowerCase().includes(searchLower) ||
      guest.email?.toLowerCase().includes(searchLower) ||
      guest.guestId?.toLowerCase().includes(searchLower)
    )
  })

  // Handle guest selection
  const handleGuestSelect = (guest) => {
    console.log('👤 Selected guest:', guest)
    setSelectedGuest(guest)
    setGuestSearch(`${guest.fullName} - ${guest.phone || 'No phone'} - ${guest.guestId}`)
    setShowGuestDropdown(false)
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      guestId: guest.id
    }))
  }

  // Fetch guests for dropdown
  const fetchGuests = async () => {
    try {
      const response = await axios.get('/guests')
      if (response.data.success) {
        setGuests(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching guests:', err)
    }
  }

  // Fetch available rooms
  const fetchAvailableRooms = async () => {
    try {
      const response = await axios.get('/rooms')
      if (response.data.success) {
        setRooms(response.data.data.filter(room => room.status === 'Available'))
      }
    } catch (err) {
      console.error('Error fetching rooms:', err)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchCheckIns()
    fetchReservations()
    fetchGuests()
    fetchAvailableRooms()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showReservationDropdown && !event.target.closest('.reservation-dropdown')) {
        setShowReservationDropdown(false)
      }
      if (showGuestDropdown && !event.target.closest('.guest-dropdown')) {
        setShowGuestDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showReservationDropdown, showGuestDropdown])

  // Handle form input changes (no auto-recalc; values come from reservation)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Calculate number of nights
  const calculateNights = () => {
    if (formData.checkInDate && formData.expectedCheckOutDate) {
      const checkIn = new Date(formData.checkInDate)
      const checkOut = new Date(formData.expectedCheckOutDate)
      const diffTime = Math.abs(checkOut - checkIn)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays || 1
    }
    return 1
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      setSuccess('')

      // Validate required fields
      if (!formData.guestId || !formData.roomId || !formData.checkInDate || !formData.expectedCheckOutDate) {
        setError('Please fill in all required fields (Guest, Room, Check-in Date, Check-out Date)')
        setLoading(false)
        return
      }

      // Prepare data with proper type conversions - matching database schema exactly
      const guestId = parseInt(formData.guestId)
      const roomId = parseInt(formData.roomId)
      const numberOfGuests = parseInt(formData.numberOfGuests) || 1
      const roomRate = parseFloat(formData.roomRate) || 0
      const totalAmount = parseFloat(formData.totalAmount) || 0
      const advancePaid = parseFloat(formData.advancePaid) || 0

      // Validate parsed values
      if (isNaN(guestId) || isNaN(roomId)) {
        setError('Invalid guest or room selection. Please select valid options.')
        setLoading(false)
        return
      }

      // Try minimal payload first to isolate the problematic field
      const submitData = {
        guestId,
        roomId,
        checkInDate: new Date(formData.checkInDate).toISOString(),
        expectedCheckOutDate: new Date(formData.expectedCheckOutDate).toISOString(),
        numberOfGuests,
        roomRate,
        totalAmount,
        advancePaid,
        specialRequests: formData.specialRequests || '',
        checkedInBy: formData.checkedInBy || 'Reception Staff',
        remarks: formData.remarks || '',

        // Optional fields
        discount: parseFloat(formData.discount) || 0,
        fbCredits: parseFloat(formData.fbCredits) || 0,
        paymentMethod: formData.paymentMethod || '',
        paymentAccount: formData.paymentAccount || '',
        ratePlanId: formData.ratePlanId || '',
        ntn: formData.ntn || '',
        guestName2: formData.guestName2 || '',
        guestName3: formData.guestName3 || '',
        groupId: formData.groupId || '',
        source: formData.source || '',
        market: formData.market || '',
        region: formData.region || '',
        industry: formData.industry || '',
        purpose: formData.purpose || '',
        referenceCompany: formData.referenceCompany || '',
        reservationMadeBy: formData.reservationMadeBy || '',
        pickup: !!formData.pickup,
        pickupStation: formData.pickupStation || '',
        pickupCarrier: formData.pickupCarrier || '',
        pickupTime: formData.pickupTime || '',
        dropOff: !!formData.dropOff,
        dropStation: formData.dropStation || '',
        btcFolio: formData.btcFolio || '',
        folio1: formData.folio1 || '',
        folio2: formData.folio2 || '',
        folio3: formData.folio3 || '',
        btcComments: formData.btcComments || '',
        btcId: formData.btcId || '',
        complimentary: !!formData.complimentary,
        company: formData.company || '',
        comingFrom: formData.comingFrom || '',
        newspaper: formData.newspaper || '',
        meals: formData.meals || '',
        vipStatus: formData.vipStatus || '',
        reservationNotes: formData.reservationNotes || '',
        checkinNotes: formData.checkinNotes || '',
        noPost: !!formData.noPost,
        enteredBy: formData.enteredBy || '',
        inclusivePrivileges: formData.inclusivePrivileges || ''
      }

      console.log('🔍 DEBUGGING: Testing with these exact values:')
      console.log('guestId (parsed):', guestId, 'type:', typeof guestId)
      console.log('roomId (parsed):', roomId, 'type:', typeof roomId)
      console.log('numberOfGuests (parsed):', numberOfGuests, 'type:', typeof numberOfGuests)
      console.log('roomRate (parsed):', roomRate, 'type:', typeof roomRate)
      console.log('totalAmount (parsed):', totalAmount, 'type:', typeof totalAmount)
      console.log('advancePaid (parsed):', advancePaid, 'type:', typeof advancePaid)

      // ✅ FIXED: Controller expects reservation ID as STRING, not number
      if (formData.reservationId && formData.reservationId !== '' && formData.reservationId !== 'undefined') {
        const reservationId = parseInt(formData.reservationId)
        if (!isNaN(reservationId) && reservationId > 0) {
          submitData.reservationId = reservationId.toString() // ✅ Send as string for controller
          console.log('✅ Including reservation ID as string for controller:', reservationId.toString())
        } else {
          console.log('⚠️ Invalid reservation ID, excluding:', formData.reservationId)
        }
      } else {
        console.log('ℹ️ No reservation ID provided, will be NULL in database')
      }

      if (editingId) {
        await axios.put(`/checkins/${editingId}`, { ...submitData, id: editingId })
        setSuccess('Check-in updated successfully!')
      } else {
        
        console.log('Sending check-in data:', submitData)
        console.log('Data types (numbers except reservationId as string):', {
          guestId: typeof submitData.guestId + ' = ' + submitData.guestId,
          roomId: typeof submitData.roomId + ' = ' + submitData.roomId,
          reservationId: typeof submitData.reservationId + ' = ' + submitData.reservationId,
          numberOfGuests: typeof submitData.numberOfGuests + ' = ' + submitData.numberOfGuests,
          roomRate: typeof submitData.roomRate + ' = ' + submitData.roomRate,
          totalAmount: typeof submitData.totalAmount + ' = ' + submitData.totalAmount,
          advancePaid: typeof submitData.advancePaid + ' = ' + submitData.advancePaid
        })
        const response = await axios.post('/checkins', submitData)
        console.log('Check-in response:', response.data)
        setSuccess(`Guest checked in successfully! Check-in Number: ${response.data.data?.checkInNumber || 'N/A'}`)
      }

      resetForm()
      fetchCheckIns()
      fetchAvailableRooms() // Refresh room availability
    } catch (err) {
      console.error('Check-in error:', err)
      console.error('Error response:', err.response?.data)
      const errorMessage = err.response?.data?.message || err.message || 'Error processing check-in'
      setError(`Check-in failed: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      reservationId: '',
      guestId: '',
      roomId: '',
      checkInDate: '', // ✅ Fix: Reset to empty, not current date
      expectedCheckOutDate: '',
      numberOfGuests: 1,
      roomRate: '',
      totalAmount: '',
      advancePaid: '',
      specialRequests: '',
      checkedInBy: 'Reception Staff',
      remarks: '',

      discount: 0,
      fbCredits: 0,
      paymentMethod: '',
      paymentAccount: '',
      ratePlanId: '',
      ntn: '',
      guestName2: '',
      guestName3: '',
      groupId: '',
      source: '',
      market: '',
      region: '',
      industry: '',
      purpose: '',
      referenceCompany: '',
      reservationMadeBy: '',
      pickup: false,
      pickupStation: '',
      pickupCarrier: '',
      pickupTime: '',
      dropOff: false,
      dropStation: '',
      btcFolio: '',
      folio1: '',
      folio2: '',
      folio3: '',
      btcComments: '',
      btcId: '',
      complimentary: false,
      company: '',
      comingFrom: '',
      newspaper: '',
      meals: '',
      vipStatus: '',
      reservationNotes: '',
      checkinNotes: '',
      noPost: false,
      enteredBy: '',
      inclusivePrivileges: ''
    })
    setEditingId(null)
    setShowForm(false)
  }

  // Handle edit
  const handleEdit = (checkIn) => {
    setFormData({
      reservationId: checkIn.reservationId?.toString() || '',
      guestId: checkIn.guestId?.toString() || '',
      roomId: checkIn.roomId?.toString() || '',
      checkInDate: checkIn.checkInDate?.split('T')[0] || '',
      expectedCheckOutDate: checkIn.expectedCheckOutDate?.split('T')[0] || '',
      numberOfGuests: checkIn.numberOfGuests || 1,
      roomRate: checkIn.roomRate?.toString() || '',
      totalAmount: checkIn.totalAmount?.toString() || '',
      advancePaid: checkIn.advancePaid?.toString() || '',
      specialRequests: checkIn.specialRequests || '',
      checkedInBy: checkIn.checkedInBy || 'Reception Staff',
      remarks: checkIn.remarks || '',

      discount: checkIn.discount ?? 0,
      fbCredits: checkIn.fbCredits ?? 0,
      paymentMethod: checkIn.paymentMethod || '',
      paymentAccount: checkIn.paymentAccount || '',
      ratePlanId: checkIn.ratePlanId || '',
      ntn: checkIn.ntn || '',
      guestName2: checkIn.guestName2 || '',
      guestName3: checkIn.guestName3 || '',
      groupId: checkIn.groupId || '',
      source: checkIn.source || '',
      market: checkIn.market || '',
      region: checkIn.region || '',
      industry: checkIn.industry || '',
      purpose: checkIn.purpose || '',
      referenceCompany: checkIn.referenceCompany || '',
      reservationMadeBy: checkIn.reservationMadeBy || '',
      pickup: checkIn.pickup ?? false,
      pickupStation: checkIn.pickupStation || '',
      pickupCarrier: checkIn.pickupCarrier || '',
      pickupTime: checkIn.pickupTime || '',
      dropOff: checkIn.dropOff ?? false,
      dropStation: checkIn.dropStation || '',
      btcFolio: checkIn.btcFolio || '',
      folio1: checkIn.folio1 || '',
      folio2: checkIn.folio2 || '',
      folio3: checkIn.folio3 || '',
      btcComments: checkIn.btcComments || '',
      btcId: checkIn.btcId || '',
      complimentary: checkIn.complimentary ?? false,
      company: checkIn.company || '',
      comingFrom: checkIn.comingFrom || '',
      newspaper: checkIn.newspaper || '',
      meals: checkIn.meals || '',
      vipStatus: checkIn.vipStatus || '',
      reservationNotes: checkIn.reservationNotes || '',
      checkinNotes: checkIn.checkinNotes || '',
      noPost: checkIn.noPost ?? false,
      enteredBy: checkIn.enteredBy || '',
      inclusivePrivileges: checkIn.inclusivePrivileges || ''
    })
    setEditingId(checkIn.id)
    setShowForm(true)
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this check-in?')) return
    
    try {
      setLoading(true)
      await axios.delete(`/checkins/${id}`)
      setSuccess('Check-in deleted successfully!')
      fetchCheckIns()
      fetchAvailableRooms() // Refresh room availability
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting check-in')
    } finally {
      setLoading(false)
    }
  }

  // Filter check-ins based on search
  const filteredCheckIns = checkIns.filter(checkIn =>
    checkIn.checkInNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    checkIn.guest?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    checkIn.room?.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 px-2.5 py-3 sm:px-4 sm:py-4 md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-[1.75rem] p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 text-white shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            <div className="bg-white/20 p-3 rounded-2xl shrink-0">
              <KeyIcon className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">Check-In Management</h1>
              <p className="text-blue-100 mt-1 text-sm sm:text-base">Manage guest check-ins and room assignments</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-white/20 hover:bg-white/30 px-4 sm:px-6 py-3 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-200 w-full sm:w-auto text-sm sm:text-base font-medium"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Check-In</span>
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by check-in number, guest name, or room number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      {/* Check-In Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto py-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4 my-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? 'Edit Check-In' : 'New Check-In'}
              </h2>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Searchable Reservation Selection */}
              <div className="relative reservation-dropdown">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reservation (Optional) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by reservation number, guest name, or room..."
                    value={reservationSearch}
                    onChange={(e) => {
                      setReservationSearch(e.target.value)
                      setShowReservationDropdown(true)
                    }}
                    onFocus={() => setShowReservationDropdown(true)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  />
                  <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                {/* Reservation Dropdown */}
                {showReservationDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredReservations.length > 0 ? (
                      <>
                        <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                          {filteredReservations.length} reservation(s) found
                        </div>
                        {filteredReservations.map(reservation => (
                          <div
                            key={reservation.id}
                            onClick={() => handleReservationSelect(reservation)}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900">
                              {reservation.reservationNumber}
                            </div>
                            <div className="text-sm text-gray-600">
                              {reservation.guest?.fullName || 'Guest'} • Room {reservation.room?.roomNumber}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(reservation.checkInDate).toLocaleDateString()} - {new Date(reservation.checkOutDate).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </>
                    ) : reservationSearch ? (
                      <div className="px-4 py-3 text-gray-500 text-center">
                        No reservations found matching "{reservationSearch}"
                      </div>
                    ) : (
                      <div className="px-4 py-3 text-gray-500 text-center">
                        Type to search reservations...
                      </div>
                    )}
                    <div 
                      onClick={() => {
                        setReservationSearch('')
                        setSelectedReservation(null)
                        setShowReservationDropdown(false)
                        setFormData(prev => ({ ...prev, reservationId: '', guestId: '', roomId: '' }))
                      }}
                      className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer border-t"
                    >
                      Clear Selection
                    </div>
                  </div>
                )}
              </div>

              {/* Searchable Guest Selection */}
              <div className="relative guest-dropdown">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guest * {selectedReservation && <span className="text-blue-600 text-xs">(From Reservation)</span>}
                </label>
                {selectedReservation ? (
                  <div className="w-full px-4 py-2 border border-blue-300 bg-blue-50 rounded-lg text-gray-700">
                    {selectedReservation.guest?.fullName || 'Guest Name'} 
                    <span className="text-sm text-gray-500 ml-2">({selectedReservation.guest?.phone || 'No phone'})</span>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by name, phone, email, or guest ID..."
                        value={guestSearch}
                        onChange={(e) => {
                          setGuestSearch(e.target.value)
                          setShowGuestDropdown(true)
                        }}
                        onFocus={() => setShowGuestDropdown(true)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        required
                      />
                      <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    
                    {/* Guest Dropdown */}
                    {showGuestDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredGuests.length > 0 ? (
                          <>
                            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                              {filteredGuests.length} guest(s) found
                            </div>
                            {filteredGuests.map(guest => (
                              <div
                                key={guest.id}
                                onClick={() => handleGuestSelect(guest)}
                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              >
                                <div className="font-medium text-gray-900">
                                  {guest.fullName}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {guest.phone || 'No phone'} • {guest.email || 'No email'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Guest ID: {guest.guestId}
                                </div>
                              </div>
                            ))}
                          </>
                        ) : guestSearch ? (
                          <div className="px-4 py-3 text-gray-500 text-center">
                            No guests found matching "{guestSearch}"
                          </div>
                        ) : (
                          <div className="px-4 py-3 text-gray-500 text-center">
                            Type to search guests...
                          </div>
                        )}
                        <div 
                          onClick={() => {
                            setGuestSearch('')
                            setSelectedGuest(null)
                            setShowGuestDropdown(false)
                            setFormData(prev => ({ ...prev, guestId: '' }))
                          }}
                          className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer border-t"
                        >
                          Clear Selection
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Room Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room * {selectedReservation && <span className="text-blue-600 text-xs">(From Reservation)</span>}
                </label>
                {selectedReservation ? (
                  <div className="w-full px-4 py-2 border border-blue-300 bg-blue-50 rounded-lg text-gray-700">
                    Room {selectedReservation.room?.roomNumber} - Floor {selectedReservation.room?.floorNumber || 'N/A'}
                    <span className="text-sm text-gray-500 ml-2">({selectedReservation.room?.roomType?.name || 'Standard'})</span>
                  </div>
                ) : (
                  <select
                    name="roomId"
                    value={formData.roomId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Room</option>
                    {rooms.map(room => (
                      <option key={room.id} value={room.id}>
                        Room {room.roomNumber} - Floor {room.floorNumber}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Check-In Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-In Date *
                </label>
                <input
                  type="date"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Expected Check-Out Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Check-Out Date *
                </label>
                <input
                  type="date"
                  name="expectedCheckOutDate"
                  value={formData.expectedCheckOutDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests *
                </label>
                <input
                  type="number"
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Room Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Rate (Rs.) *
                </label>
                <input
                  type="number"
                  name="roomRate"
                  value={formData.roomRate}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Total Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount (Rs.)
                </label>
                <input
                  type="number"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
                <p className="text-sm text-gray-500 mt-1">
                  Nights: {calculateNights()} | Auto-calculated based on rate and duration
                </p>
              </div>

              {/* Advance Paid */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Advance Paid (Rs.)
                </label>
                <input
                  type="number"
                  name="advancePaid"
                  value={formData.advancePaid}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any special requests or notes..."
              />
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Internal remarks..."
              />
            </div>

            {/* === Collapsible: Pricing & Payment === */}
            <div className="border border-gray-200 rounded-lg">
              <button type="button" onClick={() => toggleSection('pricing')}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg">
                <span className="font-semibold text-gray-700">Pricing & Payment</span>
                {expandedSections.pricing ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
              </button>
              {expandedSections.pricing && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                    <input type="number" name="discount" value={formData.discount} onChange={handleChange} step="0.01" min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">F&B Credits</label>
                    <input type="number" name="fbCredits" value={formData.fbCredits} onChange={handleChange} step="0.01" min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select</option>
                      <option value="Cash">Cash</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Online">Online</option>
                      <option value="BTC">Bill to Company</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Account</label>
                    <input type="text" name="paymentAccount" value={formData.paymentAccount} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g. 10001-Credit Cards" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rate Plan ID</label>
                    <input type="text" name="ratePlanId" value={formData.ratePlanId} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NTN (Tax Number)</label>
                    <input type="text" name="ntn" value={formData.ntn} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
              )}
            </div>

            {/* === Collapsible: Guest Companions === */}
            <div className="border border-gray-200 rounded-lg">
              <button type="button" onClick={() => toggleSection('companions')}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg">
                <span className="font-semibold text-gray-700">Guest Companions & Group</span>
                {expandedSections.companions ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
              </button>
              {expandedSections.companions && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name 2</label>
                    <input type="text" name="guestName2" value={formData.guestName2} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name 3</label>
                    <input type="text" name="guestName3" value={formData.guestName3} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Group ID</label>
                    <input type="text" name="groupId" value={formData.groupId} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
              )}
            </div>

            {/* === Collapsible: Marketing / Source === */}
            <div className="border border-gray-200 rounded-lg">
              <button type="button" onClick={() => toggleSection('marketing')}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg">
                <span className="font-semibold text-gray-700">Marketing & Source</span>
                {expandedSections.marketing ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
              </button>
              {expandedSections.marketing && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                    <select name="source" value={formData.source} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select</option>
                      <option value="Online">Online</option>
                      <option value="Walk-in">Walk-in</option>
                      <option value="Phone">Phone</option>
                      <option value="Agent">Agent</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Referral">Referral</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Market</label>
                    <select name="market" value={formData.market} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select</option>
                      <option value="Front Office">Front Office</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Government">Government</option>
                      <option value="Travel Agent">Travel Agent</option>
                      <option value="OTA">OTA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                    <input type="text" name="region" value={formData.region} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <input type="text" name="industry" value={formData.industry} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                    <input type="text" name="purpose" value={formData.purpose} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reference Company</label>
                    <input type="text" name="referenceCompany" value={formData.referenceCompany} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reservation Made By</label>
                    <input type="text" name="reservationMadeBy" value={formData.reservationMadeBy} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
              )}
            </div>

            {/* === Collapsible: Transport / Pickup === */}
            <div className="border border-gray-200 rounded-lg">
              <button type="button" onClick={() => toggleSection('transport')}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg">
                <span className="font-semibold text-gray-700">Transport / Pickup & Drop</span>
                {expandedSections.transport ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
              </button>
              {expandedSections.transport && (
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" name="pickup" checked={!!formData.pickup} onChange={handleChange} />
                      <label className="text-sm font-medium text-gray-700">Pickup</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" name="dropOff" checked={!!formData.dropOff} onChange={handleChange} />
                      <label className="text-sm font-medium text-gray-700">Drop Off</label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Station</label>
                      <input type="text" name="pickupStation" value={formData.pickupStation} onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Carrier</label>
                      <input type="text" name="pickupCarrier" value={formData.pickupCarrier} onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
                      <input type="text" name="pickupTime" value={formData.pickupTime} onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Drop Station</label>
                      <input type="text" name="dropStation" value={formData.dropStation} onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* === Collapsible: Folio === */}
            <div className="border border-gray-200 rounded-lg">
              <button type="button" onClick={() => toggleSection('folio')}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg">
                <span className="font-semibold text-gray-700">Folio & BTC</span>
                {expandedSections.folio ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
              </button>
              {expandedSections.folio && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">BTC Folio</label>
                    <input type="text" name="btcFolio" value={formData.btcFolio} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Folio 1</label>
                    <input type="text" name="folio1" value={formData.folio1} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Folio 2</label>
                    <input type="text" name="folio2" value={formData.folio2} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Folio 3</label>
                    <input type="text" name="folio3" value={formData.folio3} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
              )}
            </div>

            {/* === Collapsible: Additional Info === */}
            <div className="border border-gray-200 rounded-lg">
              <button type="button" onClick={() => toggleSection('additional')}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg">
                <span className="font-semibold text-gray-700">Additional Information</span>
                {expandedSections.additional ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
              </button>
              {expandedSections.additional && (
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">BTC Comments</label>
                      <input type="text" name="btcComments" value={formData.btcComments} onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">BTC ID</label>
                      <input type="text" name="btcId" value={formData.btcId} onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                      <input type="checkbox" name="complimentary" checked={!!formData.complimentary} onChange={handleChange} />
                      <label className="text-sm font-medium text-gray-700">Complimentary</label>
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                      <input type="checkbox" name="noPost" checked={!!formData.noPost} onChange={handleChange} />
                      <label className="text-sm font-medium text-gray-700">No Post</label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input type="text" name="company" value={formData.company} onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Coming From</label>
                      <input type="text" name="comingFrom" value={formData.comingFrom} onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Newspaper</label>
                      <input type="text" name="newspaper" value={formData.newspaper} onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meals</label>
                      <input type="text" name="meals" value={formData.meals} onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">VIP Status</label>
                      <input type="text" name="vipStatus" value={formData.vipStatus} onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reservation Notes</label>
                      <input type="text" name="reservationNotes" value={formData.reservationNotes} onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Notes</label>
                      <input type="text" name="checkinNotes" value={formData.checkinNotes} onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Entered By</label>
                      <input type="text" name="enteredBy" value={formData.enteredBy} onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div className="md:col-span-2 lg:col-span-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Inclusive Privileges</label>
                      <textarea name="inclusivePrivileges" value={formData.inclusivePrivileges} onChange={handleChange} rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Processing...' : editingId ? 'Update Check-In' : 'Check-In Guest'}
              </button>
            </div>
          </form>
          </div>
        </div>
      )}

      {/* Check-Ins List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Check-Ins ({filteredCheckIns.length})
          </h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading check-ins...</p>
          </div>
        ) : filteredCheckIns.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <KeyIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No check-ins found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-In Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest & Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount & Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCheckIns.map((checkIn) => (
                  <tr key={checkIn.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {checkIn.checkInNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          Guests: {checkIn.numberOfGuests}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {checkIn.guest?.fullName || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Room {checkIn.room?.roomNumber || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        In: {new Date(checkIn.checkInDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Out: {new Date(checkIn.expectedCheckOutDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Rs. {checkIn.totalAmount?.toLocaleString()}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        checkIn.status === 'Active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {checkIn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(checkIn)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(checkIn.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckIn;
