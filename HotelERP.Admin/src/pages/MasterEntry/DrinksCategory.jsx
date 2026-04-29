import { useEffect, useState } from 'react'
import axios from '../../utils/axios.js'
import {
  BeakerIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  TagIcon
} from '@heroicons/react/24/outline'

const DrinksCategory = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [autoCode, setAutoCode] = useState(true)
  const [formData, setFormData] = useState({
    categoryName: '',
    categoryCode: '',
    description: '',
    imagePath: '',
    isAlcoholic: false,
    isActive: true
  })

  const [categories, setCategories] = useState([])

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const fetchCategories = async () => {
    try {
      setError('')
      const res = await axios.get('/DrinksCategories')
      if (res.data?.success) {
        const list = Array.isArray(res.data.data) ? res.data.data : []
        const mapped = list.map(c => ({
          id: c.id ?? c.Id,
          categoryName: c.name ?? c.Name ?? '',
          categoryCode: c.code ?? c.Code ?? '',
          description: c.description ?? c.Description ?? '',
          imagePath: c.imagePath ?? c.ImagePath ?? '',
          isAlcoholic: Boolean(c.isAlcoholic ?? c.IsAlcoholic),
          isActive: Boolean(c.isActive ?? c.IsActive)
        }))
        setCategories(mapped)
      } else {
        setCategories([])
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load drinks categories')
      setCategories([])
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (!showForm) return
    if (editingId) return
    if (!autoCode) return
    const name = (formData.categoryName || '').trim()
    if (!name) {
      setFormData(prev => ({ ...prev, categoryCode: '' }))
      return
    }

    const used = (categories || [])
      .map(c => String(c.categoryCode || '').toUpperCase())
      .filter(code => /^DRK-CAT-\d{4,}$/.test(code))
      .map(code => Number(code.split('-')[2]))
      .filter(n => Number.isFinite(n))

    const next = (used.length ? Math.max(...used) : 0) + 1
    const code = `DRK-CAT-${String(next).padStart(4, '0')}`
    setFormData(prev => ({ ...prev, categoryCode: code }))
  }, [formData.categoryName, categories, showForm, editingId, autoCode])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'Category name is required'
    }

    if (!formData.categoryCode.trim()) {
      newErrors.categoryCode = 'Category code is required'
    }

    // Check for duplicate code
    const existingCategory = categories.find(category => 
      category.categoryCode.toLowerCase() === formData.categoryCode.toLowerCase() && 
      category.id !== editingId
    )
    if (existingCategory) {
      newErrors.categoryCode = 'Category code already exists'
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
      let uploadedPath = formData.imagePath || ''
      if (imageFile) {
        const fd = new FormData()
        fd.append('file', imageFile)
        fd.append('folder', 'DrinksCategories')
        const up = await axios.post('/Upload/image', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        const path = up?.data?.filePath || up?.data?.path || ''
        if (path) uploadedPath = path
      }

      const payload = {
        id: editingId || undefined,
        name: formData.categoryName,
        code: formData.categoryCode,
        description: formData.description || '',
        imagePath: uploadedPath || '',
        isAlcoholic: Boolean(formData.isAlcoholic),
        isHot: false,
        categoryType: '',
        colorCode: '',
        displayOrder: 0,
        isActive: Boolean(formData.isActive)
      }

      if (editingId) {
        const res = await axios.put(`/DrinksCategories/${editingId}`, payload)
        if (!res.data?.success) throw new Error(res.data?.message || 'Failed to update drinks category')
        setSuccess('Drinks category updated successfully!')
      } else {
        const res = await axios.post('/DrinksCategories', payload)
        if (!res.data?.success) throw new Error(res.data?.message || 'Failed to create drinks category')
        setSuccess('Drinks category created successfully!')
      }

      handleCancel()
      await fetchCategories()
    } catch (error) {
      console.error('Error saving drinks category:', error)
      setError(error?.response?.data?.message || error?.message || 'Error saving drinks category. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (category) => {
    setFormData({
      categoryName: category.categoryName,
      categoryCode: category.categoryCode,
      description: category.description,
      imagePath: category.imagePath || '',
      isAlcoholic: category.isAlcoholic,
      isActive: category.isActive
    })
    setImageFile(null)
    setAutoCode(false)
    setEditingId(category.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this drinks category?')) return
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      const res = await axios.delete(`/DrinksCategories/${id}`)
      if (!res.data?.success) throw new Error(res.data?.message || 'Failed to delete drinks category')
      setSuccess('Drinks category deleted successfully!')
      await fetchCategories()
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Error deleting drinks category. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      categoryName: '',
      categoryCode: '',
      description: '',
      imagePath: '',
      isAlcoholic: false,
      isActive: true
    })
    setImageFile(null)
    setAutoCode(true)
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredCategories = categories.filter(category =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.categoryCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Drinks Category</h1>
            <p className="text-cyan-100">Manage beverage categories and classifications</p>
          </div>
          <BeakerIcon className="h-12 w-12 text-cyan-200" />
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-cyan-100 rounded-lg p-3">
              <TagIcon className="h-6 w-6 text-cyan-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.filter(category => category.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <BeakerIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Non-Alcoholic</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.filter(category => !category.isAlcoholic).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <BeakerIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Alcoholic</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.filter(category => category.isAlcoholic).length}
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
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Category
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Drinks Category' : 'Add New Drinks Category'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.categoryName}
                  onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors ${
                    errors.categoryName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter category name"
                />
                {errors.categoryName && (
                  <p className="mt-1 text-sm text-red-600">{errors.categoryName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Code <span className="text-red-500">*</span>
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
                  value={formData.categoryCode}
                  onChange={(e) => {
                    setAutoCode(false)
                    setFormData({ ...formData, categoryCode: e.target.value.toUpperCase() })
                  }}
                  readOnly={autoCode && !editingId}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors ${
                    errors.categoryCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter category code"
                />
                {errors.categoryCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.categoryCode}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                  placeholder="Enter description"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null
                    setImageFile(f)
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                />
                <div className="mt-2 flex items-center gap-3">
                  {imageFile ? (
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Preview"
                      className="h-12 w-12 rounded object-cover border"
                    />
                  ) : formData.imagePath ? (
                    <img
                      src={formData.imagePath}
                      alt="Category"
                      className="h-12 w-12 rounded object-cover border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : null}
                  {(imageFile || formData.imagePath) && (
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null)
                        setFormData(prev => ({ ...prev, imagePath: '' }))
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.isAlcoholic}
                  onChange={(e) => setFormData({...formData, isAlcoholic: e.target.value === 'true'})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                >
                  <option value="false">Non-Alcoholic</option>
                  <option value="true">Alcoholic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
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
                className="px-8 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 flex items-center"
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

      {/* Categories List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Drinks Categories ({filteredCategories.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
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
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {category.imagePath ? (
                        <img
                          src={category.imagePath}
                          alt={category.categoryName}
                          className="h-10 w-10 rounded object-cover border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-100 border flex items-center justify-center text-xs text-gray-500">
                          IMG
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{category.categoryName}</div>
                        <div className="text-sm text-gray-500">{category.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{category.categoryCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      category.isAlcoholic 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {category.isAlcoholic ? 'Alcoholic' : 'Non-Alcoholic'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      category.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
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
          
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <BeakerIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new drinks category.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DrinksCategory;
