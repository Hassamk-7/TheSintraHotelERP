import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

const HallMaster = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    hallName: '',
    hallCode: '',
    description: '',
    capacity: '',
    area: '',
    location: '',
    chargePerDay: '',
    facilities: '',
    isActive: true
  })

  const [halls, setHalls] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [errors, setErrors] = useState({})

  // Fetch halls from API
  const fetchHalls = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/Halls')
      
      if (response.data && response.data.success) {
        setHalls(response.data.data)
        setSuccess('Halls loaded successfully')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to fetch halls')
      }
    } catch (err) {
      console.error('Error fetching halls:', err)
      setError('Error loading halls. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHalls()
  }, [])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.hallName.trim()) {
      newErrors.hallName = 'Hall name is required'
    }

    if (!formData.hallCode.trim()) {
      newErrors.hallCode = 'Hall code is required'
    }

    if (!formData.capacity || parseInt(formData.capacity) <= 0) {
      newErrors.capacity = 'Valid capacity is required'
    }

    if (!formData.chargePerHour || parseFloat(formData.chargePerHour) <= 0) {
      newErrors.chargePerHour = 'Valid hourly charge is required'
    }

    if (!formData.chargePerDay || parseFloat(formData.chargePerDay) <= 0) {
      newErrors.chargePerDay = 'Valid daily charge is required'
    }

    // Check for duplicate code
    const existingHall = halls.find(hall => 
      hall.hallCode.toLowerCase() === formData.hallCode.toLowerCase() && 
      hall.id !== editingId
    )
    if (existingHall) {
      newErrors.hallCode = 'Hall code already exists'
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
      const HallData = {
        Name: formData.hallName,
        Code: formData.hallCode.toUpperCase(),
        Description: formData.description || '',
        Capacity: parseInt(formData.capacity),
        HourlyRate: parseFloat(formData.chargePerHour),
        DailyRate: parseFloat(formData.chargePerDay),
        Location: formData.location || '',
        HallType: 'Event Hall',
        HasAC: formData.facilities.includes('AC'),
        HasProjector: formData.facilities.includes('Projector'),
        HasSoundSystem: formData.facilities.includes('Sound System'),
        Amenities: formData.facilities.split(',').map(f => f.trim()).filter(f => f)
      }

      console.log('Sending Hall data:', HallData)

      if (editingId) {
        await axios.put(`/Halls/${editingId}`, HallData)
        setSuccess('Hall updated successfully!')
      } else {
        await axios.post('/Halls', HallData)
        setSuccess('Hall added successfully!')
      }
      
      handleCancel()
      fetchHalls()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error saving Hall:', error)
      console.error('Error response:', error.response?.data)
      const errorMessage = error.response?.data?.message || error.response?.data?.errors || 'Error saving Hall. Please try again.'
      setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (hall) => {
    setFormData({
      hallName: hall.name || hall.hallName,
      hallCode: hall.code || hall.hallCode,
      description: hall.description || '',
      capacity: (hall.capacity || 0).toString(),
      area: hall.area || '',
      location: hall.location || '',
      chargePerHour: (hall.hourlyRate || hall.chargePerHour || 0).toString(),
      chargePerDay: (hall.dailyRate || hall.chargePerDay || 0).toString(),
      facilities: hall.amenities || hall.facilities || '',
      isActive: hall.isAvailable !== undefined ? hall.isAvailable : hall.isActive
    })
    setEditingId(hall.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hall?')) {
      try {
        setLoading(true)
        await axios.delete(`/Halls/${id}`)
        setSuccess('Hall deleted successfully!')
        fetchHalls()
        setTimeout(() => setSuccess(''), 3000)
      } catch (error) {
        console.error('Error deleting hall:', error)
        setError('Error deleting hall. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      hallName: '',
      hallCode: '',
      description: '',
      capacity: '',
      area: '',
      location: '',
      chargePerHour: '',
      chargePerDay: '',
      facilities: '',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredHalls = halls.filter(hall =>
    (hall.name || hall.hallName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (hall.code || hall.hallCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (hall.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Hall Master</h1>
            <p className="text-emerald-100">Manage event halls and conference rooms</p>
          </div>
          <BuildingOfficeIcon className="h-12 w-12 text-emerald-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-emerald-100 rounded-lg p-3">
              <BuildingOfficeIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Halls</p>
              <p className="text-2xl font-bold text-gray-900">{halls.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Halls</p>
              <p className="text-2xl font-bold text-gray-900">
                {halls.filter(hall => hall.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Capacity</p>
              <p className="text-2xl font-bold text-gray-900">
                {halls.reduce((sum, hall) => sum + hall.capacity, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Daily Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {halls.length === 0 ? '0' : Math.round(
                  halls.reduce((sum, hall) => sum + Number(hall.dailyRate ?? hall.chargePerDay ?? 0), 0) / halls.length
                ).toLocaleString()}
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
            placeholder="Search halls..."
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
          Add Hall
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Hall' : 'Add New Hall'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hall Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.hallName}
                  onChange={(e) => setFormData({...formData, hallName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                    errors.hallName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter hall name"
                />
                {errors.hallName && (
                  <p className="mt-1 text-sm text-red-600">{errors.hallName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hall Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.hallCode}
                  onChange={(e) => setFormData({...formData, hallCode: e.target.value.toUpperCase()})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                    errors.hallCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter hall code"
                />
                {errors.hallCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.hallCode}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                    errors.capacity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter capacity"
                />
                {errors.capacity && (
                  <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Area
                </label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  placeholder="e.g., 1000 sq ft"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  placeholder="e.g., Ground Floor"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Charge Per Hour (Rs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.chargePerHour}
                  onChange={(e) => setFormData({...formData, chargePerHour: e.target.value})}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                    errors.chargePerHour ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter hourly charge"
                />
                {errors.chargePerHour && (
                  <p className="mt-1 text-sm text-red-600">{errors.chargePerHour}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Charge Per Day (Rs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.chargePerDay}
                  onChange={(e) => setFormData({...formData, chargePerDay: e.target.value})}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                    errors.chargePerDay ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter daily charge"
                />
                {errors.chargePerDay && (
                  <p className="mt-1 text-sm text-red-600">{errors.chargePerDay}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Facilities
                </label>
                <textarea
                  value={formData.facilities}
                  onChange={(e) => setFormData({...formData, facilities: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  placeholder="e.g., AC, Sound System, Projector, WiFi"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
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
                    {editingId ? 'Update' : 'Save'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Halls List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Halls ({filteredHalls.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hall Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity & Area
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Charges
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
              {filteredHalls.map((hall) => (
                <tr key={hall.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{hall.name || hall.hallName}</div>
                      <div className="text-sm text-gray-500">{hall.code || hall.hallCode}</div>
                      <div className="text-sm text-gray-500">{hall.description || ''}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{hall.capacity ?? 0} people</div>
                    <div className="text-sm text-gray-500">{hall.area || ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{hall.location || ''}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">Rs {Number(hall.hourlyRate ?? hall.chargePerHour ?? 0).toLocaleString()}/hour</div>
                    <div className="text-sm text-gray-500">Rs {Number(hall.dailyRate ?? hall.chargePerDay ?? 0).toLocaleString()}/day</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      (hall.isActive ?? hall.isAvailable ?? false) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {(hall.isActive ?? hall.isAvailable ?? false) ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(hall)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(hall.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredHalls.length === 0 && (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No halls found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new hall.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HallMaster;
