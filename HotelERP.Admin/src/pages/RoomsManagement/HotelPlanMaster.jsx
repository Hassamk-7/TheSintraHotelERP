import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  CalendarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const HotelPlanMaster = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterHotelId, setFilterHotelId] = useState('')
  const [filterRoomTypeId, setFilterRoomTypeId] = useState('')
  const [formData, setFormData] = useState({
    hotelId: '',
    roomTypeIds: [],
    planName: '',
    planCode: '',
    description: '',
    planType: 'Room Only',
    extraPersonRate: '',
    validFrom: '',
    validTo: '',
    stopSell: false,
    closedToArrival: false,
    closedToArrivalValidFrom: '',
    closedToArrivalValidTo: '',
    closedToDeparture: false,
    closedToDepartureValidFrom: '',
    closedToDepartureValidTo: '',
    priceAdjustmentType: 'more_expensive',
    priceDifferenceType: 'amount',
    priceDifferenceValue: '',
    inclusions: '',
    exclusions: '',
    cancellationPolicy: '',
    ota: false,
    addToChannelManager: false,
    advancePayment: '',
    seasonality: 'All Year',
    isActive: true
  })

  const [plans, setPlans] = useState([])
  const [hotels, setHotels] = useState([])
  const [roomTypes, setRoomTypes] = useState([])
  const [cancellationPolicies, setCancellationPolicies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const selectedCancellationPolicy = cancellationPolicies.find((policy) => policy.code === formData.cancellationPolicy)

  const showNotification = (type, message) => {
    if (type === 'success') {
      setError('')
      setSuccess(message)
      setTimeout(() => setSuccess(''), 3000)
      return
    }

    setSuccess('')
    setError(message)
    setTimeout(() => setError(''), 4000)
  }

  const fetchHotels = async () => {
    try {
      const res = await axios.get('/Hotels')
      const data = res?.data?.data ?? res?.data ?? []
      setHotels(Array.isArray(data) ? data : [])
    } catch (e) {
      setHotels([])
    }
  }

  const fetchRoomTypes = async () => {
    try {
      const res = await axios.get('/RoomsManagement/room-types')
      const data = res?.data?.data ?? []
      setRoomTypes(Array.isArray(data) ? data : [])
    } catch (e) {
      setRoomTypes([])
    }
  }

  const fetchCancellationPolicies = async () => {
    try {
      const res = await axios.get('/cancellationpolicy/hotel/1')
      const data = res?.data?.data ?? []
      setCancellationPolicies(Array.isArray(data) ? data : [])
    } catch (e) {
      setCancellationPolicies([])
    }
  }

  // Fetch plans from API
  const fetchPlans = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/Plans')
      
      if (response.data && response.data.success) {
        // Map API response to frontend format
        const mappedPlans = response.data.data.map(plan => ({
          id: plan.id,
          hotelId: plan.hotelId,
          hotelName: plan.hotelName,
          roomTypeIds: plan.roomTypeIds || [],
          roomTypes: plan.roomTypes || [],
          planName: plan.name,
          planCode: plan.code,
          description: plan.description,
          planType: plan.name,
          extraPersonRate: plan.basePrice,
          validFrom: plan.validFrom || '',
          validTo: plan.validTo || '',
          stopSell: plan.stopSell ?? false,
          closedToArrival: plan.closedToArrival ?? false,
          closedToArrivalValidFrom: plan.closedToArrivalValidFrom || '',
          closedToArrivalValidTo: plan.closedToArrivalValidTo || '',
          closedToDeparture: plan.closedToDeparture ?? false,
          closedToDepartureValidFrom: plan.closedToDepartureValidFrom || '',
          closedToDepartureValidTo: plan.closedToDepartureValidTo || '',
          priceAdjustmentType: plan.priceAdjustmentType || 'more_expensive',
          priceDifferenceType: plan.priceDifferenceType || 'amount',
          priceDifferenceValue: plan.priceDifferenceValue ?? '',
          childRate: 0,
          inclusions: getInclusions(plan),
          exclusions: getExclusions(plan),
          cancellationPolicy: plan.cancellationPolicyCode || plan.termsAndConditions || '',
          cancellationPolicyDescription: plan.cancellationPolicyDescription || '',
          ota: plan.ota ?? false,
          addToChannelManager: plan.addToChannelManager ?? false,
          advancePayment: 30,
          seasonality: 'All Year',
          isActive: plan.isActive
        }))
        setPlans(mappedPlans)
        setError('')
      } else {
        showNotification('error', 'Failed to fetch plans')
      }
    } catch (err) {
      console.error('Error fetching plans:', err)
      showNotification('error', 'Error loading plans. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get inclusions based on plan
  const getInclusions = (plan) => {
    let inclusions = ['Room', 'WiFi', 'Basic amenities']
    if (plan.isBreakfastIncluded) inclusions.push('Breakfast')
    if (plan.isLunchIncluded) inclusions.push('Lunch')
    if (plan.isDinnerIncluded) inclusions.push('Dinner')
    return inclusions.join(', ')
  }

  // Helper function to get exclusions based on plan
  const getExclusions = (plan) => {
    let exclusions = ['Laundry', 'Room service']
    if (!plan.isBreakfastIncluded) exclusions.unshift('Breakfast')
    if (!plan.isLunchIncluded) exclusions.unshift('Lunch')
    if (!plan.isDinnerIncluded) exclusions.unshift('Dinner')
    return exclusions.join(', ')
  }

  useEffect(() => {
    fetchPlans()
    fetchHotels()
    fetchRoomTypes()
    fetchCancellationPolicies()
  }, [])

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.hotelId) {
      newErrors.hotelId = 'Hotel is required'
    }

    if (!formData.roomTypeIds || formData.roomTypeIds.length === 0) {
      newErrors.roomTypeIds = 'At least one room type is required'
    }

    if (!formData.planName.trim()) {
      newErrors.planName = 'Plan name is required'
    }

    if (!formData.planCode.trim()) {
      newErrors.planCode = 'Plan code is required'
    }

    if (formData.validFrom && formData.validTo && formData.validFrom > formData.validTo) {
      newErrors.validTo = 'Valid To must be later than or equal to Valid From'
    }

    if (formData.closedToArrivalValidFrom && formData.closedToArrivalValidTo && formData.closedToArrivalValidFrom > formData.closedToArrivalValidTo) {
      newErrors.closedToArrivalValidTo = 'CTA Valid To must be later than or equal to CTA Valid From'
    }

    if (formData.closedToDepartureValidFrom && formData.closedToDepartureValidTo && formData.closedToDepartureValidFrom > formData.closedToDepartureValidTo) {
      newErrors.closedToDepartureValidTo = 'CTD Valid To must be later than or equal to CTD Valid From'
    }

    if (formData.priceDifferenceValue !== '' && Number(formData.priceDifferenceValue) < 0) {
      newErrors.priceDifferenceValue = 'Price difference must be 0 or greater'
    }


    if (formData.extraPersonRate === '' || parseFloat(formData.extraPersonRate) < 0) {
      newErrors.extraPersonRate = 'Valid plan price (surcharge) is required'
    }

    // Check for duplicate code
    const existingPlan = plans.find(plan => 
      plan.planCode.toLowerCase() === formData.planCode.toLowerCase() && 
      plan.id !== editingId
    )
    if (existingPlan) {
      newErrors.planCode = 'Plan code already exists'
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
    
    try {
      const payload = {
        hotelId: parseInt(formData.hotelId),
        roomTypeIds: (formData.roomTypeIds || []).map((x) => parseInt(x)).filter(Boolean),
        name: formData.planName,
        code: formData.planCode,
        description: formData.description,
        basePrice: parseFloat(formData.extraPersonRate) || 0,
        validFrom: formData.validFrom || null,
        validTo: formData.validTo || null,
        stopSell: !!formData.stopSell,
        closedToArrival: !!formData.closedToArrival,
        closedToArrivalValidFrom: formData.closedToArrivalValidFrom || null,
        closedToArrivalValidTo: formData.closedToArrivalValidTo || null,
        closedToDeparture: !!formData.closedToDeparture,
        closedToDepartureValidFrom: formData.closedToDepartureValidFrom || null,
        closedToDepartureValidTo: formData.closedToDepartureValidTo || null,
        priceAdjustmentType: formData.priceAdjustmentType,
        priceDifferenceType: formData.priceDifferenceType,
        priceDifferenceValue: formData.priceDifferenceValue === '' ? null : parseFloat(formData.priceDifferenceValue),
        isBreakfastIncluded: String(formData.planType).toLowerCase().includes('breakfast'),
        isLunchIncluded: String(formData.planType).toLowerCase().includes('lunch'),
        isDinnerIncluded: String(formData.planType).toLowerCase().includes('dinner'),
        termsAndConditions: formData.cancellationPolicy,
        ota: !!formData.ota,
        addToChannelManager: !!formData.addToChannelManager,
        isActive: formData.isActive
      }

      if (editingId) {
        await axios.put(`/Plans/${editingId}`, payload)
      } else {
        await axios.post('/Plans', payload)
      }

      await fetchPlans()
      
      handleCancel()
      showNotification('success', editingId ? 'Rate plan updated successfully!' : 'Rate plan created successfully!')
    } catch (error) {
      console.error('Error saving plan:', error)
      showNotification('error', 'Error saving plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (plan) => {
    setFormData({
      hotelId: (plan.hotelId || '').toString(),
      roomTypeIds: (plan.roomTypeIds || []).map((x) => x.toString()),
      planName: plan.planName,
      planCode: plan.planCode,
      description: plan.description,
      planType: plan.planType,
      extraPersonRate: plan.extraPersonRate.toString(),
      validFrom: plan.validFrom ? String(plan.validFrom).split('T')[0] : '',
      validTo: plan.validTo ? String(plan.validTo).split('T')[0] : '',
      stopSell: !!plan.stopSell,
      closedToArrival: !!plan.closedToArrival,
      closedToArrivalValidFrom: plan.closedToArrivalValidFrom ? String(plan.closedToArrivalValidFrom).split('T')[0] : '',
      closedToArrivalValidTo: plan.closedToArrivalValidTo ? String(plan.closedToArrivalValidTo).split('T')[0] : '',
      closedToDeparture: !!plan.closedToDeparture,
      closedToDepartureValidFrom: plan.closedToDepartureValidFrom ? String(plan.closedToDepartureValidFrom).split('T')[0] : '',
      closedToDepartureValidTo: plan.closedToDepartureValidTo ? String(plan.closedToDepartureValidTo).split('T')[0] : '',
      priceAdjustmentType: plan.priceAdjustmentType || 'more_expensive',
      priceDifferenceType: plan.priceDifferenceType || 'amount',
      priceDifferenceValue: plan.priceDifferenceValue?.toString?.() ?? '',
      inclusions: plan.inclusions,
      exclusions: plan.exclusions,
      cancellationPolicy: plan.cancellationPolicy,
      ota: !!plan.ota,
      addToChannelManager: !!plan.addToChannelManager,
      advancePayment: plan.advancePayment.toString(),
      seasonality: plan.seasonality,
      isActive: plan.isActive
    })
    setEditingId(plan.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this rate plan?')) {
      try {
        await axios.delete(`/Plans/${id}`)
        await fetchPlans()
        showNotification('success', 'Rate plan deleted successfully!')
      } catch (e) {
        showNotification('error', 'Error deleting rate plan. Please try again.')
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      hotelId: '',
      roomTypeIds: [],
      planName: '',
      planCode: '',
      description: '',
      planType: 'Room Only',
      extraPersonRate: '',
      validFrom: '',
      validTo: '',
      stopSell: false,
      closedToArrival: false,
      closedToArrivalValidFrom: '',
      closedToArrivalValidTo: '',
      closedToDeparture: false,
      closedToDepartureValidFrom: '',
      closedToDepartureValidTo: '',
      priceAdjustmentType: 'more_expensive',
      priceDifferenceType: 'amount',
      priceDifferenceValue: '',
      inclusions: '',
      exclusions: '',
      cancellationPolicy: '',
      cancellationPolicyDescription: '',
      ota: false,
      addToChannelManager: false,
      advancePayment: '',
      seasonality: 'All Year',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredPlans = plans.filter(plan =>
    (plan.planName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (plan.planCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (plan.planType || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredPlansByHotel = filteredPlans.filter((p) => {
    if (!filterHotelId) return true
    return String(p.hotelId ?? '') === String(filterHotelId)
  })

  const filteredPlansByHotelAndRoomType = filteredPlansByHotel.filter((p) => {
    if (!filterRoomTypeId) return true
    const ids = Array.isArray(p.roomTypeIds) ? p.roomTypeIds : []
    return ids.map((x) => String(x)).includes(String(filterRoomTypeId))
  })

  const roomTypesForHotelFilter = roomTypes.filter((rt) => {
    if (!filterHotelId) return true
    return String(rt.hotelId) === String(filterHotelId) || String(rt.HotelId) === String(filterHotelId)
  })

  const roomTypesForSelectedHotel = roomTypes.filter((rt) => {
    if (!formData.hotelId) return true
    return String(rt.hotelId) === String(formData.hotelId) || String(rt.HotelId) === String(formData.hotelId)
  })

  const getHotelName = (plan) => {
    const direct = (plan?.hotelName ?? '').toString().trim()
    if (direct) return direct
    const hid = plan?.hotelId ?? null
    const h = hotels.find((x) => String(x.id ?? x.Id) === String(hid))
    return (h?.hotelName ?? h?.HotelName ?? h?.name ?? h?.Name ?? '').toString() || 'N/A'
  }

  const getRoomTypeNames = (plan) => {
    // API may return roomTypes as string[] or as [{id,name}] etc.
    const rtList = Array.isArray(plan?.roomTypes) ? plan.roomTypes : []
    const fromRoomTypes = rtList
      .map((x) => {
        if (typeof x === 'string') return x
        if (x && typeof x === 'object') return x.name ?? x.Name ?? x.roomTypeName ?? x.RoomTypeName ?? null
        return null
      })
      .filter(Boolean)

    if (fromRoomTypes.length > 0) return fromRoomTypes

    const ids = Array.isArray(plan?.roomTypeIds) ? plan.roomTypeIds : []
    return ids
      .map((id) => {
        const rt = roomTypes.find((r) => String(r.id ?? r.Id) === String(id))
        return rt?.name ?? rt?.Name ?? null
      })
      .filter(Boolean)
  }

  const generatePlanCode = (name) => {
    const base = String(name || '')
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .slice(0, 4)

    if (!base) return ''

    const existingCodes = plans
      .filter((plan) => plan.id !== editingId)
      .map((plan) => String(plan.planCode || '').toUpperCase())

    let nextCode = `${base}001`
    let counter = 1

    while (existingCodes.includes(nextCode)) {
      counter += 1
      nextCode = `${base}${String(counter).padStart(3, '0')}`
    }

    return nextCode
  }

  const toggleRoomTypeSelection = (roomTypeId) => {
    const normalizedId = String(roomTypeId)
    const selectedIds = Array.isArray(formData.roomTypeIds) ? formData.roomTypeIds : []
    const nextRoomTypeIds = selectedIds.includes(normalizedId)
      ? selectedIds.filter((id) => id !== normalizedId)
      : [...selectedIds, normalizedId]

    setFormData({ ...formData, roomTypeIds: nextRoomTypeIds })
  }

  const handleSelectAllRoomTypes = () => {
    const allRoomTypeIds = roomTypesForSelectedHotel.map((rt) => String(rt.id ?? rt.Id))
    const selectedIds = Array.isArray(formData.roomTypeIds) ? formData.roomTypeIds : []
    const shouldSelectAll = allRoomTypeIds.some((id) => !selectedIds.includes(id))

    setFormData({
      ...formData,
      roomTypeIds: shouldSelectAll ? allRoomTypeIds : []
    })
  }

  const handlePlanNameChange = (value) => {
    setFormData({
      ...formData,
      planName: value,
      planCode: generatePlanCode(value)
    })
  }

  const openCreateForm = () => {
    handleCancel()
    setShowForm(true)
  }

  return (
    <div className="space-y-6 px-3 py-4 sm:px-4 sm:py-4 md:px-6 md:py-6">
      {(success || error) && (
        <div className="fixed top-6 right-6 z-[60] max-w-md w-full">
          <div className={`rounded-2xl shadow-2xl border overflow-hidden ${
            success
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 border-emerald-300 text-white'
              : 'bg-gradient-to-r from-rose-500 to-red-600 border-rose-300 text-white'
          }`}>
            <div className="flex items-start gap-3 px-5 py-4">
              <div className={`rounded-full p-2 ${success ? 'bg-white/20' : 'bg-black/10'}`}>
                <CheckCircleIcon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold tracking-wide uppercase">
                  {success ? 'Success' : 'Error'}
                </h3>
                <p className="mt-1 text-sm leading-5 text-white/95">{success || error}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSuccess('')
                  setError('')
                }}
                className="text-white/90 hover:text-white text-xl leading-none"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Rate Plans Master</h1>
            <p className="text-amber-100">Manage hotel accommodation rate plans and packages</p>
          </div>
          <CalendarIcon className="h-12 w-12 text-amber-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-amber-100 rounded-lg p-3">
              <CalendarIcon className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Plans</p>
              <p className="text-2xl font-bold text-gray-900">{plans.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Plans</p>
              <p className="text-2xl font-bold text-gray-900">
                {plans.filter(plan => plan.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Extra Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {Math.round(plans.reduce((sum, plan) => sum + (Number(plan.extraPersonRate) || 0), 0) / Math.max(1, plans.length)).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <CalendarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Premium Plans</p>
              <p className="text-2xl font-bold text-gray-900">
                {plans.filter(plan => plan.extraPersonRate >= 5000).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
          <div className="relative md:col-span-2">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search plans (name, code)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <select
              value={filterHotelId}
              onChange={(e) => {
                setFilterHotelId(e.target.value)
                setFilterRoomTypeId('')
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">All Hotels</option>
              {hotels.map((h) => (
                <option key={h.id ?? h.Id} value={(h.id ?? h.Id).toString()}>
                  {h.hotelName ?? h.HotelName ?? h.name ?? h.Name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterRoomTypeId}
              onChange={(e) => setFilterRoomTypeId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={!filterHotelId}
              title={!filterHotelId ? 'Select a hotel first' : ''}
            >
              <option value="">All Room Types</option>
              {roomTypesForHotelFilter.map((rt) => (
                <option key={rt.id ?? rt.Id} value={(rt.id ?? rt.Id).toString()}>
                  {rt.name ?? rt.Name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <button
          onClick={openCreateForm}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Plan
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 w-full max-w-7xl max-h-[92vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingId ? 'Edit Rate Plan' : 'Add New Rate Plan'}
              </h2>
              <button
                type="button"
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(92vh-88px)]">
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hotel <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.hotelId}
                    onChange={(e) => setFormData({ ...formData, hotelId: e.target.value, roomTypeIds: [] })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                      errors.hotelId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Hotel</option>
                    {hotels.map((h) => (
                      <option key={h.id ?? h.Id} value={(h.id ?? h.Id).toString()}>
                        {h.hotelName ?? h.HotelName ?? h.name ?? h.Name}
                      </option>
                    ))}
                  </select>
                  {errors.hotelId && (
                    <p className="mt-1 text-sm text-red-600">{errors.hotelId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Room Types <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                      errors.roomTypeIds ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">
                        {formData.roomTypeIds.length} selected
                      </span>
                      <button
                        type="button"
                        onClick={handleSelectAllRoomTypes}
                        className="text-sm font-medium text-amber-600 hover:text-amber-700"
                        disabled={!formData.hotelId || roomTypesForSelectedHotel.length === 0}
                      >
                        {roomTypesForSelectedHotel.length > 0 && roomTypesForSelectedHotel.every((rt) => formData.roomTypeIds.includes(String(rt.id ?? rt.Id)))
                          ? 'Clear All'
                          : 'Select All'}
                      </button>
                    </div>
                    <div className="max-h-36 overflow-y-auto space-y-2">
                      {roomTypesForSelectedHotel.length === 0 ? (
                        <p className="text-sm text-gray-500">Select hotel first to choose room types</p>
                      ) : (
                        roomTypesForSelectedHotel.map((rt) => {
                          const roomTypeId = String(rt.id ?? rt.Id)
                          const isChecked = formData.roomTypeIds.includes(roomTypeId)

                          return (
                            <label key={roomTypeId} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 hover:bg-amber-50 cursor-pointer">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{rt.name ?? rt.Name}</div>
                                <div className="text-xs text-gray-500">{rt.code ?? rt.Code ?? ''}</div>
                              </div>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleRoomTypeSelection(roomTypeId)}
                                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                              />
                            </label>
                          )
                        })
                      )}
                    </div>
                  </div>
                  {errors.roomTypeIds && (
                    <p className="mt-1 text-sm text-red-600">{errors.roomTypeIds}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Plan Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.planName}
                    onChange={(e) => handlePlanNameChange(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                      errors.planName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter plan name"
                  />
                  {errors.planName && (
                    <p className="mt-1 text-sm text-red-600">{errors.planName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Plan Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.planCode}
                    readOnly
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                      errors.planCode ? 'border-red-500' : 'border-gray-300 bg-gray-50'
                    }`}
                    placeholder="Auto generated"
                  />
                  {errors.planCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.planCode}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Plan Type</label>
                <select
                  value={formData.planType}
                  onChange={(e) => setFormData({...formData, planType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                >
                  <option value="Room Only">Room Only</option>
                  <option value="Bed & Breakfast">Bed & Breakfast</option>
                  <option value="Half Board">Half Board</option>
                  <option value="Full Board">Full Board</option>
                  <option value="All Inclusive">All Inclusive</option>
                </select>
              </div>

                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Plan Price (Rs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.extraPersonRate}
                  onChange={(e) => setFormData({...formData, extraPersonRate: e.target.value})}
                  min="0"
                  step="100"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                    errors.extraPersonRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="2000"
                />
                {errors.extraPersonRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.extraPersonRate}</p>
                )}
              </div>

                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Advance Payment (%)</label>
                <input
                  type="number"
                  value={formData.advancePayment}
                  onChange={(e) => setFormData({...formData, advancePayment: e.target.value})}
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  placeholder="50"
                />
              </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cancellation Policy</label>
                  <select
                    value={formData.cancellationPolicy}
                    onChange={(e) => setFormData({...formData, cancellationPolicy: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  >
                    <option value="">Select a Cancellation Policy</option>
                    {cancellationPolicies.map((policy) => (
                      <option key={policy.id} value={policy.code}>
                        {policy.name} ({policy.code})
                      </option>
                    ))}
                  </select>
                  {selectedCancellationPolicy?.description ? (
                    <p className="mt-2 text-sm text-gray-500 whitespace-normal break-words">
                      {selectedCancellationPolicy.description}
                    </p>
                  ) : null}
                </div>

                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Seasonality</label>
                <select
                  value={formData.seasonality}
                  onChange={(e) => setFormData({...formData, seasonality: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                >
                  <option value="All Year">All Year</option>
                  <option value="Peak Season">Peak Season</option>
                  <option value="Off Season">Off Season</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                <div className="xl:col-span-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price Difference Rule</label>
                  <div className="space-y-2 rounded-lg border border-gray-300 px-4 py-3 min-h-[52px]">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="priceAdjustmentType"
                        checked={formData.priceAdjustmentType === 'cheaper'}
                        onChange={() => setFormData({ ...formData, priceAdjustmentType: 'cheaper' })}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                      />
                      Cheaper than Standard Rate
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="priceAdjustmentType"
                        checked={formData.priceAdjustmentType === 'more_expensive'}
                        onChange={() => setFormData({ ...formData, priceAdjustmentType: 'more_expensive' })}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                      />
                      More expensive than Standard Rate
                    </label>
                  </div>
                </div>

                <div className="xl:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price Difference</label>
                  <input
                    type="number"
                    value={formData.priceDifferenceValue}
                    onChange={(e) => setFormData({ ...formData, priceDifferenceValue: e.target.value })}
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                      errors.priceDifferenceValue ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="15"
                  />
                  {errors.priceDifferenceValue && (
                    <p className="mt-1 text-sm text-red-600">{errors.priceDifferenceValue}</p>
                  )}
                </div>

                <div className="xl:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Difference Type</label>
                  <select
                    value={formData.priceDifferenceType}
                    onChange={(e) => setFormData({ ...formData, priceDifferenceType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  >
                    <option value="amount">Price</option>
                    <option value="percentage">%</option>
                  </select>
                </div>

                <div className="xl:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Active Plan</label>
                  <div className="flex items-center h-[52px] rounded-lg border border-gray-300 px-4 py-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Active Plan
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stop Sell</label>
                  <div className="flex items-center h-[52px] rounded-lg border border-gray-300 px-4 py-3">
                    <input
                      type="checkbox"
                      id="stopSell"
                      checked={formData.stopSell}
                      onChange={(e) => setFormData({ ...formData, stopSell: e.target.checked })}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="stopSell" className="ml-2 text-sm text-gray-700">
                      Stop Sell
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stop Sell Valid From</label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stop Sell Valid To</label>
                  <input
                    type="date"
                    value={formData.validTo}
                    onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                      errors.validTo ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.validTo && (
                    <p className="mt-1 text-sm text-red-600">{errors.validTo}</p>
                  )}
                </div>

                <div />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CTA</label>
                  <div className="flex items-center h-[52px] rounded-lg border border-gray-300 px-4 py-3">
                    <input
                      type="checkbox"
                      id="closedToArrival"
                      checked={formData.closedToArrival}
                      onChange={(e) => setFormData({ ...formData, closedToArrival: e.target.checked })}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="closedToArrival" className="ml-2 text-sm text-gray-700">
                      Closed To Arrival (CTA)
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Valid From</label>
                  <input
                    type="date"
                    value={formData.closedToArrivalValidFrom}
                    onChange={(e) => setFormData({ ...formData, closedToArrivalValidFrom: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Valid To</label>
                  <input
                    type="date"
                    value={formData.closedToArrivalValidTo}
                    onChange={(e) => setFormData({ ...formData, closedToArrivalValidTo: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                      errors.closedToArrivalValidTo ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.closedToArrivalValidTo && (
                    <p className="mt-1 text-sm text-red-600">{errors.closedToArrivalValidTo}</p>
                  )}
                </div>

                <div />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CTD</label>
                  <div className="flex items-center h-[52px] rounded-lg border border-gray-300 px-4 py-3">
                    <input
                      type="checkbox"
                      id="closedToDeparture"
                      checked={formData.closedToDeparture}
                      onChange={(e) => setFormData({ ...formData, closedToDeparture: e.target.checked })}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="closedToDeparture" className="ml-2 text-sm text-gray-700">
                      Closed To Departure (CTD)
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CTD Valid From</label>
                  <input
                    type="date"
                    value={formData.closedToDepartureValidFrom}
                    onChange={(e) => setFormData({ ...formData, closedToDepartureValidFrom: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CTD Valid To</label>
                  <input
                    type="date"
                    value={formData.closedToDepartureValidTo}
                    onChange={(e) => setFormData({ ...formData, closedToDepartureValidTo: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                      errors.closedToDepartureValidTo ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.closedToDepartureValidTo && (
                    <p className="mt-1 text-sm text-red-600">{errors.closedToDepartureValidTo}</p>
                  )}
                </div>

                <div />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">OTA</label>
                  <div className="flex items-center h-[52px] rounded-lg border border-gray-300 px-4 py-3">
                    <input
                      type="checkbox"
                      id="ota"
                      checked={formData.ota}
                      onChange={(e) => setFormData({ ...formData, ota: e.target.checked })}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="ota" className="ml-2 text-sm text-gray-700">
                      OTA
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Add to Channel Manager</label>
                  <div className="flex items-center h-[52px] rounded-lg border border-gray-300 px-4 py-3">
                    <input
                      type="checkbox"
                      id="addToChannelManager"
                      checked={formData.addToChannelManager}
                      onChange={(e) => setFormData({ ...formData, addToChannelManager: e.target.checked })}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="addToChannelManager" className="ml-2 text-sm text-gray-700">
                      Add to Channel Manager
                    </label>
                  </div>
                </div>

                <div className="xl:col-span-2" />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Inclusions</label>
                  <textarea
                    value={formData.inclusions}
                    onChange={(e) => setFormData({...formData, inclusions: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                    placeholder="What's included in this plan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Exclusions</label>
                  <textarea
                    value={formData.exclusions}
                    onChange={(e) => setFormData({...formData, exclusions: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                    placeholder="What's not included in this plan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                    placeholder="Enter plan description"
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
                className="px-8 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 transition-all duration-200 flex items-center"
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
        </div>
      )}

      {/* Plans List */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-gradient-to-r from-amber-50 via-white to-orange-50 px-6 py-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Rate Plans List</h2>
              <p className="text-sm text-slate-500">Professional view of rate plans by hotel, room types, and status</p>
            </div>
            <div className="text-sm font-medium text-slate-500">{filteredPlansByHotelAndRoomType.length} record(s)</div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-slate-200">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">SR No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Hotel</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Plan Details</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Room Types</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Rates</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Inclusions</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Policy</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredPlansByHotelAndRoomType.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                    <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <h3 className="text-sm font-medium text-gray-900">No hotel plans found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new hotel plan.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPlansByHotelAndRoomType.map((plan, index) => (
                  <tr key={plan.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'} transition hover:bg-amber-50/50`}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-slate-900">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div className="truncate max-w-[120px]" title={getHotelName(plan)}>{getHotelName(plan)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[140px]" title={plan.planName || ''}>{plan.planName || 'N/A'}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[140px]" title={plan.planCode || ''}>{plan.planCode || ''}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 whitespace-normal break-words line-clamp-2 max-w-[160px]" title={getRoomTypeNames(plan).join(', ')}>
                        {getRoomTypeNames(plan).join(', ') || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Rs {(Number(plan.extraPersonRate) || 0).toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 whitespace-normal break-words line-clamp-2 max-w-[160px]" title={plan.inclusions || ''}>{plan.inclusions || ''}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm text-gray-900 whitespace-normal break-words line-clamp-2 max-w-[160px]" title={plan.cancellationPolicy || ''}>{plan.cancellationPolicy || ''}</div>
                        <div className="text-xs text-gray-500">Advance: {plan.advancePayment || 0}%</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        plan.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(plan)}
                          className="rounded-lg p-1.5 text-amber-600 transition hover:bg-amber-50 hover:text-amber-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="rounded-lg p-1.5 text-red-600 transition hover:bg-red-50 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default HotelPlanMaster;
