import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  CubeIcon,
  PlusIcon,
  MinusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const StockManagement = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Food & Beverage',
    currentStock: '',
    minStock: '',
    maxStock: '',
    unitPrice: '',
    supplier: '',
    location: '',
    isActive: true
  })

  const [stockItems, setStockItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load stock items on component mount
  useEffect(() => {
    fetchStockItems()
    fetchCategories()
  }, [])

  const deriveCategoriesFromItems = (items) => {
    const unique = new Set(
      (items || [])
        .map(i => String(i.category ?? '').trim())
        .filter(Boolean)
    )
    return Array.from(unique).sort((a, b) => a.localeCompare(b))
  }

  const mergeCategories = (fromApi, fromItems) => {
    const all = [...(fromApi || []), ...(fromItems || [])]
      .map(v => String(v || '').trim())
      .filter(Boolean)
    return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b))
  }

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/inventory/categories')
      const apiData = res.data
      const list = Array.isArray(apiData)
        ? apiData
        : (apiData?.data && Array.isArray(apiData.data) ? apiData.data : [])
      const names = list
        .map(c => String(c.name ?? c.Name ?? c.categoryName ?? c.CategoryName ?? c.title ?? c.Title ?? '').trim())
        .filter(Boolean)

      setCategories((prev) => mergeCategories(names, prev))

      // Ensure selected form category is valid
      if (names.length) {
        setFormData(prev => ({
          ...prev,
          category: names.includes(prev.category) ? prev.category : (prev.category || names[0])
        }))
      }
    } catch (err) {
      console.error('❌ Error fetching inventory categories:', err.response?.data || err.message)
      // keep whatever we derived from items; do not wipe out the dropdown
    }
  }

  // Fetch stock items from API
  const fetchStockItems = async () => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')

      console.log('📡 Fetching items from /ItemMasters...')
      const response = await axios.get('/ItemMasters', {
        params: { page: 1, pageSize: 200 }
      })

      console.log('✅ API Response:', response.data)

      const apiData = response.data
      let items = []

      if (Array.isArray(apiData)) {
        items = apiData
      } else if (apiData?.data && Array.isArray(apiData.data)) {
        items = apiData.data
      } else if (apiData?.success && Array.isArray(apiData.data)) {
        items = apiData.data
      }

      console.log('📦 Parsed items:', items.length)

      const mappedItems = items.map((item) => ({
        id: item.id ?? item.Id,
        itemName: item.name ?? item.Name ?? item.itemName ?? item.ItemName ?? 'Unnamed',
        itemCode: item.code ?? item.Code ?? item.itemCode ?? item.ItemCode ?? '',
        category: item.category ?? item.Category ?? 'Uncategorized',
        currentStock: parseInt(item.currentStock ?? item.CurrentStock) || 0,
        minStock: parseInt(item.minStockLevel ?? item.MinStockLevel) || 0,
        maxStock: parseInt(item.maxStockLevel ?? item.MaxStockLevel) || 0,
        unitPrice: parseFloat(item.purchasePrice ?? item.PurchasePrice) || 0,
        supplier: item.supplier ?? item.Supplier ?? '',
        location: item.storageLocation ?? item.StorageLocation ?? item.location ?? item.Location ?? '',
        lastUpdated: (item.updatedAt ?? item.UpdatedAt) ? new Date(item.updatedAt ?? item.UpdatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        isActive: (item.isActive ?? item.IsActive) !== false,
        raw: item
      }))

      console.log('✨ Mapped items:', mappedItems)
      setStockItems(mappedItems)

      const derived = deriveCategoriesFromItems(mappedItems)

      // Always merge: categories from API (already loaded in state) + categories from items
      setCategories((prev) => {
        const merged = mergeCategories(prev, derived)

        // Ensure selected form category is valid (based on the same merged list)
        setFormData((cur) => {
          if (!merged.length) return cur
          if (cur.category && merged.includes(cur.category)) return cur
          return { ...cur, category: merged[0] }
        })

        return merged
      })
    } catch (err) {
      console.error('❌ Error fetching stock items:', err.response?.data || err.message)
      setError(`Failed to load stock items: ${err.response?.data?.message || err.message}`)
      setStockItems([])
    } finally {
      setLoading(false)
    }
  }

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.itemName.trim()) newErrors.itemName = 'Item name is required'
    if (!formData.currentStock || parseInt(formData.currentStock) < 0) {
      newErrors.currentStock = 'Valid current stock is required'
    }
    if (!formData.minStock || parseInt(formData.minStock) < 0) {
      newErrors.minStock = 'Valid minimum stock is required'
    }
    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      newErrors.unitPrice = 'Valid unit price is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const payloadBase = {
        name: formData.itemName,
        category: formData.category,
        purchasePrice: parseFloat(formData.unitPrice),
        salePrice: parseFloat(formData.unitPrice),
        minStockLevel: parseInt(formData.minStock) || 0,
        maxStockLevel: parseInt(formData.maxStock) || 0,
        currentStock: parseInt(formData.currentStock),
        supplier: formData.supplier,
        storageLocation: formData.location,
        isPerishable: false,
        brand: '',
        expiryDate: null,
        unit: 'Units',
        description: ''
      }

      if (editingId) {
        console.log('🔄 Updating item ID:', editingId)
        const existing = stockItems.find(i => i.id === editingId)
        const existingRaw = existing?.raw || {}

        const payload = {
          ...existingRaw,
          ...payloadBase,
          code: existingRaw.code || existing?.itemCode
        }

        console.log('📤 Update payload:', payload)
        const response = await axios.put(`/ItemMasters/${editingId}`, payload)
        console.log('✅ Update response:', response.data)
        setSuccess('✓ Stock item updated successfully')
      } else {
        const generateItemCode = (name) => {
          if (!name) return `ITEM${Math.floor(Math.random() * 9000) + 1000}`
          const prefix = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase() || 'ITEM'
          const random = Math.floor(Math.random() * 9000) + 1000
          return `${prefix}${random}`
        }

        const newCode = generateItemCode(formData.itemName)

        const payload = {
          ...payloadBase,
          code: newCode,
          isActive: true
        }

        console.log('📤 Create payload:', payload)
        const response = await axios.post('/ItemMasters', payload)
        console.log('✅ Create response:', response.data)
        setSuccess('✓ Stock item added successfully')
      }

      // Refresh the list after successful save
      console.log('🔄 Refreshing stock items list...')
      await new Promise(resolve => setTimeout(resolve, 500))
      await fetchStockItems()
      handleCancel()
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('❌ Error saving stock item:', error.response?.data || error.message)
      const errorMsg = error.response?.data?.message || error.response?.data?.errors?.name?.[0] || error.message || 'Unknown error'
      setError(`✗ Error saving stock item: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
    setFormData({
      itemName: item.itemName,
      category: item.category,
      currentStock: item.currentStock.toString(),
      minStock: item.minStock.toString(),
      maxStock: item.maxStock.toString(),
      unitPrice: item.unitPrice.toString(),
      supplier: item.supplier,
      location: item.location,
      isActive: item.isActive
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this stock item?')) {
      setLoading(true)
      setError('')
      setSuccess('')
      try {
        console.log('🗑️ Deleting item ID:', id)
        await axios.delete(`/ItemMasters/${id}`)
        setStockItems(prev => prev.filter(item => item.id !== id))
        setSuccess('✓ Item deleted successfully')
        setTimeout(() => setSuccess(''), 3000)
      } catch (error) {
        console.error('❌ Error deleting stock item:', error.response?.data || error.message)
        const errorMsg = error.response?.data?.message || error.message
        setError(`✗ Error deleting item: ${errorMsg}`)
      } finally {
        setLoading(false)
      }
    }
  }

  const adjustStock = async (id, adjustment) => {
    const item = stockItems.find(i => i.id === id)
    if (!item) return

    const newStock = Math.max(0, item.currentStock + adjustment)

    try {
      console.log(`📊 Adjusting stock for item ${id}: ${item.currentStock} ${adjustment > 0 ? '+' : ''} ${adjustment} = ${newStock}`)
      const existingRaw = item.raw || {}

      const payload = {
        ...existingRaw,
        name: existingRaw.name || item.itemName,
        category: existingRaw.category || item.category,
        purchasePrice: existingRaw.purchasePrice ?? item.unitPrice,
        salePrice: existingRaw.salePrice ?? item.unitPrice,
        minStockLevel: existingRaw.minStockLevel ?? item.minStock,
        maxStockLevel: existingRaw.maxStockLevel ?? item.maxStock,
        currentStock: newStock,
        supplier: existingRaw.supplier ?? item.supplier,
        storageLocation: existingRaw.storageLocation ?? item.location,
        unit: existingRaw.unit || 'Units',
        description: existingRaw.description || ''
      }

      console.log('📤 Stock adjustment payload:', payload)
      const response = await axios.put(`/ItemMasters/${id}`, payload)
      console.log('✅ Stock adjustment response:', response.data)
      
      setStockItems(prev => prev.map(i => 
        i.id === id
          ? { ...i, currentStock: newStock, lastUpdated: new Date().toISOString().split('T')[0] }
          : i
      ))
      setSuccess(`✓ Stock adjusted: ${item.itemName} → ${newStock} units`)
      setTimeout(() => setSuccess(''), 2000)
    } catch (error) {
      console.error('❌ Error adjusting stock:', error.response?.data || error.message)
      const errorMsg = error.response?.data?.message || error.message
      setError(`✗ Error adjusting stock: ${errorMsg}`)
    }
  }

  const handleCancel = () => {
    setFormData({
      itemName: '',
      category: 'Food & Beverage',
      currentStock: '',
      minStock: '',
      maxStock: '',
      unitPrice: '',
      supplier: '',
      location: '',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === '' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStockStatus = (item) => {
    if (item.currentStock <= 0) return { color: 'text-red-600', bg: 'bg-red-100', status: 'Out of Stock' }
    if (item.currentStock <= item.minStock) return { color: 'text-yellow-600', bg: 'bg-yellow-100', status: 'Low Stock' }
    return { color: 'text-green-600', bg: 'bg-green-100', status: 'In Stock' }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const lowStockCount = stockItems.filter(item => item.currentStock <= item.minStock).length
  const outOfStockCount = stockItems.filter(item => item.currentStock <= 0).length
  const totalValue = stockItems.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0)

  return (
    <div className="space-y-6">
      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
          <div className="flex-shrink-0">
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">{success}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Stock Management</h1>
            <p className="text-blue-100">Monitor and manage inventory stock levels</p>
          </div>
          <CubeIcon className="h-12 w-12 text-blue-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CubeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stockItems.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Stock Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{outOfStockCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Item
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Stock Item' : 'Add New Stock Item'}
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
                  value={formData.itemName}
                  onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.itemName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Basmati Rice"
                />
                {errors.itemName && <p className="mt-1 text-sm text-red-600">{errors.itemName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.currentStock}
                  onChange={(e) => setFormData({...formData, currentStock: e.target.value})}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.currentStock ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="45"
                />
                {errors.currentStock && <p className="mt-1 text-sm text-red-600">{errors.currentStock}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Minimum Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData({...formData, minStock: e.target.value})}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.minStock ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="20"
                />
                {errors.minStock && <p className="mt-1 text-sm text-red-600">{errors.minStock}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Stock</label>
                <input
                  type="number"
                  value={formData.maxStock}
                  onChange={(e) => setFormData({...formData, maxStock: e.target.value})}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Unit Price (Rs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({...formData, unitPrice: e.target.value})}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.unitPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="180"
                />
                {errors.unitPrice && <p className="mt-1 text-sm text-red-600">{errors.unitPrice}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier</label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ABC Food Suppliers"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Storage Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Kitchen Store"
                />
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
                className="px-8 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    {editingId ? 'Update' : 'Add'} Item
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stock Items List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Stock Items ({filteredItems.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const status = getStockStatus(item)
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                        <div className="text-sm text-gray-500">{item.supplier}</div>
                        <div className="text-sm text-gray-500">{item.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.currentStock}</div>
                      <div className="text-sm text-gray-500">Min: {item.minStock}</div>
                      {item.maxStock > 0 && <div className="text-sm text-gray-500">Max: {item.maxStock}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(item.unitPrice)}</div>
                      <div className="text-sm text-gray-500">Value: {formatCurrency(item.currentStock * item.unitPrice)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.bg} ${status.color}`}>
                        {status.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => adjustStock(item.id, -1)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Decrease stock"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => adjustStock(item.id, 1)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                          title="Increase stock"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
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
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default StockManagement;
