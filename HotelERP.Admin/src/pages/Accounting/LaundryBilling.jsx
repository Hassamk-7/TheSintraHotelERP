import { useState } from 'react'
import {
  SparklesIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  PrinterIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const LaundryBilling = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [formData, setFormData] = useState({
    ticketNumber: '',
    guestName: '',
    roomNumber: '',
    serviceType: 'Washing',
    items: [],
    totalAmount: '',
    discount: '',
    taxAmount: '',
    finalAmount: '',
    paymentMethod: 'Room Charge',
    status: 'Pending',
    isActive: true
  })

  // Mock laundry services with pricing
  const [laundryServices] = useState([
    { id: 1, name: 'Shirt Washing', price: 150, category: 'Washing' },
    { id: 2, name: 'Trouser Washing', price: 200, category: 'Washing' },
    { id: 3, name: 'Dress Washing', price: 300, category: 'Washing' },
    { id: 4, name: 'Suit Dry Cleaning', price: 800, category: 'Dry Cleaning' },
    { id: 5, name: 'Shirt Pressing', price: 100, category: 'Pressing' },
    { id: 6, name: 'Trouser Pressing', price: 120, category: 'Pressing' },
    { id: 7, name: 'Bedsheet Washing', price: 250, category: 'Washing' },
    { id: 8, name: 'Towel Washing', price: 80, category: 'Washing' }
  ])

  const [laundryBills, setLaundryBills] = useState([
    {
      id: 1,
      ticketNumber: 'LND-001',
      guestName: 'Ahmed Ali',
      roomNumber: '205',
      serviceType: 'Mixed Services',
      items: [
        { serviceId: 1, serviceName: 'Shirt Washing', quantity: 3, price: 150, total: 450 },
        { serviceId: 2, serviceName: 'Trouser Washing', quantity: 2, price: 200, total: 400 },
        { serviceId: 5, serviceName: 'Shirt Pressing', quantity: 3, price: 100, total: 300 }
      ],
      totalAmount: 1150,
      discount: 50,
      taxAmount: 110,
      finalAmount: 1210,
      paymentMethod: 'Room Charge',
      status: 'Completed',
      billDate: '2024-01-15',
      deliveryDate: '2024-01-16',
      isActive: true
    },
    {
      id: 2,
      ticketNumber: 'LND-002',
      guestName: 'Fatima Sheikh',
      roomNumber: '301',
      serviceType: 'Dry Cleaning',
      items: [
        { serviceId: 4, serviceName: 'Suit Dry Cleaning', quantity: 1, price: 800, total: 800 },
        { serviceId: 3, serviceName: 'Dress Washing', quantity: 2, price: 300, total: 600 }
      ],
      totalAmount: 1400,
      discount: 0,
      taxAmount: 140,
      finalAmount: 1540,
      paymentMethod: 'Cash',
      status: 'In Progress',
      billDate: '2024-01-16',
      deliveryDate: '2024-01-17',
      isActive: true
    }
  ])

  const [selectedItems, setSelectedItems] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.guestName.trim()) newErrors.guestName = 'Guest name is required'
    if (!formData.roomNumber.trim()) newErrors.roomNumber = 'Room number is required'
    if (selectedItems.length === 0) newErrors.items = 'At least one service item is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateBill = () => {
    const totalAmount = selectedItems.reduce((sum, item) => sum + item.total, 0)
    const discount = parseFloat(formData.discount) || 0
    const discountedAmount = totalAmount - discount
    const taxAmount = discountedAmount * 0.1 // 10% tax
    const finalAmount = discountedAmount + taxAmount

    setFormData(prev => ({
      ...prev,
      totalAmount: totalAmount.toString(),
      taxAmount: taxAmount.toString(),
      finalAmount: finalAmount.toString()
    }))
  }

  const addServiceItem = (service) => {
    const existingItem = selectedItems.find(item => item.serviceId === service.id)
    
    if (existingItem) {
      setSelectedItems(prev => prev.map(item =>
        item.serviceId === service.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ))
    } else {
      setSelectedItems(prev => [...prev, {
        serviceId: service.id,
        serviceName: service.name,
        quantity: 1,
        price: service.price,
        total: service.price
      }])
    }
    
    setTimeout(calculateBill, 100)
  }

  const updateItemQuantity = (serviceId, newQuantity) => {
    if (newQuantity <= 0) {
      setSelectedItems(prev => prev.filter(item => item.serviceId !== serviceId))
    } else {
      setSelectedItems(prev => prev.map(item =>
        item.serviceId === serviceId
          ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
          : item
      ))
    }
    setTimeout(calculateBill, 100)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingId) {
        setLaundryBills(prev => prev.map(bill => 
          bill.id === editingId 
            ? { 
                ...formData, 
                id: editingId,
                items: selectedItems,
                totalAmount: parseFloat(formData.totalAmount),
                discount: parseFloat(formData.discount) || 0,
                taxAmount: parseFloat(formData.taxAmount),
                finalAmount: parseFloat(formData.finalAmount),
                billDate: new Date().toISOString().split('T')[0]
              }
            : bill
        ))
      } else {
        const newBill = {
          ...formData,
          id: Date.now(),
          ticketNumber: `LND-${String(Date.now()).slice(-3)}`,
          items: selectedItems,
          totalAmount: parseFloat(formData.totalAmount),
          discount: parseFloat(formData.discount) || 0,
          taxAmount: parseFloat(formData.taxAmount),
          finalAmount: parseFloat(formData.finalAmount),
          billDate: new Date().toISOString().split('T')[0],
          deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
        setLaundryBills(prev => [...prev, newBill])
      }
      
      handleCancel()
      alert(editingId ? 'Laundry bill updated!' : 'Laundry bill created!')
    } catch (error) {
      alert('Error saving bill.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (bill) => {
    setFormData({
      ticketNumber: bill.ticketNumber,
      guestName: bill.guestName,
      roomNumber: bill.roomNumber,
      serviceType: bill.serviceType,
      totalAmount: bill.totalAmount.toString(),
      discount: bill.discount.toString(),
      taxAmount: bill.taxAmount.toString(),
      finalAmount: bill.finalAmount.toString(),
      paymentMethod: bill.paymentMethod,
      status: bill.status,
      isActive: bill.isActive
    })
    setSelectedItems(bill.items)
    setEditingId(bill.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this laundry bill?')) {
      setLaundryBills(prev => prev.filter(bill => bill.id !== id))
      alert('Bill deleted!')
    }
  }

  const handleCancel = () => {
    setFormData({
      ticketNumber: '',
      guestName: '',
      roomNumber: '',
      serviceType: 'Washing',
      items: [],
      totalAmount: '',
      discount: '',
      taxAmount: '',
      finalAmount: '',
      paymentMethod: 'Room Charge',
      status: 'Pending',
      isActive: true
    })
    setSelectedItems([])
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredBills = laundryBills.filter(bill =>
    bill.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.roomNumber.includes(searchTerm)
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-yellow-100 text-yellow-800'
      case 'Pending': return 'bg-blue-100 text-blue-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => {
    return `Rs ${amount.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Laundry Billing</h1>
            <p className="text-pink-100">Manage laundry service billing and payments</p>
          </div>
          <SparklesIcon className="h-12 w-12 text-pink-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-pink-100 rounded-lg p-3">
              <SparklesIcon className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bills</p>
              <p className="text-2xl font-bold text-gray-900">{laundryBills.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {laundryBills.filter(b => b.status === 'Completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {laundryBills.filter(b => b.status === 'In Progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <SparklesIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(laundryBills.reduce((sum, b) => sum + b.finalAmount, 0))}
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
            placeholder="Search bills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Bill
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Laundry Bill' : 'Create New Laundry Bill'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Guest Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.guestName}
                  onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    errors.guestName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ahmed Ali"
                />
                {errors.guestName && <p className="mt-1 text-sm text-red-600">{errors.guestName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Room Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    errors.roomNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="205"
                />
                {errors.roomNumber && <p className="mt-1 text-sm text-red-600">{errors.roomNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="Room Charge">Room Charge</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Service Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {laundryServices.map(service => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{service.name}</h4>
                        <p className="text-sm text-gray-500">{service.category}</p>
                        <p className="text-lg font-bold text-pink-600">{formatCurrency(service.price)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addServiceItem(service)}
                        className="px-3 py-1 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {errors.items && <p className="text-sm text-red-600">{errors.items}</p>}
            </div>

            {/* Selected Items */}
            {selectedItems.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Items</h3>
                <div className="space-y-3 mb-4">
                  {selectedItems.map(item => (
                    <div key={item.serviceId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.serviceName}</h4>
                        <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => updateItemQuantity(item.serviceId, item.quantity - 1)}
                          className="p-1 text-gray-600 hover:text-red-600"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateItemQuantity(item.serviceId, item.quantity + 1)}
                          className="p-1 text-gray-600 hover:text-green-600"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                        <div className="text-right ml-4">
                          <div className="font-medium text-gray-900">{formatCurrency(item.total)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bill Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Bill Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(parseFloat(formData.totalAmount) || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => {
                      setFormData({...formData, discount: e.target.value})
                      setTimeout(calculateBill, 100)
                    }}
                    min="0"
                    className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                    placeholder="0"
                  />
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%):</span>
                  <span>{formatCurrency(parseFloat(formData.taxAmount) || 0)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Final Amount:</span>
                    <span className="text-pink-600">{formatCurrency(parseFloat(formData.finalAmount) || 0)}</span>
                  </div>
                </div>
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
                className="px-8 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-rose-700 disabled:opacity-50 transition-all duration-200 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    {editingId ? 'Update' : 'Create'} Bill
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bills List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Laundry Bills ({filteredBills.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{bill.ticketNumber}</div>
                      <div className="text-sm text-gray-500">{bill.billDate}</div>
                      <div className="text-sm text-gray-500">Delivery: {bill.deliveryDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{bill.guestName}</div>
                      <div className="text-sm text-gray-500">Room {bill.roomNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{bill.items.length} items</div>
                    <div className="text-sm text-gray-500">{bill.serviceType}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(bill.finalAmount)}</div>
                    <div className="text-sm text-gray-500">{bill.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bill.status)}`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(bill)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                      >
                        <PrinterIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(bill.id)}
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

export default LaundryBilling;
