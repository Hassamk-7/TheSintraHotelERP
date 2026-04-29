import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  ChartBarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  StarIcon,
  TrophyIcon,
  UserIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

const Performance = () => {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [periodFilter, setPeriodFilter] = useState('2024-Q1')
  
  const [formData, setFormData] = useState({
    employeeId: '',
    reviewPeriod: '2024-Q1',
    goals: '',
    achievements: '',
    strengths: '',
    improvements: '',
    overallRating: 3,
    status: 'Draft'
  })

  const [performanceReviews, setPerformanceReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load performance reviews on component mount
  useEffect(() => {
    fetchPerformanceReviews()
  }, [])

  // Fetch performance reviews from API
  const fetchPerformanceReviews = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/PayrollHR/performance-reviews')
      if (response.data.success) {
        setPerformanceReviews(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching performance reviews:', err)
      // Set mock data if API fails
      setPerformanceReviews([
    {
      id: 1,
      employeeId: 'EMP-001',
      employeeName: 'Ahmed Ali',
      department: 'Front Office',
      position: 'Front Desk Manager',
      reviewPeriod: '2024-Q1',
      overallRating: 4.2,
      goals: 'Improve guest satisfaction scores',
      achievements: 'Increased satisfaction by 15%',
      strengths: 'Excellent communication, leadership',
      improvements: 'Time management, delegation',
      reviewDate: '2024-03-31',
      reviewedBy: 'HR Manager',
      status: 'Completed'
    },
    {
      id: 2,
      employeeId: 'EMP-002',
      employeeName: 'Fatima Sheikh',
      department: 'Housekeeping',
      position: 'Housekeeping Supervisor',
      reviewPeriod: '2024-Q1',
      overallRating: 4.5,
      goals: 'Reduce room cleaning time',
      achievements: 'Improved efficiency by 20%',
      strengths: 'Attention to detail, team coordination',
      improvements: 'Technology adoption',
      reviewDate: '2024-03-28',
      reviewedBy: 'Department Head',
      status: 'Completed'
    },
    {
      id: 3,
      employeeId: 'EMP-003',
      employeeName: 'Hassan Khan',
      department: 'Restaurant',
      position: 'Head Chef',
      reviewPeriod: '2024-Q1',
      overallRating: 3.8,
      goals: 'Menu innovation and cost control',
      achievements: 'Launched 5 new dishes',
      strengths: 'Creativity, culinary skills',
      improvements: 'Cost management, staff training',
      reviewDate: null,
      reviewedBy: null,
      status: 'Pending'
    }
      ])
      setError('')
    } finally {
      setLoading(false)
    }
  }

  const employees = [
    { id: 'EMP-001', name: 'Ahmed Ali' },
    { id: 'EMP-002', name: 'Fatima Sheikh' },
    { id: 'EMP-003', name: 'Hassan Khan' }
  ]

  const departments = ['Front Office', 'Housekeeping', 'Restaurant', 'Kitchen', 'Maintenance', 'Administration']
  const periods = ['2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4', '2023-Q4']
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.employeeId) newErrors.employeeId = 'Employee is required'
    if (!formData.goals.trim()) newErrors.goals = 'Goals are required'
    if (!formData.achievements.trim()) newErrors.achievements = 'Achievements are required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const employee = employees.find(emp => emp.id === formData.employeeId)
      const newReview = {
        id: Date.now(),
        ...formData,
        employeeName: employee.name,
        department: 'Department',
        position: 'Position',
        reviewDate: formData.status === 'Completed' ? new Date().toISOString().split('T')[0] : null,
        reviewedBy: formData.status === 'Completed' ? 'HR Manager' : null
      }
      
      setPerformanceReviews(prev => [...prev, newReview])
      handleCancel()
      alert('Performance review saved!')
    } catch (error) {
      alert('Error saving review.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      employeeId: '',
      reviewPeriod: '2024-Q1',
      goals: '',
      achievements: '',
      strengths: '',
      improvements: '',
      overallRating: 3,
      status: 'Draft'
    })
    setShowForm(false)
    setErrors({})
  }

  const filteredReviews = performanceReviews.filter(review => {
    const matchesSearch = review.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === '' || review.department === departmentFilter
    const matchesPeriod = periodFilter === '' || review.reviewPeriod === periodFilter
    return matchesSearch && matchesDepartment && matchesPeriod
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 4.0) return 'text-blue-600'
    if (rating >= 3.5) return 'text-yellow-600'
    if (rating >= 3.0) return 'text-orange-600'
    return 'text-red-600'
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  // Calculate statistics
  const totalReviews = performanceReviews.length
  const completedReviews = performanceReviews.filter(r => r.status === 'Completed').length
  const pendingReviews = performanceReviews.filter(r => r.status === 'Pending').length
  const avgRating = (performanceReviews.reduce((sum, r) => sum + r.overallRating, 0) / totalReviews).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Performance Management</h1>
            <p className="text-orange-100">Track and evaluate employee performance</p>
          </div>
          <ChartBarIcon className="h-12 w-12 text-orange-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-lg p-3">
              <ChartBarIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{totalReviews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <TrophyIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedReviews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <UserIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingReviews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <StarIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">{avgRating}</p>
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
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Periods</option>
            {periods.map(period => (
              <option key={period} value={period}>{period}</option>
            ))}
          </select>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Review
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Performance Review</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Employee <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.employeeId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
                  ))}
                </select>
                {errors.employeeId && <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Review Period</label>
                <select
                  value={formData.reviewPeriod}
                  onChange={(e) => setFormData({...formData, reviewPeriod: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {periods.map(period => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Overall Rating</label>
                <select
                  value={formData.overallRating}
                  onChange={(e) => setFormData({...formData, overallRating: parseFloat(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Satisfactory</option>
                  <option value={2}>2 - Needs Improvement</option>
                  <option value={1}>1 - Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Goals & Objectives <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.goals}
                onChange={(e) => setFormData({...formData, goals: e.target.value})}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.goals ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="List key goals and objectives..."
              />
              {errors.goals && <p className="mt-1 text-sm text-red-600">{errors.goals}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Achievements <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.achievements}
                onChange={(e) => setFormData({...formData, achievements: e.target.value})}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.achievements ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe key achievements..."
              />
              {errors.achievements && <p className="mt-1 text-sm text-red-600">{errors.achievements}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Strengths</label>
                <textarea
                  value={formData.strengths}
                  onChange={(e) => setFormData({...formData, strengths: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Key strengths and skills..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Areas for Improvement</label>
                <textarea
                  value={formData.improvements}
                  onChange={(e) => setFormData({...formData, improvements: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Areas needing development..."
                />
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
                className="px-8 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50 transition-all duration-200 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save Review'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Performance Reviews */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Performance Reviews ({filteredReviews.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goals</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-orange-100 rounded-full p-2 mr-3">
                        <UserIcon className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{review.employeeName}</div>
                        <div className="text-sm text-gray-500">{review.employeeId}</div>
                        <div className="text-sm text-gray-500">{review.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{review.reviewPeriod}</div>
                    {review.reviewDate && (
                      <div className="text-sm text-gray-500">Reviewed: {review.reviewDate}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {renderStars(review.overallRating)}
                      </div>
                      <span className={`text-sm font-medium ${getRatingColor(review.overallRating)}`}>
                        {review.overallRating}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{review.goals}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                    {review.reviewedBy && (
                      <div className="text-xs text-gray-500 mt-1">by {review.reviewedBy}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors">
                      <EyeIcon className="h-4 w-4" />
                    </button>
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

export default Performance;
