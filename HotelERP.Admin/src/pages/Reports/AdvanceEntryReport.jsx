import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import { 
  BanknotesIcon, 
  CalendarIcon, 
  UserIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const AdvanceEntryReport = () => {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    department: 'all',
    status: 'all',
    employee: 'all',
    searchTerm: ''
  });

  const [advanceRecords, setAdvanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data for advance entries
  const mockAdvanceData = [
    {
      id: 1,
      advanceNo: 'ADV-2024-001',
      date: '2024-01-15',
      time: '10:30',
      employeeId: 'EMP-001',
      employeeName: 'Muhammad Ali',
      department: 'Front Office',
      position: 'Receptionist',
      basicSalary: 45000,
      advanceAmount: 15000,
      reason: 'Medical Emergency',
      approvedBy: 'Manager',
      approvalDate: '2024-01-15',
      repaymentPeriod: 3,
      monthlyDeduction: 5000,
      paidAmount: 10000,
      remainingAmount: 5000,
      status: 'Active',
      nextDeductionDate: '2024-02-01'
    },
    {
      id: 2,
      advanceNo: 'ADV-2024-002',
      date: '2024-01-16',
      time: '14:15',
      employeeId: 'EMP-002',
      employeeName: 'Fatima Sheikh',
      department: 'Housekeeping',
      position: 'Supervisor',
      basicSalary: 40000,
      advanceAmount: 20000,
      reason: 'Home Renovation',
      approvedBy: 'HR Manager',
      approvalDate: '2024-01-16',
      repaymentPeriod: 4,
      monthlyDeduction: 5000,
      paidAmount: 20000,
      remainingAmount: 0,
      status: 'Completed',
      nextDeductionDate: null
    },
    {
      id: 3,
      advanceNo: 'ADV-2024-003',
      date: '2024-01-17',
      time: '09:45',
      employeeId: 'EMP-003',
      employeeName: 'Ahmed Hassan',
      department: 'Restaurant',
      position: 'Chef',
      basicSalary: 55000,
      advanceAmount: 25000,
      reason: 'Wedding Expenses',
      approvedBy: 'General Manager',
      approvalDate: '2024-01-17',
      repaymentPeriod: 5,
      monthlyDeduction: 5000,
      paidAmount: 5000,
      remainingAmount: 20000,
      status: 'Active',
      nextDeductionDate: '2024-02-01'
    },
    {
      id: 4,
      advanceNo: 'ADV-2024-004',
      date: '2024-01-18',
      time: '11:20',
      employeeId: 'EMP-004',
      employeeName: 'Sarah Khan',
      department: 'Accounts',
      position: 'Accountant',
      basicSalary: 50000,
      advanceAmount: 18000,
      reason: 'Educational Expenses',
      approvedBy: 'Finance Manager',
      approvalDate: null,
      repaymentPeriod: 3,
      monthlyDeduction: 6000,
      paidAmount: 0,
      remainingAmount: 18000,
      status: 'Pending',
      nextDeductionDate: null
    },
    {
      id: 5,
      advanceNo: 'ADV-2024-005',
      date: '2024-01-19',
      time: '16:30',
      employeeId: 'EMP-005',
      employeeName: 'Omar Malik',
      department: 'Security',
      position: 'Security Guard',
      basicSalary: 35000,
      advanceAmount: 12000,
      reason: 'Family Emergency',
      approvedBy: 'HR Manager',
      approvalDate: '2024-01-19',
      repaymentPeriod: 4,
      monthlyDeduction: 3000,
      paidAmount: 3000,
      remainingAmount: 9000,
      status: 'Active',
      nextDeductionDate: '2024-02-01'
    },
    {
      id: 6,
      advanceNo: 'ADV-2024-006',
      date: '2024-01-20',
      time: '13:10',
      employeeId: 'EMP-006',
      employeeName: 'Zain Ahmed',
      department: 'Maintenance',
      position: 'Technician',
      basicSalary: 42000,
      advanceAmount: 8000,
      reason: 'Vehicle Repair',
      approvedBy: 'Manager',
      approvalDate: null,
      repaymentPeriod: 2,
      monthlyDeduction: 4000,
      paidAmount: 0,
      remainingAmount: 8000,
      status: 'Rejected',
      nextDeductionDate: null
    }
  ];

  useEffect(() => {
    fetchAdvanceRecords();
  }, [filters.month, filters.department]);

  // Fetch advance entry records from API
  const fetchAdvanceRecords = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (filters.month) params.append('month', filters.month);
      if (filters.department !== 'all') params.append('department', filters.department);
      if (filters.status !== 'all') params.append('status', filters.status);
      
      const response = await axios.get(`/Reports/advance-entry-report?${params}`);
      if (response.data?.success) {
        setAdvanceRecords(response.data.data);
      } else {
        setError('Failed to load advance records');
        setAdvanceRecords(mockAdvanceData);
      }
    } catch (err) {
      console.error('Error fetching advance records:', err);
      setError('Failed to load advance records');
      setAdvanceRecords(mockAdvanceData);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredRecords = advanceRecords.filter(record => {
    const matchesDateFrom = !filters.dateFrom || record.date >= filters.dateFrom;
    const matchesDateTo = !filters.dateTo || record.date <= filters.dateTo;
    const matchesDepartment = filters.department === 'all' || record.department.toLowerCase() === filters.department.toLowerCase();
    const matchesStatus = filters.status === 'all' || record.status.toLowerCase() === filters.status.toLowerCase();
    const matchesEmployee = filters.employee === 'all' || record.employeeName.toLowerCase().includes(filters.employee.toLowerCase());
    const matchesSearch = !filters.searchTerm || 
      record.advanceNo.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.employeeName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.reason.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return matchesDateFrom && matchesDateTo && matchesDepartment && matchesStatus && matchesEmployee && matchesSearch;
  });

  const formatCurrency = (amount) => {
    return `Rs ${amount.toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-blue-600 bg-blue-100';
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <ClockIcon className="h-4 w-4" />;
      case 'Completed': return <CheckCircleIcon className="h-4 w-4" />;
      case 'Pending': return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'Rejected': return <XCircleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getDepartmentColor = (department) => {
    switch (department) {
      case 'Front Office': return 'text-blue-600 bg-blue-100';
      case 'Housekeeping': return 'text-green-600 bg-green-100';
      case 'Restaurant': return 'text-orange-600 bg-orange-100';
      case 'Accounts': return 'text-purple-600 bg-purple-100';
      case 'Security': return 'text-red-600 bg-red-100';
      case 'Maintenance': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const calculateTotals = () => {
    return filteredRecords.reduce((acc, record) => ({
      totalAdvances: acc.totalAdvances + 1,
      totalAmount: acc.totalAmount + record.advanceAmount,
      totalPaid: acc.totalPaid + record.paidAmount,
      totalRemaining: acc.totalRemaining + record.remainingAmount,
      activeAdvances: acc.activeAdvances + (record.status === 'Active' ? 1 : 0),
      completedAdvances: acc.completedAdvances + (record.status === 'Completed' ? 1 : 0)
    }), { 
      totalAdvances: 0, 
      totalAmount: 0, 
      totalPaid: 0, 
      totalRemaining: 0, 
      activeAdvances: 0, 
      completedAdvances: 0 
    });
  };

  const totals = calculateTotals();

  const handleExport = () => {
    console.log('Exporting advance entry report...');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BanknotesIcon className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">Advance Entry Report</h1>
              <p className="text-indigo-100">Employee salary advance tracking and management</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
            >
              <PrinterIcon className="h-5 w-5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleExport}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <FunnelIcon className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              <option value="front office">Front Office</option>
              <option value="housekeeping">Housekeeping</option>
              <option value="restaurant">Restaurant</option>
              <option value="accounts">Accounts</option>
              <option value="security">Security</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <input
              type="text"
              placeholder="Employee name..."
              value={filters.employee}
              onChange={(e) => handleFilterChange('employee', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Advance No, Employee..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Advances</p>
              <p className="text-xl font-bold">{totals.totalAdvances}</p>
            </div>
            <BanknotesIcon className="h-6 w-6 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Amount</p>
              <p className="text-xl font-bold">{formatCurrency(totals.totalAmount)}</p>
            </div>
            <CurrencyDollarIcon className="h-6 w-6 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Paid</p>
              <p className="text-xl font-bold">{formatCurrency(totals.totalPaid)}</p>
            </div>
            <CheckCircleIcon className="h-6 w-6 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Remaining</p>
              <p className="text-xl font-bold">{formatCurrency(totals.totalRemaining)}</p>
            </div>
            <ExclamationTriangleIcon className="h-6 w-6 text-red-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Active</p>
              <p className="text-xl font-bold">{totals.activeAdvances}</p>
            </div>
            <ClockIcon className="h-6 w-6 text-orange-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm font-medium">Completed</p>
              <p className="text-xl font-bold">{totals.completedAdvances}</p>
            </div>
            <CheckCircleIcon className="h-6 w-6 text-teal-200" />
          </div>
        </div>
      </div>

      {/* Advance Records Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Advance Entry Records</h2>
          <p className="text-sm text-gray-600">Showing {filteredRecords.length} of {advanceRecords.length} records</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Advance Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Financial Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repayment Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.advanceNo}</div>
                      <div className="text-sm text-gray-500 flex items-center space-x-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{record.date}</span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{record.time}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 flex items-center space-x-1">
                        <UserIcon className="h-4 w-4" />
                        <span>{record.employeeName}</span>
                      </div>
                      <div className="text-sm text-gray-500">ID: {record.employeeId}</div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDepartmentColor(record.department)}`}>
                        <BuildingOfficeIcon className="h-3 w-3 mr-1" />
                        {record.department}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">{record.position}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Basic Salary:</span>
                        <span className="font-medium">{formatCurrency(record.basicSalary)}</span>
                      </div>
                      <div className="flex justify-between text-blue-600">
                        <span>Advance:</span>
                        <span className="font-semibold">{formatCurrency(record.advanceAmount)}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Reason: {record.reason}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Period:</span>
                        <span>{record.repaymentPeriod} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly:</span>
                        <span>{formatCurrency(record.monthlyDeduction)}</span>
                      </div>
                      {record.nextDeductionDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          Next: {record.nextDeductionDate}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)}
                        <span className="ml-1">{record.status}</span>
                      </span>
                      <div className="text-sm text-gray-500 mt-1">
                        By: {record.approvedBy}
                      </div>
                      {record.approvalDate && (
                        <div className="text-xs text-gray-500">
                          Date: {record.approvalDate}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Paid:</span>
                        <span className="text-green-600 font-medium">{formatCurrency(record.paidAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining:</span>
                        <span className="text-red-600 font-medium">{formatCurrency(record.remainingAmount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(record.paidAmount / record.advanceAmount) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.round((record.paidAmount / record.advanceAmount) * 100)}% completed
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No advance records found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvanceEntryReport;
