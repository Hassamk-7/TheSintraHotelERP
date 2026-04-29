import React, { useState } from 'react';
import axios from '../../utils/axios';
import { FileText, Download, Calendar } from 'lucide-react';

const Reports = () => {
  const [activeReport, setActiveReport] = useState('trial-balance');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    asOfDate: new Date().toISOString().split('T')[0],
    fromDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    departmentCode: '',
    accountCode: ''
  });

  const generateReport = async () => {
    setLoading(true);
    try {
      let response;
      switch (activeReport) {
        case 'trial-balance':
          response = await axios.get('/AccountingReports/trial-balance', {
            params: { asOfDate: filters.asOfDate }
          });
          break;
        case 'profit-loss':
          response = await axios.get('/AccountingReports/profit-loss', {
            params: { fromDate: filters.fromDate, toDate: filters.toDate, departmentCode: filters.departmentCode }
          });
          break;
        case 'balance-sheet':
          response = await axios.get('/AccountingReports/balance-sheet', {
            params: { asOfDate: filters.asOfDate }
          });
          break;
        case 'department-pl':
          response = await axios.get('/AccountingReports/department-pl', {
            params: { fromDate: filters.fromDate, toDate: filters.toDate }
          });
          break;
        case 'general-ledger':
          response = await axios.get('/AccountingReports/general-ledger', {
            params: { accountCode: filters.accountCode, fromDate: filters.fromDate, toDate: filters.toDate }
          });
          break;
        default:
          break;
      }
      if (response.data.success) {
        setReportData(response.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error generating report');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const exportToExcel = () => {
    alert('Excel export functionality will be implemented');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Accounting Reports</h1>
        <p className="text-gray-600">Generate financial reports and statements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report Menu */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Reports</h3>
          <div className="space-y-2">
            {[
              { id: 'trial-balance', name: 'Trial Balance', icon: FileText },
              { id: 'profit-loss', name: 'Profit & Loss', icon: FileText },
              { id: 'balance-sheet', name: 'Balance Sheet', icon: FileText },
              { id: 'department-pl', name: 'Department P&L', icon: FileText },
              { id: 'general-ledger', name: 'General Ledger', icon: FileText }
            ].map(report => (
              <button
                key={report.id}
                onClick={() => setActiveReport(report.id)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition duration-200 ${
                  activeReport === report.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <report.icon className="w-5 h-5" />
                {report.name}
              </button>
            ))}
          </div>
        </div>

        {/* Report Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Filters */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(activeReport === 'trial-balance' || activeReport === 'balance-sheet') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">As Of Date</label>
                    <input
                      type="date"
                      value={filters.asOfDate}
                      onChange={(e) => setFilters({ ...filters, asOfDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                )}
                {(activeReport === 'profit-loss' || activeReport === 'department-pl' || activeReport === 'general-ledger') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                      <input
                        type="date"
                        value={filters.fromDate}
                        onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                      <input
                        type="date"
                        value={filters.toDate}
                        onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </>
                )}
                {activeReport === 'general-ledger' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Code</label>
                    <input
                      type="text"
                      placeholder="e.g., 1001"
                      value={filters.accountCode}
                      onChange={(e) => setFilters({ ...filters, accountCode: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={generateReport}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition duration-200 disabled:bg-gray-400"
                >
                  {loading ? 'Generating...' : 'Generate Report'}
                </button>
                {reportData && (
                  <button
                    onClick={exportToExcel}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition duration-200"
                  >
                    <Download className="w-4 h-4" />
                    Export Excel
                  </button>
                )}
              </div>
            </div>

            {/* Report Display */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            ) : reportData ? (
              <div className="overflow-x-auto">
                {/* Trial Balance */}
                {activeReport === 'trial-balance' && (
                  <div>
                    <h3 className="text-xl font-bold text-center mb-4">Trial Balance</h3>
                    <p className="text-center text-gray-600 mb-6">
                      As of {new Date(reportData.asOfDate).toLocaleDateString()}
                    </p>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Account Name</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Debit</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Credit</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.accounts.map((acc, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2 text-sm">{acc.accountCode}</td>
                            <td className="px-4 py-2 text-sm">{acc.accountName}</td>
                            <td className="px-4 py-2 text-sm text-right">{formatCurrency(acc.debitBalance)}</td>
                            <td className="px-4 py-2 text-sm text-right">{formatCurrency(acc.creditBalance)}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-100 font-bold">
                          <td colSpan="2" className="px-4 py-2 text-sm">Total</td>
                          <td className="px-4 py-2 text-sm text-right">{formatCurrency(reportData.totalDebit)}</td>
                          <td className="px-4 py-2 text-sm text-right">{formatCurrency(reportData.totalCredit)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Profit & Loss */}
                {activeReport === 'profit-loss' && (
                  <div>
                    <h3 className="text-xl font-bold text-center mb-4">Profit & Loss Statement</h3>
                    <p className="text-center text-gray-600 mb-6">
                      {new Date(reportData.fromDate).toLocaleDateString()} to {new Date(reportData.toDate).toLocaleDateString()}
                    </p>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Revenue</h4>
                        <table className="min-w-full">
                          <tbody>
                            {reportData.revenue.accounts.map((acc, idx) => (
                              <tr key={idx}>
                                <td className="px-4 py-1 text-sm">{acc.accountName}</td>
                                <td className="px-4 py-1 text-sm text-right">{formatCurrency(acc.amount)}</td>
                              </tr>
                            ))}
                            <tr className="border-t-2 font-bold">
                              <td className="px-4 py-2 text-sm">Total Revenue</td>
                              <td className="px-4 py-2 text-sm text-right">{formatCurrency(reportData.revenue.total)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Expenses</h4>
                        <table className="min-w-full">
                          <tbody>
                            {reportData.expenses.accounts.map((acc, idx) => (
                              <tr key={idx}>
                                <td className="px-4 py-1 text-sm">{acc.accountName}</td>
                                <td className="px-4 py-1 text-sm text-right">{formatCurrency(acc.amount)}</td>
                              </tr>
                            ))}
                            <tr className="border-t-2 font-bold">
                              <td className="px-4 py-2 text-sm">Total Expenses</td>
                              <td className="px-4 py-2 text-sm text-right">{formatCurrency(reportData.expenses.total)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="border-t-4 border-double pt-4">
                        <div className="flex justify-between items-center text-xl font-bold">
                          <span className={reportData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {reportData.netProfit >= 0 ? 'Net Profit' : 'Net Loss'}
                          </span>
                          <span className={reportData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(Math.abs(reportData.netProfit))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Balance Sheet */}
                {activeReport === 'balance-sheet' && (
                  <div>
                    <h3 className="text-xl font-bold text-center mb-4">Balance Sheet</h3>
                    <p className="text-center text-gray-600 mb-6">
                      As of {new Date(reportData.asOfDate).toLocaleDateString()}
                    </p>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Assets</h4>
                        <table className="min-w-full">
                          <tbody>
                            {reportData.assets.accounts.map((acc, idx) => (
                              <tr key={idx}>
                                <td className="px-2 py-1 text-sm">{acc.accountName}</td>
                                <td className="px-2 py-1 text-sm text-right">{formatCurrency(acc.balance)}</td>
                              </tr>
                            ))}
                            <tr className="border-t-2 font-bold">
                              <td className="px-2 py-2 text-sm">Total Assets</td>
                              <td className="px-2 py-2 text-sm text-right">{formatCurrency(reportData.assets.total)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Liabilities & Equity</h4>
                        <table className="min-w-full">
                          <tbody>
                            {reportData.liabilities.accounts.map((acc, idx) => (
                              <tr key={idx}>
                                <td className="px-2 py-1 text-sm">{acc.accountName}</td>
                                <td className="px-2 py-1 text-sm text-right">{formatCurrency(acc.balance)}</td>
                              </tr>
                            ))}
                            <tr className="border-t font-semibold">
                              <td className="px-2 py-2 text-sm">Total Liabilities</td>
                              <td className="px-2 py-2 text-sm text-right">{formatCurrency(reportData.liabilities.total)}</td>
                            </tr>
                            {reportData.equity.accounts.map((acc, idx) => (
                              <tr key={idx}>
                                <td className="px-2 py-1 text-sm">{acc.accountName}</td>
                                <td className="px-2 py-1 text-sm text-right">{formatCurrency(acc.balance)}</td>
                              </tr>
                            ))}
                            <tr className="border-t font-semibold">
                              <td className="px-2 py-2 text-sm">Total Equity</td>
                              <td className="px-2 py-2 text-sm text-right">{formatCurrency(reportData.equity.total)}</td>
                            </tr>
                            <tr className="border-t-2 font-bold">
                              <td className="px-2 py-2 text-sm">Total Liabilities & Equity</td>
                              <td className="px-2 py-2 text-sm text-right">{formatCurrency(reportData.totalLiabilitiesAndEquity)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Department P&L */}
                {activeReport === 'department-pl' && (
                  <div>
                    <h3 className="text-xl font-bold text-center mb-4">Departmental P&L</h3>
                    <p className="text-center text-gray-600 mb-6">
                      {new Date(reportData.fromDate).toLocaleDateString()} to {new Date(reportData.toDate).toLocaleDateString()}
                    </p>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Expenses</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Net Profit</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Margin %</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.departments.map((dept, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2 text-sm">{dept.departmentName}</td>
                            <td className="px-4 py-2 text-sm text-right">{formatCurrency(dept.revenue)}</td>
                            <td className="px-4 py-2 text-sm text-right">{formatCurrency(dept.expenses)}</td>
                            <td className="px-4 py-2 text-sm text-right">{formatCurrency(dept.netProfit)}</td>
                            <td className="px-4 py-2 text-sm text-right">{dept.profitMargin.toFixed(2)}%</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-100 font-bold">
                          <td className="px-4 py-2 text-sm">Total</td>
                          <td className="px-4 py-2 text-sm text-right">{formatCurrency(reportData.totalRevenue)}</td>
                          <td className="px-4 py-2 text-sm text-right">{formatCurrency(reportData.totalExpenses)}</td>
                          <td className="px-4 py-2 text-sm text-right">{formatCurrency(reportData.totalNetProfit)}</td>
                          <td className="px-4 py-2 text-sm text-right"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Select parameters and click "Generate Report" to view the report</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
