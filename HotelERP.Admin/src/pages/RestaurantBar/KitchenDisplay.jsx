import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  FireIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  UserIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline'

const KitchenDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedStation, setSelectedStation] = useState('All')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedHotelId, setSelectedHotelId] = useState(() => {
    const v = localStorage.getItem('selectedHotelId')
    return v ? Number(v) : null
  })
  
  // API Data states
  const [orders, setOrders] = useState([])
  const [stations, setStations] = useState(['All'])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load data on component mount
  useEffect(() => {
    fetchKitchenData()
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    const dataInterval = setInterval(() => {
      fetchKitchenData() // Refresh every 30 seconds
    }, 30000)

    return () => {
      clearInterval(timeInterval)
      clearInterval(dataInterval)
    }
  }, [selectedHotelId])

  // Fetch kitchen orders and stations - PURE API CALLS
  const fetchKitchenData = async () => {
    try {
      setLoading(true)
      setError('')

      const hotelQuery = selectedHotelId ? `?hotelId=${selectedHotelId}` : ''
      
      const [ordersRes, stationsRes] = await Promise.all([
        axios.get(`/RestaurantBar/kitchen/orders${hotelQuery}`),
        // axios.get('/RestaurantBar/kitchen/stations') // Endpoint doesn't exist yet
        Promise.resolve({ data: { success: true, data: ['Grill', 'Cold Kitchen', 'Hot Kitchen', 'Dessert'] } }) // Mock stations
      ])
      
      console.log('🍳 Kitchen Orders API Response:', ordersRes.data)
      if (ordersRes.data?.success) {
        const orders = ordersRes.data.data || []
        console.log('🍳 Kitchen Orders Count:', orders.length)
        orders.forEach((o, idx) => {
          console.log(`🍳 Order ${idx + 1}:`, {
            id: o.id,
            orderNumber: o.orderNumber,
            tableName: o.tableName,
            guestName: o.guestName,
            itemsCount: o.items?.length || 0,
            items: o.items
          })
        })
        setOrders(orders)
      }
      if (stationsRes.data?.success) {
        setStations(['All', ...stationsRes.data.data])
      }
      
    } catch (err) {
      console.error('Error fetching kitchen data:', err)
      setError('Failed to load kitchen data')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const closeAndClearOrder = async (orderId) => {
    if (!window.confirm('Complete/Close this order and clear it from kitchen?')) return
    try {
      setError('')
      setSuccess('')
      await axios.put(`/RestaurantBar/restaurant-orders/${orderId}/status`, 'Closed', {
        headers: { 'Content-Type': 'application/json' }
      })
      setSuccess('Order closed and cleared')
      fetchKitchenData()
    } catch (err) {
      console.error('Error closing order:', err)
      setError(err.response?.data?.message || 'Failed to close order')
    }
  }

  // Update order status - PURE API CALL
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`/RestaurantBar/restaurant-orders/${orderId}/status`, newStatus, {
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.data?.success) {
        setSuccess(`Order ${newStatus.toLowerCase()} successfully`)
        fetchKitchenData() // Refresh data
      } else {
        setError('Failed to update order status')
      }
    } catch (err) {
      console.error('Error updating order status:', err)
      setError(err.response?.data?.message || 'Failed to update order status')
    }
  }

  // Update item status - PURE API CALL
  const updateItemStatus = async (orderId, itemId, newStatus) => {
    setError('Item status update is not configured yet')
  }

  // Calculate elapsed time
  const calculateElapsedTime = (orderTime) => {
    if (!orderTime) return 0
    const orderDate = new Date(orderTime)
    if (Number.isNaN(orderDate.getTime())) return 0
    const now = currentTime
    const diffInMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60))
    return Math.max(0, diffInMinutes)
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
      case 'Received':
      case 'Ordered':
        return 'bg-yellow-100 text-yellow-800'
      case 'Preparing': return 'bg-yellow-100 text-yellow-800'
      case 'Ready': return 'bg-green-100 text-green-800'
      case 'Served': return 'bg-blue-100 text-blue-800'
      case 'Completed':
      case 'Closed':
      case 'Paid':
        return 'bg-gray-100 text-gray-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'Pending':
      case 'Received':
        return 'bg-yellow-100 text-yellow-800'
      case 'Preparing':
        return 'bg-orange-100 text-orange-800'
      case 'Ready':
        return 'bg-green-100 text-green-800'
      case 'Served':
        return 'bg-blue-100 text-blue-800'
      case 'Completed':
      case 'Closed':
      case 'Paid':
        return 'bg-gray-100 text-gray-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Filter orders by station
  const filteredOrders = selectedStation === 'All' 
    ? orders 
    : orders.filter(order => 
        order.items?.some(item => item.station === selectedStation)
      )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-3 rounded-lg">
              <FireIcon className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kitchen Display System</h1>
              <p className="text-gray-600">Real-time order tracking and management</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-sm text-gray-600">
              {currentTime.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Station Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Station</label>
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {stations.map(station => (
                <option key={station} value={station}>{station}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-red-50 border-red-300 text-red-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-red-50 border-red-300 text-red-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              List
            </button>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Active Orders</div>
            <div className="text-2xl font-bold text-red-600">{filteredOrders.length}</div>
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-green-700">{success}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <span className="ml-2 text-gray-600">Loading kitchen orders...</span>
          </div>
        </div>
      )}

      {/* Orders */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center text-gray-500">
                <FireIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No active orders for {selectedStation === 'All' ? 'kitchen' : selectedStation}</p>
              </div>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const elapsedTime = calculateElapsedTime(order.orderTime)
              const isOverdue = elapsedTime > order.estimatedTime
              
              return (
                <div key={order.id} className={`bg-white rounded-xl shadow-sm border-2 ${
                  isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200'
                } overflow-hidden`}>
                  {/* Order Header */}
                  <div className={`p-4 border-b ${isOverdue ? 'bg-red-100' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{order.orderNumber}</h3>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(order.orderTime).toLocaleDateString()} {new Date(order.orderTime).toLocaleTimeString()}
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                          getPriorityColor(order.priority)
                        }`}>
                          {order.priority}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getOrderStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{order.tableName}</div>
                        <div className="text-xs text-gray-500 flex items-center justify-end">
                          <UserIcon className="h-3 w-3 mr-1" />
                          {order.guestName}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm">
                          <span className="text-gray-600">Elapsed:</span>
                          <span className={`ml-1 font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                            {elapsedTime}m
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Est:</span>
                          <span className="ml-1 font-medium text-gray-900">{order.estimatedTime}m</span>
                        </div>
                      </div>
                      
                      {isOverdue && (
                        <div className="flex items-center text-red-600">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          <span className="text-xs font-medium">OVERDUE</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 space-y-3">
                    {(!order.items || order.items.length === 0) ? (
                      <div className="text-center text-gray-500 py-4">
                        <p className="text-sm">No items in this order</p>
                      </div>
                    ) : (
                      order.items.filter(item => 
                        selectedStation === 'All' || item.station === selectedStation
                      ).map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-900">{item.name || 'Unknown Item'}</span>
                              <span className="text-sm text-gray-500">x{item.quantity || 0}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                {item.station || 'Kitchen'}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                                {item.status || 'Pending'}
                              </span>
                              {item.specialInstructions && (
                                <span className="text-xs text-gray-600 italic">
                                  Note: {item.specialInstructions}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Order Actions */}
                  <div className="p-4 border-t bg-gray-50">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => closeAndClearOrder(order.id)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Complete/Clear
                      </button>
                      {order.status === 'Preparing' && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Ready')}
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 transition-colors"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                            <span>Mark Ready</span>
                          </button>
                          
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                            className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      
                      {order.status === 'Ready' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Served')}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 transition-colors"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                          <span>Mark Served</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table/Guest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timing</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td className="px-6 py-8 text-center text-gray-500" colSpan={5}>
                      No active orders
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const elapsedTime = calculateElapsedTime(order.orderTime)
                    const isOverdue = elapsedTime > order.estimatedTime
                    return (
                      <tr key={order.id} className={isOverdue ? 'bg-red-50' : ''}>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{order.orderNumber}</div>
                          <div className="text-xs text-gray-500">{order.priority}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{order.tableName}</div>
                          <div className="text-xs text-gray-500">{order.guestName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOrderStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                            {elapsedTime}m / {order.estimatedTime}m
                          </div>
                          {isOverdue && (
                            <div className="text-xs text-red-600 flex items-center mt-1">
                              <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                              Overdue
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {order.status === 'Preparing' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'Ready')}
                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                              >
                                Ready
                              </button>
                            )}
                            {order.status === 'Ready' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'Served')}
                                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                              >
                                Served
                              </button>
                            )}
                            <button
                              onClick={() => closeAndClearOrder(order.id)}
                              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                            >
                              Complete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default KitchenDisplay;
