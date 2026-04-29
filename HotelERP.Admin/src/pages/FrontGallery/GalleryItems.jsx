import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../../utils/axios.js'
import {
  HomeIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

const GalleryItems = () => {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const [images, setImages] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadData, setUploadData] = useState({
    title: '',
    subtitle: '',
    description: '',
    displayOrder: 0,
    isMainImage: false
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (categoryId) {
      fetchGalleryImages()
      fetchCategory()
    }
  }, [categoryId])

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`/GalleryCategory/${categoryId}`)
      
      if (response.data) {
        setCategory(response.data)
      }
    } catch (err) {
      console.error('Error fetching category:', err)
      setError('Failed to load category details')
    }
  }

  const fetchGalleryImages = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await axios.get(`/GalleryItem/ByCategory/${categoryId}`)
      
      if (response.data && Array.isArray(response.data)) {
        setImages(response.data)
      } else if (response.data && response.data.success && response.data.data) {
        setImages(response.data.data)
      } else {
        setImages([])
      }
    } catch (err) {
      console.error('Error fetching images:', err)
      if (err.response && err.response.status === 404) {
        setImages([])
      } else {
        setError('Failed to load images')
        setImages([])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles(files)
    
    if (files.length > 0) {
      const firstFile = files[0]
      const fileName = firstFile.name.split('.')[0]
      setUploadData(prev => ({
        ...prev,
        title: fileName
      }))
    }
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one image file')
      return
    }

    try {
      setUploading(true)
      setError('')

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const formData = new FormData()
        
        formData.append('CategoryID', categoryId)
        formData.append('ImageFile', file)
        formData.append('Title', uploadData.title || file.name.split('.')[0])
        formData.append('Subtitle', uploadData.subtitle || '')
        formData.append('Description', uploadData.description || '')
        formData.append('DisplayOrder', uploadData.displayOrder + i)
        formData.append('IsMainImage', i === 0 && uploadData.isMainImage ? 'true' : 'false')

        await axios.post('/GalleryItem', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }

      setSuccess(`Successfully uploaded ${selectedFiles.length} image(s)!`)
      setShowUploadModal(false)
      setSelectedFiles([])
      setUploadData({
        title: '',
        subtitle: '',
        description: '',
        displayOrder: 0,
        isMainImage: false
      })
      fetchGalleryImages()
    } catch (err) {
      console.error('Error uploading images:', err)
      setError(err.response?.data?.message || 'Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return

    try {
      await axios.delete(`/GalleryItem/${id}`)
      setSuccess('Image deleted successfully!')
      fetchGalleryImages()
    } catch (err) {
      console.error('Error deleting image:', err)
      setError('Failed to delete image')
    }
  }

  const handleSetMainImage = async (id) => {
    try {
      await axios.put(`/GalleryItem/${id}/set-main`)
      setSuccess('Main image updated!')
      fetchGalleryImages()
    } catch (err) {
      console.error('Error setting main image:', err)
      setError('Failed to set main image')
    }
  }

  if (loading && !category) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading gallery...</p>
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
            <button
              onClick={() => navigate('/front-gallery')}
              className="text-purple-100 hover:text-white mb-2 flex items-center gap-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Categories
            </button>
            <h1 className="text-3xl font-bold text-white">{category?.title || 'Gallery Images'}</h1>
            <p className="text-purple-100 mt-2">{category?.subtitle || 'Manage images for this category'}</p>
            <p className="text-sm text-purple-200 mt-1">Category ID: {categoryId} | Total Images: {images.length}</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Image
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

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <div key={image.galleryItemID} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-gradient-to-br from-purple-100 to-purple-200">
              {image.thumbnailPath || image.imagePath ? (
                <img
                  src={`https://api.thesintrahotel.com${image.thumbnailPath || image.imagePath}`}
                  alt={image.title || 'Gallery image'}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
              ) : null}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200" style={{display: (image.thumbnailPath || image.imagePath) ? 'none' : 'flex'}}>
                <PhotoIcon className="h-12 w-12 text-purple-400 mb-2" />
                <span className="text-xs text-purple-600 text-center px-2">
                  {image.title || 'Gallery Image'}
                </span>
              </div>
              {image.isMainImage && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                  <StarIcon className="h-3 w-3" />
                  Main
                </div>
              )}
              {image.isActive ? (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                  Active
                </div>
              ) : (
                <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded text-xs font-bold">
                  Inactive
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">{image.title}</h3>
              <p className="text-xs text-gray-600 mb-2 line-clamp-1">{image.subtitle}</p>
              <p className="text-xs text-gray-500 line-clamp-2">{image.description}</p>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500">Order: {image.displayOrder}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSetMainImage(image.galleryItemID)}
                    className="text-yellow-600 hover:text-yellow-800 p-1 rounded hover:bg-yellow-50"
                    title="Set as main image"
                  >
                    <StarIcon className={`h-4 w-4 ${image.isMainImage ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => window.open(getImageUrl(image.imagePath), '_blank')}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                    title="View full size"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(image.galleryItemID)}
                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No images found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by uploading images to this category.</p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Upload Images</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Images *</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {selectedFiles.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">{selectedFiles.length} file(s) selected</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Image title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={uploadData.subtitle}
                  onChange={(e) => setUploadData({...uploadData, subtitle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Image subtitle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Image description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={uploadData.displayOrder}
                  onChange={(e) => setUploadData({...uploadData, displayOrder: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isMainImage"
                  checked={uploadData.isMainImage}
                  onChange={(e) => setUploadData({...uploadData, isMainImage: e.target.checked})}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isMainImage" className="ml-2 text-sm text-gray-700">Set as main image</label>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowUploadModal(false)
                  setSelectedFiles([])
                  setUploadData({
                    title: '',
                    subtitle: '',
                    description: '',
                    displayOrder: 0,
                    isMainImage: false
                  })
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                disabled={uploading || selectedFiles.length === 0}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GalleryItems
