import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  ClockIcon,
  FunnelIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

const EmployeeAttendanceSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [shiftFilter, setShiftFilter] = useState('')

  const [attendanceRecords] = useState([
    {
      id: 1,
      employeeId: 'EMP-001',
      employeeName: 'Ahmed Ali',
      department: 'Front Office',
      date: '2024-01-16',
      checkIn: '09:00',
      checkOut: '18:00',
      workingHours: 9.0,
      overtime: 1.0,
      status: 'Present',
      shift: 'Day',
      lateMinutes: 0,
      earlyLeave: 0,
      breakTime: 60,
      location: 'Main Lobby'
    },
    {
      id: 2,
      employeeId: 'EMP-002',
      employeeName: 'Fatima Sheikh',
      department: 'Housekeeping',
      date: '2024-01-16',
      checkIn: '08:30',
      checkOut: '17:30',
      workingHours: 9.0,
      overtime: 0,
      status: 'Present',
      shift: 'Day',
      lateMinutes: 0,
      earlyLeave: 0,
      breakTime: 60,
      location: 'Floor 2'
    },
    {
      id: 3,
      employeeId: 'EMP-003',
      employeeName: 'Hassan Khan',
      department: 'Restaurant',
      date: '2024-01-16',
      checkIn: '07:00',
      checkOut: '16:00',
      workingHours: 9.0,
      overtime: 0,
      status: 'Present',
      shift: 'Day',
      lateMinutes: 0,
      earlyLeave: 0,
      breakTime: 60,
      location: 'Kitchen'
    },
    {
      id: 4,
      employeeId: 'EMP-001',
      employeeName: 'Ahmed Ali',
      department: 'Front Office',
      date: '2024-01-15',
      checkIn: '09:15',
      checkOut: '18:00',
      workingHours: 8.75,
      overtime: 0.75,
      status: 'Late',
      shift: 'Day',
      lateMinutes: 15,
      earlyLeave: 0,
      breakTime: 60,
      location: 'Main Lobby'
    },
    {
      id: 5,
      employeeId: 'EMP-004',
      employeeName: 'Aisha Malik',
      department: 'Administration',
      date: '2024-01-15',
      checkIn: null,
      checkOut: null,
      workingHours: 0,
      overtime: 0,
      status: 'Absent',
      shift: 'Day',
      lateMinutes: 0,
      earlyLeave: 0,
      breakTime: 0,
      location: null
    },
    {
      id: 6,
      employeeId: 'EMP-005',
      employeeName: 'Omar Siddique',
      department: 'Security',
      date: '2024-01-15',
      checkIn: '22:00',
      checkOut: '06:00',
      workingHours: 8.0,
      overtime: 0,
      status: 'Present',
      shift: 'Night',
      lateMinutes: 0,
      earlyLeave: 0,
      breakTime: 30,
      location: 'Main Gate'
    }
  ])

  const departments = ['Front Office', 'Housekeeping', 'Restaurant', 'Kitchen', 'Maintenance', 'Administration', 'Security']
  const statuses = ['Present', 'Absent', 'Late', 'Half Day', 'On Leave']
  const shifts = ['Day', 'Night', 'Evening']

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = departmentFilter === '' || record.department === departmentFilter
    const matchesStatus = statusFilter === '' || record.status === statusFilter
    const matchesShift = shiftFilter === '' || record.shift === shiftFilter
    
    let matchesDateRange = true
    if (dateRange.start && dateRange.end) {
      const recordDate = new Date(record.date)
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      matchesDateRange = recordDate >= startDate && recordDate <= endDate
    }
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesShift && matchesDateRange
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-800'
      case 'Absent': return 'bg-red-100 text-red-800'
      case 'Late': return 'bg-yellow-100 text-yellow-800'
      case 'Half Day': return 'bg-orange-100 text-orange-800'
      case 'On Leave': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getShiftColor = (shift) => {
    switch (shift) {
      case 'Day': return 'bg-blue-100 text-blue-800'
      case 'Night': return 'bg-purple-100 text-purple-800'
      case 'Evening': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (time) => {
    if (!time) return '-'
    return time
  }

  const formatHours = (hours) => {
    return hours ? `${hours.toFixed(1)}h` : '0h'
  }

  const exportResults = () => {
    alert(`Exporting ${filteredRecords.length} attendance records...`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setDepartmentFilter('')
    setStatusFilter('')
    setDateRange({ start: '', end: '' })
    setShiftFilter('')
  }

  // Calculate statistics
  const totalRecords = filteredRecords.length
  const presentRecords = filteredRecords.filter(r => r.status === 'Present').length
  const absentRecords = filteredRecords.filter(r => r.status === 'Absent').length
  const lateRecords = filteredRecords.filter(r => r.status === 'Late').length
  const totalWorkingHours = filteredRecords.reduce((sum, r) => sum + r.workingHours, 0)
  const totalOvertime = filteredRecords.reduce((sum, r) => sum + r.overtime, 0)
  const attendanceRate = totalRecords > 0 ? ((presentRecords + lateRecords) / totalRecords * 100).toFixed(1) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Employee Attendance Search</h1>
            <p className="text-emerald-100">Search and analyze employee attendance records</p>
          </div>
          <ClockIcon className="h-12 w-12 text-emerald-200" />
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
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Export Results
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Shifts</option>
            {shifts.map(shift => (
              <option key={shift} value={shift}>{shift}</option>
            ))}
          </select>

          <div className="flex space-x-2">
            <input
              type="date"
              placeholder="From Date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="date"
              placeholder="To Date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-emerald-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900">{attendanceRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <UserIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Present</p>
              <p className="text-2xl font-bold text-gray-900">{presentRecords}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <XCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-gray-900">{absentRecords}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900">{formatHours(totalWorkingHours)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Attendance Records</h3>
            <p className="text-gray-600">Found {filteredRecords.length} attendance records</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              Total: {attendanceRecords.length}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In/Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-emerald-100 rounded-full p-2 mr-3">
                        <UserIcon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                        <div className="text-sm text-gray-500">{record.employeeId}</div>
                        <div className="text-sm text-gray-500">{record.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                      {record.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        In: <span className="font-medium">{formatTime(record.checkIn)}</span>
                      </div>
                      <div className="text-sm text-gray-900">
                        Out: <span className="font-medium">{formatTime(record.checkOut)}</span>
                      </div>
                      {record.lateMinutes > 0 && (
                        <div className="text-sm text-red-600">
                          Late: {record.lateMinutes} min
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{formatHours(record.workingHours)}</div>
                    {record.breakTime > 0 && (
                      <div className="text-sm text-gray-500">Break: {record.breakTime} min</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-orange-600">{formatHours(record.overtime)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getShiftColor(record.shift)}`}>
                      {record.shift}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{record.location || '-'}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No attendance records found</h3>
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
              <div className="text-2xl font-bold text-yellow-600">{lateRecords}</div>
              <div className="text-sm text-gray-600">Late Arrivals</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{formatHours(totalOvertime)}</div>
              <div className="text-sm text-gray-600">Total Overtime</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalRecords > 0 ? (totalWorkingHours / totalRecords).toFixed(1) : 0}h
              </div>
              <div className="text-sm text-gray-600">Avg Daily Hours</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeeAttendanceSearch;
