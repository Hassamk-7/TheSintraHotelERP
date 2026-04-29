import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios.js';
import { getImageUrl } from '../../config/api.js';
import { BuildingStorefrontIcon, PlusIcon, PencilIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';

const RestaurantManage = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    restaurantID: null,
    name: '',
    location: '',
    description: '',
    imageFile: null,
    rating: 4.5,
    phoneNumber: '',
    email: '',
    openingHours: '',
    displayOrder: 0
  });
  const [previewImage, setPreviewImage] = useState(null);

  const locations = ['Islamabad', 'Lahore', 'Karachi'];

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/RestaurantLocation');
      setRestaurants(response.data || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setError('Failed to load restaurants');
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      const submitData = new FormData();
      submitData.append('Name', formData.name);
      submitData.append('Location', formData.location);
      submitData.append('Description', formData.description);
      submitData.append('Rating', formData.rating);
      submitData.append('PhoneNumber', formData.phoneNumber);
      submitData.append('Email', formData.email);
      submitData.append('OpeningHours', formData.openingHours);
      submitData.append('DisplayOrder', formData.displayOrder);
      
      if (formData.imageFile) {
        submitData.append('ImageFile', formData.imageFile);
      }

      if (editMode) {
        await axios.put(`/RestaurantLocation/${formData.restaurantID}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Restaurant updated successfully!');
      } else {
        await axios.post('/RestaurantLocation', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Restaurant created successfully!');
      }

      setShowModal(false);
      resetForm();
      fetchRestaurants();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving restaurant:', error);
      setError(error.response?.data?.message || 'Failed to save restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (restaurant) => {
    setFormData({
      restaurantID: restaurant.restaurantID,
      name: restaurant.name,
      location: restaurant.location,
      description: restaurant.description || '',
      imageFile: null,
      rating: restaurant.rating,
      phoneNumber: restaurant.phoneNumber || '',
      email: restaurant.email || '',
      openingHours: restaurant.openingHours || '',
      displayOrder: restaurant.displayOrder
    });
    setPreviewImage(restaurant.imagePath ? getImageUrl(restaurant.imagePath) : null);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;

    try {
      setLoading(true);
      await axios.delete(`/RestaurantLocation/${id}`);
      setSuccess('Restaurant deleted successfully!');
      fetchRestaurants();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      setError('Failed to delete restaurant');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      restaurantID: null,
      name: '',
      location: '',
      description: '',
      imageFile: null,
      rating: 4.5,
      phoneNumber: '',
      email: '',
      openingHours: '',
      displayOrder: 0
    });
    setPreviewImage(null);
    setEditMode(false);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl shadow-lg p-8 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Restaurant Locations</h1>
            <p className="text-orange-100">Manage restaurant locations for the customer website</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Restaurant
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

      {/* Restaurants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div key={restaurant.restaurantID} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-gray-100">
              <img
                src={restaurant.imagePath ? `https://api.thesintrahotel.com${restaurant.imagePath}` : ''}
                alt={restaurant.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('[Restaurant] Failed to load image:', restaurant.imagePath);
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"><svg class="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><span class="text-xs text-gray-600">No Image</span></div>';
                }}
              />
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{restaurant.name}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-full">
                  {restaurant.location}
                </span>
                <div className="flex items-center gap-1">
                  <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold">{restaurant.rating}</span>
                </div>
              </div>
              
              {restaurant.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{restaurant.description}</p>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <button
                  onClick={() => navigate(`/front-restaurant/menu/${restaurant.restaurantID}`)}
                  className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                >
                  Manage Menu
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(restaurant)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(restaurant.restaurantID)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editMode ? 'Edit Restaurant' : 'Add New Restaurant'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant Image
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
                    Restaurant Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., The Grand Dining Hall"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Location</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
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
                    placeholder="Restaurant description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="+92 XXX XXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="restaurant@hotel.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opening Hours
                    </label>
                    <input
                      type="text"
                      name="openingHours"
                      value={formData.openingHours}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 7 AM - 11 PM"
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
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editMode ? 'Update Restaurant' : 'Create Restaurant'}
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

export default RestaurantManage;
