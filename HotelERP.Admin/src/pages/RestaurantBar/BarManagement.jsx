import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  BeakerIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const BarManagement = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  const [formData, setFormData] = useState({
    drinkName: '',
    drinkCode: '',
    category: 'Alcoholic',
    price: '',
    ingredients: '',
    preparationTime: '',
    alcoholContent: '',
    servingSize: '250ml',
    description: '',
    isAvailable: true
  })

  // API Data states
  const [barItems, setBarItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})

  // Load bar items on component mount
  useEffect(() => {
    fetchBarItems()
  }, [])

  // Fetch bar items from API - PURE API CALL
  const fetchBarItems = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/RestaurantBar/bar-management')
      
      if (response.data && response.data.success) {
        setBarItems(response.data.data)
      } else {
        setError('No bar items data received')
        setBarItems([])
      }
    } catch (err) {
      console.error('Error fetching bar items:', err)
      setError(err.response?.data?.message || 'Failed to load bar items')
      setBarItems([])
    } finally {
      setLoading(false)
    }
  }

  // Form validation
  const validateForm = () => {
    const newErrors = {}
    if (!formData.drinkName.trim()) newErrors.drinkName = 'Drink name is required'
    if (!formData.drinkCode.trim()) newErrors.drinkCode = 'Drink code is required'
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required'
    if (!formData.ingredients.trim()) newErrors.ingredients = 'Ingredients are required'
    if (!formData.preparationTime || formData.preparationTime <= 0) newErrors.preparationTime = 'Valid preparation time is required'
    
    if (formData.category === 'Alcoholic' && (!formData.alcoholContent || formData.alcoholContent <= 0)) {
      newErrors.alcoholContent = 'Alcohol content is required for alcoholic drinks'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Create/Update bar item - PURE API CALL
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      const response = editingId
        ? await axios.put(`/RestaurantBar/bar-management/${editingId}`, formData)
        : await axios.post('/RestaurantBar/bar-management', formData)
      
      if (response.data && response.data.success) {
        setSuccess('Bar item saved successfully')
        fetchBarItems() // Refresh data
        setShowForm(false)
        resetForm()
      } else {
        setError('Failed to save bar item')
      }
    } catch (err) {
      console.error('Error saving bar item:', err)
      setError(err.response?.data?.message || 'Failed to save bar item')
    } finally {
      setLoading(false)
    }
  }

  // Delete bar item - PURE API CALL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bar item?')) return

    try {
      setLoading(true)
      const response = await axios.delete(`/RestaurantBar/bar-management/${id}`)
      
      if (response.data && response.data.success) {
        setSuccess('Bar item deleted successfully')
        fetchBarItems() // Refresh data
      } else {
        setError('Failed to delete bar item')
      }
    } catch (err) {
      console.error('Error deleting bar item:', err)
      setError(err.response?.data?.message || 'Failed to delete bar item')
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      drinkName: '',
      drinkCode: '',
      category: 'Alcoholic',
      price: '',
      ingredients: '',
      preparationTime: '',
      alcoholContent: '',
      servingSize: '250ml',
      description: '',
      isAvailable: true
    })
    setEditingId(null)
    setErrors({})
  }

  // Handle edit
  const handleEdit = (item) => {
    setFormData(item)
    setEditingId(item.id)
    setShowForm(true)
  }

  // Filter bar items
  const filteredItems = barItems.filter(item => {
    const matchesSearch = item.drinkName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.drinkCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.ingredients?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get unique categories
  const categories = ['All', ...new Set(barItems.map(item => item.category))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <BeakerIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bar Management</h1>
              <p className="text-gray-600">Manage beverages and bar inventory</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center space-x-2 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Drink</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Search drinks..."
            />
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
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

      {/* Bar Items Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drink</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alcohol %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prep Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading bar items...</p>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No bar items found
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.drinkName}</div>
                        <div className="text-sm text-gray-500">{item.drinkCode}</div>
                        <div className="text-sm text-gray-500">{item.servingSize}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.category === 'Alcoholic' ? 'bg-red-100 text-red-800' :
                        item.category === 'Non-Alcoholic' ? 'bg-blue-100 text-blue-800' :
                        item.category === 'Mocktail' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <CurrencyDollarIcon className="h-4 w-4 mr-1 text-gray-400" />
                        Rs {item.price?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.category === 'Alcoholic' ? `${item.alcoholContent}%` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {item.preparationTime} min
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
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

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingId ? 'Edit Bar Item' : 'Add New Bar Item'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Drink Name *</label>
                    <input
                      type="text"
                      value={formData.drinkName}
                      onChange={(e) => setFormData({...formData, drinkName: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.drinkName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Whiskey Sour"
                    />
                    {errors.drinkName && <p className="text-red-500 text-xs mt-1">{errors.drinkName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Drink Code *</label>
                    <input
                      type="text"
                      value={formData.drinkCode}
                      onChange={(e) => setFormData({...formData, drinkCode: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.drinkCode ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="WS001"
                    />
                    {errors.drinkCode && <p className="text-red-500 text-xs mt-1">{errors.drinkCode}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Alcoholic">Alcoholic</option>
                      <option value="Non-Alcoholic">Non-Alcoholic</option>
                      <option value="Mocktail">Mocktail</option>
                      <option value="Hot Beverage">Hot Beverage</option>
                      <option value="Cold Beverage">Cold Beverage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.price ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="1500"
                    />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Serving Size</label>
                    <select
                      value={formData.servingSize}
                      onChange={(e) => setFormData({...formData, servingSize: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="250ml">250ml</option>
                      <option value="330ml">330ml</option>
                      <option value="500ml">500ml</option>
                      <option value="750ml">750ml</option>
                      <option value="1L">1L</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Time (minutes) *</label>
                    <input
                      type="number"
                      value={formData.preparationTime}
                      onChange={(e) => setFormData({...formData, preparationTime: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.preparationTime ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="5"
                      min="1"
                    />
                    {errors.preparationTime && <p className="text-red-500 text-xs mt-1">{errors.preparationTime}</p>}
                  </div>

                  {formData.category === 'Alcoholic' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alcohol Content (%) *</label>
                      <input
                        type="number"
                        value={formData.alcoholContent}
                        onChange={(e) => setFormData({...formData, alcoholContent: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.alcoholContent ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="40"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                      {errors.alcoholContent && <p className="text-red-500 text-xs mt-1">{errors.alcoholContent}</p>}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients *</label>
                  <textarea
                    value={formData.ingredients}
                    onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.ingredients ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Whiskey, Lemon Juice, Sugar Syrup, Egg White"
                  />
                  {errors.ingredients && <p className="text-red-500 text-xs mt-1">{errors.ingredients}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Drink description..."
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Available</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      resetForm()
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
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

export default BarManagement;
