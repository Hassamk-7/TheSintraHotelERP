import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../../utils/axios.js'
import {
  HomeIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

const RoomTypeImages = () => {
  const { roomTypeId } = useParams()
  const navigate = useNavigate()
  const [images, setImages] = useState([])
  const [roomType, setRoomType] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    altText: '',
    displayOrder: 0,
    isPrimary: false
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load images and room type data on component mount
  useEffect(() => {
    if (roomTypeId) {
      fetchRoomTypeImages()
      fetchRoomType()
    }
  }, [roomTypeId])

  // Fetch room type details
  const fetchRoomType = async () => {
    try {
      console.log('🚀 Fetching room type details for ID:', roomTypeId)
      const response = await axios.get(`/roomtypes/${roomTypeId}`)
      
      if (response.data && response.data.success && response.data.data) {
        setRoomType(response.data.data)
        console.log('✅ Room type loaded:', response.data.data)
      } else if (response.data && response.data.id) {
        setRoomType(response.data)
        console.log('✅ Room type loaded:', response.data)
      } else {
        console.log('⚠️ Room type not found')
        setError('Room type not found')
      }
    } catch (err) {
      console.error('❌ Error fetching room type:', err)
      setError('Failed to load room type details')
    }
  }

  // Fetch images for this room type - DYNAMIC FROM DATABASE
  const fetchRoomTypeImages = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('🚀 Fetching images for room type:', roomTypeId)
      const response = await axios.get(`/roomtypeimage/roomtype/${roomTypeId}`)
      
      console.log('📊 API Response:', response.data)
      
      if (response.data && Array.isArray(response.data)) {
        setImages(response.data)
        console.log('✅ Loaded images from database:', response.data.length)
      } else if (response.data && response.data.success && response.data.data) {
        setImages(response.data.data)
        console.log('✅ Loaded images from database:', response.data.data.length)
      } else {
        setImages([])
        console.log('✅ No images found for this room type')
      }
    } catch (err) {
      console.error('❌ API Error fetching images:', err)
      if (err.response && err.response.status === 404) {
        setImages([])
        console.log('✅ No images found (404 - empty gallery)')
      } else {
        setError('Failed to load images')
        setImages([])
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles(files)
    
    if (files.length > 0) {
      // Auto-fill title with first filename
      const firstFile = files[0]
      const fileName = firstFile.name.split('.')[0]
      setUploadData(prev => ({
        ...prev,
        title: fileName,
        altText: fileName
      }))
    }
  }

  // Upload images to database
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one image file')
      return
    }

    try {
      setUploading(true)
      setError('')

      // Upload each file
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const formData = new FormData()
        
        formData.append('RoomTypeId', roomTypeId)
        formData.append('ImageFile', file)
        formData.append('Title', uploadData.title || file.name.split('.')[0])
        formData.append('Description', uploadData.description || '')
        formData.append('AltText', uploadData.altText || file.name.split('.')[0])
        formData.append('DisplayOrder', uploadData.displayOrder + i)
        formData.append('IsPrimary', i === 0 && uploadData.isPrimary ? 'true' : 'false')

        console.log('🚀 Uploading image:', file.name)
        const response = await axios.post('/roomtypeimage/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        
        console.log('✅ Image uploaded:', response.data)
      }

      setSuccess(`Successfully uploaded ${selectedFiles.length} image(s)!`)
      setShowUploadModal(false)
      resetUploadForm()
      
      // Refresh images
      await fetchRoomTypeImages()

    } catch (err) {
      console.error('❌ Error uploading images:', err)
      if (err.response) {
        setError(`Upload failed: ${err.response.data?.message || err.response.statusText}`)
      } else {
        setError('Failed to upload images. Please try again.')
      }
    } finally {
      setUploading(false)
    }
  }

  // Delete image
  const handleDelete = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return

    try {
      console.log('🚀 Deleting image:', imageId)
      await axios.delete(`/roomtypeimage/${imageId}`)
      
      setSuccess('Image deleted successfully!')
      await fetchRoomTypeImages()
    } catch (err) {
      console.error('❌ Error deleting image:', err)
      setError('Failed to delete image')
    }
  }

  // Set as primary image
  const handleSetPrimary = async (imageId) => {
    try {
      console.log('🚀 Setting primary image:', imageId)
      await axios.post(`/roomtypeimage/${imageId}/set-primary`)
      
      setSuccess('Primary image updated!')
      await fetchRoomTypeImages()
    } catch (err) {
      console.error('❌ Error setting primary image:', err)
      setError('Failed to set primary image')
    }
  }

  // Reset upload form
  const resetUploadForm = () => {
    setSelectedFiles([])
    setUploadData({
      title: '',
      description: '',
      altText: '',
      displayOrder: 0,
      isPrimary: false
    })
  }

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('')
        setError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-sm text-gray-500">
            <HomeIcon className="h-4 w-4 mr-1" />
            <span>Dashboard</span>
            <span className="mx-2">/</span>
            <span>Room Types</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Images</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl shadow-lg mb-6">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Room Type Images</h1>
              <p className="text-purple-100">Manage room type image gallery</p>
              <div className="text-purple-200 text-sm mt-1 space-y-1">
                <p>Room Type: {roomType?.name || 'Loading...'}</p>
                <p>Database Images: {images.length} found</p>
              </div>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors duration-200 flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Upload Images</span>
            </button>
          </div>
        </div>
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

      {/* Images Grid */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading images from database...</p>
          </div>
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Images Found</h3>
            <p className="text-gray-500 mb-4">Upload images to showcase this room type</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              >
                Upload Images
              </button>
              <button
                onClick={() => navigate('/room-types')}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Back to Room Types
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <div key={image.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Image Display */}
              <div className="relative h-48 bg-gray-100">
                {image.thumbnailPath || image.imagePath ? (
                  <img
                    src={image.thumbnailPath || image.imagePath}
                    alt={image.altText || image.title || 'Room image'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If image fails to load, show placeholder
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div className="w-full h-full flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200" style={{display: (image.thumbnailPath || image.imagePath) ? 'none' : 'flex'}}>
                  <PhotoIcon className="h-12 w-12 text-purple-400 mb-2" />
                  <span className="text-xs text-purple-600 text-center px-2">
                    {image.title || 'Hotel Room Image'}
                  </span>
                </div>
                
                {/* Primary Badge */}
                {image.isPrimary && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-yellow-500 text-white px-2 py-1 text-xs font-semibold rounded-full flex items-center">
                      <StarIcon className="h-3 w-3 mr-1" />
                      Primary
                    </span>
                  </div>
                )}
              </div>

              {/* Image Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {image.title || image.originalFileName}
                    </h4>
                    {image.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {image.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-xs text-gray-400 mb-3">
                  <p>{image.width} × {image.height}px</p>
                  <p>{Math.round(image.fileSizeBytes / 1024)} KB</p>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSetPrimary(image.id)}
                      className="text-yellow-600 hover:text-yellow-800"
                      title="Set as primary"
                      disabled={image.isPrimary}
                    >
                      <StarIcon className={`h-4 w-4 ${image.isPrimary ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => window.open(image.imagePath, '_blank')}
                      className="text-blue-600 hover:text-blue-800"
                      title="View full size"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete image"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Upload Images for {roomType?.name}
              </h3>
              
              <div className="space-y-4">
                {/* File Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Images *
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: JPG, PNG, WebP. Max size: 10MB per file.
                  </p>
                </div>

                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selected Files ({selectedFiles.length})
                    </label>
                    <div className="max-h-32 overflow-y-auto">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="text-sm text-gray-600 py-1">
                          {file.name} ({Math.round(file.size / 1024)} KB)
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={uploadData.title}
                      onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Image title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={uploadData.displayOrder}
                      onChange={(e) => setUploadData({...uploadData, displayOrder: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Image description"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={uploadData.isPrimary}
                      onChange={(e) => setUploadData({...uploadData, isPrimary: e.target.checked})}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Set first image as primary</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadModal(false)
                      resetUploadForm()
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading || selectedFiles.length === 0}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} Image(s)`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomTypeImages
