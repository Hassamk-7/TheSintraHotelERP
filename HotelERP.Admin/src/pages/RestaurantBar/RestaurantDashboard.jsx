import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

const RestaurantDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedHotelId, setSelectedHotelId] = useState(() => {
    const v = localStorage.getItem('selectedHotelId')
    return v ? Number(v) : null
  })

  // API Data states
  const [tables, setTables] = useState([])
  const [reservations, setReservations] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load dashboard data on component mount
  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [selectedDate])

  // Fetch all dashboard data - PURE API CALLS
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const hotelParam = selectedHotelId ? `?hotelId=${selectedHotelId}` : ''
      const ordersUrl = selectedHotelId
        ? `/RestaurantBar/restaurant-orders?hotelId=${selectedHotelId}&page=1&pageSize=5`
        : `/RestaurantBar/restaurant-orders?page=1&pageSize=5`
      
      const [tablesRes, reservationsRes, ordersRes] = await Promise.all([
        axios.get(`/tables${hotelParam}`),
        axios.get(`/RestaurantBar/table-reservations${hotelParam}`),
        axios.get(ordersUrl)
      ])
      
      if (tablesRes.data?.success) setTables(tablesRes.data.data)
      if (reservationsRes.data?.success) setReservations(reservationsRes.data.data || [])
      if (ordersRes.data?.success) setRecentOrders(ordersRes.data.data)
      
    } catch (err) {
      console.error('Dashboard load error:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleClearReservation = async (reservationId) => {
    try {
      setError(null)
      await axios.delete(`/RestaurantBar/table-reservations/${reservationId}`)
      await loadDashboardData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear reservation')
    }
  }

  // Calculate dashboard statistics
  const stats = {
    totalTables: tables.length,
    availableTables: tables.filter(t => t.status === 'Available').length,
    occupiedTables: tables.filter(t => t.status === 'Occupied').length,
    totalReservations: reservations.length,
    confirmedReservations: reservations.filter(r => r.status === 'Confirmed').length,
    totalOrders: recentOrders.length,
    completedOrders: recentOrders.filter(o => o.status === 'Completed').length,
    totalRevenue: recentOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <ChartBarIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Restaurant Dashboard</h1>
              <p className="text-gray-600">Real-time restaurant operations overview</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <div className="text-sm text-gray-600">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <span className="ml-2 text-gray-600">Loading dashboard data...</span>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tables</p>
              <p className="text-2xl font-bold text-gray-900">{stats.availableTables}/{stats.totalTables}</p>
              <p className="text-xs text-gray-500">Available/Total</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reservations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.confirmedReservations}/{stats.totalReservations}</p>
              <p className="text-xs text-gray-500">Confirmed/Total</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}/{stats.totalOrders}</p>
              <p className="text-xs text-gray-500">Completed/Total</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">Rs {stats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Today's Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tables and Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Table Status</h3>
          </div>
          <div className="p-6">
            {tables.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tables data available</p>
            ) : (
              <div className="space-y-3">
                {tables.map((table) => (
                  <div key={table.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Table {table.tableNumber}</p>
                      <p className="text-sm text-gray-500">{table.location} • {table.capacity} seats</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      table.status === 'Available' ? 'bg-green-100 text-green-800' :
                      table.status === 'Occupied' ? 'bg-red-100 text-red-800' :
                      table.status === 'Reserved' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {table.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
          </div>
          <div className="p-6">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No orders data available</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{order.tableName} • {order.guestName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">Rs {order.totalAmount?.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Pending' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reservations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Today's Reservations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No reservations for selected date
                  </td>
                </tr>
              ) : (
                reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{reservation.guestName}</div>
                        <div className="text-sm text-gray-500">{reservation.guestPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.tableName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.reservationTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.numberOfGuests}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        reservation.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        reservation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleClearReservation(reservation.id)}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700"
                      >
                        Clear/Checkout
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDashboard;
