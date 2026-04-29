import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  SparklesIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline'

const RoomAmenities = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    amenityName: '',
    amenityCode: '',
    category: 'Technology',
    hotelId: '',
    roomTypeId: '',
    description: '',
    cost: '',
    isChargeable: false,
    chargeAmount: '',
    priority: 'Medium',
    maintenanceRequired: false,
    isActive: true
  })

  const [amenities, setAmenities] = useState([])
  const [roomTypes, setRoomTypes] = useState([])
  const [hotels, setHotels] = useState([])
  const [selectedHotelId, setSelectedHotelId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})

  const getRoomTypeLabel = (roomTypeId) => {
    const id = Number(roomTypeId)
    if (!id) return 'N/A'
    const rt = roomTypes.find((x) => Number(x.id ?? x.Id) === id)
    if (!rt) return 'N/A'
    const name = rt.name ?? rt.Name
    const code = rt.code ?? rt.Code
    if (code && name) return `${code} - ${name}`
    return name || code || 'N/A'
  }

  // Load room amenities on component mount
  useEffect(() => {
    fetchRoomAmenities()
    fetchHotels()
    fetchRoomTypes()
  }, [])

  // Keep selectedHotelId in sync with formData.hotelId when modal is open
  useEffect(() => {
    if (!showForm) return
    setSelectedHotelId(formData.hotelId || '')
  }, [showForm, formData.hotelId])

  const fetchHotels = async () => {
    try {
      const response = await axios.get('/Hotels')
      if (response.data?.success) {
        setHotels(response.data.data || [])
      } else {
        setHotels([])
      }
    } catch (err) {
      console.error('Error fetching hotels:', err)
      setHotels([])
    }
  }

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get('/RoomsManagement/room-types')
      if (response.data?.success) {
        setRoomTypes(response.data.data || [])
      }
    } catch (err) {
      console.error('Error fetching room types:', err)
    }
  }


  // Fetch room amenities from API - PURE API CALL
  const fetchRoomAmenities = async () => {
    try {
      setLoading(true)
      setError('')
      const params = {}
      if (selectedHotelId) params.hotelId = selectedHotelId
      const response = await axios.get('/RoomsManagement/room-amenities', { params })
      
      if (response.data && response.data.success) {
        setAmenities(response.data.data)
      } else {
        setError('No room amenities data received')
        setAmenities([])
      }
    } catch (err) {
      console.error('Error fetching room amenities:', err)
      setError('Failed to load room amenities. Please check API connection.')
      setAmenities([])
    } finally {
      setLoading(false)
    }
  }

  // Refetch amenities when hotel filter changes
  useEffect(() => {
    fetchRoomAmenities()
  }, [selectedHotelId])

  // Form validation
  const validateForm = () => {
    const newErrors = {}
    if (!formData.amenityName.trim()) newErrors.amenityName = 'Amenity name is required'
    if (!formData.amenityCode.trim()) newErrors.amenityCode = 'Amenity code is required'
    if (!formData.hotelId) newErrors.hotelId = 'Hotel is required'
    if (!formData.roomTypeId) newErrors.roomTypeId = 'Room type is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (formData.isChargeable && (!formData.cost || parseFloat(formData.cost) <= 0)) {
      newErrors.cost = 'Valid cost is required for chargeable amenities'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Create/Update room amenity - PURE API CALL
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      setError('')
      
      // Map frontend fields to API fields
      const apiData = {
        amenityName: formData.amenityName,
        amenityCode: formData.amenityCode,
        category: formData.category,
        roomTypeId: parseInt(formData.roomTypeId, 10),
        description: formData.description,
        chargeAmount: (formData.isChargeable ? (formData.chargeAmount || formData.cost || '0') : '0').toString(),
        isChargeable: formData.isChargeable,
        chargeType: formData.isChargeable ? 'Per Use' : 'Free',
        isAvailable: true,
        isActive: formData.isActive
      }
      
      
      const response = editingId 
        ? await axios.put(`/RoomsManagement/room-amenities/${editingId}`, apiData)
        : await axios.post('/RoomsManagement/room-amenities', apiData)
      
      if (response.data && response.data.success) {
        setSuccess(editingId ? 'Room amenity updated successfully' : 'Room amenity created successfully')
        fetchRoomAmenities() // Refresh data
        setShowForm(false)
        resetForm()
      } else {
        setError('Failed to save room amenity')
      }
    } catch (err) {
      console.error('Error saving room amenity:', err)
      
      // If it's a 500 error, provide helpful message
      if (err.response?.status === 500) {
        setError('Server error: Please check if the API server is running')
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to save room amenity'
        setError(`Error ${editingId ? 'updating' : 'creating'} room amenity: ${errorMessage}`)
      }
    } finally {
      setLoading(false)
    }
  }

  // Delete room amenity - PURE API CALL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room amenity?')) return

    try {
      setLoading(true)
      const response = await axios.delete(`/RoomsManagement/room-amenities/${id}`)
      
      if (response.data && response.data.success) {
        setSuccess('Room amenity deleted successfully')
        fetchRoomAmenities() // Refresh data
      } else {
        setError('Failed to delete room amenity')
      }
    } catch (err) {
      console.error('Error deleting room amenity:', err)
      setError(err.response?.data?.message || 'Failed to delete room amenity')
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      amenityName: '',
      amenityCode: '',
      category: 'Technology',
      hotelId: '',
      roomTypeId: '',
      description: '',
      cost: '',
      isChargeable: false,
      chargeAmount: '',
      priority: 'Medium',
      maintenanceRequired: false,
      isActive: true
    })
    setSelectedHotelId('')
    setEditingId(null)
    setErrors({})
    setError('')
    setSuccess('')
  }

  // Handle add new amenity
  const handleAddNew = () => {
    resetForm()
    setShowForm(true)
  }

  // Handle edit
  const handleEdit = (amenity) => {
    const amenityId = amenity.id || amenity.Id

    const resolvedRoomTypeId = amenity.roomTypeId || amenity.RoomTypeId || ''
    const resolvedHotelId =
      amenity.hotelId ||
      amenity.HotelId ||
      amenity.roomType?.hotelId ||
      amenity.roomType?.HotelId ||
      roomTypes.find((rt) => String(rt.id ?? rt.Id) === String(resolvedRoomTypeId))?.hotelId ||
      roomTypes.find((rt) => String(rt.id ?? rt.Id) === String(resolvedRoomTypeId))?.HotelId ||
      ''
    
    setFormData({
      amenityName: amenity.amenityName || '',
      amenityCode: amenity.amenityCode || '',
      category: amenity.category || 'Technology',
      hotelId: resolvedHotelId ? String(resolvedHotelId) : '',
      roomTypeId: resolvedRoomTypeId ? String(resolvedRoomTypeId) : '',
      description: amenity.description || '',
      cost: amenity.chargeAmount || amenity.cost || '',
      isChargeable: amenity.isChargeable || false,
      chargeAmount: amenity.chargeAmount || '',
      priority: amenity.priority || 'Medium',
      maintenanceRequired: amenity.maintenanceRequired || false,
      isActive: amenity.isActive !== undefined ? amenity.isActive : true
    })
    // Set editing ID first, then show form
    setEditingId(amenityId)
    setError('') // Clear any previous errors
    setSuccess('') // Clear any previous success messages
    
    // Use setTimeout to ensure state is updated before showing form
    setTimeout(() => {
      setShowForm(true)
    }, 0)
  }

  // Filter amenities based on search
  const filteredAmenities = amenities.filter(amenity =>
    amenity.amenityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    amenity.amenityCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    amenity.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    amenity.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredRoomTypes = selectedHotelId
    ? roomTypes.filter((rt) => {
        const rtHotelId = rt.hotelId ?? rt.HotelId ?? rt.hotel?.id ?? rt.hotel?.Id
        return String(rtHotelId ?? '') === String(selectedHotelId)
      })
    : roomTypes

  const getHotelNameForRoomTypeId = (roomTypeId) => {
    const id = Number(roomTypeId)
    if (!id) return 'N/A'
    const rt = roomTypes.find((x) => Number(x.id ?? x.Id) === id)
    if (!rt) return 'N/A'
    const hotelId = rt.hotelId ?? rt.HotelId
    const hotel = hotels.find((h) => String(h.id ?? h.Id) === String(hotelId ?? ''))
    return hotel?.hotelName || hotel?.HotelName || 'N/A'
  }

  return (
    <div className="space-y-4 px-3 py-4 sm:space-y-6 sm:px-4 sm:py-4 md:px-6 md:py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-[1.5rem] p-4 sm:p-6 border border-yellow-200 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="bg-yellow-100 p-3 rounded-2xl shrink-0">
              <SparklesIcon className="h-7 w-7 sm:h-8 sm:w-8 text-yellow-600" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">Room Amenities</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage room facilities and services</p>
            </div>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-yellow-600 text-white px-4 py-3 rounded-2xl hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 flex items-center justify-center space-x-2 transition-colors w-full sm:w-auto font-medium"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Amenity</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hotel</label>
            <select
              value={selectedHotelId}
              onChange={(e) => setSelectedHotelId(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="">All Hotels</option>
              {hotels.map((h) => (
                <option key={h.id ?? h.Id} value={h.id ?? h.Id}>
                  {h.hotelName ?? h.HotelName}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Search room amenities..."
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

      {/* Room Amenities Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-gradient-to-r from-yellow-50 via-white to-orange-50 px-6 py-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Room Amenities List</h2>
              <p className="text-sm text-slate-500">Professional view of amenities by hotel and room type</p>
            </div>
            <div className="text-sm font-medium text-slate-500">{filteredAmenities.length} record(s)</div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-slate-200">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">SR No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Amenity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Hotel</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Room Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Cost</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Chargeable</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-4 py-3 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading room amenities...</p>
                  </td>
                </tr>
              ) : filteredAmenities.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-3 text-center text-gray-500">
                    No room amenities found
                  </td>
                </tr>
              ) : (
                filteredAmenities.map((amenity, index) => (
                  <tr key={amenity.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'} transition hover:bg-yellow-50/50`}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-slate-900">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{amenity.amenityName}</div>
                        <div className="text-xs text-gray-500">{amenity.description}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {amenity.category}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {getHotelNameForRoomTypeId(amenity.roomTypeId ?? amenity.RoomTypeId)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {getRoomTypeLabel(amenity.roomTypeId ?? amenity.RoomTypeId)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      Rs {(amenity.chargeAmount || amenity.cost || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {amenity.isChargeable ? (
                        <div>
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Yes
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            Rs {amenity.chargeAmount?.toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        amenity.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {amenity.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(amenity)}
                          className="rounded-lg p-1.5 text-yellow-600 transition hover:bg-yellow-50 hover:text-yellow-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(amenity.id || amenity.Id)}
                          className="rounded-lg p-1.5 text-red-600 transition hover:bg-red-50 hover:text-red-900"
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
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingId ? 'Edit Room Amenity' : 'Add New Room Amenity'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hotel *</label>
                    <select
                      value={formData.hotelId}
                      onChange={(e) => {
                        const newHotelId = e.target.value
                        setFormData((prev) => ({
                          ...prev,
                          hotelId: newHotelId,
                          roomTypeId: ''
                        }))
                        setSelectedHotelId(newHotelId)
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                        errors.hotelId ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Hotel</option>
                      {hotels.map((h) => (
                        <option key={h.id ?? h.Id} value={h.id ?? h.Id}>
                          {h.hotelName ?? h.HotelName}
                        </option>
                      ))}
                    </select>
                    {errors.hotelId && <p className="text-red-500 text-xs mt-1">{errors.hotelId}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Type *</label>
                    <select
                      value={formData.roomTypeId}
                      onChange={(e) => setFormData({ ...formData, roomTypeId: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                        errors.roomTypeId ? 'border-red-300' : 'border-gray-300'
                      }`}
                      disabled={!formData.hotelId}
                    >
                      <option value="">Select Room Type</option>
                      {filteredRoomTypes.map((rt) => (
                        <option key={rt.id ?? rt.Id} value={rt.id ?? rt.Id}>
                          {rt.name ?? rt.Name}
                        </option>
                      ))}
                    </select>
                    {errors.roomTypeId && <p className="text-red-500 text-xs mt-1">{errors.roomTypeId}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amenity Name *</label>
                    <input
                      type="text"
                      value={formData.amenityName}
                      onChange={(e) => setFormData({...formData, amenityName: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                        errors.amenityName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Air Conditioning"
                    />
                    {errors.amenityName && <p className="text-red-500 text-xs mt-1">{errors.amenityName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amenity Code *</label>
                    <input
                      type="text"
                      value={formData.amenityCode}
                      onChange={(e) => setFormData({...formData, amenityCode: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                        errors.amenityCode ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="AC"
                    />
                    {errors.amenityCode && <p className="text-red-500 text-xs mt-1">{errors.amenityCode}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Climate Control">Climate Control</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Comfort">Comfort</option>
                      <option value="Safety">Safety</option>
                      <option value="Bathroom">Bathroom</option>
                      <option value="Kitchen">Kitchen</option>
                      <option value="Business">Business</option>
                      <option value="Food & Beverage">Food & Beverage</option>
                      <option value="Service">Service</option>
                      <option value="Space">Space</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Premium Service">Premium Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Amenity description..."
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost (Rs)</label>
                    <input
                      type="number"
                      value={formData.cost}
                      onChange={(e) => setFormData({...formData, cost: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                        errors.cost ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="5000"
                    />
                    {errors.cost && <p className="text-red-500 text-xs mt-1">{errors.cost}</p>}
                  </div>

                  {formData.isChargeable && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Charge Amount (Rs) *</label>
                      <input
                        type="number"
                        value={formData.chargeAmount}
                        onChange={(e) => setFormData({...formData, chargeAmount: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                          errors.chargeAmount ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="500"
                      />
                      {errors.chargeAmount && <p className="text-red-500 text-xs mt-1">{errors.chargeAmount}</p>}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isChargeable}
                      onChange={(e) => setFormData({...formData, isChargeable: e.target.checked})}
                      className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Chargeable</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.maintenanceRequired}
                      onChange={(e) => setFormData({...formData, maintenanceRequired: e.target.checked})}
                      className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Maintenance Required</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
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
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50"
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

export default RoomAmenities;
