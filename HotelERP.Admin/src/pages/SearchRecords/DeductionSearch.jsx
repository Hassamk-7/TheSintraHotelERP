import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  MinusCircleIcon,
  FunnelIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  UserIcon,
  CreditCardIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const DeductionSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [deductionTypeFilter, setDeductionTypeFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [amountRange, setAmountRange] = useState({ min: '', max: '' })

  const [deductionRecords] = useState([
    {
      id: 1,
      deductionId: 'DED-2024-001',
      employeeId: 'EMP-001',
      employeeName: 'Ahmed Hassan',
      department: 'Front Office',
      position: 'Receptionist',
      deductionType: 'Advance Recovery',
      deductionDate: '2024-01-31',
      payrollMonth: 'January 2024',
      deductionAmount: 4000,
      remainingBalance: 16000,
      originalAmount: 20000,
      reason: 'Salary advance repayment - Medical emergency',
      status: 'Processed',
      approvedBy: 'HR Manager',
      processedBy: 'Payroll Officer',
      advanceId: 'ADV-2024-001',
      installmentNumber: 1,
      totalInstallments: 5
    },
    {
      id: 2,
      deductionId: 'DED-2024-002',
      employeeId: 'EMP-003',
      employeeName: 'Ali Khan',
      department: 'Housekeeping',
      position: 'Supervisor',
      deductionType: 'Advance Recovery',
      deductionDate: '2024-01-31',
      payrollMonth: 'January 2024',
      deductionAmount: 5000,
      remainingBalance: 25000,
      originalAmount: 30000,
      reason: 'Festival advance repayment - Eid expenses',
      status: 'Processed',
      approvedBy: 'HR Manager',
      processedBy: 'Payroll Officer',
      advanceId: 'ADV-2024-003',
      installmentNumber: 1,
      totalInstallments: 6
    },
    {
      id: 3,
      deductionId: 'DED-2024-003',
      employeeId: 'EMP-006',
      employeeName: 'Hassan Ahmed',
      department: 'Restaurant',
      position: 'Waiter',
      deductionType: 'Penalty',
      deductionDate: '2024-01-25',
      payrollMonth: 'January 2024',
      deductionAmount: 1500,
      remainingBalance: 0,
      originalAmount: 1500,
      reason: 'Late arrival - 3 instances in January',
      status: 'Processed',
      approvedBy: 'Department Manager',
      processedBy: 'HR Officer',
      advanceId: null,
      installmentNumber: null,
      totalInstallments: null
    },
    {
      id: 4,
      deductionId: 'DED-2024-004',
      employeeId: 'EMP-007',
      employeeName: 'Fatima Sheikh',
      department: 'Housekeeping',
      position: 'Room Attendant',
      deductionType: 'Tax Deduction',
      deductionDate: '2024-01-31',
      payrollMonth: 'January 2024',
      deductionAmount: 2500,
      remainingBalance: 0,
      originalAmount: 2500,
      reason: 'Income tax deduction as per tax slab',
      status: 'Processed',
      approvedBy: 'Finance Manager',
      processedBy: 'Payroll Officer',
      advanceId: null,
      installmentNumber: null,
      totalInstallments: null
    }
  ])

  const deductionTypes = ['Advance Recovery', 'Tax Deduction', 'Insurance Premium', 'Provident Fund', 'Penalty', 'Damage Recovery']
  const departments = ['Front Office', 'Restaurant', 'Housekeeping', 'Security', 'Administration', 'Maintenance']
  const statuses = ['Processed', 'Pending', 'Cancelled', 'On Hold']

  const filteredRecords = deductionRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.deductionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDeductionType = deductionTypeFilter === '' || record.deductionType === deductionTypeFilter
    const matchesDepartment = departmentFilter === '' || record.department === departmentFilter
    const matchesStatus = statusFilter === '' || record.status === statusFilter
    
    let matchesDateRange = true
    if (dateRange.start && dateRange.end) {
      const deductionDate = new Date(record.deductionDate)
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      matchesDateRange = deductionDate >= startDate && deductionDate <= endDate
    }
    
    let matchesAmountRange = true
    if (amountRange.min || amountRange.max) {
      const min = parseFloat(amountRange.min) || 0
      const max = parseFloat(amountRange.max) || Infinity
      matchesAmountRange = record.deductionAmount >= min && record.deductionAmount <= max
    }
    
    return matchesSearch && matchesDeductionType && matchesDepartment && matchesStatus && matchesDateRange && matchesAmountRange
  })

  const getDeductionTypeColor = (deductionType) => {
    switch (deductionType) {
      case 'Advance Recovery': return 'bg-blue-100 text-blue-800'
      case 'Tax Deduction': return 'bg-red-100 text-red-800'
      case 'Insurance Premium': return 'bg-green-100 text-green-800'
      case 'Provident Fund': return 'bg-purple-100 text-purple-800'
      case 'Penalty': return 'bg-orange-100 text-orange-800'
      case 'Damage Recovery': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processed': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      case 'On Hold': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDepartmentColor = (department) => {
    switch (department) {
      case 'Front Office': return 'bg-indigo-100 text-indigo-800'
      case 'Restaurant': return 'bg-orange-100 text-orange-800'
      case 'Housekeeping': return 'bg-green-100 text-green-800'
      case 'Security': return 'bg-red-100 text-red-800'
      case 'Administration': return 'bg-purple-100 text-purple-800'
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const exportResults = () => {
    alert(`Exporting ${filteredRecords.length} deduction records...`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setDeductionTypeFilter('')
    setDepartmentFilter('')
    setStatusFilter('')
    setDateRange({ start: '', end: '' })
    setAmountRange({ min: '', max: '' })
  }

  // Calculate statistics
  const totalRecords = filteredRecords.length
  const processedDeductions = filteredRecords.filter(r => r.status === 'Processed').length
  const pendingDeductions = filteredRecords.filter(r => r.status === 'Pending').length
  const totalDeductionAmount = filteredRecords.reduce((sum, r) => sum + r.deductionAmount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Deduction Search</h1>
            <p className="text-red-100">Search and track employee salary deductions and recoveries</p>
          </div>
          <MinusCircleIcon className="h-12 w-12 text-red-200" />
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
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
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
              placeholder="Search deductions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <select
            value={deductionTypeFilter}
            onChange={(e) => setDeductionTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Deduction Types</option>
            {deductionTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Departments</option>
            {departments.map(department => (
              <option key={department} value={department}>{department}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Amount"
              value={amountRange.min}
              onChange={(e) => setAmountRange({...amountRange, min: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="number"
              placeholder="Max Amount"
              value={amountRange.max}
              onChange={(e) => setAmountRange({...amountRange, max: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <MinusCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Deductions</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDeductionAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CreditCardIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Processed</p>
              <p className="text-2xl font-bold text-gray-900">{processedDeductions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingDeductions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deduction Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-red-100 rounded-full p-2 mr-3">
                        <UserIcon className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                        <div className="text-sm text-gray-500">{record.employeeId}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(record.department)}`}>
                          {record.department}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDeductionTypeColor(record.deductionType)}`}>
                        {record.deductionType}
                      </span>
                      <div className="flex items-center text-sm text-gray-900">
                        <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {record.deductionDate}
                      </div>
                      <div className="text-sm text-blue-600">{record.reason}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-red-600">
                        {formatCurrency(record.deductionAmount)}
                      </div>
                      {record.remainingBalance > 0 && (
                        <div className="text-sm text-orange-600">
                          Remaining: {formatCurrency(record.remainingBalance)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        Approved by: {record.approvedBy}
                      </div>
                      {record.processedBy && (
                        <div className="text-sm text-gray-500">
                          Processed by: {record.processedBy}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <MinusCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No deduction records found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeductionSearch;
