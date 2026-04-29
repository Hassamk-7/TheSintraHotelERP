import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  ExclamationTriangleIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CubeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const StockAlerts = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [alertFilter, setAlertFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      itemName: 'Basmati Rice',
      itemCode: 'RICE001',
      currentStock: 15,
      reorderLevel: 50,
      maxStock: 500,
      alertType: 'Low Stock',
      priority: 'High',
      category: 'Food & Beverage',
      supplier: 'Metro Cash & Carry',
      lastRestocked: '2024-01-10',
      estimatedDaysLeft: 3,
      status: 'Active',
      createdAt: '2024-01-15 09:30'
    },
    {
      id: 2,
      itemName: 'Toilet Paper',
      itemCode: 'TP001',
      currentStock: 25,
      reorderLevel: 100,
      maxStock: 1000,
      alertType: 'Low Stock',
      priority: 'Medium',
      category: 'Housekeeping',
      supplier: 'Unilever Pakistan',
      lastRestocked: '2024-01-12',
      estimatedDaysLeft: 5,
      status: 'Active',
      createdAt: '2024-01-15 10:15'
    },
    {
      id: 3,
      itemName: 'Cooking Oil',
      itemCode: 'OIL001',
      currentStock: 5,
      reorderLevel: 15,
      maxStock: 50,
      alertType: 'Critical Stock',
      priority: 'Critical',
      category: 'Food & Beverage',
      supplier: 'Gourmet Foods Ltd',
      lastRestocked: '2024-01-08',
      estimatedDaysLeft: 1,
      status: 'Active',
      createdAt: '2024-01-15 11:00'
    },
    {
      id: 4,
      itemName: 'Bed Sheets',
      itemCode: 'BS001',
      currentStock: 20,
      reorderLevel: 75,
      maxStock: 200,
      alertType: 'Low Stock',
      priority: 'Medium',
      category: 'Housekeeping',
      supplier: 'Pak Textiles',
      lastRestocked: '2024-01-11',
      estimatedDaysLeft: 7,
      status: 'Active',
      createdAt: '2024-01-15 12:30'
    },
    {
      id: 5,
      itemName: 'Detergent Powder',
      itemCode: 'DET001',
      currentStock: 8,
      reorderLevel: 30,
      maxStock: 100,
      alertType: 'Low Stock',
      priority: 'High',
      category: 'Laundry',
      supplier: 'Unilever Pakistan',
      lastRestocked: '2024-01-09',
      estimatedDaysLeft: 2,
      status: 'Active',
      createdAt: '2024-01-15 13:45'
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load stock alerts on component mount
  useEffect(() => {
    fetchStockAlerts()
  }, [])

  // Fetch stock alerts from API - PURE API CALL
  const fetchStockAlerts = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/StockAlerts')
      
      if (response.data && response.data.success) {
        setAlerts(response.data.data)
      } else {
        setError('No stock alerts data received')
        setAlerts([])
      }
    } catch (err) {
      console.error('Error fetching stock alerts:', err)
      setError(err.response?.data?.message || 'Failed to load stock alerts')
      setAlerts([])
    } finally {
      setLoading(false)
    }
  }

  // Resolve alert - PURE API CALL
  const handleResolveAlert = async (alertId) => {
    try {
      setLoading(true)
      const response = await axios.put(`/StockAlerts/${alertId}/resolve`, { resolvedBy: 'Current User' })
      
      if (response.data && response.data.success) {
        setSuccess('Alert resolved successfully')
        fetchStockAlerts() // Refresh the list
      } else {
        setError('Failed to resolve alert')
      }
    } catch (err) {
      console.error('Error resolving alert:', err)
      setError(err.response?.data?.message || 'Failed to resolve alert')
    } finally {
      setLoading(false)
    }
  }

  // Dismiss alert - PURE API CALL
  const handleDismissAlert = async (alertId) => {
    try {
      setLoading(true)
      const response = await axios.put(`/StockAlerts/${alertId}`, { status: 'Ignored' })
      
      if (response.data && response.data.success) {
        setSuccess('Alert dismissed successfully')
        fetchStockAlerts() // Refresh the list
      } else {
        setError('Failed to dismiss alert')
      }
    } catch (err) {
      console.error('Error dismissing alert:', err)
      setError(err.response?.data?.message || 'Failed to dismiss alert')
    } finally {
      setLoading(false)
    }
  }

  // Filter alerts based on search and filters
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.category?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAlert = alertFilter === '' || alert.alertType === alertFilter
    const matchesPriority = priorityFilter === '' || alert.priority === priorityFilter
    return matchesSearch && matchesAlert && matchesPriority
  })

  // Get alert type color
  const getAlertTypeColor = (type) => {
    switch (type) {
      case 'Out of Stock': return 'bg-red-100 text-red-800 border-red-200'
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Overstock': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Expired': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500 text-white'
      case 'High': return 'bg-orange-500 text-white'
      case 'Medium': return 'bg-yellow-500 text-white'
      case 'Low': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-red-100 text-red-800'
      case 'Resolved': return 'bg-green-100 text-green-800'
      case 'Dismissed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Calculate statistics
  const activeAlerts = alerts.filter(alert => alert.status === 'Active').length
  const criticalAlerts = alerts.filter(alert => alert.priority === 'Critical' && alert.status === 'Active').length
  const outOfStockItems = alerts.filter(alert => alert.alertType === 'Out of Stock' && alert.status === 'Active').length
  const lowStockItems = alerts.filter(alert => alert.alertType === 'Low Stock' && alert.status === 'Active').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Stock Alerts</h1>
            <p className="text-red-100">Monitor inventory levels and receive automated alerts</p>
          </div>
          <BellIcon className="h-12 w-12 text-red-200" />
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

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <BellIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{activeAlerts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{criticalAlerts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <CubeIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{outOfStockItems}</p>
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
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Search items, suppliers..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alert Type</label>
            <select
              value={alertFilter}
              onChange={(e) => setAlertFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Overstock">Overstock</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Stock Alerts ({filteredAlerts.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading alerts...</p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <BellIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No stock alerts found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{alert.itemName}</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getAlertTypeColor(alert.alertType)}`}>
                        {alert.alertType}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(alert.priority)}`}>
                        {alert.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Current Stock:</span> {alert.currentStock}
                      </div>
                      <div>
                        <span className="font-medium">Minimum Level:</span> {alert.minimumLevel}
                      </div>
                      <div>
                        <span className="font-medium">Supplier:</span> {alert.supplier}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {alert.location}
                      </div>
                    </div>
                    {alert.message && (
                      <p className="text-sm text-gray-700 mt-2">{alert.message}</p>
                    )}
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      Last updated: {alert.lastUpdated}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    {alert.status === 'Active' && (
                      <>
                        <button
                          onClick={() => handleResolveAlert(alert.id)}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                          disabled={loading}
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => handleDismissAlert(alert.id)}
                          className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                          disabled={loading}
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StockAlerts;
