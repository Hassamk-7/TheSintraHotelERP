import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  BuildingStorefrontIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const KitchenSectionMaster = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    sectionName: '',
    sectionCode: '',
    description: '',
    sectionType: 'Kitchen',
    capacity: '',
    supervisor: '',
    operatingHours: '',
    equipment: '',
    isActive: true
  })

  const [kitchenSections, setKitchenSections] = useState([
    {
      id: 1,
      sectionName: 'Main Kitchen',
      sectionCode: 'MK001',
      description: 'Primary cooking area for main course preparation',
      sectionType: 'Kitchen',
      capacity: '8 chefs',
      supervisor: 'Chef Ahmed Ali',
      operatingHours: '6:00 AM - 11:00 PM',
      equipment: 'Gas stoves, ovens, grills, preparation tables',
      isActive: true
    },
    {
      id: 2,
      sectionName: 'Cold Kitchen',
      sectionCode: 'CK001',
      description: 'Salad preparation and cold appetizers section',
      sectionType: 'Kitchen',
      capacity: '3 chefs',
      supervisor: 'Chef Maria Khan',
      operatingHours: '10:00 AM - 10:00 PM',
      equipment: 'Refrigeration units, salad prep stations, cold storage',
      isActive: true
    },
    {
      id: 3,
      sectionName: 'Bakery Section',
      sectionCode: 'BK001',
      description: 'Bread, pastries, and dessert preparation',
      sectionType: 'Bakery',
      capacity: '4 bakers',
      supervisor: 'Baker Fatima Sheikh',
      operatingHours: '4:00 AM - 8:00 PM',
      equipment: 'Ovens, mixers, proofing chambers, decorating stations',
      isActive: true
    },
    {
      id: 4,
      sectionName: 'Grill Station',
      sectionCode: 'GS001',
      description: 'BBQ and grilled items preparation',
      sectionType: 'Kitchen',
      capacity: '2 grill masters',
      supervisor: 'Grill Master Ali Raza',
      operatingHours: '12:00 PM - 11:00 PM',
      equipment: 'Charcoal grills, gas grills, tandoor oven',
      isActive: true
    },
    {
      id: 5,
      sectionName: 'Beverage Station',
      sectionCode: 'BS001',
      description: 'Tea, coffee, and beverage preparation area',
      sectionType: 'Beverage',
      capacity: '2 baristas',
      supervisor: 'Barista Sara Ahmed',
      operatingHours: '6:00 AM - 12:00 AM',
      equipment: 'Espresso machines, tea brewers, blenders, juice extractors',
      isActive: true
    },
    {
      id: 6,
      sectionName: 'Dishwashing Area',
      sectionCode: 'DW001',
      description: 'Cleaning and sanitizing section for all kitchenware',
      sectionType: 'Utility',
      capacity: '4 staff',
      supervisor: 'Supervisor Ayesha Khan',
      operatingHours: '24/7',
      equipment: 'Industrial dishwashers, sanitizing stations, drying racks',
      isActive: true
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})

  // Fetch kitchen sections from API
  const fetchKitchenSections = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/KitchenSections')
      
      if (response.data && response.data.success) {
        setKitchenSections(response.data.data)
        setSuccess('Kitchen sections loaded successfully')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to fetch kitchen sections')
      }
    } catch (err) {
      console.error('Error fetching kitchen sections:', err)
      setError('Error loading kitchen sections. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // API calls disabled to show mock data
    console.log('KitchenSectionMaster component loaded with mock data:', kitchenSections.length, 'sections')
  }, [])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.sectionName.trim()) {
      newErrors.sectionName = 'Section name is required'
    }

    if (!formData.sectionCode.trim()) {
      newErrors.sectionCode = 'Section code is required'
    }

    if (!formData.capacity || parseInt(formData.capacity) <= 0) {
      newErrors.capacity = 'Valid capacity is required'
    }

    if (!formData.supervisor.trim()) {
      newErrors.supervisor = 'Supervisor name is required'
    }

    // Check for duplicate code
    const existingSection = kitchenSections.find(section => 
      section.sectionCode.toLowerCase() === formData.sectionCode.toLowerCase() && 
      section.id !== editingId
    )
    if (existingSection) {
      newErrors.sectionCode = 'Section code already exists'
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
        setKitchenSections(prev => prev.map(section => 
          section.id === editingId 
            ? { 
                ...formData, 
                id: editingId,
                capacity: parseInt(formData.capacity)
              }
            : section
        ))
      } else {
        const newSection = {
          ...formData,
          id: Date.now(),
          capacity: parseInt(formData.capacity)
        }
        setKitchenSections(prev => [...prev, newSection])
      }
      
      handleCancel()
      alert(editingId ? 'Kitchen section updated successfully!' : 'Kitchen section created successfully!')
    } catch (error) {
      console.error('Error saving kitchen section:', error)
      alert('Error saving kitchen section. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (section) => {
    setFormData({
      sectionName: section.sectionName,
      sectionCode: section.sectionCode,
      description: section.description,
      sectionType: section.sectionType,
      capacity: section.capacity.toString(),
      supervisor: section.supervisor,
      operatingHours: section.operatingHours,
      equipment: section.equipment,
      isActive: section.isActive
    })
    setEditingId(section.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this kitchen section?')) {
      setKitchenSections(prev => prev.filter(section => section.id !== id))
      alert('Kitchen section deleted successfully!')
    }
  }

  const handleCancel = () => {
    setFormData({
      sectionName: '',
      sectionCode: '',
      description: '',
      sectionType: 'Kitchen',
      capacity: '',
      supervisor: '',
      operatingHours: '',
      equipment: '',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredSections = kitchenSections.filter(section =>
    section.sectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.sectionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.sectionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.supervisor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Kitchen/Section Master</h1>
            <p className="text-red-100">Manage kitchen sections and operational areas</p>
          </div>
          <BuildingStorefrontIcon className="h-12 w-12 text-red-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <BuildingStorefrontIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sections</p>
              <p className="text-2xl font-bold text-gray-900">{kitchenSections.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Sections</p>
              <p className="text-2xl font-bold text-gray-900">
                {kitchenSections.filter(section => section.isActive).length}
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
                {kitchenSections.reduce((sum, section) => {
                  const capacityNumber = parseInt(section.capacity.match(/\d+/)?.[0] || 0);
                  return sum + capacityNumber;
                }, 0)} staff
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <ClockIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Section Types</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(kitchenSections.map(section => section.sectionType)).size}
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
            placeholder="Search sections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Section
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Kitchen Section' : 'Add New Kitchen Section'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Section Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.sectionName}
                  onChange={(e) => setFormData({...formData, sectionName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    errors.sectionName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter section name"
                />
                {errors.sectionName && (
                  <p className="mt-1 text-sm text-red-600">{errors.sectionName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Section Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.sectionCode}
                  onChange={(e) => setFormData({...formData, sectionCode: e.target.value.toUpperCase()})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    errors.sectionCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter section code"
                />
                {errors.sectionCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.sectionCode}</p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Section Type
                </label>
                <select
                  value={formData.sectionType}
                  onChange={(e) => setFormData({...formData, sectionType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  <option value="Kitchen">Kitchen</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Cold Prep">Cold Prep</option>
                  <option value="Grill">Grill</option>
                  <option value="Beverage">Beverage</option>
                  <option value="Utility">Utility</option>
                  <option value="Storage">Storage</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Staff Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    errors.capacity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter staff capacity"
                />
                {errors.capacity && (
                  <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Supervisor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.supervisor}
                  onChange={(e) => setFormData({...formData, supervisor: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    errors.supervisor ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter supervisor name"
                />
                {errors.supervisor && (
                  <p className="mt-1 text-sm text-red-600">{errors.supervisor}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Operating Hours
                </label>
                <input
                  type="text"
                  value={formData.operatingHours}
                  onChange={(e) => setFormData({...formData, operatingHours: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  placeholder="e.g., 06:00 - 23:00"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Equipment & Facilities
                </label>
                <textarea
                  value={formData.equipment}
                  onChange={(e) => setFormData({...formData, equipment: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  placeholder="List equipment and facilities"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
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
                className="px-8 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-orange-700 disabled:opacity-50 transition-all duration-200 flex items-center"
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

      {/* Kitchen Sections List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Kitchen Sections ({filteredSections.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Section Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supervisor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operating Hours
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
              {filteredSections.map((section) => (
                <tr key={section.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{section.sectionName}</div>
                      <div className="text-sm text-gray-500">{section.sectionCode}</div>
                      <div className="text-sm text-gray-500">{section.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mb-1 ${
                        section.sectionType === 'Kitchen' ? 'bg-red-100 text-red-800' :
                        section.sectionType === 'Bakery' ? 'bg-orange-100 text-orange-800' :
                        section.sectionType === 'Cold Prep' ? 'bg-blue-100 text-blue-800' :
                        section.sectionType === 'Grill' ? 'bg-yellow-100 text-yellow-800' :
                        section.sectionType === 'Beverage' ? 'bg-green-100 text-green-800' :
                        section.sectionType === 'Utility' ? 'bg-gray-100 text-gray-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {section.sectionType}
                      </span>
                      <div className="text-sm text-gray-900">{section.capacity} staff</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{section.supervisor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                      {section.operatingHours}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      section.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {section.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(section)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(section.id)}
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
          
          {filteredSections.length === 0 && (
            <div className="text-center py-12">
              <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No kitchen sections found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new kitchen section.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Section Overview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Section Overview</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from(new Set(kitchenSections.map(section => section.sectionType))).map(type => {
              const sectionsOfType = kitchenSections.filter(section => section.sectionType === type)
              const totalCapacity = sectionsOfType.reduce((sum, section) => {
                const capacityNumber = parseInt(section.capacity.match(/\d+/)?.[0] || 0);
                return sum + capacityNumber;
              }, 0)
              
              return (
                <div key={type} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{type}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sections:</span>
                      <span className="font-medium">{sectionsOfType.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Capacity:</span>
                      <span className="font-medium">{totalCapacity} staff</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Active:</span>
                      <span className="font-medium">{sectionsOfType.filter(s => s.isActive).length}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default KitchenSectionMaster;
