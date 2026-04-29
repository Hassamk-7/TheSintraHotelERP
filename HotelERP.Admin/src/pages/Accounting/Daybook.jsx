import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  BookOpenIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  CurrencyDollarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

const Daybook = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')

  // Mock daybook transactions
  const [transactions] = useState([
    {
      id: 1,
      date: '2024-01-15',
      time: '09:30',
      voucherType: 'Receipt',
      voucherNumber: 'RV-001',
      accountName: 'Cash in Hand',
      description: 'Guest payment received - Ahmed Ali',
      reference: 'BILL-001',
      debit: 36520,
      credit: 0,
      runningBalance: 36520
    },
    {
      id: 2,
      date: '2024-01-15',
      time: '10:15',
      voucherType: 'Journal',
      voucherNumber: 'JV-001',
      accountName: 'Room Revenue',
      description: 'Room charges booking',
      reference: 'BOOK-001',
      debit: 0,
      credit: 25000,
      runningBalance: 11520
    },
    {
      id: 3,
      date: '2024-01-15',
      time: '11:45',
      voucherType: 'Journal',
      voucherNumber: 'JV-002',
      accountName: 'Restaurant Revenue',
      description: 'Restaurant bill charges',
      reference: 'REST-001',
      debit: 0,
      credit: 8500,
      runningBalance: 3020
    },
    {
      id: 4,
      date: '2024-01-15',
      time: '14:20',
      voucherType: 'Payment',
      voucherNumber: 'PV-001',
      accountName: 'Utilities Expense',
      description: 'Electricity bill payment',
      reference: 'BILL-UTL-001',
      debit: 45000,
      credit: 0,
      runningBalance: 48020
    },
    {
      id: 5,
      date: '2024-01-15',
      time: '15:30',
      voucherType: 'Payment',
      voucherNumber: 'PV-002',
      accountName: 'Accounts Payable',
      description: 'Supplier payment - ABC Food Suppliers',
      reference: 'PAY-SUP-001',
      debit: 0,
      credit: 85000,
      runningBalance: -36980
    },
    {
      id: 6,
      date: '2024-01-15',
      time: '16:45',
      voucherType: 'Receipt',
      voucherNumber: 'RV-002',
      accountName: 'Bank Account',
      description: 'Cash deposit to bank',
      reference: 'DEP-001',
      debit: 50000,
      credit: 0,
      runningBalance: 13020
    },
    {
      id: 7,
      date: '2024-01-15',
      time: '17:15',
      voucherType: 'Journal',
      voucherNumber: 'JV-003',
      accountName: 'Staff Salaries',
      description: 'Monthly salary accrual',
      reference: 'SAL-JAN-2024',
      debit: 320000,
      credit: 0,
      runningBalance: 333020
    },
    {
      id: 8,
      date: '2024-01-15',
      time: '18:00',
      voucherType: 'Journal',
      voucherNumber: 'JV-004',
      accountName: 'Depreciation Expense',
      description: 'Monthly depreciation entry',
      reference: 'DEP-JAN-2024',
      debit: 35000,
      credit: 0,
      runningBalance: 368020
    }
  ])

  const voucherTypes = ['Receipt', 'Payment', 'Journal', 'Contra']

  const filteredTransactions = transactions.filter(transaction => {
    const matchesDate = transaction.date === selectedDate
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === '' || transaction.voucherType === selectedType
    return matchesDate && matchesSearch && matchesType
  })

  const getVoucherTypeColor = (type) => {
    switch (type) {
      case 'Receipt': return 'bg-green-100 text-green-800'
      case 'Payment': return 'bg-red-100 text-red-800'
      case 'Journal': return 'bg-blue-100 text-blue-800'
      case 'Contra': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => {
    return `Rs ${Math.abs(amount).toLocaleString()}`
  }

  const formatTime = (time) => {
    return new Date(`2024-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  // Calculate daily totals
  const dailyTotals = filteredTransactions.reduce((totals, transaction) => {
    totals.totalDebits += transaction.debit
    totals.totalCredits += transaction.credit
    return totals
  }, { totalDebits: 0, totalCredits: 0 })

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    alert('Daybook exported successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Daybook</h1>
            <p className="text-emerald-100">Daily chronological record of all financial transactions</p>
          </div>
          <BookOpenIcon className="h-12 w-12 text-emerald-200" />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-9 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Voucher Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Types</option>
              {voucherTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </button>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Daily Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-emerald-100 rounded-lg p-3">
              <DocumentTextIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Debits</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(dailyTotals.totalDebits)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Credits</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(dailyTotals.totalCredits)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Movement</p>
              <p className={`text-2xl font-bold ${
                dailyTotals.totalDebits - dailyTotals.totalCredits > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(dailyTotals.totalDebits - dailyTotals.totalCredits)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Daybook Report */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Grand Palace Hotel</h2>
            <h3 className="text-lg font-semibold text-gray-700">Daily Cash Book</h3>
            <p className="text-gray-600">For {new Date(selectedDate).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                <>
                  {filteredTransactions.map((transaction, index) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatTime(transaction.time)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{transaction.voucherNumber}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVoucherTypeColor(transaction.voucherType)}`}>
                          {transaction.voucherType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{transaction.accountName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{transaction.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{transaction.reference}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-green-600">
                          {transaction.debit > 0 ? formatCurrency(transaction.debit) : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-red-600">
                          {transaction.credit > 0 ? formatCurrency(transaction.credit) : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className={`text-sm font-medium ${
                          transaction.runningBalance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(transaction.runningBalance)}
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {/* Daily Totals Row */}
                  <tr className="bg-gray-100 font-bold">
                    <td className="px-6 py-4 whitespace-nowrap" colSpan="5">
                      <div className="text-sm font-bold text-gray-900">DAILY TOTALS</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-bold text-green-600">{formatCurrency(dailyTotals.totalDebits)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-bold text-red-600">{formatCurrency(dailyTotals.totalCredits)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={`text-sm font-bold ${
                        dailyTotals.totalDebits - dailyTotals.totalCredits >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(dailyTotals.totalDebits - dailyTotals.totalCredits)}
                      </div>
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No Transactions Found</h3>
                    <p className="mt-2 text-gray-500">
                      No transactions found for {new Date(selectedDate).toLocaleDateString()}. 
                      Try selecting a different date or adjusting your filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Summary by Type */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Summary by Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {voucherTypes.map(type => {
            const typeTransactions = filteredTransactions.filter(t => t.voucherType === type)
            const typeTotal = typeTransactions.reduce((sum, t) => sum + t.debit + t.credit, 0)
            
            return (
              <div key={type} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getVoucherTypeColor(type)}`}>
                    {type}
                  </span>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Count: {typeTransactions.length}</div>
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(typeTotal)}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Daybook;
