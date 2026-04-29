import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  BanknotesIcon,
  FunnelIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  UserIcon,
  CreditCardIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const AdvanceEntrySearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [advanceTypeFilter, setAdvanceTypeFilter] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [amountRange, setAmountRange] = useState({ min: '', max: '' })

  const [advanceEntries] = useState([
    {
      id: 1,
      advanceId: 'ADV-2024-001',
      employeeId: 'EMP-001',
      employeeName: 'Ahmed Hassan',
      department: 'Front Office',
      position: 'Receptionist',
      advanceType: 'Salary Advance',
      requestDate: '2024-01-10',
      approvalDate: '2024-01-12',
      disbursementDate: '2024-01-15',
      requestedAmount: 25000,
      approvedAmount: 20000,
      disbursedAmount: 20000,
      reason: 'Medical emergency for family member',
      repaymentMethod: 'Monthly Deduction',
      repaymentPeriod: 5,
      monthlyDeduction: 4000,
      remainingBalance: 16000,
      status: 'Active',
      approvedBy: 'HR Manager',
      disbursedBy: 'Finance Officer',
      nextDeductionDate: '2024-02-01',
      interestRate: 0,
      guarantor: 'Muhammad Ali - EMP-025'
    },
    {
      id: 2,
      advanceId: 'ADV-2024-002',
      employeeId: 'EMP-002',
      employeeName: 'Sarah Johnson',
      department: 'Restaurant',
      position: 'Head Chef',
      advanceType: 'Emergency Advance',
      requestDate: '2024-01-08',
      approvalDate: '2024-01-09',
      disbursementDate: '2024-01-10',
      requestedAmount: 40000,
      approvedAmount: 35000,
      disbursedAmount: 35000,
      reason: 'Home renovation urgent repairs',
      repaymentMethod: 'Lump Sum',
      repaymentPeriod: 1,
      monthlyDeduction: 35000,
      remainingBalance: 0,
      status: 'Completed',
      approvedBy: 'General Manager',
      disbursedBy: 'Finance Officer',
      nextDeductionDate: null,
      interestRate: 2,
      guarantor: 'Ali Khan - EMP-015'
    },
    {
      id: 3,
      advanceId: 'ADV-2024-003',
      employeeId: 'EMP-003',
      employeeName: 'Ali Khan',
      department: 'Housekeeping',
      position: 'Supervisor',
      advanceType: 'Festival Advance',
      requestDate: '2024-01-05',
      approvalDate: '2024-01-07',
      disbursementDate: '2024-01-08',
      requestedAmount: 30000,
      approvedAmount: 30000,
      disbursedAmount: 30000,
      reason: 'Eid festival expenses',
      repaymentMethod: 'Monthly Deduction',
      repaymentPeriod: 6,
      monthlyDeduction: 5000,
      remainingBalance: 25000,
      status: 'Active',
      approvedBy: 'HR Manager',
      disbursedBy: 'Accounts Officer',
      nextDeductionDate: '2024-02-01',
      interestRate: 0,
      guarantor: 'Hassan Ahmed - EMP-012'
    },
    {
      id: 4,
      advanceId: 'ADV-2024-004',
      employeeId: 'EMP-004',
      employeeName: 'Emma Wilson',
      department: 'Front Office',
      position: 'Manager',
      advanceType: 'Travel Advance',
      requestDate: '2024-01-12',
      approvalDate: '2024-01-13',
      disbursementDate: '2024-01-14',
      requestedAmount: 15000,
      approvedAmount: 15000,
      disbursedAmount: 15000,
      reason: 'Business trip to Lahore',
      repaymentMethod: 'Expense Settlement',
      repaymentPeriod: 1,
      monthlyDeduction: 0,
      remainingBalance: 8000,
      status: 'Pending Settlement',
      approvedBy: 'General Manager',
      disbursedBy: 'Finance Officer',
      nextDeductionDate: '2024-01-30',
      interestRate: 0,
      guarantor: null
    },
    {
      id: 5,
      advanceId: 'ADV-2024-005',
      employeeId: 'EMP-005',
      employeeName: 'Muhammad Usman',
      department: 'Maintenance',
      position: 'Technician',
      advanceType: 'Salary Advance',
      requestDate: '2024-01-15',
      approvalDate: null,
      disbursementDate: null,
      requestedAmount: 20000,
      approvedAmount: 0,
      disbursedAmount: 0,
      reason: 'Children school fees',
      repaymentMethod: 'Monthly Deduction',
      repaymentPeriod: 4,
      monthlyDeduction: 5000,
      remainingBalance: 0,
      status: 'Pending Approval',
      approvedBy: null,
      disbursedBy: null,
      nextDeductionDate: null,
      interestRate: 0,
      guarantor: 'Omar Siddique - EMP-018'
    }
  ])

  const statuses = ['Active', 'Completed', 'Pending Approval', 'Pending Settlement', 'Rejected', 'Cancelled']
  const departments = ['Front Office', 'Restaurant', 'Housekeeping', 'Maintenance', 'Security', 'Administration']
  const advanceTypes = ['Salary Advance', 'Emergency Advance', 'Festival Advance', 'Travel Advance', 'Medical Advance']

  const filteredEntries = advanceEntries.filter(entry => {
    const matchesSearch = entry.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.advanceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.reason.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '' || entry.status === statusFilter
    const matchesDepartment = departmentFilter === '' || entry.department === departmentFilter
    const matchesAdvanceType = advanceTypeFilter === '' || entry.advanceType === advanceTypeFilter
    
    let matchesDateRange = true
    if (dateRange.start && dateRange.end) {
      const requestDate = new Date(entry.requestDate)
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      matchesDateRange = requestDate >= startDate && requestDate <= endDate
    }
    
    let matchesAmountRange = true
    if (amountRange.min || amountRange.max) {
      const min = parseFloat(amountRange.min) || 0
      const max = parseFloat(amountRange.max) || Infinity
      matchesAmountRange = entry.approvedAmount >= min && entry.approvedAmount <= max
    }
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesAdvanceType && matchesDateRange && matchesAmountRange
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-blue-100 text-blue-800'
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Pending Approval': return 'bg-yellow-100 text-yellow-800'
      case 'Pending Settlement': return 'bg-orange-100 text-orange-800'
      case 'Rejected': return 'bg-red-100 text-red-800'
      case 'Cancelled': return 'bg-gray-100 text-gray-800'
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
    alert(`Exporting ${filteredEntries.length} advance entry records...`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    setDepartmentFilter('')
    setAdvanceTypeFilter('')
    setDateRange({ start: '', end: '' })
    setAmountRange({ min: '', max: '' })
  }

  // Calculate statistics
  const totalRecords = filteredEntries.length
  const activeAdvances = filteredEntries.filter(e => e.status === 'Active').length
  const pendingApprovals = filteredEntries.filter(e => e.status === 'Pending Approval').length
  const totalDisbursed = filteredEntries.reduce((sum, e) => sum + e.disbursedAmount, 0)
  const totalOutstanding = filteredEntries.reduce((sum, e) => sum + e.remainingBalance, 0)
  const completedAdvances = filteredEntries.filter(e => e.status === 'Completed').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Advance Entry Search</h1>
            <p className="text-green-100">Search and manage employee advance payments and records</p>
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
              placeholder="Search advances..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

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
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Departments</option>
            {departments.map(department => (
              <option key={department} value={department}>{department}</option>
            ))}
          </select>

          <select
            value={advanceTypeFilter}
            onChange={(e) => setAdvanceTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              <p className="text-sm font-medium text-gray-600">Total Disbursed</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDisbursed)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CreditCardIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOutstanding)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">{pendingApprovals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <UserIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Advances</p>
              <p className="text-2xl font-bold text-gray-900">{activeAdvances}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Advance Entry Records</h3>
            <p className="text-gray-600">Found {filteredEntries.length} advance records</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <BanknotesIcon className="h-4 w-4 mr-1" />
              Total: {advanceEntries.length}
            </div>
            <div className="flex items-center">
              <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
              Filtered: {filteredEntries.length}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repayment Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval Chain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-full p-2 mr-3">
                        <UserIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{entry.employeeName}</div>
                        <div className="text-sm text-gray-500">{entry.advanceId}</div>
                        <div className="text-sm text-gray-500">{entry.employeeId}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(entry.department)}`}>
                          {entry.department}
                        </span>
                        <div className="text-sm text-gray-500">{entry.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAdvanceTypeColor(entry.advanceType)}`}>
                        {entry.advanceType}
                      </span>
                      <div className="text-sm text-gray-900">
                        Requested: {formatCurrency(entry.requestedAmount)}
                      </div>
                      <div className="text-sm text-green-600">
                        Approved: {formatCurrency(entry.approvedAmount)}
                      </div>
                      <div className="text-sm text-blue-600">
                        Disbursed: {formatCurrency(entry.disbursedAmount)}
                      </div>
                      {entry.interestRate > 0 && (
                        <div className="text-sm text-orange-600">
                          Interest: {entry.interestRate}%
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        Method: {entry.repaymentMethod}
                      </div>
                      <div className="text-sm text-gray-500">
                        Period: {entry.repaymentPeriod} months
                      </div>
                      {entry.monthlyDeduction > 0 && (
                        <div className="text-sm text-gray-500">
                          Monthly: {formatCurrency(entry.monthlyDeduction)}
                        </div>
                      )}
                      <div className="text-sm font-medium text-red-600">
                        Balance: {formatCurrency(entry.remainingBalance)}
                      </div>
                      {entry.nextDeductionDate && (
                        <div className="text-sm text-gray-500">
                          Next: {entry.nextDeductionDate}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                        Requested: {entry.requestDate}
                      </div>
                      {entry.approvalDate && (
                        <div className="text-sm text-green-600">
                          Approved: {entry.approvalDate}
                        </div>
                      )}
                      {entry.disbursementDate && (
                        <div className="text-sm text-blue-600">
                          Disbursed: {entry.disbursementDate}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {entry.approvedBy && (
                        <div className="text-sm text-gray-900">
                          Approved by: {entry.approvedBy}
                        </div>
                      )}
                      {entry.disbursedBy && (
                        <div className="text-sm text-gray-500">
                          Disbursed by: {entry.disbursedBy}
                        </div>
                      )}
                      {entry.guarantor && (
                        <div className="text-sm text-blue-600">
                          Guarantor: {entry.guarantor}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(entry.status)}`}>
                        {entry.status}
                      </span>
                      {entry.reason && (
                        <div className="text-sm text-gray-500">
                          Reason: {entry.reason}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No advance records found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>

      {/* Additional Stats */}
      {filteredEntries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedAdvances}</div>
              <div className="text-sm text-gray-600">Completed Advances</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalRecords > 0 ? formatCurrency(totalDisbursed / totalRecords) : formatCurrency(0)}
              </div>
              <div className="text-sm text-gray-600">Average Advance Amount</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {totalDisbursed > 0 ? ((totalOutstanding / totalDisbursed) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-gray-600">Outstanding Percentage</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvanceEntrySearch;
