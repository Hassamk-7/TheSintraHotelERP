import { useState } from 'react'
import {
  MapIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

const GardenMaster = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    gardenName: '',
    gardenCode: '',
    description: '',
    capacity: '',
    area: '',
    location: '',
    chargePerHour: '',
    chargePerDay: '',
    facilities: '',
    gardenType: 'Outdoor',
    isActive: true
  })

  const [gardens, setGardens] = useState([
    {
      id: 1,
      gardenName: 'Rose Garden',
      gardenCode: 'RG',
      description: 'Beautiful rose garden for outdoor events',
      capacity: 200,
      area: '1500 sq ft',
      location: 'North Wing',
      chargePerHour: 5000,
      chargePerDay: 40000,
      facilities: 'Gazebo, Fountain, Lighting, Seating',
      gardenType: 'Outdoor',
      isActive: true
    },
    {
      id: 2,
      gardenName: 'Lawn Area A',
      gardenCode: 'LAA',
      description: 'Open lawn area for large gatherings',
      capacity: 500,
      area: '3000 sq ft',
      location: 'Main Entrance',
      chargePerHour: 8000,
      chargePerDay: 60000,
      facilities: 'Stage Setup, Sound System, Parking',
      gardenType: 'Lawn',
      isActive: true
    },
    {
      id: 3,
      gardenName: 'Terrace Garden',
      gardenCode: 'TG',
      description: 'Rooftop terrace garden with city view',
      capacity: 100,
      area: '800 sq ft',
      location: 'Rooftop',
      chargePerHour: 6000,
      chargePerDay: 45000,
      facilities: 'City View, Bar Setup, Lighting',
      gardenType: 'Terrace',
      isActive: true
    },
    {
      id: 4,
      gardenName: 'Poolside Garden',
      gardenCode: 'PSG',
      description: 'Garden area next to swimming pool',
      capacity: 150,
      area: '1200 sq ft',
      location: 'Pool Area',
      chargePerHour: 7000,
      chargePerDay: 50000,
      facilities: 'Pool Access, Cabanas, BBQ Area',
      gardenType: 'Poolside',
      isActive: true
    }
  ])

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.gardenName.trim()) {
      newErrors.gardenName = 'Garden name is required'
    }

    if (!formData.gardenCode.trim()) {
      newErrors.gardenCode = 'Garden code is required'
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
    const existingGarden = gardens.find(garden => 
      garden.gardenCode.toLowerCase() === formData.gardenCode.toLowerCase() && 
      garden.id !== editingId
    )
    if (existingGarden) {
      newErrors.gardenCode = 'Garden code already exists'
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
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingId) {
        setGardens(prev => prev.map(garden => 
          garden.id === editingId 
            ? { 
                ...formData, 
                id: editingId,
                capacity: parseInt(formData.capacity),
                chargePerHour: parseFloat(formData.chargePerHour),
                chargePerDay: parseFloat(formData.chargePerDay)
              }
            : garden
        ))
      } else {
        const newGarden = {
          ...formData,
          id: Date.now(),
          capacity: parseInt(formData.capacity),
          chargePerHour: parseFloat(formData.chargePerHour),
          chargePerDay: parseFloat(formData.chargePerDay)
        }
        setGardens(prev => [...prev, newGarden])
      }
      
      handleCancel()
      alert(editingId ? 'Garden updated successfully!' : 'Garden created successfully!')
    } catch (error) {
      console.error('Error saving garden:', error)
      alert('Error saving garden. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (garden) => {
    setFormData({
      gardenName: garden.gardenName,
      gardenCode: garden.gardenCode,
      description: garden.description,
      capacity: garden.capacity.toString(),
      area: garden.area,
      location: garden.location,
      chargePerHour: garden.chargePerHour.toString(),
      chargePerDay: garden.chargePerDay.toString(),
      facilities: garden.facilities,
      gardenType: garden.gardenType,
      isActive: garden.isActive
    })
    setEditingId(garden.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this garden?')) {
      setGardens(prev => prev.filter(garden => garden.id !== id))
      alert('Garden deleted successfully!')
    }
  }

  const handleCancel = () => {
    setFormData({
      gardenName: '',
      gardenCode: '',
      description: '',
      capacity: '',
      area: '',
      location: '',
      chargePerHour: '',
      chargePerDay: '',
      facilities: '',
      gardenType: 'Outdoor',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredGardens = gardens.filter(garden =>
    garden.gardenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    garden.gardenCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    garden.gardenType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Garden Master</h1>
            <p className="text-green-100">Manage outdoor spaces and garden areas</p>
          </div>
          <MapIcon className="h-12 w-12 text-green-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <MapIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Gardens</p>
              <p className="text-2xl font-bold text-gray-900">{gardens.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-emerald-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Gardens</p>
              <p className="text-2xl font-bold text-gray-900">
                {gardens.filter(garden => garden.isActive).length}
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
                {gardens.reduce((sum, garden) => sum + garden.capacity, 0)}
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
                Rs {Math.round(gardens.reduce((sum, garden) => sum + garden.chargePerDay, 0) / gardens.length).toLocaleString()}
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
            placeholder="Search gardens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Garden
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Garden' : 'Add New Garden'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Garden Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.gardenName}
                  onChange={(e) => setFormData({...formData, gardenName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                    errors.gardenName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter garden name"
                />
                {errors.gardenName && (
                  <p className="mt-1 text-sm text-red-600">{errors.gardenName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Garden Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.gardenCode}
                  onChange={(e) => setFormData({...formData, gardenCode: e.target.value.toUpperCase()})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                    errors.gardenCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter garden code"
                />
                {errors.gardenCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.gardenCode}</p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                  placeholder="e.g., 1500 sq ft"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                  placeholder="e.g., North Wing"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Garden Type
                </label>
                <select
                  value={formData.gardenType}
                  onChange={(e) => setFormData({...formData, gardenType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                >
                  <option value="Outdoor">Outdoor</option>
                  <option value="Lawn">Lawn</option>
                  <option value="Terrace">Terrace</option>
                  <option value="Poolside">Poolside</option>
                  <option value="Rooftop">Rooftop</option>
                </select>
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                  placeholder="e.g., Gazebo, Fountain, Lighting, Seating"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
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
                className="px-8 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all duration-200 flex items-center"
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

      {/* Gardens List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Gardens ({filteredGardens.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Garden Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Capacity
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
              {filteredGardens.map((garden) => (
                <tr key={garden.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{garden.gardenName}</div>
                      <div className="text-sm text-gray-500">{garden.gardenCode}</div>
                      <div className="text-sm text-gray-500">{garden.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mb-1 ${
                        garden.gardenType === 'Outdoor' ? 'bg-green-100 text-green-800' :
                        garden.gardenType === 'Lawn' ? 'bg-emerald-100 text-emerald-800' :
                        garden.gardenType === 'Terrace' ? 'bg-blue-100 text-blue-800' :
                        garden.gardenType === 'Poolside' ? 'bg-cyan-100 text-cyan-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {garden.gardenType}
                      </span>
                      <div className="text-sm text-gray-900">{garden.capacity} people</div>
                      <div className="text-sm text-gray-500">{garden.area}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{garden.location}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">Rs {garden.chargePerHour.toLocaleString()}/hour</div>
                    <div className="text-sm text-gray-500">Rs {garden.chargePerDay.toLocaleString()}/day</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      garden.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {garden.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(garden)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(garden.id)}
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
          
          {filteredGardens.length === 0 && (
            <div className="text-center py-12">
              <MapIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No gardens found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new garden.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GardenMaster;
