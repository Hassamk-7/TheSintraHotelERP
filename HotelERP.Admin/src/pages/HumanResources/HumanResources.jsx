import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  UserGroupIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  AcademicCapIcon,
  MagnifyingGlassIcon,
  UserIcon
} from '@heroicons/react/24/outline'

const hrItems = [
  { 
    name: 'Employee Management', 
    href: '/employee-management', 
    icon: UserGroupIcon, 
    description: 'Manage employee records and information',
    color: 'from-blue-500 to-indigo-600'
  },
  { 
    name: 'Attendance', 
    href: '/hr-attendance', 
    icon: ClockIcon, 
    description: 'Track employee attendance and working hours',
    color: 'from-green-500 to-emerald-600'
  },
  { 
    name: 'Payroll', 
    href: '/hr-payroll', 
    icon: CurrencyDollarIcon, 
    description: 'Process employee salaries and payments',
    color: 'from-purple-500 to-violet-600'
  },
  { 
    name: 'Leave Management', 
    href: '/leave-management', 
    icon: CalendarDaysIcon, 
    description: 'Handle employee leave requests and approvals',
    color: 'from-orange-500 to-amber-600'
  },
  { 
    name: 'Performance', 
    href: '/performance-management', 
    icon: ChartBarIcon, 
    description: 'Monitor and evaluate employee performance',
    color: 'from-red-500 to-rose-600'
  },
  { 
    name: 'Training', 
    href: '/training-management', 
    icon: AcademicCapIcon, 
    description: 'Organize employee training and development',
    color: 'from-teal-500 to-cyan-600'
  }
]

const HumanResources = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = hrItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Human Resources</h1>
            <p className="text-blue-100 text-lg">
              Manage employees, payroll, attendance, and HR operations
            </p>
          </div>
          <UserGroupIcon className="h-16 w-16 text-blue-200" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <ClockIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Present Today</p>
              <p className="text-2xl font-bold text-gray-900">42</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-lg p-3">
              <CalendarDaysIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">On Leave</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Payroll</p>
              <p className="text-2xl font-bold text-gray-900">Rs 1,25,000</p>
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
            placeholder="Search HR operations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* HR Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <UserGroupIcon className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No operations found</h3>
          <p className="text-gray-500">Try adjusting your search terms.</p>
        </div>
      )}

      {/* Department Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Department Overview</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-lg p-4 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Front Office</h3>
                <p className="text-2xl font-bold text-blue-600">12</p>
              </div>
              <p className="text-sm text-gray-500">employees</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-lg p-4 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Housekeeping</h3>
                <p className="text-2xl font-bold text-green-600">15</p>
              </div>
              <p className="text-sm text-gray-500">employees</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-lg p-4 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Restaurant</h3>
                <p className="text-2xl font-bold text-orange-600">10</p>
              </div>
              <p className="text-sm text-gray-500">employees</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-lg p-4 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Management</h3>
                <p className="text-2xl font-bold text-purple-600">8</p>
              </div>
              <p className="text-sm text-gray-500">employees</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent HR Activities</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 rounded-full p-2">
                <UserIcon className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New employee onboarded</p>
                <p className="text-xs text-gray-500">Sana Ahmed joined as Housekeeper • 2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-full p-2">
                <CalendarDaysIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Leave request approved</p>
                <p className="text-xs text-gray-500">Ahmad Ali - 3 days sick leave • 4 hours ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 rounded-full p-2">
                <CurrencyDollarIcon className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Payroll processed</p>
                <p className="text-xs text-gray-500">Monthly salaries for 45 employees • 1 day ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-teal-100 rounded-full p-2">
                <AcademicCapIcon className="h-4 w-4 text-teal-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Training session completed</p>
                <p className="text-xs text-gray-500">Customer Service Training - 12 participants • 2 days ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-red-100 rounded-full p-2">
                <ChartBarIcon className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Performance review scheduled</p>
                <p className="text-xs text-gray-500">Quarterly reviews for all departments • 3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Top Performers This Month</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Fatima Khan</h3>
              <p className="text-sm text-gray-500 mb-2">Senior Housekeeper</p>
              <div className="bg-yellow-100 rounded-full px-3 py-1 text-sm font-medium text-yellow-800">
                98% Performance
              </div>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Usman Khan</h3>
              <p className="text-sm text-gray-500 mb-2">Head Chef</p>
              <div className="bg-green-100 rounded-full px-3 py-1 text-sm font-medium text-green-800">
                96% Performance
              </div>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Aisha Ahmed</h3>
              <p className="text-sm text-gray-500 mb-2">Front Desk Manager</p>
              <div className="bg-blue-100 rounded-full px-3 py-1 text-sm font-medium text-blue-800">
                95% Performance
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Today's Attendance Summary</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-2">
                  <ClockIcon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">On Time Arrivals</p>
                  <p className="text-xs text-gray-500">Employees who arrived on schedule</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">38</p>
                <p className="text-xs text-gray-500">out of 42 present</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 rounded-full p-2">
                  <ClockIcon className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Late Arrivals</p>
                  <p className="text-xs text-gray-500">Employees who arrived late</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-600">4</p>
                <p className="text-xs text-gray-500">within 30 minutes</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 rounded-full p-2">
                  <CalendarDaysIcon className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Absent</p>
                  <p className="text-xs text-gray-500">Employees not present today</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">3</p>
                <p className="text-xs text-gray-500">on approved leave</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HumanResources;
