import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  SparklesIcon,
  FunnelIcon,
  DocumentTextIcon,
  PrinterIcon,
  ClockIcon,
  UserIcon,
  CurrencyDollarIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

const LaundryBillingReport = () => {
  const [filters, setFilters] = useState({
    serviceType: '',
    status: '',
    priority: '',
    dateRange: { start: '', end: '' }
  })

  const [laundryBills, setLaundryBills] = useState([
    {
      id: 1,
      billNumber: 'LB001',
      guestName: 'Ahmed Ali',
      roomNumber: '205',
      serviceType: 'Dry Cleaning',
      items: [
        { name: 'Suit (2-piece)', quantity: 1, rate: 800, amount: 800 },
        { name: 'Shirt', quantity: 3, rate: 150, amount: 450 }
      ],
      totalItems: 4,
      subtotal: 1250,
      tax: 212.5,
      serviceCharge: 125,
      totalAmount: 1587.5,
      status: 'Completed',
      priority: 'Normal',
      pickupDate: '2024-01-15',
      deliveryDate: '2024-01-16',
      pickupTime: '10:30',
      deliveryTime: '18:00',
      assignedTo: 'Laundry Team A'
    },
    {
      id: 2,
      billNumber: 'LB002',
      guestName: 'Sarah Khan',
      roomNumber: '301',
      serviceType: 'Washing & Ironing',
      items: [
        { name: 'Casual Shirt', quantity: 2, rate: 100, amount: 200 },
        { name: 'Trousers', quantity: 2, rate: 120, amount: 240 },
        { name: 'Dress', quantity: 1, rate: 200, amount: 200 }
      ],
      totalItems: 5,
      subtotal: 640,
      tax: 108.8,
      serviceCharge: 64,
      totalAmount: 812.8,
      status: 'In Progress',
      priority: 'Urgent',
      pickupDate: '2024-01-15',
      deliveryDate: '2024-01-16',
      pickupTime: '14:00',
      deliveryTime: '20:00',
      assignedTo: 'Laundry Team B'
    },
    {
      id: 3,
      billNumber: 'LB003',
      guestName: 'John Smith',
      roomNumber: '102',
      serviceType: 'Express Service',
      items: [
        { name: 'Business Suit', quantity: 1, rate: 1000, amount: 1000 },
        { name: 'Tie', quantity: 2, rate: 50, amount: 100 }
      ],
      totalItems: 3,
      subtotal: 1100,
      tax: 187,
      serviceCharge: 220,
      totalAmount: 1507,
      status: 'Pending',
      priority: 'Express',
      pickupDate: '2024-01-16',
      deliveryDate: '2024-01-16',
      pickupTime: '09:00',
      deliveryTime: '15:00',
      assignedTo: 'Express Team'
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [hotelInfo, setHotelInfo] = useState({
    name: 'Grand Palace Hotel',
    address: 'Main Boulevard, Gulberg III, Lahore',
    phone: '+92-42-1234567',
    email: 'info@grandpalace.pk',
    website: 'www.grandpalace.pk',
    logo: '/hotel-logo.png'
  })

  // Load data on component mount
  useEffect(() => {
    // API calls disabled to show mock data
    console.log('LaundryBillingReport component loaded with mock data:', laundryBills.length, 'bills')
  }, [])

  // Fetch laundry bills - PURE API CALL
  const fetchLaundryBills = async () => {
    try {
      setLoading(true)
      setError('')
      const params = new URLSearchParams()
      if (filters.dateRange.start) params.append('dateFrom', filters.dateRange.start)
      if (filters.dateRange.end) params.append('dateTo', filters.dateRange.end)
      if (filters.serviceType) params.append('serviceType', filters.serviceType)
      if (filters.status) params.append('status', filters.status)
      if (filters.priority) params.append('priority', filters.priority)

      const response = await axios.get(`/api/Reports/laundry-billing?${params}`)

      if (response.data?.success) {
        setLaundryBills(response.data.data)
      } else {
        setError('No laundry billing data received')
        setLaundryBills([])
      }
    } catch (err) {
      console.error('Error fetching laundry bills:', err)
      setError(err.response?.data?.message || 'Failed to load laundry billing data')
      setLaundryBills([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch hotel information - PURE API CALL
  const fetchHotelInfo = async () => {
    try {
      const response = await axios.get('/api/Settings/hotel-info')
      if (response.data?.success) {
        setHotelInfo(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching hotel info:', err)
    }
  }

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.')
      setFilters(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFilters(prev => ({
        ...prev,
        [key]: value
      }))
    }
  }

  // Clear filters
  const clearFilters = () => {
    setFilters({
      serviceType: '',
      status: '',
      priority: '',
      dateRange: { start: '', end: '' }
    })
  }

  // Print report
  const handlePrint = () => {
    window.print()
  }

  // Export to CSV
  const handleExport = () => {
    const headers = ['Bill ID', 'Date', 'Guest Name', 'Room', 'Service Type', 'Priority', 'Items', 'Total Amount', 'Status']
    const csvData = laundryBills.map(bill => [
      bill.billId,
      bill.date,
      bill.guestName,
      bill.roomNumber,
      bill.serviceType,
      bill.priority,
      bill.items?.length || 0,
      bill.totalAmount,
      bill.status
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `laundry-billing-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Calculate summary statistics
  const totalBills = laundryBills.length
  const totalRevenue = laundryBills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0)
  const completedBills = laundryBills.filter(bill => bill.status === 'Completed').length
  const pendingBills = laundryBills.filter(bill => bill.status === 'Pending').length

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Express': return 'bg-red-100 text-red-800'
      case 'Regular': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-white print:bg-white print:text-black print:border print:border-gray-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Laundry Billing Report</h1>
            <p className="text-purple-100 print:text-gray-600">Comprehensive laundry service billing analysis</p>
          </div>
          <div className="flex items-center space-x-4">
            <SparklesIcon className="h-12 w-12 text-purple-200" />
            <div className="print:hidden">
              <button
                onClick={handlePrint}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 flex items-center space-x-2 transition-colors mr-2"
              >
                <PrinterIcon className="h-5 w-5" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 print:hidden">
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 print:hidden">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-green-700">{success}</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
            <select
              value={filters.serviceType}
              onChange={(e) => handleFilterChange('serviceType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="Wash & Iron">Wash & Iron</option>
              <option value="Dry Clean">Dry Clean</option>
              <option value="Iron Only">Iron Only</option>
              <option value="Wash Only">Wash Only</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Priorities</option>
              <option value="Regular">Regular</option>
              <option value="Express">Express</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleFilterChange('dateRange.start', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleFilterChange('dateRange.end', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={clearFilters}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Clear Filters
          </button>
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 transition-colors"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 print:mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <DocumentTextIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bills</p>
              <p className="text-2xl font-bold text-gray-900">{totalBills}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">Rs {totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedBills}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingBills}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hotel Info for Print */}
      {hotelInfo && (
        <div className="hidden print:block text-center mb-6">
          <h2 className="text-xl font-bold">{hotelInfo.name}</h2>
          <p className="text-gray-600">{hotelInfo.address}</p>
          <p className="text-gray-600">Phone: {hotelInfo.phone} | Email: {hotelInfo.email}</p>
          <hr className="my-4" />
        </div>
      )}

      {/* Laundry Bills Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Laundry Billing Details ({laundryBills.length} bills)
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading laundry bills...</p>
          </div>
        ) : laundryBills.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <SparklesIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No laundry bills found for the selected criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {laundryBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{bill.billId}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {bill.date}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-purple-100 p-2 rounded-full mr-3">
                          <UserIcon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{bill.guestName}</div>
                          <div className="text-sm text-gray-500">Room {bill.roomNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{bill.serviceType}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(bill.priority)}`}>
                          {bill.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {bill.items?.length || 0} items
                      </div>
                      <div className="text-sm text-gray-500">
                        {bill.items?.map(item => `${item.quantity} ${item.type}`).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Rs {bill.totalAmount?.toLocaleString()}
                      </div>
                      {bill.expressCharge > 0 && (
                        <div className="text-sm text-red-600">
                          +Rs {bill.expressCharge} (Express)
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bill.status)}`}>
                        {bill.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Print Footer */}
      <div className="hidden print:block text-center text-sm text-gray-500 mt-8">
        <p>Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
        <p>This is a computer-generated report</p>
      </div>
    </div>
  )
}

export default LaundryBillingReport;
