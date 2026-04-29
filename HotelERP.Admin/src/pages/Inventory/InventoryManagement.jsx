import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CubeIcon,
  ShoppingCartIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'

const inventoryItems = [
  { 
    name: 'Stock Management', 
    href: '/stock-management', 
    icon: CubeIcon, 
    description: 'Monitor and manage inventory stock levels',
    color: 'from-blue-500 to-indigo-600'
  },
  { 
    name: 'Purchase Orders', 
    href: '/purchase-orders', 
    icon: ShoppingCartIcon, 
    description: 'Create and manage purchase orders',
    color: 'from-green-500 to-emerald-600'
  },
  { 
    name: 'Suppliers', 
    href: '/inventory-suppliers', 
    icon: TruckIcon, 
    description: 'Manage supplier relationships and orders',
    color: 'from-purple-500 to-violet-600'
  },
  { 
    name: 'Stock Alerts', 
    href: '/stock-alerts', 
    icon: ExclamationTriangleIcon, 
    description: 'Monitor low stock and reorder alerts',
    color: 'from-red-500 to-rose-600'
  },
  { 
    name: 'Inventory Reports', 
    href: '/inventory-reports', 
    icon: ChartBarIcon, 
    description: 'Generate inventory and stock reports',
    color: 'from-teal-500 to-cyan-600'
  }
]

const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
            <p className="text-indigo-100 text-lg">
              Manage stock, suppliers, and inventory operations
            </p>
          </div>
          <CubeIcon className="h-16 w-16 text-indigo-200" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CubeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">1,245</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <ShoppingCartIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <TruckIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
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
            placeholder="Search inventory operations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Inventory Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-300 transition-all duration-200 transform hover:-translate-y-1 group"
          >
            <div className="flex items-center mb-4">
              <div className={`bg-gradient-to-r ${item.color} rounded-lg p-3 group-hover:scale-110 transition-transform duration-200`}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
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
            <CubeIcon className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No operations found</h3>
          <p className="text-gray-500">Try adjusting your search terms.</p>
        </div>
      )}

      {/* Stock Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Stock Alerts</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 rounded-full p-2">
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Basmati Rice - Critical Stock</p>
                  <p className="text-xs text-gray-500">Current: 5 Kg | Minimum: 10 Kg</p>
                </div>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                Critical
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 rounded-full p-2">
                  <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Chicken Breast - Low Stock</p>
                  <p className="text-xs text-gray-500">Current: 8 Kg | Minimum: 5 Kg</p>
                </div>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Low
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 rounded-full p-2">
                  <ExclamationTriangleIcon className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Cooking Oil - Reorder Level</p>
                  <p className="text-xs text-gray-500">Current: 15 Liters | Reorder: 20 Liters</p>
                </div>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                Reorder
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Purchase Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Purchase Orders</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-2">
                  <ShoppingCartIcon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">PO-001 - Zubair Foods & Supplies</p>
                  <p className="text-xs text-gray-500">Rice, Chicken, Vegetables • Rs 25,000</p>
                </div>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Delivered
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <ShoppingCartIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">PO-002 - Kitchen Supplies Co.</p>
                  <p className="text-xs text-gray-500">Spices, Oil, Flour • Rs 18,500</p>
                </div>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                In Transit
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 rounded-full p-2">
                  <ShoppingCartIcon className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">PO-003 - Fresh Dairy Products</p>
                  <p className="text-xs text-gray-500">Milk, Yogurt, Cheese • Rs 12,000</p>
                </div>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Pending
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Suppliers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Top Suppliers This Month</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <TruckIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Zubair Foods & Supplies</h3>
              <p className="text-sm text-gray-500 mb-2">Food & Beverage</p>
              <div className="bg-purple-100 rounded-full px-3 py-1 text-sm font-medium text-purple-800">
                Rs 85,000 purchased
              </div>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <TruckIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Kitchen Supplies Co.</h3>
              <p className="text-sm text-gray-500 mb-2">Kitchen Equipment</p>
              <div className="bg-green-100 rounded-full px-3 py-1 text-sm font-medium text-green-800">
                Rs 45,000 purchased
              </div>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <TruckIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Fresh Dairy Products</h3>
              <p className="text-sm text-gray-500 mb-2">Dairy & Beverages</p>
              <div className="bg-blue-100 rounded-full px-3 py-1 text-sm font-medium text-blue-800">
                Rs 32,000 purchased
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Inventory by Category</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-orange-100 rounded-lg p-4 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Food & Beverage</h3>
                <p className="text-2xl font-bold text-orange-600">485</p>
              </div>
              <p className="text-sm text-gray-500">items in stock</p>
            </div>

            <div className="text-center">
              <div className="bg-teal-100 rounded-lg p-4 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Housekeeping</h3>
                <p className="text-2xl font-bold text-teal-600">320</p>
              </div>
              <p className="text-sm text-gray-500">items in stock</p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 rounded-lg p-4 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Maintenance</h3>
                <p className="text-2xl font-bold text-red-600">180</p>
              </div>
              <p className="text-sm text-gray-500">items in stock</p>
            </div>

            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-4 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Office Supplies</h3>
                <p className="text-2xl font-bold text-gray-600">260</p>
              </div>
              <p className="text-sm text-gray-500">items in stock</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryManagement;
