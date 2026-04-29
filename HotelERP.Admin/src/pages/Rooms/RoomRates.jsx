import { useState, useEffect } from 'react'
import { HomeIcon, PlusIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'

const RoomRates = () => {
  const [rates, setRates] = useState([])
  const [loading, setLoading] = useState(false)

  // Mock room rates data
  useEffect(() => {
    setRates([
      {
        id: 1,
        roomType: 'Standard Room',
        seasonType: 'Peak Season',
        weekdayRate: 5500,
        weekendRate: 6500,
        validFrom: '2024-12-01',
        validTo: '2024-02-28'
      },
      {
        id: 2,
        roomType: 'Deluxe Room',
        seasonType: 'Regular Season',
        weekdayRate: 8000,
        weekendRate: 9500,
        validFrom: '2024-03-01',
        validTo: '2024-11-30'
      },
      {
        id: 3,
        roomType: 'Executive Suite',
        seasonType: 'Peak Season',
        weekdayRate: 16500,
        weekendRate: 19000,
        validFrom: '2024-12-01',
        validTo: '2024-02-28'
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
            <span className="text-gray-900 font-medium">Room Rates</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl shadow-lg mb-6">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Room Rates</h1>
              <p className="text-green-100">Manage seasonal and dynamic pricing</p>
            </div>
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200 flex items-center space-x-2">
              <PlusIcon className="h-5 w-5" />
              <span>Add Rate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Rates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Season</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weekday Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weekend Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Period</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rates.map((rate) => (
                <tr key={rate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-5 w-5 text-green-500 mr-2" />
                      <div className="text-sm font-medium text-gray-900">{rate.roomType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      rate.seasonType === 'Peak Season' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {rate.seasonType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs {rate.weekdayRate.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs {rate.weekendRate.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rate.validFrom} to {rate.validTo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default RoomRates
