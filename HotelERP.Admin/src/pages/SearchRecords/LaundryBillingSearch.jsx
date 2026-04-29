import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  SparklesIcon,
  FunnelIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  UserIcon,
  CreditCardIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const LaundryBillingSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [serviceTypeFilter, setServiceTypeFilter] = useState('')
  const [customerTypeFilter, setCustomerTypeFilter] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [amountRange, setAmountRange] = useState({ min: '', max: '' })

  const [laundryRecords] = useState([
    {
      id: 1,
      billNumber: 'LB-2024-001',
      customerName: 'Ahmed Hassan',
      customerType: 'Room Guest',
      roomNumber: '101',
      serviceDate: '2024-01-16',
      collectionDate: '2024-01-16',
      deliveryDate: '2024-01-17',
      items: [
        { type: 'Shirt', quantity: 3, service: 'Wash & Iron', rate: 150, amount: 450 },
        { type: 'Trouser', quantity: 2, service: 'Wash & Iron', rate: 200, amount: 400 },
        { type: 'Suit', quantity: 1, service: 'Dry Clean', rate: 800, amount: 800 }
      ],
      totalItems: 6,
      subtotal: 1650,
      discount: 50,
      tax: 128,
      totalAmount: 1728,
      paymentMethod: 'Room Charge',
      paymentStatus: 'Charged to Room',
      serviceType: 'Express',
      status: 'Delivered',
      processedBy: 'Laundry Staff',
      remarks: 'Express service completed'
    },
    {
      id: 2,
      billNumber: 'LB-2024-002',
      customerName: 'Sarah Johnson',
      customerType: 'Room Guest',
      roomNumber: '205',
      serviceDate: '2024-01-15',
      collectionDate: '2024-01-15',
      deliveryDate: '2024-01-16',
      items: [
        { type: 'Dress', quantity: 2, service: 'Dry Clean', rate: 600, amount: 1200 },
        { type: 'Blouse', quantity: 3, service: 'Wash & Iron', rate: 180, amount: 540 },
        { type: 'Skirt', quantity: 1, service: 'Dry Clean', rate: 400, amount: 400 }
      ],
      totalItems: 6,
      subtotal: 2140,
      discount: 100,
      tax: 163.2,
      totalAmount: 2203.2,
      paymentMethod: 'Room Charge',
      paymentStatus: 'Charged to Room',
      serviceType: 'Regular',
      status: 'Delivered',
      processedBy: 'Laundry Supervisor',
      remarks: 'All items cleaned successfully'
    },
    {
      id: 3,
      billNumber: 'LB-2024-003',
      customerName: 'Ali Khan',
      customerType: 'Walk-in',
      roomNumber: null,
      serviceDate: '2024-01-14',
      collectionDate: '2024-01-14',
      deliveryDate: '2024-01-15',
      items: [
        { type: 'Shirt', quantity: 5, service: 'Wash & Iron', rate: 150, amount: 750 },
        { type: 'Trouser', quantity: 3, service: 'Wash & Iron', rate: 200, amount: 600 },
        { type: 'Bedsheet', quantity: 2, service: 'Wash & Iron', rate: 300, amount: 600 }
      ],
      totalItems: 10,
      subtotal: 1950,
      discount: 0,
      tax: 156,
      totalAmount: 2106,
      paymentMethod: 'Cash',
      paymentStatus: 'Paid',
      serviceType: 'Regular',
      status: 'Delivered',
      processedBy: 'Laundry Staff',
      remarks: 'Customer satisfied with service'
    },
    {
      id: 4,
      billNumber: 'LB-2024-004',
      customerName: 'Emma Wilson',
      customerType: 'Room Guest',
      roomNumber: '102',
      serviceDate: '2024-01-17',
      collectionDate: '2024-01-17',
      deliveryDate: null,
      items: [
        { type: 'Baby Clothes', quantity: 8, service: 'Gentle Wash', rate: 100, amount: 800 },
        { type: 'Towel', quantity: 4, service: 'Wash & Iron', rate: 120, amount: 480 },
        { type: 'Blanket', quantity: 1, service: 'Dry Clean', rate: 500, amount: 500 }
      ],
      totalItems: 13,
      subtotal: 1780,
      discount: 80,
      tax: 136,
      totalAmount: 1836,
      paymentMethod: 'Room Charge',
      paymentStatus: 'Pending',
      serviceType: 'Regular',
      status: 'In Process',
      processedBy: 'Laundry Staff',
      remarks: 'Special care for baby items'
    },
    {
      id: 5,
      billNumber: 'LB-2024-005',
      customerName: 'Muhammad Usman',
      customerType: 'Walk-in',
      roomNumber: null,
      serviceDate: '2024-01-16',
      collectionDate: '2024-01-16',
      deliveryDate: '2024-01-18',
      items: [
        { type: 'Curtain', quantity: 4, service: 'Dry Clean', rate: 400, amount: 1600 },
        { type: 'Carpet', quantity: 1, service: 'Deep Clean', rate: 1200, amount: 1200 }
      ],
      totalItems: 5,
      subtotal: 2800,
      discount: 200,
      tax: 208,
      totalAmount: 2808,
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      serviceType: 'Special',
      status: 'Delivered',
      processedBy: 'Laundry Supervisor',
      remarks: 'Heavy items - special handling'
    }
  ])

  const statuses = ['Delivered', 'In Process', 'Ready for Delivery', 'Cancelled']
  const serviceTypes = ['Regular', 'Express', 'Special', 'Same Day']
  const customerTypes = ['Room Guest', 'Walk-in', 'Corporate']

  const filteredRecords = laundryRecords.filter(record => {
    const matchesSearch = record.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (record.roomNumber && record.roomNumber.includes(searchTerm)) ||
                         record.items.some(item => item.type.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === '' || record.status === statusFilter
    const matchesServiceType = serviceTypeFilter === '' || record.serviceType === serviceTypeFilter
    const matchesCustomerType = customerTypeFilter === '' || record.customerType === customerTypeFilter
    
    let matchesDateRange = true
    if (dateRange.start && dateRange.end) {
      const serviceDate = new Date(record.serviceDate)
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      matchesDateRange = serviceDate >= startDate && serviceDate <= endDate
    }
    
    let matchesAmountRange = true
    if (amountRange.min || amountRange.max) {
      const min = parseFloat(amountRange.min) || 0
      const max = parseFloat(amountRange.max) || Infinity
      matchesAmountRange = record.totalAmount >= min && record.totalAmount <= max
    }
    
    return matchesSearch && matchesStatus && matchesServiceType && matchesCustomerType && matchesDateRange && matchesAmountRange
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800'
      case 'In Process': return 'bg-blue-100 text-blue-800'
      case 'Ready for Delivery': return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getServiceTypeColor = (serviceType) => {
    switch (serviceType) {
      case 'Regular': return 'bg-blue-100 text-blue-800'
      case 'Express': return 'bg-orange-100 text-orange-800'
      case 'Special': return 'bg-purple-100 text-purple-800'
      case 'Same Day': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'Paid': return 'bg-green-100 text-green-800'
      case 'Charged to Room': return 'bg-blue-100 text-blue-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCustomerTypeColor = (customerType) => {
    switch (customerType) {
      case 'Room Guest': return 'bg-green-100 text-green-800'
      case 'Walk-in': return 'bg-blue-100 text-blue-800'
      case 'Corporate': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const exportResults = () => {
    alert(`Exporting ${filteredRecords.length} laundry billing records...`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    setServiceTypeFilter('')
    setCustomerTypeFilter('')
    setDateRange({ start: '', end: '' })
    setAmountRange({ min: '', max: '' })
  }

  // Calculate statistics
  const totalRecords = filteredRecords.length
  const deliveredOrders = filteredRecords.filter(r => r.status === 'Delivered').length
  const inProcessOrders = filteredRecords.filter(r => r.status === 'In Process').length
  const totalRevenue = filteredRecords.reduce((sum, r) => sum + r.totalAmount, 0)
  const totalItems = filteredRecords.reduce((sum, r) => sum + r.totalItems, 0)
  const totalDiscount = filteredRecords.reduce((sum, r) => sum + r.discount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Laundry Billing Search</h1>
            <p className="text-pink-100">Search and analyze laundry service billing records</p>
          </div>
          <SparklesIcon className="h-12 w-12 text-pink-200" />
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
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center"
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
              placeholder="Search laundry bills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={serviceTypeFilter}
            onChange={(e) => setServiceTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">All Service Types</option>
            {serviceTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={customerTypeFilter}
            onChange={(e) => setCustomerTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">All Customer Types</option>
            {customerTypes.map(type => (
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
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <input
              type="date"
              placeholder="To Date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Amount"
              value={amountRange.min}
              onChange={(e) => setAmountRange({...amountRange, min: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <input
              type="number"
              placeholder="Max Amount"
              value={amountRange.max}
              onChange={(e) => setAmountRange({...amountRange, max: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-pink-100 rounded-lg p-3">
              <SparklesIcon className="h-6 w-6 text-pink-600" />
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
              <p className="text-sm font-medium text-gray-600">Delivered Orders</p>
              <p className="text-2xl font-bold text-gray-900">{deliveredOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Process</p>
              <p className="text-2xl font-bold text-gray-900">{inProcessOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <DocumentTextIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Laundry Billing Records</h3>
            <p className="text-gray-600">Found {filteredRecords.length} laundry bills</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <SparklesIcon className="h-4 w-4 mr-1" />
              Total: {laundryRecords.length}
            </div>
            <div className="flex items-center">
              <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
              Filtered: {filteredRecords.length}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill & Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items & Services</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Breakdown</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-pink-100 rounded-full p-2 mr-3">
                        <UserIcon className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.billNumber}</div>
                        <div className="text-sm text-gray-900">{record.customerName}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCustomerTypeColor(record.customerType)}`}>
                          {record.customerType}
                        </span>
                        {record.roomNumber && (
                          <div className="text-sm text-gray-500">Room: {record.roomNumber}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getServiceTypeColor(record.serviceType)}`}>
                        {record.serviceType}
                      </span>
                      <div className="text-sm text-gray-500">Processed by: {record.processedBy}</div>
                      <div className="text-sm text-gray-500">Payment: {record.paymentMethod}</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(record.paymentStatus)}`}>
                        {record.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {record.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="text-sm text-gray-900">
                          {item.quantity}x {item.type} ({item.service}) - {formatCurrency(item.amount)}
                        </div>
                      ))}
                      {record.items.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{record.items.length - 3} more items
                        </div>
                      )}
                      <div className="text-sm text-gray-500 font-medium">
                        Total Items: {record.totalItems}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">Subtotal: {formatCurrency(record.subtotal)}</div>
                      {record.discount > 0 && (
                        <div className="text-sm text-green-600">Discount: -{formatCurrency(record.discount)}</div>
                      )}
                      <div className="text-sm text-gray-500">Tax: {formatCurrency(record.tax)}</div>
                      <div className="text-sm font-medium text-gray-900 border-t pt-1">
                        Total: {formatCurrency(record.totalAmount)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                        Service: {record.serviceDate}
                      </div>
                      <div className="text-sm text-gray-500">
                        Collected: {record.collectionDate}
                      </div>
                      {record.deliveryDate ? (
                        <div className="text-sm text-green-600">
                          Delivered: {record.deliveryDate}
                        </div>
                      ) : (
                        <div className="text-sm text-yellow-600">
                          Pending delivery
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                      {record.remarks && (
                        <div className="text-sm text-blue-600">
                          {record.remarks}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <SparklesIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No laundry records found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search criteria or date range.
            </p>
          </div>
        )}
      </div>

      {/* Additional Stats */}
      {filteredRecords.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalDiscount)}</div>
              <div className="text-sm text-gray-600">Total Discounts Given</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalRecords > 0 ? (totalItems / totalRecords).toFixed(1) : 0}
              </div>
              <div className="text-sm text-gray-600">Average Items per Bill</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">
                {totalRecords > 0 ? formatCurrency(totalRevenue / totalRecords) : formatCurrency(0)}
              </div>
              <div className="text-sm text-gray-600">Average Bill Amount</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LaundryBillingSearch;
