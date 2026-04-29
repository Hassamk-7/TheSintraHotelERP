import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CubeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  UserGroupIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

const TableMaster = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    tableName: '',
    tableCode: '',
    capacity: '',
    location: '',
    tableType: 'Regular',
    shape: 'Round',
    isActive: true
  })

  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})

  // Fetch tables from API
  const fetchTables = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/Tables')
      
      if (response.data && response.data.success) {
        setTables(response.data.data)
        setSuccess('Tables loaded successfully')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to fetch tables')
      }
    } catch (err) {
      console.error('Error fetching tables:', err)
      setError('Error loading tables. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTables()
  }, [])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.tableName.trim()) {
      newErrors.tableName = 'Table name is required'
    }

    if (!formData.tableCode.trim()) {
      newErrors.tableCode = 'Table code is required'
    }

    if (!formData.capacity || parseInt(formData.capacity) <= 0) {
      newErrors.capacity = 'Valid capacity is required'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    // Check for duplicate code
    const normalizedFormCode = (formData.tableCode || '').toLowerCase()
    const existingTable = tables.find(table => {
      const code = (table?.tableCode || '').toLowerCase()
      return code === normalizedFormCode && table?.id !== editingId
    })
    if (existingTable) {
      newErrors.tableCode = 'Table code already exists'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const tableData = {
        TableNumber: formData.tableName,
        TableCode: formData.tableCode.toUpperCase(),
        Capacity: parseInt(formData.capacity),
        Location: formData.location || '',
        TableType: formData.tableType,
        Shape: formData.shape,
        Description: `${formData.tableType} table in ${formData.location}`,
        IsReservable: true,
        HasView: false,
        Features: [],
        MinOrderAmount: 0,
        FloorNumber: 1
      }

      console.log('Sending table data:', tableData)

      if (editingId) {
        await axios.put(`/Tables/${editingId}`, tableData)
        setSuccess('Table updated successfully!')
      } else {
        await axios.post('/Tables', tableData)
        setSuccess('Table added successfully!')
      }
      
      handleCancel()
      fetchTables()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error saving table:', error)
      console.error('Error response:', error.response?.data)
      const errorMessage = error.response?.data?.message || error.response?.data?.errors || 'Error saving table. Please try again.'
      setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (table) => {
    setFormData({
      tableName: table.tableNumber || table.tableName,
      tableCode: table.tableCode,
      capacity: (table.capacity || 0).toString(),
      location: table.location || '',
      tableType: table.tableType || 'Regular',
      shape: table.shape || 'Round',
      isActive: table.isActive !== undefined ? table.isActive : true
    })
    setEditingId(table.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      try {
        setLoading(true)
        await axios.delete(`/Tables/${id}`)
        setSuccess('Table deleted successfully!')
        fetchTables()
        setTimeout(() => setSuccess(''), 3000)
      } catch (error) {
        console.error('Error deleting table:', error)
        setError('Error deleting table. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      tableName: '',
      tableCode: '',
      capacity: '',
      location: '',
      tableType: 'Regular',
      shape: 'Round',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredTables = tables.filter((table) => {
    const q = (searchTerm || '').toLowerCase()
    const name = (table?.tableName || table?.tableNumber || '').toString().toLowerCase()
    const code = (table?.tableCode || '').toString().toLowerCase()
    const location = (table?.location || '').toString().toLowerCase()
    const type = (table?.tableType || '').toString().toLowerCase()

    return (
      name.includes(q) ||
      code.includes(q) ||
      location.includes(q) ||
      type.includes(q)
    )
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Table Master</h1>
            <p className="text-indigo-100">Manage restaurant tables and seating arrangements</p>
          </div>
          <CubeIcon className="h-12 w-12 text-indigo-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-indigo-100 rounded-lg p-3">
              <CubeIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tables</p>
              <p className="text-2xl font-bold text-gray-900">{tables.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Tables</p>
              <p className="text-2xl font-bold text-gray-900">
                {tables.filter(table => table.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Capacity</p>
              <p className="text-2xl font-bold text-gray-900">
                {tables.reduce((sum, table) => sum + (Number(table?.capacity) || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <MapPinIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Locations</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(tables.map(table => table?.location).filter(Boolean)).size}
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
            placeholder="Search tables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Table
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Table' : 'Add New Table'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Table Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tableName}
                  onChange={(e) => setFormData({...formData, tableName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    errors.tableName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter table name"
                />
                {errors.tableName && (
                  <p className="mt-1 text-sm text-red-600">{errors.tableName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Table Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tableCode}
                  onChange={(e) => setFormData({...formData, tableCode: e.target.value.toUpperCase()})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    errors.tableCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter table code"
                />
                {errors.tableCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.tableCode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    errors.capacity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter seating capacity"
                />
                {errors.capacity && (
                  <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter location"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Table Type
                </label>
                <select
                  value={formData.tableType}
                  onChange={(e) => setFormData({...formData, tableType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                  <option value="Regular">Regular</option>
                  <option value="VIP">VIP</option>
                  <option value="Private">Private</option>
                  <option value="Family">Family</option>
                  <option value="Bar">Bar</option>
                  <option value="Outdoor">Outdoor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Table Shape
                </label>
                <select
                  value={formData.shape}
                  onChange={(e) => setFormData({...formData, shape: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                  <option value="Round">Round</option>
                  <option value="Rectangular">Rectangular</option>
                  <option value="Square">Square</option>
                  <option value="Oval">Oval</option>
                  <option value="Counter">Counter</option>
                  <option value="Booth">Booth</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
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
                className="px-8 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 flex items-center"
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

      {/* Tables List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Restaurant Tables ({filteredTables.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Table Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Shape
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTables.map((table) => (
                <tr key={table.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{table.tableName || table.tableNumber}</div>
                      <div className="text-sm text-gray-500">{table.tableCode}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <UserGroupIcon className="h-4 w-4 mr-1 text-gray-400" />
                      {table.capacity} seats
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                      {table.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mb-1 ${
                        table.tableType === 'VIP' ? 'bg-purple-100 text-purple-800' :
                        table.tableType === 'Private' ? 'bg-indigo-100 text-indigo-800' :
                        table.tableType === 'Family' ? 'bg-green-100 text-green-800' :
                        table.tableType === 'Bar' ? 'bg-orange-100 text-orange-800' :
                        table.tableType === 'Outdoor' ? 'bg-teal-100 text-teal-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {table.tableType}
                      </span>
                      <div className="text-sm text-gray-500">{table.shape}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      table.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {table.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(table)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(table.id)}
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
          
          {filteredTables.length === 0 && (
            <div className="text-center py-12">
              <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tables found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new table.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Table Layout View */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Table Layout by Location</h2>
        </div>
        <div className="p-6">
          {Array.from(new Set(tables.map(table => table?.location).filter(Boolean))).map(location => (
            <div key={location} className="mb-8">
              <h3 className="text-lg font-semibold mb-4">{location}</h3>
              <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
                {tables.filter(table => table.location === location).map(table => (
                  <div
                    key={table.id}
                    className={`p-3 rounded-lg border-2 text-center cursor-pointer hover:shadow-md transition-all ${
                      table.tableType === 'VIP' ? 'bg-purple-100 border-purple-300' :
                      table.tableType === 'Private' ? 'bg-indigo-100 border-indigo-300' :
                      table.tableType === 'Family' ? 'bg-green-100 border-green-300' :
                      table.tableType === 'Bar' ? 'bg-orange-100 border-orange-300' :
                      table.tableType === 'Outdoor' ? 'bg-teal-100 border-teal-300' :
                      'bg-blue-100 border-blue-300'
                    } ${!table.isActive ? 'opacity-50' : ''}`}
                    onClick={() => handleEdit(table)}
                  >
                    <div className="text-sm font-semibold">{table.tableCode}</div>
                    <div className="text-xs mt-1">{Number(table?.capacity) || 0} seats</div>
                    <div className="text-xs">{table.shape}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TableMaster;
