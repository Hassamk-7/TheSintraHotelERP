import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { CubeIcon, PlusIcon } from '@heroicons/react/24/outline'

const RoomTypes = () => {
  const { data: roomTypes, isLoading } = useQuery({
    queryKey: ['room-types'],
    queryFn: async () => {
      const response = await axios.get('/roomtypes')
      return response.data.data
    }
  })

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Room Types</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage different types of rooms in your hotel
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Room Type
        </button>
      </div>

      {roomTypes && roomTypes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomTypes.map((roomType) => (
            <div key={roomType.id} className="card p-6">
              <div className="flex items-center mb-4">
                <CubeIcon className="h-8 w-8 text-gray-400 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {roomType.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {(roomType.hotelName || roomType.hotel?.name || roomType.hotel?.Name) ? `Hotel: ${roomType.hotelName || roomType.hotel?.name || roomType.hotel?.Name}` : 'Hotel: -'}
                  </p>
                </div>
              </div>
              
              {roomType.description && (
                <p className="text-sm text-gray-600 mb-4">
                  {roomType.description}
                </p>
              )}
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Max Adults:</span>
                  <span>{roomType.maximumAdults ?? roomType.MaximumAdults ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Children:</span>
                  <span>{roomType.maximumChildren ?? roomType.MaximumChildren ?? 'N/A'}</span>
                </div>
              </div>
              
              {roomType.amenities && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-1">
                    {roomType.amenities.split(',').slice(0, 3).map((amenity, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                        {amenity.trim()}
                      </span>
                    ))}
                    {roomType.amenities.split(',').length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                        +{roomType.amenities.split(',').length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex space-x-2">
                <button className="btn-secondary text-xs">Edit</button>
                <button className="btn-secondary text-xs">View Rooms</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No room types</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first room type.
          </p>
          <div className="mt-6">
            <button className="btn-primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Room Type
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomTypes;
