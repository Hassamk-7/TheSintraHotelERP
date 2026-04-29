import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  DocumentDuplicateIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  PrinterIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

const VoucherManagement = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  
  const [formData, setFormData] = useState({
    voucherNumber: '',
    voucherType: 'Payment',
    date: '',
    payTo: '',
    amount: '',
    description: '',
    reference: '',
    approvedBy: '',
    status: 'Draft',
    isActive: true
  })

  const [vouchers, setVouchers] = useState([
    {
      id: 1,
      voucherNumber: 'PV-001',
      voucherType: 'Payment',
      date: '2024-01-15',
      payTo: 'ABC Food Suppliers',
      amount: 85000,
      description: 'Payment for monthly food supplies',
      reference: 'BILL-SUP-001',
      approvedBy: 'Manager',
      status: 'Approved',
      createdBy: 'Accountant',
      createdAt: '2024-01-15T10:30:00',
      isActive: true
    },
    {
      id: 2,
      voucherNumber: 'RV-001',
      voucherType: 'Receipt',
      date: '2024-01-15',
      payTo: 'Ahmed Ali',
      amount: 36520,
      description: 'Guest payment for room stay',
      reference: 'BILL-001',
      approvedBy: 'Manager',
      status: 'Approved',
      createdBy: 'Front Desk',
      createdAt: '2024-01-15T14:20:00',
      isActive: true
    },
    {
      id: 3,
      voucherNumber: 'JV-001',
      voucherType: 'Journal',
      date: '2024-01-16',
      payTo: 'Depreciation Entry',
      amount: 35000,
      description: 'Monthly depreciation on equipment',
      reference: 'DEP-JAN-2024',
      approvedBy: '',
      status: 'Draft',
      createdBy: 'Accountant',
      createdAt: '2024-01-16T09:15:00',
      isActive: true
    },
    {
      id: 4,
      voucherNumber: 'CV-001',
      voucherType: 'Contra',
      date: '2024-01-16',
      payTo: 'Bank Transfer',
      amount: 50000,
      description: 'Cash deposited to bank account',
      reference: 'DEP-001',
      approvedBy: 'Manager',
      status: 'Approved',
      createdBy: 'Cashier',
      createdAt: '2024-01-16T11:45:00',
      isActive: true
    }
  ])

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const voucherTypes = [
    { value: 'Payment', label: 'Payment Voucher', prefix: 'PV' },
    { value: 'Receipt', label: 'Receipt Voucher', prefix: 'RV' },
    { value: 'Journal', label: 'Journal Voucher', prefix: 'JV' },
    { value: 'Contra', label: 'Contra Voucher', prefix: 'CV' }
  ]

  const validateForm = () => {
    const newErrors = {}
    if (!formData.voucherType) newErrors.voucherType = 'Voucher type is required'
    if (!formData.date) newErrors.date = 'Date is required'
    if (!formData.payTo.trim()) newErrors.payTo = 'Pay to field is required'
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required'
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateVoucherNumber = (type) => {
    const prefix = voucherTypes.find(vt => vt.value === type)?.prefix || 'V'
    const count = vouchers.filter(v => v.voucherType === type).length + 1
    return `${prefix}-${String(count).padStart(3, '0')}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingId) {
        setVouchers(prev => prev.map(voucher => 
          voucher.id === editingId 
            ? { 
                ...formData, 
                id: editingId,
                amount: parseFloat(formData.amount),
                createdAt: new Date().toISOString()
              }
            : voucher
        ))
      } else {
        const newVoucher = {
          ...formData,
          id: Date.now(),
          voucherNumber: generateVoucherNumber(formData.voucherType),
          amount: parseFloat(formData.amount),
          createdBy: 'Current User',
          createdAt: new Date().toISOString()
        }
        setVouchers(prev => [...prev, newVoucher])
      }
      
      handleCancel()
      alert(editingId ? 'Voucher updated successfully!' : 'Voucher created successfully!')
    } catch (error) {
      alert('Error saving voucher. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (voucher) => {
    setFormData({
      voucherNumber: voucher.voucherNumber,
      voucherType: voucher.voucherType,
      date: voucher.date,
      payTo: voucher.payTo,
      amount: voucher.amount.toString(),
      description: voucher.description,
      reference: voucher.reference,
      approvedBy: voucher.approvedBy,
      status: voucher.status,
      isActive: voucher.isActive
    })
    setEditingId(voucher.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this voucher?')) {
      setVouchers(prev => prev.filter(voucher => voucher.id !== id))
      alert('Voucher deleted successfully!')
    }
  }

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this voucher?')) {
      setVouchers(prev => prev.map(voucher => 
        voucher.id === id 
          ? { ...voucher, status: 'Approved', approvedBy: 'Current User' }
          : voucher
      ))
      alert('Voucher approved successfully!')
    }
  }

  const handleCancel = () => {
    setFormData({
      voucherNumber: '',
      voucherType: 'Payment',
      date: '',
      payTo: '',
      amount: '',
      description: '',
      reference: '',
      approvedBy: '',
      status: 'Draft',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredVouchers = vouchers.filter(voucher => {
    const matchesSearch = voucher.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucher.payTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucher.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === '' || voucher.voucherType === selectedType
    return matchesSearch && matchesType
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800'
      case 'Draft': return 'bg-yellow-100 text-yellow-800'
      case 'Rejected': return 'bg-red-100 text-red-800'
      case 'Cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getVoucherTypeColor = (type) => {
    switch (type) {
      case 'Payment': return 'bg-red-100 text-red-800'
      case 'Receipt': return 'bg-green-100 text-green-800'
      case 'Journal': return 'bg-blue-100 text-blue-800'
      case 'Contra': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Calculate statistics
  const totalAmount = vouchers.reduce((sum, v) => sum + v.amount, 0)
  const approvedAmount = vouchers.filter(v => v.status === 'Approved').reduce((sum, v) => sum + v.amount, 0)
  const pendingCount = vouchers.filter(v => v.status === 'Draft').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Voucher Management</h1>
            <p className="text-teal-100">Create and manage payment, receipt, journal, and contra vouchers</p>
          </div>
          <DocumentDuplicateIcon className="h-12 w-12 text-teal-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-teal-100 rounded-lg p-3">
              <DocumentDuplicateIcon className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Vouchers</p>
              <p className="text-2xl font-bold text-gray-900">{vouchers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved Amount</p>
              <p className="text-2xl font-bold text-gray-900">Rs {approvedAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <EyeIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <DocumentDuplicateIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">Rs {totalAmount.toLocaleString()}</p>
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
              placeholder="Search vouchers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Voucher Types</option>
            {voucherTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Voucher
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Voucher' : 'Create New Voucher'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Voucher Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.voucherType}
                  onChange={(e) => setFormData({...formData, voucherType: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.voucherType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {voucherTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {errors.voucherType && <p className="mt-1 text-sm text-red-600">{errors.voucherType}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pay To / Receive From <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.payTo}
                  onChange={(e) => setFormData({...formData, payTo: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.payTo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ABC Food Suppliers"
                />
                {errors.payTo && <p className="mt-1 text-sm text-red-600">{errors.payTo}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (Rs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="85000"
                />
                {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reference</label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => setFormData({...formData, reference: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="BILL-SUP-001"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Draft">Draft</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Payment for monthly food supplies"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
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
                className="px-8 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 transition-all duration-200 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    {editingId ? 'Update' : 'Create'} Voucher
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vouchers List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Vouchers ({filteredVouchers.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVouchers.map((voucher) => (
                <tr key={voucher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{voucher.voucherNumber}</div>
                      <div className="text-sm text-gray-500">{voucher.date}</div>
                      <div className="text-sm text-gray-500">Ref: {voucher.reference}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVoucherTypeColor(voucher.voucherType)}`}>
                      {voucher.voucherType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{voucher.payTo}</div>
                    <div className="text-sm text-gray-500">{voucher.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">Rs {voucher.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(voucher.status)}`}>
                      {voucher.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(voucher)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                        title="Print"
                      >
                        <PrinterIcon className="h-4 w-4" />
                      </button>
                      {voucher.status === 'Draft' && (
                        <button
                          onClick={() => handleApprove(voucher.id)}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50 transition-colors"
                          title="Approve"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(voucher.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete"
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

export default VoucherManagement;
