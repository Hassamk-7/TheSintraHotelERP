import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CurrencyDollarIcon,
  KeyIcon,
  ArrowRightOnRectangleIcon,
  CubeIcon,
  ShoppingCartIcon,
  SparklesIcon,
  UserIcon,
  DocumentTextIcon,
  CreditCardIcon,
  BookOpenIcon,
  ChartBarIcon,
  CalculatorIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const accountingItems = [
  { 
    name: 'Check In', 
    href: '/accounting-checkin', 
    icon: KeyIcon, 
    description: 'Process guest check-in billing',
    color: 'from-green-500 to-emerald-600'
  },
  { 
    name: 'Check Out', 
    href: '/accounting-checkout', 
    icon: ArrowRightOnRectangleIcon, 
    description: 'Handle guest check-out and final billing',
    color: 'from-red-500 to-rose-600'
  },
  { 
    name: 'Stock', 
    href: '/accounting-stock', 
    icon: CubeIcon, 
    description: 'Manage inventory stock accounting',
    color: 'from-blue-500 to-indigo-600'
  },
  { 
    name: 'Order', 
    href: '/accounting-order', 
    icon: ShoppingCartIcon, 
    description: 'Process order billing and payments',
    color: 'from-orange-500 to-amber-600'
  },
  { 
    name: 'Laundry Billing', 
    href: '/laundry-billing', 
    icon: SparklesIcon, 
    description: 'Handle laundry service billing',
    color: 'from-teal-500 to-cyan-600'
  },
  { 
    name: 'Guest Account (Add/Refund Money)', 
    href: '/guest-account', 
    icon: UserIcon, 
    description: 'Manage guest account transactions',
    color: 'from-purple-500 to-violet-600'
  },
  { 
    name: 'Purchased Inventory', 
    href: '/purchased-inventory', 
    icon: CubeIcon, 
    description: 'Track purchased inventory costs',
    color: 'from-gray-500 to-slate-600'
  },
  { 
    name: 'Voucher', 
    href: '/voucher-management', 
    icon: DocumentTextIcon, 
    description: 'Create and manage accounting vouchers',
    color: 'from-pink-500 to-rose-600'
  },
  { 
    name: 'Payment', 
    href: '/payment-management', 
    icon: CreditCardIcon, 
    description: 'Process payments and transactions',
    color: 'from-emerald-500 to-green-600'
  },
  { 
    name: 'Purchase DayBook', 
    href: '/purchase-daybook', 
    icon: BookOpenIcon, 
    description: 'Daily purchase transaction records',
    color: 'from-yellow-500 to-orange-600'
  },
  { 
    name: 'Daybook', 
    href: '/daybook', 
    icon: BookOpenIcon, 
    description: 'Daily transaction summary',
    color: 'from-indigo-500 to-purple-600'
  },
  { 
    name: 'Supplier Ledger', 
    href: '/supplier-ledger', 
    icon: ChartBarIcon, 
    description: 'Supplier account statements',
    color: 'from-red-500 to-pink-600'
  },
  { 
    name: 'Guest Ledger', 
    href: '/guest-ledger', 
    icon: UserIcon, 
    description: 'Guest account statements',
    color: 'from-blue-500 to-cyan-600'
  },
  { 
    name: 'General Ledger', 
    href: '/general-ledger', 
    icon: BookOpenIcon, 
    description: 'Complete accounting ledger',
    color: 'from-green-500 to-teal-600'
  },
  { 
    name: 'Trial Balance', 
    href: '/trial-balance', 
    icon: CalculatorIcon, 
    description: 'Financial trial balance report',
    color: 'from-purple-500 to-indigo-600'
  }
]

const Accounting = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = accountingItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Accounting</h1>
            <p className="text-emerald-100 text-lg">
              Manage financial transactions, billing, and accounting records
            </p>
          </div>
          <CurrencyDollarIcon className="h-16 w-16 text-emerald-200" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900">Rs 125,400</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <KeyIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Check-ins Billed</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <ArrowRightOnRectangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Check-outs Processed</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <CreditCardIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">Rs 25,600</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search accounting operations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Accounting Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-emerald-300 transition-all duration-200 transform hover:-translate-y-1 group"
          >
            <div className="flex items-center mb-4">
              <div className={`bg-gradient-to-r ${item.color} rounded-lg p-3 group-hover:scale-110 transition-transform duration-200`}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
              {item.name}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {item.description}
            </p>
          </Link>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <CurrencyDollarIcon className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No operations found</h3>
          <p className="text-gray-500">Try adjusting your search terms.</p>
        </div>
      )}

      {/* Financial Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Today's Financial Summary</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-100 rounded-lg p-4 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Room Revenue</h3>
                <p className="text-2xl font-bold text-green-600">Rs 85,400</p>
              </div>
              <p className="text-sm text-gray-500">68% of total revenue</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-lg p-4 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Restaurant</h3>
                <p className="text-2xl font-bold text-orange-600">Rs 28,600</p>
              </div>
              <p className="text-sm text-gray-500">23% of total revenue</p>
            </div>

            <div className="text-center">
              <div className="bg-teal-100 rounded-lg p-4 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Services</h3>
                <p className="text-2xl font-bold text-teal-600">Rs 8,400</p>
              </div>
              <p className="text-sm text-gray-500">7% of total revenue</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-lg p-4 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Other</h3>
                <p className="text-2xl font-bold text-purple-600">Rs 3,000</p>
              </div>
              <p className="text-sm text-gray-500">2% of total revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-2">
                  <KeyIcon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Room 205 - Check-in Payment</p>
                  <p className="text-xs text-gray-500">Zubair Hussain • Payment ID: PAY001</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-600">+Rs 15,000</p>
                <p className="text-xs text-gray-500">5 min ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 rounded-full p-2">
                  <ShoppingCartIcon className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Restaurant Order - Table 5</p>
                  <p className="text-xs text-gray-500">Order #156 • Cash Payment</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-orange-600">+Rs 2,400</p>
                <p className="text-xs text-gray-500">15 min ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 rounded-full p-2">
                  <CubeIcon className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Inventory Purchase</p>
                  <p className="text-xs text-gray-500">Zubair Foods & Supplies • INV-001</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-red-600">-Rs 8,500</p>
                <p className="text-xs text-gray-500">30 min ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg border border-teal-200">
              <div className="flex items-center space-x-3">
                <div className="bg-teal-100 rounded-full p-2">
                  <SparklesIcon className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Laundry Service</p>
                  <p className="text-xs text-gray-500">Room 312 • 8 items processed</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-teal-600">+Rs 800</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 rounded-full p-2">
                  <UserIcon className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Guest Account Refund</p>
                  <p className="text-xs text-gray-500">Ahmed Ali • Cancellation refund</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-purple-600">-Rs 3,200</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Balances */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Account Balances</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <CreditCardIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Cash Account</h3>
              <p className="text-2xl font-bold text-blue-600">Rs 45,600</p>
              <p className="text-sm text-gray-500">Available cash</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <BookOpenIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Bank Account</h3>
              <p className="text-2xl font-bold text-green-600">Rs 285,400</p>
              <p className="text-sm text-gray-500">Bank balance</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <ChartBarIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Accounts Receivable</h3>
              <p className="text-2xl font-bold text-yellow-600">Rs 18,200</p>
              <p className="text-sm text-gray-500">Outstanding payments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Accounting;
