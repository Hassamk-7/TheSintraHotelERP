import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../utils/axios.js'
import { PhotoIcon, EyeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

import { getImageUrl } from '../../config/api'

const RoomGalleryList = () => {
  const navigate = useNavigate()
  const [roomTypes, setRoomTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchRoomTypesWithGalleryCounts()
  }, [])

  const fetchRoomTypesWithGalleryCounts = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('🚀 Fetching room types from database...')
      const roomTypesResponse = await axios.get('/roomtypes')
      
      let roomTypesData = []
      if (roomTypesResponse.data && Array.isArray(roomTypesResponse.data)) {
        roomTypesData = roomTypesResponse.data
      } else if (roomTypesResponse.data && roomTypesResponse.data.success && roomTypesResponse.data.data) {
        roomTypesData = roomTypesResponse.data.data
      } else {
        console.log('⚠️ No room types found')
        setRoomTypes([])
        return
      }

      console.log('✅ Room types loaded:', roomTypesData.length)

      // For each room type, fetch gallery image count and thumbnail
      const roomTypesWithGalleryCounts = await Promise.all(
        roomTypesData.map(async (roomType) => {
          try {
            console.log('🚀 Fetching gallery images for room type:', roomType.id)
            const galleriesResponse = await axios.get(`/RoomGallery/ByRoomType/${roomType.id}`)
            
            let galleryCount = 0
            let galleries = []
            let thumbnailImage = null
            
            if (galleriesResponse.data && Array.isArray(galleriesResponse.data)) {
              galleries = galleriesResponse.data
              galleryCount = galleries.length
            } else if (galleriesResponse.data && galleriesResponse.data.success && galleriesResponse.data.data) {
              galleries = galleriesResponse.data.data
              galleryCount = galleries.length
            }
            
            // Get the main image as thumbnail
            if (galleries.length > 0) {
              thumbnailImage = galleries.find(img => img.isMainImage) || galleries[0]
            }
            
            return {
              ...roomType,
              galleryCount,
              thumbnailImage
            }
          } catch (err) {
            if (err.response && err.response.status === 404) {
              return {
                ...roomType,
                galleryCount: 0,
                thumbnailImage: null
              }
            }
            console.error('❌ Error fetching galleries for room type:', roomType.id, err)
            return {
              ...roomType,
              galleryCount: 0,
              thumbnailImage: null
            }
          }
        })
      )

      setRoomTypes(roomTypesWithGalleryCounts)
      console.log('✅ Room types with gallery counts:', roomTypesWithGalleryCounts)

    } catch (err) {
      console.error('❌ Error fetching room types:', err)
      if (err.response) {
        setError(`API Error: ${err.response.status} - ${err.response.statusText}`)
      } else {
        setError('Failed to load room types')
      }
      setRoomTypes([])
    } finally {
      setLoading(false)
    }
  }

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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-sm text-gray-500">
            <HomeIcon className="h-4 w-4 mr-1" />
            <span>Dashboard</span>
            <span className="mx-2">/</span>
            <span>Room Types</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Gallery</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl shadow-lg mb-6">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Room Gallery</h1>
              <p className="text-purple-100">Manage gallery images for each room type</p>
              <p className="text-purple-200 text-sm mt-1">Database Connected: {roomTypes.length} room types</p>
            </div>
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

      {/* Room Types Grid */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading room types from database...</p>
          </div>
        </div>
      ) : roomTypes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Room Types Found</h3>
            <p className="text-gray-500 mb-4">Create room types first to manage their gallery images</p>
            <button
              onClick={() => navigate('/rooms-management/room-types')}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Go to Room Types
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {roomTypes.map((roomType) => (
            <div key={roomType.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center relative overflow-hidden">
                {roomType.thumbnailImage && roomType.thumbnailImage.imagePath ? (
                  <>
                    <img 
                      src={getImageUrl(roomType.thumbnailImage.imagePath)}
                      alt={roomType.thumbnailImage.imageTitle || `${roomType.name} gallery`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.log('❌ Thumbnail failed to load:', roomType.thumbnailImage.imagePath)
                        e.target.style.display = 'none'
                        e.target.parentElement.querySelector('.fallback-icon').style.display = 'flex'
                      }}
                    />
                    {roomType.thumbnailImage.isMainImage && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Primary
                      </div>
                    )}
                  </>
                ) : null}
                <div className={`fallback-icon absolute inset-0 flex items-center justify-center ${roomType.thumbnailImage && roomType.thumbnailImage.imagePath ? 'hidden' : 'flex'}`}>
                  <PhotoIcon className="h-12 w-12 text-purple-400" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{roomType.name}</h3>
                <p className="text-sm text-gray-500 mb-2">Code: {roomType.code || roomType.Code}</p>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-600">
                    {roomType.galleryCount} {roomType.galleryCount === 1 ? 'image' : 'images'}
                  </p>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    roomType.galleryCount > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {roomType.galleryCount > 0 ? 'Has Images' : 'No Images'}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/rooms-management/room-gallery/${roomType.id}`)}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span>
                    {roomType.galleryCount > 0 ? 'View Images' : 'Add Images'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RoomGalleryList
