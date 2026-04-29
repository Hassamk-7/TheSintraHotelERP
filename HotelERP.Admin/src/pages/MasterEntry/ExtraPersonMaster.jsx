import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  UserIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const ExtraPersonMaster = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [extraPersons, setExtraPersons] = useState([
    {
      id: 1,
      roomTypeId: 1,
      roomTypeName: 'Deluxe Room',
      ageGroup: 'Adult',
      minAge: 18,
      maxAge: 65,
      charge: 2000,
      description: 'Extra adult charge for deluxe rooms',
      isActive: true
    },
    {
      id: 2,
      roomTypeId: 1,
      roomTypeName: 'Deluxe Room',
      ageGroup: 'Child',
      minAge: 5,
      maxAge: 17,
      charge: 1000,
      description: 'Extra child charge for deluxe rooms',
      isActive: true
    },
    {
      id: 3,
      roomTypeId: 2,
      roomTypeName: 'Standard Room',
      ageGroup: 'Adult',
      minAge: 18,
      maxAge: 65,
      charge: 1500,
      description: 'Extra adult charge for standard rooms',
      isActive: true
    },
    {
      id: 4,
      roomTypeId: 2,
      roomTypeName: 'Standard Room',
      ageGroup: 'Child',
      minAge: 5,
      maxAge: 17,
      charge: 800,
      description: 'Extra child charge for standard rooms',
      isActive: true
    },
    {
      id: 5,
      roomTypeId: 3,
      roomTypeName: 'Suite',
      ageGroup: 'Adult',
      minAge: 18,
      maxAge: 65,
      charge: 3000,
      description: 'Extra adult charge for suites',
      isActive: true
    },
    {
      id: 6,
      roomTypeId: 1,
      roomTypeName: 'Deluxe Room',
      ageGroup: 'Infant',
      minAge: 0,
      maxAge: 4,
      charge: 0,
      description: 'No charge for infants in deluxe rooms',
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
    ageGroup: 'Adult',
    minAge: '',
    maxAge: '',
    charge: '',
    description: ''
  })

  const [errors, setErrors] = useState({})

  const ageGroups = ['Adult', 'Child', 'Infant', 'Senior', 'Teen']

  // Fetch extra persons and room types from API
  const fetchExtraPersons = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/ExtraPersons')
      
      if (response.data && response.data.success) {
        setExtraPersons(response.data.data)
        setSuccess('Extra person charges loaded successfully')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to fetch extra person charges')
      }
    } catch (err) {
      console.error('Error fetching extra persons:', err)
      setError('Error loading extra person charges. Please try again.')
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
    console.log('ExtraPersonMaster component loaded with mock data:', extraPersons.length, 'extra person charges')
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

    if (!formData.minAge || parseInt(formData.minAge) < 0) {
      newErrors.minAge = 'Valid minimum age is required'
    }

    if (!formData.maxAge || parseInt(formData.maxAge) < 0) {
      newErrors.maxAge = 'Valid maximum age is required'
    }

    if (parseInt(formData.minAge) > parseInt(formData.maxAge)) {
      newErrors.maxAge = 'Maximum age must be greater than minimum age'
    }

    if (!formData.charge || parseFloat(formData.charge) < 0) {
      newErrors.charge = 'Valid charge amount is required'
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
      const extraPersonData = {
        roomTypeId: parseInt(formData.roomTypeId),
        ageGroup: formData.ageGroup,
        minAge: parseInt(formData.minAge),
        maxAge: parseInt(formData.maxAge),
        charge: parseFloat(formData.charge),
        description: formData.description || ''
      }

      console.log('Sending extra person data:', extraPersonData)

      if (editingId) {
        await axios.put(`/ExtraPersons/${editingId}`, extraPersonData)
        setSuccess('Extra person charge updated successfully!')
      } else {
        await axios.post('/ExtraPersons', extraPersonData)
        setSuccess('Extra person charge added successfully!')
      }
      
      handleCancel()
      fetchExtraPersons()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error saving extra person:', error)
      console.error('Error response:', error.response?.data)
      const errorMessage = error.response?.data?.message || error.response?.data?.errors || 'Error saving extra person charge. Please try again.'
      setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (extraPerson) => {
    setFormData({
      roomTypeId: extraPerson.roomTypeId?.toString() || '',
      ageGroup: extraPerson.ageGroup,
      minAge: extraPerson.minAge?.toString() || '',
      maxAge: extraPerson.maxAge?.toString() || '',
      charge: extraPerson.charge?.toString() || '',
      description: extraPerson.description || ''
    })
    setEditingId(extraPerson.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this extra person charge?')) {
      try {
        setLoading(true)
        await axios.delete(`/ExtraPersons/${id}`)
        setSuccess('Extra person charge deleted successfully!')
        fetchExtraPersons()
        setTimeout(() => setSuccess(''), 3000)
      } catch (error) {
        console.error('Error deleting extra person:', error)
        setError('Error deleting extra person charge. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      roomTypeId: '',
      ageGroup: 'Adult',
      minAge: '',
      maxAge: '',
      charge: '',
      description: ''
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredExtraPersons = extraPersons.filter(extraPerson =>
    extraPerson.ageGroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getRoomTypeName(extraPerson.roomTypeId)?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoomTypeName = (roomTypeId) => {
    const roomType = roomTypes.find(rt => rt.id === roomTypeId)
    return roomType ? roomType.name : 'Unknown'
  }

  const getAgeGroupColor = (ageGroup) => {
    switch (ageGroup) {
      case 'Adult': return 'bg-blue-100 text-blue-800'
      case 'Child': return 'bg-green-100 text-green-800'
      case 'Infant': return 'bg-pink-100 text-pink-800'
      case 'Senior': return 'bg-purple-100 text-purple-800'
      case 'Teen': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Extra Person Master</h1>
            <p className="text-emerald-100">Manage extra person charges based on age groups and room types</p>
          </div>
          <UserIcon className="h-12 w-12 text-emerald-200" />
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
            placeholder="Search extra person charges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Extra Person Charge
        </button>
      </div>

      {/* Extra Person Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {editingId ? 'Edit Extra Person Charge' : 'Add New Extra Person Charge'}
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
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
                  Age Group
                </label>
                <select
                  name="ageGroup"
                  value={formData.ageGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {ageGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Minimum Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="minAge"
                  value={formData.minAge}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                    errors.minAge ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter minimum age"
                />
                {errors.minAge && (
                  <p className="mt-1 text-sm text-red-600">{errors.minAge}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Maximum Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="maxAge"
                  value={formData.maxAge}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                    errors.maxAge ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter maximum age"
                />
                {errors.maxAge && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxAge}</p>
                )}
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                    errors.charge ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter charge amount"
                />
                {errors.charge && (
                  <p className="mt-1 text-sm text-red-600">{errors.charge}</p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingId ? 'Update Charge' : 'Add Charge')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Extra Persons Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Extra Person Charges ({filteredExtraPersons.length})
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
                  Age Group
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Charge
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExtraPersons.map((extraPerson) => (
                <tr key={extraPerson.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getRoomTypeName(extraPerson.roomTypeId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getAgeGroupColor(extraPerson.ageGroup)}`}>
                      {extraPerson.ageGroup}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {extraPerson.minAge} - {extraPerson.maxAge} years
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs {extraPerson.charge?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(extraPerson)}
                        className="text-emerald-600 hover:text-emerald-900 p-1 rounded"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(extraPerson.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredExtraPersons.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    {loading ? 'Loading extra person charges...' : 'No extra person charges found'}
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

export default ExtraPersonMaster
