import { useState } from 'react'
import {
  UserPlusIcon,
  UserIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

const EmployeeRegistration = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cnic: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    emergencyContact: '',
    emergencyPhone: '',
    department: '',
    position: '',
    joiningDate: '',
    basicSalary: '',
    allowances: '',
    bankAccount: '',
    bankName: '',
    taxNumber: '',
    pfNumber: '',
    status: 'Active'
  })

  const [employees, setEmployees] = useState([
    {
      id: 1,
      employeeId: 'EMP-001',
      firstName: 'Ahmed',
      lastName: 'Hassan',
      email: 'ahmed.hassan@hotel.com',
      phone: '+92-300-1234567',
      cnic: '42101-1234567-1',
      dateOfBirth: '1990-05-15',
      gender: 'Male',
      address: '123 Main Street, Karachi',
      city: 'Karachi',
      emergencyContact: 'Fatima Hassan',
      emergencyPhone: '+92-300-7654321',
      department: 'Front Office',
      position: 'Receptionist',
      joiningDate: '2023-01-15',
      basicSalary: 35000,
      allowances: 5000,
      bankAccount: '1234567890',
      bankName: 'HBL',
      taxNumber: 'TAX-001',
      pfNumber: 'PF-001',
      status: 'Active'
    },
    {
      id: 2,
      employeeId: 'EMP-002',
      firstName: 'Sarah',
      lastName: 'Khan',
      email: 'sarah.khan@hotel.com',
      phone: '+92-321-9876543',
      cnic: '42101-9876543-2',
      dateOfBirth: '1988-08-22',
      gender: 'Female',
      address: '456 Garden Road, Lahore',
      city: 'Lahore',
      emergencyContact: 'Ali Khan',
      emergencyPhone: '+92-321-1111111',
      department: 'Restaurant',
      position: 'Head Chef',
      joiningDate: '2022-03-20',
      basicSalary: 50000,
      allowances: 8000,
      bankAccount: '9876543210',
      bankName: 'UBL',
      taxNumber: 'TAX-002',
      pfNumber: 'PF-002',
      status: 'Active'
    }
  ])

  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})

  const departments = ['Front Office', 'Restaurant', 'Housekeeping', 'Maintenance', 'Security', 'Administration']
  const positions = ['Manager', 'Supervisor', 'Receptionist', 'Chef', 'Waiter', 'Cleaner', 'Technician', 'Guard']

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required'
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.cnic.trim()) newErrors.cnic = 'CNIC is required'
    if (!formData.department) newErrors.department = 'Department is required'
    if (!formData.position) newErrors.position = 'Position is required'
    if (!formData.basicSalary) newErrors.basicSalary = 'Basic salary is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    if (isEditing) {
      setEmployees(employees.map(emp => 
        emp.id === editingId 
          ? { ...formData, id: editingId, basicSalary: parseFloat(formData.basicSalary), allowances: parseFloat(formData.allowances) || 0 }
          : emp
      ))
      setIsEditing(false)
      setEditingId(null)
    } else {
      const newEmployee = {
        ...formData,
        id: employees.length + 1,
        basicSalary: parseFloat(formData.basicSalary),
        allowances: parseFloat(formData.allowances) || 0
      }
      setEmployees([...employees, newEmployee])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      employeeId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      cnic: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      city: '',
      emergencyContact: '',
      emergencyPhone: '',
      department: '',
      position: '',
      joiningDate: '',
      basicSalary: '',
      allowances: '',
      bankAccount: '',
      bankName: '',
      taxNumber: '',
      pfNumber: '',
      status: 'Active'
    })
    setErrors({})
  }

  const handleEdit = (employee) => {
    setFormData({
      ...employee,
      basicSalary: employee.basicSalary.toString(),
      allowances: employee.allowances.toString()
    })
    setIsEditing(true)
    setEditingId(employee.id)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== id))
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Employee Registration</h1>
            <p className="text-blue-100">Register and manage employee information for payroll processing</p>
          </div>
          <UserPlusIcon className="h-12 w-12 text-blue-200" />
        </div>
      </div>

      {/* Registration Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {isEditing ? 'Edit Employee' : 'Register New Employee'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID *</label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.employeeId ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="EMP-001"
                />
                {errors.employeeId && <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Ahmed"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Hassan"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="ahmed@hotel.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="+92-300-1234567"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CNIC *</label>
                <input
                  type="text"
                  value={formData.cnic}
                  onChange={(e) => setFormData({...formData, cnic: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cnic ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="42101-1234567-1"
                />
                {errors.cnic && <p className="text-red-500 text-sm mt-1">{errors.cnic}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Karachi"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="Complete address"
              />
            </div>
          </div>

          {/* Job Information */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">Job Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.department ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.position ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Position</option>
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
                {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date</label>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary *</label>
                <input
                  type="number"
                  value={formData.basicSalary}
                  onChange={(e) => setFormData({...formData, basicSalary: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.basicSalary ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="35000"
                />
                {errors.basicSalary && <p className="text-red-500 text-sm mt-1">{errors.basicSalary}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allowances</label>
                <input
                  type="number"
                  value={formData.allowances}
                  onChange={(e) => setFormData({...formData, allowances: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
            </div>
          </div>

          {/* Emergency Contact & Bank Details */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">Emergency Contact & Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Fatima Hassan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</label>
                <input
                  type="text"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+92-300-7654321"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account Number</label>
                <input
                  type="text"
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({...formData, bankAccount: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="HBL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Number</label>
                <input
                  type="text"
                  value={formData.taxNumber}
                  onChange={(e) => setFormData({...formData, taxNumber: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="TAX-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PF Number</label>
                <input
                  type="text"
                  value={formData.pfNumber}
                  onChange={(e) => setFormData({...formData, pfNumber: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="PF-001"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <UserPlusIcon className="h-5 w-5 mr-2" />
              {isEditing ? 'Update Employee' : 'Register Employee'}
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setEditingId(null)
                  resetForm()
                }}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Employee List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Registered Employees ({employees.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-full p-2 mr-3">
                        <UserIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{employee.employeeId}</div>
                        <div className="text-sm text-gray-500">{employee.cnic}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {employee.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {employee.phone}
                      </div>
                      <div className="text-sm text-gray-500">{employee.city}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {employee.department}
                      </div>
                      <div className="text-sm text-gray-500">{employee.position}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {employee.joiningDate}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        Basic: {formatCurrency(employee.basicSalary)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Allowances: {formatCurrency(employee.allowances)}
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        Total: {formatCurrency(employee.basicSalary + employee.allowances)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      employee.status === 'Active' ? 'bg-green-100 text-green-800' :
                      employee.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {employees.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No employees registered</h3>
            <p className="mt-2 text-gray-500">Register your first employee to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmployeeRegistration;
