import { useState, useEffect, useCallback } from 'react'
import axios from '../../utils/axios'
import {
  SignalIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  BoltIcon
} from '@heroicons/react/24/outline'

const tabs = [
  { id: 'dashboard', name: 'Dashboard', icon: SignalIcon },
  { id: 'rooms', name: 'Room Mapping', icon: BuildingOfficeIcon },
  { id: 'rates', name: 'Rate Mapping', icon: CurrencyDollarIcon },
  { id: 'reservations', name: 'Reservations', icon: ClipboardDocumentListIcon },
  { id: 'sync', name: 'Sync Controls', icon: ArrowPathIcon },
  { id: 'logs', name: 'Activity Logs', icon: ClockIcon },
  { id: 'settings', name: 'Settings', icon: Cog6ToothIcon },
]

const ChannelManager = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [overview, setOverview] = useState(null)
  const [settings, setSettings] = useState(null)
  const [roomMappings, setRoomMappings] = useState([])
  const [rateMappings, setRateMappings] = useState([])
  const [reservations, setReservations] = useState([])
  const [logs, setLogs] = useState([])
  const [localRoomTypes, setLocalRoomTypes] = useState([])
  const [localRoomRates, setLocalRoomRates] = useState([])
  const [externalRooms, setExternalRooms] = useState([])
  const [configurationAudit, setConfigurationAudit] = useState(null)
  const [toast, setToast] = useState(null)
  const [logDetail, setLogDetail] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState(null)

  // Settings form
  const [settingsForm, setSettingsForm] = useState({
    baseUrl: 'https://stage-xrs.booklogic.net/ws/external-pms/growbiz-tech',
    sendReservationUrl: 'https://stage-xrs.booklogic.net/ws/maxi-channel/sync/reservation/xrs-channel/v5.3',
    hotelListUrl: 'https://stage-xrs.booklogic.net/ws/maxi-channel/xrs/v5.3/hotels',
    hotelInfoUrl: 'https://stage-xrs.booklogic.net/ws/maxi-channel/xrs/v5.3/hotel',
    username: 'growbiztech',
    password: '',
    hotelCode: 'FAI2553',
    channelId: 0,
    isProduction: false,
    isActive: true,
    autoSyncAvailability: false,
    autoPullReservations: false,
    autoProcessReservations: false,
    syncIntervalMinutes: 5
  })

  // Room mapping form
  const [roomMappingForm, setRoomMappingForm] = useState({
    id: 0, localRoomTypeId: '', externalRoomId: '', externalRoomName: '', isActive: true
  })
  const [showRoomForm, setShowRoomForm] = useState(false)

  // Rate mapping form
  const [rateMappingForm, setRateMappingForm] = useState({
    id: 0, channelManagerRoomMappingId: '', localRoomRateId: '',
    externalRateId: '', externalRateName: '', currencyCode: 'PKR', isActive: true
  })
  const [showRateForm, setShowRateForm] = useState(false)

  // Sync form
  const [syncForm, setSyncForm] = useState({
    reservationId: '', roomId: '', rateId: '', localRoomRateId: '', fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    allotment: 1, price: 0, minStay: 1, stopSales: 0
  })

  const selectedRateMapping = rateMappings.find(rm => String(rm.externalRateId) === String(syncForm.rateId))

  const filteredLocalRates = rateMappingForm.channelManagerRoomMappingId
    ? localRoomRates.filter(rate => {
        const roomMapping = roomMappings.find(rm => String(rm.id) === String(rateMappingForm.channelManagerRoomMappingId))
        return roomMapping ? rate.roomTypeId === roomMapping.localRoomTypeId : true
      })
    : localRoomRates

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  // ─── Data fetchers ──────────────────────────────────────────────

  const fetchOverview = useCallback(async () => {
    try {
      const res = await axios.get('/booklogic/overview')
      if (res.data?.success) setOverview(res.data.data)
    } catch (e) { console.warn('Overview fetch failed:', e.message) }
  }, [])

  const fetchConfigurationAudit = useCallback(async () => {
    try {
      const res = await axios.get('/booklogic/configuration-audit')
      if (res.data?.success) setConfigurationAudit(res.data.data)
    } catch (e) { console.warn('Configuration audit fetch failed:', e.message) }
  }, [])

  const fetchSettings = useCallback(async () => {
    try {
      const res = await axios.get('/booklogic/settings')
      if (res.data?.success && res.data.data) {
        const s = res.data.data
        setSettings(s)
        setSettingsForm({
          baseUrl: s.baseUrl || settingsForm.baseUrl,
          sendReservationUrl: s.sendReservationUrl || settingsForm.sendReservationUrl,
          hotelListUrl: s.hotelListUrl || settingsForm.hotelListUrl,
          hotelInfoUrl: s.hotelInfoUrl || settingsForm.hotelInfoUrl,
          username: s.username || settingsForm.username,
          password: '',
          hotelCode: s.hotelCode || settingsForm.hotelCode,
          channelId: s.channelId || settingsForm.channelId,
          isProduction: s.isProduction ?? false,
          isActive: s.isActive ?? true,
          autoSyncAvailability: s.autoSyncAvailability ?? false,
          autoPullReservations: s.autoPullReservations ?? false,
          autoProcessReservations: s.autoProcessReservations ?? false,
          syncIntervalMinutes: s.syncIntervalMinutes || 30
        })
      }
    } catch (e) { console.warn('Settings fetch failed:', e.message) }
  }, [])

  const fetchRoomMappings = useCallback(async () => {
    try {
      const res = await axios.get('/booklogic/room-mappings')
      if (res.data?.success) setRoomMappings(res.data.data || [])
    } catch (e) { console.warn(e.message) }
  }, [])

  const fetchRateMappings = useCallback(async () => {
    try {
      const res = await axios.get('/booklogic/rate-mappings')
      if (res.data?.success) setRateMappings(res.data.data || [])
    } catch (e) { console.warn(e.message) }
  }, [])

  const fetchReservations = useCallback(async () => {
    try {
      const res = await axios.get('/booklogic/reservations')
      if (res.data?.success) setReservations(res.data.data || [])
    } catch (e) { console.warn(e.message) }
  }, [])

  const fetchLogs = useCallback(async () => {
    try {
      const res = await axios.get('/booklogic/logs?pageSize=100')
      if (res.data?.success) setLogs(res.data.data || [])
    } catch (e) { console.warn(e.message) }
  }, [])

  const fetchLocalRoomTypes = useCallback(async () => {
    try {
      const res = await axios.get('/roomtypes')
      if (res.data?.success) setLocalRoomTypes(res.data.data || [])
    } catch (e) { console.warn(e.message) }
  }, [])

  const fetchLocalRoomRates = useCallback(async () => {
    try {
      const res = await axios.get('/booklogic/local-room-rates')
      if (res.data?.success) setLocalRoomRates(res.data.data || [])
    } catch (e) { console.warn('Local room rates fetch failed:', e.message) }
  }, [])

  const fetchExternalRooms = useCallback(async () => {
    try {
      const res = await axios.get('/booklogic/rooms-inventory')
      if (res.data?.success) setExternalRooms(res.data.data || [])
    } catch (e) { console.warn(e.message) }
  }, [])

  useEffect(() => {
    fetchOverview()
    fetchConfigurationAudit()
    fetchSettings()
    fetchLocalRoomTypes()
    fetchLocalRoomRates()
  }, [])

  useEffect(() => {
    if (activeTab === 'rooms') { fetchRoomMappings(); fetchExternalRooms() }
    if (activeTab === 'rates') { fetchRateMappings(); fetchRoomMappings(); fetchLocalRoomRates() }
    if (activeTab === 'reservations') fetchReservations()
    if (activeTab === 'sync') { fetchRoomMappings(); fetchRateMappings(); fetchLocalRoomRates() }
    if (activeTab === 'logs') fetchLogs()
    if (activeTab === 'dashboard') { fetchOverview(); fetchConfigurationAudit() }
  }, [activeTab])

  // ─── Actions ────────────────────────────────────────────────────

  const testConnection = async () => {
    setLoading(true)
    setConnectionStatus(null)
    try {
      const res = await axios.get('/booklogic/test-connection')
      setConnectionStatus(res.data)
      showToast(res.data.message, res.data.success ? 'success' : 'error')
    } catch (e) {
      setConnectionStatus({ success: false, message: e.message })
      showToast('Connection test failed: ' + e.message, 'error')
    }
    setLoading(false)
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      const res = await axios.post('/booklogic/settings', settingsForm)
      showToast(res.data.message, res.data.success ? 'success' : 'error')
      if (res.data.success) { fetchSettings(); fetchOverview(); fetchConfigurationAudit() }
    } catch (e) { showToast('Error: ' + e.message, 'error') }
    setLoading(false)
  }

  const sendReservation = async (reservationId) => {
    if (!reservationId) {
      showToast('Please enter a reservation ID', 'error')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post(`/booklogic/send-reservation/${reservationId}`)
      showToast(res.data.message, res.data.success ? 'success' : 'error')
      fetchLogs()
    } catch (e) { showToast('Error: ' + e.message, 'error') }
    setLoading(false)
  }

  const updateOutboundReservation = async (reservationId) => {
    if (!reservationId) {
      showToast('Please enter a reservation ID', 'error')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post(`/booklogic/update-reservation/${reservationId}`)
      showToast(res.data.message, res.data.success ? 'success' : 'error')
      fetchLogs()
    } catch (e) { showToast('Error: ' + e.message, 'error') }
    setLoading(false)
  }

  const cancelOutboundReservation = async (reservationId) => {
    if (!reservationId) {
      showToast('Please enter a reservation ID', 'error')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post(`/booklogic/cancel-reservation/${reservationId}`)
      showToast(res.data.message, res.data.success ? 'success' : 'error')
      fetchLogs()
    } catch (e) { showToast('Error: ' + e.message, 'error') }
    setLoading(false)
  }

  const saveRoomMapping = async () => {
    setLoading(true)
    try {
      const payload = {
        ...roomMappingForm,
        id: parseInt(roomMappingForm.id) || 0,
        localRoomTypeId: parseInt(roomMappingForm.localRoomTypeId) || 0
      }
      const res = await axios.post('/booklogic/room-mappings', payload)
      showToast(res.data.message, res.data.success ? 'success' : 'error')
      if (res.data.success) { fetchRoomMappings(); fetchOverview(); fetchConfigurationAudit(); setShowRoomForm(false); setRoomMappingForm({ id: 0, localRoomTypeId: '', externalRoomId: '', externalRoomName: '', isActive: true }) }
    } catch (e) { showToast('Error: ' + e.message, 'error') }
    setLoading(false)
  }

  const deleteRoomMapping = async (id) => {
    if (!confirm('Delete this room mapping?')) return
    try {
      const res = await axios.delete(`/booklogic/room-mappings/${id}`)
      showToast(res.data.message, res.data.success ? 'success' : 'error')
      fetchRoomMappings()
      fetchOverview()
      fetchConfigurationAudit()
    } catch (e) { showToast('Error: ' + e.message, 'error') }
  }

  const saveRateMapping = async () => {
    setLoading(true)
    try {
      const payload = {
        ...rateMappingForm,
        id: parseInt(rateMappingForm.id) || 0,
        channelManagerRoomMappingId: parseInt(rateMappingForm.channelManagerRoomMappingId) || 0,
        localRoomRateId: rateMappingForm.localRoomRateId ? parseInt(rateMappingForm.localRoomRateId) : null
      }
      const res = await axios.post('/booklogic/rate-mappings', payload)
      showToast(res.data.message, res.data.success ? 'success' : 'error')
      if (res.data.success) { fetchRateMappings(); fetchOverview(); fetchConfigurationAudit(); setShowRateForm(false); setRateMappingForm({ id: 0, channelManagerRoomMappingId: '', localRoomRateId: '', externalRateId: '', externalRateName: '', currencyCode: 'PKR', isActive: true }) }
    } catch (e) { showToast('Error: ' + e.message, 'error') }
    setLoading(false)
  }

  const deleteRateMapping = async (id) => {
    if (!confirm('Delete this rate mapping?')) return
    try {
      const res = await axios.delete(`/booklogic/rate-mappings/${id}`)
      showToast(res.data.message, res.data.success ? 'success' : 'error')
      fetchRateMappings()
      fetchOverview()
      fetchConfigurationAudit()
    } catch (e) { showToast('Error: ' + e.message, 'error') }
  }

  const pullReservations = async () => {
    setLoading(true)
    try {
      const res = await axios.post('/booklogic/pull-reservations')
      showToast(res.data.message, res.data.success ? 'success' : 'error')
      fetchReservations()
    } catch (e) { showToast('Error: ' + e.message, 'error') }
    setLoading(false)
  }

  const processReservation = async (id) => {
    setLoading(true)
    try {
      const res = await axios.post(`/booklogic/process-reservation/${id}`)
      showToast(res.data.message, res.data.success ? 'success' : 'error')
      fetchReservations()
    } catch (e) { showToast('Error: ' + e.message, 'error') }
    setLoading(false)
  }

  const updateAvailability = async () => {
    if (!syncForm.roomId || !syncForm.fromDate || !syncForm.toDate) {
      showToast('Please fill Room ID, From and To dates', 'error'); return
    }
    setLoading(true)
    try {
      const res = await axios.post('/booklogic/availability-update', {
        roomId: syncForm.roomId, fromDate: syncForm.fromDate, toDate: syncForm.toDate,
        allotment: syncForm.allotment, stopSales: syncForm.stopSales, minStay: syncForm.minStay
      })
      showToast(res.data.message, res.data.success ? 'success' : 'error')
      fetchLogs()
    } catch (e) { showToast('Error: ' + e.message, 'error') }
    setLoading(false)
  }

  const syncAllAvailability = async () => {
    setLoading(true)
    try {
      const res = await axios.post('/booklogic/sync-all-availability', {
        fromDate: syncForm.fromDate, toDate: syncForm.toDate
      })
      showToast(res.data.message, res.data.success ? 'success' : 'error')
      fetchOverview()
    } catch (e) { showToast('Error: ' + e.message, 'error') }
    setLoading(false)
  }

  const updateRate = async () => {
    if ((!syncForm.rateId && !syncForm.localRoomRateId) || !syncForm.fromDate || !syncForm.toDate) {
      showToast('Please select a rate and fill From and To dates', 'error'); return
    }
    setLoading(true)
    try {
      const res = await axios.post('/booklogic/rate-update', {
        rateId: syncForm.rateId,
        localRoomRateId: syncForm.localRoomRateId ? parseInt(syncForm.localRoomRateId) : null,
        fromDate: syncForm.fromDate, toDate: syncForm.toDate,
        price: syncForm.price, minStay: syncForm.minStay,
        combinations: [{ adult: 1, childA: 0, childB: 0, infant: 0, price: syncForm.price, minStay: syncForm.minStay }]
      })
      showToast(res.data.message, res.data.success ? 'success' : 'error')
      fetchLogs()
      fetchOverview()
    } catch (e) { showToast('Error: ' + e.message, 'error') }
    setLoading(false)
  }

  const syncBooking = async () => {
    setLoading(true)
    try {
      const res = await axios.post('/booklogic/sync-booking')
      showToast(res.data.message, res.data.success ? 'success' : 'error')
      fetchOverview()
    } catch (e) { showToast('Error: ' + e.message, 'error') }
    setLoading(false)
  }

  const processAllReservations = async () => {
    setLoading(true)
    try {
      const res = await axios.post('/booklogic/process-all-reservations')
      showToast(res.data.message, res.data.success ? 'success' : 'error')
      fetchReservations()
      fetchOverview()
    } catch (e) { showToast('Error: ' + e.message, 'error') }
    setLoading(false)
  }

  const clearLogs = async (keepDays = 7) => {
    if (!confirm(`Delete logs older than ${keepDays} days?`)) return
    try {
      const res = await axios.delete(`/booklogic/logs/clear?keepDays=${keepDays}`)
      showToast(res.data.message, res.data.success ? 'success' : 'error')
      fetchLogs()
    } catch (e) { showToast('Error: ' + e.message, 'error') }
  }

  const markSend = async (pnrId) => {
    setLoading(true)
    try {
      const res = await axios.post(`/booklogic/mark-send/${pnrId}`)
      showToast(res.data.message, res.data.success ? 'success' : 'error')
      fetchReservations()
    } catch (e) { showToast('Error: ' + e.message, 'error') }
    setLoading(false)
  }

  const viewLogDetail = async (id) => {
    try {
      const res = await axios.get(`/booklogic/logs/${id}`)
      if (res.data?.success) setLogDetail(res.data.data)
    } catch (e) { showToast('Error: ' + e.message, 'error') }
  }

  // ─── Render helpers ─────────────────────────────────────────────

  const StatusBadge = ({ status }) => {
    const colors = {
      Success: 'bg-green-100 text-green-800',
      Failed: 'bg-red-100 text-red-800',
      Pending: 'bg-yellow-100 text-yellow-800'
    }
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>
  }

  // ─── TAB: Dashboard ─────────────────────────────────────────────

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`rounded-xl p-5 border ${overview?.isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Connection</p>
              <p className="text-xl font-bold mt-1">{overview?.isActive ? 'Active' : 'Inactive'}</p>
              <p className="text-xs text-gray-500 mt-1">{overview?.hotelCode || 'Not configured'}</p>
            </div>
            <div className={`p-3 rounded-xl ${overview?.isActive ? 'bg-green-500' : 'bg-gray-400'}`}>
              <SignalIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-xl p-5 border bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mapped Rooms</p>
              <p className="text-xl font-bold mt-1">{overview?.totalMappedRooms || 0}</p>
              <p className="text-xs text-gray-500 mt-1">{overview?.totalMappedRates || 0} rates mapped</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500">
              <BuildingOfficeIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-xl p-5 border bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reservations</p>
              <p className="text-xl font-bold mt-1">{overview?.totalReservations || 0}</p>
              <p className="text-xs text-orange-600 font-semibold mt-1">{overview?.pendingReservations || 0} pending</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500">
              <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-xl p-5 border bg-orange-50 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today API Calls</p>
              <p className="text-xl font-bold mt-1">{overview?.todayApiCalls || 0}</p>
              <p className="text-xs text-red-600 font-semibold mt-1">{overview?.todayFailedCalls || 0} failed</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-500">
              <BoltIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Last Sync Times */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Last Availability Sync', time: overview?.lastAvailabilitySync, color: 'blue' },
          { label: 'Last Reservation Sync', time: overview?.lastReservationSync, color: 'green' },
          { label: 'Last Rate Sync', time: overview?.lastRateSync, color: 'purple' }
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-600">{item.label}</p>
            <p className="text-sm font-bold mt-1">
              {item.time ? new Date(item.time).toLocaleString() : 'Never'}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold">Configuration Audit</h3>
            <p className="text-sm text-gray-500">Use this to complete the remaining BookLogic room, rate, and outbound reservation setup.</p>
          </div>
          <button onClick={fetchConfigurationAudit} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50">
            <ArrowPathIcon className="h-4 w-4" /> Refresh Audit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className={`rounded-xl p-4 border ${configurationAudit?.settings?.outboundReservationReady ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
            <p className="text-sm text-gray-600">Outbound Reservation Sync</p>
            <p className="text-lg font-bold mt-1">{configurationAudit?.settings?.outboundReservationReady ? 'Ready' : 'Not Ready'}</p>
            <p className="text-xs text-gray-500 mt-1">Channel ID: {configurationAudit?.settings?.channelId ?? 0}</p>
          </div>
          <div className="rounded-xl p-4 border bg-red-50 border-red-200">
            <p className="text-sm text-gray-600">Unmapped Room Types</p>
            <p className="text-lg font-bold mt-1">{configurationAudit?.summary?.unmappedRoomTypeCount || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Each sellable room type should have a BookLogic room mapping.</p>
          </div>
          <div className="rounded-xl p-4 border bg-orange-50 border-orange-200">
            <p className="text-sm text-gray-600">Room Types Missing Rate Coverage</p>
            <p className="text-lg font-bold mt-1">{configurationAudit?.summary?.roomTypesMissingRateCoverageCount || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Rates need either exact mappings or a default mapping per room type.</p>
          </div>
        </div>

        {!!configurationAudit?.unmappedRoomTypes?.length && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-800 mb-2">Unmapped Local Room Types</p>
            <div className="flex flex-wrap gap-2">
              {configurationAudit.unmappedRoomTypes.map(roomType => (
                <span key={roomType.id} className="px-3 py-1 rounded-full bg-white border border-red-200 text-red-700 text-xs font-medium">
                  {roomType.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {!!configurationAudit?.roomRateCoverage?.some(item => item.hasRoomMapping && item.missingRates?.length) && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
            <p className="text-sm font-semibold text-orange-900 mb-3">Missing Rate Coverage</p>
            <div className="space-y-3">
              {configurationAudit.roomRateCoverage
                .filter(item => item.hasRoomMapping && item.missingRates?.length)
                .map(item => (
                  <div key={item.roomTypeId} className="rounded-lg bg-white border border-orange-100 p-3">
                    <p className="text-sm font-semibold text-gray-800">{item.roomTypeName}</p>
                    <p className="text-xs text-gray-500 mb-2">BookLogic Room: {item.externalRoomName || item.externalRoomId}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.missingRates.map(rate => (
                        <span key={rate.id} className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">
                          {rate.rateName}{rate.rateCode ? ` (${rate.rateCode})` : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={testConnection} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            <SignalIcon className="h-4 w-4" /> Test Connection
          </button>
          <button onClick={pullReservations} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
            <ArrowDownTrayIcon className="h-4 w-4" /> Pull Reservations
          </button>
          <button onClick={syncAllAvailability} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">
            <ArrowUpTrayIcon className="h-4 w-4" /> Sync All Availability
          </button>
          <button onClick={syncBooking} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50">
            <ArrowPathIcon className="h-4 w-4" /> Sync Booking
          </button>
          <button onClick={() => { fetchExternalRooms(); showToast('Fetching rooms from BookLogic...') }} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50">
            <ArrowPathIcon className="h-4 w-4" /> Refresh External Rooms
          </button>
        </div>
        {connectionStatus && (
          <div className={`mt-4 p-3 rounded-lg ${connectionStatus.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {connectionStatus.success ? <CheckCircleIcon className="h-5 w-5 inline mr-2" /> : <XCircleIcon className="h-5 w-5 inline mr-2" />}
            {connectionStatus.message}
          </div>
        )}
      </div>

      {/* Recent Logs */}
      {overview?.recentLogs?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {overview.recentLogs.map(log => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <StatusBadge status={log.status} />
                  <span className="text-sm font-medium">{log.action}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>{log.durationMs}ms</span>
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  // ─── TAB: Room Mappings ─────────────────────────────────────────

  const renderRoomMappings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Room Type Mappings</h3>
        <button onClick={() => { setRoomMappingForm({ id: 0, localRoomTypeId: '', externalRoomId: '', externalRoomName: '', isActive: true }); setShowRoomForm(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <PlusIcon className="h-4 w-4" /> Add Mapping
        </button>
      </div>

      {showRoomForm && (
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
          <h4 className="font-semibold mb-4">{roomMappingForm.id ? 'Edit' : 'New'} Room Mapping</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Local Room Type</label>
              <select value={roomMappingForm.localRoomTypeId} onChange={e => setRoomMappingForm({ ...roomMappingForm, localRoomTypeId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="">Select Room Type</option>
                {localRoomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">External Room ID</label>
              <input type="text" value={roomMappingForm.externalRoomId}
                onChange={e => setRoomMappingForm({ ...roomMappingForm, externalRoomId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g. 12918" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">External Room Name</label>
              <input type="text" value={roomMappingForm.externalRoomName || ''}
                onChange={e => setRoomMappingForm({ ...roomMappingForm, externalRoomName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g. Standard Double" />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={saveRoomMapping} disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">Save</button>
              <button onClick={() => setShowRoomForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Cancel</button>
            </div>
          </div>
          {externalRooms.length > 0 && (
            <div className="mt-3 p-3 bg-white rounded-lg border">
              <p className="text-xs font-semibold text-gray-500 mb-2">Available BookLogic Rooms:</p>
              <div className="flex flex-wrap gap-2">
                {externalRooms.map((r, i) => (
                  <button key={i} onClick={() => setRoomMappingForm({ ...roomMappingForm, externalRoomId: r.roomCode || '', externalRoomName: r.roomName || '' })}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200">
                    {r.roomCode} - {r.roomName}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local Room Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">External Room ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">External Room Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {roomMappings.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No room mappings yet. Click "Add Mapping" to create one.</td></tr>
            ) : roomMappings.map(m => (
              <tr key={m.id}>
                <td className="px-6 py-4 text-sm font-medium">{m.localRoomTypeName}</td>
                <td className="px-6 py-4 text-sm font-mono text-blue-600">{m.externalRoomId}</td>
                <td className="px-6 py-4 text-sm">{m.externalRoomName}</td>
                <td className="px-6 py-4"><StatusBadge status={m.isActive ? 'Success' : 'Failed'} /></td>
                <td className="px-6 py-4">
                  <button onClick={() => deleteRoomMapping(m.id)} className="text-red-600 hover:text-red-800">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  // ─── TAB: Rate Mappings ─────────────────────────────────────────

  const renderRateMappings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Rate Mappings</h3>
        <button onClick={() => { setRateMappingForm({ id: 0, channelManagerRoomMappingId: '', localRoomRateId: '', externalRateId: '', externalRateName: '', currencyCode: 'PKR', isActive: true }); setShowRateForm(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <PlusIcon className="h-4 w-4" /> Add Rate Mapping
        </button>
      </div>

      {showRateForm && (
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
          <h4 className="font-semibold mb-4">{rateMappingForm.id ? 'Edit' : 'New'} Rate Mapping</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Mapping</label>
              <select value={rateMappingForm.channelManagerRoomMappingId} onChange={e => setRateMappingForm({ ...rateMappingForm, channelManagerRoomMappingId: e.target.value, localRoomRateId: '' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="">Select Room</option>
                {roomMappings.map(rm => <option key={rm.id} value={rm.id}>{rm.localRoomTypeName} ({rm.externalRoomId})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Local PMS Rate</label>
              <select value={rateMappingForm.localRoomRateId} onChange={e => {
                const selectedRate = filteredLocalRates.find(rate => String(rate.id) === e.target.value)
                setRateMappingForm({
                  ...rateMappingForm,
                  localRoomRateId: e.target.value,
                  currencyCode: selectedRate?.currency || rateMappingForm.currencyCode || 'PKR'
                })
              }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="">Select Local Rate</option>
                {filteredLocalRates.map(rate => <option key={rate.id} value={rate.id}>{rate.displayName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">External Rate ID</label>
              <input type="text" value={rateMappingForm.externalRateId}
                onChange={e => setRateMappingForm({ ...rateMappingForm, externalRateId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Rate ID" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rate Name</label>
              <input type="text" value={rateMappingForm.externalRateName || ''}
                onChange={e => setRateMappingForm({ ...rateMappingForm, externalRateName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Rate Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <input type="text" value={rateMappingForm.currencyCode || 'PKR'}
                onChange={e => setRateMappingForm({ ...rateMappingForm, currencyCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={saveRateMapping} disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">Save</button>
              <button onClick={() => setShowRateForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">External Rate ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Currency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rateMappings.length === 0 ? (
              <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">No rate mappings yet.</td></tr>
            ) : rateMappings.map(m => (
              <tr key={m.id}>
                <td className="px-6 py-4 text-sm">{m.localRoomTypeName}</td>
                <td className="px-6 py-4 text-sm">{m.localRoomRateName || m.localRateCode || '-'}</td>
                <td className="px-6 py-4 text-sm font-mono text-purple-600">{m.externalRateId}</td>
                <td className="px-6 py-4 text-sm">{m.externalRateName}</td>
                <td className="px-6 py-4 text-sm">{m.currencyCode}</td>
                <td className="px-6 py-4"><StatusBadge status={m.isActive ? 'Success' : 'Failed'} /></td>
                <td className="px-6 py-4">
                  <button onClick={() => deleteRateMapping(m.id)} className="text-red-600 hover:text-red-800">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  // ─── TAB: Reservations ──────────────────────────────────────────

  const renderReservations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Channel Manager Reservations</h3>
        <div className="flex gap-2">
          {reservations.some(r => !r.isProcessed) && (
            <button onClick={processAllReservations} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              <BoltIcon className="h-4 w-4" /> {loading ? 'Processing...' : 'Process All'}
            </button>
          )}
          <button onClick={pullReservations} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
            <ArrowDownTrayIcon className="h-4 w-4" /> {loading ? 'Pulling...' : 'Pull New Reservations'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">PnrID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-In</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-Out</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reservations.length === 0 ? (
              <tr><td colSpan="8" className="px-4 py-8 text-center text-gray-500">No reservations from channel manager yet. Click "Pull New Reservations" to check.</td></tr>
            ) : reservations.map(r => (
              <tr key={r.id} className={r.isProcessed ? 'bg-green-50' : ''}>
                <td className="px-4 py-3 text-sm font-mono text-blue-600">{r.externalReservationId}</td>
                <td className="px-4 py-3 text-sm">
                  <div>{r.guestFirstName} {r.guestLastName}</div>
                  {r.guestEmail && <div className="text-xs text-gray-400">{r.guestEmail}</div>}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div>{r.externalRoomName || r.externalRoomId}</div>
                  {r.externalRateName && <div className="text-xs text-gray-400">{r.externalRateName}</div>}
                </td>
                <td className="px-4 py-3 text-sm">{r.checkInDate ? new Date(r.checkInDate).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3 text-sm">{r.checkOutDate ? new Date(r.checkOutDate).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3 text-sm font-semibold">{r.currencyCode} {r.totalAmount}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    {r.isProcessed
                      ? <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold w-fit">Processed</span>
                      : <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold w-fit">Pending</span>}
                    {r.isMarkedAsSent && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold w-fit">Sent</span>}
                    {r.syncType && <span className="text-xs text-gray-400">{r.syncType}</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    {!r.isProcessed && (
                      <button onClick={() => processReservation(r.id)} disabled={loading}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50">
                        Process
                      </button>
                    )}
                    {!r.isMarkedAsSent && r.externalReservationId && (
                      <button onClick={() => markSend(r.externalReservationId)} disabled={loading}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 disabled:opacity-50">
                        Mark Sent
                      </button>
                    )}
                    {r.isProcessed && r.localReservationId && (
                      <>
                        <span className="text-xs text-gray-500">Res #{r.localReservationId}</span>
                        <button onClick={() => sendReservation(r.localReservationId)} disabled={loading}
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50">
                          Send PMS
                        </button>
                        <button onClick={() => updateOutboundReservation(r.localReservationId)} disabled={loading}
                          className="px-3 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 disabled:opacity-50">
                          Update PMS
                        </button>
                        <button onClick={() => cancelOutboundReservation(r.localReservationId)} disabled={loading}
                          className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-50">
                          Cancel PMS
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  // ─── TAB: Sync Controls ─────────────────────────────────────────

  const renderSyncControls = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Manual Sync Controls</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Availability Update */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-blue-700 mb-4 flex items-center gap-2">
            <ArrowUpTrayIcon className="h-5 w-5" /> Push Availability
          </h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Room ID</label>
                <select value={syncForm.roomId} onChange={e => setSyncForm({ ...syncForm, roomId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">Select Room</option>
                  {roomMappings.map(rm => <option key={rm.id} value={rm.externalRoomId}>{rm.localRoomTypeName} ({rm.externalRoomId})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Allotment</label>
                <input type="number" value={syncForm.allotment} onChange={e => setSyncForm({ ...syncForm, allotment: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">From Date</label>
                <input type="date" value={syncForm.fromDate} onChange={e => setSyncForm({ ...syncForm, fromDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">To Date</label>
                <input type="date" value={syncForm.toDate} onChange={e => setSyncForm({ ...syncForm, toDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Min Stay</label>
                <input type="number" value={syncForm.minStay} onChange={e => setSyncForm({ ...syncForm, minStay: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Stop Sales</label>
                <select value={syncForm.stopSales} onChange={e => setSyncForm({ ...syncForm, stopSales: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={updateAvailability} disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
                {loading ? 'Updating...' : 'Update Availability'}
              </button>
              <button onClick={syncAllAvailability} disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium">
                Sync All
              </button>
            </div>
          </div>
        </div>

        {/* Rate Update */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-purple-700 mb-4 flex items-center gap-2">
            <CurrencyDollarIcon className="h-5 w-5" /> Push Rate
          </h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Rate ID</label>
                <select value={syncForm.rateId} onChange={e => {
                  const rate = rateMappings.find(rm => String(rm.externalRateId) === e.target.value)
                  const localRate = rate?.localRoomRateId ? localRoomRates.find(lr => lr.id === rate.localRoomRateId) : null
                  setSyncForm({
                    ...syncForm,
                    rateId: e.target.value,
                    localRoomRateId: rate?.localRoomRateId ? String(rate.localRoomRateId) : '',
                    price: localRate?.baseRate || syncForm.price,
                    minStay: localRate?.minStay || syncForm.minStay
                  })
                }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">Select Rate</option>
                  {rateMappings.map(rm => <option key={rm.id} value={rm.externalRateId}>{rm.externalRateName || rm.externalRateId}{rm.localRoomRateName ? ` - ${rm.localRoomRateName}` : ''}</option>)}
                </select>
              </div>
            </div>
            {selectedRateMapping?.localRoomRateName && (
              <div className="rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-xs text-purple-800">
                Linked PMS Rate: <span className="font-semibold">{selectedRateMapping.localRoomRateName}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">From Date</label>
                <input type="date" value={syncForm.fromDate} onChange={e => setSyncForm({ ...syncForm, fromDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Min Stay</label>
                <input type="number" value={syncForm.minStay} onChange={e => setSyncForm({ ...syncForm, minStay: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Price (PKR)</label>
                <input type="number" step="0.01" value={syncForm.price} onChange={e => setSyncForm({ ...syncForm, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">To Date</label>
                <input type="date" value={syncForm.toDate} onChange={e => setSyncForm({ ...syncForm, toDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <button onClick={updateRate} disabled={loading}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm font-medium">
              {loading ? 'Updating...' : 'Update Rate'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="font-semibold text-green-700 mb-4 flex items-center gap-2">
          <ClipboardDocumentListIcon className="h-5 w-5" /> Outbound PMS Reservation Sync
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Local Reservation ID</label>
            <input type="number" value={syncForm.reservationId} onChange={e => setSyncForm({ ...syncForm, reservationId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Reservation ID" />
          </div>
          <div className="md:col-span-3 flex flex-wrap items-end gap-2">
            <button onClick={() => sendReservation(syncForm.reservationId)} disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium">
              Send Reservation
            </button>
            <button onClick={() => updateOutboundReservation(syncForm.reservationId)} disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium">
              Update Reservation
            </button>
            <button onClick={() => cancelOutboundReservation(syncForm.reservationId)} disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium">
              Cancel Reservation
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // ─── TAB: Logs ──────────────────────────────────────────────────

  const renderLogs = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Activity Logs ({logs.length})</h3>
        <div className="flex gap-2">
          <button onClick={() => clearLogs(7)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
            <TrashIcon className="h-4 w-4" /> Clear Old Logs
          </button>
          <button onClick={fetchLogs} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            <ArrowPathIcon className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Direction</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">HTTP</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.length === 0 ? (
              <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-500">No logs yet.</td></tr>
            ) : logs.map(l => (
              <tr key={l.id} className={l.status === 'Failed' ? 'bg-red-50' : ''}>
                <td className="px-4 py-3 text-xs text-gray-600">{new Date(l.timestamp).toLocaleString()}</td>
                <td className="px-4 py-3 text-sm font-medium">{l.action}</td>
                <td className="px-4 py-3 text-xs">
                  {l.direction === 'Outbound'
                    ? <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"><ArrowUpTrayIcon className="h-3 w-3 inline" /> Out</span>
                    : <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"><ArrowDownTrayIcon className="h-3 w-3 inline" /> In</span>}
                </td>
                <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                <td className="px-4 py-3 text-sm font-mono">{l.httpStatusCode || '-'}</td>
                <td className="px-4 py-3 text-sm">{l.durationMs}ms</td>
                <td className="px-4 py-3">
                  <button onClick={() => viewLogDetail(l.id)} className="text-blue-600 hover:text-blue-800">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Log Detail Modal */}
      {logDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setLogDetail(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white rounded-t-2xl">
              <h3 className="text-lg font-semibold">Log Detail #{logDetail.id}</h3>
              <button onClick={() => setLogDetail(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><p className="text-xs text-gray-500">Action</p><p className="font-semibold">{logDetail.action}</p></div>
                <div><p className="text-xs text-gray-500">Direction</p><p className="font-semibold">{logDetail.direction}</p></div>
                <div><p className="text-xs text-gray-500">Status</p><StatusBadge status={logDetail.status} /></div>
                <div><p className="text-xs text-gray-500">Duration</p><p className="font-semibold">{logDetail.durationMs}ms</p></div>
              </div>
              {logDetail.errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-red-600 font-semibold">Error</p>
                  <p className="text-sm text-red-800">{logDetail.errorMessage}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Request</p>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto max-h-48">{logDetail.requestPayload || 'N/A'}</pre>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Response</p>
                <pre className="bg-gray-900 text-blue-400 p-4 rounded-lg text-xs overflow-x-auto max-h-48">{logDetail.responsePayload || 'N/A'}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // ─── TAB: Settings ──────────────────────────────────────────────

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">BookLogic Connection Settings</h3>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base URL (XML API)</label>
            <input type="text" value={settingsForm.baseUrl} onChange={e => setSettingsForm({ ...settingsForm, baseUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Send Reservation URL (JSON API v5.3)</label>
            <input type="text" value={settingsForm.sendReservationUrl} onChange={e => setSettingsForm({ ...settingsForm, sendReservationUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" value={settingsForm.username} onChange={e => setSettingsForm({ ...settingsForm, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={settingsForm.password} onChange={e => setSettingsForm({ ...settingsForm, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Leave empty to keep current" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Code</label>
            <input type="text" value={settingsForm.hotelCode} onChange={e => setSettingsForm({ ...settingsForm, hotelCode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Channel ID</label>
            <input type="number" value={settingsForm.channelId} onChange={e => setSettingsForm({ ...settingsForm, channelId: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sync Interval (minutes)</label>
            <input type="number" value={settingsForm.syncIntervalMinutes} onChange={e => setSettingsForm({ ...settingsForm, syncIntervalMinutes: parseInt(e.target.value) || 30 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settingsForm.isActive} onChange={e => setSettingsForm({ ...settingsForm, isActive: e.target.checked })}
                className="rounded border-gray-300 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settingsForm.isProduction} onChange={e => setSettingsForm({ ...settingsForm, isProduction: e.target.checked })}
                className="rounded border-gray-300 text-red-600" />
              <span className="text-sm font-medium text-gray-700">Production Mode</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settingsForm.autoSyncAvailability} onChange={e => setSettingsForm({ ...settingsForm, autoSyncAvailability: e.target.checked })}
                className="rounded border-gray-300 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Auto-Sync Availability</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settingsForm.autoPullReservations} onChange={e => setSettingsForm({ ...settingsForm, autoPullReservations: e.target.checked })}
                className="rounded border-gray-300 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Auto-Pull Reservations</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settingsForm.autoProcessReservations} onChange={e => setSettingsForm({ ...settingsForm, autoProcessReservations: e.target.checked })}
                className="rounded border-gray-300 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Auto-Process Reservations</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t">
          <button onClick={saveSettings} disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium">
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
          <button onClick={testConnection} disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium">
            Test Connection
          </button>
        </div>

        {connectionStatus && (
          <div className={`mt-4 p-3 rounded-lg ${connectionStatus.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {connectionStatus.success ? <CheckCircleIcon className="h-5 w-5 inline mr-2" /> : <XCircleIcon className="h-5 w-5 inline mr-2" />}
            {connectionStatus.message}
          </div>
        )}
      </div>

      {settingsForm.isProduction && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Production Mode Enabled</p>
            <p className="text-sm text-red-700">All API calls will be sent to the production BookLogic environment. Changes will affect live bookings and availability.</p>
          </div>
        </div>
      )}
    </div>
  )

  // ─── Main Render ────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Channel Manager</h1>
            <p className="text-indigo-200 mt-1">BookLogic Integration - Manage availability, rates, and reservations</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${overview?.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
              {overview?.isActive ? 'Connected' : 'Disconnected'}
            </div>
            {overview?.isProduction && (
              <div className="px-3 py-1 rounded-full text-sm font-semibold bg-red-500 text-white">PRODUCTION</div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border ${toast.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
          {toast.type === 'success' ? <CheckCircleIcon className="h-5 w-5 inline mr-2" /> : <XCircleIcon className="h-5 w-5 inline mr-2" />}
          {toast.msg}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex space-x-1 min-w-max">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}>
              <tab.icon className="h-4 w-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'rooms' && renderRoomMappings()}
      {activeTab === 'rates' && renderRateMappings()}
      {activeTab === 'reservations' && renderReservations()}
      {activeTab === 'sync' && renderSyncControls()}
      {activeTab === 'logs' && renderLogs()}
      {activeTab === 'settings' && renderSettings()}
    </div>
  )
}

export default ChannelManager
