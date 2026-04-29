import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import { 
  MinusCircleIcon, 
  CalendarIcon, 
  UserIcon, 
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const DeductionReport = () => {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    department: 'all',
    deductionType: 'all',
    employee: 'all',
    searchTerm: ''
  });

  const [deductionRecords, setDeductionRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data for deduction records
  const mockDeductionData = [
    {
      id: 1,
      deductionNo: 'DED-2024-001',
      date: '2024-01-15',
      time: '10:30',
      employeeId: 'EMP-001',
      employeeName: 'Muhammad Ali',
      department: 'Front Office',
      position: 'Receptionist',
      basicSalary: 45000,
      deductionType: 'Advance Repayment',
      deductionAmount: 5000,
      reason: 'Monthly advance deduction - ADV-2024-001',
      approvedBy: 'HR Manager',
      status: 'Applied',
      month: '2024-01',
      relatedReference: 'ADV-2024-001'
    },
    {
      id: 2,
      deductionNo: 'DED-2024-002',
      date: '2024-01-16',
      time: '14:15',
      employeeId: 'EMP-002',
      employeeName: 'Fatima Sheikh',
      department: 'Housekeeping',
      position: 'Supervisor',
      basicSalary: 40000,
      deductionType: 'Late Arrival',
      deductionAmount: 500,
      reason: 'Late arrival penalty - 3 days',
      approvedBy: 'Department Manager',
      status: 'Applied',
      month: '2024-01',
      relatedReference: 'ATT-2024-001'
    },
    {
      id: 3,
      deductionNo: 'DED-2024-003',
      date: '2024-01-17',
      time: '09:45',
      employeeId: 'EMP-003',
      employeeName: 'Ahmed Hassan',
      department: 'Restaurant',
      position: 'Chef',
      basicSalary: 55000,
      deductionType: 'Provident Fund',
      deductionAmount: 2750,
      reason: 'Monthly PF contribution - 5%',
      approvedBy: 'Finance Manager',
      status: 'Applied',
      month: '2024-01',
      relatedReference: 'PF-2024-001'
    },
    {
      id: 4,
      deductionNo: 'DED-2024-004',
      date: '2024-01-18',
      time: '11:20',
      employeeId: 'EMP-004',
      employeeName: 'Sarah Khan',
      department: 'Accounts',
      position: 'Accountant',
      basicSalary: 50000,
      deductionType: 'Income Tax',
      deductionAmount: 3500,
      reason: 'Monthly tax deduction',
      approvedBy: 'Finance Manager',
      status: 'Applied',
      month: '2024-01',
      relatedReference: 'TAX-2024-001'
    },
    {
      id: 5,
      deductionNo: 'DED-2024-005',
      date: '2024-01-19',
      time: '16:30',
      employeeId: 'EMP-005',
      employeeName: 'Omar Malik',
      department: 'Security',
      position: 'Security Guard',
      basicSalary: 35000,
      deductionType: 'Uniform Cost',
      deductionAmount: 1200,
      reason: 'New uniform cost recovery',
      approvedBy: 'HR Manager',
      status: 'Applied',
      month: '2024-01',
      relatedReference: 'UNI-2024-001'
    },
    {
      id: 6,
      deductionNo: 'DED-2024-006',
      date: '2024-01-20',
      time: '13:10',
      employeeId: 'EMP-006',
      employeeName: 'Zain Ahmed',
      department: 'Maintenance',
      position: 'Technician',
      basicSalary: 42000,
      deductionType: 'Damage Recovery',
      deductionAmount: 2500,
      reason: 'Equipment damage recovery',
      approvedBy: 'Department Manager',
      status: 'Pending',
      month: '2024-01',
      relatedReference: 'DMG-2024-001'
    },
    {
      id: 7,
      deductionNo: 'DED-2024-007',
      date: '2024-01-21',
      time: '12:45',
      employeeId: 'EMP-007',
      employeeName: 'Bilal Ahmad',
      department: 'Restaurant',
      position: 'Waiter',
      basicSalary: 30000,
      deductionType: 'Absent Days',
      deductionAmount: 1000,
      reason: 'Unauthorized absence - 2 days',
      approvedBy: 'Department Manager',
      status: 'Applied',
      month: '2024-01',
      relatedReference: 'ABS-2024-001'
    },
    {
      id: 8,
      deductionNo: 'DED-2024-008',
      date: '2024-01-22',
      time: '15:20',
      employeeId: 'EMP-008',
      employeeName: 'Aisha Malik',
      department: 'Front Office',
      position: 'Guest Relations',
      basicSalary: 38000,
      deductionType: 'Medical Insurance',
      deductionAmount: 800,
      reason: 'Monthly medical insurance premium',
      approvedBy: 'HR Manager',
      status: 'Applied',
      month: '2024-01',
      relatedReference: 'INS-2024-001'
    }
  ];

  useEffect(() => {
    fetchDeductionRecords();
  }, [filters.month, filters.department]);

  // Fetch deduction records from API
  const fetchDeductionRecords = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (filters.month) params.append('month', filters.month);
      if (filters.department !== 'all') params.append('department', filters.department);
      if (filters.deductionType !== 'all') params.append('deductionType', filters.deductionType);
      
      const response = await axios.get(`/Reports/deduction-report?${params}`);
      if (response.data?.success) {
        setDeductionRecords(response.data.data);
      } else {
        setError('Failed to load deduction records');
        setDeductionRecords(mockDeductionData);
      }
    } catch (err) {
      console.error('Error fetching deduction records:', err);
      setError('Failed to load deduction records');
      setDeductionRecords(mockDeductionData);
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

  const filteredRecords = deductionRecords.filter(record => {
    const matchesDateFrom = !filters.dateFrom || record.date >= filters.dateFrom;
    const matchesDateTo = !filters.dateTo || record.date <= filters.dateTo;
    const matchesDepartment = filters.department === 'all' || record.department.toLowerCase() === filters.department.toLowerCase();
    const matchesDeductionType = filters.deductionType === 'all' || record.deductionType.toLowerCase() === filters.deductionType.toLowerCase();
    const matchesEmployee = filters.employee === 'all' || record.employeeName.toLowerCase().includes(filters.employee.toLowerCase());
    const matchesSearch = !filters.searchTerm || 
      record.deductionNo.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.employeeName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.reason.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return matchesDateFrom && matchesDateTo && matchesDepartment && matchesDeductionType && matchesEmployee && matchesSearch;
  });

  const formatCurrency = (amount) => {
    return `Rs ${amount.toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Applied': return <CheckCircleIcon className="h-4 w-4" />;
      case 'Pending': return <ClockIcon className="h-4 w-4" />;
      case 'Cancelled': return <XCircleIcon className="h-4 w-4" />;
      default: return <ExclamationTriangleIcon className="h-4 w-4" />;
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

  const getDeductionTypeColor = (type) => {
    switch (type) {
      case 'Advance Repayment': return 'text-blue-600 bg-blue-100';
      case 'Provident Fund': return 'text-green-600 bg-green-100';
      case 'Income Tax': return 'text-purple-600 bg-purple-100';
      case 'Late Arrival': return 'text-yellow-600 bg-yellow-100';
      case 'Absent Days': return 'text-red-600 bg-red-100';
      case 'Damage Recovery': return 'text-orange-600 bg-orange-100';
      case 'Uniform Cost': return 'text-indigo-600 bg-indigo-100';
      case 'Medical Insurance': return 'text-teal-600 bg-teal-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const calculateTotals = () => {
    return filteredRecords.reduce((acc, record) => ({
      totalDeductions: acc.totalDeductions + 1,
      totalAmount: acc.totalAmount + record.deductionAmount,
      appliedDeductions: acc.appliedDeductions + (record.status === 'Applied' ? 1 : 0),
      pendingDeductions: acc.pendingDeductions + (record.status === 'Pending' ? 1 : 0),
      appliedAmount: acc.appliedAmount + (record.status === 'Applied' ? record.deductionAmount : 0),
      pendingAmount: acc.pendingAmount + (record.status === 'Pending' ? record.deductionAmount : 0)
    }), { 
      totalDeductions: 0, 
      totalAmount: 0, 
      appliedDeductions: 0, 
      pendingDeductions: 0,
      appliedAmount: 0,
      pendingAmount: 0
    });
  };

  const totals = calculateTotals();

  const handleExport = () => {
    console.log('Exporting deduction report...');
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
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MinusCircleIcon className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">Deduction Report</h1>
              <p className="text-red-100">Employee salary deductions and penalties tracking</p>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Deduction Type</label>
            <select
              value={filters.deductionType}
              onChange={(e) => handleFilterChange('deductionType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="advance repayment">Advance Repayment</option>
              <option value="provident fund">Provident Fund</option>
              <option value="income tax">Income Tax</option>
              <option value="late arrival">Late Arrival</option>
              <option value="absent days">Absent Days</option>
              <option value="damage recovery">Damage Recovery</option>
              <option value="uniform cost">Uniform Cost</option>
              <option value="medical insurance">Medical Insurance</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <input
              type="text"
              placeholder="Employee name..."
              value={filters.employee}
              onChange={(e) => handleFilterChange('employee', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Deduction No, Employee..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
              <p className="text-blue-100 text-sm font-medium">Total Deductions</p>
              <p className="text-xl font-bold">{totals.totalDeductions}</p>
            </div>
            <MinusCircleIcon className="h-6 w-6 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Amount</p>
              <p className="text-lg font-bold">{formatCurrency(totals.totalAmount)}</p>
            </div>
            <CurrencyDollarIcon className="h-6 w-6 text-red-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Applied</p>
              <p className="text-xl font-bold">{totals.appliedDeductions}</p>
            </div>
            <CheckCircleIcon className="h-6 w-6 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Pending</p>
              <p className="text-xl font-bold">{totals.pendingDeductions}</p>
            </div>
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Applied Amount</p>
              <p className="text-lg font-bold">{formatCurrency(totals.appliedAmount)}</p>
            </div>
            <CheckCircleIcon className="h-6 w-6 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Pending Amount</p>
              <p className="text-lg font-bold">{formatCurrency(totals.pendingAmount)}</p>
            </div>
            <ClockIcon className="h-6 w-6 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Deduction Records Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Deduction Records</h2>
          <p className="text-sm text-gray-600">Showing {filteredRecords.length} of {deductionRecords.length} records</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deduction Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deduction Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount & Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.deductionNo}</div>
                      <div className="text-sm text-gray-500 flex items-center space-x-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{record.date}</span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{record.time}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Month: {record.month}
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
                      <div className="text-sm text-gray-500">
                        Basic: {formatCurrency(record.basicSalary)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDeductionTypeColor(record.deductionType)}`}>
                      {record.deductionType}
                    </span>
                    {record.relatedReference && (
                      <div className="text-xs text-gray-500 mt-1">
                        Ref: {record.relatedReference}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-lg font-semibold text-red-600">
                        {formatCurrency(record.deductionAmount)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {record.reason}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {record.approvedBy}
                      </div>
                      <div className="text-sm text-gray-500">
                        Approved on: {record.date}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      <span className="ml-1">{record.status}</span>
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No deduction records found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeductionReport;
