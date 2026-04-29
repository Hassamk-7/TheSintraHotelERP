import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BuildingOfficeIcon,
  CalendarDaysIcon,
  KeyIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  DocumentChartBarIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const frontOfficeItems = [
  { 
    name: 'Reservations', 
    href: '/reservations', 
    icon: CalendarDaysIcon, 
    description: 'Manage room bookings and reservations',
    color: 'from-blue-500 to-blue-600'
  },
  { 
    name: 'Check In', 
    href: '/check-in', 
    icon: KeyIcon, 
    description: 'Process guest check-in procedures',
    color: 'from-green-500 to-green-600'
  },
  { 
    name: 'Check Out', 
    href: '/check-out', 
    icon: ArrowRightOnRectangleIcon, 
    description: 'Handle guest check-out and billing',
    color: 'from-red-500 to-red-600'
  },
  { 
    name: 'Room Status', 
    href: '/room-status', 
    icon: BuildingOfficeIcon, 
    description: 'Monitor room availability and status',
    color: 'from-purple-500 to-purple-600'
  },
  { 
    name: 'Guest Registration', 
    href: '/guest-registration', 
    icon: UserGroupIcon, 
    description: 'Register new guests and update profiles',
    color: 'from-teal-500 to-teal-600'
  },
  { 
    name: 'Walk-in Guests', 
    href: '/walk-in-guests', 
    icon: UserIcon, 
    description: 'Handle walk-in guest accommodations',
    color: 'from-orange-500 to-orange-600'
  },
  { 
    name: 'Guest History', 
    href: '/guest-history', 
    icon: ClipboardDocumentListIcon, 
    description: 'View guest stay history and preferences',
    color: 'from-indigo-500 to-indigo-600'
  },
  { 
    name: 'Room Transfer', 
    href: '/room-transfer', 
    icon: ArrowRightOnRectangleIcon, 
    description: 'Transfer guests between rooms',
    color: 'from-cyan-500 to-cyan-600'
  },
  { 
    name: 'Guest Folio', 
    href: '/guest-folio', 
    icon: DocumentChartBarIcon, 
    description: 'Manage guest accounts and charges',
    color: 'from-pink-500 to-pink-600'
  },
  { 
    name: 'Check In with ID', 
    href: '/check-in-id', 
    icon: KeyIcon, 
    description: 'Quick check-in with ID verification',
    color: 'from-emerald-500 to-emerald-600'
  },
  { 
    name: 'Check Out with ID', 
    href: '/check-out-id', 
    icon: ArrowRightOnRectangleIcon, 
    description: 'Express check-out with ID verification',
    color: 'from-rose-500 to-rose-600'
  }
]

const FrontOffice = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = frontOfficeItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Front Office</h1>
            <p className="text-blue-100 text-lg">
              Manage guest services, reservations, and front desk operations
            </p>
          </div>
          <BuildingOfficeIcon className="h-16 w-16 text-blue-200" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Arrivals</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <KeyIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Check-ins</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <ArrowRightOnRectangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Check-outs</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Rooms</p>
              <p className="text-2xl font-bold text-gray-900">42</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search front office operations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Front Office Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 transform hover:-translate-y-1 group"
          >
            <div className="flex items-center mb-4">
              <div className={`bg-gradient-to-r ${item.color} rounded-lg p-3 group-hover:scale-110 transition-transform duration-200`}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {item.name}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {item.description}
            </p>
          </Link>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BuildingOfficeIcon className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No operations found</h3>
          <p className="text-gray-500">Try adjusting your search terms.</p>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 rounded-full p-2">
                <KeyIcon className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Room 205 - Check-in completed</p>
                <p className="text-xs text-gray-500">John Smith • 2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-full p-2">
                <CalendarDaysIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New reservation created</p>
                <p className="text-xs text-gray-500">Room 312 • 5 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-red-100 rounded-full p-2">
                <ArrowRightOnRectangleIcon className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Room 108 - Check-out processed</p>
                <p className="text-xs text-gray-500">Sarah Johnson • 8 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 rounded-full p-2">
                <UserIcon className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Walk-in guest accommodated</p>
                <p className="text-xs text-gray-500">Room 156 • 12 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 rounded-full p-2">
                <BuildingOfficeIcon className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Room status updated</p>
                <p className="text-xs text-gray-500">Room 203 - Ready for occupancy • 15 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FrontOffice;
