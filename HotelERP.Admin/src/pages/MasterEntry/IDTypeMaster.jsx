import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  IdentificationIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const IDTypeMaster = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [idTypes, setIdTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    isRequired: false,
    validationPattern: ''
  })

  const [errors, setErrors] = useState({})

  // Fetch ID types from API
  const fetchIdTypes = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/IDTypes')
      
      if (response.data && response.data.success) {
        setIdTypes(response.data.data)
        setSuccess('ID types loaded successfully')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to fetch ID types')
      }
    } catch (err) {
      console.error('Error fetching ID types:', err)
      setError('Error loading ID types. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIdTypes()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'ID type name is required'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'ID type code is required'
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
    
    try {
      const idTypeData = {
        name: formData.name,
        code: formData.code.toUpperCase(),
        description: formData.description || '',
        isRequired: formData.isRequired,
        validationPattern: formData.validationPattern || ''
      }

      console.log('Sending ID type data:', idTypeData)

      if (editingId) {
        await axios.put(`/IDTypes/${editingId}`, idTypeData)
        setSuccess('ID type updated successfully!')
      } else {
        await axios.post('/IDTypes', idTypeData)
        setSuccess('ID type added successfully!')
      }
      
      handleCancel()
      fetchIdTypes()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error saving ID type:', error)
      console.error('Error response:', error.response?.data)
      const errorMessage = error.response?.data?.message || error.response?.data?.errors || 'Error saving ID type. Please try again.'
      setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (idType) => {
    setFormData({
      name: idType.name,
      code: idType.code,
      description: idType.description || '',
      isRequired: idType.isRequired || false,
      validationPattern: idType.validationPattern || ''
    })
    setEditingId(idType.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ID type?')) {
      try {
        setLoading(true)
        await axios.delete(`/IDTypes/${id}`)
        setSuccess('ID type deleted successfully!')
        fetchIdTypes()
        setTimeout(() => setSuccess(''), 3000)
      } catch (error) {
        console.error('Error deleting ID type:', error)
        setError('Error deleting ID type. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      isRequired: false,
      validationPattern: ''
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredIdTypes = idTypes.filter(idType =>
    idType.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idType.code?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">ID Type Master</h1>
            <p className="text-teal-100">Manage identification document types for guests and employees</p>
          </div>
          <IdentificationIcon className="h-12 w-12 text-teal-200" />
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search ID types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add ID Type
        </button>
      </div>

      {/* ID Type Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {editingId ? 'Edit ID Type' : 'Add New ID Type'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ID Type Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter ID type name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ID Type Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                    errors.code ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter ID type code"
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Validation Pattern
                </label>
                <input
                  type="text"
                  name="validationPattern"
                  value={formData.validationPattern}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter validation pattern (regex)"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isRequired"
                  checked={formData.isRequired}
                  onChange={handleChange}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm font-semibold text-gray-700">
                  Required for Registration
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter ID type description"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingId ? 'Update ID Type' : 'Add ID Type')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ID Types Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            ID Types ({filteredIdTypes.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Required
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIdTypes.map((idType) => (
                <tr key={idType.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{idType.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-teal-100 text-teal-800">
                      {idType.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      idType.isRequired 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {idType.isRequired ? 'Required' : 'Optional'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{idType.description || 'No description'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(idType)}
                        className="text-teal-600 hover:text-teal-900 p-1 rounded"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(idType.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredIdTypes.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    {loading ? 'Loading ID types...' : 'No ID types found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default IDTypeMaster
