import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  CurrencyDollarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

const RoomRates = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    rateName: '',
    rateCode: '',
    hotelId: '',
    roomTypeId: '',
    baseRate: '',
    discountRate: '',
    days: [],
    seasonType: 'Regular',
    validFrom: '',
    validTo: '',
    minStay: 1,
    maxStay: 30,
    closedToArrival: false,
    closedToDeparture: false,
    description: '',
    isActive: true
  })

  const [rates, setRates] = useState([])
  const [roomTypes, setRoomTypes] = useState([])
  const [hotels, setHotels] = useState([])
  const [selectedHotelId, setSelectedHotelId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})

  // Load room rates and room types on component mount
  useEffect(() => {
    fetchRoomRates()
    fetchHotels()
    fetchRoomTypes()
  }, [])

  // Keep selectedHotelId in sync with formData.hotelId when modal is open
  useEffect(() => {
    if (!showForm) return
    setSelectedHotelId(formData.hotelId || '')
  }, [showForm, formData.hotelId])

  // Fetch hotels from API
  const fetchHotels = async () => {
    try {
      const response = await axios.get('/Hotels')
      if (response.data && response.data.success) {
        setHotels(response.data.data || [])
      } else {
        setHotels([])
      }
    } catch (err) {
      console.error('Error fetching hotels:', err)
      setHotels([])
    }
  }

  // Fetch room types from API
  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get('/RoomsManagement/room-types')
      if (response.data && response.data.success) {
        setRoomTypes(response.data.data || [])
      }
    } catch (err) {
      console.error('Error fetching room types:', err)
    }
  }

  // Fetch room rates from API - PURE API CALL
  const fetchRoomRates = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/RoomsManagement/room-rates')
      
      if (response.data && response.data.success) {
        setRates(response.data.data)
      } else {
        setError('No room rates data received')
        setRates([])
      }
    } catch (err) {
      console.error('Error fetching room rates:', err)
      setError('Failed to load room rates. Please check API connection.')
      setRates([])
    } finally {
      setLoading(false)
    }
  }

  // Form validation
  const validateForm = () => {
    const newErrors = {}
    if (!formData.rateName.trim()) newErrors.rateName = 'Rate name is required'
    if (!formData.rateCode.trim()) newErrors.rateCode = 'Rate code is required'
    if (!formData.hotelId) newErrors.hotelId = 'Hotel is required'
    if (!formData.roomTypeId) newErrors.roomTypeId = 'Room type is required'
    if (!formData.baseRate || formData.baseRate <= 0) newErrors.baseRate = 'Valid base rate is required'
    if (!formData.days || formData.days.length === 0) newErrors.days = 'Please select at least one day'
    if (!formData.validFrom) newErrors.validFrom = 'Valid from date is required'
    if (!formData.validTo) newErrors.validTo = 'Valid to date is required'
    if (formData.validFrom && formData.validTo && formData.validFrom >= formData.validTo) {
      newErrors.validTo = 'Valid to date must be after valid from date'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Create/Update room rate - PURE API CALL
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      setError('')
      setSuccess('')
      
      // Map frontend form to backend API structure
      const payload = {
        roomTypeId: parseInt(formData.roomTypeId),
        rateCode: formData.rateCode?.trim(),
        rateName: formData.rateName?.trim(),
        description: formData.description?.trim(),
        baseRate: parseFloat(formData.baseRate || 0),
        weekendRate: 0,
        discountRate: 0,
        days: (formData.days || []).join(','),
        minStay: formData.minStay ? parseInt(formData.minStay, 10) : null,
        maxStay: formData.maxStay ? parseInt(formData.maxStay, 10) : null,
        closedToArrival: !!formData.closedToArrival,
        closedToDeparture: !!formData.closedToDeparture,
        seasonalRate: 0,
        season: formData.seasonType,
        effectiveFrom: formData.validFrom,
        effectiveTo: formData.validTo,
        currency: 'PKR',
        includesBreakfast: false,
        includesTax: false,
        taxPercentage: 0,
        terms: '',
        isActive: formData.isActive
      }
      
      const response = editingId 
        ? await axios.put(`/RoomsManagement/room-rates/${editingId}`, payload)
        : await axios.post('/RoomsManagement/room-rates', payload)
      
      if (response.data && response.data.success) {
        setSuccess(editingId ? 'Room rate updated successfully' : 'Room rate created successfully')
        fetchRoomRates() // Refresh data
        setShowForm(false)
        resetForm()
      } else {
        setError('Failed to save room rate')
      }
    } catch (err) {
      console.error('Error saving room rate:', err)
      setError(err.response?.data?.message || 'Failed to save room rate')
    } finally {
      setLoading(false)
    }
  }

  // Delete room rate - PURE API CALL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room rate?')) return

    try {
      setLoading(true)
      const response = await axios.delete(`/RoomsManagement/room-rates/${id}`)
      
      if (response.data && response.data.success) {
        setSuccess('Room rate deleted successfully')
        fetchRoomRates() // Refresh data
      } else {
        setError('Failed to delete room rate')
      }
    } catch (err) {
      console.error('Error deleting room rate:', err)
      setError(err.response?.data?.message || 'Failed to delete room rate')
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      rateName: '',
      rateCode: '',
      hotelId: '',
      roomTypeId: '',
      baseRate: '',
      discountRate: 0,
      days: [],
      seasonType: 'Regular',
      validFrom: '',
      validTo: '',
      minStay: 1,
      maxStay: 30,
      closedToArrival: false,
      closedToDeparture: false,
      description: '',
      isActive: true
    })
    setSelectedHotelId('')
    setEditingId(null)
    setErrors({})
    setError('')
  }

  const weekdayOptions = [
    { key: 'Mon', label: 'Mon' },
    { key: 'Tue', label: 'Tue' },
    { key: 'Wed', label: 'Wed' },
    { key: 'Thu', label: 'Thu' },
    { key: 'Fri', label: 'Fri' },
    { key: 'Sat', label: 'Sat' },
    { key: 'Sun', label: 'Sun' }
  ]

  const normalizeRoomTypeNameToPrefix = (name) => {
    const cleaned = (name || '').replace(/[^a-zA-Z0-9]/g, '')
    if (!cleaned) return 'RT'
    return cleaned.slice(0, 3).toUpperCase()
  }

  const getNextRateCode = (prefix) => {
    const prefixWithDash = `${prefix}-`
    const nums = (rates || [])
      .map((r) => r.rateCode || r.RateCode || '')
      .filter((code) => typeof code === 'string' && code.startsWith(prefixWithDash))
      .map((code) => {
        const n = parseInt(code.slice(prefixWithDash.length), 10)
        return Number.isFinite(n) ? n : null
      })
      .filter((n) => n !== null)

    const next = (nums.length ? Math.max(...nums) : 0) + 1
    return `${prefix}-${String(next).padStart(3, '0')}`
  }

  const handleRoomTypeChange = (roomTypeId) => {
    const selected = roomTypes.find((rt) => String(rt.id ?? rt.Id) === String(roomTypeId))
    const prefix = normalizeRoomTypeNameToPrefix(selected?.name || selected?.Name)
    const nextCode = getNextRateCode(prefix)

    setFormData((prev) => ({
      ...prev,
      roomTypeId,
      rateCode: editingId ? prev.rateCode : nextCode
    }))
  }

  // Handle edit
  const handleEdit = (rate) => {
    const formatDateForInput = (dateValue) => {
      if (!dateValue) return ''
      const d = new Date(dateValue)
      if (Number.isNaN(d.getTime())) return ''
      return d.toISOString().split('T')[0]
    }

    const resolvedRoomTypeId = rate.roomTypeId || rate.RoomTypeId || ''
    const resolvedHotelId =
      rate.hotelId ||
      rate.HotelId ||
      rate.roomType?.hotelId ||
      rate.roomType?.HotelId ||
      roomTypes.find((rt) => (rt.id ?? rt.Id) === resolvedRoomTypeId)?.hotelId ||
      roomTypes.find((rt) => (rt.id ?? rt.Id) === resolvedRoomTypeId)?.HotelId ||
      ''

    // Map API response fields to form structure
    setFormData({
      rateName: rate.rateName || rate.name || '',
      rateCode: rate.rateCode || rate.code || '',
      hotelId: resolvedHotelId ? String(resolvedHotelId) : '',
      roomTypeId: resolvedRoomTypeId ? String(resolvedRoomTypeId) : '',
      baseRate: rate.baseRate || rate.base || '',
      discountRate: 0,
      days: String(rate.days ?? rate.Days ?? '').split(',').map((d) => d.trim()).filter(Boolean),
      seasonType: rate.seasonType || rate.season || 'Regular',
      validFrom: formatDateForInput(rate.validFrom || rate.effectiveFrom || rate.EffectiveFrom),
      validTo: formatDateForInput(rate.validTo || rate.effectiveTo || rate.EffectiveTo),
      minStay: rate.minStay ?? rate.MinStay ?? 1,
      maxStay: rate.maxStay ?? rate.MaxStay ?? 30,
      closedToArrival: rate.closedToArrival ?? rate.ClosedToArrival ?? false,
      closedToDeparture: rate.closedToDeparture ?? rate.ClosedToDeparture ?? false,
      description: rate.description || '',
      isActive: rate.isActive ?? true
    })
    setEditingId(rate.id)
    setShowForm(true)
  }

  // Filter rates based on search
  const filteredRates = rates.filter(rate =>
    rate.rateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rate.rateCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rate.roomType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rate.seasonType?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredRoomTypes = selectedHotelId
    ? roomTypes.filter((rt) => {
        const rtHotelId = rt.hotelId ?? rt.HotelId ?? rt.hotel?.id ?? rt.hotel?.Id
        return String(rtHotelId ?? '') === String(selectedHotelId)
      })
    : roomTypes

  const getHotelNameForRate = (rate) => {
    const hotelId =
      rate.hotelId ||
      rate.HotelId ||
      rate.roomType?.hotelId ||
      rate.roomType?.HotelId ||
      roomTypes.find((rt) => (rt.id ?? rt.Id) === (rate.roomTypeId ?? rate.RoomTypeId))?.hotelId ||
      roomTypes.find((rt) => (rt.id ?? rt.Id) === (rate.roomTypeId ?? rate.RoomTypeId))?.HotelId

    const hotel = hotels.find((h) => String(h.id ?? h.Id) === String(hotelId ?? ''))
    return hotel?.hotelName || hotel?.HotelName || ''
  }

  return (
    <div className="space-y-6 px-3 py-4 sm:px-4 sm:py-4 md:px-6 md:py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Room Rates</h1>
              <p className="text-gray-600">Manage room pricing and seasonal rates</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center space-x-2 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Rate</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hotel</label>
            <select
              value={selectedHotelId}
              onChange={(e) => setSelectedHotelId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Hotels</option>
              {hotels.map((h) => (
                <option key={h.id || h.Id} value={h.id || h.Id}>
                  {h.hotelName || h.HotelName}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Search room rates..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {!showForm && error && (
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

      {/* Room Rates Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-gradient-to-r from-purple-50 via-white to-pink-50 px-6 py-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Room Rates List</h2>
              <p className="text-sm text-slate-500">Professional view of rates, validity, and status</p>
            </div>
            <div className="text-sm font-medium text-slate-500">{filteredRates.length} record(s)</div>
          </div>
        </div>
        <div className="overflow-auto max-h-[70vh]">
          <table className="w-full divide-y divide-slate-200">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">SR No</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Rate Name</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Room Type</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Base Rate</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Days</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Min/Max</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">CTA/CTD</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Valid Period</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Status</th>
                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="10" className="px-4 py-3 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading room rates...</p>
                  </td>
                </tr>
              ) : filteredRates.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-4 py-3 text-center text-gray-500">
                    No room rates found
                  </td>
                </tr>
              ) : (
                filteredRates
                  .filter((rate) => {
                    if (!selectedHotelId) return true
                    const rateHotelId =
                      rate.hotelId ||
                      rate.HotelId ||
                      rate.roomType?.hotelId ||
                      rate.roomType?.HotelId ||
                      roomTypes.find((rt) => (rt.id ?? rt.Id) === (rate.roomTypeId ?? rate.RoomTypeId))?.hotelId ||
                      roomTypes.find((rt) => (rt.id ?? rt.Id) === (rate.roomTypeId ?? rate.RoomTypeId))?.HotelId

                    return String(rateHotelId ?? '') === String(selectedHotelId)
                  })
                  .map((rate, index) => {
                    const rateId = rate.id ?? rate.Id
                    const roomTypeName = rate.roomType?.name || rate.roomType?.Name || rate.roomType || rate.RoomType?.Name || 'N/A'
                    const daysValue = String(rate.days ?? rate.Days ?? '').trim()
                    const minStayValue = rate.minStay ?? rate.MinStay
                    const maxStayValue = rate.maxStay ?? rate.MaxStay
                    const closedToArrival = rate.closedToArrival ?? rate.ClosedToArrival ?? false
                    const closedToDeparture = rate.closedToDeparture ?? rate.ClosedToDeparture ?? false
                    const isActive = rate.isActive ?? rate.IsActive
                    const effectiveFrom = rate.effectiveFrom || rate.EffectiveFrom || rate.effectiveDate || rate.EffectiveDate
                    const effectiveTo = rate.effectiveTo || rate.EffectiveTo || rate.expiryDate || rate.ExpiryDate

                    return (
                  <tr key={rateId} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'} transition hover:bg-purple-50/50`}>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-semibold text-slate-900">
                      {index + 1}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{rate.rateName || rate.RateName}</div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{roomTypeName}</div>
                      <div className="text-xs text-gray-500">{getHotelNameForRate(rate) || 'N/A'}</div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                      Rs {((rate.baseRate ?? rate.BaseRate ?? 0) || 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900">
                      <div className="break-words leading-tight">{daysValue || '-'}</div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                      {minStayValue ?? '-'}/{maxStayValue ?? '-'}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                      {closedToArrival ? 'Y' : 'N'}/{closedToDeparture ? 'Y' : 'N'}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div className="leading-tight">
                        <div>{effectiveFrom?.split('T')[0]}</div>
                        <div className="text-gray-400">to</div>
                        <div>{effectiveTo?.split('T')[0]}</div>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-center">
                      <div className="inline-flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleEdit(rate)}
                          className="rounded-lg p-1.5 text-purple-600 transition hover:bg-purple-50 hover:text-purple-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(rateId)}
                          className="rounded-lg p-1.5 text-red-600 transition hover:bg-red-50 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                    )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingId ? 'Edit Room Rate' : 'Add New Room Rate'}
              </h3>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <XCircleIcon className="h-5 w-5 text-red-400 mr-2 mt-0.5 shrink-0" />
                    <span className="text-red-700 text-sm sm:text-base">{error}</span>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hotel *</label>
                    <select
                      value={formData.hotelId}
                      onChange={(e) => {
                        const newHotelId = e.target.value
                        setFormData((prev) => ({
                          ...prev,
                          hotelId: newHotelId,
                          roomTypeId: '',
                          rateCode: ''
                        }))
                        setSelectedHotelId(newHotelId)
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.hotelId ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Hotel</option>
                      {hotels.map((h) => (
                        <option key={h.id || h.Id} value={h.id || h.Id}>
                          {h.hotelName || h.HotelName}
                        </option>
                      ))}
                    </select>
                    {errors.hotelId && <p className="text-red-500 text-xs mt-1">{errors.hotelId}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Type *</label>
                    <select
                      value={formData.roomTypeId}
                      onChange={(e) => handleRoomTypeChange(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.roomTypeId ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Room Type</option>
                      {filteredRoomTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name || type.Name}
                        </option>
                      ))}
                    </select>
                    {errors.roomTypeId && <p className="text-red-500 text-xs mt-1">{errors.roomTypeId}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rate Name *</label>
                    <input
                      type="text"
                      value={formData.rateName}
                      onChange={(e) => setFormData({ ...formData, rateName: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.rateName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Standard Regular Rate"
                    />
                    {errors.rateName && <p className="text-red-500 text-xs mt-1">{errors.rateName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rate Code *</label>
                    <input
                      type="text"
                      value={formData.rateCode}
                      readOnly
                      className={`w-full px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.rateCode ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Auto Generated"
                    />
                    {errors.rateCode && <p className="text-red-500 text-xs mt-1">{errors.rateCode}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Rate (Rs) *</label>
                    <input
                      type="number"
                      value={formData.baseRate}
                      onChange={(e) => setFormData({...formData, baseRate: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.baseRate ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="8000"
                    />
                    {errors.baseRate && <p className="text-red-500 text-xs mt-1">{errors.baseRate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Season Type</label>
                    <select
                      value={formData.seasonType}
                      onChange={(e) => setFormData({...formData, seasonType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Regular">Regular</option>
                      <option value="Peak">Peak</option>
                      <option value="High">High</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valid From *</label>
                    <input
                      type="date"
                      value={formData.validFrom}
                      onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.validFrom ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.validFrom && <p className="text-red-500 text-xs mt-1">{errors.validFrom}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valid To *</label>
                    <input
                      type="date"
                      value={formData.validTo}
                      onChange={(e) => setFormData({...formData, validTo: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.validTo ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.validTo && <p className="text-red-500 text-xs mt-1">{errors.validTo}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Stay (nights)</label>
                    <input
                      type="number"
                      value={formData.minStay}
                      onChange={(e) => setFormData({...formData, minStay: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Stay (nights)</label>
                    <input
                      type="number"
                      value={formData.maxStay}
                      onChange={(e) => setFormData({...formData, maxStay: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center h-full pt-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.closedToArrival}
                        onChange={(e) => setFormData({ ...formData, closedToArrival: e.target.checked })}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Closed To Arrival (CTA)</span>
                    </label>
                  </div>

                  <div className="flex items-center h-full pt-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.closedToDeparture}
                        onChange={(e) => setFormData({ ...formData, closedToDeparture: e.target.checked })}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Closed To Departure (CTD)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Days *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {weekdayOptions.map((d) => {
                      const checked = (formData.days || []).includes(d.key)
                      return (
                        <label key={d.key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const nextDays = e.target.checked
                                ? [...(formData.days || []), d.key]
                                : (formData.days || []).filter((x) => x !== d.key)
                              setFormData({ ...formData, days: nextDays })
                            }}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700">{d.label}</span>
                        </label>
                      )
                    })}
                  </div>
                  {errors.days && <p className="text-red-500 text-xs mt-1">{errors.days}</p>}
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Rate description..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      resetForm()
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomRates;
