import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../utils/axios.js'
import {
  CubeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const ItemMaster = () => {
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    itemName: '',
    itemCode: '',
    category: 'Food & Beverage',
    unit: 'Kg',
    purchaseRate: '',
    sellingRate: '',
    minStock: '',
    maxStock: '',
    reorderLevel: '',
    description: '',
    isActive: true
  })

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const categories = [
    'Food & Beverage',
    'Housekeeping',
    'Maintenance',
    'Office Supplies',
    'Laundry',
    'Other'
  ]

  const units = [
    'Kg', 'Grams', 'Liters', 'Pieces', 'Boxes', 'Bottles', 'Packets', 'Meters', 'Other'
  ]

  const [errors, setErrors] = useState({})

  // Fetch items from API
  const fetchItems = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/ItemMasters')
      
      if (response.data && response.data.success) {
        setItems(response.data.data)
        setSuccess('Items loaded successfully')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to fetch items')
      }
    } catch (err) {
      console.error('Error fetching items:', err)
      setError('Error loading items. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
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

    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Item name is required'
    }

    if (!formData.itemCode.trim()) {
      newErrors.itemCode = 'Item code is required'
    }

    if (!formData.purchaseRate || parseFloat(formData.purchaseRate) <= 0) {
      newErrors.purchaseRate = 'Valid purchase rate is required'
    }

    if (!formData.sellingRate || parseFloat(formData.sellingRate) <= 0) {
      newErrors.sellingRate = 'Valid selling rate is required'
    }

    if (formData.minStock && parseInt(formData.minStock) < 0) {
      newErrors.minStock = 'Minimum stock cannot be negative'
    }

    if (formData.maxStock && parseInt(formData.maxStock) < 0) {
      newErrors.maxStock = 'Maximum stock cannot be negative'
    }

    if (formData.minStock && formData.maxStock && parseInt(formData.minStock) > parseInt(formData.maxStock)) {
      newErrors.maxStock = 'Maximum stock must be greater than minimum stock'
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
        setItems(prev => prev.map(item => 
          item.id === editingId 
            ? { 
                ...formData, 
                id: editingId, 
                purchaseRate: parseFloat(formData.purchaseRate),
                sellingRate: parseFloat(formData.sellingRate),
                minStock: parseInt(formData.minStock) || 0,
                maxStock: parseInt(formData.maxStock) || 0,
                reorderLevel: parseInt(formData.reorderLevel) || 0,
                itemCode: formData.itemCode.toUpperCase()
              }
            : item
        ))
      } else {
        const newItem = {
          ...formData,
          id: Date.now(),
          purchaseRate: parseFloat(formData.purchaseRate),
          sellingRate: parseFloat(formData.sellingRate),
          minStock: parseInt(formData.minStock) || 0,
          maxStock: parseInt(formData.maxStock) || 0,
          reorderLevel: parseInt(formData.reorderLevel) || 0,
          itemCode: formData.itemCode.toUpperCase()
        }
        setItems(prev => [...prev, newItem])
      }
      
      handleCancel()
      alert(editingId ? 'Item updated successfully!' : 'Item added successfully!')
    } catch (error) {
      console.error('Error saving item:', error)
      alert('Error saving item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
    setFormData({
      itemName: item.itemName,
      itemCode: item.itemCode,
      category: item.category,
      unit: item.unit,
      purchaseRate: item.purchaseRate.toString(),
      sellingRate: item.sellingRate.toString(),
      minStock: item.minStock.toString(),
      maxStock: item.maxStock.toString(),
      reorderLevel: item.reorderLevel.toString(),
      description: item.description,
      isActive: item.isActive
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(prev => prev.filter(item => item.id !== id))
      alert('Item deleted successfully!')
    }
  }

  const handleCancel = () => {
    setFormData({
      itemName: '',
      itemCode: '',
      category: 'Food & Beverage',
      unit: 'Kg',
      purchaseRate: '',
      sellingRate: '',
      minStock: '',
      maxStock: '',
      reorderLevel: '',
      description: '',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredItems = items.filter(item =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Item Master</h1>
            <p className="text-indigo-100">Manage inventory items and their details</p>
          </div>
          <CubeIcon className="h-12 w-12 text-indigo-200" />
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Item
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Item' : 'Add New Item'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    errors.itemName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter item name"
                />
                {errors.itemName && (
                  <p className="mt-1 text-sm text-red-600">{errors.itemName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Item Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="itemCode"
                  value={formData.itemCode}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors uppercase ${
                    errors.itemCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter item code"
                />
                {errors.itemCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.itemCode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Purchase Rate (Rs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="purchaseRate"
                  value={formData.purchaseRate}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    errors.purchaseRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter purchase rate"
                />
                {errors.purchaseRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.purchaseRate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Selling Rate (Rs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="sellingRate"
                  value={formData.sellingRate}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    errors.sellingRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter selling rate"
                />
                {errors.sellingRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.sellingRate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Minimum Stock
                </label>
                <input
                  type="number"
                  name="minStock"
                  value={formData.minStock}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    errors.minStock ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter minimum stock"
                />
                {errors.minStock && (
                  <p className="mt-1 text-sm text-red-600">{errors.minStock}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Maximum Stock
                </label>
                <input
                  type="number"
                  name="maxStock"
                  value={formData.maxStock}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    errors.maxStock ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter maximum stock"
                />
                {errors.maxStock && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxStock}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reorder Level
                </label>
                <input
                  type="number"
                  name="reorderLevel"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  placeholder="Enter reorder level"
                />
              </div>

              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm font-medium text-gray-700">
                  Active Status
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                placeholder="Enter item description"
              />
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
                className="px-8 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 flex items-center"
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

      {/* Items List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Items ({filteredItems.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Selling Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Levels
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
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                      <div className="text-sm text-gray-500">{item.itemCode}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-indigo-100 text-indigo-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs {item.purchaseRate.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs {item.sellingRate.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>Min: {item.minStock}</div>
                    <div>Max: {item.maxStock}</div>
                    <div>Reorder: {item.reorderLevel}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new item.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ItemMaster;
