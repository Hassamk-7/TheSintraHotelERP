import { useState } from 'react'
import {
  HomeIcon,
  FunnelIcon,
  DocumentTextIcon,
  PrinterIcon,
  ClockIcon,
  UserIcon,
  CurrencyDollarIcon,
  TruckIcon
} from '@heroicons/react/24/outline'

const RoomServicesReport = () => {
  const [filters, setFilters] = useState({
    serviceType: '',
    status: '',
    roomType: '',
    dateRange: { start: '', end: '' },
    amountRange: { min: '', max: '' }
  })

  const [roomServices] = useState([
    {
      id: 1,
      serviceId: 'RS-2024-001',
      roomNumber: '101',
      roomType: 'Deluxe',
      guestName: 'Ahmed Hassan',
      guestId: 'GST-001',
      serviceType: 'Room Service',
      serviceDate: '2024-01-20',
      orderTime: '19:30',
      deliveryTime: '20:15',
      items: [
        { name: 'Chicken Biryani', quantity: 2, price: 850 },
        { name: 'Fresh Orange Juice', quantity: 2, price: 350 },
        { name: 'Chocolate Cake', quantity: 1, price: 450 }
      ],
      subtotal: 2850,
      serviceCharge: 285,
      tax: 314,
      totalAmount: 3449,
      status: 'Delivered',
      paymentMethod: 'Room Charge',
      specialInstructions: 'Extra spicy, No onions',
      deliveredBy: 'Hassan Ahmed',
      preparationTime: 35,
      deliveryDuration: 10,
      rating: 4.5,
      feedback: 'Delicious food, quick service'
    },
    {
      id: 2,
      serviceId: 'RS-2024-002',
      roomNumber: '205',
      roomType: 'Suite',
      guestName: 'Sarah Johnson',
      guestId: 'GST-002',
      serviceType: 'Housekeeping',
      serviceDate: '2024-01-21',
      orderTime: '14:00',
      deliveryTime: '14:30',
      items: [
        { name: 'Extra Towels', quantity: 4, price: 0 },
        { name: 'Room Cleaning', quantity: 1, price: 500 },
        { name: 'Laundry Service', quantity: 1, price: 800 }
      ],
      subtotal: 1300,
      serviceCharge: 130,
      tax: 143,
      totalAmount: 1573,
      status: 'Completed',
      paymentMethod: 'Corporate Account',
      specialInstructions: 'Clean bathroom thoroughly, Replace all linens',
      deliveredBy: 'Fatima Sheikh',
      preparationTime: 0,
      deliveryDuration: 30,
      rating: 5.0,
      feedback: 'Excellent housekeeping service'
    },
    {
      id: 3,
      serviceId: 'RS-2024-003',
      roomNumber: '301',
      roomType: 'Standard',
      guestName: 'Ali Khan',
      guestId: 'GST-003',
      serviceType: 'Maintenance',
      serviceDate: '2024-01-19',
      orderTime: '10:15',
      deliveryTime: '11:00',
      items: [
        { name: 'AC Repair', quantity: 1, price: 1200 },
        { name: 'Light Bulb Replacement', quantity: 2, price: 100 }
      ],
      subtotal: 1300,
      serviceCharge: 0,
      tax: 130,
      totalAmount: 1430,
      status: 'Completed',
      paymentMethod: 'Cash',
      specialInstructions: 'AC not cooling properly, Bathroom light not working',
      deliveredBy: 'Omar Siddique',
      preparationTime: 0,
      deliveryDuration: 45,
      rating: 4.0,
      feedback: 'Fixed quickly, professional service'
    },
    {
      id: 4,
      serviceId: 'RS-2024-004',
      roomNumber: '102',
      roomType: 'Deluxe',
      guestName: 'Emma Wilson',
      guestId: 'GST-004',
      serviceType: 'Concierge',
      serviceDate: '2024-01-22',
      orderTime: '16:00',
      deliveryTime: '16:30',
      items: [
        { name: 'City Tour Booking', quantity: 2, price: 2500 },
        { name: 'Restaurant Reservation', quantity: 1, price: 0 },
        { name: 'Transportation Arrangement', quantity: 1, price: 800 }
      ],
      subtotal: 3300,
      serviceCharge: 330,
      tax: 363,
      totalAmount: 3993,
      status: 'Confirmed',
      paymentMethod: 'Credit Card',
      specialInstructions: 'Book for tomorrow evening, Vegetarian restaurant preferred',
      deliveredBy: 'Ayesha Khan',
      preparationTime: 0,
      deliveryDuration: 30,
      rating: 4.8,
      feedback: 'Very helpful, great recommendations'
    },
    {
      id: 5,
      serviceId: 'RS-2024-005',
      roomNumber: '203',
      roomType: 'Executive',
      guestName: 'Hassan Ahmed',
      guestId: 'GST-005',
      serviceType: 'Room Service',
      serviceDate: '2024-01-23',
      orderTime: '08:00',
      deliveryTime: null,
      items: [
        { name: 'Continental Breakfast', quantity: 1, price: 1200 },
        { name: 'Fresh Coffee', quantity: 2, price: 200 },
        { name: 'Fresh Fruit Platter', quantity: 1, price: 600 }
      ],
      subtotal: 2000,
      serviceCharge: 200,
      tax: 220,
      totalAmount: 2420,
      status: 'Preparing',
      paymentMethod: 'Room Charge',
      specialInstructions: 'Early breakfast, Extra coffee, No sugar',
      deliveredBy: null,
      preparationTime: 25,
      deliveryDuration: 0,
      rating: null,
      feedback: null
    }
  ])

  const serviceTypes = ['All Services', 'Room Service', 'Housekeeping', 'Maintenance', 'Concierge', 'Laundry']
  const statuses = ['All Status', 'Preparing', 'Delivered', 'Completed', 'Confirmed', 'Cancelled']
  const roomTypes = ['All Room Types', 'Standard', 'Deluxe', 'Executive', 'Suite']

  const filteredServices = roomServices.filter(service => {
    const matchesServiceType = filters.serviceType === '' || filters.serviceType === 'All Services' || service.serviceType === filters.serviceType
    const matchesStatus = filters.status === '' || filters.status === 'All Status' || service.status === filters.status
    const matchesRoomType = filters.roomType === '' || filters.roomType === 'All Room Types' || service.roomType === filters.roomType
    
    let matchesDateRange = true
    if (filters.dateRange.start && filters.dateRange.end) {
      const serviceDate = new Date(service.serviceDate)
      const startDate = new Date(filters.dateRange.start)
      const endDate = new Date(filters.dateRange.end)
      matchesDateRange = serviceDate >= startDate && serviceDate <= endDate
    }
    
    let matchesAmountRange = true
    if (filters.amountRange.min || filters.amountRange.max) {
      const min = parseFloat(filters.amountRange.min) || 0
      const max = parseFloat(filters.amountRange.max) || Infinity
      matchesAmountRange = service.totalAmount >= min && service.totalAmount <= max
    }

    return matchesServiceType && matchesStatus && matchesRoomType && matchesDateRange && matchesAmountRange
  })

  const getServiceTypeColor = (serviceType) => {
    switch (serviceType) {
      case 'Room Service': return 'bg-orange-100 text-orange-800'
      case 'Housekeeping': return 'bg-green-100 text-green-800'
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'Concierge': return 'bg-purple-100 text-purple-800'
      case 'Laundry': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Preparing': return 'bg-yellow-100 text-yellow-800'
      case 'Delivered': return 'bg-green-100 text-green-800'
      case 'Completed': return 'bg-blue-100 text-blue-800'
      case 'Confirmed': return 'bg-purple-100 text-purple-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoomTypeColor = (roomType) => {
    switch (roomType) {
      case 'Standard': return 'bg-gray-100 text-gray-800'
      case 'Deluxe': return 'bg-blue-100 text-blue-800'
      case 'Executive': return 'bg-purple-100 text-purple-800'
      case 'Suite': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const exportReport = () => {
    alert(`Exporting room services report with ${filteredServices.length} services...`)
  }

  const printReport = () => {
    window.print()
  }

  // Calculate statistics
  const totalServices = filteredServices.length
  const totalRevenue = filteredServices.reduce((sum, service) => sum + service.totalAmount, 0)
  const completedServices = filteredServices.filter(s => s.status === 'Completed' || s.status === 'Delivered').length
  const averageOrderValue = totalServices > 0 ? totalRevenue / totalServices : 0
  const averageRating = filteredServices.filter(s => s.rating).length > 0 ? 
    filteredServices.filter(s => s.rating).reduce((sum, s) => sum + s.rating, 0) / filteredServices.filter(s => s.rating).length : 0
  const averageDeliveryTime = filteredServices.filter(s => s.deliveryDuration > 0).length > 0 ?
    filteredServices.filter(s => s.deliveryDuration > 0).reduce((sum, s) => sum + s.deliveryDuration, 0) / filteredServices.filter(s => s.deliveryDuration > 0).length : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Room Services Report</h1>
            <p className="text-orange-100">Track in-room services, deliveries, and guest satisfaction</p>
          </div>
          <HomeIcon className="h-12 w-12 text-orange-200" />
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

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
            <select
              value={filters.serviceType}
              onChange={(e) => setFilters({...filters, serviceType: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {serviceTypes.map(type => (
                <option key={type} value={type === 'All Services' ? '' : type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {statuses.map(status => (
                <option key={status} value={status === 'All Status' ? '' : status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
            <select
              value={filters.roomType}
              onChange={(e) => setFilters({...filters, roomType: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {roomTypes.map(type => (
                <option key={type} value={type === 'All Room Types' ? '' : type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, start: e.target.value}})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, end: e.target.value}})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-orange-600" />
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
              <TruckIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <HomeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageOrderValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <ClockIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Delivery</p>
              <p className="text-2xl font-bold text-gray-900">{averageDeliveryTime.toFixed(0)} min</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Room Service Records ({filteredServices.length} services)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest & Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items & Services</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timing & Delivery</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Financial Summary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating & Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{service.serviceId}</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getServiceTypeColor(service.serviceType)}`}>
                        {service.serviceType}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">{service.serviceDate}</div>
                      {service.deliveredBy && (
                        <div className="text-sm text-blue-600">
                          By: {service.deliveredBy}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-orange-100 rounded-full p-2 mr-3">
                        <UserIcon className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{service.guestName}</div>
                        <div className="text-sm text-gray-500">{service.guestId}</div>
                        <div className="flex items-center text-sm text-gray-500">
                          <HomeIcon className="h-4 w-4 text-gray-400 mr-1" />
                          Room {service.roomNumber}
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoomTypeColor(service.roomType)}`}>
                          {service.roomType}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {service.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="text-sm text-gray-900">
                          {item.quantity}x {item.name} - {formatCurrency(item.price)}
                        </div>
                      ))}
                      {service.items.length > 2 && (
                        <div className="text-sm text-gray-500">
                          +{service.items.length - 2} more items
                        </div>
                      )}
                      {service.specialInstructions && (
                        <div className="text-sm text-blue-600 italic">
                          "{service.specialInstructions.substring(0, 30)}..."
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                        Ordered: {service.orderTime}
                      </div>
                      {service.deliveryTime && (
                        <div className="text-sm text-green-600">
                          Delivered: {service.deliveryTime}
                        </div>
                      )}
                      {service.preparationTime > 0 && (
                        <div className="text-sm text-gray-500">
                          Prep: {service.preparationTime} min
                        </div>
                      )}
                      {service.deliveryDuration > 0 && (
                        <div className="text-sm text-gray-500">
                          Delivery: {service.deliveryDuration} min
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        Subtotal: {formatCurrency(service.subtotal)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Service: {formatCurrency(service.serviceCharge)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Tax: {formatCurrency(service.tax)}
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        Total: {formatCurrency(service.totalAmount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {service.paymentMethod}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                        {service.status}
                      </span>
                      {service.rating && (
                        <div className="text-sm text-yellow-600">
                          ★ {service.rating}/5.0
                        </div>
                      )}
                      {service.feedback && (
                        <div className="text-sm text-gray-500 italic">
                          "{service.feedback.substring(0, 25)}..."
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <HomeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No room services found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>

      {/* Service Type Breakdown */}
      {filteredServices.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Services by Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceTypes.slice(1).map(serviceType => {
              const typeServices = filteredServices.filter(service => service.serviceType === serviceType)
              const typeRevenue = typeServices.reduce((sum, service) => sum + service.totalAmount, 0)
              
              if (typeServices.length === 0) return null
              
              return (
                <div key={serviceType} className="text-center">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getServiceTypeColor(serviceType)}`}>
                    {serviceType}
                  </span>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(typeRevenue)}</div>
                    <div className="text-sm text-gray-500">{typeServices.length} services</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Summary Analytics */}
      {filteredServices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Completion Rate:</span>
                <span className="font-medium">{((completedServices/totalServices)*100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Rating:</span>
                <span className="font-medium">★ {averageRating.toFixed(1)}/5.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Delivery Time:</span>
                <span className="font-medium">{averageDeliveryTime.toFixed(0)} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Services per Day:</span>
                <span className="font-medium">{(totalServices/7).toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Analysis</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Revenue:</span>
                <span className="font-medium text-green-600">{formatCurrency(totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Order Value:</span>
                <span className="font-medium">{formatCurrency(averageOrderValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Charges:</span>
                <span className="font-medium">{formatCurrency(filteredServices.reduce((sum, s) => sum + s.serviceCharge, 0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax Collected:</span>
                <span className="font-medium">{formatCurrency(filteredServices.reduce((sum, s) => sum + s.tax, 0))}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomServicesReport;
