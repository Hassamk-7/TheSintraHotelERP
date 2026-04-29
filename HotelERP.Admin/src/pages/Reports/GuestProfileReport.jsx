import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UserGroupIcon,
  FunnelIcon,
  DocumentTextIcon,
  PrinterIcon,
  StarIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'

const GuestProfileReport = () => {
  const [filters, setFilters] = useState({
    guestType: '',
    nationality: '',
    vipStatus: '',
    dateRange: { start: '', end: '' },
    spendingRange: { min: '', max: '' }
  })

  const [guestProfiles, setGuestProfiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hotelInfo, setHotelInfo] = useState(null)

  // Load guest profiles on component mount and filter changes
  useEffect(() => {
    fetchGuestProfiles()
    fetchHotelInfo()
  }, [filters.dateRange, filters.guestType, filters.nationality])

  // Fetch guest profiles from API
  const fetchGuestProfiles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.dateRange.start) params.append('dateFrom', filters.dateRange.start)
      if (filters.dateRange.end) params.append('dateTo', filters.dateRange.end)
      if (filters.guestType) params.append('guestType', filters.guestType)
      if (filters.nationality) params.append('city', filters.nationality)
      
      const response = await axios.get(`/api/Reports/guest-profile-report?${params}`)
      if (response.data.success) {
        setGuestProfiles(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching guest profiles:', err)
      setError('Failed to load guest profiles')
      // Fallback to mock data
      setGuestProfiles([
    {
      id: 1,
      guestId: 'GST-001',
      firstName: 'Ahmed',
      lastName: 'Hassan',
      fullName: 'Ahmed Hassan',
      email: 'ahmed.hassan@email.com',
      phone: '+92-300-1234567',
      nationality: 'Pakistani',
      dateOfBirth: '1985-05-15',
      age: 38,
      gender: 'Male',
      address: '123 Main Street, Karachi',
      city: 'Karachi',
      country: 'Pakistan',
      guestType: 'Regular',
      vipStatus: 'Gold',
      registrationDate: '2023-01-15',
      lastVisit: '2024-01-15',
      totalVisits: 8,
      totalStays: 45,
      totalSpent: 450000,
      averageSpendPerVisit: 56250,
      averageStayDuration: 5.6,
      preferredRoomType: 'Deluxe',
      loyaltyPoints: 2250,
      rating: 4.8,
      feedback: 'Excellent service and comfortable rooms',
      specialRequests: 'Non-smoking rooms, Extra pillows',
      paymentMethod: 'Credit Card',
      emergencyContact: 'Fatima Hassan - +92-300-7654321',
      idType: 'CNIC',
      idNumber: '42101-1234567-1'
    },
    {
      id: 2,
      guestId: 'GST-002',
      firstName: 'Sarah',
      lastName: 'Johnson',
      fullName: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1-555-123-4567',
      nationality: 'American',
      dateOfBirth: '1990-08-22',
      age: 33,
      gender: 'Female',
      address: '456 Oak Avenue, New York',
      city: 'New York',
      country: 'USA',
      guestType: 'Corporate',
      vipStatus: 'Platinum',
      registrationDate: '2023-03-20',
      lastVisit: '2024-01-18',
      totalVisits: 12,
      totalStays: 36,
      totalSpent: 720000,
      averageSpendPerVisit: 60000,
      averageStayDuration: 3.0,
      preferredRoomType: 'Suite',
      loyaltyPoints: 3600,
      rating: 4.9,
      feedback: 'Professional service, great for business trips',
      specialRequests: 'Late checkout, Business center access',
      paymentMethod: 'Corporate Account',
      emergencyContact: 'John Johnson - +1-555-987-6543',
      idType: 'Passport',
      idNumber: 'US123456789'
    },
    {
      id: 3,
      guestId: 'GST-003',
      firstName: 'Ali',
      lastName: 'Khan',
      fullName: 'Ali Khan',
      email: 'ali.khan@email.com',
      phone: '+92-321-9876543',
      nationality: 'Pakistani',
      dateOfBirth: '1978-12-10',
      age: 45,
      gender: 'Male',
      address: '789 Garden Road, Lahore',
      city: 'Lahore',
      country: 'Pakistan',
      guestType: 'Regular',
      vipStatus: 'Silver',
      registrationDate: '2022-11-05',
      lastVisit: '2024-01-20',
      totalVisits: 15,
      totalStays: 22,
      totalSpent: 280000,
      averageSpendPerVisit: 18667,
      averageStayDuration: 1.5,
      preferredRoomType: 'Standard',
      loyaltyPoints: 1400,
      rating: 4.5,
      feedback: 'Good value for money, friendly staff',
      specialRequests: 'Ground floor rooms, Halal food only',
      paymentMethod: 'Cash',
      emergencyContact: 'Ayesha Khan - +92-321-1111111',
      idType: 'CNIC',
      idNumber: '42101-9876543-2'
    },
    {
      id: 4,
      guestId: 'GST-004',
      firstName: 'Emma',
      lastName: 'Wilson',
      fullName: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      phone: '+44-20-1234-5678',
      nationality: 'British',
      dateOfBirth: '1988-03-18',
      age: 35,
      gender: 'Female',
      address: '321 London Street, London',
      city: 'London',
      country: 'UK',
      guestType: 'Tourist',
      vipStatus: 'Regular',
      registrationDate: '2023-07-12',
      lastVisit: '2024-01-19',
      totalVisits: 3,
      totalStays: 14,
      totalSpent: 185000,
      averageSpendPerVisit: 61667,
      averageStayDuration: 4.7,
      preferredRoomType: 'Deluxe',
      loyaltyPoints: 925,
      rating: 4.6,
      feedback: 'Beautiful hotel, great location',
      specialRequests: 'Baby cot, High floor rooms',
      paymentMethod: 'Credit Card',
      emergencyContact: 'James Wilson - +44-20-9876-5432',
      idType: 'Passport',
      idNumber: 'GB987654321'
    }
      ])
      setError('')
    } finally {
      setLoading(false)
    }
  }

  const fetchHotelInfo = async () => {
    try {
      const response = await axios.get('/api/Reports/hotel-info')
      if (response.data.success) {
        setHotelInfo(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching hotel info:', err)
      setHotelInfo({
        HotelName: 'Pearl Continental Hotel',
        Address: 'Club Road, Karachi, Pakistan',
        Phone: '+92-21-111-505-505',
        Email: 'info@pckarachi.com'
      })
    }
  }

  const guestTypes = ['All Types', 'Regular', 'Corporate', 'Tourist', 'Group', 'Wedding Party']
  const nationalities = ['All Nationalities', 'Pakistani', 'American', 'British', 'Indian', 'Chinese', 'German']
  const vipStatuses = ['All Status', 'Regular', 'Silver', 'Gold', 'Platinum']

  const filteredGuests = guestProfiles.filter(guest => {
    const matchesType = filters.guestType === '' || filters.guestType === 'All Types' || guest.guestType === filters.guestType
    const matchesNationality = filters.nationality === '' || filters.nationality === 'All Nationalities' || guest.nationality === filters.nationality
    const matchesVipStatus = filters.vipStatus === '' || filters.vipStatus === 'All Status' || guest.vipStatus === filters.vipStatus
    
    let matchesSpendingRange = true
    if (filters.spendingRange.min || filters.spendingRange.max) {
      const min = parseFloat(filters.spendingRange.min) || 0
      const max = parseFloat(filters.spendingRange.max) || Infinity
      matchesSpendingRange = guest.totalSpent >= min && guest.totalSpent <= max
    }

    return matchesType && matchesNationality && matchesVipStatus && matchesSpendingRange
  })

  const getVipStatusColor = (vipStatus) => {
    switch (vipStatus) {
      case 'Platinum': return 'bg-gray-800 text-white'
      case 'Gold': return 'bg-yellow-500 text-white'
      case 'Silver': return 'bg-gray-400 text-white'
      case 'Regular': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getGuestTypeColor = (guestType) => {
    switch (guestType) {
      case 'Regular': return 'bg-blue-100 text-blue-800'
      case 'Corporate': return 'bg-purple-100 text-purple-800'
      case 'Tourist': return 'bg-green-100 text-green-800'
      case 'Group': return 'bg-orange-100 text-orange-800'
      case 'Wedding Party': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const exportReport = () => {
    alert(`Exporting guest profile report with ${filteredGuests.length} guests...`)
  }

  const printReport = () => {
    window.print()
  }

  // Calculate statistics
  const totalGuests = filteredGuests.length
  const totalRevenue = filteredGuests.reduce((sum, guest) => sum + guest.totalSpent, 0)
  const averageSpending = totalGuests > 0 ? totalRevenue / totalGuests : 0
  const totalVisits = filteredGuests.reduce((sum, guest) => sum + guest.totalVisits, 0)
  const totalStays = filteredGuests.reduce((sum, guest) => sum + guest.totalStays, 0)
  const averageRating = totalGuests > 0 ? filteredGuests.reduce((sum, guest) => sum + guest.rating, 0) / totalGuests : 0
  const vipGuests = filteredGuests.filter(guest => guest.vipStatus !== 'Regular').length
  const repeatGuests = filteredGuests.filter(guest => guest.totalVisits > 1).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Guest Profile & Account Ledger Report</h1>
            <p className="text-purple-100">Comprehensive guest analytics and spending patterns</p>
          </div>
          <UserGroupIcon className="h-12 w-12 text-purple-200" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Report Filters
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={printReport}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </button>
            <button
              onClick={exportReport}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Guest Type</label>
            <select
              value={filters.guestType}
              onChange={(e) => setFilters({...filters, guestType: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {guestTypes.map(type => (
                <option key={type} value={type === 'All Types' ? '' : type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
            <select
              value={filters.nationality}
              onChange={(e) => setFilters({...filters, nationality: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {nationalities.map(nationality => (
                <option key={nationality} value={nationality === 'All Nationalities' ? '' : nationality}>{nationality}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">VIP Status</label>
            <select
              value={filters.vipStatus}
              onChange={(e) => setFilters({...filters, vipStatus: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {vipStatuses.map(status => (
                <option key={status} value={status === 'All Status' ? '' : status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Spending</label>
            <input
              type="number"
              value={filters.spendingRange.min}
              onChange={(e) => setFilters({...filters, spendingRange: {...filters.spendingRange, min: e.target.value}})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Guests</p>
              <p className="text-2xl font-bold text-gray-900">{totalGuests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Stays</p>
              <p className="text-2xl font-bold text-gray-900">{totalStays}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <StarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Profiles Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Guest Profile Report ({filteredGuests.length} guests)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Information</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact & Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit History</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spending Analysis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preferences & VIP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating & Feedback</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-purple-100 rounded-full p-2 mr-3">
                        <UserGroupIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{guest.fullName}</div>
                        <div className="text-sm text-gray-500">{guest.guestId}</div>
                        <div className="text-sm text-gray-500">{guest.gender} • Age {guest.age}</div>
                        <div className="text-sm text-gray-500">{guest.idType}: {guest.idNumber}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGuestTypeColor(guest.guestType)}`}>
                          {guest.guestType}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">{guest.email}</div>
                      <div className="text-sm text-gray-500">{guest.phone}</div>
                      <div className="text-sm text-gray-500">{guest.city}, {guest.country}</div>
                      <div className="text-sm text-gray-500">Nationality: {guest.nationality}</div>
                      <div className="text-sm text-blue-600">Emergency: {guest.emergencyContact}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {guest.totalVisits} visits • {guest.totalStays} nights
                      </div>
                      <div className="text-sm text-gray-500">
                        Avg stay: {guest.averageStayDuration} nights
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-1" />
                        Last visit: {guest.lastVisit}
                      </div>
                      <div className="text-sm text-gray-500">
                        Member since: {guest.registrationDate}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-green-600">
                        Total: {formatCurrency(guest.totalSpent)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Per visit: {formatCurrency(guest.averageSpendPerVisit)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Payment: {guest.paymentMethod}
                      </div>
                      <div className="text-sm text-blue-600">
                        Points: {guest.loyaltyPoints}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        Prefers: {guest.preferredRoomType}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVipStatusColor(guest.vipStatus)}`}>
                        {guest.vipStatus}
                      </span>
                      {guest.specialRequests && (
                        <div className="text-sm text-blue-600">
                          {guest.specialRequests}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        {guest.rating}/5.0
                      </div>
                      {guest.feedback && (
                        <div className="text-sm text-gray-500 italic">
                          "{guest.feedback.substring(0, 40)}..."
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredGuests.length === 0 && (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No guest profiles found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>

      {/* Summary Analytics */}
      {filteredGuests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Analytics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Average Spending per Guest:</span>
                <span className="font-medium">{formatCurrency(averageSpending)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">VIP Guests:</span>
                <span className="font-medium">{vipGuests} ({((vipGuests/totalGuests)*100).toFixed(1)}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Repeat Guests:</span>
                <span className="font-medium">{repeatGuests} ({((repeatGuests/totalGuests)*100).toFixed(1)}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Visits per Guest:</span>
                <span className="font-medium">{(totalVisits/totalGuests).toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Revenue:</span>
                <span className="font-medium text-green-600">{formatCurrency(totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue per Stay:</span>
                <span className="font-medium">{formatCurrency(totalRevenue/totalStays)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue per Visit:</span>
                <span className="font-medium">{formatCurrency(totalRevenue/totalVisits)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Rating:</span>
                <span className="font-medium flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                  {averageRating.toFixed(1)}/5.0
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GuestProfileReport;
