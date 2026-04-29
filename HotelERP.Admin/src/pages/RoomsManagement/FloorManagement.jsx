import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  BuildingOffice2Icon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  HomeIcon
} from '@heroicons/react/24/outline'

const FloorManagement = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    floorNumber: '',
    floorName: '',
    description: '',
    totalRooms: '',
    availableRooms: '',
    occupiedRooms: '',
    outOfOrderRooms: '',
    floorManager: '',
    housekeepingSupervisor: '',
    hasElevatorAccess: false,
    hasFireExit: false,
    safetyFeatures: '',
    specialFeatures: '',
    floorPlanPath: '',
    floorImage: null,
    isActive: true
  })

  const [floors, setFloors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})

  // Load floors on component mount
  useEffect(() => {
    fetchFloors()
  }, [])

  // Fetch floors from API - PURE DYNAMIC API CALL with mock fallback
  const fetchFloors = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/RoomsManagement/floor-management')
      
      if (response.data && response.data.success) {
        setFloors(response.data.data)
        console.log(`✅ Loaded ${response.data.data.length} floors from database`)
      } else {
        setError('No floors data received from API')
        setFloors([])
      }
    } catch (err) {
      console.error('Error fetching floors:', err)
      setError('Failed to load floors. Please check API connection.')
      setFloors([])
    } finally {
      setLoading(false)
    }
  }

  // Form validation
  const validateForm = () => {
    const newErrors = {}
    if (!formData.floorNumber || formData.floorNumber < 0) newErrors.floorNumber = 'Valid floor number is required'
    if (!formData.floorName.trim()) newErrors.floorName = 'Floor name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.totalRooms || formData.totalRooms <= 0) newErrors.totalRooms = 'Valid total rooms count is required'
    if (formData.availableRooms && formData.availableRooms > formData.totalRooms) {
      newErrors.availableRooms = 'Available rooms cannot exceed total rooms'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB')
        return
      }
      setFormData({...formData, floorImage: file})
    }
  }

  // Create/Update floor - PURE API CALL
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      
      // Prepare JSON data (excluding file upload for now)
      const submitData = {
        floorNumber: parseInt(formData.floorNumber),
        floorName: formData.floorName,
        description: formData.description,
        totalRooms: parseInt(formData.totalRooms) || 0,
        availableRooms: parseInt(formData.availableRooms) || 0,
        occupiedRooms: parseInt(formData.occupiedRooms) || 0,
        outOfOrderRooms: parseInt(formData.outOfOrderRooms) || 0,
        floorManager: formData.floorManager,
        housekeepingSupervisor: formData.housekeepingSupervisor,
        hasElevatorAccess: formData.hasElevatorAccess,
        hasFireExit: formData.hasFireExit,
        safetyFeatures: formData.safetyFeatures,
        specialFeatures: formData.specialFeatures,
        isActive: true
      }
      
      const response = editingId 
        ? await axios.put(`/RoomsManagement/floor-management/${editingId}`, submitData)
        : await axios.post('/RoomsManagement/floor-management', submitData)
      
      if (response.data && response.data.success) {
        setSuccess(editingId ? 'Floor updated successfully' : 'Floor created successfully')
        fetchFloors() // Refresh data
        setShowForm(false)
        resetForm()
      } else {
        setError('Failed to save floor')
      }
    } catch (err) {
      console.error('Error saving floor:', err)
      setError(err.response?.data?.message || 'Failed to save floor')
    } finally {
      setLoading(false)
    }
  }

  // Delete floor - PURE API CALL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this floor?')) return

    try {
      setLoading(true)
      const response = await axios.delete(`/RoomsManagement/floor-management/${id}`)
      
      if (response.data && response.data.success) {
        setSuccess('Floor deleted successfully')
        fetchFloors() // Refresh data
      } else {
        setError('Failed to delete floor')
      }
    } catch (err) {
      console.error('Error deleting floor:', err)
      setError(err.response?.data?.message || 'Failed to delete floor')
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      floorNumber: '',
      floorName: '',
      description: '',
      totalRooms: '',
      availableRooms: '',
      occupiedRooms: '',
      outOfOrderRooms: '',
      floorManager: '',
      housekeepingSupervisor: '',
      hasElevatorAccess: false,
      hasFireExit: false,
      safetyFeatures: '',
      specialFeatures: '',
      floorPlanPath: '',
      floorImage: null,
      isActive: true
    })
    setEditingId(null)
    setErrors({})
  }

  // Handle edit
  const handleEdit = (floor) => {
    setFormData(floor)
    setEditingId(floor.id)
    setShowForm(true)
  }

  // Filter floors based on search
  const filteredFloors = floors.filter(floor =>
    floor.floorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    floor.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    floor.floorManager?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    floor.floorNumber?.toString().includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <BuildingOffice2Icon className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 break-words">Floor Management</h1>
              <p className="text-gray-600 break-words">Manage hotel floors and their configurations</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center space-x-2 transition-colors w-full sm:w-auto"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Floor</span>
          </button>
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Search floors..."
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

      {/* Floors Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Floor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rooms</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading floors...</p>
                  </td>
                </tr>
              ) : filteredFloors.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No floors found
                  </td>
                </tr>
              ) : (
                filteredFloors.map((floor) => (
                  <tr key={floor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Floor {floor.floorNumber}</div>
                        <div className="text-sm text-gray-500">{floor.floorName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{floor.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Total: {floor.totalRooms}</div>
                        <div className="text-green-600">Available: {floor.availableRooms}</div>
                        <div className="text-yellow-600">Occupied: {floor.occupiedRooms}</div>
                        <div className="text-red-600">OOO: {floor.outOfOrderRooms}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{floor.floorManager || 'Not assigned'}</div>
                        <div className="text-gray-500 text-xs">{floor.housekeepingSupervisor || 'No supervisor'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {floor.hasElevatorAccess && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Elevator
                          </span>
                        )}
                        {floor.hasFireExit && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Fire Exit
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        floor.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {floor.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(floor)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit Floor"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(floor.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Floor"
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingId ? 'Edit Floor' : 'Add New Floor'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Floor Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Floor Number *
                    </label>
                    <input
                      type="number"
                      value={formData.floorNumber}
                      onChange={(e) => setFormData({...formData, floorNumber: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.floorNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter floor number"
                    />
                    {errors.floorNumber && <p className="text-red-500 text-sm mt-1">{errors.floorNumber}</p>}
                  </div>

                  {/* Floor Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Floor Name *
                    </label>
                    <input
                      type="text"
                      value={formData.floorName}
                      onChange={(e) => setFormData({...formData, floorName: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.floorName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter floor name"
                    />
                    {errors.floorName && <p className="text-red-500 text-sm mt-1">{errors.floorName}</p>}
                  </div>

                  {/* Total Rooms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Rooms *
                    </label>
                    <input
                      type="number"
                      value={formData.totalRooms}
                      onChange={(e) => setFormData({...formData, totalRooms: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.totalRooms ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter total rooms"
                    />
                    {errors.totalRooms && <p className="text-red-500 text-sm mt-1">{errors.totalRooms}</p>}
                  </div>

                  {/* Available Rooms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Rooms
                    </label>
                    <input
                      type="number"
                      value={formData.availableRooms}
                      onChange={(e) => setFormData({...formData, availableRooms: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.availableRooms ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter available rooms"
                    />
                    {errors.availableRooms && <p className="text-red-500 text-sm mt-1">{errors.availableRooms}</p>}
                  </div>

                  {/* Occupied Rooms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occupied Rooms
                    </label>
                    <input
                      type="number"
                      value={formData.occupiedRooms}
                      onChange={(e) => setFormData({...formData, occupiedRooms: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter occupied rooms"
                    />
                  </div>

                  {/* Out of Order Rooms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Out of Order Rooms
                    </label>
                    <input
                      type="number"
                      value={formData.outOfOrderRooms}
                      onChange={(e) => setFormData({...formData, outOfOrderRooms: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter out of order rooms"
                    />
                  </div>

                  {/* Floor Manager */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Floor Manager
                    </label>
                    <input
                      type="text"
                      value={formData.floorManager}
                      onChange={(e) => setFormData({...formData, floorManager: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter floor manager name"
                    />
                  </div>

                  {/* Housekeeping Supervisor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Housekeeping Supervisor
                    </label>
                    <input
                      type="text"
                      value={formData.housekeepingSupervisor}
                      onChange={(e) => setFormData({...formData, housekeepingSupervisor: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter housekeeping supervisor name"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter floor description"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Safety Features
                    </label>
                    <textarea
                      value={formData.safetyFeatures}
                      onChange={(e) => setFormData({...formData, safetyFeatures: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter safety features"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Features
                    </label>
                    <textarea
                      value={formData.specialFeatures}
                      onChange={(e) => setFormData({...formData, specialFeatures: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter special features"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasElevatorAccess"
                      checked={formData.hasElevatorAccess}
                      onChange={(e) => setFormData({...formData, hasElevatorAccess: e.target.checked})}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="hasElevatorAccess" className="ml-2 block text-sm text-gray-900">
                      Has Elevator Access
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasFireExit"
                      checked={formData.hasFireExit}
                      onChange={(e) => setFormData({...formData, hasFireExit: e.target.checked})}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="hasFireExit" className="ml-2 block text-sm text-gray-900">
                      Has Fire Exit
                    </label>
                  </div>
                </div>

                {/* Floor Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Floor Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Upload floor plan or image (max 5MB)</p>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      resetForm()
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingId ? 'Update Floor' : 'Create Floor')}
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

export default FloorManagement;
