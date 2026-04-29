import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import { 
  DocumentTextIcon, 
  CalendarIcon, 
  UserIcon, 
  CurrencyDollarIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  ClockIcon,
  BanknotesIcon,
  ArrowUpIcon,
  MinusCircleIcon
} from '@heroicons/react/24/outline';

const SalarySlipReport = () => {
  const [filters, setFilters] = useState({
    month: new Date().toISOString().slice(0, 7), // Current month
    department: 'all',
    employee: 'all',
    searchTerm: ''
  });

  const [salarySlips, setSalarySlips] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      employeeName: 'Ahmed Ali Khan',
      department: 'Front Office',
      position: 'Front Desk Manager',
      month: '2024-01',
      joiningDate: '2023-01-15',
      workingDays: 31,
      presentDays: 30,
      absentDays: 1,
      basicSalary: 85000,
      houseRentAllowance: 10000,
      medicalAllowance: 3000,
      transportAllowance: 2000,
      overtimeHours: 10,
      overtimeRate: 500,
      overtimeAmount: 5000,
      bonus: 10000,
      grossSalary: 115000,
      incomeTax: 8500,
      providentFund: 8500,
      eobi: 1000,
      professionalTax: 200,
      insurance: 2000,
      loanDeduction: 0,
      advanceDeduction: 2000,
      totalDeductions: 22200,
      netSalary: 92800,
      bankAccount: 'HBL-1234567890',
      cnic: '35202-1234567-1'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      employeeName: 'Fatima Sheikh',
      department: 'Housekeeping',
      position: 'Housekeeping Supervisor',
      month: '2024-01',
      joiningDate: '2023-03-20',
      workingDays: 31,
      presentDays: 31,
      absentDays: 0,
      basicSalary: 65000,
      houseRentAllowance: 8000,
      medicalAllowance: 2000,
      transportAllowance: 1500,
      overtimeHours: 15,
      overtimeRate: 400,
      overtimeAmount: 6000,
      bonus: 5000,
      grossSalary: 87500,
      incomeTax: 6500,
      providentFund: 6500,
      eobi: 800,
      professionalTax: 200,
      insurance: 1500,
      loanDeduction: 5000,
      advanceDeduction: 0,
      totalDeductions: 20500,
      netSalary: 67000,
      bankAccount: 'UBL-2345678901',
      cnic: '35202-2345678-2'
    },
    {
      id: 3,
      employeeId: 'EMP003',
      employeeName: 'Muhammad Zubair',
      department: 'Restaurant',
      position: 'Head Chef',
      month: '2024-01',
      joiningDate: '2022-11-10',
      workingDays: 31,
      presentDays: 29,
      absentDays: 2,
      basicSalary: 95000,
      houseRentAllowance: 12000,
      medicalAllowance: 4000,
      transportAllowance: 2500,
      overtimeHours: 20,
      overtimeRate: 600,
      overtimeAmount: 12000,
      bonus: 15000,
      grossSalary: 140500,
      incomeTax: 12000,
      providentFund: 9500,
      eobi: 1200,
      professionalTax: 200,
      insurance: 2500,
      loanDeduction: 0,
      advanceDeduction: 3000,
      totalDeductions: 28400,
      netSalary: 112100,
      bankAccount: 'MCB-3456789012',
      cnic: '35202-3456789-3'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hotelInfo, setHotelInfo] = useState({
    name: 'Grand Palace Hotel',
    address: 'Main Boulevard, Gulberg III, Lahore',
    phone: '+92-42-1234567',
    email: 'info@grandpalace.pk',
    website: 'www.grandpalace.pk',
    logo: '/hotel-logo.png'
  });

  // Load data on component mount
  useEffect(() => {
    // API calls disabled to show mock data
    console.log('SalarySlipReport component loaded with mock data:', salarySlips.length, 'salary slips');
  }, []);

  // Fetch salary slips from API
  const fetchSalarySlips = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.month) params.append('month', filters.month);
      if (filters.department !== 'all') params.append('department', filters.department);
      if (filters.employeeId) params.append('employeeId', filters.employeeId);
      
      const response = await axios.get(`/api/Reports/salary-slips?${params}`);
      if (response.data.success) {
        setSalarySlips(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching salary slips:', err);
      setError('Failed to load salary slips');
      // Fallback to mock data
      setSalarySlips(mockSalarySlipData);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotelInfo = async () => {
    try {
      const response = await axios.get('/api/Reports/hotel-info');
      if (response.data.success) {
        setHotelInfo(response.data.data);
      }
    } catch (err) {
      setHotelInfo({
        HotelName: 'Pearl Continental Hotel',
        Address: 'Club Road, Karachi, Pakistan',
        Phone: '+92-21-111-505-505',
        Email: 'info@pckarachi.com'
      });
    }
  };

  // Mock data for salary slips
  const mockSalarySlipData = [
    {
      id: 1,
      slipNo: 'SLIP-2024-001',
      month: '2024-01',
      employeeId: 'EMP-001',
      employeeName: 'Muhammad Ali',
      department: 'Front Office',
      position: 'Receptionist',
      joiningDate: '2023-06-15',
      bankAccount: 'Allied Bank - 1234567890',
      workingDays: 31,
      presentDays: 29,
      absentDays: 2,
      overtimeHours: 8,
      earnings: {
        basicSalary: 45000,
        houseRentAllowance: 3000,
        medicalAllowance: 1500,
        conveyanceAllowance: 500,
        overtimePay: 2000,
        bonus: 1000,
        totalEarnings: 53000
      },
      deductions: {
        providentFund: 2250,
        incomeTax: 1500,
        advanceDeduction: 5000,
        lateArrivalPenalty: 250,
        totalDeductions: 9000
      },
      netSalary: 44000,
      generatedDate: '2024-01-31',
      generatedBy: 'HR Manager'
    },
    {
      id: 2,
      slipNo: 'SLIP-2024-002',
      month: '2024-01',
      employeeId: 'EMP-002',
      employeeName: 'Fatima Sheikh',
      department: 'Housekeeping',
      position: 'Supervisor',
      joiningDate: '2022-03-10',
      bankAccount: 'HBL Bank - 9876543210',
      workingDays: 31,
      presentDays: 31,
      absentDays: 0,
      overtimeHours: 6,
      earnings: {
        basicSalary: 40000,
        houseRentAllowance: 2500,
        medicalAllowance: 1200,
        conveyanceAllowance: 300,
        overtimePay: 1500,
        bonus: 0,
        totalEarnings: 45500
      },
      deductions: {
        providentFund: 2000,
        incomeTax: 1200,
        advanceDeduction: 5000,
        lateArrivalPenalty: 0,
        totalDeductions: 8200
      },
      netSalary: 37300,
      generatedDate: '2024-01-31',
      generatedBy: 'HR Manager'
    },
    {
      id: 3,
      slipNo: 'SLIP-2024-003',
      month: '2024-01',
      employeeId: 'EMP-003',
      employeeName: 'Ahmed Hassan',
      department: 'Restaurant',
      position: 'Chef',
      joiningDate: '2021-08-20',
      bankAccount: 'UBL Bank - 5555666677',
      workingDays: 31,
      presentDays: 30,
      absentDays: 1,
      overtimeHours: 12,
      earnings: {
        basicSalary: 55000,
        houseRentAllowance: 4000,
        medicalAllowance: 2000,
        conveyanceAllowance: 1000,
        overtimePay: 3000,
        bonus: 2000,
        totalEarnings: 67000
      },
      deductions: {
        providentFund: 2750,
        incomeTax: 2500,
        advanceDeduction: 7500,
        lateArrivalPenalty: 0,
        totalDeductions: 12750
      },
      netSalary: 54250,
      generatedDate: '2024-01-31',
      generatedBy: 'HR Manager'
    },
    {
      id: 4,
      slipNo: 'SLIP-2024-004',
      month: '2024-01',
      employeeId: 'EMP-004',
      employeeName: 'Sarah Khan',
      department: 'Accounts',
      position: 'Accountant',
      joiningDate: '2023-01-05',
      bankAccount: 'MCB Bank - 1111222233',
      workingDays: 31,
      presentDays: 31,
      absentDays: 0,
      overtimeHours: 10,
      earnings: {
        basicSalary: 50000,
        houseRentAllowance: 3500,
        medicalAllowance: 1800,
        conveyanceAllowance: 700,
        overtimePay: 2500,
        bonus: 1500,
        totalEarnings: 60000
      },
      deductions: {
        providentFund: 2500,
        incomeTax: 2000,
        advanceDeduction: 0,
        lateArrivalPenalty: 0,
        totalDeductions: 4500
      },
      netSalary: 55500,
      generatedDate: '2024-01-31',
      generatedBy: 'Finance Manager'
    },
    {
      id: 5,
      slipNo: 'SLIP-2024-005',
      month: '2024-01',
      employeeId: 'EMP-005',
      employeeName: 'Omar Malik',
      department: 'Security',
      position: 'Security Guard',
      joiningDate: '2023-09-12',
      bankAccount: 'NBP Bank - 7777888899',
      workingDays: 31,
      presentDays: 28,
      absentDays: 3,
      overtimeHours: 20,
      earnings: {
        basicSalary: 35000,
        houseRentAllowance: 2000,
        medicalAllowance: 1000,
        conveyanceAllowance: 500,
        overtimePay: 5000,
        bonus: 500,
        totalEarnings: 44000
      },
      deductions: {
        providentFund: 1750,
        incomeTax: 800,
        advanceDeduction: 3000,
        lateArrivalPenalty: 500,
        totalDeductions: 6050
      },
      netSalary: 37950,
      generatedDate: '2024-01-31',
      generatedBy: 'HR Manager'
    }
  ];

  // Removed duplicate useEffect - using the proper API call above

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredRecords = salarySlips.filter(record => {
    const matchesMonth = !filters.month || record.month === filters.month;
    const matchesDepartment = filters.department === 'all' || record.department.toLowerCase() === filters.department.toLowerCase();
    const matchesEmployee = filters.employee === 'all' || record.employeeName.toLowerCase().includes(filters.employee.toLowerCase());
    const matchesSearch = !filters.searchTerm || 
      record.slipNo.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.employeeName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return matchesMonth && matchesDepartment && matchesEmployee && matchesSearch;
  });

  const formatCurrency = (amount) => {
    return `Rs ${amount.toLocaleString()}`;
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
      totalSlips: acc.totalSlips + 1,
      totalEarnings: acc.totalEarnings + record.earnings.totalEarnings,
      totalDeductions: acc.totalDeductions + record.deductions.totalDeductions,
      totalNetSalary: acc.totalNetSalary + record.netSalary,
      totalWorkingDays: acc.totalWorkingDays + record.workingDays,
      totalPresentDays: acc.totalPresentDays + record.presentDays,
      totalOvertimeHours: acc.totalOvertimeHours + record.overtimeHours
    }), { 
      totalSlips: 0, 
      totalEarnings: 0, 
      totalDeductions: 0, 
      totalNetSalary: 0,
      totalWorkingDays: 0,
      totalPresentDays: 0,
      totalOvertimeHours: 0
    });
  };

  const totals = calculateTotals();

  const handleExport = () => {
    console.log('Exporting salary slip report...');
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePrintSlip = (slip) => {
    console.log('Printing individual salary slip:', slip.slipNo);
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">Salary Slip Report</h1>
              <p className="text-blue-100">Monthly salary slips and payroll summaries</p>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Slip No, Employee..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Slips</p>
              <p className="text-xl font-bold">{totals.totalSlips}</p>
            </div>
            <DocumentTextIcon className="h-6 w-6 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Earnings</p>
              <p className="text-lg font-bold">{formatCurrency(totals.totalEarnings)}</p>
            </div>
            <ArrowUpIcon className="h-6 w-6 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Deductions</p>
              <p className="text-lg font-bold">{formatCurrency(totals.totalDeductions)}</p>
            </div>
            <MinusCircleIcon className="h-6 w-6 text-red-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Net Salary</p>
              <p className="text-lg font-bold">{formatCurrency(totals.totalNetSalary)}</p>
            </div>
            <BanknotesIcon className="h-6 w-6 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Working Days</p>
              <p className="text-xl font-bold">{totals.totalWorkingDays}</p>
            </div>
            <CalendarIcon className="h-6 w-6 text-orange-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm font-medium">Present Days</p>
              <p className="text-xl font-bold">{totals.totalPresentDays}</p>
            </div>
            <UserIcon className="h-6 w-6 text-teal-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Overtime Hours</p>
              <p className="text-xl font-bold">{totals.totalOvertimeHours}</p>
            </div>
            <ClockIcon className="h-6 w-6 text-indigo-200" />
          </div>
        </div>
      </div>

      {/* Salary Slips Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Salary Slips</h2>
          <p className="text-sm text-gray-600">Month: {filters.month} | Showing {filteredRecords.length} of {salarySlips.length} slips</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                      <div className="text-xs text-gray-500">
                        Slip: {record.slipNo}
                      </div>
                      <div className="text-xs text-gray-500">
                        Joined: {record.joiningDate}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Working:</span>
                        <span>{record.workingDays} days</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Present:</span>
                        <span>{record.presentDays} days</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Absent:</span>
                        <span>{record.absentDays} days</span>
                      </div>
                      <div className="flex justify-between text-blue-600">
                        <span>Overtime:</span>
                        <span>{record.overtimeHours} hrs</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Basic:</span>
                        <span>{formatCurrency(record.earnings.basicSalary)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HRA:</span>
                        <span>{formatCurrency(record.earnings.houseRentAllowance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Medical:</span>
                        <span>{formatCurrency(record.earnings.medicalAllowance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conveyance:</span>
                        <span>{formatCurrency(record.earnings.conveyanceAllowance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overtime:</span>
                        <span>{formatCurrency(record.earnings.overtimePay)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bonus:</span>
                        <span>{formatCurrency(record.earnings.bonus)}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-1 text-green-600">
                        <span>Total:</span>
                        <span>{formatCurrency(record.earnings.totalEarnings)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>PF:</span>
                        <span>{formatCurrency(record.deductions.providentFund)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>{formatCurrency(record.deductions.incomeTax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Advance:</span>
                        <span>{formatCurrency(record.deductions.advanceDeduction)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Penalty:</span>
                        <span>{formatCurrency(record.deductions.lateArrivalPenalty)}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-1 text-red-600">
                        <span>Total:</span>
                        <span>{formatCurrency(record.deductions.totalDeductions)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-blue-600">
                      {formatCurrency(record.netSalary)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {record.bankAccount}
                    </div>
                    <div className="text-xs text-gray-500">
                      Generated: {record.generatedDate}
                    </div>
                    <div className="text-xs text-gray-500">
                      By: {record.generatedBy}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handlePrintSlip(record)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1 transition-all duration-200"
                    >
                      <PrinterIcon className="h-4 w-4" />
                      <span>Print Slip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No salary slips found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalarySlipReport;
