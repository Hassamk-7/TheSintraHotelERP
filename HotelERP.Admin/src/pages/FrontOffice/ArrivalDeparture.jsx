import React, { useState, useEffect } from 'react'
import { Calendar, Users, LogIn, LogOut, Clock, Search, Download, RefreshCw, AlertCircle, CheckCircle, XCircle, User, Phone, Mail, Home } from 'lucide-react'
import axios from '../../utils/axios.js'

const ArrivalDeparture = () => {
  const [activeTab, setActiveTab] = useState('arrivals')
  const [dateFilter, setDateFilter] = useState('all') // 'today', 'tomorrow', 'yesterday', 'all'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [arrivals, setArrivals] = useState([])
  const [departures, setDepartures] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    totalArrivals: 0,
    expectedArrivals: 0,
    checkedInArrivals: 0,
    totalDepartures: 0,
    expectedDepartures: 0,
    checkedOutDepartures: 0
  })

  useEffect(() => {
    fetchData()
  }, [dateFilter, selectedDate])

  // Handle date filter change
  const handleDateFilterChange = (filter) => {
    setDateFilter(filter)
    const today = new Date()
    
    switch(filter) {
      case 'today':
        setSelectedDate(today.toISOString().split('T')[0])
        break
      case 'tomorrow':
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        setSelectedDate(tomorrow.toISOString().split('T')[0])
        break
      case 'yesterday':
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        setSelectedDate(yesterday.toISOString().split('T')[0])
        break
      case 'all':
        setSelectedDate('') // Empty means all
        break
      case 'custom':
        // Keep current selectedDate
        break
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('🚀 Fetching arrivals and departures for:', dateFilter === 'all' ? 'ALL' : selectedDate)
      
      // Fetch ARRIVALS from Reservations table
      // Arrivals = All reservations (or filtered by date)
      const arrivalsResponse = await axios.get('/reservations', {
        params: {
          page: 1,
          pageSize: 1000
        }
      })

      console.log('✅ Reservations response:', arrivalsResponse.data)

      if (arrivalsResponse.data && arrivalsResponse.data.success) {
        const allReservations = arrivalsResponse.data.data || []
        
        // Filter for arrivals
        let arrivalsData = allReservations
        
        if (dateFilter !== 'all') {
          // Filter by selected date
          arrivalsData = allReservations.filter(res => {
            // Check if checkInDate exists and is valid
            if (!res.checkInDate) return false
            
            try {
              const checkInDate = new Date(res.checkInDate)
              if (isNaN(checkInDate.getTime())) return false // Invalid date
              
              const checkInDateStr = checkInDate.toISOString().split('T')[0]
              return checkInDateStr === selectedDate
            } catch (error) {
              console.warn('Invalid checkInDate:', res.checkInDate)
              return false
            }
          })
        }
        
        const totalArrivals = arrivalsData.length
        const expectedArrivals = arrivalsData.filter(r => r.status === 'Reserved' || r.status === 'Confirmed' || r.status === 'Pending').length
        const checkedInArrivals = arrivalsData.filter(r => r.status === 'CheckedIn').length
        
        setArrivals(arrivalsData)
        setStats(prev => ({
          ...prev,
          totalArrivals,
          expectedArrivals,
          checkedInArrivals
        }))
      }

      // Fetch DEPARTURES from CheckInMasters table
      // Departures = All check-ins (or filtered by checkout date)
      const departuresResponse = await axios.get('/checkins', {
        params: {
          page: 1,
          pageSize: 1000
        }
      })

      console.log('✅ CheckIns response:', departuresResponse.data)

      if (departuresResponse.data && departuresResponse.data.success) {
        const allCheckIns = departuresResponse.data.data || []
        
        // Filter for departures
        let departuresData = allCheckIns
        
        if (dateFilter !== 'all') {
          // Filter by selected date
          departuresData = allCheckIns.filter(checkin => {
            // Check if checkOutDate or expectedCheckOutDate exists and is valid
            const checkOutDateValue = checkin.checkOutDate || checkin.expectedCheckOutDate
            if (!checkOutDateValue) return false
            
            try {
              const checkOutDate = new Date(checkOutDateValue)
              if (isNaN(checkOutDate.getTime())) return false // Invalid date
              
              const checkOutDateStr = checkOutDate.toISOString().split('T')[0]
              return checkOutDateStr === selectedDate
            } catch (error) {
              console.warn('Invalid checkOutDate:', checkOutDateValue)
              return false
            }
          })
        }
        
        const totalDepartures = departuresData.length
        const expectedDepartures = departuresData.filter(d => d.status === 'CheckedIn').length
        const checkedOutDepartures = departuresData.filter(d => d.status === 'CheckedOut').length
        
        setDepartures(departuresData)
        setStats(prev => ({
          ...prev,
          totalDepartures,
          expectedDepartures,
          checkedOutDepartures
        }))
      }

    } catch (err) {
      console.error('❌ Error fetching data:', err)
      setError(err.response?.data?.message || 'Failed to fetch arrival/departure data')
    } finally {
      setLoading(false)
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  // Calculate nights
  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'CheckedIn': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      'CheckedOut': { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle },
      'Reserved': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      'Pending': { bg: 'bg-orange-100', text: 'text-orange-800', icon: AlertCircle },
      'Cancelled': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
    }
    
    const config = statusConfig[status] || statusConfig['Pending']
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon size={14} />
        {status}
      </span>
    )
  }

  const filterData = (data) => {
    if (!searchTerm) return data

    return data.filter(item => 
      item.guest?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.guest?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.room?.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reservationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.room?.roomType?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.roomType?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const exportToCSV = () => {
    const data = activeTab === 'arrivals' ? arrivals : departures
    const headers = ['Guest Name', 'Room', 'Date', 'Status', 'Reservation #']
    const rows = data.map(item => [
      item.guest?.fullName || item.guest?.name || item.guestName || 'N/A',
      item.room?.roomNumber || item.roomNumber || 'Not Assigned',
      activeTab === 'arrivals' ? item.checkInDate : item.checkOutDate,
      item.status,
      item.reservationNumber || 'N/A'
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeTab}_${selectedDate}.csv`
    a.click()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="text-purple-600" size={32} />
            Arrival & Departure Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Track guest check-ins and check-outs</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateFilter}
            onChange={(e) => handleDateFilterChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
          >
            <option value="all">All Records</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="yesterday">Yesterday</option>
          </select>
          {dateFilter !== 'all' && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                setDateFilter('custom')
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          )}
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Expected Arrivals</p>
              <p className="text-3xl font-bold mt-2">{stats.expectedArrivals}</p>
            </div>
            <LogIn size={40} className="opacity-80" />
          </div>
          <div className="mt-4 text-sm text-green-100">
            {stats.checkedInArrivals} checked in, {stats.expectedArrivals - stats.checkedInArrivals} pending
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Expected Departures</p>
              <p className="text-3xl font-bold mt-2">{stats.expectedDepartures}</p>
            </div>
            <LogOut size={40} className="opacity-80" />
          </div>
          <div className="mt-4 text-sm text-blue-100">
            {stats.checkedOutDepartures} checked out, {stats.expectedDepartures - stats.checkedOutDepartures} pending
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Occupancy Rate</p>
              <p className="text-3xl font-bold mt-2">
                {stats.totalArrivals > 0 ? Math.round((stats.checkedInArrivals / stats.totalArrivals) * 100) : 0}%
              </p>
            </div>
            <Users size={40} className="opacity-80" />
          </div>
          <div className="mt-4 text-sm text-purple-100">
            Based on today's arrivals
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Pending Actions</p>
              <p className="text-3xl font-bold mt-2">{stats.expectedArrivals - stats.checkedInArrivals + stats.expectedDepartures - stats.checkedOutDepartures}</p>
            </div>
            <Clock size={40} className="opacity-80" />
          </div>
          <div className="mt-4 text-sm text-orange-100">
            Requires attention
          </div>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('arrivals')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === 'arrivals'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <LogIn size={18} />
              Arrivals ({stats.totalArrivals})
            </button>
            <button
              onClick={() => setActiveTab('departures')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === 'departures'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <LogOut size={18} />
              Departures ({stats.totalDepartures})
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search guest, room, or reservation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            >
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="animate-spin mx-auto text-purple-600 mb-4" size={40} />
            <p className="text-gray-600">Loading data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Guest Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Room</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {activeTab === 'arrivals' ? 'Arrival Date' : 'Departure Date'}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filterData(activeTab === 'arrivals' ? arrivals : departures).length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-gray-500">
                      <Users size={48} className="mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No {activeTab} found for {selectedDate}</p>
                      <p className="text-sm mt-2">Try selecting a different date or adjusting filters</p>
                    </td>
                  </tr>
                ) : (
                  filterData(activeTab === 'arrivals' ? arrivals : departures).map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{item.guest?.fullName || item.guest?.name || item.guestName || 'N/A'}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Phone size={12} />
                          {item.guest?.phone || item.guestPhone || item.phoneNumber || 'N/A'}
                        </div>
                        {(item.reservationNumber || item.reservation?.reservationNumber) && (
                          <div className="text-xs text-purple-600 mt-1">
                            Res# {item.reservationNumber || item.reservation?.reservationNumber}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                          {item.room?.roomNumber || item.roomNumber || 'Not Assigned'}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">{item.room?.roomType?.name || item.roomType || ''}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        <div className="font-medium">{formatDate(activeTab === 'arrivals' ? item.checkInDate : (item.checkOutDate || item.expectedCheckOutDate))}</div>
                        <div className="text-xs text-gray-500">{calculateNights(item.checkInDate, item.checkOutDate || item.expectedCheckOutDate)} nights</div>
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(item.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArrivalDeparture
