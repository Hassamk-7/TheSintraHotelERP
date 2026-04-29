import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  CalculatorIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const TaxMaster = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [taxes, setTaxes] = useState([
    {
      id: 1,
      name: 'GST (General Sales Tax)',
      code: 'GST',
      rate: 17,
      type: 'Percentage',
      description: 'Standard GST rate for Pakistan',
      isActive: true
    },
    {
      id: 2,
      name: 'Service Tax',
      code: 'ST',
      rate: 10,
      type: 'Percentage',
      description: 'Service tax for hospitality industry',
      isActive: true
    },
    {
      id: 3,
      name: 'Punjab Sales Tax',
      code: 'PST',
      rate: 5,
      type: 'Percentage',
      description: 'Provincial sales tax for Punjab',
      isActive: true
    },
    {
      id: 4,
      name: 'Federal Excise Duty',
      code: 'FED',
      rate: 2,
      type: 'Percentage',
      description: 'Federal excise duty on services',
      isActive: true
    },
    {
      id: 5,
      name: 'Tourism Development Fee',
      code: 'TDF',
      rate: 100,
      type: 'Fixed Amount',
      description: 'Fixed tourism development fee per room per night',
      isActive: true
    },
    {
      id: 6,
      name: 'Environmental Tax',
      code: 'ENV',
      rate: 50,
      type: 'Fixed Amount',
      description: 'Environmental protection fee',
      isActive: true
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    rate: '',
    type: 'Percentage',
    isActive: true,
    description: ''
  })

  const [errors, setErrors] = useState({})

  const taxTypes = ['Percentage', 'Fixed Amount']

  // Fetch taxes from API
  const fetchTaxes = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/Taxes')
      
      if (response.data && response.data.success) {
        setTaxes(response.data.data)
        setSuccess('Taxes loaded successfully')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to fetch taxes')
      }
    } catch (err) {
      console.error('Error fetching taxes:', err)
      setError('Error loading taxes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // API calls disabled to show mock data
    console.log('TaxMaster component loaded with mock data:', taxes.length, 'taxes')
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
      newErrors.name = 'Tax name is required'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Tax code is required'
    }

    if (!formData.rate || parseFloat(formData.rate) < 0) {
      newErrors.rate = 'Valid tax rate is required'
    }

    if (formData.type === 'Percentage' && parseFloat(formData.rate) > 100) {
      newErrors.rate = 'Percentage cannot exceed 100%'
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
      const taxData = {
        name: formData.name,
        code: formData.code.toUpperCase(),
        rate: parseFloat(formData.rate),
        type: formData.type,
        isActive: formData.isActive,
        description: formData.description || ''
      }

      console.log('Sending tax data:', taxData)

      if (editingId) {
        await axios.put(`/Taxes/${editingId}`, taxData)
        setSuccess('Tax updated successfully!')
      } else {
        await axios.post('/Taxes', taxData)
        setSuccess('Tax added successfully!')
      }
      
      handleCancel()
      fetchTaxes()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error saving tax:', error)
      console.error('Error response:', error.response?.data)
      const errorMessage = error.response?.data?.message || error.response?.data?.errors || 'Error saving tax. Please try again.'
      setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (tax) => {
    setFormData({
      name: tax.name,
      code: tax.code,
      rate: tax.rate?.toString() || '',
      type: tax.type,
      isActive: tax.isActive,
      description: tax.description || ''
    })
    setEditingId(tax.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tax?')) {
      try {
        setLoading(true)
        await axios.delete(`/Taxes/${id}`)
        setSuccess('Tax deleted successfully!')
        fetchTaxes()
        setTimeout(() => setSuccess(''), 3000)
      } catch (error) {
        console.error('Error deleting tax:', error)
        setError('Error deleting tax. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      name: '',
      code: '',
      rate: '',
      type: 'Percentage',
      isActive: true,
      description: ''
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredTaxes = taxes.filter(tax =>
    tax.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tax.code?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatTaxRate = (rate, type) => {
    if (type === 'Percentage') {
      return `${rate}%`
    } else {
      return `Rs ${rate?.toLocaleString()}`
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Tax Master</h1>
            <p className="text-red-100">Manage tax configurations for hotel billing and services</p>
          </div>
          <CalculatorIcon className="h-12 w-12 text-red-200" />
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
            placeholder="Search taxes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Tax
        </button>
      </div>

      {/* Tax Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {editingId ? 'Edit Tax' : 'Add New Tax'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tax Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter tax name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tax Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    errors.code ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter tax code"
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tax Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {taxTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tax Rate <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="rate"
                    value={formData.rate}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                      errors.rate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={formData.type === 'Percentage' ? 'Enter percentage' : 'Enter amount'}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">
                      {formData.type === 'Percentage' ? '%' : 'Rs'}
                    </span>
                  </div>
                </div>
                {errors.rate && (
                  <p className="mt-1 text-sm text-red-600">{errors.rate}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm font-semibold text-gray-700">
                  Active
                </label>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter tax description"
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
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingId ? 'Update Tax' : 'Add Tax')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Taxes Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Taxes ({filteredTaxes.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTaxes.map((tax) => (
                <tr key={tax.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{tax.name}</div>
                      <div className="text-sm text-gray-500">{tax.code}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{tax.type}</div>
                    <div className="text-sm font-semibold text-red-600">
                      {formatTaxRate(tax.rate, tax.type)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      tax.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {tax.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{tax.description || 'No description'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(tax)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tax.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTaxes.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    {loading ? 'Loading taxes...' : 'No taxes found'}
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

export default TaxMaster
