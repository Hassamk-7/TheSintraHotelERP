import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline'

const EmployeeManagement = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeCode: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    maritalStatus: '',
    email: '',
    phoneNumber: '',
    mobileNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    designation: '',
    position: '',
    department: '',
    joiningDate: '',
    terminationDate: '',
    employmentType: 'Full-time',
    basicSalary: '',
    emergencyContactName: '',
    emergencyContact: '',
    emergencyContactPhone: '',
    emergencyPhone: '',
    emergencyContactRelation: '',
    status: 'Active',
    notes: '',
    departmentId: '',
    designationId: '',
    isActive: true
  })

  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [designations, setDesignations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load employees, departments, and designations on component mount
  useEffect(() => {
    fetchEmployees()
    fetchDepartments()
    fetchDesignations()
  }, [])

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/PayrollHR/employees?pageSize=100')
      if (response.data.success && response.data.data) {
        setEmployees(response.data.data)
      } else {
        setEmployees([])
      }
    } catch (err) {
      console.error('Error fetching employees:', err)
      setError('Failed to load employees. Please try again.')
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch departments from API
  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/PayrollHR/departments')
      if (response.data.success && response.data.data) {
        setDepartments(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching departments:', err)
    }
  }

  // Fetch designations from API
  const fetchDesignations = async () => {
    try {
      const response = await axios.get('/PayrollHR/designations')
      if (response.data.success && response.data.data) {
        setDesignations(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching designations:', err)
    }
  }

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required'
    if (!formData.position.trim()) newErrors.position = 'Position is required'
    if (!formData.basicSalary || parseFloat(formData.basicSalary) <= 0) {
      newErrors.basicSalary = 'Valid salary is required'
    }
    if (!formData.joiningDate) newErrors.joiningDate = 'Joining date is required'
    if (!formData.department.trim()) newErrors.department = 'Department is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateEmployeeId = () => {
    const count = employees.length + 1
    return `EMP-${String(count).padStart(3, '0')}`
  }

  // Helper function to format date for HTML input (yyyy-mm-dd)
  const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ''
      return date.toISOString().split('T')[0]
    } catch (e) {
      return ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      // Build employee data with proper null handling
      const employeeData = {
        ...formData,
        basicSalary: parseFloat(formData.basicSalary) || 0,
        // Convert empty strings to null for optional fields
        dateOfBirth: formData.dateOfBirth || null,
        terminationDate: formData.terminationDate || null,
        middleName: formData.middleName || null,
        maritalStatus: formData.maritalStatus || null,
        country: formData.country || null,
        state: formData.state || null,
        postalCode: formData.postalCode || null,
        designation: formData.designation || null,
        departmentId: formData.departmentId || null,
        designationId: formData.designationId || null,
        emergencyContactRelation: formData.emergencyContactRelation || null,
        notes: formData.notes || null,
        joiningDate: formData.joiningDate
      }
      
      // Emergency contact fields - explicitly convert empty strings to null
      const emergencyContactNameValue = formData.emergencyContactName?.trim()
      const emergencyContactPhoneValue = formData.emergencyContactPhone?.trim()
      
      employeeData.emergencyContactName = emergencyContactNameValue || null
      employeeData.emergencyContact = emergencyContactNameValue || null
      employeeData.emergencyContactPhone = emergencyContactPhoneValue || null
      employeeData.emergencyPhone = emergencyContactPhoneValue || null
      
      console.log('Submitting employee data:', employeeData)
      
      if (editingId) {
        // Update existing employee
        const response = await axios.put(`/PayrollHR/employees/${editingId}`, employeeData)
        console.log('Update response:', response.data)
        if (response.data.success) {
          setSuccess('Employee updated successfully!')
          fetchEmployees()
        }
      } else {
        // Create new employee
        const response = await axios.post('/PayrollHR/employees', employeeData)
        console.log('Create response:', response.data)
        if (response.data.success) {
          setSuccess('Employee created successfully!')
          fetchEmployees()
        }
      }
      
      handleCancel()
    } catch (error) {
      setError('Error saving employee: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (employee) => {
    console.log('Edit Employee Data:', employee)
    setFormData({
      employeeId: employee.employeeId || '',
      employeeCode: employee.employeeCode || '',
      firstName: employee.firstName || '',
      middleName: employee.middleName || '',
      lastName: employee.lastName || '',
      gender: employee.gender || '',
      dateOfBirth: formatDateForInput(employee.dateOfBirth),
      maritalStatus: employee.maritalStatus || '',
      email: employee.email || '',
      phoneNumber: employee.phoneNumber || '',
      mobileNumber: employee.mobileNumber || '',
      address: employee.address || '',
      city: employee.city || '',
      state: employee.state || '',
      country: employee.country || '',
      postalCode: employee.postalCode || '',
      designation: employee.designation || '',
      position: employee.position || '',
      department: employee.department || '',
      joiningDate: formatDateForInput(employee.joiningDate),
      terminationDate: formatDateForInput(employee.terminationDate),
      employmentType: employee.employmentType || 'Full-time',
      basicSalary: employee.basicSalary ? employee.basicSalary.toString() : '',
      emergencyContactName: employee.emergencyContactName || employee.emergencyContact || '',
      emergencyContact: employee.emergencyContact || employee.emergencyContactName || '',
      emergencyContactPhone: employee.emergencyContactPhone || employee.emergencyPhone || '',
      emergencyPhone: employee.emergencyPhone || employee.emergencyContactPhone || '',
      emergencyContactRelation: employee.emergencyContactRelation || '',
      status: employee.status || 'Active',
      notes: employee.notes || '',
      departmentId: employee.departmentId || '',
      designationId: employee.designationId || '',
      isActive: employee.isActive !== undefined ? employee.isActive : true
    })
    setEditingId(employee.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return
    
    try {
      setLoading(true)
      const response = await axios.delete(`/api/PayrollHR/employees/${id}`)
      if (response.data.success) {
        setSuccess('Employee deleted successfully!')
        fetchEmployees()
      }
    } catch (error) {
      setError('Error deleting employee: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      employeeId: '',
      employeeCode: '',
      firstName: '',
      middleName: '',
      lastName: '',
      gender: '',
      dateOfBirth: '',
      maritalStatus: '',
      email: '',
      phoneNumber: '',
      mobileNumber: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      designation: '',
      position: '',
      department: '',
      joiningDate: '',
      terminationDate: '',
      employmentType: 'Full-time',
      basicSalary: '',
      emergencyContactName: '',
      emergencyContact: '',
      emergencyContactPhone: '',
      emergencyPhone: '',
      emergencyContactRelation: '',
      status: 'Active',
      notes: '',
      departmentId: '',
      designationId: '',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === '' || emp.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-red-100 text-red-800'
      case 'On Leave': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDepartmentColor = (department) => {
    switch (department) {
      case 'Front Office': return 'bg-blue-100 text-blue-800'
      case 'Housekeeping': return 'bg-green-100 text-green-800'
      case 'Restaurant': return 'bg-purple-100 text-purple-800'
      case 'Kitchen': return 'bg-orange-100 text-orange-800'
      case 'Maintenance': return 'bg-red-100 text-red-800'
      case 'Administration': return 'bg-indigo-100 text-indigo-800'
      case 'Security': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const totalEmployees = employees.length
  const activeEmployees = employees.filter(emp => emp.status === 'Active').length
  const totalPayroll = employees.reduce((sum, emp) => sum + (emp.basicSalary || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Employee Management</h1>
            <p className="text-indigo-100">Manage hotel staff and employee information</p>
          </div>
          <UserGroupIcon className="h-12 w-12 text-indigo-200" />
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-indigo-100 rounded-lg p-3">
              <UserGroupIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Employees</p>
              <p className="text-2xl font-bold text-gray-900">{activeEmployees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Payroll</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPayroll)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>

          <button
            onClick={() => {
              setEditingId(null)
              handleCancel()
              setShowForm(true)
            }}
            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingId ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ahmed"
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ali"
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ahmed.ali@hotel.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+92-300-1234567"
                />
                {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="+92-321-9876543"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.department ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
                {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Position <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.position ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Position</option>
                  {designations.map(desig => (
                    <option key={desig.id} value={desig.title}>{desig.title}</option>
                  ))}
                </select>
                {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({...formData, designation: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Manager"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Basic Salary (Rs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.basicSalary}
                  onChange={(e) => setFormData({...formData, basicSalary: e.target.value})}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.basicSalary ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="85000"
                />
                {errors.basicSalary && <p className="mt-1 text-sm text-red-600">{errors.basicSalary}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Joining Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.joiningDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.joiningDate && <p className="mt-1 text-sm text-red-600">{errors.joiningDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Street Address"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Karachi"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Name</label>
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({...formData, emergencyContactName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Contact Name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Phone</label>
                <input
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({...formData, emergencyContactPhone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="+92-300-7654321"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
            </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      {editingId ? 'Update' : 'Add'} Employee
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employees List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Employees ({filteredEmployees.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-indigo-100 rounded-full p-2 mr-3">
                        <IdentificationIcon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{employee.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{employee.phoneNumber}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{employee.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(employee.department)}`}>
                      {employee.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{employee.position}</div>
                    <div className="text-sm text-gray-500">Since {employee.joiningDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(employee.basicSalary)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default EmployeeManagement;
