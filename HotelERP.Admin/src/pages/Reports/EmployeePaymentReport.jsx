import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import { 
  CreditCardIcon, 
  CalendarIcon, 
  UserIcon, 
  CurrencyDollarIcon,
  BanknotesIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const EmployeePaymentReport = () => {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    department: 'all',
    paymentType: 'all',
    paymentMethod: 'all',
    employee: 'all',
    searchTerm: ''
  });

  const [paymentRecords, setPaymentRecords] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      employeeName: 'Ahmed Ali Khan',
      department: 'Front Office',
      position: 'Front Desk Manager',
      paymentDate: '2024-01-31',
      paymentType: 'Monthly Salary',
      basicSalary: 85000,
      allowances: 15000,
      overtime: 5000,
      bonus: 10000,
      grossSalary: 115000,
      taxDeduction: 11500,
      providentFund: 8500,
      insurance: 2000,
      totalDeductions: 22000,
      netSalary: 93000,
      paymentMethod: 'Bank Transfer',
      bankAccount: 'HBL-1234567890',
      paymentStatus: 'Paid',
      processedBy: 'HR Manager'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      employeeName: 'Fatima Sheikh',
      department: 'Housekeeping',
      position: 'Housekeeping Supervisor',
      paymentDate: '2024-01-31',
      paymentType: 'Monthly Salary',
      basicSalary: 65000,
      allowances: 10000,
      overtime: 8000,
      bonus: 5000,
      grossSalary: 88000,
      taxDeduction: 8800,
      providentFund: 6500,
      insurance: 1500,
      totalDeductions: 16800,
      netSalary: 71200,
      paymentMethod: 'Bank Transfer',
      bankAccount: 'UBL-2345678901',
      paymentStatus: 'Paid',
      processedBy: 'HR Manager'
    },
    {
      id: 3,
      employeeId: 'EMP003',
      employeeName: 'Muhammad Zubair',
      department: 'Restaurant',
      position: 'Head Chef',
      paymentDate: '2024-01-31',
      paymentType: 'Monthly Salary',
      basicSalary: 95000,
      allowances: 20000,
      overtime: 12000,
      bonus: 15000,
      grossSalary: 142000,
      taxDeduction: 14200,
      providentFund: 9500,
      insurance: 2500,
      totalDeductions: 26200,
      netSalary: 115800,
      paymentMethod: 'Bank Transfer',
      bankAccount: 'MCB-3456789012',
      paymentStatus: 'Paid',
      processedBy: 'HR Manager'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    console.log('EmployeePaymentReport component loaded with mock data:', paymentRecords.length, 'payment records');
  }, []);

  // Fetch employee payment records - PURE API CALL
  const fetchPaymentRecords = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.department !== 'all') params.append('department', filters.department);
      if (filters.paymentType !== 'all') params.append('paymentType', filters.paymentType);
      if (filters.paymentMethod !== 'all') params.append('paymentMethod', filters.paymentMethod);
      if (filters.employee !== 'all') params.append('employee', filters.employee);
      
      const response = await axios.get(`/api/Reports/employee-payments?${params}`);
      
      if (response.data?.success) {
        setPaymentRecords(response.data.data);
      } else {
        setError('No payment records data received');
        setPaymentRecords([]);
      }
    } catch (err) {
      console.error('Error fetching payment records:', err);
      setError(err.response?.data?.message || 'Failed to load payment records');
      setPaymentRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch hotel information - PURE API CALL
  const fetchHotelInfo = async () => {
    try {
      const response = await axios.get('/Settings/hotel-info');
      if (response.data?.success) {
        setHotelInfo(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching hotel info:', err);
    }
  };

  // Print report
  const handlePrint = () => {
    const printContent = document.getElementById('printable-report');
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Payment Date', 'Employee Name', 'Department', 'Payment Type', 'Payment Method', 'Amount', 'Status'];
    const csvData = paymentRecords.map(record => [
      record.date,
      record.employeeName,
      record.department,
      record.paymentType,
      record.paymentMethod,
      `Rs ${record.amount?.toLocaleString()}`,
      record.status
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `employee-payment-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Filter records based on search term
  const filteredRecords = paymentRecords.filter(record =>
    record.employeeName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
    record.employeeId?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
    record.paymentNo?.toLowerCase().includes(filters.searchTerm.toLowerCase())
  );

  // Calculate totals
  const totalPayments = filteredRecords.length;
  const totalAmount = filteredRecords.reduce((sum, record) => sum + (record.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <CreditCardIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Employee Payment Report</h1>
                <p className="text-gray-600">Staff payment records and payroll analytics</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handlePrint}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2 transition-colors"
              >
                <PrinterIcon className="h-5 w-5" />
                <span>Print</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 transition-colors"
              >
                <DocumentArrowDownIcon className="h-5 w-5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                <option value="Front Office">Front Office</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Accounts">Accounts</option>
                <option value="HR">HR</option>
                <option value="Security">Security</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
              <select
                value={filters.paymentType}
                onChange={(e) => setFilters({...filters, paymentType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="Monthly Salary">Monthly Salary</option>
                <option value="Overtime">Overtime</option>
                <option value="Bonus">Bonus</option>
                <option value="Advance">Advance</option>
                <option value="Commission">Commission</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                value={filters.paymentMethod}
                onChange={(e) => setFilters({...filters, paymentMethod: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Methods</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
                <option value="Mobile Payment">Mobile Payment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
              <select
                value={filters.employee}
                onChange={(e) => setFilters({...filters, employee: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Employees</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-green-700">{success}</span>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <CreditCardIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900">{totalPayments}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">Rs {totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Payment</p>
                <p className="text-2xl font-bold text-gray-900">
                  Rs {totalPayments > 0 ? Math.round(totalAmount / totalPayments).toLocaleString() : '0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Printable Report */}
        <div id="printable-report">
          {/* Hotel Header for Print */}
          <div className="hidden print:block text-center mb-8">
            <h1 className="text-2xl font-bold">{hotelInfo?.name || 'Hotel Management System'}</h1>
            <p>{hotelInfo?.address || 'Hotel Address'}</p>
            <p>Phone: {hotelInfo?.phone || 'N/A'} | Email: {hotelInfo?.email || 'N/A'}</p>
            <hr className="my-4" />
            <h2 className="text-xl font-bold">Employee Payment Report</h2>
            <p>Generated on: {new Date().toLocaleDateString()}</p>
            {(filters.dateFrom || filters.dateTo) && (
              <p>Period: {filters.dateFrom || 'Start'} to {filters.dateTo || 'End'}</p>
            )}
          </div>

          {/* Report Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                          <span className="ml-2 text-gray-600">Loading payment records...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                        No payment records found
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {record.paymentNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{record.date}</div>
                          <div className="text-gray-500 flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {record.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                          <div className="text-sm text-gray-500">{record.employeeId}</div>
                          <div className="text-sm text-gray-500">{record.position}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {record.department}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.paymentType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <BanknotesIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {record.paymentMethod}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          Rs {record.amount?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            record.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            record.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Print Footer */}
          <div className="hidden print:block mt-8 text-center text-sm text-gray-600">
            <p>This is a computer generated report from {hotelInfo?.name || 'Hotel Management System'}</p>
            <p>Generated on: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePaymentReport;
