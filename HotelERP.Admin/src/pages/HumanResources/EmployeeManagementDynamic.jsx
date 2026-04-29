import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

const EmployeeManagementDynamic = () => {
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('All Departments')
  const [showForm, setShowForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [departments, setDepartments] = useState(['All Departments', 'Front Office', 'Housekeeping', 'Restaurant', 'Kitchen', 'Maintenance', 'HR', 'Finance'])

  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    mobileNumber: '',
    department: '',
    designation: '',
    basicSalary: 0,
    joiningDate: '',
    status: 'Active',
    gender: '',
    dateOfBirth: '',
    address: '',
    city: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    employmentType: 'Full-time'
  })

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/PayrollHR/employees?pageSize=100')
      setEmployees(response.data?.data || [])
    } catch (err) {
      setError('Failed to fetch employees: ' + (err.response?.data?.message || err.message))
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchEmployees()
  }, [])

  // Filter employees
  useEffect(() => {
    let filtered = employees.filter(emp => {
      const matchSearch = emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchDept = departmentFilter === 'All Departments' || emp.department === departmentFilter
      return matchSearch && matchDept
    })
    setFilteredEmployees(filtered)
  }, [searchTerm, departmentFilter, employees])

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (editingEmployee) {
        // Update employee
        await axios.put(`/PayrollHR/employees/${editingEmployee.id}`, formData)
        setSuccess('Employee updated successfully')
        setEditingEmployee(null)
      } else {
        // Create employee
        await axios.post('/PayrollHR/employees', formData)
        setSuccess('Employee created successfully')
      }

      // Reset form
      setFormData({
        employeeId: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        mobileNumber: '',
        department: '',
        designation: '',
        basicSalary: 0,
        joiningDate: '',
        status: 'Active',
        gender: '',
        dateOfBirth: '',
        address: '',
        city: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        employmentType: 'Full-time'
      })
      setShowForm(false)
      fetchEmployees()
    } catch (err) {
      setError('Failed to save employee: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  // Handle edit
  const handleEdit = (employee) => {
    setEditingEmployee(employee)
    setFormData({
      employeeId: employee.employeeId || '',
      firstName: employee.firstName || '',
      lastName: employee.lastName || '',
      email: employee.email || '',
      phoneNumber: employee.phoneNumber || '',
      mobileNumber: employee.mobileNumber || '',
      department: employee.department || '',
      designation: employee.designation || '',
      basicSalary: employee.basicSalary || 0,
      joiningDate: employee.joiningDate ? employee.joiningDate.split('T')[0] : '',
      status: employee.status || 'Active',
      gender: employee.gender || '',
      dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.split('T')[0] : '',
      address: employee.address || '',
      city: employee.city || '',
      emergencyContactName: employee.emergencyContactName || '',
      emergencyContactPhone: employee.emergencyContactPhone || '',
      employmentType: employee.employmentType || 'Full-time'
    })
    setShowForm(true)
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        setLoading(true)
        await axios.delete(`/PayrollHR/employees/${id}`)
        setSuccess('Employee deleted successfully')
        fetchEmployees()
      } catch (err) {
        setError('Failed to delete employee: ' + (err.response?.data?.message || err.message))
      } finally {
        setLoading(false)
      }
    }
  }

  const totalEmployees = employees.length
  const activeEmployees = employees.filter(e => e.status === 'Active').length
  const totalPayroll = employees.reduce((sum, e) => sum + (e.basicSalary || 0), 0)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-700 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Employee Management</h1>
        <p className="text-blue-100">Manage employee information, salaries, and status</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center gap-2">
          <XCircleIcon className="h-5 w-5 flex-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 flex items-center gap-2">
          <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
          {success}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
            </div>
            <div className="text-4xl text-blue-100">👥</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Employees</p>
              <p className="text-3xl font-bold text-green-600">{activeEmployees}</p>
            </div>
            <div className="text-4xl text-green-100">✓</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Payroll</p>
              <p className="text-3xl font-bold text-gray-900">Rs {(totalPayroll / 100000).toFixed(1)}L</p>
            </div>
            <div className="text-4xl text-blue-100">💰</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{editingEmployee ? 'Edit Employee' : 'New Employee'}</h2>
              {showForm && (
                <button
                  onClick={() => {
                    setShowForm(false)
                    setEditingEmployee(null)
                    setFormData({
                      employeeId: '',
                      firstName: '',
                      lastName: '',
                      email: '',
                      phoneNumber: '',
                      mobileNumber: '',
                      department: '',
                      designation: '',
                      basicSalary: 0,
                      joiningDate: '',
                      status: 'Active',
                      gender: '',
                      dateOfBirth: '',
                      address: '',
                      city: '',
                      emergencyContactName: '',
                      emergencyContactPhone: '',
                      employmentType: 'Full-time'
                    })
                  }}
                  className="text-gray-500 hover:text-gray-700 text-xl"
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
                Add Employee
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Employee ID *</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    placeholder="EMP-001"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@hotel.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+92-300-1234567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select Department</option>
                    {departments.filter(d => d !== 'All Departments').map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="Job Title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Basic Salary</label>
                  <input
                    type="number"
                    name="basicSalary"
                    value={formData.basicSalary}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Joining Date</label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium text-sm"
                  >
                    {loading ? 'Saving...' : editingEmployee ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingEmployee(null)
                    }}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Employees Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {loading && !employees.length ? (
              <div className="p-8 text-center text-gray-500">Loading employees...</div>
            ) : filteredEmployees.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No employees found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Salary</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">
                          <div className="font-medium text-gray-900">{emp.firstName} {emp.lastName}</div>
                          <div className="text-xs text-gray-500">{emp.employeeId}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div>{emp.phoneNumber}</div>
                          <div className="text-xs">{emp.email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{emp.department}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{emp.designation}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">Rs {emp.basicSalary?.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            emp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(emp)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(emp.id)}
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
            )}
            <div className="bg-gray-50 px-6 py-3 text-sm text-gray-600">
              Showing {filteredEmployees.length} of {employees.length} employees
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeManagementDynamic
