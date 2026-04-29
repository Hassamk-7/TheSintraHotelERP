import { useState } from 'react'
import {
  BeakerIcon,
  FunnelIcon,
  DocumentTextIcon,
  PrinterIcon,
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const DrinksStockReport = () => {
  const [filters, setFilters] = useState({
    category: '',
    stockStatus: '',
    supplier: '',
    dateRange: { start: '', end: '' }
  })

  const [stockData] = useState([
    {
      id: 1,
      itemCode: 'DR-001',
      itemName: 'Coca Cola 330ml',
      category: 'Soft Drinks',
      supplier: 'Coca Cola Company',
      currentStock: 150,
      minStock: 50,
      maxStock: 300,
      unitPrice: 45,
      totalValue: 6750,
      lastRestocked: '2024-01-18',
      expiryDate: '2024-06-15',
      stockInThisMonth: 200,
      stockOutThisMonth: 50,
      stockStatus: 'Good',
      location: 'Beverage Storage A',
      batchNumber: 'CC240118'
    },
    {
      id: 2,
      itemCode: 'DR-002',
      itemName: 'Fresh Orange Juice',
      category: 'Fresh Juices',
      supplier: 'Local Fruit Vendor',
      currentStock: 25,
      minStock: 30,
      maxStock: 100,
      unitPrice: 120,
      totalValue: 3000,
      lastRestocked: '2024-01-20',
      expiryDate: '2024-01-22',
      stockInThisMonth: 80,
      stockOutThisMonth: 55,
      stockStatus: 'Low Stock',
      location: 'Fresh Juice Counter',
      batchNumber: 'FJ240120'
    },
    {
      id: 3,
      itemCode: 'DR-003',
      itemName: 'Mineral Water 1.5L',
      category: 'Water',
      supplier: 'Nestle Pakistan',
      currentStock: 500,
      minStock: 100,
      maxStock: 800,
      unitPrice: 80,
      totalValue: 40000,
      lastRestocked: '2024-01-15',
      expiryDate: '2024-12-31',
      stockInThisMonth: 600,
      stockOutThisMonth: 100,
      stockStatus: 'Good',
      location: 'Main Storage',
      batchNumber: 'NW240115'
    },
    {
      id: 4,
      itemCode: 'DR-004',
      itemName: 'Green Tea Bags',
      category: 'Hot Beverages',
      supplier: 'Tapal Tea',
      currentStock: 5,
      minStock: 20,
      maxStock: 100,
      unitPrice: 15,
      totalValue: 75,
      lastRestocked: '2024-01-10',
      expiryDate: '2024-08-30',
      stockInThisMonth: 50,
      stockOutThisMonth: 45,
      stockStatus: 'Critical',
      location: 'Kitchen Storage',
      batchNumber: 'GT240110'
    },
    {
      id: 5,
      itemCode: 'DR-005',
      itemName: 'Energy Drink 250ml',
      category: 'Energy Drinks',
      supplier: 'Red Bull Pakistan',
      currentStock: 0,
      minStock: 24,
      maxStock: 120,
      unitPrice: 180,
      totalValue: 0,
      lastRestocked: '2024-01-05',
      expiryDate: '2024-07-20',
      stockInThisMonth: 48,
      stockOutThisMonth: 48,
      stockStatus: 'Out of Stock',
      location: 'Beverage Storage B',
      batchNumber: 'RB240105'
    }
  ])

  const categories = ['All Categories', 'Soft Drinks', 'Fresh Juices', 'Water', 'Hot Beverages', 'Energy Drinks', 'Alcoholic']
  const stockStatuses = ['All Status', 'Good', 'Low Stock', 'Critical', 'Out of Stock', 'Overstocked']
  const suppliers = ['All Suppliers', 'Coca Cola Company', 'Local Fruit Vendor', 'Nestle Pakistan', 'Tapal Tea', 'Red Bull Pakistan']

  const filteredStock = stockData.filter(item => {
    const matchesCategory = filters.category === '' || filters.category === 'All Categories' || item.category === filters.category
    const matchesStatus = filters.stockStatus === '' || filters.stockStatus === 'All Status' || item.stockStatus === filters.stockStatus
    const matchesSupplier = filters.supplier === '' || filters.supplier === 'All Suppliers' || item.supplier === filters.supplier
    
    return matchesCategory && matchesStatus && matchesSupplier
  })

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'Good': return 'bg-green-100 text-green-800'
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800'
      case 'Critical': return 'bg-orange-100 text-orange-800'
      case 'Out of Stock': return 'bg-red-100 text-red-800'
      case 'Overstocked': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Soft Drinks': return 'bg-blue-100 text-blue-800'
      case 'Fresh Juices': return 'bg-orange-100 text-orange-800'
      case 'Water': return 'bg-cyan-100 text-cyan-800'
      case 'Hot Beverages': return 'bg-brown-100 text-brown-800'
      case 'Energy Drinks': return 'bg-red-100 text-red-800'
      case 'Alcoholic': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const exportReport = () => {
    alert(`Exporting drinks stock report with ${filteredStock.length} items...`)
  }

  const printReport = () => {
    window.print()
  }

  // Calculate statistics
  const totalItems = filteredStock.length
  const totalValue = filteredStock.reduce((sum, item) => sum + item.totalValue, 0)
  const lowStockItems = filteredStock.filter(item => item.stockStatus === 'Low Stock' || item.stockStatus === 'Critical').length
  const outOfStockItems = filteredStock.filter(item => item.stockStatus === 'Out of Stock').length
  const goodStockItems = filteredStock.filter(item => item.stockStatus === 'Good').length
  const totalStockIn = filteredStock.reduce((sum, item) => sum + item.stockInThisMonth, 0)
  const totalStockOut = filteredStock.reduce((sum, item) => sum + item.stockOutThisMonth, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Drinks Stock In/Out Report</h1>
            <p className="text-cyan-100">Monitor beverage inventory levels and stock movements</p>
          </div>
          <BeakerIcon className="h-12 w-12 text-cyan-200" />
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
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {categories.map(category => (
                <option key={category} value={category === 'All Categories' ? '' : category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status</label>
            <select
              value={filters.stockStatus}
              onChange={(e) => setFilters({...filters, stockStatus: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {stockStatuses.map(status => (
                <option key={status} value={status === 'All Status' ? '' : status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
            <select
              value={filters.supplier}
              onChange={(e) => setFilters({...filters, supplier: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {suppliers.map(supplier => (
                <option key={supplier} value={supplier === 'All Suppliers' ? '' : supplier}>{supplier}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, start: e.target.value}})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-cyan-100 rounded-lg p-3">
              <BeakerIcon className="h-6 w-6 text-cyan-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Good Stock</p>
              <p className="text-2xl font-bold text-gray-900">{goodStockItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{outOfStockItems}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Movement Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Movement This Month</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalStockIn}</div>
            <div className="text-sm text-gray-600">Total Stock In</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{totalStockOut}</div>
            <div className="text-sm text-gray-600">Total Stock Out</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalStockIn - totalStockOut}</div>
            <div className="text-sm text-gray-600">Net Movement</div>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Drinks Stock Report ({filteredStock.length} items)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Levels</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Movement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value & Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location & Batch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStock.map((item) => {
                const stockPercentage = (item.currentStock / item.maxStock) * 100
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                        <div className="text-sm text-gray-500">{item.itemCode}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                        <div className="text-sm text-gray-500 mt-1">{item.supplier}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-900">
                          Current: {item.currentStock} units
                        </div>
                        <div className="text-sm text-gray-500">
                          Min: {item.minStock} | Max: {item.maxStock}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              stockPercentage > 60 ? 'bg-green-600' :
                              stockPercentage > 30 ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {stockPercentage.toFixed(1)}% of capacity
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-green-600">
                          In: {item.stockInThisMonth} units
                        </div>
                        <div className="text-sm text-red-600">
                          Out: {item.stockOutThisMonth} units
                        </div>
                        <div className="text-sm font-medium text-blue-600">
                          Net: {item.stockInThisMonth - item.stockOutThisMonth} units
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          Unit: {formatCurrency(item.unitPrice)}
                        </div>
                        <div className="text-sm text-green-600">
                          Total: {formatCurrency(item.totalValue)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Restocked: {item.lastRestocked}
                        </div>
                        <div className="text-sm text-orange-600">
                          Expires: {item.expiryDate}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          {item.location}
                        </div>
                        <div className="text-sm text-gray-500">
                          Batch: {item.batchNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockStatusColor(item.stockStatus)}`}>
                        {item.stockStatus}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredStock.length === 0 && (
          <div className="text-center py-12">
            <BeakerIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No stock data found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>

      {/* Alerts Section */}
      {(lowStockItems > 0 || outOfStockItems > 0) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
            Stock Alerts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lowStockItems > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-yellow-800">Low Stock Alert</div>
                    <div className="text-sm text-yellow-700">{lowStockItems} items need restocking</div>
                  </div>
                </div>
              </div>
            )}
            {outOfStockItems > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-red-800">Out of Stock Alert</div>
                    <div className="text-sm text-red-700">{outOfStockItems} items are out of stock</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DrinksStockReport;
