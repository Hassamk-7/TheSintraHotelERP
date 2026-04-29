import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  ScaleIcon,
  FunnelIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  UserIcon,
  CreditCardIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const CurrentBalanceSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [balanceTypeFilter, setBalanceTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [accountTypeFilter, setAccountTypeFilter] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [amountRange, setAmountRange] = useState({ min: '', max: '' })

  const [balanceRecords] = useState([
    {
      id: 1,
      accountId: 'ACC-001',
      accountName: 'Ahmed Hassan - Guest Account',
      accountType: 'Guest',
      balanceType: 'Credit',
      currentBalance: 15000,
      lastTransactionDate: '2024-01-15',
      lastTransactionAmount: 5000,
      lastTransactionType: 'Room Service Payment',
      openingBalance: 0,
      totalDebits: 45000,
      totalCredits: 60000,
      transactionCount: 12,
      status: 'Active',
      daysLastActivity: 2,
      accountHolder: 'Ahmed Hassan',
      contactInfo: '+92-300-1234567',
      roomNumber: '101',
      checkInDate: '2024-01-10'
    },
    {
      id: 2,
      accountId: 'ACC-002',
      accountName: 'ABC Food Suppliers - Vendor Account',
      accountType: 'Supplier',
      balanceType: 'Debit',
      currentBalance: -25000,
      lastTransactionDate: '2024-01-14',
      lastTransactionAmount: 15000,
      lastTransactionType: 'Purchase Payment',
      openingBalance: -10000,
      totalDebits: 125000,
      totalCredits: 100000,
      transactionCount: 8,
      status: 'Active',
      daysLastActivity: 3,
      accountHolder: 'ABC Food Suppliers',
      contactInfo: '+92-321-9876543',
      roomNumber: null,
      checkInDate: null
    },
    {
      id: 3,
      accountId: 'ACC-003',
      accountName: 'Sarah Johnson - Guest Account',
      accountType: 'Guest',
      balanceType: 'Debit',
      currentBalance: -8500,
      lastTransactionDate: '2024-01-16',
      lastTransactionAmount: 3500,
      lastTransactionType: 'Restaurant Bill',
      openingBalance: 0,
      totalDebits: 28500,
      totalCredits: 20000,
      transactionCount: 15,
      status: 'Active',
      daysLastActivity: 1,
      accountHolder: 'Sarah Johnson',
      contactInfo: '+1-555-123-4567',
      roomNumber: '205',
      checkInDate: '2024-01-12'
    },
    {
      id: 4,
      accountId: 'ACC-004',
      accountName: 'Employee Advance - Ali Khan',
      accountType: 'Employee',
      balanceType: 'Debit',
      currentBalance: -16000,
      lastTransactionDate: '2024-01-01',
      lastTransactionAmount: 4000,
      lastTransactionType: 'Salary Deduction',
      openingBalance: -20000,
      totalDebits: 20000,
      totalCredits: 4000,
      transactionCount: 1,
      status: 'Active',
      daysLastActivity: 16,
      accountHolder: 'Ali Khan',
      contactInfo: '+92-321-9876543',
      roomNumber: null,
      checkInDate: null
    },
    {
      id: 5,
      accountId: 'ACC-005',
      accountName: 'CleanPro Services - Vendor Account',
      accountType: 'Supplier',
      balanceType: 'Credit',
      currentBalance: 5000,
      lastTransactionDate: '2024-01-10',
      lastTransactionAmount: 5000,
      lastTransactionType: 'Advance Payment',
      openingBalance: 0,
      totalDebits: 15000,
      totalCredits: 20000,
      transactionCount: 6,
      status: 'Active',
      daysLastActivity: 7,
      accountHolder: 'CleanPro Services',
      contactInfo: '+92-333-5555555',
      roomNumber: null,
      checkInDate: null
    },
    {
      id: 6,
      accountId: 'ACC-006',
      accountName: 'Emma Wilson - Guest Account',
      accountType: 'Guest',
      balanceType: 'Zero',
      currentBalance: 0,
      lastTransactionDate: '2024-01-19',
      lastTransactionAmount: 2599,
      lastTransactionType: 'Final Settlement',
      openingBalance: 0,
      totalDebits: 12599,
      totalCredits: 12599,
      transactionCount: 8,
      status: 'Closed',
      daysLastActivity: 0,
      accountHolder: 'Emma Wilson',
      contactInfo: '+44-20-1234-5678',
      roomNumber: null,
      checkInDate: null
    }
  ])

  const balanceTypes = ['Credit', 'Debit', 'Zero']
  const statuses = ['Active', 'Closed', 'Suspended', 'Under Review']
  const accountTypes = ['Guest', 'Supplier', 'Employee', 'Corporate', 'Miscellaneous']

  const filteredRecords = balanceRecords.filter(record => {
    const matchesSearch = record.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.accountId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.accountHolder.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.contactInfo.includes(searchTerm)
    
    const matchesBalanceType = balanceTypeFilter === '' || record.balanceType === balanceTypeFilter
    const matchesStatus = statusFilter === '' || record.status === statusFilter
    const matchesAccountType = accountTypeFilter === '' || record.accountType === accountTypeFilter
    
    let matchesDateRange = true
    if (dateRange.start && dateRange.end) {
      const lastTransactionDate = new Date(record.lastTransactionDate)
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      matchesDateRange = lastTransactionDate >= startDate && lastTransactionDate <= endDate
    }
    
    let matchesAmountRange = true
    if (amountRange.min || amountRange.max) {
      const min = parseFloat(amountRange.min) || -Infinity
      const max = parseFloat(amountRange.max) || Infinity
      matchesAmountRange = record.currentBalance >= min && record.currentBalance <= max
    }
    
    return matchesSearch && matchesBalanceType && matchesStatus && matchesAccountType && matchesDateRange && matchesAmountRange
  })

  const getBalanceTypeColor = (balanceType) => {
    switch (balanceType) {
      case 'Credit': return 'bg-green-100 text-green-800'
      case 'Debit': return 'bg-red-100 text-red-800'
      case 'Zero': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Closed': return 'bg-gray-100 text-gray-800'
      case 'Suspended': return 'bg-yellow-100 text-yellow-800'
      case 'Under Review': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAccountTypeColor = (accountType) => {
    switch (accountType) {
      case 'Guest': return 'bg-blue-100 text-blue-800'
      case 'Supplier': return 'bg-purple-100 text-purple-800'
      case 'Employee': return 'bg-indigo-100 text-indigo-800'
      case 'Corporate': return 'bg-orange-100 text-orange-800'
      case 'Miscellaneous': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => {
    const absAmount = Math.abs(amount)
    const sign = amount < 0 ? '-' : amount > 0 ? '+' : ''
    return `${sign}Rs ${absAmount.toLocaleString()}`
  }

  const exportResults = () => {
    alert(`Exporting ${filteredRecords.length} current balance records...`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setBalanceTypeFilter('')
    setStatusFilter('')
    setAccountTypeFilter('')
    setDateRange({ start: '', end: '' })
    setAmountRange({ min: '', max: '' })
  }

  // Calculate statistics
  const totalRecords = filteredRecords.length
  const creditBalances = filteredRecords.filter(r => r.currentBalance > 0).length
  const debitBalances = filteredRecords.filter(r => r.currentBalance < 0).length
  const totalCredits = filteredRecords.reduce((sum, r) => sum + (r.currentBalance > 0 ? r.currentBalance : 0), 0)
  const totalDebits = filteredRecords.reduce((sum, r) => sum + (r.currentBalance < 0 ? Math.abs(r.currentBalance) : 0), 0)
  const netBalance = totalCredits - totalDebits

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-green-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Current Balance Search</h1>
            <p className="text-teal-100">Track account balances and financial positions</p>
          </div>
          <ScaleIcon className="h-12 w-12 text-teal-200" />
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Search Filters
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={exportResults}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Export Results
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <select
            value={balanceTypeFilter}
            onChange={(e) => setBalanceTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Balance Types</option>
            {balanceTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={accountTypeFilter}
            onChange={(e) => setAccountTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Account Types</option>
            {accountTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex space-x-2">
            <input
              type="date"
              placeholder="From Date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="date"
              placeholder="To Date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Balance"
              value={amountRange.min}
              onChange={(e) => setAmountRange({...amountRange, min: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="number"
              placeholder="Max Balance"
              value={amountRange.max}
              onChange={(e) => setAmountRange({...amountRange, max: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-teal-100 rounded-lg p-3">
              <ScaleIcon className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Balance</p>
              <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netBalance)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CreditCardIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Credits</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCredits)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Debits</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDebits)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Accounts</p>
              <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Current Balance Records</h3>
            <p className="text-gray-600">Found {filteredRecords.length} account balances</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <ScaleIcon className="h-4 w-4 mr-1" />
              Total: {balanceRecords.length}
            </div>
            <div className="flex items-center">
              <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
              Filtered: {filteredRecords.length}
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Summary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-teal-100 rounded-full p-2 mr-3">
                        <UserIcon className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.accountName}</div>
                        <div className="text-sm text-gray-500">{record.accountId}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAccountTypeColor(record.accountType)}`}>
                          {record.accountType}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className={`text-lg font-bold ${record.currentBalance > 0 ? 'text-green-600' : record.currentBalance < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {formatCurrency(record.currentBalance)}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBalanceTypeColor(record.balanceType)}`}>
                        {record.balanceType} Balance
                      </span>
                      <div className="text-sm text-gray-500">
                        Opening: {formatCurrency(record.openingBalance)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-green-600">
                        Credits: {formatCurrency(record.totalCredits)}
                      </div>
                      <div className="text-sm text-red-600">
                        Debits: {formatCurrency(record.totalDebits)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Transactions: {record.transactionCount}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {record.lastTransactionDate}
                      </div>
                      <div className="text-sm text-gray-500">
                        {record.lastTransactionType}
                      </div>
                      <div className="text-sm text-gray-500">
                        Amount: {formatCurrency(record.lastTransactionAmount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {record.daysLastActivity} days ago
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">{record.accountHolder}</div>
                      <div className="text-sm text-gray-500">{record.contactInfo}</div>
                      {record.roomNumber && (
                        <div className="text-sm text-blue-600">
                          Room: {record.roomNumber}
                        </div>
                      )}
                      {record.checkInDate && (
                        <div className="text-sm text-gray-500">
                          Check-in: {record.checkInDate}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <ScaleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No balance records found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>

      {/* Balance Summary */}
      {filteredRecords.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{creditBalances}</div>
              <div className="text-sm text-gray-600">Credit Balances</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{debitBalances}</div>
              <div className="text-sm text-gray-600">Debit Balances</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalRecords > 0 ? (filteredRecords.reduce((sum, r) => sum + r.transactionCount, 0) / totalRecords).toFixed(1) : 0}
              </div>
              <div className="text-sm text-gray-600">Avg Transactions per Account</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CurrentBalanceSearch;
