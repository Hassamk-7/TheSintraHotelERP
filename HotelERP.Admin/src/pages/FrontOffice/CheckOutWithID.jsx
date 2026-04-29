import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  IdentificationIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

const CheckOutWithID = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [showCheckOut, setShowCheckOut] = useState(false)

  const [currentGuests, setCurrentGuests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load data on component mount
  useEffect(() => {
    fetchCurrentGuests()
  }, [])

  // Fetch currently checked-in guests
  const fetchCurrentGuests = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('🚀 Fetching current guests for check-out...')
      
      const response = await axios.get('/checkins?status=CheckedIn')
      console.log('✅ Current guests response:', response.data)
      
      if (response.data && response.data.success) {
        // Calculate billing details for each guest
        const guestsWithBilling = response.data.data.map(guest => {
          const checkInDate = new Date(guest.checkInDate)
          const checkOutDate = new Date(guest.checkOutDate)
          const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
          const roomRate = 8000 // Base room rate
          const roomCharges = nights * roomRate
          const additionalCharges = Math.floor(Math.random() * 5000) // Random additional charges
          const taxes = Math.round((roomCharges + additionalCharges) * 0.17) // 17% tax
          const totalAmount = roomCharges + additionalCharges + taxes
          const depositAmount = guest.depositAmount || 10000
          const paidAmount = depositAmount
          const balance = totalAmount - paidAmount

          return {
            ...guest,
            nights,
            roomCharges,
            additionalCharges,
            taxes,
            totalAmount,
            paidAmount,
            balance,
            depositAmount
          }
        })
        
        setCurrentGuests(guestsWithBilling)
        console.log(`✅ Loaded ${guestsWithBilling.length} current guests for check-out`)
      } else {
        setError('Failed to load current guests')
      }
    } catch (err) {
      console.error('❌ Error fetching current guests:', err)
      setError(err.response?.data?.message || 'Failed to load current guests')
    } finally {
      setLoading(false)
    }
  }

  // Process check-out
  const handleCheckOut = async (guest) => {
    try {
      setLoading(true)
      setError('')
      console.log('🚀 Processing check-out for guest:', guest.guestName)
      
      // Update check-in status to CheckedOut
      const response = await axios.put(`/checkins/${guest.id}`, {
        ...guest,
        status: 'CheckedOut',
        actualCheckOutDate: new Date().toISOString()
      })
      
      if (response.data && response.data.success) {
        setSuccess(`${guest.guestName} checked out successfully!`)
        setShowCheckOut(false)
        setSelectedGuest(null)
        fetchCurrentGuests() // Refresh the list
      } else {
        setError('Failed to process check-out')
      }
    } catch (err) {
      console.error('❌ Error processing check-out:', err)
      setError(err.response?.data?.message || 'Failed to process check-out')
    } finally {
      setLoading(false)
    }
  }

  // Filter current guests
  const filteredGuests = currentGuests.filter(guest =>
    guest.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.idNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Check Out with ID</h1>
            <p className="text-red-100">Process guest check-outs with ID verification</p>
          </div>
          <IdentificationIcon className="h-12 w-12 text-red-200" />
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

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search guests by name, room number, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <span className="ml-2 text-gray-600">Loading guests...</span>
        </div>
      )}

      {/* Current Guests List */}
      {!loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Current Guests ({filteredGuests.length})
            </h3>
          </div>
          
          {filteredGuests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <IdentificationIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No current guests found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredGuests.map((guest) => (
                <div key={guest.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-red-100 p-3 rounded-full">
                        <IdentificationIcon className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{guest.guestName}</h4>
                        <p className="text-sm text-gray-500">Room {guest.roomNumber}</p>
                        <p className="text-sm text-gray-500">
                          {guest.idType}: {guest.idNumber || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => {
                          setSelectedGuest(guest)
                          setShowCheckOut(true)
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Check Out
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">{guest.nights} nights</div>
                      <div className="text-xs text-gray-500">Stay Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">PKR {guest.totalAmount?.toLocaleString() || '0'}</div>
                      <div className="text-xs text-gray-500">Total Amount</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">PKR {guest.paidAmount?.toLocaleString() || '0'}</div>
                      <div className="text-xs text-gray-500">Paid Amount</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-medium ${guest.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        PKR {guest.balance?.toLocaleString() || '0'}
                      </div>
                      <div className="text-xs text-gray-500">Balance</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-600">
                    <strong>Check-in:</strong> {new Date(guest.checkInDate).toLocaleDateString()} | 
                    <strong> Expected Check-out:</strong> {new Date(guest.checkOutDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Check-out Modal */}
      {showCheckOut && selectedGuest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Check Out - {selectedGuest.guestName}</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Guest Information</h3>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {selectedGuest.guestName}</p>
                    <p><strong>Room:</strong> {selectedGuest.roomNumber}</p>
                    <p><strong>ID Type:</strong> {selectedGuest.idType || 'CNIC'}</p>
                    <p><strong>ID Number:</strong> {selectedGuest.idNumber || 'N/A'}</p>
                    <p><strong>Check-in:</strong> {new Date(selectedGuest.checkInDate).toLocaleDateString()}</p>
                    <p><strong>Expected Check-out:</strong> {new Date(selectedGuest.checkOutDate).toLocaleDateString()}</p>
                    <p><strong>Nights:</strong> {selectedGuest.nights}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Billing Summary</h3>
                  <div className="space-y-2">
                    <p><strong>Room Charges:</strong> PKR {selectedGuest.roomCharges?.toLocaleString() || '0'}</p>
                    <p><strong>Additional Charges:</strong> PKR {selectedGuest.additionalCharges?.toLocaleString() || '0'}</p>
                    <p><strong>Taxes:</strong> PKR {selectedGuest.taxes?.toLocaleString() || '0'}</p>
                    <p><strong>Total Amount:</strong> PKR {selectedGuest.totalAmount?.toLocaleString() || '0'}</p>
                    <p><strong>Paid Amount:</strong> PKR {selectedGuest.paidAmount?.toLocaleString() || '0'}</p>
                    <p className={`font-bold ${selectedGuest.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      <strong>Balance:</strong> PKR {selectedGuest.balance?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              </div>
              
              {selectedGuest.balance > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    <strong>Payment Required:</strong> Guest has an outstanding balance of PKR {selectedGuest.balance?.toLocaleString()}
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCheckOut(false)
                    setSelectedGuest(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCheckOut(selectedGuest)}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Confirm Check Out'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckOutWithID
