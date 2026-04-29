import { useState, useEffect, useRef } from 'react'
import axios from '../../utils/axios'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
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
  { code: 'AU', country: 'Australia', timezone: 'Australia/Melbourne', offset: 'UTC +10:00', value: 'Australia/Melbourne' },
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
  { code: 'TH', country: 'Thailand', timezone: 'Asia/Bangkok', offset: 'UTC +07:00', value: 'Asia/Bangkok' },
  { code: 'MM', country: 'Myanmar', timezone: 'Asia/Yangon', offset: 'UTC +06:30', value: 'Asia/Yangon' },
  { code: 'LK', country: 'Sri Lanka', timezone: 'Asia/Colombo', offset: 'UTC +05:30', value: 'Asia/Colombo' },
  { code: 'NP', country: 'Nepal', timezone: 'Asia/Kathmandu', offset: 'UTC +05:45', value: 'Asia/Kathmandu' },
  { code: 'IL', country: 'Israel', timezone: 'Asia/Jerusalem', offset: 'UTC +02:00', value: 'Asia/Jerusalem' },
  { code: 'IR', country: 'Iran', timezone: 'Asia/Tehran', offset: 'UTC +03:30', value: 'Asia/Tehran' }
]

const CancellationPolicyManager = () => {
  const [hotelId, setHotelId] = useState('')
  const [hotels, setHotels] = useState([])
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [timezoneSearch, setTimezoneSearch] = useState('')
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false)
  const timezoneRef = useRef(null)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    isRefundable: true,
    freeCancellationHours: null,
    penaltyAfterDeadline: '',
    penaltyAppliesToDate: 'Arrival date',
    noShowPenalty: '',
    earlyDeparturePenalty: '',
    timezone: 'UTC',
    priority: 0,
    displayTextDefault: '',
    displayTextWebsite: '',
    displayTextBookingCom: '',
    displayTextExpedia: '',
    displayTextOTA: '',
    appliesAllChannels: true
  })

  useEffect(() => {
    fetchHotels()
  }, [])

  useEffect(() => {
    if (hotelId) {
      fetchPolicies()
    }
  }, [hotelId])

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

  const fetchHotels = async () => {
    try {
      const response = await axios.get('/hotels')
      if (response.data.success) {
        setHotels(response.data.data)
        if (response.data.data.length > 0) {
          setHotelId(response.data.data[0].id)
        }
      }
    } catch (err) {
      console.error('Error fetching hotels:', err)
    }
  }

  const fetchPolicies = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/cancellationpolicy/hotel/${hotelId}`)
      if (response.data.success) {
        setPolicies(response.data.data)
        setError('')
      }
    } catch (err) {
      console.error('Error fetching policies:', err)
      setError('Failed to load policies')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.code || !formData.name) {
      setError('Code and Name are required')
      return
    }

    try {
      setLoading(true)
      const payload = {
        hotelId: parseInt(hotelId),
        ...formData,
        freeCancellationHours: formData.freeCancellationHours ? parseInt(formData.freeCancellationHours) : null,
        priority: parseInt(formData.priority)
      }

      if (editingId) {
        await axios.put(`/cancellationpolicy/${editingId}`, payload)
        setSuccess('Policy updated successfully')
      } else {
        await axios.post('/cancellationpolicy', payload)
        setSuccess('Policy created successfully')
      }

      fetchPolicies()
      setShowForm(false)
      resetForm()
    } catch (err) {
      console.error('Error saving policy:', err)
      setError(err.response?.data?.message || 'Failed to save policy')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`/cancellationpolicy/${id}`)
      if (response.data.success) {
        setFormData(response.data.data)
        setEditingId(id)
        setShowForm(true)
      }
    } catch (err) {
      console.error('Error fetching policy:', err)
      setError('Failed to load policy')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this policy?')) return

    try {
      setLoading(true)
      await axios.delete(`/cancellationpolicy/${id}`)
      setSuccess('Policy deleted successfully')
      fetchPolicies()
    } catch (err) {
      console.error('Error deleting policy:', err)
      setError(err.response?.data?.message || 'Failed to delete policy')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      isRefundable: true,
      freeCancellationHours: null,
      penaltyAfterDeadline: '',
      penaltyAppliesToDate: 'Arrival date',
      noShowPenalty: '',
      earlyDeparturePenalty: '',
      timezone: 'UTC',
      priority: 0,
      displayTextDefault: '',
      displayTextWebsite: '',
      displayTextBookingCom: '',
      displayTextExpedia: '',
      displayTextOTA: '',
      appliesAllChannels: true
    })
    setEditingId(null)
    setError('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cancellation Policies</h1>
            <p className="text-gray-600 mt-1">Manage refund and penalty rules</p>
          </div>
          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Policy</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <ExclamationCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
          <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-800">{success}</p>
          </div>
        </div>
      )}

      {/* Hotel Filter */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Hotel</label>
        <select
          value={hotelId}
          onChange={(e) => setHotelId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
        >
          <option value="">-- Select Hotel --</option>
          {hotels.map(h => (
            <option key={h.id} value={h.id}>{h.hotelName}</option>
          ))}
        </select>
      </div>

      {/* Policies Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Refundable</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Free Cancel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penalty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No-Show</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : policies.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No policies found</td>
                </tr>
              ) : (
                policies.map(policy => (
                  <tr key={policy.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{policy.code}</div>
                      <div className="text-sm text-gray-500 whitespace-normal break-words line-clamp-2">{policy.description || ''}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{policy.name}</td>
                    <td className="px-6 py-4 text-sm">
                      {policy.isRefundable ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Yes</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{policy.freeCancelText}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{policy.penaltyText}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{policy.noShowText}</td>
                    <td className="px-6 py-4 text-sm">
                      {policy.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Active</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2 flex">
                      <button
                        onClick={() => handleEdit(policy.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(policy.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Policy' : 'New Cancellation Policy'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info - Code and Name in one row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="e.g., CAN48"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Free cancel 48h"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Description - Full width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Enter policy description"
                />
              </div>

              {/* Refund Rules */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Refund Rules</h3>
                
                <label className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    checked={formData.isRefundable}
                    onChange={(e) => setFormData({...formData, isRefundable: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Refundable</span>
                </label>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Free Cancellation (hours)
                    </label>
                    <input
                      type="number"
                      value={formData.freeCancellationHours || ''}
                      onChange={(e) => setFormData({...formData, freeCancellationHours: e.target.value})}
                      placeholder="e.g., 48"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Penalty After Deadline
                    </label>
                    <input
                      type="text"
                      value={formData.penaltyAfterDeadline}
                      onChange={(e) => setFormData({...formData, penaltyAfterDeadline: e.target.value})}
                      placeholder="e.g., 1 night, 100%"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Penalty Applies To
                    </label>
                    <select
                      value={formData.penaltyAppliesToDate}
                      onChange={(e) => setFormData({...formData, penaltyAppliesToDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="Arrival date">Arrival date</option>
                      <option value="Booking date">Booking date</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      No-Show Penalty
                    </label>
                    <input
                      type="text"
                      value={formData.noShowPenalty}
                      onChange={(e) => setFormData({...formData, noShowPenalty: e.target.value})}
                      placeholder="e.g., 1 night, 100%"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Early Departure Penalty
                  </label>
                  <input
                    type="text"
                    value={formData.earlyDeparturePenalty}
                    onChange={(e) => setFormData({...formData, earlyDeparturePenalty: e.target.value})}
                    placeholder="e.g., 1 night, None"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Settings - Priority and Timezone */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Settings</h3>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="0"
                  />
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-1">Timezone *</label>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
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
                            className="w-full text-left hover:bg-red-100 border-b border-gray-200 last:border-b-0 text-sm grid gap-0 items-center transition-colors"
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

              {/* Display Text */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Display Text (Optional)</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default</label>
                  <textarea
                    value={formData.displayTextDefault}
                    onChange={(e) => setFormData({...formData, displayTextDefault: e.target.value})}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
                    placeholder="Default display text"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <textarea
                      value={formData.displayTextWebsite}
                      onChange={(e) => setFormData({...formData, displayTextWebsite: e.target.value})}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
                      placeholder="Website text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Booking.com</label>
                    <textarea
                      value={formData.displayTextBookingCom}
                      onChange={(e) => setFormData({...formData, displayTextBookingCom: e.target.value})}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
                      placeholder="Booking.com text"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CancellationPolicyManager
