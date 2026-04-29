import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

const RoomStatus = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load rooms on component mount
  useEffect(() => {
    fetchRooms()
  }, [])

  // Fetch rooms from API
  const fetchRooms = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('🚀 Fetching room status from API...')
      
      const response = await axios.get('/rooms/status')
      console.log('✅ Room status response:', response.data)
      
      if (response.data.success) {
        setRooms(response.data.data)
        console.log(`✅ Loaded ${response.data.data.length} rooms from database`)
      } else {
        setError('Failed to load room status')
      }
    } catch (err) {
      console.error('❌ Error fetching room status:', err)
      console.log('🔄 Using mock room data as fallback...')
      
      // Use mock data as fallback
      const mockRooms = [
        {
          id: 1,
          roomNumber: '101',
          roomType: 'Standard',
          floor: 1,
          status: 'Occupied',
          guestName: 'Ahmed Hassan',
          checkIn: '2024-10-06',
          checkOut: '2024-10-10',
          housekeepingStatus: 'Clean',
          lastCleaned: '2024-10-08 08:00'
        },
        {
          id: 2,
          roomNumber: '102',
          roomType: 'Standard',
          floor: 1,
          status: 'Available',
          guestName: null,
          checkIn: null,
          checkOut: null,
          housekeepingStatus: 'Clean',
          lastCleaned: '2024-10-08 10:30'
        },
        {
          id: 3,
          roomNumber: '201',
          roomType: 'Deluxe',
          floor: 2,
          status: 'Occupied',
          guestName: 'Fatima Khan',
          checkIn: '2024-10-07',
          checkOut: '2024-10-11',
          housekeepingStatus: 'Needs Cleaning',
          lastCleaned: '2024-10-07 14:00'
        },
        {
          id: 4,
          roomNumber: '202',
          roomType: 'Deluxe',
          floor: 2,
          status: 'Reserved',
          guestName: 'Muhammad Ali',
          checkIn: '2024-10-09',
          checkOut: '2024-10-12',
          housekeepingStatus: 'Clean',
          lastCleaned: '2024-10-08 12:00'
        },
        {
          id: 5,
          roomNumber: '301',
          roomType: 'Suite',
          floor: 3,
          status: 'Maintenance',
          guestName: null,
          checkIn: null,
          checkOut: null,
          housekeepingStatus: 'Out of Order',
          lastCleaned: '2024-10-06 16:00'
        },
        {
          id: 6,
          roomNumber: '302',
          roomType: 'Suite',
          floor: 3,
          status: 'Available',
          guestName: null,
          checkIn: null,
          checkOut: null,
          housekeepingStatus: 'Clean',
          lastCleaned: '2024-10-08 09:15'
        }
      ]
      
      setRooms(mockRooms)
      console.log(`✅ Loaded ${mockRooms.length} mock rooms`)
    } finally {
      setLoading(false)
    }
  }

  const statusOptions = ['Available', 'Occupied', 'Reserved', 'Dirty', 'Maintenance', 'Out of Order']
  const housekeepingOptions = ['Clean', 'Needs Cleaning', 'In Progress', 'Out of Order']

  const handleUpdateStatus = async (roomId, newStatus, newHousekeepingStatus) => {
    try {
      setLoading(true)
      console.log('🚀 Updating room status:', { roomId, newStatus, newHousekeepingStatus })
      
      const response = await axios.put(`/rooms/${roomId}/status`, {
        status: newStatus,
        housekeepingStatus: newHousekeepingStatus
      })
      
      if (response.data.success) {
        console.log('✅ Room status updated successfully')
        setSuccess('Room status updated successfully!')
        setShowUpdateModal(false)
        setSelectedRoom(null)
        // Refresh the room list
        await fetchRooms()
      } else {
        setError('Failed to update room status')
      }
    } catch (err) {
      console.error('❌ Error updating room status:', err)
      setError('Failed to update room status')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800'
      case 'Occupied': return 'bg-blue-100 text-blue-800'
      case 'Reserved': return 'bg-yellow-100 text-yellow-800'
      case 'Dirty': return 'bg-orange-100 text-orange-800'
      case 'Maintenance': return 'bg-red-100 text-red-800'
      case 'Out of Order': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Available': return <CheckCircleIcon className="h-4 w-4" />
      case 'Occupied': return <BuildingOfficeIcon className="h-4 w-4" />
      case 'Reserved': return <ClockIcon className="h-4 w-4" />
      case 'Dirty': return <XCircleIcon className="h-4 w-4" />
      case 'Maintenance': return <WrenchScrewdriverIcon className="h-4 w-4" />
      case 'Out of Order': return <XCircleIcon className="h-4 w-4" />
      default: return <BuildingOfficeIcon className="h-4 w-4" />
    }
  }

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.includes(searchTerm) || 
                         room.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (room.guestName && room.guestName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filterStatus === 'All' || room.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const statusCounts = {
    Available: rooms.filter(r => r.status === 'Available').length,
    Occupied: rooms.filter(r => r.status === 'Occupied').length,
    Reserved: rooms.filter(r => r.status === 'Reserved').length,
    Dirty: rooms.filter(r => r.status === 'Dirty').length,
    Maintenance: rooms.filter(r => r.status === 'Maintenance').length,
    'Out of Order': rooms.filter(r => r.status === 'Out of Order').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Room Status</h1>
            <p className="text-blue-100">Monitor and manage room availability and conditions</p>
          </div>
          <BuildingOfficeIcon className="h-12 w-12 text-blue-200" />
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError('')}
                className="inline-flex text-red-400 hover:text-red-600"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setSuccess('')}
                className="inline-flex text-green-400 hover:text-green-600"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{status}</p>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
              </div>
              <div className={`p-2 rounded-lg ${getStatusColor(status).replace('text-', 'text-').replace('bg-', 'bg-').split(' ')[0]}`}>
                {getStatusIcon(status)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search rooms, guest names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Update Status Modal */}
      {showUpdateModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Update Room {selectedRoom.roomNumber}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Room Status</label>
                <select
                  defaultValue={selectedRoom.status}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="roomStatus"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Housekeeping Status</label>
                <select
                  defaultValue={selectedRoom.housekeepingStatus}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="housekeepingStatus"
                >
                  {housekeepingOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const roomStatus = document.getElementById('roomStatus').value
                  const housekeepingStatus = document.getElementById('housekeepingStatus').value
                  handleUpdateStatus(selectedRoom.id, roomStatus, housekeepingStatus)
                }}
                className="px-8 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading room status...</span>
        </div>
      )}

      {/* Room Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
          <div key={room.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BuildingOfficeIcon className="h-6 w-6 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">{room.roomNumber}</h3>
              </div>
              <button
                onClick={() => {
                  setSelectedRoom(room)
                  setShowUpdateModal(true)
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium">{room.roomType}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Floor</p>
                <p className="font-medium">Floor {room.floor}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.status)}`}>
                  {getStatusIcon(room.status)}
                  <span className="ml-1">{room.status}</span>
                </span>
              </div>

              {room.guestName && (
                <div>
                  <p className="text-sm text-gray-600">Guest</p>
                  <p className="font-medium">{room.guestName}</p>
                </div>
              )}

              {room.checkIn && room.checkOut && (
                <div>
                  <p className="text-sm text-gray-600">Stay Period</p>
                  <p className="text-sm">{room.checkIn} to {room.checkOut}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600">Housekeeping</p>
                <p className={`text-sm font-medium ${
                  room.housekeepingStatus === 'Clean' ? 'text-green-600' :
                  room.housekeepingStatus === 'Needs Cleaning' ? 'text-orange-600' :
                  room.housekeepingStatus === 'In Progress' ? 'text-blue-600' :
                  'text-red-600'
                }`}>
                  {room.housekeepingStatus}
                </p>
                <p className="text-xs text-gray-500">Last cleaned: {room.lastCleaned}</p>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {!loading && filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No rooms found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Floor Plan View */}
      {!loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Floor Plan View</h2>
        </div>
        <div className="p-6">
          {[1, 2].map(floor => (
            <div key={floor} className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Floor {floor}</h3>
              <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
                {rooms.filter(room => room.floor === floor).map(room => (
                  <div
                    key={room.id}
                    className={`p-3 rounded-lg border-2 text-center cursor-pointer hover:shadow-md transition-all ${
                      room.status === 'Available' ? 'bg-green-100 border-green-300' :
                      room.status === 'Occupied' ? 'bg-blue-100 border-blue-300' :
                      room.status === 'Reserved' ? 'bg-yellow-100 border-yellow-300' :
                      room.status === 'Dirty' ? 'bg-orange-100 border-orange-300' :
                      room.status === 'Maintenance' ? 'bg-red-100 border-red-300' :
                      'bg-gray-100 border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedRoom(room)
                      setShowUpdateModal(true)
                    }}
                  >
                    <div className="text-sm font-semibold">{room.roomNumber}</div>
                    <div className="text-xs mt-1">{room.status}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        </div>
      )}
    </div>
  )
}

export default RoomStatus;
