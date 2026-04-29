import { useState } from 'react'
import {
  CurrencyDollarIcon,
  UserIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  PrinterIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline'

const PayrollManagement = () => {
  const [selectedMonth, setSelectedMonth] = useState('2024-01')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [payrollStatus, setPayrollStatus] = useState('Draft')

  const [payrollData, setPayrollData] = useState([
    {
      id: 1,
      employeeId: 'EMP-001',
      employeeName: 'Ahmed Hassan',
      department: 'Front Office',
      position: 'Receptionist',
      basicSalary: 35000,
      allowances: 5000,
      overtimeHours: 10,
      overtimeRate: 200,
      overtimeAmount: 2000,
      grossSalary: 42000,
      taxDeduction: 2100,
      pfDeduction: 3500,
      advanceDeduction: 4000,
      otherDeductions: 500,
      totalDeductions: 10100,
      netSalary: 31900,
      workingDays: 26,
      presentDays: 24,
      absentDays: 2,
      leaveDays: 0,
      status: 'Processed'
    },
    {
      id: 2,
      employeeId: 'EMP-002',
      employeeName: 'Sarah Khan',
      department: 'Restaurant',
      position: 'Head Chef',
      basicSalary: 50000,
      allowances: 8000,
      overtimeHours: 15,
      overtimeRate: 250,
      overtimeAmount: 3750,
      grossSalary: 61750,
      taxDeduction: 3088,
      pfDeduction: 5000,
      advanceDeduction: 0,
      otherDeductions: 800,
      totalDeductions: 8888,
      netSalary: 52862,
      workingDays: 26,
      presentDays: 26,
      absentDays: 0,
      leaveDays: 0,
      status: 'Processed'
    },
    {
      id: 3,
      employeeId: 'EMP-003',
      employeeName: 'Ali Khan',
      department: 'Housekeeping',
      position: 'Supervisor',
      basicSalary: 30000,
      allowances: 4000,
      overtimeHours: 5,
      overtimeRate: 150,
      overtimeAmount: 750,
      grossSalary: 34750,
      taxDeduction: 1738,
      pfDeduction: 3000,
      advanceDeduction: 5000,
      otherDeductions: 0,
      totalDeductions: 9738,
      netSalary: 25012,
      workingDays: 26,
      presentDays: 25,
      absentDays: 1,
      leaveDays: 0,
      status: 'Draft'
    },
    {
      id: 4,
      employeeId: 'EMP-004',
      employeeName: 'Fatima Sheikh',
      department: 'Housekeeping',
      position: 'Room Attendant',
      basicSalary: 25000,
      allowances: 2000,
      overtimeHours: 8,
      overtimeRate: 120,
      overtimeAmount: 960,
      grossSalary: 27960,
      taxDeduction: 1398,
      pfDeduction: 2500,
      advanceDeduction: 0,
      otherDeductions: 0,
      totalDeductions: 3898,
      netSalary: 24062,
      workingDays: 26,
      presentDays: 24,
      absentDays: 2,
      leaveDays: 0,
      status: 'Draft'
    }
  ])

  const departments = ['All Departments', 'Front Office', 'Restaurant', 'Housekeeping', 'Security', 'Maintenance']
  const statuses = ['Draft', 'Processed', 'Approved', 'Paid']

  const filteredPayroll = payrollData.filter(record => {
    const matchesDepartment = selectedDepartment === '' || selectedDepartment === 'All Departments' || record.department === selectedDepartment
    return matchesDepartment
  })

  const processPayroll = (employeeId) => {
    setPayrollData(payrollData.map(record => 
      record.employeeId === employeeId 
        ? { ...record, status: 'Processed' }
        : record
    ))
  }

  const approvePayroll = (employeeId) => {
    setPayrollData(payrollData.map(record => 
      record.employeeId === employeeId 
        ? { ...record, status: 'Approved' }
        : record
    ))
  }

  const markAsPaid = (employeeId) => {
    setPayrollData(payrollData.map(record => 
      record.employeeId === employeeId 
        ? { ...record, status: 'Paid' }
        : record
    ))
  }

  const processAllPayroll = () => {
    setPayrollData(payrollData.map(record => ({ ...record, status: 'Processed' })))
  }

  const generatePayslip = (employee) => {
    alert(`Generating payslip for ${employee.employeeName}...`)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800'
      case 'Processed': return 'bg-blue-100 text-blue-800'
      case 'Approved': return 'bg-green-100 text-green-800'
      case 'Paid': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDepartmentColor = (department) => {
    switch (department) {
      case 'Front Office': return 'bg-indigo-100 text-indigo-800'
      case 'Restaurant': return 'bg-orange-100 text-orange-800'
      case 'Housekeeping': return 'bg-green-100 text-green-800'
      case 'Security': return 'bg-red-100 text-red-800'
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  // Calculate statistics
  const totalEmployees = filteredPayroll.length
  const totalGrossSalary = filteredPayroll.reduce((sum, record) => sum + record.grossSalary, 0)
  const totalDeductions = filteredPayroll.reduce((sum, record) => sum + record.totalDeductions, 0)
  const totalNetSalary = filteredPayroll.reduce((sum, record) => sum + record.netSalary, 0)
  const processedCount = filteredPayroll.filter(r => r.status === 'Processed').length
  const approvedCount = filteredPayroll.filter(r => r.status === 'Approved').length
  const paidCount = filteredPayroll.filter(r => r.status === 'Paid').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Payroll Management</h1>
            <p className="text-green-100">Process monthly payroll and generate payslips</p>
          </div>
          <CurrencyDollarIcon className="h-12 w-12 text-green-200" />
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payroll Month</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept === 'All Departments' ? '' : dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={processAllPayroll}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <CalculatorIcon className="h-4 w-4 mr-2" />
              Process All
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Net Salary</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalNetSalary)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-lg p-3">
              <CalculatorIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Deductions</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDeductions)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <DocumentTextIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Processed</p>
              <p className="text-2xl font-bold text-gray-900">{processedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Payroll for {new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="text-sm text-gray-500">
              {filteredPayroll.length} employees
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayroll.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-full p-2 mr-3">
                        <UserIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                        <div className="text-sm text-gray-500">{record.employeeId}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(record.department)}`}>
                          {record.department}
                        </span>
                        <div className="text-sm text-gray-500">{record.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        Basic: {formatCurrency(record.basicSalary)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Allowances: {formatCurrency(record.allowances)}
                      </div>
                      <div className="text-sm text-blue-600">
                        OT: {record.overtimeHours}h × {formatCurrency(record.overtimeRate)} = {formatCurrency(record.overtimeAmount)}
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        Gross: {formatCurrency(record.grossSalary)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        Working: {record.workingDays} days
                      </div>
                      <div className="text-sm text-green-600">
                        Present: {record.presentDays} days
                      </div>
                      <div className="text-sm text-red-600">
                        Absent: {record.absentDays} days
                      </div>
                      <div className="text-sm text-yellow-600">
                        Leave: {record.leaveDays} days
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-red-600">
                        Tax: {formatCurrency(record.taxDeduction)}
                      </div>
                      <div className="text-sm text-red-600">
                        PF: {formatCurrency(record.pfDeduction)}
                      </div>
                      <div className="text-sm text-red-600">
                        Advance: {formatCurrency(record.advanceDeduction)}
                      </div>
                      <div className="text-sm text-red-600">
                        Other: {formatCurrency(record.otherDeductions)}
                      </div>
                      <div className="text-sm font-medium text-red-600">
                        Total: {formatCurrency(record.totalDeductions)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(record.netSalary)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      {record.status === 'Draft' && (
                        <button
                          onClick={() => processPayroll(record.employeeId)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Process
                        </button>
                      )}
                      {record.status === 'Processed' && (
                        <button
                          onClick={() => approvePayroll(record.employeeId)}
                          className="text-green-600 hover:text-green-900 text-sm font-medium"
                        >
                          Approve
                        </button>
                      )}
                      {record.status === 'Approved' && (
                        <button
                          onClick={() => markAsPaid(record.employeeId)}
                          className="text-purple-600 hover:text-purple-900 text-sm font-medium"
                        >
                          Mark Paid
                        </button>
                      )}
                      <button
                        onClick={() => generatePayslip(record)}
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center"
                      >
                        <PrinterIcon className="h-4 w-4 mr-1" />
                        Payslip
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayroll.length === 0 && (
          <div className="text-center py-12">
            <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No payroll data</h3>
            <p className="mt-2 text-gray-500">No payroll records found for the selected criteria.</p>
          </div>
        )}
      </div>

      {/* Summary */}
      {filteredPayroll.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payroll Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalGrossSalary)}</div>
              <div className="text-sm text-gray-600">Total Gross Salary</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDeductions)}</div>
              <div className="text-sm text-gray-600">Total Deductions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalNetSalary)}</div>
              <div className="text-sm text-gray-600">Total Net Salary</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{paidCount}/{totalEmployees}</div>
              <div className="text-sm text-gray-600">Paid Employees</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PayrollManagement;
