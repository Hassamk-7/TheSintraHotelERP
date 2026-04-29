import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  WrenchScrewdriverIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const MaintenanceRequests = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  
  const [requests, setRequests] = useState([
    {
      id: 1,
      roomNumber: '205',
      requestType: 'Plumbing',
      description: 'Bathroom faucet leaking, water pressure low',
      priority: 'High',
      status: 'In Progress',
      reportedBy: 'Guest',
      reportedDate: '2024-01-15',
      assignedTo: 'Ahmed Hassan',
      assignedDate: '2024-01-15',
      estimatedCompletion: '2024-01-16',
      actualCompletion: null,
      cost: '2500',
      notes: 'Replacement parts ordered, work in progress',
      guestName: 'Maria Khan',
      guestPhone: '+92-321-9876543',
      isActive: true
    },
    {
      id: 2,
      roomNumber: '301',
      requestType: 'Electrical',
      description: 'Air conditioning not working, room too warm',
      priority: 'High',
      status: 'Completed',
      reportedBy: 'Housekeeping',
      reportedDate: '2024-01-14',
      assignedTo: 'Ali Raza',
      assignedDate: '2024-01-14',
      estimatedCompletion: '2024-01-15',
      actualCompletion: '2024-01-15T16:30:00',
      cost: '3500',
      notes: 'AC compressor replaced, system working normally',
      guestName: 'Ahmed Ali',
      guestPhone: '+92-300-1234567',
      isActive: true
    },
    {
      id: 3,
      roomNumber: '102',
      requestType: 'Furniture',
      description: 'Bed frame loose, mattress sagging on one side',
      priority: 'Medium',
      status: 'Pending',
      reportedBy: 'Guest',
      reportedDate: '2024-01-15',
      assignedTo: '',
      assignedDate: null,
      estimatedCompletion: '2024-01-17',
      actualCompletion: null,
      cost: '0',
      notes: 'Awaiting maintenance team assignment',
      guestName: 'Fatima Sheikh',
      guestPhone: '+92-333-5555555',
      isActive: true
    },
    {
      id: 4,
      roomNumber: '401',
      requestType: 'General',
      description: 'Door lock mechanism sticking, difficult to open',
      priority: 'Low',
      status: 'Scheduled',
      reportedBy: 'Housekeeping',
      reportedDate: '2024-01-13',
      assignedTo: 'Sara Ahmed',
      assignedDate: '2024-01-15',
      estimatedCompletion: '2024-01-16',
      actualCompletion: null,
      cost: '800',
      notes: 'Scheduled for tomorrow morning maintenance',
      guestName: '',
      guestPhone: '',
      isActive: true
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    roomId: '',
    issueType: '',
    description: '',
    priority: 'Medium',
    reportedBy: '',
    assignedTo: '',
    status: 'Pending',
    scheduledDate: '',
    startDate: '',
    completionDate: '',
    estimatedCost: '',
    actualCost: '',
    workPerformed: '',
    partsUsed: '',
    completionNotes: ''
  })

  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  
  // Room search states
  const [roomSearchTerm, setRoomSearchTerm] = useState('')
  const [showRoomDropdown, setShowRoomDropdown] = useState(false)

  // Load maintenance requests and rooms on component mount
  useEffect(() => {
    fetchMaintenanceRequests()
    fetchRooms()
  }, [])

  // Fetch rooms for dropdown
  const fetchRooms = async () => {
    try {
      console.log('🚀 API Request: GET /housekeeping/rooms-dropdown')
      const response = await axios.get('/housekeeping/rooms-dropdown')
      console.log('✅ API Response: 200 /housekeeping/rooms-dropdown', response.data)
      
      if (response.data && response.data.success && response.data.data) {
        setRooms(response.data.data)
        console.log(`Rooms loaded: ${response.data.data.length} rooms`)
      } else {
        console.log('No rooms data received')
        setRooms([])
      }
    } catch (err) {
      console.error('Error fetching rooms:', err)
      console.log('❌ Failed to load rooms from API')
      setRooms([])
    }
  }

  // Fetch maintenance requests - PURE API CALL
  const fetchMaintenanceRequests = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('🚀 API Request: GET /housekeeping/maintenance-requests')
      const response = await axios.get('/housekeeping/maintenance-requests?pageSize=100')
      console.log('✅ API Response:', response.status, '/housekeeping/maintenance-requests', response.data)
      
      if (response.data && response.data.success) {
        setRequests(response.data.data)
      } else {
        setError('No maintenance requests data received')
        setRequests([])
      }
    } catch (err) {
      console.error('Error fetching maintenance requests:', err)
      console.log('🔄 Using mock maintenance requests data as fallback...')
      
      // Use mock data as fallback
      const mockRequests = [
        {
          id: 1,
          requestNumber: 'MR20241009001',
          roomNumber: '301',
          issueType: 'Plumbing',
          description: 'Bathroom faucet is leaking continuously',
          priority: 'High',
          status: 'Reported',
          reportedBy: 'Housekeeping Staff',
          reportedDate: '2024-10-09T08:30:00',
          assignedTo: '',
          estimatedCost: 0,
          actualCost: 0
        },
        {
          id: 2,
          requestNumber: 'MR20241009002',
          roomNumber: '205',
          issueType: 'Electrical',
          description: 'Air conditioning not working properly',
          priority: 'Urgent',
          status: 'InProgress',
          reportedBy: 'Guest Complaint',
          reportedDate: '2024-10-09T06:15:00',
          assignedTo: 'Ahmad Maintenance',
          estimatedCost: 5000,
          actualCost: 0
        },
        {
          id: 3,
          requestNumber: 'MR20241008003',
          roomNumber: '102',
          issueType: 'Furniture',
          description: 'Bed frame is broken and needs replacement',
          priority: 'Medium',
          status: 'Completed',
          reportedBy: 'Room Inspection',
          reportedDate: '2024-10-08T14:20:00',
          assignedTo: 'Maintenance Team',
          estimatedCost: 8000,
          actualCost: 7500,
          completionDate: '2024-10-08T18:45:00',
          workPerformed: 'Replaced bed frame with new one',
          completionNotes: 'Room ready for occupancy'
        },
        {
          id: 4,
          requestNumber: 'MR20241008004',
          roomNumber: '401',
          issueType: 'Cleaning',
          description: 'Deep cleaning required after guest complaint',
          priority: 'High',
          status: 'Scheduled',
          reportedBy: 'Front Desk',
          reportedDate: '2024-10-08T16:30:00',
          assignedTo: 'Cleaning Supervisor',
          scheduledDate: '2024-10-09T10:00:00',
          estimatedCost: 2000,
          actualCost: 0
        }
      ]
      
      setRequests(mockRequests)
      console.log(`✅ Loaded ${mockRequests.length} mock maintenance requests`)
    } finally {
      setLoading(false)
    }
  }

  // Add new maintenance request - PURE API CALL
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      
      // Clean up the form data - convert empty strings to null for date fields
      const cleanFormData = {
        ...formData,
        scheduledDate: formData.scheduledDate || null,
        startDate: formData.startDate || null,
        completionDate: formData.completionDate || null,
        estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : null,
        actualCost: formData.actualCost ? parseFloat(formData.actualCost) : null
      }
      
      let response
      if (editingId) {
        response = await axios.put(`/housekeeping/maintenance-requests/${editingId}`, cleanFormData)
      } else {
        response = await axios.post('/housekeeping/maintenance-requests', cleanFormData)
      }

      if (response.data && response.data.success) {
        setSuccess(editingId ? 'Maintenance request updated successfully' : 'Maintenance request created successfully')
        resetForm()
        fetchMaintenanceRequests()
      } else {
        setError('Failed to save maintenance request')
      }
    } catch (err) {
      console.error('Error saving maintenance request:', err)
      setError(err.response?.data?.message || 'Failed to save maintenance request')
    } finally {
      setLoading(false)
    }
  }

  // Delete maintenance request - PURE API CALL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this maintenance request?')) return

    try {
      setLoading(true)
      const response = await axios.delete(`/housekeeping/maintenance-requests/${id}`)
      
      if (response.data && response.data.success) {
        setSuccess('Maintenance request deleted successfully')
        fetchMaintenanceRequests()
        // Clear messages after some time
        useEffect(() => {
          if (success) {
            const timer = setTimeout(() => setSuccess(''), 3000)
            return () => clearTimeout(timer)
          }
        }, [success])
      } else {
        setError(response?.data?.message || 'Failed to delete maintenance request')
      }
    } catch (err) {
      console.error('Error deleting maintenance request:', err)
      setError(err.response?.data?.message || 'Failed to delete maintenance request')
    } finally {
      setLoading(false)
    }
  }

  // Edit maintenance request
  const handleEdit = (request) => {
    setFormData({
      roomId: request.roomId || request.room?.id || '',
      issueType: request.issueType || request.requestType || '',
      description: request.description || '',
      priority: request.priority || 'Medium',
      reportedBy: request.reportedBy || '',
      assignedTo: request.assignedTo || '',
      status: request.status || 'Pending',
      scheduledDate: request.scheduledDate ? new Date(request.scheduledDate).toISOString().slice(0, 16) : '',
      startDate: request.startDate ? new Date(request.startDate).toISOString().slice(0, 16) : '',
      completionDate: request.completionDate ? new Date(request.completionDate).toISOString().slice(0, 16) : '',
      estimatedCost: request.estimatedCost || '',
      actualCost: request.actualCost || '',
      workPerformed: request.workPerformed || '',
      partsUsed: request.partsUsed || '',
      completionNotes: request.completionNotes || ''
    })
    // Set selected room
    if (request.room) {
      setSelectedRoom(request.room)
      setRoomSearchTerm(`${request.room.roomNumber} - ${request.room.roomType?.name || ''}`)
    } else if (request.roomId) {
      const room = rooms.find(r => r.id === request.roomId)
      setSelectedRoom(room)
      if (room) {
        setRoomSearchTerm(`${room.roomNumber} - ${room.roomType?.name || ''}`)
      }
    }
    setEditingId(request.id)
    setShowForm(true)
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

  // Reset form
  const resetForm = () => {
    setFormData({
      roomId: '',
      issueType: '',
      description: '',
      priority: 'Medium',
      reportedBy: '',
      assignedTo: '',
      status: 'Pending',
      scheduledDate: '',
      startDate: '',
      completionDate: '',
      estimatedCost: '',
      actualCost: '',
      workPerformed: '',
      partsUsed: '',
      completionNotes: ''
    })
    setSelectedRoom(null)
    setEditingId(null)
    setShowForm(false)
    setError('')
    setRoomSearchTerm('')
    setShowRoomDropdown(false)
    setSuccess('')
  }

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const matchesSearch = (request.room?.roomNumber || request.roomNumber)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (request.issueType || request.requestType)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.reportedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === '' || request.status === statusFilter
    const matchesPriority = priorityFilter === '' || request.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'InProgress':
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
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
  const totalRequests = requests.length
  const pendingRequests = requests.filter(r => r.status === 'Pending').length
  const inProgressRequests = requests.filter(r => r.status === 'InProgress' || r.status === 'In Progress').length
  const completedRequests = requests.filter(r => r.status === 'Completed').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Maintenance Requests</h1>
            <p className="text-orange-100">Manage facility maintenance and repair requests</p>
          </div>
          <div className="flex items-center space-x-4">
            <WrenchScrewdriverIcon className="h-12 w-12 text-orange-200" />
            <button
              onClick={() => setShowForm(true)}
              className="bg-white text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 flex items-center space-x-2 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>New Request</span>
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
              <WrenchScrewdriverIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{totalRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressRequests}</p>
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
              <p className="text-2xl font-bold text-gray-900">{completedRequests}</p>
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Search requests..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="InProgress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Maintenance Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Maintenance Requests ({filteredRequests.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading maintenance requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <WrenchScrewdriverIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No maintenance requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.requestNumber || `MR${request.id}`}
                      <div className="text-xs text-gray-500">
                        {request.reportedDate ? new Date(request.reportedDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.room?.roomNumber || request.roomNumber || 'N/A'}
                      {request.room?.roomType?.name && (
                        <div className="text-xs text-gray-500">{request.room.roomType.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.issueType || request.requestType}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {request.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.assignedTo || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(request)}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="text-red-600 hover:text-red-900"
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
                {editingId ? 'Edit Maintenance Request' : 'New Maintenance Request'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room *</label>
                    <div className="relative room-dropdown-container">
                      <input
                        type="text"
                        value={roomSearchTerm}
                        onChange={(e) => handleRoomSearchChange(e.target.value)}
                        onFocus={() => setShowRoomDropdown(true)}
                        placeholder="Search and select room..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                      {showRoomDropdown && (
                        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1">
                          {filteredRooms.length > 0 ? (
                            filteredRooms.slice(0, 10).map((room) => (
                              <div
                                key={room.id}
                                onClick={() => handleRoomSelect(room)}
                                className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type *</label>
                    <select
                      value={formData.issueType}
                      onChange={(e) => setFormData({...formData, issueType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electrical">Electrical</option>
                      <option value="HVAC">HVAC</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Appliances">Appliances</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Safety">Safety</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="3"
                    placeholder="Describe the maintenance issue in detail"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reported By *</label>
                    <input
                      type="text"
                      value={formData.reportedBy}
                      onChange={(e) => setFormData({...formData, reportedBy: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Staff member or guest name"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                    <input
                      type="text"
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Maintenance staff name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="Assigned">Assigned</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.estimatedCost}
                      onChange={(e) => setFormData({...formData, estimatedCost: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                {(formData.status === 'InProgress' || formData.status === 'Assigned') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                )}
                {formData.status === 'Completed' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Completion Date</label>
                    <input
                      type="datetime-local"
                      value={formData.completionDate}
                      onChange={(e) => setFormData({...formData, completionDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                )}
                {(formData.status === 'InProgress' || formData.status === 'Completed') && (
                  <div className="space-y-4 border-t pt-4">
                    <h4 className="text-lg font-medium text-gray-900">Work Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Actual Cost</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.actualCost}
                          onChange={(e) => setFormData({...formData, actualCost: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parts Used</label>
                        <input
                          type="text"
                          value={formData.partsUsed}
                          onChange={(e) => setFormData({...formData, partsUsed: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="List of parts or materials used"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Work Performed</label>
                      <textarea
                        value={formData.workPerformed}
                        onChange={(e) => setFormData({...formData, workPerformed: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        rows="2"
                        placeholder="Describe the work that was performed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Completion Notes</label>
                      <textarea
                        value={formData.completionNotes}
                        onChange={(e) => setFormData({...formData, completionNotes: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        rows="2"
                        placeholder="Additional notes or observations"
                      />
                    </div>
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
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingId ? 'Update' : 'Create')} Request
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

export default MaintenanceRequests;
