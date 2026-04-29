import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  BanknotesIcon,
  FunnelIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  UserIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const EmployeePaymentSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [amountRange, setAmountRange] = useState({ min: '', max: '' })

  const [paymentRecords] = useState([
    {
      id: 1,
      employeeId: 'EMP-001',
      employeeName: 'Ahmed Ali',
      department: 'Front Office',
      paymentDate: '2024-01-31',
      paymentType: 'Monthly Salary',
      basicSalary: 85000,
      allowances: 15000,
      overtime: 5000,
      grossAmount: 105000,
      deductions: 14650,
      netAmount: 90350,
      paymentMethod: 'Bank Transfer',
      bankAccount: 'ACC-123456789',
      status: 'Paid',
      paymentReference: 'PAY-2024-001-001',
      processedBy: 'HR Manager',
      month: 'January 2024'
    },
    {
      id: 2,
      employeeId: 'EMP-002',
      employeeName: 'Fatima Sheikh',
      department: 'Housekeeping',
      paymentDate: '2024-01-31',
      paymentType: 'Monthly Salary',
      basicSalary: 65000,
      allowances: 10000,
      overtime: 3000,
      grossAmount: 78000,
      deductions: 10990,
      netAmount: 67010,
      paymentMethod: 'Bank Transfer',
      bankAccount: 'ACC-987654321',
      status: 'Paid',
      paymentReference: 'PAY-2024-001-002',
      processedBy: 'HR Manager',
      month: 'January 2024'
    },
    {
      id: 3,
      employeeId: 'EMP-003',
      employeeName: 'Hassan Khan',
      department: 'Restaurant',
      paymentDate: '2024-01-15',
      paymentType: 'Bonus',
      basicSalary: 0,
      allowances: 0,
      overtime: 0,
      grossAmount: 25000,
      deductions: 2000,
      netAmount: 23000,
      paymentMethod: 'Cash',
      bankAccount: null,
      status: 'Paid',
      paymentReference: 'BON-2024-001-001',
      processedBy: 'Finance Manager',
      month: 'January 2024'
    },
    {
      id: 4,
      employeeId: 'EMP-001',
      employeeName: 'Ahmed Ali',
      department: 'Front Office',
      paymentDate: '2024-02-05',
      paymentType: 'Advance',
      basicSalary: 0,
      allowances: 0,
      overtime: 0,
      grossAmount: 20000,
      deductions: 0,
      netAmount: 20000,
      paymentMethod: 'Bank Transfer',
      bankAccount: 'ACC-123456789',
      status: 'Pending',
      paymentReference: 'ADV-2024-002-001',
      processedBy: 'HR Manager',
      month: 'February 2024'
    },
    {
      id: 5,
      employeeId: 'EMP-004',
      employeeName: 'Aisha Malik',
      department: 'Administration',
      paymentDate: '2024-01-20',
      paymentType: 'Overtime Payment',
      basicSalary: 0,
      allowances: 0,
      overtime: 12000,
      grossAmount: 12000,
      deductions: 960,
      netAmount: 11040,
      paymentMethod: 'Bank Transfer',
      bankAccount: 'ACC-555666777',
      status: 'Paid',
      paymentReference: 'OVT-2024-001-001',
      processedBy: 'HR Manager',
      month: 'January 2024'
    }
  ])

  const departments = ['Front Office', 'Housekeeping', 'Restaurant', 'Kitchen', 'Maintenance', 'Administration', 'Security']
  const statuses = ['Paid', 'Pending', 'Processing', 'Failed', 'Cancelled']
  const paymentTypes = ['Monthly Salary', 'Bonus', 'Advance', 'Overtime Payment', 'Commission', 'Allowance']

  const filteredRecords = paymentRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.paymentReference.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = departmentFilter === '' || record.department === departmentFilter
    const matchesStatus = statusFilter === '' || record.status === statusFilter
    const matchesPaymentType = paymentTypeFilter === '' || record.paymentType === paymentTypeFilter
    
    let matchesDateRange = true
    if (dateRange.start && dateRange.end) {
      const paymentDate = new Date(record.paymentDate)
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      matchesDateRange = paymentDate >= startDate && paymentDate <= endDate
    }
    
    let matchesAmountRange = true
    if (amountRange.min || amountRange.max) {
      const min = parseFloat(amountRange.min) || 0
      const max = parseFloat(amountRange.max) || Infinity
      matchesAmountRange = record.netAmount >= min && record.netAmount <= max
    }
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesPaymentType && matchesDateRange && matchesAmountRange
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Processing': return 'bg-blue-100 text-blue-800'
      case 'Failed': return 'bg-red-100 text-red-800'
      case 'Cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentTypeColor = (type) => {
    switch (type) {
      case 'Monthly Salary': return 'bg-blue-100 text-blue-800'
      case 'Bonus': return 'bg-green-100 text-green-800'
      case 'Advance': return 'bg-orange-100 text-orange-800'
      case 'Overtime Payment': return 'bg-purple-100 text-purple-800'
      case 'Commission': return 'bg-indigo-100 text-indigo-800'
      case 'Allowance': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const exportResults = () => {
    alert(`Exporting ${filteredRecords.length} payment records...`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setDepartmentFilter('')
    setStatusFilter('')
    setPaymentTypeFilter('')
    setDateRange({ start: '', end: '' })
    setAmountRange({ min: '', max: '' })
  }

  // Calculate statistics
  const totalRecords = filteredRecords.length
  const paidRecords = filteredRecords.filter(r => r.status === 'Paid').length
  const pendingRecords = filteredRecords.filter(r => r.status === 'Pending').length
  const totalAmount = filteredRecords.reduce((sum, r) => sum + r.netAmount, 0)
  const totalDeductions = filteredRecords.reduce((sum, r) => sum + r.deductions, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Employee Payment Search</h1>
            <p className="text-green-100">Search and track employee payment records and transactions</p>
          </div>
          <BanknotesIcon className="h-12 w-12 text-green-200" />
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Export Results
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={paymentTypeFilter}
            onChange={(e) => setPaymentTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Payment Types</option>
            {paymentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex space-x-2">
            <input
              type="date"
              placeholder="From Date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="date"
              placeholder="To Date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Amount"
              value={amountRange.min}
              onChange={(e) => setAmountRange({...amountRange, min: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              placeholder="Max Amount"
              value={amountRange.max}
              onChange={(e) => setAmountRange({...amountRange, max: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <BanknotesIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-gray-900">{paidRecords}</p>
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
              <p className="text-2xl font-bold text-gray-900">{pendingRecords}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <DocumentTextIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Payment Records</h3>
            <p className="text-gray-600">Found {filteredRecords.length} payment records</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <BanknotesIcon className="h-4 w-4 mr-1" />
              Total: {paymentRecords.length}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-full p-2 mr-3">
                        <UserIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                        <div className="text-sm text-gray-500">{record.employeeId}</div>
                        <div className="text-sm text-gray-500">{record.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {record.paymentDate}
                      </div>
                      <div className="text-sm text-gray-500">{record.paymentReference}</div>
                      <div className="text-sm text-gray-500">{record.month}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentTypeColor(record.paymentType)}`}>
                      {record.paymentType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(record.grossAmount)}</div>
                    {record.basicSalary > 0 && (
                      <div className="text-sm text-gray-500">Basic: {formatCurrency(record.basicSalary)}</div>
                    )}
                    {record.allowances > 0 && (
                      <div className="text-sm text-gray-500">Allowances: {formatCurrency(record.allowances)}</div>
                    )}
                    {record.overtime > 0 && (
                      <div className="text-sm text-gray-500">Overtime: {formatCurrency(record.overtime)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-red-600">
                      {record.deductions > 0 ? formatCurrency(record.deductions) : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-green-600">{formatCurrency(record.netAmount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                    <div className="text-sm text-gray-500 mt-1">by {record.processedBy}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{record.paymentMethod}</div>
                    {record.bankAccount && (
                      <div className="text-sm text-gray-500">{record.bankAccount}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No payment records found</h3>
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
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDeductions)}</div>
              <div className="text-sm text-gray-600">Total Deductions</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalRecords > 0 ? formatCurrency(totalAmount / totalRecords) : formatCurrency(0)}
              </div>
              <div className="text-sm text-gray-600">Average Payment</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {totalRecords > 0 ? ((paidRecords / totalRecords) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-gray-600">Payment Success Rate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeePaymentSearch;
