import { useEffect, useState } from 'react'
import axios from '../../utils/axios.js'
import { getImageUrl } from '../../config/api.js'
import {
  ClipboardDocumentListIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const MenuManagement = () => {
  const [restaurants, setRestaurants] = useState([])
  const [menuItems, setMenuItems] = useState([])

  const [selectedRestaurantId, setSelectedRestaurantId] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [previewImage, setPreviewImage] = useState(null)
  const [errors, setErrors] = useState({})

  const [categories, setCategories] = useState([])
  const [cuisines, setCuisines] = useState([])

  const [formData, setFormData] = useState({
    restaurantID: '',
    name: '',
    description: '',
    imageFile: null,
    price: '',
    rating: 4.5,
    category: '',
    cuisine: '',
    isSpicy: false,
    isVegetarian: false,
    displayOrder: 0
  })

  const getRestaurantLabel = (r) => {
    const name = r?.name || ''
    const loc = r?.location || ''
    return loc ? `${name} (${loc})` : name
  }

  const getItemId = (item) => item?.menuItemID ?? item?.menuItemId

  const resetForm = () => {
    setFormData({
      restaurantID: selectedRestaurantId || '',
      name: '',
      description: '',
      imageFile: null,
      price: '',
      rating: 4.5,
      category: '',
      cuisine: '',
      isSpicy: false,
      isVegetarian: false,
      displayOrder: 0
    })
    setErrors({})
    setPreviewImage(null)
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.restaurantID) newErrors.restaurantID = 'Restaurant is required'
    if (!formData.name.trim()) newErrors.name = 'Item name is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.cuisine) newErrors.cuisine = 'Cuisine is required'
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Valid price is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFormData((prev) => ({ ...prev, imageFile: file }))
    setPreviewImage(URL.createObjectURL(file))
  }

  const fetchCategoryMasters = async () => {
    try {
      const res = await axios.get('/MenuCategoryMasters', { params: { page: 1, pageSize: 5000, search: '' } })
      const apiData = res.data
      const list = Array.isArray(apiData)
        ? apiData
        : (apiData?.data && Array.isArray(apiData.data) ? apiData.data : [])
      const names = list.map(x => String(x.name ?? x.Name ?? '').trim()).filter(Boolean)
      setCategories(names)
    } catch (e) {
      console.error('Error fetching menu category masters:', e)
      setCategories([])
    }
  }

  const fetchCuisineMasters = async () => {
    try {
      const res = await axios.get('/MenuCuisineMasters', { params: { page: 1, pageSize: 5000, search: '' } })
      const apiData = res.data
      const list = Array.isArray(apiData)
        ? apiData
        : (apiData?.data && Array.isArray(apiData.data) ? apiData.data : [])
      const names = list.map(x => String(x.name ?? x.Name ?? '').trim()).filter(Boolean)
      setCuisines(names)
    } catch (e) {
      console.error('Error fetching menu cuisine masters:', e)
      setCuisines([])
    }
  }

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get('/RestaurantLocation')
      setRestaurants(Array.isArray(res.data) ? res.data : [])
    } catch (e) {
      console.error('Error fetching restaurants:', e)
      setRestaurants([])
    }
  }

  const fetchMenuItems = async () => {
    try {
      setLoading(true)
      setError('')
      if (selectedRestaurantId) {
        const res = await axios.get(`/MenuItem/ByRestaurant/${selectedRestaurantId}`)
        setMenuItems(Array.isArray(res.data) ? res.data : [])
      } else {
        const res = await axios.get('/MenuItem')
        setMenuItems(Array.isArray(res.data) ? res.data : [])
      }
    } catch (e) {
      console.error('Error fetching menu items:', e)
      setMenuItems([])
      setError('Failed to load menu items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRestaurants()
    fetchCategoryMasters()
    fetchCuisineMasters()
  }, [])

  useEffect(() => {
    fetchMenuItems()
  }, [selectedRestaurantId])

  const filteredItems = (menuItems || []).filter((item) => {
    if (selectedCategory && String(item?.category || '') !== selectedCategory) return false
    if (selectedCuisine && String(item?.cuisine || '') !== selectedCuisine) return false

    const q = searchTerm.trim().toLowerCase()
    if (!q) return true
    return (
      String(item?.name || '').toLowerCase().includes(q) ||
      String(item?.category || '').toLowerCase().includes(q) ||
      String(item?.cuisine || '').toLowerCase().includes(q)
    )
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const submitData = new FormData()
      submitData.append('RestaurantID', String(formData.restaurantID))
      submitData.append('Name', formData.name)
      submitData.append('Description', formData.description || '')
      submitData.append('Price', String(formData.price || 0))
      submitData.append('Rating', String(formData.rating || 4.5))
      submitData.append('Category', formData.category)
      submitData.append('Cuisine', formData.cuisine)
      submitData.append('IsSpicy', String(Boolean(formData.isSpicy)))
      submitData.append('IsVegetarian', String(Boolean(formData.isVegetarian)))
      submitData.append('DisplayOrder', String(formData.displayOrder || 0))
      if (formData.imageFile) submitData.append('ImageFile', formData.imageFile)

      if (editingId) {
        await axios.put(`/MenuItem/${editingId}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setSuccess('Menu item updated successfully')
      } else {
        await axios.post('/MenuItem', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setSuccess('Menu item created successfully')
      }

      setShowForm(false)
      setEditingId(null)
      resetForm()
      await fetchMenuItems()
    } catch (e) {
      console.error('Error saving menu item:', e)
      setError(e.response?.data?.message || 'Error saving menu item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
    const id = getItemId(item)
    setFormData({
      restaurantID: String(item.restaurantID ?? item.restaurantId ?? ''),
      name: item.name || '',
      description: item.description || '',
      imageFile: null,
      price: String(item.price ?? ''),
      rating: Number(item.rating ?? 4.5),
      category: item.category || '',
      cuisine: item.cuisine || '',
      isSpicy: Boolean(item.isSpicy),
      isVegetarian: Boolean(item.isVegetarian),
      displayOrder: Number(item.displayOrder ?? 0)
    })
    setPreviewImage(item.imagePath ? getImageUrl(item.imagePath) : null)
    setEditingId(id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      await axios.delete(`/MenuItem/${id}`)
      setSuccess('Menu item deleted successfully')
      await fetchMenuItems()
    } catch (e) {
      console.error('Error deleting menu item:', e)
      setError(e.response?.data?.message || 'Failed to delete menu item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <ClipboardDocumentListIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
              <p className="text-gray-600">Manage restaurant menu items (real database data)</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-700">{success}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-48">
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Cuisines</option>
            {cuisines.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-72">
          <select
            value={selectedRestaurantId}
            onChange={(e) => {
              setSelectedRestaurantId(e.target.value)
              setFormData((prev) => ({ ...prev, restaurantID: e.target.value }))
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Restaurants</option>
            {restaurants.map((r) => (
              <option key={r.restaurantID} value={r.restaurantID}>
                {getRestaurantLabel(r)}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Menu Item
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{editingId ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Restaurant <span className="text-red-500">*</span></label>
                <select
                  value={formData.restaurantID}
                  onChange={(e) => setFormData({ ...formData, restaurantID: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.restaurantID ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Restaurant</option>
                  {restaurants.map((r) => (
                    <option key={r.restaurantID} value={r.restaurantID}>
                      {getRestaurantLabel(r)}
                    </option>
                  ))}
                </select>
                {errors.restaurantID && <p className="mt-1 text-sm text-red-600">{errors.restaurantID}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Food Image</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                {previewImage && <img src={previewImage} alt="Preview" className="mt-4 w-full h-48 object-cover rounded-lg" />}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cuisine <span className="text-red-500">*</span></label>
                <select
                  value={formData.cuisine}
                  onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.cuisine ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Cuisine</option>
                  {cuisines.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.cuisine && <p className="mt-1 text-sm text-red-600">{errors.cuisine}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price (Rs) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value || 0) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isVegetarian"
                    checked={formData.isVegetarian}
                    onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isVegetarian" className="ml-2 text-sm text-gray-700">Vegetarian</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isSpicy"
                    checked={formData.isSpicy}
                    onChange={(e) => setFormData({ ...formData, isSpicy: e.target.checked })}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isSpicy" className="ml-2 text-sm text-gray-700">Spicy</label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setEditingId(null)
                  setShowForm(false)
                }}
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Menu Items ({filteredItems.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuisine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Properties</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={getItemId(item)} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.imagePath ? (
                      <img
                        src={getImageUrl(item.imagePath)}
                        alt={item.name}
                        className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-100 border border-gray-200" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.category === 'Main Course'
                          ? 'bg-red-100 text-red-800'
                          : item.category === 'Appetizers'
                            ? 'bg-orange-100 text-orange-800'
                            : item.category === 'Dessert'
                              ? 'bg-pink-100 text-pink-800'
                              : item.category === 'Beverages'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.cuisine}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {item.isVegetarian && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Veg</span>
                      )}
                      {item.isSpicy && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Spicy</span>
                      )}
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        Rs {Number(item.price || 0).toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(getItemId(item))}
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

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No menu items found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new menu item.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MenuManagement
