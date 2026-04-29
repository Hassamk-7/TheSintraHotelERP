import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

const LeaveManagementModule = () => {
  // Mock data - 15 leave records
  const MOCK_LEAVES = [
    { id: 1, employeeId: 'EMP-001', employeeName: 'Ahmed Hassan', leaveType: 'Annual', fromDate: '2025-01-15', toDate: '2025-01-20', days: 6, reason: 'Personal vacation', status: 'Approved', approvedBy: 'Manager 1', approvalDate: '2024-12-20' },
    { id: 2, employeeId: 'EMP-002', employeeName: 'Sarah Khan', leaveType: 'Sick', fromDate: '2025-01-10', toDate: '2025-01-12', days: 3, reason: 'Medical treatment', status: 'Approved', approvedBy: 'Manager 2', approvalDate: '2024-12-18' },
    { id: 3, employeeId: 'EMP-003', employeeName: 'Ali Raza', leaveType: 'Annual', fromDate: '2025-02-01', toDate: '2025-02-10', days: 10, reason: 'Family visit', status: 'Pending', approvedBy: '', approvalDate: null },
    { id: 4, employeeId: 'EMP-004', employeeName: 'Fatima Ali', leaveType: 'Maternity', fromDate: '2025-03-01', toDate: '2025-05-31', days: 92, reason: 'Maternity leave', status: 'Approved', approvedBy: 'HR Manager', approvalDate: '2024-12-15' },
    { id: 5, employeeId: 'EMP-005', employeeName: 'Hassan Ahmed', leaveType: 'Casual', fromDate: '2025-01-25', toDate: '2025-01-26', days: 2, reason: 'Personal work', status: 'Pending', approvedBy: '', approvalDate: null },
    { id: 6, employeeId: 'EMP-006', employeeName: 'Ayesha Malik', leaveType: 'Sick', fromDate: '2025-01-05', toDate: '2025-01-07', days: 3, reason: 'Fever and cold', status: 'Approved', approvedBy: 'Manager 1', approvalDate: '2024-12-22' },
    { id: 7, employeeId: 'EMP-007', employeeName: 'Muhammad Tariq', leaveType: 'Annual', fromDate: '2025-02-15', toDate: '2025-02-25', days: 11, reason: 'Holiday trip', status: 'Rejected', approvedBy: 'Manager 2', approvalDate: '2024-12-19' },
    { id: 8, employeeId: 'EMP-008', employeeName: 'Zainab Hassan', leaveType: 'Emergency', fromDate: '2025-01-08', toDate: '2025-01-09', days: 2, reason: 'Family emergency', status: 'Approved', approvedBy: 'Manager 1', approvalDate: '2024-12-21' },
    { id: 9, employeeId: 'EMP-009', employeeName: 'Omar Khan', leaveType: 'Annual', fromDate: '2025-03-10', toDate: '2025-03-20', days: 11, reason: 'Vacation', status: 'Pending', approvedBy: '', approvalDate: null },
    { id: 10, employeeId: 'EMP-010', employeeName: 'Hira Ahmed', leaveType: 'Casual', fromDate: '2025-01-30', toDate: '2025-01-31', days: 2, reason: 'Personal appointment', status: 'Approved', approvedBy: 'Manager 2', approvalDate: '2024-12-23' },
    { id: 11, employeeId: 'EMP-011', employeeName: 'Bilal Hussain', leaveType: 'Sick', fromDate: '2025-02-05', toDate: '2025-02-07', days: 3, reason: 'Dental treatment', status: 'Pending', approvedBy: '', approvalDate: null },
    { id: 12, employeeId: 'EMP-012', employeeName: 'Nida Khan', leaveType: 'Annual', fromDate: '2025-04-01', toDate: '2025-04-15', days: 15, reason: 'Extended vacation', status: 'Approved', approvedBy: 'HR Manager', approvalDate: '2024-12-10' },
    { id: 13, employeeId: 'EMP-013', employeeName: 'Rashid Ali', leaveType: 'Casual', fromDate: '2025-02-20', toDate: '2025-02-21', days: 2, reason: 'Personal work', status: 'Approved', approvedBy: 'Manager 1', approvalDate: '2024-12-20' },
    { id: 14, employeeId: 'EMP-014', employeeName: 'Amina Hassan', leaveType: 'Emergency', fromDate: '2025-01-12', toDate: '2025-01-13', days: 2, reason: 'Family matter', status: 'Approved', approvedBy: 'Manager 2', approvalDate: '2024-12-21' },
    { id: 15, employeeId: 'EMP-015', employeeName: 'Karim Ahmed', leaveType: 'Annual', fromDate: '2025-05-01', toDate: '2025-05-10', days: 10, reason: 'Summer vacation', status: 'Pending', approvedBy: '', approvalDate: null }
  ]

  const [leaves, setLeaves] = useState(MOCK_LEAVES)
  const [filteredLeaves, setFilteredLeaves] = useState(MOCK_LEAVES)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingLeave, setEditingLeave] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    leaveType: 'Annual',
    fromDate: '',
    toDate: '',
    days: 0,
    reason: '',
    status: 'Pending',
    approvedBy: '',
    approvalDate: ''
  })

  // Filter leaves based on search and status
  useEffect(() => {
    let filtered = leaves.filter(leave => {
      const matchSearch = leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchStatus = filterStatus === 'All' || leave.status === filterStatus
      return matchSearch && matchStatus
    })
    setFilteredLeaves(filtered)
  }, [searchTerm, filterStatus, leaves])

  // Calculate days between dates
  const calculateDays = (fromDate, toDate) => {
    if (fromDate && toDate) {
      const from = new Date(fromDate)
      const to = new Date(toDate)
      const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1
      return days > 0 ? days : 0
    }
    return 0
  }

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = { ...prev, [name]: value }
      if (name === 'fromDate' || name === 'toDate') {
        updated.days = calculateDays(updated.fromDate, updated.toDate)
      }
      return updated
    })
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (editingLeave) {
        // Update existing leave
        setLeaves(leaves.map(leave => leave.id === editingLeave.id ? { ...formData, id: editingLeave.id } : leave))
        setSuccess('Leave request updated successfully')
        setEditingLeave(null)
      } else {
        // Add new leave
        const newLeave = {
          id: Math.max(...leaves.map(l => l.id), 0) + 1,
          ...formData
        }
        setLeaves([...leaves, newLeave])
        setSuccess('Leave request created successfully')
      }

      // Reset form
      setFormData({
        employeeId: '',
        employeeName: '',
        leaveType: 'Annual',
        fromDate: '',
        toDate: '',
        days: 0,
        reason: '',
        status: 'Pending',
        approvedBy: '',
        approvalDate: ''
      })
      setShowForm(false)
    } catch (err) {
      setError('Failed to save leave request')
    } finally {
      setLoading(false)
    }
  }

  // Handle edit
  const handleEdit = (leave) => {
    setEditingLeave(leave)
    setFormData(leave)
    setShowForm(true)
  }

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this leave request?')) {
      setLeaves(leaves.filter(leave => leave.id !== id))
      setSuccess('Leave request deleted successfully')
    }
  }

  // Handle approve
  const handleApprove = (id) => {
    setLeaves(leaves.map(leave =>
      leave.id === id
        ? { ...leave, status: 'Approved', approvedBy: 'Admin', approvalDate: new Date().toISOString().split('T')[0] }
        : leave
    ))
    setSuccess('Leave request approved')
  }

  // Handle reject
  const handleReject = (id) => {
    setLeaves(leaves.map(leave =>
      leave.id === id
        ? { ...leave, status: 'Rejected', approvedBy: 'Admin', approvalDate: new Date().toISOString().split('T')[0] }
        : leave
    ))
    setSuccess('Leave request rejected')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800'
      case 'Rejected': return 'bg-red-100 text-red-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-700 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Leave Management</h1>
        <p className="text-blue-100">Manage employee leave requests and approvals</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center gap-2">
          <XCircleIcon className="h-5 w-5" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 flex items-center gap-2">
          <CheckCircleIcon className="h-5 w-5" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{editingLeave ? 'Edit Leave Request' : 'New Leave Request'}</h2>
              {showForm && (
                <button
                  onClick={() => {
                    setShowForm(false)
                    setEditingLeave(null)
                    setFormData({
                      employeeId: '',
                      employeeName: '',
                      leaveType: 'Annual',
                      fromDate: '',
                      toDate: '',
                      days: 0,
                      reason: '',
                      status: 'Pending',
                      approvedBy: '',
                      approvalDate: ''
                    })
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>

            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                <PlusIcon className="h-5 w-5" />
                Add New Leave Request
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    placeholder="EMP-001"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name *</label>
                  <input
                    type="text"
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type *</label>
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Annual">Annual</option>
                    <option value="Sick">Sick</option>
                    <option value="Casual">Casual</option>
                    <option value="Maternity">Maternity</option>
                    <option value="Paternity">Paternity</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date *</label>
                  <input
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date *</label>
                  <input
                    type="date"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Days</label>
                  <input
                    type="number"
                    name="days"
                    value={formData.days}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="Leave reason"
                    required
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                  >
                    {loading ? 'Saving...' : editingLeave ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingLeave(null)
                    }}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Leave Requests List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Days</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLeaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        <div className="font-medium text-gray-900">{leave.employeeName}</div>
                        <div className="text-xs text-gray-500">{leave.employeeId}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{leave.leaveType}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-center font-medium">{leave.days}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(leave.status)}`}>
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          {leave.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(leave.id)}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                title="Approve"
                              >
                                <CheckCircleIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleReject(leave.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="Reject"
                              >
                                <XCircleIcon className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleEdit(leave)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(leave.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-6 py-3 text-sm text-gray-600">
              Showing {filteredLeaves.length} of {leaves.length} leave requests
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaveManagementModule
