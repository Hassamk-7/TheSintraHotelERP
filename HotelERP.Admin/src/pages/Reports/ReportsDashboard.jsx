import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import { Link } from 'react-router-dom';
import {
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PrinterIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const ReportsDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hotelInfo, setHotelInfo] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchHotelInfo();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/Reports/dashboard-summary');
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      // Set mock data if API fails
      setDashboardData({
        TodayCheckIns: 12,
        TodayCheckOuts: 8,
        TodayRevenue: 125000,
        MonthlyCheckIns: 245,
        MonthlyRevenue: 2850000,
        TotalEmployees: 45,
        TodayAttendance: 42,
        LowStockItems: 8,
        OutOfStockItems: 3,
        TotalRooms: 120,
        OccupiedRooms: 78,
        RecentCheckIns: [
          { GuestName: 'Ahmed Ali', RoomNumber: '205', CheckInDate: '2024-01-20', Amount: 15000 },
          { GuestName: 'Fatima Sheikh', RoomNumber: '301', CheckInDate: '2024-01-20', Amount: 25000 },
          { GuestName: 'Hassan Khan', RoomNumber: '102', CheckInDate: '2024-01-19', Amount: 12000 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHotelInfo = async () => {
    try {
      const response = await axios.get('/Reports/hotel-info');
      if (response.data.success) {
        setHotelInfo(response.data.data);
      }
    } catch (err) {
      setHotelInfo({
        HotelName: 'Pearl Continental Hotel',
        Address: 'Club Road, Karachi, Pakistan',
        Phone: '+92-21-111-505-505',
        Email: 'info@pckarachi.com'
      });
    }
  };

  const reportCategories = [
    {
      title: 'Guest & Booking Reports',
      icon: UserGroupIcon,
      color: 'from-blue-500 to-indigo-600',
      reports: [
        { name: 'Guest Profile Report', path: '/reports/guest-profile', description: 'Detailed guest information and history' },
        { name: 'Check-In Report', path: '/reports/checkin', description: 'Daily check-in activities and statistics' },
        { name: 'Check-Out Report', path: '/reports/checkout', description: 'Check-out summary and billing details' },
        { name: 'Reservation Report', path: '/reports/reservation', description: 'Booking patterns and reservation analysis' }
      ]
    },
    {
      title: 'Financial Reports',
      icon: CurrencyDollarIcon,
      color: 'from-green-500 to-emerald-600',
      reports: [
        { name: 'Room Bill Report', path: '/reports/room-bill', description: 'Room charges and billing summary' },
        { name: 'Restaurant Billing', path: '/reports/restaurant-billing', description: 'F&B revenue and order analysis' },
        { name: 'Laundry Billing', path: '/reports/laundry-billing', description: 'Laundry service charges and usage' },
        { name: 'Creditors/Debtors', path: '/reports/creditors-debtors', description: 'Outstanding payments and receivables' }
      ]
    },
    {
      title: 'HR & Payroll Reports',
      icon: UserGroupIcon,
      color: 'from-purple-500 to-pink-600',
      reports: [
        { name: 'Employee Payment Report', path: '/reports/employee-payment', description: 'Salary payments and compensation' },
        { name: 'Advance Entry Report', path: '/reports/advance-entry', description: 'Employee advances and deductions' },
        { name: 'Salary Slip Report', path: '/reports/salary-slip', description: 'Individual and bulk salary slips' },
        { name: 'Deduction Report', path: '/reports/deduction', description: 'Employee deductions and adjustments' }
      ]
    },
    {
      title: 'Inventory & Operations',
      icon: ChartBarIcon,
      color: 'from-orange-500 to-red-600',
      reports: [
        { name: 'Purchased Inventory', path: '/reports/purchased-inventory', description: 'Inventory purchases and stock levels' },
        { name: 'Drinks Stock Report', path: '/reports/drinks-stock', description: 'Beverage inventory and consumption' },
        { name: 'Food Menu Report', path: '/reports/food-drinks-menu', description: 'Menu items and pricing analysis' },
        { name: 'Room Services Report', path: '/reports/room-services', description: 'In-room service usage and revenue' }
      ]
    }
  ];

  const formatCurrency = (amount) => `Rs ${amount?.toLocaleString() || 0}`;
  const formatPercentage = (value, total) => total > 0 ? ((value / total) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Reports Dashboard</h1>
            <p className="text-indigo-100">Comprehensive reporting and analytics for {hotelInfo?.HotelName || 'Hotel ERP System'}</p>
          </div>
          <ChartBarIcon className="h-16 w-16 text-indigo-200" />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Check-ins</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.TodayCheckIns || 0}</p>
            </div>
            <div className="bg-blue-100 rounded-lg p-3">
              <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData?.TodayRevenue)}</p>
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Room Occupancy</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(dashboardData?.OccupiedRooms, dashboardData?.TotalRooms)}%
              </p>
              <p className="text-sm text-gray-500">
                {dashboardData?.OccupiedRooms || 0} / {dashboardData?.TotalRooms || 0} rooms
              </p>
            </div>
            <div className="bg-purple-100 rounded-lg p-3">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Staff Attendance</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(dashboardData?.TodayAttendance, dashboardData?.TotalEmployees)}%
              </p>
              <p className="text-sm text-gray-500">
                {dashboardData?.TodayAttendance || 0} / {dashboardData?.TotalEmployees || 0} present
              </p>
            </div>
            <div className="bg-orange-100 rounded-lg p-3">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(dashboardData?.LowStockItems > 0 || dashboardData?.OutOfStockItems > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-center mb-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mr-2" />
            <h3 className="text-lg font-semibold text-yellow-800">Inventory Alerts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData?.LowStockItems > 0 && (
              <div className="flex items-center text-yellow-700">
                <ArrowDownIcon className="h-5 w-5 mr-2" />
                <span>{dashboardData.LowStockItems} items are running low on stock</span>
              </div>
            )}
            {dashboardData?.OutOfStockItems > 0 && (
              <div className="flex items-center text-red-700">
                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                <span>{dashboardData.OutOfStockItems} items are out of stock</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Check-ins</h3>
        <div className="space-y-3">
          {dashboardData?.RecentCheckIns?.map((checkin, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{checkin.GuestName}</p>
                <p className="text-sm text-gray-600">Room {checkin.RoomNumber}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{formatCurrency(checkin.Amount)}</p>
                <p className="text-sm text-gray-600">{new Date(checkin.CheckInDate).toLocaleDateString()}</p>
              </div>
            </div>
          )) || (
            <p className="text-gray-500 text-center py-4">No recent check-ins available</p>
          )}
        </div>
      </div>

      {/* Report Categories */}
      <div className="space-y-8">
        {reportCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className={`bg-gradient-to-r ${category.color} rounded-lg p-3 mr-4`}>
                <category.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {category.reports.map((report, reportIndex) => (
                <Link
                  key={reportIndex}
                  to={report.path}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{report.name}</h4>
                    <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">{report.description}</p>
                  <div className="flex items-center mt-3 text-indigo-600">
                    <span className="text-sm font-medium">View Report</span>
                    <ArrowUpIcon className="h-4 w-4 ml-1 transform rotate-45" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
            <PrinterIcon className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Print All Reports</span>
          </button>
          
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors">
            <DocumentArrowDownIcon className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Export to Excel</span>
          </button>
          
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors">
            <ChartBarIcon className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Generate Summary</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
