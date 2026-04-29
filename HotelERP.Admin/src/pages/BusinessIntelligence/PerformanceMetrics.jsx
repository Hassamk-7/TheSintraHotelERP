import { useState } from 'react'
import {
  ChartBarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

const PerformanceMetrics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [selectedMetric, setSelectedMetric] = useState('occupancy')

  const metrics = {
    occupancy: {
      current: 78.5,
      previous: 72.3,
      target: 80.0,
      trend: 'up'
    },
    revenue: {
      current: 2450000,
      previous: 2180000,
      target: 2500000,
      trend: 'up'
    },
    satisfaction: {
      current: 4.6,
      previous: 4.4,
      target: 4.8,
      trend: 'up'
    },
    efficiency: {
      current: 85.2,
      previous: 82.1,
      target: 90.0,
      trend: 'up'
    }
  }

  const departmentMetrics = [
    {
      department: 'Front Office',
      efficiency: 92,
      satisfaction: 4.7,
      revenue: 450000,
      trend: 'up'
    },
    {
      department: 'Housekeeping',
      efficiency: 88,
      satisfaction: 4.5,
      revenue: 0,
      trend: 'up'
    },
    {
      department: 'Restaurant',
      efficiency: 85,
      satisfaction: 4.6,
      revenue: 680000,
      trend: 'down'
    },
    {
      department: 'Maintenance',
      efficiency: 78,
      satisfaction: 4.2,
      revenue: 0,
      trend: 'up'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Performance Metrics</h1>
            <p className="text-purple-100">Track and analyze hotel performance indicators</p>
          </div>
          <ChartBarIcon className="h-12 w-12 text-purple-200" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="occupancy">Occupancy Rate</option>
            <option value="revenue">Revenue</option>
            <option value="satisfaction">Guest Satisfaction</option>
            <option value="efficiency">Operational Efficiency</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.occupancy.current}%</p>
              <p className="text-sm text-green-600 flex items-center">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +{(metrics.occupancy.current - metrics.occupancy.previous).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">Rs {metrics.revenue.current.toLocaleString()}</p>
              <p className="text-sm text-green-600 flex items-center">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +{(((metrics.revenue.current - metrics.revenue.previous) / metrics.revenue.previous) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <UserGroupIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Guest Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.satisfaction.current}/5.0</p>
              <p className="text-sm text-green-600 flex items-center">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +{(metrics.satisfaction.current - metrics.satisfaction.previous).toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Efficiency</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.efficiency.current}%</p>
              <p className="text-sm text-green-600 flex items-center">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +{(metrics.efficiency.current - metrics.efficiency.previous).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Performance Chart</p>
            <p className="text-sm text-gray-400">Showing {selectedMetric} trends for {selectedPeriod} period</p>
          </div>
        </div>
      </div>

      {/* Department Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Department Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficiency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satisfaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentMetrics.map((dept, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{dept.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${dept.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{dept.efficiency}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dept.satisfaction}/5.0
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dept.revenue > 0 ? `Rs ${dept.revenue.toLocaleString()}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      dept.trend === 'up' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {dept.trend === 'up' ? '↗ Improving' : '↘ Declining'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PerformanceMetrics;
