import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  CurrencyDollarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const CurrencyMaster = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currencies, setCurrencies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    symbol: '',
    exchangeRate: '1.00',
    isBaseCurrency: false
  })

  const [errors, setErrors] = useState({})

  // Fetch currencies from API
  const fetchCurrencies = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/Currency')
      
      if (response.data && response.data.success) {
        setCurrencies(response.data.data)
        setSuccess('Currencies loaded successfully')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to fetch currencies')
      }
    } catch (err) {
      console.error('Error fetching currencies:', err)
      setError('Error loading currencies. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrencies()
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
      newErrors.name = 'Currency name is required'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Currency code is required'
    } else if (formData.code.length !== 3) {
      newErrors.code = 'Currency code must be 3 characters'
    }

    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Currency symbol is required'
    }

    if (!formData.exchangeRate || parseFloat(formData.exchangeRate) <= 0) {
      newErrors.exchangeRate = 'Valid exchange rate is required'
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
      const currencyData = {
        name: formData.name,
        code: formData.code.toUpperCase(),
        symbol: formData.symbol,
        exchangeRate: Math.max(0.001, parseFloat(formData.exchangeRate) || 0.001),
        isBaseCurrency: formData.isBaseCurrency,
        description: "" // Optional field
      }

      console.log('Sending currency data:', currencyData)

      if (editingId) {
        await axios.put(`/Currency/${editingId}`, currencyData)
        setSuccess('Currency updated successfully!')
      } else {
        await axios.post('/Currency', currencyData)
        setSuccess('Currency added successfully!')
      }
      
      handleCancel()
      fetchCurrencies()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error saving currency:', error)
      console.error('Error response:', error.response?.data)
      const errorMessage = error.response?.data?.message || error.response?.data?.errors || 'Error saving currency. Please try again.'
      setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (currency) => {
    setFormData({
      name: currency.name,
      code: currency.code,
      symbol: currency.symbol,
      exchangeRate: currency.exchangeRate.toString(),
      isBaseCurrency: currency.isBaseCurrency
    })
    setEditingId(currency.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    const currency = currencies.find(c => c.id === id)
    if (currency?.isBaseCurrency) {
      setError('Cannot delete base currency!')
      setTimeout(() => setError(''), 3000)
      return
    }
    
    if (window.confirm('Are you sure you want to delete this currency?')) {
      try {
        setLoading(true)
        await axios.delete(`/Currency/${id}`)
        setSuccess('Currency deleted successfully!')
        fetchCurrencies()
        setTimeout(() => setSuccess(''), 3000)
      } catch (error) {
        console.error('Error deleting currency:', error)
        setError('Error deleting currency. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      name: '',
      code: '',
      symbol: '',
      exchangeRate: '1.00',
      isBaseCurrency: false
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredCurrencies = currencies.filter(currency =>
    currency.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Currency Master</h1>
            <p className="text-green-100">Manage currencies and exchange rates for international transactions</p>
          </div>
          <CurrencyDollarIcon className="h-12 w-12 text-green-200" />
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
            placeholder="Search currencies..."
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
          Add Currency
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Currency' : 'Add New Currency'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Currency Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter currency name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Currency Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  maxLength="3"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors uppercase ${
                    errors.code ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter 3-letter code (e.g., USD)"
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Symbol <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                    errors.symbol ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter currency symbol"
                />
                {errors.symbol && (
                  <p className="mt-1 text-sm text-red-600">{errors.symbol}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Exchange Rate (to Base Currency) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="exchangeRate"
                  value={formData.exchangeRate}
                  onChange={handleChange}
                  min="0"
                  step="0.0001"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                    errors.exchangeRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter exchange rate"
                />
                {errors.exchangeRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.exchangeRate}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Rate of this currency per 1 unit of base currency
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  name="isBaseCurrency"
                  checked={formData.isBaseCurrency}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">
                  Set as Base Currency
                </label>
              </div>

              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">
                  Active Status
                </label>
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

      {/* Currencies List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Currencies ({filteredCurrencies.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Currency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exchange Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
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
              {filteredCurrencies.map((currency) => (
                <tr key={currency.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{currency.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800">
                      {currency.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-900">
                    {currency.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {currency.isBaseCurrency ? '1.0000 (Base)' : currency.exchangeRate?.toFixed(4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      currency.isBaseCurrency 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {currency.isBaseCurrency ? 'Base Currency' : 'Foreign Currency'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      currency.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {currency.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(currency)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      {!currency.isBaseCurrency && (
                        <button
                          onClick={() => handleDelete(currency.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredCurrencies.length === 0 && (
            <div className="text-center py-12">
              <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No currencies found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new currency.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CurrencyMaster;
