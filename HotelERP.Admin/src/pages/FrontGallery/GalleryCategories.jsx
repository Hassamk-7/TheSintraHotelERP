import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../utils/axios.js'
import {
  PhotoIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

const GalleryCategories = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    categoryID: null,
    name: '',
    title: '',
    subtitle: '',
    description: '',
    displayOrder: 0,
    isActive: true
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/GalleryCategory')
      
      let categoriesData = []
      if (response.data && Array.isArray(response.data)) {
        categoriesData = response.data
      } else if (response.data && response.data.success && response.data.data) {
        categoriesData = response.data.data
      }

      // Fetch gallery items to get main images for categories
      const itemsResponse = await axios.get('/GalleryItem')
      const allItems = itemsResponse.data || []

      // Map main images to categories
      const categoriesWithImages = categoriesData.map(category => {
        const mainItem = allItems.find(item => 
          item.categoryID === category.categoryID && item.isMainImage
        )
        return {
          ...category,
          mainImagePath: mainItem?.imagePath || category.thumbnailPath
        }
      })

      setCategories(categoriesWithImages)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('Failed to load gallery categories')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      if (editMode) {
        await axios.put(`/GalleryCategory/${formData.categoryID}`, formData)
        setSuccess('Category updated successfully!')
      } else {
        await axios.post('/GalleryCategory', formData)
        setSuccess('Category created successfully!')
      }
      
      fetchCategories()
      handleCloseModal()
    } catch (err) {
      console.error('Error saving category:', err)
      setError(err.response?.data?.message || 'Failed to save category')
    }
  }

  const handleEdit = (category) => {
    setFormData({
      categoryID: category.categoryID,
      name: category.name,
      title: category.title,
      subtitle: category.subtitle || '',
      description: category.description || '',
      displayOrder: category.displayOrder,
      isActive: category.isActive
    })
    setEditMode(true)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return

    try {
      await axios.delete(`/GalleryCategory/${id}`)
      setSuccess('Category deleted successfully!')
      fetchCategories()
    } catch (err) {
      console.error('Error deleting category:', err)
      setError('Failed to delete category')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditMode(false)
    setFormData({
      categoryID: null,
      name: '',
      title: '',
      subtitle: '',
      description: '',
      displayOrder: 0,
      isActive: true
    })
    setError('')
  }

  const handleViewImages = (categoryId) => {
    navigate(`/front-gallery/items/${categoryId}`)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading gallery categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-8 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Front Gallery Categories</h1>
            <p className="text-purple-100 mt-2">Manage gallery categories for your website</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Category
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div key={category.categoryID} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-gradient-to-br from-purple-100 to-indigo-100">
              {category.mainImagePath ? (
                <img
                  src={`https://api.thesintrahotel.com${category.mainImagePath}`}
                  alt={category.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
              ) : null}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100" style={{display: category.mainImagePath ? 'none' : 'flex'}}>
                <PhotoIcon className="h-16 w-16 text-purple-400" />
              </div>
              {category.isActive ? (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
                  Active
                </div>
              ) : (
                <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
                  Inactive
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{category.subtitle}</p>
              <p className="text-xs text-gray-500 line-clamp-2">{category.description}</p>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">Order: {category.displayOrder}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewImages(category.categoryID)}
                    className="text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-purple-50"
                    title="View Images"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.categoryID)}
                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new gallery category.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Category' : 'Add New Category'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">Active</label>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {editMode ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default GalleryCategories
