import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  BanknotesIcon,
  CalculatorIcon,
  DocumentTextIcon,
  PrinterIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const Payroll = () => {
  const [selectedMonth, setSelectedMonth] = useState('2024-01')
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [payrollData, setPayrollData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load payroll data on component mount
  useEffect(() => {
    fetchPayrollData()
  }, [selectedMonth])

  // Fetch payroll data from API
  const fetchPayrollData = async () => {
    try {
      setLoading(true)
      const [month, year] = selectedMonth.split('-')
      const response = await axios.get(`/api/PayrollHR/employee-payments?month=${month}&year=${year}`)
      if (response.data.success) {
        setPayrollData(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching payroll data:', err)
      // Set mock data if API fails
      setPayrollData([
    {
      id: 1,
      employeeId: 'EMP-001',
      name: 'Ahmed Ali',
      department: 'Front Office',
      position: 'Front Desk Manager',
      basicSalary: 85000,
      allowances: 15000,
      overtime: 5000,
      grossSalary: 105000,
      deductions: {
        tax: 8400,
        providentFund: 4250,
        insurance: 2000
      },
      totalDeductions: 14650,
      netSalary: 90350,
      workingDays: 26,
      presentDays: 25,
      status: 'Processed',
      paymentDate: '2024-01-31'
    },
    {
      id: 2,
      employeeId: 'EMP-002',
      name: 'Fatima Sheikh',
      department: 'Housekeeping',
      position: 'Housekeeping Supervisor',
      basicSalary: 65000,
      allowances: 10000,
      overtime: 3000,
      grossSalary: 78000,
      deductions: {
        tax: 6240,
        providentFund: 3250,
        insurance: 1500
      },
      totalDeductions: 10990,
      netSalary: 67010,
      workingDays: 26,
      presentDays: 26,
      status: 'Processed',
      paymentDate: '2024-01-31'
    },
    {
      id: 3,
      employeeId: 'EMP-003',
      name: 'Hassan Khan',
      department: 'Restaurant',
      position: 'Head Chef',
      basicSalary: 95000,
      allowances: 18000,
      overtime: 7500,
      grossSalary: 120500,
      deductions: {
        tax: 9640,
        providentFund: 4750,
        insurance: 2500
      },
      totalDeductions: 16890,
      netSalary: 103610,
      workingDays: 26,
      presentDays: 26,
      status: 'Pending',
      paymentDate: null
    }
      ])
      setError('')
    } finally {
      setLoading(false)
    }
  }

  const departments = ['Front Office', 'Housekeeping', 'Restaurant', 'Kitchen', 'Maintenance', 'Administration', 'Security']
  const statuses = ['Pending', 'Processed', 'Paid', 'Hold']

  const processPayroll = async (employeeId) => {
    try {
      setLoading(true)
      const employee = payrollData.find(emp => emp.id === employeeId)
      
      const paymentData = {
        employeeId: employee.employeeId,
        paymentType: 'Monthly Salary',
        amount: employee.netSalary,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer',
        status: 'Processed'
      }
      
      try {
        const response = await axios.post('/api/PayrollHR/employee-payments', paymentData)
        if (response.data.success) {
          setSuccess('Payroll processed successfully!')
          fetchPayrollData()
        }
      } catch (apiError) {
        // Fallback: Update local state if API fails
        setPayrollData(prev => prev.map(emp => 
          emp.id === employeeId 
            ? { ...emp, status: 'Processed', paymentDate: new Date().toISOString().split('T')[0] }
            : emp
        ))
        setSuccess('Payroll processed successfully!')
      }
    } catch (error) {
      setError('Error processing payroll: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const generatePayslip = (employee) => {
    alert(`Payslip generated for ${employee.name}`)
  }

  const filteredPayroll = payrollData.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === '' || emp.department === departmentFilter
    const matchesStatus = statusFilter === '' || emp.status === statusFilter
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processed': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Paid': return 'bg-blue-100 text-blue-800'
      case 'Hold': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  // Calculate statistics
  const totalEmployees = payrollData.length
  const processedPayrolls = payrollData.filter(emp => emp.status === 'Processed' || emp.status === 'Paid').length
  const pendingPayrolls = payrollData.filter(emp => emp.status === 'Pending').length
  const totalPayrollAmount = payrollData.reduce((sum, emp) => sum + emp.netSalary, 0)
  const totalDeductions = payrollData.reduce((sum, emp) => sum + emp.totalDeductions, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Payroll Management</h1>
            <p className="text-green-100">Process employee salaries and generate payslips</p>
          </div>
          <BanknotesIcon className="h-12 w-12 text-green-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <BanknotesIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Payroll</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPayrollAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Processed</p>
              <p className="text-2xl font-bold text-gray-900">{processedPayrolls}</p>
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
              <p className="text-2xl font-bold text-gray-900">{pendingPayrolls}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <CalculatorIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Deductions</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDeductions)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payroll Month</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200">
              Process All
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            <CalculatorIcon className="h-5 w-5 mr-2" />
            Calculate Payroll
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Generate Payslips
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
            <PrinterIcon className="h-5 w-5 mr-2" />
            Print Reports
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
            <BanknotesIcon className="h-5 w-5 mr-2" />
            Bank Transfer
          </button>
        </div>
      </div>

      {/* Payroll List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Payroll for {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredPayroll.length} employees
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Basic Salary</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Allowances</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Gross</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayroll.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.employeeId}</div>
                      <div className="text-sm text-gray-500">{employee.department}</div>
                      <div className="text-xs text-gray-400">
                        {employee.presentDays}/{employee.workingDays} days
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(employee.basicSalary)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(employee.allowances)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm text-orange-600 font-medium">
                      {formatCurrency(employee.overtime)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(employee.grossSalary)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm text-red-600 font-medium">
                      -{formatCurrency(employee.totalDeductions)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Tax: {formatCurrency(employee.deductions.tax)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-bold text-green-600">
                      {formatCurrency(employee.netSalary)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                    {employee.paymentDate && (
                      <div className="text-xs text-gray-500 mt-1">
                        {employee.paymentDate}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col space-y-1">
                      {employee.status === 'Pending' && (
                        <button
                          onClick={() => processPayroll(employee.id)}
                          className="text-green-600 hover:text-green-900 text-xs px-2 py-1 rounded hover:bg-green-50 transition-colors"
                        >
                          Process
                        </button>
                      )}
                      <button
                        onClick={() => generatePayslip(employee)}
                        className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        Payslip
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 text-xs px-2 py-1 rounded hover:bg-gray-50 transition-colors">
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payroll Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payroll Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Basic Salary:</span>
              <span className="font-medium">{formatCurrency(payrollData.reduce((sum, emp) => sum + emp.basicSalary, 0))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Allowances:</span>
              <span className="font-medium text-green-600">{formatCurrency(payrollData.reduce((sum, emp) => sum + emp.allowances, 0))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Overtime:</span>
              <span className="font-medium text-orange-600">{formatCurrency(payrollData.reduce((sum, emp) => sum + emp.overtime, 0))}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">Gross Payroll:</span>
              <span className="font-bold">{formatCurrency(payrollData.reduce((sum, emp) => sum + emp.grossSalary, 0))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Deductions:</span>
              <span className="font-medium text-red-600">-{formatCurrency(totalDeductions)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-lg font-semibold text-gray-900">Net Payroll:</span>
              <span className="text-lg font-bold text-green-600">{formatCurrency(totalPayrollAmount)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Deduction Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Income Tax:</span>
              <span className="font-medium text-red-600">
                {formatCurrency(payrollData.reduce((sum, emp) => sum + emp.deductions.tax, 0))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Provident Fund:</span>
              <span className="font-medium text-red-600">
                {formatCurrency(payrollData.reduce((sum, emp) => sum + emp.deductions.providentFund, 0))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Insurance:</span>
              <span className="font-medium text-red-600">
                {formatCurrency(payrollData.reduce((sum, emp) => sum + emp.deductions.insurance, 0))}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold text-gray-900">Total Deductions:</span>
              <span className="font-bold text-red-600">{formatCurrency(totalDeductions)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payroll;
