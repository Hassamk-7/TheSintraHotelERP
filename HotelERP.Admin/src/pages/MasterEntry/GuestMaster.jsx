import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  IdentificationIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

const GuestMaster = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    guestCode: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: '',
    country: 'Pakistan',
    idType: 'CNIC',
    idNumber: '',
    dateOfBirth: '',
    gender: 'Male',
    nationality: 'Pakistani',
    company: '',
    guestType: 'Individual'
  })

  const [errors, setErrors] = useState({})

  const genders = ['Male', 'Female', 'Other']
  const idTypes = ['CNIC', 'Passport', 'Driving License']
  const guestTypes = ['Individual', 'Business', 'Corporate', 'VIP']

  // Fetch guests from API
  const fetchGuests = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/GuestMaster')
      
      if (response.data && response.data.success) {
        setGuests(response.data.data)
        setSuccess('Guests loaded successfully')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to fetch guests')
      }
    } catch (err) {
      console.error('Error fetching guests:', err)
      setError('Error loading guests. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGuests()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.guestCode.trim()) {
      newErrors.guestCode = 'Guest code is required'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'ID number is required'
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
      const guestData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        guestCode: formData.guestCode.toUpperCase(),
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        address: formData.address || '',
        city: formData.city || '',
        country: formData.country,
        idType: formData.idType,
        idNumber: formData.idNumber,
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender,
        nationality: formData.nationality,
        company: formData.company || '',
        guestType: formData.guestType
      }

      console.log('Sending guest data:', guestData)

      if (editingId) {
        await axios.put(`/GuestMaster/${editingId}`, guestData)
        setSuccess('Guest updated successfully!')
      } else {
        await axios.post('/GuestMaster', guestData)
        setSuccess('Guest added successfully!')
      }
      
      handleCancel()
      fetchGuests()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error saving guest:', error)
      console.error('Error response:', error.response?.data)
      const errorMessage = error.response?.data?.message || error.response?.data?.errors || 'Error saving guest. Please try again.'
      setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (guest) => {
    setFormData({
      firstName: guest.firstName,
      lastName: guest.lastName,
      guestCode: guest.guestCode,
      phoneNumber: guest.phoneNumber,
      email: guest.email,
      address: guest.address || '',
      city: guest.city || '',
      country: guest.country || 'Pakistan',
      idType: guest.idType || 'CNIC',
      idNumber: guest.idNumber,
      dateOfBirth: guest.dateOfBirth ? guest.dateOfBirth.split('T')[0] : '',
      gender: guest.gender,
      nationality: guest.nationality || 'Pakistani',
      company: guest.company || '',
      guestType: guest.guestType || 'Individual'
    })
    setEditingId(guest.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      try {
        setLoading(true)
        await axios.delete(`/GuestMaster/${id}`)
        setSuccess('Guest deleted successfully!')
        fetchGuests()
        setTimeout(() => setSuccess(''), 3000)
      } catch (error) {
        console.error('Error deleting guest:', error)
        setError('Error deleting guest. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: '',
      lastName: '',
      guestCode: '',
      phoneNumber: '',
      email: '',
      address: '',
      city: '',
      country: 'Pakistan',
      idType: 'CNIC',
      idNumber: '',
      dateOfBirth: '',
      gender: 'Male',
      nationality: 'Pakistani',
      company: '',
      guestType: 'Individual'
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredGuests = guests.filter(guest =>
    guest.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.guestCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Guest Master</h1>
            <p className="text-blue-100">Manage guest information and customer profiles</p>
          </div>
          <UserGroupIcon className="h-12 w-12 text-blue-200" />
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Guest
        </button>
      </div>

      {/* Guest Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {editingId ? 'Edit Guest' : 'Add New Guest'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Guest Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="guestCode"
                  value={formData.guestCode}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.guestCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter guest code"
                />
                {errors.guestCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.guestCode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ID Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="idType"
                  value={formData.idType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {idTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ID Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.idNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter ID number"
                />
                {errors.idNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.idNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {genders.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingId ? 'Update Guest' : 'Add Guest')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Guests Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Guests ({filteredGuests.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {guest.firstName} {guest.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{guest.guestCode}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{guest.phoneNumber}</div>
                    <div className="text-sm text-gray-500">{guest.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{guest.idType}</div>
                    <div className="text-sm text-gray-500">{guest.idNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                      {guest.guestType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(guest)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(guest.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredGuests.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    {loading ? 'Loading guests...' : 'No guests found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default GuestMaster
