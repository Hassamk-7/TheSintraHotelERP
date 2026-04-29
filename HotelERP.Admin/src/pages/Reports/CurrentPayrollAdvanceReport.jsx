import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import { 
  ClockIcon, 
  CalendarIcon, 
  UserIcon, 
  CurrencyDollarIcon,
  BanknotesIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';

const CurrentPayrollAdvanceReport = () => {
  const [filters, setFilters] = useState({
    month: new Date().toISOString().slice(0, 7), // Current month
    department: 'all',
    employee: 'all',
    searchTerm: ''
  });

  const [currentAdvances, setCurrentAdvances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data for current payroll advances
  const mockCurrentAdvanceData = [
    {
      id: 1,
      employeeId: 'EMP-001',
      employeeName: 'Muhammad Ali',
      department: 'Front Office',
      position: 'Receptionist',
      basicSalary: 45000,
      currentMonth: '2024-01',
      advances: [
        {
          advanceNo: 'ADV-2024-001',
          originalAmount: 15000,
          monthlyDeduction: 5000,
          deductionMonth: '2024-01',
          remainingAmount: 10000,
          status: 'Active'
        }
      ],
      totalCurrentDeduction: 5000,
      netSalaryAfterDeduction: 40000,
      advanceHistory: {
        totalAdvances: 1,
        totalAmount: 15000,
        totalPaid: 5000,
        totalRemaining: 10000
      }
    },
    {
      id: 2,
      employeeId: 'EMP-002',
      employeeName: 'Fatima Sheikh',
      department: 'Housekeeping',
      position: 'Supervisor',
      basicSalary: 40000,
      currentMonth: '2024-01',
      advances: [
        {
          advanceNo: 'ADV-2024-002',
          originalAmount: 20000,
          monthlyDeduction: 5000,
          deductionMonth: '2024-01',
          remainingAmount: 0,
          status: 'Completed'
        }
      ],
      totalCurrentDeduction: 5000,
      netSalaryAfterDeduction: 35000,
      advanceHistory: {
        totalAdvances: 1,
        totalAmount: 20000,
        totalPaid: 20000,
        totalRemaining: 0
      }
    },
    {
      id: 3,
      employeeId: 'EMP-003',
      employeeName: 'Ahmed Hassan',
      department: 'Restaurant',
      position: 'Chef',
      basicSalary: 55000,
      currentMonth: '2024-01',
      advances: [
        {
          advanceNo: 'ADV-2024-003',
          originalAmount: 25000,
          monthlyDeduction: 5000,
          deductionMonth: '2024-01',
          remainingAmount: 20000,
          status: 'Active'
        },
        {
          advanceNo: 'ADV-2023-015',
          originalAmount: 10000,
          monthlyDeduction: 2500,
          deductionMonth: '2024-01',
          remainingAmount: 2500,
          status: 'Active'
        }
      ],
      totalCurrentDeduction: 7500,
      netSalaryAfterDeduction: 47500,
      advanceHistory: {
        totalAdvances: 2,
        totalAmount: 35000,
        totalPaid: 12500,
        totalRemaining: 22500
      }
    },
    {
      id: 4,
      employeeId: 'EMP-004',
      employeeName: 'Sarah Khan',
      department: 'Accounts',
      position: 'Accountant',
      basicSalary: 50000,
      currentMonth: '2024-01',
      advances: [],
      totalCurrentDeduction: 0,
      netSalaryAfterDeduction: 50000,
      advanceHistory: {
        totalAdvances: 0,
        totalAmount: 0,
        totalPaid: 0,
        totalRemaining: 0
      }
    },
    {
      id: 5,
      employeeId: 'EMP-005',
      employeeName: 'Omar Malik',
      department: 'Security',
      position: 'Security Guard',
      basicSalary: 35000,
      currentMonth: '2024-01',
      advances: [
        {
          advanceNo: 'ADV-2024-005',
          originalAmount: 12000,
          monthlyDeduction: 3000,
          deductionMonth: '2024-01',
          remainingAmount: 9000,
          status: 'Active'
        }
      ],
      totalCurrentDeduction: 3000,
      netSalaryAfterDeduction: 32000,
      advanceHistory: {
        totalAdvances: 1,
        totalAmount: 12000,
        totalPaid: 3000,
        totalRemaining: 9000
      }
    },
    {
      id: 6,
      employeeId: 'EMP-006',
      employeeName: 'Zain Ahmed',
      department: 'Maintenance',
      position: 'Technician',
      basicSalary: 42000,
      currentMonth: '2024-01',
      advances: [
        {
          advanceNo: 'ADV-2023-020',
          originalAmount: 15000,
          monthlyDeduction: 3750,
          deductionMonth: '2024-01',
          remainingAmount: 3750,
          status: 'Active'
        }
      ],
      totalCurrentDeduction: 3750,
      netSalaryAfterDeduction: 38250,
      advanceHistory: {
        totalAdvances: 1,
        totalAmount: 15000,
        totalPaid: 11250,
        totalRemaining: 3750
      }
    }
  ];

  useEffect(() => {
    fetchCurrentAdvances();
  }, [filters.department, filters.status]);

  // Fetch current advance records from API
  const fetchCurrentAdvances = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (filters.department !== 'all') params.append('department', filters.department);
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.employee) params.append('employee', filters.employee);
      
      const response = await axios.get(`/Reports/current-payroll-advance?${params}`);
      if (response.data?.success) {
        setCurrentAdvances(response.data.data);
      } else {
        setError('Failed to load advance records');
        setCurrentAdvances(mockCurrentAdvanceData);
      }
    } catch (err) {
      console.error('Error fetching advance records:', err);
      setError('Failed to load advance records');
      setCurrentAdvances(mockCurrentAdvanceData);
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

  const filteredRecords = currentAdvances.filter(record => {
    const matchesDepartment = filters.department === 'all' || record.department.toLowerCase() === filters.department.toLowerCase();
    const matchesEmployee = filters.employee === 'all' || record.employeeName.toLowerCase().includes(filters.employee.toLowerCase());
    const matchesSearch = !filters.searchTerm || 
      record.employeeId.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.employeeName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.advances.some(advance => advance.advanceNo.toLowerCase().includes(filters.searchTerm.toLowerCase()));

    return matchesDepartment && matchesEmployee && matchesSearch;
  });

  const formatCurrency = (amount) => {
    return `Rs ${amount.toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-blue-600 bg-blue-100';
      case 'Completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
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
      totalEmployees: acc.totalEmployees + 1,
      employeesWithAdvances: acc.employeesWithAdvances + (record.advances.length > 0 ? 1 : 0),
      totalCurrentDeductions: acc.totalCurrentDeductions + record.totalCurrentDeduction,
      totalNetSalaries: acc.totalNetSalaries + record.netSalaryAfterDeduction,
      totalActiveAdvances: acc.totalActiveAdvances + record.advances.filter(a => a.status === 'Active').length,
      totalRemainingAmount: acc.totalRemainingAmount + record.advanceHistory.totalRemaining
    }), { 
      totalEmployees: 0, 
      employeesWithAdvances: 0, 
      totalCurrentDeductions: 0, 
      totalNetSalaries: 0, 
      totalActiveAdvances: 0,
      totalRemainingAmount: 0
    });
  };

  const totals = calculateTotals();

  const handleExport = () => {
    console.log('Exporting current payroll advance report...');
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
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ClockIcon className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">Current Payroll Advance Report</h1>
              <p className="text-teal-100">Monthly advance deductions and current status</p>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <input
              type="month"
              value={filters.month}
              onChange={(e) => handleFilterChange('month', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <input
              type="text"
              placeholder="Employee name..."
              value={filters.employee}
              onChange={(e) => handleFilterChange('employee', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Employee ID, Name..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
              <p className="text-blue-100 text-sm font-medium">Total Employees</p>
              <p className="text-xl font-bold">{totals.totalEmployees}</p>
            </div>
            <UserIcon className="h-6 w-6 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">With Advances</p>
              <p className="text-xl font-bold">{totals.employeesWithAdvances}</p>
            </div>
            <BanknotesIcon className="h-6 w-6 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Current Deductions</p>
              <p className="text-lg font-bold">{formatCurrency(totals.totalCurrentDeductions)}</p>
            </div>
            <ArrowUpIcon className="h-6 w-6 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Net Salaries</p>
              <p className="text-lg font-bold">{formatCurrency(totals.totalNetSalaries)}</p>
            </div>
            <CurrencyDollarIcon className="h-6 w-6 text-red-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Active Advances</p>
              <p className="text-xl font-bold">{totals.totalActiveAdvances}</p>
            </div>
            <ExclamationTriangleIcon className="h-6 w-6 text-orange-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm font-medium">Total Remaining</p>
              <p className="text-lg font-bold">{formatCurrency(totals.totalRemainingAmount)}</p>
            </div>
            <ClockIcon className="h-6 w-6 text-teal-200" />
          </div>
        </div>
      </div>

      {/* Current Advance Records Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Current Month Payroll Advances</h2>
          <p className="text-sm text-gray-600">Month: {filters.month} | Showing {filteredRecords.length} of {currentAdvances.length} employees</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary Information</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Advances</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Advance Summary</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
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
                      <div className="text-xs text-gray-500 mt-1">
                        Month: {record.currentMonth}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {record.advances.length > 0 ? (
                        record.advances.map((advance, index) => (
                          <div key={index} className="text-xs border rounded p-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{advance.advanceNo}</span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(advance.status)}`}>
                                {advance.status}
                              </span>
                            </div>
                            <div className="text-gray-600 mt-1">
                              Original: {formatCurrency(advance.originalAmount)}
                            </div>
                            <div className="text-gray-600">
                              Remaining: {formatCurrency(advance.remainingAmount)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 italic">No current advances</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>This Month:</span>
                        <span className="font-semibold text-red-600">{formatCurrency(record.totalCurrentDeduction)}</span>
                      </div>
                      {record.advances.map((advance, index) => (
                        <div key={index} className="text-xs text-gray-500 mt-1">
                          {advance.advanceNo}: {formatCurrency(advance.monthlyDeduction)}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Net Salary:</span>
                        <span className="font-semibold text-green-600">{formatCurrency(record.netSalaryAfterDeduction)}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        After deductions
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Total Advances:</span>
                        <span>{record.advanceHistory.totalAdvances}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Amount:</span>
                        <span>{formatCurrency(record.advanceHistory.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Paid:</span>
                        <span>{formatCurrency(record.advanceHistory.totalPaid)}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Remaining:</span>
                        <span>{formatCurrency(record.advanceHistory.totalRemaining)}</span>
                      </div>
                      {record.advanceHistory.totalAmount > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-teal-600 h-2 rounded-full" 
                            style={{ width: `${(record.advanceHistory.totalPaid / record.advanceHistory.totalAmount) * 100}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No current advance records found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentPayrollAdvanceReport;
