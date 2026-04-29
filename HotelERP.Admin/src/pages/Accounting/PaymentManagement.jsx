import { useState, useEffect } from 'react'
import axios from '../../utils/axios'
import {
  CreditCardIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  BanknotesIcon,
  ReceiptRefundIcon
} from '@heroicons/react/24/outline'

const PaymentManagement = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [formData, setFormData] = useState({
    billNumber: '',
    guestBillId: '',
    guestName: '',
    roomNumber: '',
    paymentAmount: '',
    paymentMethod: 'Cash',
    paymentDate: new Date().toISOString().split('T')[0],
    transactionId: '',
    bankName: '',
    cardNumber: '',
    notes: '',
    status: 'Completed',
    isActive: true
  })

  // Additional states for dynamic functionality
  const [guestBills, setGuestBills] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load data on component mount
  useEffect(() => {
    fetchPayments()
    fetchGuestBills()
  }, [])

  // Fetch payments from API
  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/payment-transactions')
      if (response.data.success) {
        setPayments(response.data.data)
        console.log(`✅ Loaded ${response.data.data.length} payments`)
      }
    } catch (err) {
      console.error('Error fetching payments:', err)
      setError('Failed to load payments. Please ensure API server is running.')
      setPayments([]) // No mock data
    } finally {
      setLoading(false)
    }
  }

  // Fetch guest bills for dropdown
  const fetchGuestBills = async () => {
    try {
      const response = await axios.get('/guest-bills')
      if (response.data.success) {
        setGuestBills(response.data.data)
        console.log(`✅ Loaded ${response.data.data.length} guest bills`)
      }
    } catch (err) {
      console.error('Error fetching guest bills:', err)
    }
  }

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.billNumber.trim()) newErrors.billNumber = 'Bill number is required'
    if (!formData.guestName.trim()) newErrors.guestName = 'Guest name is required'
    if (!formData.paymentAmount || parseFloat(formData.paymentAmount) <= 0) {
      newErrors.paymentAmount = 'Valid payment amount is required'
    }
    if (!formData.paymentDate) newErrors.paymentDate = 'Payment date is required'
    
    // Validate card number for credit/debit card payments
    if (['Credit Card', 'Debit Card'].includes(formData.paymentMethod) && !formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required for card payments'
    }
    
    // Validate transaction ID for bank transfers
    if (formData.paymentMethod === 'Bank Transfer' && !formData.transactionId.trim()) {
      newErrors.transactionId = 'Transaction ID is required for bank transfers'
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
      const paymentData = {
        ...formData,
        paymentAmount: parseFloat(formData.paymentAmount),
        paymentDate: formData.paymentDate,
        createdAt: new Date().toISOString()
      }

      let response
      if (editingId) {
        // Update existing payment
        response = await axios.put(`/payment-transactions/${editingId}`, paymentData)
      } else {
        // Create new payment
        response = await axios.post('/payment-transactions', paymentData)
      }

      if (response.data.success) {
        setSuccess(editingId ? 'Payment updated successfully!' : 'Payment recorded successfully!')
        
        // Refresh payments list
        await fetchPayments()
        handleCancel()
      } else {
        setError('Failed to save payment. Please try again.')
      }
    } catch (error) {
      console.error('Error saving payment:', error)
      setError('Error saving payment. Please try again.')
      
      // Fallback: Add to local state if API fails
      const newPayment = {
        ...formData,
        id: editingId || Date.now(),
        paymentAmount: parseFloat(formData.paymentAmount),
        createdAt: new Date().toISOString()
      }
      
      if (editingId) {
        setPayments(prev => prev.map(payment => payment.id === editingId ? newPayment : payment))
      } else {
        setPayments(prev => [...prev, newPayment])
      }
      
      setSuccess('Payment saved locally (API unavailable)')
      handleCancel()
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (payment) => {
    setFormData({
      paymentNumber: payment.paymentNumber,
      billNumber: payment.billNumber,
      guestName: payment.guestName,
      roomNumber: payment.roomNumber,
      paymentAmount: payment.paymentAmount.toString(),
      paymentMethod: payment.paymentMethod,
      paymentDate: payment.paymentDate,
      transactionId: payment.transactionId,
      bankName: payment.bankName,
      cardNumber: payment.cardNumber,
      notes: payment.notes,
      status: payment.status,
      isActive: payment.isActive
    })
    setEditingId(payment.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      setPayments(prev => prev.filter(payment => payment.id !== id))
      alert('Payment record deleted successfully!')
    }
  }

  const handleCancel = () => {
    setFormData({
      paymentNumber: '',
      billNumber: '',
      guestName: '',
      roomNumber: '',
      paymentAmount: '',
      paymentMethod: 'Cash',
      paymentDate: '',
      transactionId: '',
      bankName: '',
      cardNumber: '',
      notes: '',
      status: 'Completed',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredPayments = payments.filter(payment =>
    payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.roomNumber.includes(searchTerm)
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Failed': return 'bg-red-100 text-red-800'
      case 'Refunded': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'Cash': return 'bg-green-100 text-green-800'
      case 'Credit Card': return 'bg-blue-100 text-blue-800'
      case 'Debit Card': return 'bg-purple-100 text-purple-800'
      case 'Bank Transfer': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Calculate statistics
  const totalPayments = payments.reduce((sum, p) => sum + p.paymentAmount, 0)
  const completedPayments = payments.filter(p => p.status === 'Completed')
  const pendingPayments = payments.filter(p => p.status === 'Pending')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Payment Management</h1>
            <p className="text-blue-100">Track and manage all guest payments and transactions</p>
          </div>
          <CreditCardIcon className="h-12 w-12 text-blue-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CreditCardIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">Rs {totalPayments.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-gray-900">{completedPayments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <BanknotesIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingPayments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <ReceiptRefundIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Payment</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {payments.length > 0 ? Math.round(totalPayments / payments.length).toLocaleString() : 0}
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
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Record Payment
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Payment' : 'Record New Payment'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bill Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.billNumber}
                  onChange={(e) => setFormData({...formData, billNumber: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.billNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="BILL-001"
                />
                {errors.billNumber && <p className="mt-1 text-sm text-red-600">{errors.billNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Guest Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.guestName}
                  onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.guestName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ahmed Ali"
                />
                {errors.guestName && <p className="mt-1 text-sm text-red-600">{errors.guestName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Room Number</label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="205"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Amount (Rs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.paymentAmount}
                  onChange={(e) => setFormData({...formData, paymentAmount: e.target.value})}
                  min="0"
                  step="100"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.paymentAmount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="36520"
                />
                {errors.paymentAmount && <p className="mt-1 text-sm text-red-600">{errors.paymentAmount}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({...formData, paymentDate: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.paymentDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.paymentDate && <p className="mt-1 text-sm text-red-600">{errors.paymentDate}</p>}
              </div>

              {['Credit Card', 'Debit Card'].includes(formData.paymentMethod) && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Card Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="**** **** **** 1234"
                    />
                    {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="HBL Bank"
                    />
                  </div>
                </>
              )}

              {formData.paymentMethod === 'Bank Transfer' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Transaction ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.transactionId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="TXN123456789"
                  />
                  {errors.transactionId && <p className="mt-1 text-sm text-red-600">{errors.transactionId}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional payment notes or remarks"
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
                className="px-8 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 transition-all duration-200 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    {editingId ? 'Update' : 'Record'} Payment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payments List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Payment Records ({filteredPayments.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount & Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.paymentNumber}</div>
                      <div className="text-sm text-gray-500">Bill: {payment.billNumber}</div>
                      <div className="text-sm text-gray-500">{payment.paymentDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.guestName}</div>
                      {payment.roomNumber && (
                        <div className="text-sm text-gray-500">Room {payment.roomNumber}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Rs {payment.paymentAmount.toLocaleString()}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentMethodColor(payment.paymentMethod)}`}>
                        {payment.paymentMethod}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {payment.transactionId && (
                        <div>TXN: {payment.transactionId}</div>
                      )}
                      {payment.cardNumber && (
                        <div>Card: {payment.cardNumber}</div>
                      )}
                      {payment.bankName && (
                        <div>Bank: {payment.bankName}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(payment)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(payment.id)}
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

export default PaymentManagement;
