import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  HomeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const RoomTax = () => {
  const [taxes, setTaxes] = useState([])
  const [hotels, setHotels] = useState([])
  const [roomTypes, setRoomTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedHotel, setSelectedHotel] = useState('')
  const [selectedRoomType, setSelectedRoomType] = useState('')
  
  const [formData, setFormData] = useState({
    hotelId: '',
    roomTypeId: '',
    taxName: '',
    taxType: 'Percentage',
    taxValue: ''
  })
  
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})

  // Load data on component mount
  useEffect(() => {
    fetchTaxes()
    fetchHotels()
    fetchRoomTypes()
  }, [])

  // Fetch all room taxes
  const fetchTaxes = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('🚀 Fetching room taxes from database...')
      const response = await axios.get('/roomtax')
      
      console.log('📊 API Response:', response.data)
      
      if (response.data && response.data.success && response.data.data) {
        setTaxes(response.data.data)
        console.log('✅ Loaded room taxes from database:', response.data.data.length)
      } else if (response.data && Array.isArray(response.data)) {
        setTaxes(response.data)
        console.log('✅ Loaded room taxes from database:', response.data.length)
      } else {
        setTaxes([])
        console.log('✅ No room taxes found')
      }
    } catch (err) {
      console.error('❌ API Error fetching room taxes:', err)
      setError('Failed to load room taxes')
      setTaxes([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch hotels for dropdown
  const fetchHotels = async () => {
    try {
      console.log('🚀 Fetching hotels...')
      const response = await axios.get('/roomtax/hotels')
      
      if (response.data && response.data.success && response.data.data) {
        setHotels(response.data.data)
        console.log('✅ Loaded hotels:', response.data.data.length)
      }
    } catch (err) {
      console.error('❌ Error fetching hotels:', err)
    }
  }

  // Fetch room types for dropdown
  const fetchRoomTypes = async () => {
    try {
      console.log('🚀 Fetching room types...')
      const response = await axios.get('/roomtax/roomtypes')
      
      if (response.data && response.data.success && response.data.data) {
        setRoomTypes(response.data.data)
        console.log('✅ Loaded room types:', response.data.data.length)
      }
    } catch (err) {
      console.error('❌ Error fetching room types:', err)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      setError('')
      setSuccess('')
      
      const submitData = {
        hotelId: parseInt(formData.hotelId),
        roomTypeId: parseInt(formData.roomTypeId),
        taxName: formData.taxName.trim(),
        taxType: formData.taxType,
        taxValue: parseFloat(formData.taxValue)
      }
      
      console.log('🔄 Submitting room tax:', { 
        editingId, 
        isEditing: !!editingId, 
        method: editingId ? 'PUT' : 'POST',
        url: editingId ? `/roomtax/${editingId}` : '/roomtax',
        submitData 
      })
      
      const response = editingId 
        ? await axios.put(`/roomtax/${editingId}`, submitData)
        : await axios.post('/roomtax', submitData)
      
      if (response.data && response.data.success) {
        setSuccess(editingId ? 'Room tax updated successfully' : 'Room tax created successfully')
        fetchTaxes() // Refresh data
        setShowForm(false)
        resetForm()
      } else {
        setError('Failed to save room tax')
      }
    } catch (err) {
      console.error('❌ Error saving room tax:', err)
      setError(err.response?.data?.message || 'Failed to save room tax')
    } finally {
      setLoading(false)
    }
  }

  // Handle edit
  const handleEdit = (tax) => {
    console.log('🔄 Editing room tax:', tax)
    const taxId = tax.id || tax.Id
    setEditingId(taxId)
    setFormData({
      hotelId: tax.hotelId?.toString() || '',
      roomTypeId: tax.roomTypeId?.toString() || '',
      taxName: tax.taxName || '',
      taxType: tax.taxType || 'Percentage',
      taxValue: tax.taxValue?.toString() || ''
    })
    setShowForm(true)
    setError('')
    setSuccess('')
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room tax?')) return

    try {
      setLoading(true)
      console.log('🚀 Deleting room tax:', id)
      const response = await axios.delete(`/roomtax/${id}`)
      
      if (response.data && response.data.success) {
        setSuccess('Room tax deleted successfully')
        fetchTaxes() // Refresh data
      } else {
        setError('Failed to delete room tax')
      }
    } catch (err) {
      console.error('❌ Error deleting room tax:', err)
      setError(err.response?.data?.message || 'Failed to delete room tax')
    } finally {
      setLoading(false)
    }
  }

  // Add new tax
  const handleAddNew = () => {
    console.log('🔄 Adding new room tax - clearing editingId')
    resetForm()
    setShowForm(true)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      hotelId: '',
      roomTypeId: '',
      taxName: '',
      taxType: 'Percentage',
      taxValue: ''
    })
    setEditingId(null)
    setErrors({})
    setError('')
    setSuccess('')
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.hotelId) newErrors.hotelId = 'Hotel is required'
    if (!formData.roomTypeId) newErrors.roomTypeId = 'Room type is required'
    if (!formData.taxName.trim()) newErrors.taxName = 'Tax name is required'
    if (!formData.taxValue || parseFloat(formData.taxValue) < 0) newErrors.taxValue = 'Valid tax value is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Filter taxes based on search and filters
  const filteredTaxes = taxes.filter(tax => {
    const matchesSearch = !searchTerm || 
      tax.taxName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tax.hotelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tax.roomTypeName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesHotel = !selectedHotel || tax.hotelId?.toString() === selectedHotel
    const matchesRoomType = !selectedRoomType || tax.roomTypeId?.toString() === selectedRoomType
    
    return matchesSearch && matchesHotel && matchesRoomType
  })

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('')
        setError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  return (
    <div className="space-y-4 px-3 py-4 sm:px-4 sm:py-4 md:px-6 md:py-6">
      {/* Header */}
      <div className="hidden md:flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-sm text-gray-500">
            <HomeIcon className="h-4 w-4 mr-1" />
            <span>Dashboard</span>
            <span className="mx-2">/</span>
            <span>Rooms Management</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Room Tax</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-[1.75rem] shadow-lg">
        <div className="px-4 sm:px-6 py-5 sm:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 leading-tight">Room Tax Management</h1>
              <p className="text-red-100 text-sm sm:text-base">Manage taxes for hotels and room types</p>
              <div className="text-red-200 text-xs sm:text-sm mt-1">
                <p>Database Records: {taxes.length} taxes found</p>
              </div>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-white text-red-600 px-4 sm:px-6 py-3 rounded-2xl font-semibold hover:bg-red-50 transition-colors duration-200 flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Tax</span>
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

      {/* Filters */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search taxes..."
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Hotel</label>
              <select
                value={selectedHotel}
                onChange={(e) => setSelectedHotel(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base"
              >
                <option value="">All Hotels</option>
                {hotels.map(hotel => (
                  <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Room Type</label>
              <select
                value={selectedRoomType}
                onChange={(e) => setSelectedRoomType(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Room Types</option>
                {roomTypes.map(roomType => (
                  <option key={roomType.id} value={roomType.id}>{roomType.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedHotel('')
                  setSelectedRoomType('')
                }}
                className="w-full px-4 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-colors duration-200 font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading room taxes from database...</p>
          </div>
        </div>
      ) : filteredTaxes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <CurrencyDollarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Room Taxes Found</h3>
            <p className="text-gray-500 mb-4">
              {taxes.length === 0 ? 'Create your first room tax configuration' : 'No taxes match your current filters'}
            </p>
            <button
              onClick={handleAddNew}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Add Room Tax
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-gradient-to-r from-red-50 via-white to-rose-50 px-6 py-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Room Tax List</h2>
                <p className="text-sm text-slate-500">Professional view of tax configuration by hotel and room type</p>
              </div>
              <div className="text-sm font-medium text-slate-500">{filteredTaxes.length} record(s)</div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Hotel</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Room Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Tax Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Value</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredTaxes.map((tax, index) => (
                  <tr key={tax.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'} transition hover:bg-red-50/50`}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                      {tax.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-semibold text-slate-900">{tax.hotelName}</div>
                      <div className="text-xs text-slate-500">Hotel</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{tax.roomTypeName}</div>
                      <div className="text-xs text-slate-500">Room category</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{tax.taxName}</div>
                      <div className="text-xs text-slate-500">Tax label</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        tax.taxType === 'Percentage' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {tax.taxType}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                      {tax.taxType === 'Percentage' ? `${tax.taxValue}%` : `Rs ${tax.taxValue}`}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(tax)}
                          className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-900"
                          title="Edit tax"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tax.id)}
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-900"
                          title="Delete tax"
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
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingId ? 'Edit Room Tax' : 'Add New Room Tax'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hotel *
                    </label>
                    <select
                      value={formData.hotelId}
                      onChange={(e) => setFormData({...formData, hotelId: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        errors.hotelId ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select Hotel</option>
                      {hotels.map(hotel => (
                        <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                      ))}
                    </select>
                    {errors.hotelId && <p className="text-red-500 text-xs mt-1">{errors.hotelId}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Type *
                    </label>
                    <select
                      value={formData.roomTypeId}
                      onChange={(e) => setFormData({...formData, roomTypeId: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        errors.roomTypeId ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select Room Type</option>
                      {roomTypes.map(roomType => (
                        <option key={roomType.id} value={roomType.id}>{roomType.name}</option>
                      ))}
                    </select>
                    {errors.roomTypeId && <p className="text-red-500 text-xs mt-1">{errors.roomTypeId}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Name *
                    </label>
                    <input
                      type="text"
                      value={formData.taxName}
                      onChange={(e) => setFormData({...formData, taxName: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        errors.taxName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., GST, Service Tax"
                      required
                    />
                    {errors.taxName && <p className="text-red-500 text-xs mt-1">{errors.taxName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Type *
                    </label>
                    <select
                      value={formData.taxType}
                      onChange={(e) => setFormData({...formData, taxType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    >
                      <option value="Percentage">Percentage (%)</option>
                      <option value="Amount">Fixed Amount (Rs)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Value * {formData.taxType === 'Percentage' ? '(%)' : '(Rs)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.taxValue}
                    onChange={(e) => setFormData({...formData, taxValue: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.taxValue ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={formData.taxType === 'Percentage' ? 'e.g., 18.00' : 'e.g., 500.00'}
                    required
                  />
                  {errors.taxValue && <p className="text-red-500 text-xs mt-1">{errors.taxValue}</p>}
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
                    {loading ? 'Saving...' : (editingId ? 'Update Tax' : 'Create Tax')}
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

export default RoomTax
