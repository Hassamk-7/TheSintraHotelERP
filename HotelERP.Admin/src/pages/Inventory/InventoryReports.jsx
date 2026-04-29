import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  ChartBarIcon,
  DocumentTextIcon,
  CalendarIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  CubeIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'

const InventoryReports = () => {
  const [selectedReport, setSelectedReport] = useState('stock-summary')
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  })
  const [categoryFilter, setCategoryFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Dynamic report data
  const [reportData, setReportData] = useState({
    stockSummary: [],
    stockMovement: [],
    lowStockItems: [],
    outOfStockItems: [],
    valueAnalysis: []
  })

  // Fetch reports data
  useEffect(() => {
    fetchReportData()
  }, [selectedReport, dateRange])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      setError('')

      const data = { ...reportData }

      if (selectedReport === 'stock-summary') {
        const response = await axios.get('/InventoryReports/stock-summary', {
          params: { startDate: dateRange.startDate, endDate: dateRange.endDate }
        })
        data.stockSummary = response.data?.data || []
      } else if (selectedReport === 'stock-movement') {
        const response = await axios.get('/InventoryReports/stock-movement', {
          params: { startDate: dateRange.startDate, endDate: dateRange.endDate }
        })
        data.stockMovement = response.data?.data || []
      } else if (selectedReport === 'low-stock') {
        const response = await axios.get('/InventoryReports/low-stock')
        data.lowStockItems = response.data?.data?.lowStockItems || []
        data.outOfStockItems = response.data?.data?.outOfStockItems || []
      } else if (selectedReport === 'value-analysis') {
        const response = await axios.get('/InventoryReports/value-analysis', {
          params: { startDate: dateRange.startDate, endDate: dateRange.endDate }
        })
        data.valueAnalysis = response.data?.data || []
      }

      setReportData(data)
    } catch (err) {
      console.error('Error fetching report data:', err)
      setError(err.response?.data?.message || 'Failed to load report data')
    } finally {
      setLoading(false)
    }
  }

  const reports = [
    { id: 'stock-summary', name: 'Stock Summary', icon: CubeIcon },
    { id: 'stock-movement', name: 'Stock Movement', icon: ArrowUpIcon },
    { id: 'low-stock', name: 'Low Stock Report', icon: ArrowDownIcon },
    { id: 'value-analysis', name: 'Value Analysis', icon: ChartBarIcon }
  ]

  const categories = ['Food & Beverage', 'Housekeeping', 'Office Supplies', 'Maintenance']

  const formatCurrency = (amount) => `Rs ${Math.abs(amount).toLocaleString()}`

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    alert('Report exported successfully!')
  }

  const renderStockSummaryReport = () => (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading report data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {reportData.stockSummary.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.category}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-medium">{category.totalItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Value:</span>
                    <span className="font-medium">{formatCurrency(category.totalValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Low Stock:</span>
                    <span className="font-medium text-yellow-600">{category.lowStock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Out of Stock:</span>
                    <span className="font-medium text-red-600">{category.outOfStock}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Category Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Items</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Value</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Low Stock</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Out of Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportData.stockSummary.map((category, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right">{category.totalItems}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right">{formatCurrency(category.totalValue)}</td>
                      <td className="px-6 py-4 text-sm text-yellow-600 text-right font-medium">{category.lowStock}</td>
                      <td className="px-6 py-4 text-sm text-red-600 text-right font-medium">{category.outOfStock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )

  const renderStockMovementReport = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Stock Movement Details</h3>
      </div>
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading movement data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
          <p className="text-red-700">{error}</p>
        </div>
      ) : reportData.stockMovement.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No stock movements found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportData.stockMovement.map((movement, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{movement.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{movement.item}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      movement.type === 'Purchase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {movement.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm text-right font-medium ${
                    movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                  </td>
                  <td className={`px-6 py-4 text-sm text-right font-medium ${
                    movement.value > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {movement.value > 0 ? '+' : ''}{formatCurrency(movement.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )

  const renderLowStockReport = () => (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading low stock data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      ) : (
        <>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center">
              <ArrowDownIcon className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">Low Stock Alert</h3>
                <p className="text-yellow-600">
                  {reportData.lowStockItems.length} items are below minimum stock levels and require restocking.
                </p>
              </div>
            </div>
          </div>

          {reportData.lowStockItems.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Low Stock Items</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Current</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Minimum</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Shortage</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Reorder Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.lowStockItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.item}</td>
                        <td className="px-6 py-4 text-sm text-red-600 text-right font-medium">{item.current}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right">{item.minimum}</td>
                        <td className="px-6 py-4 text-sm text-red-600 text-right font-medium">{item.shortage}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">{formatCurrency(item.value)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.supplier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportData.outOfStockItems.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 text-red-600">Out of Stock Items</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Current</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Minimum</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Shortage</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Reorder Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.outOfStockItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.item}</td>
                        <td className="px-6 py-4 text-sm text-red-600 text-right font-medium">{item.current}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right">{item.minimum}</td>
                        <td className="px-6 py-4 text-sm text-red-600 text-right font-medium">{item.shortage}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">{formatCurrency(item.value)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.supplier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )

  const renderValueAnalysisReport = () => (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading value analysis data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-lg p-3">
                  <ChartBarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Opening Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(reportData.valueAnalysis.reduce((sum, cat) => sum + cat.openingValue, 0))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-lg p-3">
                  <ArrowUpIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Purchases</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(reportData.valueAnalysis.reduce((sum, cat) => sum + cat.purchases, 0))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-red-100 rounded-lg p-3">
                  <ArrowDownIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Usage</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(reportData.valueAnalysis.reduce((sum, cat) => sum + cat.usage, 0))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Value Analysis by Category</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Opening Value</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Purchases</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Usage</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Closing Value</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Variance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportData.valueAnalysis.map((category, index) => {
                    const variance = category.closingValue - category.openingValue
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right">{formatCurrency(category.openingValue)}</td>
                        <td className="px-6 py-4 text-sm text-green-600 text-right font-medium">+{formatCurrency(category.purchases)}</td>
                        <td className="px-6 py-4 text-sm text-red-600 text-right font-medium">-{formatCurrency(category.usage)}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">{formatCurrency(category.closingValue)}</td>
                        <td className={`px-6 py-4 text-sm text-right font-medium ${
                          variance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {variance >= 0 ? '+' : ''}{formatCurrency(variance)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )

  const renderReport = () => {
    switch (selectedReport) {
      case 'stock-summary': return renderStockSummaryReport()
      case 'stock-movement': return renderStockMovementReport()
      case 'low-stock': return renderLowStockReport()
      case 'value-analysis': return renderValueAnalysisReport()
      default: return renderStockSummaryReport()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Inventory Reports</h1>
            <p className="text-teal-100">Comprehensive inventory analytics and reporting</p>
          </div>
          <ChartBarIcon className="h-12 w-12 text-teal-200" />
        </div>
      </div>

      {/* Report Selection & Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Report</label>
            <div className="grid grid-cols-2 gap-2">
              {reports.map((report) => {
                const IconComponent = report.icon
                return (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`flex items-center p-3 rounded-lg border transition-colors ${
                      selectedReport === report.id
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">{report.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="space-y-2">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
            <div className="space-y-2">
              <button
                onClick={handlePrint}
                className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print Report
              </button>
              <button
                onClick={handleExport}
                className="w-full flex items-center justify-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Export Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Grand Palace Hotel</h2>
          <h3 className="text-lg font-semibold text-gray-700">
            {reports.find(r => r.id === selectedReport)?.name}
          </h3>
          <p className="text-gray-600">
            Period: {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500">Generated on: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Report Content */}
      {renderReport()}

      {/* Report Footer */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="text-center text-sm text-gray-500">
          <p>This report was generated automatically by the Hotel ERP System</p>
          <p>For questions or concerns, please contact the inventory management team</p>
        </div>
      </div>
    </div>
  )
}

export default InventoryReports;
