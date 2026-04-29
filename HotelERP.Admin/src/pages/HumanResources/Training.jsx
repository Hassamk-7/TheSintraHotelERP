import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  AcademicCapIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'

const Training = () => {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Skills Development',
    startDate: '',
    endDate: '',
    duration: '',
    trainer: '',
    maxParticipants: '',
    cost: '',
    status: 'Planned'
  })

  const [trainingPrograms, setTrainingPrograms] = useState([
    {
      id: 1,
      title: 'Customer Service Excellence',
      description: 'Advanced customer service skills for front office staff',
      type: 'Skills Development',
      startDate: '2024-02-15',
      endDate: '2024-02-17',
      duration: '3 days',
      trainer: 'Sarah Johnson',
      maxParticipants: 15,
      enrolledCount: 12,
      cost: 25000,
      status: 'Completed',
      participants: ['EMP-001', 'EMP-002', 'EMP-004']
    },
    {
      id: 2,
      title: 'Food Safety & Hygiene',
      description: 'Essential food safety training for kitchen staff',
      type: 'Compliance',
      startDate: '2024-03-01',
      endDate: '2024-03-01',
      duration: '1 day',
      trainer: 'Dr. Ahmed Hassan',
      maxParticipants: 20,
      enrolledCount: 18,
      cost: 15000,
      status: 'In Progress',
      participants: ['EMP-003', 'EMP-005']
    },
    {
      id: 3,
      title: 'Leadership Development',
      description: 'Management and leadership skills for supervisors',
      type: 'Leadership',
      startDate: '2024-03-15',
      endDate: '2024-03-20',
      duration: '5 days',
      trainer: 'Management Consultant',
      maxParticipants: 10,
      enrolledCount: 8,
      cost: 45000,
      status: 'Planned',
      participants: ['EMP-001', 'EMP-002']
    }
  ])

  const [employeeTraining, setEmployeeTraining] = useState([
    {
      employeeId: 'EMP-001',
      employeeName: 'Ahmed Ali',
      department: 'Front Office',
      completedTrainings: 3,
      upcomingTrainings: 1,
      totalHours: 24,
      certifications: ['Customer Service', 'Leadership']
    },
    {
      employeeId: 'EMP-002',
      employeeName: 'Fatima Sheikh',
      department: 'Housekeeping',
      completedTrainings: 2,
      upcomingTrainings: 1,
      totalHours: 16,
      certifications: ['Safety Training']
    },
    {
      employeeId: 'EMP-003',
      employeeName: 'Hassan Khan',
      department: 'Restaurant',
      completedTrainings: 4,
      upcomingTrainings: 0,
      totalHours: 32,
      certifications: ['Food Safety', 'Kitchen Management']
    }
  ])

  const trainingTypes = ['Skills Development', 'Compliance', 'Leadership', 'Technical', 'Safety', 'Orientation']
  const statuses = ['Planned', 'In Progress', 'Completed', 'Cancelled']
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.trainer.trim()) newErrors.trainer = 'Trainer is required'
    if (!formData.maxParticipants || parseInt(formData.maxParticipants) <= 0) {
      newErrors.maxParticipants = 'Valid participant count is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newTraining = {
        id: Date.now(),
        ...formData,
        maxParticipants: parseInt(formData.maxParticipants),
        cost: parseFloat(formData.cost) || 0,
        enrolledCount: 0,
        participants: []
      }
      
      setTrainingPrograms(prev => [...prev, newTraining])
      handleCancel()
      alert('Training program created!')
    } catch (error) {
      alert('Error creating training program.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      type: 'Skills Development',
      startDate: '',
      endDate: '',
      duration: '',
      trainer: '',
      maxParticipants: '',
      cost: '',
      status: 'Planned'
    })
    setShowForm(false)
    setErrors({})
  }

  const filteredTrainings = trainingPrograms.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.trainer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === '' || training.status === statusFilter
    const matchesType = typeFilter === '' || training.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Planned': return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Skills Development': return 'bg-blue-100 text-blue-800'
      case 'Compliance': return 'bg-red-100 text-red-800'
      case 'Leadership': return 'bg-purple-100 text-purple-800'
      case 'Technical': return 'bg-green-100 text-green-800'
      case 'Safety': return 'bg-orange-100 text-orange-800'
      case 'Orientation': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  // Calculate statistics
  const totalPrograms = trainingPrograms.length
  const activePrograms = trainingPrograms.filter(t => t.status === 'In Progress').length
  const completedPrograms = trainingPrograms.filter(t => t.status === 'Completed').length
  const totalCost = trainingPrograms.reduce((sum, t) => sum + t.cost, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Training Management</h1>
            <p className="text-blue-100">Manage employee training programs and development</p>
          </div>
          <AcademicCapIcon className="h-12 w-12 text-blue-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <AcademicCapIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Programs</p>
              <p className="text-2xl font-bold text-gray-900">{totalPrograms}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedPrograms}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{activePrograms}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-indigo-100 rounded-lg p-3">
              <BookOpenIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCost)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {trainingTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Program
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Create Training Program</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Customer Service Excellence"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {trainingTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="3 days"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Trainer <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.trainer}
                  onChange={(e) => setFormData({...formData, trainer: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.trainer ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Sarah Johnson"
                />
                {errors.trainer && <p className="mt-1 text-sm text-red-600">{errors.trainer}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Participants <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.maxParticipants ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="15"
                />
                {errors.maxParticipants && <p className="mt-1 text-sm text-red-600">{errors.maxParticipants}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cost (Rs)</label>
                <input
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData({...formData, cost: e.target.value})}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="25000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Detailed description of the training program..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
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
                className="px-8 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Create Program
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Training Programs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Training Programs ({filteredTrainings.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTrainings.map((training) => (
                <tr key={training.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{training.title}</div>
                      <div className="text-sm text-gray-500">{training.description}</div>
                      <div className="text-sm text-gray-500">Trainer: {training.trainer}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(training.type)}`}>
                      {training.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{training.startDate}</div>
                    {training.endDate && training.endDate !== training.startDate && (
                      <div className="text-sm text-gray-500">to {training.endDate}</div>
                    )}
                    {training.duration && (
                      <div className="text-sm text-gray-500">{training.duration}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">
                        {training.enrolledCount}/{training.maxParticipants}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(training.cost)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(training.status)}`}>
                      {training.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Training Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Employee Training Summary</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Upcoming</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certifications</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employeeTraining.map((employee) => (
                <tr key={employee.employeeId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{employee.employeeName}</div>
                      <div className="text-sm text-gray-500">{employee.employeeId}</div>
                      <div className="text-sm text-gray-500">{employee.department}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm font-medium text-green-600">{employee.completedTrainings}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm font-medium text-blue-600">{employee.upcomingTrainings}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm font-medium text-gray-900">{employee.totalHours}h</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {employee.certifications.map((cert, index) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {cert}
                        </span>
                      ))}
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

export default Training;
