import { useState } from 'react'
import {
  ShoppingCartIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

const PurchaseDaybook = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  const [formData, setFormData] = useState({
    date: '',
    supplierName: '',
    invoiceNumber: '',
    itemDescription: '',
    category: 'Food & Beverage',
    quantity: '',
    unitPrice: '',
    totalAmount: '',
    taxAmount: '',
    paymentMethod: 'Credit',
    status: 'Received',
    isActive: true
  })

  const [purchases, setPurchases] = useState([
    {
      id: 1,
      date: '2024-01-15',
      supplierName: 'ABC Food Suppliers',
      invoiceNumber: 'INV-2024-001',
      itemDescription: 'Fresh vegetables and fruits',
      category: 'Food & Beverage',
      quantity: 50,
      unitPrice: 1700,
      totalAmount: 85000,
      taxAmount: 8500,
      paymentMethod: 'Credit',
      status: 'Received',
      createdAt: '2024-01-15T10:30:00',
      isActive: true
    },
    {
      id: 2,
      date: '2024-01-15',
      supplierName: 'CleanPro Services',
      invoiceNumber: 'INV-2024-002',
      itemDescription: 'Cleaning supplies and chemicals',
      category: 'Housekeeping',
      quantity: 25,
      unitPrice: 1200,
      totalAmount: 30000,
      taxAmount: 3000,
      paymentMethod: 'Cash',
      status: 'Received',
      createdAt: '2024-01-15T14:20:00',
      isActive: true
    },
    {
      id: 3,
      date: '2024-01-16',
      supplierName: 'Office Supplies Co',
      invoiceNumber: 'INV-2024-003',
      itemDescription: 'Stationery and office materials',
      category: 'Administration',
      quantity: 15,
      unitPrice: 800,
      totalAmount: 12000,
      taxAmount: 1200,
      paymentMethod: 'Credit',
      status: 'Pending',
      createdAt: '2024-01-16T09:15:00',
      isActive: true
    }
  ])

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const categories = [
    'Food & Beverage',
    'Housekeeping',
    'Administration',
    'Maintenance',
    'Utilities',
    'Marketing',
    'Equipment',
    'Furniture'
  ]

  const validateForm = () => {
    const newErrors = {}
    if (!formData.date) newErrors.date = 'Date is required'
    if (!formData.supplierName.trim()) newErrors.supplierName = 'Supplier name is required'
    if (!formData.invoiceNumber.trim()) newErrors.invoiceNumber = 'Invoice number is required'
    if (!formData.itemDescription.trim()) newErrors.itemDescription = 'Item description is required'
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
    const tax = total * 0.1 // 10% tax
    
    setFormData(prev => ({
      ...prev,
      totalAmount: total.toString(),
      taxAmount: tax.toString()
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingId) {
        setPurchases(prev => prev.map(purchase => 
          purchase.id === editingId 
            ? { 
                ...formData, 
                id: editingId,
                quantity: parseInt(formData.quantity),
                unitPrice: parseFloat(formData.unitPrice),
                totalAmount: parseFloat(formData.totalAmount),
                taxAmount: parseFloat(formData.taxAmount),
                createdAt: new Date().toISOString()
              }
            : purchase
        ))
      } else {
        const newPurchase = {
          ...formData,
          id: Date.now(),
          quantity: parseInt(formData.quantity),
          unitPrice: parseFloat(formData.unitPrice),
          totalAmount: parseFloat(formData.totalAmount),
          taxAmount: parseFloat(formData.taxAmount),
          createdAt: new Date().toISOString()
        }
        setPurchases(prev => [...prev, newPurchase])
      }
      
      handleCancel()
      alert(editingId ? 'Purchase updated!' : 'Purchase recorded!')
    } catch (error) {
      alert('Error saving purchase.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (purchase) => {
    setFormData({
      date: purchase.date,
      supplierName: purchase.supplierName,
      invoiceNumber: purchase.invoiceNumber,
      itemDescription: purchase.itemDescription,
      category: purchase.category,
      quantity: purchase.quantity.toString(),
      unitPrice: purchase.unitPrice.toString(),
      totalAmount: purchase.totalAmount.toString(),
      taxAmount: purchase.taxAmount.toString(),
      paymentMethod: purchase.paymentMethod,
      status: purchase.status,
      isActive: purchase.isActive
    })
    setEditingId(purchase.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this purchase record?')) {
      setPurchases(prev => prev.filter(purchase => purchase.id !== id))
      alert('Purchase deleted!')
    }
  }

  const handleCancel = () => {
    setFormData({
      date: '',
      supplierName: '',
      invoiceNumber: '',
      itemDescription: '',
      category: 'Food & Beverage',
      quantity: '',
      unitPrice: '',
      totalAmount: '',
      taxAmount: '',
      paymentMethod: 'Credit',
      status: 'Received',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.itemDescription.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = selectedDate === '' || purchase.date === selectedDate
    return matchesSearch && matchesDate
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Received': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Food & Beverage': return 'bg-blue-100 text-blue-800'
      case 'Housekeeping': return 'bg-green-100 text-green-800'
      case 'Administration': return 'bg-purple-100 text-purple-800'
      case 'Maintenance': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Calculate daily totals
  const dailyTotal = filteredPurchases.reduce((sum, p) => sum + p.totalAmount, 0)
  const dailyTax = filteredPurchases.reduce((sum, p) => sum + p.taxAmount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Purchase Daybook</h1>
            <p className="text-orange-100">Daily purchase transactions and supplier records</p>
          </div>
          <ShoppingCartIcon className="h-12 w-12 text-orange-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-lg p-3">
              <ShoppingCartIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Purchases</p>
              <p className="text-2xl font-bold text-gray-900">{filteredPurchases.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Daily Total</p>
              <p className="text-2xl font-bold text-gray-900">Rs {dailyTotal.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tax Amount</p>
              <p className="text-2xl font-bold text-gray-900">Rs {dailyTax.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <ShoppingCartIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Purchase</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {filteredPurchases.length > 0 ? Math.round(dailyTotal / filteredPurchases.length).toLocaleString() : 0}
              </p>
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
              placeholder="Search purchases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Purchase
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Purchase' : 'Add New Purchase'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Supplier Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.supplierName}
                  onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.supplierName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ABC Food Suppliers"
                />
                {errors.supplierName && <p className="mt-1 text-sm text-red-600">{errors.supplierName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Invoice Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.invoiceNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="INV-2024-001"
                />
                {errors.invoiceNumber && <p className="mt-1 text-sm text-red-600">{errors.invoiceNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.unitPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1700"
                />
                {errors.unitPrice && <p className="mt-1 text-sm text-red-600">{errors.unitPrice}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Amount (Rs)</label>
                <input
                  type="number"
                  value={formData.totalAmount}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tax Amount (Rs)</label>
                <input
                  type="number"
                  value={formData.taxAmount}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Credit">Credit</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Received">Received</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Item Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.itemDescription}
                  onChange={(e) => setFormData({...formData, itemDescription: e.target.value})}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.itemDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Fresh vegetables and fruits"
                />
                {errors.itemDescription && <p className="mt-1 text-sm text-red-600">{errors.itemDescription}</p>}
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
                className="px-8 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 transition-all duration-200 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    {editingId ? 'Update' : 'Add'} Purchase
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Purchases List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Purchase Records ({filteredPurchases.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty & Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{purchase.date}</div>
                      <div className="text-sm text-gray-500">{purchase.invoiceNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{purchase.supplierName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-gray-900">{purchase.itemDescription}</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(purchase.category)}`}>
                        {purchase.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-gray-900">Qty: {purchase.quantity}</div>
                      <div className="text-sm text-gray-500">@ Rs {purchase.unitPrice.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Rs {purchase.totalAmount.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Tax: Rs {purchase.taxAmount.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(purchase.status)}`}>
                      {purchase.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(purchase)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(purchase.id)}
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

export default PurchaseDaybook;
