import { useState } from 'react'
import {
  ChartBarIcon,
  ArrowUpIcon,
  CurrencyDollarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState('30')

  const metrics = {
    revenue: 2450000,
    occupancy: 85,
    avgRate: 12500,
    guests: 1250
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-indigo-100">Business intelligence and performance metrics</p>
          </div>
          <ChartBarIcon className="h-12 w-12 text-indigo-200" />
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex justify-end">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">Rs {metrics.revenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 flex items-center">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                +12.5%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.occupancy}%</p>
              <p className="text-sm text-green-600 flex items-center">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                +5.2%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rate</p>
              <p className="text-2xl font-bold text-gray-900">Rs {metrics.avgRate.toLocaleString()}</p>
              <p className="text-sm text-green-600 flex items-center">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                +8.1%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-lg p-3">
              <UserGroupIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Guests</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.guests.toLocaleString()}</p>
              <p className="text-sm text-green-600 flex items-center">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                +15.3%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Revenue Chart Placeholder</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Occupancy Trend</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Occupancy Chart Placeholder</p>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">98.5%</p>
            <p className="text-sm text-gray-600">Customer Satisfaction</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">4.8/5</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">Rs 2.1M</p>
            <p className="text-sm text-gray-600">Monthly Target</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard;
