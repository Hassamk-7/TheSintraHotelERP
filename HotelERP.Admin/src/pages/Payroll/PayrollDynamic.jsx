import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const PayrollDynamic = () => {
  const [activeTab, setActiveTab] = useState('employees')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Employees state
  const [employees, setEmployees] = useState([])
  const [showEmployeeForm, setShowEmployeeForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [employeeForm, setEmployeeForm] = useState({
    firstName: '', lastName: '', employeeId: '', email: '', phoneNumber: '',
    department: '', designation: '', basicSalary: 0, status: 'Active'
  })

  // Attendance state
  const [attendances, setAttendances] = useState([])
  const [showAttendanceForm, setShowAttendanceForm] = useState(false)
  const [attendanceForm, setAttendanceForm] = useState({
    employeeId: '', attendanceDate: new Date().toISOString().split('T')[0],
    status: 'Present', checkInTime: '', checkOutTime: ''
  })

  // Payments state
  const [payments, setPayments] = useState([])
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentForm, setPaymentForm] = useState({
    employeeId: '', paymentMonth: new Date().getMonth() + 1,
    paymentYear: new Date().getFullYear(), basicSalary: 0, allowances: 0,
    deductions: 0, overtimeAmount: 0, bonus: 0, paymentMethod: 'Bank Transfer'
  })

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/PayrollHR/employees')
      setEmployees(response.data?.data || [])
    } catch (err) {
      setError('Failed to fetch employees')
    } finally {
      setLoading(false)
    }
  }

  // Fetch attendance
  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/PayrollHR/employee-attendance')
      setAttendances(response.data?.data || [])
    } catch (err) {
      setError('Failed to fetch attendance')
    } finally {
      setLoading(false)
    }
  }

  // Fetch payments
  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/PayrollHR/employee-payments')
      setPayments(response.data?.data || [])
    } catch (err) {
      setError('Failed to fetch payments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'employees') fetchEmployees()
    else if (activeTab === 'attendance') fetchAttendance()
    else if (activeTab === 'payments') fetchPayments()
  }, [activeTab])

  // Handle employee submit
  const handleEmployeeSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (editingEmployee) {
        await axios.put(`/PayrollHR/employees/${editingEmployee.id}`, employeeForm)
        setSuccess('Employee updated successfully')
      } else {
        await axios.post('/PayrollHR/employees', employeeForm)
        setSuccess('Employee created successfully')
      }
      setShowEmployeeForm(false)
      setEditingEmployee(null)
      setEmployeeForm({ firstName: '', lastName: '', employeeId: '', email: '', phoneNumber: '',
        department: '', designation: '', basicSalary: 0, status: 'Active' })
      fetchEmployees()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save employee')
    } finally {
      setLoading(false)
    }
  }

  // Handle attendance submit
  const handleAttendanceSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await axios.post('/PayrollHR/employee-attendance', attendanceForm)
      setSuccess('Attendance marked successfully')
      setShowAttendanceForm(false)
      setAttendanceForm({ employeeId: '', attendanceDate: new Date().toISOString().split('T')[0],
        status: 'Present', checkInTime: '', checkOutTime: '' })
      fetchAttendance()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance')
    } finally {
      setLoading(false)
    }
  }

  // Handle payment submit
  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await axios.post('/PayrollHR/employee-payments', paymentForm)
      setSuccess('Payment processed successfully')
      setShowPaymentForm(false)
      setPaymentForm({ employeeId: '', paymentMonth: new Date().getMonth() + 1,
        paymentYear: new Date().getFullYear(), basicSalary: 0, allowances: 0,
        deductions: 0, overtimeAmount: 0, bonus: 0, paymentMethod: 'Bank Transfer' })
      fetchPayments()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process payment')
    } finally {
      setLoading(false)
    }
  }

  // Edit employee
  const handleEditEmployee = (emp) => {
    setEditingEmployee(emp)
    setEmployeeForm({
      firstName: emp.firstName, lastName: emp.lastName, employeeId: emp.employeeId,
      email: emp.email, phoneNumber: emp.phoneNumber, department: emp.department,
      designation: emp.designation, basicSalary: emp.basicSalary, status: emp.status
    })
    setShowEmployeeForm(true)
  }

  // Delete employee
  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Delete this employee?')) {
      try {
        setLoading(true)
        await axios.delete(`/PayrollHR/employees/${id}`)
        setSuccess('Employee deleted successfully')
        fetchEmployees()
      } catch (err) {
        setError('Failed to delete employee')
      } finally {
        setLoading(false)
      }
    }
  }

  const filteredEmployees = employees.filter(emp =>
    emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Payroll & HR Management</h1>
        <p className="text-blue-100">Unified employee, attendance, and payment management</p>
      </div>

      {/* Alerts */}
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">{success}</div>}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex gap-4 border-b border-gray-200">
          {['employees', 'attendance', 'payments'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium ${activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Employees Tab */}
      {activeTab === 'employees' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex-1 max-w-md relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => {
                setEditingEmployee(null)
                setEmployeeForm({ firstName: '', lastName: '', employeeId: '', email: '', phoneNumber: '',
                  department: '', designation: '', basicSalary: 0, status: 'Active' })
                setShowEmployeeForm(true)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5" />
              Add Employee
            </button>
          </div>

          {showEmployeeForm && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
              <form onSubmit={handleEmployeeSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Employee ID" value={employeeForm.employeeId}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, employeeId: e.target.value })} required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="First Name" value={employeeForm.firstName}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, firstName: e.target.value })} required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Last Name" value={employeeForm.lastName}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, lastName: e.target.value })} required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="email" placeholder="Email" value={employeeForm.email}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="tel" placeholder="Phone" value={employeeForm.phoneNumber}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, phoneNumber: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Department" value={employeeForm.department}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, department: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Designation" value={employeeForm.designation}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, designation: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="number" placeholder="Basic Salary" value={employeeForm.basicSalary}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, basicSalary: parseFloat(e.target.value) })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <div className="md:col-span-2 flex gap-2">
                  <button type="submit" disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" onClick={() => setShowEmployeeForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dept</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Designation</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Salary</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{emp.employeeId}</td>
                    <td className="px-6 py-4 text-sm">{emp.firstName} {emp.lastName}</td>
                    <td className="px-6 py-4 text-sm">{emp.department}</td>
                    <td className="px-6 py-4 text-sm">{emp.designation}</td>
                    <td className="px-6 py-4 text-sm text-right">Rs {emp.basicSalary?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleEditEmployee(emp)} className="p-1 text-blue-600 hover:bg-blue-50">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteEmployee(emp.id)} className="p-1 text-red-600 hover:bg-red-50">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <button onClick={() => setShowAttendanceForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <PlusIcon className="h-5 w-5" />
            Mark Attendance
          </button>

          {showAttendanceForm && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <form onSubmit={handleAttendanceSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select value={attendanceForm.employeeId}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, employeeId: e.target.value })} required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
                <input type="date" value={attendanceForm.attendanceDate}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, attendanceDate: e.target.value })} required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <select value={attendanceForm.status}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Half Day">Half Day</option>
                </select>
                <div className="md:col-span-2 flex gap-2">
                  <button type="submit" disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    Mark Attendance
                  </button>
                  <button type="button" onClick={() => setShowAttendanceForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendances.map((att) => (
                  <tr key={att.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{att.employee?.firstName} {att.employee?.lastName}</td>
                    <td className="px-6 py-4 text-sm">{new Date(att.attendanceDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm"><span className={`px-2 py-1 rounded text-xs font-semibold ${
                      att.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {att.status}</span></td>
                    <td className="px-6 py-4 text-sm text-right">{att.workingHours?.toFixed(2)} hrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <button onClick={() => setShowPaymentForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <PlusIcon className="h-5 w-5" />
            Process Payment
          </button>

          {showPaymentForm && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <form onSubmit={handlePaymentSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select value={paymentForm.employeeId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, employeeId: e.target.value })} required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
                <input type="number" placeholder="Basic Salary" value={paymentForm.basicSalary}
                  onChange={(e) => setPaymentForm({ ...paymentForm, basicSalary: parseFloat(e.target.value) })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="number" placeholder="Allowances" value={paymentForm.allowances}
                  onChange={(e) => setPaymentForm({ ...paymentForm, allowances: parseFloat(e.target.value) })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="number" placeholder="Deductions" value={paymentForm.deductions}
                  onChange={(e) => setPaymentForm({ ...paymentForm, deductions: parseFloat(e.target.value) })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <div className="md:col-span-2 flex gap-2">
                  <button type="submit" disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    Process Payment
                  </button>
                  <button type="button" onClick={() => setShowPaymentForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Gross</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{payment.employee?.firstName} {payment.employee?.lastName}</td>
                    <td className="px-6 py-4 text-sm">{payment.paymentMonth}/{payment.paymentYear}</td>
                    <td className="px-6 py-4 text-sm text-right">Rs {payment.grossSalary?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-medium text-right">Rs {payment.netSalary?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default PayrollDynamic
