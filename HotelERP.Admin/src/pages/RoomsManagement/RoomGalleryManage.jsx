import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios.js';
import { getImageUrl } from '../../config/api.js';
import { HomeIcon, PhotoIcon, PlusIcon, XMarkIcon, CheckCircleIcon, XCircleIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';

const RoomGalleryManage = () => {
  const { roomTypeId } = useParams();
  const navigate = useNavigate();
  const [roomType, setRoomType] = useState(null);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    imageFile: [],
    imageTitle: '',
    imageDescription: '',
    category: 'Rooms & Suites',
    displayOrder: 0,
    isMainImage: false,
    location: '',
    rating: '',
    price: '',
    isSpicy: false,
    isVegetarian: false,
    cuisine: '',
    subCategory: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const categories = [
    'Rooms & Suites',
    'Restaurant',
    'Facilities',
    'Exterior',
    'Lobby',
    'Pool',
    'Gym',
    'Spa'
  ];

  const locations = ['Islamabad', 'Lahore', 'Karachi'];
  const cuisines = ['Pakistani', 'Continental', 'Chinese', 'Italian', 'Thai'];
  const subCategories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages'];

  useEffect(() => {
    fetchRoomType();
    fetchGalleries();
  }, [roomTypeId]);

  const fetchRoomType = async () => {
    try {
      const response = await axios.get(`/roomtypes/${roomTypeId}`);
      const data = response.data;
      // Handle both direct data and wrapped response
      const roomTypeData = data.success ? data.data : data;
      setRoomType(roomTypeData);
    } catch (error) {
      console.error('Error fetching room type:', error);
      setError('Failed to load room type details');
    }
  };

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/RoomGallery/ByRoomType/${roomTypeId}`);
      setGalleries(response.data || []);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setGalleries([]);
      } else {
        console.error('Error fetching galleries:', error);
        setError('Failed to load gallery images');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, imageFile: files }));
      // Show preview of first image
      setPreviewImage(URL.createObjectURL(files[0]));
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
    
    if (!formData.imageFile || formData.imageFile.length === 0) {
      setError('Please select at least one image');
      return;
    }

    try {
      setUploading(true);
      let uploadedCount = 0;
      
      // Upload each file separately
      for (let i = 0; i < formData.imageFile.length; i++) {
        const file = formData.imageFile[i];
        const data = new FormData();
        data.append('RoomTypeID', roomTypeId);
        data.append('ImageFile', file);
        data.append('ImageTitle', formData.imageTitle || `Image ${i + 1}`);
        data.append('ImageDescription', formData.imageDescription);
        data.append('Category', formData.category);
        data.append('DisplayOrder', parseInt(formData.displayOrder) + i);
        data.append('IsMainImage', i === 0 ? formData.isMainImage : false);
        
        // Restaurant-specific fields
        if (formData.location) data.append('Location', formData.location);
        if (formData.rating) data.append('Rating', formData.rating);
        if (formData.price) data.append('Price', formData.price);
        if (formData.cuisine) data.append('Cuisine', formData.cuisine);
        if (formData.subCategory) data.append('SubCategory', formData.subCategory);
        data.append('IsSpicy', formData.isSpicy);
        data.append('IsVegetarian', formData.isVegetarian);

        await axios.post('/RoomGallery', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedCount++;
      }
      
      setSuccess(`${uploadedCount} gallery image(s) added successfully`);
      resetForm();
      setShowAddModal(false);
      fetchGalleries();
    } catch (error) {
      console.error('Error uploading gallery:', error);
      setError('Failed to upload gallery image: ' + (error.response?.data || error.message));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gallery image?')) {
      return;
    }

    try {
      await axios.delete(`/RoomGallery/${id}`);
      setSuccess('Gallery image deleted successfully');
      fetchGalleries();
    } catch (error) {
      console.error('Error deleting gallery:', error);
      setError('Failed to delete gallery image');
    }
  };

  const handleSetMainImage = async (id) => {
    try {
      await axios.post(`/RoomGallery/SetMainImage/${id}`);
      setSuccess('Main image set successfully');
      fetchGalleries();
    } catch (error) {
      console.error('Error setting main image:', error);
      setError('Failed to set main image');
    }
  };

  const resetForm = () => {
    setFormData({
      imageFile: [],
      imageTitle: '',
      imageDescription: '',
      category: 'Rooms & Suites',
      displayOrder: 0,
      isMainImage: false,
      location: '',
      rating: '',
      price: '',
      isSpicy: false,
      isVegetarian: false,
      cuisine: '',
      subCategory: ''
    });
    setPreviewImage(null);
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-sm text-gray-500">
            <HomeIcon className="h-4 w-4 mr-1" />
            <span>Dashboard</span>
            <span className="mx-2">/</span>
            <button onClick={() => navigate('/rooms-management/room-gallery')} className="hover:text-purple-600">
              Room Gallery
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{roomType?.name || 'Loading...'}</span>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Gallery Image</span>
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          {success}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
          <XCircleIcon className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Gallery Images Grid */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading gallery images...</p>
          </div>
        </div>
      ) : galleries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Gallery Images</h3>
            <p className="text-gray-500 mb-4">Add your first gallery image for this room type</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Add Gallery Image
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleries.map((gallery) => (
            <div key={gallery.roomGalleryID} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 bg-gray-100">
                <img
                  src={getImageUrl(gallery.imagePath)}
                  alt={gallery.imageTitle || 'Gallery Image'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load image:', gallery.imagePath);
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
                {gallery.isMainImage && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
                    <StarIcon className="h-3 w-3 mr-1" />
                    Main
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  {gallery.category}
                </div>
              </div>
              <div className="p-4">
                {gallery.imageTitle && (
                  <h3 className="font-semibold text-gray-800 mb-1">{gallery.imageTitle}</h3>
                )}
                {gallery.imageDescription && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{gallery.imageDescription}</p>
                )}
                <div className="flex gap-2">
                  {!gallery.isMainImage && (
                    <button
                      onClick={() => handleSetMainImage(gallery.roomGalleryID)}
                      className="flex-1 text-xs px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center justify-center"
                    >
                      <StarIcon className="h-3 w-3 mr-1" />
                      Set Main
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(gallery.roomGalleryID)}
                    className="flex-1 text-xs px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                  >
                    <TrashIcon className="h-3 w-3 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Gallery Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add New Gallery Image</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Type
                  </label>
                  <input
                    type="text"
                    value={roomType?.name || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image Title
                  </label>
                  <input
                    type="text"
                    name="imageTitle"
                    value={formData.imageTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Deluxe Room View"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image Description
                  </label>
                  <textarea
                    name="imageDescription"
                    value={formData.imageDescription}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter image description..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image Files * (Multiple selection allowed)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    multiple
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  {formData.imageFile && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.imageFile.length} file(s) selected
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isMainImage"
                      checked={formData.isMainImage}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Set as Main Image</span>
                  </label>
                </div>

                {/* Restaurant-specific fields */}
                {formData.category === 'Restaurant' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select Location</option>
                        {locations.map(loc => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cuisine
                      </label>
                      <select
                        name="cuisine"
                        value={formData.cuisine}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select Cuisine</option>
                        {cuisines.map(cui => (
                          <option key={cui} value={cui}>{cui}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sub Category
                      </label>
                      <select
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select Sub Category</option>
                        {subCategories.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (PKR)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., 1200"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating (1-5)
                      </label>
                      <input
                        type="number"
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., 4.5"
                        min="1"
                        max="5"
                        step="0.1"
                      />
                    </div>

                    <div className="md:col-span-2 flex gap-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isSpicy"
                          checked={formData.isSpicy}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Spicy</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isVegetarian"
                          checked={formData.isVegetarian}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Vegetarian</span>
                      </label>
                    </div>
                  </>
                )}
              </div>

              {previewImage && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview:</label>
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="max-w-full h-48 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-400 font-medium"
                >
                  {uploading ? 'Uploading...' : 'Add Gallery'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
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

export default RoomGalleryManage;
