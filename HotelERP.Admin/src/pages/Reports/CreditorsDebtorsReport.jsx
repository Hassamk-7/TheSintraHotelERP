import { useState } from 'react'
import {
  ScaleIcon,
  FunnelIcon,
  DocumentTextIcon,
  PrinterIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const CreditorsDebtorsReport = () => {
  const [filters, setFilters] = useState({
    accountType: '',
    status: '',
    category: '',
    dateRange: { start: '', end: '' },
    amountRange: { min: '', max: '' }
  })

  const [accounts] = useState([
    {
      id: 1,
      accountId: 'ACC-CR-001',
      accountName: 'ABC Food Suppliers',
      accountType: 'Creditor',
      category: 'Supplier',
      contactPerson: 'Muhammad Ali',
      phone: '+92-300-1234567',
      email: 'ali@abcfood.com',
      address: '123 Market Street, Karachi',
      openingBalance: -50000,
      currentBalance: -75000,
      creditLimit: 100000,
      lastTransactionDate: '2024-01-20',
      lastTransactionAmount: 15000,
      totalTransactions: 25,
      overdueAmount: 25000,
      overdueTransactions: 3,
      paymentTerms: '30 Days',
      status: 'Active',
      riskLevel: 'Low',
      accountManagerId: 'EMP-001',
      accountManager: 'Ahmed Hassan'
    },
    {
      id: 2,
      accountId: 'ACC-DR-001',
      accountName: 'Sarah Johnson - Corporate',
      accountType: 'Debtor',
      category: 'Corporate Guest',
      contactPerson: 'Sarah Johnson',
      phone: '+1-555-123-4567',
      email: 'sarah@techsolutions.com',
      address: '456 Oak Avenue, New York',
      openingBalance: 25000,
      currentBalance: 45000,
      creditLimit: 75000,
      lastTransactionDate: '2024-01-18',
      lastTransactionAmount: 12000,
      totalTransactions: 18,
      overdueAmount: 0,
      overdueTransactions: 0,
      paymentTerms: '15 Days',
      status: 'Active',
      riskLevel: 'Low',
      accountManagerId: 'EMP-002',
      accountManager: 'Ali Khan'
    },
    {
      id: 3,
      accountId: 'ACC-CR-002',
      accountName: 'CleanPro Services',
      accountType: 'Creditor',
      category: 'Service Provider',
      contactPerson: 'Hassan Ahmed',
      phone: '+92-321-9876543',
      email: 'hassan@cleanpro.com',
      address: '789 Service Road, Lahore',
      openingBalance: -20000,
      currentBalance: -35000,
      creditLimit: 50000,
      lastTransactionDate: '2024-01-15',
      lastTransactionAmount: 8000,
      totalTransactions: 12,
      overdueAmount: 15000,
      overdueTransactions: 2,
      paymentTerms: '45 Days',
      status: 'Active',
      riskLevel: 'Medium',
      accountManagerId: 'EMP-003',
      accountManager: 'Fatima Sheikh'
    },
    {
      id: 4,
      accountId: 'ACC-DR-002',
      accountName: 'Wedding Planners Ltd',
      accountType: 'Debtor',
      category: 'Event Company',
      contactPerson: 'Emma Wilson',
      phone: '+44-20-1234-5678',
      email: 'emma@weddingplanners.co.uk',
      address: '321 London Street, London',
      openingBalance: 15000,
      currentBalance: 85000,
      creditLimit: 100000,
      lastTransactionDate: '2024-01-22',
      lastTransactionAmount: 35000,
      totalTransactions: 8,
      overdueAmount: 40000,
      overdueTransactions: 2,
      paymentTerms: '30 Days',
      status: 'Overdue',
      riskLevel: 'High',
      accountManagerId: 'EMP-004',
      accountManager: 'Omar Siddique'
    },
    {
      id: 5,
      accountId: 'ACC-CR-003',
      accountName: 'Utility Company',
      accountType: 'Creditor',
      category: 'Utilities',
      contactPerson: 'Customer Service',
      phone: '+92-111-222-333',
      email: 'billing@utility.com',
      address: 'Utility House, Main Boulevard',
      openingBalance: -5000,
      currentBalance: -12000,
      creditLimit: 25000,
      lastTransactionDate: '2024-01-19',
      lastTransactionAmount: 4500,
      totalTransactions: 36,
      overdueAmount: 0,
      overdueTransactions: 0,
      paymentTerms: '15 Days',
      status: 'Active',
      riskLevel: 'Low',
      accountManagerId: 'EMP-005',
      accountManager: 'Ayesha Khan'
    }
  ])

  const accountTypes = ['All Types', 'Creditor', 'Debtor']
  const statuses = ['All Status', 'Active', 'Overdue', 'Suspended', 'Closed']
  const categories = ['All Categories', 'Supplier', 'Corporate Guest', 'Service Provider', 'Event Company', 'Utilities', 'Individual Guest']

  const filteredAccounts = accounts.filter(account => {
    const matchesType = filters.accountType === '' || filters.accountType === 'All Types' || account.accountType === filters.accountType
    const matchesStatus = filters.status === '' || filters.status === 'All Status' || account.status === filters.status
    const matchesCategory = filters.category === '' || filters.category === 'All Categories' || account.category === filters.category
    
    let matchesAmountRange = true
    if (filters.amountRange.min || filters.amountRange.max) {
      const min = parseFloat(filters.amountRange.min) || -Infinity
      const max = parseFloat(filters.amountRange.max) || Infinity
      const absBalance = Math.abs(account.currentBalance)
      matchesAmountRange = absBalance >= Math.abs(min) && absBalance <= Math.abs(max)
    }

    return matchesType && matchesStatus && matchesCategory && matchesAmountRange
  })

  const getAccountTypeColor = (accountType) => {
    switch (accountType) {
      case 'Creditor': return 'bg-red-100 text-red-800'
      case 'Debtor': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Overdue': return 'bg-red-100 text-red-800'
      case 'Suspended': return 'bg-yellow-100 text-yellow-800'
      case 'Closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Low': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'High': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Supplier': return 'bg-blue-100 text-blue-800'
      case 'Corporate Guest': return 'bg-purple-100 text-purple-800'
      case 'Service Provider': return 'bg-orange-100 text-orange-800'
      case 'Event Company': return 'bg-pink-100 text-pink-800'
      case 'Utilities': return 'bg-cyan-100 text-cyan-800'
      case 'Individual Guest': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => {
    const absAmount = Math.abs(amount)
    const sign = amount < 0 ? '-' : amount > 0 ? '+' : ''
    return `${sign}Rs ${absAmount.toLocaleString()}`
  }

  const exportReport = () => {
    alert(`Exporting creditors/debtors report with ${filteredAccounts.length} accounts...`)
  }

  const printReport = () => {
    window.print()
  }

  // Calculate statistics
  const totalAccounts = filteredAccounts.length
  const creditors = filteredAccounts.filter(acc => acc.accountType === 'Creditor')
  const debtors = filteredAccounts.filter(acc => acc.accountType === 'Debtor')
  const totalCreditorBalance = creditors.reduce((sum, acc) => sum + Math.abs(acc.currentBalance), 0)
  const totalDebtorBalance = debtors.reduce((sum, acc) => sum + acc.currentBalance, 0)
  const overdueAccounts = filteredAccounts.filter(acc => acc.overdueAmount > 0).length
  const totalOverdueAmount = filteredAccounts.reduce((sum, acc) => sum + acc.overdueAmount, 0)
  const highRiskAccounts = filteredAccounts.filter(acc => acc.riskLevel === 'High').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Creditors/Debtors List Report</h1>
            <p className="text-indigo-100">Monitor outstanding balances and account relationships</p>
          </div>
          <ScaleIcon className="h-12 w-12 text-indigo-200" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Report Filters
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={printReport}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </button>
            <button
              onClick={exportReport}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
            <select
              value={filters.accountType}
              onChange={(e) => setFilters({...filters, accountType: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {accountTypes.map(type => (
                <option key={type} value={type === 'All Types' ? '' : type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {statuses.map(status => (
                <option key={status} value={status === 'All Status' ? '' : status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map(category => (
                <option key={category} value={category === 'All Categories' ? '' : category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Balance</label>
            <input
              type="number"
              value={filters.amountRange.min}
              onChange={(e) => setFilters({...filters, amountRange: {...filters.amountRange, min: e.target.value}})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Creditors</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCreditorBalance)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Debtors</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDebtorBalance)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-lg p-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOverdueAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-gray-900">{highRiskAccounts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Account Balances ({filteredAccounts.length} accounts)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Information</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance Information</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction History</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit & Risk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Management</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-indigo-100 rounded-full p-2 mr-3">
                        <UserGroupIcon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{account.accountName}</div>
                        <div className="text-sm text-gray-500">{account.accountId}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAccountTypeColor(account.accountType)}`}>
                          {account.accountType}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-1 ${getCategoryColor(account.category)}`}>
                          {account.category}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">{account.contactPerson}</div>
                      <div className="text-sm text-gray-500">{account.phone}</div>
                      <div className="text-sm text-gray-500">{account.email}</div>
                      <div className="text-sm text-gray-500">{account.address}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">
                        Opening: {formatCurrency(account.openingBalance)}
                      </div>
                      <div className={`text-sm font-medium ${account.currentBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        Current: {formatCurrency(account.currentBalance)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Credit Limit: {formatCurrency(account.creditLimit)}
                      </div>
                      {account.overdueAmount > 0 && (
                        <div className="text-sm font-medium text-red-600">
                          Overdue: {formatCurrency(account.overdueAmount)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        Total Transactions: {account.totalTransactions}
                      </div>
                      <div className="text-sm text-gray-500">
                        Last: {formatCurrency(account.lastTransactionAmount)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                        {account.lastTransactionDate}
                      </div>
                      {account.overdueTransactions > 0 && (
                        <div className="text-sm text-red-600">
                          Overdue Transactions: {account.overdueTransactions}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        Terms: {account.paymentTerms}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(account.riskLevel)}`}>
                        {account.riskLevel} Risk
                      </span>
                      <div className="text-sm text-gray-500">
                        Utilization: {((Math.abs(account.currentBalance) / account.creditLimit) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(account.status)}`}>
                        {account.status}
                      </span>
                      <div className="text-sm text-gray-900">
                        Manager: {account.accountManager}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {account.accountManagerId}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAccounts.length === 0 && (
          <div className="text-center py-12">
            <ScaleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No accounts found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>

      {/* Summary Analytics */}
      {filteredAccounts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Balance Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Creditor Accounts:</span>
                <span className="font-medium">{creditors.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Debtor Accounts:</span>
                <span className="font-medium">{debtors.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Net Position:</span>
                <span className={`font-medium ${(totalDebtorBalance - totalCreditorBalance) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totalDebtorBalance - totalCreditorBalance)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Overdue Accounts:</span>
                <span className="font-medium text-red-600">{overdueAccounts}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Analysis</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">High Risk Accounts:</span>
                <span className="font-medium text-red-600">{highRiskAccounts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Credit Utilization:</span>
                <span className="font-medium">
                  {(filteredAccounts.reduce((sum, acc) => sum + ((Math.abs(acc.currentBalance) / acc.creditLimit) * 100), 0) / totalAccounts).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Collection Efficiency:</span>
                <span className="font-medium">
                  {totalOverdueAmount > 0 ? (((totalDebtorBalance - totalOverdueAmount) / totalDebtorBalance) * 100).toFixed(1) : 100}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Transaction Value:</span>
                <span className="font-medium">
                  {formatCurrency(filteredAccounts.reduce((sum, acc) => sum + Math.abs(acc.currentBalance), 0) / totalAccounts)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreditorsDebtorsReport;
