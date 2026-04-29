import { useState, useEffect } from 'react'
import {
  SparklesIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const LaundryManagementWorking = () => {
  const [laundryItems] = useState([
    {
      id: 1,
      ticketNumber: 'LND-001',
      guestName: 'Ahmed Hassan',
      roomNumber: '205',
      serviceType: 'Washing & Ironing',
      itemType: 'Clothing',
      quantity: '5',
      specialInstructions: 'Gentle wash for silk shirts',
      receivedBy: 'Fatima Ali',
      receivedDate: '2024-01-15',
      expectedDelivery: '2024-01-16',
      status: 'In Progress',
      charges: '1500',
      notes: 'Priority service requested'
    },
    {
      id: 2,
      ticketNumber: 'LND-002',
      guestName: 'Maria Khan',
      roomNumber: '301',
      serviceType: 'Dry Cleaning',
      itemType: 'Formal Wear',
      quantity: '2',
      specialInstructions: 'Handle with care - expensive suits',
      receivedBy: 'Sara Ahmed',
      receivedDate: '2024-01-14',
      expectedDelivery: '2024-01-17',
      status: 'Received',
      charges: '3000',
      notes: 'Business suits for important meeting'
    },
    {
      id: 3,
      ticketNumber: 'LND-003',
      guestName: 'Ali Raza',
      roomNumber: '102',
      serviceType: 'Express Washing',
      itemType: 'Casual Wear',
      quantity: '8',
      specialInstructions: 'Quick turnaround needed',
      receivedBy: 'Ayesha Khan',
      receivedDate: '2024-01-15',
      expectedDelivery: '2024-01-15',
      status: 'Completed',
      charges: '1200',
      notes: 'Same day service completed'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = laundryItems.filter(item =>
    item.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Received': return 'bg-blue-100 text-blue-800'
      case 'In Progress': return 'bg-yellow-100 text-yellow-800'
      case 'Processing': return 'bg-orange-100 text-orange-800'
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Ready': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getServiceTypeColor = (serviceType) => {
    switch (serviceType) {
      case 'Washing & Ironing': return 'bg-blue-100 text-blue-800'
      case 'Dry Cleaning': return 'bg-purple-100 text-purple-800'
      case 'Express Washing': return 'bg-red-100 text-red-800'
      case 'Pressing Only': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Laundry Management</h1>
            <p className="text-green-100">Manage hotel laundry services and guest requests</p>
          </div>
          <SparklesIcon className="h-12 w-12 text-cyan-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <SparklesIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{laundryItems.length}</p>
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
              <p className="text-2xl font-bold text-gray-900">
                {laundryItems.filter(item => item.status === 'In Progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <SparklesIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {laundryItems.filter(item => item.status === 'Completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <PlusIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs. {laundryItems.reduce((sum, item) => sum + parseInt(item.charges), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by ticket number, guest name, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            New Laundry Order
          </button>
        </div>
      </div>

      {/* Laundry Items List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Laundry Orders ({filteredItems.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.ticketNumber}</div>
                      <div className="text-sm text-gray-500">Received by: {item.receivedBy}</div>
                      <div className="text-sm font-medium text-green-600">Rs. {parseInt(item.charges).toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div><strong>Guest:</strong> {item.guestName}</div>
                      <div><strong>Room:</strong> {item.roomNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mb-1 ${getServiceTypeColor(item.serviceType)}`}>
                        {item.serviceType}
                      </span>
                      <div className="text-sm text-gray-900">
                        <div><strong>Type:</strong> {item.itemType}</div>
                        <div><strong>Quantity:</strong> {item.quantity} items</div>
                      </div>
                      {item.specialInstructions && (
                        <div className="text-xs text-gray-500 mt-1">
                          <strong>Instructions:</strong> {item.specialInstructions}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div><strong>Received:</strong> {item.receivedDate}</div>
                      <div><strong>Expected:</strong> {item.expectedDelivery}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    {item.notes && (
                      <div className="text-xs text-gray-500 mt-1">
                        {item.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default LaundryManagementWorking;
