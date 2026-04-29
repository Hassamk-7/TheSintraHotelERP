import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { BuildingOfficeIcon, PlusIcon } from '@heroicons/react/24/outline'

const Rooms = () => {
  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const response = await axios.get('/rooms')
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
          {[...Array(6)].map((_, i) => (
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'occupied':
        return 'bg-blue-100 text-blue-800'
      case 'maintenance':
      case 'outoforder':
        return 'bg-red-100 text-red-800'
      case 'dirty':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Rooms</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your hotel rooms and their availability
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Room
        </button>
      </div>

      {rooms && rooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-8 w-8 text-gray-400 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Room {room.roomNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {room.roomType?.name || 'Standard'}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                  {room.status || 'Available'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Floor:</span>
                  <span>{room.floorNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Adults:</span>
                  <span>{room.maxAdults || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Children:</span>
                  <span>{room.maxChildren || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span className="font-medium">${room.basePrice || 0}</span>
                </div>
              </div>
              
              {room.description && (
                <p className="mt-4 text-sm text-gray-600">
                  {room.description}
                </p>
              )}
              
              <div className="mt-4 flex space-x-2">
                <button className="btn-secondary text-xs">Edit</button>
                <button className="btn-secondary text-xs">View Details</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No rooms</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first room.
          </p>
          <div className="mt-6">
            <button className="btn-primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Room
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Rooms;
