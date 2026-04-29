import { useEffect, useMemo, useState } from 'react'
import axios from '../../utils/axios'
import {
  KeyIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const toLocalYmd = (date) => {
  const d = date instanceof Date ? date : new Date(date)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const addDaysYmd = (ymd, days) => {
  if (!ymd) return ''
  const base = new Date(`${ymd}T00:00:00`)
  if (Number.isNaN(base.getTime())) return ''
  base.setDate(base.getDate() + days)
  return toLocalYmd(base)
}

const normalizeYmd = (value) => {
  if (!value) return ''
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
    const tSplit = value.split('T')[0]
    if (/^\d{4}-\d{2}-\d{2}$/.test(tSplit)) return tSplit
  }
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return toLocalYmd(d)
}

const Panel = ({ title, right, children }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-between">
        <div className="text-sm font-semibold tracking-wide">{title}</div>
        {right}
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}

const Field = ({ label, hint, children }) => {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">{label}</label>
      {children}
      {hint ? <div className="text-[11px] text-gray-500 mt-1">{hint}</div> : null}
    </div>
  )
}

const inputClass =
  'w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white'

const readonlyClass =
  'w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-700'

const selectClass = inputClass

const CheckInModern = () => {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)

  const [reservationSearch, setReservationSearch] = useState('')
  const [showReservationDropdown, setShowReservationDropdown] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState(null)

  const [guestSearch, setGuestSearch] = useState('')
  const [showGuestDropdown, setShowGuestDropdown] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState(null)

  const [formData, setFormData] = useState({
    reservationId: '',
    guestId: '',
    roomId: '',
    checkInDate: '',
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

  const [checkIns, setCheckIns] = useState([])
  const [reservations, setReservations] = useState([])
  const [guests, setGuests] = useState([])
  const [rooms, setRooms] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const todayYmd = useMemo(() => toLocalYmd(new Date()), [])

  const isCheckInDateToday = useMemo(() => {
    if (!formData.checkInDate) return false
    return String(formData.checkInDate) === String(todayYmd)
  }, [formData.checkInDate, todayYmd])

  const arrivalBaseYmd = useMemo(() => {
    const fromSelected = selectedReservation?.checkInDate ? normalizeYmd(selectedReservation.checkInDate) : ''
    if (fromSelected) return fromSelected

    const rid = formData.reservationId
    if (rid) {
      const found = reservations.find((r) => String(r.id) === String(rid))
      const fromList = found?.checkInDate ? normalizeYmd(found.checkInDate) : ''
      if (fromList) return fromList
    }

    return formData.checkInDate || ''
  }, [formData.checkInDate, formData.reservationId, reservations, selectedReservation])

  const isArrivalWindowToday = useMemo(() => {
    if (!arrivalBaseYmd) return false
    const base = new Date(`${arrivalBaseYmd}T00:00:00`)
    const today = new Date(`${todayYmd}T00:00:00`)
    if (Number.isNaN(base.getTime()) || Number.isNaN(today.getTime())) return false
    const diffDays = Math.round((today.getTime() - base.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays === 0 || diffDays === 1
  }, [arrivalBaseYmd, todayYmd])

  const isAllowedToCheckIn = useMemo(() => {
    return isCheckInDateToday && isArrivalWindowToday
  }, [isArrivalWindowToday, isCheckInDateToday])

  const canSubmit = useMemo(() => {
    if (loading) return false
    if (editingId) return true
    return isAllowedToCheckIn
  }, [editingId, isAllowedToCheckIn, loading])

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

  const fetchReservations = async () => {
    try {
      const response = await axios.get('/reservations?pageSize=100')
      if (response.data.success) {
        const availableReservations = response.data.data.filter(
          (r) => r.status === 'Confirmed' || r.status === 'Pending'
        )
        setReservations(availableReservations)
      }
    } catch (err) {
      console.error('Error fetching reservations:', err)
    }
  }

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

  const fetchAvailableRooms = async () => {
    try {
      const response = await axios.get('/rooms')
      if (response.data.success) {
        setRooms(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching rooms:', err)
    }
  }

  useEffect(() => {
    fetchCheckIns()
    fetchReservations()
    fetchGuests()
    fetchAvailableRooms()
  }, [])

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

  const filteredReservations = useMemo(() => {
    const searchLower = reservationSearch.toLowerCase()
    return reservations.filter((reservation) => {
      return (
        reservation.reservationNumber?.toLowerCase().includes(searchLower) ||
        reservation.guest?.fullName?.toLowerCase().includes(searchLower) ||
        reservation.guest?.firstName?.toLowerCase().includes(searchLower) ||
        reservation.guest?.lastName?.toLowerCase().includes(searchLower) ||
        reservation.room?.roomNumber?.toLowerCase().includes(searchLower)
      )
    })
  }, [reservationSearch, reservations])

  const filteredGuests = useMemo(() => {
    const searchLower = guestSearch.toLowerCase()
    return guests.filter((guest) => {
      return (
        guest.fullName?.toLowerCase().includes(searchLower) ||
        guest.firstName?.toLowerCase().includes(searchLower) ||
        guest.lastName?.toLowerCase().includes(searchLower) ||
        guest.phone?.toLowerCase().includes(searchLower) ||
        guest.email?.toLowerCase().includes(searchLower) ||
        guest.guestId?.toLowerCase().includes(searchLower)
      )
    })
  }, [guestSearch, guests])

  const roomOptions = useMemo(() => {
    const currentRoomId = formData.roomId ? String(formData.roomId) : ''
    return rooms.filter((room) => room.status === 'Available' || String(room.id) === currentRoomId)
  }, [formData.roomId, rooms])

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  useEffect(() => {
    if (selectedReservation) return
    if (!formData.roomRate || !formData.checkInDate || !formData.expectedCheckOutDate) return

    const rate = parseFloat(formData.roomRate)
    if (Number.isNaN(rate)) return

    const checkIn = new Date(formData.checkInDate)
    const checkOut = new Date(formData.expectedCheckOutDate)
    if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) return

    const diffTime = Math.abs(checkOut - checkIn)
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1
    const total = rate * nights

    setFormData((prev) => {
      const prevTotal = prev.totalAmount === '' ? NaN : parseFloat(prev.totalAmount)
      if (!Number.isNaN(prevTotal) && Math.abs(prevTotal - total) < 0.01) return prev
      return { ...prev, totalAmount: total }
    })
  }, [formData.checkInDate, formData.expectedCheckOutDate, formData.roomRate, selectedReservation])

  const handleReservationSelect = (reservation) => {
    setSelectedReservation(reservation)
    setReservationSearch(
      `${reservation.reservationNumber} - ${reservation.guest?.fullName || 'Guest'} - Room ${
        reservation.room?.roomNumber
      }`
    )
    setShowReservationDropdown(false)

    const reservationArrivalYmd = normalizeYmd(reservation.checkInDate)
    const reservationArrivalPlus1Ymd = addDaysYmd(reservationArrivalYmd, 1)
    const shouldAutoUseToday = todayYmd && (todayYmd === reservationArrivalYmd || todayYmd === reservationArrivalPlus1Ymd)

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
      checkInDate: shouldAutoUseToday ? todayYmd : reservationArrivalYmd,
      expectedCheckOutDate: normalizeYmd(reservation.checkOutDate),
      numberOfGuests: reservation.numberOfAdults + (reservation.numberOfChildren || 0),
      roomRate: totalFromReservation,
      totalAmount: totalFromReservation,
      specialRequests: reservation.specialRequests || '',

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

  const handleGuestSelect = (guest) => {
    setSelectedGuest(guest)
    setGuestSearch(`${guest.fullName} - ${guest.phone || 'No phone'} - ${guest.guestId}`)
    setShowGuestDropdown(false)

    setFormData((prev) => ({
      ...prev,
      guestId: guest.id
    }))
  }

  const resetForm = () => {
    setFormData({
      reservationId: '',
      guestId: '',
      roomId: '',
      checkInDate: '',
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
    setSelectedReservation(null)
    setSelectedGuest(null)
    setReservationSearch('')
    setGuestSearch('')
    setShowReservationDropdown(false)
    setShowGuestDropdown(false)
    setShowForm(false)
  }

  const handleEdit = (checkIn) => {
    const reservationIdText = checkIn.reservationId?.toString() || ''
    const reservationFromList = reservationIdText
      ? reservations.find((r) => String(r.id) === String(reservationIdText))
      : null

    const guestFromList = checkIn.guestId ? guests.find((g) => String(g.id) === String(checkIn.guestId)) : null

    const fallbackReservation = reservationFromList
      ? reservationFromList
      : reservationIdText
        ? {
            id: reservationIdText,
            reservationNumber: reservationIdText,
            guest: checkIn.guest || guestFromList || null,
            room: checkIn.room || null,
            checkInDate: checkIn.checkInDate || null,
            checkOutDate: checkIn.expectedCheckOutDate || null
          }
        : null

    setSelectedReservation(fallbackReservation)
    setSelectedGuest(guestFromList || null)
    setShowReservationDropdown(false)
    setShowGuestDropdown(false)

    if (fallbackReservation) {
      setReservationSearch(
        `${fallbackReservation.reservationNumber} - ${fallbackReservation.guest?.fullName || 'Guest'} - Room ${
          fallbackReservation.room?.roomNumber
        }`
      )
    } else {
      setReservationSearch('')
    }

    const guestLabel = guestFromList || checkIn.guest
    if (guestLabel?.fullName) {
      setGuestSearch(
        `${guestLabel.fullName} - ${guestLabel.phone || 'No phone'}${guestLabel.guestId ? ` - ${guestLabel.guestId}` : ''}`
      )
    } else {
      setGuestSearch('')
    }

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this check-in?')) return

    try {
      setLoading(true)
      await axios.delete(`/checkins/${id}`)
      setSuccess('Check-in deleted successfully!')
      fetchCheckIns()
      fetchAvailableRooms()
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting check-in')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!editingId && !isAllowedToCheckIn) {
      const arrivalPlus1 = addDaysYmd(arrivalBaseYmd, 1)
      if (!isCheckInDateToday) {
        setError('Check-in is only allowed when Arrival/Check-in Date is today.')
      } else {
        setError(`Check-in is only allowed on arrival date (${arrivalBaseYmd}) or the next day (${arrivalPlus1}).`)
      }
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      if (!formData.guestId || !formData.roomId || !formData.checkInDate || !formData.expectedCheckOutDate) {
        setError('Please fill in all required fields (Guest, Room, Check-in Date, Check-out Date)')
        setLoading(false)
        return
      }

      const guestId = parseInt(formData.guestId)
      const roomId = parseInt(formData.roomId)
      const numberOfGuests = parseInt(formData.numberOfGuests) || 1
      const roomRate = parseFloat(formData.roomRate) || 0
      const totalAmount = parseFloat(formData.totalAmount) || 0
      const advancePaid = parseFloat(formData.advancePaid) || 0

      if (isNaN(guestId) || isNaN(roomId)) {
        setError('Invalid guest or room selection. Please select valid options.')
        setLoading(false)
        return
      }

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

      if (formData.reservationId && formData.reservationId !== '' && formData.reservationId !== 'undefined') {
        const reservationId = parseInt(formData.reservationId)
        if (!isNaN(reservationId) && reservationId > 0) {
          submitData.reservationId = reservationId.toString()
        }
      }

      if (editingId) {
        await axios.put(`/checkins/${editingId}`, { ...submitData, id: editingId })
        setSuccess('Check-in updated successfully!')
      } else {
        const response = await axios.post('/checkins', submitData)
        setSuccess(
          `Guest checked in successfully! Check-in Number: ${response.data.data?.checkInNumber || 'N/A'}`
        )
      }

      resetForm()
      fetchCheckIns()
      fetchAvailableRooms()
    } catch (err) {
      console.error('Check-in error:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Error processing check-in'
      setError(`Check-in failed: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredCheckIns = useMemo(() => {
    const q = searchTerm.toLowerCase()
    return checkIns.filter(
      (checkIn) =>
        checkIn.checkInNumber?.toLowerCase().includes(q) ||
        checkIn.guest?.fullName?.toLowerCase().includes(q) ||
        checkIn.room?.roomNumber?.toLowerCase().includes(q)
    )
  }, [checkIns, searchTerm])

  return (
    <div className="min-h-screen bg-gray-50 px-2.5 py-3 sm:px-4 sm:py-4 md:p-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-[1.75rem] p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 text-white shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            <div className="bg-white/20 p-3 rounded-2xl shrink-0">
              <KeyIcon className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">Check-In Management</h1>
              <p className="text-blue-100 mt-1 text-sm sm:text-base">
                Manage guest check-ins and room assignments
              </p>
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

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto py-6">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl mx-4 my-4 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-5 py-3 flex items-center justify-between">
              <div className="font-semibold">{editingId ? 'Edit Guest Check-In' : 'Guest Check-In'}</div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-gray-100">
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-end">
                  <div className="md:col-span-4 reservation-dropdown relative">
                    <Field label="Reservation (Optional)">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search reservation# / guest / room"
                          value={reservationSearch}
                          onChange={(e) => {
                            setReservationSearch(e.target.value)
                            setShowReservationDropdown(true)
                          }}
                          onFocus={() => setShowReservationDropdown(true)}
                          className={inputClass + ' pr-10'}
                        />
                        <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>

                      {showReservationDropdown && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredReservations.length > 0 ? (
                            <>
                              <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                                {filteredReservations.length} reservation(s) found
                              </div>
                              {filteredReservations.map((reservation) => (
                                <div
                                  key={reservation.id}
                                  onClick={() => handleReservationSelect(reservation)}
                                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                >
                                  <div className="font-medium text-gray-900">{reservation.reservationNumber}</div>
                                  <div className="text-sm text-gray-600">
                                    {reservation.guest?.fullName || 'Guest'} • Room {reservation.room?.roomNumber}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(reservation.checkInDate).toLocaleDateString()} -{' '}
                                    {new Date(reservation.checkOutDate).toLocaleDateString()}
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : reservationSearch ? (
                            <div className="px-4 py-3 text-gray-500 text-center">
                              No reservations found matching "{reservationSearch}"
                            </div>
                          ) : (
                            <div className="px-4 py-3 text-gray-500 text-center">Type to search reservations...</div>
                          )}

                          <div
                            onClick={() => {
                              setReservationSearch('')
                              setSelectedReservation(null)
                              setShowReservationDropdown(false)
                              setFormData((prev) => ({ ...prev, reservationId: '', guestId: '', roomId: '' }))
                            }}
                            className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer border-t"
                          >
                            Clear Selection
                          </div>
                        </div>
                      )}
                    </Field>
                  </div>

                  <div className="md:col-span-3 guest-dropdown relative">
                    <Field
                      label={
                        <>
                          Guest{' '}
                          {selectedReservation ? (
                            <span className="text-[11px] text-blue-700 font-semibold">(From Reservation)</span>
                          ) : null}
                        </>
                      }
                    >
                      {selectedReservation ? (
                        <div className={readonlyClass}>
                          {selectedReservation.guest?.fullName || 'Guest Name'}
                          <span className="text-xs text-gray-500 ml-2">
                            ({selectedReservation.guest?.phone || 'No phone'})
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Search guest by name/phone/email"
                              value={guestSearch}
                              onChange={(e) => {
                                setGuestSearch(e.target.value)
                                setShowGuestDropdown(true)
                              }}
                              onFocus={() => setShowGuestDropdown(true)}
                              className={inputClass + ' pr-10'}
                              required
                            />
                            <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          </div>

                          {showGuestDropdown && (
                            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                              {filteredGuests.length > 0 ? (
                                <>
                                  <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                                    {filteredGuests.length} guest(s) found
                                  </div>
                                  {filteredGuests.map((guest) => (
                                    <div
                                      key={guest.id}
                                      onClick={() => handleGuestSelect(guest)}
                                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    >
                                      <div className="font-medium text-gray-900">{guest.fullName}</div>
                                      <div className="text-sm text-gray-600">
                                        {guest.phone || 'No phone'} • {guest.email || 'No email'}
                                      </div>
                                      <div className="text-xs text-gray-500">Guest ID: {guest.guestId}</div>
                                    </div>
                                  ))}
                                </>
                              ) : guestSearch ? (
                                <div className="px-4 py-3 text-gray-500 text-center">
                                  No guests found matching "{guestSearch}"
                                </div>
                              ) : (
                                <div className="px-4 py-3 text-gray-500 text-center">Type to search guests...</div>
                              )}

                              <div
                                onClick={() => {
                                  setGuestSearch('')
                                  setSelectedGuest(null)
                                  setShowGuestDropdown(false)
                                  setFormData((prev) => ({ ...prev, guestId: '' }))
                                }}
                                className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer border-t"
                              >
                                Clear Selection
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </Field>
                  </div>

                  <div className="md:col-span-2">
                    <Field
                      label={
                        <>
                          Room{' '}
                          {selectedReservation ? (
                            <span className="text-[11px] text-blue-700 font-semibold">(From Reservation)</span>
                          ) : null}
                        </>
                      }
                    >
                      {selectedReservation && !editingId ? (
                        <div className={readonlyClass}>
                          Room {selectedReservation.room?.roomNumber} - Floor {selectedReservation.room?.floorNumber || 'N/A'}
                          <span className="text-xs text-gray-500 ml-2">
                            ({selectedReservation.room?.roomType?.name || 'Standard'})
                          </span>
                        </div>
                      ) : (
                        <select
                          name="roomId"
                          value={formData.roomId}
                          onChange={handleChange}
                          required
                          className={selectClass}
                        >
                          <option value="">Select Room</option>
                          {roomOptions.map((room) => (
                            <option key={room.id} value={room.id}>
                              Room {room.roomNumber} - Floor {room.floorNumber}
                            </option>
                          ))}
                        </select>
                      )}
                    </Field>
                  </div>

                  <div className="md:col-span-3">
                    <Field
                      label="Arrival / Check-In Date"
                      hint={
                        !editingId
                          ? `Allowed on arrival date (${arrivalBaseYmd}) or next day (${addDaysYmd(arrivalBaseYmd, 1)}). Today: ${todayYmd}`
                          : undefined
                      }
                    >
                      <input
                        type="date"
                        name="checkInDate"
                        value={formData.checkInDate}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </div>
              </div>

              <div className="p-3 max-h-[74vh] overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                  <div className="lg:col-span-3 space-y-3">
                    <Panel
                      title="Guest Information"
                      right={
                        <div className="text-[11px] font-semibold text-white/90">
                          Res#: {formData.reservationId || 'N/A'}
                        </div>
                      }
                    >
                      <div className="space-y-2.5">
                        <Field label="Number of Guests *">
                          <input
                            type="number"
                            name="numberOfGuests"
                            value={formData.numberOfGuests}
                            onChange={handleChange}
                            min="1"
                            max="10"
                            required
                            className={inputClass}
                          />
                        </Field>

                        <div className="grid grid-cols-1 gap-2.5">
                          <Field label="Guest Name 2">
                            <input name="guestName2" value={formData.guestName2} onChange={handleChange} className={inputClass} />
                          </Field>
                          <Field label="Guest Name 3">
                            <input name="guestName3" value={formData.guestName3} onChange={handleChange} className={inputClass} />
                          </Field>
                          <Field label="Group ID">
                            <input name="groupId" value={formData.groupId} onChange={handleChange} className={inputClass} />
                          </Field>
                        </div>
                      </div>
                    </Panel>

                    <Panel title="Accompanying / Notes">
                      <div className="space-y-2.5">
                        <Field label="Reservation Notes">
                          <textarea
                            name="reservationNotes"
                            value={formData.reservationNotes}
                            onChange={handleChange}
                            rows={2}
                            className={inputClass}
                          />
                        </Field>
                        <Field label="Check-in Notes">
                          <textarea
                            name="checkinNotes"
                            value={formData.checkinNotes}
                            onChange={handleChange}
                            rows={2}
                            className={inputClass}
                          />
                        </Field>
                      </div>
                    </Panel>

                    <Panel title="Special Requests">
                      <Field label="Special Requests">
                        <textarea
                          name="specialRequests"
                          value={formData.specialRequests}
                          onChange={handleChange}
                          rows={2}
                          className={inputClass}
                          placeholder="Any special requests or notes..."
                        />
                      </Field>
                    </Panel>

                    <Panel title="Remarks">
                      <Field label="Remarks">
                        <textarea
                          name="remarks"
                          value={formData.remarks}
                          onChange={handleChange}
                          rows={2}
                          className={inputClass}
                          placeholder="Internal remarks..."
                        />
                      </Field>
                    </Panel>
                  </div>

                  <div className="lg:col-span-6 space-y-3">
                    <Panel
                      title="Reservation Details"
                      right={
                        <div className="text-[11px] font-semibold text-white/90">
                          Nights: {calculateNights()}
                        </div>
                      }
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        <Field label="Expected Check-Out Date *">
                          <input
                            type="date"
                            name="expectedCheckOutDate"
                            value={formData.expectedCheckOutDate}
                            onChange={handleChange}
                            required
                            className={inputClass}
                          />
                        </Field>

                        <Field label="NTN (Tax Number)">
                          <input name="ntn" value={formData.ntn} onChange={handleChange} className={inputClass} />
                        </Field>

                        <Field label="Room Rate (Rs.) *">
                          <input
                            type="number"
                            name="roomRate"
                            value={formData.roomRate}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            required
                            className={inputClass}
                          />
                        </Field>

                        <Field label="Total Amount (Rs.)" hint="Auto-calculated based on rate and duration">
                          <input
                            type="number"
                            name="totalAmount"
                            value={formData.totalAmount}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className={readonlyClass}
                            readOnly
                          />
                        </Field>

                        <Field label="Advance Paid (Rs.)">
                          <input
                            type="number"
                            name="advancePaid"
                            value={formData.advancePaid}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className={inputClass}
                          />
                        </Field>

                        <Field label="Discount">
                          <input
                            type="number"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className={inputClass}
                          />
                        </Field>

                        <Field label="F&B Credits">
                          <input
                            type="number"
                            name="fbCredits"
                            value={formData.fbCredits}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className={inputClass}
                          />
                        </Field>

                        <Field label="Checked In By">
                          <input name="checkedInBy" value={formData.checkedInBy} onChange={handleChange} className={inputClass} />
                        </Field>
                      </div>
                    </Panel>

                    <Panel title="Billing & Payment">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
                        <Field label="Payment Method">
                          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className={selectClass}>
                            <option value="">Select</option>
                            <option value="Cash">Cash</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Debit Card">Debit Card</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Online">Online</option>
                            <option value="BTC">Bill to Company</option>
                          </select>
                        </Field>

                        <Field label="Payment Account">
                          <input
                            type="text"
                            name="paymentAccount"
                            value={formData.paymentAccount}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="e.g. 10001-Credit Cards"
                          />
                        </Field>

                        <Field label="Rate Plan ID">
                          <input name="ratePlanId" value={formData.ratePlanId} onChange={handleChange} className={inputClass} />
                        </Field>

                        <Field label="BTC Folio">
                          <input name="btcFolio" value={formData.btcFolio} onChange={handleChange} className={inputClass} />
                        </Field>

                        <Field label="Folio 1">
                          <input name="folio1" value={formData.folio1} onChange={handleChange} className={inputClass} />
                        </Field>
                        <Field label="Folio 2">
                          <input name="folio2" value={formData.folio2} onChange={handleChange} className={inputClass} />
                        </Field>
                        <Field label="Folio 3">
                          <input name="folio3" value={formData.folio3} onChange={handleChange} className={inputClass} />
                        </Field>

                        <Field label="BTC ID">
                          <input name="btcId" value={formData.btcId} onChange={handleChange} className={inputClass} />
                        </Field>

                        <div className="lg:col-span-2">
                          <Field label="BTC Comments">
                            <input name="btcComments" value={formData.btcComments} onChange={handleChange} className={inputClass} />
                          </Field>
                        </div>

                        <Field label="Company">
                          <input name="company" value={formData.company} onChange={handleChange} className={inputClass} />
                        </Field>

                        <div className="flex items-center gap-2 mt-6">
                          <input type="checkbox" name="complimentary" checked={!!formData.complimentary} onChange={handleChange} />
                          <label className="text-sm font-medium text-gray-700">Complimentary</label>
                        </div>
                        <div className="flex items-center gap-2 mt-6">
                          <input type="checkbox" name="noPost" checked={!!formData.noPost} onChange={handleChange} />
                          <label className="text-sm font-medium text-gray-700">No Post</label>
                        </div>
                      </div>
                    </Panel>

                    <Panel title="Additional Information">
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5">
                        <Field label="Newspaper">
                          <input name="newspaper" value={formData.newspaper} onChange={handleChange} className={inputClass} />
                        </Field>
                        <Field label="Meals">
                          <input name="meals" value={formData.meals} onChange={handleChange} className={inputClass} />
                        </Field>
                        <Field label="VIP Status">
                          <input name="vipStatus" value={formData.vipStatus} onChange={handleChange} className={inputClass} />
                        </Field>
                        <Field label="Entered By">
                          <input name="enteredBy" value={formData.enteredBy} onChange={handleChange} className={inputClass} />
                        </Field>

                        <div className="col-span-full">
                          <Field label="Inclusive Privileges">
                            <textarea
                              name="inclusivePrivileges"
                              value={formData.inclusivePrivileges}
                              onChange={handleChange}
                              rows={2}
                              className={inputClass}
                            />
                          </Field>
                        </div>
                      </div>
                    </Panel>
                  </div>

                  <div className="lg:col-span-3 space-y-3">
                    <Panel title="Operational / Travel Info">
                      <div className="space-y-2.5">
                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="flex items-center gap-2 mt-1">
                            <input type="checkbox" name="pickup" checked={!!formData.pickup} onChange={handleChange} />
                            <label className="text-sm font-medium text-gray-700">Pickup</label>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <input type="checkbox" name="dropOff" checked={!!formData.dropOff} onChange={handleChange} />
                            <label className="text-sm font-medium text-gray-700">Drop Off</label>
                          </div>
                        </div>

                        <Field label="Pickup Station">
                          <input name="pickupStation" value={formData.pickupStation} onChange={handleChange} className={inputClass} />
                        </Field>
                        <Field label="Pickup Carrier">
                          <input name="pickupCarrier" value={formData.pickupCarrier} onChange={handleChange} className={inputClass} />
                        </Field>
                        <Field label="Pickup Time">
                          <input name="pickupTime" value={formData.pickupTime} onChange={handleChange} className={inputClass} />
                        </Field>
                        <Field label="Drop Station">
                          <input name="dropStation" value={formData.dropStation} onChange={handleChange} className={inputClass} />
                        </Field>
                        <Field label="Coming From">
                          <input name="comingFrom" value={formData.comingFrom} onChange={handleChange} className={inputClass} />
                        </Field>
                      </div>
                    </Panel>

                    <Panel title="Marketing & Source">
                      <div className="space-y-2.5">
                        <Field label="Source">
                          <select name="source" value={formData.source} onChange={handleChange} className={selectClass}>
                            <option value="">Select</option>
                            <option value="Online">Online</option>
                            <option value="Walk-in">Walk-in</option>
                            <option value="Phone">Phone</option>
                            <option value="Agent">Agent</option>
                            <option value="Corporate">Corporate</option>
                            <option value="Referral">Referral</option>
                          </select>
                        </Field>
                        <Field label="Market">
                          <select name="market" value={formData.market} onChange={handleChange} className={selectClass}>
                            <option value="">Select</option>
                            <option value="Front Office">Front Office</option>
                            <option value="Corporate">Corporate</option>
                            <option value="Government">Government</option>
                            <option value="Travel Agent">Travel Agent</option>
                            <option value="OTA">OTA</option>
                          </select>
                        </Field>
                        <Field label="Region">
                          <input name="region" value={formData.region} onChange={handleChange} className={inputClass} />
                        </Field>
                        <Field label="Industry">
                          <input name="industry" value={formData.industry} onChange={handleChange} className={inputClass} />
                        </Field>
                        <Field label="Purpose">
                          <input name="purpose" value={formData.purpose} onChange={handleChange} className={inputClass} />
                        </Field>
                        <Field label="Reference Company">
                          <input name="referenceCompany" value={formData.referenceCompany} onChange={handleChange} className={inputClass} />
                        </Field>
                        <Field label="Reservation Made By">
                          <input name="reservationMadeBy" value={formData.reservationMadeBy} onChange={handleChange} className={inputClass} />
                        </Field>
                      </div>
                    </Panel>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
                {!editingId && !isAllowedToCheckIn ? (
                  <div className="mr-auto text-sm font-semibold text-red-600">
                    Check-In disabled: Allowed only on arrival date or the next day, and selected date must be today.
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md bg-white hover:bg-gray-50 whitespace-nowrap"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`px-5 py-2 rounded-md text-white whitespace-nowrap ${
                    canSubmit ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Processing...' : editingId ? 'Update Check-In' : 'Check In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                        <div className="text-sm font-medium text-gray-900">{checkIn.checkInNumber}</div>
                        <div className="text-sm text-gray-500">Guests: {checkIn.numberOfGuests}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{checkIn.guest?.fullName || 'N/A'}</div>
                        <div className="text-sm text-gray-500">Room {checkIn.room?.roomNumber || 'N/A'}</div>
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
                      <div className="text-sm font-medium text-gray-900">Rs. {checkIn.totalAmount?.toLocaleString()}</div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          checkIn.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {checkIn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(checkIn)} className="text-blue-600 hover:text-blue-900">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(checkIn.id)} className="text-red-600 hover:text-red-900">
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

export default CheckInModern
