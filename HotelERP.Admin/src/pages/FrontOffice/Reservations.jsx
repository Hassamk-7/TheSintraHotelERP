import { useState, useEffect, useMemo, useRef } from 'react'
import axios from '../../utils/axios.js'
import {
  CalendarDaysIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  CreditCardIcon,
  MagnifyingGlassIcon,
  UserIcon,
  BuildingOfficeIcon,
  PrinterIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const initialFormData = {
  hotelId: '',
  roomTypeId: '',
  guestId: '',
  guestFullName: '',
  guestEmail: '',
  guestCountry: '',
  guestPhoneNumber: '',
  roomId: '',
  checkInDate: '',
  checkOutDate: '',
  numberOfAdults: 1,
  numberOfChildren: 0,
  totalAmount: '',
  specialRequests: '',
  // Pricing & Payment
  roomRate: '',
  discount: '',
  fbCredits: '',
  numberOfRooms: 1,
  advanceAmount: '',
  paymentMethod: '',
  paymentAccount: '',
  ratePlanId: '',
  ntn: '',
  bookingSource: '',
  // Guest Companions
  guestName2: '',
  guestName3: '',
  groupId: '',
  // Marketing / Source
  source: '',
  market: '',
  region: '',
  industry: '',
  purpose: '',
  referenceCompany: '',
  reservationMadeBy: '',
  // Transport / Pickup
  pickup: false,
  pickupStation: '',
  pickupCarrier: '',
  pickupTime: '',
  dropOff: false,
  dropStation: '',
  // Folio
  btcFolio: '',
  folio1: '',
  folio2: '',
  folio3: '',
  // Additional Info
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
}

const Reservations = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedHotelId, setSelectedHotelId] = useState('')
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [formData, setFormData] = useState({ ...initialFormData })
  const [additionalGuestCount, setAdditionalGuestCount] = useState(0)
  const [expandedSections, setExpandedSections] = useState({
    pricing: false,
    companions: false,
    marketing: false,
    transport: false,
    folio: false,
    additional: false
  })
  const [showPrintModal, setShowPrintModal] = useState(false)
  const [printReservation, setPrintReservation] = useState(null)
  const printRef = useRef(null)

  const [reservations, setReservations] = useState([])
  const [guests, setGuests] = useState([])
  const [guestsPageSize, setGuestsPageSize] = useState(1)
  const [rooms, setRooms] = useState([])
  const [hotels, setHotels] = useState([])
  const [roomTypes, setRoomTypes] = useState([])
  const [roomRates, setRoomRates] = useState([])
  const [roomTaxes, setRoomTaxes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const guestPageSizeOptions = [1, 5, 10, 20, 50, 100, 500, 1000, 5000, 10000]
  const reservationPageSizeOptions = [10, 20, 50, 100, 200, 500, 1000, 2000]

  const buildDefaultFormData = (defaultHotelId = '') => ({
    ...initialFormData,
    hotelId: defaultHotelId ? `${defaultHotelId}` : ''
  })

  const normalizeDayCode = (dateValue) => {
    if (!dateValue) return ''
    const day = new Date(dateValue).getDay()
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day] || ''
  }

  const parseDays = (value) => (
    typeof value === 'string'
      ? value.split(',').map(item => item.trim()).filter(Boolean)
      : Array.isArray(value)
        ? value.map(item => `${item}`.trim()).filter(Boolean)
        : []
  )

  const getStayDates = (checkInDate, checkOutDate) => {
    if (!checkInDate || !checkOutDate) return []

    const start = new Date(checkInDate)
    const end = new Date(checkOutDate)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return []

    const dates = []
    const current = new Date(start)
    current.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)

    while (current < end) {
      dates.push(new Date(current).toISOString().split('T')[0])
      current.setDate(current.getDate() + 1)
    }

    return dates
  }

  const isWithinRange = (targetDate, fromDate, toDate) => {
    if (!targetDate || !fromDate || !toDate) return false
    const target = new Date(targetDate)
    const from = new Date(fromDate)
    const to = new Date(toDate)
    if (Number.isNaN(target.getTime()) || Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return false
    target.setHours(0, 0, 0, 0)
    from.setHours(0, 0, 0, 0)
    to.setHours(0, 0, 0, 0)
    return target >= from && target <= to
  }

  const getMatchingRates = (roomTypeId, hotelId, checkInDate, checkOutDate, nights) => {
    if (!roomTypeId || !hotelId) return []

    const normalizedRoomTypeId = roomTypeId.toString()
    const normalizedHotelId = hotelId.toString()
    const stayDates = getStayDates(checkInDate, checkOutDate)

    return roomRates.filter(rate => {
      const rateRoomTypeId = (rate.roomTypeId ?? rate.RoomTypeId)?.toString()
      const rateHotelId = (rate.hotelId ?? rate.HotelId ?? rate.roomType?.hotelId ?? rate.roomType?.HotelId ?? rate.RoomType?.hotelId ?? rate.RoomType?.HotelId)?.toString()
      if (rateRoomTypeId !== normalizedRoomTypeId) return false
      if (rateHotelId && rateHotelId !== normalizedHotelId) return false

      const minStay = Number(rate.minStay ?? rate.MinStay ?? 0)
      const maxStay = Number(rate.maxStay ?? rate.MaxStay ?? 0)
      const days = parseDays(rate.days ?? rate.Days)
      const effectiveFrom = rate.effectiveFrom ?? rate.EffectiveFrom
      const effectiveTo = rate.effectiveTo ?? rate.EffectiveTo
      const active = rate.isActive ?? rate.IsActive

      if (active === false) return false
      if (stayDates.length === 0) {
        if (!checkInDate || !isWithinRange(checkInDate, effectiveFrom, effectiveTo)) return false
      } else {
        const coversEveryNight = stayDates.every(dateValue => {
          const dayCode = normalizeDayCode(dateValue)
          return isWithinRange(dateValue, effectiveFrom, effectiveTo) && (days.length === 0 || days.includes(dayCode))
        })
        if (!coversEveryNight) return false
      }
      if (minStay > 0 && nights < minStay) return false
      if (maxStay > 0 && nights > maxStay) return false
      return true
    })
  }

  const resolveSelectedRate = (roomTypeId, hotelId, checkInDate, checkOutDate, nights) => {
    const matchingRates = getMatchingRates(roomTypeId, hotelId, checkInDate, checkOutDate, nights)
    return matchingRates[0] || null
  }

  const calculateTaxAmount = (baseAmount, roomTypeId, hotelId) => {
    if (!baseAmount || baseAmount <= 0) return 0

    return roomTaxes
      .filter(tax => {
        const taxRoomTypeId = (tax.roomTypeId ?? tax.RoomTypeId)?.toString()
        const taxHotelId = (tax.hotelId ?? tax.HotelId)?.toString()
        return taxRoomTypeId === roomTypeId?.toString() && taxHotelId === hotelId?.toString()
      })
      .reduce((sum, tax) => {
        const value = parseFloat(tax.taxValue ?? tax.TaxValue) || 0
        const taxType = (tax.taxType ?? tax.TaxType ?? '').toLowerCase()
        if (taxType === 'percentage') {
          return sum + ((baseAmount * value) / 100)
        }
        return sum + value
      }, 0)
  }

  // Fetch reservations from API
  const fetchReservations = async () => {
    try {
      setLoading(true)
      const params = {}
      if (selectedHotelId) params.hotelId = selectedHotelId
      if (selectedRoomTypeId) params.roomTypeId = selectedRoomTypeId
      const response = await axios.get('/reservations', { params })
      if (response.data.success) {
        setReservations(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching reservations:', err)
      setError('Failed to load reservations')
    } finally {
      setLoading(false)
    }
  }

  const fetchHotels = async () => {
    try {
      const response = await axios.get('/hotels', { params: { page: 1, pageSize: 1000 } })
      if (response.data.success) {
        const normalizedHotels = (response.data.data || []).map(hotel => ({
          ...hotel,
          id: hotel.id ?? hotel.Id,
          hotelName: hotel.hotelName ?? hotel.HotelName ?? hotel.name ?? hotel.Name ?? ''
        }))
        setHotels(normalizedHotels)
      }
    } catch (err) {
      console.error('Error fetching hotels:', err)
    }
  }

  const fetchRoomTypesByHotel = async (hotelId) => {
    try {
      if (!hotelId) {
        setRoomTypes([])
        return
      }
      const response = await axios.get(`/roomtypes/by-hotel/${hotelId}`)
      if (response.data.success) {
        setRoomTypes(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching room types:', err)
    }
  }

  const fetchRoomRates = async () => {
    try {
      const response = await axios.get('/RoomsManagement/room-rates', { params: { page: 1, pageSize: 1000 } })
      if (response.data?.success) {
        setRoomRates(response.data.data || [])
      }
    } catch (err) {
      console.error('Error fetching room rates:', err)
      setRoomRates([])
    }
  }

  const fetchRoomTaxes = async () => {
    try {
      const response = await axios.get('/roomtax')
      if (response.data?.success) {
        setRoomTaxes(response.data.data || [])
      }
    } catch (err) {
      console.error('Error fetching room taxes:', err)
      setRoomTaxes([])
    }
  }

  // Fetch guests for dropdown
  const fetchGuests = async () => {
    try {
      const response = await axios.get('/guests', { params: { page: 1, pageSize: guestsPageSize } })
      if (response.data.success) {
        setGuests(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching guests:', err)
    }
  }

  const ensureSelectedGuestLoaded = async (guestId) => {
    if (!guestId) return
    const guestIdStr = guestId.toString()
    const existing = guests.find(g => g.id?.toString() === guestIdStr)
    if (existing) return

    try {
      const response = await axios.get(`/guests/${guestIdStr}`)
      if (response.data?.success && response.data.data) {
        setGuests(prev => {
          const stillMissing = !prev.some(g => g.id?.toString() === guestIdStr)
          return stillMissing ? [response.data.data, ...prev] : prev
        })
      }
    } catch (err) {
      console.error('Error fetching selected guest:', err)
    }
  }

  // Fetch available rooms
  const fetchRooms = async () => {
    try {
      const response = await axios.get('/rooms')
      if (response.data.success) {
        setRooms(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching rooms:', err)
    }
  }

  const availableRoomsForSelection = useMemo(() => {
    const hotelId = formData.hotelId?.toString() || ''
    const roomTypeId = formData.roomTypeId?.toString() || ''
    return rooms.filter(room => {
      const roomHotelId = (room.hotelId ?? room.HotelId ?? room.roomType?.hotelId ?? room.roomType?.HotelId)?.toString() || ''
      const roomRoomTypeId = (room.roomTypeId ?? room.RoomTypeId ?? room.roomType?.id ?? room.roomType?.Id)?.toString() || ''
      if (hotelId && roomHotelId && roomHotelId !== hotelId) return false
      if (roomTypeId && roomRoomTypeId && roomRoomTypeId !== roomTypeId) return false
      return true
    })
  }, [rooms, formData.hotelId, formData.roomTypeId])

  // Load data on component mount
  useEffect(() => {
    fetchReservations()
    fetchGuests()
    fetchRooms()
    fetchHotels()
    fetchRoomRates()
    fetchRoomTaxes()
  }, [])

  useEffect(() => {
    fetchGuests()
  }, [guestsPageSize])

  useEffect(() => {
    fetchReservations()
  }, [selectedHotelId, selectedRoomTypeId])

  useEffect(() => {
    fetchRoomTypesByHotel(selectedHotelId)
    setSelectedRoomTypeId('')
  }, [selectedHotelId])

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked
        : (name === 'numberOfAdults' || name === 'numberOfChildren' || name === 'numberOfRooms') ? parseInt(value) || 0
        : value
    }))
  }

  const handleGuestSelectChange = (e) => {
    const guestId = e.target.value
    const guest = guests.find(item => item.id?.toString() === guestId?.toString())

    setFormData(prev => ({
      ...prev,
      guestId,
      guestFullName: guest?.fullName || '',
      guestEmail: guest?.email || '',
      guestCountry: guest?.country || '',
      guestPhoneNumber: guest?.phoneNumber || guest?.phone || ''
    }))
  }

  const handleHotelSelectChange = async (e) => {
    const hotelId = e.target.value
    setFormData(prev => ({
      ...prev,
      hotelId,
      roomTypeId: '',
      roomId: ''
    }))
    setRoomTypes([])
    if (hotelId) {
      await fetchRoomTypesByHotel(hotelId)
    }
  }

  const handleRoomTypeSelectChange = (e) => {
    const roomTypeId = e.target.value
    setFormData(prev => ({
      ...prev,
      roomTypeId,
      roomId: '',
      ratePlanId: ''
    }))
  }

  const openReservationDetails = (reservation) => {
    setPrintReservation(reservation)
    setShowPrintModal(true)
  }

  const openNewReservationForm = async () => {
    const defaultHotelId = hotels[0]?.id ? `${hotels[0].id}` : ''
    setEditingId(null)
    setAdditionalGuestCount(0)
    setExpandedSections(prev => ({
      ...prev,
      companions: false
    }))
    setFormData({
      ...buildDefaultFormData(defaultHotelId),
      guestId: '',
      guestFullName: '',
      guestEmail: '',
      guestCountry: '',
      guestPhoneNumber: '',
      guestName2: '',
      guestName3: ''
    })
    setPrintReservation(null)
    setShowForm(true)

    if (defaultHotelId) {
      await fetchRoomTypesByHotel(defaultHotelId)
    } else {
      setRoomTypes([])
    }
  }

  // Create or update reservation
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    try {
      setLoading(true)

      const guestPayload = {
        fullName: (formData.guestFullName || selectedGuest?.fullName || '').trim(),
        email: (formData.guestEmail || selectedGuest?.email || '').trim(),
        phoneNumber: (formData.guestPhoneNumber || selectedGuest?.phoneNumber || selectedGuest?.phone || '').trim(),
        country: (formData.guestCountry || selectedGuest?.country || 'Pakistan').trim()
      }

      let resolvedGuestId = formData.guestId ? parseInt(formData.guestId) : null

      if (!resolvedGuestId) {
        if (!guestPayload.fullName) {
          setError('Guest full name is required')
          setLoading(false)
          return
        }

        const guestResponse = await axios.post('/guests', guestPayload)
        const createdGuest = guestResponse?.data?.data
        resolvedGuestId = createdGuest?.id

        if (!resolvedGuestId) {
          setError('Failed to create guest profile')
          setLoading(false)
          return
        }

        setGuests(prev => [createdGuest, ...prev])
      } else if (guestPayload.fullName) {
        await axios.put(`/guests/${resolvedGuestId}`, guestPayload)
        setGuests(prev => prev.map(guest => (
          guest.id?.toString() === resolvedGuestId?.toString()
            ? {
                ...guest,
                fullName: guestPayload.fullName,
                email: guestPayload.email,
                phoneNumber: guestPayload.phoneNumber,
                phone: guestPayload.phoneNumber,
                country: guestPayload.country
              }
            : guest
        )))
      }
      
      const reservationData = {
        hotelId: formData.hotelId ? parseInt(formData.hotelId) : null,
        roomTypeId: formData.roomTypeId ? parseInt(formData.roomTypeId) : null,
        guestId: resolvedGuestId,
        roomId: formData.roomId ? parseInt(formData.roomId) : null,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfAdults: parseInt(formData.numberOfAdults) || 1,
        numberOfChildren: parseInt(formData.numberOfChildren) || 0,
        totalAmount: parseFloat(formData.totalAmount) || 0,
        specialRequests: formData.specialRequests || '',
        // Pricing & Payment
        roomRate: parseFloat(formData.roomRate) || 0,
        discount: parseFloat(formData.discount) || 0,
        fbCredits: parseFloat(formData.fbCredits) || 0,
        numberOfRooms: parseInt(formData.numberOfRooms) || 1,
        nights: calculateNights(),
        advanceAmount: parseFloat(formData.advanceAmount) || 0,
        paymentMethod: formData.paymentMethod || null,
        paymentAccount: formData.paymentAccount || null,
        ratePlanId: formData.ratePlanId || null,
        ntn: formData.ntn || null,
        bookingSource: formData.bookingSource || null,
        // Guest Companions
        guestName2: formData.guestName2 || null,
        guestName3: formData.guestName3 || null,
        groupId: formData.groupId || null,
        // Marketing / Source
        source: formData.source || null,
        market: formData.market || null,
        region: formData.region || null,
        industry: formData.industry || null,
        purpose: formData.purpose || null,
        referenceCompany: formData.referenceCompany || null,
        reservationMadeBy: formData.reservationMadeBy || null,
        // Transport / Pickup
        pickup: formData.pickup || false,
        pickupStation: formData.pickupStation || null,
        pickupCarrier: formData.pickupCarrier || null,
        pickupTime: formData.pickupTime || null,
        dropOff: formData.dropOff || false,
        dropStation: formData.dropStation || null,
        // Folio
        btcFolio: formData.btcFolio || null,
        folio1: formData.folio1 || null,
        folio2: formData.folio2 || null,
        folio3: formData.folio3 || null,
        // Additional Info
        btcComments: formData.btcComments || null,
        btcId: formData.btcId || null,
        complimentary: formData.complimentary || false,
        company: formData.company || null,
        comingFrom: formData.comingFrom || null,
        newspaper: formData.newspaper || null,
        meals: formData.meals || null,
        vipStatus: formData.vipStatus || null,
        reservationNotes: formData.reservationNotes || null,
        checkinNotes: formData.checkinNotes || null,
        noPost: formData.noPost || false,
        enteredBy: formData.enteredBy || null,
        inclusivePrivileges: formData.inclusivePrivileges || null
      }
      
      if (editingId) {
        const response = await axios.put(`/reservations/${editingId}`, reservationData)
        if (response.data.success) {
          setSuccess('Reservation updated successfully!')
          fetchReservations()
        }
      } else {
        const response = await axios.post('/reservations', reservationData)
        if (response.data.success) {
          setSuccess('Reservation created successfully!')
          fetchReservations()
        }
      }
      
      setFormData(buildDefaultFormData(hotels[0]?.id || ''))
      setAdditionalGuestCount(0)
      setShowForm(false)
      setEditingId(null)
      
    } catch (err) {
      console.error('Error saving reservation:', err)
      setError(err.response?.data?.message || 'Failed to save reservation')
    } finally {
      setLoading(false)
    }
  }

  // Edit reservation
  const handleEdit = (reservation) => {
    const nextAdditionalGuestCount = [reservation.guestName2, reservation.guestName3].filter(Boolean).length
    const nextHotelId = reservation.room?.roomType?.hotelId?.toString() || reservation.hotelId?.toString() || ''
    const nextRoomTypeId = reservation.room?.roomType?.id?.toString() || reservation.roomTypeId?.toString() || ''
    const nextCheckInDate = reservation.checkInDate?.split('T')[0] || ''
    const nextCheckOutDate = reservation.checkOutDate?.split('T')[0] || ''
    const nextNumberOfRooms = reservation.numberOfRooms || 1
    const nextDiscount = reservation.discount?.toString() || ''
    const nextFbCredits = reservation.fbCredits?.toString() || ''
    const nextBookingSource = reservation.bookingSource || reservation.source || ''

    const nights = (() => {
      if (!nextCheckInDate || !nextCheckOutDate) return 0
      const checkIn = new Date(nextCheckInDate)
      const checkOut = new Date(nextCheckOutDate)
      const diff = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
      return diff > 0 ? diff : 0
    })()

    const selectedRate = resolveSelectedRate(nextRoomTypeId, nextHotelId, nextCheckInDate, nextCheckOutDate, nights)
    const baseNightRate = parseFloat(selectedRate?.baseRate ?? selectedRate?.BaseRate) || 0
    const roomsCount = parseInt(nextNumberOfRooms) || 1
    const discount = parseFloat(nextDiscount) || 0
    const fbCredits = parseFloat(nextFbCredits) || 0
    const roomCharges = baseNightRate * nights * roomsCount
    const taxAmount = calculateTaxAmount(roomCharges, nextRoomTypeId, nextHotelId)
    const grandTotal = Math.max(roomCharges + taxAmount - discount - fbCredits, 0)
    const nextRatePlanId =
      (selectedRate?.id != null ? `${selectedRate.id}` : null) ??
      (selectedRate?.Id != null ? `${selectedRate.Id}` : null) ??
      selectedRate?.rateCode ??
      selectedRate?.RateCode ??
      selectedRate?.rateName ??
      selectedRate?.RateName ??
      ''

    const existingTotalAmount = parseFloat(reservation.totalAmount ?? reservation.totalPaid ?? reservation.balance) || 0
    const existingRoomRate = parseFloat(reservation.roomRate) || 0
    const shouldAutofillPricing =
      nights > 0 &&
      nextHotelId &&
      nextRoomTypeId &&
      (existingTotalAmount <= 0 || existingRoomRate <= 0)

    const storedAdvanceAmount = parseFloat(reservation.advanceAmount ?? reservation.totalPaid) || 0
    const storedTotalPaid = parseFloat(reservation.totalPaid) || 0
    const storedTotalAmount = parseFloat(reservation.totalAmount) || 0
    const storedBalance = parseFloat(reservation.balance) || 0
    const derivedOutstanding = storedBalance > 0
      ? storedBalance
      : Math.max((storedTotalAmount || 0) - (storedTotalPaid || storedAdvanceAmount || 0), 0)

    setFormData({
      hotelId: nextHotelId,
      roomTypeId: nextRoomTypeId,
      guestId: reservation.guestId?.toString() || '',
      guestFullName: reservation.guest?.fullName || '',
      guestEmail: reservation.guest?.email || '',
      guestCountry: reservation.guest?.country || '',
      guestPhoneNumber: reservation.guest?.phone || reservation.guest?.phoneNumber || '',
      roomId: reservation.roomId?.toString() || '',
      checkInDate: reservation.checkInDate?.split('T')[0] || '',
      checkOutDate: reservation.checkOutDate?.split('T')[0] || '',
      numberOfAdults: reservation.numberOfAdults || 1,
      numberOfChildren: reservation.numberOfChildren || 0,
      totalAmount: shouldAutofillPricing ? (grandTotal ? grandTotal.toFixed(2) : '0.00') : (reservation.totalAmount?.toString() || ''),
      specialRequests: reservation.specialRequests || '',
      // Pricing & Payment
      roomRate: shouldAutofillPricing ? (roomCharges ? roomCharges.toFixed(2) : '') : (reservation.roomRate?.toString() || ''),
      discount: reservation.discount?.toString() || '',
      fbCredits: reservation.fbCredits?.toString() || '',
      numberOfRooms: reservation.numberOfRooms || 1,
      advanceAmount: (reservation.advanceAmount ?? reservation.totalPaid)?.toString() || '',
      paymentMethod: reservation.paymentMethod || '',
      paymentAccount: reservation.paymentAccount || '',
      ratePlanId: shouldAutofillPricing ? nextRatePlanId : (reservation.ratePlanId || ''),
      ntn: reservation.ntn || '',
      bookingSource: nextBookingSource,
      // Guest Companions
      guestName2: reservation.guestName2 || '',
      guestName3: reservation.guestName3 || '',
      groupId: reservation.groupId || '',
      // Marketing / Source
      source: reservation.source || '',
      market: reservation.market || '',
      region: reservation.region || '',
      industry: reservation.industry || '',
      purpose: reservation.purpose || '',
      referenceCompany: reservation.referenceCompany || '',
      reservationMadeBy: reservation.reservationMadeBy || '',
      // Transport / Pickup
      pickup: reservation.pickup || false,
      pickupStation: reservation.pickupStation || '',
      pickupCarrier: reservation.pickupCarrier || '',
      pickupTime: reservation.pickupTime || '',
      dropOff: reservation.dropOff || false,
      dropStation: reservation.dropStation || '',
      // Folio
      btcFolio: reservation.btcFolio || '',
      folio1: reservation.folio1 || '',
      folio2: reservation.folio2 || '',
      folio3: reservation.folio3 || '',
      // Additional Info
      btcComments: reservation.btcComments || '',
      btcId: reservation.btcId || '',
      complimentary: reservation.complimentary || false,
      company: reservation.company || '',
      comingFrom: reservation.comingFrom || '',
      newspaper: reservation.newspaper || '',
      meals: reservation.meals || '',
      vipStatus: reservation.vipStatus || '',
      reservationNotes: reservation.reservationNotes || '',
      checkinNotes: reservation.checkinNotes || '',
      noPost: reservation.noPost || false,
      enteredBy: reservation.enteredBy || '',
      inclusivePrivileges: reservation.inclusivePrivileges || ''
    })
    setAdditionalGuestCount(nextAdditionalGuestCount)
    setExpandedSections(prev => ({
      ...prev,
      companions: nextAdditionalGuestCount > 0 ? true : prev.companions
    }))
    const hid = nextHotelId
    if (hid) {
      fetchRoomTypesByHotel(hid)
    }
    if (reservation.guestId) {
      ensureSelectedGuestLoaded(reservation.guestId)
    }
    setEditingId(reservation.id)
    setShowForm(true)
  }

  // Delete reservation
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reservation?')) return
    
    try {
      setLoading(true)
      const response = await axios.delete(`/reservations/${id}`)
      if (response.data.success) {
        setSuccess('Reservation deleted successfully!')
        fetchReservations()
      }
    } catch (err) {
      console.error('Error deleting reservation:', err)
      setError('Failed to delete reservation')
    } finally {
      setLoading(false)
    }
  }

  // Filter reservations based on search
  const filteredReservations = reservations.filter(reservation =>
    reservation.reservationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.guest?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.room?.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.hotelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.roomTypeName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filteredReservations.length / pageSize))
  const paginatedReservations = filteredReservations.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const exportReservationsToExcel = () => {
    const rows = filteredReservations.map((reservation, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${reservation.reservationNumber || ''}</td>
        <td>${reservation.id || ''}</td>
        <td>${reservation.hotelName || reservation.room?.roomType?.hotelName || ''}</td>
        <td>${reservation.roomTypeName || reservation.room?.roomType?.name || ''}</td>
        <td>${reservation.guest?.fullName || ''}</td>
        <td>${reservation.room?.roomNumber || ''}</td>
        <td>${reservation.source || reservation.bookingSource || ''}</td>
        <td>${reservation.checkInDate ? new Date(reservation.checkInDate).toLocaleDateString() : ''}</td>
        <td>${reservation.checkOutDate ? new Date(reservation.checkOutDate).toLocaleDateString() : ''}</td>
        <td>${reservation.status || ''}</td>
        <td>${reservation.totalAmount || ''}</td>
      </tr>
    `).join('')

    const tableHtml = `
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Reservation Number</th>
            <th>Reservation ID</th>
            <th>Hotel</th>
            <th>Room Category</th>
            <th>Guest</th>
            <th>Room</th>
            <th>Source</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `

    const excelFile = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
          <meta charset="UTF-8" />
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; font-family: Arial, sans-serif; font-size: 12px; }
            th { background: #4f46e5; color: #ffffff; }
          </style>
        </head>
        <body>${tableHtml}</body>
      </html>
    `

    const blob = new Blob([excelFile], { type: 'application/vnd.ms-excel;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `reservations-${new Date().toISOString().split('T')[0]}.xls`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Calculate nights and total
  const calculateNights = () => {
    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate)
      const checkOut = new Date(formData.checkOutDate)
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
      return nights > 0 ? nights : 0
    }
    return 0
  }

  const selectedGuest = guests.find(guest => guest.id?.toString() === formData.guestId?.toString())
  const selectedRoom = rooms.find(room => room.id?.toString() === formData.roomId?.toString())
  const selectedHotel = hotels.find(hotel => hotel.id?.toString() === formData.hotelId?.toString())
  const selectedReservationRoomType = roomTypes.find(rt => rt.id?.toString() === formData.roomTypeId?.toString())
  const editingReservation = reservations.find(reservation => reservation.id?.toString() === editingId?.toString())
  const nightsCount = calculateNights()
  const pricedRoomTypes = useMemo(() => {
    if (!formData.hotelId) return []

    const currentHotelId = formData.hotelId.toString()
    const pricedRoomTypeIds = new Set(
      roomRates
        .filter(rate => {
          const active = rate.isActive ?? rate.IsActive
          const rateRoomTypeId = (rate.roomTypeId ?? rate.RoomTypeId)?.toString()
          const rateHotelId = (rate.hotelId ?? rate.HotelId ?? rate.roomType?.hotelId ?? rate.roomType?.HotelId ?? rate.RoomType?.hotelId ?? rate.RoomType?.HotelId)?.toString()
          return active !== false && rateRoomTypeId && (!rateHotelId || rateHotelId === currentHotelId)
        })
        .map(rate => (rate.roomTypeId ?? rate.RoomTypeId)?.toString())
    )

    return roomTypes.filter(rt => pricedRoomTypeIds.has((rt.id ?? rt.Id)?.toString()))
  }, [formData.hotelId, roomRates, roomTypes])

  useEffect(() => {
    if (!showForm) return

    const nights = nightsCount
    if (!formData.roomTypeId || !formData.checkInDate || !formData.checkOutDate || nights <= 0) {
      setFormData(prev => {
        if (!prev.roomRate && !prev.totalAmount && !prev.ratePlanId) return prev
        return {
          ...prev,
          roomRate: '',
          totalAmount: '',
          ratePlanId: ''
        }
      })
      return
    }

    const selectedRate = resolveSelectedRate(formData.roomTypeId, formData.hotelId, formData.checkInDate, formData.checkOutDate, nights)
    if (!selectedRate) {
      setFormData(prev => ({
        ...prev,
        roomRate: '',
        totalAmount: '',
        ratePlanId: ''
      }))
      return
    }

    const baseNightRate = parseFloat(selectedRate?.baseRate ?? selectedRate?.BaseRate) || 0
    const roomsCount = parseInt(formData.numberOfRooms) || 1
    const discount = parseFloat(formData.discount) || 0
    const fbCredits = parseFloat(formData.fbCredits) || 0
    const roomCharges = baseNightRate * nights * roomsCount
    const taxAmount = calculateTaxAmount(roomCharges, formData.roomTypeId, formData.hotelId)
    const grandTotal = Math.max(roomCharges + taxAmount - discount - fbCredits, 0)
    const nextRatePlanId =
      (selectedRate?.id != null ? `${selectedRate.id}` : null) ??
      (selectedRate?.Id != null ? `${selectedRate.Id}` : null) ??
      selectedRate?.rateCode ??
      selectedRate?.RateCode ??
      selectedRate?.rateName ??
      selectedRate?.RateName ??
      ''

    setFormData(prev => {
      const nextRoomRate = roomCharges ? roomCharges.toFixed(2) : ''
      const nextTotal = grandTotal ? grandTotal.toFixed(2) : '0.00'
      const hasSavedEditPricing = editingId && ((parseFloat(prev.totalAmount) || 0) > 0 || (parseFloat(prev.roomRate) || 0) > 0)
      if (hasSavedEditPricing) {
        return prev
      }
      if (
        prev.roomRate === nextRoomRate &&
        prev.totalAmount === nextTotal &&
        (prev.ratePlanId || '') === nextRatePlanId
      ) {
        return prev
      }

      return {
        ...prev,
        roomRate: nextRoomRate,
        totalAmount: nextTotal,
        ratePlanId: nextRatePlanId
      }
    })
  }, [showForm, editingId, formData.roomTypeId, formData.hotelId, formData.checkInDate, formData.checkOutDate, formData.numberOfRooms, formData.discount, formData.fbCredits, roomRates, roomTaxes, nightsCount])

  useEffect(() => {
    if (!showForm || !formData.roomTypeId) return

    const roomTypeHasPricing = pricedRoomTypes.some(rt => (rt.id ?? rt.Id)?.toString() === formData.roomTypeId?.toString())
    if (roomRates.length > 0 && !roomTypeHasPricing) {
      setFormData(prev => ({
        ...prev,
        roomTypeId: '',
        roomId: '',
        roomRate: '',
        totalAmount: '',
        ratePlanId: ''
      }))
    }
  }, [showForm, formData.roomTypeId, pricedRoomTypes, roomRates.length])

  const currentHotelOption = formData.hotelId
    ? {
        id: formData.hotelId,
        hotelName: selectedHotel?.hotelName || editingReservation?.hotelName || selectedRoom?.roomType?.hotelName || `Hotel ${formData.hotelId}`
      }
    : null
  const hotelOptions = currentHotelOption && !hotels.some(hotel => hotel.id?.toString() === formData.hotelId?.toString())
    ? [currentHotelOption, ...hotels]
    : hotels
  const roomCategoryLabel = selectedReservationRoomType?.name || editingReservation?.roomCategoryName || editingReservation?.roomTypeName || selectedRoom?.roomType?.name || 'Select room type'
  const roomTypeLabel = selectedReservationRoomType?.name || editingReservation?.roomTypeName || editingReservation?.roomCategoryName || selectedRoom?.roomType?.name || 'Select room type'
  const roomNumberLabel = selectedRoom?.roomNumber ? `Room ${selectedRoom.roomNumber}` : 'Auto assign/select room'
  const guestNameLabel = formData.guestFullName || selectedGuest?.fullName || 'Enter or select guest'
  const bookingSourceLabel = formData.bookingSource || 'Walk-in'
  const savedAdvanceAmountValue = parseFloat(editingReservation?.advanceAmount) || 0
  const savedTotalAmountValue = parseFloat(editingReservation?.totalAmount) || 0
  const advanceAmountValue = parseFloat(formData.advanceAmount) || savedAdvanceAmountValue || 0
  const totalAmountValue = parseFloat(formData.totalAmount) || savedTotalAmountValue || 0
  const roomRateValue = parseFloat(formData.roomRate) || 0
  const roomsCountValue = parseInt(formData.numberOfRooms) || 1
  const displayNightsValue = (() => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0
    const checkIn = new Date(formData.checkInDate)
    const checkOut = new Date(formData.checkOutDate)
    const diff = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  })()
  const potentialStaySubtotalValue = roomRateValue * Math.max(displayNightsValue, 1) * Math.max(roomsCountValue, 1)
  const subtotalAmountValue = editingId && potentialStaySubtotalValue > roomRateValue && potentialStaySubtotalValue <= totalAmountValue
    ? potentialStaySubtotalValue
    : roomRateValue
  const savedTotalPaidValue = parseFloat(editingReservation?.totalPaid) || 0
  const paidAmountValue = Math.max(savedTotalPaidValue, advanceAmountValue, 0)
  const taxEstimateValue = Math.max(totalAmountValue - subtotalAmountValue, 0)
  const outstandingAmountValue = Math.max(totalAmountValue - paidAmountValue, 0)
  const paymentStatusLabel = editingReservation?.paymentStatus || (paidAmountValue <= 0 ? 'Unpaid' : outstandingAmountValue > 0 ? 'Partial' : 'Paid')
  const paymentStatusTone = paymentStatusLabel?.toLowerCase() === 'paid'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : paymentStatusLabel?.toLowerCase() === 'partial'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-rose-50 text-rose-700 border-rose-200'
  const stayWindowLabel = formData.checkInDate && formData.checkOutDate
    ? `${formData.checkInDate} to ${formData.checkOutDate}`
    : `${formData.checkInDate || 'Check-in'} to ${formData.checkOutDate || 'Check-out'}`
  const fieldClass = 'w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100'
  const subtleFieldClass = 'w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100'

  useEffect(() => {
    if (!showForm || editingId || formData.hotelId || hotels.length === 0) return

    const defaultHotelId = hotels[0]?.id
    if (!defaultHotelId) return

    setFormData(prev => ({
      ...prev,
      hotelId: `${defaultHotelId}`
    }))
    fetchRoomTypesByHotel(defaultHotelId)
  }, [showForm, editingId, formData.hotelId, hotels])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedHotelId, selectedRoomTypeId, pageSize])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reservations</h1>
            <p className="text-indigo-100">Manage hotel room reservations and bookings</p>
          </div>
          <CalendarDaysIcon className="h-16 w-16 text-indigo-200" />
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search reservations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedHotelId}
            onChange={(e) => setSelectedHotelId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All Hotels</option>
            {hotels.map(h => (
              <option key={h.id} value={h.id}>{h.hotelName}</option>
            ))}
          </select>

          <select
            value={selectedRoomTypeId}
            onChange={(e) => setSelectedRoomTypeId(e.target.value)}
            disabled={!selectedHotelId}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">All Room Types</option>
            {roomTypes.map(rt => (
              <option key={rt.id} value={rt.id}>{rt.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={openNewReservationForm}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          New Reservation
        </button>
      </div>

      {/* Reservation Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/60 py-6 px-4">
          <div className="w-full max-w-7xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white">
              <div className="flex items-center justify-between gap-4 px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-500 text-white shadow-lg">
                    <CalendarDaysIcon className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">{editingId ? 'Edit Reservation' : 'New Reservation'}</h2>
                    <p className="mt-1 text-sm text-slate-500">Keep all reservation details intact with a PMS-style entry and update experience.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 md:block">
                    {selectedHotel?.hotelName || currentHotelOption?.hotelName || 'Select hotel'}
                  </div>
                  <button type="button" onClick={() => setShowForm(false)} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 px-6 pb-5">
                {['Walk-in', 'Phone', 'Online', 'Corporate', 'Agent', 'OTA'].map(source => (
                  <button
                    key={source}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, bookingSource: source }))}
                    className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition ${bookingSourceLabel === source ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                  >
                    {source}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[88vh] overflow-y-auto bg-slate-50 p-5 md:p-6">
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.6fr_1fr]">
                <div className="space-y-5">
                  <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Guest Info</h3>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="min-w-0">
                              <label className="mb-2 block text-sm font-semibold text-slate-700">Guest *</label>
                              <select name="guestId" value={formData.guestId} onChange={handleGuestSelectChange} className={`${fieldClass} truncate pr-8`}>
                                <option value="">Add New Guest</option>
                                {guests.map(guest => (
                                  <option key={guest.id} value={guest.id}>{guest.fullName} ({guest.guestId})</option>
                                ))}
                              </select>
                            </div>
                            <div className="min-w-0">
                              <label className="mb-2 block text-sm font-semibold text-slate-700">Guest list size</label>
                              <select value={guestsPageSize} onChange={(e) => setGuestsPageSize(parseInt(e.target.value) || 1)} className={subtleFieldClass}>
                                {guestPageSizeOptions.map(size => (
                                  <option key={size} value={size}>{size}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">Hotel</label>
                          <select name="hotelId" value={formData.hotelId} onChange={handleHotelSelectChange} className={fieldClass}>
                            {hotelOptions.map(h => (
                              <option key={h.id} value={h.id}>{h.hotelName}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">Room Category</label>
                          <select name="roomTypeId" value={formData.roomTypeId} onChange={handleRoomTypeSelectChange} disabled={!formData.hotelId} className={fieldClass}>
                            <option value="">{editingId ? roomCategoryLabel : 'Select Room Type'}</option>
                            {pricedRoomTypes.map(rt => (
                              <option key={rt.id ?? rt.Id} value={rt.id ?? rt.Id}>{rt.name ?? rt.Name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name *</label>
                          <input type="text" name="guestFullName" value={formData.guestFullName} onChange={handleChange} required className={fieldClass} placeholder="Guest full name" />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                          <input type="email" name="guestEmail" value={formData.guestEmail} onChange={handleChange} className={fieldClass} placeholder="guest@email.com" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">Country</label>
                          <input type="text" name="guestCountry" value={formData.guestCountry} onChange={handleChange} className={fieldClass} placeholder="Pakistan" />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">Phone Number</label>
                          <input type="text" name="guestPhoneNumber" value={formData.guestPhoneNumber} onChange={handleChange} className={fieldClass} placeholder="+92..." />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">Company / Agent</label>
                          <input type="text" name="company" value={formData.company} onChange={handleChange} className={subtleFieldClass} placeholder="Company or travel agent" />
                        </div>
                      </div>

                      {additionalGuestCount > 0 && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {additionalGuestCount >= 1 && (
                            <div>
                              <div className="mb-2 flex items-center justify-between gap-3">
                                <label className="block text-sm font-semibold text-slate-700">Additional Guest 1</label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      guestName2: prev.guestName3,
                                      guestName3: ''
                                    }))
                                    setAdditionalGuestCount(prev => Math.max(prev - 1, 0))
                                  }}
                                  className="text-xs font-semibold text-rose-600 transition hover:text-rose-700"
                                >
                                  Remove
                                </button>
                              </div>
                              <input type="text" name="guestName2" value={formData.guestName2} onChange={handleChange} className={fieldClass} placeholder="Enter additional guest name" />
                            </div>
                          )}
                          {additionalGuestCount >= 2 && (
                            <div>
                              <div className="mb-2 flex items-center justify-between gap-3">
                                <label className="block text-sm font-semibold text-slate-700">Additional Guest 2</label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      guestName3: ''
                                    }))
                                    setAdditionalGuestCount(prev => Math.max(prev - 1, 1))
                                  }}
                                  className="text-xs font-semibold text-rose-600 transition hover:text-rose-700"
                                >
                                  Remove
                                </button>
                              </div>
                              <input type="text" name="guestName3" value={formData.guestName3} onChange={handleChange} className={fieldClass} placeholder="Enter additional guest name" />
                            </div>
                          )}
                        </div>
                      )}

                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            setAdditionalGuestCount(prev => Math.min(prev + 1, 2))
                            setExpandedSections(current => ({ ...current, companions: true }))
                          }}
                          disabled={additionalGuestCount >= 2}
                          className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {additionalGuestCount >= 2 ? 'Maximum Additional Guests Added' : 'Add Additional Guest'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="w-full rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900">Notes & Preferences</h3>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Special Requests</label>
                        <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} rows={6} className={fieldClass} placeholder="Late check-in, airport pickup, smoking room, etc..." />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Reservation Notes</label>
                        <textarea name="reservationNotes" value={formData.reservationNotes} onChange={handleChange} rows={6} className={fieldClass} />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900">Quick Details</h3>
                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 text-sm">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"><div className="text-slate-500">Guest</div><div className="mt-1 font-semibold text-slate-900">{guestNameLabel}</div></div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"><div className="text-slate-500">Booking Source</div><div className="mt-1 font-semibold text-slate-900">{bookingSourceLabel}</div></div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"><div className="text-slate-500">Reference Company</div><div className="mt-1 font-semibold text-slate-900">{formData.referenceCompany || 'N/A'}</div></div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"><div className="text-slate-500">Reservation By</div><div className="mt-1 font-semibold text-slate-900">{formData.reservationMadeBy || 'N/A'}</div></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Stay Details</h3>
                        <p className="mt-1 text-sm text-slate-500">Add Arrival duration, occupancy, & room</p>
                      </div>
                      <div className="whitespace-nowrap rounded-xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">{bookingSourceLabel}</div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Check-in Date *</label>
                        <input type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} className={fieldClass} />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Check-out Date *</label>
                        <input type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} required min={formData.checkInDate || new Date().toISOString().split('T')[0]} className={fieldClass} />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Nights</label>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800">{calculateNights()}</div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">No. of Rooms</label>
                        <input type="number" name="numberOfRooms" value={formData.numberOfRooms} onChange={handleChange} min="1" className={fieldClass} />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Adults *</label>
                        <input type="number" name="numberOfAdults" value={formData.numberOfAdults} onChange={handleChange} required min="1" max="10" className={fieldClass} />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Children</label>
                        <input type="number" name="numberOfChildren" value={formData.numberOfChildren} onChange={handleChange} min="0" max="10" className={fieldClass} />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Room Type</label>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800">{roomTypeLabel}</div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Room *</label>
                        <select name="roomId" value={formData.roomId} onChange={handleChange} required={!editingId} className={`${fieldClass} text-xs sm:text-sm`}>
                          <option value="">Select Room</option>
                          {availableRoomsForSelection.map(room => (
                            <option key={room.id} value={room.id}>Room {room.roomNumber} - {room.roomType?.name}{editingId ? ` (${room.status})` : ''}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-slate-700">Selected Room</div>
                          <div className="mt-1 text-base font-bold leading-tight text-slate-900 sm:text-lg">{roomNumberLabel}</div>
                        </div>
                        <div className="sm:text-right">
                          <div className="text-sm font-semibold text-slate-700">Stay Window</div>
                          <div className="mt-1 whitespace-nowrap text-sm text-slate-500">{stayWindowLabel}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!editingId && (
                    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                      <h3 className="text-xl font-bold text-slate-900">Rate & Pricing</h3>
                      <p className="mt-1 text-sm text-slate-500">Commercial details used to calculate the reservation amount.</p>
                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">Rate Plan ID</label>
                          <input type="text" name="ratePlanId" value={formData.ratePlanId} onChange={handleChange} className={fieldClass} />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">Room Rate</label>
                          <input type="number" name="roomRate" value={formData.roomRate} onChange={handleChange} step="0.01" min="0" className={fieldClass} />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">Discount</label>
                          <input type="number" name="discount" value={formData.discount} onChange={handleChange} step="0.01" min="0" className={fieldClass} />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">F&B Credits</label>
                          <input type="number" name="fbCredits" value={formData.fbCredits} onChange={handleChange} step="0.01" min="0" className={fieldClass} />
                        </div>
                      </div>
                      <div className="mt-5 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between text-sm text-slate-600"><span>Room Rate</span><span className="font-semibold text-slate-900">Rs {roomRateValue.toLocaleString()}</span></div>
                        <div className="flex items-center justify-between text-sm text-slate-600"><span>Taxes / Other</span><span className="font-semibold text-slate-900">Rs {taxEstimateValue.toLocaleString()}</span></div>
                        <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-900"><span>Grand Total</span><span>Rs {totalAmountValue.toLocaleString()}</span></div>
                      </div>
                    </div>
                  )}

                  <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900">Payment / Guarantee</h3>
                    <p className="mt-1 text-sm text-slate-500">Add payment, guarantee , & account mapping.</p>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Payment Method</label>
                        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className={fieldClass}>
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
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Payment Account</label>
                        <input type="text" name="paymentAccount" value={formData.paymentAccount} onChange={handleChange} className={fieldClass} placeholder="e.g. 10001-Credit Cards" />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Advance Amount</label>
                        <input type="number" name="advanceAmount" value={formData.advanceAmount} onChange={handleChange} step="0.01" min="0" className={fieldClass} />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">NTN (Tax Number)</label>
                        <input type="text" name="ntn" value={formData.ntn} onChange={handleChange} className={fieldClass} />
                      </div>
                    </div>
                    <div className="mt-5 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700"><CreditCardIcon className="h-4 w-4 text-blue-600" /> Payment Overview</div>
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${paymentStatusTone}`}>{paymentStatusLabel}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                          <div className="text-xs font-semibold tracking-wide text-slate-500">Total Amount</div>
                          <div className="mt-1 text-xl font-bold text-slate-900">Rs {totalAmountValue.toLocaleString()}</div>
                        </div>
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                          <div className="text-xs font-semibold tracking-wide text-emerald-700">Paid Amount</div>
                          <div className="mt-1 text-xl font-bold text-emerald-700">Rs {paidAmountValue.toLocaleString()}</div>
                        </div>
                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                          <div className="text-xs font-semibold tracking-wide text-amber-700">Pending Amount</div>
                          <div className="mt-1 text-xl font-bold text-amber-700">Rs {outstandingAmountValue.toLocaleString()}</div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                          <div className="text-xs font-semibold tracking-wide text-slate-500">Advance / Deposit</div>
                          <div className="mt-1 text-xl font-bold text-slate-900">Rs {advanceAmountValue.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="space-y-2 border-t border-slate-200 bg-white px-4 py-4 text-sm">
                        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Room/Subtotal</span><span className="whitespace-nowrap font-semibold text-slate-900">Rs {subtotalAmountValue.toLocaleString()}</span></div>
                        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Taxes</span><span className="whitespace-nowrap font-semibold text-slate-900">Rs {taxEstimateValue.toLocaleString()}</span></div>
                        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Collection Type</span><span className="whitespace-nowrap font-semibold text-slate-900">{editingReservation?.paymentMethod || formData.paymentMethod || 'N/A'}</span></div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <div className="mt-4 rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <button type="button" onClick={() => toggleSection('pricing')} className="flex w-full items-center justify-between px-5 py-4 text-left">
                  <div>
                    <span className="text-lg font-bold text-slate-900">Pricing & Payment</span>
                    <p className="mt-1 text-sm text-slate-500">Advanced commercial and booking source fields.</p>
                  </div>
                  {expandedSections.pricing ? <ChevronUpIcon className="h-5 w-5 text-slate-400" /> : <ChevronDownIcon className="h-5 w-5 text-slate-400" />}
                </button>
                {expandedSections.pricing && (
                  <div className="grid grid-cols-1 gap-4 border-t border-slate-100 px-5 py-5 md:grid-cols-2 xl:grid-cols-5">
                    <div><label className="mb-2 block text-sm font-semibold text-slate-700">Total Amount (Rs)</label><input type="number" name="totalAmount" value={formData.totalAmount || (editingReservation?.totalAmount ?? '')} onChange={handleChange} min="0" step="0.01" className={fieldClass} /></div>
                    <div><label className="mb-2 block text-sm font-semibold text-slate-700">Booking Source</label><select name="bookingSource" value={formData.bookingSource || (editingReservation?.bookingSource || editingReservation?.source || '')} onChange={handleChange} className={fieldClass}><option value="">Select</option><option value="Direct">Direct</option><option value="Online">Online</option><option value="Phone">Phone</option><option value="Walk-in">Walk-in</option><option value="Agent">Agent</option><option value="Corporate">Corporate</option></select></div>
                    <div><label className="mb-2 block text-sm font-semibold text-slate-700">Reference Company</label><input type="text" name="referenceCompany" value={formData.referenceCompany} onChange={handleChange} className={fieldClass} /></div>
                    <div><label className="mb-2 block text-sm font-semibold text-slate-700">Reservation Made By</label><input type="text" name="reservationMadeBy" value={formData.reservationMadeBy} onChange={handleChange} className={fieldClass} /></div>
                    <div><label className="mb-2 block text-sm font-semibold text-slate-700">Entered By</label><input type="text" name="enteredBy" value={formData.enteredBy} onChange={handleChange} className={fieldClass} /></div>
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <button type="button" onClick={() => toggleSection('companions')} className="flex w-full items-center justify-between px-5 py-4 text-left">
                  <div>
                    <span className="text-lg font-bold text-slate-900">Guest Companions & Group</span>
                    <p className="mt-1 text-sm text-slate-500">Additional names and grouping information.</p>
                  </div>
                  {expandedSections.companions ? <ChevronUpIcon className="h-5 w-5 text-slate-400" /> : <ChevronDownIcon className="h-5 w-5 text-slate-400" />}
                </button>
                {expandedSections.companions && (
                  <div className="grid grid-cols-1 gap-4 border-t border-slate-100 px-5 py-5 md:grid-cols-3">
                    <div><label className="mb-2 block text-sm font-semibold text-slate-700">Guest Name 2</label><input type="text" name="guestName2" value={formData.guestName2} onChange={handleChange} className={fieldClass} /></div>
                    <div><label className="mb-2 block text-sm font-semibold text-slate-700">Guest Name 3</label><input type="text" name="guestName3" value={formData.guestName3} onChange={handleChange} className={fieldClass} /></div>
                    <div><label className="mb-2 block text-sm font-semibold text-slate-700">Group ID</label><input type="text" name="groupId" value={formData.groupId} onChange={handleChange} className={fieldClass} /></div>
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <button type="button" onClick={() => toggleSection('marketing')} className="flex w-full items-center justify-between px-5 py-4 text-left">
                  <div>
                    <span className="text-lg font-bold text-slate-900">Marketing & Source</span>
                    <p className="mt-1 text-sm text-slate-500">Segmentation and channel details.</p>
                  </div>
                  {expandedSections.marketing ? <ChevronUpIcon className="h-5 w-5 text-slate-400" /> : <ChevronDownIcon className="h-5 w-5 text-slate-400" />}
                </button>
                {expandedSections.marketing && (
                  <div className="grid grid-cols-1 gap-4 border-t border-slate-100 px-5 py-5 md:grid-cols-2 xl:grid-cols-4">
                    <div><label className="mb-2 block text-sm font-semibold text-slate-700">Source</label><select name="source" value={formData.source} onChange={handleChange} className={fieldClass}><option value="">Select</option><option value="Online">Online</option><option value="Walk-in">Walk-in</option><option value="Phone">Phone</option><option value="Agent">Agent</option><option value="Corporate">Corporate</option><option value="Referral">Referral</option></select></div>
                    <div><label className="mb-2 block text-sm font-semibold text-slate-700">Market</label><select name="market" value={formData.market} onChange={handleChange} className={fieldClass}><option value="">Select</option><option value="Front Office">Front Office</option><option value="Corporate">Corporate</option><option value="Government">Government</option><option value="Travel Agent">Travel Agent</option><option value="OTA">OTA</option></select></div>
                    <div><label className="mb-2 block text-sm font-semibold text-slate-700">Region</label><input type="text" name="region" value={formData.region} onChange={handleChange} className={fieldClass} /></div>
                    <div><label className="mb-2 block text-sm font-semibold text-slate-700">Industry</label><select name="industry" value={formData.industry} onChange={handleChange} className={fieldClass}><option value="">Select</option><option value="IT">IT</option><option value="Banking">Banking</option><option value="Government">Government</option><option value="Healthcare">Healthcare</option><option value="Education">Education</option><option value="Tourism">Tourism</option><option value="Other">Other</option></select></div>
                    <div><label className="mb-2 block text-sm font-semibold text-slate-700">Purpose</label><input type="text" name="purpose" value={formData.purpose} onChange={handleChange} className={fieldClass} placeholder="Business, Leisure, Event..." /></div>
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <button type="button" onClick={() => toggleSection('transport')} className="flex w-full items-center justify-between px-5 py-4 text-left">
                  <div>
                    <span className="text-lg font-bold text-slate-900">Transport / Pickup & Drop</span>
                    <p className="mt-1 text-sm text-slate-500">Pickup and drop arrangement fields.</p>
                  </div>
                  {expandedSections.transport ? <ChevronUpIcon className="h-5 w-5 text-slate-400" /> : <ChevronDownIcon className="h-5 w-5 text-slate-400" />}
                </button>
                {expandedSections.transport && (
                  <div className="space-y-4 border-t border-slate-100 px-5 py-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"><input type="checkbox" name="pickup" checked={formData.pickup} onChange={handleChange} className="h-4 w-4 rounded text-indigo-600" />Pickup?</label>
                      <div><label className="mb-2 block text-sm font-semibold text-slate-700">Station</label><input type="text" name="pickupStation" value={formData.pickupStation} onChange={handleChange} className={fieldClass} placeholder="airport, railway..." /></div>
                      <div><label className="mb-2 block text-sm font-semibold text-slate-700">Carrier</label><input type="text" name="pickupCarrier" value={formData.pickupCarrier} onChange={handleChange} className={fieldClass} placeholder="e.g. PK029382" /></div>
                      <div><label className="mb-2 block text-sm font-semibold text-slate-700">Time</label><input type="text" name="pickupTime" value={formData.pickupTime} onChange={handleChange} className={fieldClass} placeholder="e.g. 3:10" /></div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"><input type="checkbox" name="dropOff" checked={formData.dropOff} onChange={handleChange} className="h-4 w-4 rounded text-indigo-600" />Drop Off?</label>
                      <div><label className="mb-2 block text-sm font-semibold text-slate-700">Drop Station</label><input type="text" name="dropStation" value={formData.dropStation} onChange={handleChange} className={fieldClass} placeholder="airport, railway..." /></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <button type="button" onClick={() => toggleSection('folio')} className="flex w-full items-center justify-between px-5 py-4 text-left">
                  <div>
                    <span className="text-lg font-bold text-slate-900">Folio & BTC</span>
                    <p className="mt-1 text-sm text-slate-500">Bill-to-company and folio mapping fields.</p>
                  </div>
                  {expandedSections.folio ? <ChevronUpIcon className="h-5 w-5 text-slate-400" /> : <ChevronDownIcon className="h-5 w-5 text-slate-400" />}
                </button>
                {expandedSections.folio && (
                  <div className="grid grid-cols-1 gap-4 border-t border-slate-100 px-5 py-5 md:grid-cols-2 xl:grid-cols-4">
                    <div><label className="mb-2 block text-sm font-semibold text-slate-700">BTC Folio</label><input type="text" name="btcFolio" value={formData.btcFolio} onChange={handleChange} className={fieldClass} /></div>
                    <div><label className="mb-2 block text-sm font-semibold text-slate-700">Folio 1</label><input type="text" name="folio1" value={formData.folio1} onChange={handleChange} className={fieldClass} /></div>
                    <div><label className="mb-2 block text-sm font-semibold text-slate-700">Folio 2</label><input type="text" name="folio2" value={formData.folio2} onChange={handleChange} className={fieldClass} /></div>
                    <div><label className="mb-2 block text-sm font-semibold text-slate-700">Folio 3</label><input type="text" name="folio3" value={formData.folio3} onChange={handleChange} className={fieldClass} /></div>
                    <div><label className="mb-2 block text-sm font-semibold text-slate-700">BTC ID</label><input type="text" name="btcId" value={formData.btcId} onChange={handleChange} className={fieldClass} /></div>
                    <div className="md:col-span-2"><label className="mb-2 block text-sm font-semibold text-slate-700">BTC Comments</label><input type="text" name="btcComments" value={formData.btcComments} onChange={handleChange} className={fieldClass} /></div>
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <button type="button" onClick={() => toggleSection('additional')} className="flex w-full items-center justify-between px-5 py-4 text-left">
                  <div>
                    <span className="text-lg font-bold text-slate-900">Additional Information</span>
                    <p className="mt-1 text-sm text-slate-500">Operational notes and reservation extras.</p>
                  </div>
                  {expandedSections.additional ? <ChevronUpIcon className="h-5 w-5 text-slate-400" /> : <ChevronDownIcon className="h-5 w-5 text-slate-400" />}
                </button>
                {expandedSections.additional && (
                  <div className="space-y-4 border-t border-slate-100 px-5 py-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <div><label className="mb-2 block text-sm font-semibold text-slate-700">Coming From</label><input type="text" name="comingFrom" value={formData.comingFrom} onChange={handleChange} className={fieldClass} /></div>
                      <div><label className="mb-2 block text-sm font-semibold text-slate-700">Newspaper</label><input type="text" name="newspaper" value={formData.newspaper} onChange={handleChange} className={fieldClass} /></div>
                      <div><label className="mb-2 block text-sm font-semibold text-slate-700">Meals</label><select name="meals" value={formData.meals} onChange={handleChange} className={fieldClass}><option value="">Select</option><option value="BF Only">BF Only</option><option value="Half Board">Half Board</option><option value="Full Board">Full Board</option><option value="Room Only">Room Only</option></select></div>
                      <div><label className="mb-2 block text-sm font-semibold text-slate-700">VIP Status</label><select name="vipStatus" value={formData.vipStatus} onChange={handleChange} className={fieldClass}><option value="">Select</option><option value="VIP">VIP</option><option value="VVIP">VVIP</option><option value="Regular">Regular</option></select></div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"><input type="checkbox" name="complimentary" checked={formData.complimentary} onChange={handleChange} className="h-4 w-4 rounded text-indigo-600" />Complimentary</label>
                      <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"><input type="checkbox" name="noPost" checked={formData.noPost} onChange={handleChange} className="h-4 w-4 rounded text-indigo-600" />No Post</label>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div><label className="mb-2 block text-sm font-semibold text-slate-700">Check-in Notes</label><textarea name="checkinNotes" value={formData.checkinNotes} onChange={handleChange} rows={3} className={fieldClass} /></div>
                      <div><label className="mb-2 block text-sm font-semibold text-slate-700">Inclusive Privileges</label><input type="text" name="inclusivePrivileges" value={formData.inclusivePrivileges} onChange={handleChange} className={fieldClass} placeholder="e.g. Airport Transfer | Buffet Breakfast | WiFi Internet | 85 TV Channels" /></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 z-20 -mx-5 mt-6 border-t border-slate-200 bg-white px-6 pt-5 pb-4 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] md:-mx-6 md:px-6">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap gap-3">
                    <button type="button" className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">Save Draft</button>
                    <button type="button" className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">Print Confirmation</button>
                  </div>
                  <div className="flex flex-wrap gap-3 lg:justify-end">
                    <button type="submit" disabled={loading} className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-100 transition hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50">{loading ? 'Saving...' : editingId ? 'Update Reservation' : 'Confirm Reservation'}</button>
                    <button type="button" onClick={() => setShowForm(false)} className="rounded-xl bg-rose-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-600">Cancel Reservation</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reservations Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-indigo-50 px-6 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Reservations ({filteredReservations.length})
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-600">Per Page</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(parseInt(e.target.value) || 10)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  {reservationPageSizeOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={exportReservationsToExcel}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Download Excel
              </button>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reservations...</p>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <CalendarDaysIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p>No reservations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
                    Reservation
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
                    Hotel & Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
                    Guest & Room
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
                    Source
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
                    Dates
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
                    Status & Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {paginatedReservations.map((reservation, index) => (
                  <tr key={reservation.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'} transition hover:bg-indigo-50/60`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button type="button" onClick={() => openReservationDetails(reservation)} className="flex items-center text-left transition hover:opacity-90">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                            <CalendarDaysIcon className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-indigo-700 underline underline-offset-2">
                            {reservation.reservationNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {reservation.id}
                          </div>
                        </div>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{reservation.hotelName || reservation.room?.roomType?.hotelName || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{reservation.roomTypeName || reservation.room?.roomType?.name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{reservation.guest?.fullName || 'N/A'}</div>
                      <div className="text-sm text-gray-500">Room {reservation.room?.roomNumber || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{reservation.source || reservation.bookingSource || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(reservation.checkInDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        to {new Date(reservation.checkOutDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        reservation.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        reservation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        reservation.status === 'Checked In' ? 'bg-blue-100 text-blue-800' :
                        reservation.status === 'Checked Out' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {reservation.status}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">Rs {reservation.totalAmount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-row items-center gap-2">
                        <button
                          onClick={() => openReservationDetails(reservation)}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="View / Print"
                        >
                          <PrinterIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(reservation)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(reservation.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete"
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

        {!loading && filteredReservations.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50 px-6 py-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-900">{Math.min((currentPage - 1) * pageSize + 1, filteredReservations.length)}</span> to <span className="font-semibold text-slate-900">{Math.min(currentPage * pageSize, filteredReservations.length)}</span> of <span className="font-semibold text-slate-900">{filteredReservations.length}</span> reservations
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <div className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm">
                Page {currentPage} of {totalPages}
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Print Reservation Modal */}
      {showPrintModal && printReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto py-8">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Reservation Acknowledgment</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const content = printRef.current
                    const win = window.open('', '_blank')
                    win.document.write(`<html><head><title>Reservation ${printReservation.reservationNumber}</title>
                      <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .header h1 { margin: 0; font-size: 22px; }
                        .header p { margin: 2px 0; font-size: 12px; color: #666; }
                        .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
                        .header-row .left, .header-row .right { font-size: 11px; color: #666; }
                        .title { text-align: center; font-size: 16px; font-weight: bold; margin: 15px 0 5px; text-transform: uppercase; }
                        .status { text-align: center; font-weight: bold; margin-bottom: 15px; font-size: 14px; }
                        .intro { font-size: 13px; margin-bottom: 15px; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
                        table td { padding: 6px 10px; border: 1px solid #ddd; font-size: 12px; }
                        table td:nth-child(odd) { font-weight: bold; background: #f9f9f9; width: 20%; }
                        .privileges { font-size: 12px; margin: 10px 0; padding: 8px; background: #f9f9f9; border: 1px solid #ddd; }
                        .terms-title { text-align: center; font-weight: bold; font-size: 14px; margin: 15px 0 8px; }
                        .terms { font-size: 11px; margin-bottom: 15px; }
                        .terms li { margin-bottom: 3px; }
                        .closing { font-size: 12px; margin-top: 20px; }
                        .signature { margin-top: 40px; font-size: 12px; border-top: 1px solid #333; display: inline-block; padding-top: 5px; }
                        @media print { body { padding: 10px; } }
                      </style></head><body>`)
                    win.document.write(content.innerHTML)
                    win.document.write('</body></html>')
                    win.document.close()
                    win.print()
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
                >
                  <PrinterIcon className="h-4 w-4" /> Print
                </button>
                <button onClick={() => setShowPrintModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Printable Content */}
            <div ref={printRef} className="px-8 py-6 text-sm">
              {/* Hotel Header */}
              <div className="text-center mb-4">
                <h1 className="text-xl font-bold">{printReservation.hotelName || printReservation.room?.roomType?.hotelName || 'Hotel ERP'}</h1>
                <p className="text-gray-500 text-xs">{printReservation.guest?.address ? `${printReservation.guest.address}, ${printReservation.guest.city || ''}, ${printReservation.guest.country || ''}` : ''}</p>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-4">
                <div>
                  <p><strong>Phone:</strong> {printReservation.guest?.phone || ''}</p>
                  <p><strong>Date:</strong> {new Date(printReservation.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p><strong>Email:</strong> {printReservation.guest?.email || ''}</p>
                </div>
              </div>

              <div className="text-center font-bold text-base uppercase tracking-wide mb-1 border-t border-b py-2">
                Room Reservation Acknowledgement
              </div>
              <div className="text-center font-bold mb-4">
                Reservation Status: <span className={
                  printReservation.status === 'Confirmed' ? 'text-green-700' :
                  printReservation.status === 'Pending' ? 'text-yellow-700' :
                  printReservation.status === 'Cancelled' ? 'text-red-700' : 'text-gray-700'
                }>{printReservation.status}</span>
              </div>

              <p className="mb-4 text-xs">
                We are pleased to confirm your reservation at <strong>{printReservation.hotelName || 'Hotel ERP'}</strong>. Below is the summary of your initial itinerary as requested.
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-4 text-xs">
                <div className="rounded border border-gray-200 bg-gray-50 px-3 py-2"><strong>Reservation ID:</strong> {printReservation.id}</div>
                <div className="rounded border border-gray-200 bg-gray-50 px-3 py-2"><strong>Source:</strong> {printReservation.source || printReservation.bookingSource || 'N/A'}</div>
              </div>

              {/* Reservation Details Table */}
              <table className="w-full border-collapse border border-gray-300 mb-4 text-xs">
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-bold bg-gray-50 w-1/6">Conf. Number</td>
                    <td className="border border-gray-300 px-3 py-2 w-1/6">{printReservation.reservationNumber}</td>
                    <td className="border border-gray-300 px-3 py-2 font-bold bg-gray-50 w-1/6">Res Made By</td>
                    <td className="border border-gray-300 px-3 py-2 w-1/6">{printReservation.reservationMadeBy || ''}</td>
                    <td className="border border-gray-300 px-3 py-2 font-bold bg-gray-50 w-1/6">Guest Name 1</td>
                    <td className="border border-gray-300 px-3 py-2 w-1/6">{printReservation.guest?.fullName || ''}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-bold bg-gray-50">Guest Name 2</td>
                    <td className="border border-gray-300 px-3 py-2">{printReservation.guestName2 || ''}</td>
                    <td className="border border-gray-300 px-3 py-2 font-bold bg-gray-50">Occupation</td>
                    <td className="border border-gray-300 px-3 py-2">{printReservation.guest?.occupation || ''}</td>
                    <td className="border border-gray-300 px-3 py-2 font-bold bg-gray-50">Company</td>
                    <td className="border border-gray-300 px-3 py-2">{printReservation.company || printReservation.guest?.company || ''}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-bold bg-gray-50">Checkin Date</td>
                    <td className="border border-gray-300 px-3 py-2">{new Date(printReservation.checkInDate).toLocaleDateString()}</td>
                    <td className="border border-gray-300 px-3 py-2 font-bold bg-gray-50">Checkout Date</td>
                    <td className="border border-gray-300 px-3 py-2">{new Date(printReservation.checkOutDate).toLocaleDateString()}</td>
                    <td className="border border-gray-300 px-3 py-2 font-bold bg-gray-50">Nights</td>
                    <td className="border border-gray-300 px-3 py-2">{printReservation.nights || Math.ceil((new Date(printReservation.checkOutDate) - new Date(printReservation.checkInDate)) / (1000*60*60*24))}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-bold bg-gray-50">Adults/Children</td>
                    <td className="border border-gray-300 px-3 py-2">{printReservation.numberOfAdults} / {printReservation.numberOfChildren}</td>
                    <td className="border border-gray-300 px-3 py-2 font-bold bg-gray-50">Room Type</td>
                    <td className="border border-gray-300 px-3 py-2">{printReservation.roomTypeName || printReservation.room?.roomType?.name || ''}</td>
                    <td className="border border-gray-300 px-3 py-2 font-bold bg-gray-50">No. Rooms</td>
                    <td className="border border-gray-300 px-3 py-2">{printReservation.numberOfRooms || 1}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-bold bg-gray-50">Room Rate</td>
                    <td className="border border-gray-300 px-3 py-2">{printReservation.roomRate ? `Rs ${parseFloat(printReservation.roomRate).toLocaleString()} + Tax` : `Rs ${parseFloat(printReservation.totalAmount).toLocaleString()}`}</td>
                    <td className="border border-gray-300 px-3 py-2 font-bold bg-gray-50">Payment Mode</td>
                    <td className="border border-gray-300 px-3 py-2">{printReservation.paymentMethod || ''}</td>
                    <td className="border border-gray-300 px-3 py-2 font-bold bg-gray-50">Airport Pickup</td>
                    <td className="border border-gray-300 px-3 py-2">
                      {printReservation.pickup ? `${printReservation.pickupCarrier || ''} ${printReservation.pickupTime || ''} ${printReservation.pickupStation || ''}`.trim() : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-bold bg-gray-50">Res Remarks</td>
                    <td className="border border-gray-300 px-3 py-2" colSpan="2">{printReservation.reservationNotes || printReservation.specialRequests || ''}</td>
                    <td className="border border-gray-300 px-3 py-2 font-bold bg-gray-50">Entered By</td>
                    <td className="border border-gray-300 px-3 py-2" colSpan="2">{printReservation.enteredBy || ''}</td>
                  </tr>
                </tbody>
              </table>

              {/* Inclusive Privileges */}
              {printReservation.inclusivePrivileges && (
                <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded text-xs">
                  <strong>Inclusive Privileges:</strong> {printReservation.inclusivePrivileges}
                </div>
              )}

              {/* Terms and Conditions */}
              <div className="text-center font-bold text-sm mb-2 border-t pt-3">Terms and Conditions</div>
              <ul className="text-xs list-disc pl-5 space-y-1 mb-4">
                <li>Room rates are subject to 16% Government Tax per room per night.</li>
                <li>Check-in time is 1400 hrs; early arrival subject to availability. Before 0800 hrs, previous night is charged.</li>
                <li>Check-out time is 1200 noon. 50% rent charged for check-out after 1200 to 1800 hrs; full rent after 1800 hrs.</li>
                <li>All non-guaranteed reservations are tentative unless guaranteed by credit card, letter, or deposit.</li>
                <li>72 hours cancellation notice required. Otherwise, one night's NO-SHOW/CANCELLATION charge applies.</li>
                <li>In case of query, please contact the Reservation Department.</li>
                <li>Buffet breakfast is complimentary from 06:00am to 10:00am.</li>
              </ul>

              <div className="text-xs mb-6">
                <p>We look forward to welcoming you and your guests at <strong>{printReservation.hotelName || 'Hotel ERP'}</strong>.</p>
                <p>Sincerely yours,</p>
              </div>

              <div className="mt-8 pt-2 border-t border-gray-400 inline-block text-xs">
                <p className="font-semibold">Reservation Department</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reservations;
