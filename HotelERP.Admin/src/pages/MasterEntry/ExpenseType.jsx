import { useState } from 'react'
import {
  DocumentChartBarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  TagIcon
} from '@heroicons/react/24/outline'

const ExpenseType = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    typeName: '',
    typeCode: '',
    description: '',
    category: 'Operational',
    isTaxDeductible: true,
    isActive: true
  })

  const [expenseTypes, setExpenseTypes] = useState([
    {
      id: 1,
      typeName: 'Electricity Bill',
      typeCode: 'ELEC',
      description: 'Monthly electricity and power expenses',
      category: 'Utilities',
      isTaxDeductible: true,
      isActive: true
    },
    {
      id: 2,
      typeName: 'Staff Salaries',
      typeCode: 'SAL',
      description: 'Employee salary and wage payments',
      category: 'Personnel',
      isTaxDeductible: true,
      isActive: true
    },
    {
      id: 3,
      typeName: 'Food Supplies',
      typeCode: 'FOOD',
      description: 'Kitchen and restaurant food inventory',
      category: 'Inventory',
      isTaxDeductible: true,
      isActive: true
    },
    {
      id: 4,
      typeName: 'Marketing & Advertising',
      typeCode: 'MARK',
      description: 'Promotional and advertising expenses',
      category: 'Marketing',
      isTaxDeductible: true,
      isActive: true
    },
    {
      id: 5,
      typeName: 'Equipment Maintenance',
      typeCode: 'MAINT',
      description: 'Repair and maintenance of hotel equipment',
      category: 'Maintenance',
      isTaxDeductible: true,
      isActive: true
    },
    {
      id: 6,
      typeName: 'Insurance Premium',
      typeCode: 'INS',
      description: 'Property and liability insurance payments',
      category: 'Insurance',
      isTaxDeductible: true,
      isActive: true
    },
    {
      id: 7,
      typeName: 'Office Supplies',
      typeCode: 'OFF',
      description: 'Stationery and office equipment expenses',
      category: 'Administrative',
      isTaxDeductible: true,
      isActive: true
    },
    {
      id: 8,
      typeName: 'Transportation',
      typeCode: 'TRANS',
      description: 'Vehicle fuel and transportation costs',
      category: 'Transportation',
      isTaxDeductible: true,
      isActive: true
    }
  ])

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.typeName.trim()) {
      newErrors.typeName = 'Type name is required'
    }

    if (!formData.typeCode.trim()) {
      newErrors.typeCode = 'Type code is required'
    }

    // Check for duplicate code
    const existingType = expenseTypes.find(type => 
      type.typeCode.toLowerCase() === formData.typeCode.toLowerCase() && 
      type.id !== editingId
    )
    if (existingType) {
      newErrors.typeCode = 'Type code already exists'
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
        setExpenseTypes(prev => prev.map(type => 
          type.id === editingId 
            ? { ...formData, id: editingId }
            : type
        ))
      } else {
        const newType = {
          ...formData,
          id: Date.now()
        }
        setExpenseTypes(prev => [...prev, newType])
      }
      
      handleCancel()
      alert(editingId ? 'Expense type updated successfully!' : 'Expense type created successfully!')
    } catch (error) {
      console.error('Error saving expense type:', error)
      alert('Error saving expense type. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (type) => {
    setFormData({
      typeName: type.typeName,
      typeCode: type.typeCode,
      description: type.description,
      category: type.category,
      isTaxDeductible: type.isTaxDeductible,
      isActive: type.isActive
    })
    setEditingId(type.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense type?')) {
      setExpenseTypes(prev => prev.filter(type => type.id !== id))
      alert('Expense type deleted successfully!')
    }
  }

  const handleCancel = () => {
    setFormData({
      typeName: '',
      typeCode: '',
      description: '',
      category: 'Operational',
      isTaxDeductible: true,
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredTypes = expenseTypes.filter(type =>
    type.typeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.typeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-600 to-gray-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Expense Type</h1>
            <p className="text-slate-100">Manage expense categories and classifications</p>
          </div>
          <DocumentChartBarIcon className="h-12 w-12 text-slate-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-slate-100 rounded-lg p-3">
              <TagIcon className="h-6 w-6 text-slate-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Types</p>
              <p className="text-2xl font-bold text-gray-900">{expenseTypes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Types</p>
              <p className="text-2xl font-bold text-gray-900">
                {expenseTypes.filter(type => type.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <DocumentChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tax Deductible</p>
              <p className="text-2xl font-bold text-gray-900">
                {expenseTypes.filter(type => type.isTaxDeductible).length}
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
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(expenseTypes.map(type => type.category)).size}
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
            placeholder="Search expense types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-slate-600 to-gray-600 text-white font-semibold rounded-lg hover:from-slate-700 hover:to-gray-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Expense Type
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Expense Type' : 'Add New Expense Type'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.typeName}
                  onChange={(e) => setFormData({...formData, typeName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors ${
                    errors.typeName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter type name"
                />
                {errors.typeName && (
                  <p className="mt-1 text-sm text-red-600">{errors.typeName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.typeCode}
                  onChange={(e) => setFormData({...formData, typeCode: e.target.value.toUpperCase()})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors ${
                    errors.typeCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter type code"
                />
                {errors.typeCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.typeCode}</p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors"
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors"
                >
                  <option value="Operational">Operational</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Personnel">Personnel</option>
                  <option value="Inventory">Inventory</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Legal">Legal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tax Deductible
                </label>
                <select
                  value={formData.isTaxDeductible}
                  onChange={(e) => setFormData({...formData, isTaxDeductible: e.target.value === 'true'})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors"
                >
                  <option value="true">Yes (Tax Deductible)</option>
                  <option value="false">No (Non-Deductible)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors"
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
                className="px-8 py-2 bg-gradient-to-r from-slate-600 to-gray-600 text-white font-semibold rounded-lg hover:from-slate-700 hover:to-gray-700 disabled:opacity-50 transition-all duration-200 flex items-center"
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

      {/* Expense Types List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Expense Types ({filteredTypes.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
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
              {filteredTypes.map((type) => (
                <tr key={type.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{type.typeName}</div>
                      <div className="text-sm text-gray-500">{type.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{type.typeCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      type.category === 'Operational' ? 'bg-blue-100 text-blue-800' :
                      type.category === 'Utilities' ? 'bg-yellow-100 text-yellow-800' :
                      type.category === 'Personnel' ? 'bg-green-100 text-green-800' :
                      type.category === 'Marketing' ? 'bg-purple-100 text-purple-800' :
                      type.category === 'Maintenance' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {type.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      type.isTaxDeductible 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {type.isTaxDeductible ? 'Deductible' : 'Non-Deductible'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      type.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {type.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(type)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(type.id)}
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
          
          {filteredTypes.length === 0 && (
            <div className="text-center py-12">
              <DocumentChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No expense types found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new expense type.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExpenseType;
