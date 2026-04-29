import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  ChartBarIcon,
  FunnelIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  TrophyIcon,
  CakeIcon,
  FireIcon
} from '@heroicons/react/24/outline'

const MostOrderedFoodsSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [timeRangeFilter, setTimeRangeFilter] = useState('This Month')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [sortBy, setSortBy] = useState('quantity')

  const [foodData] = useState([
    {
      id: 1,
      itemName: 'Chicken Karahi',
      category: 'Main Course',
      totalOrders: 145,
      totalQuantity: 287,
      totalRevenue: 344400,
      averagePrice: 1200,
      peakOrderTime: '19:00-21:00',
      popularWith: 'Room Guests',
      lastOrderDate: '2024-01-16',
      trend: 'increasing',
      trendPercentage: 15.5,
      rating: 4.8,
      preparationTime: '25 mins'
    },
    {
      id: 2,
      itemName: 'Biryani',
      category: 'Main Course',
      totalOrders: 132,
      totalQuantity: 198,
      totalRevenue: 158400,
      averagePrice: 800,
      peakOrderTime: '18:30-20:30',
      popularWith: 'Walk-in Customers',
      lastOrderDate: '2024-01-16',
      trend: 'stable',
      trendPercentage: 2.1,
      rating: 4.6,
      preparationTime: '35 mins'
    },
    {
      id: 3,
      itemName: 'Club Sandwich',
      category: 'Fast Food',
      totalOrders: 98,
      totalQuantity: 156,
      totalRevenue: 93600,
      averagePrice: 600,
      peakOrderTime: '12:00-14:00',
      popularWith: 'Room Guests',
      lastOrderDate: '2024-01-16',
      trend: 'increasing',
      trendPercentage: 8.3,
      rating: 4.4,
      preparationTime: '15 mins'
    },
    {
      id: 4,
      itemName: 'Beef Steak',
      category: 'Main Course',
      totalOrders: 67,
      totalQuantity: 78,
      totalRevenue: 195000,
      averagePrice: 2500,
      peakOrderTime: '20:00-22:00',
      popularWith: 'Room Guests',
      lastOrderDate: '2024-01-15',
      trend: 'increasing',
      trendPercentage: 12.8,
      rating: 4.9,
      preparationTime: '30 mins'
    },
    {
      id: 5,
      itemName: 'Caesar Salad',
      category: 'Salads',
      totalOrders: 89,
      totalQuantity: 102,
      totalRevenue: 81600,
      averagePrice: 800,
      peakOrderTime: '13:00-15:00',
      popularWith: 'Room Guests',
      lastOrderDate: '2024-01-16',
      trend: 'stable',
      trendPercentage: -1.2,
      rating: 4.3,
      preparationTime: '10 mins'
    },
    {
      id: 6,
      itemName: 'Fish Curry',
      category: 'Main Course',
      totalOrders: 76,
      totalQuantity: 89,
      totalRevenue: 133500,
      averagePrice: 1500,
      peakOrderTime: '19:30-21:30',
      popularWith: 'Walk-in Customers',
      lastOrderDate: '2024-01-16',
      trend: 'decreasing',
      trendPercentage: -5.7,
      rating: 4.2,
      preparationTime: '28 mins'
    },
    {
      id: 7,
      itemName: 'Chicken Wings',
      category: 'Appetizers',
      totalOrders: 112,
      totalQuantity: 224,
      totalRevenue: 89600,
      averagePrice: 400,
      peakOrderTime: '17:00-19:00',
      popularWith: 'Walk-in Customers',
      lastOrderDate: '2024-01-16',
      trend: 'increasing',
      trendPercentage: 18.9,
      rating: 4.5,
      preparationTime: '20 mins'
    },
    {
      id: 8,
      itemName: 'Chocolate Cake',
      category: 'Desserts',
      totalOrders: 94,
      totalQuantity: 118,
      totalRevenue: 47200,
      averagePrice: 400,
      peakOrderTime: '21:00-23:00',
      popularWith: 'Room Guests',
      lastOrderDate: '2024-01-16',
      trend: 'stable',
      trendPercentage: 3.4,
      rating: 4.7,
      preparationTime: '5 mins'
    }
  ])

  const categories = ['Main Course', 'Fast Food', 'Appetizers', 'Salads', 'Desserts', 'Beverages']
  const timeRanges = ['Today', 'This Week', 'This Month', 'Last Month', 'This Quarter', 'Custom Range']
  const sortOptions = [
    { value: 'quantity', label: 'Total Quantity' },
    { value: 'orders', label: 'Total Orders' },
    { value: 'revenue', label: 'Total Revenue' },
    { value: 'rating', label: 'Rating' },
    { value: 'trend', label: 'Trend' }
  ]

  const filteredData = foodData.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === '' || item.category === categoryFilter
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    switch (sortBy) {
      case 'quantity':
        return b.totalQuantity - a.totalQuantity
      case 'orders':
        return b.totalOrders - a.totalOrders
      case 'revenue':
        return b.totalRevenue - a.totalRevenue
      case 'rating':
        return b.rating - a.rating
      case 'trend':
        return b.trendPercentage - a.trendPercentage
      default:
        return b.totalQuantity - a.totalQuantity
    }
  })

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing': return 'text-green-600'
      case 'decreasing': return 'text-red-600'
      case 'stable': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return '↗'
      case 'decreasing': return '↘'
      case 'stable': return '→'
      default: return '→'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Main Course': return 'bg-blue-100 text-blue-800'
      case 'Fast Food': return 'bg-orange-100 text-orange-800'
      case 'Appetizers': return 'bg-green-100 text-green-800'
      case 'Salads': return 'bg-emerald-100 text-emerald-800'
      case 'Desserts': return 'bg-pink-100 text-pink-800'
      case 'Beverages': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const exportResults = () => {
    alert(`Exporting ${filteredData.length} food analytics records...`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setCategoryFilter('')
    setTimeRangeFilter('This Month')
    setDateRange({ start: '', end: '' })
    setSortBy('quantity')
  }

  // Calculate statistics
  const totalItems = filteredData.length
  const totalOrders = filteredData.reduce((sum, item) => sum + item.totalOrders, 0)
  const totalQuantity = filteredData.reduce((sum, item) => sum + item.totalQuantity, 0)
  const totalRevenue = filteredData.reduce((sum, item) => sum + item.totalRevenue, 0)
  const avgRating = (filteredData.reduce((sum, item) => sum + item.rating, 0) / totalItems).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Most Ordered Foods Analytics</h1>
            <p className="text-amber-100">Analyze food ordering patterns and popular menu items</p>
          </div>
          <ChartBarIcon className="h-12 w-12 text-amber-200" />
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Analytics Filters
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
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Export Analytics
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search food items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={timeRangeFilter}
            onChange={(e) => setTimeRangeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {timeRanges.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>Sort by {option.label}</option>
            ))}
          </select>
        </div>

        {timeRangeFilter === 'Custom Range' && (
          <div className="mt-4 flex space-x-2">
            <input
              type="date"
              placeholder="From Date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="date"
              placeholder="To Date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-amber-100 rounded-lg p-3">
              <CakeIcon className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <FireIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Items Sold</p>
              <p className="text-2xl font-bold text-gray-900">{totalQuantity}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <TrophyIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">{avgRating}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Food Analytics for {timeRangeFilter}</h3>
            <p className="text-gray-600">Showing {filteredData.length} menu items</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <CakeIcon className="h-4 w-4 mr-1" />
              Total Items: {totalItems}
            </div>
            <div className="flex items-center">
              <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
              Filtered: {filteredData.length}
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredData.slice(0, 3).map((item, index) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                }`}>
                  {index + 1}
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-semibold text-gray-900">{item.itemName}</h4>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </div>
              </div>
              <div className={`text-2xl ${getTrendColor(item.trend)}`}>
                {getTrendIcon(item.trend)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Orders:</span>
                <span className="font-medium">{item.totalOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium">{item.totalQuantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue:</span>
                <span className="font-medium">{formatCurrency(item.totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rating:</span>
                <span className="font-medium">★ {item.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank & Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders & Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue & Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 ${
                        index < 3 ? (index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500') : 'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {item.totalOrders} orders
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.totalQuantity} items sold
                      </div>
                      <div className="text-sm text-gray-500">
                        Peak: {item.peakOrderTime}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.totalRevenue)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Avg: {formatCurrency(item.averagePrice)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${getTrendColor(item.trend)}`}>
                          {getTrendIcon(item.trend)} {Math.abs(item.trendPercentage)}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-900">
                        ★ {item.rating} rating
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.preparationTime}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        Popular with: {item.popularWith}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-1" />
                        Last ordered: {item.lastOrderDate}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No food analytics found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search criteria or time range.
            </p>
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      {filteredData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map(category => {
              const categoryItems = filteredData.filter(item => item.category === category)
              const categoryRevenue = categoryItems.reduce((sum, item) => sum + item.totalRevenue, 0)
              const categoryOrders = categoryItems.reduce((sum, item) => sum + item.totalOrders, 0)
              
              if (categoryItems.length === 0) return null
              
              return (
                <div key={category} className="text-center">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getCategoryColor(category)}`}>
                    {category}
                  </span>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(categoryRevenue)}</div>
                    <div className="text-sm text-gray-500">{categoryOrders} orders • {categoryItems.length} items</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default MostOrderedFoodsSearch;
