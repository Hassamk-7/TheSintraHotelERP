import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  BookOpenIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'

const GeneralLedger = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  
  const [ledgerEntries, setLedgerEntries] = useState([
    {
      id: 1,
      date: '2024-01-15',
      accountName: 'Cash Account',
      accountCode: '1001',
      description: 'Room booking payment received',
      reference: 'RB-001',
      debitAmount: 15000,
      creditAmount: 0,
      balance: 15000,
      transactionType: 'Receipt'
    },
    {
      id: 2,
      date: '2024-01-15',
      accountName: 'Revenue - Room Booking',
      accountCode: '4001',
      description: 'Room booking payment received',
      reference: 'RB-001',
      debitAmount: 0,
      creditAmount: 15000,
      balance: -15000,
      transactionType: 'Revenue'
    },
    {
      id: 3,
      date: '2024-01-15',
      accountName: 'Cash Account',
      accountCode: '1001',
      description: 'Restaurant bill payment',
      reference: 'REST-002',
      debitAmount: 2500,
      creditAmount: 0,
      balance: 17500,
      transactionType: 'Receipt'
    },
    {
      id: 4,
      date: '2024-01-15',
      accountName: 'Revenue - Restaurant',
      accountCode: '4002',
      description: 'Restaurant bill payment',
      reference: 'REST-002',
      debitAmount: 0,
      creditAmount: 2500,
      balance: -2500,
      transactionType: 'Revenue'
    },
    {
      id: 5,
      date: '2024-01-14',
      accountName: 'Accounts Payable',
      accountCode: '2001',
      description: 'Supplier payment - Food supplies',
      reference: 'SUP-003',
      debitAmount: 8000,
      creditAmount: 0,
      balance: -8000,
      transactionType: 'Payment'
    },
    {
      id: 6,
      date: '2024-01-14',
      accountName: 'Cash Account',
      accountCode: '1001',
      description: 'Supplier payment - Food supplies',
      reference: 'SUP-003',
      debitAmount: 0,
      creditAmount: 8000,
      balance: 9500,
      transactionType: 'Payment'
    }
  ])
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'Cash Account', code: '1001', type: 'Asset' },
    { id: 2, name: 'Revenue - Room Booking', code: '4001', type: 'Revenue' },
    { id: 3, name: 'Revenue - Restaurant', code: '4002', type: 'Revenue' },
    { id: 4, name: 'Accounts Payable', code: '2001', type: 'Liability' },
    { id: 5, name: 'Accounts Receivable', code: '1002', type: 'Asset' },
    { id: 6, name: 'Inventory', code: '1003', type: 'Asset' },
    { id: 7, name: 'Equipment', code: '1004', type: 'Asset' },
    { id: 8, name: 'Salary Expense', code: '5001', type: 'Expense' }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    accountId: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    reference: '',
    debitAmount: '',
    creditAmount: ''
  })

  // Load data on component mount - DISABLED FOR DEMO
  useEffect(() => {
    // API calls disabled to show mock data
    console.log('General Ledger component loaded with mock data:', ledgerEntries.length, 'entries')
  }, [])

  // Fetch when filters change - DISABLED FOR DEMO
  useEffect(() => {
    // API calls disabled to show mock data
    console.log('Filter changed, keeping mock data')
  }, [selectedAccount, dateRange.startDate, dateRange.endDate])

  // Fetch accounts - PURE API CALL
  const fetchAccounts = async () => {
    try {
      const response = await axios.get('/api/Accounting/accounts')
      if (response.data && response.data.success) {
        setAccounts(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching accounts:', err)
    }
  }

  // Fetch ledger entries - PURE API CALL
  const fetchLedgerEntries = async () => {
    try {
      setLoading(true)
      setError('')
      const params = new URLSearchParams()
      if (selectedAccount) params.append('accountId', selectedAccount)
      if (dateRange.startDate) params.append('startDate', dateRange.startDate)
      if (dateRange.endDate) params.append('endDate', dateRange.endDate)
      
      const response = await axios.get(`/api/Accounting/general-ledger?${params}`)
      
      if (response.data && response.data.success) {
        setLedgerEntries(response.data.data)
      } else {
        setError('No ledger entries data received')
        setLedgerEntries([])
      }
    } catch (err) {
      console.error('Error fetching ledger entries:', err)
      setError(err.response?.data?.message || 'Failed to load ledger entries')
      setLedgerEntries([])
    } finally {
      setLoading(false)
    }
  }

  // Add new ledger entry - PURE API CALL
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      
      const entryData = {
        ...formData,
        debitAmount: parseFloat(formData.debitAmount) || 0,
        creditAmount: parseFloat(formData.creditAmount) || 0
      }

      let response
      if (editingId) {
        response = await axios.put(`/api/Accounting/general-ledger/${editingId}`, entryData)
      } else {
        response = await axios.post('/api/Accounting/general-ledger', entryData)
      }

      if (response.data && response.data.success) {
        setSuccess(editingId ? 'Ledger entry updated successfully' : 'Ledger entry added successfully')
        resetForm()
        fetchLedgerEntries()
      } else {
        setError('Failed to save ledger entry')
      }
    } catch (err) {
      console.error('Error saving ledger entry:', err)
      setError(err.response?.data?.message || 'Failed to save ledger entry')
    } finally {
      setLoading(false)
    }
  }

  // Delete ledger entry - PURE API CALL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ledger entry?')) return

    try {
      setLoading(true)
      const response = await axios.delete(`/api/Accounting/general-ledger/${id}`)
      
      if (response.data && response.data.success) {
        setSuccess('Ledger entry deleted successfully')
        fetchLedgerEntries()
      } else {
        setError('Failed to delete ledger entry')
      }
    } catch (err) {
      console.error('Error deleting ledger entry:', err)
      setError(err.response?.data?.message || 'Failed to delete ledger entry')
    } finally {
      setLoading(false)
    }
  }

  // Edit ledger entry
  const handleEdit = (entry) => {
    setFormData({
      accountId: entry.accountId,
      date: entry.date,
      description: entry.description,
      reference: entry.reference,
      debitAmount: entry.debitAmount || '',
      creditAmount: entry.creditAmount || ''
    })
    setEditingId(entry.id)
    setShowForm(true)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      accountId: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      reference: '',
      debitAmount: '',
      creditAmount: ''
    })
    setEditingId(null)
    setShowForm(false)
  }

  // Filter entries based on search
  const filteredEntries = ledgerEntries.filter(entry =>
    entry.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.accountName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate running balance
  let runningBalance = 0
  const entriesWithBalance = filteredEntries.map(entry => {
    runningBalance += (entry.debitAmount || 0) - (entry.creditAmount || 0)
    return { ...entry, runningBalance }
  })

  // Calculate totals
  const totalDebits = filteredEntries.reduce((sum, entry) => sum + (entry.debitAmount || 0), 0)
  const totalCredits = filteredEntries.reduce((sum, entry) => sum + (entry.creditAmount || 0), 0)

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">General Ledger</h1>
            <p className="text-indigo-100">Detailed account transactions and balances</p>
          </div>
          <div className="flex items-center space-x-4">
            <BookOpenIcon className="h-12 w-12 text-indigo-200" />
            <button
              onClick={() => setShowForm(true)}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 flex items-center space-x-2 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Entry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-green-700">{success}</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Accounts</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Search entries..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <ArrowDownIcon className="h-6 w-6 text-green-600 transform rotate-180" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Debits</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDebits)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <ArrowDownIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Credits</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCredits)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <BookOpenIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Balance</p>
              <p className={`text-2xl font-bold ${totalDebits - totalCredits >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(Math.abs(totalDebits - totalCredits))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Entries Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Ledger Entries ({filteredEntries.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading ledger entries...</p>
          </div>
        ) : entriesWithBalance.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <BookOpenIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No ledger entries found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entriesWithBalance.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{entry.accountName}</div>
                      <div className="text-sm text-gray-500">{entry.accountCode}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{entry.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                      {entry.debitAmount > 0 ? formatCurrency(entry.debitAmount) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-red-600">
                      {entry.creditAmount > 0 ? formatCurrency(entry.creditAmount) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                      {formatCurrency(entry.runningBalance)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-600 hover:text-red-900"
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
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingId ? 'Edit Ledger Entry' : 'Add New Ledger Entry'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account *</label>
                    <select
                      value={formData.accountId}
                      onChange={(e) => setFormData({...formData, accountId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Account</option>
                      {accounts.map(account => (
                        <option key={account.id} value={account.id}>
                          {account.name} ({account.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter description"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={(e) => setFormData({...formData, reference: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter reference number"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Debit Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.debitAmount}
                      onChange={(e) => setFormData({...formData, debitAmount: e.target.value, creditAmount: ''})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Credit Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.creditAmount}
                      onChange={(e) => setFormData({...formData, creditAmount: e.target.value, debitAmount: ''})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingId ? 'Update' : 'Add')} Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GeneralLedger;
