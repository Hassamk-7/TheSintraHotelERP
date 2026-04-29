import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShoppingCartIcon,
  CubeIcon,
  BanknotesIcon,
  UsersIcon,
  HomeIcon,
  FireIcon
} from '@heroicons/react/24/outline'

// Comprehensive mock data for dashboard
const mockOverview = {
  rooms: {
    total: 150,
    available: 45,
    occupied: 95,
    outOfOrder: 10,
    occupancyRate: 63.3,
    weeklyOccupancy: [58, 62, 65, 70, 75, 68, 63]
  },
  guests: {
    total: 127,
    vip: 8,
    checkingInToday: 15,
    checkingOutToday: 12,
    weeklyCheckIns: [12, 15, 18, 22, 25, 20, 15],
    weeklyCheckOuts: [10, 13, 16, 20, 23, 18, 12]
  },
  revenue: {
    today: 124500,
    thisWeek: 875000,
    thisMonth: 2856000,
    lastMonth: 2678000,
    dailyRevenue: [95000, 110000, 125000, 140000, 155000, 135000, 124500],
    weeklyRevenue: [650000, 720000, 680000, 875000],
    monthlyRevenue: [2456000, 2678000, 2856000],
    revenueBySource: {
      rooms: 1850000,
      restaurant: 650000,
      services: 356000
    }
  },
  restaurant: {
    todayOrders: 89,
    todayRevenue: 45600,
    pendingOrders: 7,
    completedOrders: 82,
    weeklyOrders: [65, 72, 78, 85, 92, 88, 89],
    topDishes: [
      { name: 'Biryani', orders: 45, revenue: 22500 },
      { name: 'Karahi', orders: 38, revenue: 19000 },
      { name: 'BBQ Platter', orders: 32, revenue: 24000 },
      { name: 'Pulao', orders: 28, revenue: 11200 }
    ]
  },
  inventory: {
    lowStockAlerts: 3,
    totalItems: 450,
    criticalItems: 2,
    stockValue: 1250000,
    categories: [
      { name: 'Food & Beverages', items: 180, value: 450000 },
      { name: 'Room Supplies', items: 120, value: 320000 },
      { name: 'Cleaning', items: 85, value: 180000 },
      { name: 'Maintenance', items: 65, value: 300000 }
    ]
  },
  employees: {
    total: 85,
    onDuty: 42,
    onLeave: 8,
    departments: [
      { name: 'Front Office', count: 12, onDuty: 8 },
      { name: 'Housekeeping', count: 25, onDuty: 15 },
      { name: 'Restaurant', count: 18, onDuty: 12 },
      { name: 'Maintenance', count: 15, onDuty: 7 },
      { name: 'Management', count: 15, onDuty: 10 }
    ]
  },
  performance: {
    guestSatisfaction: 4.6,
    avgStayDuration: 2.3,
    repeatGuests: 35,
    monthlyTrends: [4.2, 4.3, 4.4, 4.5, 4.6]
  }
}

// Simple Chart Components with fixed colors
const LineChart = ({ data = [], color = "blue", height = "h-32" }) => {
  
  if (!data || data.length === 0) {
    return (
      <div className={`${height} flex items-center justify-center p-4 bg-gray-50 rounded-lg`}>
        <p className="text-gray-400">No data available (Length: {data?.length || 0})</p>
      </div>
    )
  }
  
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  // Fixed color classes to avoid dynamic class issues
  const colorClasses = {
    blue: 'bg-gradient-to-t from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500',
    green: 'bg-gradient-to-t from-green-500 to-green-400 hover:from-green-600 hover:to-green-500',
    purple: 'bg-gradient-to-t from-purple-500 to-purple-400 hover:from-purple-600 hover:to-purple-500',
    orange: 'bg-gradient-to-t from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500'
  }
  
  return (
    <div className={`${height} flex items-end space-x-1 p-4 bg-gray-50 rounded-lg`}>
      {data.map((value, index) => {
        const heightPercent = ((value - min) / range) * 100
        const barHeight = Math.max(heightPercent, 20) // Increased minimum height
        return (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className={`w-full ${colorClasses[color] || colorClasses.green} rounded-t transition-all duration-300 shadow-sm`}
              style={{ 
                height: `${barHeight}%`,
                minHeight: '20px' // Ensure minimum visible height
              }}
              title={`Day ${index + 1}: Rs. ${value.toLocaleString()}`}
            />
          </div>
        )
      })}
    </div>
  )
}

const BarChart = ({ data = [], color = "blue", height = "h-32" }) => {
  const max = data.length > 0 ? Math.max(...data.map(d => d.value)) : 1
  
  return (
    <div className={`${height} space-y-2 p-4`}>
      {data.map((item, index) => {
        const widthPercent = (item.value / max) * 100
        return (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-20 text-xs text-gray-600 truncate">{item.name}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 bg-gradient-to-r from-${color}-500 to-${color}-400 rounded-full transition-all duration-500`}
                style={{ width: `${widthPercent}%` }}
              />
            </div>
            <div className="w-16 text-xs text-gray-600 text-right">{item.value}</div>
          </div>
        )
      })}
    </div>
  )
}

const DonutChart = ({ data = [], colors = ["blue", "green", "yellow", "purple"] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let cumulativePercentage = 0
  
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-2 sm:p-4">
      <div className="relative w-24 h-24 shrink-0">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100
            const strokeDasharray = `${percentage * 2.51} ${251 - percentage * 2.51}`
            const strokeDashoffset = -cumulativePercentage * 2.51
            cumulativePercentage += percentage
            
            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={`rgb(${colors[index % colors.length] === 'blue' ? '59 130 246' : colors[index % colors.length] === 'green' ? '34 197 94' : colors[index % colors.length] === 'yellow' ? '234 179 8' : '168 85 247'})`}
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
            )
          })}
        </svg>
      </div>
      <div className="space-y-1 w-full min-w-0">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2 min-w-0">
            <div className={`w-3 h-3 rounded-full bg-${colors[index % colors.length]}-500`}/>
            <span className="text-xs text-gray-600 truncate">{item.name}</span>
            </div>
            <span className="text-xs font-medium shrink-0">{((item.value / total) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [data, setData] = useState(mockOverview)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      try {
        console.log('Fetching dashboard data from API...')
        const response = await axios.get('/dashboard/overview')
        
        if (response.data?.success) {
          const api = response.data.data
          console.log('API Response:', api)
          
          const mergedData = {
            ...mockOverview,
            rooms: {
              ...mockOverview.rooms,
              total: api.rooms?.total ?? mockOverview.rooms.total,
              occupied: api.rooms?.occupied ?? mockOverview.rooms.occupied,
              available: api.rooms?.available ?? mockOverview.rooms.available,
              outOfOrder: api.rooms?.outOfOrder ?? mockOverview.rooms.outOfOrder,
              maintenance: api.rooms?.maintenance ?? 0,
              reserved: api.rooms?.reserved ?? 0,
              occupancyRate: api.rooms?.occupancyRate ?? mockOverview.rooms.occupancyRate
            },
            guests: {
              ...mockOverview.guests,
              total: api.guests?.active ?? mockOverview.guests.total,
              vip: api.guests?.vip ?? mockOverview.guests.vip
            },
            revenue: {
              ...mockOverview.revenue,
              today: api.revenue?.today ?? mockOverview.revenue.today,
              thisMonth: api.revenue?.thisMonth ?? mockOverview.revenue.thisMonth
            },
            employees: {
              ...mockOverview.employees,
              total: api.employees?.total ?? mockOverview.employees.total,
              onDuty: api.employees?.onDuty ?? mockOverview.employees.onDuty
            },
            todayActivity: {
              checkIns: api.todayActivity?.checkIns ?? 0,
              checkOuts: api.todayActivity?.checkOuts ?? 0,
              restaurantOrders: api.todayActivity?.restaurantOrders ?? 0,
              pendingOrders: api.todayActivity?.pendingOrders ?? 0
            },
            inventory: {
              ...mockOverview.inventory,
              lowStockAlerts: api.inventory?.lowStockAlerts ?? mockOverview.inventory.lowStockAlerts
            }
          }
          setData(mergedData)
          console.log('Dashboard data loaded from API successfully')
          return
        }
      } catch (apiError) {
        console.warn('API call failed, using mock data:', apiError.message)
      }
      
      setData(mockOverview)
      
    } catch (err) {
      console.error('Dashboard error:', err.message)
      setData(mockOverview)
    } finally {
      setLoading(false)
    }
  }


  const stats = [
    {
      name: 'Total Rooms',
      value: data?.rooms?.total || 0,
      subtext: `${data?.rooms?.occupancyRate || 0}% occupied`,
      icon: BuildingOfficeIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      change: '+2.5%',
      changeType: 'positive'
    },
    {
      name: 'Active Guests',
      value: data?.guests?.total || 0,
      subtext: `${data?.guests?.vip || 0} VIP guests`,
      icon: UserGroupIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      change: '+12.3%',
      changeType: 'positive'
    },
    {
      name: 'Today Revenue',
      value: `Rs. ${(data?.revenue?.today || 0).toLocaleString()}`,
      subtext: `Rs. ${(data?.revenue?.thisMonth || 0).toLocaleString()} this month`,
      icon: CurrencyDollarIcon,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      change: '+8.7%',
      changeType: 'positive'
    },
    {
      name: 'Staff on Duty',
      value: data?.employees?.onDuty || 0,
      subtext: `${data?.employees?.total || 0} total staff`,
      icon: ChartBarIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      change: '+5.2%',
      changeType: 'positive'
    }
  ]

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[1.75rem] p-4 sm:p-6 md:p-8 text-white shadow-lg">
        <div className="flex items-start sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1.5 sm:mb-2">Welcome back, Admin!</h1>
            <p className="text-blue-100 text-sm sm:text-base md:text-lg max-w-2xl">
              {loading ? 'Loading real-time data...' : 
               error ? error : 
               "Here's what's happening at your hotel today"}
            </p>
          </div>
          <div className="shrink-0">
            <div className="bg-white/20 rounded-2xl px-3 py-2 sm:p-4 backdrop-blur-sm min-w-[4.5rem] sm:min-w-[5.5rem]">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold">{new Date().getDate()}</div>
                <div className="text-[11px] sm:text-sm text-blue-100">
                  {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Mode Notification - Hidden for now since we're using mock data intentionally */}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className={`${stat.bgColor} rounded-[1.5rem] p-4 sm:p-5 md:p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 sm:hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4 gap-3">
              <div className={`bg-gradient-to-r ${stat.color} rounded-2xl p-2.5 sm:p-3 shadow-lg`}>
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                stat.changeType === 'positive' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
              }`}>
                {stat.change}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {stat.name}
              </h3>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 break-words">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                {stat.subtext}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Daily Revenue Trend</h3>
            <BanknotesIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="overflow-x-auto -mx-1 px-1">
          <div className="h-44 sm:h-48 min-w-[34rem] flex bg-gray-50 rounded-2xl relative">
            {/* Y-axis scale */}
            <div className="w-12 sm:w-16 flex flex-col justify-between py-4 pr-2 text-[10px] sm:text-xs text-gray-500">
              <span>900k</span>
              <span>750k</span>
              <span>600k</span>
              <span>450k</span>
              <span>300k</span>
              <span>150k</span>
              <span>0</span>
            </div>
            
            {/* Chart bars */}
            <div className="flex-1 flex items-end space-x-2 p-3 sm:p-4 pl-2" style={{ height: '180px' }}>
              {[95000, 180000, 320000, 450000, 850000, 620000, 280000].map((value, index) => {
                const maxValue = 900000 // Set max to 900k for proper scaling
                const heightPercent = (value / maxValue) * 100
                const heightPx = Math.max((heightPercent / 100) * 160, 10) // Convert to pixels with 160px max height
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                
                // Different colors for each day
                const dayColors = [
                  'bg-gradient-to-t from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 border-blue-300', // Monday - Blue
                  'bg-gradient-to-t from-indigo-500 to-indigo-400 hover:from-indigo-600 hover:to-indigo-500 border-indigo-300', // Tuesday - Indigo
                  'bg-gradient-to-t from-purple-500 to-purple-400 hover:from-purple-600 hover:to-purple-500 border-purple-300', // Wednesday - Purple
                  'bg-gradient-to-t from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 border-pink-300', // Thursday - Pink
                  'bg-gradient-to-t from-red-500 to-red-400 hover:from-red-600 hover:to-red-500 border-red-300', // Friday - Red (peak day)
                  'bg-gradient-to-t from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 border-orange-300', // Saturday - Orange
                  'bg-gradient-to-t from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 border-green-300' // Sunday - Green
                ]
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center justify-end min-w-[2.65rem]">
                    {/* Value label on top */}
                    <div className="text-[10px] sm:text-xs font-semibold text-gray-700 mb-1 text-center">
                      Rs. {Math.round(value / 1000)}k
                    </div>
                    {/* Bar */}
                    <div 
                      className={`w-full ${dayColors[index]} rounded-t transition-all duration-300 shadow-lg cursor-pointer border`}
                      style={{ 
                        height: `${heightPx}px`
                      }}
                      title={`${days[index]}: Rs. ${value.toLocaleString()} (${heightPercent.toFixed(1)}%)`}
                    />
                  </div>
                )
              })}
            </div>
          </div>
          </div>
          <div className="min-w-[34rem] flex justify-between text-[10px] sm:text-xs text-gray-500 mt-2 px-4 overflow-x-auto">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
          
          {/* Chart Info */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm flex-wrap gap-2">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-gray-600 font-medium text-sm">Daily Revenue (PKR)</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="text-gray-500 text-xs sm:text-sm">
                Peak: Friday (Rs. 850k) • Low: Monday (Rs. 95k)
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2 leading-5">
              Shows total hotel revenue including rooms, restaurant, and services for the last 7 days. Each day has a unique color.
            </div>
          </div>
        </div>

        {/* Check-in/Check-out Comparison */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Check-in vs Check-out</h3>
            <HomeIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="overflow-x-auto -mx-1 px-1">
          <div className="h-40 min-w-[28rem] flex items-end space-x-2 p-4 bg-gray-50 rounded-2xl">
            {(data?.guests?.weeklyCheckIns || []).map((checkins, index) => {
              const checkouts = data?.guests?.weeklyCheckOuts?.[index] || 0
              const maxValue = Math.max(...(data?.guests?.weeklyCheckIns || []), ...(data?.guests?.weeklyCheckOuts || []))
              return (
                <div key={index} className="flex-1 flex flex-col items-center space-y-1 min-w-[2.5rem]">
                  <div className="flex space-x-1 items-end h-32">
                    <div 
                      className="w-3 sm:w-4 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                      style={{ height: `${(checkins / maxValue) * 100}%` }}
                      title={`Check-ins: ${checkins}`}
                    />
                    <div 
                      className="w-3 sm:w-4 bg-gradient-to-t from-green-500 to-green-400 rounded-t"
                      style={{ height: `${(checkouts / maxValue) * 100}%` }}
                      title={`Check-outs: ${checkouts}`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          </div>
          <div className="min-w-[28rem] flex justify-between text-[10px] sm:text-xs text-gray-500 mt-2 px-4 overflow-x-auto">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
          <div className="flex justify-center flex-wrap gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-xs text-gray-600">Check-ins</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-xs text-gray-600">Check-outs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant & Inventory Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Top Dishes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Top Dishes</h3>
            <FireIcon className="h-5 w-5 text-gray-400" />
          </div>
          <BarChart 
            data={data?.restaurant?.topDishes?.map(dish => ({ name: dish.name, value: dish.orders })) || []} 
            color="orange" 
            height="h-48" 
          />
        </div>

        {/* Revenue by Source */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Revenue Sources</h3>
            <ChartBarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <DonutChart 
            data={[
              { name: 'Rooms', value: data.revenue.revenueBySource.rooms },
              { name: 'Restaurant', value: data.revenue.revenueBySource.restaurant },
              { name: 'Services', value: data.revenue.revenueBySource.services }
            ]}
            colors={['blue', 'green', 'purple']}
          />
        </div>

        {/* Inventory Categories */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Inventory Value</h3>
            <CubeIcon className="h-5 w-5 text-gray-400" />
          </div>
          <BarChart 
            data={data?.inventory?.categories?.map(cat => ({ name: cat.name, value: cat.value / 1000 })) || []} 
            color="indigo" 
            height="h-48" 
          />
        </div>
      </div>

      {/* Staff & Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Department Staff */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Staff by Department</h3>
            <UsersIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {(data?.employees?.departments || []).map((dept, index) => (
              <div key={index} className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 truncate">{dept.name}</span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
                  <div className="text-xs sm:text-sm text-gray-600">
                    <span className="font-medium text-green-600">{dept.onDuty}</span>/{dept.count}
                  </div>
                  <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                      style={{ width: `${(dept.onDuty / dept.count) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Performance Metrics</h3>
            <ChartBarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-5 sm:space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Guest Satisfaction</span>
                <span className="text-lg font-bold text-green-600">{data.performance.guestSatisfaction}/5.0</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                  style={{ width: `${(data.performance.guestSatisfaction / 5) * 100}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Avg Stay Duration</span>
                <span className="text-lg font-bold text-blue-600">{data.performance.avgStayDuration} days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                  style={{ width: `${(data.performance.avgStayDuration / 5) * 100}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Repeat Guests</span>
                <span className="text-lg font-bold text-purple-600">{data.performance.repeatGuests}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                  style={{ width: `${data.performance.repeatGuests}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Room Status */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6">
          <div className="flex items-center justify-between mb-5 sm:mb-6 gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Room Status</h3>
            <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-2xl">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Available</span>
              </div>
              <span className="text-lg font-bold text-green-700">{data?.rooms?.available || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-2xl">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Occupied</span>
              </div>
              <span className="text-lg font-bold text-orange-700">{data?.rooms?.occupied || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-2xl">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Staff on Duty</span>
              </div>
              <span className="text-lg font-bold text-blue-700">{data?.employees?.onDuty || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-2xl">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Out of Order</span>
              </div>
              <span className="text-lg font-bold text-red-700">{data?.rooms?.outOfOrder || 0}</span>
            </div>
          </div>
        </div>

        {/* Today's Activity */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6">
          <div className="flex items-center justify-between mb-5 sm:mb-6 gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Today's Activity</h3>
            <CalendarDaysIcon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-2xl">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-3" />
                <span className="text-sm font-medium text-gray-700">Check-Ins</span>
              </div>
              <span className="text-lg font-bold text-blue-700">{data?.todayActivity?.checkIns ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-2xl">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-sm font-medium text-gray-700">Check-Outs</span>
              </div>
              <span className="text-lg font-bold text-green-700">{data?.todayActivity?.checkOuts ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-2xl">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-purple-500 mr-3" />
                <span className="text-sm font-medium text-gray-700">Restaurant Orders</span>
              </div>
              <span className="text-lg font-bold text-purple-700">{data?.todayActivity?.restaurantOrders ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-2xl">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-orange-500 mr-3" />
                <span className="text-sm font-medium text-gray-700">Pending Orders</span>
              </div>
              <span className="text-lg font-bold text-orange-700">{data?.todayActivity?.pendingOrders ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6">
          <div className="flex items-center justify-between mb-5 sm:mb-6 gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Quick Actions</h3>
            <ChartBarIcon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="space-y-3">
            <button className="w-full text-left p-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
              <div className="font-medium">New Reservation</div>
              <div className="text-sm text-blue-100">Add a new booking</div>
            </button>
            <button className="w-full text-left p-3.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-200">
              <div className="font-medium">Check-in Guest</div>
              <div className="text-sm text-green-100">Process arrival</div>
            </button>
            <button className="w-full text-left p-3.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200">
              <div className="font-medium">Room Service</div>
              <div className="text-sm text-purple-100">Manage orders</div>
            </button>
            <button className="w-full text-left p-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200">
              <div className="font-medium">View Reports</div>
              <div className="text-sm text-orange-100">Analytics & insights</div>
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {data?.inventory?.lowStockAlerts > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-[1.5rem] p-4 sm:p-5 md:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-yellow-800 mb-2">
                Inventory Alert
              </h3>
              <p className="text-sm sm:text-base text-yellow-700 mb-3 leading-6">
                {data?.inventory?.lowStockAlerts || 0} items are running low on stock and need immediate attention.
              </p>
              <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-medium">
                View Inventory →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard;
