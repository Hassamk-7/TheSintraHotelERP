import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CalendarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const HotelPlanMaster = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    planName: '',
    planCode: '',
    description: '',
    planType: 'Room Only',
    baseRate: '',
    extraPersonRate: '',
    childRate: '',
    inclusions: '',
    exclusions: '',
    cancellationPolicy: '',
    advancePayment: '',
    seasonality: 'All Year',
    isActive: true
  })

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch plans from API
  const fetchPlans = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/Plans')
      
      if (response.data && response.data.success) {
        // Map API response to frontend format
        const mappedPlans = response.data.data.map(plan => ({
          id: plan.id,
          planName: plan.name,
          planCode: plan.code,
          description: plan.description,
          planType: plan.name,
          baseRate: plan.basePrice,
          extraPersonRate: Math.round(plan.basePrice * 0.25),
          childRate: Math.round(plan.basePrice * 0.125),
          inclusions: getInclusions(plan),
          exclusions: getExclusions(plan),
          cancellationPolicy: plan.termsAndConditions || '24 hours before check-in',
          advancePayment: 30,
          seasonality: 'All Year',
          isActive: plan.isActive
        }))
        setPlans(mappedPlans)
        setSuccess('Plans loaded successfully')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to fetch plans')
      }
    } catch (err) {
      console.error('Error fetching plans:', err)
      setError('Error loading plans. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get inclusions based on plan
  const getInclusions = (plan) => {
    let inclusions = ['Room', 'WiFi', 'Basic amenities']
    if (plan.isBreakfastIncluded) inclusions.push('Breakfast')
    if (plan.isLunchIncluded) inclusions.push('Lunch')
    if (plan.isDinnerIncluded) inclusions.push('Dinner')
    return inclusions.join(', ')
  }

  // Helper function to get exclusions based on plan
  const getExclusions = (plan) => {
    let exclusions = ['Laundry', 'Room service']
    if (!plan.isBreakfastIncluded) exclusions.unshift('Breakfast')
    if (!plan.isLunchIncluded) exclusions.unshift('Lunch')
    if (!plan.isDinnerIncluded) exclusions.unshift('Dinner')
    return exclusions.join(', ')
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.planName.trim()) {
      newErrors.planName = 'Plan name is required'
    }

    if (!formData.planCode.trim()) {
      newErrors.planCode = 'Plan code is required'
    }

    if (!formData.baseRate || parseFloat(formData.baseRate) <= 0) {
      newErrors.baseRate = 'Valid base rate is required'
    }

    if (!formData.extraPersonRate || parseFloat(formData.extraPersonRate) < 0) {
      newErrors.extraPersonRate = 'Valid extra person rate is required'
    }

    if (!formData.childRate || parseFloat(formData.childRate) < 0) {
      newErrors.childRate = 'Valid child rate is required'
    }

    // Check for duplicate code
    const existingPlan = plans.find(plan => 
      plan.planCode.toLowerCase() === formData.planCode.toLowerCase() && 
      plan.id !== editingId
    )
    if (existingPlan) {
      newErrors.planCode = 'Plan code already exists'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingId) {
        setPlans(prev => prev.map(plan => 
          plan.id === editingId 
            ? { 
                ...formData, 
                id: editingId,
                baseRate: parseFloat(formData.baseRate),
                extraPersonRate: parseFloat(formData.extraPersonRate),
                childRate: parseFloat(formData.childRate),
                advancePayment: parseFloat(formData.advancePayment) || 0
              }
            : plan
        ))
      } else {
        const newPlan = {
          ...formData,
          id: Date.now(),
          baseRate: parseFloat(formData.baseRate),
          extraPersonRate: parseFloat(formData.extraPersonRate),
          childRate: parseFloat(formData.childRate),
          advancePayment: parseFloat(formData.advancePayment) || 0
        }
        setPlans(prev => [...prev, newPlan])
      }
      
      handleCancel()
      alert(editingId ? 'Hotel plan updated successfully!' : 'Hotel plan created successfully!')
    } catch (error) {
      console.error('Error saving plan:', error)
      alert('Error saving plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (plan) => {
    setFormData({
      planName: plan.planName,
      planCode: plan.planCode,
      description: plan.description,
      planType: plan.planType,
      baseRate: plan.baseRate.toString(),
      extraPersonRate: plan.extraPersonRate.toString(),
      childRate: plan.childRate.toString(),
      inclusions: plan.inclusions,
      exclusions: plan.exclusions,
      cancellationPolicy: plan.cancellationPolicy,
      advancePayment: plan.advancePayment.toString(),
      seasonality: plan.seasonality,
      isActive: plan.isActive
    })
    setEditingId(plan.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hotel plan?')) {
      setPlans(prev => prev.filter(plan => plan.id !== id))
      alert('Hotel plan deleted successfully!')
    }
  }

  const handleCancel = () => {
    setFormData({
      planName: '',
      planCode: '',
      description: '',
      planType: 'Room Only',
      baseRate: '',
      extraPersonRate: '',
      childRate: '',
      inclusions: '',
      exclusions: '',
      cancellationPolicy: '',
      advancePayment: '',
      seasonality: 'All Year',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredPlans = plans.filter(plan =>
    plan.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.planCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.planType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Hotel Plan Master</h1>
            <p className="text-amber-100">Manage hotel accommodation plans and packages</p>
          </div>
          <CalendarIcon className="h-12 w-12 text-amber-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-amber-100 rounded-lg p-3">
              <CalendarIcon className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Plans</p>
              <p className="text-2xl font-bold text-gray-900">{plans.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Plans</p>
              <p className="text-2xl font-bold text-gray-900">
                {plans.filter(plan => plan.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {Math.round(plans.reduce((sum, plan) => sum + plan.baseRate, 0) / plans.length).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <CalendarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Premium Plans</p>
              <p className="text-2xl font-bold text-gray-900">
                {plans.filter(plan => plan.baseRate >= 20000).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Plan
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Hotel Plan' : 'Add New Hotel Plan'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Plan Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.planName}
                  onChange={(e) => setFormData({...formData, planName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                    errors.planName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter plan name"
                />
                {errors.planName && (
                  <p className="mt-1 text-sm text-red-600">{errors.planName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Plan Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.planCode}
                  onChange={(e) => setFormData({...formData, planCode: e.target.value.toUpperCase()})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                    errors.planCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter plan code"
                />
                {errors.planCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.planCode}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  placeholder="Enter plan description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Plan Type</label>
                <select
                  value={formData.planType}
                  onChange={(e) => setFormData({...formData, planType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                >
                  <option value="Room Only">Room Only</option>
                  <option value="Bed & Breakfast">Bed & Breakfast</option>
                  <option value="Half Board">Half Board</option>
                  <option value="Full Board">Full Board</option>
                  <option value="All Inclusive">All Inclusive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Base Rate (Rs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.baseRate}
                  onChange={(e) => setFormData({...formData, baseRate: e.target.value})}
                  min="0"
                  step="100"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                    errors.baseRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="8000"
                />
                {errors.baseRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.baseRate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Extra Person Rate (Rs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.extraPersonRate}
                  onChange={(e) => setFormData({...formData, extraPersonRate: e.target.value})}
                  min="0"
                  step="100"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                    errors.extraPersonRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="2000"
                />
                {errors.extraPersonRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.extraPersonRate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Child Rate (Rs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.childRate}
                  onChange={(e) => setFormData({...formData, childRate: e.target.value})}
                  min="0"
                  step="100"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                    errors.childRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1000"
                />
                {errors.childRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.childRate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Advance Payment (%)</label>
                <input
                  type="number"
                  value={formData.advancePayment}
                  onChange={(e) => setFormData({...formData, advancePayment: e.target.value})}
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  placeholder="50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Seasonality</label>
                <select
                  value={formData.seasonality}
                  onChange={(e) => setFormData({...formData, seasonality: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                >
                  <option value="All Year">All Year</option>
                  <option value="Peak Season">Peak Season</option>
                  <option value="Off Season">Off Season</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Inclusions</label>
                <textarea
                  value={formData.inclusions}
                  onChange={(e) => setFormData({...formData, inclusions: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  placeholder="What's included in this plan"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Exclusions</label>
                <textarea
                  value={formData.exclusions}
                  onChange={(e) => setFormData({...formData, exclusions: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  placeholder="What's not included in this plan"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cancellation Policy</label>
                <textarea
                  value={formData.cancellationPolicy}
                  onChange={(e) => setFormData({...formData, cancellationPolicy: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  placeholder="Cancellation terms and conditions"
                />
              </div>

              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Active Plan
                  </label>
                </div>
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
                className="px-8 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 transition-all duration-200 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    {editingId ? 'Update' : 'Save'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Plans List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Hotel Plans ({filteredPlans.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inclusions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{plan.planName}</div>
                      <div className="text-sm text-gray-500">{plan.planCode}</div>
                      <div className="text-sm text-gray-500">{plan.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Rs {plan.baseRate.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Extra: Rs {plan.extraPersonRate.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Child: Rs {plan.childRate.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{plan.inclusions}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-gray-900">{plan.cancellationPolicy}</div>
                      <div className="text-sm text-gray-500">Advance: {plan.advancePayment}%</div>
                      <div className="text-sm text-gray-500">{plan.seasonality}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      plan.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(plan.id)}
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
          
          {filteredPlans.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hotel plans found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new hotel plan.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HotelPlanMaster;
