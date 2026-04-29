import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  BeakerIcon,
  FunnelIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const DrinksStockSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [stockStatusFilter, setStockStatusFilter] = useState('')
  const [supplierFilter, setSupplierFilter] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [quantityRange, setQuantityRange] = useState({ min: '', max: '' })

  const [drinksStock] = useState([
    {
      id: 1,
      itemCode: 'DRK-001',
      itemName: 'Coca Cola 330ml',
      category: 'Soft Drinks',
      brand: 'Coca Cola',
      supplier: 'Beverage Distributors Ltd',
      currentStock: 245,
      minimumStock: 50,
      maximumStock: 500,
      unitPrice: 80,
      totalValue: 19600,
      lastRestockDate: '2024-01-10',
      expiryDate: '2024-06-15',
      stockStatus: 'In Stock',
      location: 'Bar Storage',
      batchNumber: 'CC-2024-001',
      alcoholContent: 0,
      volume: 330,
      unit: 'ml',
      reorderLevel: 75,
      averageConsumption: 25,
      daysToFinish: 10
    },
    {
      id: 2,
      itemCode: 'DRK-002',
      itemName: 'Red Wine Bottle',
      category: 'Alcoholic',
      brand: 'Chateau Rouge',
      supplier: 'Wine Imports Co',
      currentStock: 12,
      minimumStock: 20,
      maximumStock: 100,
      unitPrice: 3500,
      totalValue: 42000,
      lastRestockDate: '2024-01-05',
      expiryDate: '2026-12-31',
      stockStatus: 'Low Stock',
      location: 'Wine Cellar',
      batchNumber: 'WR-2024-002',
      alcoholContent: 12.5,
      volume: 750,
      unit: 'ml',
      reorderLevel: 20,
      averageConsumption: 3,
      daysToFinish: 4
    },
    {
      id: 3,
      itemCode: 'DRK-003',
      itemName: 'Fresh Orange Juice',
      category: 'Fresh Juices',
      brand: 'Hotel Fresh',
      supplier: 'Local Fruit Suppliers',
      currentStock: 0,
      minimumStock: 15,
      maximumStock: 50,
      unitPrice: 250,
      totalValue: 0,
      lastRestockDate: '2024-01-14',
      expiryDate: '2024-01-18',
      stockStatus: 'Out of Stock',
      location: 'Kitchen Fridge',
      batchNumber: 'OJ-2024-003',
      alcoholContent: 0,
      volume: 1000,
      unit: 'ml',
      reorderLevel: 15,
      averageConsumption: 8,
      daysToFinish: 0
    },
    {
      id: 4,
      itemCode: 'DRK-004',
      itemName: 'Whiskey Premium',
      category: 'Alcoholic',
      brand: 'Highland Reserve',
      supplier: 'Premium Spirits Ltd',
      currentStock: 8,
      minimumStock: 5,
      maximumStock: 25,
      unitPrice: 8500,
      totalValue: 68000,
      lastRestockDate: '2024-01-08',
      expiryDate: '2030-01-01',
      stockStatus: 'In Stock',
      location: 'Bar Premium',
      batchNumber: 'WH-2024-004',
      alcoholContent: 40,
      volume: 750,
      unit: 'ml',
      reorderLevel: 5,
      averageConsumption: 2,
      daysToFinish: 4
    },
    {
      id: 5,
      itemCode: 'DRK-005',
      itemName: 'Mineral Water 500ml',
      category: 'Water',
      brand: 'Pure Springs',
      supplier: 'Water Supply Co',
      currentStock: 180,
      minimumStock: 100,
      maximumStock: 300,
      unitPrice: 50,
      totalValue: 9000,
      lastRestockDate: '2024-01-12',
      expiryDate: '2025-01-12',
      stockStatus: 'In Stock',
      location: 'Main Storage',
      batchNumber: 'MW-2024-005',
      alcoholContent: 0,
      volume: 500,
      unit: 'ml',
      reorderLevel: 100,
      averageConsumption: 35,
      daysToFinish: 5
    }
  ])

  const categories = ['Soft Drinks', 'Alcoholic', 'Fresh Juices', 'Water', 'Energy Drinks']
  const stockStatuses = ['In Stock', 'Low Stock', 'Out of Stock', 'Overstocked', 'Expired']
  const suppliers = ['Beverage Distributors Ltd', 'Wine Imports Co', 'Local Fruit Suppliers', 'Premium Spirits Ltd', 'Water Supply Co']

  const filteredStock = drinksStock.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === '' || item.category === categoryFilter
    const matchesStockStatus = stockStatusFilter === '' || item.stockStatus === stockStatusFilter
    const matchesSupplier = supplierFilter === '' || item.supplier === supplierFilter
    
    let matchesDateRange = true
    if (dateRange.start && dateRange.end) {
      const restockDate = new Date(item.lastRestockDate)
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      matchesDateRange = restockDate >= startDate && restockDate <= endDate
    }
    
    let matchesQuantityRange = true
    if (quantityRange.min || quantityRange.max) {
      const min = parseFloat(quantityRange.min) || 0
      const max = parseFloat(quantityRange.max) || Infinity
      matchesQuantityRange = item.currentStock >= min && item.currentStock <= max
    }
    
    return matchesSearch && matchesCategory && matchesStockStatus && matchesSupplier && matchesDateRange && matchesQuantityRange
  })

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800'
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800'
      case 'Out of Stock': return 'bg-red-100 text-red-800'
      case 'Overstocked': return 'bg-blue-100 text-blue-800'
      case 'Expired': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Soft Drinks': return 'bg-blue-100 text-blue-800'
      case 'Alcoholic': return 'bg-red-100 text-red-800'
      case 'Fresh Juices': return 'bg-orange-100 text-orange-800'
      case 'Water': return 'bg-cyan-100 text-cyan-800'
      case 'Energy Drinks': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const exportResults = () => {
    alert(`Exporting ${filteredStock.length} drinks stock records...`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setCategoryFilter('')
    setStockStatusFilter('')
    setSupplierFilter('')
    setDateRange({ start: '', end: '' })
    setQuantityRange({ min: '', max: '' })
  }

  // Calculate statistics
  const totalItems = filteredStock.length
  const inStockItems = filteredStock.filter(item => item.stockStatus === 'In Stock').length
  const lowStockItems = filteredStock.filter(item => item.stockStatus === 'Low Stock').length
  const outOfStockItems = filteredStock.filter(item => item.stockStatus === 'Out of Stock').length
  const totalValue = filteredStock.reduce((sum, item) => sum + item.totalValue, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Drinks Stock Search</h1>
            <p className="text-cyan-100">Search and manage drinks inventory and stock levels</p>
          </div>
          <BeakerIcon className="h-12 w-12 text-cyan-200" />
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Stock Filters
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
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Export Stock Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search drinks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={stockStatusFilter}
            onChange={(e) => setStockStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">All Stock Status</option>
            {stockStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">All Suppliers</option>
            {suppliers.map(supplier => (
              <option key={supplier} value={supplier}>{supplier.substring(0, 20)}...</option>
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
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="date"
              placeholder="To Date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Quantity"
              value={quantityRange.min}
              onChange={(e) => setQuantityRange({...quantityRange, min: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="number"
              placeholder="Max Quantity"
              value={quantityRange.max}
              onChange={(e) => setQuantityRange({...quantityRange, max: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Stock</p>
              <p className="text-2xl font-bold text-gray-900">{inStockItems}</p>
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
              <ClockIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{outOfStockItems}</p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Levels</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing & Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supply Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStock.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-cyan-100 rounded-full p-2 mr-3">
                        <BeakerIcon className="h-5 w-5 text-cyan-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                        <div className="text-sm text-gray-500">{item.itemCode}</div>
                        <div className="text-sm text-gray-500">{item.brand}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                        {item.alcoholContent > 0 && (
                          <div className="text-sm text-red-600">Alcohol: {item.alcoholContent}%</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        Current: {item.currentStock}
                      </div>
                      <div className="text-sm text-gray-500">
                        Min: {item.minimumStock} | Max: {item.maximumStock}
                      </div>
                      <div className="text-sm text-gray-500">
                        Volume: {item.volume}{item.unit}
                      </div>
                      <div className="text-sm text-gray-500">
                        Daily usage: {item.averageConsumption}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        Unit: {formatCurrency(item.unitPrice)}
                      </div>
                      <div className="text-sm text-gray-900">
                        Total: {formatCurrency(item.totalValue)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">{item.supplier}</div>
                      <div className="text-sm text-gray-500">Batch: {item.batchNumber}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-1" />
                        Restocked: {item.lastRestockDate}
                      </div>
                      <div className="text-sm text-gray-500">
                        Expires: {item.expiryDate}
                      </div>
                      <div className="text-sm text-gray-500">
                        Location: {item.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockStatusColor(item.stockStatus)}`}>
                        {item.stockStatus}
                      </span>
                      {item.currentStock <= item.reorderLevel && (
                        <div className="text-xs text-red-600 font-medium">
                          Reorder Required
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        Days left: {item.daysToFinish}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStock.length === 0 && (
          <div className="text-center py-12">
            <BeakerIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No drinks stock found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DrinksStockSearch;
