import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import {
  DocumentTextIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  HomeIcon,
  UserGroupIcon,
  CreditCardIcon,
  ClockIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AuditReports = ({ isOpen, onClose, auditId }) => {
  const [activeTab, setActiveTab] = useState('revenue');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [revenueData, setRevenueData] = useState(null);
  const [occupancyData, setOccupancyData] = useState(null);
  const [cashierData, setCashierData] = useState(null);
  const [auditTrail, setAuditTrail] = useState([]);

  // Load reports data when modal opens
  useEffect(() => {
    if (isOpen) {
      loadReportsData();
    }
  }, [isOpen, auditId]);

  const loadReportsData = async () => {
    try {
      setLoading(true);
      setError('');

      // Always use mock data for demonstration
      
      setRevenueData({
        roomRevenue: 38000,
        fbRevenue: 12500,
        spaRevenue: 5000,
        laundryRevenue: 2800,
        otherRevenue: 1200,
        totalRevenue: 59500,
        breakdown: [
          { department: 'Rooms', amount: 38000, percentage: 63.9 },
          { department: 'Food & Beverage', amount: 12500, percentage: 21.0 },
          { department: 'Spa & Wellness', amount: 5000, percentage: 8.4 },
          { department: 'Laundry', amount: 2800, percentage: 4.7 },
          { department: 'Other Services', amount: 1200, percentage: 2.0 }
        ]
      });

      setOccupancyData({
        totalRooms: 50,
        occupiedRooms: 32,
        vacantRooms: 18,
        outOfOrderRooms: 0,
        occupancyPercentage: 64.0,
        adr: 11875,
        revpar: 7600,
        roomTypes: [
          { type: 'Standard', total: 20, occupied: 15, rate: 8000 },
          { type: 'Deluxe', total: 20, occupied: 12, rate: 12000 },
          { type: 'Suite', total: 10, occupied: 5, rate: 18000 }
        ]
      });

      setCashierData({
        totalPayments: 59500,
        cash: 15000,
        creditCard: 28500,
        bankTransfer: 16000,
        paymentBreakdown: [
          { method: 'Cash', amount: 15000, percentage: 25.2, transactions: 8 },
          { method: 'Credit Card', amount: 28500, percentage: 47.9, transactions: 15 },
          { method: 'Bank Transfer', amount: 16000, percentage: 26.9, transactions: 9 }
        ]
      });

      setAuditTrail([
        { id: 1, time: '22:30', action: 'Room Charge Posted', user: 'System', details: 'Daily room charges auto-posted', amount: 38000 },
        { id: 2, time: '23:15', action: 'Payment Received', user: 'Front Desk', details: 'Credit Card payment for Room 205', amount: 2500 },
        { id: 3, time: '23:45', action: 'Service Charge Posted', user: 'Restaurant', details: 'Dinner bill for Room 301', amount: 1200 },
        { id: 4, time: '00:30', action: 'Payment Received', user: 'Night Manager', details: 'Cash payment for Room 102', amount: 3500 },
        { id: 5, time: '01:00', action: 'Audit Started', user: 'Night Manager', details: 'Night audit process initiated', amount: 0 },
        { id: 6, time: '01:30', action: 'Reconciliation Complete', user: 'System', details: 'Financial reconciliation completed', amount: 0 }
      ]);

    } catch (error) {
      console.error('Error in loadReportsData:', error);
      setError('Error loading reports data');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString();
    const reportTitle = tabs.find(tab => tab.id === activeTab)?.name || 'Night Audit Report';
    
    let printContent = `
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .hotel-name { font-size: 24px; font-weight: bold; color: #1e40af; }
            .report-title { font-size: 18px; margin: 10px 0; }
            .date { font-size: 14px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .summary-card { display: inline-block; margin: 10px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            .amount { font-weight: bold; color: #059669; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="hotel-name">Grand Palace Hotel</div>
            <div class="report-title">${reportTitle}</div>
            <div class="date">Generated on: ${currentDate}</div>
          </div>
    `;

    // Add content based on active tab
    if (activeTab === 'revenue' && revenueData) {
      printContent += `
        <h3>Revenue Summary</h3>
        <div class="summary-card">
          <strong>Total Revenue:</strong> <span class="amount">Rs. ${revenueData.totalRevenue.toLocaleString()}</span>
        </div>
        <div class="summary-card">
          <strong>Room Revenue:</strong> <span class="amount">Rs. ${revenueData.roomRevenue.toLocaleString()}</span>
        </div>
        <div class="summary-card">
          <strong>Extra Services:</strong> <span class="amount">Rs. ${(revenueData.totalRevenue - revenueData.roomRevenue).toLocaleString()}</span>
        </div>
        
        <h3>Revenue by Department</h3>
        <table>
          <thead>
            <tr><th>Department</th><th>Amount (Rs.)</th><th>Percentage</th></tr>
          </thead>
          <tbody>
            ${revenueData.breakdown.map(item => `
              <tr>
                <td>${item.department}</td>
                <td class="amount">Rs. ${item.amount.toLocaleString()}</td>
                <td>${item.percentage}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (activeTab === 'occupancy' && occupancyData) {
      printContent += `
        <h3>Occupancy Summary</h3>
        <div class="summary-card">
          <strong>Occupancy Rate:</strong> ${occupancyData.occupancyPercentage}%
        </div>
        <div class="summary-card">
          <strong>Occupied Rooms:</strong> ${occupancyData.occupiedRooms}
        </div>
        <div class="summary-card">
          <strong>ADR:</strong> <span class="amount">Rs. ${occupancyData.adr.toLocaleString()}</span>
        </div>
        <div class="summary-card">
          <strong>RevPAR:</strong> <span class="amount">Rs. ${occupancyData.revpar.toLocaleString()}</span>
        </div>
        
        <h3>Room Type Analysis</h3>
        <table>
          <thead>
            <tr><th>Room Type</th><th>Total Rooms</th><th>Occupied</th><th>Rate (Rs.)</th><th>Revenue (Rs.)</th></tr>
          </thead>
          <tbody>
            ${occupancyData.roomTypes.map(room => `
              <tr>
                <td>${room.type}</td>
                <td>${room.total}</td>
                <td>${room.occupied}</td>
                <td class="amount">Rs. ${room.rate.toLocaleString()}</td>
                <td class="amount">Rs. ${(room.occupied * room.rate).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (activeTab === 'cashier' && cashierData) {
      printContent += `
        <h3>Payment Summary</h3>
        <div class="summary-card">
          <strong>Total Payments:</strong> <span class="amount">Rs. ${cashierData.totalPayments.toLocaleString()}</span>
        </div>
        <div class="summary-card">
          <strong>Cash:</strong> <span class="amount">Rs. ${cashierData.cash.toLocaleString()}</span>
        </div>
        <div class="summary-card">
          <strong>Credit Card:</strong> <span class="amount">Rs. ${cashierData.creditCard.toLocaleString()}</span>
        </div>
        <div class="summary-card">
          <strong>Bank Transfer:</strong> <span class="amount">Rs. ${cashierData.bankTransfer.toLocaleString()}</span>
        </div>
        
        <h3>Payment Method Analysis</h3>
        <table>
          <thead>
            <tr><th>Payment Method</th><th>Amount (Rs.)</th><th>Percentage</th><th>Transactions</th><th>Avg. Transaction (Rs.)</th></tr>
          </thead>
          <tbody>
            ${cashierData.paymentBreakdown.map(payment => `
              <tr>
                <td>${payment.method}</td>
                <td class="amount">Rs. ${payment.amount.toLocaleString()}</td>
                <td>${payment.percentage}%</td>
                <td>${payment.transactions}</td>
                <td class="amount">Rs. ${(payment.amount / payment.transactions).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (activeTab === 'audit' && auditTrail) {
      printContent += `
        <h3>Night Audit Activity Log</h3>
        <table>
          <thead>
            <tr><th>Time</th><th>Action</th><th>User</th><th>Details</th><th>Amount (Rs.)</th></tr>
          </thead>
          <tbody>
            ${auditTrail.map(entry => `
              <tr>
                <td>${entry.time}</td>
                <td>${entry.action}</td>
                <td>${entry.user}</td>
                <td>${entry.details}</td>
                <td class="amount">${entry.amount !== 0 ? 'Rs. ' + entry.amount.toLocaleString() : '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    printContent += `
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleExport = () => {
    const currentDate = new Date().toLocaleDateString();
    const reportTitle = tabs.find(tab => tab.id === activeTab)?.name || 'Night Audit Report';
    
    let csvContent = `${reportTitle} - Generated on ${currentDate}\n\n`;

    if (activeTab === 'revenue' && revenueData) {
      csvContent += "Revenue Summary\n";
      csvContent += `Total Revenue,Rs. ${revenueData.totalRevenue.toLocaleString()}\n`;
      csvContent += `Room Revenue,Rs. ${revenueData.roomRevenue.toLocaleString()}\n`;
      csvContent += `Extra Services,Rs. ${(revenueData.totalRevenue - revenueData.roomRevenue).toLocaleString()}\n\n`;
      
      csvContent += "Revenue by Department\n";
      csvContent += "Department,Amount (Rs.),Percentage\n";
      revenueData.breakdown.forEach(item => {
        csvContent += `${item.department},Rs. ${item.amount.toLocaleString()},${item.percentage}%\n`;
      });
    } else if (activeTab === 'occupancy' && occupancyData) {
      csvContent += "Occupancy Summary\n";
      csvContent += `Occupancy Rate,${occupancyData.occupancyPercentage}%\n`;
      csvContent += `Occupied Rooms,${occupancyData.occupiedRooms}\n`;
      csvContent += `ADR,Rs. ${occupancyData.adr.toLocaleString()}\n`;
      csvContent += `RevPAR,Rs. ${occupancyData.revpar.toLocaleString()}\n\n`;
      
      csvContent += "Room Type Analysis\n";
      csvContent += "Room Type,Total Rooms,Occupied,Rate (Rs.),Revenue (Rs.)\n";
      occupancyData.roomTypes.forEach(room => {
        csvContent += `${room.type},${room.total},${room.occupied},Rs. ${room.rate.toLocaleString()},Rs. ${(room.occupied * room.rate).toLocaleString()}\n`;
      });
    } else if (activeTab === 'cashier' && cashierData) {
      csvContent += "Payment Summary\n";
      csvContent += `Total Payments,Rs. ${cashierData.totalPayments.toLocaleString()}\n`;
      csvContent += `Cash,Rs. ${cashierData.cash.toLocaleString()}\n`;
      csvContent += `Credit Card,Rs. ${cashierData.creditCard.toLocaleString()}\n`;
      csvContent += `Bank Transfer,Rs. ${cashierData.bankTransfer.toLocaleString()}\n\n`;
      
      csvContent += "Payment Method Analysis\n";
      csvContent += "Payment Method,Amount (Rs.),Percentage,Transactions,Avg. Transaction (Rs.)\n";
      cashierData.paymentBreakdown.forEach(payment => {
        csvContent += `${payment.method},Rs. ${payment.amount.toLocaleString()},${payment.percentage}%,${payment.transactions},Rs. ${(payment.amount / payment.transactions).toLocaleString()}\n`;
      });
    } else if (activeTab === 'audit' && auditTrail) {
      csvContent += "Night Audit Activity Log\n";
      csvContent += "Time,Action,User,Details,Amount (Rs.)\n";
      auditTrail.forEach(entry => {
        csvContent += `${entry.time},${entry.action},${entry.user},"${entry.details}",${entry.amount !== 0 ? 'Rs. ' + entry.amount.toLocaleString() : '-'}\n`;
      });
    }

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  if (!isOpen) return null;

  const tabs = [
    { id: 'revenue', name: 'Revenue Report', icon: CurrencyDollarIcon },
    { id: 'occupancy', name: 'Occupancy Report', icon: HomeIcon },
    { id: 'cashier', name: 'Cashier Report', icon: CreditCardIcon },
    { id: 'audit', name: 'Audit Trail', icon: ClockIcon }
  ];

  const renderRevenueReport = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading revenue data...</span>
        </div>
      );
    }

    if (!revenueData) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No revenue data available</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Revenue</p>
                <p className="text-2xl font-bold">Rs. {revenueData.totalRevenue.toLocaleString()}</p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-green-200" />
            </div>
          </div>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Room Revenue</p>
              <p className="text-2xl font-bold">Rs. {revenueData.roomRevenue.toLocaleString()}</p>
            </div>
            <HomeIcon className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Extra Services</p>
              <p className="text-2xl font-bold">Rs. {(revenueData.totalRevenue - revenueData.roomRevenue).toLocaleString()}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Revenue by Department</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {revenueData.breakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <span className="text-gray-700">{item.department}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-semibold">Rs. {item.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{item.percentage}%</div>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    );
  };

  const renderOccupancyReport = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading occupancy data...</span>
        </div>
      );
    }

    if (!occupancyData) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No occupancy data available</p>
        </div>
      );
    }

    return (
    <div className="space-y-6">
      {/* Occupancy Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{occupancyData.occupancyPercentage}%</div>
            <div className="text-sm text-gray-600 mt-1">Occupancy Rate</div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{occupancyData.occupiedRooms}</div>
            <div className="text-sm text-gray-600 mt-1">Occupied Rooms</div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">Rs. {occupancyData.adr.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">ADR</div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">Rs. {occupancyData.revpar.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">RevPAR</div>
          </div>
        </div>
      </div>

      {/* Room Type Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Room Type Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Rooms</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupied</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {occupancyData.roomTypes.map((roomType, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {roomType.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {roomType.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {roomType.occupied}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {((roomType.occupied / roomType.total) * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs. {roomType.rate.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs. {(roomType.occupied * roomType.rate).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    );
  };

  const renderCashierReport = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading cashier data...</span>
        </div>
      );
    }

    if (!cashierData) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No cashier data available</p>
        </div>
      );
    }

    return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Cash Payments</p>
              <p className="text-2xl font-bold">Rs. {cashierData.cash.toLocaleString()}</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Card Payments</p>
              <p className="text-2xl font-bold">Rs. {cashierData.creditCard.toLocaleString()}</p>
            </div>
            <CreditCardIcon className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Bank Transfers</p>
              <p className="text-2xl font-bold">Rs. {cashierData.bankTransfer.toLocaleString()}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Payment Method Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Payment Method Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Transaction</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cashierData.paymentBreakdown.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs. {payment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.percentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.transactions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs. {(payment.amount / payment.transactions).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    );
  };

  const renderAuditTrail = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading audit trail...</span>
        </div>
      );
    }

    if (!auditTrail || auditTrail.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No audit trail data available</p>
        </div>
      );
    }

    return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Night Audit Activity Log</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {auditTrail.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {entry.action}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.user}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {entry.details}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.amount !== 0 && (
                    <span className={entry.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                      Rs. {entry.amount.toLocaleString()}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="h-6 w-6 text-white" />
              <h2 className="text-xl font-bold text-white">Night Audit Reports</h2>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handlePrint}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <PrinterIcon className="h-4 w-4" />
                <span>Print</span>
              </button>
              <button 
                onClick={handleExport}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-600 text-sm">{error}</div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'revenue' && renderRevenueReport()}
          {activeTab === 'occupancy' && renderOccupancyReport()}
          {activeTab === 'cashier' && renderCashierReport()}
          {activeTab === 'audit' && renderAuditTrail()}
        </div>
      </div>
    </div>
  );
};

export default AuditReports;
