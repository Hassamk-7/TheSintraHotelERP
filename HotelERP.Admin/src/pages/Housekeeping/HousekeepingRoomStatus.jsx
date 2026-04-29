import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  HomeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const HousekeepingRoomStatus = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    roomId: '',
    status: 'Clean',
    housekeepingStatus: 'Available',
    updatedBy: '',
    maintenanceScheduled: '',
    cleaningScheduled: '',
    remarks: '',
    isActive: true
  })

  const [roomStatuses, setRoomStatuses] = useState([])
  const [rooms, setRooms] = useState([])
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  
  // Fetch room statuses from API
  const fetchRoomStatuses = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/housekeeping/room-status-master')
      if (response.data && response.data.success) {
        setRoomStatuses(response.data.data)
      } else {
        setError('Failed to load room statuses')
      }
    } catch (err) {
      console.error('Error fetching room statuses:', err)
      setError('Failed to load room statuses')
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch rooms for dropdown
  const fetchRooms = async (search = '') => {
    try {
      const response = await axios.get(`/housekeeping/rooms-dropdown?search=${search}`)
      if (response.data && response.data.success) {
        setRooms(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching rooms:', err)
    }
  }
  
  // Load data on component mount
  useEffect(() => {
    fetchRoomStatuses()
    fetchRooms()
  }, [])
  
  // Clear messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('')
        setError('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.roomId) newErrors.roomId = 'Room selection is required'
    if (!formData.updatedBy.trim()) newErrors.updatedBy = 'Updated by field is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      const response = editingId 
        ? await axios.put(`/housekeeping/room-status-master/${editingId}`, formData)
        : await axios.post('/housekeeping/room-status-master', formData)
      
      if (response.data && response.data.success) {
        setSuccess(editingId ? 'Room status updated successfully!' : 'Room status created successfully!')
        fetchRoomStatuses() // Refresh data
        handleCancel()
      } else {
        setError(response.data?.message || 'Failed to save room status')
      }
    } catch (err) {
      console.error('Error saving room status:', err)
      setError(err.response?.data?.message || 'Failed to save room status')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (roomStatus) => {
    setFormData({
      roomId: roomStatus.roomId,
      status: roomStatus.status,
      housekeepingStatus: roomStatus.housekeepingStatus,
      updatedBy: roomStatus.updatedBy,
      remarks: roomStatus.remarks,
      maintenanceScheduled: roomStatus.maintenanceScheduled ? roomStatus.maintenanceScheduled.split('T')[0] + 'T' + roomStatus.maintenanceScheduled.split('T')[1]?.substring(0, 5) : '',
      cleaningScheduled: roomStatus.cleaningScheduled ? roomStatus.cleaningScheduled.split('T')[0] + 'T' + roomStatus.cleaningScheduled.split('T')[1]?.substring(0, 5) : '',
      isActive: roomStatus.isActive
    })
    setEditingId(roomStatus.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room status?')) {
      try {
        setLoading(true)
        const response = await axios.delete(`/housekeeping/room-status-master/${id}`)
        
        if (response.data && response.data.success) {
          setSuccess('Room status deleted successfully!')
          fetchRoomStatuses() // Refresh data
        } else {
          setError('Failed to delete room status')
        }
      } catch (err) {
        console.error('Error deleting room status:', err)
        setError(err.response?.data?.message || 'Failed to delete room status')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      roomId: '',
      status: 'Clean',
      housekeepingStatus: 'Available',
      updatedBy: '',
      remarks: '',
      maintenanceScheduled: '',
      cleaningScheduled: '',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const resetForm = () => {
    setFormData({
      roomId: '',
      status: 'Clean',
      housekeepingStatus: 'Available',
      updatedBy: '',
      maintenanceScheduled: '',
      cleaningScheduled: '',
      remarks: '',
      isActive: true
    })
    setErrors({})
  }

  const filteredRooms = roomStatuses.filter(room =>
    room.room?.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.updatedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.status?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Clean': return 'bg-green-100 text-green-800'
      case 'Dirty': return 'bg-red-100 text-red-800'
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'Inspected': return 'bg-blue-100 text-blue-800'
      case 'Out of Order': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'Not set'
    return new Date(dateTime).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Room Status</h1>
            <p className="text-emerald-100">Track and manage housekeeping room status</p>
          </div>
          <HomeIcon className="h-12 w-12 text-emerald-200" />
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clean</p>
              <p className="text-2xl font-bold text-gray-900">
                {roomStatuses.filter(room => room.status === 'Clean').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <HomeIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dirty</p>
              <p className="text-2xl font-bold text-gray-900">
                {roomStatuses.filter(room => room.status === 'Dirty').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-gray-900">
                {roomStatuses.filter(room => room.status === 'Maintenance').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inspected</p>
              <p className="text-2xl font-bold text-gray-900">
                {roomStatuses.filter(room => room.status === 'Inspected').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-gray-100 rounded-lg p-3">
              <HomeIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Out of Order</p>
              <p className="text-2xl font-bold text-gray-900">
                {roomStatuses.filter(room => room.status === 'Out of Order').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Room Status
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Room Status' : 'Add New Room Status'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Room <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.roomId}
                  onChange={(e) => setFormData({...formData, roomId: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                    errors.roomId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.label} - {room.status}
                    </option>
                  ))}
                </select>
                {errors.roomId && (
                  <p className="mt-1 text-sm text-red-600">{errors.roomId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                >
                  <option value="Clean">Clean</option>
                  <option value="Dirty">Dirty</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inspected">Inspected</option>
                  <option value="Out of Order">Out of Order</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Housekeeping Status</label>
                <select
                  value={formData.housekeepingStatus}
                  onChange={(e) => setFormData({...formData, housekeepingStatus: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="OutOfOrder">Out of Order</option>
                  <option value="InMaintenance">In Maintenance</option>
                  <option value="Cleaning">Cleaning</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Updated By <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.updatedBy}
                  onChange={(e) => setFormData({...formData, updatedBy: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                    errors.updatedBy ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ayesha Khan"
                />
                {errors.updatedBy && (
                  <p className="mt-1 text-sm text-red-600">{errors.updatedBy}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Maintenance Scheduled</label>
                <input
                  type="datetime-local"
                  value={formData.maintenanceScheduled}
                  onChange={(e) => setFormData({...formData, maintenanceScheduled: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cleaning Scheduled</label>
                <input
                  type="datetime-local"
                  value={formData.cleaningScheduled}
                  onChange={(e) => setFormData({...formData, cleaningScheduled: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks</label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  placeholder="Additional notes about room status"
                />
              </div>

              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Active Status
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition-all duration-200 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    {editingId ? 'Update' : 'Save'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Room Status List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Room Status ({filteredRooms.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRooms.map((roomStatus) => (
                <tr key={roomStatus.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      Room {roomStatus.room?.roomNumber || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Floor {roomStatus.room?.floorNumber || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(roomStatus.status)}`}>
                        {roomStatus.status}
                      </span>
                      <div className="text-xs text-gray-500">
                        Housekeeping: {roomStatus.housekeepingStatus}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{roomStatus.updatedBy}</div>
                    <div className="text-xs text-gray-500">
                      {formatDateTime(roomStatus.statusDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500">
                      {roomStatus.maintenanceScheduled ? (
                        <div>Maintenance: {formatDateTime(roomStatus.maintenanceScheduled)}</div>
                      ) : (
                        <div>No maintenance scheduled</div>
                      )}
                      {roomStatus.cleaningScheduled ? (
                        <div>Cleaning: {formatDateTime(roomStatus.cleaningScheduled)}</div>
                      ) : (
                        <div>No cleaning scheduled</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {roomStatus.remarks || 'No remarks'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(roomStatus)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(roomStatus.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
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
      </div>
    </div>
  )
}

export default HousekeepingRoomStatus;
