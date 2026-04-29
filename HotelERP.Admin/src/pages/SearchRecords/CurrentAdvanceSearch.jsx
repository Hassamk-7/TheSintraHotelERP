import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
  FunnelIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  UserIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const CurrentAdvanceSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [advanceTypeFilter, setAdvanceTypeFilter] = useState('')
  const [dueDateRange, setDueDateRange] = useState({ start: '', end: '' })
  const [balanceRange, setBalanceRange] = useState({ min: '', max: '' })

  const [currentAdvances] = useState([
    {
      id: 1,
      advanceId: 'ADV-2024-001',
      employeeId: 'EMP-001',
      employeeName: 'Ahmed Hassan',
      department: 'Front Office',
      position: 'Receptionist',
      advanceType: 'Salary Advance',
      originalAmount: 20000,
      paidAmount: 4000,
      remainingBalance: 16000,
      monthlyDeduction: 4000,
      nextDeductionDate: '2024-02-01',
      lastDeductionDate: '2024-01-01',
      repaymentPeriod: 5,
      remainingInstallments: 4,
      disbursementDate: '2024-01-15',
      status: 'Active',
      overdueAmount: 0,
      interestRate: 0,
      guarantor: 'Muhammad Ali - EMP-025',
      reason: 'Medical emergency',
      approvedBy: 'HR Manager'
    },
    {
      id: 2,
      advanceId: 'ADV-2024-003',
      employeeId: 'EMP-003',
      employeeName: 'Ali Khan',
      department: 'Housekeeping',
      position: 'Supervisor',
      advanceType: 'Festival Advance',
      originalAmount: 30000,
      paidAmount: 5000,
      remainingBalance: 25000,
      monthlyDeduction: 5000,
      nextDeductionDate: '2024-02-01',
      lastDeductionDate: '2024-01-01',
      repaymentPeriod: 6,
      remainingInstallments: 5,
      disbursementDate: '2024-01-08',
      status: 'Active',
      overdueAmount: 0,
      interestRate: 0,
      guarantor: 'Hassan Ahmed - EMP-012',
      reason: 'Eid festival expenses',
      approvedBy: 'HR Manager'
    },
    {
      id: 3,
      advanceId: 'ADV-2024-004',
      employeeId: 'EMP-004',
      employeeName: 'Emma Wilson',
      department: 'Front Office',
      position: 'Manager',
      advanceType: 'Travel Advance',
      originalAmount: 15000,
      paidAmount: 7000,
      remainingBalance: 8000,
      monthlyDeduction: 0,
      nextDeductionDate: '2024-01-30',
      lastDeductionDate: null,
      repaymentPeriod: 1,
      remainingInstallments: 1,
      disbursementDate: '2024-01-14',
      status: 'Pending Settlement',
      overdueAmount: 8000,
      interestRate: 0,
      guarantor: null,
      reason: 'Business trip expenses',
      approvedBy: 'General Manager'
    },
    {
      id: 4,
      advanceId: 'ADV-2023-045',
      employeeId: 'EMP-006',
      employeeName: 'Hassan Ahmed',
      department: 'Restaurant',
      position: 'Waiter',
      advanceType: 'Emergency Advance',
      originalAmount: 25000,
      paidAmount: 15000,
      remainingBalance: 10000,
      monthlyDeduction: 2500,
      nextDeductionDate: '2024-01-25',
      lastDeductionDate: '2023-12-25',
      repaymentPeriod: 10,
      remainingInstallments: 4,
      disbursementDate: '2023-09-15',
      status: 'Overdue',
      overdueAmount: 2500,
      interestRate: 1,
      guarantor: 'Omar Siddique - EMP-018',
      reason: 'Family medical emergency',
      approvedBy: 'HR Manager'
    },
    {
      id: 5,
      advanceId: 'ADV-2023-052',
      employeeId: 'EMP-007',
      employeeName: 'Fatima Sheikh',
      department: 'Housekeeping',
      position: 'Room Attendant',
      advanceType: 'Medical Advance',
      originalAmount: 18000,
      paidAmount: 12000,
      remainingBalance: 6000,
      monthlyDeduction: 3000,
      nextDeductionDate: '2024-02-15',
      lastDeductionDate: '2024-01-15',
      repaymentPeriod: 6,
      remainingInstallments: 2,
      disbursementDate: '2023-11-15',
      status: 'Active',
      overdueAmount: 0,
      interestRate: 0,
      guarantor: 'Ayesha Khan - EMP-021',
      reason: 'Surgery expenses',
      approvedBy: 'General Manager'
    }
  ])

  const statuses = ['Active', 'Overdue', 'Pending Settlement', 'Completed', 'Suspended']
  const departments = ['Front Office', 'Restaurant', 'Housekeeping', 'Maintenance', 'Security', 'Administration']
  const advanceTypes = ['Salary Advance', 'Emergency Advance', 'Festival Advance', 'Travel Advance', 'Medical Advance']

  const filteredAdvances = currentAdvances.filter(advance => {
    const matchesSearch = advance.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         advance.advanceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         advance.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         advance.reason.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '' || advance.status === statusFilter
    const matchesDepartment = departmentFilter === '' || advance.department === departmentFilter
    const matchesAdvanceType = advanceTypeFilter === '' || advance.advanceType === advanceTypeFilter
    
    let matchesDueDateRange = true
    if (dueDateRange.start && dueDateRange.end) {
      const nextDeductionDate = new Date(advance.nextDeductionDate)
      const startDate = new Date(dueDateRange.start)
      const endDate = new Date(dueDateRange.end)
      matchesDueDateRange = nextDeductionDate >= startDate && nextDeductionDate <= endDate
    }
    
    let matchesBalanceRange = true
    if (balanceRange.min || balanceRange.max) {
      const min = parseFloat(balanceRange.min) || 0
      const max = parseFloat(balanceRange.max) || Infinity
      matchesBalanceRange = advance.remainingBalance >= min && advance.remainingBalance <= max
    }
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesAdvanceType && matchesDueDateRange && matchesBalanceRange
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Overdue': return 'bg-red-100 text-red-800'
      case 'Pending Settlement': return 'bg-yellow-100 text-yellow-800'
      case 'Completed': return 'bg-blue-100 text-blue-800'
      case 'Suspended': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAdvanceTypeColor = (advanceType) => {
    switch (advanceType) {
      case 'Salary Advance': return 'bg-blue-100 text-blue-800'
      case 'Emergency Advance': return 'bg-red-100 text-red-800'
      case 'Festival Advance': return 'bg-green-100 text-green-800'
      case 'Travel Advance': return 'bg-purple-100 text-purple-800'
      case 'Medical Advance': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDepartmentColor = (department) => {
    switch (department) {
      case 'Front Office': return 'bg-indigo-100 text-indigo-800'
      case 'Restaurant': return 'bg-orange-100 text-orange-800'
      case 'Housekeeping': return 'bg-green-100 text-green-800'
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'Security': return 'bg-red-100 text-red-800'
      case 'Administration': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const exportResults = () => {
    alert(`Exporting ${filteredAdvances.length} current advance records...`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    setDepartmentFilter('')
    setAdvanceTypeFilter('')
    setDueDateRange({ start: '', end: '' })
    setBalanceRange({ min: '', max: '' })
  }

  // Calculate statistics
  const totalRecords = filteredAdvances.length
  const activeAdvances = filteredAdvances.filter(a => a.status === 'Active').length
  const overdueAdvances = filteredAdvances.filter(a => a.status === 'Overdue').length
  const totalOutstanding = filteredAdvances.reduce((sum, a) => sum + a.remainingBalance, 0)
  const totalOverdue = filteredAdvances.reduce((sum, a) => sum + a.overdueAmount, 0)
  const avgBalance = totalRecords > 0 ? totalOutstanding / totalRecords : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Current Advance Search</h1>
            <p className="text-blue-100">Track active employee advances and outstanding balances</p>
          </div>
          <CurrencyDollarIcon className="h-12 w-12 text-blue-200" />
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
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
              placeholder="Search advances..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            {departments.map(department => (
              <option key={department} value={department}>{department}</option>
            ))}
          </select>

          <select
            value={advanceTypeFilter}
            onChange={(e) => setAdvanceTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Advance Types</option>
            {advanceTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex space-x-2">
            <input
              type="date"
              placeholder="Due From"
              value={dueDateRange.start}
              onChange={(e) => setDueDateRange({...dueDateRange, start: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              placeholder="Due To"
              value={dueDateRange.end}
              onChange={(e) => setDueDateRange({...dueDateRange, end: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Balance"
              value={balanceRange.min}
              onChange={(e) => setBalanceRange({...balanceRange, min: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max Balance"
              value={balanceRange.max}
              onChange={(e) => setBalanceRange({...balanceRange, max: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOutstanding)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <UserIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Advances</p>
              <p className="text-2xl font-bold text-gray-900">{activeAdvances}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOverdue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue Cases</p>
              <p className="text-2xl font-bold text-gray-900">{overdueAdvances}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Current Advance Records</h3>
            <p className="text-gray-600">Found {filteredAdvances.length} active advances</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-4 w-4 mr-1" />
              Total: {currentAdvances.length}
            </div>
            <div className="flex items-center">
              <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
              Filtered: {filteredAdvances.length}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee & Advance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repayment Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdvances.map((advance) => {
                const completionPercentage = ((advance.paidAmount / advance.originalAmount) * 100).toFixed(1)
                
                return (
                  <tr key={advance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <UserIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{advance.employeeName}</div>
                          <div className="text-sm text-gray-500">{advance.advanceId}</div>
                          <div className="text-sm text-gray-500">{advance.employeeId}</div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(advance.department)}`}>
                            {advance.department}
                          </span>
                          <div className="text-sm text-gray-500">{advance.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAdvanceTypeColor(advance.advanceType)}`}>
                          {advance.advanceType}
                        </span>
                        <div className="text-sm text-gray-900">
                          Original: {formatCurrency(advance.originalAmount)}
                        </div>
                        <div className="text-sm text-green-600">
                          Paid: {formatCurrency(advance.paidAmount)}
                        </div>
                        <div className="text-sm font-medium text-red-600">
                          Balance: {formatCurrency(advance.remainingBalance)}
                        </div>
                        {advance.overdueAmount > 0 && (
                          <div className="text-sm font-medium text-red-800">
                            Overdue: {formatCurrency(advance.overdueAmount)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          {advance.monthlyDeduction > 0 ? formatCurrency(advance.monthlyDeduction) : 'Settlement Based'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {advance.remainingInstallments} of {advance.repaymentPeriod} left
                        </div>
                        {advance.interestRate > 0 && (
                          <div className="text-sm text-orange-600">
                            Interest: {advance.interestRate}%
                          </div>
                        )}
                        {advance.guarantor && (
                          <div className="text-sm text-blue-600">
                            Guarantor: {advance.guarantor}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${completionPercentage}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {completionPercentage}% completed
                        </div>
                        {advance.lastDeductionDate && (
                          <div className="text-sm text-gray-500">
                            Last: {advance.lastDeductionDate}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                          {advance.nextDeductionDate}
                        </div>
                        {advance.status === 'Overdue' && (
                          <div className="text-sm text-red-600 font-medium">
                            Payment Overdue
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(advance.status)}`}>
                          {advance.status}
                        </span>
                        <div className="text-sm text-gray-500">
                          {advance.reason}
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredAdvances.length === 0 && (
          <div className="text-center py-12">
            <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No current advances found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>

      {/* Additional Stats */}
      {filteredAdvances.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(avgBalance)}</div>
              <div className="text-sm text-gray-600">Average Balance</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {totalOutstanding > 0 ? (((totalOutstanding - totalOverdue) / totalOutstanding) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-gray-600">On-time Payment Rate</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {filteredAdvances.length > 0 ? (filteredAdvances.reduce((sum, a) => sum + a.remainingInstallments, 0) / filteredAdvances.length).toFixed(1) : 0}
              </div>
              <div className="text-sm text-gray-600">Avg Remaining Installments</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CurrentAdvanceSearch;
