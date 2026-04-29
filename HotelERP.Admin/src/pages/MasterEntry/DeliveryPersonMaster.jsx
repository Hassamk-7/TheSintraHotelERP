import { useState } from 'react'
import {
  TruckIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  PhoneIcon,
  UserIcon
} from '@heroicons/react/24/outline'

const DeliveryPersonMaster = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    personName: '',
    personCode: '',
    phone: '',
    email: '',
    address: '',
    cnic: '',
    vehicleType: 'Bike',
    vehicleNumber: '',
    licenseNumber: '',
    salary: '',
    commissionRate: '',
    isActive: true
  })

  const [deliveryPersons, setDeliveryPersons] = useState([
    {
      id: 1,
      personName: 'Muhammad Hassan',
      personCode: 'DP001',
      phone: '+92-300-1111111',
      email: 'hassan@email.com',
      address: 'Gulshan-e-Iqbal, Karachi',
      cnic: '42101-1111111-1',
      vehicleType: 'Bike',
      vehicleNumber: 'KHI-1234',
      licenseNumber: 'DL-42-11-111111',
      salary: 25000,
      commissionRate: 5,
      isActive: true
    },
    {
      id: 2,
      personName: 'Ali Ahmed',
      personCode: 'DP002',
      phone: '+92-321-2222222',
      email: 'ali@email.com',
      address: 'Johar Town, Lahore',
      cnic: '35202-2222222-2',
      vehicleType: 'Car',
      vehicleNumber: 'LHE-5678',
      licenseNumber: 'DL-35-22-222222',
      salary: 30000,
      commissionRate: 7,
      isActive: true
    },
    {
      id: 3,
      personName: 'Fatima Khan',
      personCode: 'DP003',
      phone: '+92-333-3333333',
      email: 'fatima@email.com',
      address: 'F-10, Islamabad',
      cnic: '61101-3333333-3',
      vehicleType: 'Bike',
      vehicleNumber: 'ISB-9012',
      licenseNumber: 'DL-61-33-333333',
      salary: 22000,
      commissionRate: 4,
      isActive: true
    }
  ])

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.personName.trim()) {
      newErrors.personName = 'Person name is required'
    }

    if (!formData.personCode.trim()) {
      newErrors.personCode = 'Person code is required'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!formData.cnic.trim()) {
      newErrors.cnic = 'CNIC is required'
    }

    if (!formData.salary || parseFloat(formData.salary) <= 0) {
      newErrors.salary = 'Valid salary is required'
    }

    if (formData.commissionRate && (parseFloat(formData.commissionRate) < 0 || parseFloat(formData.commissionRate) > 100)) {
      newErrors.commissionRate = 'Commission rate must be between 0-100%'
    }

    // Check for duplicate code
    const existingPerson = deliveryPersons.find(person => 
      person.personCode.toLowerCase() === formData.personCode.toLowerCase() && 
      person.id !== editingId
    )
    if (existingPerson) {
      newErrors.personCode = 'Person code already exists'
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
        setDeliveryPersons(prev => prev.map(person => 
          person.id === editingId 
            ? { 
                ...formData, 
                id: editingId,
                salary: parseFloat(formData.salary),
                commissionRate: parseFloat(formData.commissionRate) || 0
              }
            : person
        ))
      } else {
        const newPerson = {
          ...formData,
          id: Date.now(),
          salary: parseFloat(formData.salary),
          commissionRate: parseFloat(formData.commissionRate) || 0
        }
        setDeliveryPersons(prev => [...prev, newPerson])
      }
      
      handleCancel()
      alert(editingId ? 'Delivery person updated successfully!' : 'Delivery person created successfully!')
    } catch (error) {
      console.error('Error saving delivery person:', error)
      alert('Error saving delivery person. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (person) => {
    setFormData({
      personName: person.personName,
      personCode: person.personCode,
      phone: person.phone,
      email: person.email,
      address: person.address,
      cnic: person.cnic,
      vehicleType: person.vehicleType,
      vehicleNumber: person.vehicleNumber,
      licenseNumber: person.licenseNumber,
      salary: person.salary.toString(),
      commissionRate: person.commissionRate.toString(),
      isActive: person.isActive
    })
    setEditingId(person.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this delivery person?')) {
      setDeliveryPersons(prev => prev.filter(person => person.id !== id))
      alert('Delivery person deleted successfully!')
    }
  }

  const handleCancel = () => {
    setFormData({
      personName: '',
      personCode: '',
      phone: '',
      email: '',
      address: '',
      cnic: '',
      vehicleType: 'Bike',
      vehicleNumber: '',
      licenseNumber: '',
      salary: '',
      commissionRate: '',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredPersons = deliveryPersons.filter(person =>
    person.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.personCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.phone.includes(searchTerm) ||
    person.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Delivery Person Master</h1>
            <p className="text-yellow-100">Manage delivery staff and their details</p>
          </div>
          <TruckIcon className="h-12 w-12 text-yellow-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <UserIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{deliveryPersons.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Staff</p>
              <p className="text-2xl font-bold text-gray-900">
                {deliveryPersons.filter(person => person.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <TruckIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bikes</p>
              <p className="text-2xl font-bold text-gray-900">
                {deliveryPersons.filter(person => person.vehicleType === 'Bike').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <TruckIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cars</p>
              <p className="text-2xl font-bold text-gray-900">
                {deliveryPersons.filter(person => person.vehicleType === 'Car').length}
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
            placeholder="Search delivery staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Delivery Person
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Delivery Person' : 'Add New Delivery Person'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Person Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.personName}
                  onChange={(e) => setFormData({...formData, personName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                    errors.personName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter person name"
                />
                {errors.personName && (
                  <p className="mt-1 text-sm text-red-600">{errors.personName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Person Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.personCode}
                  onChange={(e) => setFormData({...formData, personCode: e.target.value.toUpperCase()})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                    errors.personCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter person code"
                />
                {errors.personCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.personCode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+92-300-1234567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
                  placeholder="Enter email"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CNIC <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.cnic}
                  onChange={(e) => setFormData({...formData, cnic: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                    errors.cnic ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="42101-1234567-8"
                />
                {errors.cnic && (
                  <p className="mt-1 text-sm text-red-600">{errors.cnic}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
                >
                  <option value="Bike">Bike</option>
                  <option value="Car">Car</option>
                  <option value="Van">Van</option>
                  <option value="Truck">Truck</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vehicle Number
                </label>
                <input
                  type="text"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
                  placeholder="KHI-1234"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  License Number
                </label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
                  placeholder="DL-42-11-111111"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Monthly Salary (Rs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                    errors.salary ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="25000"
                />
                {errors.salary && (
                  <p className="mt-1 text-sm text-red-600">{errors.salary}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Commission Rate (%)
                </label>
                <input
                  type="number"
                  value={formData.commissionRate}
                  onChange={(e) => setFormData({...formData, commissionRate: e.target.value})}
                  min="0"
                  max="100"
                  step="0.1"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                    errors.commissionRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="5.0"
                />
                {errors.commissionRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.commissionRate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
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
                className="px-8 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-lg hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 transition-all duration-200 flex items-center"
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

      {/* Delivery Persons List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Delivery Staff ({filteredPersons.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary & Commission
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
              {filteredPersons.map((person) => (
                <tr key={person.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{person.personName}</div>
                      <div className="text-sm text-gray-500">{person.personCode}</div>
                      <div className="text-sm text-gray-500">{person.cnic}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                      {person.phone}
                    </div>
                    {person.email && (
                      <div className="text-sm text-gray-500">{person.email}</div>
                    )}
                    {person.address && (
                      <div className="text-sm text-gray-500">{person.address}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mb-1 ${
                        person.vehicleType === 'Bike' ? 'bg-blue-100 text-blue-800' :
                        person.vehicleType === 'Car' ? 'bg-green-100 text-green-800' :
                        person.vehicleType === 'Van' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {person.vehicleType}
                      </span>
                      {person.vehicleNumber && (
                        <div className="text-sm text-gray-900">{person.vehicleNumber}</div>
                      )}
                      {person.licenseNumber && (
                        <div className="text-sm text-gray-500">{person.licenseNumber}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">Rs {person.salary.toLocaleString()}/month</div>
                    {person.commissionRate > 0 && (
                      <div className="text-sm text-gray-500">{person.commissionRate}% commission</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      person.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {person.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(person)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(person.id)}
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
          
          {filteredPersons.length === 0 && (
            <div className="text-center py-12">
              <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No delivery staff found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new delivery person.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeliveryPersonMaster;
