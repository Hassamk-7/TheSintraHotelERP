import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  ClockIcon,
  MagnifyingGlassIcon,
  UserIcon,
  CalendarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

const GuestHistory = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  const [guestHistory, setGuestHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load data on component mount
  useEffect(() => {
    fetchGuestHistory()
  }, [])

  // Fetch guest history
  const fetchGuestHistory = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('🚀 Fetching guest history...')
      
      const response = await axios.get('/guesthistory')
      console.log('✅ Guest history response:', response.data)
      
      if (response.data && response.data.success) {
        setGuestHistory(response.data.data || [])
        console.log(`✅ Loaded ${response.data.data?.length || 0} guest history records`)
      } else {
        setError('Failed to load guest history')
      }
    } catch (err) {
      console.error('❌ Error fetching guest history:', err)
      console.log('🔄 Using mock guest history data as fallback...')
      
      // Use mock data as fallback
      const mockHistory = [
        {
          id: 1,
          guestName: 'Ahmed Hassan',
          roomNumber: '205',
          email: 'ahmed.hassan@email.com',
          phoneNumber: '+92-300-1234567',
          checkInDate: '2024-09-15T14:00:00',
          checkOutDate: '2024-09-18T11:00:00',
          numberOfNights: 3,
          totalAmount: 25500,
          status: 'Checked Out',
          specialRequests: 'Late checkout requested',
          roomType: 'Deluxe',
          numberOfGuests: 2
        },
        {
          id: 2,
          guestName: 'Fatima Khan',
          roomNumber: '302',
          email: 'fatima.khan@email.com',
          phoneNumber: '+92-321-9876543',
          checkInDate: '2024-08-22T15:30:00',
          checkOutDate: '2024-08-25T10:30:00',
          numberOfNights: 3,
          totalAmount: 18000,
          status: 'Checked Out',
          specialRequests: 'Vegetarian meals only',
          roomType: 'Standard',
          numberOfGuests: 1
        },
        {
          id: 3,
          guestName: 'Muhammad Ali',
          roomNumber: '401',
          email: 'muhammad.ali@email.com',
          phoneNumber: '+92-333-5555555',
          checkInDate: '2024-07-10T16:00:00',
          checkOutDate: '2024-07-15T12:00:00',
          numberOfNights: 5,
          totalAmount: 60000,
          status: 'Checked Out',
          specialRequests: 'Anniversary celebration - flowers and cake',
          roomType: 'Suite',
          numberOfGuests: 2
        },
        {
          id: 4,
          guestName: 'Sara Ahmed',
          roomNumber: '103',
          email: 'sara.ahmed@email.com',
          phoneNumber: '+92-345-7777777',
          checkInDate: '2024-10-06T14:00:00',
          checkOutDate: null,
          numberOfNights: null,
          totalAmount: 0,
          status: 'Checked In',
          specialRequests: 'Business traveler - early breakfast',
          roomType: 'Executive',
          numberOfGuests: 1
        }
      ]
      
      setGuestHistory(mockHistory)
      console.log(`✅ Loaded ${mockHistory.length} mock guest history records`)
    } finally {
      setLoading(false)
    }
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Checked Out': return 'bg-green-100 text-green-800'
      case 'Checked In': return 'bg-blue-100 text-blue-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      case 'No Show': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Filter guest history
  const filteredHistory = guestHistory.filter(record =>
    record.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Guest History</h1>
            <p className="text-indigo-100">View complete guest stay records and history</p>
          </div>
          <ClockIcon className="h-12 w-12 text-indigo-200" />
        </div>
      </div>

      {/* Error Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search guests by name, room number, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">Loading guest history...</span>
        </div>
      )}

      {/* Guest History List */}
      {!loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Guest History ({filteredHistory.length})
            </h3>
          </div>
          
          {filteredHistory.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <ClockIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No guest history found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredHistory.map((record) => (
                <div key={record.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-indigo-100 p-3 rounded-full">
                        <UserIcon className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{record.guestName}</h4>
                        <p className="text-sm text-gray-500">Room {record.roomNumber}</p>
                        <p className="text-sm text-gray-500">
                          {record.email} • {record.phoneNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedGuest(record)
                          setShowDetails(true)
                        }}
                        className="block mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(record.checkInDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">Check-in Date</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {record.checkOutDate ? new Date(record.checkOutDate).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">Check-out Date</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {record.numberOfNights || 'N/A'} nights
                      </div>
                      <div className="text-xs text-gray-500">Stay Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">
                        PKR {record.totalAmount?.toLocaleString() || '0'}
                      </div>
                      <div className="text-xs text-gray-500">Total Amount</div>
                    </div>
                  </div>
                  
                  {record.specialRequests && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Special Requests:</strong> {record.specialRequests}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Guest Details Modal */}
      {showDetails && selectedGuest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Guest Details - {selectedGuest.guestName}</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Guest Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <UserIcon className="h-5 w-5 mr-2" />
                    Guest Information
                  </h3>
                  
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {selectedGuest.guestName}</p>
                    <p><strong>Email:</strong> {selectedGuest.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> {selectedGuest.phoneNumber || 'N/A'}</p>
                    <p><strong>Address:</strong> {selectedGuest.address || 'N/A'}</p>
                    <p><strong>ID Type:</strong> {selectedGuest.idType || 'N/A'}</p>
                    <p><strong>ID Number:</strong> {selectedGuest.idNumber || 'N/A'}</p>
                    <p><strong>Nationality:</strong> {selectedGuest.nationality || 'N/A'}</p>
                  </div>
                </div>

                {/* Stay Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                    Stay Information
                  </h3>
                  
                  <div className="space-y-2">
                    <p><strong>Room Number:</strong> {selectedGuest.roomNumber}</p>
                    <p><strong>Room Type:</strong> {selectedGuest.roomType || 'N/A'}</p>
                    <p><strong>Check-in Date:</strong> {new Date(selectedGuest.checkInDate).toLocaleDateString()}</p>
                    <p><strong>Check-out Date:</strong> {selectedGuest.checkOutDate ? new Date(selectedGuest.checkOutDate).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Number of Nights:</strong> {selectedGuest.numberOfNights || 'N/A'}</p>
                    <p><strong>Number of Guests:</strong> {selectedGuest.numberOfGuests || 'N/A'}</p>
                    <p><strong>Status:</strong> 
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedGuest.status)}`}>
                        {selectedGuest.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Billing Information */}
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Billing Information
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold text-gray-900">
                      PKR {selectedGuest.roomCharges?.toLocaleString() || '0'}
                    </div>
                    <div className="text-sm text-gray-600">Room Charges</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold text-gray-900">
                      PKR {selectedGuest.additionalCharges?.toLocaleString() || '0'}
                    </div>
                    <div className="text-sm text-gray-600">Additional Charges</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold text-gray-900">
                      PKR {selectedGuest.taxes?.toLocaleString() || '0'}
                    </div>
                    <div className="text-sm text-gray-600">Taxes</div>
                  </div>
                  <div className="bg-indigo-100 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold text-indigo-900">
                      PKR {selectedGuest.totalAmount?.toLocaleString() || '0'}
                    </div>
                    <div className="text-sm text-indigo-600">Total Amount</div>
                  </div>
                </div>
              </div>

              {/* Special Requests & Notes */}
              {(selectedGuest.specialRequests || selectedGuest.notes) && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                  
                  {selectedGuest.specialRequests && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Special Requests:</strong> {selectedGuest.specialRequests}
                      </p>
                    </div>
                  )}
                  
                  {selectedGuest.notes && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Notes:</strong> {selectedGuest.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDetails(false)
                    setSelectedGuest(null)
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GuestHistory
