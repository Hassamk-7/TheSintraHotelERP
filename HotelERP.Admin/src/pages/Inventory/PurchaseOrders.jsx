import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

const PurchaseOrders = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  
  const [formData, setFormData] = useState({
    poNumber: '',
    supplier: '',
    orderDate: '',
    expectedDate: '',
    items: [],
    totalAmount: '',
    status: 'Draft',
    notes: '',
    terms: '',
    isActive: true
  })

  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load purchase orders and suppliers on component mount
  useEffect(() => {
    fetchSuppliers()
    fetchPurchaseOrders()
  }, [])

  // Fetch suppliers from API
  const fetchSuppliers = async () => {
    try {
      console.log('📡 Fetching suppliers...')
      const response = await axios.get('/Suppliers', {
        params: { page: 1, pageSize: 100 }
      })

      console.log('✅ Suppliers Response:', response.data)

      const apiData = response.data
      let supplierList = []

      if (Array.isArray(apiData)) {
        supplierList = apiData
      } else if (apiData?.data && Array.isArray(apiData.data)) {
        supplierList = apiData.data
      } else if (apiData?.success && Array.isArray(apiData.data)) {
        supplierList = apiData.data
      }

      console.log('✨ Suppliers loaded:', supplierList.length)
      setSuppliers(supplierList)
    } catch (err) {
      console.error('❌ Error fetching suppliers:', err.message)
      setSuppliers([])
    }
  }

  // Fetch purchase orders from API
  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')

      console.log('📡 Fetching purchase orders from /PurchaseOrders...')
      const response = await axios.get('/PurchaseOrders', {
        params: { page: 1, pageSize: 200 }
      })

      console.log('✅ API Response:', response.data)

      const apiData = response.data
      let orders = []

      if (Array.isArray(apiData)) {
        orders = apiData
      } else if (apiData?.data && Array.isArray(apiData.data)) {
        orders = apiData.data
      } else if (apiData?.success && Array.isArray(apiData.data)) {
        orders = apiData.data
      }

      console.log('📦 Parsed orders:', orders.length)

      const mappedOrders = orders.map((order) => ({
        id: order.id,
        poNumber: order.poNumber || `PO-${order.id}`,
        supplierId: order.supplierId,
        supplier: order.supplier?.name || 'Unknown Supplier',
        orderDate: order.orderDate ? new Date(order.orderDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        expectedDeliveryDate: order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toISOString().split('T')[0] : '',
        actualDeliveryDate: order.actualDeliveryDate ? new Date(order.actualDeliveryDate).toISOString().split('T')[0] : '',
        status: order.status || 'Draft',
        subTotal: parseFloat(order.subTotal) || 0,
        taxAmount: parseFloat(order.taxAmount) || 0,
        totalAmount: parseFloat(order.totalAmount) || 0,
        orderedBy: order.orderedBy || 'System',
        approvedBy: order.approvedBy || '',
        approvalDate: order.approvalDate ? new Date(order.approvalDate).toISOString().split('T')[0] : '',
        terms: order.terms || '',
        remarks: order.remarks || '',
        isActive: order.isActive !== false,
        items: order.items || [],
        raw: order
      }))

      console.log('✨ Mapped orders:', mappedOrders)
      setPurchaseOrders(mappedOrders)
    } catch (err) {
      console.error('❌ Error fetching purchase orders:', err.response?.data || err.message)
      setError(`Failed to load purchase orders: ${err.response?.data?.message || err.message}`)
      setPurchaseOrders([])
    } finally {
      setLoading(false)
    }
  }

  const [selectedItems, setSelectedItems] = useState([])
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unitPrice: '' })
  const [errors, setErrors] = useState({})

  const statuses = ['Draft', 'Pending', 'Approved', 'Received', 'Cancelled']

  const validateForm = () => {
    const newErrors = {}
    if (!formData.supplier) newErrors.supplier = 'Supplier is required'
    if (!formData.orderDate) newErrors.orderDate = 'Order date is required'
    if (!formData.expectedDate) newErrors.expectedDate = 'Expected date is required'
    if (selectedItems.length === 0) newErrors.items = 'At least one item is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const addItem = () => {
    if (newItem.name && newItem.quantity && newItem.unitPrice) {
      const quantity = parseInt(newItem.quantity)
      const unitPrice = parseFloat(newItem.unitPrice)
      const total = quantity * unitPrice
      
      setSelectedItems(prev => [...prev, {
        ...newItem,
        quantity,
        unitPrice,
        total
      }])
      
      setNewItem({ name: '', quantity: '', unitPrice: '' })
      calculateTotal()
    }
  }

  const removeItem = (index) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index))
    setTimeout(calculateTotal, 100)
  }

  const calculateTotal = () => {
    const total = selectedItems.reduce((sum, item) => sum + (item.total || item.totalPrice || (item.quantity * item.unitPrice) || 0), 0)
    setFormData(prev => ({ ...prev, totalAmount: total.toString() }))
  }

  const generatePONumber = () => {
    const year = new Date().getFullYear()
    const count = purchaseOrders.length + 1
    return `PO-${year}-${String(count).padStart(3, '0')}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const totalAmount = selectedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
      
      const payload = {
        poNumber: formData.poNumber || generatePONumber(),
        supplierId: parseInt(formData.supplier) || 1,
        orderDate: new Date(formData.orderDate).toISOString(),
        expectedDeliveryDate: formData.expectedDate ? new Date(formData.expectedDate).toISOString() : null,
        status: formData.status,
        subTotal: totalAmount,
        taxAmount: 0,
        totalAmount: totalAmount,
        orderedBy: 'Current User',
        terms: formData.terms || '',
        remarks: formData.notes || '',
        items: selectedItems.map(item => ({
          itemId: item.itemId || 0,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
          specifications: item.specifications || '',
          remarks: item.remarks || ''
        }))
      }

      if (editingId) {
        console.log('🔄 Updating PO ID:', editingId)
        const existing = purchaseOrders.find(po => po.id === editingId)
        const existingRaw = existing?.raw || {}

        const updatePayload = {
          ...existingRaw,
          ...payload,
          id: editingId
        }

        console.log('📤 Update payload:', updatePayload)
        const response = await axios.put(`/PurchaseOrders/${editingId}`, updatePayload)
        console.log('✅ Update response:', response.data)
        setSuccess('✓ Purchase order updated successfully')
      } else {
        console.log('📤 Create payload:', payload)
        const response = await axios.post('/PurchaseOrders', payload)
        console.log('✅ Create response:', response.data)
        setSuccess('✓ Purchase order created successfully')
      }

      // Refresh the list after successful save
      console.log('🔄 Refreshing purchase orders list...')
      await new Promise(resolve => setTimeout(resolve, 500))
      await fetchPurchaseOrders()
      handleCancel()
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('❌ Error saving purchase order:', error.response?.data || error.message)
      const errorMsg = error.response?.data?.message || error.response?.data?.errors?.poNumber?.[0] || error.message || 'Unknown error'
      setError(`✗ Error saving purchase order: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (po) => {
    console.log('✏️ Editing PO:', po)
    setFormData({
      poNumber: po.poNumber,
      supplier: po.supplierId.toString(),
      orderDate: po.orderDate,
      expectedDate: po.expectedDeliveryDate,
      totalAmount: po.totalAmount.toString(),
      status: po.status,
      notes: po.remarks,
      terms: po.terms,
      isActive: po.isActive
    })
    setSelectedItems(po.items || [])
    setEditingId(po.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this purchase order?')) {
      setLoading(true)
      setError('')
      setSuccess('')
      try {
        console.log('🗑️ Deleting PO ID:', id)
        await axios.delete(`/PurchaseOrders/${id}`)
        setPurchaseOrders(prev => prev.filter(po => po.id !== id))
        setSuccess('✓ Purchase order deleted successfully')
        setTimeout(() => setSuccess(''), 3000)
      } catch (error) {
        console.error('❌ Error deleting purchase order:', error.response?.data || error.message)
        const errorMsg = error.response?.data?.message || error.message
        setError(`✗ Error deleting purchase order: ${errorMsg}`)
      } finally {
        setLoading(false)
      }
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      console.log(`📊 Updating PO ${id} status to: ${newStatus}`)
      const po = purchaseOrders.find(p => p.id === id)
      if (!po) return

      const existingRaw = po.raw || {}
      const payload = {
        ...existingRaw,
        status: newStatus
      }

      console.log('📤 Status update payload:', payload)
      const response = await axios.put(`/PurchaseOrders/${id}`, payload)
      console.log('✅ Status update response:', response.data)
      
      setPurchaseOrders(prev => prev.map(p => 
        p.id === id ? { ...p, status: newStatus } : p
      ))
      setSuccess(`✓ Status updated to ${newStatus}`)
      setTimeout(() => setSuccess(''), 2000)
    } catch (error) {
      console.error('❌ Error updating status:', error.response?.data || error.message)
      const errorMsg = error.response?.data?.message || error.message
      setError(`✗ Error updating status: ${errorMsg}`)
    }
  }

  const handleCancel = () => {
    setFormData({
      poNumber: '',
      supplier: '',
      orderDate: '',
      expectedDate: '',
      items: [],
      totalAmount: '',
      status: 'Draft',
      notes: '',
      terms: '',
      isActive: true
    })
    setSelectedItems([])
    setNewItem({ name: '', quantity: '', unitPrice: '' })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredOrders = purchaseOrders.filter(po => {
    const matchesSearch = po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === '' || po.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Approved': return 'bg-blue-100 text-blue-800'
      case 'Received': return 'bg-green-100 text-green-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return 'Rs 0'
    return `Rs ${parseFloat(amount).toLocaleString()}`
  }

  // Calculate statistics
  const totalOrders = purchaseOrders.length
  const pendingOrders = purchaseOrders.filter(po => po.status === 'Pending').length
  const approvedOrders = purchaseOrders.filter(po => po.status === 'Approved').length
  const totalValue = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0)

  return (
    <div className="space-y-6">
      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-600" />
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
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Purchase Orders</h1>
            <p className="text-green-100">Manage supplier purchase orders and procurement</p>
          </div>
          <DocumentTextIcon className="h-12 w-12 text-green-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <DocumentTextIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{approvedOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-emerald-100 rounded-lg p-3">
              <DocumentTextIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
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
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Order
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Purchase Order' : 'Create New Purchase Order'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Supplier <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.supplier}
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.supplier ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                  ))}
                </select>
                {errors.supplier && <p className="mt-1 text-sm text-red-600">{errors.supplier}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Order Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) => setFormData({...formData, orderDate: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.orderDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.orderDate && <p className="mt-1 text-sm text-red-600">{errors.orderDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expected Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.expectedDate}
                  onChange={(e) => setFormData({...formData, expectedDate: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.expectedDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.expectedDate && <p className="mt-1 text-sm text-red-600">{errors.expectedDate}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Terms</label>
                <input
                  type="text"
                  value={formData.terms}
                  onChange={(e) => setFormData({...formData, terms: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Net 30, Net 15"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            {/* Items Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              
              {/* Add Item Form */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  placeholder="Item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                  min="1"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="number"
                  placeholder="Unit Price"
                  value={newItem.unitPrice}
                  onChange={(e) => setNewItem({...newItem, unitPrice: e.target.value})}
                  min="0"
                  step="0.01"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={addItem}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Item
                </button>
              </div>

              {/* Items List */}
              {selectedItems.length > 0 && (
                <div className="space-y-2">
                  {selectedItems.map((item, index) => {
                    const itemName = item.name || `Item ${item.itemId || index + 1}`
                    const itemTotal = (item.total || item.totalPrice || (item.quantity * item.unitPrice)) || 0
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                        <div className="flex-1">
                          <span className="font-medium">{itemName}</span>
                          <span className="text-gray-500 ml-2">
                            {item.quantity} × {formatCurrency(item.unitPrice)} = {formatCurrency(itemTotal)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                      </div>
                    )
                  })}
                  <div className="text-right font-bold text-lg">
                    Total: {formatCurrency(selectedItems.reduce((sum, item) => sum + (item.total || item.totalPrice || (item.quantity * item.unitPrice) || 0), 0))}
                  </div>
                </div>
              )}
              {errors.items && <p className="mt-1 text-sm text-red-600">{errors.items}</p>}
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
                    {editingId ? 'Update' : 'Create'} Order
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Orders List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Purchase Orders ({filteredOrders.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((po) => (
                <tr key={po.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{po.poNumber}</div>
                      <div className="text-sm text-gray-500">By: {po.createdBy}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{po.supplier}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-gray-900">Order: {po.orderDate}</div>
                      <div className="text-sm text-gray-500">Expected: {po.expectedDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{po.items.length} items</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(po.totalAmount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={po.status}
                      onChange={(e) => updateStatus(po.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getStatusColor(po.status)}`}
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(po)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(po.id)}
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

export default PurchaseOrders;
