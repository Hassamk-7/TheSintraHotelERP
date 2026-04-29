import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  HomeIcon, 
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  StarIcon,
  PhotoIcon,
  MapIcon
} from '@heroicons/react/24/outline'

const RoomsManagement = () => {
  const navigate = useNavigate()

  const modules = [
    {
      title: 'Room Types',
      description: 'Manage room categories, pricing, and specifications',
      icon: BuildingOfficeIcon,
      color: 'blue',
      path: '/room-types',
      stats: '7 Types'
    },
    {
      title: 'Room Type Images',
      description: 'Manage image galleries for room types',
      icon: PhotoIcon,
      color: 'purple',
      path: '/room-type-images',
      stats: '45 Images'
    },
    {
      title: 'Rooms',
      description: 'Individual room management and status',
      icon: HomeIcon,
      color: 'green',
      path: '/rooms',
      stats: '52 Rooms'
    },
    {
      title: 'Room Rates',
      description: 'Seasonal pricing and rate management',
      icon: CurrencyDollarIcon,
      color: 'emerald',
      path: '/room-rates',
      stats: '15 Rate Plans'
    },
    {
      title: 'Room Amenities',
      description: 'Manage room features and services',
      icon: StarIcon,
      color: 'indigo',
      path: '/room-amenities',
      stats: '25 Amenities'
    },
    {
      title: 'Floor Management',
      description: 'Floor-wise room organization',
      icon: MapIcon,
      color: 'gray',
      path: '/floor-management',
      stats: '4 Floors'
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      emerald: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
      indigo: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
      gray: 'from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-sm text-gray-500">
            <HomeIcon className="h-4 w-4 mr-1" />
            <span>Dashboard</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Rooms Management</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg mb-8">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Rooms Management</h1>
              <p className="text-blue-100">Comprehensive room and inventory management system</p>
            </div>
            <BuildingOfficeIcon className="h-16 w-16 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => {
          const IconComponent = module.icon
          return (
            <div
              key={index}
              onClick={() => navigate(module.path)}
              className={`bg-gradient-to-br ${getColorClasses(module.color)} rounded-xl shadow-lg p-6 text-white cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl`}
            >
              <div className="flex items-center justify-between mb-4">
                <IconComponent className="h-8 w-8" />
                <span className="text-sm font-medium bg-white bg-opacity-20 px-2 py-1 rounded-full">
                  {module.stats}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{module.title}</h3>
              <p className="text-sm opacity-90">{module.description}</p>
              
              <div className="mt-4 pt-4 border-t border-white border-opacity-20">
                <span className="text-sm font-medium">Click to manage →</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Rooms</p>
              <p className="text-2xl font-bold text-gray-900">52</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <HomeIcon className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">36</p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupied</p>
              <p className="text-2xl font-bold text-blue-600">15</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <StarIcon className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-purple-600">69%</p>
            </div>
            <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomsManagement
