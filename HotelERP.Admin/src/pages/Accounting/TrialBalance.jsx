import React, { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  ScaleIcon,
  CalendarIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const TrialBalance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showDetails, setShowDetails] = useState(false)
  const [trialBalanceData, setTrialBalanceData] = useState([
    {
      id: 1,
      accountCode: '1001',
      accountName: 'Cash Account',
      accountType: 'Asset',
      debitBalance: 125000,
      creditBalance: 0
    },
    {
      id: 2,
      accountCode: '1002',
      accountName: 'Accounts Receivable',
      accountType: 'Asset',
      debitBalance: 45000,
      creditBalance: 0
    },
    {
      id: 3,
      accountCode: '1003',
      accountName: 'Inventory',
      accountType: 'Asset',
      debitBalance: 85000,
      creditBalance: 0
    },
    {
      id: 4,
      accountCode: '1004',
      accountName: 'Equipment',
      accountType: 'Asset',
      debitBalance: 350000,
      creditBalance: 0
    },
    {
      id: 5,
      accountCode: '2001',
      accountName: 'Accounts Payable',
      accountType: 'Liability',
      debitBalance: 0,
      creditBalance: 65000
    },
    {
      id: 6,
      accountCode: '2002',
      accountName: 'Accrued Expenses',
      accountType: 'Liability',
      debitBalance: 0,
      creditBalance: 25000
    },
    {
      id: 7,
      accountCode: '3001',
      accountName: 'Owner\'s Capital',
      accountType: 'Equity',
      debitBalance: 0,
      creditBalance: 400000
    },
    {
      id: 8,
      accountCode: '4001',
      accountName: 'Revenue - Room Booking',
      accountType: 'Revenue',
      debitBalance: 0,
      creditBalance: 180000
    },
    {
      id: 9,
      accountCode: '4002',
      accountName: 'Revenue - Restaurant',
      accountType: 'Revenue',
      debitBalance: 0,
      creditBalance: 75000
    },
    {
      id: 10,
      accountCode: '5001',
      accountName: 'Salary Expense',
      accountType: 'Expense',
      debitBalance: 95000,
      creditBalance: 0
    },
    {
      id: 11,
      accountCode: '5002',
      accountName: 'Utilities Expense',
      accountType: 'Expense',
      debitBalance: 35000,
      creditBalance: 0
    },
    {
      id: 12,
      accountCode: '5003',
      accountName: 'Food & Beverage Cost',
      accountType: 'Expense',
      debitBalance: 55000,
      creditBalance: 0
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load trial balance on component mount - DISABLED FOR DEMO
  useEffect(() => {
    // API calls disabled to show mock data
    console.log('Trial Balance component loaded with mock data:', trialBalanceData.length, 'accounts')
  }, [selectedDate])

  // Fetch trial balance data - PURE API CALL
  const fetchTrialBalance = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get(`/api/Accounting/trial-balance?date=${selectedDate}`)
      
      if (response.data && response.data.success) {
        setTrialBalanceData(response.data.data)
      } else {
        setError('No trial balance data received')
        setTrialBalanceData([])
      }
    } catch (err) {
      console.error('Error fetching trial balance:', err)
      setError('Using demo data - API connection failed')
      // Keep existing mock data instead of clearing
      console.log('Keeping existing mock data due to API error')
    } finally {
      setLoading(false)
    }
  }

  // Calculate totals
  const totalDebits = trialBalanceData.reduce((sum, account) => sum + (account.debitBalance || 0), 0)
  const totalCredits = trialBalanceData.reduce((sum, account) => sum + (account.creditBalance || 0), 0)
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01

  // Group accounts by type
  const groupedAccounts = trialBalanceData.reduce((groups, account) => {
    const type = account.accountType || 'Other'
    if (!groups[type]) {
      groups[type] = []
    }
    groups[type].push(account)
    return groups
  }, {})

  const getAccountTypeColor = (type) => {
    switch (type) {
      case 'Asset': return 'bg-blue-100 text-blue-800'
      case 'Fixed Asset': return 'bg-indigo-100 text-indigo-800'
      case 'Liability': return 'bg-red-100 text-red-800'
      case 'Long-term Liability': return 'bg-pink-100 text-pink-800'
      case 'Equity': return 'bg-purple-100 text-purple-800'
      case 'Revenue': return 'bg-green-100 text-green-800'
      case 'Expense': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => {
    return `Rs ${amount.toLocaleString()}`
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString();
    const asOfDate = new Date(selectedDate).toLocaleDateString();
    
    const printContent = `
      <html>
        <head>
          <title>Trial Balance Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .hotel-name { font-size: 24px; font-weight: bold; color: #1e40af; }
            .report-title { font-size: 18px; margin: 10px 0; }
            .date { font-size: 14px; color: #666; }
            .summary-section { margin: 20px 0; }
            .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 15px 0; }
            .summary-card { padding: 15px; border: 1px solid #ddd; border-radius: 5px; background: #f8f9fa; }
            .card-title { font-size: 12px; color: #666; margin-bottom: 5px; }
            .card-value { font-size: 18px; font-weight: bold; color: #059669; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .amount { font-weight: bold; color: #059669; }
            .debit { text-align: right; }
            .credit { text-align: right; }
            .total-row { font-weight: bold; background-color: #f0f0f0; }
            .section-title { font-size: 16px; font-weight: bold; margin: 20px 0 10px 0; color: #333; }
            .balance-status { font-weight: bold; }
            .balanced { color: #059669; }
            .unbalanced { color: #dc2626; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="hotel-name">Grand Palace Hotel</div>
            <div class="report-title">Trial Balance</div>
            <div class="date">As of: ${asOfDate} | Generated on: ${currentDate}</div>
          </div>

          <div class="summary-section">
            <div class="section-title">Summary</div>
            <div class="summary-grid">
              <div class="summary-card">
                <div class="card-title">Total Accounts</div>
                <div class="card-value">${trialBalanceData.length}</div>
              </div>
              <div class="summary-card">
                <div class="card-title">Total Debits</div>
                <div class="card-value">${formatCurrency(totalDebits)}</div>
              </div>
              <div class="summary-card">
                <div class="card-title">Total Credits</div>
                <div class="card-value">${formatCurrency(totalCredits)}</div>
              </div>
              <div class="summary-card">
                <div class="card-title">Balance Status</div>
                <div class="card-value ${isBalanced ? 'balanced' : 'unbalanced'}">
                  ${isBalanced ? 'Balanced' : 'Unbalanced'}
                </div>
              </div>
            </div>
          </div>

          <div class="summary-section">
            <div class="section-title">Account Details</div>
            <table>
              <thead>
                <tr>
                  <th>Account Code</th>
                  <th>Account Name</th>
                  <th>Account Type</th>
                  <th class="debit">Debit Balance</th>
                  <th class="credit">Credit Balance</th>
                </tr>
              </thead>
              <tbody>
                ${trialBalanceData.map(account => `
                  <tr>
                    <td>${account.accountCode}</td>
                    <td>${account.accountName}</td>
                    <td>${account.accountType}</td>
                    <td class="debit amount">${account.debitBalance ? formatCurrency(account.debitBalance) : '-'}</td>
                    <td class="credit amount">${account.creditBalance ? formatCurrency(account.creditBalance) : '-'}</td>
                  </tr>
                `).join('')}
                <tr class="total-row">
                  <td colspan="3"><strong>TOTAL</strong></td>
                  <td class="debit amount"><strong>${formatCurrency(totalDebits)}</strong></td>
                  <td class="credit amount"><strong>${formatCurrency(totalCredits)}</strong></td>
                </tr>
                ${!isBalanced ? `
                  <tr class="total-row unbalanced">
                    <td colspan="3"><strong>DIFFERENCE</strong></td>
                    <td class="debit amount"><strong>${totalDebits > totalCredits ? formatCurrency(totalDebits - totalCredits) : '-'}</strong></td>
                    <td class="credit amount"><strong>${totalCredits > totalDebits ? formatCurrency(totalCredits - totalDebits) : '-'}</strong></td>
                  </tr>
                ` : ''}
              </tbody>
            </table>
          </div>

          <div class="summary-section">
            <div class="section-title">Balance Verification</div>
            <p class="balance-status ${isBalanced ? 'balanced' : 'unbalanced'}">
              Status: ${isBalanced ? 'Trial Balance is BALANCED' : 'Trial Balance is UNBALANCED'}
            </p>
            ${!isBalanced ? `
              <p class="unbalanced">
                Difference: ${formatCurrency(Math.abs(totalDebits - totalCredits))}
              </p>
            ` : ''}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }

  const handleExport = () => {
    const currentDate = new Date().toLocaleDateString();
    const asOfDate = new Date(selectedDate).toLocaleDateString();
    
    let csvContent = `Trial Balance Report\n`;
    csvContent += `Grand Palace Hotel\n`;
    csvContent += `As of: ${asOfDate}\n`;
    csvContent += `Generated on: ${currentDate}\n\n`;

    // Summary Section
    csvContent += `Summary\n`;
    csvContent += `Total Accounts,${trialBalanceData.length}\n`;
    csvContent += `Total Debits,${formatCurrency(totalDebits)}\n`;
    csvContent += `Total Credits,${formatCurrency(totalCredits)}\n`;
    csvContent += `Balance Status,${isBalanced ? 'Balanced' : 'Unbalanced'}\n`;
    if (!isBalanced) {
      csvContent += `Difference,${formatCurrency(Math.abs(totalDebits - totalCredits))}\n`;
    }
    csvContent += `\n`;

    // Account Details
    csvContent += `Account Details\n`;
    csvContent += `Account Code,Account Name,Account Type,Debit Balance,Credit Balance\n`;
    
    trialBalanceData.forEach(account => {
      csvContent += `${account.accountCode},"${account.accountName}",${account.accountType},`;
      csvContent += `${account.debitBalance ? formatCurrency(account.debitBalance) : '-'},`;
      csvContent += `${account.creditBalance ? formatCurrency(account.creditBalance) : '-'}\n`;
    });

    // Totals
    csvContent += `\n`;
    csvContent += `TOTAL,,,${formatCurrency(totalDebits)},${formatCurrency(totalCredits)}\n`;
    
    if (!isBalanced) {
      csvContent += `DIFFERENCE,,,`;
      csvContent += `${totalDebits > totalCredits ? formatCurrency(totalDebits - totalCredits) : '-'},`;
      csvContent += `${totalCredits > totalDebits ? formatCurrency(totalCredits - totalDebits) : '-'}\n`;
    }

    // Balance Verification
    csvContent += `\n`;
    csvContent += `Balance Verification\n`;
    csvContent += `Status,${isBalanced ? 'Trial Balance is BALANCED' : 'Trial Balance is UNBALANCED'}\n`;

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Trial_Balance_${asOfDate.replace(/\//g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-600 to-gray-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Trial Balance</h1>
            <p className="text-slate-200">Financial position summary and account balances</p>
          </div>
          <div className="flex items-center space-x-4">
            <ScaleIcon className="h-12 w-12 text-slate-300" />
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
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

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">As of Date</label>
              <div className="relative">
                <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showDetails}
                  onChange={(e) => setShowDetails(e.target.checked)}
                  className="rounded border-gray-300 text-slate-600 focus:ring-slate-500"
                />
                <span className="ml-2 text-sm text-gray-700">Show account details</span>
              </label>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 flex items-center space-x-2 transition-colors"
            >
              <PrinterIcon className="h-5 w-5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 transition-colors"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <ScaleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Accounts</p>
              <p className="text-2xl font-bold text-gray-900">{trialBalanceData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Debits</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDebits)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Credits</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCredits)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className={`rounded-lg p-3 ${isBalanced ? 'bg-green-100' : 'bg-red-100'}`}>
              {isBalanced ? (
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              ) : (
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              )}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Balance Status</p>
              <p className={`text-2xl font-bold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                {isBalanced ? 'Balanced' : 'Unbalanced'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trial Balance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Trial Balance as of {new Date(selectedDate).toLocaleDateString()}
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading trial balance...</p>
          </div>
        ) : trialBalanceData.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <ScaleIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No trial balance data available for the selected date</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account
                  </th>
                  {showDetails && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                  )}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Debit Balance
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credit Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(groupedAccounts).map(([accountType, accounts]) => (
                  <React.Fragment key={accountType}>
                    {showDetails && (
                      <tr className="bg-gray-50">
                        <td 
                          colSpan={showDetails ? 4 : 3} 
                          className="px-6 py-3 text-sm font-semibold text-gray-700"
                        >
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAccountTypeColor(accountType)}`}>
                            {accountType}
                          </span>
                        </td>
                      </tr>
                    )}
                    {accounts.map((account) => (
                      <tr key={account.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{account.accountName}</div>
                            {showDetails && account.accountCode && (
                              <div className="text-sm text-gray-500">{account.accountCode}</div>
                            )}
                          </div>
                        </td>
                        {showDetails && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAccountTypeColor(account.accountType)}`}>
                              {account.accountType}
                            </span>
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {account.debitBalance > 0 ? formatCurrency(account.debitBalance) : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {account.creditBalance > 0 ? formatCurrency(account.creditBalance) : '-'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
                
                {/* Totals Row */}
                <tr className="bg-gray-100 font-bold">
                  <td className={`px-6 py-4 text-sm font-bold text-gray-900 ${showDetails ? '' : 'border-t-2 border-gray-300'}`}>
                    TOTAL
                  </td>
                  {showDetails && <td className="px-6 py-4"></td>}
                  <td className="px-6 py-4 whitespace-nowrap text-right border-t-2 border-gray-300">
                    <div className="text-sm font-bold text-gray-900">
                      {formatCurrency(totalDebits)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right border-t-2 border-gray-300">
                    <div className="text-sm font-bold text-gray-900">
                      {formatCurrency(totalCredits)}
                    </div>
                  </td>
                </tr>

                {/* Difference Row (if unbalanced) */}
                {!isBalanced && (
                  <tr className="bg-red-50">
                    <td className={`px-6 py-4 text-sm font-bold text-red-800 ${showDetails ? '' : ''}`}>
                      DIFFERENCE
                    </td>
                    {showDetails && <td className="px-6 py-4"></td>}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-bold text-red-800">
                        {totalDebits > totalCredits ? formatCurrency(totalDebits - totalCredits) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-bold text-red-800">
                        {totalCredits > totalDebits ? formatCurrency(totalCredits - totalDebits) : '-'}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}

export default TrialBalance;
