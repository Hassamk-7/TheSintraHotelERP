import { useState, useEffect, useRef } from 'react'
import axios from '../../utils/axios.js'
import { getImageUrl } from '../../config/api.js'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  CameraIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

const TIMEZONES = [
  { code: 'AF', country: 'Afghanistan', timezone: 'Asia/Kabul', offset: 'UTC +04:30', value: 'Asia/Kabul' },
  { code: 'AL', country: 'Albania', timezone: 'Europe/Tirane', offset: 'UTC +01:00', value: 'Europe/Tirane' },
  { code: 'DZ', country: 'Algeria', timezone: 'Africa/Algiers', offset: 'UTC +01:00', value: 'Africa/Algiers' },
  { code: 'AS', country: 'American Samoa', timezone: 'Pacific/Pago_Pago', offset: 'UTC -11:00', value: 'Pacific/Pago_Pago' },
  { code: 'AD', country: 'Andorra', timezone: 'Europe/Andorra', offset: 'UTC +01:00', value: 'Europe/Andorra' },
  { code: 'AO', country: 'Angola', timezone: 'Africa/Luanda', offset: 'UTC +01:00', value: 'Africa/Luanda' },
  { code: 'AI', country: 'Anguilla', timezone: 'America/Anguilla', offset: 'UTC -04:00', value: 'America/Anguilla' },
  { code: 'AQ', country: 'Antarctica', timezone: 'Antarctica/Casey', offset: 'UTC +08:00', value: 'Antarctica/Casey' },
  { code: 'AG', country: 'Antigua and Barbuda', timezone: 'America/Antigua', offset: 'UTC -04:00', value: 'America/Antigua' },
  { code: 'AR', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', offset: 'UTC -03:00', value: 'America/Argentina/Buenos_Aires' },
  { code: 'AM', country: 'Armenia', timezone: 'Asia/Yerevan', offset: 'UTC +04:00', value: 'Asia/Yerevan' },
  { code: 'AW', country: 'Aruba', timezone: 'America/Aruba', offset: 'UTC -04:00', value: 'America/Aruba' },
  { code: 'AU', country: 'Australia', timezone: 'Australia/Sydney', offset: 'UTC +10:00', value: 'Australia/Sydney' },
  { code: 'AT', country: 'Austria', timezone: 'Europe/Vienna', offset: 'UTC +01:00', value: 'Europe/Vienna' },
  { code: 'AZ', country: 'Azerbaijan', timezone: 'Asia/Baku', offset: 'UTC +04:00', value: 'Asia/Baku' },
  { code: 'BS', country: 'Bahamas', timezone: 'America/Nassau', offset: 'UTC -05:00', value: 'America/Nassau' },
  { code: 'BH', country: 'Bahrain', timezone: 'Asia/Bahrain', offset: 'UTC +03:00', value: 'Asia/Bahrain' },
  { code: 'BD', country: 'Bangladesh', timezone: 'Asia/Dhaka', offset: 'UTC +06:00', value: 'Asia/Dhaka' },
  { code: 'BB', country: 'Barbados', timezone: 'America/Barbados', offset: 'UTC -04:00', value: 'America/Barbados' },
  { code: 'BY', country: 'Belarus', timezone: 'Europe/Minsk', offset: 'UTC +03:00', value: 'Europe/Minsk' },
  { code: 'BE', country: 'Belgium', timezone: 'Europe/Brussels', offset: 'UTC +01:00', value: 'Europe/Brussels' },
  { code: 'BZ', country: 'Belize', timezone: 'America/Belize', offset: 'UTC -06:00', value: 'America/Belize' },
  { code: 'BJ', country: 'Benin', timezone: 'Africa/Porto-Novo', offset: 'UTC +01:00', value: 'Africa/Porto-Novo' },
  { code: 'BM', country: 'Bermuda', timezone: 'Atlantic/Bermuda', offset: 'UTC -04:00', value: 'Atlantic/Bermuda' },
  { code: 'BT', country: 'Bhutan', timezone: 'Asia/Thimphu', offset: 'UTC +06:00', value: 'Asia/Thimphu' },
  { code: 'BO', country: 'Bolivia', timezone: 'America/La_Paz', offset: 'UTC -04:00', value: 'America/La_Paz' },
  { code: 'BA', country: 'Bosnia and Herzegovina', timezone: 'Europe/Sarajevo', offset: 'UTC +01:00', value: 'Europe/Sarajevo' },
  { code: 'BW', country: 'Botswana', timezone: 'Africa/Gaborone', offset: 'UTC +02:00', value: 'Africa/Gaborone' },
  { code: 'BR', country: 'Brazil', timezone: 'America/Sao_Paulo', offset: 'UTC -03:00', value: 'America/Sao_Paulo' },
  { code: 'GB', country: 'United Kingdom', timezone: 'Europe/London', offset: 'UTC +00:00', value: 'Europe/London' },
  { code: 'US', country: 'United States', timezone: 'America/New_York', offset: 'UTC -05:00', value: 'America/New_York' },
  { code: 'CA', country: 'Canada', timezone: 'America/Toronto', offset: 'UTC -05:00', value: 'America/Toronto' },
  { code: 'IN', country: 'India', timezone: 'Asia/Kolkata', offset: 'UTC +05:30', value: 'Asia/Kolkata' },
  { code: 'PK', country: 'Pakistan', timezone: 'Asia/Karachi', offset: 'UTC +05:00', value: 'Asia/Karachi' },
  { code: 'JP', country: 'Japan', timezone: 'Asia/Tokyo', offset: 'UTC +09:00', value: 'Asia/Tokyo' },
  { code: 'CN', country: 'China', timezone: 'Asia/Shanghai', offset: 'UTC +08:00', value: 'Asia/Shanghai' },
  { code: 'SG', country: 'Singapore', timezone: 'Asia/Singapore', offset: 'UTC +08:00', value: 'Asia/Singapore' },
  { code: 'HK', country: 'Hong Kong', timezone: 'Asia/Hong_Kong', offset: 'UTC +08:00', value: 'Asia/Hong_Kong' },
  { code: 'MY', country: 'Malaysia', timezone: 'Asia/Kuala_Lumpur', offset: 'UTC +08:00', value: 'Asia/Kuala_Lumpur' },
  { code: 'TH', country: 'Thailand', timezone: 'Asia/Bangkok', offset: 'UTC +07:00', value: 'Asia/Bangkok' },
  { code: 'VN', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', offset: 'UTC +07:00', value: 'Asia/Ho_Chi_Minh' },
  { code: 'PH', country: 'Philippines', timezone: 'Asia/Manila', offset: 'UTC +08:00', value: 'Asia/Manila' },
  { code: 'ID', country: 'Indonesia', timezone: 'Asia/Jakarta', offset: 'UTC +07:00', value: 'Asia/Jakarta' },
  { code: 'NZ', country: 'New Zealand', timezone: 'Pacific/Auckland', offset: 'UTC +12:00', value: 'Pacific/Auckland' },
  { code: 'AE', country: 'United Arab Emirates', timezone: 'Asia/Dubai', offset: 'UTC +04:00', value: 'Asia/Dubai' },
  { code: 'SA', country: 'Saudi Arabia', timezone: 'Asia/Riyadh', offset: 'UTC +03:00', value: 'Asia/Riyadh' },
  { code: 'ZA', country: 'South Africa', timezone: 'Africa/Johannesburg', offset: 'UTC +02:00', value: 'Africa/Johannesburg' },
  { code: 'EG', country: 'Egypt', timezone: 'Africa/Cairo', offset: 'UTC +02:00', value: 'Africa/Cairo' },
  { code: 'FR', country: 'France', timezone: 'Europe/Paris', offset: 'UTC +01:00', value: 'Europe/Paris' },
  { code: 'DE', country: 'Germany', timezone: 'Europe/Berlin', offset: 'UTC +01:00', value: 'Europe/Berlin' },
  { code: 'IT', country: 'Italy', timezone: 'Europe/Rome', offset: 'UTC +01:00', value: 'Europe/Rome' },
  { code: 'ES', country: 'Spain', timezone: 'Europe/Madrid', offset: 'UTC +01:00', value: 'Europe/Madrid' },
  { code: 'RU', country: 'Russia', timezone: 'Europe/Moscow', offset: 'UTC +03:00', value: 'Europe/Moscow' },
  { code: 'MX', country: 'Mexico', timezone: 'America/Mexico_City', offset: 'UTC -06:00', value: 'America/Mexico_City' },
  { code: 'TR', country: 'Turkey', timezone: 'Europe/Istanbul', offset: 'UTC +03:00', value: 'Europe/Istanbul' },
  { code: 'KR', country: 'South Korea', timezone: 'Asia/Seoul', offset: 'UTC +09:00', value: 'Asia/Seoul' },
  { code: 'TW', country: 'Taiwan', timezone: 'Asia/Taipei', offset: 'UTC +08:00', value: 'Asia/Taipei' },
  { code: 'MM', country: 'Myanmar', timezone: 'Asia/Yangon', offset: 'UTC +06:30', value: 'Asia/Yangon' },
  { code: 'LK', country: 'Sri Lanka', timezone: 'Asia/Colombo', offset: 'UTC +05:30', value: 'Asia/Colombo' },
  { code: 'NP', country: 'Nepal', timezone: 'Asia/Kathmandu', offset: 'UTC +05:45', value: 'Asia/Kathmandu' },
  { code: 'IL', country: 'Israel', timezone: 'Asia/Jerusalem', offset: 'UTC +02:00', value: 'Asia/Jerusalem' },
  { code: 'IR', country: 'Iran', timezone: 'Asia/Tehran', offset: 'UTC +03:30', value: 'Asia/Tehran' }
]

const HotelMaster = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [hotels, setHotels] = useState([])
  const [currencies, setCurrencies] = useState([])
  const [cities, setCities] = useState([])
  const [citySearch, setCitySearch] = useState('')
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(null)
  
  const [timezoneSearch, setTimezoneSearch] = useState('')
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false)
  const timezoneRef = useRef(null)

  const [currencySearch, setCurrencySearch] = useState('')
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false)
  const currencyRef = useRef(null)

  const [countrySearch, setCountrySearch] = useState('')
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [countries, setCountries] = useState([])
  const countryRef = useRef(null)

  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  const [formData, setFormData] = useState({
    hotelName: '',
    hotelCode: '',
    address: '',
    timezone: 'UTC',
    checkInTime: '',
    checkOutTime: '',
    currency: '',
    cityId: null,
    city: '',
    state: '',
    country: '',
    latitude: '',
    longitude: '',
    pinCode: '',
    phone: '',
    mobile: '',
    email: '',
    website: '',
    fax: '',
    gstNumber: '',
    panNumber: '',
    licenseNumber: '',
    description: '',
    logo: null,
    isActive: true
  })

  const [errors, setErrors] = useState({})

  // Load hotels on component mount
  useEffect(() => {
    fetchHotels()
    fetchCities('')
    fetchCurrencies('')
    fetchAllCountries()
  }, [])

  // Close city dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCityDropdown && !event.target.closest('.city-dropdown')) {
        setShowCityDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCityDropdown])

  // Close timezone dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timezoneRef.current && !timezoneRef.current.contains(event.target)) {
        setShowTimezoneDropdown(false)
      }
    }

    if (showTimezoneDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showTimezoneDropdown])

  // Close currency dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setShowCurrencyDropdown(false)
      }
    }

    if (showCurrencyDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showCurrencyDropdown])

  // Close country dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setShowCountryDropdown(false)
      }
    }

    if (showCountryDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showCountryDropdown])

  // Initialize/update map when coordinates change
  useEffect(() => {
    if (!showForm || !mapRef.current) return

    const lat = parseFloat(formData.latitude)
    const lng = parseFloat(formData.longitude)

    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      setTimeout(() => {
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = L.map(mapRef.current).setView([lat, lng], 13)
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(mapInstanceRef.current)
        } else {
          mapInstanceRef.current.setView([lat, lng], 13)
        }
        L.marker([lat, lng]).addTo(mapInstanceRef.current)
      }, 100)
    }
  }, [formData.latitude, formData.longitude, showForm])

  const handleCitySelect = (city) => {
    setCitySearch(city.name || '')
    setFormData(prev => ({
      ...prev,
      cityId: city.id,
      city: city.name
    }))
    setShowCityDropdown(false)
  }

  const fetchCities = async (search) => {
    try {
      const response = await axios.get(`/Cities?page=1&pageSize=500&search=${encodeURIComponent(search || '')}`)
      if (response.data && response.data.success) {
        setCities(response.data.data || [])
      }
    } catch (err) {
      console.error('Error fetching cities:', err)
    }
  }

  const fetchCurrencies = async (search) => {
    try {
      const response = await axios.get(`/Currency?page=1&pageSize=500&search=${encodeURIComponent(search || '')}`)
      if (response.data && response.data.success) {
        setCurrencies(response.data.data || [])
      }
    } catch (err) {
      console.error('Error fetching currencies:', err)
    }
  }

  const fetchAllCountries = async () => {
    try {
      const response = await axios.get(`/Countries?page=1&pageSize=500&search=`)
      if (response.data && response.data.success) {
        const countryList = Array.isArray(response.data.data) ? response.data.data : []
        setCountries(countryList)
      }
    } catch (err) {
      console.error('Error fetching countries:', err)
      setCountries([])
    }
  }

  const fetchCountriesBySearch = async (search) => {
    try {
      const response = await axios.get(`/Countries?page=1&pageSize=500&search=${encodeURIComponent(search || '')}`)
      if (response.data && response.data.success) {
        const countryList = Array.isArray(response.data.data) ? response.data.data : []
        setCountries(countryList)
      }
    } catch (err) {
      console.error('Error fetching countries:', err)
      setCountries([])
    }
  }

  // Fetch hotels from API - PURE API CALL
  const fetchHotels = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/Hotels')
      
      if (response.data && response.data.success) {
        setHotels(response.data.data)
        setSuccess(response.data.message || 'Hotels loaded successfully')
      } else {
        setError('No hotel data received')
        setHotels([])
      }
    } catch (err) {
      console.error('Error fetching hotels:', err)
      setError(err.response?.data?.message || 'Failed to load hotels. Please ensure the API server is running on port 5001.')
      setHotels([])
    } finally {
      setLoading(false)
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.hotelName.trim()) {
      newErrors.hotelName = 'Hotel name is required'
    }
    
    if (!formData.hotelCode.trim()) {
      newErrors.hotelCode = 'Hotel code is required'
    }

    if (!String(formData.currency || '').trim()) {
      newErrors.currency = 'Currency is required'
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission - PURE API CALL
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      setLoading(true)
      setError('')
      
      // Transform form data to match backend DTO
      const apiData = {
        HotelName: formData.hotelName,
        HotelCode: formData.hotelCode,
        Address: formData.address,
        CityId: formData.cityId,
        City: formData.city,
        State: formData.state,
        Country: formData.country,
        Latitude: formData.latitude === '' ? null : Number(formData.latitude),
        Longitude: formData.longitude === '' ? null : Number(formData.longitude),
        PostalCode: formData.pinCode,
        PhoneNumber: formData.phone,
        Email: formData.email,
        Website: formData.website,
        FaxNumber: formData.fax,
        GSTNumber: formData.gstNumber,
        PANNumber: formData.panNumber,
        LicenseNumber: formData.licenseNumber,
        ManagerName: '',
        ManagerPhone: formData.mobile,
        ManagerEmail: '',
        TotalRooms: 0,
        TotalFloors: 0,
        EstablishedDate: new Date().toISOString(),
        StarRating: '3 Star',
        Description: formData.description,
        IsMainBranch: true,
        Currency: (formData.currency || 'PKR').toString().trim(),
        CheckInTime: formData.checkInTime || '',
        CheckOutTime: formData.checkOutTime || '',
        TimeZone: formData.timezone || 'UTC'
      }
      
      let response
      if (editingId) {
        response = await axios.put(`/Hotels/${editingId}`, apiData)
      } else {
        response = await axios.post('/Hotels', apiData)
      }

      if (response.data && response.data.success) {
        const savedHotelId = editingId || response.data?.data?.id || response.data?.data?.Id

        if (savedHotelId && formData.logo instanceof File) {
          try {
            const fd = new FormData()
            fd.append('logo', formData.logo)
            await axios.post(`/Hotels/${savedHotelId}/logo`, fd, {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
          } catch (uploadErr) {
            console.error('Error uploading hotel logo:', uploadErr)
            setError(uploadErr.response?.data?.message || 'Hotel saved but logo upload failed')
          }
        }

        setSuccess(editingId ? 'Hotel updated successfully' : 'Hotel added successfully')
        handleReset()
        setShowForm(false)
        fetchHotels()
      } else {
        setError('Failed to save hotel')
      }
    } catch (err) {
      console.error('Error saving hotel:', err)
      setError(err.response?.data?.message || 'Failed to save hotel')
    } finally {
      setLoading(false)
    }
  }

  // Delete hotel - PURE API CALL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return

    try {
      setLoading(true)
      const response = await axios.delete(`/Hotels/${id}`)
      
      if (response.data && response.data.success) {
        setSuccess('Hotel deleted successfully')
        fetchHotels()
      } else {
        setError('Failed to delete hotel')
      }
    } catch (err) {
      console.error('Error deleting hotel:', err)
      setError(err.response?.data?.message || 'Failed to delete hotel')
    } finally {
      setLoading(false)
    }
  }

  // Edit hotel
  const handleEdit = (hotel) => {
    const existingLogoPath = hotel.logoPath || hotel.LogoPath || hotel.logo || null
    setFormData({
      hotelName: hotel.hotelName || hotel.HotelName || '',
      hotelCode: hotel.hotelCode || hotel.HotelCode || '',
      address: hotel.address || hotel.Address || '',
      timezone: hotel.timeZone || hotel.TimeZone || hotel.timezone || hotel.Timezone || 'UTC',
      checkInTime: hotel.checkInTime || hotel.CheckInTime || '',
      checkOutTime: hotel.checkOutTime || hotel.CheckOutTime || '',
      currency: hotel.currency || hotel.Currency || '',
      cityId: hotel.cityId || hotel.CityId || null,
      city: hotel.city || hotel.City || '',
      state: hotel.state || hotel.State || '',
      country: hotel.country || hotel.Country || '',
      latitude: (hotel.latitude ?? hotel.Latitude ?? '') === null ? '' : String(hotel.latitude ?? hotel.Latitude ?? ''),
      longitude: (hotel.longitude ?? hotel.Longitude ?? '') === null ? '' : String(hotel.longitude ?? hotel.Longitude ?? ''),
      pinCode: hotel.postalCode || hotel.PostalCode || hotel.pinCode || '',
      phone: hotel.phoneNumber || hotel.PhoneNumber || hotel.phone || '',
      mobile: hotel.managerPhone || hotel.ManagerPhone || hotel.mobile || '',
      email: hotel.email || hotel.Email || '',
      website: hotel.website || hotel.Website || '',
      fax: hotel.faxNumber || hotel.FaxNumber || hotel.fax || '',
      gstNumber: hotel.gstNumber || hotel.GSTNumber || '',
      panNumber: hotel.panNumber || hotel.PANNumber || '',
      licenseNumber: hotel.licenseNumber || hotel.LicenseNumber || '',
      description: hotel.description || hotel.Description || '',
      logo: existingLogoPath,
      isActive: hotel.isActive !== undefined ? hotel.isActive : (hotel.IsActive !== undefined ? hotel.IsActive : true)
    })
    setLogoPreviewUrl(getImageUrl(existingLogoPath))
    setCitySearch(hotel.city || hotel.City || '')
    setShowCityDropdown(false)
    setEditingId(hotel.id || hotel.Id)
    setShowForm(true)
  }

  useEffect(() => {
    if (!showForm) return

    if (!currencySearch && formData.currency) {
      const code = String(formData.currency)
      const found = (currencies || []).find((c) => String(c.code ?? c.Code ?? '') === code)
      if (found) {
        setCurrencySearch(`${found.code ?? found.Code} - ${found.name ?? found.Name}`)
      } else {
        setCurrencySearch(code)
      }
    }
  }, [showForm, currencies, currencySearch, formData.currency])

  useEffect(() => {
    if (!showForm) return

    // Keep input text in sync with stored city value on open/edit
    if (!citySearch && formData.city) {
      setCitySearch(formData.city)
    }
  }, [showForm, formData.city, citySearch])

  useEffect(() => {
    if (!showForm) return

    // Sync country search with formData on open/edit
    if (formData.country && !countrySearch) {
      setCountrySearch(formData.country)
    }
  }, [showForm, editingId])

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Reset form
  const handleReset = () => {
    setFormData({
      hotelName: '',
      hotelCode: '',
      address: '',
      timezone: 'UTC',
      checkInTime: '',
      checkOutTime: '',
      currency: '',
      cityId: null,
      city: '',
      state: '',
      country: '',
      latitude: '',
      longitude: '',
      pinCode: '',
      phone: '',
      mobile: '',
      email: '',
      website: '',
      fax: '',
      gstNumber: '',
      panNumber: '',
      licenseNumber: '',
      description: '',
      logo: null,
      isActive: true
    })
    setLogoPreviewUrl(null)
    setCitySearch('')
    setShowCityDropdown(false)
    setTimezoneSearch('')
    setShowTimezoneDropdown(false)
    setCurrencySearch('')
    setShowCurrencyDropdown(false)
    setCountrySearch('')
    setShowCountryDropdown(false)
    setErrors({})
    setEditingId(null)
    setShowForm(false)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }
  }

  // Filter hotels based on search
  const filteredHotels = hotels.filter(hotel =>
    (hotel.HotelName || hotel.hotelName)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (hotel.HotelCode || hotel.hotelCode)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (hotel.City || hotel.city)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (hotel.Email || hotel.email)?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Hotel Master</h1>
            <p className="text-blue-100">Manage hotel information and settings</p>
          </div>
          <div className="flex items-center space-x-4">
            <BuildingOfficeIcon className="h-12 w-12 text-blue-200" />
            <button
              onClick={() => setShowForm(true)}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center space-x-2 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Hotel</span>
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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search hotels by name, code, city, or email..."
          />
        </div>
      </div>

      {/* Hotels List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Hotels List ({filteredHotels.length} hotels)
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading hotels...</p>
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <BuildingOfficeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No hotels found</p>
            <p className="text-sm mt-1">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first hotel.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timezone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Legal Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHotels.map((hotel) => (
                  <tr key={hotel.Id || hotel.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {(() => {
                          const logoPath = hotel.LogoPath || hotel.logoPath
                          const logoUrl = getImageUrl(logoPath)
                          if (logoUrl) {
                            return (
                              <img
                                src={logoUrl}
                                alt="Hotel Logo"
                                className="h-10 w-10 rounded-full object-contain border border-gray-200 bg-white mr-3"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            )
                          }
                          return (
                            <div className="bg-blue-100 p-2 rounded-full mr-3">
                              <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
                            </div>
                          )
                        })()}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{hotel.HotelName || hotel.hotelName}</div>
                          <div className="text-sm text-gray-500">Code: {hotel.HotelCode || hotel.hotelCode}</div>
                          <div className="text-sm text-gray-500">Currency: {hotel.Currency || hotel.currency || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {hotel.PhoneNumber || hotel.phone}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {hotel.Email || hotel.email}
                      </div>
                      {(hotel.Website || hotel.website) && (
                        <div className="text-sm text-blue-600 flex items-center">
                          <GlobeAltIcon className="h-4 w-4 mr-1 text-gray-400" />
                          <a href={hotel.Website || hotel.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            Website
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{hotel.City || hotel.city}</div>
                      <div className="text-sm text-gray-500">{hotel.State || hotel.state}, {hotel.Country || hotel.country}</div>
                      <div className="text-sm text-gray-500">PIN: {hotel.PostalCode || hotel.pinCode}</div>
                      {((hotel.Latitude ?? hotel.latitude) !== undefined || (hotel.Longitude ?? hotel.longitude) !== undefined) && (
                        <div className="text-sm text-gray-500">
                          Lat: {hotel.Latitude ?? hotel.latitude ?? 'N/A'} | Lng: {hotel.Longitude ?? hotel.longitude ?? 'N/A'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{hotel.Timezone || hotel.timezone || 'UTC'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">GST: {hotel.GSTNumber || hotel.gstNumber || 'N/A'}</div>
                      <div className="text-sm text-gray-500">NTN: {hotel.PANNumber || hotel.panNumber || 'N/A'}</div>
                      <div className="text-sm text-gray-500">License: {hotel.LicenseNumber || hotel.licenseNumber || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        (hotel.IsActive !== undefined ? hotel.IsActive : hotel.isActive) 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {(hotel.IsActive !== undefined ? hotel.IsActive : hotel.isActive) ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(hotel)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit Hotel"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(hotel.Id || hotel.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Hotel"
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
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingId ? 'Edit Hotel' : 'Add New Hotel'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hotel Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="hotelName"
                        value={formData.hotelName}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.hotelName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter hotel name"
                      />
                      {errors.hotelName && (
                        <p className="mt-1 text-sm text-red-600">{errors.hotelName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hotel Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="hotelCode"
                        value={formData.hotelCode}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.hotelCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter hotel code"
                      />
                      {errors.hotelCode && (
                        <p className="mt-1 text-sm text-red-600">{errors.hotelCode}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency <span className="text-red-500">*</span>
                      </label>
                      <div className="relative" ref={currencyRef}>
                        <input
                          type="text"
                          placeholder="Search currency..."
                          value={currencySearch}
                          onChange={(e) => {
                            const val = e.target.value
                            setCurrencySearch(val)
                            setShowCurrencyDropdown(true)
                            fetchCurrencies(val)
                          }}
                          onFocus={() => {
                            setShowCurrencyDropdown(true)
                            fetchCurrencies('')
                          }}
                          autoComplete="off"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.currency ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {showCurrencyDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-2xl z-50 max-h-64 overflow-hidden flex flex-col">
                            <div className="overflow-y-auto flex-1">
                              {(currencies || []).map((c) => (
                                <button
                                  key={c.id ?? c.Id ?? `${c.code ?? c.Code}-${c.name ?? c.Name}`}
                                  type="button"
                                  onClick={() => {
                                    const code = (c.code ?? c.Code ?? '').toString()
                                    const name = (c.name ?? c.Name ?? '').toString()
                                    setFormData((prev) => ({ ...prev, currency: code }))
                                    setCurrencySearch(`${code} - ${name}`)
                                    setShowCurrencyDropdown(false)
                                  }}
                                  className="w-full text-left hover:bg-blue-100 border-b border-gray-200 last:border-b-0 px-3 py-2 text-sm"
                                >
                                  <div className="font-semibold text-gray-900">{c.code ?? c.Code} - {c.name ?? c.Name}</div>
                                </button>
                              ))}
                              {(currencies || []).length === 0 && (
                                <div className="px-3 py-4 text-sm text-gray-500 text-center">No currencies found</div>
                              )}
                            </div>
                            <div
                              onClick={() => {
                                setCurrencySearch('')
                                setFormData(prev => ({ ...prev, currency: '' }))
                                setShowCurrencyDropdown(false)
                              }}
                              className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer border-t"
                            >
                              Clear Selection
                            </div>
                          </div>
                        )}
                      </div>
                      {errors.currency && (
                        <p className="mt-1 text-sm text-red-600">{errors.currency}</p>
                      )}
                    </div>

                    <div className="flex items-end">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleChange}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm text-gray-700">Active</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Address Information
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Time</label>
                        <input
                          type="time"
                          name="checkInTime"
                          value={formData.checkInTime}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time</label>
                        <input
                          type="time"
                          name="checkOutTime"
                          value={formData.checkOutTime}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                        <div className="relative" ref={timezoneRef}>
                          <input
                            type="text"
                            placeholder="Search or type..."
                            value={timezoneSearch}
                            onChange={(e) => {
                              setTimezoneSearch(e.target.value)
                              setShowTimezoneDropdown(true)
                            }}
                            onFocus={() => setShowTimezoneDropdown(true)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {showTimezoneDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-2xl z-50 max-h-80 overflow-hidden flex flex-col">
                              <div className="sticky top-0 bg-gray-100 border-b border-gray-300 px-0 py-0">
                                <div className="grid gap-0" style={{ gridTemplateColumns: '60px 120px 150px 100px' }}>
                                  <div className="px-3 py-2 text-xs font-bold text-gray-800 border-r border-gray-300">Code</div>
                                  <div className="px-3 py-2 text-xs font-bold text-gray-800 border-r border-gray-300">Country</div>
                                  <div className="px-3 py-2 text-xs font-bold text-gray-800 border-r border-gray-300">Timezone</div>
                                  <div className="px-3 py-2 text-xs font-bold text-gray-800">UTC Offset</div>
                                </div>
                              </div>
                              <div className="overflow-y-auto flex-1">
                                {TIMEZONES.filter(tz => 
                                  !timezoneSearch || 
                                  tz.code.toLowerCase().includes(timezoneSearch.toLowerCase()) ||
                                  tz.country.toLowerCase().includes(timezoneSearch.toLowerCase()) ||
                                  tz.timezone.toLowerCase().includes(timezoneSearch.toLowerCase()) ||
                                  tz.offset.toLowerCase().includes(timezoneSearch.toLowerCase())
                                ).map(tz => (
                                  <button
                                    key={`${tz.code}-${tz.timezone}`}
                                    type="button"
                                    onClick={() => {
                                      setFormData({...formData, timezone: tz.value})
                                      setTimezoneSearch('')
                                      setShowTimezoneDropdown(false)
                                    }}
                                    className="w-full text-left hover:bg-blue-100 border-b border-gray-200 last:border-b-0 text-sm grid gap-0 items-center transition-colors"
                                    style={{ gridTemplateColumns: '60px 120px 150px 100px' }}
                                  >
                                    <div className="px-3 py-2 font-semibold text-gray-900 border-r border-gray-200 truncate">{tz.code}</div>
                                    <div className="px-3 py-2 text-gray-700 border-r border-gray-200 truncate text-xs">{tz.country}</div>
                                    <div className="px-3 py-2 text-gray-700 border-r border-gray-200 truncate text-xs">{tz.timezone}</div>
                                    <div className="px-3 py-2 text-gray-600 text-xs truncate">{tz.offset}</div>
                                  </button>
                                ))}
                                {TIMEZONES.filter(tz => 
                                  !timezoneSearch || 
                                  tz.code.toLowerCase().includes(timezoneSearch.toLowerCase()) ||
                                  tz.country.toLowerCase().includes(timezoneSearch.toLowerCase()) ||
                                  tz.timezone.toLowerCase().includes(timezoneSearch.toLowerCase()) ||
                                  tz.offset.toLowerCase().includes(timezoneSearch.toLowerCase())
                                ).length === 0 && (
                                  <div className="px-3 py-4 text-sm text-gray-500 text-center">No timezones found</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        {formData.timezone && (
                          <div className="text-xs text-gray-600 mt-1">
                            Selected: <span className="font-semibold text-gray-900">{formData.timezone}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <div className="relative city-dropdown">
                          <input
                            type="text"
                            value={citySearch}
                            onChange={(e) => {
                              const value = e.target.value
                              setCitySearch(value)
                              setShowCityDropdown(true)
                              fetchCities(value || '')
                              setFormData(prev => ({
                                ...prev,
                                cityId: null,
                                city: value
                              }))
                            }}
                            onFocus={() => {
                              setShowCityDropdown(true)
                              fetchCities('')
                            }}
                            autoComplete="off"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Search city"
                          />

                          {showCityDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              {cities.length > 0 ? (
                                <>
                                  <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                                    {cities.length} city(s) found
                                  </div>
                                  {cities.map((c) => (
                                    <div
                                      key={c.id}
                                      onClick={() => handleCitySelect(c)}
                                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    >
                                      <div className="text-sm text-gray-900">{c.name}</div>
                                      {c.state && (
                                        <div className="text-xs text-gray-500">{c.state}</div>
                                      )}
                                    </div>
                                  ))}
                                </>
                              ) : citySearch ? (
                                <div className="px-4 py-3 text-gray-500 text-center">
                                  No cities found matching "{citySearch}"
                                </div>
                              ) : (
                                <div className="px-4 py-3 text-gray-500 text-center">
                                  Click to see all cities...
                                </div>
                              )}

                              <div
                                onClick={() => {
                                  setCitySearch('')
                                  setFormData(prev => ({ ...prev, cityId: null, city: '' }))
                                  fetchCities('')
                                }}
                                className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer border-t"
                              >
                                Clear Selection
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <div className="relative" ref={countryRef}>
                          <input
                            type="text"
                            placeholder="Search country..."
                            value={countrySearch}
                            onChange={(e) => {
                              const val = e.target.value
                              setCountrySearch(val)
                              setShowCountryDropdown(true)
                              fetchCountriesBySearch(val)
                            }}
                            onFocus={() => {
                              setShowCountryDropdown(true)
                              fetchAllCountries()
                            }}
                            autoComplete="off"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {showCountryDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-2xl z-50 max-h-64 overflow-y-auto">
                              {(countries || []).map((c) => (
                                <button
                                  key={c.id || c.Id}
                                  type="button"
                                  onClick={() => {
                                    const countryName = c.name || c.Name
                                    setFormData((prev) => ({ ...prev, country: countryName }))
                                    setCountrySearch(countryName)
                                    setShowCountryDropdown(false)
                                  }}
                                  className="w-full text-left hover:bg-blue-100 border-b border-gray-200 last:border-b-0 px-3 py-2 text-sm"
                                >
                                  <div className="font-semibold text-gray-900">{c.name || c.Name}</div>
                                </button>
                              ))}
                              {(countries || []).length === 0 && (
                                <div className="px-3 py-4 text-sm text-gray-500 text-center">No countries found</div>
                              )}
                              <div
                                onClick={() => {
                                  setCountrySearch('')
                                  setFormData(prev => ({ ...prev, country: '' }))
                                  setShowCountryDropdown(false)
                                }}
                                className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer border-t"
                              >
                                Clear Selection
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                        <input
                          type="text"
                          name="pinCode"
                          value={formData.pinCode}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="PIN Code"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                        <input
                          type="number"
                          step="any"
                          name="latitude"
                          value={formData.latitude}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g. 33.6844"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                        <input
                          type="number"
                          step="any"
                          name="longitude"
                          value={formData.longitude}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g. 73.0479"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter complete address"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                      )}
                    </div>

                    {(formData.latitude || formData.longitude) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location Map</label>
                        <div
                          ref={mapRef}
                          className="w-full h-64 border border-gray-300 rounded-lg"
                          style={{ minHeight: '300px' }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                    <PhoneIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Phone number"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Mobile number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Email address"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Website URL"
                      />
                    </div>
                  </div>
                </div>

                {/* Legal Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Legal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                      <input
                        type="text"
                        name="gstNumber"
                        value={formData.gstNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="GST Number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">NTN Number</label>
                      <input
                        type="text"
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="NTN Number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="License Number"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Additional Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Logo</label>
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden">
                          {logoPreviewUrl ? (
                            <img src={logoPreviewUrl} alt="Logo Preview" className="h-full w-full object-contain" />
                          ) : (
                            <CameraIcon className="h-7 w-7 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (!file) {
                                setFormData(prev => ({ ...prev, logo: null }))
                                setLogoPreviewUrl(null)
                                return
                              }

                              setFormData(prev => ({ ...prev, logo: file }))
                              const preview = URL.createObjectURL(file)
                              setLogoPreviewUrl(preview)
                            }}
                            className="block w-full text-sm text-gray-700"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Supported: JPG, PNG, WEBP. Upload after save.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Hotel description"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingId ? 'Update' : 'Add')} Hotel
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

export default HotelMaster;
