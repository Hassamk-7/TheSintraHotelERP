import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  HomeIcon,
  PlusIcon,
  XCircleIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const RoomBlocked = () => {
  const [blockedRooms, setBlockedRooms] = useState([])
  const [hotels, setHotels] = useState([])
  const [roomTypes, setRoomTypes] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState('')
  const [selectedRoomType, setSelectedRoomType] = useState('')
  const [editingId, setEditingId] = useState(null)
  
  const [formData, setFormData] = useState({
    hotelId: '',
    roomTypeId: '',
    roomId: '',
    blockStartDate: '',
    blockEndDate: '',
    blockReason: '',
    blockType: 'Maintenance',
    blockedBy: '',
    blockNotes: ''
  })
  
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load data on component mount
  useEffect(() => {
    fetchBlockedRooms()
    fetchHotels()
  }, [])

  // Fetch blocked rooms
  const fetchBlockedRooms = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/RoomsManagement/roomblocked')
      
      if (response.data && response.data.success) {
        setBlockedRooms(response.data.data || [])
      } else {
        console.log('Failed to fetch blocked rooms, using mock data')
        setBlockedRooms([])
      }
    } catch (error) {
      console.error('Error fetching blocked rooms:', error)
      console.log('Using mock data due to API error')
      setBlockedRooms([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch hotels
  const fetchHotels = async () => {
    try {
      const response = await axios.get('/RoomsManagement/roomblocked/hotels')
      
      if (response.data && response.data.success) {
        setHotels(response.data.data || [])
      } else {
        console.log('Failed to fetch hotels, using mock data')
        setHotels([])
      }
    } catch (error) {
      console.error('Error fetching hotels:', error)
      console.log('Using mock data due to API error')
      setHotels([])
    }
  }

  // Fetch room types when hotel changes
  const fetchRoomTypes = async (hotelId) => {
    try {
      const response = await axios.get(`/RoomsManagement/roomblocked/roomtypes/${hotelId}`)
      
      if (response.data && response.data.success) {
        setRoomTypes(response.data.data || [])
      } else {
        console.log('Failed to fetch room types, using mock data')
        setRoomTypes([])
      }
    } catch (error) {
      console.error('Error fetching room types:', error)
      console.log('Using mock data due to API error')
      setRoomTypes([])
    }
  }

  // Fetch rooms when room type changes
  const fetchRooms = async (hotelId, roomTypeId) => {
    try {
      const response = await axios.get(`/RoomsManagement/roomblocked/rooms/${hotelId}/${roomTypeId}`)
      
      if (response.data && response.data.success) {
        setRooms(response.data.data || [])
      } else {
        console.log('Failed to fetch rooms, using mock data')
        setRooms([])
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
      console.log('Using mock data due to API error')
      setRooms([])
    }
  }

  // Handle hotel selection
  const handleHotelChange = (hotelId) => {
    setSelectedHotel(hotelId)
    setFormData({...formData, hotelId})

    // Reset dependent selections
    setSelectedRoomType('')
    setRooms([])
    setFormData((prev) => ({ ...prev, hotelId, roomTypeId: '', roomId: '' }))

    // When hotelId is empty: nothing selected.
    if (!hotelId) {
      setRoomTypes([])
      return
    }

    // When hotelId === '0': ALL hotels -> load all room types.
    fetchRoomTypes(hotelId)
  }

  // Handle room type selection
  const handleRoomTypeChange = (roomTypeId) => {
    setSelectedRoomType(roomTypeId)
    setFormData({...formData, roomTypeId})

    // Reset dependent selection
    setFormData((prev) => ({ ...prev, roomTypeId, roomId: '' }))
    setRooms([])

    // If ALL hotels selected, room list cannot be reliably filtered by hotel.
    if (!selectedHotel || selectedHotel === '0' || !roomTypeId) return
    fetchRooms(selectedHotel, roomTypeId)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      
      const url = editingId ? `/RoomsManagement/roomblocked/${editingId}` : '/RoomsManagement/roomblocked'
      const method = editingId ? 'put' : 'post'
      
      const response = await axios[method](url, formData)
      
      if (response.data && response.data.success) {
        setSuccess(editingId ? 'Room block updated successfully' : 'Room blocked successfully')
        fetchBlockedRooms()
        setShowForm(false)
        resetForm()
      } else {
        setError(editingId ? 'Failed to update room block' : 'Failed to block room')
      }
    } catch (err) {
      console.error('Error with room block:', err)
      setError(err.response?.data?.message || (editingId ? 'Failed to update room block' : 'Failed to block room'))
    } finally {
      setLoading(false)
    }
  }

  // Handle edit
  const handleEdit = (blocked) => {
    setEditingId(blocked.id)
    setFormData({
      hotelId: blocked.hotelId,
      roomTypeId: blocked.roomTypeId,
      roomId: blocked.roomId,
      blockStartDate: blocked.blockStartDate?.split('T')[0] || '',
      blockEndDate: blocked.blockEndDate?.split('T')[0] || '',
      blockReason: blocked.blockReason,
      blockType: blocked.blockType,
      blockedBy: blocked.blockedBy,
      blockNotes: blocked.blockNotes || ''
    })
    setSelectedHotel(blocked.hotelId)
    setSelectedRoomType(blocked.roomTypeId)
    
    // Fetch related data
    if (blocked.hotelId) {
      fetchRoomTypes(blocked.hotelId)
    }
    if (blocked.hotelId && blocked.roomTypeId) {
      fetchRooms(blocked.hotelId, blocked.roomTypeId)
    }
    
    setShowForm(true)
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room block?')) {
      try {
        setLoading(true)
        const response = await axios.delete(`/RoomsManagement/roomblocked/${id}`)
        
        if (response.data && response.data.success) {
          setSuccess('Room block deleted successfully')
          fetchBlockedRooms()
        } else {
          setError('Failed to delete room block')
        }
      } catch (err) {
        console.error('Error deleting room block:', err)
        setError(err.response?.data?.message || 'Failed to delete room block')
      } finally {
        setLoading(false)
      }
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      hotelId: '',
      roomTypeId: '',
      roomId: '',
      blockStartDate: '',
      blockEndDate: '',
      blockReason: '',
      blockType: 'Maintenance',
      blockedBy: '',
      blockNotes: ''
    })
    setSelectedHotel('')
    setSelectedRoomType('')
    setRoomTypes([])
    setRooms([])
    setEditingId(null)
    setError('')
    setSuccess('')
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-sm text-gray-500">
            <HomeIcon className="h-4 w-4 mr-1" />
            <span>Dashboard</span>
            <span className="mx-2">/</span>
            <span>Rooms Management</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Room Blocked</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl shadow-lg mb-6">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Room Blocking Management</h1>
              <p className="text-red-100">Block rooms for maintenance, renovation, or other purposes</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Block Room</span>
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

      {/* Blocked Rooms Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading blocked rooms...</p>
          </div>
        </div>
      ) : blockedRooms.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <XCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Blocked Rooms</h3>
            <p className="text-gray-500 mb-4">No rooms are currently blocked</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Block Room
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blockedRooms.map((blocked) => (
                  <tr key={blocked.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{blocked.hotelName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{blocked.roomNumber}</div>
                      <div className="text-sm text-gray-500">{blocked.roomTypeName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(blocked.blockStartDate).toLocaleDateString()} - {new Date(blocked.blockEndDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{blocked.blockReason}</div>
                      <div className="text-sm text-gray-500">{blocked.blockType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        blocked.isCurrentlyBlocked 
                          ? 'bg-red-100 text-red-800' 
                          : blocked.isFutureBlock
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {blocked.isCurrentlyBlocked ? 'Currently Blocked' : blocked.isFutureBlock ? 'Future Block' : 'Past Block'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(blocked)}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded-md transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blocked.id)}
                          className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Block Room Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingId ? 'Edit Room Block' : 'Block Room'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hotel *</label>
                    <select
                      value={selectedHotel}
                      onChange={(e) => handleHotelChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    >
                      <option value="">Select Hotel</option>
                      <option value="0">ALL</option>
                      {hotels.map(hotel => (
                        <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Type *</label>
                    <select
                      value={selectedRoomType}
                      onChange={(e) => handleRoomTypeChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                      disabled={!selectedHotel}
                    >
                      <option value="">Select Room Type</option>
                      {roomTypes.map(roomType => (
                        <option key={roomType.id} value={roomType.id}>{roomType.name} ({roomType.totalRooms} rooms)</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room *</label>
                  <select
                    value={formData.roomId}
                    onChange={(e) => setFormData({...formData, roomId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                    disabled={!selectedRoomType || selectedHotel === '0'}
                  >
                    <option value="">Select Room</option>
                    {rooms.map(room => (
                      <option key={room.id} value={room.id}>
                        Room {room.roomNumber} {room.isCurrentlyBlocked ? '(Currently Blocked)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                    <input
                      type="date"
                      value={formData.blockStartDate}
                      onChange={(e) => setFormData({...formData, blockStartDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                    <input
                      type="date"
                      value={formData.blockEndDate}
                      onChange={(e) => setFormData({...formData, blockEndDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Block Type *</label>
                    <select
                      value={formData.blockType}
                      onChange={(e) => setFormData({...formData, blockType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    >
                      <option value="Maintenance">Maintenance</option>
                      <option value="Renovation">Renovation</option>
                      <option value="OutOfOrder">Out of Order</option>
                      <option value="Reserved">Reserved</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blocked By *</label>
                    <input
                      type="text"
                      value={formData.blockedBy}
                      onChange={(e) => setFormData({...formData, blockedBy: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Block Reason *</label>
                  <input
                    type="text"
                    value={formData.blockReason}
                    onChange={(e) => setFormData({...formData, blockReason: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., AC Maintenance, Bathroom Renovation"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.blockNotes}
                    onChange={(e) => setFormData({...formData, blockNotes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    rows="3"
                    placeholder="Additional notes about the block"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      resetForm()
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    {loading 
                      ? (editingId ? 'Updating...' : 'Blocking...') 
                      : (editingId ? 'Update Block' : 'Block Room')
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomBlocked
