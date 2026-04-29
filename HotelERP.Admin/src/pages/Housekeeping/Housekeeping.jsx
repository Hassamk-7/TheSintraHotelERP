import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  SparklesIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  WrenchScrewdriverIcon,
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const housekeepingItems = [
  { 
    name: 'Room Status', 
    href: '/housekeeping-room-status', 
    icon: BuildingOfficeIcon, 
    description: 'Monitor and update room cleaning status',
    color: 'from-blue-500 to-blue-600'
  },
  { 
    name: 'Cleaning Schedule', 
    href: '/cleaning-schedule', 
    icon: CalendarDaysIcon, 
    description: 'Plan and manage daily cleaning schedules',
    color: 'from-green-500 to-green-600'
  },
  { 
    name: 'Maintenance Requests', 
    href: '/maintenance-requests', 
    icon: WrenchScrewdriverIcon, 
    description: 'Handle room maintenance and repair requests',
    color: 'from-orange-500 to-orange-600'
  },
  { 
    name: 'Lost & Found', 
    href: '/lost-and-found', 
    icon: ArchiveBoxIcon, 
    description: 'Manage lost and found items from guests',
    color: 'from-purple-500 to-purple-600'
  },
  { 
    name: 'Laundry Management', 
    href: '/laundry-management', 
    icon: SparklesIcon, 
    description: 'Track laundry services and requests',
    color: 'from-teal-500 to-teal-600'
  }
]

const Housekeeping = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = housekeepingItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Housekeeping</h1>
            <p className="text-teal-100 text-lg">
              Manage room cleaning, maintenance, and guest services
            </p>
          </div>
          <SparklesIcon className="h-16 w-16 text-teal-200" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <SparklesIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rooms Cleaned</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Cleaning</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-lg p-3">
              <WrenchScrewdriverIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Maintenance Requests</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <ArchiveBoxIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lost Items</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
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
            placeholder="Search housekeeping operations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Housekeeping Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-teal-300 transition-all duration-200 transform hover:-translate-y-1 group"
          >
            <div className="flex items-center mb-4">
              <div className={`bg-gradient-to-r ${item.color} rounded-lg p-3 group-hover:scale-110 transition-transform duration-200`}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
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
            <SparklesIcon className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No operations found</h3>
          <p className="text-gray-500">Try adjusting your search terms.</p>
        </div>
      )}

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Today's Cleaning Schedule</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-2">
                  <SparklesIcon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Room 101-110 - Floor 1</p>
                  <p className="text-xs text-gray-500">Assigned to: Fatima Khan</p>
                </div>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Completed
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 rounded-full p-2">
                  <ClockIcon className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Room 201-210 - Floor 2</p>
                  <p className="text-xs text-gray-500">Assigned to: Aisha Ahmed</p>
                </div>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                In Progress
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <CalendarDaysIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Room 301-310 - Floor 3</p>
                  <p className="text-xs text-gray-500">Assigned to: Sana Ali</p>
                </div>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                Scheduled
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 rounded-full p-2">
                  <WrenchScrewdriverIcon className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Room 205 - Maintenance Required</p>
                  <p className="text-xs text-gray-500">Issue: AC not working properly</p>
                </div>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                Maintenance
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Staff Performance Today</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <SparklesIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Fatima Khan</h3>
              <p className="text-sm text-gray-500 mb-2">Senior Housekeeper</p>
              <div className="bg-green-100 rounded-full px-3 py-1 text-sm font-medium text-green-800">
                15 rooms completed
              </div>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <SparklesIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Aisha Ahmed</h3>
              <p className="text-sm text-gray-500 mb-2">Housekeeper</p>
              <div className="bg-blue-100 rounded-full px-3 py-1 text-sm font-medium text-blue-800">
                12 rooms completed
              </div>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <SparklesIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Sana Ali</h3>
              <p className="text-sm text-gray-500 mb-2">Housekeeper</p>
              <div className="bg-purple-100 rounded-full px-3 py-1 text-sm font-medium text-purple-800">
                10 rooms completed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 rounded-full p-2">
                <SparklesIcon className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Room 205 - Cleaning completed</p>
                <p className="text-xs text-gray-500">Fatima Khan • 5 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 rounded-full p-2">
                <WrenchScrewdriverIcon className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Maintenance request submitted</p>
                <p className="text-xs text-gray-500">Room 108 - Bathroom faucet leak • 15 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 rounded-full p-2">
                <ArchiveBoxIcon className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Lost item reported</p>
                <p className="text-xs text-gray-500">Room 312 - Guest left mobile charger • 30 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-teal-100 rounded-full p-2">
                <SparklesIcon className="h-4 w-4 text-teal-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Laundry service completed</p>
                <p className="text-xs text-gray-500">Room 156 - 5 items returned • 45 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-full p-2">
                <CalendarDaysIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Tomorrow's schedule updated</p>
                <p className="text-xs text-gray-500">Added 5 additional rooms for deep cleaning • 1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Housekeeping;
