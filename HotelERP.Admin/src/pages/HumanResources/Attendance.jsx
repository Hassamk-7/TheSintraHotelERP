import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  ClockIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as TimeIcon,
  UserIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load attendance data on component mount and date change
  useEffect(() => {
    fetchAttendanceData()
  }, [selectedDate])

  // Fetch attendance data from API
  const fetchAttendanceData = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get(`/PayrollHR/employee-attendance?date=${selectedDate}`)
      if (response.data.success) {
        // Transform API data to match component expectations
        const transformedData = response.data.data.map(record => ({
          id: record.id,
          employeeId: record.employee?.employeeCode || record.employeeId,
          name: record.employee ? `${record.employee.firstName} ${record.employee.lastName}` : 'Unknown',
          department: record.employee?.department || 'N/A',
          position: record.employee?.position || 'N/A',
          checkIn: record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : null,
          checkOut: record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : null,
          workingHours: record.workingHours || 0,
          status: record.status || 'Absent',
          overtime: record.overtimeHours || 0,
          date: record.attendanceDate,
          notes: record.notes
        }))
        setAttendanceData(transformedData)
      } else {
        setError('Failed to fetch attendance data')
      }
    } catch (err) {
      console.error('Error fetching attendance data:', err)
      setError('Error loading attendance data. Please try again.')
      setAttendanceData([])
    } finally {
      setLoading(false)
    }
  }

  const departments = ['Front Office', 'Housekeeping', 'Restaurant', 'Kitchen', 'Maintenance', 'Administration', 'Security']
  const statuses = ['Present', 'Absent', 'Late', 'Half Day', 'On Leave']

  const markAttendance = async (attendanceId, status, checkIn = null, checkOut = null) => {
    try {
      setLoading(true)
      setError('')
      
      const attendanceRecord = {
        status: status,
        checkInTime: checkIn ? new Date(`2024-01-01 ${checkIn}`).toISOString() : null,
        checkOutTime: checkOut ? new Date(`2024-01-01 ${checkOut}`).toISOString() : null,
        workingHours: checkIn && checkOut ? calculateWorkingHours(checkIn, checkOut) : 0
      }
      
      const response = await axios.put(`/PayrollHR/employee-attendance/${attendanceId}`, attendanceRecord)
      if (response.data.success) {
        setSuccess('Attendance marked successfully!')
        fetchAttendanceData()
      } else {
        setError('Failed to mark attendance')
      }
    } catch (error) {
      console.error('Error marking attendance:', error)
      setError('Error marking attendance: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const calculateWorkingHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(`2024-01-01 ${checkIn}`)
    const end = new Date(`2024-01-01 ${checkOut}`)
    if (end < start) end.setDate(end.getDate() + 1) // Handle night shifts
    return (end - start) / (1000 * 60 * 60)
  }

  // Mark all employees as present
  const markAllPresent = async () => {
    try {
      setLoading(true)
      setError('')
      let successCount = 0
      let failureCount = 0

      for (const employee of attendanceData) {
        try {
          const today = new Date()
          const checkInTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0)
          const checkOutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0, 0)
          
          const attendanceRecord = {
            status: 'Present',
            checkInTime: checkInTime.toISOString(),
            checkOutTime: checkOutTime.toISOString(),
            workingHours: 9
          }
          const response = await axios.put(`/PayrollHR/employee-attendance/${employee.id}`, attendanceRecord)
          if (response.data.success) {
            successCount++
          } else {
            failureCount++
          }
        } catch (err) {
          failureCount++
        }
      }

      if (successCount > 0) {
        setSuccess(`Marked ${successCount} employees as present!`)
        fetchAttendanceData()
      }
      if (failureCount > 0) {
        setError(`Failed to mark ${failureCount} employees`)
      }
    } catch (error) {
      console.error('Error marking all present:', error)
      setError('Error marking all present: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Bulk check-in for all employees
  const bulkCheckIn = async () => {
    try {
      setLoading(true)
      setError('')
      const now = new Date()
      const checkInTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      
      let successCount = 0
      let failureCount = 0

      for (const employee of attendanceData) {
        if (employee.status !== 'Present' || !employee.checkIn) {
          try {
            const attendanceRecord = {
              status: 'Present',
              checkInTime: new Date().toISOString(),
              checkOutTime: null,
              workingHours: 0
            }
            const response = await axios.put(`/PayrollHR/employee-attendance/${employee.id}`, attendanceRecord)
            if (response.data.success) {
              successCount++
            } else {
              failureCount++
            }
          } catch (err) {
            failureCount++
          }
        }
      }

      if (successCount > 0) {
        setSuccess(`Checked in ${successCount} employees at ${checkInTime}!`)
        fetchAttendanceData()
      }
      if (failureCount > 0) {
        setError(`Failed to check in ${failureCount} employees`)
      }
    } catch (error) {
      console.error('Error bulk check-in:', error)
      setError('Error bulk check-in: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Generate report
  const generateReport = () => {
    try {
      const reportData = attendanceData.map(emp => ({
        'Employee ID': emp.employeeId,
        'Name': emp.name,
        'Department': emp.department,
        'Check In': emp.checkIn || 'N/A',
        'Check Out': emp.checkOut || 'N/A',
        'Working Hours': emp.workingHours || 0,
        'Overtime': emp.overtime || 0,
        'Status': emp.status
      }))

      const csv = [
        Object.keys(reportData[0]).join(','),
        ...reportData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n')

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `attendance-${selectedDate}.csv`
      a.click()
      window.URL.revokeObjectURL(url)

      setSuccess('Report generated successfully!')
    } catch (error) {
      console.error('Error generating report:', error)
      setError('Error generating report: ' + error.message)
    }
  }

  // Generate overtime report
  const generateOvertimeReport = () => {
    try {
      const overtimeData = attendanceData
        .filter(emp => emp.overtime > 0)
        .map(emp => ({
          'Employee ID': emp.employeeId,
          'Name': emp.name,
          'Department': emp.department,
          'Overtime Hours': emp.overtime,
          'Date': selectedDate
        }))

      if (overtimeData.length === 0) {
        setError('No overtime records found for this date')
        return
      }

      const csv = [
        Object.keys(overtimeData[0]).join(','),
        ...overtimeData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n')

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `overtime-${selectedDate}.csv`
      a.click()
      window.URL.revokeObjectURL(url)

      setSuccess(`Overtime report generated! (${overtimeData.length} records)`)
    } catch (error) {
      console.error('Error generating overtime report:', error)
      setError('Error generating overtime report: ' + error.message)
    }
  }

  const filteredAttendance = attendanceData.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === '' || emp.department === departmentFilter
    const matchesStatus = statusFilter === '' || emp.status === statusFilter
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-800'
      case 'Absent': return 'bg-red-100 text-red-800'
      case 'Late': return 'bg-yellow-100 text-yellow-800'
      case 'Half Day': return 'bg-blue-100 text-blue-800'
      case 'On Leave': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDepartmentColor = (department) => {
    switch (department) {
      case 'Front Office': return 'bg-blue-100 text-blue-800'
      case 'Housekeeping': return 'bg-green-100 text-green-800'
      case 'Restaurant': return 'bg-purple-100 text-purple-800'
      case 'Kitchen': return 'bg-orange-100 text-orange-800'
      case 'Maintenance': return 'bg-red-100 text-red-800'
      case 'Administration': return 'bg-indigo-100 text-indigo-800'
      case 'Security': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Calculate statistics
  const totalEmployees = attendanceData.length
  const presentEmployees = attendanceData.filter(emp => emp.status === 'Present').length
  const absentEmployees = attendanceData.filter(emp => emp.status === 'Absent').length
  const lateEmployees = attendanceData.filter(emp => emp.status === 'Late').length
  const attendanceRate = ((presentEmployees / totalEmployees) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          {success}
        </div>
      )}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
          Loading attendance data...
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Attendance Management</h1>
            <p className="text-emerald-100">Track employee attendance and working hours</p>
          </div>
          <ClockIcon className="h-12 w-12 text-emerald-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-emerald-100 rounded-lg p-3">
              <UserIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
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
            <div className="bg-yellow-100 rounded-lg p-3">
              <TimeIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Late</p>
              <p className="text-2xl font-bold text-gray-900">{lateEmployees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-teal-100 rounded-lg p-3">
              <CalendarDaysIcon className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rate</p>
              <p className="text-2xl font-bold text-gray-900">{attendanceRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-10 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200">
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={markAllPresent}
            disabled={loading}
            className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Mark All Present
          </button>
          <button 
            onClick={bulkCheckIn}
            disabled={loading}
            className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ClockIcon className="h-5 w-5 mr-2" />
            Bulk Check-In
          </button>
          <button 
            onClick={generateReport}
            disabled={loading || attendanceData.length === 0}
            className="flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CalendarDaysIcon className="h-5 w-5 mr-2" />
            Generate Report
          </button>
          <button 
            onClick={generateOvertimeReport}
            disabled={loading}
            className="flex items-center justify-center px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TimeIcon className="h-5 w-5 mr-2" />
            Overtime Report
          </button>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Daily Attendance - {new Date(selectedDate).toLocaleDateString()}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredAttendance.length} employees
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendance.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-emerald-100 rounded-full p-2 mr-3">
                        <UserIcon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.employeeId}</div>
                        <div className="text-sm text-gray-500">{employee.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(employee.department)}`}>
                      {employee.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {employee.checkIn || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {employee.checkOut || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {employee.workingHours ? `${employee.workingHours}h` : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${employee.overtime > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
                      {employee.overtime > 0 ? `+${employee.overtime}h` : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {employee.status === 'Absent' && (
                        <button
                          onClick={() => markAttendance(employee.id, 'Present', '09:00', null)}
                          className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 transition-colors"
                        >
                          Mark Present
                        </button>
                      )}
                      {employee.status === 'Present' && !employee.checkOut && (
                        <button
                          onClick={() => markAttendance(employee.id, 'Present', employee.checkIn, '18:00')}
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                        >
                          Check Out
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50 transition-colors">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{presentEmployees}</div>
            <div className="text-sm text-gray-600">Present Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{absentEmployees}</div>
            <div className="text-sm text-gray-600">Absent Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {attendanceData.reduce((sum, emp) => sum + emp.overtime, 0).toFixed(1)}h
            </div>
            <div className="text-sm text-gray-600">Total Overtime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{attendanceRate}%</div>
            <div className="text-sm text-gray-600">Attendance Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Attendance;
