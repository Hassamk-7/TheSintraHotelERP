import { useEffect, useState } from 'react'
import axios from '../../utils/axios.js'
import {
  GlobeAltIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const MenuCuisineMaster = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    displayOrder: ''
  })

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await axios.get('/MenuCuisineMasters', {
        params: { page: 1, pageSize: 5000, search: searchTerm || '' }
      })
      const apiData = res.data
      const list = Array.isArray(apiData)
        ? apiData
        : (apiData?.data && Array.isArray(apiData.data) ? apiData.data : [])
      setItems(list)
    } catch (e) {
      console.error('Error fetching menu cuisines:', e)
      setError('Failed to load menu cuisines')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      fetchItems()
    }, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  const validate = () => {
    const next = {}
    if (!formData.name.trim()) next.name = 'Name is required'
    if (!formData.code.trim()) next.code = 'Code is required'
    if (formData.displayOrder !== '' && Number(formData.displayOrder) < 0) next.displayOrder = 'Display order must be 0 or higher'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const resetForm = () => {
    setFormData({ name: '', code: '', description: '', displayOrder: '' })
    setErrors({})
  }

  const handleCancel = () => {
    resetForm()
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (row) => {
    setEditingId(row.id ?? row.Id)
    setFormData({
      name: row.name ?? row.Name ?? '',
      code: row.code ?? row.Code ?? '',
      description: row.description ?? row.Description ?? '',
      displayOrder: String(row.displayOrder ?? row.DisplayOrder ?? '')
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu cuisine?')) return
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      await axios.delete(`/MenuCuisineMasters/${id}`)
      setSuccess('Menu cuisine deleted')
      await fetchItems()
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      console.error('Error deleting menu cuisine:', e)
      setError(e.response?.data?.message || 'Failed to delete menu cuisine')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const payload = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        description: formData.description || '',
        displayOrder: formData.displayOrder === '' ? 0 : Number(formData.displayOrder)
      }

      if (editingId) {
        await axios.put(`/MenuCuisineMasters/${editingId}`, payload)
        setSuccess('Menu cuisine updated')
      } else {
        await axios.post('/MenuCuisineMasters', payload)
        setSuccess('Menu cuisine created')
      }

      await fetchItems()
      handleCancel()
      setTimeout(() => setSuccess(''), 3000)
    } catch (e2) {
      console.error('Error saving menu cuisine:', e2)
      setError(e2.response?.data?.message || 'Failed to save menu cuisine')
    } finally {
      setLoading(false)
    }
  }

  const filtered = (items || []).filter((x) => {
    const name = String(x?.name ?? x?.Name ?? '').toLowerCase()
    const code = String(x?.code ?? x?.Code ?? '').toLowerCase()
    const q = searchTerm.trim().toLowerCase()
    if (!q) return true
    return name.includes(q) || code.includes(q)
  })

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-600 to-yellow-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Menu Cuisine Master</h1>
            <p className="text-amber-100">Manage cuisines used in Menu Item Master</p>
          </div>
          <GlobeAltIcon className="h-12 w-12 text-amber-200" />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-xl">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search cuisine (name/code)..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm()
              setEditingId(null)
              setShowForm(true)
            }}
            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-yellow-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Cuisine
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{editingId ? 'Edit Cuisine' : 'Add Cuisine'}</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name <span className="text-red-500">*</span></label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Pakistani"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Code <span className="text-red-500">*</span></label>
                <input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.code ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="PK"
                />
                {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Optional description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.displayOrder ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="0"
                />
                {errors.displayOrder && <p className="mt-1 text-sm text-red-600">{errors.displayOrder}</p>}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button type="button" onClick={handleCancel} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-8 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-yellow-700 disabled:opacity-50 flex items-center">
                {loading ? 'Saving...' : (editingId ? 'Update' : 'Save')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Cuisines</h2>
        </div>

        {loading && !showForm ? (
          <div className="p-8 text-center text-gray-600">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Display</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No cuisines found</td>
                  </tr>
                ) : (
                  filtered.map((row) => {
                    const id = row.id ?? row.Id
                    return (
                      <tr key={String(id)}>
                        <td className="px-6 py-4 text-sm text-gray-900">{row.name ?? row.Name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{row.code ?? row.Code}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{row.displayOrder ?? row.DisplayOrder}</td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button onClick={() => handleEdit(row)} className="text-amber-600 hover:text-amber-900 p-1 rounded hover:bg-amber-50" title="Edit">
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(id)} className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50" title="Delete">
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default MenuCuisineMaster
