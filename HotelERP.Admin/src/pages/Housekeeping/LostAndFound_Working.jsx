import { useState, useEffect } from 'react'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

const LostAndFoundWorking = () => {
  const [items] = useState([
    {
      id: 1,
      itemName: 'iPhone 13 Pro',
      category: 'Electronics',
      description: 'Black iPhone 13 Pro with blue case',
      foundLocation: 'Room 205 - Bedside table',
      foundBy: 'Fatima Ali',
      foundDate: '2024-01-15',
      guestName: 'Ahmed Hassan',
      guestPhone: '+92-300-1234567',
      roomNumber: '205',
      status: 'Claimed',
      claimedBy: 'Ahmed Hassan',
      claimedDate: '2024-01-16',
      notes: 'Guest contacted and item returned'
    },
    {
      id: 2,
      itemName: 'Gold Watch',
      category: 'Jewelry',
      description: 'Rolex gold watch with leather strap',
      foundLocation: 'Room 301 - Bathroom counter',
      foundBy: 'Sara Ahmed',
      foundDate: '2024-01-14',
      guestName: '',
      guestPhone: '',
      roomNumber: '301',
      status: 'Found',
      claimedBy: '',
      claimedDate: '',
      notes: 'Expensive watch, secure storage required'
    },
    {
      id: 3,
      itemName: 'Laptop Charger',
      category: 'Electronics',
      description: 'HP laptop charger with cable',
      foundLocation: 'Room 102 - Desk area',
      foundBy: 'Ali Raza',
      foundDate: '2024-01-13',
      guestName: 'Maria Khan',
      guestPhone: '+92-321-9876543',
      roomNumber: '102',
      status: 'Contacted',
      claimedBy: '',
      claimedDate: '',
      notes: 'Guest contacted, pickup scheduled'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = items.filter(item =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.foundLocation.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Found': return 'bg-blue-100 text-blue-800'
      case 'Contacted': return 'bg-yellow-100 text-yellow-800'
      case 'Claimed': return 'bg-green-100 text-green-800'
      case 'Unclaimed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Electronics': return 'bg-blue-100 text-blue-800'
      case 'Jewelry': return 'bg-yellow-100 text-yellow-800'
      case 'Clothing': return 'bg-purple-100 text-purple-800'
      case 'Personal Items': return 'bg-green-100 text-green-800'
      case 'Documents': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Lost & Found</h1>
            <p className="text-purple-100">Manage lost and found items for hotel guests</p>
          </div>
          <MagnifyingGlassIcon className="h-12 w-12 text-purple-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <MagnifyingGlassIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{items.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <EyeIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Found Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {items.filter(item => item.status === 'Found').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <PlusIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Claimed Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {items.filter(item => item.status === 'Claimed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <TrashIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {items.filter(item => item.status === 'Contacted').length}
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
              placeholder="Search items by name, category, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Item
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Lost & Found Items ({filteredItems.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Found Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div><strong>Location:</strong> {item.foundLocation}</div>
                      <div><strong>Found by:</strong> {item.foundBy}</div>
                      <div><strong>Date:</strong> {item.foundDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {item.guestName ? (
                        <>
                          <div><strong>Name:</strong> {item.guestName}</div>
                          <div><strong>Phone:</strong> {item.guestPhone}</div>
                          <div><strong>Room:</strong> {item.roomNumber}</div>
                        </>
                      ) : (
                        <span className="text-gray-500">No guest info</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    {item.claimedDate && (
                      <div className="text-xs text-gray-500 mt-1">
                        Claimed: {item.claimedDate}
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

export default LostAndFoundWorking;
