import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { DollarSign, TrendingUp, TrendingDown, FileText, AlertCircle } from 'lucide-react';

const AccountingDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/AccountingReports/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Accounting Dashboard</h1>
        <p className="text-gray-600">Financial overview and key metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Current Month Revenue */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(dashboardData?.currentMonth?.revenue || 0)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Current Month Expenses */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Monthly Expenses</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(dashboardData?.currentMonth?.expenses || 0)}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Net Profit</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(dashboardData?.currentMonth?.netProfit || 0)}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Pending Entries */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Entries</p>
              <p className="text-2xl font-bold text-gray-800">
                {dashboardData?.pendingEntries || 0}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Financial Position */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Position</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Total Assets</span>
              <span className="text-lg font-semibold text-green-600">
                {formatCurrency(dashboardData?.totalAssets || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Total Liabilities</span>
              <span className="text-lg font-semibold text-red-600">
                {formatCurrency(dashboardData?.totalLiabilities || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-800 font-semibold">Net Worth</span>
              <span className="text-xl font-bold text-blue-600">
                {formatCurrency(dashboardData?.netWorth || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/admin/accounting/journal-entries"
              className="block w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 text-center"
            >
              New Journal Entry
            </a>
            <a
              href="/admin/accounting/chart-of-accounts"
              className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 text-center"
            >
              Chart of Accounts
            </a>
            <a
              href="/admin/accounting/reports"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 text-center"
            >
              View Reports
            </a>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {dashboardData?.pendingEntries > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800">Pending Journal Entries</h4>
            <p className="text-yellow-700 text-sm">
              You have {dashboardData.pendingEntries} draft journal entries waiting to be posted.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingDashboard;
