import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  IdentificationIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

const CheckInWithID = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const [checkIns, setCheckIns] = useState([])
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    reservationId: '',
    guestName: '',
    idType: 'CNIC',
    idNumber: '',
    phoneNumber: '',
    email: '',
    address: '',
    roomNumber: '',
    checkInDate: new Date().toISOString().split('T')[0],
    checkInTime: '14:00',
    numberOfGuests: 1,
    depositAmount: '',
    specialRequests: '',
    idVerified: false,
    documentsCollected: false
  })

  const [errors, setErrors] = useState({})

  // Load data on component mount
  useEffect(() => {
    fetchCheckIns()
    fetchReservations()
  }, [])

  // Fetch existing check-ins
  const fetchCheckIns = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('🚀 Fetching check-ins...')
      
      const response = await axios.get('/checkins')
      console.log('✅ Check-ins response:', response.data)
      
      if (response.data && response.data.success) {
        setCheckIns(response.data.data || [])
        console.log(`✅ Loaded ${response.data.data?.length || 0} check-ins`)
      } else {
        setError('Failed to load check-ins')
      }
    } catch (err) {
      console.error('❌ Error fetching check-ins:', err)
      setError(err.response?.data?.message || 'Failed to load check-ins')
    } finally {
      setLoading(false)
    }
  }

  // Fetch confirmed reservations
  const fetchReservations = async () => {
    try {
      console.log('🚀 Fetching confirmed reservations...')
      
      const response = await axios.get('/reservations?status=Confirmed')
      console.log('✅ Reservations response:', response.data)
      
      if (response.data && response.data.success) {
        setReservations(response.data.data || [])
        console.log(`✅ Loaded ${response.data.data?.length || 0} confirmed reservations`)
      }
    } catch (err) {
      console.error('❌ Error fetching reservations:', err)
    }
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.guestName.trim()) newErrors.guestName = 'Guest name is required'
    if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required'
    if (!formData.roomNumber) newErrors.roomNumber = 'Room number is required'
    if (!formData.checkInDate) newErrors.checkInDate = 'Check-in date is required'
    if (!formData.checkInTime) newErrors.checkInTime = 'Check-in time is required'
    if (!formData.depositAmount || parseFloat(formData.depositAmount) <= 0) {
      newErrors.depositAmount = 'Valid deposit amount is required'
    }
    if (!formData.idVerified) newErrors.idVerified = 'ID verification is required'
    if (!formData.documentsCollected) newErrors.documentsCollected = 'Document collection confirmation is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      // Prepare data for API call
      const checkInData = {
        reservationId: formData.reservationId || null,
        guestId: parseInt(formData.guestId) || 1, // You'll need to get this from guest lookup
        roomId: parseInt(formData.roomId) || 6, // You'll need to get this from room lookup
        checkInDate: formData.checkInDate + 'T' + (formData.checkInTime || '14:00') + ':00.000Z',
        expectedCheckOutDate: new Date(new Date(formData.checkInDate).getTime() + 24*60*60*1000).toISOString(),
        guestName: formData.guestName,
        idType: formData.idType,
        idNumber: formData.idNumber,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        address: formData.address,
        roomNumber: formData.roomNumber,
        numberOfGuests: parseInt(formData.numberOfGuests) || 1,
        depositAmount: parseFloat(formData.depositAmount) || 0,
        specialRequests: formData.specialRequests,
        status: 'CheckedIn'
      }

      console.log('🚀 Submitting check-in data:', checkInData)
      
      const response = await axios.post('/checkins', checkInData)
      console.log('✅ Check-in response:', response.data)
      
      if (response.data && response.data.success) {
        setSuccess(`${formData.guestName} checked in successfully to room ${formData.roomNumber}!`)
        resetForm()
        fetchCheckIns() // Refresh the list
      } else {
        setError('Failed to process check-in')
      }
    } catch (err) {
      console.error('❌ Error processing check-in:', err)
      setError(err.response?.data?.message || 'Failed to process check-in')
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      reservationId: '',
      guestName: '',
      idType: 'CNIC',
      idNumber: '',
      phoneNumber: '',
      email: '',
      address: '',
      roomNumber: '',
      checkInDate: new Date().toISOString().split('T')[0],
      checkInTime: '14:00',
      numberOfGuests: 1,
      depositAmount: '',
      specialRequests: '',
      idVerified: false,
      documentsCollected: false
    })
    setErrors({})
    setShowForm(false)
    setSelectedReservation(null)
  }

  // Filter reservations
  const filteredReservations = reservations.filter(reservation =>
    reservation.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.reservationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Check In with ID</h1>
            <p className="text-blue-100">Process guest check-ins with ID verification</p>
          </div>
          <IdentificationIcon className="h-12 w-12 text-blue-200" />
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <IdentificationIcon className="h-5 w-5" />
          <span>New Check-In</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search reservations by guest name, reservation number, or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}

      {/* Confirmed Reservations List */}
      {!loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Confirmed Reservations ({filteredReservations.length})
            </h3>
          </div>
          
          {filteredReservations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <IdentificationIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No confirmed reservations found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <div key={reservation.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <IdentificationIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{reservation.guestName}</h4>
                        <p className="text-sm text-gray-500">Reservation: {reservation.reservationNumber}</p>
                        <p className="text-sm text-gray-500">Room: {reservation.roomNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => {
                          setSelectedReservation(reservation)
                          setFormData(prev => ({
                            ...prev,
                            reservationId: reservation.id,
                            guestName: reservation.guestName,
                            roomNumber: reservation.roomNumber,
                            checkInDate: reservation.checkInDate?.split('T')[0] || new Date().toISOString().split('T')[0],
                            numberOfGuests: reservation.numberOfGuests || 1
                          }))
                          setShowForm(true)
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Check In
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">{new Date(reservation.checkInDate).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">Check-in Date</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">{new Date(reservation.checkOutDate).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">Check-out Date</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">{reservation.numberOfGuests} guests</div>
                      <div className="text-xs text-gray-500">Guests</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">PKR {reservation.totalAmount?.toLocaleString() || '0'}</div>
                      <div className="text-xs text-gray-500">Total Amount</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent Check-ins */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Recent Check-ins ({checkIns.length})
          </h3>
        </div>
        
        {checkIns.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <CheckCircleIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No check-ins found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {checkIns.slice(0, 5).map((checkIn) => (
              <div key={checkIn.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{checkIn.guestName}</h4>
                      <p className="text-sm text-gray-500">Room {checkIn.roomNumber}</p>
                      <p className="text-sm text-gray-500">
                        Checked in: {new Date(checkIn.checkInDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {checkIn.status || 'Checked In'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Check-in Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">
                {selectedReservation ? `Check In - ${selectedReservation.guestName}` : 'New Check-In'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Guest Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Guest Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guest Name *
                    </label>
                    <input
                      type="text"
                      name="guestName"
                      value={formData.guestName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.guestName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter guest name"
                    />
                    {errors.guestName && <p className="text-red-500 text-xs mt-1">{errors.guestName}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID Type *
                      </label>
                      <select
                        name="idType"
                        value={formData.idType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="CNIC">CNIC</option>
                        <option value="Passport">Passport</option>
                        <option value="Driving License">Driving License</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID Number *
                      </label>
                      <input
                        type="text"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.idNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter ID number"
                      />
                      {errors.idNumber && <p className="text-red-500 text-xs mt-1">{errors.idNumber}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter address"
                    />
                  </div>
                </div>

                {/* Check-in Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Check-in Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Number *
                    </label>
                    <input
                      type="text"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.roomNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter room number"
                    />
                    {errors.roomNumber && <p className="text-red-500 text-xs mt-1">{errors.roomNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in Date *
                      </label>
                      <input
                        type="date"
                        name="checkInDate"
                        value={formData.checkInDate}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.checkInDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.checkInDate && <p className="text-red-500 text-xs mt-1">{errors.checkInDate}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in Time *
                      </label>
                      <input
                        type="time"
                        name="checkInTime"
                        value={formData.checkInTime}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.checkInTime ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.checkInTime && <p className="text-red-500 text-xs mt-1">{errors.checkInTime}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Guests
                      </label>
                      <input
                        type="number"
                        name="numberOfGuests"
                        value={formData.numberOfGuests}
                        onChange={handleInputChange}
                        min="1"
                        max="10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deposit Amount (PKR) *
                      </label>
                      <input
                        type="number"
                        name="depositAmount"
                        value={formData.depositAmount}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.depositAmount ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter deposit amount"
                      />
                      {errors.depositAmount && <p className="text-red-500 text-xs mt-1">{errors.depositAmount}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter any special requests"
                    />
                  </div>

                  {/* Verification Checkboxes */}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="idVerified"
                        checked={formData.idVerified}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        ID verified and authentic *
                      </label>
                    </div>
                    {errors.idVerified && <p className="text-red-500 text-xs">{errors.idVerified}</p>}

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="documentsCollected"
                        checked={formData.documentsCollected}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Required documents collected *
                      </label>
                    </div>
                    {errors.documentsCollected && <p className="text-red-500 text-xs">{errors.documentsCollected}</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
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
                  {loading ? 'Processing...' : 'Check In Guest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckInWithID
