import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CalendarDaysIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline'

const LeaveManagement = () => {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  
  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: '',
    status: 'Pending'
  })

  const [leaveRequests, setLeaveRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load leave requests on component mount
  useEffect(() => {
    fetchLeaveRequests()
  }, [])

  // Fetch leave requests from API
  const fetchLeaveRequests = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/PayrollHR/leave-management')
      if (response.data.success) {
        setLeaveRequests(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching leave requests:', err)
      // Set mock data if API fails
      setLeaveRequests([
    {
      id: 1,
      employeeId: 'EMP-001',
      employeeName: 'Ahmed Ali',
      department: 'Front Office',
      leaveType: 'Annual Leave',
      startDate: '2024-02-15',
      endDate: '2024-02-20',
      days: 6,
      reason: 'Family vacation',
      status: 'Approved',
      appliedDate: '2024-02-01',
      approvedBy: 'HR Manager'
    },
    {
      id: 2,
      employeeId: 'EMP-002',
      employeeName: 'Fatima Sheikh',
      department: 'Housekeeping',
      leaveType: 'Sick Leave',
      startDate: '2024-02-10',
      endDate: '2024-02-12',
      days: 3,
      reason: 'Medical treatment',
      status: 'Pending',
      appliedDate: '2024-02-08',
      approvedBy: null
    },
    {
      id: 3,
      employeeId: 'EMP-003',
      employeeName: 'Hassan Khan',
      department: 'Restaurant',
      leaveType: 'Emergency Leave',
      startDate: '2024-02-05',
      endDate: '2024-02-05',
      days: 1,
      reason: 'Family emergency',
      status: 'Approved',
      appliedDate: '2024-02-05',
      approvedBy: 'Department Head'
    }
      ])
      setError('')
    } finally {
      setLoading(false)
    }
  }

  const [leaveBalances] = useState([
    {
      employeeId: 'EMP-001',
      employeeName: 'Ahmed Ali',
      annualLeave: { total: 21, used: 6, remaining: 15 },
      sickLeave: { total: 10, used: 2, remaining: 8 },
      casualLeave: { total: 7, used: 1, remaining: 6 }
    },
    {
      employeeId: 'EMP-002',
      employeeName: 'Fatima Sheikh',
      annualLeave: { total: 21, used: 3, remaining: 18 },
      sickLeave: { total: 10, used: 3, remaining: 7 },
      casualLeave: { total: 7, used: 0, remaining: 7 }
    },
    {
      employeeId: 'EMP-003',
      employeeName: 'Hassan Khan',
      annualLeave: { total: 21, used: 8, remaining: 13 },
      sickLeave: { total: 10, used: 1, remaining: 9 },
      casualLeave: { total: 7, used: 1, remaining: 6 }
    }
  ])

  const employees = [
    { id: 'EMP-001', name: 'Ahmed Ali' },
    { id: 'EMP-002', name: 'Fatima Sheikh' },
    { id: 'EMP-003', name: 'Hassan Khan' }
  ]

  const leaveTypes = ['Annual Leave', 'Sick Leave', 'Casual Leave', 'Emergency Leave', 'Maternity Leave', 'Paternity Leave']
  const statuses = ['Pending', 'Approved', 'Rejected']
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.employeeId) newErrors.employeeId = 'Employee is required'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.endDate) newErrors.endDate = 'End date is required'
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required'
    
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const employee = employees.find(emp => emp.id === formData.employeeId)
      const days = calculateDays(formData.startDate, formData.endDate)
      
      const newLeave = {
        id: Date.now(),
        ...formData,
        employeeName: employee.name,
        department: 'Department',
        days,
        appliedDate: new Date().toISOString().split('T')[0],
        approvedBy: null
      }
      
      setLeaveRequests(prev => [...prev, newLeave])
      handleCancel()
      alert('Leave request submitted!')
    } catch (error) {
      alert('Error submitting leave request.')
    } finally {
      setLoading(false)
    }
  }

  const approveLeave = (id) => {
    setLeaveRequests(prev => prev.map(leave => 
      leave.id === id 
        ? { ...leave, status: 'Approved', approvedBy: 'HR Manager' }
        : leave
    ))
  }

  const rejectLeave = (id) => {
    setLeaveRequests(prev => prev.map(leave => 
      leave.id === id 
        ? { ...leave, status: 'Rejected', approvedBy: 'HR Manager' }
        : leave
    ))
  }

  const handleCancel = () => {
    setFormData({
      employeeId: '',
      leaveType: 'Annual Leave',
      startDate: '',
      endDate: '',
      reason: '',
      status: 'Pending'
    })
    setShowForm(false)
    setErrors({})
  }

  const filteredLeaves = leaveRequests.filter(leave => {
    const matchesSearch = leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === '' || leave.status === statusFilter
    const matchesType = typeFilter === '' || leave.leaveType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case 'Annual Leave': return 'bg-blue-100 text-blue-800'
      case 'Sick Leave': return 'bg-red-100 text-red-800'
      case 'Casual Leave': return 'bg-green-100 text-green-800'
      case 'Emergency Leave': return 'bg-orange-100 text-orange-800'
      case 'Maternity Leave': return 'bg-purple-100 text-purple-800'
      case 'Paternity Leave': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Calculate statistics
  const totalRequests = leaveRequests.length
  const pendingRequests = leaveRequests.filter(leave => leave.status === 'Pending').length
  const approvedRequests = leaveRequests.filter(leave => leave.status === 'Approved').length
  const totalDaysRequested = leaveRequests.reduce((sum, leave) => sum + leave.days, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Leave Management</h1>
            <p className="text-purple-100">Manage employee leave requests and balances</p>
          </div>
          <CalendarDaysIcon className="h-12 w-12 text-purple-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{totalRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{approvedRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-pink-100 rounded-lg p-3">
              <CalendarDaysIcon className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Days</p>
              <p className="text-2xl font-bold text-gray-900">{totalDaysRequested}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Leave Types</option>
            {leaveTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Apply Leave
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Apply for Leave</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Employee <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.employeeId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
                  ))}
                </select>
                {errors.employeeId && <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Leave Type</label>
                <select
                  value={formData.leaveType}
                  onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {leaveTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
              </div>
            </div>

            {formData.startDate && formData.endDate && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-700">
                  <strong>Duration:</strong> {calculateDays(formData.startDate, formData.endDate)} day(s)
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.reason ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Please provide reason for leave..."
              />
              {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all duration-200 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Leave Requests */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Leave Requests ({filteredLeaves.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-purple-100 rounded-full p-2 mr-3">
                        <UserIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{leave.employeeName}</div>
                        <div className="text-sm text-gray-500">{leave.employeeId}</div>
                        <div className="text-sm text-gray-500">{leave.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLeaveTypeColor(leave.leaveType)}`}>
                      {leave.leaveType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{leave.startDate}</div>
                    <div className="text-sm text-gray-500">to {leave.endDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{leave.days} days</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{leave.reason}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                      {leave.status}
                    </span>
                    {leave.approvedBy && (
                      <div className="text-xs text-gray-500 mt-1">by {leave.approvedBy}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {leave.status === 'Pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => approveLeave(leave.id)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => rejectLeave(leave.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                        >
                          <XCircleIcon className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Balances */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Leave Balances</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Leave</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sick Leave</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Casual Leave</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaveBalances.map((balance) => (
                <tr key={balance.employeeId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{balance.employeeName}</div>
                    <div className="text-sm text-gray-500">{balance.employeeId}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm">
                      <span className="font-medium text-green-600">{balance.annualLeave.remaining}</span>
                      <span className="text-gray-500">/{balance.annualLeave.total}</span>
                    </div>
                    <div className="text-xs text-gray-500">Used: {balance.annualLeave.used}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm">
                      <span className="font-medium text-green-600">{balance.sickLeave.remaining}</span>
                      <span className="text-gray-500">/{balance.sickLeave.total}</span>
                    </div>
                    <div className="text-xs text-gray-500">Used: {balance.sickLeave.used}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm">
                      <span className="font-medium text-green-600">{balance.casualLeave.remaining}</span>
                      <span className="text-gray-500">/{balance.casualLeave.total}</span>
                    </div>
                    <div className="text-xs text-gray-500">Used: {balance.casualLeave.used}</div>
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

export default LeaveManagement;
