import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  HomeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const ExtraBedMaster = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [extraBeds, setExtraBeds] = useState([
    {
      id: 1,
      roomTypeId: 1,
      roomTypeName: 'Deluxe Room',
      bedType: 'Single',
      charge: 1500,
      maxExtraBeds: 2,
      description: 'Single extra bed for deluxe rooms',
      isActive: true
    },
    {
      id: 2,
      roomTypeId: 1,
      roomTypeName: 'Deluxe Room',
      bedType: 'Double',
      charge: 2500,
      maxExtraBeds: 1,
      description: 'Double extra bed for deluxe rooms',
      isActive: true
    },
    {
      id: 3,
      roomTypeId: 2,
      roomTypeName: 'Standard Room',
      bedType: 'Single',
      charge: 1200,
      maxExtraBeds: 1,
      description: 'Single extra bed for standard rooms',
      isActive: true
    },
    {
      id: 4,
      roomTypeId: 3,
      roomTypeName: 'Suite',
      bedType: 'Queen',
      charge: 3000,
      maxExtraBeds: 2,
      description: 'Queen size extra bed for suites',
      isActive: true
    },
    {
      id: 5,
      roomTypeId: 2,
      roomTypeName: 'Standard Room',
      bedType: 'Sofa Bed',
      charge: 1000,
      maxExtraBeds: 1,
      description: 'Sofa bed for standard rooms',
      isActive: true
    }
  ])
  const [roomTypes, setRoomTypes] = useState([
    { id: 1, name: 'Deluxe Room', code: 'DLX' },
    { id: 2, name: 'Standard Room', code: 'STD' },
    { id: 3, name: 'Suite', code: 'STE' },
    { id: 4, name: 'Executive Room', code: 'EXE' },
    { id: 5, name: 'Family Room', code: 'FAM' }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    roomTypeId: '',
    bedType: 'Single',
    charge: '',
    maxExtraBeds: '',
    description: ''
  })

  const [errors, setErrors] = useState({})

  const bedTypes = ['Single', 'Double', 'Queen', 'King', 'Sofa Bed', 'Rollaway']

  // Fetch extra beds and room types from API
  const fetchExtraBeds = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/ExtraBeds')
      
      if (response.data && response.data.success) {
        setExtraBeds(response.data.data)
        setSuccess('Extra beds loaded successfully')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to fetch extra beds')
      }
    } catch (err) {
      console.error('Error fetching extra beds:', err)
      setError('Error loading extra beds. Please try again.')
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
    // API calls disabled to show mock data
    console.log('ExtraBedMaster component loaded with mock data:', extraBeds.length, 'extra beds')
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

    if (!formData.roomTypeId) {
      newErrors.roomTypeId = 'Room type is required'
    }

    if (!formData.charge || parseFloat(formData.charge) <= 0) {
      newErrors.charge = 'Valid charge amount is required'
    }

    if (!formData.maxExtraBeds || parseInt(formData.maxExtraBeds) <= 0) {
      newErrors.maxExtraBeds = 'Valid max extra beds is required'
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
      const extraBedData = {
        roomTypeId: parseInt(formData.roomTypeId),
        bedType: formData.bedType,
        charge: parseFloat(formData.charge),
        maxExtraBeds: parseInt(formData.maxExtraBeds),
        description: formData.description || ''
      }

      console.log('Sending extra bed data:', extraBedData)

      if (editingId) {
        await axios.put(`/ExtraBeds/${editingId}`, extraBedData)
        setSuccess('Extra bed updated successfully!')
      } else {
        await axios.post('/ExtraBeds', extraBedData)
        setSuccess('Extra bed added successfully!')
      }
      
      handleCancel()
      fetchExtraBeds()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error saving extra bed:', error)
      console.error('Error response:', error.response?.data)
      const errorMessage = error.response?.data?.message || error.response?.data?.errors || 'Error saving extra bed. Please try again.'
      setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (extraBed) => {
    setFormData({
      roomTypeId: extraBed.roomTypeId?.toString() || '',
      bedType: extraBed.bedType,
      charge: extraBed.charge?.toString() || '',
      maxExtraBeds: extraBed.maxExtraBeds?.toString() || '',
      description: extraBed.description || ''
    })
    setEditingId(extraBed.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this extra bed configuration?')) {
      try {
        setLoading(true)
        await axios.delete(`/ExtraBeds/${id}`)
        setSuccess('Extra bed deleted successfully!')
        fetchExtraBeds()
        setTimeout(() => setSuccess(''), 3000)
      } catch (error) {
        console.error('Error deleting extra bed:', error)
        setError('Error deleting extra bed. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      roomTypeId: '',
      bedType: 'Single',
      charge: '',
      maxExtraBeds: '',
      description: ''
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredExtraBeds = extraBeds.filter(extraBed =>
    extraBed.bedType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getRoomTypeName(extraBed.roomTypeId)?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoomTypeName = (roomTypeId) => {
    const roomType = roomTypes.find(rt => rt.id === roomTypeId)
    return roomType ? roomType.name : 'Unknown'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Extra Bed Master</h1>
            <p className="text-purple-100">Manage extra bed configurations and charges for room types</p>
          </div>
          <HomeIcon className="h-12 w-12 text-purple-200" />
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
            placeholder="Search extra beds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Extra Bed
        </button>
      </div>

      {/* Extra Bed Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {editingId ? 'Edit Extra Bed' : 'Add New Extra Bed'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Room Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="roomTypeId"
                  value={formData.roomTypeId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.roomTypeId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select room type</option>
                  {roomTypes.map(roomType => (
                    <option key={roomType.id} value={roomType.id}>
                      {roomType.name}
                    </option>
                  ))}
                </select>
                {errors.roomTypeId && (
                  <p className="mt-1 text-sm text-red-600">{errors.roomTypeId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bed Type
                </label>
                <select
                  name="bedType"
                  value={formData.bedType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {bedTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Charge (Rs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="charge"
                  value={formData.charge}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                    errors.charge ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter charge amount"
                />
                {errors.charge && (
                  <p className="mt-1 text-sm text-red-600">{errors.charge}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Extra Beds <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="maxExtraBeds"
                  value={formData.maxExtraBeds}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                    errors.maxExtraBeds ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter max extra beds"
                />
                {errors.maxExtraBeds && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxExtraBeds}</p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter description"
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
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingId ? 'Update Extra Bed' : 'Add Extra Bed')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Extra Beds Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Extra Beds ({filteredExtraBeds.length})
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
                  Bed Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Charge
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Max Beds
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExtraBeds.map((extraBed) => (
                <tr key={extraBed.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getRoomTypeName(extraBed.roomTypeId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-800">
                      {extraBed.bedType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs {extraBed.charge?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {extraBed.maxExtraBeds}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(extraBed)}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(extraBed.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredExtraBeds.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    {loading ? 'Loading extra beds...' : 'No extra beds found'}
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

export default ExtraBedMaster
