import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  SparklesIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const LaundryManagement = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    ticketNumber: '',
    guestName: '',
    roomNumber: '',
    serviceType: 'Washing',
    itemType: 'Clothing',
    quantity: '',
    specialInstructions: '',
    receivedBy: '',
    receivedDate: '',
    expectedDelivery: '',
    status: 'Received',
    charges: '',
    notes: '',
    isActive: true
  })

  const [laundryItems, setLaundryItems] = useState([
    {
      id: 1,
      ticketNumber: 'LND-001',
      guestName: 'Ahmed Hassan',
      roomNumber: '205',
      serviceType: 'Washing & Ironing',
      itemType: 'Clothing',
      quantity: '5',
      specialInstructions: 'Gentle wash for silk shirts',
      receivedBy: 'Fatima Ali',
      receivedDate: '2024-01-15',
      expectedDelivery: '2024-01-16',
      status: 'In Progress',
      charges: '1500',
      notes: 'Priority service requested',
      isActive: true
    },
    {
      id: 2,
      ticketNumber: 'LND-002',
      guestName: 'Maria Khan',
      roomNumber: '301',
      serviceType: 'Dry Cleaning',
      itemType: 'Formal Wear',
      quantity: '2',
      specialInstructions: 'Handle with care - expensive suits',
      receivedBy: 'Sara Ahmed',
      receivedDate: '2024-01-14',
      expectedDelivery: '2024-01-17',
      status: 'Received',
      charges: '3000',
      notes: 'Business suits for important meeting',
      isActive: true
    },
    {
      id: 3,
      ticketNumber: 'LND-003',
      guestName: 'Ali Raza',
      roomNumber: '102',
      serviceType: 'Express Washing',
      itemType: 'Casual Wear',
      quantity: '8',
      specialInstructions: 'Quick turnaround needed',
      receivedBy: 'Ayesha Khan',
      receivedDate: '2024-01-15',
      expectedDelivery: '2024-01-15',
      status: 'Completed',
      charges: '1200',
      notes: 'Same day service completed',
      isActive: true
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load laundry items on component mount - DISABLED FOR DEMO
  useEffect(() => {
    // API calls disabled to show mock data
    console.log('Laundry Management component loaded with mock data:', laundryItems.length, 'items')
  }, [])

  // Fetch laundry items from API
  const fetchLaundryItems = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/Housekeeping/housekeeping-laundry')
      if (response.data.success) {
        setLaundryItems(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching laundry items:', err)
      setError('Using demo data - API connection failed')
      // Keep existing mock data instead of overriding
      console.log('Keeping existing mock data due to API error')
    } finally {
      setLoading(false)
    }
  }

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.ticketNumber.trim()) newErrors.ticketNumber = 'Ticket number is required'
    if (!formData.guestName.trim()) newErrors.guestName = 'Guest name is required'
    if (!formData.roomNumber.trim()) newErrors.roomNumber = 'Room number is required'
    if (!formData.quantity || parseInt(formData.quantity) < 1) newErrors.quantity = 'Valid quantity is required'
    if (!formData.receivedBy.trim()) newErrors.receivedBy = 'Received by is required'
    if (!formData.receivedDate) newErrors.receivedDate = 'Received date is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingId) {
        setLaundryItems(prev => prev.map(item => 
          item.id === editingId 
            ? { ...formData, id: editingId, quantity: parseInt(formData.quantity), charges: parseFloat(formData.charges) || 0 }
            : item
        ))
      } else {
        const newItem = { ...formData, id: Date.now(), quantity: parseInt(formData.quantity), charges: parseFloat(formData.charges) || 0 }
        setLaundryItems(prev => [...prev, newItem])
      }
      
      handleCancel()
      alert(editingId ? 'Laundry item updated successfully!' : 'Laundry item added successfully!')
    } catch (error) {
      alert('Error saving laundry item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
    setFormData({
      ticketNumber: item.ticketNumber,
      guestName: item.guestName,
      roomNumber: item.roomNumber,
      serviceType: item.serviceType,
      itemType: item.itemType,
      quantity: item.quantity.toString(),
      specialInstructions: item.specialInstructions,
      receivedBy: item.receivedBy,
      receivedDate: item.receivedDate,
      expectedDelivery: item.expectedDelivery,
      status: item.status,
      charges: item.charges.toString(),
      notes: item.notes,
      isActive: item.isActive
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this laundry item?')) {
      setLaundryItems(prev => prev.filter(item => item.id !== id))
      alert('Laundry item deleted successfully!')
    }
  }

  const handleCancel = () => {
    setFormData({
      ticketNumber: '',
      guestName: '',
      roomNumber: '',
      serviceType: 'Washing',
      itemType: 'Clothing',
      quantity: '',
      specialInstructions: '',
      receivedBy: '',
      receivedDate: '',
      expectedDelivery: '',
      status: 'Received',
      charges: '',
      notes: '',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredItems = laundryItems.filter(item =>
    item.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Received': return 'bg-blue-100 text-blue-800'
      case 'In Progress': return 'bg-yellow-100 text-yellow-800'
      case 'Processing': return 'bg-orange-100 text-orange-800'
      case 'Ready': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  console.log('Laundry Management component rendering with items:', laundryItems.length)
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Laundry Management</h1>
            <p className="text-green-100">Manage hotel laundry services and guest requests</p>
          </div>
          <SparklesIcon className="h-12 w-12 text-cyan-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <SparklesIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Received</p>
              <p className="text-2xl font-bold text-gray-900">
                {laundryItems.filter(item => item.status === 'Received').length}
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
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {laundryItems.filter(item => item.status === 'In Progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ready</p>
              <p className="text-2xl font-bold text-gray-900">
                {laundryItems.filter(item => item.status === 'Ready').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {laundryItems.filter(item => item.status === 'Completed').length}
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
            placeholder="Search laundry items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Laundry Item
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Laundry Item' : 'Add New Laundry Item'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ticket Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ticketNumber}
                  onChange={(e) => setFormData({...formData, ticketNumber: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    errors.ticketNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="LND-001"
                />
                {errors.ticketNumber && <p className="mt-1 text-sm text-red-600">{errors.ticketNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Guest Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.guestName}
                  onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    errors.guestName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ahmed Ali"
                />
                {errors.guestName && <p className="mt-1 text-sm text-red-600">{errors.guestName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Service Type</label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Washing">Washing</option>
                  <option value="Dry Cleaning">Dry Cleaning</option>
                  <option value="Pressing">Pressing</option>
                  <option value="Washing & Pressing">Washing & Pressing</option>
                  <option value="Express Service">Express Service</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    errors.quantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="3"
                />
                {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Special Instructions</label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Special handling instructions"
                />
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
                className="px-8 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 flex items-center"
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

      {/* Laundry Items List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Laundry Items ({filteredItems.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket & Guest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.ticketNumber}</div>
                      <div className="text-sm text-gray-500">{item.guestName}</div>
                      <div className="text-sm text-gray-500">Room {item.roomNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-gray-900">{item.serviceType}</div>
                      <div className="text-sm text-gray-500">{item.itemType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-gray-900">Qty: {item.quantity}</div>
                      <div className="text-sm text-gray-500">Rs {item.charges.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{item.receivedDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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

export default LaundryManagement;
