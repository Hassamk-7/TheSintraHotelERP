import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  HomeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PhoneIcon,
  TruckIcon,
  UserIcon
} from '@heroicons/react/24/outline'

const RoomService = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedHotelId, setSelectedHotelId] = useState(() => {
    const v = localStorage.getItem('selectedHotelId')
    return v ? Number(v) : ''
  })
  const [hotels, setHotels] = useState([])
  const [rooms, setRooms] = useState([])
  const [selectedRoomId, setSelectedRoomId] = useState('')

  const [activeCheckIns, setActiveCheckIns] = useState([])
  const [guestSearchTerm, setGuestSearchTerm] = useState('')
  const [guestSearchResults, setGuestSearchResults] = useState([])
  const [selectedGuestSource, setSelectedGuestSource] = useState('')
  const [selectedGuestId, setSelectedGuestId] = useState(null)

  const [createWalkIn, setCreateWalkIn] = useState(false)
  
  const [formData, setFormData] = useState({
    orderNumber: '',
    roomNumber: '',
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    guestId: null,
    items: [],
    specialInstructions: '',
    deliveryTime: '',
    status: 'Received',
    priority: 'Normal',
    deliveryCharge: '200',
    assignedStaff: '',
    isActive: true
  })

  // API Data states with mock data
  const [roomServiceOrders, setRoomServiceOrders] = useState([
    {
      id: 1,
      orderNumber: 'RS-001',
      roomNumber: '205',
      guestName: 'Ahmed Hassan',
      guestPhone: '+92-300-1234567',
      items: [
        { name: 'Chicken Biryani', quantity: 2, price: 800, total: 1600 },
        { name: 'Fresh Juice', quantity: 2, price: 150, total: 300 }
      ],
      subtotal: 1900,
      deliveryCharge: 200,
      totalAmount: 2100,
      specialInstructions: 'Extra spicy, no onions',
      orderTime: '2024-01-15T19:30:00',
      deliveryTime: '2024-01-15T20:30:00',
      status: 'Delivered',
      priority: 'Normal',
      assignedStaff: 'Ali Raza',
      deliveredAt: '2024-01-15T20:25:00',
      isActive: true
    },
    {
      id: 2,
      orderNumber: 'RS-002',
      roomNumber: '301',
      guestName: 'Maria Khan',
      guestPhone: '+92-321-9876543',
      items: [
        { name: 'Club Sandwich', quantity: 1, price: 450, total: 450 },
        { name: 'French Fries', quantity: 1, price: 200, total: 200 },
        { name: 'Cold Coffee', quantity: 1, price: 180, total: 180 }
      ],
      subtotal: 830,
      deliveryCharge: 200,
      totalAmount: 1030,
      specialInstructions: 'No mayo in sandwich',
      orderTime: '2024-01-15T20:15:00',
      deliveryTime: '2024-01-15T21:00:00',
      status: 'In Progress',
      priority: 'High',
      assignedStaff: 'Fatima Ali',
      deliveredAt: null,
      isActive: true
    },
    {
      id: 3,
      orderNumber: 'RS-003',
      roomNumber: '102',
      guestName: 'Sara Ahmed',
      guestPhone: '+92-333-5555555',
      items: [
        { name: 'Karahi Chicken', quantity: 1, price: 650, total: 650 },
        { name: 'Naan', quantity: 4, price: 40, total: 160 },
        { name: 'Lassi', quantity: 2, price: 120, total: 240 }
      ],
      subtotal: 1050,
      deliveryCharge: 200,
      totalAmount: 1250,
      specialInstructions: 'Medium spice level',
      orderTime: '2024-01-15T18:45:00',
      deliveryTime: '2024-01-15T19:30:00',
      status: 'Received',
      priority: 'Normal',
      assignedStaff: '',
      deliveredAt: null,
      isActive: true
    }
  ])
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Chicken Biryani', price: 800, category: 'Main Course' },
    { id: 2, name: 'Club Sandwich', price: 450, category: 'Snacks' },
    { id: 3, name: 'Karahi Chicken', price: 650, category: 'Main Course' },
    { id: 4, name: 'French Fries', price: 200, category: 'Snacks' },
    { id: 5, name: 'Fresh Juice', price: 150, category: 'Beverages' },
    { id: 6, name: 'Cold Coffee', price: 180, category: 'Beverages' },
    { id: 7, name: 'Naan', price: 40, category: 'Bread' },
    { id: 8, name: 'Lassi', price: 120, category: 'Beverages' }
  ])
  const [staff, setStaff] = useState([
    { id: 1, name: 'Ali Raza', department: 'Room Service', status: 'Available' },
    { id: 2, name: 'Fatima Ali', department: 'Room Service', status: 'Busy' },
    { id: 3, name: 'Ahmed Khan', department: 'Room Service', status: 'Available' },
    { id: 4, name: 'Ayesha Sheikh', department: 'Room Service', status: 'Available' }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})

  // Load data on component mount
  useEffect(() => {
    fetchHotels()
  }, [])

  useEffect(() => {
    if (!selectedHotelId) return
    localStorage.setItem('selectedHotelId', String(selectedHotelId))
    fetchRoomServiceData()
    fetchRoomsByHotel()
    fetchActiveCheckIns()
  }, [selectedHotelId])

  useEffect(() => {
    if (!showForm) return
    if (!guestSearchTerm || guestSearchTerm.trim().length < 2) {
      setGuestSearchResults([])
      return
    }

    const t = setTimeout(async () => {
      try {
        const res = await axios.get(`/Guests/search?searchTerm=${encodeURIComponent(guestSearchTerm.trim())}`)
        if (res.data?.success) {
          setGuestSearchResults(res.data.data || [])
        } else {
          setGuestSearchResults([])
        }
      } catch (err) {
        console.error('Error searching guests:', err)
        setGuestSearchResults([])
      }
    }, 300)

    return () => clearTimeout(t)
  }, [guestSearchTerm, showForm])

  const fetchHotels = async () => {
    try {
      const res = await axios.get('/hotels?page=1&pageSize=200')
      if (res.data?.success) {
        setHotels(res.data.data || [])
        if (!selectedHotelId && res.data.data?.length) {
          setSelectedHotelId(res.data.data[0].id)
        }
      }
    } catch (err) {
      console.error('Error fetching hotels:', err)
    }
  }

  const fetchRoomsByHotel = async () => {
    try {
      if (!selectedHotelId) return
      const res = await axios.get(`/rooms?hotelId=${selectedHotelId}`)
      if (res.data?.success) {
        setRooms(res.data.data || [])
      }
    } catch (err) {
      console.error('Error fetching rooms:', err)
      setRooms([])
    }
  }

  const fetchActiveCheckIns = async () => {
    try {
      if (!selectedHotelId) return
      const res = await axios.get('/checkins/active')
      if (res.data?.success) {
        const all = res.data.data || []
        setActiveCheckIns(all)
      } else {
        setActiveCheckIns([])
      }
    } catch (err) {
      console.error('Error fetching active check-ins:', err)
      setActiveCheckIns([])
    }
  }

  const resetGuestSelection = () => {
    setSelectedGuestSource('')
    setSelectedGuestId(null)
    setSelectedRoomId('')
    setGuestSearchTerm('')
    setGuestSearchResults([])
    setCreateWalkIn(false)
  }

  const handleGuestSelect = (value) => {
    setSelectedGuestSource(value)
    setSelectedGuestId(null)
    setCreateWalkIn(false)

    if (!value) {
      setFormData(prev => ({
        ...prev,
        guestId: null,
        guestName: '',
        guestPhone: '',
        roomNumber: ''
      }))
      setSelectedRoomId('')
      return
    }

    const [source, rawId] = String(value).split(':')
    const id = rawId ? Number(rawId) : null

    if (source === 'new') {
      setCreateWalkIn(true)
      setFormData(prev => ({
        ...prev,
        guestId: null,
        guestName: '',
        guestPhone: '',
        guestEmail: ''
      }))
      setSelectedRoomId('')
      return
    }

    if (!id || Number.isNaN(id)) return
    setSelectedGuestId(id)

    if (source === 'checkin') {
      const ci = activeCheckIns.find(c => Number(c.id) === id)
      if (!ci) return

      const guestName = ci.guestName ?? ci.GuestName ?? ''
      const roomNumber = ci.roomNumber ?? ci.RoomNumber ?? ''

      setFormData(prev => ({
        ...prev,
        guestId: null,
        guestName,
        guestPhone: prev.guestPhone || '',
        roomNumber
      }))

      const resolvedRoom = rooms.find(r => String(r.roomNumber) === String(roomNumber))
      setSelectedRoomId(resolvedRoom?.id ? String(resolvedRoom.id) : '')
    }

    if (source === 'guest') {
      const g = guestSearchResults.find(x => Number(x.id) === id)
      if (!g) return
      setFormData(prev => ({
        ...prev,
        guestId: g.id,
        guestName: g.fullName || '',
        guestPhone: g.phoneNumber || '',
        roomNumber: ''
      }))
      setSelectedRoomId('')
    }
  }

  // Fetch room service data - PURE API CALLS
  const fetchRoomServiceData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [ordersRes, menuRes, staffRes] = await Promise.all([
        axios.get('/RestaurantBar/room-service'),
        axios.get('/RestaurantBar/menu-management'),
        axios.get('/PayrollHR/employees?department=Room Service')
      ])
      
      if (ordersRes.data?.success) setRoomServiceOrders(ordersRes.data.data)
      if (menuRes.data?.success) setMenuItems(menuRes.data.data)
      if (staffRes.data?.success) setStaff(staffRes.data.data)
      
    } catch (err) {
      console.error('Error fetching room service data:', err)
      setError('Failed to load room service data')
      setRoomServiceOrders([])
    } finally {
      setLoading(false)
    }
  }

  // Form validation
  const validateForm = () => {
    const newErrors = {}
    if (!formData.guestId && !formData.guestName.trim()) newErrors.guestName = 'Guest is required'
    if (!formData.guestPhone.trim()) newErrors.guestPhone = 'Guest phone is required'
    if (selectedGuestSource?.startsWith('checkin') && !formData.roomNumber.trim()) newErrors.roomNumber = 'Room number is required'
    if (!formData.items || formData.items.length === 0) newErrors.items = 'At least one item is required'
    if (!formData.deliveryTime) newErrors.deliveryTime = 'Delivery time is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Create/Update room service order - PURE API CALL
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)

      const resolvedRoom = rooms.find(r => String(r.roomNumber) === String(formData.roomNumber))
      const roomId = resolvedRoom?.id

      if (selectedGuestSource?.startsWith('checkin')) {
        if (!roomId) {
          setError('Invalid room number for selected hotel')
          setLoading(false)
          return
        }
      }

      // If user selected "Create new walk-in guest", create guest first.
      let resolvedGuestId = formData.guestId
      if (createWalkIn && !resolvedGuestId) {
        const guestRes = await axios.post('/guests', {
          fullName: formData.guestName,
          phoneNumber: formData.guestPhone,
          email: formData.guestEmail || null
        })

        const createdGuestId = guestRes.data?.data?.id
        if (!createdGuestId) {
          setError('Failed to create walk-in guest')
          setLoading(false)
          return
        }

        resolvedGuestId = createdGuestId
      }

      // 1) Create Restaurant Order
      const orderPayload = {
        hotelId: selectedHotelId ? Number(selectedHotelId) : null,
        roomId: selectedGuestSource?.startsWith('checkin') ? roomId : null,
        tableId: null,
        orderType: 'Room Service',
        guestId: resolvedGuestId ? Number(resolvedGuestId) : null,
        guestName: formData.guestName || '',
        guestPhone: formData.guestPhone || '',
        specialInstructions: formData.specialInstructions,
        subTotal: 0,
        taxAmount: 0,
        serviceCharge: 0,
        totalAmount: 0,
        status: 'Pending',
        paymentStatus: 'Pending'
      }

      const orderRes = await axios.post('/RestaurantBar/restaurant-orders', orderPayload)
      const createdOrderId = orderRes.data?.data?.id
      if (!createdOrderId) {
        setError('Failed to create restaurant order')
        setLoading(false)
        return
      }

      // 2) Create Order Items
      for (const i of formData.items) {
        await axios.post('/RestaurantBar/order-items', {
          orderId: createdOrderId,
          menuItemId: i.id,
          quantity: i.quantity,
          unitPrice: i.price
        })
      }

      // 3) Create Room Service record linked to Restaurant Order
      const roomServicePayload = {
        roomId: selectedGuestSource?.startsWith('checkin') ? roomId : null,
        orderId: createdOrderId,
        deliveryCharge: Number(formData.deliveryCharge || 0),
        deliveredBy: formData.assignedStaff,
        specialInstructions: formData.specialInstructions,
        remarks: formData.remarks,
        status: 'Requested'
      }

      const response = await axios.post('/RestaurantBar/room-service', roomServicePayload)

      if (response.data?.success) {
        setSuccess('Room service order created successfully')
        fetchRoomServiceData() // Refresh data
        setShowForm(false)
        resetForm()
      } else {
        setError('Failed to save room service order')
      }
    } catch (err) {
      console.error('Error saving room service order:', err)
      setError(err.response?.data?.message || 'Failed to save room service order')
    } finally {
      setLoading(false)
    }
  }

  // Delete room service order - PURE API CALL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room service order?')) return

    try {
      setLoading(true)
      const response = await axios.delete(`/RestaurantBar/room-service/${id}`)
      
      if (response.data?.success) {
        setSuccess('Room service order deleted successfully')
        fetchRoomServiceData() // Refresh data
      } else {
        setError('Failed to delete room service order')
      }
    } catch (err) {
      console.error('Error deleting room service order:', err)
      setError(err.response?.data?.message || 'Failed to delete room service order')
    } finally {
      setLoading(false)
    }
  }

  // Update order status - PURE API CALL
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`/RestaurantBar/room-service/${orderId}/status`, newStatus)
      
      if (response.data?.success) {
        setSuccess(`Order ${newStatus.toLowerCase()} successfully`)
        fetchRoomServiceData() // Refresh data
      } else {
        setError('Failed to update order status')
      }
    } catch (err) {
      console.error('Error updating order status:', err)
      setError(err.response?.data?.message || 'Failed to update order status')
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      orderNumber: '',
      roomNumber: '',
      guestName: '',
      guestPhone: '',
      guestEmail: '',
      guestId: null,
      items: [],
      specialInstructions: '',
      deliveryTime: '',
      status: 'Received',
      priority: 'Normal',
      deliveryCharge: '200',
      assignedStaff: '',
      isActive: true
    })
    resetGuestSelection()
    setEditingId(null)
    setErrors({})
  }

  // Handle edit
  const handleEdit = (order) => {
    setFormData(order)
    setEditingId(order.id)
    setShowForm(true)
  }

  // Add item to order
  const addItemToOrder = (menuItem) => {
    const existingItem = formData.items.find(item => item.id === menuItem.id)
    if (existingItem) {
      setFormData({
        ...formData,
        items: formData.items.map(item =>
          item.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        )
      })
    } else {
      setFormData({
        ...formData,
        items: [...formData.items, { ...menuItem, quantity: 1, total: menuItem.price }]
      })
    }
  }

  // Remove item from order
  const removeItemFromOrder = (itemId) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== itemId)
    })
  }

  // Calculate total
  const calculateTotal = () => {
    const itemsTotal = formData.items.reduce((sum, item) => sum + item.total, 0)
    return itemsTotal + parseFloat(formData.deliveryCharge || 0)
  }

  // Filter orders
  const filteredOrders = roomServiceOrders.filter(order =>
    order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.roomNumber?.includes(searchTerm) ||
    order.guestName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Received': return 'bg-blue-100 text-blue-800'
      case 'Preparing': return 'bg-yellow-100 text-yellow-800'
      case 'Ready': return 'bg-green-100 text-green-800'
      case 'Delivered': return 'bg-gray-100 text-gray-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-teal-100 p-3 rounded-lg">
              <HomeIcon className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Room Service</h1>
              <p className="text-gray-600">Manage in-room dining orders</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center space-x-2 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Order</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hotel</label>
            <select
              value={selectedHotelId}
              onChange={(e) => setSelectedHotelId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Select Hotel</option>
              {hotels.map(h => (
                <option key={h.id} value={h.id}>{h.hotelName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Search orders..."
          />
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

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <span className="ml-2 text-gray-600">Loading room service orders...</span>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center text-gray-500">
              <HomeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No room service orders found</p>
            </div>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Order Header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{order.orderNumber}</h3>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(order.priority)}`}>
                      {order.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <HomeIcon className="h-4 w-4 mr-2" />
                    Room {order.roomNumber}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <UserIcon className="h-4 w-4 mr-2" />
                    {order.guestName}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    {order.guestPhone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    {order.deliveryTime}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                <div className="space-y-2 mb-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>Rs {item.total?.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total (incl. delivery):</span>
                    <span>Rs {order.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>

                {order.specialInstructions && (
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 text-sm mb-1">Special Instructions:</h5>
                    <p className="text-sm text-gray-600">{order.specialInstructions}</p>
                  </div>
                )}

                {order.assignedStaff && (
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <TruckIcon className="h-4 w-4 mr-2" />
                      Assigned to: {order.assignedStaff}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Actions */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex space-x-2">
                  {order.status === 'Received' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Preparing')}
                      className="flex-1 bg-yellow-600 text-white py-2 px-3 rounded-lg hover:bg-yellow-700 text-sm transition-colors"
                    >
                      Start Preparing
                    </button>
                  )}
                  
                  {order.status === 'Preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Ready')}
                      className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 text-sm transition-colors"
                    >
                      Mark Ready
                    </button>
                  )}
                  
                  {order.status === 'Ready' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Delivered')}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 text-sm transition-colors"
                    >
                      Mark Delivered
                    </button>
                  )}

                  <button
                    onClick={() => handleEdit(order)}
                    className="p-2 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingId ? 'Edit Room Service Order' : 'New Room Service Order'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guest (Check-In / Walk-in) *</label>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={guestSearchTerm}
                        onChange={(e) => setGuestSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Search guest (min 2 chars)..."
                      />

                      <select
                        value={selectedGuestSource}
                        onChange={(e) => handleGuestSelect(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          errors.guestName ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Guest</option>

                        <option value="new:0">Create new walk-in guest</option>

                        <optgroup label="Active Check-Ins">
                          {activeCheckIns.length === 0 ? (
                            <option value="" disabled>No active check-ins</option>
                          ) : (
                            activeCheckIns.slice(0, 100).map(ci => (
                              <option key={`ci-${ci.id}`} value={`checkin:${ci.id}`}>
                                {`Room ${ci.roomNumber ?? ci.RoomNumber ?? ''} - ${ci.guestName ?? ci.GuestName ?? ''}`}
                              </option>
                            ))
                          )}
                        </optgroup>

                        <optgroup label="Walk-in / Existing Guests">
                          {guestSearchResults.length === 0 ? (
                            <option value="" disabled>{guestSearchTerm.trim().length >= 2 ? 'No guests found' : 'Type to search guests'}</option>
                          ) : (
                            guestSearchResults.slice(0, 50).map(g => (
                              <option key={`g-${g.id}`} value={`guest:${g.id}`}>
                                {`${g.fullName}${g.phoneNumber ? ` - ${g.phoneNumber}` : ''}`}
                              </option>
                            ))
                          )}
                        </optgroup>
                      </select>
                    </div>

                    {errors.guestName && <p className="text-red-500 text-xs mt-1">{errors.guestName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Number {selectedGuestSource?.startsWith('checkin') ? '*' : ''}</label>
                    <input
                      type="text"
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        errors.roomNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="205"
                      disabled={!selectedGuestSource?.startsWith('checkin')}
                    />
                    {errors.roomNumber && <p className="text-red-500 text-xs mt-1">{errors.roomNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.guestPhone}
                      onChange={(e) => setFormData({...formData, guestPhone: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        errors.guestPhone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="+92-300-1234567"
                    />
                    {errors.guestPhone && <p className="text-red-500 text-xs mt-1">{errors.guestPhone}</p>}
                  </div>
                </div>

                {createWalkIn && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name *</label>
                      <input
                        type="text"
                        value={formData.guestName}
                        onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          errors.guestName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Guest full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.guestEmail}
                        onChange={(e) => setFormData({...formData, guestEmail: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="guest@email.com"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time *</label>
                    <input
                      type="datetime-local"
                      value={formData.deliveryTime}
                      onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        errors.deliveryTime ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.deliveryTime && <p className="text-red-500 text-xs mt-1">{errors.deliveryTime}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Charge (Rs)</label>
                    <input
                      type="number"
                      value={formData.deliveryCharge}
                      onChange={(e) => setFormData({...formData, deliveryCharge: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Staff</label>
                    <select
                      value={formData.assignedStaff}
                      onChange={(e) => setFormData({...formData, assignedStaff: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Select staff member</option>
                      {staff.map(member => (
                        <option key={member.id} value={member.name}>
                          {member.name} - {member.position}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Menu Items Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add Menu Items *</label>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-40 overflow-y-auto">
                    {menuItems.length === 0 ? (
                      <p className="text-gray-500 text-sm">No menu items available</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {menuItems.map(item => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => addItemToOrder(item)}
                            className="text-left p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                          >
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-xs text-gray-500">Rs {item.price}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.items && <p className="text-red-500 text-xs mt-1">{errors.items}</p>}
                </div>

                {/* Selected Items */}
                {formData.items.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Selected Items</label>
                    <div className="space-y-2">
                      {formData.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{item.name} x{item.quantity}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Rs {item.total?.toLocaleString()}</span>
                            <button
                              type="button"
                              onClick={() => removeItemFromOrder(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-2 flex justify-between font-medium">
                        <span>Total (incl. delivery):</span>
                        <span>Rs {calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                  <textarea
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Any special dietary requirements or delivery instructions..."
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      resetForm()
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
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

export default RoomService;
