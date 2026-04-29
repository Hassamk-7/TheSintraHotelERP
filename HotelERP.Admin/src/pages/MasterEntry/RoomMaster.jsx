import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  BuildingOfficeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const RoomMaster = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [rooms, setRooms] = useState([])
  const [roomTypes, setRoomTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomTypeId: '',
    floorNumber: '',
    status: 'Available',
    maxAdults: '',
    maxChildren: '',
    basePrice: '',
    description: '',
    features: []
  })

  const [errors, setErrors] = useState({})

  const roomStatuses = ['Available', 'Occupied', 'Maintenance', 'Out of Order', 'Cleaning']

  // Fetch rooms and room types from API
  const fetchRooms = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/Rooms')
      
      if (response.data && response.data.success) {
        setRooms(response.data.data)
        setSuccess('Rooms loaded successfully')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to fetch rooms')
      }
    } catch (err) {
      console.error('Error fetching rooms:', err)
      setError('Error loading rooms. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get('/RoomTypes')
      if (response.data && response.data.success) {
        setRoomTypes(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching room types:', err)
    }
  }

  useEffect(() => {
    fetchRooms()
    fetchRoomTypes()
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

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required'
    }

    if (!formData.roomTypeId) {
      newErrors.roomTypeId = 'Room type is required'
    }

    if (!formData.floorNumber.trim()) {
      newErrors.floorNumber = 'Floor number is required'
    }

    if (!formData.maxAdults || parseInt(formData.maxAdults) <= 0) {
      newErrors.maxAdults = 'Valid max adults is required'
    }

    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
      newErrors.basePrice = 'Valid base price is required'
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
      const roomData = {
        RoomNumber: formData.roomNumber,
        RoomTypeId: parseInt(formData.roomTypeId),
        FloorNumber: parseInt(formData.floorNumber),
        Status: formData.status,
        MaxAdults: parseInt(formData.maxAdults),
        MaxChildren: parseInt(formData.maxChildren) || 0,
        BasePrice: parseFloat(formData.basePrice),
        Description: formData.description || '',
        Features: formData.features || []
      }

      console.log('Sending room data:', roomData)

      if (editingId) {
        await axios.put(`/Rooms/${editingId}`, roomData)
        setSuccess('Room updated successfully!')
      } else {
        await axios.post('/Rooms', roomData)
        setSuccess('Room added successfully!')
      }
      
      handleCancel()
      fetchRooms()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error saving room:', error)
      console.error('Error response:', error.response?.data)
      const errorMessage = error.response?.data?.message || error.response?.data?.errors || 'Error saving room. Please try again.'
      setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (room) => {
    setFormData({
      roomNumber: room.roomNumber,
      roomTypeId: room.roomTypeId?.toString() || '',
      floorNumber: room.floorNumber?.toString() || '',
      status: room.status,
      maxAdults: room.maxAdults?.toString() || '',
      maxChildren: room.maxChildren?.toString() || '',
      basePrice: room.basePrice?.toString() || '',
      description: room.description || '',
      features: room.features ? room.features.split(',') : []
    })
    setEditingId(room.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        setLoading(true)
        await axios.delete(`/Rooms/${id}`)
        setSuccess('Room deleted successfully!')
        fetchRooms()
        setTimeout(() => setSuccess(''), 3000)
      } catch (error) {
        console.error('Error deleting room:', error)
        setError('Error deleting room. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      roomNumber: '',
      roomTypeId: '',
      floorNumber: '',
      status: 'Available',
      maxAdults: '',
      maxChildren: '',
      basePrice: '',
      description: '',
      features: []
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredRooms = rooms.filter(room =>
    room.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.floorNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.status?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoomTypeName = (roomTypeId) => {
    const roomType = roomTypes.find(rt => rt.id === roomTypeId)
    return roomType ? roomType.name : 'Unknown'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800'
      case 'Occupied': return 'bg-red-100 text-red-800'
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'Out of Order': return 'bg-gray-100 text-gray-800'
      case 'Cleaning': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Room Master</h1>
            <p className="text-indigo-100">Manage hotel rooms, floors, and room assignments</p>
          </div>
          <BuildingOfficeIcon className="h-12 w-12 text-indigo-200" />
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
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Room
        </button>
      </div>

      {/* Room Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {editingId ? 'Edit Room' : 'Add New Room'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Room Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    errors.roomNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter room number"
                />
                {errors.roomNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.roomNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Room Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="roomTypeId"
                  value={formData.roomTypeId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.roomTypeId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select room type</option>
                  {roomTypes.map(roomType => (
                    <option key={roomType.id} value={roomType.id}>
                      {roomType.name} - Rs {roomType.baseRate?.toLocaleString()}
                    </option>
                  ))}
                </select>
                {errors.roomTypeId && (
                  <p className="mt-1 text-sm text-red-600">{errors.roomTypeId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Floor Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="floorNumber"
                  value={formData.floorNumber}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    errors.floorNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter floor number (0 for ground floor)"
                />
                {errors.floorNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.floorNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {roomStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Adults <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="maxAdults"
                  value={formData.maxAdults}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    errors.maxAdults ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter max adults"
                />
                {errors.maxAdults && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxAdults}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Children
                </label>
                <input
                  type="number"
                  name="maxChildren"
                  value={formData.maxChildren}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter max children"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Base Price (Rs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    errors.basePrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter base price"
                />
                {errors.basePrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.basePrice}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter room description"
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
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingId ? 'Update Room' : 'Add Room')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rooms Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Rooms ({filteredRooms.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Rate
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
              {filteredRooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Room {room.roomNumber}</div>
                      <div className="text-sm text-gray-500">Floor: {room.floorNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getRoomTypeName(room.roomTypeId)}</div>
                    <div className="text-sm text-gray-500">Rs {room.basePrice?.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Adults: {room.maxAdults}, Children: {room.maxChildren}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.status)}`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(room)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRooms.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    {loading ? 'Loading rooms...' : 'No rooms found'}
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

export default RoomMaster
