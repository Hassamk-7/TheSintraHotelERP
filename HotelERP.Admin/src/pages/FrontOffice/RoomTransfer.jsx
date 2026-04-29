import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const RoomTransfer = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [transfers, setTransfers] = useState([])
  const [currentGuests, setCurrentGuests] = useState([])
  const [availableRooms, setAvailableRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    guestName: '',
    currentRoom: '',
    newRoom: '',
    transferDate: new Date().toISOString().split('T')[0],
    transferTime: new Date().toTimeString().slice(0, 5),
    reason: 'Guest Request',
    notes: '',
    chargeAdjustment: 0,
    approvedBy: ''
  })

  const [errors, setErrors] = useState({})
  
  // Searchable dropdown states
  const [guestSearch, setGuestSearch] = useState('')
  const [roomSearch, setRoomSearch] = useState('')
  const [showGuestDropdown, setShowGuestDropdown] = useState(false)
  const [showRoomDropdown, setShowRoomDropdown] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState(null)

  // Load data on component mount
  useEffect(() => {
    fetchTransfers()
    fetchCurrentGuests()
    fetchAvailableRooms()
  }, [])

  // Fetch room transfers
  const fetchTransfers = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('🚀 Fetching room transfers...')
      
      const response = await axios.get('/roomtransfers')
      console.log('✅ Room transfers response:', response.data)
      
      if (response.data && response.data.success) {
        setTransfers(response.data.data || [])
        console.log(`✅ Loaded ${response.data.data?.length || 0} room transfers`)
      } else {
        setError('Failed to load room transfers')
      }
    } catch (err) {
      console.error('❌ Error fetching room transfers:', err)
      setTransfers([])
      setError('Unable to load room transfers. Please check API connection.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch guest records (same as CheckIn form)
  const fetchCurrentGuests = async () => {
    try {
      console.log('🚀 Fetching guest records...')
      
      const response = await axios.get('/guests')
      console.log('✅ Guest records response:', response.data)
      
      if (response.data && response.data.success) {
        setCurrentGuests(response.data.data || [])
        console.log(`✅ Loaded ${response.data.data?.length || 0} guest records`)
      }
    } catch (err) {
      console.error('❌ Error fetching guest records:', err)
      setCurrentGuests([])
      console.log('Unable to load guest records from API')
    }
  }

  // Fetch available rooms
  const fetchAvailableRooms = async () => {
    try {
      console.log('🚀 Fetching available rooms...')
      
      const response = await axios.get('/rooms?status=Available')
      console.log('✅ Available rooms response:', response.data)
      
      if (response.data && response.data.success) {
        setAvailableRooms(response.data.data || [])
        console.log(`✅ Loaded ${response.data.data?.length || 0} available rooms`)
      }
    } catch (err) {
      console.error('❌ Error fetching available rooms:', err)
      setAvailableRooms([])
      console.log('Unable to load available rooms from API')
    }
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Filter guests based on search (same as CheckIn form)
  const filteredGuests = currentGuests.filter(guest => {
    const searchLower = guestSearch.toLowerCase()
    return (
      guest.fullName?.toLowerCase().includes(searchLower) ||
      guest.firstName?.toLowerCase().includes(searchLower) ||
      guest.lastName?.toLowerCase().includes(searchLower) ||
      guest.phone?.toLowerCase().includes(searchLower) ||
      guest.email?.toLowerCase().includes(searchLower) ||
      guest.guestId?.toLowerCase().includes(searchLower)
    )
  })

  // Filter rooms based on search
  const filteredRooms = availableRooms.filter(room => {
    const searchLower = roomSearch.toLowerCase()
    return (
      room.roomNumber?.toLowerCase().includes(searchLower) ||
      room.roomType?.name?.toLowerCase().includes(searchLower) ||
      room.roomTypeName?.toLowerCase().includes(searchLower)
    )
  })

  // Handle guest selection (same as CheckIn form)
  const handleGuestSelect = (guest) => {
    setSelectedGuest(guest)
    setGuestSearch(guest.fullName)
    setFormData(prev => ({
      ...prev,
      guestName: guest.fullName,
      currentRoom: '' // Will need to be filled manually or from current check-in data
    }))
    setShowGuestDropdown(false)
    
    // Clear error when guest is selected
    if (errors.guestName) {
      setErrors(prev => ({ ...prev, guestName: '' }))
    }
  }

  // Handle room selection
  const handleRoomSelect = (room) => {
    setRoomSearch(`${room.roomNumber} - ${room.roomType?.name || room.roomTypeName || 'Standard'}`)
    setFormData(prev => ({
      ...prev,
      newRoom: room.roomNumber
    }))
    setShowRoomDropdown(false)
    
    // Clear error when room is selected
    if (errors.newRoom) {
      setErrors(prev => ({ ...prev, newRoom: '' }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.guestName.trim()) newErrors.guestName = 'Guest name is required'
    if (!formData.currentRoom) newErrors.currentRoom = 'Current room is required'
    if (!formData.newRoom) newErrors.newRoom = 'New room is required'
    if (formData.currentRoom === formData.newRoom) newErrors.newRoom = 'New room must be different from current room'
    if (!formData.transferDate) newErrors.transferDate = 'Transfer date is required'
    if (!formData.transferTime) newErrors.transferTime = 'Transfer time is required'
    if (!formData.reason) newErrors.reason = 'Reason is required'
    if (!formData.approvedBy.trim()) newErrors.approvedBy = 'Approved by is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const transferData = {
        guestName: formData.guestName,
        fromRoomNumber: formData.currentRoom,
        toRoomNumber: formData.newRoom,
        transferDate: formData.transferDate + 'T' + formData.transferTime + ':00.000Z',
        reason: formData.reason,
        notes: formData.notes,
        chargeAdjustment: parseFloat(formData.chargeAdjustment) || 0,
        approvedBy: formData.approvedBy,
        status: 'Pending'
      }

      console.log('🚀 Submitting room transfer data:', transferData)
      
      const response = await axios.post('/roomtransfers', transferData)
      console.log('✅ Room transfer response:', response.data)
      
      if (response.data && response.data.success) {
        setSuccess(`Room transfer request for ${formData.guestName} submitted successfully!`)
        resetForm()
        fetchTransfers()
      } else {
        setError('Failed to submit room transfer request')
      }
    } catch (err) {
      console.error('❌ Error submitting room transfer:', err)
      setError(err.response?.data?.message || 'Failed to submit room transfer request')
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      guestName: '',
      currentRoom: '',
      newRoom: '',
      transferDate: new Date().toISOString().split('T')[0],
      transferTime: new Date().toTimeString().slice(0, 5),
      reason: 'Guest Request',
      notes: '',
      chargeAdjustment: 0,
      approvedBy: ''
    })
    setErrors({})
    setGuestSearch('')
    setRoomSearch('')
    setSelectedGuest(null)
    setShowGuestDropdown(false)
    setShowRoomDropdown(false)
    setShowForm(false)
  }

  // Filter transfers
  const filteredTransfers = transfers.filter(transfer =>
    transfer.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transfer.fromRoomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transfer.toRoomNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Room Transfer</h1>
            <p className="text-purple-100">Manage guest room changes and transfers</p>
          </div>
          <ArrowRightIcon className="h-12 w-12 text-purple-200" />
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <ArrowRightIcon className="h-5 w-5" />
          <span>New Room Transfer</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search transfers by guest name or room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-gray-600">Loading transfers...</span>
        </div>
      )}

      {/* Room Transfers List */}
      {!loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Room Transfers ({filteredTransfers.length})
            </h3>
          </div>
          
          {filteredTransfers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <ArrowRightIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No room transfers found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTransfers.map((transfer) => (
                <div key={transfer.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <ArrowRightIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{transfer.guestName}</h4>
                        <p className="text-sm text-gray-500">
                          Room {transfer.fromRoomNumber} → Room {transfer.toRoomNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          Reason: {transfer.reason}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transfer.status === 'Completed' 
                          ? 'bg-green-100 text-green-800'
                          : transfer.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transfer.status === 'Completed' && <CheckCircleIcon className="h-3 w-3 mr-1" />}
                        {transfer.status === 'Pending' && <ClockIcon className="h-3 w-3 mr-1" />}
                        {transfer.status === 'Cancelled' && <XCircleIcon className="h-3 w-3 mr-1" />}
                        {transfer.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Room Transfer Form Modal with Searchable Dropdowns */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">New Room Transfer</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Guest Information with Searchable Dropdown */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Guest Information</h3>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guest Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search guest by name, phone, email, or ID..."
                        value={guestSearch}
                        onChange={(e) => {
                          setGuestSearch(e.target.value)
                          setShowGuestDropdown(true)
                        }}
                        onFocus={() => setShowGuestDropdown(true)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10 ${
                          errors.guestName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    
                    {/* Guest Dropdown */}
                    {showGuestDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredGuests.length > 0 ? (
                          <>
                            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                              {filteredGuests.length} guest(s) found
                            </div>
                            {filteredGuests.map(guest => (
                              <div
                                key={guest.id}
                                onClick={() => handleGuestSelect(guest)}
                                className="px-4 py-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              >
                                <div className="font-medium text-gray-900">
                                  {guest.fullName}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {guest.phone || 'No phone'} • {guest.email || 'No email'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Guest ID: {guest.guestId}
                                </div>
                              </div>
                            ))}
                          </>
                        ) : guestSearch ? (
                          <div className="px-4 py-3 text-gray-500 text-center">
                            No guests found matching "{guestSearch}"
                          </div>
                        ) : (
                          <div className="px-4 py-3 text-gray-500 text-center">
                            Type to search guests...
                          </div>
                        )}
                      </div>
                    )}
                    {errors.guestName && <p className="text-red-500 text-xs mt-1">{errors.guestName}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Room *
                      </label>
                      <input
                        type="text"
                        name="currentRoom"
                        value={formData.currentRoom}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          errors.currentRoom ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Current room number"
                      />
                      {errors.currentRoom && <p className="text-red-500 text-xs mt-1">{errors.currentRoom}</p>}
                    </div>
                    
                    {/* New Room with Searchable Dropdown */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Room *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search available rooms..."
                          value={roomSearch}
                          onChange={(e) => {
                            setRoomSearch(e.target.value)
                            setShowRoomDropdown(true)
                          }}
                          onFocus={() => setShowRoomDropdown(true)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10 ${
                            errors.newRoom ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                      
                      {/* Room Dropdown */}
                      {showRoomDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredRooms.length > 0 ? (
                            <>
                              <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                                {filteredRooms.length} room(s) available
                              </div>
                              {filteredRooms.map(room => (
                                <div
                                  key={room.id}
                                  onClick={() => handleRoomSelect(room)}
                                  className="px-4 py-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                >
                                  <div className="font-medium text-gray-900">
                                    Room {room.roomNumber}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {room.roomType?.name || room.roomTypeName || 'Standard'} • Floor {room.floor || 'N/A'}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Rate: Rs {room.baseRate?.toLocaleString() || 'N/A'} per night
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : roomSearch ? (
                            <div className="px-4 py-3 text-gray-500 text-center">
                              No rooms found matching "{roomSearch}"
                            </div>
                          ) : (
                            <div className="px-4 py-3 text-gray-500 text-center">
                              Type to search available rooms...
                            </div>
                          )}
                        </div>
                      )}
                      {errors.newRoom && <p className="text-red-500 text-xs mt-1">{errors.newRoom}</p>}
                    </div>
                  </div>
                </div>

                {/* Transfer Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Transfer Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Transfer *
                    </label>
                    <select
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.reason ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="Guest Request">Guest Request</option>
                      <option value="Room Maintenance">Room Maintenance</option>
                      <option value="Upgrade">Upgrade</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Approved By *
                    </label>
                    <input
                      type="text"
                      name="approvedBy"
                      value={formData.approvedBy}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.approvedBy ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Manager name"
                    />
                    {errors.approvedBy && <p className="text-red-500 text-xs mt-1">{errors.approvedBy}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter any additional notes or special instructions"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Submit Transfer Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomTransfer