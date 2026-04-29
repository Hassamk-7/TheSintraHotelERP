import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../utils/axios.js'
import {
  ShoppingCartIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const FoodCategoryMaster = () => {
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    categoryName: '',
    categoryCode: '',
    description: '',
    displayOrder: '',
    isActive: true
  })

  const [categories, setCategories] = useState([
    {
      id: 1,
      categoryName: 'Pakistani Main Course',
      categoryCode: 'PMC',
      description: 'Traditional Pakistani main dishes like biryani, karahi, and curry',
      displayOrder: 1,
      isActive: true
    },
    {
      id: 2,
      categoryName: 'Chinese Cuisine',
      categoryCode: 'CHN',
      description: 'Chinese dishes including fried rice, noodles, and stir-fry',
      displayOrder: 2,
      isActive: true
    },
    {
      id: 3,
      categoryName: 'Fast Food',
      categoryCode: 'FF',
      description: 'Quick service items like burgers, sandwiches, and wraps',
      displayOrder: 3,
      isActive: true
    },
    {
      id: 4,
      categoryName: 'Beverages',
      categoryCode: 'BEV',
      description: 'Hot and cold drinks including tea, coffee, juices, and sodas',
      displayOrder: 4,
      isActive: true
    },
    {
      id: 5,
      categoryName: 'Desserts',
      categoryCode: 'DES',
      description: 'Sweet dishes including traditional and modern desserts',
      displayOrder: 5,
      isActive: true
    },
    {
      id: 6,
      categoryName: 'Appetizers',
      categoryCode: 'APP',
      description: 'Starters and appetizers to begin the meal',
      displayOrder: 6,
      isActive: true
    },
    {
      id: 7,
      categoryName: 'Halal Meat',
      categoryCode: 'HM',
      description: 'Certified halal meat dishes for Muslim guests',
      displayOrder: 7,
      isActive: true
    },
    {
      id: 8,
      categoryName: 'Vegetarian',
      categoryCode: 'VEG',
      description: 'Pure vegetarian dishes without meat or fish',
      displayOrder: 8,
      isActive: true
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})

  // Fetch food categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/FoodCategories')
      
      if (response.data && response.data.success) {
        setCategories(response.data.data)
        setSuccess('Food categories loaded successfully')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to fetch food categories')
      }
    } catch (err) {
      console.error('Error fetching food categories:', err)
      setError('Error loading food categories. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // API calls disabled to show mock data
    console.log('FoodCategoryMaster component loaded with mock data:', categories.length, 'categories')
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

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'Category name is required'
    }

    if (!formData.categoryCode.trim()) {
      newErrors.categoryCode = 'Category code is required'
    }

    if (formData.displayOrder && parseInt(formData.displayOrder) < 1) {
      newErrors.displayOrder = 'Display order must be greater than 0'
    }

    // Check for duplicate category codes
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
    
    try {
      const categoryData = {
        Name: formData.categoryName,
        Code: formData.categoryCode.toUpperCase(),
        Description: formData.description || '',
        Type: 'General',
        IsVegetarian: false,
        IsHalal: true,
        Cuisine: 'Mixed',
        DisplayOrder: parseInt(formData.displayOrder) || 0,
        ColorCode: '#3B82F6',
        ImagePath: ''
      }

      console.log('Sending food category data:', categoryData)

      if (editingId) {
        await axios.put(`/FoodCategories/${editingId}`, categoryData)
        setSuccess('Food category updated successfully!')
      } else {
        await axios.post('/FoodCategories', categoryData)
        setSuccess('Food category added successfully!')
      }
      
      handleCancel()
      fetchCategories()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error saving food category:', error)
      console.error('Error response:', error.response?.data)
      const errorMessage = error.response?.data?.message || error.response?.data?.errors || 'Error saving food category. Please try again.'
      setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (category) => {
    setFormData({
      categoryName: category.name || category.categoryName,
      categoryCode: category.code || category.categoryCode,
      description: category.description || '',
      displayOrder: category.displayOrder.toString(),
      isActive: category.isActive
    })
    setEditingId(category.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this food category?')) {
      try {
        setLoading(true)
        await axios.delete(`/FoodCategories/${id}`)
        setSuccess('Food category deleted successfully!')
        fetchCategories()
        setTimeout(() => setSuccess(''), 3000)
      } catch (error) {
        console.error('Error deleting food category:', error)
        setError('Error deleting food category. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      categoryName: '',
      categoryCode: '',
      description: '',
      displayOrder: '',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredCategories = categories.filter(category =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.categoryCode.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.displayOrder - b.displayOrder)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Food Category Master</h1>
            <p className="text-orange-100">Organize menu items into categories for better management</p>
          </div>
          <ShoppingCartIcon className="h-12 w-12 text-orange-200" />
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200"
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
              {editingId ? 'Edit Food Category' : 'Add New Food Category'}
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
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
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
                <input
                  type="text"
                  name="categoryCode"
                  value={formData.categoryCode}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors uppercase ${
                    errors.categoryCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter category code"
                />
                {errors.categoryCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.categoryCode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.displayOrder ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter display order"
                />
                {errors.displayOrder && (
                  <p className="mt-1 text-sm text-red-600">{errors.displayOrder}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Order in which category appears in menu
                </p>
              </div>

              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm font-medium text-gray-700">
                  Active Status
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                placeholder="Enter category description"
              />
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
          <h2 className="text-xl font-semibold text-gray-900">Food Categories ({filteredCategories.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                      {category.displayOrder}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{category.categoryName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-orange-100 text-orange-800">
                      {category.categoryCode}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{category.description}</div>
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
                        className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50 transition-colors"
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
              <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No food categories found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new food category.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FoodCategoryMaster;
