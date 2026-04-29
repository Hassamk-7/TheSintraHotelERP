import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const DesignationManagement = () => {
  const [designations, setDesignations] = useState([])
  const [filteredDesignations, setFilteredDesignations] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    title: '',
    code: '',
    description: '',
    departmentId: '',
    level: '',
    minSalary: '',
    maxSalary: '',
    responsibilities: '',
    requirements: '',
    skills: '',
    reportsToDesignationId: null
  })

  const fetchDesignations = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/Designation/designations?pageSize=100')
      setDesignations(response.data?.data || [])
    } catch (err) {
      setError('Failed to fetch designations')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/PayrollHR/departments')
      setDepartments(response.data?.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchDesignations()
    fetchDepartments()
  }, [])

  useEffect(() => {
    const filtered = designations.filter(desig => {
      const searchLower = searchTerm.toLowerCase()
      return (
        desig.title?.toLowerCase().includes(searchLower) ||
        desig.code?.toLowerCase().includes(searchLower)
      )
    })
    setFilteredDesignations(filtered)
  }, [searchTerm, designations])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title?.trim()) newErrors.title = 'Title required'
    if (!formData.code?.trim()) newErrors.code = 'Code required'
    if (!formData.departmentId) newErrors.departmentId = 'Department required'
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
        departmentId: parseInt(formData.departmentId),
        minSalary: formData.minSalary ? parseFloat(formData.minSalary) : null,
        maxSalary: formData.maxSalary ? parseFloat(formData.maxSalary) : null,
        reportsToDesignationId: formData.reportsToDesignationId || null
      }

      if (editingId) {
        await axios.put(`/Designation/designations/${editingId}`, data)
        setSuccess('Updated successfully!')
      } else {
        await axios.post('/Designation/designations', data)
        setSuccess('Created successfully!')
      }
      fetchDesignations()
      handleCancel()
    } catch (error) {
      setError('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (desig) => {
    setFormData({
      title: desig.title || '',
      code: desig.code || '',
      description: desig.description || '',
      departmentId: desig.departmentId || '',
      level: desig.level || '',
      minSalary: desig.minSalary ? desig.minSalary.toString() : '',
      maxSalary: desig.maxSalary ? desig.maxSalary.toString() : '',
      responsibilities: desig.responsibilities || '',
      requirements: desig.requirements || '',
      skills: desig.skills || '',
      reportsToDesignationId: desig.reportsToDesignationId || null
    })
    setEditingId(desig.id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setFormData({
      title: '',
      code: '',
      description: '',
      departmentId: '',
      level: '',
      minSalary: '',
      maxSalary: '',
      responsibilities: '',
      requirements: '',
      skills: '',
      reportsToDesignationId: null
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this designation?')) return
    try {
      await axios.delete(`/Designation/designations/${id}`)
      setSuccess('Deleted successfully!')
      fetchDesignations()
    } catch (error) {
      setError('Error: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Designations</h1>
          <p className="text-gray-600 mt-2">Manage job designations</p>
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
          ) : filteredDesignations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No designations</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Code</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Department</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Level</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Salary Range</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDesignations.map((desig) => (
                  <tr key={desig.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{desig.title}</td>
                    <td className="px-6 py-4 text-sm">{desig.code}</td>
                    <td className="px-6 py-4 text-sm">{desig.department?.name || '-'}</td>
                    <td className="px-6 py-4 text-sm">{desig.level || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      {desig.minSalary && desig.maxSalary 
                        ? `Rs ${desig.minSalary.toLocaleString()} - ${desig.maxSalary.toLocaleString()}`
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-3">
                        <button onClick={() => handleEdit(desig)} className="text-indigo-600 hover:text-indigo-900">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDelete(desig.id)} className="text-red-600 hover:text-red-900">
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
                <h2 className="text-xl font-semibold">{editingId ? 'Edit' : 'Add'} Designation</h2>
                <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
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
                  <label className="block text-sm font-semibold mb-2">Department *</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg ${errors.departmentId ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                  {errors.departmentId && <p className="text-red-600 text-sm mt-1">{errors.departmentId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Level</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Manager">Manager</option>
                    <option value="Director">Director</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Min Salary</label>
                  <input
                    type="number"
                    value={formData.minSalary}
                    onChange={(e) => setFormData({...formData, minSalary: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Max Salary</label>
                  <input
                    type="number"
                    value={formData.maxSalary}
                    onChange={(e) => setFormData({...formData, maxSalary: e.target.value})}
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
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Responsibilities</label>
                <textarea
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({...formData, responsibilities: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Requirements</label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Skills</label>
                <textarea
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows="2"
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

export default DesignationManagement
