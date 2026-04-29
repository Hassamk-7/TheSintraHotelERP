import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([])
  const [filteredDepartments, setFilteredDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    parentDepartmentId: null,
    headOfDepartment: '',
    location: '',
    phone: '',
    email: '',
    budget: '',
    costCenter: ''
  })

  const fetchDepartments = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/Department/departments?pageSize=100')
      setDepartments(response.data?.data || [])
    } catch (err) {
      setError('Failed to fetch departments')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  useEffect(() => {
    const filtered = departments.filter(dept => {
      const searchLower = searchTerm.toLowerCase()
      return (
        dept.name?.toLowerCase().includes(searchLower) ||
        dept.code?.toLowerCase().includes(searchLower)
      )
    })
    setFilteredDepartments(filtered)
  }, [searchTerm, departments])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name?.trim()) newErrors.name = 'Name required'
    if (!formData.code?.trim()) newErrors.code = 'Code required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const data = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : null
      }

      if (editingId) {
        await axios.put(`/Department/departments/${editingId}`, data)
        setSuccess('Updated successfully!')
      } else {
        await axios.post('/Department/departments', data)
        setSuccess('Created successfully!')
      }
      fetchDepartments()
      handleCancel()
    } catch (error) {
      setError('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (dept) => {
    setFormData({
      name: dept.name || '',
      code: dept.code || '',
      description: dept.description || '',
      parentDepartmentId: dept.parentDepartmentId || null,
      headOfDepartment: dept.headOfDepartment || '',
      location: dept.location || '',
      phone: dept.phone || '',
      email: dept.email || '',
      budget: dept.budget ? dept.budget.toString() : '',
      costCenter: dept.costCenter || ''
    })
    setEditingId(dept.id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      parentDepartmentId: null,
      headOfDepartment: '',
      location: '',
      phone: '',
      email: '',
      budget: '',
      costCenter: ''
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department?')) return
    try {
      await axios.delete(`/Department/departments/${id}`)
      setSuccess('Deleted successfully!')
      fetchDepartments()
    } catch (error) {
      setError('Error: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-2">Manage departments</p>
        </div>

        {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
        {success && <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">{success}</div>}

        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            onClick={() => { setEditingId(null); handleCancel(); setShowForm(true) }}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : filteredDepartments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No departments</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Code</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Location</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Head</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartments.map((dept) => (
                  <tr key={dept.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{dept.name}</td>
                    <td className="px-6 py-4 text-sm">{dept.code}</td>
                    <td className="px-6 py-4 text-sm">{dept.location || '-'}</td>
                    <td className="px-6 py-4 text-sm">{dept.headOfDepartment || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-3">
                        <button onClick={() => handleEdit(dept)} className="text-indigo-600 hover:text-indigo-900">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDelete(dept.id)} className="text-red-600 hover:text-red-900">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 p-6 border-b bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{editingId ? 'Edit' : 'Add'} Department</h2>
                <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg ${errors.code ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.code && <p className="text-red-600 text-sm mt-1">{errors.code}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Head</label>
                  <input
                    type="text"
                    value={formData.headOfDepartment}
                    onChange={(e) => setFormData({...formData, headOfDepartment: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Budget</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Cost Center</label>
                  <input
                    type="text"
                    value={formData.costCenter}
                    onChange={(e) => setFormData({...formData, costCenter: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <button type="button" onClick={handleCancel} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DepartmentManagement
