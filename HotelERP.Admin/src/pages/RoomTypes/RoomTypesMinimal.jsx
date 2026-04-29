import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../utils/axios.js'
import {
  HomeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

const RoomTypes = () => {
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [hotelFilter, setHotelFilter] = useState('')
  const [hotels, setHotels] = useState([])
  const [hotelSearch, setHotelSearch] = useState('')
  const [showHotelDropdown, setShowHotelDropdown] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    hotelId: null,
    maxOccupancy: '1',
    maximumAdults: '1',
    maximumChildren: '0',
    isActive: true
  })

  const [roomTypes, setRoomTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})

  // Load room types on component mount
  useEffect(() => {
    fetchRoomTypes()
    fetchHotels()
  }, [])

  // Close hotel dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showHotelDropdown && !event.target.closest('.hotel-dropdown')) {
        setShowHotelDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showHotelDropdown])

  const handleHotelSelect = (hotel) => {
    const id = hotel.Id || hotel.id
    const name = hotel.HotelName || hotel.hotelName || ''
    setHotelSearch(name)
    setFormData(prev => ({ ...prev, hotelId: id }))
    setShowHotelDropdown(false)
  }

  const fetchHotels = async () => {
    try {
      const response = await axios.get('/Hotels')
      if (response.data && response.data.success) {
        setHotels(response.data.data || [])
      } else {
        setHotels([])
      }
    } catch (err) {
      console.error('❌ API Error fetching hotels:', err)
      setHotels([])
    }
  }

  // Fetch room types from API with thumbnail images - PURE DYNAMIC
  const fetchRoomTypes = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('🚀 Fetching room types from API...')
      const response = await axios.get('/roomtypes')
      
      console.log('📊 API Response:', response.data)
      
      let roomTypesData = []
      if (response.data && Array.isArray(response.data)) {
        roomTypesData = response.data
      } else if (response.data && response.data.success && response.data.data) {
        roomTypesData = response.data.data
      } else if (response.data && response.data.length >= 0) {
        roomTypesData = response.data
      } else {
        console.log('⚠️ API returned unexpected format:', response.data)
        setError('API returned unexpected data format')
        setRoomTypes([])
        return
      }

      // For each room type, fetch image count and thumbnail
      const roomTypesWithImages = await Promise.all(
        roomTypesData.map(async (roomType) => {
          try {
            console.log('🖼️ Fetching images for room type:', roomType.id)
            const imagesResponse = await axios.get(`/roomtypeimage/roomtype/${roomType.id}`)
            
            let imageCount = 0
            let images = []
            let thumbnailImage = null
            
            if (imagesResponse.data && Array.isArray(imagesResponse.data)) {
              images = imagesResponse.data
              imageCount = images.length
            } else if (imagesResponse.data && imagesResponse.data.success && imagesResponse.data.data) {
              images = imagesResponse.data.data
              imageCount = images.length
            }
            
            // Get the first image as thumbnail (prefer primary image if available)
            if (images.length > 0) {
              thumbnailImage = images.find(img => img.isPrimary) || images[0]
            }
            
            return {
              ...roomType,
              imageCount,
              thumbnailImage
            }
          } catch (err) {
            // If 404 or error, means no images for this room type
            console.log(`⚠️ No images found for room type ${roomType.id}:`, err.response?.status)
            return {
              ...roomType,
              imageCount: 0,
              thumbnailImage: null
            }
          }
        })
      )

      setRoomTypes(roomTypesWithImages)
      console.log('✅ Loaded room types with images from API:', roomTypesWithImages.length)
      
    } catch (err) {
      console.error('❌ API Error fetching room types:', err)
      if (err.response) {
        setError(`API Error: ${err.response.status} - ${err.response.statusText}`)
      } else if (err.request) {
        setError('Network Error: Unable to connect to server')
      } else {
        setError(`Error: ${err.message}`)
      }
      setRoomTypes([])
    } finally {
      setLoading(false)
    }
  }

  // Create room type via API
  const createRoomType = async (roomTypeData) => {
    try {
      console.log('🚀 Creating room type:', roomTypeData)
      const response = await axios.post('/roomtypes', roomTypeData)
      console.log('✅ Room type created:', response.data)
      return response.data
    } catch (err) {
      console.error('❌ Error creating room type:', err)
      throw err
    }
  }

  // Update room type via API
  const updateRoomType = async (id, roomTypeData) => {
    try {
      console.log('🚀 Updating room type:', id, roomTypeData)
      const response = await axios.put(`/roomtypes/${id}`, roomTypeData)
      console.log('✅ Room type updated:', response.data)
      return response.data
    } catch (err) {
      console.error('❌ Error updating room type:', err)
      throw err
    }
  }

  // Delete room type via API
  const deleteRoomType = async (id) => {
    try {
      console.log('🚀 Deleting room type:', id)
      const response = await axios.delete(`/roomtypes/${id}`)
      console.log('✅ Room type deleted:', response.data)
      return response.data
    } catch (err) {
      console.error('❌ Error deleting room type:', err)
      throw err
    }
  }

  // Form validation
  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Room type name is required'
    if (!formData.hotelId) newErrors.hotelId = 'Hotel is required'
    if (formData.maxOccupancy === '' || parseInt(formData.maxOccupancy) <= 0) newErrors.maxOccupancy = 'Valid max occupancy is required'
    if (formData.maximumAdults === '' || parseInt(formData.maximumAdults) < 0) newErrors.maximumAdults = 'Valid max adults is required'
    if (formData.maximumChildren === '' || parseInt(formData.maximumChildren) < 0) newErrors.maximumChildren = 'Valid max children is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Create/Update room type
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      setError('')
      
      // Prepare API data - only existing fields
      const apiData = {
        typeName: formData.name,
        description: formData.description || '',
        hotelId: formData.hotelId,
        maxOccupancy: parseInt(formData.maxOccupancy),
        maximumAdults: parseInt(formData.maximumAdults),
        maximumChildren: parseInt(formData.maximumChildren),
        isActive: !!formData.isActive
      }
      
      if (editingId) {
        // Update existing via API
        const result = await updateRoomType(editingId, apiData)
        const updated = result?.data || result?.Data || result
        if (updated?.code || updated?.Code) {
          setFormData(prev => ({ ...prev, code: updated.code || updated.Code }))
        }
        setSuccess('Room type updated successfully!')
      } else {
        // Create new via API
        const result = await createRoomType(apiData)
        const created = result?.data || result?.Data || result
        if (created?.code || created?.Code) {
          setFormData(prev => ({ ...prev, code: created.code || created.Code }))
        }
        setSuccess('Room type created successfully!')
      }
      
      // Refresh the list from API
      await fetchRoomTypes()
      
      setShowForm(false)
      resetForm()
    } catch (err) {
      console.error('Error saving room type:', err)
      if (err.response) {
        setError(`API Error: ${err.response.status} - ${err.response.data?.message || err.response.statusText}`)
      } else {
        setError('Failed to save room type. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Delete room type
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room type?')) return

    try {
      setLoading(true)
      // Delete via API
      await deleteRoomType(id)
      setSuccess('Room type deleted successfully!')
      
      // Refresh the list from API
      await fetchRoomTypes()
    } catch (err) {
      console.error('Error deleting room type:', err)
      if (err.response) {
        setError(`API Error: ${err.response.status} - ${err.response.data?.message || err.response.statusText}`)
      } else {
        setError('Failed to delete room type. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Edit room type
  const handleEdit = (roomType) => {
    const resolvedHotelId = roomType.HotelId || roomType.hotelId || roomType.hotel?.id || roomType.hotel?.Id || null
    const resolvedHotelName =
      roomType.hotel?.name ||
      roomType.hotel?.Name ||
      roomType.HotelName ||
      roomType.hotelName ||
      hotels.find(h => (h.Id || h.id) === resolvedHotelId)?.HotelName ||
      hotels.find(h => (h.Id || h.id) === resolvedHotelId)?.hotelName ||
      ''

    setFormData({
      name: roomType.Name || roomType.name || '',
      code: roomType.Code || roomType.code || '',
      description: roomType.Description || roomType.description || '',
      hotelId: resolvedHotelId,
      maxOccupancy: (roomType.MaxOccupancy ?? roomType.maxOccupancy ?? 1).toString(),
      maximumAdults: (roomType.MaximumAdults ?? roomType.maximumAdults ?? 1).toString(),
      maximumChildren: (roomType.MaximumChildren ?? roomType.maximumChildren ?? 0).toString(),
      isActive: (roomType.isActive ?? roomType.IsActive) !== false
    })
    setHotelSearch(resolvedHotelName)
    setShowHotelDropdown(false)
    setEditingId(roomType.id || roomType.Id)
    setShowForm(true)
    setErrors({})
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      hotelId: null,
      maxOccupancy: '1',
      maximumAdults: '1',
      maximumChildren: '0',
      isActive: true
    })
    setHotelSearch('')
    setShowHotelDropdown(false)
    setEditingId(null)
    setErrors({})
  }

  // Filter room types
  const filteredRoomTypes = roomTypes.filter(roomType => {
    const matchesRoomTypeSearch =
      (roomType.name || roomType.Name || '')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (roomType.code || roomType.Code || '')?.toLowerCase().includes(searchTerm.toLowerCase())

    const resolvedHotelName =
      roomType.hotel?.name ||
      roomType.hotel?.Name ||
      roomType.HotelName ||
      roomType.hotelName ||
      ''

    const matchesHotelFilter = !hotelFilter.trim()
      ? true
      : resolvedHotelName.toLowerCase().includes(hotelFilter.toLowerCase())

    return matchesRoomTypeSearch && matchesHotelFilter
  })

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('')
        setError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  return (
    <div className="w-full px-3 py-4 sm:px-4 sm:py-4 md:px-6 md:py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-sm text-gray-500">
            <HomeIcon className="h-4 w-4 mr-1" />
            <span>Dashboard</span>
            <span className="mx-2">/</span>
            <span>Rooms Management</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Room Types</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-[1.75rem] shadow-lg mb-6">
        <div className="px-6 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-3xl font-bold text-white mb-2">Room Types</h1>
              <p className="text-blue-100">Manage hotel room categories and rates</p>
              <p className="text-blue-200 text-sm mt-1">Connected to Database: {roomTypes.length} room types</p>
            </div>
            <button
              onClick={() => {
                resetForm()
                setShowForm(true)
              }}
              className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-semibold hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Room Type</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          {success}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
          <XCircleIcon className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Search */}
      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search room types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by hotel name..."
              value={hotelFilter}
              onChange={(e) => setHotelFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Room Types Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-6 py-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Room Type List</h2>
              <p className="text-sm text-slate-500">Professional view of room types, capacity, images, and status</p>
            </div>
            <div className="text-sm font-medium text-slate-500">{filteredRoomTypes.length} record(s)</div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full divide-y divide-slate-200">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Hotel</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Room Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Code</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Occupancy</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Description</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Images</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading room types...</p>
                  </td>
                </tr>
              ) : filteredRoomTypes.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    {error ? 'Error loading room types' : 'No room types found'}
                  </td>
                </tr>
              ) : (
                filteredRoomTypes.map((roomType, index) => (
                  <tr key={roomType.id || roomType.Id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'} transition hover:bg-blue-50/60`}>
                    <td className="px-6 py-4 align-top">
                      <div className="text-sm font-semibold text-slate-900">{roomType.hotel?.name || roomType.hotel?.Name || roomType.HotelName || roomType.hotelName || '-'}</div>
                      <div className="text-xs text-slate-500">Hotel property</div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="text-sm font-semibold text-slate-900">{roomType.name || roomType.Name}</div>
                      <div className="mt-1 text-xs text-slate-500">Room category</div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="text-sm font-medium text-slate-900">{roomType.code || roomType.Code || '-'}</div>
                      <div className="mt-1 text-xs text-slate-500">Auto / configured code</div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="space-y-1 text-sm text-slate-700">
                        <div><span className="font-semibold text-slate-900">Max:</span> {roomType.maxOccupancy ?? roomType.MaxOccupancy ?? '-'}</div>
                        <div><span className="font-semibold text-slate-900">Adults:</span> {roomType.maximumAdults ?? roomType.MaximumAdults ?? '-'}</div>
                        <div><span className="font-semibold text-slate-900">Children:</span> {roomType.maximumChildren ?? roomType.MaximumChildren ?? '-'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top max-w-[320px]">
                      <div className="line-clamp-3 text-sm leading-6 text-slate-700 whitespace-pre-wrap break-words">{roomType.description || roomType.Description || '-'}</div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-4">
                        <div 
                          className="h-16 w-24 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm cursor-pointer transition hover:shadow-md"
                          onClick={() => navigate(`/rooms-management/room-types/${roomType.id || roomType.Id}/images`)}
                          title={`View images for ${roomType.name || roomType.Name}`}
                        >
                          {roomType.thumbnailImage && (roomType.thumbnailImage.thumbnailPath || roomType.thumbnailImage.imagePath) ? (
                            <img 
                              src={roomType.thumbnailImage.thumbnailPath || roomType.thumbnailImage.imagePath}
                              alt={roomType.thumbnailImage.altText || `${roomType.name || roomType.Name} thumbnail`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.nextSibling.style.display = 'flex'
                              }}
                            />
                          ) : null}
                          <div className={`${roomType.thumbnailImage && (roomType.thumbnailImage.thumbnailPath || roomType.thumbnailImage.imagePath) ? 'hidden' : 'flex'} items-center justify-center h-full w-full`}>
                            <PhotoIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        </div>
                        <div className="min-w-0 text-xs text-slate-500">
                          <div className="font-semibold text-slate-900">{roomType.imageCount} images</div>
                          <button
                            onClick={() => navigate(`/rooms-management/room-types/${roomType.id || roomType.Id}/images`)}
                            className="mt-1 flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <EyeIcon className="h-3 w-3 mr-1" />
                            View Gallery
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        (roomType.isActive ?? roomType.IsActive)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {(roomType.isActive ?? roomType.IsActive) ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(roomType)}
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 hover:text-blue-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(roomType.id || roomType.Id)}
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-900"
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
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingId ? 'Edit Room Type' : 'Add New Room Type'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hotel *</label>
                    <div className="relative hotel-dropdown">
                      <input
                        type="text"
                        value={hotelSearch}
                        onChange={(e) => {
                          const value = e.target.value
                          setHotelSearch(value)
                          setShowHotelDropdown(true)

                          setFormData(prev => ({ ...prev, hotelId: null }))
                        }}
                        onFocus={() => {
                          setShowHotelDropdown(true)
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.hotelId ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Search hotel"
                      />

                      {showHotelDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {hotels.length > 0 ? (
                            <>
                              <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                                {hotels.length} hotel(s) found
                              </div>
                              {hotels
                                .filter(h => {
                                  const name = (h.HotelName || h.hotelName || '').toLowerCase()
                                  return !hotelSearch.trim() ? true : name.includes(hotelSearch.toLowerCase())
                                })
                                .map((h) => (
                                  <div
                                    key={h.Id || h.id}
                                    onClick={() => handleHotelSelect(h)}
                                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                  >
                                    <div className="text-sm text-gray-900">{h.HotelName || h.hotelName}</div>
                                  </div>
                                ))}
                            </>
                          ) : (
                            <div className="px-4 py-3 text-gray-500 text-center">
                              No hotels found
                            </div>
                          )}

                          <div
                            onClick={() => {
                              setHotelSearch('')
                              setFormData(prev => ({ ...prev, hotelId: null }))
                            }}
                            className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer border-t"
                          >
                            Clear Selection
                          </div>
                        </div>
                      )}
                    </div>
                    {errors.hotelId && <p className="text-red-500 text-xs mt-1">{errors.hotelId}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Type Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Standard Room"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Type Code</label>
                    <input
                      type="text"
                      value={formData.code}
                      readOnly
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        'border-gray-300 bg-gray-50'
                      }`}
                      placeholder="Auto-generated"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Occupancy *</label>
                    <select
                      value={formData.maxOccupancy}
                      onChange={(e) => setFormData({ ...formData, maxOccupancy: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.maxOccupancy ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      {Array.from({ length: 9 }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n.toString()}>{n}</option>
                      ))}
                    </select>
                    {errors.maxOccupancy && <p className="text-red-500 text-xs mt-1">{errors.maxOccupancy}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Adults *</label>
                    <select
                      value={formData.maximumAdults}
                      onChange={(e) => setFormData({ ...formData, maximumAdults: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.maximumAdults ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      {Array.from({ length: 9 }, (_, i) => i).map(n => (
                        <option key={n} value={n.toString()}>{n}</option>
                      ))}
                    </select>
                    {errors.maximumAdults && <p className="text-red-500 text-xs mt-1">{errors.maximumAdults}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Children *</label>
                    <select
                      value={formData.maximumChildren}
                      onChange={(e) => setFormData({ ...formData, maximumChildren: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.maximumChildren ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      {Array.from({ length: 9 }, (_, i) => i).map(n => (
                        <option key={n} value={n.toString()}>{n}</option>
                      ))}
                    </select>
                    {errors.maximumChildren && <p className="text-red-500 text-xs mt-1">{errors.maximumChildren}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Room type description..."
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingId ? 'Update' : 'Create')}
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

export default RoomTypes
