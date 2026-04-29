import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CalculatorIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const TaxManagement = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [formData, setFormData] = useState({
    taxName: '',
    taxCode: '',
    taxRate: '',
    taxType: 'Sales Tax',
    description: '',
    applicableOn: 'Room Charges',
    isActive: true
  })

  const [taxes, setTaxes] = useState([
    {
      id: 1,
      taxName: 'Sales Tax',
      taxCode: 'ST',
      taxRate: 17,
      taxType: 'Sales Tax',
      description: 'Standard sales tax on services',
      applicableOn: 'Room Charges',
      totalCollected: 125000,
      isActive: true
    },
    {
      id: 2,
      taxName: 'Service Tax',
      taxCode: 'SRV',
      taxRate: 10,
      taxType: 'Service Tax',
      description: 'Service tax on restaurant and bar',
      applicableOn: 'Restaurant Charges',
      totalCollected: 45000,
      isActive: true
    },
    {
      id: 3,
      taxName: 'Withholding Tax',
      taxCode: 'WHT',
      taxRate: 5,
      taxType: 'Withholding Tax',
      description: 'Withholding tax on payments',
      applicableOn: 'Vendor Payments',
      totalCollected: 25000,
      isActive: true
    }
  ])

  const [taxReturns, setTaxReturns] = useState([
    {
      id: 1,
      returnPeriod: '2024-01',
      taxType: 'Sales Tax',
      totalSales: 750000,
      taxableAmount: 650000,
      taxCollected: 110500,
      taxPaid: 110500,
      status: 'Filed',
      dueDate: '2024-02-15',
      filedDate: '2024-02-10'
    },
    {
      id: 2,
      returnPeriod: '2024-01',
      taxType: 'Service Tax',
      totalSales: 450000,
      taxableAmount: 450000,
      taxCollected: 45000,
      taxPaid: 0,
      status: 'Pending',
      dueDate: '2024-02-15',
      filedDate: null
    }
  ])

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.taxName.trim()) newErrors.taxName = 'Tax name is required'
    if (!formData.taxCode.trim()) newErrors.taxCode = 'Tax code is required'
    if (!formData.taxRate || parseFloat(formData.taxRate) < 0 || parseFloat(formData.taxRate) > 100) {
      newErrors.taxRate = 'Valid tax rate (0-100%) is required'
    }
    
    // Check for duplicate tax code
    const existingTax = taxes.find(tax => 
      tax.taxCode.toLowerCase() === formData.taxCode.toLowerCase() && 
      tax.id !== editingId
    )
    if (existingTax) {
      newErrors.taxCode = 'Tax code already exists'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingId) {
        setTaxes(prev => prev.map(tax => 
          tax.id === editingId 
            ? { 
                ...formData, 
                id: editingId,
                taxRate: parseFloat(formData.taxRate),
                totalCollected: taxes.find(t => t.id === editingId)?.totalCollected || 0
              }
            : tax
        ))
      } else {
        const newTax = {
          ...formData,
          id: Date.now(),
          taxRate: parseFloat(formData.taxRate),
          totalCollected: 0
        }
        setTaxes(prev => [...prev, newTax])
      }
      
      handleCancel()
      alert(editingId ? 'Tax updated successfully!' : 'Tax created successfully!')
    } catch (error) {
      alert('Error saving tax. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (tax) => {
    setFormData({
      taxName: tax.taxName,
      taxCode: tax.taxCode,
      taxRate: tax.taxRate.toString(),
      taxType: tax.taxType,
      description: tax.description,
      applicableOn: tax.applicableOn,
      isActive: tax.isActive
    })
    setEditingId(tax.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tax?')) {
      setTaxes(prev => prev.filter(tax => tax.id !== id))
      alert('Tax deleted successfully!')
    }
  }

  const handleCancel = () => {
    setFormData({
      taxName: '',
      taxCode: '',
      taxRate: '',
      taxType: 'Sales Tax',
      description: '',
      applicableOn: 'Room Charges',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredTaxes = taxes.filter(tax =>
    tax.taxName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tax.taxCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tax.taxType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Filed': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTaxTypeColor = (type) => {
    switch (type) {
      case 'Sales Tax': return 'bg-blue-100 text-blue-800'
      case 'Service Tax': return 'bg-green-100 text-green-800'
      case 'Withholding Tax': return 'bg-purple-100 text-purple-800'
      case 'Income Tax': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Calculate statistics
  const totalTaxCollected = taxes.reduce((sum, tax) => sum + tax.totalCollected, 0)
  const activeTaxes = taxes.filter(tax => tax.isActive).length
  const pendingReturns = taxReturns.filter(ret => ret.status === 'Pending').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Tax Management</h1>
            <p className="text-purple-100">Manage tax rates, calculations, and compliance</p>
          </div>
          <CalculatorIcon className="h-12 w-12 text-purple-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tax Collected</p>
              <p className="text-2xl font-bold text-gray-900">Rs {totalTaxCollected.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CalculatorIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Tax Types</p>
              <p className="text-2xl font-bold text-gray-900">{activeTaxes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <DocumentTextIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Returns</p>
              <p className="text-2xl font-bold text-gray-900">{pendingReturns}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Tax Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {taxes.length > 0 ? (taxes.reduce((sum, tax) => sum + tax.taxRate, 0) / taxes.length).toFixed(1) : 0}%
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
            placeholder="Search taxes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Tax
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Tax' : 'Add New Tax'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tax Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.taxName}
                  onChange={(e) => setFormData({...formData, taxName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.taxName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Sales Tax"
                />
                {errors.taxName && <p className="mt-1 text-sm text-red-600">{errors.taxName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tax Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.taxCode}
                  onChange={(e) => setFormData({...formData, taxCode: e.target.value.toUpperCase()})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.taxCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ST"
                />
                {errors.taxCode && <p className="mt-1 text-sm text-red-600">{errors.taxCode}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tax Rate (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({...formData, taxRate: e.target.value})}
                  min="0"
                  max="100"
                  step="0.1"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.taxRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="17"
                />
                {errors.taxRate && <p className="mt-1 text-sm text-red-600">{errors.taxRate}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tax Type</label>
                <select
                  value={formData.taxType}
                  onChange={(e) => setFormData({...formData, taxType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Sales Tax">Sales Tax</option>
                  <option value="Service Tax">Service Tax</option>
                  <option value="Withholding Tax">Withholding Tax</option>
                  <option value="Income Tax">Income Tax</option>
                  <option value="Property Tax">Property Tax</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Applicable On</label>
                <select
                  value={formData.applicableOn}
                  onChange={(e) => setFormData({...formData, applicableOn: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Room Charges">Room Charges</option>
                  <option value="Restaurant Charges">Restaurant Charges</option>
                  <option value="Laundry Charges">Laundry Charges</option>
                  <option value="All Services">All Services</option>
                  <option value="Vendor Payments">Vendor Payments</option>
                </select>
              </div>

              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">Active Tax</label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Tax description and applicability"
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
                className="px-8 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    {editingId ? 'Update' : 'Add'} Tax
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tax Configuration */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Tax Configuration ({filteredTaxes.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate & Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicable On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Collected</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTaxes.map((tax) => (
                <tr key={tax.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{tax.taxName}</div>
                      <div className="text-sm text-gray-500">Code: {tax.taxCode}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{tax.taxRate}%</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTaxTypeColor(tax.taxType)}`}>
                        {tax.taxType}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{tax.applicableOn}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">Rs {tax.totalCollected.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      tax.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {tax.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(tax)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tax.id)}
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

      {/* Tax Returns Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Tax Returns Summary</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taxable Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Collected</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {taxReturns.map((returnItem) => (
                <tr key={returnItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{returnItem.returnPeriod}</div>
                    <div className="text-sm text-gray-500">Due: {returnItem.dueDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTaxTypeColor(returnItem.taxType)}`}>
                      {returnItem.taxType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">Rs {returnItem.taxableAmount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">Rs {returnItem.taxCollected.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">Rs {returnItem.taxPaid.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(returnItem.status)}`}>
                      {returnItem.status}
                    </span>
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

export default TaxManagement;
