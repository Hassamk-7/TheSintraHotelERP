import { useState } from 'react'
import {
  ChartBarIcon,
  DocumentChartBarIcon,
  CalendarIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

const FinancialReports = () => {
  const [selectedReport, setSelectedReport] = useState('profit-loss')
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  })

  // Mock financial data
  const financialData = {
    revenue: {
      roomRevenue: 750000,
      restaurantRevenue: 450000,
      barRevenue: 180000,
      laundryRevenue: 25000,
      otherRevenue: 45000,
      total: 1450000
    },
    expenses: {
      foodBeverage: 180000,
      utilities: 85000,
      salaries: 320000,
      maintenance: 45000,
      marketing: 25000,
      insurance: 15000,
      depreciation: 35000,
      other: 55000,
      total: 760000
    },
    assets: {
      currentAssets: {
        cash: 125000,
        bankAccount: 450000,
        accountsReceivable: 85000,
        inventory: 65000,
        prepaidExpenses: 15000,
        total: 740000
      },
      fixedAssets: {
        buildings: 2500000,
        furniture: 350000,
        equipment: 450000,
        vehicles: 180000,
        accumulatedDepreciation: -285000,
        total: 3195000
      },
      totalAssets: 3935000
    },
    liabilities: {
      currentLiabilities: {
        accountsPayable: 125000,
        accrued: 45000,
        taxesPayable: 35000,
        shortTermDebt: 85000,
        total: 290000
      },
      longTermLiabilities: {
        longTermDebt: 850000,
        total: 850000
      },
      totalLiabilities: 1140000
    },
    equity: {
      ownerEquity: 2500000,
      retainedEarnings: 295000,
      total: 2795000
    }
  }

  const reports = [
    { id: 'profit-loss', name: 'Profit & Loss Statement', icon: ChartBarIcon },
    { id: 'balance-sheet', name: 'Balance Sheet', icon: DocumentChartBarIcon },
    { id: 'cash-flow', name: 'Cash Flow Statement', icon: CalendarIcon },
    { id: 'trial-balance', name: 'Trial Balance', icon: ChartBarIcon }
  ]

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }))
  }

  const formatCurrency = (amount) => {
    return `Rs ${Math.abs(amount).toLocaleString()}`
  }

  const renderProfitLoss = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Room Revenue</span>
            <span className="font-medium">{formatCurrency(financialData.revenue.roomRevenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Restaurant Revenue</span>
            <span className="font-medium">{formatCurrency(financialData.revenue.restaurantRevenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Bar Revenue</span>
            <span className="font-medium">{formatCurrency(financialData.revenue.barRevenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Laundry Revenue</span>
            <span className="font-medium">{formatCurrency(financialData.revenue.laundryRevenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Other Revenue</span>
            <span className="font-medium">{formatCurrency(financialData.revenue.otherRevenue)}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between font-bold text-lg">
              <span>Total Revenue</span>
              <span className="text-green-600">{formatCurrency(financialData.revenue.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Food & Beverage Cost</span>
            <span className="font-medium">{formatCurrency(financialData.expenses.foodBeverage)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Utilities</span>
            <span className="font-medium">{formatCurrency(financialData.expenses.utilities)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Salaries & Wages</span>
            <span className="font-medium">{formatCurrency(financialData.expenses.salaries)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Maintenance</span>
            <span className="font-medium">{formatCurrency(financialData.expenses.maintenance)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Marketing</span>
            <span className="font-medium">{formatCurrency(financialData.expenses.marketing)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Insurance</span>
            <span className="font-medium">{formatCurrency(financialData.expenses.insurance)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Depreciation</span>
            <span className="font-medium">{formatCurrency(financialData.expenses.depreciation)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Other Expenses</span>
            <span className="font-medium">{formatCurrency(financialData.expenses.other)}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between font-bold text-lg">
              <span>Total Expenses</span>
              <span className="text-red-600">{formatCurrency(financialData.expenses.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Net Income</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Gross Profit</span>
            <span className="font-medium">{formatCurrency(financialData.revenue.total - financialData.expenses.total)}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between font-bold text-xl">
              <span>Net Income</span>
              <span className="text-green-600">{formatCurrency(financialData.revenue.total - financialData.expenses.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderBalanceSheet = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assets</h3>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-3">Current Assets</h4>
            <div className="space-y-2 ml-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Cash in Hand</span>
                <span>{formatCurrency(financialData.assets.currentAssets.cash)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bank Account</span>
                <span>{formatCurrency(financialData.assets.currentAssets.bankAccount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accounts Receivable</span>
                <span>{formatCurrency(financialData.assets.currentAssets.accountsReceivable)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Inventory</span>
                <span>{formatCurrency(financialData.assets.currentAssets.inventory)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Prepaid Expenses</span>
                <span>{formatCurrency(financialData.assets.currentAssets.prepaidExpenses)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-medium">
                  <span>Total Current Assets</span>
                  <span>{formatCurrency(financialData.assets.currentAssets.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-3">Fixed Assets</h4>
            <div className="space-y-2 ml-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Buildings</span>
                <span>{formatCurrency(financialData.assets.fixedAssets.buildings)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Furniture & Fixtures</span>
                <span>{formatCurrency(financialData.assets.fixedAssets.furniture)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Equipment</span>
                <span>{formatCurrency(financialData.assets.fixedAssets.equipment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicles</span>
                <span>{formatCurrency(financialData.assets.fixedAssets.vehicles)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Less: Accumulated Depreciation</span>
                <span className="text-red-600">({formatCurrency(financialData.assets.fixedAssets.accumulatedDepreciation)})</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-medium">
                  <span>Total Fixed Assets</span>
                  <span>{formatCurrency(financialData.assets.fixedAssets.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total Assets</span>
              <span className="text-blue-600">{formatCurrency(financialData.assets.totalAssets)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Liabilities & Equity</h3>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-3">Current Liabilities</h4>
            <div className="space-y-2 ml-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Accounts Payable</span>
                <span>{formatCurrency(financialData.liabilities.currentLiabilities.accountsPayable)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accrued Expenses</span>
                <span>{formatCurrency(financialData.liabilities.currentLiabilities.accrued)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes Payable</span>
                <span>{formatCurrency(financialData.liabilities.currentLiabilities.taxesPayable)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Short-term Debt</span>
                <span>{formatCurrency(financialData.liabilities.currentLiabilities.shortTermDebt)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-medium">
                  <span>Total Current Liabilities</span>
                  <span>{formatCurrency(financialData.liabilities.currentLiabilities.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-3">Long-term Liabilities</h4>
            <div className="space-y-2 ml-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Long-term Debt</span>
                <span>{formatCurrency(financialData.liabilities.longTermLiabilities.longTermDebt)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-medium">
                  <span>Total Long-term Liabilities</span>
                  <span>{formatCurrency(financialData.liabilities.longTermLiabilities.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-3 mb-4">
            <div className="flex justify-between font-medium">
              <span>Total Liabilities</span>
              <span className="text-red-600">{formatCurrency(financialData.liabilities.totalLiabilities)}</span>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-3">Owner's Equity</h4>
            <div className="space-y-2 ml-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Owner's Capital</span>
                <span>{formatCurrency(financialData.equity.ownerEquity)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Retained Earnings</span>
                <span>{formatCurrency(financialData.equity.retainedEarnings)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-medium">
                  <span>Total Equity</span>
                  <span className="text-green-600">{formatCurrency(financialData.equity.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total Liabilities & Equity</span>
              <span className="text-blue-600">{formatCurrency(financialData.liabilities.totalLiabilities + financialData.equity.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCashFlow = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow Statement</h3>
      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Operating Activities</h4>
          <div className="space-y-2 ml-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Net Income</span>
              <span>{formatCurrency(690000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Depreciation</span>
              <span>{formatCurrency(35000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Changes in Accounts Receivable</span>
              <span className="text-red-600">({formatCurrency(15000)})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Changes in Accounts Payable</span>
              <span>{formatCurrency(25000)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-medium">
                <span>Net Cash from Operating Activities</span>
                <span className="text-green-600">{formatCurrency(735000)}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-3">Investing Activities</h4>
          <div className="space-y-2 ml-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Equipment Purchase</span>
              <span className="text-red-600">({formatCurrency(150000)})</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-medium">
                <span>Net Cash from Investing Activities</span>
                <span className="text-red-600">({formatCurrency(150000)})</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-3">Financing Activities</h4>
          <div className="space-y-2 ml-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Loan Repayment</span>
              <span className="text-red-600">({formatCurrency(85000)})</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-medium">
                <span>Net Cash from Financing Activities</span>
                <span className="text-red-600">({formatCurrency(85000)})</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Net Change in Cash</span>
            <span className="text-green-600">{formatCurrency(500000)}</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTrialBalance = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Trial Balance</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 text-sm text-gray-900">Cash in Hand</td>
              <td className="px-6 py-4 text-sm text-right">{formatCurrency(125000)}</td>
              <td className="px-6 py-4 text-sm text-right">-</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm text-gray-900">Bank Account</td>
              <td className="px-6 py-4 text-sm text-right">{formatCurrency(450000)}</td>
              <td className="px-6 py-4 text-sm text-right">-</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm text-gray-900">Accounts Receivable</td>
              <td className="px-6 py-4 text-sm text-right">{formatCurrency(85000)}</td>
              <td className="px-6 py-4 text-sm text-right">-</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm text-gray-900">Room Revenue</td>
              <td className="px-6 py-4 text-sm text-right">-</td>
              <td className="px-6 py-4 text-sm text-right">{formatCurrency(750000)}</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm text-gray-900">Restaurant Revenue</td>
              <td className="px-6 py-4 text-sm text-right">-</td>
              <td className="px-6 py-4 text-sm text-right">{formatCurrency(450000)}</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm text-gray-900">Accounts Payable</td>
              <td className="px-6 py-4 text-sm text-right">-</td>
              <td className="px-6 py-4 text-sm text-right">{formatCurrency(125000)}</td>
            </tr>
            <tr className="bg-gray-50 font-bold">
              <td className="px-6 py-4 text-sm">TOTALS</td>
              <td className="px-6 py-4 text-sm text-right">{formatCurrency(1450000)}</td>
              <td className="px-6 py-4 text-sm text-right">{formatCurrency(1450000)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderReport = () => {
    switch (selectedReport) {
      case 'profit-loss':
        return renderProfitLoss()
      case 'balance-sheet':
        return renderBalanceSheet()
      case 'cash-flow':
        return renderCashFlow()
      case 'trial-balance':
        return renderTrialBalance()
      default:
        return renderProfitLoss()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Financial Reports</h1>
            <p className="text-green-100">Comprehensive financial statements and analysis</p>
          </div>
          <ChartBarIcon className="h-12 w-12 text-green-200" />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {reports.map(report => (
                <option key={report.id} value={report.id}>{report.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex items-end space-x-2">
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <EyeIcon className="h-4 w-4 mr-2" />
              View
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </button>
            <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-2xl p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Grand Palace Hotel</h2>
            <h3 className="text-lg font-semibold text-gray-700">
              {reports.find(r => r.id === selectedReport)?.name}
            </h3>
            <p className="text-gray-600">
              For the period {dateRange.startDate} to {dateRange.endDate}
            </p>
          </div>
          
          {renderReport()}
        </div>
      </div>
    </div>
  )
}

export default FinancialReports;
