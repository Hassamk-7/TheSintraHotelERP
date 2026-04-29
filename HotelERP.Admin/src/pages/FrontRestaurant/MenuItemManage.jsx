import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios.js';
import { getImageUrl } from '../../config/api.js';
import { CakeIcon, PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const MenuItemManage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    menuItemID: null,
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
  });
  const [previewImage, setPreviewImage] = useState(null);

  const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages'];
  const cuisines = ['Pakistani', 'Continental', 'Chinese', 'Italian', 'Thai'];

  useEffect(() => {
    fetchRestaurant();
    fetchMenuItems();
  }, [restaurantId]);

  const fetchRestaurant = async () => {
    try {
      const response = await axios.get(`/RestaurantLocation/${restaurantId}`);
      setRestaurant(response.data);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      setError('Failed to load restaurant details');
    }
  };

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/MenuItem/ByRestaurant/${restaurantId}`);
      setMenuItems(response.data || []);
    } catch (error) {
      if (error.response?.status === 404) {
        setMenuItems([]);
      } else {
        console.error('Error fetching menu items:', error);
        setError('Failed to load menu items');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      const submitData = new FormData();
      submitData.append('RestaurantID', restaurantId);
      submitData.append('Name', formData.name);
      submitData.append('Description', formData.description);
      submitData.append('Price', formData.price);
      submitData.append('Rating', formData.rating);
      submitData.append('Category', formData.category);
      submitData.append('Cuisine', formData.cuisine);
      submitData.append('IsSpicy', formData.isSpicy);
      submitData.append('IsVegetarian', formData.isVegetarian);
      submitData.append('DisplayOrder', formData.displayOrder);
      
      if (formData.imageFile) {
        submitData.append('ImageFile', formData.imageFile);
      }

      if (editMode) {
        await axios.put(`/MenuItem/${formData.menuItemID}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Menu item updated successfully!');
      } else {
        await axios.post('/MenuItem', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Menu item created successfully!');
      }

      setShowModal(false);
      resetForm();
      fetchMenuItems();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving menu item:', error);
      setError(error.response?.data?.message || 'Failed to save menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      menuItemID: item.menuItemID,
      name: item.name,
      description: item.description || '',
      imageFile: null,
      price: item.price,
      rating: item.rating,
      category: item.category,
      cuisine: item.cuisine,
      isSpicy: item.isSpicy,
      isVegetarian: item.isVegetarian,
      displayOrder: item.displayOrder
    });
    setPreviewImage(item.imagePath ? getImageUrl(item.imagePath) : null);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;

    try {
      setLoading(true);
      await axios.delete(`/MenuItem/${id}`);
      setSuccess('Menu item deleted successfully!');
      fetchMenuItems();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      setError('Failed to delete menu item');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      menuItemID: null,
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
    });
    setPreviewImage(null);
    setEditMode(false);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Show loading state
  if (loading && !restaurant) {
    return (
      <div className="p-6">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-white">Loading...</h1>
          <p className="text-orange-100">Please wait while we load the menu items</p>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl shadow-lg p-8 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/front-restaurant')}
              className="text-orange-100 hover:text-white mb-2 text-sm"
            >
              ← Back to Restaurants
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">
              {restaurant?.name || 'Menu Items'}
            </h1>
            <p className="text-orange-100">
              {restaurant?.location || 'Manage menu items for this restaurant'}
            </p>
            <p className="text-orange-200 text-sm mt-2">
              Restaurant ID: {restaurantId} | Total Items: {menuItems.length}
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Menu Item
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

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <div key={item.menuItemID} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-gray-100">
              <img
                src={item.imagePath ? `https://api.thesintrahotel.com${item.imagePath}` : ''}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('[MenuItem] Failed to load image:', item.imagePath);
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"><svg class="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><span class="text-xs text-gray-600">No Image</span></div>';
                }}
              />
              <div className="absolute top-2 left-2 flex gap-2">
                {item.isSpicy && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    🌶️ Spicy
                  </span>
                )}
                {item.isVegetarian && (
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                    🌱 Veg
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {item.category}
                </span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  {item.cuisine}
                </span>
              </div>
              
              {item.description && (
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>
              )}
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-orange-600">PKR {item.price}</span>
                <span className="text-sm text-gray-600">⭐ {item.rating}</span>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-xs text-gray-500">Order: {item.displayOrder}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-700"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.menuItemID)}
                    className="text-red-600 hover:text-red-700"
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

      {menuItems.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No menu items yet. Click "Add Menu Item" to get started.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editMode ? 'Edit Menu Item' : 'Add Menu Item'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Food Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="mt-4 w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Chicken Tikka"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Item description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cuisine *
                    </label>
                    <select
                      name="cuisine"
                      value={formData.cuisine}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select Cuisine</option>
                      {cuisines.map(cui => (
                        <option key={cui} value={cui}>{cui}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (PKR) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="1200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      step="0.1"
                      min="0"
                      max="5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      name="displayOrder"
                      value={formData.displayOrder}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isSpicy"
                        checked={formData.isSpicy}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Spicy</span>
                    </label>
                  </div>
                  
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isVegetarian"
                        checked={formData.isVegetarian}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Vegetarian</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editMode ? 'Update Item' : 'Create Item'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItemManage;
