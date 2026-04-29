import { useState } from 'react'
import {
  DocumentChartBarIcon,
  FunnelIcon,
  DocumentTextIcon,
  PrinterIcon,
  ChartBarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const FoodDrinksMenuReport = () => {
  const [filters, setFilters] = useState({
    category: '',
    dateRange: { start: '', end: '' },
    priceRange: { min: '', max: '' },
    availability: ''
  })

  const [menuItems] = useState([
    {
      id: 1,
      itemCode: 'FD-001',
      itemName: 'Chicken Biryani',
      category: 'Main Course',
      subCategory: 'Pakistani',
      price: 850,
      cost: 400,
      profit: 450,
      profitMargin: 52.9,
      availability: 'Available',
      preparationTime: 45,
      ingredients: ['Basmati Rice', 'Chicken', 'Yogurt', 'Spices'],
      allergens: ['Dairy'],
      calories: 650,
      isVegetarian: false,
      isVegan: false,
      popularity: 95,
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      itemCode: 'FD-002',
      itemName: 'Margherita Pizza',
      category: 'Main Course',
      subCategory: 'Italian',
      price: 1200,
      cost: 500,
      profit: 700,
      profitMargin: 58.3,
      availability: 'Available',
      preparationTime: 25,
      ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Basil'],
      allergens: ['Gluten', 'Dairy'],
      calories: 750,
      isVegetarian: true,
      isVegan: false,
      popularity: 88,
      lastUpdated: '2024-01-18'
    },
    {
      id: 3,
      itemCode: 'DR-001',
      itemName: 'Fresh Orange Juice',
      category: 'Beverages',
      subCategory: 'Fresh Juices',
      price: 350,
      cost: 120,
      profit: 230,
      profitMargin: 65.7,
      availability: 'Available',
      preparationTime: 5,
      ingredients: ['Fresh Oranges'],
      allergens: [],
      calories: 120,
      isVegetarian: true,
      isVegan: true,
      popularity: 75,
      lastUpdated: '2024-01-20'
    },
    {
      id: 4,
      itemCode: 'FD-003',
      itemName: 'Chocolate Brownie',
      category: 'Desserts',
      subCategory: 'Cakes',
      price: 450,
      cost: 180,
      profit: 270,
      profitMargin: 60.0,
      availability: 'Out of Stock',
      preparationTime: 35,
      ingredients: ['Chocolate', 'Flour', 'Butter', 'Sugar', 'Eggs'],
      allergens: ['Gluten', 'Dairy', 'Eggs'],
      calories: 420,
      isVegetarian: true,
      isVegan: false,
      popularity: 82,
      lastUpdated: '2024-01-19'
    },
    {
      id: 5,
      itemCode: 'DR-002',
      itemName: 'Cappuccino',
      category: 'Beverages',
      subCategory: 'Coffee',
      price: 280,
      cost: 80,
      profit: 200,
      profitMargin: 71.4,
      availability: 'Available',
      preparationTime: 8,
      ingredients: ['Espresso', 'Steamed Milk', 'Milk Foam'],
      allergens: ['Dairy'],
      calories: 150,
      isVegetarian: true,
      isVegan: false,
      popularity: 90,
      lastUpdated: '2024-01-21'
    }
  ])

  const categories = ['All Categories', 'Main Course', 'Appetizers', 'Desserts', 'Beverages', 'Salads']
  const availabilityOptions = ['All', 'Available', 'Out of Stock', 'Limited']

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = filters.category === '' || filters.category === 'All Categories' || item.category === filters.category
    const matchesAvailability = filters.availability === '' || filters.availability === 'All' || item.availability === filters.availability
    
    let matchesPriceRange = true
    if (filters.priceRange.min || filters.priceRange.max) {
      const min = parseFloat(filters.priceRange.min) || 0
      const max = parseFloat(filters.priceRange.max) || Infinity
      matchesPriceRange = item.price >= min && item.price <= max
    }

    return matchesCategory && matchesAvailability && matchesPriceRange
  })

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'Available': return 'bg-green-100 text-green-800'
      case 'Out of Stock': return 'bg-red-100 text-red-800'
      case 'Limited': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Main Course': return 'bg-blue-100 text-blue-800'
      case 'Appetizers': return 'bg-orange-100 text-orange-800'
      case 'Desserts': return 'bg-pink-100 text-pink-800'
      case 'Beverages': return 'bg-green-100 text-green-800'
      case 'Salads': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const exportReport = () => {
    alert(`Exporting menu report with ${filteredItems.length} items...`)
  }

  const printReport = () => {
    window.print()
  }

  // Calculate statistics
  const totalItems = filteredItems.length
  const availableItems = filteredItems.filter(item => item.availability === 'Available').length
  const outOfStockItems = filteredItems.filter(item => item.availability === 'Out of Stock').length
  const averagePrice = totalItems > 0 ? filteredItems.reduce((sum, item) => sum + item.price, 0) / totalItems : 0
  const totalProfit = filteredItems.reduce((sum, item) => sum + item.profit, 0)
  const averageMargin = totalItems > 0 ? filteredItems.reduce((sum, item) => sum + item.profitMargin, 0) / totalItems : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Food & Drinks Menu Report</h1>
            <p className="text-orange-100">Comprehensive menu analysis with pricing and profitability</p>
          </div>
          <DocumentChartBarIcon className="h-12 w-12 text-orange-200" />
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
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {categories.map(category => (
                <option key={category} value={category === 'All Categories' ? '' : category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            <select
              value={filters.availability}
              onChange={(e) => setFilters({...filters, availability: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {availabilityOptions.map(option => (
                <option key={option} value={option === 'All' ? '' : option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
            <input
              type="number"
              value={filters.priceRange.min}
              onChange={(e) => setFilters({...filters, priceRange: {...filters.priceRange, min: e.target.value}})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
            <input
              type="number"
              value={filters.priceRange.max}
              onChange={(e) => setFilters({...filters, priceRange: {...filters.priceRange, max: e.target.value}})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="5000"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-lg p-3">
              <DocumentTextIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">{availableItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Price</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(averagePrice)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <DocumentChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Margin</p>
              <p className="text-2xl font-bold text-gray-900">{averageMargin.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Menu Items Report ({filteredItems.length} items)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profitability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                      <div className="text-sm text-gray-500">{item.itemCode}</div>
                      <div className="text-sm text-gray-500">{item.subCategory}</div>
                      <div className="flex space-x-2 mt-1">
                        {item.isVegetarian && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Veg
                          </span>
                        )}
                        {item.isVegan && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                            Vegan
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        Price: {formatCurrency(item.price)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Cost: {formatCurrency(item.cost)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.calories} cal • {item.preparationTime} min
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-green-600">
                        Profit: {formatCurrency(item.profit)}
                      </div>
                      <div className="text-sm text-green-600">
                        Margin: {item.profitMargin.toFixed(1)}%
                      </div>
                      <div className="text-sm text-blue-600">
                        Popularity: {item.popularity}%
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        Ingredients: {item.ingredients.slice(0, 2).join(', ')}
                        {item.ingredients.length > 2 && '...'}
                      </div>
                      {item.allergens.length > 0 && (
                        <div className="text-sm text-red-600">
                          Allergens: {item.allergens.join(', ')}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        Updated: {item.lastUpdated}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAvailabilityColor(item.availability)}`}>
                      {item.availability}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <DocumentChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No menu items found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      {filteredItems.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalProfit)}</div>
              <div className="text-sm text-gray-600">Total Profit Potential</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
              <div className="text-sm text-gray-600">Out of Stock Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalItems > 0 ? ((availableItems / totalItems) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-gray-600">Availability Rate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FoodDrinksMenuReport;
