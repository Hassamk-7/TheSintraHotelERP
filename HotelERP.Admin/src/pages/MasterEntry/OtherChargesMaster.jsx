import { useState } from 'react'
import {
  CurrencyDollarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  TagIcon
} from '@heroicons/react/24/outline'

const OtherChargesMaster = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    chargeName: '',
    chargeCode: '',
    description: '',
    chargeType: 'Fixed',
    amount: '',
    taxable: true,
    category: 'Service',
    isActive: true
  })

  const [otherCharges, setOtherCharges] = useState([
    {
      id: 1,
      chargeName: 'Service Charge',
      chargeCode: 'SC',
      description: 'Standard service charge for all services',
      chargeType: 'Percentage',
      amount: 10,
      taxable: true,
      category: 'Service',
      isActive: true
    },
    {
      id: 2,
      chargeName: 'WiFi Charge',
      chargeCode: 'WIFI',
      description: 'Internet connectivity charge per day',
      chargeType: 'Fixed',
      amount: 500,
      taxable: true,
      category: 'Amenity',
      isActive: true
    },
    {
      id: 3,
      chargeName: 'Laundry Service',
      chargeCode: 'LAUN',
      description: 'Laundry service charge per item',
      chargeType: 'Fixed',
      amount: 200,
      taxable: false,
      category: 'Service',
      isActive: true
    },
    {
      id: 4,
      chargeName: 'Airport Transfer',
      chargeCode: 'AT',
      description: 'Airport pickup and drop service',
      chargeType: 'Fixed',
      amount: 2000,
      taxable: true,
      category: 'Transport',
      isActive: true
    },
    {
      id: 5,
      chargeName: 'Late Checkout Fee',
      chargeCode: 'LCF',
      description: 'Additional charge for late checkout',
      chargeType: 'Fixed',
      amount: 1000,
      taxable: false,
      category: 'Penalty',
      isActive: true
    },
    {
      id: 6,
      chargeName: 'Minibar Charge',
      chargeCode: 'MB',
      description: 'Minibar consumption charges',
      chargeType: 'Variable',
      amount: 0,
      taxable: true,
      category: 'Amenity',
      isActive: true
    }
  ])

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.chargeName.trim()) {
      newErrors.chargeName = 'Charge name is required'
    }

    if (!formData.chargeCode.trim()) {
      newErrors.chargeCode = 'Charge code is required'
    }

    if (formData.chargeType !== 'Variable') {
      if (!formData.amount || parseFloat(formData.amount) < 0) {
        newErrors.amount = 'Valid amount is required'
      }

      if (formData.chargeType === 'Percentage' && parseFloat(formData.amount) > 100) {
        newErrors.amount = 'Percentage cannot exceed 100%'
      }
    }

    // Check for duplicate code
    const existingCharge = otherCharges.find(charge => 
      charge.chargeCode.toLowerCase() === formData.chargeCode.toLowerCase() && 
      charge.id !== editingId
    )
    if (existingCharge) {
      newErrors.chargeCode = 'Charge code already exists'
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
        setOtherCharges(prev => prev.map(charge => 
          charge.id === editingId 
            ? { 
                ...formData, 
                id: editingId,
                amount: formData.chargeType === 'Variable' ? 0 : parseFloat(formData.amount)
              }
            : charge
        ))
      } else {
        const newCharge = {
          ...formData,
          id: Date.now(),
          amount: formData.chargeType === 'Variable' ? 0 : parseFloat(formData.amount)
        }
        setOtherCharges(prev => [...prev, newCharge])
      }
      
      handleCancel()
      alert(editingId ? 'Charge updated successfully!' : 'Charge created successfully!')
    } catch (error) {
      console.error('Error saving charge:', error)
      alert('Error saving charge. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (charge) => {
    setFormData({
      chargeName: charge.chargeName,
      chargeCode: charge.chargeCode,
      description: charge.description,
      chargeType: charge.chargeType,
      amount: charge.chargeType === 'Variable' ? '' : charge.amount.toString(),
      taxable: charge.taxable,
      category: charge.category,
      isActive: charge.isActive
    })
    setEditingId(charge.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this charge?')) {
      setOtherCharges(prev => prev.filter(charge => charge.id !== id))
      alert('Charge deleted successfully!')
    }
  }

  const handleCancel = () => {
    setFormData({
      chargeName: '',
      chargeCode: '',
      description: '',
      chargeType: 'Fixed',
      amount: '',
      taxable: true,
      category: 'Service',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredCharges = otherCharges.filter(charge =>
    charge.chargeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    charge.chargeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    charge.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Other Charges Master</h1>
            <p className="text-pink-100">Manage additional service charges and fees</p>
          </div>
          <CurrencyDollarIcon className="h-12 w-12 text-pink-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-pink-100 rounded-lg p-3">
              <TagIcon className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Charges</p>
              <p className="text-2xl font-bold text-gray-900">{otherCharges.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Charges</p>
              <p className="text-2xl font-bold text-gray-900">
                {otherCharges.filter(charge => charge.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fixed Charges</p>
              <p className="text-2xl font-bold text-gray-900">
                {otherCharges.filter(charge => charge.chargeType === 'Fixed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <TagIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taxable Charges</p>
              <p className="text-2xl font-bold text-gray-900">
                {otherCharges.filter(charge => charge.taxable).length}
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
            placeholder="Search charges..."
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
          Add Charge
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Charge' : 'Add New Charge'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Charge Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.chargeName}
                  onChange={(e) => setFormData({...formData, chargeName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                    errors.chargeName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter charge name"
                />
                {errors.chargeName && (
                  <p className="mt-1 text-sm text-red-600">{errors.chargeName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Charge Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.chargeCode}
                  onChange={(e) => setFormData({...formData, chargeCode: e.target.value.toUpperCase()})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                    errors.chargeCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter charge code"
                />
                {errors.chargeCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.chargeCode}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Charge Type
                </label>
                <select
                  value={formData.chargeType}
                  onChange={(e) => {
                    setFormData({...formData, chargeType: e.target.value, amount: ''})
                    setErrors({...errors, amount: ''})
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
                >
                  <option value="Fixed">Fixed Amount</option>
                  <option value="Percentage">Percentage</option>
                  <option value="Variable">Variable (Per Usage)</option>
                </select>
              </div>

              {formData.chargeType !== 'Variable' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount {formData.chargeType === 'Percentage' ? '(%)' : '(Rs)'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    min="0"
                    max={formData.chargeType === 'Percentage' ? '100' : undefined}
                    step={formData.chargeType === 'Percentage' ? '0.1' : '0.01'}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                      errors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={formData.chargeType === 'Percentage' ? '10.0' : '500'}
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
                >
                  <option value="Service">Service</option>
                  <option value="Amenity">Amenity</option>
                  <option value="Transport">Transport</option>
                  <option value="Penalty">Penalty</option>
                  <option value="Tax">Tax</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Taxable
                </label>
                <select
                  value={formData.taxable}
                  onChange={(e) => setFormData({...formData, taxable: e.target.value === 'true'})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
                >
                  <option value="true">Yes (Taxable)</option>
                  <option value="false">No (Non-Taxable)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
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
                    {editingId ? 'Update' : 'Save'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Charges List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Other Charges ({filteredCharges.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Charge Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax Status
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
              {filteredCharges.map((charge) => (
                <tr key={charge.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{charge.chargeName}</div>
                      <div className="text-sm text-gray-500">{charge.chargeCode}</div>
                      <div className="text-sm text-gray-500">{charge.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mb-1 ${
                        charge.chargeType === 'Fixed' ? 'bg-blue-100 text-blue-800' :
                        charge.chargeType === 'Percentage' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {charge.chargeType}
                      </span>
                      <div className="text-sm text-gray-900">
                        {charge.chargeType === 'Variable' ? 'Per Usage' :
                         charge.chargeType === 'Percentage' ? `${charge.amount}%` :
                         `Rs ${charge.amount.toLocaleString()}`}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      charge.category === 'Service' ? 'bg-blue-100 text-blue-800' :
                      charge.category === 'Amenity' ? 'bg-green-100 text-green-800' :
                      charge.category === 'Transport' ? 'bg-purple-100 text-purple-800' :
                      charge.category === 'Penalty' ? 'bg-red-100 text-red-800' :
                      charge.category === 'Tax' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {charge.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      charge.taxable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {charge.taxable ? 'Taxable' : 'Non-Taxable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      charge.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {charge.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(charge)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(charge.id)}
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
          
          {filteredCharges.length === 0 && (
            <div className="text-center py-12">
              <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No charges found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new charge.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OtherChargesMaster;
