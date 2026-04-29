import { useState, useEffect } from 'react'
import axios from '../../utils/axios'
import {
  BuildingOffice2Icon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

const BlockFloorManagement = () => {
  const [hotelId, setHotelId] = useState('')
  const [hotels, setHotels] = useState([])
  const [roomTypes, setRoomTypes] = useState([])
  const [hierarchy, setHierarchy] = useState(null)
  const [expandedBlocks, setExpandedBlocks] = useState({})
  const [expandedFloors, setExpandedFloors] = useState({})
  
  const [showBlockForm, setShowBlockForm] = useState(false)
  const [showFloorForm, setShowFloorForm] = useState(false)
  const [editingBlock, setEditingBlock] = useState(null)
  const [editingFloor, setEditingFloor] = useState(null)
  const [selectedBlockId, setSelectedBlockId] = useState(null)
  
  const [blockFormData, setBlockFormData] = useState({
    blockName: '',
    blockCode: '',
    description: '',
    blockManager: ''
  })
  
  const [floorFormData, setFloorFormData] = useState({
    roomTypeId: '',
    floorNumber: '',
    floorName: '',
    description: '',
    floorManager: '',
    housekeepingSupervisor: '',
    hasElevatorAccess: false,
    hasFireExit: false,
    safetyFeatures: '',
    specialFeatures: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch hotels on mount
  useEffect(() => {
    fetchHotels()
    fetchRoomTypes()
  }, [])

  // Fetch hierarchy when hotel is selected
  useEffect(() => {
    if (hotelId) {
      fetchHierarchy()
    }
  }, [hotelId])

  const fetchHotels = async () => {
    try {
      const response = await axios.get('/hotels')
      if (response.data.success) {
        setHotels(response.data.data)
        if (response.data.data.length > 0) {
          setHotelId(response.data.data[0].id)
        }
      }
    } catch (err) {
      console.error('Error fetching hotels:', err)
    }
  }

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get('/roomtypes')
      if (response.data.success) {
        setRoomTypes(response.data.data || [])
      }
    } catch (err) {
      console.error('Error fetching room types:', err)
    }
  }

  const fetchHierarchy = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/blockfloor/hotel/${hotelId}`)
      if (response.data.success) {
        setHierarchy(response.data.data)
        setError('')
      }
    } catch (err) {
      console.error('Error fetching hierarchy:', err)
      setError('Failed to load block-floor hierarchy')
      setHierarchy(null)
    } finally {
      setLoading(false)
    }
  }

  const toggleBlock = (blockId) => {
    setExpandedBlocks(prev => ({
      ...prev,
      [blockId]: !prev[blockId]
    }))
  }

  const toggleFloor = (floorId) => {
    setExpandedFloors(prev => ({
      ...prev,
      [floorId]: !prev[floorId]
    }))
  }

  const handleCreateBlock = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await axios.post('/blockfloor/block', {
        hotelId: parseInt(hotelId),
        ...blockFormData
      })
      
      if (response.data.success) {
        setSuccess('Block created successfully!')
        setShowBlockForm(false)
        setBlockFormData({ blockName: '', blockCode: '', description: '', blockManager: '' })
        fetchHierarchy()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating block')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateBlock = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const updateData = {
        blockName: blockFormData.blockName,
        blockCode: blockFormData.blockCode,
        description: blockFormData.description,
        blockManager: blockFormData.blockManager,
        isActive: editingBlock.isActive
      }
      console.log('Updating block with data:', updateData)
      const response = await axios.put(`/blockfloor/block/${editingBlock.id}`, updateData)
      console.log('Block update response:', response.data)
      
      if (response.data.success) {
        setSuccess('Block updated successfully!')
        setShowBlockForm(false)
        setEditingBlock(null)
        setBlockFormData({ blockName: '', blockCode: '', description: '', blockManager: '' })
        await fetchHierarchy()
      }
    } catch (err) {
      console.error('Block update error:', err)
      setError(err.response?.data?.message || 'Error updating block')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBlock = async (blockId) => {
    if (!window.confirm('Are you sure you want to delete this block?')) return
    
    try {
      setLoading(true)
      const response = await axios.delete(`/blockfloor/block/${blockId}`)
      
      if (response.data.success) {
        setSuccess('Block deleted successfully!')
        fetchHierarchy()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting block')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateFloor = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await axios.post('/blockfloor/floor', {
        blockId: selectedBlockId,
        roomTypeId: floorFormData.roomTypeId ? parseInt(floorFormData.roomTypeId) : null,
        floorNumber: parseInt(floorFormData.floorNumber),
        floorName: floorFormData.floorName,
        description: floorFormData.description,
        floorManager: floorFormData.floorManager,
        housekeepingSupervisor: floorFormData.housekeepingSupervisor,
        hasElevatorAccess: floorFormData.hasElevatorAccess,
        hasFireExit: floorFormData.hasFireExit,
        safetyFeatures: floorFormData.safetyFeatures,
        specialFeatures: floorFormData.specialFeatures
      })
      
      if (response.data.success) {
        setSuccess('Floor created successfully!')
        setShowFloorForm(false)
        setFloorFormData({
          roomTypeId: '',
          floorNumber: '',
          floorName: '',
          description: '',
          floorManager: '',
          housekeepingSupervisor: '',
          hasElevatorAccess: false,
          hasFireExit: false,
          safetyFeatures: '',
          specialFeatures: ''
        })
        fetchHierarchy()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating floor')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateFloor = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const updateData = {
        id: editingFloor.id,
        roomTypeId: floorFormData.roomTypeId ? parseInt(floorFormData.roomTypeId) : null,
        floorNumber: parseInt(floorFormData.floorNumber),
        floorName: floorFormData.floorName,
        description: floorFormData.description,
        floorManager: floorFormData.floorManager,
        housekeepingSupervisor: floorFormData.housekeepingSupervisor,
        hasElevatorAccess: floorFormData.hasElevatorAccess,
        hasFireExit: floorFormData.hasFireExit,
        safetyFeatures: floorFormData.safetyFeatures,
        specialFeatures: floorFormData.specialFeatures,
        isActive: editingFloor.isActive
      }
      console.log('Updating floor with data:', updateData)
      const response = await axios.put(`/blockfloor/floor/${editingFloor.id}`, updateData)
      console.log('Floor update response:', response.data)
      
      if (response.data.success) {
        setSuccess('Floor updated successfully!')
        setShowFloorForm(false)
        setEditingFloor(null)
        setFloorFormData({
          roomTypeId: '',
          floorNumber: '',
          floorName: '',
          description: '',
          floorManager: '',
          housekeepingSupervisor: '',
          hasElevatorAccess: false,
          hasFireExit: false,
          safetyFeatures: '',
          specialFeatures: ''
        })
        await fetchHierarchy()
      }
    } catch (err) {
      console.error('Floor update error:', err)
      setError(err.response?.data?.message || 'Error updating floor')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteFloor = async (floorId) => {
    if (!window.confirm('Are you sure you want to delete this floor?')) return
    
    try {
      setLoading(true)
      const response = await axios.delete(`/blockfloor/floor/${floorId}`)
      
      if (response.data.success) {
        setSuccess('Floor deleted successfully!')
        fetchHierarchy()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting floor')
    } finally {
      setLoading(false)
    }
  }

  const openBlockForm = (block = null) => {
    if (block) {
      setEditingBlock(block)
      setBlockFormData({
        blockName: block.blockName,
        blockCode: block.blockCode || '',
        description: block.description || '',
        blockManager: block.blockManager || ''
      })
    } else {
      setEditingBlock(null)
      setBlockFormData({ blockName: '', blockCode: '', description: '', blockManager: '' })
    }
    setShowBlockForm(true)
  }

  const openFloorForm = (blockId, floor = null) => {
    setSelectedBlockId(blockId)
    if (floor) {
      setEditingFloor(floor)
      setFloorFormData({
        roomTypeId: floor.roomTypeId || '',
        floorNumber: floor.floorNumber.toString(),
        floorName: floor.floorName,
        description: floor.description || '',
        floorManager: floor.floorManager || '',
        housekeepingSupervisor: floor.housekeepingSupervisor || '',
        hasElevatorAccess: floor.hasElevatorAccess,
        hasFireExit: floor.hasFireExit,
        safetyFeatures: floor.safetyFeatures || '',
        specialFeatures: floor.specialFeatures || ''
      })
    } else {
      setEditingFloor(null)
      setFloorFormData({
        roomTypeId: '',
        floorNumber: '',
        floorName: '',
        description: '',
        floorManager: '',
        housekeepingSupervisor: '',
        hasElevatorAccess: false,
        hasFireExit: false,
        safetyFeatures: '',
        specialFeatures: ''
      })
    }
    setShowFloorForm(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <BuildingOffice2Icon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Block & Floor Management</h1>
              <p className="text-blue-100 mt-1">Manage hotel blocks, floors, and room hierarchy</p>
            </div>
          </div>
          <button
            onClick={() => openBlockForm()}
            className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl flex items-center space-x-2 transition-all"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Block</span>
          </button>
        </div>
      </div>

      {/* Hotel Selector */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Hotel</label>
        <select
          value={hotelId}
          onChange={(e) => setHotelId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">-- Select Hotel --</option>
          {hotels.map(hotel => (
            <option key={hotel.id} value={hotel.id}>{hotel.hotelName}</option>
          ))}
        </select>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <ExclamationCircleIcon className="h-5 w-5 text-red-600" />
          <span className="text-red-700">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircleIcon className="h-5 w-5 text-green-600" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {/* Hierarchy Tree */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading hierarchy...</p>
        </div>
      ) : hierarchy && hierarchy.blocks.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6">{hierarchy.hotelName}</h2>
          
          {hierarchy.blocks.map(block => (
            <div key={block.id} className="border border-gray-200 rounded-lg">
              {/* Block Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 flex items-center justify-between cursor-pointer hover:bg-blue-100 transition"
                onClick={() => toggleBlock(block.id)}>
                <div className="flex items-center space-x-3 flex-1">
                  {expandedBlocks[block.id] ? (
                    <ChevronDownIcon className="h-5 w-5 text-blue-600" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900">{block.blockName}</h3>
                    <p className="text-sm text-gray-600">{block.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{block.totalFloors} Floors</p>
                    <p className="text-xs text-gray-500">{block.totalRooms} Rooms</p>
                  </div>
                  <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => openBlockForm(block)}
                      className="p-2 hover:bg-blue-200 rounded-lg transition"
                      title="Edit Block"
                    >
                      <PencilIcon className="h-4 w-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteBlock(block.id)}
                      className="p-2 hover:bg-red-200 rounded-lg transition"
                      title="Delete Block"
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Floors */}
              {expandedBlocks[block.id] && (
                <div className="p-4 space-y-3 bg-white border-t border-gray-200">
                  {block.floors.length > 0 ? (
                    block.floors.map(floor => (
                      <div key={floor.id} className="border border-gray-200 rounded-lg bg-gray-50">
                        {/* Floor Header */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 flex items-center justify-between cursor-pointer hover:bg-indigo-100 transition"
                          onClick={() => toggleFloor(floor.id)}>
                          <div className="flex items-center space-x-3 flex-1">
                            {expandedFloors[floor.id] ? (
                              <ChevronDownIcon className="h-4 w-4 text-indigo-600" />
                            ) : (
                              <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                            )}
                            <div>
                              <h4 className="font-semibold text-gray-900">Floor {floor.floorNumber} - {floor.floorName}</h4>
                              <p className="text-xs text-gray-600">{floor.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right text-xs">
                              <p className="font-medium">Total: {floor.totalRooms}</p>
                              <p className="text-green-600">Avail: {floor.availableRooms}</p>
                            </div>
                            <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => openFloorForm(block.id, floor)}
                                className="p-1 hover:bg-indigo-200 rounded transition"
                                title="Edit Floor"
                              >
                                <PencilIcon className="h-4 w-4 text-indigo-600" />
                              </button>
                              <button
                                onClick={() => handleDeleteFloor(floor.id)}
                                className="p-1 hover:bg-red-200 rounded transition"
                                title="Delete Floor"
                              >
                                <TrashIcon className="h-4 w-4 text-red-600" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Rooms */}
                        {expandedFloors[floor.id] && (
                          <div className="p-3 space-y-2 bg-white border-t border-gray-200">
                            {floor.rooms.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {floor.rooms.map(room => (
                                  <div key={room.id} className="bg-gray-50 p-2 rounded border border-gray-200 text-sm">
                                    <p className="font-medium text-gray-900">{room.roomNumber}</p>
                                    <p className="text-xs text-gray-600">{room.roomTypeName}</p>
                                    <p className="text-xs text-gray-500">{room.status}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="bg-blue-50 border border-blue-200 rounded p-3 text-center">
                                <p className="text-sm text-gray-700 mb-2">No rooms assigned to this floor yet</p>
                                <p className="text-xs text-gray-600">To assign rooms to this floor:</p>
                                <ol className="text-xs text-gray-600 mt-2 space-y-1">
                                  <li>1. Go to <strong>Rooms Management → Rooms</strong></li>
                                  <li>2. Edit a room and set its <strong>Block</strong> and <strong>Floor</strong></li>
                                  <li>3. Rooms will appear here automatically</li>
                                </ol>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No floors in this block</p>
                  )}
                  
                  <button
                    onClick={() => openFloorForm(block.id)}
                    className="w-full mt-3 py-2 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 transition flex items-center justify-center space-x-2"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Add Floor to {block.blockName}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : hotelId ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <BuildingOffice2Icon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">No blocks found for this hotel</p>
          <button
            onClick={() => openBlockForm()}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create First Block</span>
          </button>
        </div>
      ) : null}

      {/* Block Form Modal */}
      {showBlockForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                {editingBlock ? 'Edit Block' : 'Create Block'}
              </h3>
              <button
                onClick={() => setShowBlockForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={editingBlock ? handleUpdateBlock : handleCreateBlock} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Block Name *</label>
                <input
                  type="text"
                  value={blockFormData.blockName}
                  onChange={(e) => setBlockFormData({...blockFormData, blockName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Main Tower, Garden Wing"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Block Code</label>
                <input
                  type="text"
                  value={blockFormData.blockCode}
                  onChange={(e) => setBlockFormData({...blockFormData, blockCode: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., A, B, MT"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={blockFormData.description}
                  onChange={(e) => setBlockFormData({...blockFormData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Block description"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Block Manager</label>
                <input
                  type="text"
                  value={blockFormData.blockManager}
                  onChange={(e) => setBlockFormData({...blockFormData, blockManager: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Manager name"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowBlockForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {loading ? 'Saving...' : (editingBlock ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floor Form Modal */}
      {showFloorForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                {editingFloor ? 'Edit Floor' : 'Create Floor'}
              </h3>
              <button
                onClick={() => setShowFloorForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={editingFloor ? handleUpdateFloor : handleCreateFloor} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor Number *</label>
                  <input
                    type="number"
                    value={floorFormData.floorNumber}
                    onChange={(e) => setFloorFormData({...floorFormData, floorNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="1, 2, G"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor Name *</label>
                  <input
                    type="text"
                    value={floorFormData.floorName}
                    onChange={(e) => setFloorFormData({...floorFormData, floorName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Ground, First"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type (Optional)</label>
                <select
                  value={floorFormData.roomTypeId || ''}
                  onChange={(e) => setFloorFormData({...floorFormData, roomTypeId: e.target.value ? parseInt(e.target.value) : ''})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">-- Select Room Type --</option>
                  {roomTypes.map(rt => (
                    <option key={rt.id} value={rt.id}>{rt.name}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Assign a room type to this floor for category-wise management</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={floorFormData.description}
                  onChange={(e) => setFloorFormData({...floorFormData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Floor description"
                  rows="2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor Manager</label>
                  <input
                    type="text"
                    value={floorFormData.floorManager}
                    onChange={(e) => setFloorFormData({...floorFormData, floorManager: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Manager name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Housekeeping Supervisor</label>
                  <input
                    type="text"
                    value={floorFormData.housekeepingSupervisor}
                    onChange={(e) => setFloorFormData({...floorFormData, housekeepingSupervisor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Supervisor name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={floorFormData.hasElevatorAccess}
                    onChange={(e) => setFloorFormData({...floorFormData, hasElevatorAccess: e.target.checked})}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Has Elevator Access</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={floorFormData.hasFireExit}
                    onChange={(e) => setFloorFormData({...floorFormData, hasFireExit: e.target.checked})}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Has Fire Exit</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Safety Features</label>
                <textarea
                  value={floorFormData.safetyFeatures}
                  onChange={(e) => setFloorFormData({...floorFormData, safetyFeatures: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Safety features"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Features</label>
                <textarea
                  value={floorFormData.specialFeatures}
                  onChange={(e) => setFloorFormData({...floorFormData, specialFeatures: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Special features"
                  rows="2"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowFloorForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  {loading ? 'Saving...' : (editingFloor ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlockFloorManagement
