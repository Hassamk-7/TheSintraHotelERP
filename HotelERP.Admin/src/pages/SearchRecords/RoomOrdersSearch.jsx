import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  HomeIcon,
  FunnelIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  UserIcon,
  CreditCardIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const RoomOrdersSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roomFilter, setRoomFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [serviceTypeFilter, setServiceTypeFilter] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [amountRange, setAmountRange] = useState({ min: '', max: '' })

  const [roomOrders] = useState([
    {
      id: 1,
      orderNumber: 'RO-2024-001',
      roomNumber: '101',
      guestName: 'Ahmed Hassan',
      guestId: 'GST-001',
      orderDate: '2024-01-16',
      orderTime: '20:30',
      serviceType: 'Room Service',
      items: [
        { name: 'Chicken Karahi', quantity: 2, rate: 1200, amount: 2400 },
        { name: 'Naan', quantity: 4, rate: 80, amount: 320 },
        { name: 'Cold Drinks', quantity: 2, rate: 150, amount: 300 }
      ],
      subtotal: 3020,
      serviceCharge: 151,
      tax: 241.6,
      deliveryCharge: 200,
      totalAmount: 3612.6,
      paymentMethod: 'Room Charge',
      paymentStatus: 'Charged to Room',
      status: 'Delivered',
      orderTakenBy: 'Front Desk',
      deliveredBy: 'Room Service Staff',
      deliveryTime: '21:15',
      specialInstructions: 'Extra spicy, no onions',
      estimatedTime: 45
    },
    {
      id: 2,
      orderNumber: 'RO-2024-002',
      roomNumber: '205',
      guestName: 'Sarah Johnson',
      guestId: 'GST-002',
      orderDate: '2024-01-16',
      orderTime: '19:45',
      serviceType: 'Room Service',
      items: [
        { name: 'Caesar Salad', quantity: 1, rate: 800, amount: 800 },
        { name: 'Grilled Salmon', quantity: 1, rate: 2500, amount: 2500 },
        { name: 'Wine', quantity: 1, rate: 3000, amount: 3000 }
      ],
      subtotal: 6300,
      serviceCharge: 315,
      tax: 529.2,
      deliveryCharge: 200,
      totalAmount: 7344.2,
      paymentMethod: 'Room Charge',
      paymentStatus: 'Charged to Room',
      status: 'Delivered',
      orderTakenBy: 'Room Service',
      deliveredBy: 'Room Service Staff',
      deliveryTime: '20:30',
      specialInstructions: 'Medium rare salmon',
      estimatedTime: 45
    },
    {
      id: 3,
      orderNumber: 'RO-2024-003',
      roomNumber: '301',
      guestName: 'Ali Khan',
      guestId: 'GST-003',
      orderDate: '2024-01-16',
      orderTime: '22:00',
      serviceType: 'Laundry',
      items: [
        { name: 'Shirt Wash & Iron', quantity: 3, rate: 150, amount: 450 },
        { name: 'Trouser Wash & Iron', quantity: 2, rate: 200, amount: 400 },
        { name: 'Express Service', quantity: 1, rate: 300, amount: 300 }
      ],
      subtotal: 1150,
      serviceCharge: 57.5,
      tax: 96.6,
      deliveryCharge: 0,
      totalAmount: 1304.1,
      paymentMethod: 'Room Charge',
      paymentStatus: 'Charged to Room',
      status: 'In Progress',
      orderTakenBy: 'Housekeeping',
      deliveredBy: null,
      deliveryTime: null,
      specialInstructions: 'Ready by tomorrow morning',
      estimatedTime: 720
    },
    {
      id: 4,
      orderNumber: 'RO-2024-004',
      roomNumber: '102',
      guestName: 'Emma Wilson',
      guestId: 'GST-004',
      orderDate: '2024-01-16',
      orderTime: '08:30',
      serviceType: 'Room Service',
      items: [
        { name: 'Continental Breakfast', quantity: 2, rate: 800, amount: 1600 },
        { name: 'Fresh Orange Juice', quantity: 2, rate: 250, amount: 500 },
        { name: 'Coffee', quantity: 2, rate: 150, amount: 300 }
      ],
      subtotal: 2400,
      serviceCharge: 120,
      tax: 201.6,
      deliveryCharge: 200,
      totalAmount: 2921.6,
      paymentMethod: 'Room Charge',
      paymentStatus: 'Charged to Room',
      status: 'Delivered',
      orderTakenBy: 'Room Service',
      deliveredBy: 'Room Service Staff',
      deliveryTime: '09:00',
      specialInstructions: 'Baby high chair needed',
      estimatedTime: 30
    },
    {
      id: 5,
      orderNumber: 'RO-2024-005',
      roomNumber: '203',
      guestName: 'Muhammad Usman',
      guestId: 'GST-005',
      orderDate: '2024-01-16',
      orderTime: '18:15',
      serviceType: 'Maintenance',
      items: [
        { name: 'AC Repair', quantity: 1, rate: 1500, amount: 1500 },
        { name: 'Service Call', quantity: 1, rate: 500, amount: 500 }
      ],
      subtotal: 2000,
      serviceCharge: 100,
      tax: 168,
      deliveryCharge: 0,
      totalAmount: 2268,
      paymentMethod: 'Room Charge',
      paymentStatus: 'Charged to Room',
      status: 'Completed',
      orderTakenBy: 'Front Desk',
      deliveredBy: 'Maintenance Staff',
      deliveryTime: '19:30',
      specialInstructions: 'Check cooling efficiency',
      estimatedTime: 60
    }
  ])

  const rooms = ['101', '102', '203', '205', '301']
  const statuses = ['Delivered', 'In Progress', 'Completed', 'Cancelled', 'Pending']
  const serviceTypes = ['Room Service', 'Laundry', 'Maintenance', 'Housekeeping', 'Concierge']

  const filteredOrders = roomOrders.filter(order => {
    const matchesSearch = order.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.roomNumber.includes(searchTerm) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesRoom = roomFilter === '' || order.roomNumber === roomFilter
    const matchesStatus = statusFilter === '' || order.status === statusFilter
    const matchesServiceType = serviceTypeFilter === '' || order.serviceType === serviceTypeFilter
    
    let matchesDateRange = true
    if (dateRange.start && dateRange.end) {
      const orderDate = new Date(order.orderDate)
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      matchesDateRange = orderDate >= startDate && orderDate <= endDate
    }
    
    let matchesAmountRange = true
    if (amountRange.min || amountRange.max) {
      const min = parseFloat(amountRange.min) || 0
      const max = parseFloat(amountRange.max) || Infinity
      matchesAmountRange = order.totalAmount >= min && order.totalAmount <= max
    }
    
    return matchesSearch && matchesRoom && matchesStatus && matchesServiceType && matchesDateRange && matchesAmountRange
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800'
      case 'Completed': return 'bg-blue-100 text-blue-800'
      case 'In Progress': return 'bg-yellow-100 text-yellow-800'
      case 'Pending': return 'bg-orange-100 text-orange-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getServiceTypeColor = (serviceType) => {
    switch (serviceType) {
      case 'Room Service': return 'bg-blue-100 text-blue-800'
      case 'Laundry': return 'bg-purple-100 text-purple-800'
      case 'Maintenance': return 'bg-orange-100 text-orange-800'
      case 'Housekeeping': return 'bg-green-100 text-green-800'
      case 'Concierge': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'Charged to Room': return 'bg-green-100 text-green-800'
      case 'Paid': return 'bg-blue-100 text-blue-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const exportResults = () => {
    alert(`Exporting ${filteredOrders.length} room order records...`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setRoomFilter('')
    setStatusFilter('')
    setServiceTypeFilter('')
    setDateRange({ start: '', end: '' })
    setAmountRange({ min: '', max: '' })
  }

  // Calculate statistics
  const totalRecords = filteredOrders.length
  const deliveredOrders = filteredOrders.filter(o => o.status === 'Delivered' || o.status === 'Completed').length
  const inProgressOrders = filteredOrders.filter(o => o.status === 'In Progress').length
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  const avgOrderValue = totalRecords > 0 ? totalRevenue / totalRecords : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Room Orders Search</h1>
            <p className="text-indigo-100">Search and track room service orders and guest requests</p>
          </div>
          <HomeIcon className="h-12 w-12 text-indigo-200" />
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Search Filters
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
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Export Results
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Rooms</option>
            {rooms.map(room => (
              <option key={room} value={room}>Room {room}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={serviceTypeFilter}
            onChange={(e) => setServiceTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Service Types</option>
            {serviceTypes.map(type => (
              <option key={type} value={type}>{type}</option>
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
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="date"
              placeholder="To Date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Amount"
              value={amountRange.min}
              onChange={(e) => setAmountRange({...amountRange, min: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              placeholder="Max Amount"
              value={amountRange.max}
              onChange={(e) => setAmountRange({...amountRange, max: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-indigo-100 rounded-lg p-3">
              <HomeIcon className="h-6 w-6 text-indigo-600" />
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
              <CreditCardIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Orders</p>
              <p className="text-2xl font-bold text-gray-900">{deliveredOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <DocumentTextIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgOrderValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Room Order Records</h3>
            <p className="text-gray-600">Found {filteredOrders.length} room orders</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <HomeIcon className="h-4 w-4 mr-1" />
              Total: {roomOrders.length}
            </div>
            <div className="flex items-center">
              <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
              Filtered: {filteredOrders.length}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order & Guest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room & Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items Ordered</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Breakdown</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-indigo-100 rounded-full p-2 mr-3">
                        <UserIcon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                        <div className="text-sm text-gray-900">{order.guestName}</div>
                        <div className="text-sm text-gray-500">{order.guestId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <HomeIcon className="h-4 w-4 text-gray-400 mr-2" />
                        Room {order.roomNumber}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getServiceTypeColor(order.serviceType)}`}>
                        {order.serviceType}
                      </span>
                      <div className="text-sm text-gray-500">
                        By: {order.orderTakenBy}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="text-sm text-gray-900">
                          {item.quantity}x {item.name} - {formatCurrency(item.amount)}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{order.items.length - 3} more items
                        </div>
                      )}
                      {order.specialInstructions && (
                        <div className="text-sm text-blue-600">
                          Note: {order.specialInstructions}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">Subtotal: {formatCurrency(order.subtotal)}</div>
                      <div className="text-sm text-gray-500">Service: {formatCurrency(order.serviceCharge)}</div>
                      <div className="text-sm text-gray-500">Tax: {formatCurrency(order.tax)}</div>
                      {order.deliveryCharge > 0 && (
                        <div className="text-sm text-gray-500">Delivery: {formatCurrency(order.deliveryCharge)}</div>
                      )}
                      <div className="text-sm font-medium text-gray-900 border-t pt-1">
                        Total: {formatCurrency(order.totalAmount)}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {order.orderDate} {order.orderTime}
                      </div>
                      {order.deliveryTime ? (
                        <div className="text-sm text-green-600">
                          Delivered: {order.deliveryTime}
                        </div>
                      ) : (
                        <div className="text-sm text-yellow-600">
                          ETA: {order.estimatedTime} mins
                        </div>
                      )}
                      {order.deliveredBy && (
                        <div className="text-sm text-gray-500">
                          By: {order.deliveredBy}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <HomeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No room orders found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search criteria or date range.
            </p>
          </div>
        )}
      </div>

      {/* Service Type Breakdown */}
      {filteredOrders.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders by Service Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceTypes.map(serviceType => {
              const serviceOrders = filteredOrders.filter(order => order.serviceType === serviceType)
              const serviceRevenue = serviceOrders.reduce((sum, order) => sum + order.totalAmount, 0)
              
              if (serviceOrders.length === 0) return null
              
              return (
                <div key={serviceType} className="text-center">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getServiceTypeColor(serviceType)}`}>
                    {serviceType}
                  </span>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(serviceRevenue)}</div>
                    <div className="text-sm text-gray-500">{serviceOrders.length} orders</div>
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

export default RoomOrdersSearch;
