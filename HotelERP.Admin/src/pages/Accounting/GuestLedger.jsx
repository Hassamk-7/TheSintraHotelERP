import { useState } from 'react'
import {
  UserIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  EyeIcon,
  PrinterIcon
} from '@heroicons/react/24/outline'

const GuestLedger = () => {
  const [selectedGuest, setSelectedGuest] = useState('')
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  })
  const [searchTerm, setSearchTerm] = useState('')

  // Mock guests data
  const [guests] = useState([
    { id: 1, name: 'Ahmed Ali', email: 'ahmed.ali@email.com', phone: '+92-300-1234567', roomNumber: '205' },
    { id: 2, name: 'Fatima Sheikh', email: 'fatima.sheikh@email.com', phone: '+92-321-9876543', roomNumber: '301' },
    { id: 3, name: 'Hassan Khan', email: 'hassan.khan@email.com', phone: '+92-333-5555555', roomNumber: '102' },
    { id: 4, name: 'Zara Ahmed', email: 'zara.ahmed@email.com', phone: '+92-345-7777777', roomNumber: '404' }
  ])

  // Mock ledger transactions
  const [ledgerData] = useState([
    {
      id: 1,
      guestId: 1,
      guestName: 'Ahmed Ali',
      date: '2024-01-10',
      description: 'Room Booking - Check In',
      reference: 'BOOK-001',
      debit: 25000,
      credit: 0,
      balance: 25000,
      type: 'Room Charges'
    },
    {
      id: 2,
      guestId: 1,
      guestName: 'Ahmed Ali',
      date: '2024-01-12',
      description: 'Restaurant Bill',
      reference: 'REST-001',
      debit: 8500,
      credit: 0,
      balance: 33500,
      type: 'Restaurant'
    },
    {
      id: 3,
      guestId: 1,
      guestName: 'Ahmed Ali',
      date: '2024-01-13',
      description: 'Laundry Services',
      reference: 'LAUN-001',
      debit: 1200,
      credit: 0,
      balance: 34700,
      type: 'Laundry'
    },
    {
      id: 4,
      guestId: 1,
      guestName: 'Ahmed Ali',
      date: '2024-01-15',
      description: 'Payment Received',
      reference: 'PAY-001',
      debit: 0,
      credit: 36520,
      balance: -1820,
      type: 'Payment'
    },
    {
      id: 5,
      guestId: 1,
      guestName: 'Ahmed Ali',
      date: '2024-01-15',
      description: 'Tax Applied',
      reference: 'TAX-001',
      debit: 1820,
      credit: 0,
      balance: 0,
      type: 'Tax'
    },
    {
      id: 6,
      guestId: 2,
      guestName: 'Fatima Sheikh',
      date: '2024-01-12',
      description: 'Room Booking - Check In',
      reference: 'BOOK-002',
      debit: 20000,
      credit: 0,
      balance: 20000,
      type: 'Room Charges'
    },
    {
      id: 7,
      guestId: 2,
      guestName: 'Fatima Sheikh',
      date: '2024-01-14',
      description: 'Restaurant Bill',
      reference: 'REST-002',
      debit: 4500,
      credit: 0,
      balance: 24500,
      type: 'Restaurant'
    },
    {
      id: 8,
      guestId: 2,
      guestName: 'Fatima Sheikh',
      date: '2024-01-16',
      description: 'Partial Payment',
      reference: 'PAY-002',
      debit: 0,
      credit: 15000,
      balance: 9500,
      type: 'Payment'
    }
  ])

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone.includes(searchTerm)
  )

  const getGuestTransactions = (guestId) => {
    return ledgerData.filter(transaction => 
      transaction.guestId === guestId &&
      transaction.date >= dateRange.startDate &&
      transaction.date <= dateRange.endDate
    ).sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const getGuestBalance = (guestId) => {
    const transactions = getGuestTransactions(guestId)
    return transactions.length > 0 ? transactions[transactions.length - 1].balance : 0
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Room Charges': return 'bg-blue-100 text-blue-800'
      case 'Restaurant': return 'bg-green-100 text-green-800'
      case 'Laundry': return 'bg-purple-100 text-purple-800'
      case 'Payment': return 'bg-emerald-100 text-emerald-800'
      case 'Tax': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => {
    return `Rs ${Math.abs(amount).toLocaleString()}`
  }

  const selectedGuestData = guests.find(g => g.id === parseInt(selectedGuest))
  const selectedGuestTransactions = selectedGuest ? getGuestTransactions(parseInt(selectedGuest)) : []
  const selectedGuestBalance = selectedGuest ? getGuestBalance(parseInt(selectedGuest)) : 0

  // Calculate totals for selected guest
  const totalDebits = selectedGuestTransactions.reduce((sum, t) => sum + t.debit, 0)
  const totalCredits = selectedGuestTransactions.reduce((sum, t) => sum + t.credit, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Guest Ledger</h1>
            <p className="text-cyan-100">Track individual guest account transactions and balances</p>
          </div>
          <UserIcon className="h-12 w-12 text-cyan-200" />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search guests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => window.print()}
              className="w-full flex items-center justify-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print Report
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guest List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Guests ({filteredGuests.length})</h2>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredGuests.map((guest) => {
              const balance = getGuestBalance(guest.id)
              const isSelected = selectedGuest === guest.id.toString()
              
              return (
                <div
                  key={guest.id}
                  onClick={() => setSelectedGuest(guest.id.toString())}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    isSelected ? 'bg-cyan-50 border-l-4 border-l-cyan-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">{guest.name}</div>
                      <div className="text-sm text-gray-500">{guest.email}</div>
                      <div className="text-sm text-gray-500">{guest.phone}</div>
                      {guest.roomNumber && (
                        <div className="text-sm text-blue-600">Room {guest.roomNumber}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        balance > 0 ? 'text-red-600' : balance < 0 ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {balance > 0 ? 'Owes: ' : balance < 0 ? 'Credit: ' : 'Settled: '}
                        {formatCurrency(balance)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Guest Details & Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {selectedGuestData ? (
            <>
              {/* Guest Summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Guest Account Summary</h2>
                  <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">{selectedGuestData.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600">Email:</span> {selectedGuestData.email}</div>
                      <div><span className="text-gray-600">Phone:</span> {selectedGuestData.phone}</div>
                      {selectedGuestData.roomNumber && (
                        <div><span className="text-gray-600">Room:</span> {selectedGuestData.roomNumber}</div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600">Total Charges</div>
                      <div className="text-lg font-bold text-red-600">{formatCurrency(totalDebits)}</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600">Total Payments</div>
                      <div className="text-lg font-bold text-green-600">{formatCurrency(totalCredits)}</div>
                    </div>
                    <div className={`rounded-lg p-4 col-span-2 ${
                      selectedGuestBalance > 0 ? 'bg-red-50' : selectedGuestBalance < 0 ? 'bg-green-50' : 'bg-gray-50'
                    }`}>
                      <div className="text-sm text-gray-600">Current Balance</div>
                      <div className={`text-xl font-bold ${
                        selectedGuestBalance > 0 ? 'text-red-600' : selectedGuestBalance < 0 ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {selectedGuestBalance > 0 ? 'Owes: ' : selectedGuestBalance < 0 ? 'Credit: ' : 'Settled: '}
                        {formatCurrency(selectedGuestBalance)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Transaction History ({selectedGuestTransactions.length})
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedGuestTransactions.map((transaction) => (
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
                            <div className="text-sm font-medium text-red-600">
                              {transaction.debit > 0 ? formatCurrency(transaction.debit) : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-medium text-green-600">
                              {transaction.credit > 0 ? formatCurrency(transaction.credit) : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className={`text-sm font-medium ${
                              transaction.balance > 0 ? 'text-red-600' : transaction.balance < 0 ? 'text-green-600' : 'text-gray-600'
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
              <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Select a Guest</h3>
              <p className="mt-2 text-gray-500">Choose a guest from the list to view their account ledger and transaction history.</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-cyan-100 rounded-lg p-3">
              <UserIcon className="h-6 w-6 text-cyan-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Guests</p>
              <p className="text-2xl font-bold text-gray-900">{guests.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Outstanding Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {guests.reduce((sum, guest) => {
                  const balance = getGuestBalance(guest.id)
                  return sum + (balance > 0 ? balance : 0)
                }, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <DocumentTextIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Credit Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {Math.abs(guests.reduce((sum, guest) => {
                  const balance = getGuestBalance(guest.id)
                  return sum + (balance < 0 ? balance : 0)
                }, 0)).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Accounts</p>
              <p className="text-2xl font-bold text-gray-900">
                {guests.filter(guest => getGuestBalance(guest.id) !== 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuestLedger;
