import { useState } from 'react'
import {
  UserCircleIcon,
  PlusIcon,
  MinusIcon,
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

const GuestAccount = () => {
  const [selectedGuest, setSelectedGuest] = useState('')
  const [transactionType, setTransactionType] = useState('Add')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock guests with account balances
  const [guests, setGuests] = useState([
    {
      id: 1,
      name: 'Ahmed Ali',
      email: 'ahmed.ali@email.com',
      phone: '+92-300-1234567',
      roomNumber: '205',
      accountBalance: 15000,
      creditLimit: 50000,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Fatima Sheikh',
      email: 'fatima.sheikh@email.com',
      phone: '+92-321-9876543',
      roomNumber: '301',
      accountBalance: -5000,
      creditLimit: 30000,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Hassan Khan',
      email: 'hassan.khan@email.com',
      phone: '+92-333-5555555',
      roomNumber: '102',
      accountBalance: 25000,
      creditLimit: 75000,
      status: 'Active'
    },
    {
      id: 4,
      name: 'Zara Ahmed',
      email: 'zara.ahmed@email.com',
      phone: '+92-345-7777777',
      roomNumber: '404',
      accountBalance: 0,
      creditLimit: 40000,
      status: 'Inactive'
    }
  ])

  // Mock transaction history
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      guestId: 1,
      guestName: 'Ahmed Ali',
      type: 'Add',
      amount: 20000,
      description: 'Advance payment for extended stay',
      date: '2024-01-10',
      time: '14:30',
      processedBy: 'Front Desk',
      reference: 'ADV-001'
    },
    {
      id: 2,
      guestId: 1,
      guestName: 'Ahmed Ali',
      type: 'Refund',
      amount: 5000,
      description: 'Refund for cancelled spa service',
      date: '2024-01-12',
      time: '16:45',
      processedBy: 'Manager',
      reference: 'REF-001'
    },
    {
      id: 3,
      guestId: 2,
      guestName: 'Fatima Sheikh',
      type: 'Add',
      amount: 15000,
      description: 'Credit added for corporate account',
      date: '2024-01-11',
      time: '10:15',
      processedBy: 'Accountant',
      reference: 'CRP-001'
    },
    {
      id: 4,
      guestId: 2,
      guestName: 'Fatima Sheikh',
      type: 'Refund',
      amount: 20000,
      description: 'Excess payment refund',
      date: '2024-01-14',
      time: '11:30',
      processedBy: 'Front Desk',
      reference: 'REF-002'
    }
  ])

  const [loading, setLoading] = useState(false)

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.roomNumber.includes(searchTerm)
  )

  const selectedGuestData = guests.find(g => g.id === parseInt(selectedGuest))
  const guestTransactions = transactions.filter(t => t.guestId === parseInt(selectedGuest))

  const handleTransaction = async () => {
    if (!selectedGuest || !amount || parseFloat(amount) <= 0) {
      alert('Please select a guest and enter a valid amount')
      return
    }

    setLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const transactionAmount = parseFloat(amount)
      const newTransaction = {
        id: Date.now(),
        guestId: parseInt(selectedGuest),
        guestName: selectedGuestData.name,
        type: transactionType,
        amount: transactionAmount,
        description: description || `${transactionType} money to guest account`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        processedBy: 'Current User',
        reference: `${transactionType.substring(0, 3).toUpperCase()}-${String(Date.now()).slice(-3)}`
      }

      // Update guest balance
      setGuests(prev => prev.map(guest => 
        guest.id === parseInt(selectedGuest)
          ? {
              ...guest,
              accountBalance: transactionType === 'Add' 
                ? guest.accountBalance + transactionAmount
                : guest.accountBalance - transactionAmount
            }
          : guest
      ))

      // Add transaction to history
      setTransactions(prev => [newTransaction, ...prev])

      // Reset form
      setAmount('')
      setDescription('')
      
      alert(`${transactionType} transaction completed successfully!`)
    } catch (error) {
      alert('Error processing transaction')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return `Rs ${Math.abs(amount).toLocaleString()}`
  }

  const getBalanceColor = (balance) => {
    if (balance > 0) return 'text-green-600'
    if (balance < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'Add': return 'bg-green-100 text-green-800'
      case 'Refund': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Guest Account Management</h1>
            <p className="text-indigo-100">Add money or process refunds for guest accounts</p>
          </div>
          <UserCircleIcon className="h-12 w-12 text-indigo-200" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guest Selection & Transaction Form */}
        <div className="lg:col-span-1 space-y-6">
          {/* Guest Search */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Guest</h2>
            
            <div className="relative mb-4">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search guests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredGuests.map(guest => (
                <div
                  key={guest.id}
                  onClick={() => setSelectedGuest(guest.id.toString())}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedGuest === guest.id.toString()
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">{guest.name}</div>
                      <div className="text-sm text-gray-500">Room {guest.roomNumber}</div>
                      <div className="text-sm text-gray-500">{guest.phone}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getBalanceColor(guest.accountBalance)}`}>
                        {guest.accountBalance >= 0 ? 'Credit: ' : 'Owes: '}
                        {formatCurrency(guest.accountBalance)}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(guest.status)}`}>
                        {guest.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Form */}
          {selectedGuestData && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Process Transaction</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setTransactionType('Add')}
                      className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
                        transactionType === 'Add'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Money
                    </button>
                    <button
                      onClick={() => setTransactionType('Refund')}
                      className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
                        transactionType === 'Refund'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <MinusIcon className="h-4 w-4 mr-2" />
                      Refund
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (Rs)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    step="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Transaction description (optional)"
                  />
                </div>

                <button
                  onClick={handleTransaction}
                  disabled={loading || !amount}
                  className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Process {transactionType}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Guest Details & Transaction History */}
        <div className="lg:col-span-2 space-y-6">
          {selectedGuestData ? (
            <>
              {/* Guest Account Summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Summary</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">{selectedGuestData.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600">Email:</span> {selectedGuestData.email}</div>
                      <div><span className="text-gray-600">Phone:</span> {selectedGuestData.phone}</div>
                      <div><span className="text-gray-600">Room:</span> {selectedGuestData.roomNumber}</div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${getStatusColor(selectedGuestData.status)}`}>
                          {selectedGuestData.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className={`rounded-lg p-4 ${
                      selectedGuestData.accountBalance >= 0 ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      <div className="text-sm text-gray-600">Current Balance</div>
                      <div className={`text-2xl font-bold ${getBalanceColor(selectedGuestData.accountBalance)}`}>
                        {selectedGuestData.accountBalance >= 0 ? 'Credit: ' : 'Owes: '}
                        {formatCurrency(selectedGuestData.accountBalance)}
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600">Credit Limit</div>
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(selectedGuestData.creditLimit)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Transaction History ({guestTransactions.length})
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processed By</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {guestTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{transaction.date}</div>
                            <div className="text-sm text-gray-500">{transaction.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTransactionTypeColor(transaction.type)}`}>
                              {transaction.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{transaction.description}</div>
                            <div className="text-sm text-gray-500">Ref: {transaction.reference}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className={`text-sm font-medium ${
                              transaction.type === 'Add' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'Add' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{transaction.processedBy}</div>
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
              <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Select a Guest</h3>
              <p className="mt-2 text-gray-500">Choose a guest from the list to view their account details and process transactions.</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-indigo-100 rounded-lg p-3">
              <UserCircleIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Guests</p>
              <p className="text-2xl font-bold text-gray-900">
                {guests.filter(g => g.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Credits</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {guests.filter(g => g.accountBalance > 0).reduce((sum, g) => sum + g.accountBalance, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <DocumentTextIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {Math.abs(guests.filter(g => g.accountBalance < 0).reduce((sum, g) => sum + g.accountBalance, 0)).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <ClockIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Transactions Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.filter(t => t.date === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuestAccount;
