import { useState } from 'react'
import {
  SparklesIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const LaundryMaster = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    serviceName: '',
    serviceCode: '',
    description: '',
    serviceType: 'Washing',
    price: '',
    processingTime: '',
    isActive: true
  })

  const [laundryServices, setLaundryServices] = useState([
    {
      id: 1,
      serviceName: 'Shirt Washing',
      serviceCode: 'SW',
      description: 'Regular shirt washing and pressing',
      serviceType: 'Washing',
      price: 150,
      processingTime: 24,
      isActive: true
    },
    {
      id: 2,
      serviceName: 'Suit Dry Clean',
      serviceCode: 'SDC',
      description: 'Professional suit dry cleaning',
      serviceType: 'Dry Clean',
      price: 800,
      processingTime: 48,
      isActive: true
    },
    {
      id: 3,
      serviceName: 'Trouser Press',
      serviceCode: 'TP',
      description: 'Trouser washing and pressing',
      serviceType: 'Washing',
      price: 200,
      processingTime: 24,
      isActive: true
    },
    {
      id: 4,
      serviceName: 'Dress Cleaning',
      serviceCode: 'DC',
      description: 'Ladies dress cleaning and pressing',
      serviceType: 'Dry Clean',
      price: 600,
      processingTime: 36,
      isActive: true
    },
    {
      id: 5,
      serviceName: 'Express Service',
      serviceCode: 'ES',
      description: 'Same day express laundry service',
      serviceType: 'Express',
      price: 300,
      processingTime: 6,
      isActive: true
    },
    {
      id: 6,
      serviceName: 'Blanket Cleaning',
      serviceCode: 'BC',
      description: 'Heavy blanket and comforter cleaning',
      serviceType: 'Special',
      price: 1200,
      processingTime: 72,
      isActive: true
    }
  ])

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.serviceName.trim()) {
      newErrors.serviceName = 'Service name is required'
    }

    if (!formData.serviceCode.trim()) {
      newErrors.serviceCode = 'Service code is required'
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required'
    }

    if (!formData.processingTime || parseInt(formData.processingTime) <= 0) {
      newErrors.processingTime = 'Valid processing time is required'
    }

    // Check for duplicate code
    const existingService = laundryServices.find(service => 
      service.serviceCode.toLowerCase() === formData.serviceCode.toLowerCase() && 
      service.id !== editingId
    )
    if (existingService) {
      newErrors.serviceCode = 'Service code already exists'
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
        setLaundryServices(prev => prev.map(service => 
          service.id === editingId 
            ? { 
                ...formData, 
                id: editingId,
                price: parseFloat(formData.price),
                processingTime: parseInt(formData.processingTime)
              }
            : service
        ))
      } else {
        const newService = {
          ...formData,
          id: Date.now(),
          price: parseFloat(formData.price),
          processingTime: parseInt(formData.processingTime)
        }
        setLaundryServices(prev => [...prev, newService])
      }
      
      handleCancel()
      alert(editingId ? 'Laundry service updated successfully!' : 'Laundry service created successfully!')
    } catch (error) {
      console.error('Error saving laundry service:', error)
      alert('Error saving laundry service. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (service) => {
    setFormData({
      serviceName: service.serviceName,
      serviceCode: service.serviceCode,
      description: service.description,
      serviceType: service.serviceType,
      price: service.price.toString(),
      processingTime: service.processingTime.toString(),
      isActive: service.isActive
    })
    setEditingId(service.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this laundry service?')) {
      setLaundryServices(prev => prev.filter(service => service.id !== id))
      alert('Laundry service deleted successfully!')
    }
  }

  const handleCancel = () => {
    setFormData({
      serviceName: '',
      serviceCode: '',
      description: '',
      serviceType: 'Washing',
      price: '',
      processingTime: '',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredServices = laundryServices.filter(service =>
    service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.serviceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Laundry Master</h1>
            <p className="text-sky-100">Manage laundry services and pricing</p>
          </div>
          <SparklesIcon className="h-12 w-12 text-sky-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-sky-100 rounded-lg p-3">
              <SparklesIcon className="h-6 w-6 text-sky-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Services</p>
              <p className="text-2xl font-bold text-gray-900">{laundryServices.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Services</p>
              <p className="text-2xl font-bold text-gray-900">
                {laundryServices.filter(service => service.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Price</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {Math.round(laundryServices.reduce((sum, service) => sum + service.price, 0) / laundryServices.length)}
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
              <p className="text-sm font-medium text-gray-600">Avg. Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(laundryServices.reduce((sum, service) => sum + service.processingTime, 0) / laundryServices.length)}h
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
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-lg hover:from-sky-700 hover:to-blue-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Service
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Laundry Service' : 'Add New Laundry Service'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.serviceName}
                  onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                    errors.serviceName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter service name"
                />
                {errors.serviceName && (
                  <p className="mt-1 text-sm text-red-600">{errors.serviceName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Service Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.serviceCode}
                  onChange={(e) => setFormData({...formData, serviceCode: e.target.value.toUpperCase()})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                    errors.serviceCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter service code"
                />
                {errors.serviceCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.serviceCode}</p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Service Type
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                >
                  <option value="Washing">Washing</option>
                  <option value="Dry Clean">Dry Clean</option>
                  <option value="Express">Express</option>
                  <option value="Special">Special</option>
                  <option value="Pressing">Pressing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price (Rs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter price"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Processing Time (hours) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.processingTime}
                  onChange={(e) => setFormData({...formData, processingTime: e.target.value})}
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                    errors.processingTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter processing time"
                />
                {errors.processingTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.processingTime}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
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
                className="px-8 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-lg hover:from-sky-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 flex items-center"
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

      {/* Services List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Laundry Services ({filteredServices.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Processing Time
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
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{service.serviceName}</div>
                      <div className="text-sm text-gray-500">{service.serviceCode}</div>
                      <div className="text-sm text-gray-500">{service.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      service.serviceType === 'Washing' ? 'bg-blue-100 text-blue-800' :
                      service.serviceType === 'Dry Clean' ? 'bg-purple-100 text-purple-800' :
                      service.serviceType === 'Express' ? 'bg-red-100 text-red-800' :
                      service.serviceType === 'Special' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {service.serviceType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Rs {service.price.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                      {service.processingTime}h
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      service.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
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
          
          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <SparklesIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No services found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new laundry service.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Service Type Overview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Service Type Overview</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from(new Set(laundryServices.map(service => service.serviceType))).map(type => {
              const servicesOfType = laundryServices.filter(service => service.serviceType === type)
              const avgPrice = Math.round(servicesOfType.reduce((sum, service) => sum + service.price, 0) / servicesOfType.length)
              const avgTime = Math.round(servicesOfType.reduce((sum, service) => sum + service.processingTime, 0) / servicesOfType.length)
              
              return (
                <div key={type} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{type}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Services:</span>
                      <span className="font-medium">{servicesOfType.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg. Price:</span>
                      <span className="font-medium">Rs {avgPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg. Time:</span>
                      <span className="font-medium">{avgTime}h</span>
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

export default LaundryMaster;
