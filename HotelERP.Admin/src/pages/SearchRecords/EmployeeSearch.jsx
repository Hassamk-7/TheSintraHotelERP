import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import {
  MagnifyingGlassIcon,
  UserIcon,
  FunnelIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const EmployeeSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const [employees, setEmployees] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'Ahmed Ali Khan',
      department: 'Front Office',
      position: 'Front Desk Manager',
      email: 'ahmed.ali@hotel.pk',
      phone: '+92-300-1234567',
      salary: 85000,
      joiningDate: '2023-01-15',
      status: 'Active',
      address: 'Block A, Gulberg, Lahore',
      emergencyContact: '+92-300-7654321',
      cnic: '35202-1234567-1'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      name: 'Fatima Sheikh',
      department: 'Housekeeping',
      position: 'Housekeeping Supervisor',
      email: 'fatima.sheikh@hotel.pk',
      phone: '+92-301-2345678',
      salary: 65000,
      joiningDate: '2023-03-20',
      status: 'Active',
      address: 'Model Town, Lahore',
      emergencyContact: '+92-301-8765432',
      cnic: '35202-2345678-2'
    },
    {
      id: 3,
      employeeId: 'EMP003',
      name: 'Muhammad Zubair',
      department: 'Restaurant',
      position: 'Head Chef',
      email: 'zubair@hotel.pk',
      phone: '+92-302-3456789',
      salary: 95000,
      joiningDate: '2022-11-10',
      status: 'Active',
      address: 'Johar Town, Lahore',
      emergencyContact: '+92-302-9876543',
      cnic: '35202-3456789-3'
    },
    {
      id: 4,
      employeeId: 'EMP004',
      name: 'Sara Ahmed',
      department: 'Accounts',
      position: 'Accountant',
      email: 'sara.ahmed@hotel.pk',
      phone: '+92-303-4567890',
      salary: 75000,
      joiningDate: '2023-05-12',
      status: 'Active',
      address: 'DHA Phase 5, Lahore',
      emergencyContact: '+92-303-0987654',
      cnic: '35202-4567890-4'
    },
    {
      id: 5,
      employeeId: 'EMP005',
      name: 'Ali Hassan',
      department: 'Security',
      position: 'Security Guard',
      email: 'ali.hassan@hotel.pk',
      phone: '+92-304-5678901',
      salary: 45000,
      joiningDate: '2023-07-01',
      status: 'On Leave',
      address: 'Shalimar Town, Lahore',
      emergencyContact: '+92-304-1098765',
      cnic: '35202-5678901-5'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Load employees on component mount and filter changes
  useEffect(() => {
    // API calls disabled to show mock data
    console.log('EmployeeSearch component loaded with mock data:', employees.length, 'employees');
  }, []);

  // Fetch employees - PURE API CALL
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (departmentFilter) params.append('department', departmentFilter);
      if (statusFilter) params.append('status', statusFilter);
      if (positionFilter) params.append('position', positionFilter);
      if (dateRange.start) params.append('hireDateFrom', dateRange.start);
      if (dateRange.end) params.append('hireDateTo', dateRange.end);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await axios.get(`/api/SearchRecords/employees?${params}`);
      
      if (response.data?.success) {
        setEmployees(response.data.data);
      } else {
        setError('No employee data received');
        setEmployees([]);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError(err.response?.data?.message || 'Failed to load employees');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    fetchEmployees();
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('');
    setStatusFilter('');
    setPositionFilter('');
    setDateRange({ start: '', end: '' });
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee =>
    employee.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.phone?.includes(searchTerm)
  );

  // View employee details
  const viewEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowDetails(true);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'On Leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                <UserIcon className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Employee Search</h1>
                <p className="text-blue-100 text-lg">Search and manage employee records</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{filteredEmployees.length}</div>
                <div className="text-blue-200 text-sm">Total Employees</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{filteredEmployees.filter(emp => emp.status === 'Active').length}</div>
                <div className="text-blue-200 text-sm">Active Staff</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <MagnifyingGlassIcon className="h-6 w-6 text-blue-600 mr-2" />
              Search & Filter
            </h2>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search Employees</label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                  placeholder="Search by name, ID, email, phone..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              >
                <option value="">All Departments</option>
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Positions</option>
                <option value="Manager">Manager</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Executive">Executive</option>
                <option value="Assistant">Assistant</option>
                <option value="Officer">Officer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date From</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date To</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end space-x-2">
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
                <span>Search</span>
              </button>
              <button
                onClick={clearFilters}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
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

        {/* Results */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Search Results ({filteredEmployees.length} employees found)
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Searching employees...</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <UserIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No employees found matching your criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hire Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <UserIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{employee.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {employee.email}
                          </div>
                          <div className="flex items-center">
                            <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {employee.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {employee.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1 text-gray-400" />
                          Rs {employee.salary?.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <CalendarDaysIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {employee.hireDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => viewEmployeeDetails(employee)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Employee Details Modal */}
        {showDetails && selectedEmployee && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Employee Details</h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <p className="text-sm text-gray-900">{selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                      <p className="text-sm text-gray-900">{selectedEmployee.employeeId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedEmployee.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{selectedEmployee.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Department</label>
                      <p className="text-sm text-gray-900">{selectedEmployee.department}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Position</label>
                      <p className="text-sm text-gray-900">{selectedEmployee.position}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Salary</label>
                      <p className="text-sm text-gray-900">Rs {selectedEmployee.salary?.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Hire Date</label>
                      <p className="text-sm text-gray-900">{selectedEmployee.hireDate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedEmployee.status)}`}>
                        {selectedEmployee.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                      <p className="text-sm text-gray-900">{selectedEmployee.emergencyContact}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="text-sm text-gray-900">{selectedEmployee.address}</p>
                  </div>

                  {selectedEmployee.attendanceRate && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Attendance Rate</label>
                        <p className="text-sm text-gray-900">{selectedEmployee.attendanceRate}%</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Total Leaves</label>
                        <p className="text-sm text-gray-900">{selectedEmployee.totalLeaves}</p>
                      </div>
                    </div>
                  )}

                  {selectedEmployee.lastLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Login</label>
                      <p className="text-sm text-gray-900">{selectedEmployee.lastLogin}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeSearch;
