import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  ComputerDesktopIcon,
  BeakerIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const restaurantBarItems = [
  { 
    name: 'Dashboard', 
    href: '/menu-management', 
    icon: ClipboardDocumentListIcon, 
    description: 'Real-time restaurant operations overview',
    color: 'from-orange-500 to-red-600'
  },
  { 
    name: 'Orders', 
    href: '/restaurant-orders', 
    icon: ShoppingCartIcon, 
    description: 'Process and track restaurant orders',
    color: 'from-green-500 to-emerald-600'
  },
  { 
    name: 'Table Management', 
    href: '/table-management', 
    icon: CubeIcon, 
    description: 'Manage dining tables and reservations',
    color: 'from-blue-500 to-indigo-600'
  },
  { 
    name: 'Kitchen Display', 
    href: '/kitchen-display', 
    icon: ComputerDesktopIcon, 
    description: 'Kitchen order display and management',
    color: 'from-purple-500 to-violet-600'
  },
  { 
    name: 'Bar Management', 
    href: '/bar-management', 
    icon: BeakerIcon, 
    description: 'Manage bar operations and drinks',
    color: 'from-teal-500 to-cyan-600'
  }
]

const RestaurantBar = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = restaurantBarItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Restaurant & Bar</h1>
            <p className="text-orange-100 text-lg">
              Manage dining operations, orders, and bar services
            </p>
          </div>
          <ShoppingCartIcon className="h-16 w-16 text-orange-200" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <ShoppingCartIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Orders</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CubeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tables Occupied</p>
              <p className="text-2xl font-bold text-gray-900">18/25</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900">Rs 45,600</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-teal-100 rounded-lg p-3">
              <BeakerIcon className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bar Orders</p>
              <p className="text-2xl font-bold text-gray-900">42</p>
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
            placeholder="Search restaurant & bar operations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Restaurant & Bar Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-orange-300 transition-all duration-200 transform hover:-translate-y-1 group"
          >
            <div className="flex items-center mb-4">
              <div className={`bg-gradient-to-r ${item.color} rounded-lg p-3 group-hover:scale-110 transition-transform duration-200`}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
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
            <ShoppingCartIcon className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No operations found</h3>
          <p className="text-gray-500">Try adjusting your search terms.</p>
        </div>
      )}

      {/* Popular Menu Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Popular Menu Items Today</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-orange-100 rounded-lg p-4 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Chicken Karahi</h3>
                <p className="text-sm text-gray-500">Pakistani Cuisine</p>
              </div>
              <div className="bg-green-100 rounded-full px-3 py-1 text-sm font-medium text-green-800">
                32 orders
              </div>
            </div>

            <div className="text-center">
              <div className="bg-red-100 rounded-lg p-4 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Biryani</h3>
                <p className="text-sm text-gray-500">Rice Dish</p>
              </div>
              <div className="bg-green-100 rounded-full px-3 py-1 text-sm font-medium text-green-800">
                28 orders
              </div>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 rounded-lg p-4 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Seekh Kebab</h3>
                <p className="text-sm text-gray-500">Grilled</p>
              </div>
              <div className="bg-green-100 rounded-full px-3 py-1 text-sm font-medium text-green-800">
                24 orders
              </div>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-lg p-4 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Lassi</h3>
                <p className="text-sm text-gray-500">Beverage</p>
              </div>
              <div className="bg-green-100 rounded-full px-3 py-1 text-sm font-medium text-green-800">
                45 orders
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Live Orders</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 rounded-full p-2">
                  <ShoppingCartIcon className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Table 5 - Order #156</p>
                  <p className="text-xs text-gray-500">2x Chicken Karahi, 1x Naan, 2x Lassi</p>
                </div>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Preparing
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <BuildingOfficeIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Room 205 - Order #157</p>
                  <p className="text-xs text-gray-500">1x Biryani, 1x Raita, 1x Cold Drink</p>
                </div>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                Room Service
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-2">
                  <BeakerIcon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Bar - Order #158</p>
                  <p className="text-xs text-gray-500">2x Fresh Juice, 1x Coffee, 1x Tea</p>
                </div>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Ready
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 rounded-full p-2">
                  <CubeIcon className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Table 12 - Order #159</p>
                  <p className="text-xs text-gray-500">3x Seekh Kebab, 2x Roti, 1x Salad</p>
                </div>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                Served
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Kitchen Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Kitchen Status</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <ComputerDesktopIcon className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Main Kitchen</h3>
              <p className="text-sm text-gray-500 mb-2">Head Chef: Ahmad Ali</p>
              <div className="bg-green-100 rounded-full px-3 py-1 text-sm font-medium text-green-800">
                8 orders in queue
              </div>
            </div>

            <div className="text-center">
              <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <BeakerIcon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Grill Section</h3>
              <p className="text-sm text-gray-500 mb-2">Chef: Usman Khan</p>
              <div className="bg-yellow-100 rounded-full px-3 py-1 text-sm font-medium text-yellow-800">
                5 orders in queue
              </div>
            </div>

            <div className="text-center">
              <div className="bg-teal-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <BeakerIcon className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Bar Counter</h3>
              <p className="text-sm text-gray-500 mb-2">Bartender: Sana Ahmed</p>
              <div className="bg-blue-100 rounded-full px-3 py-1 text-sm font-medium text-blue-800">
                3 orders in queue
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantBar;
