import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import { FolderOpenIcon } from '@heroicons/react/24/outline'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  HomeIcon,
  BuildingOfficeIcon,
  CubeIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  DocumentChartBarIcon,
  BellIcon,
  ShoppingCartIcon,
  ClipboardDocumentCheckIcon,
  BanknotesIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  PhoneIcon,
  ComputerDesktopIcon,
  KeyIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  MapIcon,
  CreditCardIcon,
  GiftIcon,
  ChatBubbleLeftRightIcon,
  MegaphoneIcon,
  BookOpenIcon,
  AcademicCapIcon,
  HeartIcon,
  StarIcon,
  CameraIcon,
  WifiIcon,
  DevicePhoneMobileIcon,
  XCircleIcon,
  SignalIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: HomeIcon 
  },
  { 
    name: 'System Configuration', 
    icon: KeyIcon,
    submenu: [
      { name: 'Hotel', href: '/master-hotel', icon: BuildingOfficeIcon },
      { name: 'Currency Master', href: '/currency-master', icon: CurrencyDollarIcon },
      { name: 'Front Gallery', href: '/front-gallery', icon: CameraIcon },
      { name: 'Front Restaurant', href: '/front-restaurant', icon: ShoppingCartIcon },
      
      /* { name: 'ID Type', href: '/id-type', icon: KeyIcon },
      { name: 'Supplier Master', href: '/supplier-master', icon: TruckIcon },
      { name: 'Guest', href: '/master-guest', icon: UserGroupIcon },
      
      { name: 'Hall', href: '/hall', icon: BuildingOfficeIcon },
      { name: 'Garden', href: '/garden', icon: MapIcon },
      { name: 'Delivery Person Master', href: '/delivery-person', icon: TruckIcon },
      { name: 'Other Charges', href: '/other-charges', icon: CurrencyDollarIcon }, */
      
    ]
  },
  { 
    name: 'Front Office', 
    icon: BuildingOfficeIcon,
    submenu: [
      { name: 'Reservations', href: '/reservations', icon: CalendarDaysIcon },
      { name: 'Check In', href: '/check-in', icon: KeyIcon },
      { name: 'Check Out', href: '/check-out', icon: ArrowRightOnRectangleIcon },
      { name: 'Room Status', href: '/room-status', icon: BuildingOfficeIcon },
      { name: 'Guest Folio', href: '/guest-folio', icon: DocumentChartBarIcon },
      { name: 'Guest Registration', href: '/guest-registration', icon: UserGroupIcon },
      { name: 'Arrival/Departure Report', href: '/arrival-departure-report', icon: CalendarDaysIcon },
      { name: 'Calendar', href: '/calendar', icon: CalendarDaysIcon },
      { name: 'Contact Messages', href: '/contact-messages', icon: ChatBubbleLeftRightIcon },
    /*  { name: 'Walk-in Guests', href: '/walk-in-guests', icon: UserIcon },
      { name: 'Guest History', href: '/guest-history', icon: ClipboardDocumentListIcon },
      { name: 'Room Transfer', href: '/room-transfer', icon: ArrowRightOnRectangleIcon },
      { name: 'Check In with ID', href: '/check-in-with-id', icon: KeyIcon },
      { name: 'Check Out with ID', href: '/check-out-with-id', icon: ArrowRightOnRectangleIcon } */
    ]
  },
  { 
    name: 'Rooms Management', 
    icon: CubeIcon,
    submenu: [
      { name: 'Room Types', href: '/rooms-management/room-types', icon: CubeIcon },
      { name: 'Room Type Images', href: '/rooms-management/room-type-images', icon: CameraIcon },
      { name: 'Rooms', href: '/rooms-management/rooms', icon: BuildingOfficeIcon },
      { name: 'Block & Floor Management', href: '/rooms-management/block-floor-management', icon: BuildingOfficeIcon },
      { name: 'Room Rates', href: '/rooms-management/room-rates', icon: CurrencyDollarIcon },
      { name: 'Room Amenities', href: '/rooms-management/room-amenities', icon: WrenchScrewdriverIcon },
      { name: 'Floor Management', href: '/rooms-management/floor-management', icon: BuildingOfficeIcon },
      { name: 'Room Tax', href: '/rooms-management/room-tax', icon: CurrencyDollarIcon },
      { name: 'Room Blocked', href: '/rooms-management/room-blocked', icon: XCircleIcon },
      { name: 'Rate Plans Master', href: '/hotel-plan-master', icon: MapIcon },
      { name: 'Cancellation Policies', href: '/cancellation-policies', icon: NoSymbolIcon }
    ]
  },
  
  { 
    name: 'Blog Management', 
    icon: BookOpenIcon,
    submenu: [
      { name: 'All Blogs', href: '/blogs', icon: BookOpenIcon },
      { name: 'Create Blog', href: '/blogs/new', icon: DocumentChartBarIcon },
      { name: 'Categories', href: '/blogs/categories', icon: ClipboardDocumentListIcon }
    ]
  },
  
  { 
    name: 'Housekeeping', 
    icon: ClipboardDocumentListIcon,
    submenu: [
      { name: 'Room Status', href: '/housekeeping-room-status', icon: ClipboardDocumentCheckIcon },
      { name: 'Cleaning Schedule', href: '/cleaning-schedule', icon: CalendarDaysIcon },
      { name: 'Maintenance Requests', href: '/maintenance-requests', icon: WrenchScrewdriverIcon },
      { name: 'Lost & Found', href: '/lost-and-found', icon: ClipboardDocumentListIcon },
      { name: 'Laundry Management', href: '/laundry-management', icon: ClipboardDocumentListIcon }
    ]
  },
  
  { 
    name: 'Voucher Management', 
    href: '/voucher-management',
    icon: ClipboardDocumentListIcon
  },
  { 
    name: 'Channel Manager', 
    href: '/channel-manager',
    icon: SignalIcon
  },
  /*{ 
    name: 'Restaurant & Bar', 
    icon: ShoppingCartIcon,
    submenu: [
      { name: 'Dashboard', href: '/menu-management', icon: ClipboardDocumentListIcon },
      { name: 'Orders', href: '/restaurant-orders', icon: ShoppingCartIcon },
      { name: 'Table Reservations', href: '/table-management', icon: CubeIcon },
      { name: 'Table Master', href: '/table-master', icon: CubeIcon },
      { name: 'Kitchen Display', href: '/kitchen-display', icon: ComputerDesktopIcon },
      { name: 'Bar Management', href: '/bar-management', icon: ShoppingCartIcon },
      { name: 'Drinks Category', href: '/drinks-category', icon: ClipboardDocumentListIcon },
      { name: 'Drinks Quantity', href: '/drinks-quantity', icon: ClipboardDocumentListIcon },
      { name: 'Drinks Master', href: '/drinks-master', icon: ClipboardDocumentListIcon },
      { name: 'Drinks Pricing', href: '/drinks-pricing', icon: CurrencyDollarIcon },
      { name: 'Menu Category Master', href: '/menu-category-master', icon: ClipboardDocumentListIcon },
      { name: 'Menu Cuisine Master', href: '/menu-cuisine-master', icon: ClipboardDocumentListIcon },
      { name: 'Billing Report', href: '/reports-restaurant-billing', icon: CurrencyDollarIcon },
      { name: 'Menu Item Master', href: '/menu-item-master', icon: ClipboardDocumentListIcon }
    ]
  }, */
  { 
    name: 'Accounting', 
    icon: CurrencyDollarIcon,
    submenu: [
      { name: 'Accounting Dashboard', href: '/accounting/dashboard', icon: ChartBarIcon },
      { name: 'Chart of Accounts', href: '/accounting/chart-of-accounts', icon: ClipboardDocumentListIcon },
      { name: 'Journal Entries', href: '/accounting/journal-entries', icon: DocumentChartBarIcon },
      { name: 'PMS Account Mapping', href: '/accounting/pms-account-mapping', icon: Cog6ToothIcon },
      { name: 'Accounting Reports', href: '/accounting/reports', icon: DocumentChartBarIcon },
      { name: 'Guest Bill', href: '/guest-billing', icon: ClipboardDocumentListIcon },
      /*{ name: 'Stock', href: '/accounting-stock', icon: CubeIcon },
      { name: 'Order', href: '/accounting-order', icon: ShoppingCartIcon },
      { name: 'Laundry Billing', href: '/laundry-billing', icon: ClipboardDocumentListIcon },
      { name: 'Guest Account (Add Money)', href: '/guest-account-add', icon: CurrencyDollarIcon },
      { name: 'Guest Account (Refund Money)', href: '/guest-account-refund', icon: CurrencyDollarIcon },
      { name: 'Purchased Inventory', href: '/purchased-inventory', icon: CubeIcon },
      { name: 'Voucher', href: '/voucher', icon: ClipboardDocumentListIcon },
      { name: 'Payment', href: '/payment', icon: CurrencyDollarIcon },
      { name: 'Purchase DayBook', href: '/purchase-daybook', icon: ClipboardDocumentListIcon },
      { name: 'Daybook', href: '/daybook', icon: ClipboardDocumentListIcon },
      { name: 'Supplier Ledger', href: '/supplier-ledger', icon: ClipboardDocumentListIcon },
      { name: 'Guest Ledger', href: '/guest-ledger', icon: ClipboardDocumentListIcon },
      { name: 'General Ledger', href: '/general-ledger', icon: ClipboardDocumentListIcon },
      { name: 'Expense Type', href: '/expense-type', icon: CurrencyDollarIcon },
      { name: 'Expenses Master', href: '/expenses-master', icon: DocumentChartBarIcon },
      { name: 'Trial Balance', href: '/trial-balance', icon: ChartBarIcon }*/
    ]
  },
  { 
    name: 'Night Audit', 
    href: '/night-audit', 
    icon: ClockIcon 
  },
  
  /* { 
    name: 'Inventory', 
    icon: ChartBarIcon,
    submenu: [
      { name: 'Stock Management', href: '/stock-management', icon: ChartBarIcon },
      { name: 'Inventory Category Master', href: '/inventory-category-master', icon: FolderOpenIcon },
      { name: 'Purchase Orders', href: '/purchase-orders', icon: ClipboardDocumentListIcon },
      { name: 'Suppliers', href: '/suppliers', icon: TruckIcon },
      { name: 'Stock Alerts', href: '/stock-alerts', icon: BellIcon },
      { name: 'Inventory Reports', href: '/inventory-reports', icon: DocumentChartBarIcon }
    ]
  },
  { 
    name: 'Search Records', 
    icon: ComputerDesktopIcon,
    submenu: [
      { name: 'Employees', href: '/search-employees', icon: UserGroupIcon },
      { name: 'Suppliers', href: '/search-suppliers', icon: TruckIcon },
      { name: 'Employee Attendance', href: '/search-attendance-1', icon: ClockIcon },
      { name: 'Employee Payment', href: '/search-payment-1', icon: BanknotesIcon },
      { name: 'Supplier Payment', href: '/search-supplier-payment', icon: CurrencyDollarIcon },
      { name: 'Advance Entry', href: '/search-advance-entry', icon: BanknotesIcon },
      { name: 'Current Advance', href: '/search-current-advance', icon: BanknotesIcon },
      { name: 'Guest Ledger', href: '/search-guest-ledger', icon: UserGroupIcon },
      { name: 'Current Balance', href: '/search-current-balance', icon: ChartBarIcon },
      { name: 'Deduction', href: '/search-deduction', icon: CurrencyDollarIcon },
      { name: 'Check In', href: '/search-check-in', icon: KeyIcon },
      { name: 'Check Out', href: '/search-check-out', icon: ArrowRightOnRectangleIcon },
      { name: 'Room Reservation', href: '/search-room-reservation', icon: CalendarDaysIcon },
      { name: 'Guests', href: '/search-guests', icon: UserGroupIcon },
      { name: 'Room Orders', href: '/search-room-orders', icon: ShoppingCartIcon },
      { name: 'Purchased Inventory', href: '/search-purchased-inventory', icon: ChartBarIcon },
      { name: 'Drinks Stock', href: '/search-drinks-stock', icon: ShoppingCartIcon },
      { name: 'Hall or Garden Reservation', href: '/search-hall-garden', icon: BuildingOfficeIcon },
      { name: 'Restaurant Billing', href: '/search-restaurant-billing', icon: ShoppingCartIcon },
      { name: 'Laundry Billing', href: '/search-laundry-billing', icon: ClipboardDocumentListIcon }
    ]
  },
  { 
    name: 'Payroll', 
    icon: BanknotesIcon,
    submenu: [
      { name: 'Employee Registration', href: '/payroll-registration', icon: UserGroupIcon },
      { name: 'Attendance', href: '/payroll-attendance', icon: ClockIcon },
      { name: 'Payroll Advance', href: '/payroll-advance', icon: BanknotesIcon },
      { name: 'Payroll', href: '/payroll-main', icon: BanknotesIcon }
    ]
  },
  { 
    name: 'Human Resources', 
    icon: UserGroupIcon,
    submenu: [
      { name: 'Employee Management', href: '/employees', icon: UserGroupIcon },
      { name: 'Departments', href: '/departments', icon: UserGroupIcon },
      { name: 'Designations', href: '/designations', icon: UserGroupIcon },
      { name: 'Attendance', href: '/attendance', icon: ClockIcon },
      { name: 'Payroll', href: '/payroll', icon: BanknotesIcon },
      { name: 'Leave Management', href: '/leave-management', icon: CalendarDaysIcon },
      { name: 'Performance', href: '/performance', icon: ChartBarIcon },
      { name: 'Training', href: '/training', icon: DocumentChartBarIcon }
    ]
  },
  { 
    name: 'Reports', 
    icon: DocumentChartBarIcon,
    submenu: [
      { name: 'Food Menu Items', href: '/reports-food-menu', icon: ShoppingCartIcon },
      { name: 'Drinks Menu Items', href: '/reports-drinks-menu', icon: ShoppingCartIcon },
      { name: 'Drinks Stock In', href: '/reports-drinks-stock-in', icon: ChartBarIcon },
      { name: 'Drinks Stock Out', href: '/reports-drinks-stock-out', icon: ChartBarIcon },
      { name: 'Guest Profile and Account Ledger', href: '/reports-guest-profile', icon: UserGroupIcon },
      { name: 'Purchased Inventory', href: '/reports-purchased-inventory', icon: ChartBarIcon },
      { name: 'Creditors List', href: '/reports-creditors', icon: DocumentChartBarIcon },
      { name: 'Debtors List', href: '/reports-debtors', icon: DocumentChartBarIcon },
      { name: 'Garden Reservation', href: '/reports-garden-reservation', icon: MapIcon },
      { name: 'Hall Reservation', href: '/reports-hall-reservation', icon: BuildingOfficeIcon },
      { name: 'Room Reservation', href: '/reports-room-reservation', icon: CalendarDaysIcon },
      { name: 'Check In', href: '/reports-check-in', icon: KeyIcon },
      { name: 'Check Out', href: '/reports-check-out', icon: ArrowRightOnRectangleIcon },
      { name: 'Check In with ID', href: '/reports-check-in-id', icon: KeyIcon },
      { name: 'Check Out with ID', href: '/reports-check-out-id', icon: ArrowRightOnRectangleIcon },
      { name: 'Room Services', href: '/reports-room-services', icon: PhoneIcon },
      { name: 'Restaurant Billing', href: '/reports-restaurant-billing', icon: ShoppingCartIcon },
      { name: 'Laundry Billing', href: '/reports-laundry-billing', icon: ClipboardDocumentListIcon },
      { name: 'Restaurant Billing (WOT)', href: '/reports-restaurant-wot', icon: ShoppingCartIcon },
      { name: 'Advance Entry', href: '/reports-advance-entry', icon: BanknotesIcon },
      { name: 'Current Payroll Advance', href: '/reports-payroll-advance', icon: BanknotesIcon },
      { name: 'Deduction', href: '/reports-deduction', icon: CurrencyDollarIcon },
      { name: 'Employee Payment', href: '/reports-employee-payment', icon: UserGroupIcon },
      { name: 'Salary Slip', href: '/reports-salary-slip', icon: DocumentChartBarIcon },
      { name: 'Salary Slips', href: '/reports-salary-slips', icon: DocumentChartBarIcon },
      { name: 'Room Bill', href: '/reports-room-bill', icon: BanknotesIcon }
    ]
  },
  { 
    name: 'Guest Services', 
    icon: HeartIcon,
    submenu: [
      { name: 'Concierge Services', href: '/concierge', icon: StarIcon },
      { name: 'Spa & Wellness', href: '/spa-wellness', icon: HeartIcon },
      { name: 'Event Management', href: '/events', icon: GiftIcon },
      { name: 'Transportation', href: '/transportation', icon: TruckIcon },
      { name: 'Tour & Travel', href: '/tours', icon: MapIcon },
      { name: 'Guest Feedback', href: '/feedback', icon: ChatBubbleLeftRightIcon }
    ]
  },
  { 
    name: 'Marketing & CRM', 
    icon: MegaphoneIcon,
    submenu: [
      { name: 'Customer Database', href: '/customer-database', icon: UserGroupIcon },
      { name: 'Loyalty Program', href: '/loyalty-program', icon: GiftIcon },
      { name: 'Marketing Campaigns', href: '/marketing-campaigns', icon: MegaphoneIcon },
      { name: 'Guest Communications', href: '/guest-communications', icon: ChatBubbleLeftRightIcon },
      { name: 'Reviews Management', href: '/reviews', icon: StarIcon },
      { name: 'Social Media', href: '/social-media', icon: CameraIcon }
    ]
  },
  { 
    name: 'Facility & Mangmnt', 
    icon: WrenchScrewdriverIcon,
    submenu: [
      { name: 'Facility Management', href: '/facility-management', icon: BuildingOfficeIcon },
      { name: 'Preventive Maintenance', href: '/preventive-maintenance', icon: WrenchScrewdriverIcon },
      { name: 'Work Orders', href: '/work-orders', icon: ClipboardDocumentListIcon },
      { name: 'Asset Management', href: '/asset-management', icon: CubeIcon },
      { name: 'Energy Management', href: '/energy-management', icon: WifiIcon },
      { name: 'Security Systems', href: '/security-systems', icon: ShieldCheckIcon }
    ]
  },
  { 
    name: 'Business Intelligence', 
    icon: AcademicCapIcon,
    submenu: [
      { name: 'Analytics Dashboard', href: '/analytics-dashboard', icon: ChartBarIcon },
      { name: 'Performance Metrics', href: '/performance-metrics', icon: DocumentChartBarIcon },
      { name: 'Forecasting', href: '/forecasting', icon: ChartBarIcon },
      { name: 'Competitor Analysis', href: '/competitor-analysis', icon: BookOpenIcon },
      { name: 'Market Research', href: '/market-research', icon: AcademicCapIcon },
      { name: 'Business Reports', href: '/business-reports', icon: DocumentChartBarIcon }
    ]
  }, */
  { 
    name: 'Administration', 
    icon: Cog6ToothIcon,
    submenu: [
      { name: 'User Management', href: '/user-management', icon: UserIcon },
      { name: 'Permissions & Roles', href: '/permissions', icon: ShieldCheckIcon },
      { name: 'Audit Logs', href: '/audit-logs', icon: ClipboardDocumentListIcon }
    ]
  }
]

const mobileBottomNavigation = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Booking', href: '/reservations', icon: CalendarDaysIcon },
  { name: 'Check-In', href: '/check-in', icon: KeyIcon },
  { name: 'Rooms', href: '/rooms-management/rooms', icon: BuildingOfficeIcon },
  { name: 'Menu', action: 'sidebar', icon: Bars3Icon }
]

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState({})
  const [unreadCount, setUnreadCount] = useState(0)
  const [overviewCounts, setOverviewCounts] = useState({
    todayCheckIns: 0,
    todayCheckOuts: 0,
    pendingReservations: 0,
    totalHotels: 0,
    totalRoomTypes: 0,
    reservationsAddedToday: 0,
    hotelsAddedToday: 0,
    roomTypesAddedToday: 0
  })
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  const roles = (user?.roles || []).map(r => String(r).toLowerCase())
  const permissions = (user?.permissions || []).map(p => String(p).toLowerCase())
  const adminIdentifiers = [
    user?.role,
    user?.userRole,
    user?.userType,
    user?.email,
    user?.userName,
    user?.name
  ]
    .filter(Boolean)
    .map(value => String(value).toLowerCase())

  const isAdmin =
    roles.includes('admin') ||
    adminIdentifiers.some(value => value === 'admin' || value.includes('admin'))

  const canAccessAdminItem = (subItemName) => {
    if (isAdmin) return true

    const permissionByItem = {
      'user management': 'users.view',
      'permissions & roles': 'roles.view',
      'audit logs': 'audit.view'
    }

    const permissionKey = permissionByItem[String(subItemName).toLowerCase()]
    if (permissionKey && permissions.includes(permissionKey.toLowerCase())) {
      return true
    }

    const allowByRole = {
      'user management': ['manager', 'admin'],
      'permissions & roles': ['admin'],
      'audit logs': ['admin']
    }

    const allowed = allowByRole[String(subItemName).toLowerCase()] || []
    return allowed.some(r => roles.includes(r))
  }

  const filteredNavigation = navigation
    .map(item => {
      if (item.name === 'Administration' && item.submenu) {
        const filteredSubmenu = isAdmin
          ? item.submenu
          : item.submenu.filter(sub => canAccessAdminItem(sub.name))
        return {
          ...item,
          submenu: filteredSubmenu
        }
      }
      return item
    })
    .filter(item => {
      if (item.name === 'Administration') {
        return isAdmin || (item.submenu && item.submenu.length > 0)
      }
      return true
    })

  const totalNotifications =
    (unreadCount || 0) +
    (overviewCounts.todayCheckIns || 0) +
    (overviewCounts.todayCheckOuts || 0) +
    (overviewCounts.pendingReservations || 0) +
    (overviewCounts.reservationsAddedToday || 0) +
    (overviewCounts.hotelsAddedToday || 0) +
    (overviewCounts.roomTypesAddedToday || 0)

  useEffect(() => {
    setUserMenuOpen(false)
    setNotificationsOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setUserMenuOpen(false)
        setNotificationsOpen(false)
      }
    }

    const onMouseDown = (e) => {
      const target = e.target
      if (!(target instanceof HTMLElement)) return
      if (userMenuOpen) {
        if (!target.closest('[data-user-menu-root]')) setUserMenuOpen(false)
      }
      if (notificationsOpen) {
        if (!target.closest('[data-notifications-root]')) setNotificationsOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('mousedown', onMouseDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('mousedown', onMouseDown)
    }
  }, [userMenuOpen, notificationsOpen])

  useEffect(() => {
    if (sidebarCollapsed) {
      setExpandedMenus({})
      return
    }

    const parent = filteredNavigation.find((item) =>
      item.submenu?.some((sub) => sub.href === location.pathname)
    )

    if (parent?.name) {
      setExpandedMenus({ [parent.name]: true })
    } else {
      setExpandedMenus({})
    }
  }, [location.pathname, sidebarCollapsed])

  useEffect(() => {
    let cancelled = false

    const isSameLocalDay = (iso) => {
      if (!iso) return false
      const d = new Date(iso)
      if (Number.isNaN(d.getTime())) return false
      const now = new Date()
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      )
    }

    const fetchAllPages = async ({ url, pageSize = 200, maxPages = 20, params = {} }) => {
      const items = []
      for (let page = 1; page <= maxPages; page++) {
        // eslint-disable-next-line no-await-in-loop
        const res = await axios.get(url, { params: { page, pageSize, ...params } })
        const data = res?.data?.data
        if (!Array.isArray(data) || data.length === 0) break
        items.push(...data)
        const totalPages = Number(res?.data?.totalPages)
        if (Number.isFinite(totalPages) && page >= totalPages) break
        if (data.length < pageSize) break
      }
      return items
    }

    const loadNotificationCounts = async () => {
      try {
        const res = await axios.get('/ContactMessage/stats')
        const unread = Number(res?.data?.unread ?? 0)
        if (!cancelled) setUnreadCount(Number.isFinite(unread) ? unread : 0)
      } catch {
        if (!cancelled) setUnreadCount(0)
      }
    }

    const loadBusinessCounts = async () => {
      try {
        const [overviewRes, reservationsPendingRes, hotelsRes, roomTypesRes, reservationsAll, hotelsAll] = await Promise.all([
          axios.get('/dashboard/overview'),
          axios.get('/reservations', { params: { page: 1, pageSize: 1, status: 'Pending' } }),
          axios.get('/hotels', { params: { page: 1, pageSize: 1 } }),
          axios.get('/roomtypes'),
          fetchAllPages({ url: '/reservations', params: {} }),
          fetchAllPages({ url: '/hotels', params: {} })
        ])

        const overview = overviewRes?.data?.data || {}
        const reservations = overview?.Reservations || overview?.reservations || {}

        const todayCheckIns = Number(reservations?.TodayCheckIns ?? reservations?.todayCheckIns ?? 0)
        const todayCheckOuts = Number(reservations?.TodayCheckOuts ?? reservations?.todayCheckOuts ?? 0)

        const pendingReservations = Number(reservationsPendingRes?.data?.totalCount ?? 0)
        const totalHotels = Number(hotelsRes?.data?.totalCount ?? 0)

        const roomTypesData = roomTypesRes?.data?.data
        const totalRoomTypes = Array.isArray(roomTypesData) ? roomTypesData.length : 0

        const reservationsAddedToday = Array.isArray(reservationsAll)
          ? reservationsAll.filter(r => isSameLocalDay(r?.createdAt || r?.CreatedAt)).length
          : 0

        const hotelsAddedToday = Array.isArray(hotelsAll)
          ? hotelsAll.filter(h => isSameLocalDay(h?.createdAt || h?.CreatedAt)).length
          : 0

        const roomTypesAddedToday = Array.isArray(roomTypesData)
          ? roomTypesData.filter(rt => isSameLocalDay(rt?.createdAt || rt?.CreatedAt)).length
          : 0

        if (!cancelled) {
          setOverviewCounts({
            todayCheckIns: Number.isFinite(todayCheckIns) ? todayCheckIns : 0,
            todayCheckOuts: Number.isFinite(todayCheckOuts) ? todayCheckOuts : 0,
            pendingReservations: Number.isFinite(pendingReservations) ? pendingReservations : 0,
            totalHotels: Number.isFinite(totalHotels) ? totalHotels : 0,
            totalRoomTypes: Number.isFinite(totalRoomTypes) ? totalRoomTypes : 0,
            reservationsAddedToday: Number.isFinite(reservationsAddedToday) ? reservationsAddedToday : 0,
            hotelsAddedToday: Number.isFinite(hotelsAddedToday) ? hotelsAddedToday : 0,
            roomTypesAddedToday: Number.isFinite(roomTypesAddedToday) ? roomTypesAddedToday : 0
          })
        }
      } catch {
        if (!cancelled) {
          setOverviewCounts({
            todayCheckIns: 0,
            todayCheckOuts: 0,
            pendingReservations: 0,
            totalHotels: 0,
            totalRoomTypes: 0,
            reservationsAddedToday: 0,
            hotelsAddedToday: 0,
            roomTypesAddedToday: 0
          })
        }
      }
    }

    loadNotificationCounts()
    loadBusinessCounts()
    const id = window.setInterval(loadNotificationCounts, 30000)
    const id2 = window.setInterval(loadBusinessCounts, 60000)
    return () => {
      cancelled = true
      window.clearInterval(id)
      window.clearInterval(id2)
    }
  }, [])

  const toggleMenu = (menuName) => {
    if (!sidebarCollapsed) {
      setExpandedMenus(prev => {
        const willOpen = !prev[menuName]
        return willOpen ? { [menuName]: true } : {}
      })
    }
  }

  const isMenuExpanded = (menuName) => expandedMenus[menuName] || false

  const isActiveRoute = (href) => location.pathname === href
  
  const isParentActive = (submenu) => {
    return submenu?.some(item => location.pathname === item.href)
  }

  const getMenuAbbreviation = (name) => {
    const abbreviations = {
      'Dashboard': 'DB',
      'Front Office': 'FO',
      'Housekeeping': 'HK',
      'Restaurant': 'RS',
      'Payroll': 'PR',
      'Human Resources': 'HR',
      'Reports': 'RP',
      'Guest Services': 'GS',
      'Marketing & CRM': 'MC',
      'Facilities & Maintenance': 'FM',
      'Business Intelligence': 'BI',
      'Administration': 'AD'
    }
    return abbreviations[name] || name.substring(0, 2).toUpperCase()
  }

  const isRouteActive = (href) => {
    if (!href) return false
    if (location.pathname === href) return true
    if (href === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname.startsWith(`${href}/`)
  }

  const getCurrentPageTitle = () => {
    for (const item of filteredNavigation) {
      if (item.href && isRouteActive(item.href)) return item.name
      const matchedSubmenu = item.submenu?.find((subItem) => isRouteActive(subItem.href))
      if (matchedSubmenu) return matchedSubmenu.name
    }
    return 'Hotel ERP'
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gradient-to-r from-gray-900 to-gray-800 bg-opacity-75 backdrop-blur-sm transition-opacity ease-linear duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
        
        <div className={`relative flex-1 flex flex-col max-w-[18rem] w-full bg-gradient-to-b from-white to-gray-50 shadow-2xl transform transition ease-in-out duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-24 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-5 mb-6">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Hotel ERP</span>
                <p className="text-xs text-gray-500 font-medium">Management System v1.0</p>
              </div>
            </div>
            <nav className="mt-3 px-2 space-y-1.5">
              {filteredNavigation.map((item) => {
                if (item.submenu) {
                  const isExpanded = isMenuExpanded(item.name)
                  const isParentActiveMenu = isParentActive(item.submenu)
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={`${
                          isParentActiveMenu
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-blue-500 shadow-sm'
                            : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-sm'
                        } group w-full flex items-center justify-between px-4 py-3.5 text-[0.95rem] font-semibold rounded-2xl transition-all duration-200`}
                      >
                        <div className="flex items-center">
                          <item.icon className={`${isParentActiveMenu ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'} mr-4 h-6 w-6`} />
                          {item.name}
                        </div>
                        {isExpanded ? (
                          <ChevronDownIcon className="h-4 w-4" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="ml-6 mt-2 space-y-1.5 border-l-2 border-gray-200 pl-3">
                          {item.submenu.map((subItem) => {
                            const isActive = isActiveRoute(subItem.href)
                            return (
                              <Link
                                key={subItem.name}
                                to={subItem.href}
                                className={`${
                                  isActive
                                    ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-l-3 border-blue-500 shadow-sm'
                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-gray-900'
                                } group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200`}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <subItem.icon className={`${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'} mr-3 h-4 w-4`} />
                                {subItem.name}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                } else {
                  const isActive = isActiveRoute(item.href)
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isActive
                          ? 'bg-primary-100 border-primary-500 text-primary-700'
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-3 py-3 text-base font-medium rounded-xl border-l-4`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className={`${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'} mr-4 h-6 w-6`} />
                      {item.name}
                    </Link>
                  )
                }
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className={`flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
          <div className="flex flex-col h-0 flex-1 bg-gradient-to-b from-white via-gray-50 to-gray-100 shadow-xl border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
              <div className={`flex items-center flex-shrink-0 mb-8 ${sidebarCollapsed ? 'px-4 justify-center' : 'px-6'}`}>
                {sidebarCollapsed ? (
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">H</span>
                  </div>
                ) : (
                  <div className="ml-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Hotel ERP</span>
                    <p className="text-sm text-gray-500 font-medium">Management System v1.0</p>
                  </div>
                )}
              </div>
              
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {filteredNavigation.map((item) => {
                  if (item.submenu) {
                    const isExpanded = isMenuExpanded(item.name)
                    const isParentActiveMenu = isParentActive(item.submenu)
                    
                    if (sidebarCollapsed) {
                      return (
                        <div key={item.name} className="relative group">
                          <button
                            className={`${
                              isParentActiveMenu
                                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm'
                                : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900'
                            } w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200`}
                            title={`${getMenuAbbreviation(item.name)} - ${item.name}`}
                          >
                            <item.icon className={`${isParentActiveMenu ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'} h-6 w-6`} />
                          </button>
                          <div className="absolute left-0 top-0 mt-1 ml-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-48">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
                              {getMenuAbbreviation(item.name)} - {item.name}
                            </div>
                            {item.submenu.map((subItem) => {
                              const isActive = isActiveRoute(subItem.href)
                              return (
                                <Link
                                  key={subItem.name}
                                  to={subItem.href}
                                  className={`${
                                    isActive
                                      ? 'bg-blue-50 text-blue-700'
                                      : 'text-gray-600 hover:bg-gray-50'
                                  } flex items-center px-3 py-2 text-sm`}
                                >
                                  <subItem.icon className={`${isActive ? 'text-blue-500' : 'text-gray-400'} mr-3 h-4 w-4`} />
                                  {subItem.name}
                                </Link>
                              )
                            })}
                          </div>
                        </div>
                      )
                    }
                    
                    return (
                      <div key={item.name}>
                        <button
                          onClick={() => toggleMenu(item.name)}
                          className={`${
                            isParentActiveMenu
                              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-blue-500 shadow-sm'
                              : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-sm'
                          } group w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 transform hover:scale-105`}
                        >
                          <div className="flex items-center">
                            <item.icon className={`${isParentActiveMenu ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'} mr-3 h-6 w-6`} />
                            {item.name}
                          </div>
                          {isExpanded ? (
                            <ChevronDownIcon className="h-4 w-4" />
                          ) : (
                            <ChevronRightIcon className="h-4 w-4" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="ml-6 mt-1 space-y-1">
                            {item.submenu.map((subItem) => {
                              const isActive = isActiveRoute(subItem.href)
                              return (
                                <Link
                                  key={subItem.name}
                                  to={subItem.href}
                                  className={`${
                                    isActive
                                      ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-500'
                                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                                >
                                  <subItem.icon className={`${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'} mr-3 h-5 w-5`} />
                                  {subItem.name}
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  } else {
                    const isActive = isActiveRoute(item.href)
                    
                    if (sidebarCollapsed) {
                      return (
                        <div key={item.name} className="relative group">
                          <Link
                            to={item.href}
                            className={`${
                              isActive
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            } flex items-center justify-center p-3 rounded-xl transition-all duration-200`}
                            title={`${getMenuAbbreviation(item.name)} - ${item.name}`}
                          >
                            <item.icon className={`${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'} h-6 w-6`} />
                          </Link>
                          <div className="absolute left-0 top-0 mt-1 ml-20 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">{getMenuAbbreviation(item.name)} - {item.name}</span>
                          </div>
                        </div>
                      )
                    }
                    
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`${
                          isActive
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        } group flex items-center px-4 py-3 text-sm font-medium rounded-xl border-l-4 transition-all duration-200`}
                      >
                        <item.icon className={`${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'} mr-3 h-6 w-6`} />
                        {item.name}
                      </Link>
                    )
                  }
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="relative z-10 flex-shrink-0 flex min-h-[64px] md:min-h-[72px] bg-gradient-to-r from-white to-gray-50 shadow-lg border-b border-gray-200 backdrop-blur-sm">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-3 sm:px-4 flex justify-between items-center gap-3">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="flex items-center gap-3 text-gray-400 focus-within:text-gray-600 min-w-0">
                  <button
                    type="button"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="hidden md:inline-flex p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                    title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                  >
                    {sidebarCollapsed ? (
                      <ChevronRightIcon className="h-6 w-6" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent md:hidden block truncate max-w-[9rem] sm:max-w-[12rem]">
                      {getCurrentPageTitle()}
                    </span>
                    <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent hidden md:inline">
                      {getCurrentPageTitle() || 'Hotel ERP Dashboard'}
                    </span>
                    <p className="text-xs text-gray-500 font-medium hidden md:block">Management System v1.0</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <div className="relative" data-notifications-root>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(v => !v)}
                  className="relative p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all duration-200"
                >
                  <BellIcon className="h-5 w-5" />
                  {totalNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold ring-2 ring-white shadow-lg">
                      {totalNotifications > 99 ? '99+' : totalNotifications}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-[18.5rem] max-w-[calc(100vw-1rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                      <div className="text-sm font-semibold text-gray-900">Notifications</div>
                      <div className="text-xs text-gray-600">Today updates & alerts</div>
                    </div>
                    <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto">
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50">
                        <span className="text-sm text-gray-700 font-medium">Reservations (Pending)</span>
                        <span className="text-sm font-bold text-blue-700">{overviewCounts.pendingReservations}</span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50">
                        <span className="text-sm text-gray-700 font-medium">Reservations (Added Today)</span>
                        <span className="text-sm font-bold text-indigo-700">{overviewCounts.reservationsAddedToday}</span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50">
                        <span className="text-sm text-gray-700 font-medium">Check-In (Today)</span>
                        <span className="text-sm font-bold text-green-700">{overviewCounts.todayCheckIns}</span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50">
                        <span className="text-sm text-gray-700 font-medium">Check-Out (Today)</span>
                        <span className="text-sm font-bold text-orange-700">{overviewCounts.todayCheckOuts}</span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50">
                        <span className="text-sm text-gray-700 font-medium">Contact Messages</span>
                        <span className="text-sm font-bold text-red-700">{unreadCount}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" data-user-menu-root>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="flex items-center justify-center h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-md text-white"
                >
                  <span className="font-bold text-sm">
                    {user?.firstName?.charAt(0) || 'A'}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 max-w-[calc(100vw-1rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                    <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                      <div className="text-sm font-semibold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-xs text-gray-600">{user?.email}</div>
                      <div className="text-xs text-blue-700 font-medium mt-1">{user?.roles?.[0] || 'User'}</div>
                    </div>
                    <div className="p-2">
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false)
                          logout()
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-sm font-medium text-gray-700 hover:text-red-700 transition-all duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="ml-4 hidden md:flex items-center md:ml-6 space-x-4">
              {/* Notifications */}
              <div className="relative" data-notifications-root>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(v => !v)}
                  className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 transform hover:scale-110"
                >
                  <BellIcon className="h-6 w-6" />
                  {totalNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold ring-2 ring-white shadow-lg">
                      {totalNotifications > 99 ? '99+' : totalNotifications}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                      <div className="text-sm font-semibold text-gray-900">Notifications</div>
                      <div className="text-xs text-gray-600">Today updates & alerts</div>
                    </div>
                    <div className="p-2 space-y-1">
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50">
                        <span className="text-sm text-gray-700 font-medium">Reservations (Pending)</span>
                        <span className="text-sm font-bold text-blue-700">{overviewCounts.pendingReservations}</span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50">
                        <span className="text-sm text-gray-700 font-medium">Reservations (Added Today)</span>
                        <span className="text-sm font-bold text-indigo-700">{overviewCounts.reservationsAddedToday}</span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50">
                        <span className="text-sm text-gray-700 font-medium">Check-In (Today)</span>
                        <span className="text-sm font-bold text-green-700">{overviewCounts.todayCheckIns}</span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50">
                        <span className="text-sm text-gray-700 font-medium">Check-Out (Today)</span>
                        <span className="text-sm font-bold text-orange-700">{overviewCounts.todayCheckOuts}</span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50">
                        <span className="text-sm text-gray-700 font-medium">Arrival/Departure (Today)</span>
                        <span className="text-sm font-bold text-gray-900">{overviewCounts.todayCheckIns + overviewCounts.todayCheckOuts}</span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50">
                        <span className="text-sm text-gray-700 font-medium">Hotel (Total)</span>
                        <span className="text-sm font-bold text-gray-800">{overviewCounts.totalHotels}</span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50">
                        <span className="text-sm text-gray-700 font-medium">Hotel (Added Today)</span>
                        <span className="text-sm font-bold text-gray-900">{overviewCounts.hotelsAddedToday}</span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50">
                        <span className="text-sm text-gray-700 font-medium">Room Category (Total)</span>
                        <span className="text-sm font-bold text-gray-800">{overviewCounts.totalRoomTypes}</span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50">
                        <span className="text-sm text-gray-700 font-medium">Room Category (Added Today)</span>
                        <span className="text-sm font-bold text-gray-900">{overviewCounts.roomTypesAddedToday}</span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50">
                        <span className="text-sm text-gray-700 font-medium">Contact Messages (Unread)</span>
                        <span className="text-sm font-bold text-red-700">{unreadCount}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative" data-user-menu-root>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(v => !v)}
                    className="flex items-center space-x-3 bg-gradient-to-r from-white to-gray-50 rounded-2xl px-4 py-2 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
                  >
                    <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-sm">
                        {user?.firstName?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div className="hidden md:block">
                      <div className="text-sm font-semibold text-gray-800">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-xs text-blue-600 font-medium">{user?.roles?.[0] || 'User'}</div>
                    </div>
                  </button>
                  <button
                    onClick={logout}
                    className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 transform hover:scale-110"
                    title="Logout"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  </button>
                </div>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                    <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                      <div className="text-sm font-semibold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-xs text-gray-600">{user?.email}</div>
                      <div className="text-xs text-blue-700 font-medium mt-1">User ID: {user?.id ?? '-'}</div>
                    </div>
                    <div className="p-2">
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false)
                          logout()
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-sm font-medium text-gray-700 hover:text-red-700 transition-all duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-4 sm:py-5 md:py-6 pb-20 md:pb-6">
            <div className="max-w-screen-2xl mx-auto px-2.5 sm:px-4 md:px-6 2xl:px-8">
              {children}
            </div>
          </div>
        </main>

        <div className="md:hidden sticky bottom-0 inset-x-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur-md shadow-[0_-8px_24px_rgba(15,23,42,0.08)]">
          <div className="grid grid-cols-5 gap-1 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
            {mobileBottomNavigation.map((item) => {
              const isActive = item.href ? isRouteActive(item.href) : sidebarOpen

              if (item.action === 'sidebar') {
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700'
                        : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-[11px] font-semibold">{item.name}</span>
                  </button>
                )
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700'
                      : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-[11px] font-semibold">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
