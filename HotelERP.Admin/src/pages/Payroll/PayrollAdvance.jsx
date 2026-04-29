import { useState } from 'react'
import {
  BanknotesIcon,
  UserIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const PayrollAdvance = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    advanceAmount: '',
    reason: '',
    requestDate: new Date().toISOString().split('T')[0],
    repaymentMonths: '3',
    guarantorId: '',
    notes: ''
  })

  const [advances, setAdvances] = useState([
    {
      id: 1,
      advanceId: 'ADV-2024-001',
      employeeId: 'EMP-001',
      employeeName: 'Ahmed Hassan',
      department: 'Front Office',
      advanceAmount: 20000,
      reason: 'Medical emergency',
      requestDate: '2024-01-15',
      approvalDate: '2024-01-16',
      repaymentMonths: 5,
      monthlyDeduction: 4000,
      remainingBalance: 16000,
      status: 'Approved',
      guarantorId: 'EMP-025',
      guarantorName: 'Muhammad Ali',
      notes: 'Family medical emergency - urgent requirement'
    },
    {
      id: 2,
      advanceId: 'ADV-2024-002',
      employeeId: 'EMP-002',
      employeeName: 'Sarah Khan',
      department: 'Restaurant',
      advanceAmount: 30000,
      reason: 'Home renovation',
      requestDate: '2024-01-10',
      approvalDate: null,
      repaymentMonths: 6,
      monthlyDeduction: 5000,
      remainingBalance: 30000,
      status: 'Pending',
      guarantorId: 'EMP-015',
      guarantorName: 'Ali Khan',
      notes: 'Urgent home repairs required'
    },
    {
      id: 3,
      advanceId: 'ADV-2024-003',
      employeeId: 'EMP-003',
      employeeName: 'Ali Khan',
      department: 'Housekeeping',
      advanceAmount: 15000,
      reason: 'Education expenses',
      requestDate: '2024-01-12',
      approvalDate: '2024-01-13',
      repaymentMonths: 3,
      monthlyDeduction: 5000,
      remainingBalance: 10000,
      status: 'Approved',
      guarantorId: 'EMP-012',
      guarantorName: 'Hassan Ahmed',
      notes: 'Children school fees and books'
    }
  ])

  const [employees] = useState([
    { id: 'EMP-001', name: 'Ahmed Hassan', department: 'Front Office', basicSalary: 35000 },
    { id: 'EMP-002', name: 'Sarah Khan', department: 'Restaurant', basicSalary: 50000 },
    { id: 'EMP-003', name: 'Ali Khan', department: 'Housekeeping', basicSalary: 30000 },
    { id: 'EMP-004', name: 'Fatima Sheikh', department: 'Housekeeping', basicSalary: 25000 },
    { id: 'EMP-005', name: 'Hassan Ahmed', department: 'Security', basicSalary: 28000 }
  ])

  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.employeeId) newErrors.employeeId = 'Employee is required'
    if (!formData.advanceAmount || formData.advanceAmount <= 0) newErrors.advanceAmount = 'Valid advance amount is required'
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required'
    if (!formData.repaymentMonths || formData.repaymentMonths <= 0) newErrors.repaymentMonths = 'Repayment months is required'

    // Check if advance amount is not more than 3 months salary
    const selectedEmployee = employees.find(emp => emp.id === formData.employeeId)
    if (selectedEmployee && formData.advanceAmount > (selectedEmployee.basicSalary * 3)) {
      newErrors.advanceAmount = 'Advance cannot exceed 3 months basic salary'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const selectedEmployee = employees.find(emp => emp.id === formData.employeeId)
    const guarantor = employees.find(emp => emp.id === formData.guarantorId)
    const monthlyDeduction = Math.ceil(parseFloat(formData.advanceAmount) / parseInt(formData.repaymentMonths))

    if (isEditing) {
      setAdvances(advances.map(adv => 
        adv.id === editingId 
          ? { 
              ...adv,
              ...formData,
              employeeName: selectedEmployee.name,
              department: selectedEmployee.department,
              advanceAmount: parseFloat(formData.advanceAmount),
              repaymentMonths: parseInt(formData.repaymentMonths),
              monthlyDeduction,
              guarantorName: guarantor ? guarantor.name : '',
              remainingBalance: parseFloat(formData.advanceAmount)
            }
          : adv
      ))
      setIsEditing(false)
      setEditingId(null)
    } else {
      const newAdvance = {
        id: advances.length + 1,
        advanceId: `ADV-2024-${String(advances.length + 1).padStart(3, '0')}`,
        ...formData,
        employeeName: selectedEmployee.name,
        department: selectedEmployee.department,
        advanceAmount: parseFloat(formData.advanceAmount),
        repaymentMonths: parseInt(formData.repaymentMonths),
        monthlyDeduction,
        remainingBalance: parseFloat(formData.advanceAmount),
        status: 'Pending',
        approvalDate: null,
        guarantorName: guarantor ? guarantor.name : ''
      }
      setAdvances([...advances, newAdvance])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      employeeId: '',
      advanceAmount: '',
      reason: '',
      requestDate: new Date().toISOString().split('T')[0],
      repaymentMonths: '3',
      guarantorId: '',
      notes: ''
    })
    setErrors({})
  }

  const handleEdit = (advance) => {
    setFormData({
      employeeId: advance.employeeId,
      advanceAmount: advance.advanceAmount.toString(),
      reason: advance.reason,
      requestDate: advance.requestDate,
      repaymentMonths: advance.repaymentMonths.toString(),
      guarantorId: advance.guarantorId,
      notes: advance.notes
    })
    setIsEditing(true)
    setEditingId(advance.id)
  }

  const handleApprove = (id) => {
    setAdvances(advances.map(adv => 
      adv.id === id 
        ? { ...adv, status: 'Approved', approvalDate: new Date().toISOString().split('T')[0] }
        : adv
    ))
  }

  const handleReject = (id) => {
    if (window.confirm('Are you sure you want to reject this advance request?')) {
      setAdvances(advances.map(adv => 
        adv.id === id 
          ? { ...adv, status: 'Rejected', approvalDate: new Date().toISOString().split('T')[0] }
          : adv
      ))
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Rejected': return 'bg-red-100 text-red-800'
      case 'Disbursed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDepartmentColor = (department) => {
    switch (department) {
      case 'Front Office': return 'bg-indigo-100 text-indigo-800'
      case 'Restaurant': return 'bg-orange-100 text-orange-800'
      case 'Housekeeping': return 'bg-green-100 text-green-800'
      case 'Security': return 'bg-red-100 text-red-800'
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const selectedEmployee = employees.find(emp => emp.id === formData.employeeId)
  const maxAdvanceAmount = selectedEmployee ? selectedEmployee.basicSalary * 3 : 0

  // Calculate statistics
  const totalAdvances = advances.length
  const pendingAdvances = advances.filter(a => a.status === 'Pending').length
  const approvedAdvances = advances.filter(a => a.status === 'Approved').length
  const totalAdvanceAmount = advances.reduce((sum, a) => sum + a.advanceAmount, 0)
  const totalOutstanding = advances.filter(a => a.status === 'Approved').reduce((sum, a) => sum + a.remainingBalance, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Payroll Advance</h1>
            <p className="text-purple-100">Manage employee advance requests and approvals</p>
          </div>
          <BanknotesIcon className="h-12 w-12 text-purple-200" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <BanknotesIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Advances</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAdvanceAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingAdvances}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CreditCardIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{approvedAdvances}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <DocumentTextIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOutstanding)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Advance Request Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {isEditing ? 'Edit Advance Request' : 'New Advance Request'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee *</label>
              <select
                value={formData.employeeId}
                onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.employeeId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} - {emp.department} (Salary: {formatCurrency(emp.basicSalary)})
                  </option>
                ))}
              </select>
              {errors.employeeId && <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Advance Amount * {selectedEmployee && (
                  <span className="text-gray-500">(Max: {formatCurrency(maxAdvanceAmount)})</span>
                )}
              </label>
              <input
                type="number"
                value={formData.advanceAmount}
                onChange={(e) => setFormData({...formData, advanceAmount: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.advanceAmount ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="20000"
                max={maxAdvanceAmount}
              />
              {errors.advanceAmount && <p className="text-red-500 text-sm mt-1">{errors.advanceAmount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Request Date</label>
              <input
                type="date"
                value={formData.requestDate}
                onChange={(e) => setFormData({...formData, requestDate: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Repayment Months *</label>
              <select
                value={formData.repaymentMonths}
                onChange={(e) => setFormData({...formData, repaymentMonths: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.repaymentMonths ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="1">1 Month</option>
                <option value="2">2 Months</option>
                <option value="3">3 Months</option>
                <option value="4">4 Months</option>
                <option value="5">5 Months</option>
                <option value="6">6 Months</option>
              </select>
              {errors.repaymentMonths && <p className="text-red-500 text-sm mt-1">{errors.repaymentMonths}</p>}
              {formData.advanceAmount && formData.repaymentMonths && (
                <p className="text-sm text-gray-500 mt-1">
                  Monthly deduction: {formatCurrency(Math.ceil(parseFloat(formData.advanceAmount) / parseInt(formData.repaymentMonths)))}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Guarantor</label>
              <select
                value={formData.guarantorId}
                onChange={(e) => setFormData({...formData, guarantorId: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Guarantor (Optional)</option>
                {employees.filter(emp => emp.id !== formData.employeeId).map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} - {emp.department}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason *</label>
            <input
              type="text"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.reason ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Medical emergency, education expenses, etc."
            />
            {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="3"
              placeholder="Any additional information..."
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <BanknotesIcon className="h-5 w-5 mr-2" />
              {isEditing ? 'Update Request' : 'Submit Request'}
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

      {/* Advance Requests List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Advance Requests ({advances.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Advance Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repayment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {advances.map((advance) => (
                <tr key={advance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-purple-100 rounded-full p-2 mr-3">
                        <UserIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{advance.employeeName}</div>
                        <div className="text-sm text-gray-500">{advance.advanceId}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(advance.department)}`}>
                          {advance.department}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(advance.advanceAmount)}
                      </div>
                      <div className="text-sm text-gray-500">{advance.reason}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-1" />
                        {advance.requestDate}
                      </div>
                      {advance.guarantorName && (
                        <div className="text-sm text-blue-600">
                          Guarantor: {advance.guarantorName}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        {advance.repaymentMonths} months
                      </div>
                      <div className="text-sm text-gray-500">
                        Monthly: {formatCurrency(advance.monthlyDeduction)}
                      </div>
                      <div className="text-sm text-orange-600">
                        Remaining: {formatCurrency(advance.remainingBalance)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(advance.status)}`}>
                      {advance.status}
                    </span>
                    {advance.approvalDate && (
                      <div className="text-sm text-gray-500 mt-1">
                        {advance.approvalDate}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {advance.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(advance.id)}
                            className="text-green-600 hover:text-green-900 text-sm font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(advance.id)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleEdit(advance)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {advances.length === 0 && (
          <div className="text-center py-12">
            <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No advance requests</h3>
            <p className="mt-2 text-gray-500">No advance requests have been submitted yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PayrollAdvance;
