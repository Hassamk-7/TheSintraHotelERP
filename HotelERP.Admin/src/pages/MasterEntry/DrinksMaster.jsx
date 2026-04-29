import { useEffect, useState } from 'react'
import axios from '../../utils/axios.js'
import {
  BeakerIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

const DrinksMaster = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [autoCode, setAutoCode] = useState(true)
  const [formData, setFormData] = useState({
    drinkName: '',
    drinkCode: '',
    description: '',
    category: '',
    basePrice: '',
    ingredients: '',
    isAlcoholic: false,
    isActive: true
  })

  const [categories, setCategories] = useState([])

  const [drinks, setDrinks] = useState([])

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const fetchDrinks = async () => {
    try {
      setError('')
      const res = await axios.get('/DrinksMasters')
      if (res.data?.success) {
        const list = Array.isArray(res.data.data) ? res.data.data : []
        const mapped = list.map(d => ({
          id: d.id ?? d.Id,
          drinkName: d.name ?? d.Name ?? '',
          drinkCode: d.code ?? d.Code ?? '',
          description: d.description ?? d.Description ?? '',
          category: d.category ?? d.Category ?? '',
          basePrice: Number(d.price ?? d.Price ?? 0),
          ingredients: d.ingredients ?? d.Ingredients ?? '',
          isAlcoholic: Boolean(d.isAlcoholic ?? d.IsAlcoholic),
          isActive: Boolean(d.isActive ?? d.IsActive)
        }))
        setDrinks(mapped)
      } else {
        setDrinks([])
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load drinks master')
      setDrinks([])
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/DrinksCategories')
      if (res.data?.success) {
        const list = Array.isArray(res.data.data) ? res.data.data : []
        const mapped = list
          .map(c => ({
            id: c.id ?? c.Id,
            name: c.name ?? c.Name ?? '',
            code: c.code ?? c.Code ?? ''
          }))
          .filter(c => (c.name || '').trim())
        setCategories(mapped)
      } else {
        setCategories([])
      }
    } catch {
      setCategories([])
    }
  }

  useEffect(() => {
    fetchDrinks()
    fetchCategories()
  }, [])

  useEffect(() => {
    if (!showForm) return
    if (editingId) return
    if (!autoCode) return
    const name = (formData.drinkName || '').trim()
    if (!name) {
      setFormData(prev => ({ ...prev, drinkCode: '' }))
      return
    }

    const used = (drinks || [])
      .map(d => String(d.drinkCode || '').toUpperCase())
      .filter(code => /^DRK-\d{4,}$/.test(code))
      .map(code => Number(code.split('-')[1]))
      .filter(n => Number.isFinite(n))

    const next = (used.length ? Math.max(...used) : 0) + 1
    const code = `DRK-${String(next).padStart(4, '0')}`
    setFormData(prev => ({ ...prev, drinkCode: code }))
  }, [formData.drinkName, drinks, showForm, editingId, autoCode])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.drinkName.trim()) {
      newErrors.drinkName = 'Drink name is required'
    }

    if (!formData.drinkCode.trim()) {
      newErrors.drinkCode = 'Drink code is required'
    }

    // Check for duplicate code
    const existingDrink = drinks.find(drink => 
      drink.drinkCode.toLowerCase() === formData.drinkCode.toLowerCase() && 
      drink.id !== editingId
    )
    if (existingDrink) {
      newErrors.drinkCode = 'Drink code already exists'
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
    setSuccess('')
    
    try {
      const payload = {
        id: editingId || undefined,
        name: formData.drinkName,
        code: formData.drinkCode,
        description: formData.description,
        price: parseFloat(formData.basePrice || 0),
        category: formData.category,
        isAlcoholic: Boolean(formData.isAlcoholic),
        alcoholContent: 0,
        brand: null,
        ingredients: formData.ingredients,
        imagePath: null,
        isAvailable: Boolean(formData.isActive),
        isActive: Boolean(formData.isActive)
      }

      if (editingId) {
        const res = await axios.put(`/DrinksMasters/${editingId}`, payload)
        if (!res.data?.success) throw new Error(res.data?.message || 'Failed to update drink')
        setSuccess('Drink updated successfully!')
      } else {
        const res = await axios.post('/DrinksMasters', payload)
        if (!res.data?.success) throw new Error(res.data?.message || 'Failed to create drink')
        setSuccess('Drink created successfully!')
      }

      handleCancel()
      await fetchDrinks()
    } catch (error) {
      console.error('Error saving drink:', error)
      setError(error?.response?.data?.message || error?.message || 'Error saving drink. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (drink) => {
    setFormData({
      drinkName: drink.drinkName,
      drinkCode: drink.drinkCode,
      description: drink.description,
      category: drink.category,
      basePrice: drink.basePrice.toString(),
      ingredients: drink.ingredients,
      isAlcoholic: drink.isAlcoholic,
      isActive: drink.isActive
    })
    setEditingId(drink.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this drink?')) return
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      const res = await axios.delete(`/DrinksMasters/${id}`)
      if (!res.data?.success) throw new Error(res.data?.message || 'Failed to delete drink')
      setSuccess('Drink deleted successfully!')
      await fetchDrinks()
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Error deleting drink. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      drinkName: '',
      drinkCode: '',
      description: '',
      category: categories?.[0]?.name || '',
      basePrice: '',
      ingredients: '',
      isAlcoholic: false,
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
    setAutoCode(true)
  }

  const filteredDrinks = drinks.filter(drink =>
    drink.drinkName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drink.drinkCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drink.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-cyan-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Drinks Master</h1>
            <p className="text-emerald-100">Manage beverage menu and drink items</p>
          </div>
          <BeakerIcon className="h-12 w-12 text-emerald-200" />
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-emerald-100 rounded-lg p-3">
              <BeakerIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Drinks</p>
              <p className="text-2xl font-bold text-gray-900">{drinks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Non-Alcoholic</p>
              <p className="text-2xl font-bold text-gray-900">
                {drinks.filter(drink => !drink.isAlcoholic).length}
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
                Rs {drinks.length ? Math.round(drinks.reduce((sum, drink) => sum + Number(drink.basePrice || 0), 0) / drinks.length) : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <BeakerIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(drinks.map(drink => drink.category)).size}
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
            placeholder="Search drinks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-cyan-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Drink
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Drink' : 'Add New Drink'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Drink Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.drinkName}
                  onChange={(e) => setFormData({...formData, drinkName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                    errors.drinkName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter drink name"
                />
                {errors.drinkName && (
                  <p className="mt-1 text-sm text-red-600">{errors.drinkName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Drink Code <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={autoCode}
                      onChange={(e) => setAutoCode(e.target.checked)}
                    />
                    <span>Auto Code</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.drinkCode}
                  onChange={(e) => {
                    setAutoCode(false)
                    setFormData({ ...formData, drinkCode: e.target.value.toUpperCase() })
                  }}
                  readOnly={autoCode && !editingId}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                    errors.drinkCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter drink code"
                />
                {errors.drinkCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.drinkCode}</p>
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
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                >
                  {(categories || []).map(c => (
                    <option key={c.id || c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Base Price (Rs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                    errors.basePrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter base price"
                />
                {errors.basePrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.basePrice}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ingredients
                </label>
                <textarea
                  value={formData.ingredients}
                  onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  placeholder="List main ingredients"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.isAlcoholic}
                  onChange={(e) => setFormData({...formData, isAlcoholic: e.target.value === 'true'})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                >
                  <option value="false">Non-Alcoholic</option>
                  <option value="true">Alcoholic</option>
                </select>
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
                className="px-8 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-cyan-700 disabled:opacity-50 transition-all duration-200 flex items-center"
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

      {/* Drinks List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Drinks Menu ({filteredDrinks.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Drink Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
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
              {filteredDrinks.map((drink) => (
                <tr key={drink.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{drink.drinkName}</div>
                      <div className="text-sm text-gray-500">{drink.drinkCode}</div>
                      <div className="text-sm text-gray-500">{drink.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {(drink.category || '').trim() || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Rs {drink.basePrice.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      drink.isAlcoholic 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {drink.isAlcoholic ? 'Alcoholic' : 'Non-Alcoholic'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      drink.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {drink.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(drink)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(drink.id)}
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
          
          {filteredDrinks.length === 0 && (
            <div className="text-center py-12">
              <BeakerIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No drinks found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new drink.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DrinksMaster;
