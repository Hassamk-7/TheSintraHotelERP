import { useState } from 'react'
import {
  CubeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

const PurchasedInventory = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Food & Beverage',
    supplier: '',
    purchaseDate: '',
    quantity: '',
    unitPrice: '',
    totalCost: '',
    expiryDate: '',
    batchNumber: '',
    status: 'In Stock',
    isActive: true
  })

  const [inventory, setInventory] = useState([
    {
      id: 1,
      itemName: 'Basmati Rice',
      category: 'Food & Beverage',
      supplier: 'ABC Food Suppliers',
      purchaseDate: '2024-01-10',
      quantity: 50,
      unitPrice: 180,
      totalCost: 9000,
      expiryDate: '2024-07-10',
      batchNumber: 'BR-2024-001',
      status: 'In Stock',
      currentStock: 35,
      isActive: true
    },
    {
      id: 2,
      itemName: 'Chicken (Fresh)',
      category: 'Food & Beverage',
      supplier: 'Fresh Meat Co',
      purchaseDate: '2024-01-15',
      quantity: 25,
      unitPrice: 450,
      totalCost: 11250,
      expiryDate: '2024-01-18',
      batchNumber: 'CH-2024-002',
      status: 'Low Stock',
      currentStock: 5,
      isActive: true
    },
    {
      id: 3,
      itemName: 'Cleaning Detergent',
      category: 'Housekeeping',
      supplier: 'CleanPro Services',
      purchaseDate: '2024-01-12',
      quantity: 20,
      unitPrice: 350,
      totalCost: 7000,
      expiryDate: '2025-01-12',
      batchNumber: 'CD-2024-003',
      status: 'In Stock',
      currentStock: 18,
      isActive: true
    },
    {
      id: 4,
      itemName: 'Office Paper A4',
      category: 'Office Supplies',
      supplier: 'Office Mart',
      purchaseDate: '2024-01-08',
      quantity: 100,
      unitPrice: 25,
      totalCost: 2500,
      expiryDate: '',
      batchNumber: 'OP-2024-004',
      status: 'In Stock',
      currentStock: 85,
      isActive: true
    },
    {
      id: 5,
      itemName: 'Vegetables (Mixed)',
      category: 'Food & Beverage',
      supplier: 'Fresh Farm Supplies',
      purchaseDate: '2024-01-16',
      quantity: 30,
      unitPrice: 120,
      totalCost: 3600,
      expiryDate: '2024-01-20',
      batchNumber: 'VM-2024-005',
      status: 'Expired',
      currentStock: 0,
      isActive: true
    }
  ])

  const categories = ['Food & Beverage', 'Housekeeping', 'Office Supplies', 'Maintenance', 'Amenities']
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.itemName.trim()) newErrors.itemName = 'Item name is required'
    if (!formData.supplier.trim()) newErrors.supplier = 'Supplier is required'
    if (!formData.purchaseDate) newErrors.purchaseDate = 'Purchase date is required'
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Valid quantity is required'
    }
    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      newErrors.unitPrice = 'Valid unit price is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateTotal = () => {
    const quantity = parseInt(formData.quantity) || 0
    const unitPrice = parseFloat(formData.unitPrice) || 0
    const total = quantity * unitPrice
    setFormData(prev => ({ ...prev, totalCost: total.toString() }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingId) {
        setInventory(prev => prev.map(item => 
          item.id === editingId 
            ? { 
                ...formData, 
                id: editingId,
                quantity: parseInt(formData.quantity),
                unitPrice: parseFloat(formData.unitPrice),
                totalCost: parseFloat(formData.totalCost),
                currentStock: parseInt(formData.quantity)
              }
            : item
        ))
      } else {
        const newItem = {
          ...formData,
          id: Date.now(),
          quantity: parseInt(formData.quantity),
          unitPrice: parseFloat(formData.unitPrice),
          totalCost: parseFloat(formData.totalCost),
          currentStock: parseInt(formData.quantity),
          batchNumber: `${formData.category.substring(0, 2).toUpperCase()}-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`
        }
        setInventory(prev => [...prev, newItem])
      }
      
      handleCancel()
      alert(editingId ? 'Inventory updated!' : 'Inventory added!')
    } catch (error) {
      alert('Error saving inventory.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
    setFormData({
      itemName: item.itemName,
      category: item.category,
      supplier: item.supplier,
      purchaseDate: item.purchaseDate,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice.toString(),
      totalCost: item.totalCost.toString(),
      expiryDate: item.expiryDate,
      batchNumber: item.batchNumber,
      status: item.status,
      isActive: item.isActive
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this inventory item?')) {
      setInventory(prev => prev.filter(item => item.id !== id))
      alert('Item deleted!')
    }
  }

  const handleCancel = () => {
    setFormData({
      itemName: '',
      category: 'Food & Beverage',
      supplier: '',
      purchaseDate: '',
      quantity: '',
      unitPrice: '',
      totalCost: '',
      expiryDate: '',
      batchNumber: '',
      status: 'In Stock',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === '' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800'
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800'
      case 'Out of Stock': return 'bg-red-100 text-red-800'
      case 'Expired': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Food & Beverage': return 'bg-blue-100 text-blue-800'
      case 'Housekeeping': return 'bg-green-100 text-green-800'
      case 'Office Supplies': return 'bg-purple-100 text-purple-800'
      case 'Maintenance': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => {
    return `Rs ${amount.toLocaleString()}`
  }

  // Calculate statistics
  const totalValue = inventory.reduce((sum, item) => sum + item.totalCost, 0)
  const lowStockItems = inventory.filter(item => item.status === 'Low Stock').length
  const expiredItems = inventory.filter(item => item.status === 'Expired').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Purchased Inventory</h1>
            <p className="text-amber-100">Track and manage purchased inventory items</p>
          </div>
          <CubeIcon className="h-12 w-12 text-amber-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-amber-100 rounded-lg p-3">
              <CubeIcon className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
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
              <p className="text-2xl font-bold text-gray-900">{lowStockItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <CalendarIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expired Items</p>
              <p className="text-2xl font-bold text-gray-900">{expiredItems}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200"
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
              {editingId ? 'Edit Inventory Item' : 'Add New Inventory Item'}
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Supplier <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    errors.supplier ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ABC Food Suppliers"
                />
                {errors.supplier && <p className="mt-1 text-sm text-red-600">{errors.supplier}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Purchase Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    errors.purchaseDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.purchaseDate && <p className="mt-1 text-sm text-red-600">{errors.purchaseDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => {
                    setFormData({...formData, quantity: e.target.value})
                    setTimeout(calculateTotal, 100)
                  }}
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    errors.quantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="50"
                />
                {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Unit Price (Rs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.unitPrice}
                  onChange={(e) => {
                    setFormData({...formData, unitPrice: e.target.value})
                    setTimeout(calculateTotal, 100)
                  }}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    errors.unitPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="180"
                />
                {errors.unitPrice && <p className="mt-1 text-sm text-red-600">{errors.unitPrice}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Cost (Rs)</label>
                <input
                  type="number"
                  value={formData.totalCost}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Expired">Expired</option>
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
                className="px-8 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 transition-all duration-200 flex items-center"
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

      {/* Inventory List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Inventory Items ({filteredInventory.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                      <div className="text-sm text-gray-500">Batch: {item.batchNumber}</div>
                      {item.expiryDate && (
                        <div className="text-sm text-gray-500">Expires: {item.expiryDate}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{item.supplier}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-gray-900">{item.purchaseDate}</div>
                      <div className="text-sm text-gray-500">Qty: {item.quantity} @ {formatCurrency(item.unitPrice)}</div>
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(item.totalCost)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.currentStock}</div>
                    <div className="text-sm text-gray-500">of {item.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PurchasedInventory;
