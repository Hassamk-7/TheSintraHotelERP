import { useState } from 'react'
import {
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  EyeIcon,
  PrinterIcon
} from '@heroicons/react/24/outline'

const SupplierLedger = () => {
  const [selectedSupplier, setSelectedSupplier] = useState('')
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  })
  const [searchTerm, setSearchTerm] = useState('')

  // Mock suppliers data
  const [suppliers] = useState([
    { id: 1, name: 'ABC Food Suppliers', email: 'contact@abcfood.com', phone: '+92-21-1234567', category: 'Food & Beverage' },
    { id: 2, name: 'CleanPro Services', email: 'info@cleanpro.com', phone: '+92-21-2345678', category: 'Housekeeping' },
    { id: 3, name: 'K-Electric', email: 'billing@ke.com.pk', phone: '+92-21-9999999', category: 'Utilities' },
    { id: 4, name: 'TechFix Solutions', email: 'support@techfix.com', phone: '+92-21-3456789', category: 'Maintenance' }
  ])

  // Mock supplier ledger transactions
  const [ledgerData] = useState([
    {
      id: 1,
      supplierId: 1,
      supplierName: 'ABC Food Suppliers',
      date: '2024-01-10',
      description: 'Monthly food supplies invoice',
      reference: 'INV-2024-001',
      debit: 0,
      credit: 85000,
      balance: 85000,
      type: 'Purchase'
    },
    {
      id: 2,
      supplierId: 1,
      supplierName: 'ABC Food Suppliers',
      date: '2024-01-15',
      description: 'Payment made via bank transfer',
      reference: 'PAY-001',
      debit: 85000,
      credit: 0,
      balance: 0,
      type: 'Payment'
    },
    {
      id: 3,
      supplierId: 1,
      supplierName: 'ABC Food Suppliers',
      date: '2024-01-20',
      description: 'Fresh produce delivery',
      reference: 'INV-2024-005',
      debit: 0,
      credit: 45000,
      balance: 45000,
      type: 'Purchase'
    },
    {
      id: 4,
      supplierId: 2,
      supplierName: 'CleanPro Services',
      date: '2024-01-12',
      description: 'Cleaning supplies and chemicals',
      reference: 'INV-2024-002',
      debit: 0,
      credit: 30000,
      balance: 30000,
      type: 'Purchase'
    },
    {
      id: 5,
      supplierId: 2,
      supplierName: 'CleanPro Services',
      date: '2024-01-18',
      description: 'Payment made via cash',
      reference: 'PAY-002',
      debit: 30000,
      credit: 0,
      balance: 0,
      type: 'Payment'
    },
    {
      id: 6,
      supplierId: 3,
      supplierName: 'K-Electric',
      date: '2024-01-05',
      description: 'Monthly electricity bill',
      reference: 'BILL-UTL-001',
      debit: 0,
      credit: 45000,
      balance: 45000,
      type: 'Utility Bill'
    },
    {
      id: 7,
      supplierId: 4,
      supplierName: 'TechFix Solutions',
      date: '2024-01-08',
      description: 'AC maintenance and repair',
      reference: 'INV-MNT-001',
      debit: 0,
      credit: 15000,
      balance: 15000,
      type: 'Service'
    },
    {
      id: 8,
      supplierId: 4,
      supplierName: 'TechFix Solutions',
      date: '2024-01-10',
      description: 'Payment made via cheque',
      reference: 'PAY-003',
      debit: 15000,
      credit: 0,
      balance: 0,
      type: 'Payment'
    }
  ])

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getSupplierTransactions = (supplierId) => {
    return ledgerData.filter(transaction => 
      transaction.supplierId === supplierId &&
      transaction.date >= dateRange.startDate &&
      transaction.date <= dateRange.endDate
    ).sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const getSupplierBalance = (supplierId) => {
    const transactions = getSupplierTransactions(supplierId)
    return transactions.length > 0 ? transactions[transactions.length - 1].balance : 0
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Purchase': return 'bg-blue-100 text-blue-800'
      case 'Payment': return 'bg-green-100 text-green-800'
      case 'Utility Bill': return 'bg-orange-100 text-orange-800'
      case 'Service': return 'bg-purple-100 text-purple-800'
      case 'Return': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Food & Beverage': return 'bg-green-100 text-green-800'
      case 'Housekeeping': return 'bg-blue-100 text-blue-800'
      case 'Utilities': return 'bg-orange-100 text-orange-800'
      case 'Maintenance': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => {
    return `Rs ${Math.abs(amount).toLocaleString()}`
  }

  const selectedSupplierData = suppliers.find(s => s.id === parseInt(selectedSupplier))
  const selectedSupplierTransactions = selectedSupplier ? getSupplierTransactions(parseInt(selectedSupplier)) : []
  const selectedSupplierBalance = selectedSupplier ? getSupplierBalance(parseInt(selectedSupplier)) : 0

  // Calculate totals for selected supplier
  const totalPurchases = selectedSupplierTransactions.reduce((sum, t) => sum + t.credit, 0)
  const totalPayments = selectedSupplierTransactions.reduce((sum, t) => sum + t.debit, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Supplier Ledger</h1>
            <p className="text-violet-100">Track supplier account transactions and outstanding balances</p>
          </div>
          <BuildingOfficeIcon className="h-12 w-12 text-violet-200" />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => window.print()}
              className="w-full flex items-center justify-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print Report
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Supplier List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Suppliers ({filteredSuppliers.length})</h2>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredSuppliers.map((supplier) => {
              const balance = getSupplierBalance(supplier.id)
              const isSelected = selectedSupplier === supplier.id.toString()
              
              return (
                <div
                  key={supplier.id}
                  onClick={() => setSelectedSupplier(supplier.id.toString())}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    isSelected ? 'bg-violet-50 border-l-4 border-l-violet-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">{supplier.name}</div>
                      <div className="text-sm text-gray-500">{supplier.email}</div>
                      <div className="text-sm text-gray-500">{supplier.phone}</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getCategoryColor(supplier.category)}`}>
                        {supplier.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        balance > 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {balance > 0 ? 'Owe: ' : 'Settled: '}
                        {formatCurrency(balance)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Supplier Details & Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {selectedSupplierData ? (
            <>
              {/* Supplier Summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Supplier Account Summary</h2>
                  <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-1 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">{selectedSupplierData.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600">Email:</span> {selectedSupplierData.email}</div>
                      <div><span className="text-gray-600">Phone:</span> {selectedSupplierData.phone}</div>
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${getCategoryColor(selectedSupplierData.category)}`}>
                          {selectedSupplierData.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600">Total Purchases</div>
                      <div className="text-lg font-bold text-blue-600">{formatCurrency(totalPurchases)}</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600">Total Payments</div>
                      <div className="text-lg font-bold text-green-600">{formatCurrency(totalPayments)}</div>
                    </div>
                    <div className={`rounded-lg p-4 col-span-2 ${
                      selectedSupplierBalance > 0 ? 'bg-red-50' : 'bg-gray-50'
                    }`}>
                      <div className="text-sm text-gray-600">Outstanding Balance</div>
                      <div className={`text-xl font-bold ${
                        selectedSupplierBalance > 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {selectedSupplierBalance > 0 ? 'Owe: ' : 'Settled: '}
                        {formatCurrency(selectedSupplierBalance)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Transaction History ({selectedSupplierTransactions.length})
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedSupplierTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{transaction.date}</div>
                            <div className="text-sm text-gray-500">{transaction.reference}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{transaction.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(transaction.type)}`}>
                              {transaction.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-medium text-blue-600">
                              {transaction.credit > 0 ? formatCurrency(transaction.credit) : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-medium text-green-600">
                              {transaction.debit > 0 ? formatCurrency(transaction.debit) : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className={`text-sm font-medium ${
                              transaction.balance > 0 ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {formatCurrency(transaction.balance)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Select a Supplier</h3>
              <p className="mt-2 text-gray-500">Choose a supplier from the list to view their account ledger and transaction history.</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-violet-100 rounded-lg p-3">
              <BuildingOfficeIcon className="h-6 w-6 text-violet-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {suppliers.reduce((sum, supplier) => {
                  const balance = getSupplierBalance(supplier.id)
                  return sum + (balance > 0 ? balance : 0)
                }, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Purchases</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {ledgerData.reduce((sum, t) => sum + t.credit, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CalendarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Accounts</p>
              <p className="text-2xl font-bold text-gray-900">
                {suppliers.filter(supplier => getSupplierBalance(supplier.id) > 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupplierLedger;
