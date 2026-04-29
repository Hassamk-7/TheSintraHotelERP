import { useState, useEffect } from 'react'
import axios from '../../utils/axios'
import { apiConfig } from '../../config/api'
import {
  CalendarDaysIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  HomeIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'

const API_BASE_URL = apiConfig.baseURL

const CleaningSchedule = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  
  // Dynamic data states
  const [schedules, setSchedules] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Room search states
  const [roomSearchTerm, setRoomSearchTerm] = useState('')
  const [showRoomDropdown, setShowRoomDropdown] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)

  const [formData, setFormData] = useState({
    roomId: '',
    cleaningType: '',
    assignedHousekeeper: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '',
    estimatedDuration: 30,
    status: 'Scheduled',
    specialInstructions: '',
    completionNotes: '',
    startTime: null,
    completionTime: null,
    actualDuration: 0
  })

  // Load data on component mount
  useEffect(() => {
    fetchSchedules()
    fetchRooms()
  }, [])

  // Fetch cleaning schedules - PURE API CALL
  const fetchSchedules = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/housekeeping/cleaning-schedule?pageSize=100`)
      if (response.data.success && Array.isArray(response.data.data)) {
        setSchedules(response.data.data)
        console.log('Schedules loaded:', response.data.data)
      } else {
        console.error('Invalid schedules response:', response.data)
        setSchedules([])
      }
    } catch (err) {
      console.error('Error fetching cleaning schedules:', err)
      setError(`Failed to load cleaning schedules: ${err.response?.data?.message || err.message}`)
      setSchedules([])
      console.log('API Error Details:', err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch rooms for dropdown
  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/housekeeping/rooms-dropdown`)
      if (response.data.success) {
        setRooms(response.data.data)
        console.log('Rooms loaded:', response.data.data) // Debug log
      } else {
        console.error('Rooms API returned error:', response.data.message)
        setError('Failed to load rooms data')
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
      setError(`Failed to load rooms data: ${error.response?.data?.message || error.message}`)
      setRooms([])
      console.log('Rooms API Error Details:', error.response?.data || error.message)
    }
  }

  // Add new cleaning schedule - PURE API CALL
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.roomId || !formData.assignedHousekeeper || !formData.cleaningType) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      
      const now = new Date()
      const scheduleData = {
        roomId: parseInt(formData.roomId),
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate).toISOString() : now.toISOString(),
        scheduledTime: formData.scheduledTime ? new Date(`1970-01-01T${formData.scheduledTime}`).toISOString() : now.toISOString(),
        cleaningType: formData.cleaningType,
        assignedHousekeeper: formData.assignedHousekeeper,
        status: formData.status || 'Scheduled',
        estimatedDuration: parseInt(formData.estimatedDuration) || 30,
        specialInstructions: formData.specialInstructions || '',
        completionNotes: formData.completionNotes || '',
        actualDuration: parseInt(formData.actualDuration) || 0
      }

      console.log('Submitting schedule data:', scheduleData)

      const response = await axios.post(`${API_BASE_URL}/housekeeping/cleaning-schedule`, scheduleData)
      
      if (response.data.success) {
        setSuccess('Cleaning schedule created successfully!')
        setShowForm(false)
        resetForm()
        fetchSchedules() // Refresh the list
      } else {
        setError(response.data.message || 'Failed to create cleaning schedule')
      }
    } catch (error) {
      console.error('Error creating cleaning schedule:', error)
      setError(error.response?.data?.message || 'Failed to create cleaning schedule. Please check if API server is running.')
      
      // Fallback: Add to local state if API fails
      if (!error.response) {
        const newSchedule = {
          id: Date.now(),
          scheduleNumber: `CS${String(schedules.length + 1).padStart(3, '0')}`,
          roomId: parseInt(formData.roomId),
          room: rooms.find(r => r.id === parseInt(formData.roomId)),
          scheduledDate: formData.scheduledDate || new Date().toISOString(),
          scheduledTime: formData.scheduledTime || new Date().toISOString(),
          cleaningType: formData.cleaningType,
          assignedHousekeeper: formData.assignedHousekeeper,
          status: formData.status || 'Scheduled',
          estimatedDuration: parseInt(formData.estimatedDuration) || 30,
          specialInstructions: formData.specialInstructions || '',
          completionNotes: formData.completionNotes || '',
          actualDuration: parseInt(formData.actualDuration) || 0,
          createdAt: new Date().toISOString()
        }
        
        setSchedules(prev => [newSchedule, ...prev])
        setSuccess('Cleaning schedule created successfully! (Offline mode)')
        setShowForm(false)
        resetForm()
      }
    } finally {
      setLoading(false)
    }
  }

  // Delete cleaning schedule - PURE API CALL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cleaning schedule?')) return

    try {
      setLoading(true)
      const response = await axios.delete(`/housekeeping/cleaning-schedule/${id}`)
      
      if (response.data && response.data.success) {
        setSuccess('Cleaning schedule deleted successfully')
        fetchCleaningSchedules()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to delete cleaning schedule')
      }
    } catch (err) {
      console.error('Error deleting cleaning schedule:', err)
      setError(err.response?.data?.message || 'Failed to delete cleaning schedule')
    } finally {
      setLoading(false)
    }
  }

  // Edit cleaning schedule
  const handleEdit = (schedule) => {
    const room = rooms.find(r => r.id === schedule.roomId)
    setSelectedRoom(room)
    setRoomSearchTerm(room ? `${room.roomNumber} - ${room.roomType?.name || ''}` : '')
    
    setFormData({
      roomId: schedule.roomId,
      cleaningType: schedule.cleaningType,
      assignedHousekeeper: schedule.assignedHousekeeper,
      scheduledDate: schedule.scheduledDate ? schedule.scheduledDate.split('T')[0] : '',
      scheduledTime: schedule.scheduledTime ? new Date(schedule.scheduledTime).toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit'}) : '',
      estimatedDuration: schedule.estimatedDuration || 30,
      status: schedule.status,
      specialInstructions: schedule.specialInstructions || '',
      completionNotes: schedule.completionNotes || '',
      startTime: schedule.startTime,
      completionTime: schedule.completionTime,
      actualDuration: schedule.actualDuration || 0
    })
    setEditingId(schedule.id)
    setShowForm(true)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      roomId: '',
      cleaningType: '',
      assignedHousekeeper: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '',
      estimatedDuration: 30,
      status: 'Scheduled',
      specialInstructions: '',
      completionNotes: '',
      startTime: null,
      completionTime: null,
      actualDuration: 0
    })
    setEditingId(null)
    setShowForm(false)
    setSelectedRoom(null)
    setRoomSearchTerm('')
    setShowRoomDropdown(false)
  }

  // Room selection handlers
  const handleRoomSelect = (room) => {
    setSelectedRoom(room)
    setFormData({ ...formData, roomId: room.id })
    setRoomSearchTerm(`${room.roomNumber} - ${room.roomType?.name || ''}`)
    setShowRoomDropdown(false)
  }

  const handleRoomSearchChange = (value) => {
    setRoomSearchTerm(value)
    setShowRoomDropdown(true)
    if (!value) {
      setSelectedRoom(null)
      setFormData({ ...formData, roomId: '' })
    }
  }

  // Filter rooms based on search
  const filteredRooms = rooms.filter(room => {
    const roomNumber = room.roomNumber || ''
    const roomTypeName = room.roomType?.name || ''
    const searchTerm = roomSearchTerm.toLowerCase()
    
    return roomNumber.toLowerCase().includes(searchTerm) ||
           roomTypeName.toLowerCase().includes(searchTerm)
  })

  // Filter schedules
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.room?.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.cleaningType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.assignedHousekeeper?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.scheduleNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === '' || schedule.status === statusFilter
    const matchesDate = dateFilter === '' || schedule.scheduledDate?.split('T')[0] === dateFilter
    return matchesSearch && matchesStatus && matchesDate
  })

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800'
      case 'In Progress': return 'bg-yellow-100 text-yellow-800'
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      case 'Delayed': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Calculate statistics
  const totalSchedules = schedules.length
  const scheduledTasks = schedules.filter(s => s.status === 'Scheduled').length
  const inProgressTasks = schedules.filter(s => s.status === 'In Progress').length
  const completedTasks = schedules.filter(s => s.status === 'Completed').length

  // Clear messages after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.room-dropdown-container')) {
        setShowRoomDropdown(false)
      }
    }
    
    if (showRoomDropdown) {
      document.addEventListener('click', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showRoomDropdown])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Cleaning Schedule</h1>
            <p className="text-blue-100">Manage room cleaning schedules and assignments</p>
          </div>
          <div className="flex items-center space-x-4">
            <CalendarDaysIcon className="h-12 w-12 text-blue-200" />
            <button
              onClick={() => setShowForm(true)}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center space-x-2 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>New Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-green-700">{success}</span>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Schedules</p>
              <p className="text-2xl font-bold text-gray-900">{totalSchedules}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{scheduledTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <UserIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search schedules..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Cleaning Schedule Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Cleaning Schedules ({filteredSchedules.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading cleaning schedules...</p>
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <CalendarDaysIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No cleaning schedules found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cleaning Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{schedule.scheduleNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <HomeIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{schedule.room?.roomNumber}</div>
                          <div className="text-sm text-gray-500">{schedule.room?.roomType?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {schedule.cleaningType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-100 p-2 rounded-full mr-3">
                          <UserIcon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="text-sm text-gray-900">{schedule.assignedHousekeeper}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {schedule.scheduledDate ? new Date(schedule.scheduledDate).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {schedule.scheduledTime ? new Date(schedule.scheduledTime).toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit'}) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {schedule.estimatedDuration || 0} min
                      {schedule.actualDuration && schedule.actualDuration > 0 && (
                        <div className="text-xs text-gray-500">Actual: {schedule.actualDuration} min</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(schedule.status)}`}>
                        {schedule.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(schedule)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit Schedule"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Schedule"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingId ? 'Edit Cleaning Schedule' : 'New Cleaning Schedule'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
                    <div className="relative room-dropdown-container">
                      <input
                        type="text"
                        value={roomSearchTerm}
                        onChange={(e) => handleRoomSearchChange(e.target.value)}
                        onFocus={() => setShowRoomDropdown(true)}
                        placeholder="Search and select room..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      {showRoomDropdown && (
                        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1">
                          {filteredRooms.length > 0 ? (
                            filteredRooms.slice(0, 10).map((room) => (
                              <div
                                key={room.id}
                                onClick={() => handleRoomSelect(room)}
                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              >
                                <div className="font-medium text-gray-900">Room {room.roomNumber || 'N/A'}</div>
                                <div className="text-sm text-gray-600">
                                  {room.roomType?.name || 'Standard Room'} • Floor {room.floorNumber || '1'} • Capacity: {(Number(room.maxAdults) || 0) + (Number(room.maxChildren) || 0)} guests
                                </div>
                                <div className="text-xs text-gray-500">
                                  Status: {room.status || 'Available'} • Rate: Rs. {Number(room.basePrice || 0).toLocaleString()}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-500 text-center">
                              {rooms.length === 0 ? 'Loading rooms...' : 'No rooms found'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cleaning Type *</label>
                    <select
                      value={formData.cleaningType}
                      onChange={(e) => setFormData({...formData, cleaningType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Daily Cleaning">Daily Cleaning</option>
                      <option value="Deep Cleaning">Deep Cleaning</option>
                      <option value="Checkout Cleaning">Checkout Cleaning</option>
                      <option value="Maintenance Cleaning">Maintenance Cleaning</option>
                      <option value="Inspection">Inspection</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Housekeeper *</label>
                  <input
                    type="text"
                    value={formData.assignedHousekeeper}
                    onChange={(e) => setFormData({...formData, assignedHousekeeper: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Staff member name"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date *</label>
                    <input
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Time *</label>
                    <input
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes) *</label>
                    <input
                      type="number"
                      value={formData.estimatedDuration}
                      onChange={(e) => setFormData({...formData, estimatedDuration: parseInt(e.target.value) || 30})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="30"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                  <textarea
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Any special instructions or notes for the cleaning staff..."
                  />
                </div>
                {(formData.status === 'Completed' || editingId) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Completion Notes</label>
                    <textarea
                      value={formData.completionNotes}
                      onChange={(e) => setFormData({...formData, completionNotes: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="2"
                      placeholder="Notes about completion, issues found, etc..."
                    />
                  </div>
                )}
                <div className="flex justify-end space-x-3 pt-4">
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingId ? 'Update Schedule' : 'Create Schedule')}
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

export default CleaningSchedule;
