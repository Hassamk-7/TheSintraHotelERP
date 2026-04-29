import { useState } from 'react'
import {
  ReceiptPercentIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

const ExpensesMaster = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    expenseTitle: '',
    expenseCode: '',
    description: '',
    expenseType: 'Electricity Bill',
    amount: '',
    expenseDate: '',
    vendor: '',
    paymentMethod: 'Cash',
    isRecurring: false,
    isApproved: false
  })

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      expenseTitle: 'Monthly Electricity Bill',
      expenseCode: 'EXP001',
      description: 'Electricity bill for December 2024',
      expenseType: 'Electricity Bill',
      amount: 45000,
      expenseDate: '2024-01-15',
      vendor: 'K-Electric',
      paymentMethod: 'Bank Transfer',
      isRecurring: true,
      isApproved: true
    },
    {
      id: 2,
      expenseTitle: 'Kitchen Staff Salaries',
      expenseCode: 'EXP002',
      description: 'Monthly salary payment for kitchen staff',
      expenseType: 'Staff Salaries',
      amount: 180000,
      expenseDate: '2024-01-01',
      vendor: 'Hotel Staff',
      paymentMethod: 'Bank Transfer',
      isRecurring: true,
      isApproved: true
    },
    {
      id: 3,
      expenseTitle: 'Fresh Vegetables Purchase',
      expenseCode: 'EXP003',
      description: 'Weekly fresh vegetables for restaurant',
      expenseType: 'Food Supplies',
      amount: 25000,
      expenseDate: '2024-01-10',
      vendor: 'Sabzi Mandi Karachi',
      paymentMethod: 'Cash',
      isRecurring: false,
      isApproved: true
    },
    {
      id: 4,
      expenseTitle: 'Facebook Advertising',
      expenseCode: 'EXP004',
      description: 'Social media marketing campaign',
      expenseType: 'Marketing & Advertising',
      amount: 15000,
      expenseDate: '2024-01-12',
      vendor: 'Facebook Ads',
      paymentMethod: 'Credit Card',
      isRecurring: false,
      isApproved: false
    },
    {
      id: 5,
      expenseTitle: 'AC Repair Service',
      expenseCode: 'EXP005',
      description: 'Air conditioning repair for lobby area',
      expenseType: 'Equipment Maintenance',
      amount: 8000,
      expenseDate: '2024-01-14',
      vendor: 'Cool Air Services',
      paymentMethod: 'Cash',
      isRecurring: false,
      isApproved: true
    }
  ])

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const expenseTypeOptions = [
    'Electricity Bill',
    'Staff Salaries',
    'Food Supplies',
    'Marketing & Advertising',
    'Equipment Maintenance',
    'Insurance Premium',
    'Office Supplies',
    'Transportation'
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.expenseTitle.trim()) {
      newErrors.expenseTitle = 'Expense title is required'
    }

    if (!formData.expenseCode.trim()) {
      newErrors.expenseCode = 'Expense code is required'
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required'
    }

    if (!formData.expenseDate) {
      newErrors.expenseDate = 'Expense date is required'
    }

    if (!formData.vendor.trim()) {
      newErrors.vendor = 'Vendor name is required'
    }

    // Check for duplicate code
    const existingExpense = expenses.find(expense => 
      expense.expenseCode.toLowerCase() === formData.expenseCode.toLowerCase() && 
      expense.id !== editingId
    )
    if (existingExpense) {
      newErrors.expenseCode = 'Expense code already exists'
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
        setExpenses(prev => prev.map(expense => 
          expense.id === editingId 
            ? { 
                ...formData, 
                id: editingId,
                amount: parseFloat(formData.amount)
              }
            : expense
        ))
      } else {
        const newExpense = {
          ...formData,
          id: Date.now(),
          amount: parseFloat(formData.amount)
        }
        setExpenses(prev => [...prev, newExpense])
      }
      
      handleCancel()
      alert(editingId ? 'Expense updated successfully!' : 'Expense created successfully!')
    } catch (error) {
      console.error('Error saving expense:', error)
      alert('Error saving expense. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (expense) => {
    setFormData({
      expenseTitle: expense.expenseTitle,
      expenseCode: expense.expenseCode,
      description: expense.description,
      expenseType: expense.expenseType,
      amount: expense.amount.toString(),
      expenseDate: expense.expenseDate,
      vendor: expense.vendor,
      paymentMethod: expense.paymentMethod,
      isRecurring: expense.isRecurring,
      isApproved: expense.isApproved
    })
    setEditingId(expense.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(prev => prev.filter(expense => expense.id !== id))
      alert('Expense deleted successfully!')
    }
  }

  const handleCancel = () => {
    setFormData({
      expenseTitle: '',
      expenseCode: '',
      description: '',
      expenseType: 'Electricity Bill',
      amount: '',
      expenseDate: '',
      vendor: '',
      paymentMethod: 'Cash',
      isRecurring: false,
      isApproved: false
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredExpenses = expenses.filter(expense =>
    expense.expenseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.expenseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.expenseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Expenses Master</h1>
            <p className="text-red-100">Manage hotel expenses and expenditures</p>
          </div>
          <ReceiptPercentIcon className="h-12 w-12 text-red-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <ReceiptPercentIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {expenses.filter(expense => expense.isApproved).length}
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
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {expenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <CalendarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recurring</p>
              <p className="text-2xl font-bold text-gray-900">
                {expenses.filter(expense => expense.isRecurring).length}
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
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-rose-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Expense
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Expense' : 'Add New Expense'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expense Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.expenseTitle}
                  onChange={(e) => setFormData({...formData, expenseTitle: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    errors.expenseTitle ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter expense title"
                />
                {errors.expenseTitle && (
                  <p className="mt-1 text-sm text-red-600">{errors.expenseTitle}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expense Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.expenseCode}
                  onChange={(e) => setFormData({...formData, expenseCode: e.target.value.toUpperCase()})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    errors.expenseCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter expense code"
                />
                {errors.expenseCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.expenseCode}</p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expense Type
                </label>
                <select
                  value={formData.expenseType}
                  onChange={(e) => setFormData({...formData, expenseType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  {expenseTypeOptions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
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
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter amount"
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expense Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.expenseDate}
                  onChange={(e) => setFormData({...formData, expenseDate: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    errors.expenseDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.expenseDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.expenseDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vendor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    errors.vendor ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter vendor name"
                />
                {errors.vendor && (
                  <p className="mt-1 text-sm text-red-600">{errors.vendor}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isRecurring" className="ml-2 text-sm text-gray-700">
                    Recurring Expense
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isApproved"
                    checked={formData.isApproved}
                    onChange={(e) => setFormData({...formData, isApproved: e.target.checked})}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isApproved" className="ml-2 text-sm text-gray-700">
                    Approved
                  </label>
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
                className="px-8 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-rose-700 disabled:opacity-50 transition-all duration-200 flex items-center"
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

      {/* Expenses List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Expenses ({filteredExpenses.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expense Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount & Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
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
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{expense.expenseTitle}</div>
                      <div className="text-sm text-gray-500">{expense.expenseCode}</div>
                      <div className="text-sm text-gray-500">{expense.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-gray-900">{expense.expenseType}</div>
                      <div className="text-sm text-gray-500">{expense.vendor}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Rs {expense.amount.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{expense.expenseDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      expense.paymentMethod === 'Cash' ? 'bg-green-100 text-green-800' :
                      expense.paymentMethod === 'Bank Transfer' ? 'bg-blue-100 text-blue-800' :
                      expense.paymentMethod === 'Credit Card' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {expense.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        expense.isApproved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {expense.isApproved ? 'Approved' : 'Pending'}
                      </span>
                      {expense.isRecurring && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Recurring
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
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
          
          {filteredExpenses.length === 0 && (
            <div className="text-center py-12">
              <ReceiptPercentIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No expenses found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new expense.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExpensesMaster;
