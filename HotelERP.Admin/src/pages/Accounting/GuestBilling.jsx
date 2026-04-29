import { useState, useEffect } from 'react'
import axios from '../../utils/axios'
import jsPDF from 'jspdf'
import { getImageUrl } from '../../config/api'
import {
  CurrencyDollarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  PrinterIcon,
  DocumentTextIcon,
  UserIcon,
  BuildingOfficeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

const GuestBilling = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [hotelInfo, setHotelInfo] = useState(null)
  
  // Searchable dropdown states
  const [guestSearch, setGuestSearch] = useState('')
  const [showGuestDropdown, setShowGuestDropdown] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [checkInSearch, setCheckInSearch] = useState('')
  const [showCheckInDropdown, setShowCheckInDropdown] = useState(false)
  const [selectedCheckIn, setSelectedCheckIn] = useState(null)
  
  // Data states
  const [activeCheckIns, setActiveCheckIns] = useState([])
  const [guests, setGuests] = useState([])
  
  const [formData, setFormData] = useState({
    billNumber: '',
    checkInId: '',
    checkOutId: '',
    reservationId: '',
    guestId: '',
    guestName: '',
    roomNumber: '',
    checkInDate: '',
    checkOutDate: '',
    roomCharges: '',
    restaurantCharges: '',
    laundryCharges: '',
    otherCharges: '',
    discount: '',
    taxRate: '0',
    taxAmount: '',
    paymentMethod: 'Cash',
    status: 'Pending',
    recordType: '', // 'checkin' or 'checkout'
    isActive: true
  })

  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [billToDelete, setBillToDelete] = useState(null)

  // Load bills on component mount
  useEffect(() => {
    console.log('🚀 Guest Billing component mounted - DYNAMIC VERSION, loading data...')
    console.log('🔍 Current timestamp:', new Date().toISOString())
    
    const loadData = async () => {
      setLoading(true)
      if (!window.guestBillingLoadingLogged) {
        console.log('⏳ Loading state set to true')
        window.guestBillingLoadingLogged = true
      }
      
      try {
        await Promise.all([
          fetchBills(),
          fetchActiveCheckIns(),
          fetchGuests(),
          fetchHotelInfo()
        ])
        if (!window.guestBillingCompletedLogged) {
          console.log('✅ All data loading completed')
          window.guestBillingCompletedLogged = true
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
        if (!window.guestBillingLoadingLogged) {
          console.log('✅ Loading state set to false')
        }
      }
    }
    
    loadData()
  }, [])

  const fetchHotelInfo = async () => {
    try {
      const response = await axios.get('/Hotels?page=1&pageSize=1')
      if (response.data?.success) {
        const firstHotel = (response.data.data || [])[0] || null
        setHotelInfo(firstHotel)
      }
    } catch (err) {
      console.error('Error fetching hotel info for invoice:', err)
      setHotelInfo(null)
    }
  }

  const loadImageAsDataUrl = async (url) => {
    if (!url) return null
    try {
      const response = await fetch(url, { mode: 'cors' })
      if (!response.ok) return null
      const blob = await response.blob()
      return await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = () => resolve(null)
        reader.readAsDataURL(blob)
      })
    } catch (err) {
      console.error('Error loading logo image:', err)
      return null
    }
  }

  // Fetch guest records from multiple sources (Reservations, Check-ins, Check-outs)
  const fetchActiveCheckIns = async () => {
    try {
      
      // ✅ Fetch from multiple sources for comprehensive guest billing
      const [reservationsResponse, checkInsResponse, checkOutsResponse] = await Promise.all([
        axios.get('/reservations'),
        axios.get('/checkins'), 
        axios.get('/checkouts')
      ])
      
      let allRecords = []
      
      // Add reservations
      if (reservationsResponse.data.success) {
        const reservationRecords = reservationsResponse.data.data.map(reservation => ({
          ...reservation,
          recordType: 'Reservation',
          checkInNumber: reservation.reservationNumber,
          totalAmount: reservation.totalAmount || 0,
          roomRate: reservation.totalAmount || 0,
          totalPaid: reservation.totalPaid || 0
        }))
        allRecords = [...allRecords, ...reservationRecords]
        console.log(`✅ Loaded ${reservationRecords.length} reservations`)
      }
      
      // Add check-ins
      if (checkInsResponse.data.success) {
        const checkInRecords = checkInsResponse.data.data.map(checkIn => ({
          ...checkIn,
          recordType: 'Check-In',
          totalAmount: checkIn.totalAmount || checkIn.roomRate || 0,
          totalPaid: checkIn.advancePaid || 0
        }))
        allRecords = [...allRecords, ...checkInRecords]
        console.log(`✅ Loaded ${checkInRecords.length} check-ins`)
      }
      
      // Add check-outs
      if (checkOutsResponse.data.success) {
        const checkOutRecords = checkOutsResponse.data.data.map(checkOut => ({
          ...checkOut,
          recordType: 'Check-Out',
          checkInNumber: checkOut.checkInNumber || `CHK-${checkOut.checkInId}`,
          totalAmount: checkOut.totalBill || checkOut.roomCharges || 0,
          totalPaid: checkOut.totalPaid || checkOut.totalBill || 0
        }))
        allRecords = [...allRecords, ...checkOutRecords]
        console.log(`✅ Loaded ${checkOutRecords.length} check-outs`)
      }
      
      // Set all records for comprehensive guest billing
      setActiveCheckIns(allRecords)
      
      console.log(`📋 Total guest records available for billing: ${allRecords.length}`)
      
    } catch (err) {
      console.error('Error fetching guest records:', err)
      setActiveCheckIns([])
      console.log('Unable to load guest records from API')
    }
  }

  // Fetch guests
  const fetchGuests = async () => {
    try {
      const response = await axios.get('/guests')
      if (response.data.success) {
        setGuests(response.data.data || [])
        console.log(`✅ Loaded ${response.data.data?.length || 0} guests from API`)
      } else {
        console.log('Guests API returned unsuccessful response')
        setGuests([])
      }
    } catch (err) {
      console.error('Error fetching guests:', err)
      setGuests([])
      console.log('Unable to load guests from API')
    }
  }

  // Fetch bills from API
  const fetchBills = async () => {
    console.log('🔄 DYNAMIC VERSION: Attempting to fetch bills from /GuestBills API...')
    try {
      const response = await axios.get('/GuestBills')
      console.log('📡 API Response received:', response)
      if (response.data.success) {
        setBills(response.data.data || [])
        console.log(`✅ DYNAMIC VERSION: Loaded ${response.data.data?.length || 0} bills from API`)
        console.log('📋 Bills data:', response.data.data)
      } else {
        console.log('❌ API returned unsuccessful response')
        setBills([])
        setError('No bills data available at this time')
      }
    } catch (err) {
      console.error('❌ DYNAMIC VERSION: Error fetching bills:', err)
      console.log('🔍 Error details:', err.message, err.response?.status)
      setBills([])
      setError('Unable to load bills. Please check API connection.')
    }
  }

  // Filter guests based on search
  const filteredGuests = guests.filter(guest => {
    const searchLower = guestSearch.toLowerCase()
    return (
      guest.fullName?.toLowerCase().includes(searchLower) ||
      guest.firstName?.toLowerCase().includes(searchLower) ||
      guest.lastName?.toLowerCase().includes(searchLower) ||
      guest.phone?.toLowerCase().includes(searchLower) ||
      guest.guestId?.toLowerCase().includes(searchLower)
    )
  })

  // Filter guest records based on search (Reservations, Check-ins, Check-outs)
  const filteredCheckIns = activeCheckIns.filter(record => {
    const searchLower = checkInSearch.toLowerCase()
    return (
      record.guest?.fullName?.toLowerCase().includes(searchLower) ||
      record.guestName?.toLowerCase().includes(searchLower) ||
      record.room?.roomNumber?.toLowerCase().includes(searchLower) ||
      record.roomNumber?.toLowerCase().includes(searchLower) ||
      record.checkInNumber?.toLowerCase().includes(searchLower) ||
      record.reservationNumber?.toLowerCase().includes(searchLower) ||
      record.guest?.phone?.toLowerCase().includes(searchLower) ||
      record.guest?.phoneNumber?.toLowerCase().includes(searchLower) ||
      record.recordType?.toLowerCase().includes(searchLower)
    )
  })

  // Handle guest selection
  const handleGuestSelect = (guest) => {
    console.log('👤 Selected guest for billing:', guest)
    setSelectedGuest(guest)
    setGuestSearch(`${guest.fullName} - ${guest.phone || 'No phone'} - ${guest.guestId}`)
    setShowGuestDropdown(false)
    
    setFormData(prev => ({
      ...prev,
      guestId: guest.id,
      guestName: guest.fullName
    }))
  }

  // Handle guest record selection (Reservations, Check-ins, Check-outs)
  const handleCheckInSelect = (record) => {
    console.log('🏨 Selected record for billing:', record)
    console.log('🔍 Record details:', {
      guestName: record.guest?.fullName || record.guestName,
      roomNumber: record.room?.roomNumber || record.roomNumber,
      recordType: record.recordType,
      totalAmount: record.totalAmount || record.roomRate
    })
    
    setSelectedCheckIn(record)
    
    // ✅ Fix: Create proper display name based on record type and available data
    const guestName = record.guest?.fullName || record.guestName || 'Unknown Guest'
    const roomNumber = record.room?.roomNumber || record.roomNumber || 'N/A'
    const recordNumber = record.checkInNumber || record.reservationNumber || `${record.recordType}-${record.id}`
    
    const displayText = `${guestName} - Room ${roomNumber} - ${recordNumber} (${record.recordType})`
    console.log('📝 Setting display text:', displayText)
    
    setCheckInSearch(displayText)
    setShowCheckInDropdown(false)
    
    // ✅ Auto-populate form fields based on record type
    if (record.recordType === 'Check-In') {
      setFormData(prev => ({
        ...prev,
        checkInId: record.id,
        checkOutId: '',
        reservationId: record.reservationId || '',
        guestId: record.guestId,
        guestName: guestName,
        roomNumber: roomNumber,
        checkInDate: record.checkInDate?.split('T')[0] || '',
        checkOutDate: record.expectedCheckOutDate?.split('T')[0] || '',
        roomCharges: record.roomRate || record.totalAmount || '',
        recordType: 'Check-In'
      }))
    } else if (record.recordType === 'Check-Out') {
      setFormData(prev => ({
        ...prev,
        checkInId: record.checkInId || '',
        checkOutId: record.id,
        reservationId: record.reservationId || '',
        guestId: record.guestId,
        guestName: guestName,
        roomNumber: roomNumber,
        checkInDate: record.checkInDate?.split('T')[0] || '',
        checkOutDate: record.checkOutDate?.split('T')[0] || '',
        roomCharges: record.roomCharges || record.totalBill || record.totalAmount || '',
        restaurantCharges: record.restaurantCharges || '',
        recordType: 'Check-Out'
      }))
    } else if (record.recordType === 'Reservation') {
      setFormData(prev => ({
        ...prev,
        checkInId: '',
        checkOutId: '',
        reservationId: record.id,
        guestId: record.guestId,
        guestName: guestName,
        roomNumber: roomNumber,
        checkInDate: record.checkInDate?.split('T')[0] || '',
        checkOutDate: record.checkOutDate?.split('T')[0] || '',
        roomCharges: record.totalAmount || record.roomRate || '',
        recordType: 'Reservation'
      }))
    }

    // Also update guest search to match
    if (record.guest) {
      setSelectedGuest(record.guest)
      setGuestSearch(`${guestName} - ${record.guest.phone || 'No phone'} - ${record.guest.guestId || record.guestId}`)
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showGuestDropdown && !event.target.closest('.guest-dropdown')) {
        setShowGuestDropdown(false)
      }
      if (showCheckInDropdown && !event.target.closest('.checkin-dropdown')) {
        setShowCheckInDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showGuestDropdown, showCheckInDropdown])

  const [errors, setErrors] = useState({})

  const calculateBill = () => {
    const roomCharges = parseFloat(formData.roomCharges) || 0
    const restaurantCharges = parseFloat(formData.restaurantCharges) || 0
    const laundryCharges = parseFloat(formData.laundryCharges) || 0
    const otherCharges = parseFloat(formData.otherCharges) || 0
    const discount = parseFloat(formData.discount) || 0
    const taxAmount = parseFloat(formData.taxAmount) || 0

    const subtotal = roomCharges + restaurantCharges + laundryCharges + otherCharges
    const discountedAmount = subtotal - discount
    const totalAmount = discountedAmount + taxAmount

    return { subtotal, taxAmount, totalAmount }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.guestName.trim()) newErrors.guestName = 'Guest name is required'
    if (!formData.roomNumber.trim()) newErrors.roomNumber = 'Room number is required'
    if (!formData.checkInDate) newErrors.checkInDate = 'Check-in date is required'
    if (!formData.checkOutDate) newErrors.checkOutDate = 'Check-out date is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const { subtotal, taxAmount, totalAmount } = calculateBill()
      
      // ✅ Use GuestBills table structure as provided
      const billData = {
        checkInId: formData.checkInId || null,
        checkOutId: formData.checkOutId || null,
        reservationId: formData.reservationId || null,
        guestId: formData.guestId,
        guestName: formData.guestName,
        roomNumber: formData.roomNumber,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        roomCharges: parseFloat(formData.roomCharges) || 0,
        restaurantCharges: parseFloat(formData.restaurantCharges) || 0,
        laundryCharges: parseFloat(formData.laundryCharges) || 0,
        otherCharges: parseFloat(formData.otherCharges) || 0,
        discount: parseFloat(formData.discount) || 0,
        taxRate: 0,
        subtotal,
        taxAmount,
        totalAmount,
        paymentMethod: formData.paymentMethod,
        status: formData.status,
        recordType: formData.recordType,
        billDate: new Date().toISOString().split('T')[0],
        // Additional GuestBills table fields (BillNumber is computed column, CreatedAt and IsActive have defaults)
        // billNumber: computed column in database
        // createdAt: has default value
        // isActive: has default value
      }

      let response
      if (editingId) {
        // Update existing bill
        response = await axios.put(`/GuestBills/${editingId}`, billData)
      } else {
        // ✅ Create new bill - Admin generates bill and amount is inserted into GuestBills table
        response = await axios.post('/GuestBills', billData)
      }

      if (response.data.success) {
        setSuccess(editingId ? 'Bill updated successfully!' : 'Bill created successfully!')
        
        // Update payment status across all related records when bill is paid (optional, non-blocking)
        if (formData.status === 'Paid') {
          console.log('💰 Bill marked as paid, attempting to update related records...')
          
          // Update reservation payment status (optional)
          if (formData.reservationId) {
            axios.put(`/reservations/${formData.reservationId}`, {
              paymentStatus: 'Paid',
              status: 'Completed'
            }).then(() => console.log('✅ Updated reservation payment status'))
              .catch(err => console.log('⚠️ Could not update reservation payment status (optional)'))
          }
          
          // Update check-in payment status (optional)
          if (formData.checkInId) {
            axios.put(`/checkins/${formData.checkInId}/payment-status`, {
              paymentStatus: 'Paid',
              totalPaid: totalAmount,
              paymentMethod: formData.paymentMethod
            }).then(() => console.log('✅ Updated check-in payment status'))
              .catch(err => console.log('⚠️ Could not update check-in payment status (optional)'))
          }
          
          // Update check-out payment status (optional)
          if (formData.checkOutId) {
            axios.put(`/checkouts/${formData.checkOutId}/payment-status`, {
              paymentStatus: 'Paid',
              totalPaid: totalAmount,
              paymentMethod: formData.paymentMethod
            }).then(() => console.log('✅ Updated check-out payment status'))
              .catch(err => console.log('⚠️ Could not update check-out payment status (optional)'))
          }
        }

        // Refresh bills list
        await fetchBills()
        handleCancel()
      } else {
        setError('Failed to save bill. Please try again.')
      }
    } catch (error) {
      console.error('Error saving bill:', error)
      setError('Error saving bill. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Duplicate generatePDF and calculateBillFromData functions removed

  // Duplicate functions removed - using the ones declared earlier

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      billNumber: '',
      checkInId: '',
      checkOutId: '',
      reservationId: '',
      guestId: '',
      guestName: '',
      roomNumber: '',
      checkInDate: '',
      checkOutDate: '',
      roomCharges: '',
      restaurantCharges: '',
      laundryCharges: '',
      otherCharges: '',
      discount: '',
      taxRate: '0',
      taxAmount: '',
      paymentMethod: 'Cash',
      status: 'Pending',
      recordType: '',
      isActive: true
    })
    setSelectedCheckIn(null)
    setCheckInSearch('')
    setErrors({})
  }

  const handleEdit = (bill) => {
    setFormData({
      billNumber: bill.billNumber,
      guestName: bill.guestName,
      roomNumber: bill.roomNumber,
      checkInDate: bill.checkInDate,
      checkOutDate: bill.checkOutDate,
      roomCharges: bill.roomCharges.toString(),
      restaurantCharges: bill.restaurantCharges.toString(),
      laundryCharges: bill.laundryCharges.toString(),
      otherCharges: bill.otherCharges.toString(),
      discount: bill.discount.toString(),
      taxRate: '0',
      taxAmount: (bill.taxAmount ?? 0).toString(),
      paymentMethod: bill.paymentMethod,
      status: bill.status,
      isActive: bill.isActive
    })
    setEditingId(bill.id)
    setShowForm(true)
  }

  // Show delete confirmation modal
  const handleDelete = (id) => {
    const bill = bills.find(b => b.id === id)
    setBillToDelete(bill)
    setShowDeleteModal(true)
  }

  // Confirm delete action
  const confirmDelete = async () => {
    if (!billToDelete) return
    
    const billInfo = `${billToDelete.billNumber} (${billToDelete.guestName})`
    
    try {
      setLoading(true)
      setShowDeleteModal(false)
      console.log(`🗑️ DYNAMIC VERSION: Deleting bill ID ${billToDelete.id}...`)
      
      const response = await axios.delete(`/GuestBills/${billToDelete.id}`)
      console.log('📡 Delete API Response:', response)
      
      if (response.data.success) {
        setSuccess(`Bill ${billInfo} deleted successfully!`)
        setError('')
        
        // Refresh the bills list to reflect the change
        await fetchBills()
        
        // Auto-clear success message after 5 seconds
        setTimeout(() => {
          setSuccess('')
        }, 5000)
        
        console.log(`✅ DYNAMIC VERSION: Bill ${billToDelete.id} deleted successfully`)
      } else {
        setError('Failed to delete bill. Please try again.')
        console.log('❌ Delete API returned unsuccessful response')
      }
    } catch (err) {
      console.error('❌ DYNAMIC VERSION: Error deleting bill:', err)
      console.log('🔍 Delete error details:', err.message, err.response?.status)
      setError(`Failed to delete bill: ${err.response?.data?.message || err.message}`)
    } finally {
      setLoading(false)
      setBillToDelete(null)
    }
  }

  // Cancel delete action
  const cancelDelete = () => {
    setShowDeleteModal(false)
    setBillToDelete(null)
  }

  const generatePDF = async (bill) => {
    const { subtotal, taxAmount, totalAmount } = calculateBillFromData(bill)

    const resolvedHotelInfo = {
      name: hotelInfo?.hotelName || hotelInfo?.HotelName || 'HOTEL ERP',
      address: hotelInfo?.address || hotelInfo?.Address || '',
      phone: hotelInfo?.phoneNumber || hotelInfo?.PhoneNumber || '',
      email: hotelInfo?.email || hotelInfo?.Email || '',
      website: hotelInfo?.website || hotelInfo?.Website || ''
    }

    const logoPath = hotelInfo?.logoPath || hotelInfo?.LogoPath || null
    const logoUrl = getImageUrl(logoPath)
    const logoDataUrl = await loadImageAsDataUrl(logoUrl)
    
    // Create new PDF document
    const doc = new jsPDF()

    // Add hotel logo (top-right)
    if (logoDataUrl) {
      try {
        doc.addImage(logoDataUrl, 'PNG', 165, 16, 30, 20)
      } catch (e) {
        // Some JPEG/PNG data urls may fail depending on format; ignore if it fails
      }
    }
    
    // Add hotel logo on the right side above address
    //doc.setFillColor(41, 128, 185) // Professional blue
    //doc.roundedRect(155, 45, 35, 18, 3, 3, 'F')
    
    // Hotel logo text - "ERP HOTEL" centered and bold
    //doc.setTextColor(255, 255, 255)
    //doc.setFontSize(9)
    //doc.setFont(undefined, 'bold')
    //doc.text('ERP', 172, 52, { align: 'center' })
    //doc.text('HOTEL', 172, 58, { align: 'center' })
    //doc.setTextColor(0, 0, 0) // Reset to black
    
    // Title (single line; shrink to avoid overlap with logo)
    const title = `${resolvedHotelInfo.name} GUEST BILL`
    doc.setFont(undefined, 'bold')

    // Leave space on the right side for the logo
    const titleMaxWidth = 140
    const titleY = 28

    let titleFontSize = 20
    doc.setFontSize(titleFontSize)
    while (titleFontSize > 10 && doc.getTextWidth(title) > titleMaxWidth) {
      titleFontSize -= 1
      doc.setFontSize(titleFontSize)
    }

    doc.text(title, 20, titleY)
    
    // Company/Hotel Information (Top Left, below title)
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    if (resolvedHotelInfo.address) doc.text(resolvedHotelInfo.address, 20, 55)
    if (resolvedHotelInfo.phone) doc.text(`Phone: ${resolvedHotelInfo.phone}`, 20, 62)
    if (resolvedHotelInfo.email) doc.text(`Email: ${resolvedHotelInfo.email}`, 20, 69)
    if (resolvedHotelInfo.website) doc.text(`Website: ${resolvedHotelInfo.website}`, 20, 76)
    
    // Bill Details (Top Right)
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text(`Bill Number: ${bill.billNumber || 'N/A'}`, 130, 55)
    
    // Format date as dd/mm/yyyy
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    }
    
    doc.text(`Date: ${formatDate(bill.billDate) || formatDate(new Date())}`, 130, 62)
    doc.text(`Time: ${new Date().toLocaleTimeString()}`, 130, 69)
    
    // Guest Information - Bill To (Left Side, Row-wise format)
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('BILL TO:', 20, 90)
    
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    
    // Row 1: Guest Name and Room Number
    doc.text(`Guest Name : ${bill.guestName || 'N/A'}`, 20, 100)
    doc.text(`Room No : ${bill.roomNumber || 'N/A'}`, 130, 100)
    
    // Row 2: Check-in and Check-out dates
    doc.text(`Check-In Date : ${formatDate(bill.checkInDate)}`, 20, 110)
    doc.text(`Check-Out Date : ${formatDate(bill.checkOutDate)}`, 130, 110)
    
    // Line separator
    doc.setDrawColor(200, 200, 200)
    doc.line(20, 120, 190, 120)
    
    // Charges Table Header
    let yPos = 135
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    doc.text('DESCRIPTION', 20, yPos)
    doc.text('AMOUNT (Rs)', 160, yPos, { align: 'right' })
    
    // Line under header
    doc.line(20, yPos + 3, 190, yPos + 3)
    
    yPos += 15
    doc.setFont(undefined, 'normal')
    
    // Charges breakdown
    const charges = [
      { name: 'Room Charges', amount: bill.roomCharges || 0 },
      { name: 'Restaurant Charges', amount: bill.restaurantCharges || 0 },
      { name: 'Laundry Charges', amount: bill.laundryCharges || 0 },
      { name: 'Other Charges', amount: bill.otherCharges || 0 }
    ]
    
    charges.forEach(charge => {
      if (charge.amount > 0) {
        doc.text(charge.name, 20, yPos)
        doc.text(charge.amount.toLocaleString(), 160, yPos, { align: 'right' })
        yPos += 8
      }
    })
    
    // Subtotal line
    yPos += 5
    doc.line(120, yPos, 190, yPos)
    yPos += 8
    
    doc.text('Subtotal:', 120, yPos)
    doc.text(subtotal.toLocaleString(), 160, yPos, { align: 'right' })
    yPos += 8
    
    // Discount if applicable
    if (bill.discount && bill.discount > 0) {
      doc.text('Discount:', 120, yPos)
      doc.text(`-${parseFloat(bill.discount).toLocaleString()}`, 160, yPos, { align: 'right' })
      yPos += 8
    }
    
    // Tax
    doc.text('Tax (Rs):', 120, yPos)
    doc.text(taxAmount.toLocaleString(), 160, yPos, { align: 'right' })
    yPos += 8
    
    // Total line
    doc.setDrawColor(0, 0, 0)
    doc.line(120, yPos, 190, yPos)
    yPos += 8
    
    // Total Amount - Fixed formatting to prevent text overlap
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text(`Total Amount: ${totalAmount.toFixed(2).toLocaleString()}`, 120, yPos)
    
    // Payment Information
    yPos += 20
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text(`Payment Method: ${bill.paymentMethod || 'N/A'}`, 20, yPos)
    doc.text(`Status: ${bill.status || 'N/A'}`, 20, yPos + 8)
    
    // Footer
    yPos += 25
    doc.setFontSize(9)
    doc.setFont(undefined, 'italic')
    doc.text('Thank you for staying with us!', 105, yPos, { align: 'center' })
    doc.text('We hope you enjoyed your stay and look forward to serving you again.', 105, yPos + 8, { align: 'center' })
    
    // Terms and conditions
    yPos += 20
    doc.setFontSize(8)
    doc.setFont(undefined, 'normal')
    doc.text('Terms & Conditions: All payments are non-refundable. | For queries, contact front desk.', 105, yPos, { align: 'center' })
    
    // Save the PDF
    const fileName = `Bill-${bill.billNumber || bill.id}-${bill.guestName || 'Guest'}.pdf`
    doc.save(fileName)
  }

  const calculateBillFromData = (bill) => {
    const roomCharges = parseFloat(bill.roomCharges) || 0
    const restaurantCharges = parseFloat(bill.restaurantCharges) || 0
    const laundryCharges = parseFloat(bill.laundryCharges) || 0
    const otherCharges = parseFloat(bill.otherCharges) || 0
    const discount = parseFloat(bill.discount) || 0
    const taxAmount = parseFloat(bill.taxAmount) || 0

    const subtotal = roomCharges + restaurantCharges + laundryCharges + otherCharges
    const discountedAmount = subtotal - discount
    const totalAmount = discountedAmount + taxAmount

    return { subtotal, taxAmount, totalAmount }
  }

  // All duplicate functions have been removed - using the original declarations

  const filteredBills = bills.filter(bill =>
    bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.roomNumber.includes(searchTerm)
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Overdue': return 'bg-red-100 text-red-800'
      case 'Cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const { subtotal, taxAmount, totalAmount } = calculateBill()

  // Show loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Guest Bill data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Guest Bill - DYNAMIC VERSION</h1>
            <p className="text-emerald-100">Manage guest billing for restaurant, room service, and accommodation charges</p>
            <p className="text-emerald-200 text-xs mt-1">Version: Dynamic API Integration - No Mock Data</p>
          </div>
          <CurrencyDollarIcon className="h-12 w-12 text-emerald-200" />
        </div>
      </div>

      {/* Error Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                API Connection Issue
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Success
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>{success}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-emerald-100 rounded-lg p-3">
              <DocumentTextIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bills</p>
              <p className="text-2xl font-bold text-gray-900">{bills.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paid Bills</p>
              <p className="text-2xl font-bold text-gray-900">
                {bills.filter(b => b.status === 'Paid').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {bills.filter(b => b.status === 'Pending').reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {bills.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search bills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Bill
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Guest Bill' : 'Create New Guest Bill'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Guest Record Selection */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                Select Guest Record
              </h3>
              <div className="relative checkin-dropdown">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Guest Records (Reservations, Check-ins, Check-outs)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by guest name, room number, reservation, phone number..."
                    value={checkInSearch}
                    onChange={(e) => {
                      setCheckInSearch(e.target.value)
                      setShowCheckInDropdown(true)
                    }}
                    onFocus={() => setShowCheckInDropdown(true)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                {/* Check-In Dropdown */}
                {showCheckInDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCheckIns.length > 0 ? (
                      <>
                        <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                          {filteredCheckIns.length} record(s) found
                        </div>
                        {filteredCheckIns.map(record => (
                          <div
                            key={`${record.recordType}-${record.id}`}
                            onClick={() => handleCheckInSelect(record)}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900 flex items-center">
                              {record.recordType === 'Check-Out' ? '🚪' : record.recordType === 'Check-In' ? '🏨' : '📋'} 
                              {record.guest?.fullName || record.guestName || 'Guest'} • Room {record.room?.roomNumber || record.roomNumber || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-600">
                              Check-out: {record.checkOutDate ? new Date(record.checkOutDate).toLocaleDateString() : 'N/A'} • 
                              Total Paid: Rs {(record.totalPaid || record.totalBill || 0).toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {record.recordType} • Bill: Rs {(record.totalAmount || record.roomRate || 0).toLocaleString()}
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
                      }}
                      className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer border-t"
                    >
                      Clear Selection
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center text-gray-500 text-sm">
              OR manually select guest and room details below
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Searchable Guest Selection */}
              <div className="relative guest-dropdown">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Guest Name <span className="text-red-500">*</span>
                  {selectedCheckIn && <span className="text-blue-600 text-xs ml-2">(From Check-In)</span>}
                </label>
                {selectedCheckIn ? (
                  <div className="w-full px-4 py-3 border border-blue-300 bg-blue-50 rounded-lg text-gray-700">
                    {selectedCheckIn.guest?.fullName || 'Guest Name'} 
                    <span className="text-sm text-gray-500 ml-2">({selectedCheckIn.guest?.phone || 'No phone'})</span>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by name, phone, or guest ID..."
                        value={guestSearch}
                        onChange={(e) => {
                          setGuestSearch(e.target.value)
                          setShowGuestDropdown(true)
                        }}
                        onFocus={() => setShowGuestDropdown(true)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10 ${
                          errors.guestName ? 'border-red-500' : 'border-gray-300'
                        }`}
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
                                className="px-4 py-3 hover:bg-emerald-50 cursor-pointer border-b border-gray-100 last:border-b-0"
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
                          }}
                          className="px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 cursor-pointer border-t"
                        >
                          Clear Selection
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Room Number <span className="text-red-500">*</span>
                  {selectedCheckIn && <span className="text-blue-600 text-xs ml-2">(From Check-In)</span>}
                </label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.roomNumber ? 'border-red-500' : 'border-gray-300'
                  } ${selectedCheckIn ? 'bg-blue-50 border-blue-300' : ''}`}
                  placeholder="205"
                  readOnly={selectedCheckIn}
                  required
                />
                {errors.roomNumber && <p className="mt-1 text-sm text-red-600">{errors.roomNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Room Charges (Rs)</label>
                <input
                  type="number"
                  value={formData.roomCharges}
                  onChange={(e) => setFormData({...formData, roomCharges: e.target.value})}
                  min="0"
                  step="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="25000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Restaurant Charges (Rs)</label>
                <input
                  type="number"
                  value={formData.restaurantCharges}
                  onChange={(e) => setFormData({...formData, restaurantCharges: e.target.value})}
                  min="0"
                  step="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="8500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tax Amount (Rs)</label>
                <input
                  type="number"
                  value={formData.taxAmount}
                  onChange={(e) => setFormData({ ...formData, taxAmount: e.target.value })}
                  min="0"
                  step="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            {/* Bill Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Bill Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Rs {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>Rs {(parseFloat(formData.discount) || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (Rs):</span>
                  <span>Rs {taxAmount.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount:</span>
                    <span className="text-emerald-600">Rs {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition-all duration-200 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    {editingId ? 'Update' : 'Create'} Bill
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bills List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Guest Bills ({filteredBills.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charges</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <DocumentTextIcon className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Bills Available</h3>
                      <p className="text-gray-500">
                        {searchTerm ? 
                          `No bills found matching "${searchTerm}"` : 
                          'No guest bills have been created yet. Click "Create Bill" to add the first bill.'
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{bill.billNumber}</div>
                      <div className="text-sm text-gray-500">{bill.billDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{bill.guestName}</div>
                      <div className="text-sm text-gray-500">Room {bill.roomNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div>Room: Rs {(bill.roomCharges || 0).toLocaleString()}</div>
                      <div>Restaurant: Rs {(bill.restaurantCharges || 0).toLocaleString()}</div>
                      <div>Other: Rs {((bill.laundryCharges || 0) + (bill.otherCharges || 0)).toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      Rs {(bill.totalAmount || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">{bill.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bill.status)}`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(bill)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={async () => await generatePDF(bill)}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50 transition-colors"
                        title="Download PDF"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                      >
                        <PrinterIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(bill.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && billToDelete && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
          onClick={cancelDelete}
        >
          <div 
            className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mt-3">
              {/* Header */}
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                <TrashIcon className="w-6 h-6 text-red-600" />
              </div>
              
              {/* Title */}
              <h3 className="text-lg font-medium text-gray-900 mt-5 text-center">
                Delete Guest Bill
              </h3>
              
              {/* Content */}
              <div className="mt-4 px-7 py-3">
                <p className="text-sm text-gray-500 text-center">
                  Are you sure you want to delete this bill? This action will mark the bill as inactive.
                </p>
                
                {/* Bill Details */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm">
                    <div className="flex justify-between py-1">
                      <span className="font-medium text-gray-700">Bill Number:</span>
                      <span className="text-gray-900">{billToDelete.billNumber}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium text-gray-700">Guest Name:</span>
                      <span className="text-gray-900">{billToDelete.guestName}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium text-gray-700">Room:</span>
                      <span className="text-gray-900">{billToDelete.roomNumber}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium text-gray-700">Total Amount:</span>
                      <span className="text-gray-900 font-semibold">Rs {(billToDelete.totalAmount || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 text-center mt-3">
                  This action cannot be undone, but the record will be preserved for audit purposes.
                </p>
              </div>
              
              {/* Buttons */}
              <div className="flex items-center justify-center px-4 py-3 space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? 'Deleting...' : 'Delete Bill'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


export default GuestBilling;
