import { useState, useEffect } from 'react'
import axios from '../../utils/axios'
import {
  ArrowRightOnRectangleIcon,
  UserIcon,
  BuildingOfficeIcon,
  Bars3BottomLeftIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CheckCircleIcon,
  PencilIcon,
  Squares2X2Icon,
  TrashIcon,
  CurrencyDollarIcon,
  ClockIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ReceiptPercentIcon
} from '@heroicons/react/24/outline'

const formatCurrency = (value) => `Rs. ${(parseFloat(value) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const formatDate = (value) => {
  if (!value) return 'N/A'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString()
}

const formatDateTime = (value) => {
  if (!value) return 'N/A'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleString()
}

const initialActionForm = {
  label: '',
  amount: ''
}

const checkoutDraftStorageKey = 'hotel-erp-checkout-drafts'

const createDefaultPaymentLine = (overrides = {}) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  method: 'Cash',
  amount: '',
  reference: '',
  ...overrides
})

const normalizeCheckInDetails = (source) => {
  if (!source) return null

  const guest = source.guest || source.Guest
  const room = source.room || source.Room
  const roomType = room?.roomType || room?.RoomType
  const reservation = source.reservation || source.Reservation

  return {
    id: source.id || source.Id || null,
    checkInNumber: source.checkInNumber || source.CheckInNumber || '',
    reservationId: source.reservationId || source.ReservationId || reservation?.id || reservation?.Id || null,
    reservationNumber: source.reservationNumber || source.ReservationNumber || reservation?.reservationNumber || reservation?.ReservationNumber || '',
    checkInDate: source.checkInDate || source.CheckInDate || null,
    expectedCheckOutDate: source.expectedCheckOutDate || source.ExpectedCheckOutDate || null,
    advancePaid: source.advancePaid || source.AdvancePaid || 0,
    guest: guest ? {
      id: guest.id || guest.Id || null,
      fullName: guest.fullName || guest.FullName || source.guestName || source.GuestName || 'Guest',
      firstName: guest.firstName || guest.FirstName || '',
      lastName: guest.lastName || guest.LastName || '',
      phone: guest.phone || guest.Phone || guest.phoneNumber || guest.PhoneNumber || '',
      email: guest.email || guest.Email || ''
    } : {
      id: null,
      fullName: source.guestName || source.GuestName || 'Guest',
      firstName: '',
      lastName: '',
      phone: source.phone || source.Phone || '',
      email: source.email || source.Email || ''
    },
    room: room ? {
      id: room.id || room.Id || null,
      roomNumber: room.roomNumber || room.RoomNumber || source.roomNumber || source.RoomNumber || 'N/A',
      floorNumber: room.floorNumber || room.FloorNumber || null,
      hotelName: room.hotelName || room.HotelName || source.hotelName || source.HotelName || '',
      roomType: roomType ? {
        id: roomType.id || roomType.Id || null,
        name: roomType.name || roomType.Name || roomType.typeName || roomType.TypeName || '',
        typeName: roomType.typeName || roomType.TypeName || roomType.name || roomType.Name || ''
      } : null
    } : {
      id: null,
      roomNumber: source.roomNumber || source.RoomNumber || 'N/A',
      floorNumber: null,
      hotelName: source.hotelName || source.HotelName || '',
      roomType: null
    },
    roomNumber: source.roomNumber || source.RoomNumber || room?.roomNumber || room?.RoomNumber || 'N/A',
    roomTypeName: source.roomTypeName || source.RoomTypeName || roomType?.typeName || roomType?.TypeName || roomType?.name || roomType?.Name || '',
    guestName: source.guestName || source.GuestName || guest?.fullName || guest?.FullName || 'Guest',
    hotelName: source.hotelName || source.HotelName || room?.hotelName || room?.HotelName || reservation?.hotelName || reservation?.HotelName || 'Hotel ERP'
  }
}

const CheckOut = () => {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [checkInSearch, setCheckInSearch] = useState('')
  const [showCheckInDropdown, setShowCheckInDropdown] = useState(false)
  const [selectedCheckIn, setSelectedCheckIn] = useState(null)
  const [formData, setFormData] = useState({
    checkInId: '',
    checkOutDate: new Date().toISOString().split('T')[0],
    roomCharges: '',
    serviceCharges: '',
    taxAmount: '',
    totalBill: '',
    advancePaid: '',
    paidNow: '',
    totalPaid: '',
    balance: '',
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    checkedOutBy: 'Reception Staff',
    remarks: '',
    lateCheckOut: false,
    lateCheckOutCharges: ''
  })

  const [checkOuts, setCheckOuts] = useState([])
  const [activeCheckIns, setActiveCheckIns] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [drafts, setDrafts] = useState([])
  const [showChargeModal, setShowChargeModal] = useState(false)
  const [showDiscountModal, setShowDiscountModal] = useState(false)
  const [showInvoicePreview, setShowInvoicePreview] = useState(false)
  const [chargeForm, setChargeForm] = useState(initialActionForm)
  const [discountForm, setDiscountForm] = useState(initialActionForm)
  const [appliedAdjustments, setAppliedAdjustments] = useState([])
  const [paymentLines, setPaymentLines] = useState([createDefaultPaymentLine()])
  const [invoiceSending, setInvoiceSending] = useState(false)
  const [checkOutViewMode, setCheckOutViewMode] = useState('list')

  const recalculateFinancials = (values) => {
    const roomCharges = parseFloat(values.roomCharges) || 0
    const serviceCharges = parseFloat(values.serviceCharges) || 0
    const taxAmount = parseFloat(values.taxAmount) || 0
    const lateCharges = values.lateCheckOut ? (parseFloat(values.lateCheckOutCharges) || 0) : 0
    const advancePaid = parseFloat(values.advancePaid) || 0
    const paidNow = parseFloat(values.paidNow) || 0
    const totalBill = roomCharges + serviceCharges + taxAmount + lateCharges
    const totalPaid = advancePaid + paidNow
    const balance = totalBill - totalPaid

    return {
      totalBill: totalBill.toFixed(2),
      totalPaid: totalPaid.toFixed(2),
      balance: balance.toFixed(2),
      paymentStatus: balance <= 0 ? 'Paid' : balance < totalBill ? 'Partial' : 'Pending'
    }
  }

  const syncPaymentSummary = (lines, baseFormData) => {
    const paidNow = lines.reduce((sum, line) => sum + (parseFloat(line.amount) || 0), 0)
    const paymentMethods = Array.from(new Set(lines.map(line => line.method).filter(Boolean)))
    const updated = {
      ...baseFormData,
      paidNow: paidNow.toFixed(2),
      paymentMethod: paymentMethods.length > 1 ? 'Split Payment' : paymentMethods[0] || 'Cash'
    }

    return {
      ...updated,
      ...recalculateFinancials(updated)
    }
  }

  useEffect(() => {
    const loadDrafts = async () => {
      try {
        const response = await axios.get('/checkouts/drafts')
        const backendDrafts = response.data?.data || []
        setDrafts(backendDrafts)
      } catch (apiError) {
        console.error('Failed to load backend checkout drafts:', apiError)
        try {
          const savedDrafts = localStorage.getItem(checkoutDraftStorageKey)
          if (savedDrafts) {
            setDrafts(JSON.parse(savedDrafts))
          }
        } catch (storageError) {
          console.error('Failed to load checkout drafts:', storageError)
        }
      }
    }

    loadDrafts()
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(checkoutDraftStorageKey, JSON.stringify(drafts))
    } catch (storageError) {
      console.error('Failed to save checkout drafts:', storageError)
    }
  }, [drafts])

  const buildBillingFromCheckIn = (checkIn) => {
    const roomChargesRaw =
      checkIn.totalAmount ??
      checkIn.roomRate ??
      checkIn.room?.basePrice ??
      0
    const advancePaidRaw =
      checkIn.advancePaid ??
      checkIn.advancePayment ??
      0

    const roomCharges = parseFloat(roomChargesRaw) || 0
    const serviceCharges = 0
    const taxAmount = 0
    const lateCheckOutCharges = 0
    const totalBill = roomCharges + serviceCharges + taxAmount + lateCheckOutCharges
    const advancePaid = parseFloat(advancePaidRaw) || 0
    const paidNow = 0
    const totalPaid = advancePaid + paidNow
    const balance = totalBill - totalPaid

    return {
      roomCharges: roomCharges.toFixed(2),
      serviceCharges: serviceCharges.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      totalBill: totalBill.toFixed(2),
      advancePaid: advancePaid.toFixed(2),
      paidNow: paidNow.toFixed(2),
      totalPaid: totalPaid.toFixed(2),
      balance: balance.toFixed(2),
      paymentStatus: balance <= 0 ? 'Paid' : balance < totalBill ? 'Partial' : 'Pending',
      lateCheckOutCharges: lateCheckOutCharges.toFixed(2)
    }
  }

  // Fetch check-outs
  const fetchCheckOuts = async () => {
    try {
      const response = await axios.get('/checkouts')
      console.log('Fetched check-outs:', response.data)
      setCheckOuts(response.data.data || [])
    } catch (err) {
      console.error('Error fetching check-outs:', err)
      setCheckOuts([])
      setError('Failed to fetch check-outs. Please ensure API server is running.')
    }
  }

  // Fetch active check-ins
  const fetchActiveCheckIns = async () => {
    try {
      const response = await axios.get('/checkins/active')
      if (response.data.success) {
        setActiveCheckIns(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching active check-ins:', err)
      setActiveCheckIns([])
      setError('Failed to fetch active check-ins. Please ensure API server is running.')
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchCheckOuts()
    fetchActiveCheckIns()
  }, [])

  // Filter check-ins based on search
  const filteredCheckIns = activeCheckIns.filter(checkIn => {
    const searchLower = checkInSearch.toLowerCase()
    return (
      checkIn.guest?.fullName?.toLowerCase().includes(searchLower) ||
      checkIn.guestName?.toLowerCase().includes(searchLower) ||
      checkIn.guest?.firstName?.toLowerCase().includes(searchLower) ||
      checkIn.guest?.lastName?.toLowerCase().includes(searchLower) ||
      checkIn.room?.roomNumber?.toLowerCase().includes(searchLower) ||
      checkIn.roomNumber?.toLowerCase().includes(searchLower) ||
      checkIn.checkInNumber?.toLowerCase().includes(searchLower) ||
      checkIn.guest?.phone?.toLowerCase().includes(searchLower)
    )
  })

  // Handle check-in selection from dropdown
  const handleCheckInDropdownSelect = (checkIn) => {
    console.log('🏨 Selected check-in:', checkIn)
    const normalizedCheckIn = normalizeCheckInDetails(checkIn)
    setSelectedCheckIn(normalizedCheckIn)
    
    // ✅ Fix: Handle undefined guest and room data properly
    const guestName = normalizedCheckIn?.guest?.fullName || normalizedCheckIn?.guestName || 'Guest'
    const roomNumber = normalizedCheckIn?.room?.roomNumber || normalizedCheckIn?.roomNumber || 'N/A'
    const checkInNumber = normalizedCheckIn?.checkInNumber || `CHK-${checkIn.id}`
    
    setCheckInSearch(`${checkInNumber} - ${guestName} - Room ${roomNumber}`)
    setShowCheckInDropdown(false)
    
    // Auto-populate form fields including check-out date from CheckInMasters
    const billing = buildBillingFromCheckIn(checkIn)

    setFormData(prev => ({
      ...prev,
      checkInId: checkIn.id,
      checkOutDate: checkIn.expectedCheckOutDate?.split('T')[0] || new Date().toISOString().split('T')[0], // ✅ Fix: Use expected checkout date from CheckInMasters
      ...billing
    }))
    setAppliedAdjustments([])
    setPaymentLines([createDefaultPaymentLine()])
    
    console.log('✅ Auto-populated checkout date from CheckInMasters:', checkIn.expectedCheckOutDate?.split('T')[0])
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCheckInDropdown && !event.target.closest('.checkin-dropdown')) {
        setShowCheckInDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCheckInDropdown])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const nextValue = type === 'checkbox' ? checked : value
    setFormData(prev => ({
      ...prev,
      [name]: nextValue
    }))

    // Auto-calculate total bill and balance
    if (name === 'roomCharges' || name === 'serviceCharges' || name === 'taxAmount' || name === 'lateCheckOutCharges' || name === 'paidNow' || name === 'advancePaid' || name === 'totalPaid') {
      const roomCharges = name === 'roomCharges' ? parseFloat(value) || 0 : parseFloat(formData.roomCharges) || 0
      const serviceCharges = name === 'serviceCharges' ? parseFloat(value) || 0 : parseFloat(formData.serviceCharges) || 0
      const taxAmount = name === 'taxAmount' ? parseFloat(value) || 0 : parseFloat(formData.taxAmount) || 0
      const lateCharges = name === 'lateCheckOutCharges' ? parseFloat(value) || 0 : parseFloat(formData.lateCheckOutCharges) || 0
      const advancePaid = name === 'advancePaid' ? parseFloat(value) || 0 : parseFloat(formData.advancePaid) || 0
      const paidNowInput = name === 'paidNow' ? parseFloat(value) || 0 : parseFloat(formData.paidNow) || 0
      
      const totalBill = roomCharges + serviceCharges + taxAmount + lateCharges

      let paidNow = paidNowInput
      let totalPaid = advancePaid + paidNowInput

      if (name === 'totalPaid') {
        const requestedTotalPaid = parseFloat(value) || 0
        totalPaid = Math.max(requestedTotalPaid, advancePaid)
        paidNow = totalPaid - advancePaid
      }

      const balance = totalBill - totalPaid
      
      setFormData(prev => ({
        ...prev,
        totalBill: totalBill.toFixed(2),
        ...(name === 'totalPaid'
          ? {
              totalPaid: totalPaid.toFixed(2),
              paidNow: paidNow.toFixed(2)
            }
          : { totalPaid: totalPaid.toFixed(2) }),
        balance: balance.toFixed(2),
        paymentStatus: balance <= 0 ? 'Paid' : balance < totalBill ? 'Partial' : 'Pending'
      }))
    }

    if (name === 'lateCheckOut') {
      setFormData(prev => {
        const updated = {
          ...prev,
          lateCheckOut: checked,
          lateCheckOutCharges: checked ? prev.lateCheckOutCharges : '0.00'
        }
        return {
          ...updated,
          ...recalculateFinancials(updated)
        }
      })
    }
  }

  // Handle check-in selection
  const handleCheckInSelect = (e) => {
    const checkInId = e.target.value
    const selectedCheckIn = activeCheckIns.find(ci => ci.id.toString() === checkInId)
    
    if (selectedCheckIn) {
      const billing = buildBillingFromCheckIn(selectedCheckIn)

      setFormData(prev => ({
        ...prev,
        checkInId,
        ...billing
      }))
      setPaymentLines([createDefaultPaymentLine()])
    } else {
      setFormData(prev => ({
        ...prev,
        checkInId,
        roomCharges: '',
        serviceCharges: '',
        taxAmount: '',
        totalBill: '',
        totalPaid: '',
        balance: ''
      }))
      setPaymentLines([createDefaultPaymentLine()])
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      setSuccess('')

      if (!isPaymentBreakdownValid) {
        setError(`Split payments must exactly match the payable amount of ${formatCurrency(requiredPayNow)} before finalizing checkout.`)
        setLoading(false)
        return
      }

      const checkOutData = {
        ...formData,
        ...buildCheckoutPayload(),
        advancePaid: parseFloat(formData.advancePaid) || 0,
        paidNow: parseFloat(formData.paidNow) || 0
      }

      if (editingId) {
        console.log('Updating check-out:', checkOutData)
        const response = await axios.put(`/checkouts/${editingId}`, { ...checkOutData, id: editingId })
        console.log('Check-out update response:', response.data)
        setSuccess('Check-out updated successfully!')
      } else {
        // Use real API endpoint for checkout
        console.log('Processing checkout for CheckInId:', checkOutData.checkInId)
        
        const response = await axios.post('/checkouts', {
          checkInId: parseInt(checkOutData.checkInId),
          checkOutDate: checkOutData.checkOutDate,
          roomCharges: parseFloat(checkOutData.roomCharges),
          serviceCharges: parseFloat(checkOutData.serviceCharges),
          taxAmount: parseFloat(checkOutData.taxAmount),
          totalBill: parseFloat(checkOutData.totalBill),
          totalPaid: parseFloat(checkOutData.totalPaid),
          balance: parseFloat(checkOutData.balance),
          lateCheckOutCharges: parseFloat(checkOutData.lateCheckOutCharges),
          paymentMethod: checkOutData.paymentMethod,
          paymentStatus: checkOutData.paymentStatus,
          checkedOutBy: checkOutData.checkedOutBy,
          remarks: checkOutData.remarks,
          lateCheckOut: checkOutData.lateCheckOut,
          paymentLines: checkOutData.paymentLines
        })
        console.log('Check-out response:', response.data)
        setSuccess(`Guest checked out successfully! Check-out Number: ${response.data.data?.checkOutNumber || 'N/A'}`)
      }

      fetchCheckOuts()
      fetchActiveCheckIns() // Refresh active check-ins

      resetForm()
    } catch (err) {
      console.error('Check-out error:', err)
      console.error('Error response:', err.response?.data)
      
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        setError('API server is not running. Please start the API server and try again.')
      } else if (err.response?.data?.message) {
        setError(err.response?.data?.message)
      } else {
        setError('Failed to process check-out')
      }
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      checkInId: '',
      checkOutDate: new Date().toISOString().split('T')[0],
      roomCharges: '',
      serviceCharges: '',
      taxAmount: '',
      totalBill: '',
      advancePaid: '',
      paidNow: '',
      totalPaid: '',
      balance: '',
      paymentMethod: 'Cash',
      paymentStatus: 'Paid',
      checkedOutBy: 'Reception Staff',
      remarks: '',
      lateCheckOut: false,
      lateCheckOutCharges: ''
    })
    setEditingId(null)
    setCheckInSearch('')
    setSelectedCheckIn(null)
    setShowCheckInDropdown(false)
    setAppliedAdjustments([])
    setChargeForm(initialActionForm)
    setDiscountForm(initialActionForm)
    setShowChargeModal(false)
    setShowDiscountModal(false)
    setShowInvoicePreview(false)
    setPaymentLines([createDefaultPaymentLine()])
    setShowForm(false)
  }

  // Handle edit
  const handleEdit = (checkOut) => {
    const normalizedCheckIn = normalizeCheckInDetails(checkOut.checkIn)
    const advancePaid =
      parseFloat(checkOut.checkIn?.advancePaid) ||
      parseFloat(checkOut.checkIn?.AdvancePaid) ||
      0
    const totalPaid = parseFloat(checkOut.totalPaid) || 0
    const paidNow = Math.max(totalPaid - advancePaid, 0)

    setFormData({
      checkInId: checkOut.checkInId?.toString() || '',
      checkOutDate: checkOut.checkOutDate?.split('T')[0] || '',
      roomCharges: checkOut.roomCharges?.toString() || '',
      serviceCharges: checkOut.serviceCharges?.toString() || '',
      taxAmount: checkOut.taxAmount?.toString() || '',
      totalBill: checkOut.totalBill?.toString() || '',
      advancePaid: advancePaid.toFixed(2),
      paidNow: paidNow.toFixed(2),
      totalPaid: totalPaid.toFixed(2),
      balance: checkOut.balance?.toString() || '',
      paymentMethod: checkOut.paymentMethod || 'Cash',
      paymentStatus: checkOut.paymentStatus || 'Paid',
      checkedOutBy: checkOut.checkedOutBy || 'Reception Staff',
      remarks: checkOut.remarks || '',
      lateCheckOut: checkOut.lateCheckOut || false,
      lateCheckOutCharges: checkOut.lateCheckOutCharges?.toString() || ''
    })
    setAppliedAdjustments([])
    setPaymentLines([
      createDefaultPaymentLine({
        method: checkOut.paymentMethod || 'Cash',
        amount: paidNow.toFixed(2),
        reference: ''
      })
    ])
    setSelectedCheckIn(normalizedCheckIn)
    if (normalizedCheckIn) {
      const editGuestName = normalizedCheckIn.guest?.fullName || normalizedCheckIn.guestName || 'Guest'
      const editRoomNumber = normalizedCheckIn.room?.roomNumber || normalizedCheckIn.roomNumber || 'N/A'
      const editCheckInNumber = normalizedCheckIn.checkInNumber || `CHK-${normalizedCheckIn.id}`
      setCheckInSearch(`${editCheckInNumber} - ${editGuestName} - Room ${editRoomNumber}`)
    } else {
      setCheckInSearch(checkOut.checkOutNumber || '')
    }
    setShowCheckInDropdown(false)
    setEditingId(checkOut.id)
    setShowForm(true)
  }

  const handleAddCharge = () => {
    const amount = parseFloat(chargeForm.amount) || 0
    if (!chargeForm.label.trim() || amount <= 0) {
      setError('Enter a valid charge label and amount')
      return
    }

    setError('')
    setFormData(prev => {
      const updated = {
        ...prev,
        serviceCharges: ((parseFloat(prev.serviceCharges) || 0) + amount).toFixed(2)
      }
      return {
        ...updated,
        ...recalculateFinancials(updated)
      }
    })
    setAppliedAdjustments(prev => [...prev, { type: 'charge', label: chargeForm.label.trim(), amount }])
    setChargeForm(initialActionForm)
    setShowChargeModal(false)
    setSuccess(`Additional charge added: ${chargeForm.label}`)
  }

  const handleApplyDiscount = () => {
    const amount = parseFloat(discountForm.amount) || 0
    if (!discountForm.label.trim() || amount <= 0) {
      setError('Enter a valid discount label and amount')
      return
    }

    setError('')
    setFormData(prev => {
      const currentServiceCharges = parseFloat(prev.serviceCharges) || 0
      const nextServiceCharges = Math.max(currentServiceCharges - amount, 0)
      const updated = {
        ...prev,
        serviceCharges: nextServiceCharges.toFixed(2)
      }
      return {
        ...updated,
        ...recalculateFinancials(updated)
      }
    })
    setAppliedAdjustments(prev => [...prev, { type: 'discount', label: discountForm.label.trim(), amount: -amount }])
    setDiscountForm(initialActionForm)
    setShowDiscountModal(false)
    setSuccess(`Discount applied: ${discountForm.label}`)
  }

  const handleSaveDraft = () => {
    if (!formData.checkInId) {
      setError('Select an active check-in before saving a draft')
      return
    }

    const draftId = editingId ? `checkout-${editingId}` : `draft-${Date.now()}`
    const draft = {
      draftId,
      id: draftId,
      savedAt: new Date().toISOString(),
      guestName,
      roomNumber,
      formData,
      adjustments: appliedAdjustments,
      paymentLines,
      selectedCheckInId: formData.checkInId
    }

    const persistDraft = async () => {
      try {
        await axios.post('/checkouts/drafts', {
          draftId,
          savedAt: draft.savedAt,
          guestName: draft.guestName,
          roomNumber: draft.roomNumber,
          selectedCheckInId: String(draft.selectedCheckInId || ''),
          formData: draft.formData,
          adjustments: draft.adjustments.map(item => ({
            type: item.type,
            label: item.label,
            amount: parseFloat(item.amount) || 0
          })),
          paymentLines: draft.paymentLines.map(line => ({
            method: line.method,
            amount: parseFloat(line.amount) || 0,
            reference: line.reference || ''
          }))
        })
      } catch (apiError) {
        console.error('Failed to persist draft to backend:', apiError)
      }

      setDrafts(prev => {
        const filtered = prev.filter(item => (item.draftId || item.id) !== draftId)
        return [draft, ...filtered].slice(0, 5)
      })
      setSuccess(`Draft saved for ${guestName}`)
    }

    persistDraft()
  }

  const handleLoadDraft = (draft) => {
    const matchingCheckIn = activeCheckIns.find(item => item.id?.toString() === draft.selectedCheckInId?.toString()) || null
    setFormData(draft.formData)
    setAppliedAdjustments(draft.adjustments || [])
    setPaymentLines(draft.paymentLines?.length ? draft.paymentLines : [createDefaultPaymentLine()])
    setSelectedCheckIn(normalizeCheckInDetails(matchingCheckIn))
    if (matchingCheckIn) {
      const draftGuestName = matchingCheckIn.guest?.fullName || matchingCheckIn.guestName || 'Guest'
      const draftRoomNumber = matchingCheckIn.room?.roomNumber || matchingCheckIn.roomNumber || 'N/A'
      const draftCheckInNumber = matchingCheckIn.checkInNumber || `CHK-${matchingCheckIn.id}`
      setCheckInSearch(`${draftCheckInNumber} - ${draftGuestName} - Room ${draftRoomNumber}`)
    }
    setShowForm(true)
    setSuccess(`Draft restored for ${draft.guestName}`)
  }

  const handleDeleteDraft = (draftId) => {
    const removeDraft = async () => {
      try {
        await axios.delete(`/checkouts/drafts/${draftId}`)
      } catch (apiError) {
        console.error('Failed to delete backend draft:', apiError)
      }

      setDrafts(prev => prev.filter(draft => (draft.draftId || draft.id) !== draftId))
    }

    removeDraft()
  }

  const handleAddPaymentLine = () => {
    setPaymentLines(prev => [...prev, createDefaultPaymentLine()])
  }

  const handleRemovePaymentLine = (lineId) => {
    const updatedLines = paymentLines.filter(line => line.id !== lineId)
    const nextLines = updatedLines.length ? updatedLines : [createDefaultPaymentLine()]
    setPaymentLines(nextLines)
    setFormData(prev => syncPaymentSummary(nextLines, prev))
  }

  const handlePaymentLineChange = (lineId, field, value) => {
    const updatedLines = paymentLines.map(line => line.id === lineId ? { ...line, [field]: value } : line)
    setPaymentLines(updatedLines)
    if (field === 'amount' || field === 'method') {
      setFormData(prev => syncPaymentSummary(updatedLines, prev))
    }
  }

  const handleInvoicePrint = () => {
    const printableContent = document.getElementById('checkout-invoice-print-area')?.innerHTML
    if (!printableContent) {
      setError('Invoice preview is not ready to print')
      return
    }

    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (!printWindow) {
      setError('Allow popups in your browser to print the invoice')
      return
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Checkout Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            .invoice-shell { max-width: 900px; margin: 0 auto; }
            .invoice-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
            .invoice-card { border: 1px solid #cbd5e1; border-radius: 16px; padding: 16px; margin-bottom: 16px; }
            .invoice-table { width: 100%; border-collapse: collapse; }
            .invoice-table th, .invoice-table td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: left; }
            .invoice-total { font-size: 24px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="invoice-shell">${printableContent}</div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  const buildCheckoutPayload = () => ({
    checkInId: parseInt(formData.checkInId),
    checkOutDate: new Date(formData.checkOutDate).toISOString(),
    roomCharges: parseFloat(formData.roomCharges) || 0,
    serviceCharges: parseFloat(formData.serviceCharges) || 0,
    taxAmount: parseFloat(formData.taxAmount) || 0,
    totalBill: parseFloat(formData.totalBill) || 0,
    totalPaid: parseFloat(formData.totalPaid) || 0,
    balance: parseFloat(formData.balance) || 0,
    lateCheckOutCharges: parseFloat(formData.lateCheckOutCharges) || 0,
    paymentMethod: paymentLines.filter(line => parseFloat(line.amount) > 0).length > 1
      ? `Split Payment (${paymentLines.filter(line => parseFloat(line.amount) > 0).map(line => `${line.method}: ${(parseFloat(line.amount) || 0).toFixed(2)}`).join(', ')})`
      : formData.paymentMethod,
    paymentStatus: formData.paymentStatus,
    checkedOutBy: formData.checkedOutBy,
    remarks: formData.remarks,
    lateCheckOut: formData.lateCheckOut,
    paymentLines: paymentLines
      .filter(line => parseFloat(line.amount) > 0)
      .map(line => ({
        method: line.method,
        amount: parseFloat(line.amount) || 0,
        reference: line.reference || ''
      }))
  })

  const paymentLineTotal = paymentLines.reduce((sum, line) => sum + (parseFloat(line.amount) || 0), 0)
  const requiredPayNow = Math.max((parseFloat(formData.totalBill) || 0) - (parseFloat(formData.advancePaid) || 0), 0)
  const splitPaymentDifference = Math.abs(paymentLineTotal - requiredPayNow)
  const isPaymentBreakdownValid = Math.abs((parseFloat(formData.totalPaid) || 0) - ((parseFloat(formData.advancePaid) || 0) + paymentLineTotal)) <= 0.01 && splitPaymentDifference <= 0.01 && Math.abs(parseFloat(formData.balance) || 0) <= 0.01

  const handleDownloadPdf = async () => {
    if (!formData.checkInId) {
      setError('Select an active check-in before downloading invoice PDF')
      return
    }

    try {
      setError('')
      const payload = buildCheckoutPayload()
      const response = await axios.post('/checkouts/invoice-preview/pdf', payload, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `checkout-invoice-${reservationNumber || 'preview'}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      setSuccess(`Invoice PDF downloaded for ${guestName}`)
    } catch (downloadError) {
      console.error('Failed to download checkout invoice PDF:', downloadError)
      setError(downloadError.response?.data?.message || 'Failed to download invoice PDF')
    }
  }

  const handleEmailInvoice = async () => {
    if (!formData.checkInId) {
      setError('Select an active check-in before emailing invoice')
      return
    }

    const defaultEmail = selectedCheckInDetails?.guest?.email || ''
    const recipientEmail = window.prompt('Enter recipient email address', defaultEmail)
    if (!recipientEmail) return

    try {
      setInvoiceSending(true)
      setError('')
      const payload = buildCheckoutPayload()
      await axios.post('/checkouts/invoice-preview/email', {
        email: recipientEmail,
        invoiceNumber: reservationNumber || undefined,
        checkout: payload
      })
      setSuccess(`Invoice emailed successfully to ${recipientEmail}`)
    } catch (emailError) {
      console.error('Failed to email checkout invoice:', emailError)
      setError(emailError.response?.data?.message || 'Failed to send invoice email')
    } finally {
      setInvoiceSending(false)
    }
  }

  const showDocumentAction = (actionLabel) => {
    if (!formData.checkInId) {
      setError(`Select an active check-in before using ${actionLabel.toLowerCase()}`)
      return
    }

    setError('')
    setSuccess(`${actionLabel} prepared for ${guestName}`)
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this check-out?')) return
    
    try {
      setLoading(true)
      await axios.delete(`/checkouts/${id}`)
      setSuccess('Check-out deleted successfully!')
      fetchCheckOuts()
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting check-out')
    } finally {
      setLoading(false)
    }
  }

  // Filter check-outs based on search
  const filteredCheckOuts = checkOuts.filter(checkOut =>
    checkOut.checkOutNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    checkOut.checkIn?.guest?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    checkOut.checkIn?.room?.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedCheckInDetails = selectedCheckIn || normalizeCheckInDetails(activeCheckIns.find(ci => ci.id?.toString() === formData.checkInId?.toString())) || null
  const guestName = selectedCheckInDetails?.guest?.fullName || selectedCheckInDetails?.guestName || 'Select a check-in'
  const guestPhone = selectedCheckInDetails?.guest?.phone || selectedCheckInDetails?.guest?.email || selectedCheckInDetails?.phone || 'N/A'
  const roomNumber = selectedCheckInDetails?.room?.roomNumber || selectedCheckInDetails?.roomNumber || 'N/A'
  const roomType = selectedCheckInDetails?.room?.roomType?.typeName || selectedCheckInDetails?.room?.roomType?.name || selectedCheckInDetails?.roomTypeName || 'Standard Room'
  const reservationNumber = selectedCheckInDetails?.reservationNumber || selectedCheckInDetails?.checkInNumber || 'N/A'
  const hotelName = selectedCheckInDetails?.hotelName || selectedCheckInDetails?.room?.hotelName || selectedCheckInDetails?.reservation?.hotelName || 'Hotel ERP'
  const stayNights = (() => {
    if (!selectedCheckInDetails?.checkInDate || !formData.checkOutDate) return 0
    const start = new Date(selectedCheckInDetails.checkInDate)
    const end = new Date(formData.checkOutDate)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0
    const diff = Math.ceil((end.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24))
    return Math.max(diff, 0)
  })()
  const ratePerNight = (() => {
    const totalRoomCharges = parseFloat(formData.roomCharges) || 0
    return stayNights > 0 ? totalRoomCharges / stayNights : totalRoomCharges
  })()
  const chargeItems = [
    { label: 'Room Charges', value: parseFloat(formData.roomCharges) || 0 },
    { label: 'Service Charges', value: parseFloat(formData.serviceCharges) || 0 },
    { label: 'Tax Amount', value: parseFloat(formData.taxAmount) || 0 },
    { label: 'Late Check-Out', value: formData.lateCheckOut ? (parseFloat(formData.lateCheckOutCharges) || 0) : 0 }
  ]
  const hasOutstandingBalance = (parseFloat(formData.balance) || 0) > 0
  const completedPaymentLines = paymentLines.filter(line => parseFloat(line.amount) > 0)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <ArrowRightOnRectangleIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Check-Out Management</h1>
              <p className="text-red-100 mt-1">Process guest departures and final billing</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Check-Out</span>
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

      {drafts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Saved Drafts</h2>
              <p className="text-sm text-slate-500">Continue unfinished check-out sessions.</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{drafts.length} Draft{drafts.length === 1 ? '' : 's'}</span>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {drafts.map(draft => (
              <div key={draft.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-800">{draft.guestName}</div>
                  <div className="text-sm text-slate-500 mt-1">Room {draft.roomNumber}</div>
                  <div className="text-xs text-slate-400 mt-2">Saved {formatDateTime(draft.savedAt)}</div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => handleLoadDraft(draft)} className="px-3 py-2 rounded-xl bg-slate-800 text-white text-sm font-medium">Restore</button>
                  <button type="button" onClick={() => handleDeleteDraft(draft.id)} className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-medium">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by check-out number, guest name, or room number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Check-Out Form */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-start justify-center overflow-y-auto py-6 px-4">
          <div className="bg-slate-100 rounded-[28px] shadow-2xl w-full max-w-7xl mx-auto my-4 overflow-hidden border border-slate-300">
            <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 px-6 py-4 text-white flex items-center justify-between sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Hotel PMS Check-Out</h2>
                <p className="text-slate-200 text-sm mt-1">{editingId ? 'Review and update departure billing details' : 'Review departure summary before finalizing guest checkout'}</p>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="text-slate-300 hover:text-white p-2 rounded-full hover:bg-white/10"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 md:p-6 max-h-[85vh] overflow-y-auto space-y-5">
              <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-5">
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">Guest Information</h3>
                      <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                        <UserIcon className="h-4 w-4" />
                        {editingId ? 'Edit Check-Out' : 'New Check-Out'}
                      </span>
                    </div>

                    <div className="relative checkin-dropdown mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Active Check-In *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search by guest name, room number, or check-in number..."
                          value={checkInSearch}
                          onChange={(e) => {
                            if (editingId) return
                            setCheckInSearch(e.target.value)
                            setShowCheckInDropdown(true)
                          }}
                          onFocus={() => {
                            if (!editingId) setShowCheckInDropdown(true)
                          }}
                          readOnly={Boolean(editingId)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10 bg-white read-only:bg-slate-50 read-only:text-slate-600"
                          required
                        />
                        <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>

                      {!editingId && showCheckInDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                          {filteredCheckIns.length > 0 ? (
                            <>
                              <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                                {filteredCheckIns.length} active check-in(s) found
                              </div>
                              {filteredCheckIns.map(checkIn => (
                                <div
                                  key={checkIn.id}
                                  onClick={() => handleCheckInDropdownSelect(checkIn)}
                                  className="px-4 py-3 hover:bg-red-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                >
                                  <div className="font-medium text-gray-900">
                                    {checkIn.checkInNumber || `CHK-${checkIn.id}`}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {checkIn.guest?.fullName || checkIn.guestName || 'Guest'} • Room {checkIn.room?.roomNumber || checkIn.roomNumber || 'N/A'}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Check-in: {checkIn.checkInDate ? new Date(checkIn.checkInDate).toLocaleDateString() : 'N/A'} • Rate: Rs {checkIn.roomRate || checkIn.totalAmount || '0'}
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : checkInSearch ? (
                            <div className="px-4 py-3 text-gray-500 text-center">
                              No active check-ins found matching "{checkInSearch}"
                            </div>
                          ) : (
                            <div className="px-4 py-3 text-gray-500 text-center">
                              Type to search active check-ins...
                            </div>
                          )}
                          <div
                            onClick={() => {
                              setCheckInSearch('')
                              setSelectedCheckIn(null)
                              setShowCheckInDropdown(false)
                              setFormData(prev => ({ ...prev, checkInId: '' }))
                            }}
                            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer border-t"
                          >
                            Clear Selection
                          </div>
                        </div>
                      )}
                      {editingId && (
                        <p className="mt-2 text-xs text-slate-500">Guest/check-in selection is locked while editing because this checkout is already saved.</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      <div className="flex justify-between gap-4 border-b border-slate-100 pb-2"><span className="font-semibold text-slate-700">Guest Name:</span><span className="text-slate-600 text-right">{guestName}</span></div>
                      <div className="flex justify-between gap-4 border-b border-slate-100 pb-2"><span className="font-semibold text-slate-700">Reservation #:</span><span className="text-slate-600 text-right">{reservationNumber}</span></div>
                      <div className="flex justify-between gap-4 border-b border-slate-100 pb-2"><span className="font-semibold text-slate-700">Room:</span><span className="text-slate-600 text-right">{roomNumber} / {roomType}</span></div>
                      <div className="flex justify-between gap-4 border-b border-slate-100 pb-2"><span className="font-semibold text-slate-700">Contact:</span><span className="text-slate-600 text-right">{guestPhone}</span></div>
                      <div className="flex justify-between gap-4 border-b border-slate-100 pb-2"><span className="font-semibold text-slate-700">Check-In:</span><span className="text-slate-600 text-right">{formatDateTime(selectedCheckInDetails?.checkInDate)}</span></div>
                      <div className="flex justify-between gap-4 border-b border-slate-100 pb-2"><span className="font-semibold text-slate-700">Check-Out:</span><span className="text-slate-600 text-right">{formatDate(formData.checkOutDate)}</span></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700 mb-4">Billing & Charges</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Room Charges (Rs.) *</label>
                        <input type="number" name="roomCharges" value={formData.roomCharges} onChange={handleChange} step="0.01" min="0" required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Charges (Rs.)</label>
                        <input type="number" name="serviceCharges" value={formData.serviceCharges} onChange={handleChange} step="0.01" min="0" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tax Amount (Rs.)</label>
                        <input type="number" name="taxAmount" value={formData.taxAmount} onChange={handleChange} step="0.01" min="0" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Check-Out Date *</label>
                        <input type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
                          <input type="checkbox" name="lateCheckOut" checked={formData.lateCheckOut} onChange={handleChange} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                          Late Check-Out
                        </label>
                        {formData.lateCheckOut && (
                          <div className="w-full md:w-72">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Late Check-Out Charges (Rs.)</label>
                            <input type="number" name="lateCheckOutCharges" value={formData.lateCheckOutCharges} onChange={handleChange} step="0.01" min="0" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {chargeItems.map(item => (
                        <div key={item.label} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 bg-white">
                          <span className="text-sm text-slate-600">{item.label}</span>
                          <span className={`text-sm font-semibold ${item.value < 0 ? 'text-red-600' : 'text-slate-900'}`}>{formatCurrency(item.value)}</span>
                        </div>
                      ))}
                    </div>

                    {appliedAdjustments.length > 0 && (
                      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <h4 className="text-sm font-semibold text-slate-700 mb-3">Applied Adjustments</h4>
                        <div className="space-y-2">
                          {appliedAdjustments.map((item, index) => (
                            <div key={`${item.label}-${index}`} className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">{item.label}</span>
                              <span className={item.amount < 0 ? 'font-semibold text-red-600' : 'font-semibold text-emerald-600'}>{item.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(item.amount)).replace('Rs. ', 'Rs. ')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700 mb-4">Checkout Notes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent">
                          <option value="Cash">Cash</option>
                          <option value="Credit Card">Credit Card</option>
                          <option value="Debit Card">Debit Card</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="UPI">UPI</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                        <input type="text" name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} readOnly className="w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-700" />
                      </div>
                    </div>
                    <div className={`rounded-2xl border px-4 py-3 text-sm ${isPaymentBreakdownValid ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-300 bg-amber-50 text-amber-800'}`}>
                      {isPaymentBreakdownValid
                        ? `Split payment total matches the required payable amount of ${formatCurrency(requiredPayNow)}.`
                        : `Split payment total must equal ${formatCurrency(requiredPayNow)}. Current split total: ${formatCurrency(paymentLineTotal)}.`}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                      <textarea name="remarks" value={formData.remarks} onChange={handleChange} rows="4" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Any remarks or notes about the check-out..." />
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700 mb-4">Stay Summary</h3>
                    <ul className="space-y-3 text-sm text-slate-700">
                      <li className="flex items-start gap-3"><ClockIcon className="h-5 w-5 text-red-500 mt-0.5" /><span><span className="font-semibold">{stayNights}</span> Night{stayNights === 1 ? '' : 's'}</span></li>
                      <li className="flex items-start gap-3"><CurrencyDollarIcon className="h-5 w-5 text-red-500 mt-0.5" /><span>Rate: <span className="font-semibold">{formatCurrency(ratePerNight)}</span> / Night</span></li>
                      <li className="flex items-start gap-3"><BuildingOfficeIcon className="h-5 w-5 text-red-500 mt-0.5" /><span>Room Package: <span className="font-semibold">{roomType}</span></span></li>
                      <li className="flex items-start gap-3"><CheckCircleIcon className="h-5 w-5 text-red-500 mt-0.5" /><span>Status: <span className="font-semibold">{formData.paymentStatus}</span></span></li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCardIcon className="h-5 w-5 text-red-600" />
                      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">Payment Details</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                        <span className="text-sm text-slate-600">Total Amount</span>
                        <span className="text-lg font-bold text-slate-900">{formatCurrency(formData.totalBill)}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                        <span className="text-sm text-emerald-700">Deposit Paid</span>
                        <span className="text-lg font-bold text-emerald-700">{formatCurrency(formData.advancePaid)}</span>
                      </div>
                      <div className={`flex items-center justify-between rounded-xl px-4 py-3 border ${hasOutstandingBalance ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                        <span className={`text-sm ${hasOutstandingBalance ? 'text-red-700' : 'text-blue-700'}`}>Balance Due</span>
                        <span className={`text-2xl font-bold ${hasOutstandingBalance ? 'text-red-700' : 'text-blue-700'}`}>{formatCurrency(formData.balance)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Paid Now (Rs.)</label>
                        <input type="number" name="paidNow" value={formData.paidNow} onChange={handleChange} step="0.01" min="0" readOnly className="w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-700" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Paid (Rs.)</label>
                        <input type="number" name="totalPaid" value={formData.totalPaid} onChange={handleChange} step="0.01" min={parseFloat(formData.advancePaid) || 0} readOnly className="w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-700" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Bill (Rs.)</label>
                        <input type="number" name="totalBill" value={formData.totalBill} onChange={handleChange} step="0.01" min="0" readOnly className="w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-700" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Balance (Rs.)</label>
                        <input type="number" name="balance" value={formData.balance} onChange={handleChange} step="0.01" readOnly className="w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-700" />
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-800">Split Payments</h4>
                          <p className="text-xs text-slate-500 mt-1">Capture multiple payment methods for a single checkout.</p>
                        </div>
                        <button type="button" onClick={handleAddPaymentLine} className="inline-flex items-center gap-2 rounded-xl bg-slate-700 text-white px-3 py-2 text-sm font-medium hover:bg-slate-800">
                          <PlusIcon className="h-4 w-4" />
                          Add Payment
                        </button>
                      </div>

                      <div className="space-y-3">
                        {paymentLines.map((line, index) => (
                          <div key={line.id} className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1.2fr_auto] gap-3 items-end rounded-2xl border border-slate-200 bg-white p-4">
                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-2">Method {index + 1}</label>
                              <select value={line.method} onChange={(e) => handlePaymentLineChange(line.id, 'method', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent">
                                <option value="Cash">Cash</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="Debit Card">Debit Card</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="UPI">UPI</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-2">Amount</label>
                              <input type="number" min="0" step="0.01" value={line.amount} onChange={(e) => handlePaymentLineChange(line.id, 'amount', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="0.00" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-2">Reference / Note</label>
                              <input type="text" value={line.reference} onChange={(e) => handlePaymentLineChange(line.id, 'reference', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Card last 4 / transaction ref" />
                            </div>
                            <button type="button" onClick={() => handleRemovePaymentLine(line.id)} className="px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <DocumentTextIcon className="h-5 w-5 text-red-600" />
                      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">Invoice & Folio</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => {
                        showDocumentAction('Invoice preview')
                        if (formData.checkInId) setShowInvoicePreview(true)
                      }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
                        <DocumentTextIcon className="h-4 w-4" />
                        Preview Invoice
                      </button>
                      <button type="button" onClick={() => {
                        showDocumentAction('Invoice print')
                        if (formData.checkInId) handleInvoicePrint()
                      }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
                        <ReceiptPercentIcon className="h-4 w-4" />
                        Print Invoice
                      </button>
                      <button type="button" onClick={handleEmailInvoice} disabled={invoiceSending} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50">
                        <CreditCardIcon className="h-4 w-4" />
                        {invoiceSending ? 'Sending...' : 'Email Invoice'}
                      </button>
                      <button type="button" onClick={() => showDocumentAction('Guest folio')} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
                        <DocumentTextIcon className="h-4 w-4" />
                        Guest Folio
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">Checkout Alerts</h3>
                    <div className={`rounded-xl border px-4 py-3 text-sm flex items-start gap-3 ${hasOutstandingBalance ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-emerald-300 bg-emerald-50 text-emerald-800'}`}>
                      <ExclamationTriangleIcon className="h-5 w-5 mt-0.5" />
                      <div>
                        {hasOutstandingBalance ? `Outstanding balance pending: ${formatCurrency(formData.balance)}` : 'Billing looks settled and ready to finalize.'}
                      </div>
                    </div>
                    {formData.lateCheckOut && (
                      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-3">
                        <ClockIcon className="h-5 w-5 mt-0.5" />
                        <div>Late check-out charges included: {formatCurrency(formData.lateCheckOutCharges)}</div>
                      </div>
                    )}
                    {drafts.length > 0 && (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                        <div className="font-semibold mb-2">Recent Drafts</div>
                        <div className="space-y-1">
                          {drafts.map(draft => (
                            <div key={draft.id} className="flex items-center justify-between gap-3">
                              <span>{draft.guestName} · Room {draft.roomNumber}</span>
                              <div className="flex items-center gap-2">
                                <button type="button" onClick={() => handleLoadDraft(draft)} className="text-xs font-semibold text-slate-700 hover:text-slate-900">Open</button>
                                <span className="text-xs text-slate-500">{formatDateTime(draft.savedAt)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-slate-200 pt-5 sticky bottom-0 bg-slate-100">
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => setShowChargeModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-slate-700 text-white px-4 py-2.5 text-sm font-medium hover:bg-slate-800">
                    <PlusIcon className="h-4 w-4" />
                    Add Charge
                  </button>
                  <button type="button" onClick={() => setShowDiscountModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-slate-700 text-white px-4 py-2.5 text-sm font-medium hover:bg-slate-800">
                    <ReceiptPercentIcon className="h-4 w-4" />
                    Apply Discount
                  </button>
                  <button type="button" onClick={handleSaveDraft} className="inline-flex items-center gap-2 rounded-xl bg-slate-700 text-white px-4 py-2.5 text-sm font-medium hover:bg-slate-800">
                    <DocumentTextIcon className="h-4 w-4" />
                    Save as Draft
                  </button>
                </div>
                <div className="flex flex-wrap justify-end gap-3">
                  <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading || !isPaymentBreakdownValid} className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                    {loading ? 'Processing...' : editingId ? 'Update Check-Out' : 'Finalize Checkout'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showChargeModal && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-5 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Add Extra Charge</h3>
            <input value={chargeForm.label} onChange={(e) => setChargeForm(prev => ({ ...prev, label: e.target.value }))} placeholder="Charge label" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl" />
            <input type="number" min="0" step="0.01" value={chargeForm.amount} onChange={(e) => setChargeForm(prev => ({ ...prev, amount: e.target.value }))} placeholder="Amount" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl" />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowChargeModal(false)} className="px-4 py-2 rounded-xl border border-slate-300">Cancel</button>
              <button type="button" onClick={handleAddCharge} className="px-4 py-2 rounded-xl bg-slate-800 text-white">Add Charge</button>
            </div>
          </div>
        </div>
      )}

      {showDiscountModal && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-5 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Apply Discount</h3>
            <input value={discountForm.label} onChange={(e) => setDiscountForm(prev => ({ ...prev, label: e.target.value }))} placeholder="Discount reason" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl" />
            <input type="number" min="0" step="0.01" value={discountForm.amount} onChange={(e) => setDiscountForm(prev => ({ ...prev, amount: e.target.value }))} placeholder="Discount amount" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl" />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowDiscountModal(false)} className="px-4 py-2 rounded-xl border border-slate-300">Cancel</button>
              <button type="button" onClick={handleApplyDiscount} className="px-4 py-2 rounded-xl bg-slate-800 text-white">Apply Discount</button>
            </div>
          </div>
        </div>
      )}

      {showInvoicePreview && (
        <div className="fixed inset-0 z-[70] bg-slate-950/70 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="w-full max-w-5xl bg-white rounded-[28px] shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white sticky top-0">
              <div>
                <h3 className="text-xl font-bold">Invoice Preview</h3>
                <p className="text-sm text-slate-300 mt-1">Printable folio and payment summary for this checkout.</p>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={handleDownloadPdf} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium">Download PDF</button>
                <button type="button" onClick={handleInvoicePrint} className="px-4 py-2 rounded-xl bg-white text-slate-900 font-medium">Print</button>
                <button type="button" onClick={() => setShowInvoicePreview(false)} className="p-2 rounded-full hover:bg-white/10">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 bg-slate-100">
              <div id="checkout-invoice-print-area" className="bg-white rounded-[24px] border border-slate-200 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 pb-6 border-b border-slate-200">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{hotelName}</div>
                    <div className="text-sm text-slate-500 mt-2">Front Office Check-Out Invoice</div>
                    <div className="text-sm text-slate-500 mt-1">Reservation #{reservationNumber}</div>
                  </div>
                  <div className="text-sm text-slate-600 space-y-1 md:text-right">
                    <div><span className="font-semibold text-slate-800">Invoice Date:</span> {formatDateTime(new Date().toISOString())}</div>
                    <div><span className="font-semibold text-slate-800">Guest:</span> {guestName}</div>
                    <div><span className="font-semibold text-slate-800">Room:</span> {roomNumber} / {roomType}</div>
                    <div><span className="font-semibold text-slate-800">Contact:</span> {guestPhone}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
                  <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50">
                    <h4 className="text-sm font-bold uppercase tracking-wide text-slate-700 mb-3">Stay Details</h4>
                    <div className="space-y-2 text-sm text-slate-700">
                      <div className="flex justify-between gap-4"><span>Check-In</span><span className="font-semibold">{formatDateTime(selectedCheckInDetails?.checkInDate)}</span></div>
                      <div className="flex justify-between gap-4"><span>Check-Out</span><span className="font-semibold">{formatDate(formData.checkOutDate)}</span></div>
                      <div className="flex justify-between gap-4"><span>Nights</span><span className="font-semibold">{stayNights}</span></div>
                      <div className="flex justify-between gap-4"><span>Rate / Night</span><span className="font-semibold">{formatCurrency(ratePerNight)}</span></div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50">
                    <h4 className="text-sm font-bold uppercase tracking-wide text-slate-700 mb-3">Payment Overview</h4>
                    <div className="space-y-2 text-sm text-slate-700">
                      <div className="flex justify-between gap-4"><span>Total Bill</span><span className="font-semibold">{formatCurrency(formData.totalBill)}</span></div>
                      <div className="flex justify-between gap-4"><span>Advance Paid</span><span className="font-semibold">{formatCurrency(formData.advancePaid)}</span></div>
                      <div className="flex justify-between gap-4"><span>Paid Now</span><span className="font-semibold">{formatCurrency(formData.paidNow)}</span></div>
                      <div className="flex justify-between gap-4"><span>Balance</span><span className={`font-semibold ${hasOutstandingBalance ? 'text-red-600' : 'text-emerald-600'}`}>{formatCurrency(formData.balance)}</span></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100 text-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Description</th>
                        <th className="px-4 py-3 text-right font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chargeItems.map(item => (
                        <tr key={item.label} className="border-t border-slate-200">
                          <td className="px-4 py-3">{item.label}</td>
                          <td className="px-4 py-3 text-right font-semibold">{formatCurrency(item.value)}</td>
                        </tr>
                      ))}
                      {appliedAdjustments.map((item, index) => (
                        <tr key={`${item.label}-${index}`} className="border-t border-slate-200">
                          <td className="px-4 py-3">{item.label}</td>
                          <td className={`px-4 py-3 text-right font-semibold ${item.amount < 0 ? 'text-red-600' : 'text-emerald-600'}`}>{item.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(item.amount)).replace('Rs. ', 'Rs. ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 p-5 bg-slate-50">
                  <h4 className="text-sm font-bold uppercase tracking-wide text-slate-700 mb-3">Payment Breakdown</h4>
                  <div className="space-y-3">
                    {completedPaymentLines.length > 0 ? completedPaymentLines.map(line => (
                      <div key={line.id} className="flex items-center justify-between gap-4 text-sm text-slate-700">
                        <div>
                          <div className="font-semibold text-slate-800">{line.method}</div>
                          <div className="text-xs text-slate-500">{line.reference || 'No reference provided'}</div>
                        </div>
                        <div className="font-semibold">{formatCurrency(line.amount)}</div>
                      </div>
                    )) : (
                      <div className="text-sm text-slate-500">No payment entries added.</div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <div className="w-full max-w-sm rounded-2xl bg-slate-900 text-white p-5">
                    <div className="flex items-center justify-between text-sm text-slate-300"><span>Total Paid</span><span>{formatCurrency(formData.totalPaid)}</span></div>
                    <div className="flex items-center justify-between text-2xl font-bold mt-3"><span>Balance Due</span><span>{formatCurrency(formData.balance)}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

{/* Check-Outs List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Check-Outs ({filteredCheckOuts.length})
          </h2>
          <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 self-start">
            <button
              type="button"
              onClick={() => setCheckOutViewMode('list')}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${checkOutViewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Bars3BottomLeftIcon className="h-4 w-4" />
              List View
            </button>
            <button
              type="button"
              onClick={() => setCheckOutViewMode('grid')}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${checkOutViewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Squares2X2Icon className="h-4 w-4" />
              Grid View
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading check-outs...</p>
          </div>
        ) : filteredCheckOuts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <ArrowRightOnRectangleIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No check-outs found</p>
          </div>
        ) : checkOutViewMode === 'list' ? (
          <div className="overflow-x-auto bg-slate-50">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Check-Out</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Guest & Room</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Amounts</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredCheckOuts.map((checkOut) => (
                  <tr key={checkOut.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 align-top">
                      <div className="font-bold text-slate-900">{checkOut.checkOutNumber}</div>
                      <div className="text-sm text-slate-500 mt-1">{new Date(checkOut.checkOutDate).toLocaleDateString()}</div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {checkOut.lateCheckOut && (
                          <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                            Late Check-Out
                          </span>
                        )}
                        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                          checkOut.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : checkOut.paymentStatus === 'Partial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {checkOut.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="font-semibold text-slate-900">{checkOut.checkIn?.guest?.fullName || 'N/A'}</div>
                      <div className="text-sm text-slate-600 mt-1">Room {checkOut.checkIn?.room?.roomNumber || 'N/A'}</div>
                      <div className="text-sm text-slate-500">{checkOut.checkIn?.room?.roomType?.name || 'Room details unavailable'}</div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="font-semibold text-slate-900">{checkOut.paymentMethod || 'N/A'}</div>
                      <div className="text-sm text-slate-500 mt-1">Checked out by {checkOut.checkedOutBy || 'Reception Staff'}</div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between gap-6"><span className="text-slate-500">Bill</span><span className="font-semibold text-slate-900">{formatCurrency(checkOut.totalBill)}</span></div>
                        <div className="flex items-center justify-between gap-6"><span className="text-slate-500">Paid</span><span className="font-semibold text-emerald-700">{formatCurrency(checkOut.totalPaid)}</span></div>
                        <div className="flex items-center justify-between gap-6"><span className="text-slate-500">Balance</span><span className={`font-semibold ${(parseFloat(checkOut.balance) || 0) > 0 ? 'text-red-700' : 'text-blue-700'}`}>{formatCurrency(checkOut.balance)}</span></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(checkOut)}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(checkOut.id)}
                          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-5 bg-slate-50">
            {filteredCheckOuts.map((checkOut) => (
              <div key={checkOut.id} className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 px-5 py-4 text-white flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-bold">{checkOut.checkOutNumber}</div>
                    <div className="text-sm text-slate-300 mt-1">{new Date(checkOut.checkOutDate).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {checkOut.lateCheckOut && (
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                        Late Check-Out
                      </span>
                    )}
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      checkOut.paymentStatus === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : checkOut.paymentStatus === 'Partial'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {checkOut.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">Guest & Room</div>
                      <div className="text-base font-bold text-slate-800">{checkOut.checkIn?.guest?.fullName || 'N/A'}</div>
                      <div className="text-sm text-slate-500 mt-1">Room {checkOut.checkIn?.room?.roomNumber || 'N/A'}</div>
                      <div className="text-sm text-slate-500">{checkOut.checkIn?.room?.roomType?.name || 'Room details unavailable'}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">Payment Method</div>
                      <div className="text-base font-bold text-slate-800">{checkOut.paymentMethod || 'N/A'}</div>
                      <div className="text-sm text-slate-500 mt-1">Checked out by {checkOut.checkedOutBy || 'Reception Staff'}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">Total Bill</div>
                      <div className="text-2xl font-bold text-slate-900">{formatCurrency(checkOut.totalBill)}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">Total Paid</div>
                      <div className="text-2xl font-bold text-emerald-700">{formatCurrency(checkOut.totalPaid)}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">Balance</div>
                      <div className={`text-2xl font-bold ${(parseFloat(checkOut.balance) || 0) > 0 ? 'text-red-700' : 'text-blue-700'}`}>{formatCurrency(checkOut.balance)}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => handleEdit(checkOut)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <PencilIcon className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(checkOut.id)}
                      className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckOut;
