import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { ChartBarIcon, PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const Inventory = () => {
  const { data: items, isLoading } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const response = await axios.get('/inventory/items')
      return response.data.data
    }
  })

  const { data: categories } = useQuery({
    queryKey: ['inventory-categories'],
    queryFn: async () => {
      const response = await axios.get('/inventory/categories')
      return response.data.data
    }
  })

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const getStockStatus = (item) => {
    if (item.stockQuantity <= 0) {
      return { color: 'text-red-600', status: 'Out of Stock' }
    } else if (item.stockQuantity <= item.reorderLevel) {
      return { color: 'text-yellow-600', status: 'Low Stock' }
    }
    return { color: 'text-green-600', status: 'In Stock' }
  }

  const lowStockItems = items?.filter(item => item.stockQuantity <= item.reorderLevel) || []

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your hotel inventory and stock levels
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Categories
          </button>
          <button className="btn-primary flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Item
          </button>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Low Stock Alert
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  {lowStockItems.length} items are running low on stock and need to be restocked.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Summary */}
      {categories && categories.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {categories.slice(0, 4).map((category) => (
            <div key={category.id} className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
              <p className="text-2xl font-semibold text-primary-600 mt-1">
                {items?.filter(item => item.categoryId === category.id).length || 0}
              </p>
              <p className="text-xs text-gray-500">items</p>
            </div>
          ))}
        </div>
      )}

      {items && items.length > 0 ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => {
                    const stockStatus = getStockStatus(item)
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                            {item.description && (
                              <div className="text-sm text-gray-500">
                                {item.description.substring(0, 50)}...
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.category?.name || 'Uncategorized'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {item.stockQuantity} {item.unitOfMeasure || 'units'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Reorder at: {item.reorderLevel}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${item.costPrice || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${stockStatus.color}`}>
                            {stockStatus.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-primary-600 hover:text-primary-900">
                              Edit
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              Adjust Stock
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No inventory items</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first inventory item.
          </p>
          <div className="mt-6">
            <button className="btn-primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Item
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inventory;
