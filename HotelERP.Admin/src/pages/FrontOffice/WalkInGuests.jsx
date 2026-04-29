import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  UserIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const WalkInGuests = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    guestName: '',
    phone: '',
    idNumber: '',
    roomType: 'Standard',
    checkInDate: '',
    checkOutDate: '',
    adults: 1,
    children: 0,
    purpose: 'Business',
    source: 'Walk-in',
    specialRequests: '',
    estimatedArrival: '',
    status: 'Pending'
  })

  const [walkIns, setWalkIns] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load walk-in guests on component mount
  useEffect(() => {
    fetchWalkIns()
  }, [])

  // Fetch walk-in reservations from API
  const fetchWalkIns = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('🚀 Fetching walk-in guests from API...')
      
      const response = await axios.get('/reservations?source=Walk-in')
      console.log('✅ Walk-in guests response:', response.data)
      
      if (response.data && response.data.success) {
        setWalkIns(response.data.data)
        console.log(`✅ Loaded ${response.data.data.length} walk-in guests from database`)
      } else {
        setError('No walk-in guest data received')
        setWalkIns([])
      }
    } catch (err) {
      console.error('❌ Error fetching walk-in guests:', err)
      setError(err.response?.data?.message || 'Failed to load walk-in guests')
      setWalkIns([])
    } finally {
      setLoading(false)
    }
  }

  // Create new walk-in reservation
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      console.log('🚀 Creating walk-in reservation:', formData)
      
      const reservationData = {
        guestName: formData.guestName,
        phoneNumber: formData.phone,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        adults: formData.adults,
        children: formData.children,
        specialRequests: formData.specialRequests,
        bookingSource: 'Walk-in',
        status: 'Confirmed'
      }

      let response
      if (editingId) {
        response = await axios.put(`/reservations/${editingId}`, reservationData)
      } else {
        response = await axios.post('/reservations', reservationData)
      }

      if (response.data && response.data.success) {
        setSuccess(editingId ? 'Walk-in guest updated successfully' : 'Walk-in guest registered successfully')
        resetForm()
        fetchWalkIns()
      } else {
        setError('Failed to save walk-in guest')
      }
    } catch (err) {
      console.error('❌ Error saving walk-in guest:', err)
      setError(err.response?.data?.message || 'Failed to save walk-in guest')
    } finally {
      setLoading(false)
    }
  }

  // Delete walk-in reservation
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this walk-in guest?')) return

    try {
      setLoading(true)
      console.log('🚀 Deleting walk-in guest:', id)
      
      const response = await axios.delete(`/reservations/${id}`)
      
      if (response.data && response.data.success) {
        setSuccess('Walk-in guest deleted successfully')
        console.log('✅ Walk-in guest deleted successfully')
        fetchWalkIns()
      } else {
        setError('Failed to delete walk-in guest')
      }
    } catch (err) {
      console.error('❌ Error deleting walk-in guest:', err)
      setError(err.response?.data?.message || 'Failed to delete walk-in guest')
    } finally {
      setLoading(false)
    }
  }

  // Edit walk-in guest
  const handleEdit = (walkIn) => {
    setFormData({
      guestName: walkIn.guestName || '',
      phone: walkIn.phoneNumber || '',
      idNumber: '',
      roomType: 'Standard',
      checkInDate: walkIn.checkInDate ? walkIn.checkInDate.split('T')[0] : '',
      checkOutDate: walkIn.checkOutDate ? walkIn.checkOutDate.split('T')[0] : '',
      adults: walkIn.adults || 1,
      children: walkIn.children || 0,
      purpose: 'Business',
      source: 'Walk-in',
      specialRequests: walkIn.specialRequests || '',
      estimatedArrival: '',
      status: walkIn.status || 'Confirmed'
    })
    setEditingId(walkIn.id)
    setShowForm(true)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      guestName: '',
      phone: '',
      idNumber: '',
      roomType: 'Standard',
      checkInDate: '',
      checkOutDate: '',
      adults: 1,
      children: 0,
      purpose: 'Business',
      source: 'Walk-in',
      specialRequests: '',
      estimatedArrival: '',
      status: 'Pending'
    })
    setEditingId(null)
    setShowForm(false)
  }

  // Filter walk-in guests
  const filteredWalkIns = walkIns.filter(walkIn =>
    walkIn.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    walkIn.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    walkIn.reservationNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  )


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Walk-in Guests</h1>
            <p className="text-teal-100">Manage walk-in guest registrations</p>
          </div>
          <UserIcon className="h-12 w-12 text-teal-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-teal-100 rounded-lg p-3">
              <UserIcon className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Walk-ins</p>
              <p className="text-2xl font-bold text-gray-900">{walkIns.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">
                {walkIns.filter(w => w.status === 'Confirmed').length}
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
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {walkIns.filter(w => w.status === 'Pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Guests</p>
              <p className="text-2xl font-bold text-gray-900">
                {walkIns.reduce((sum, w) => sum + w.adults + w.children, 0)}
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
            placeholder="Search walk-ins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Walk-in
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Walk-in Guest' : 'Register Walk-in Guest'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Guest Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.guestName}
                  onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.guestName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter guest name"
                />
                {errors.guestName && <p className="mt-1 text-sm text-red-600">{errors.guestName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+92-300-1234567"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ID Number</label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="CNIC or Passport number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Room Type</label>
                <select
                  value={formData.roomType}
                  onChange={(e) => setFormData({...formData, roomType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Check-in Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.checkInDate}
                  onChange={(e) => setFormData({...formData, checkInDate: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.checkInDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.checkInDate && <p className="mt-1 text-sm text-red-600">{errors.checkInDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Check-out Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.checkOutDate}
                  onChange={(e) => setFormData({...formData, checkOutDate: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.checkOutDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.checkOutDate && <p className="mt-1 text-sm text-red-600">{errors.checkOutDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Adults</label>
                <input
                  type="number"
                  min="1"
                  value={formData.adults}
                  onChange={(e) => setFormData({...formData, adults: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Children</label>
                <input
                  type="number"
                  min="0"
                  value={formData.children}
                  onChange={(e) => setFormData({...formData, children: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Purpose</label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Business">Business</option>
                  <option value="Tourism">Tourism</option>
                  <option value="Personal">Personal</option>
                  <option value="Conference">Conference</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Arrival</label>
                <input
                  type="time"
                  value={formData.estimatedArrival}
                  onChange={(e) => setFormData({...formData, estimatedArrival: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Special Requests</label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter special requests"
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
                className="px-8 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 transition-all duration-200 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    {editingId ? 'Update' : 'Register'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Walk-ins List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Walk-in Guests ({filteredWalkIns.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stay Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWalkIns.map((walkIn) => (
                <tr key={walkIn.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{walkIn.guestName}</div>
                      <div className="text-sm text-gray-500">{walkIn.phone}</div>
                      <div className="text-sm text-gray-500">{walkIn.registrationTime}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-gray-900">{walkIn.roomType}</div>
                      <div className="text-sm text-gray-500">{walkIn.checkInDate} to {walkIn.checkOutDate}</div>
                      <div className="text-sm text-gray-500">Arrival: {walkIn.estimatedArrival}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{walkIn.adults} Adults, {walkIn.children} Children</div>
                    <div className="text-sm text-gray-500">{walkIn.purpose}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      walkIn.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      walkIn.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {walkIn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(walkIn)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(walkIn.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
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

export default WalkInGuests;
