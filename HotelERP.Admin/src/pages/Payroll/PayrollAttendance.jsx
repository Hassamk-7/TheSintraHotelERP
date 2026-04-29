import { useState } from 'react'
import {
  ClockIcon,
  UserIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const PayrollAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedDepartment, setSelectedDepartment] = useState('')

  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      id: 1,
      employeeId: 'EMP-001',
      employeeName: 'Ahmed Hassan',
      department: 'Front Office',
      position: 'Receptionist',
      date: '2024-01-20',
      checkIn: '09:00',
      checkOut: '17:30',
      workingHours: 8.5,
      overtimeHours: 0.5,
      status: 'Present',
      lateMinutes: 0,
      earlyLeaveMinutes: 0,
      breakTime: 1.0
    },
    {
      id: 2,
      employeeId: 'EMP-002',
      employeeName: 'Sarah Khan',
      department: 'Restaurant',
      position: 'Head Chef',
      date: '2024-01-20',
      checkIn: '08:45',
      checkOut: '17:00',
      workingHours: 8.25,
      overtimeHours: 0.25,
      status: 'Present',
      lateMinutes: 0,
      earlyLeaveMinutes: 0,
      breakTime: 1.0
    },
    {
      id: 3,
      employeeId: 'EMP-003',
      employeeName: 'Ali Khan',
      department: 'Housekeeping',
      position: 'Supervisor',
      date: '2024-01-20',
      checkIn: '09:15',
      checkOut: '17:00',
      workingHours: 7.75,
      overtimeHours: 0,
      status: 'Late',
      lateMinutes: 15,
      earlyLeaveMinutes: 0,
      breakTime: 1.0
    },
    {
      id: 4,
      employeeId: 'EMP-004',
      employeeName: 'Fatima Sheikh',
      department: 'Housekeeping',
      position: 'Room Attendant',
      date: '2024-01-20',
      checkIn: null,
      checkOut: null,
      workingHours: 0,
      overtimeHours: 0,
      status: 'Absent',
      lateMinutes: 0,
      earlyLeaveMinutes: 0,
      breakTime: 0
    },
    {
      id: 5,
      employeeId: 'EMP-005',
      employeeName: 'Hassan Ahmed',
      department: 'Security',
      position: 'Security Guard',
      date: '2024-01-20',
      checkIn: '09:00',
      checkOut: '16:30',
      workingHours: 7.5,
      overtimeHours: 0,
      status: 'Early Leave',
      lateMinutes: 0,
      earlyLeaveMinutes: 30,
      breakTime: 1.0
    }
  ])

  const departments = ['All Departments', 'Front Office', 'Restaurant', 'Housekeeping', 'Security', 'Maintenance', 'Administration']

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesDate = record.date === selectedDate
    const matchesDepartment = selectedDepartment === '' || selectedDepartment === 'All Departments' || record.department === selectedDepartment
    return matchesDate && matchesDepartment
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-800'
      case 'Late': return 'bg-yellow-100 text-yellow-800'
      case 'Absent': return 'bg-red-100 text-red-800'
      case 'Early Leave': return 'bg-orange-100 text-orange-800'
      case 'Half Day': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present': return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'Late': return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
      case 'Absent': return <XCircleIcon className="h-5 w-5 text-red-600" />
      case 'Early Leave': return <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />
      default: return <ClockIcon className="h-5 w-5 text-gray-600" />
    }
  }

  const getDepartmentColor = (department) => {
    switch (department) {
      case 'Front Office': return 'bg-indigo-100 text-indigo-800'
      case 'Restaurant': return 'bg-orange-100 text-orange-800'
      case 'Housekeeping': return 'bg-green-100 text-green-800'
      case 'Security': return 'bg-red-100 text-red-800'
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'Administration': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const markAttendance = (employeeId, status) => {
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    
    setAttendanceRecords(records => 
      records.map(record => {
        if (record.employeeId === employeeId && record.date === selectedDate) {
          if (status === 'check-in') {
            return {
              ...record,
              checkIn: currentTime,
              status: 'Present'
            }
          } else if (status === 'check-out') {
            const checkInTime = new Date(`2024-01-01 ${record.checkIn}`)
            const checkOutTime = new Date(`2024-01-01 ${currentTime}`)
            const workingHours = (checkOutTime - checkInTime) / (1000 * 60 * 60) - record.breakTime
            
            return {
              ...record,
              checkOut: currentTime,
              workingHours: Math.max(0, workingHours),
              overtimeHours: Math.max(0, workingHours - 8)
            }
          }
        }
        return record
      })
    )
  }

  // Calculate statistics
  const totalEmployees = filteredRecords.length
  const presentEmployees = filteredRecords.filter(r => r.status === 'Present').length
  const lateEmployees = filteredRecords.filter(r => r.status === 'Late').length
  const absentEmployees = filteredRecords.filter(r => r.status === 'Absent').length
  const totalWorkingHours = filteredRecords.reduce((sum, r) => sum + r.workingHours, 0)
  const totalOvertimeHours = filteredRecords.reduce((sum, r) => sum + r.overtimeHours, 0)
  const attendanceRate = totalEmployees > 0 ? ((presentEmployees + lateEmployees) / totalEmployees * 100).toFixed(1) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Payroll Attendance</h1>
            <p className="text-emerald-100">Track employee attendance for payroll processing</p>
          </div>
          <ClockIcon className="h-12 w-12 text-emerald-200" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept === 'All Departments' ? '' : dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-emerald-100 rounded-lg p-3">
              <UserIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Present</p>
              <p className="text-2xl font-bold text-gray-900">{presentEmployees}</p>
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
              <p className="text-2xl font-bold text-gray-900">{absentEmployees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900">{attendanceRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Attendance for {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            <div className="text-sm text-gray-500">
              {filteredRecords.length} employees
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In/Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                        <div className="text-sm text-gray-500">{record.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(record.department)}`}>
                      {record.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        In: {record.checkIn || '--:--'}
                      </div>
                      <div className="text-sm text-gray-900">
                        Out: {record.checkOut || '--:--'}
                      </div>
                      {record.lateMinutes > 0 && (
                        <div className="text-sm text-red-600">
                          Late: {record.lateMinutes} min
                        </div>
                      )}
                      {record.earlyLeaveMinutes > 0 && (
                        <div className="text-sm text-orange-600">
                          Early: {record.earlyLeaveMinutes} min
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        Regular: {record.workingHours.toFixed(1)}h
                      </div>
                      {record.overtimeHours > 0 && (
                        <div className="text-sm text-blue-600">
                          Overtime: {record.overtimeHours.toFixed(1)}h
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        Break: {record.breakTime}h
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(record.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {!record.checkIn && (
                        <button
                          onClick={() => markAttendance(record.employeeId, 'check-in')}
                          className="text-green-600 hover:text-green-900 text-sm font-medium"
                        >
                          Check In
                        </button>
                      )}
                      {record.checkIn && !record.checkOut && (
                        <button
                          onClick={() => markAttendance(record.employeeId, 'check-out')}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Check Out
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No attendance records</h3>
            <p className="mt-2 text-gray-500">No attendance data found for the selected date and department.</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {filteredRecords.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{totalWorkingHours.toFixed(1)}h</div>
              <div className="text-sm text-gray-600">Total Working Hours</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalOvertimeHours.toFixed(1)}h</div>
              <div className="text-sm text-gray-600">Total Overtime Hours</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{lateEmployees}</div>
              <div className="text-sm text-gray-600">Late Arrivals</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PayrollAttendance;
