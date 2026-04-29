import { useState, useEffect } from 'react'
import { HomeIcon, PlusIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'

const FloorManagement = () => {
  const [floors, setFloors] = useState([])
  const [loading, setLoading] = useState(false)

  // Mock floor data
  useEffect(() => {
    setFloors([
      {
        id: 1,
        floorNumber: 1,
        floorName: 'Ground Floor',
        totalRooms: 12,
        availableRooms: 8,
        occupiedRooms: 3,
        outOfOrderRooms: 1,
        floorManager: 'Ahmed Hassan'
      },
      {
        id: 2,
        floorNumber: 2,
        floorName: 'Second Floor',
        totalRooms: 15,
        availableRooms: 10,
        occupiedRooms: 5,
        outOfOrderRooms: 0,
        floorManager: 'Fatima Khan'
      },
      {
        id: 3,
        floorNumber: 3,
        floorName: 'Third Floor',
        totalRooms: 15,
        availableRooms: 12,
        occupiedRooms: 3,
        outOfOrderRooms: 0,
        floorManager: 'Muhammad Ali'
      },
      {
        id: 4,
        floorNumber: 4,
        floorName: 'Fourth Floor',
        totalRooms: 10,
        availableRooms: 6,
        occupiedRooms: 4,
        outOfOrderRooms: 0,
        floorManager: 'Ayesha Ahmad'
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
            <span className="text-gray-900 font-medium">Floor Management</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl shadow-lg mb-6">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Floor Management</h1>
              <p className="text-gray-100">Monitor and manage hotel floors</p>
            </div>
            <button className="bg-white text-gray-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2">
              <PlusIcon className="h-5 w-5" />
              <span>Add Floor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {floors.map((floor) => (
          <div key={floor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <BuildingOfficeIcon className="h-8 w-8 text-gray-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{floor.floorName}</h3>
                  <p className="text-sm text-gray-500">Floor {floor.floorNumber}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Rooms</span>
                <span className="font-semibold">{floor.totalRooms}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Available</span>
                <span className="font-semibold text-green-600">{floor.availableRooms}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-600">Occupied</span>
                <span className="font-semibold text-blue-600">{floor.occupiedRooms}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-red-600">Out of Order</span>
                <span className="font-semibold text-red-600">{floor.outOfOrderRooms}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Floor Manager</p>
                  <p className="text-sm font-medium text-gray-900">{floor.floorManager}</p>
                </div>
                <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FloorManagement
