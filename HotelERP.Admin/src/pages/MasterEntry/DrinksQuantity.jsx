import { useEffect, useState } from 'react'
import axios from '../../utils/axios.js'
import {
  ScaleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

const DrinksQuantity = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [autoCode, setAutoCode] = useState(true)
  const [formData, setFormData] = useState({
    quantityName: '',
    quantityCode: '',
    unit: 'ml',
    value: '',
    isActive: true
  })

  const [quantities, setQuantities] = useState([])

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const fetchQuantities = async () => {
    try {
      setError('')
      const res = await axios.get('/DrinksQuantities')
      if (res.data?.success) {
        const list = Array.isArray(res.data.data) ? res.data.data : []
        const mapped = list.map(q => ({
          id: q.id ?? q.Id,
          quantityName: q.name ?? q.Name ?? '',
          quantityCode: q.code ?? q.Code ?? '',
          unit: q.unit ?? q.Unit ?? 'ml',
          value: Number(q.volume ?? q.Volume ?? 0),
          isActive: Boolean(q.isActive ?? q.IsActive)
        }))
        setQuantities(mapped)
      } else {
        setQuantities([])
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load drinks quantities')
      setQuantities([])
    }
  }

  useEffect(() => {
    fetchQuantities()
  }, [])

  useEffect(() => {
    if (!showForm) return
    if (editingId) return
    if (!autoCode) return
    const name = (formData.quantityName || '').trim()
    if (!name) {
      setFormData(prev => ({ ...prev, quantityCode: '' }))
      return
    }

    const used = (quantities || [])
      .map(q => String(q.quantityCode || '').toUpperCase())
      .filter(code => /^DRK-QTY-\d{4,}$/.test(code))
      .map(code => Number(code.split('-')[2]))
      .filter(n => Number.isFinite(n))

    const next = (used.length ? Math.max(...used) : 0) + 1
    const code = `DRK-QTY-${String(next).padStart(4, '0')}`
    setFormData(prev => ({ ...prev, quantityCode: code }))
  }, [formData.quantityName, quantities, showForm, editingId, autoCode])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.quantityName.trim()) {
      newErrors.quantityName = 'Quantity name is required'
    }

    if (!formData.quantityCode.trim()) {
      newErrors.quantityCode = 'Quantity code is required'
    }

    if (!formData.value || parseFloat(formData.value) <= 0) {
      newErrors.value = 'Valid value is required'
    }

    // Check for duplicate code
    const existingQuantity = quantities.find(quantity => 
      quantity.quantityCode.toLowerCase() === formData.quantityCode.toLowerCase() && 
      quantity.id !== editingId
    )
    if (existingQuantity) {
      newErrors.quantityCode = 'Quantity code already exists'
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
    setError('')
    setSuccess('')
    
    try {
      const payload = {
        id: editingId || undefined,
        name: formData.quantityName,
        code: formData.quantityCode,
        description: null,
        volume: parseFloat(formData.value),
        unit: formData.unit,
        isStandard: true,
        displayOrder: 0,
        isActive: Boolean(formData.isActive)
      }

      if (editingId) {
        const res = await axios.put(`/DrinksQuantities/${editingId}`, payload)
        if (!res.data?.success) throw new Error(res.data?.message || 'Failed to update drinks quantity')
        setSuccess('Drinks quantity updated successfully!')
      } else {
        const res = await axios.post('/DrinksQuantities', payload)
        if (!res.data?.success) throw new Error(res.data?.message || 'Failed to create drinks quantity')
        setSuccess('Drinks quantity created successfully!')
      }

      handleCancel()
      await fetchQuantities()
    } catch (error) {
      console.error('Error saving drinks quantity:', error)
      setError(error?.response?.data?.message || error?.message || 'Error saving drinks quantity. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (quantity) => {
    setFormData({
      quantityName: quantity.quantityName,
      quantityCode: quantity.quantityCode,
      unit: quantity.unit,
      value: quantity.value.toString(),
      isActive: quantity.isActive
    })
    setEditingId(quantity.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this drinks quantity?')) return
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      const res = await axios.delete(`/DrinksQuantities/${id}`)
      if (!res.data?.success) throw new Error(res.data?.message || 'Failed to delete drinks quantity')
      setSuccess('Drinks quantity deleted successfully!')
      await fetchQuantities()
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Error deleting drinks quantity. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      quantityName: '',
      quantityCode: '',
      unit: 'ml',
      value: '',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
    setAutoCode(true)
  }

  const filteredQuantities = quantities.filter(quantity =>
    quantity.quantityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quantity.quantityCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Drinks Quantity</h1>
            <p className="text-violet-100">Manage beverage serving sizes and quantities</p>
          </div>
          <ScaleIcon className="h-12 w-12 text-violet-200" />
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-green-700">{success}</span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-violet-100 rounded-lg p-3">
              <ScaleIcon className="h-6 w-6 text-violet-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Quantities</p>
              <p className="text-2xl font-bold text-gray-900">{quantities.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Quantities</p>
              <p className="text-2xl font-bold text-gray-900">
                {quantities.filter(quantity => quantity.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <ScaleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Largest Size</p>
              <p className="text-2xl font-bold text-gray-900">
                {quantities.length ? Math.max(...quantities.map(q => Number(q.value || 0))) : 0} ml
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
            placeholder="Search quantities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Quantity
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Drinks Quantity' : 'Add New Drinks Quantity'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.quantityName}
                  onChange={(e) => setFormData({...formData, quantityName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
                    errors.quantityName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter quantity name"
                />
                {errors.quantityName && (
                  <p className="mt-1 text-sm text-red-600">{errors.quantityName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity Code <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={autoCode}
                      onChange={(e) => setAutoCode(e.target.checked)}
                    />
                    <span>Auto Code</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.quantityCode}
                  onChange={(e) => {
                    setAutoCode(false)
                    setFormData({ ...formData, quantityCode: e.target.value.toUpperCase() })
                  }}
                  readOnly={autoCode && !editingId}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
                    errors.quantityCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter quantity code"
                />
                {errors.quantityCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.quantityCode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
                >
                  <option value="ml">Milliliters (ml)</option>
                  <option value="l">Liters (l)</option>
                  <option value="oz">Ounces (oz)</option>
                  <option value="cup">Cups</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
                    errors.value ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter value"
                />
                {errors.value && (
                  <p className="mt-1 text-sm text-red-600">{errors.value}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
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
                className="px-8 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-lg hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 flex items-center"
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

      {/* Quantities List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Drinks Quantities ({filteredQuantities.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value & Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuantities.map((quantity) => (
                <tr key={quantity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{quantity.quantityName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{quantity.quantityCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{quantity.value} {quantity.unit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      quantity.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {quantity.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(quantity)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(quantity.id)}
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
          
          {filteredQuantities.length === 0 && (
            <div className="text-center py-12">
              <ScaleIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No quantities found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new drinks quantity.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DrinksQuantity;
