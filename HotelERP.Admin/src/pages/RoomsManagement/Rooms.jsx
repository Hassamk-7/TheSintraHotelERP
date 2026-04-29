import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import { getImageUrl } from '../../config/api.js'
import {
  BuildingOfficeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  HomeIcon
} from '@heroicons/react/24/outline'

const Rooms = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [hotelFilterId, setHotelFilterId] = useState('')
  const [existingRoomsCount, setExistingRoomsCount] = useState(null)
  const [existingRoomNumbers, setExistingRoomNumbers] = useState([])
  const [formData, setFormData] = useState({
    hotelId: '',
    roomNumber: '',
    roomTypeId: '',
    roomType: '',
    roomsToAdd: 1,
    roomNumbers: [''],
    blockFloorId: '',
    floor: 1,
    block: 'A',
    status: 'Available',
    roomSize: '',
    roomSizeUnit: 'Sq Ft',
    description: '',
    maxOccupancy: 2,
    maxAdults: 2,
    maxChildren: 0,
    baseOccupancy: 2,
    maxAgeOfChild: 12,
    singleBedCount: 0,
    doubleBedCount: 0,
    queenBedCount: 0,
    kingBedCount: 1,
    sofaBedCount: 0,
    selectedAmenities: [],
    currentRate: '',
    isActive: true
  })

  const [amenities, setAmenities] = useState([])
  const [showAmenitiesPopup, setShowAmenitiesPopup] = useState(false)

  const [rooms, setRooms] = useState([])
  const [roomTypes, setRoomTypes] = useState([])
  const [hotels, setHotels] = useState([])
  const [blockFloors, setBlockFloors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})
  const [validationModal, setValidationModal] = useState({ show: false, message: '' })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)

  // Load rooms on component mount
  useEffect(() => {
    fetchHotels()
    fetchRoomTypes()
    fetchRooms()
    fetchAmenities()
  }, [page, pageSize, hotelFilterId])

  const fetchAmenities = async () => {
    try {
      const response = await axios.get('/RoomsManagement/room-amenities', { params: { page: 1, pageSize: 500 } })
      if (response.data?.success) {
        const list = Array.isArray(response.data.data) ? response.data.data : []
        const normalized = list.map((a) => ({
          ...a,
          id: a.id ?? a.Id,
          name: a.name ?? a.Name ?? a.amenityName ?? a.AmenityName ?? ''
        }))
        setAmenities(normalized)
      }
    } catch (err) {
      console.error('Error loading amenities:', err)
      setAmenities([])
    }
  }

  // Load block/floor hierarchy for the selected hotel (used for floor assignment)
  useEffect(() => {
    const hid = Number(formData.hotelId || 0)
    if (!showForm || !hid) {
      setBlockFloors([])
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const res = await axios.get(`/blockfloor/hotel/${hid}`)
        if (cancelled) return
        const blocks = res?.data?.data?.blocks || []
        const flat = blocks.flatMap((b) => (b.floors || []).map((f) => ({
          id: f.id,
          blockId: b.id,
          blockName: b.blockName,
          blockCode: b.blockCode,
          floorNumber: f.floorNumber,
          floorName: f.floorName
        })))
        setBlockFloors(flat)
      } catch (e) {
        if (cancelled) return
        setBlockFloors([])
      }
    })()

    return () => { cancelled = true }
  }, [formData.hotelId, showForm])

  // When hotel + room type selected (add mode), fetch how many rooms already exist
  useEffect(() => {
    const hotelId = Number(formData.hotelId || 0) || null
    const roomTypeId = Number(formData.roomTypeId || 0) || null

    if (editingId || !showForm || !hotelId || !roomTypeId) {
      setExistingRoomsCount(null)
      setExistingRoomNumbers([])
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const res = await axios.get('/RoomsManagement/rooms/by-roomtype', {
          params: { hotelId, roomTypeId }
        })
        if (cancelled) return

        const existing = Array.isArray(res?.data?.data) ? res.data.data : []
        const existingNumbers = existing
          .map((r) => (r?.roomNumber ?? r?.RoomNumber ?? '').toString().trim())
          .filter(Boolean)

        const count = Number(res?.data?.totalCount ?? existingNumbers.length) || 0
        setExistingRoomsCount(count)
        setExistingRoomNumbers(existingNumbers)

        setFormData((prev) => {
          // Prefill roomNumbers with existing ones, and set roomsToAdd default to existing count
          const nextQty = Math.max(1, count || 1)
          const arr = Array.from({ length: nextQty }, (_, i) => existingNumbers[i] ?? prev.roomNumbers?.[i] ?? '')
          return { ...prev, roomsToAdd: nextQty, roomNumbers: arr }
        })
      } catch {
        if (cancelled) return
        setExistingRoomsCount(null)
        setExistingRoomNumbers([])
      }
    })()

    return () => { cancelled = true }
  }, [formData.hotelId, formData.roomTypeId, editingId, showForm])

  const fetchHotels = async () => {
    try {
      const response = await axios.get('/Hotels', { params: { page: 1, pageSize: 200 } })
      if (response.data?.success) {
        setHotels(response.data.data || [])
      }
    } catch (err) {
      console.error('Error loading hotels:', err)
      setHotels([])
    }
  }

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get('/roomtypes')
      if (response.data?.success) {
        setRoomTypes(response.data.data || [])
      }
    } catch (err) {
      console.error('Error loading room types:', err)
    }
  }

  // Fetch rooms from API - PURE API CALL
  const fetchRooms = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/RoomsManagement/rooms', {
        params: {
          page,
          pageSize,
          search: searchTerm?.trim?.() || '',
          hotelId: hotelFilterId || undefined
        }
      })

      if (response.data && response.data.success) {
        const normalizedRooms = (response.data.data || []).map((room) => ({
          ...room,
          hotelId: room.hotelId ?? room.HotelId ?? room.hotelID ?? room.HotelID ?? room.hotel?.id ?? room.hotel?.Id ?? room.roomType?.hotelId ?? room.roomType?.HotelId ?? null,
          hotelName: room.hotelName ?? room.HotelName ?? room.hotel?.hotelName ?? room.hotel?.HotelName ?? room.roomType?.hotel?.hotelName ?? room.roomType?.hotel?.HotelName ?? room.roomType?.hotelName ?? room.roomType?.HotelName ?? '',
          roomTypeName: typeof room.roomType === 'string'
            ? room.roomType
            : room.roomType?.name || '',
          floorNumber: room.floorNumber ?? room.floor ?? null,
          maxOccupancyValue: room.maxOccupancy ?? room.roomType?.maxOccupancy ?? ((room.maxAdults || 0) + (room.maxChildren || 0)),
          basePrice: room.basePrice ?? null,
          blockName: room.block ?? room.blockName ?? '',
          roomTypeId: room.roomTypeId ?? room.roomType?.id,
          blockFloorId: room.blockFloorId ?? room.BlockFloorId ?? null
        })).map((r) => {
          // Fallback: derive hotel name from roomTypeId -> roomTypes -> hotels
          const name = (r.hotelName || '').toString().trim()
          if (name) return r

          const rtId = r.roomTypeId ?? r.RoomTypeId ?? null
          const rt = (roomTypes || []).find((t) => String(t.id ?? t.Id) === String(rtId))
          const hId = r.hotelId ?? rt?.hotelId ?? rt?.HotelId ?? null
          const h = (hotels || []).find((x) => String(x.id ?? x.Id) === String(hId))
          const derivedName = h?.hotelName ?? h?.HotelName ?? ''

          return { ...r, hotelId: hId ?? r.hotelId ?? null, hotelName: derivedName }
        })

        setRooms(normalizedRooms)
        setTotalCount(response.data.totalCount ?? normalizedRooms.length)
      } else {
        setError('No rooms data received')
        setRooms([])
        setTotalCount(0)
      }
    } catch (err) {
      console.error('Error fetching rooms:', err)
      setError('Failed to load rooms. Please check API connection.')
      setRooms([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  // Form validation
  const validateForm = () => {
    const validationErrors = []
    
    if (!formData.hotelId) validationErrors.push('Hotel is required')
    if (!formData.roomTypeId) validationErrors.push('Room type is required')
    if (!formData.floor || formData.floor <= 0) validationErrors.push('Valid floor number is required')
    
    if (!editingId) {
      const existingCount = Number(existingRoomsCount ?? existingRoomNumbers.length ?? 0) || 0
      const qty = Number(formData.roomsToAdd || 1)
      if (!qty || qty <= 0) validationErrors.push('Rooms count is required')
      if (qty < existingCount) validationErrors.push(`No. of Rooms cannot be less than already added (${existingCount})`)

      const numbers = Array.isArray(formData.roomNumbers) ? formData.roomNumbers : []
      const cleanedAll = numbers.map((n) => (n || '').toString().trim()).filter(Boolean)
      const uniqueAll = new Set(cleanedAll.map((n) => n.toLowerCase()))
      if (uniqueAll.size !== cleanedAll.length) validationErrors.push('Duplicate room numbers are not allowed')

      const existingLower = new Set((existingRoomNumbers || []).map((n) => n.toLowerCase()))
      const newNumbers = (numbers.slice(existingCount) || []).map((n) => (n || '').toString().trim()).filter(Boolean)
      const expectedNew = Math.max(0, qty - existingCount)

      // If user is adding new rooms, require exactly that many new numbers
      if (expectedNew > 0) {
        if (newNumbers.length !== expectedNew) {
          validationErrors.push(`Please enter exactly ${expectedNew} new room number${expectedNew > 1 ? 's' : ''}`)
        } else {
          const newUnique = new Set(newNumbers.map((n) => n.toLowerCase()))
          if (newUnique.size !== newNumbers.length) {
            validationErrors.push('Duplicate room numbers are not allowed')
          } else if (newNumbers.some((n) => existingLower.has(n.toLowerCase()))) {
            const duplicates = newNumbers.filter((n) => existingLower.has(n.toLowerCase()))
            validationErrors.push(`Room number(s) ${duplicates.join(', ')} already exist for this room type in this hotel`)
          }
        }
      }
    } else {
      if (!formData.roomNumber.trim()) validationErrors.push('Room number is required')
    }
    
    if (validationErrors.length > 0) {
      setError('')
      setValidationModal({ show: true, message: validationErrors.join('\n') })
      return false
    }
    
    return true
  }

  // Create/Update room - PURE API CALL
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      const roomTypeId = parseInt(formData.roomTypeId, 10)
      if (!roomTypeId) {
        setError('')
        setValidationModal({ show: true, message: 'Room type is required' })
        setLoading(false)
        return
      }

      const hotelId = parseInt(formData.hotelId, 10)
      if (!hotelId) {
        setError('')
        setValidationModal({ show: true, message: 'Hotel is required' })
        setLoading(false)
        return
      }

      const floorNumber = Number(formData.floor)
      const maxOccupancy = Number(formData.maxOccupancy ?? 2)
      const maxAdults = Number(formData.maxAdults ?? maxOccupancy ?? 2)
      const maxChildren = Number(formData.maxChildren ?? 0)

      const payload = {
        roomNumber: formData.roomNumber?.trim(),
        roomTypeId,
        blockFloorId: formData.blockFloorId ? Number(formData.blockFloorId) : null,
        floorNumber,
        block: formData.block,
        status: formData.status,
        maxOccupancy: Number.isNaN(maxOccupancy) ? 2 : maxOccupancy,
        roomSize: formData.roomSize === '' ? null : Number(formData.roomSize),
        roomSizeUnit: formData.roomSizeUnit || 'Sq Ft',
        currentRate: null,
        description: formData.description,
        maxAdults: Number.isNaN(maxAdults) ? 2 : maxAdults,
        maxChildren: Number.isNaN(maxChildren) ? 0 : maxChildren,
        baseOccupancy: Number(formData.baseOccupancy) || null,
        maxAgeOfChild: Number(formData.maxAgeOfChild) || null,
        singleBedCount: Number(formData.singleBedCount) || null,
        doubleBedCount: Number(formData.doubleBedCount) || null,
        queenBedCount: Number(formData.queenBedCount) || null,
        kingBedCount: Number(formData.kingBedCount) || null,
        sofaBedCount: Number(formData.sofaBedCount) || null,
        selectedAmenities: Array.isArray(formData.selectedAmenities) ? formData.selectedAmenities : [],
        features: []
      }

      let response
      if (editingId) {
        console.log('🔄 Updating room:', payload)
        response = await axios.put(`/RoomsManagement/rooms/${editingId}`, payload)
      } else {
        const existingCount = Number(existingRoomsCount ?? existingRoomNumbers.length ?? 0) || 0
        const desiredTotal = Number(formData.roomsToAdd || 1)
        const roomNumbers = (formData.roomNumbers || []).slice(existingCount).map((n) => (n || '').toString().trim()).filter(Boolean)
        const qty = roomNumbers.length

        if (desiredTotal <= existingCount || qty <= 0) {
          setValidationModal({ show: true, message: 'No new rooms to add' })
          setLoading(false)
          return
        }
        const bulkPayload = {
          hotelId,
          roomTypeId,
          quantity: qty,
          roomNumbers,
          blockFloorId: formData.blockFloorId ? Number(formData.blockFloorId) : null,
          floorNumber,
          block: formData.block,
          status: formData.status,
          maxOccupancy: Number.isNaN(maxOccupancy) ? 2 : maxOccupancy,
          maxAdults: Number.isNaN(maxAdults) ? 2 : maxAdults,
          maxChildren: Number.isNaN(maxChildren) ? 0 : maxChildren,
          baseOccupancy: Number(formData.baseOccupancy) || null,
          maxAgeOfChild: Number(formData.maxAgeOfChild) || null,
          singleBedCount: Number(formData.singleBedCount) || null,
          doubleBedCount: Number(formData.doubleBedCount) || null,
          queenBedCount: Number(formData.queenBedCount) || null,
          kingBedCount: Number(formData.kingBedCount) || null,
          sofaBedCount: Number(formData.sofaBedCount) || null,
          roomSize: formData.roomSize === '' ? null : Number(formData.roomSize),
          roomSizeUnit: formData.roomSizeUnit || 'Sq Ft',
          currentRate: null,
          description: formData.description,
          selectedAmenities: Array.isArray(formData.selectedAmenities) ? formData.selectedAmenities : [],
        }
        console.log('🔄 Bulk creating rooms:', bulkPayload)
        response = await axios.post('/RoomsManagement/rooms/bulk', bulkPayload)
      }
      
      if (response.data && response.data.success) {
        setSuccess(editingId ? 'Room updated successfully' : 'Room created successfully')
        fetchRooms() // Refresh data
        setShowForm(false)
        resetForm()
      } else {
        setValidationModal({ show: true, message: 'Failed to save room' })
      }
    } catch (err) {
      console.error('Error saving room:', err)
      const errorMessage = err.response?.data?.message || 'Failed to save room'
      setError('')
      setValidationModal({ show: true, message: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  // Delete room - PURE API CALL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return

    try {
      setLoading(true)
      const response = await axios.delete(`/RoomsManagement/rooms/${id}`)
      
      if (response.data && response.data.success) {
        setSuccess('Room deleted successfully')
        fetchRooms() // Refresh data
      } else {
        setError('Failed to delete room')
      }
    } catch (err) {
      console.error('Error deleting room:', err)
      setError(err.response?.data?.message || 'Failed to delete room')
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      hotelId: '',
      roomNumber: '',
      roomTypeId: '',
      roomType: '',
      roomsToAdd: 1,
      roomNumbers: [''],
      blockFloorId: '',
      floor: 1,
      block: 'A',
      status: 'Available',
      roomSize: '',
      roomSizeUnit: 'Sq Ft',
      description: '',
      maxOccupancy: 2,
      maxAdults: 2,
      maxChildren: 0,
      baseOccupancy: 2,
      maxAgeOfChild: 12,
      singleBedCount: 0,
      doubleBedCount: 0,
      queenBedCount: 0,
      kingBedCount: 1,
      sofaBedCount: 0,
      selectedAmenities: [],
      currentRate: '',
      isActive: true
    })
    setEditingId(null)
    setErrors({})
    setExistingRoomsCount(null)
    setExistingRoomNumbers([])
  }

  // Open form for add/edit
  const openForm = (room = null) => {
    setErrors({})
    setError('')
    setSuccess('')

    const loadRoomAmenityMapping = async (roomId) => {
      try {
        const res = await axios.get(`/RoomsManagement/room-amenity-mapping/${roomId}`)
        const mappings = Array.isArray(res?.data?.data) ? res.data.data : []
        const ids = mappings
          .map((m) => m.amenityId ?? m.AmenityId ?? m.amenity?.id ?? m.amenity?.Id ?? m.amenity?.amenityId ?? null)
          .filter((x) => Number(x) > 0)
          .map((x) => Number(x))

        setFormData((prev) => ({
          ...prev,
          selectedAmenities: ids
        }))
      } catch (e) {
        setFormData((prev) => ({
          ...prev,
          selectedAmenities: []
        }))
      }
    }

    if (room) {
      // Edit mode
      setEditingId(room.id)
      setFormData({
        hotelId: room.hotelId || '',
        roomNumber: room.roomNumber || '',
        roomTypeId: room.roomTypeId || '',
        roomType: room.roomTypeName ?? (typeof room.roomType === 'string' ? room.roomType : room.roomType?.name) ?? '',
        roomsToAdd: 1,
        roomNumbers: [room.roomNumber ?? ''],
        blockFloorId: room.blockFloorId ?? room.BlockFloorId ?? '',
        floor: room.floorNumber ?? room.floor ?? 1,
        block: room.block ?? room.blockName ?? 'A',
        status: room.status ?? 'Available',
        roomSize: room.roomSize ?? room.RoomSize ?? '',
        roomSizeUnit: room.roomSizeUnit ?? room.RoomSizeUnit ?? 'Sq Ft',
        description: room.description ?? '',
        maxOccupancy: (room.maxOccupancy ?? room.maxOccupancyValue ?? ((room.maxAdults || 0) + (room.maxChildren || 0))) || 2,
        maxAdults: room.maxAdults ?? 2,
        maxChildren: room.maxChildren ?? 0,
        baseOccupancy: room.baseOccupancy ?? room.BaseOccupancy ?? 2,
        maxAgeOfChild: room.maxAgeOfChild ?? room.MaxAgeOfChild ?? 12,
        singleBedCount: room.singleBedCount ?? room.SingleBedCount ?? 0,
        doubleBedCount: room.doubleBedCount ?? room.DoubleBedCount ?? 0,
        queenBedCount: room.queenBedCount ?? room.QueenBedCount ?? 0,
        kingBedCount: room.kingBedCount ?? room.KingBedCount ?? 0,
        sofaBedCount: room.sofaBedCount ?? room.SofaBedCount ?? 0,
        selectedAmenities: [],
        currentRate: room.basePrice ?? room.currentRate ?? '',
        isActive: room.isActive ?? true
      })

      loadRoomAmenityMapping(room.id)
    } else {
      // Add mode
      setEditingId(null)
      setFormData({
        hotelId: '',
        roomNumber: '',
        roomTypeId: '',
        roomType: '',
        roomsToAdd: 1,
        roomNumbers: [''],
        blockFloorId: '',
        floor: 1,
        block: 'A',
        status: 'Available',
        roomSize: '',
        roomSizeUnit: 'Sq Ft',
        description: '',
        maxOccupancy: 2,
        maxAdults: 2,
        maxChildren: 0,
        currentRate: '',
        isActive: true
      })
    }
    setShowForm(true)
  }

  const handleEdit = (room) => {
    openForm(room)
  }

  const filteredRooms = (rooms || []).filter((r) => {
    const term = (searchTerm || '').toString().trim().toLowerCase()
    const matchesSearch = !term
      || (r.roomNumber || '').toString().toLowerCase().includes(term)
      || (r.roomTypeName || '').toString().toLowerCase().includes(term)
      || (r.hotelName || '').toString().toLowerCase().includes(term)

    const matchesHotel = !hotelFilterId || String(r.hotelId ?? '') === String(hotelFilterId)
    return matchesSearch && matchesHotel
  })


  return (
    <div className="space-y-4 px-3 py-4 sm:space-y-6 sm:px-4 sm:py-4 md:px-6 md:py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-[1.5rem] p-4 sm:p-6 border border-green-200 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="bg-green-100 p-3 rounded-2xl shrink-0">
              <BuildingOfficeIcon className="h-7 w-7 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 break-words">Rooms</h1>
              <p className="text-gray-600 text-sm sm:text-base break-words">Manage individual hotel rooms</p>
            </div>
          </div>
          <button
            onClick={() => openForm()}
            className="bg-green-600 text-white px-4 py-3 rounded-2xl hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center space-x-2 transition-colors w-full sm:w-auto font-medium"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Room</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Search rooms (room #, room type, hotel)..."
            />
          </div>
          <div>
            <select
              value={hotelFilterId}
              onChange={(e) => {
                setHotelFilterId(e.target.value)
                setPage(1)
              }}
              className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="">All Hotels</option>
              {hotels.map((h) => (
                <option key={h.id ?? h.Id} value={h.id ?? h.Id}>
                  {h.hotelName ?? h.HotelName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error/Success Messages - Only show non-validation errors here */}
      {error && !validationModal.show && !showForm && !showAmenitiesPopup && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {success && !showForm && !showAmenitiesPopup && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-green-700">{success}</span>
          </div>
        </div>
      )}

      {/* Rooms Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-gradient-to-r from-green-50 via-white to-emerald-50 px-6 py-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Rooms List</h2>
              <p className="text-sm text-slate-500">Professional view of rooms by hotel, type, and status</p>
            </div>
            <div className="text-sm font-medium text-slate-500">{filteredRooms.length} record(s)</div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[1020px] w-full divide-y divide-slate-200">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">SR No</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Hotel</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Room</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Floor/Block</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading rooms...</p>
                  </td>
                </tr>
              ) : filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No rooms found
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room, index) => (
                  <tr key={room.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'} transition hover:bg-green-50/50`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                      {(page - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                      {room.hotelName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{room.roomNumber}</div>
                        <div className="text-sm text-gray-500">Max: {room.maxOccupancyValue ?? room.maxOccupancy ?? 'N/A'} guests</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {room.roomTypeName || (typeof room.roomType === 'string' ? room.roomType : room.roomType?.name) || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Floor {room.floorNumber ?? room.floor ?? 'N/A'}, Block {room.blockName || room.block || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        room.status === 'Available' ? 'bg-green-100 text-green-800' :
                        room.status === 'Occupied' ? 'bg-red-100 text-red-800' :
                        room.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(room)}
                          className="rounded-lg p-2 text-green-600 transition hover:bg-green-50 hover:text-green-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(room.id)}
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-900"
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

      {/* Pagination */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <div className="text-sm text-gray-600">
          Showing {(Math.min((page - 1) * pageSize + 1, totalCount) || 0)}-
          {Math.min(page * pageSize, totalCount)} of {totalCount} rooms
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">
            Page Size:
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setPage(1)
              }}
              className="ml-2 border border-gray-300 rounded-lg px-2 py-1 text-sm"
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-gray-700">
              Page {page} / {Math.max(1, Math.ceil(totalCount / pageSize || 1))}
            </span>
            <button
              onClick={() => {
                const totalPages = Math.max(1, Math.ceil(totalCount / pageSize || 1))
                setPage((p) => Math.min(totalPages, p + 1))
              }}
              disabled={page >= Math.max(1, Math.ceil(totalCount / pageSize || 1))}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingId ? 'Edit Room' : 'Add New Room'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hotel *</label>
                    <select
                      value={formData.hotelId}
                      onChange={(e) => {
                        const nextHotelId = e.target.value
                        setFormData((prev) => ({
                          ...prev,
                          hotelId: nextHotelId,
                          roomTypeId: '',
                          roomType: '',
                          roomNumbers: Array.from({ length: Number(prev.roomsToAdd || 1) }, (_, i) => prev.roomNumbers?.[i] ?? '')
                        }))
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.hotelId ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select hotel</option>
                      {hotels.map((h) => (
                        <option key={h.id ?? h.Id} value={h.id ?? h.Id}>
                          {h.hotelName ?? h.HotelName}
                        </option>
                      ))}
                    </select>
                    {/* Validation errors now shown in modal popup */}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Block</label>
                    <select
                      value={formData.block}
                      onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="A">Block A</option>
                      <option value="B">Block B</option>
                      <option value="C">Block C</option>
                      <option value="D">Block D</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Floor *</label>
                    <select
                      value={formData.blockFloorId}
                      onChange={(e) => {
                        const val = e.target.value
                        const selected = (blockFloors || []).find((bf) => String(bf.id) === String(val))
                        setFormData((prev) => ({
                          ...prev,
                          blockFloorId: val,
                          floor: selected?.floorNumber ?? prev.floor,
                          block: (selected?.blockCode || prev.block || 'A')
                        }))
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.floor ? 'border-red-300' : 'border-gray-300'
                      }`}
                      disabled={!formData.hotelId}
                    >
                      <option value="">Select floor</option>
                      {(blockFloors || []).map((bf) => (
                        <option key={bf.id} value={bf.id}>
                          {bf.blockName} - Floor {bf.floorNumber} ({bf.floorName})
                        </option>
                      ))}
                    </select>
                    {/* Validation errors now shown in modal popup */}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Type *</label>
                    <select
                      value={formData.roomTypeId}
                      onChange={(e) => {
                        const selectedId = e.target.value
                        const selectedType = roomTypes.find(type => String(type.id ?? type.Id) === String(selectedId))
                        setFormData({
                          ...formData,
                          roomTypeId: selectedId,
                          roomType: selectedType?.name || ''
                        })
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.roomTypeId ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select room type</option>
                      {roomTypes
                        .filter((type) => {
                          if (!formData.hotelId) return true
                          const typeHotelId = type.hotelId ?? type.HotelId ?? null
                          return String(typeHotelId ?? '') === String(formData.hotelId)
                        })
                        .map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                    </select>
                    {/* Validation errors now shown in modal popup */}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Occupancy</label>
                    <input
                      type="number"
                      value={formData.baseOccupancy}
                      onChange={(e) => setFormData({ ...formData, baseOccupancy: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="1"
                      placeholder="2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Adults *</label>
                    <input
                      type="number"
                      value={formData.maxAdults}
                      onChange={(e) => setFormData({ ...formData, maxAdults: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="1"
                      placeholder="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Children *</label>
                    <input
                      type="number"
                      value={formData.maxChildren}
                      onChange={(e) => setFormData({ ...formData, maxChildren: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="0"
                      placeholder="2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Occupancy *</label>
                    <input
                      type="number"
                      value={formData.maxOccupancy}
                      onChange={(e) => setFormData({ ...formData, maxOccupancy: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="1"
                      placeholder="4"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Age of Child</label>
                    <select
                      value={formData.maxAgeOfChild}
                      onChange={(e) => setFormData({ ...formData, maxAgeOfChild: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {Array.from({ length: 25 }, (_, i) => i + 1).map(age => (
                        <option key={age} value={age}>{age}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Size (sq m)</label>
                    <input
                      type="number"
                      value={formData.roomSize}
                      onChange={(e) => setFormData({ ...formData, roomSize: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                      placeholder="35"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Available">Available</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Out of Order">Out of Order</option>
                    </select>
                  </div>
                </div>

                {/* Bed Configurations */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">🛏️ Bed Configurations</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="relative mb-2">
                        <img src={getImageUrl('/uploads/bedsPicture/SingleBed.jpg')} alt="Single Bed" className="w-full h-24 object-cover rounded-lg border-2 border-gray-200" />
                        <input
                          type="checkbox"
                          checked={formData.singleBedCount > 0}
                          onChange={(e) => setFormData({ ...formData, singleBedCount: e.target.checked ? 1 : 0 })}
                          className="absolute top-2 left-2 rounded"
                        />
                      </div>
                      <label className="text-xs font-medium">Single Bed</label>
                      <input
                        type="number"
                        value={formData.singleBedCount}
                        onChange={(e) => setFormData({ ...formData, singleBedCount: parseInt(e.target.value) || 0 })}
                        className="w-full mt-1 px-2 py-1 text-center border rounded"
                        min="0"
                      />
                    </div>

                    <div className="text-center">
                      <div className="relative mb-2">
                        <img src={getImageUrl('/uploads/bedsPicture/DoubleBed.jpg')} alt="Double Bed" className="w-full h-24 object-cover rounded-lg border-2 border-gray-200" />
                        <input
                          type="checkbox"
                          checked={formData.doubleBedCount > 0}
                          onChange={(e) => setFormData({ ...formData, doubleBedCount: e.target.checked ? 1 : 0 })}
                          className="absolute top-2 left-2 rounded"
                        />
                      </div>
                      <label className="text-xs font-medium">Double Bed</label>
                      <input
                        type="number"
                        value={formData.doubleBedCount}
                        onChange={(e) => setFormData({ ...formData, doubleBedCount: parseInt(e.target.value) || 0 })}
                        className="w-full mt-1 px-2 py-1 text-center border rounded"
                        min="0"
                      />
                    </div>

                    <div className="text-center">
                      <div className="relative mb-2">
                        <img src={getImageUrl('/uploads/bedsPicture/QueenBed.jpg')} alt="Queen Bed" className="w-full h-24 object-cover rounded-lg border-2 border-gray-200" />
                        <input
                          type="checkbox"
                          checked={formData.queenBedCount > 0}
                          onChange={(e) => setFormData({ ...formData, queenBedCount: e.target.checked ? 1 : 0 })}
                          className="absolute top-2 left-2 rounded"
                        />
                      </div>
                      <label className="text-xs font-medium">Queen Bed</label>
                      <input
                        type="number"
                        value={formData.queenBedCount}
                        onChange={(e) => setFormData({ ...formData, queenBedCount: parseInt(e.target.value) || 0 })}
                        className="w-full mt-1 px-2 py-1 text-center border rounded"
                        min="0"
                      />
                    </div>

                    <div className="text-center">
                      <div className="relative mb-2">
                        <img src={getImageUrl('/uploads/bedsPicture/KingBed.jpg')} alt="King Bed" className="w-full h-24 object-cover rounded-lg border-2 border-gray-200" />
                        <input
                          type="checkbox"
                          checked={formData.kingBedCount > 0}
                          onChange={(e) => setFormData({ ...formData, kingBedCount: e.target.checked ? 1 : 0 })}
                          className="absolute top-2 left-2 rounded"
                        />
                      </div>
                      <label className="text-xs font-medium">King Bed</label>
                      <input
                        type="number"
                        value={formData.kingBedCount}
                        onChange={(e) => setFormData({ ...formData, kingBedCount: parseInt(e.target.value) || 0 })}
                        className="w-full mt-1 px-2 py-1 text-center border rounded"
                        min="0"
                      />
                    </div>

                    <div className="text-center">
                      <div className="relative mb-2">
                        <img src={getImageUrl('/uploads/bedsPicture/SofaBed.jpg')} alt="Sofa Bed" className="w-full h-24 object-cover rounded-lg border-2 border-gray-200" />
                        <input
                          type="checkbox"
                          checked={formData.sofaBedCount > 0}
                          onChange={(e) => setFormData({ ...formData, sofaBedCount: e.target.checked ? 1 : 0 })}
                          className="absolute top-2 left-2 rounded"
                        />
                      </div>
                      <label className="text-xs font-medium">Sofa Bed</label>
                      <input
                        type="number"
                        value={formData.sofaBedCount}
                        onChange={(e) => setFormData({ ...formData, sofaBedCount: parseInt(e.target.value) || 0 })}
                        className="w-full mt-1 px-2 py-1 text-center border rounded"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Room Amenities */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">🏨 Room Amenities</h4>
                    <button
                      type="button"
                      onClick={() => setShowAmenitiesPopup(true)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      + Add Amenities
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {!formData.selectedAmenities || formData.selectedAmenities.length === 0 ? (
                      <p className="text-sm text-gray-500">No amenities selected</p>
                    ) : (
                      formData.selectedAmenities.map(amenityId => {
                        const amenity = amenities.find(a => a.id === amenityId)
                        return amenity ? (
                          <span key={amenityId} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                            {amenity.name}
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                selectedAmenities: (prev.selectedAmenities || []).filter(id => id !== amenityId)
                              }))}
                              className="ml-2 text-green-600 hover:text-green-800"
                            >
                              ×
                            </button>
                          </span>
                        ) : null
                      })
                    )}
                  </div>
                </div>

                {!editingId && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">No. of Rooms *</label>
                      <input
                        type="number"
                        value={formData.roomsToAdd}
                        onChange={(e) => {
                          const minQty = Math.max(1, Number(existingRoomsCount ?? existingRoomNumbers.length ?? 0) || 0)
                          const nextQty = Math.max(minQty, Number(e.target.value || minQty))
                          setFormData((prev) => {
                            const next = { ...prev, roomsToAdd: nextQty }
                            const arr = Array.isArray(next.roomNumbers) ? [...next.roomNumbers] : []
                            if (arr.length < nextQty) {
                              while (arr.length < nextQty) arr.push('')
                            } else if (arr.length > nextQty) {
                              arr.length = nextQty
                            }
                            next.roomNumbers = arr
                            return next
                          })
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.roomsToAdd ? 'border-red-300' : 'border-gray-300'
                        }`}
                        min="1"
                        max="500"
                      />
                      {existingRoomsCount != null && (
                        <p className="text-xs text-gray-500 mt-1">Already added: {existingRoomsCount}</p>
                      )}
                      {/* Validation errors now shown in modal popup */}
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Room Numbers *</label>
                      <p className="text-xs text-gray-500 mb-2">Existing rooms are prefilled. Increase No. of Rooms to add new rooms.</p>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {Array.from({ length: Number(formData.roomsToAdd || 1) }, (_, idx) => idx).map((idx) => (
                          <input
                            key={idx}
                            type="text"
                            value={(formData.roomNumbers || [])[idx] ?? ''}
                            readOnly={idx < (Number(existingRoomsCount ?? existingRoomNumbers.length ?? 0) || 0)}
                            onChange={(e) => {
                              const nextVal = e.target.value
                              setFormData((prev) => {
                                const qty = Number(prev.roomsToAdd || 1)
                                const arr = Array.isArray(prev.roomNumbers) ? [...prev.roomNumbers] : []
                                while (arr.length < qty) arr.push('')
                                if (arr.length > qty) arr.length = qty
                                arr[idx] = nextVal
                                return { ...prev, roomNumbers: arr }
                              })
                            }}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                              errors.roomNumbers ? 'border-red-300' : 'border-gray-300'
                            } ${idx < (Number(existingRoomsCount ?? existingRoomNumbers.length ?? 0) || 0) ? 'bg-gray-50 text-gray-700 cursor-not-allowed' : ''
                            }`}
                            placeholder={idx === 0 ? '101' : ''}
                          />
                        ))}
                      </div>
                      {/* Validation errors now shown in modal popup */}
                    </div>
                  </div>
                )}

                

                {editingId && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
                      <input
                        type="text"
                        value={formData.roomNumber}
                        onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.roomNumber ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="101"
                      />
                      {/* Validation errors now shown in modal popup */}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Room description..."
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
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Room Amenities Popup */}
      {showAmenitiesPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Select Room Amenities</h3>
                <button
                  onClick={() => setShowAmenitiesPopup(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => {
                    const allAmenityIds = (amenities || []).map(a => a.id)
                    setFormData(prev => ({
                      ...prev,
                      selectedAmenities: allAmenityIds
                    }))
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mr-2"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      selectedAmenities: []
                    }))
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Clear All
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(amenities || []).length === 0 ? (
                    <p className="text-sm text-gray-500 col-span-2 text-center py-4">No amenities available</p>
                  ) : (
                    (amenities || []).map(amenity => (
                      <label
                        key={amenity.id}
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={(formData.selectedAmenities || []).includes(amenity.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                selectedAmenities: [...(prev.selectedAmenities || []), amenity.id]
                              }))
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                selectedAmenities: (prev.selectedAmenities || []).filter(id => id !== amenity.id)
                              }))
                            }
                          }}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">{amenity.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 mt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAmenitiesPopup(false)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Error Modal */}
      {validationModal.show && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-6 border w-11/12 md:w-2/3 lg:w-1/3 shadow-lg rounded-2xl bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <XCircleIcon className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">Validation Error</h3>
              <div className="text-sm text-gray-700 mb-6 max-h-64 overflow-y-auto">
                {validationModal.message.split('\n').map((msg, idx) => (
                  <div key={idx} className="flex items-start mb-2">
                    <XCircleIcon className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-left">{msg}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setValidationModal({ show: false, message: '' })
                    setError('')
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Rooms;
