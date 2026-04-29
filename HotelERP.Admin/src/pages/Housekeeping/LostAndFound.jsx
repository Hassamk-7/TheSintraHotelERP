import { useState, useEffect } from 'react'
import axios from '../../utils/axios'
import { apiConfig } from '../../config/api'
import {
  MagnifyingGlassCircleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  PhoneIcon,
  ChevronDownIcon,
  XMarkIcon,
  HomeIcon,
  UserIcon,
  Squares2X2Icon,
  TableCellsIcon
} from '@heroicons/react/24/outline'

const API_BASE_URL = apiConfig.baseURL

const LostAndFound = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    roomId: '',
    itemDescription: '',
    category: 'Electronics',
    locationFound: '',
    dateFound: '',
    foundBy: '',
    status: 'Found',
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    claimedBy: '',
    claimedDate: '',
    remarks: '',
    imagePath: ''
  })

  // State for rooms and searchable functionality
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [roomSearchTerm, setRoomSearchTerm] = useState('')
  const [showRoomDropdown, setShowRoomDropdown] = useState(false)
  
  // State for guest search functionality  
  const [guests, setGuests] = useState([])
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [guestSearchTerm, setGuestSearchTerm] = useState('')
  const [showGuestDropdown, setShowGuestDropdown] = useState(false)

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'table'

  // Load data on component mount
  useEffect(() => {
    fetchItems()
    fetchRooms()
    fetchGuests()
  }, [])

  // Fetch items from API
  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/housekeeping/lost-and-found?pageSize=100`)
      if (response.data.success) {
        setItems(response.data.data)
        console.log('Lost & Found items loaded:', response.data.data.length)
      } else {
        setItems([])
        setError('Failed to load lost & found items')
      }
    } catch (err) {
      console.error('Error fetching lost & found items:', err)
      setError(`Failed to load lost & found items: ${err.response?.data?.message || err.message}`)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch rooms for dropdown
  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/housekeeping/rooms-dropdown`)
      if (response.data.success) {
        setRooms(response.data.data)
        console.log('Rooms loaded:', response.data.data.length)
      } else {
        setError('Failed to load rooms data')
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
      setError(`Failed to load rooms: ${error.response?.data?.message || error.message}`)
      setRooms([])
    }
  }

  // Fetch guests from reservations for search
  const fetchGuests = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reservations/guests-dropdown`)
      if (response.data.success) {
        setGuests(response.data.data)
        console.log('Guests loaded:', response.data.data.length)
      } else {
        console.log('No guests API available, feature disabled')
      }
    } catch (error) {
      console.log('Guests API not available:', error.message)
      setGuests([])
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.roomId) newErrors.roomId = 'Room is required'
    if (!formData.itemDescription.trim()) newErrors.itemDescription = 'Item description is required'
    if (!formData.locationFound.trim()) newErrors.locationFound = 'Found location is required'
    if (!formData.foundBy.trim()) newErrors.foundBy = 'Found by is required'
    if (!formData.dateFound) newErrors.dateFound = 'Found date is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    try {
      setLoading(true)
      setError('')
      
      // Clean up the form data
      const cleanFormData = {
        ...formData,
        roomId: parseInt(formData.roomId),
        dateFound: formData.dateFound || null,
        claimedDate: formData.claimedDate || null
      }
      
      let response
      if (editingId) {
        response = await axios.put(`${API_BASE_URL}/housekeeping/lost-and-found/${editingId}`, cleanFormData)
      } else {
        response = await axios.post(`${API_BASE_URL}/housekeeping/lost-and-found`, cleanFormData)
      }
      
      if (response.data && response.data.success) {
        setSuccess(editingId ? 'Lost & Found item updated successfully!' : 'Lost & Found item created successfully!')
        handleCancel()
        fetchItems() // Refresh the list
      } else {
        setError('Failed to save lost & found item')
      }
    } catch (error) {
      console.error('Error saving lost & found item:', error)
      setError(error.response?.data?.message || 'Failed to save lost & found item')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
    setFormData({
      roomId: item.roomId || item.room?.id || '',
      itemDescription: item.itemDescription || '',
      category: item.category || 'Electronics',
      locationFound: item.locationFound || '',
      dateFound: item.dateFound ? new Date(item.dateFound).toISOString().slice(0, 16) : '',
      foundBy: item.foundBy || '',
      status: item.status || 'Found',
      guestName: item.guestName || '',
      guestPhone: item.guestPhone || '',
      guestEmail: item.guestEmail || '',
      claimedBy: item.claimedBy || '',
      claimedDate: item.claimedDate ? new Date(item.claimedDate).toISOString().slice(0, 16) : '',
      remarks: item.remarks || '',
      imagePath: item.imagePath || ''
    })
    
    // Set selected room
    if (item.room) {
      setSelectedRoom(item.room)
      setRoomSearchTerm(`${item.room.roomNumber} - ${item.room.roomType?.name || ''}`)
    } else if (item.roomId) {
      const room = rooms.find(r => r.id === item.roomId)
      if (room) {
        setSelectedRoom(room)
        setRoomSearchTerm(`${room.roomNumber} - ${room.roomType?.name || ''}`)
      }
    }
    
    // Set guest search term if guest info exists
    if (item.guestName) {
      setGuestSearchTerm(item.guestName)
    }
    
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lost & found item?')) return

    try {
      setLoading(true)
      const response = await axios.delete(`${API_BASE_URL}/housekeeping/lost-and-found/${id}`)
      
      if (response.data && response.data.success) {
        setSuccess('Lost & Found item deleted successfully')
        fetchItems()
      } else {
        setError('Failed to delete lost & found item')
      }
    } catch (err) {
      console.error('Error deleting lost & found item:', err)
      setError(err.response?.data?.message || 'Failed to delete lost & found item')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      roomId: '',
      itemDescription: '',
      category: 'Electronics',
      locationFound: '',
      dateFound: '',
      foundBy: '',
      status: 'Found',
      guestName: '',
      guestPhone: '',
      guestEmail: '',
      claimedBy: '',
      claimedDate: '',
      remarks: '',
      imagePath: ''
    })
    setSelectedRoom(null)
    setSelectedGuest(null)
    setRoomSearchTerm('')
    setGuestSearchTerm('')
    setShowRoomDropdown(false)
    setShowGuestDropdown(false)
    setEditingId(null)
    setShowForm(false)
    setErrors({})
    setError('')
    setSuccess('')
  }

  // Room selection handlers
  const handleRoomSelect = (room) => {
    setSelectedRoom(room)
    setFormData({ ...formData, roomId: room.id })
    setRoomSearchTerm(`${room.roomNumber} - ${room.roomType?.name || ''}`)
    setShowRoomDropdown(false)
  }

  const handleRoomSearchChange = (value) => {
    setRoomSearchTerm(value)
    setShowRoomDropdown(true)
    if (!value) {
      setSelectedRoom(null)
      setFormData({ ...formData, roomId: '' })
    }
  }

  // Guest selection handlers
  const handleGuestSelect = (guest) => {
    setSelectedGuest(guest)
    setFormData({ 
      ...formData, 
      guestName: guest.name,
      guestPhone: guest.phone || '',
      guestEmail: guest.email || ''
    })
    setGuestSearchTerm(guest.name)
    setShowGuestDropdown(false)
  }

  const handleGuestSearchChange = (value) => {
    setGuestSearchTerm(value)
    setShowGuestDropdown(true)
    setFormData({ ...formData, guestName: value })
    if (!value) {
      setSelectedGuest(null)
      setFormData({ 
        ...formData, 
        guestName: '',
        guestPhone: '',
        guestEmail: '' 
      })
    }
  }

  // Filter rooms based on search
  const filteredRooms = rooms.filter(room => {
    const roomNumber = room.roomNumber || ''
    const roomTypeName = room.roomType?.name || ''
    const searchTerm = roomSearchTerm.toLowerCase()
    
    return roomNumber.toLowerCase().includes(searchTerm) ||
           roomTypeName.toLowerCase().includes(searchTerm)
  })

  // Filter guests based on search
  const filteredGuests = guests.filter(guest => {
    const guestName = guest.name || ''
    const guestPhone = guest.phone || ''
    const guestEmail = guest.email || ''
    const searchTerm = guestSearchTerm.toLowerCase()
    
    return guestName.toLowerCase().includes(searchTerm) ||
           guestPhone.toLowerCase().includes(searchTerm) ||
           guestEmail.toLowerCase().includes(searchTerm)
  })

  const filteredItems = items.filter(item =>
    (item.itemDescription || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.locationFound || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.guestName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.itemNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.room?.roomNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Clear messages after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000)
      return () => clearTimeout(timer)
    }
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.room-dropdown-container')) {
        setShowRoomDropdown(false)
      }
      if (!event.target.closest('.guest-dropdown-container')) {
        setShowGuestDropdown(false)
      }
    }
    
    if (showRoomDropdown || showGuestDropdown) {
      document.addEventListener('click', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showRoomDropdown, showGuestDropdown])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Found': return 'bg-blue-100 text-blue-800'
      case 'Contacted': return 'bg-yellow-100 text-yellow-800'
      case 'Claimed': return 'bg-green-100 text-green-800'
      case 'Unclaimed': return 'bg-red-100 text-red-800'
      case 'Disposed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Electronics': return 'bg-blue-100 text-blue-800'
      case 'Jewelry': return 'bg-yellow-100 text-yellow-800'
      case 'Clothing': return 'bg-purple-100 text-purple-800'
      case 'Personal Items': return 'bg-green-100 text-green-800'
      case 'Documents': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  console.log('Lost & Found component rendering with items:', items.length)
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Lost & Found</h1>
            <p className="text-purple-100">Manage lost and found items for hotel guests</p>
          </div>
          <MagnifyingGlassCircleIcon className="h-12 w-12 text-purple-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <MagnifyingGlassCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Found Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {items.filter(item => item.status === 'Found').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <PhoneIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Contacted</p>
              <p className="text-2xl font-bold text-gray-900">
                {items.filter(item => item.status === 'Contacted').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Claimed</p>
              <p className="text-2xl font-bold text-gray-900">
                {items.filter(item => item.status === 'Claimed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <MagnifyingGlassCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unclaimed</p>
              <p className="text-2xl font-bold text-gray-900">
                {items.filter(item => item.status === 'Unclaimed').length}
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
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Item
        </button>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XMarkIcon className="h-5 w-5 text-red-400 mr-2" />
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingId ? 'Edit Lost & Found Item' : 'New Lost & Found Item'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room *</label>
                    <div className="relative room-dropdown-container">
                      <input
                        type="text"
                        value={roomSearchTerm}
                        onChange={(e) => handleRoomSearchChange(e.target.value)}
                        onFocus={() => setShowRoomDropdown(true)}
                        placeholder="Search and select room..."
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                          errors.roomId ? 'border-red-500' : ''
                        }`}
                        required
                      />
                      {showRoomDropdown && (
                        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1">
                          {filteredRooms.length > 0 ? (
                            filteredRooms.slice(0, 10).map((room) => (
                              <div
                                key={room.id}
                                onClick={() => handleRoomSelect(room)}
                                className="px-4 py-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              >
                                <div className="font-medium text-gray-900">Room {room.roomNumber || 'N/A'}</div>
                                <div className="text-sm text-gray-600">
                                  {room.roomType?.name || 'Standard Room'} • Floor {room.floorNumber || '1'} • Capacity: {(Number(room.maxAdults) || 0) + (Number(room.maxChildren) || 0)} guests
                                </div>
                                <div className="text-xs text-gray-500">
                                  Status: {room.status || 'Available'} • Rate: Rs. {Number(room.basePrice || 0).toLocaleString()}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-500 text-center">
                              {rooms.length === 0 ? 'Loading rooms...' : 'No rooms found'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {errors.roomId && <p className="mt-1 text-sm text-red-600">{errors.roomId}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Jewelry">Jewelry</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Personal Items">Personal Items</option>
                      <option value="Documents">Documents</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.itemDescription}
                      onChange={(e) => setFormData({...formData, itemDescription: e.target.value})}
                      rows={2}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.itemDescription ? 'border-red-500' : ''
                      }`}
                      placeholder="Detailed description of the item"
                      required
                    />
                    {errors.itemDescription && <p className="mt-1 text-sm text-red-600">{errors.itemDescription}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location Found <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.locationFound}
                      onChange={(e) => setFormData({...formData, locationFound: e.target.value})}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.locationFound ? 'border-red-500' : ''
                      }`}
                      placeholder="Bedside table, Bathroom counter, etc."
                      required
                    />
                    {errors.locationFound && <p className="mt-1 text-sm text-red-600">{errors.locationFound}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Found By <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.foundBy}
                      onChange={(e) => setFormData({...formData, foundBy: e.target.value})}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.foundBy ? 'border-red-500' : ''
                      }`}
                      placeholder="Staff member name"
                      required
                    />
                    {errors.foundBy && <p className="mt-1 text-sm text-red-600">{errors.foundBy}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Found <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.dateFound}
                      onChange={(e) => setFormData({...formData, dateFound: e.target.value})}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.dateFound ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    {errors.dateFound && <p className="mt-1 text-sm text-red-600">{errors.dateFound}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Found">Found</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Claimed">Claimed</option>
                      <option value="Unclaimed">Unclaimed</option>
                      <option value="Disposed">Disposed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
                    <div className="relative guest-dropdown-container">
                      <input
                        type="text"
                        value={guestSearchTerm}
                        onChange={(e) => handleGuestSearchChange(e.target.value)}
                        onFocus={() => setShowGuestDropdown(true)}
                        placeholder="Search guest name..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      {showGuestDropdown && filteredGuests.length > 0 && (
                        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1">
                          {filteredGuests.slice(0, 10).map((guest) => (
                            <div
                              key={guest.id}
                              onClick={() => handleGuestSelect(guest)}
                              className="px-4 py-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-900">{guest.name}</div>
                              <div className="text-sm text-gray-600">
                                {guest.phone} • {guest.email}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guest Phone</label>
                    <input
                      type="text"
                      value={formData.guestPhone}
                      onChange={(e) => setFormData({...formData, guestPhone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="+92-300-1234567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guest Email</label>
                    <input
                      type="email"
                      value={formData.guestEmail}
                      onChange={(e) => setFormData({...formData, guestEmail: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="guest@example.com"
                    />
                  </div>

                  {(formData.status === 'Claimed' || formData.status === 'Contacted') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Claimed By</label>
                        <input
                          type="text"
                          value={formData.claimedBy}
                          onChange={(e) => setFormData({...formData, claimedBy: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Person who claimed the item"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Claimed Date</label>
                        <input
                          type="datetime-local"
                          value={formData.claimedDate}
                          onChange={(e) => setFormData({...formData, claimedDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                    <textarea
                      value={formData.remarks}
                      onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Additional notes or remarks..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Items Grid */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Lost & Found Items</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{filteredItems.length} items</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Squares2X2Icon className="h-4 w-4" />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'table'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <TableCellsIcon className="h-4 w-4" />
                  Table
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="mt-2 text-gray-500">Loading items...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <MagnifyingGlassCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
              <p className="mt-1 text-sm text-gray-500">No lost and found items match your search criteria.</p>
            </div>
          ) : viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-medium text-gray-600 bg-gray-200 px-2 py-1 rounded">
                            {item.itemNumber}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                          {item.itemDescription}
                        </h3>
                      </div>
                      <div className="flex space-x-1 ml-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Item"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Item"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Room:</span>
                        <span className="font-medium text-gray-900">
                          {item.room ? `${item.room.roomNumber}` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium text-gray-900 text-right max-w-[60%] truncate" title={item.locationFound}>
                          {item.locationFound}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Found by:</span>
                        <span className="font-medium text-gray-900">
                          {item.foundBy}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(item.dateFound).toLocaleDateString()}
                        </span>
                      </div>
                      {item.guestName && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Guest:</span>
                          <span className="font-medium text-gray-900">
                            {item.guestName}
                          </span>
                        </div>
                      )}
                      {item.claimedBy && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Claimed by:</span>
                          <span className="font-medium text-gray-900">
                            {item.claimedBy}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {item.remarks && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600" title={item.remarks}>
                          <span className="font-medium">Note:</span> {item.remarks.length > 60 ? `${item.remarks.substring(0, 60)}...` : item.remarks}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Table View - Two Rows Per Item
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Found By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Found</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredItems.map((item, index) => (
                    <>
                      {/* Main Row */}
                      <tr key={`${item.id}-main`} className={`${index % 2 === 0 ? 'bg-blue-50' : 'bg-purple-50'} hover:${index % 2 === 0 ? 'bg-blue-100' : 'bg-purple-100'} border-l-4 ${index % 2 === 0 ? 'border-blue-400' : 'border-purple-400'}`}>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.itemDescription}</div>
                            <div className="text-xs text-gray-500 font-mono mt-1">{item.itemNumber}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">{item.room ? item.room.roomNumber : 'N/A'}</div>
                          {item.room?.roomType && (
                            <div className="text-xs text-gray-500">{item.room.roomType.typeName}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-xs" title={item.locationFound}>
                            {item.locationFound}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.foundBy}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>{new Date(item.dateFound).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">{new Date(item.dateFound).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-white hover:bg-opacity-50"
                              title="Edit Item"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-white hover:bg-opacity-50"
                              title="Delete Item"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Details Row */}
                      <tr key={`${item.id}-details`} className={`${index % 2 === 0 ? 'bg-blue-100' : 'bg-purple-100'} hover:${index % 2 === 0 ? 'bg-blue-150' : 'bg-purple-150'} border-l-4 ${index % 2 === 0 ? 'border-blue-400' : 'border-purple-400'} border-b-4 ${index % 2 === 0 ? 'border-b-blue-300' : 'border-b-purple-300'}`}>
                        <td className="px-6 py-3 text-sm">
                          <div className="flex items-center space-x-4 text-gray-600">
                            {item.guestName && (
                              <span className="flex items-center">
                                <UserIcon className="h-4 w-4 mr-1" />
                                <span className="font-medium text-gray-900">{item.guestName}</span>
                              </span>
                            )}
                            {item.guestPhone && (
                              <span className="flex items-center">
                                <PhoneIcon className="h-4 w-4 mr-1" />
                                <span>{item.guestPhone}</span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {item.claimedBy && (
                            <div>
                              <span className="text-xs text-gray-500">Claimed by:</span>
                              <div className="font-medium text-gray-900">{item.claimedBy}</div>
                              {item.claimedDate && (
                                <div className="text-xs text-gray-500">
                                  {new Date(item.claimedDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td colSpan="4" className="px-6 py-3 text-sm text-gray-600">
                          {item.remarks && (
                            <div>
                              <span className="text-xs text-gray-500 font-medium">Remarks:</span>
                              <div className="mt-1 text-gray-900">{item.remarks}</div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500">
                          {item.guestEmail && (
                            <div className="text-xs">
                              <span className="block">Email:</span>
                              <span className="text-blue-600">{item.guestEmail}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-3"></td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LostAndFound
