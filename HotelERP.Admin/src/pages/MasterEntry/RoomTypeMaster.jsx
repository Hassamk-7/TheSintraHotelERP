import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  CubeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const RoomTypeMaster = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roomTypes, setRoomTypes] = useState([])
  const [hotels, setHotels] = useState([])
  const [hotelSearch, setHotelSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    hotelId: null,
    maximumAdults: '1',
    maximumChildren: '0',
    extraBedAllowed: false,
    extraBedCharge: '',
    description: ''
  })

  const [errors, setErrors] = useState({})

  // Fetch room types from API
  const fetchRoomTypes = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/RoomTypes')
      
      if (response.data && response.data.success) {
        setRoomTypes(response.data.data)
        setSuccess('Room types loaded successfully')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to fetch room types')
      }
    } catch (err) {
      console.error('Error fetching room types:', err)
      setError('Error loading room types. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchHotels = async () => {
    try {
      const response = await axios.get('/Hotels')
      if (response.data && response.data.success) {
        setHotels(response.data.data || [])
      }
    } catch (err) {
      console.error('Error fetching hotels:', err)
    }
  }

  useEffect(() => {
    fetchRoomTypes()
    fetchHotels()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Room type name is required'
    }

    if (!formData.hotelId) {
      newErrors.hotelId = 'Hotel is required'
    }

    if (formData.maximumAdults === '' || parseInt(formData.maximumAdults) < 0) {
      newErrors.maximumAdults = 'Valid max adults is required'
    }

    if (formData.maximumChildren === '' || parseInt(formData.maximumChildren) < 0) {
      newErrors.maximumChildren = 'Valid max children is required'
    }

    if (formData.extraBedAllowed && (!formData.extraBedCharge || parseFloat(formData.extraBedCharge) < 0)) {
      newErrors.extraBedCharge = 'Valid extra bed charge is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const roomTypeData = {
        Name: formData.name,
        Description: formData.description || '',
        HotelId: formData.hotelId,
        MaximumAdults: parseInt(formData.maximumAdults),
        MaximumChildren: parseInt(formData.maximumChildren),
        ExtraBedAllowed: !!formData.extraBedAllowed,
        ExtraBedCharge: formData.extraBedAllowed ? parseFloat(formData.extraBedCharge || 0) : 0
      }

      console.log('Sending room type data:', roomTypeData)

      if (editingId) {
        await axios.put(`/RoomTypes/${editingId}`, roomTypeData)
        setSuccess('Room type updated successfully!')
      } else {
        await axios.post('/RoomTypes', roomTypeData)
        setSuccess('Room type added successfully!')
      }
      
      handleCancel()
      fetchRoomTypes()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error saving room type:', error)
      console.error('Error response:', error.response?.data)
      const errorMessage = error.response?.data?.message || error.response?.data?.errors || 'Error saving room type. Please try again.'
      setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage)
    } finally {
      setLoading(false)
    }
  }

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
      hotelId: resolvedHotelId,
      maximumAdults: (roomType.MaximumAdults ?? roomType.maximumAdults ?? 1).toString(),
      maximumChildren: (roomType.MaximumChildren ?? roomType.maximumChildren ?? 0).toString(),
      extraBedAllowed: roomType.ExtraBedAllowed ?? roomType.extraBedAllowed ?? false,
      extraBedCharge: (roomType.ExtraBedCharge ?? roomType.extraBedCharge ?? '').toString(),
      description: roomType.Description || roomType.description || ''
    })
    setHotelSearch(resolvedHotelName)
    setEditingId(roomType.id || roomType.Id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room type?')) {
      try {
        setLoading(true)
        await axios.delete(`/RoomTypes/${id}`)
        setSuccess('Room type deleted successfully!')
        fetchRoomTypes()
        setTimeout(() => setSuccess(''), 3000)
      } catch (error) {
        console.error('Error deleting room type:', error)
        setError('Error deleting room type. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      name: '',
      code: '',
      hotelId: null,
      maximumAdults: '1',
      maximumChildren: '0',
      extraBedAllowed: false,
      extraBedCharge: '',
      description: ''
    })
    setHotelSearch('')
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredRoomTypes = roomTypes.filter(roomType =>
    (roomType.name || roomType.Name || '')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (roomType.code || roomType.Code || '')?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Room Type Master</h1>
            <p className="text-orange-100">Manage room types, rates, and occupancy settings</p>
          </div>
          <CubeIcon className="h-12 w-12 text-orange-200" />
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search room types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Room Type
        </button>
      </div>

      {/* Room Type Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {editingId ? 'Edit Room Type' : 'Add New Room Type'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hotel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={hotelSearch}
                  onChange={(e) => {
                    const value = e.target.value
                    setHotelSearch(value)

                    const match = hotels.find(h => {
                      const name = h.HotelName || h.hotelName || ''
                      return name.toLowerCase() === value.toLowerCase()
                    })

                    if (match) {
                      setFormData(prev => ({
                        ...prev,
                        hotelId: match.Id || match.id
                      }))
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        hotelId: null
                      }))
                    }
                  }}
                  list="hotels-list"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.hotelId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Search hotel"
                />
                <datalist id="hotels-list">
                  {hotels.map((h) => (
                    <option key={h.Id || h.id} value={h.HotelName || h.hotelName} />
                  ))}
                </datalist>
                {errors.hotelId && (
                  <p className="mt-1 text-sm text-red-600">{errors.hotelId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Room Type Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter room type name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Room Type Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  readOnly
                  className="w-full px-4 py-3 border rounded-lg bg-gray-50 border-gray-300 text-gray-700"
                  placeholder="Auto-generated"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Adults <span className="text-red-500">*</span>
                </label>
                <select
                  name="maximumAdults"
                  value={formData.maximumAdults}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.maximumAdults ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {Array.from({ length: 9 }, (_, i) => i).map(n => (
                    <option key={n} value={n.toString()}>{n}</option>
                  ))}
                </select>
                {errors.maximumAdults && (
                  <p className="mt-1 text-sm text-red-600">{errors.maximumAdults}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Children <span className="text-red-500">*</span>
                </label>
                <select
                  name="maximumChildren"
                  value={formData.maximumChildren}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.maximumChildren ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {Array.from({ length: 9 }, (_, i) => i).map(n => (
                    <option key={n} value={n.toString()}>{n}</option>
                  ))}
                </select>
                {errors.maximumChildren && (
                  <p className="mt-1 text-sm text-red-600">{errors.maximumChildren}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="extraBedAllowed"
                    checked={formData.extraBedAllowed}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm font-semibold text-gray-700">
                    Extra Bed Allowed
                  </label>
                </div>
              </div>

              {formData.extraBedAllowed && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Extra Bed Charge (Rs)
                  </label>
                  <input
                    type="number"
                    name="extraBedCharge"
                    value={formData.extraBedCharge}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                      errors.extraBedCharge ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter extra bed charge"
                  />
                  {errors.extraBedCharge && (
                    <p className="mt-1 text-sm text-red-600">{errors.extraBedCharge}</p>
                  )}
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter room type description"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingId ? 'Update Room Type' : 'Add Room Type')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Room Types Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Room Types ({filteredRoomTypes.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hotel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Occupancy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoomTypes.map((roomType) => (
                <tr key={roomType.id || roomType.Id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{roomType.name || roomType.Name}</div>
                      <div className="text-sm text-gray-500">{roomType.code || roomType.Code}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {roomType.hotel?.name ||
                        roomType.hotel?.Name ||
                        roomType.HotelName ||
                        roomType.hotelName ||
                        '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Adults: {roomType.maximumAdults ?? roomType.MaximumAdults ?? 0}
                    </div>
                    <div className="text-sm text-gray-500">
                      Children: {roomType.maximumChildren ?? roomType.MaximumChildren ?? 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      (roomType.isActive ?? roomType.IsActive) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {(roomType.isActive ?? roomType.IsActive) ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(roomType)}
                        className="text-orange-600 hover:text-orange-900 p-1 rounded"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(roomType.id || roomType.Id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRoomTypes.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    {loading ? 'Loading room types...' : 'No room types found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default RoomTypeMaster
