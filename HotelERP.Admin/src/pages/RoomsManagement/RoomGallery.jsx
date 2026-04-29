import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, getImageUrl } from '../../config/api';

const RoomGallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    roomTypeID: '',
    imageFile: null,
    imageTitle: '',
    imageDescription: '',
    category: 'Rooms & Suites',
    displayOrder: 0,
    isMainImage: false
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

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

  useEffect(() => {
    fetchGalleries();
    fetchRoomTypes();
  }, []);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/RoomGallery`);
      setGalleries(response.data);
    } catch (error) {
      console.error('Error fetching galleries:', error);
      alert('Failed to fetch galleries');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/RoomType`);
      setRoomTypes(response.data);
    } catch (error) {
      console.error('Error fetching room types:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.roomTypeID) {
      alert('Please select a room type');
      return;
    }

    if (!editMode && !formData.imageFile) {
      alert('Please select an image');
      return;
    }

    const data = new FormData();
    data.append('RoomTypeID', formData.roomTypeID);
    if (formData.imageFile) {
      data.append('ImageFile', formData.imageFile);
    }
    data.append('ImageTitle', formData.imageTitle);
    data.append('ImageDescription', formData.imageDescription);
    data.append('Category', formData.category);
    data.append('DisplayOrder', formData.displayOrder);
    data.append('IsMainImage', formData.isMainImage);

    try {
      setLoading(true);
      if (editMode) {
        await axios.put(`${API_BASE_URL}/RoomGallery/${editId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Gallery updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/RoomGallery`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Gallery added successfully');
      }
      resetForm();
      fetchGalleries();
    } catch (error) {
      console.error('Error saving gallery:', error);
      alert('Failed to save gallery: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (gallery) => {
    setEditMode(true);
    setEditId(gallery.roomGalleryID);
    setFormData({
      roomTypeID: gallery.roomTypeID,
      imageFile: null,
      imageTitle: gallery.imageTitle || '',
      imageDescription: gallery.imageDescription || '',
      category: gallery.category || 'Rooms & Suites',
      displayOrder: gallery.displayOrder,
      isMainImage: gallery.isMainImage
    });
    setPreviewImage(`${API_BASE_URL}${gallery.imagePath}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gallery image?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/RoomGallery/${id}`);
      alert('Gallery deleted successfully');
      fetchGalleries();
    } catch (error) {
      console.error('Error deleting gallery:', error);
      alert('Failed to delete gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleSetMainImage = async (id) => {
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/RoomGallery/SetMainImage/${id}`);
      alert('Main image set successfully');
      fetchGalleries();
    } catch (error) {
      console.error('Error setting main image:', error);
      alert('Failed to set main image');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      roomTypeID: '',
      imageFile: null,
      imageTitle: '',
      imageDescription: '',
      category: 'Rooms & Suites',
      displayOrder: 0,
      isMainImage: false
    });
    setEditMode(false);
    setEditId(null);
    setPreviewImage(null);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Room Gallery Management</h1>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editMode ? 'Edit Gallery Image' : 'Add New Gallery Image'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Type *
              </label>
              <select
                name="roomTypeID"
                value={formData.roomTypeID}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Room Type</option>
                {roomTypes.map(rt => (
                  <option key={rt.roomTypeId} value={rt.roomTypeId}>
                    {rt.roomTypeName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter image description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image File {!editMode && '*'}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={!editMode}
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isMainImage"
                  checked={formData.isMainImage}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Set as Main Image</span>
              </label>
            </div>
          </div>

          {previewImage && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview:</label>
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-xs h-48 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : editMode ? 'Update Gallery' : 'Add Gallery'}
            </button>
            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Gallery List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Gallery Images</h2>
        {loading && <p className="text-center py-4">Loading...</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {galleries.map(gallery => (
            <div key={gallery.roomGalleryID} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={getImageUrl(gallery.imagePath)}
                  alt={gallery.imageTitle || 'Gallery Image'}
                  className="w-full h-48 object-cover"
                />
                {gallery.isMainImage && (
                  <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                    Main
                  </span>
                )}
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  {gallery.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {gallery.roomType?.roomTypeName || 'N/A'}
                </h3>
                {gallery.imageTitle && (
                  <p className="text-sm text-gray-600 mb-2">{gallery.imageTitle}</p>
                )}
                {gallery.imageDescription && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{gallery.imageDescription}</p>
                )}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleEdit(gallery)}
                    className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  {!gallery.isMainImage && (
                    <button
                      onClick={() => handleSetMainImage(gallery.roomGalleryID)}
                      className="text-xs px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Set Main
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(gallery.roomGalleryID)}
                    className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && galleries.length === 0 && (
          <p className="text-center text-gray-500 py-8">No gallery images found. Add your first image above.</p>
        )}
      </div>
    </div>
  );
};

export default RoomGallery;
