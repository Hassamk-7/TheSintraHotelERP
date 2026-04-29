import { useState, useEffect } from 'react'
import { HomeIcon, PlusIcon, StarIcon } from '@heroicons/react/24/outline'

const RoomAmenities = () => {
  const [amenities, setAmenities] = useState([])
  const [loading, setLoading] = useState(false)

  // Mock amenities data
  useEffect(() => {
    setAmenities([
      {
        id: 1,
        name: 'Air Conditioning',
        category: 'Climate Control',
        description: 'Individual climate control',
        isChargeable: false,
        charge: 0,
        icon: '❄️'
      },
      {
        id: 2,
        name: 'Mini Bar',
        category: 'Food & Beverage',
        description: 'Fully stocked mini refrigerator',
        isChargeable: true,
        charge: 500,
        icon: '🍹'
      },
      {
        id: 3,
        name: 'WiFi Internet',
        category: 'Connectivity',
        description: 'High-speed wireless internet',
        isChargeable: false,
        charge: 0,
        icon: '📶'
      },
      {
        id: 4,
        name: 'Room Service',
        category: 'Service',
        description: '24/7 in-room dining service',
        isChargeable: true,
        charge: 200,
        icon: '🛎️'
      }
    ])
  }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-sm text-gray-500">
            <HomeIcon className="h-4 w-4 mr-1" />
            <span>Dashboard</span>
            <span className="mx-2">/</span>
            <span>Rooms</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Room Amenities</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl shadow-lg mb-6">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Room Amenities</h1>
              <p className="text-indigo-100">Manage room features and services</p>
            </div>
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors duration-200 flex items-center space-x-2">
              <PlusIcon className="h-5 w-5" />
              <span>Add Amenity</span>
            </button>
          </div>
        </div>
      </div>

      {/* Amenities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {amenities.map((amenity) => (
          <div key={amenity.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{amenity.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{amenity.name}</h3>
                  <p className="text-sm text-gray-500">{amenity.category}</p>
                </div>
              </div>
              <StarIcon className="h-5 w-5 text-indigo-500" />
            </div>
            
            <p className="text-gray-600 mb-4">{amenity.description}</p>
            
            <div className="flex items-center justify-between">
              <div>
                {amenity.isChargeable ? (
                  <span className="bg-red-100 text-red-800 px-2 py-1 text-xs font-semibold rounded-full">
                    Rs {amenity.charge}
                  </span>
                ) : (
                  <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-semibold rounded-full">
                    Free
                  </span>
                )}
              </div>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RoomAmenities
