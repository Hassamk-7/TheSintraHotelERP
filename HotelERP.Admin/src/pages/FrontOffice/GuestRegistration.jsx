import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  UserPlusIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline'

const GuestRegistration = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    nationality: '',
    idType: '',
    idNumber: '',
    idProof: '',
    dateOfBirth: '',
    gender: '',
    occupation: '',
    company: '',
    emergencyContact: '',
    emergencyPhone: '',
    preferences: '',
    notes: ''
  })

  // Load guests on component mount
  useEffect(() => {
    fetchGuests()
  }, [page, pageSize, searchTerm])

  // Fetch guests - PURE API CALL
  const fetchGuests = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('🚀 Fetching guests from API...')
      
      const response = await axios.get('/guests', {
        params: {
          page,
          pageSize,
          search: searchTerm || null
        }
      })
      console.log('✅ Guests response:', response.data)
      
      if (response.data && response.data.success) {
        setGuests(response.data.data)
        setTotalCount(response.data.totalCount || 0)
        setTotalPages(response.data.totalPages || 0)
        console.log(`✅ Loaded ${response.data.data.length} guests from database`)
      } else {
        setError('No guest data received')
        setGuests([])
        setTotalCount(0)
        setTotalPages(0)
      }
    } catch (err) {
      console.error('❌ Error fetching guests:', err)
      setError(err.response?.data?.message || 'Failed to load guests')
      setGuests([])
      setTotalCount(0)
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }

  // Add new guest - PURE API CALL
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      
      console.log('🚀 Saving guest - Form Data:', formData)
      console.log('🔍 Checking critical fields:', {
        idType: formData.idType,
        idNumber: formData.idNumber,
        idProof: formData.idProof,
        company: formData.company,
        notes: formData.notes,
        nationality: formData.nationality,
        occupation: formData.occupation
      })
      
      let response
      const guestData = {
        fullName: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phone,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        gender: formData.gender,
        idType: formData.idType,
        idNumber: formData.idNumber,
        idProof: formData.idProof || null,
        company: formData.company,
        notes: formData.notes,
        nationality: formData.nationality,
        dateOfBirth: formData.dateOfBirth && formData.dateOfBirth !== '' && formData.dateOfBirth !== '0001-01-01' ? formData.dateOfBirth : null,
        occupation: formData.occupation,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        preferences: formData.preferences
      }

      console.log('📤 Sending complete guest data to API:', guestData)
      console.log(`📍 API Endpoint: ${editingId ? 'PUT /guests/' + editingId : 'POST /guests'}`)

      if (editingId) {
        response = await axios.put(`/guests/${editingId}`, guestData)
      } else {
        response = await axios.post('/guests', guestData)
      }

      console.log('✅ API Response:', response.data)

      if (response.data && response.data.success) {
        console.log('✅ Guest saved successfully!')
        setSuccess(editingId ? 'Guest updated successfully!' : 'Guest registered successfully!')
        resetForm()
        fetchGuests()
        
        // Auto-hide success message and close form after 2 seconds
        setTimeout(() => {
          setSuccess('')
          setShowForm(false)
        }, 2000)
      } else {
        setError('Failed to save guest information')
      }
    } catch (err) {
      console.error('Error saving guest:', err)
      setError(err.response?.data?.message || 'Failed to save guest information')
    } finally {
      setLoading(false)
    }
  }

  // Delete guest - PURE API CALL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this guest?')) return

    try {
      setLoading(true)
      console.log('🚀 Deleting guest:', id)
      
      const response = await axios.delete(`/guests/${id}`)
      
      if (response.data && response.data.success) {
        setSuccess('Guest deleted successfully')
        console.log('✅ Guest deleted successfully')
        fetchGuests()
      } else {
        setError('Failed to delete guest')
      }
    } catch (err) {
      console.error('❌ Error deleting guest:', err)
      setError(err.response?.data?.message || 'Failed to delete guest')
    } finally {
      setLoading(false)
    }
  }

  // Edit guest
  const handleEdit = (guest) => {
    console.log('📝 Editing guest:', guest)
    console.log('📋 Guest fields check:', {
      idType: guest.idType,
      idNumber: guest.idNumber,
      idProof: guest.idProof,
      company: guest.company,
      notes: guest.notes,
      nationality: guest.nationality,
      occupation: guest.occupation,
      emergencyContact: guest.emergencyContact,
      emergencyPhone: guest.emergencyPhone
    })
    
    const nameParts = guest.fullName ? guest.fullName.split(' ') : ['', '']
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''
    
    const editFormData = {
      firstName: firstName,
      lastName: lastName,
      email: guest.email || '',
      phone: guest.phoneNumber || guest.phone || '',
      address: guest.address || '',
      city: guest.city || '',
      country: guest.country || '',
      nationality: guest.nationality || '',
      idType: guest.idType || '',
      idNumber: guest.idNumber || '',
      idProof: guest.idProof || '',
      dateOfBirth: guest.dateOfBirth && guest.dateOfBirth !== '0001-01-01T00:00:00' ? guest.dateOfBirth.substring(0, 10) : '',
      gender: guest.gender || '',
      occupation: guest.occupation || '',
      company: guest.company || '',
      emergencyContact: guest.emergencyContact || '',
      emergencyPhone: guest.emergencyPhone || '',
      preferences: guest.preferences || '',
      notes: guest.notes || ''
    }
    
    console.log('✅ Form data being set:', editFormData)
    setFormData(editFormData)
    setEditingId(guest.id)
    setShowForm(true)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      nationality: '',
      idType: '',
      idNumber: '',
      idProof: '',
      dateOfBirth: '',
      gender: '',
      occupation: '',
      company: '',
      emergencyContact: '',
      emergencyPhone: '',
      preferences: '',
      notes: ''
    })
    setEditingId(null)
    setError('')
    setSuccess('')
    setShowForm(false)
  }

  // Filter guests
  const filteredGuests = guests

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Guest Registration</h1>
            <p className="text-purple-100">Manage guest profiles and registration information</p>
          </div>
          <div className="flex items-center space-x-4">
            <UserPlusIcon className="h-12 w-12 text-purple-200" />
            <button
              onClick={() => setShowForm(true)}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 flex items-center space-x-2 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Register Guest</span>
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

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setPage(1)
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Search guests by name, email, phone, or ID..."
          />
        </div>
      </div>

      {/* Guests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-lg font-medium text-gray-900">
            Registered Guests ({totalCount})
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Per page</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value) || 20)
                setPage(1)
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {[10, 20, 50, 100, 500, 1000, 5000, 10000, 20000, 30000].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading guests...</p>
          </div>
        ) : filteredGuests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <UserPlusIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No guests found</p>
            <p className="text-sm mt-1">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by registering a new guest.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identification</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-purple-100 p-2 rounded-full mr-3">
                          <UserPlusIcon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {guest.fullName}
                          </div>
                          <div className="text-sm text-gray-500">{guest.guestId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {guest.phoneNumber}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {guest.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <IdentificationIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {guest.idType}
                      </div>
                      <div className="text-sm text-gray-500">{guest.idNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{guest.city}</div>
                      <div className="text-sm text-gray-500">{guest.country}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(guest)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(guest.id)}
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

        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
              >
                Previous
              </button>
              {(() => {
                const start = Math.max(1, page - 2)
                const end = Math.min(totalPages, start + 4)
                const adjustedStart = Math.max(1, end - 4)
                const pages = []
                for (let p = adjustedStart; p <= end; p++) pages.push(p)
                return pages.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`px-3 py-2 border rounded-lg text-sm ${p === page ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-300'}`}
                  >
                    {p}
                  </button>
                ))
              })()}
              <button
                type="button"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-4 border w-11/12 md:w-4/5 lg:w-4/5 xl:w-3/4 shadow-lg rounded-lg bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingId ? 'Edit Guest Information' : 'Register New Guest'}
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <UserPlusIcon className="h-5 w-5 mr-2 text-purple-600" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                      <input
                        type="text"
                        value={formData.nationality}
                        onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., Pakistani"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <PhoneIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Complete address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., Lahore"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., Pakistan"
                      />
                    </div>
                  </div>
                </div>

                {/* Identification */}
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <IdentificationIcon className="h-5 w-5 mr-2 text-green-600" />
                    Identification Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID Type *</label>
                      <select
                        value={formData.idType}
                        onChange={(e) => setFormData({...formData, idType: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select ID Type</option>
                        <option value="CNIC">CNIC</option>
                        <option value="Passport">Passport</option>
                        <option value="National ID">National ID</option>
                        <option value="Driver License">Driver License</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID Number *</label>
                      <input
                        type="text"
                        value={formData.idNumber}
                        onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., 35202-1234567-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID Proof (File)</label>
                      <input
                        type="file"
                        onChange={(e) => setFormData({...formData, idProof: e.target.files[0]?.name || ''})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <EnvelopeIcon className="h-5 w-5 mr-2 text-yellow-600" />
                    Business & Additional Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                      <input
                        type="text"
                        value={formData.occupation}
                        onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., ABC Technologies"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                      <input
                        type="text"
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Emergency contact name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Phone</label>
                      <input
                        type="tel"
                        value={formData.emergencyPhone}
                        onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Emergency contact phone"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                        placeholder="Any special notes or preferences..."
                      />
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Saving...' : (editingId ? 'Update Guest' : 'Register Guest')}
                  </button>
                </div>
              </form>
            </div>
          </div>
       
      )}
    </div>
  )
}

export default GuestRegistration
