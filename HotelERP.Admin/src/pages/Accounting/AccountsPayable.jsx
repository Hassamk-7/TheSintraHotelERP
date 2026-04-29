import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  DocumentMinusIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

const AccountsPayable = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [formData, setFormData] = useState({
    billNumber: '',
    vendorName: '',
    vendorType: 'Supplier',
    amount: '',
    dueDate: '',
    description: '',
    category: 'Inventory',
    status: 'Outstanding',
    isActive: true
  })

  const [payables, setPayables] = useState([
    {
      id: 1,
      billNumber: 'BILL-SUP-001',
      vendorName: 'ABC Food Suppliers',
      vendorType: 'Supplier',
      amount: 85000,
      issueDate: '2024-01-10',
      dueDate: '2024-01-25',
      description: 'Monthly food supplies for restaurant',
      category: 'Inventory',
      status: 'Outstanding',
      daysUntilDue: 9,
      isActive: true
    },
    {
      id: 2,
      billNumber: 'BILL-UTL-001',
      vendorName: 'K-Electric',
      vendorType: 'Utility',
      amount: 45000,
      issueDate: '2024-01-05',
      dueDate: '2024-01-20',
      description: 'Monthly electricity bill',
      category: 'Utilities',
      status: 'Overdue',
      daysUntilDue: -4,
      isActive: true
    },
    {
      id: 3,
      billNumber: 'BILL-SRV-001',
      vendorName: 'CleanPro Services',
      vendorType: 'Service Provider',
      amount: 25000,
      issueDate: '2024-01-12',
      dueDate: '2024-01-27',
      description: 'Deep cleaning services',
      category: 'Services',
      status: 'Outstanding',
      daysUntilDue: 11,
      isActive: true
    },
    {
      id: 4,
      billNumber: 'BILL-MNT-001',
      vendorName: 'TechFix Solutions',
      vendorType: 'Service Provider',
      amount: 15000,
      issueDate: '2024-01-08',
      dueDate: '2024-01-23',
      description: 'AC maintenance and repair',
      category: 'Maintenance',
      status: 'Paid',
      daysUntilDue: 0,
      isActive: true
    }
  ])

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.vendorName.trim()) newErrors.vendorName = 'Vendor name is required'
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required'
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const dueDate = new Date(formData.dueDate)
      const today = new Date()
      const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
      
      if (editingId) {
        setPayables(prev => prev.map(item => 
          item.id === editingId 
            ? { 
                ...formData, 
                id: editingId,
                amount: parseFloat(formData.amount),
                issueDate: new Date().toISOString().split('T')[0],
                daysUntilDue
              }
            : item
        ))
      } else {
        const newPayable = {
          ...formData,
          id: Date.now(),
          billNumber: `BILL-${formData.category.substring(0, 3).toUpperCase()}-${String(Date.now()).slice(-3)}`,
          amount: parseFloat(formData.amount),
          issueDate: new Date().toISOString().split('T')[0],
          daysUntilDue
        }
        setPayables(prev => [...prev, newPayable])
      }
      
      handleCancel()
      alert(editingId ? 'Payable updated successfully!' : 'Payable created successfully!')
    } catch (error) {
      alert('Error saving payable. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
    setFormData({
      billNumber: item.billNumber,
      vendorName: item.vendorName,
      vendorType: item.vendorType,
      amount: item.amount.toString(),
      dueDate: item.dueDate,
      description: item.description,
      category: item.category,
      status: item.status,
      isActive: item.isActive
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payable?')) {
      setPayables(prev => prev.filter(item => item.id !== id))
      alert('Payable deleted successfully!')
    }
  }

  const handleCancel = () => {
    setFormData({
      billNumber: '',
      vendorName: '',
      vendorType: 'Supplier',
      amount: '',
      dueDate: '',
      description: '',
      category: 'Inventory',
      status: 'Outstanding',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredPayables = payables.filter(item =>
    item.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Outstanding': return 'bg-yellow-100 text-yellow-800'
      case 'Overdue': return 'bg-red-100 text-red-800'
      case 'Paid': return 'bg-green-100 text-green-800'
      case 'Cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Inventory': return 'bg-blue-100 text-blue-800'
      case 'Utilities': return 'bg-orange-100 text-orange-800'
      case 'Services': return 'bg-purple-100 text-purple-800'
      case 'Maintenance': return 'bg-green-100 text-green-800'
      case 'Marketing': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Calculate statistics
  const totalPayables = payables.reduce((sum, p) => sum + p.amount, 0)
  const totalOutstanding = payables.filter(p => p.status === 'Outstanding').reduce((sum, p) => sum + p.amount, 0)
  const totalOverdue = payables.filter(p => p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0)
  const overdueCount = payables.filter(p => p.status === 'Overdue').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Accounts Payable</h1>
            <p className="text-red-100">Manage vendor bills and payment obligations</p>
          </div>
          <DocumentMinusIcon className="h-12 w-12 text-red-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <DocumentMinusIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Payables</p>
              <p className="text-2xl font-bold text-gray-900">Rs {totalPayables.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <BuildingOfficeIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">Rs {totalOutstanding.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">Rs {totalOverdue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Payment Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {payables.length > 0 ? Math.round((payables.filter(p => p.status === 'Paid').length / payables.length) * 100) : 0}%
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
            placeholder="Search payables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Payable
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Payable' : 'Add New Payable'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vendor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.vendorName}
                  onChange={(e) => setFormData({...formData, vendorName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.vendorName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ABC Food Suppliers"
                />
                {errors.vendorName && <p className="mt-1 text-sm text-red-600">{errors.vendorName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Vendor Type</label>
                <select
                  value={formData.vendorType}
                  onChange={(e) => setFormData({...formData, vendorType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Supplier">Supplier</option>
                  <option value="Utility">Utility</option>
                  <option value="Service Provider">Service Provider</option>
                  <option value="Contractor">Contractor</option>
                  <option value="Consultant">Consultant</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Inventory">Inventory</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Services">Services</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Insurance">Insurance</option>
                </select>
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
                  step="100"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="85000"
                />
                {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.dueDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Outstanding">Outstanding</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Paid">Paid</option>
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Description of goods or services"
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
                className="px-8 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-pink-700 disabled:opacity-50 transition-all duration-200 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    {editingId ? 'Update' : 'Add'} Payable
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payables List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Accounts Payable ({filteredPayables.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayables.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.billNumber}</div>
                      <div className="text-sm text-gray-500">{item.issueDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.vendorName}</div>
                      <div className="text-sm text-gray-500">{item.vendorType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">Rs {item.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-gray-900">{item.dueDate}</div>
                      {item.daysUntilDue < 0 && (
                        <div className="text-sm text-red-600">{Math.abs(item.daysUntilDue)} days overdue</div>
                      )}
                      {item.daysUntilDue > 0 && item.daysUntilDue <= 7 && (
                        <div className="text-sm text-orange-600">Due in {item.daysUntilDue} days</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
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

export default AccountsPayable;
