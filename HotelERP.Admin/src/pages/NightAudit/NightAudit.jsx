import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import AuditReports from './AuditReports';
import {
  ClockIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  PlayIcon,
  LockClosedIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  HomeIcon,
  UserGroupIcon,
  CreditCardIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

const NightAudit = () => {
  const [auditStatus, setAuditStatus] = useState('pending'); // pending, running, completed, failed
  const [auditData, setAuditData] = useState({
    totalCharges: 0,
    totalPayments: 0,
    difference: 0,
    occupiedRooms: 0,
    totalRooms: 0,
    occupancyPercentage: 0,
    adr: 0,
    revpar: 0,
    roomRevenue: 0,
    extraRevenue: 0,
    totalRevenue: 0
  });
  
  const [pendingIssues, setPendingIssues] = useState([]);
  const [charges, setCharges] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  
  // Mock data for demonstration
  const [mockCharges] = useState([
    {
      id: 1,
      reservationId: 'R001',
      guestName: 'Ahmed Ali',
      roomNumber: '205',
      description: 'Daily Room Charge',
      amount: 12000,
      date: '2024-01-20',
      status: 'posted'
    },
    {
      id: 2,
      reservationId: 'R002',
      guestName: 'Sarah Khan',
      roomNumber: '301',
      description: 'Daily Room Charge',
      amount: 18000,
      date: '2024-01-20',
      status: 'posted'
    },
    {
      id: 3,
      reservationId: 'R001',
      guestName: 'Ahmed Ali',
      roomNumber: '205',
      description: 'Restaurant Service',
      amount: 2500,
      date: '2024-01-20',
      status: 'posted'
    },
    {
      id: 4,
      reservationId: 'R003',
      guestName: 'John Smith',
      roomNumber: '102',
      description: 'Daily Room Charge',
      amount: 8000,
      date: '2024-01-20',
      status: 'posted'
    },
    {
      id: 5,
      reservationId: 'R002',
      guestName: 'Sarah Khan',
      roomNumber: '301',
      description: 'Spa Service',
      amount: 5000,
      date: '2024-01-20',
      status: 'posted'
    }
  ]);

  const [mockPayments] = useState([
    {
      id: 1,
      reservationId: 'R001',
      guestName: 'Ahmed Ali',
      amount: 14500,
      method: 'Credit Card',
      date: '2024-01-20',
      status: 'completed'
    },
    {
      id: 2,
      reservationId: 'R002',
      guestName: 'Sarah Khan',
      amount: 23000,
      method: 'Bank Transfer',
      date: '2024-01-20',
      status: 'completed'
    },
    {
      id: 3,
      reservationId: 'R003',
      guestName: 'John Smith',
      amount: 8000,
      method: 'Cash',
      date: '2024-01-20',
      status: 'completed'
    }
  ]);

  const [auditHistory] = useState([
    {
      id: 1,
      date: '2024-01-19',
      totalCharges: 234000,
      totalPayments: 234000,
      difference: 0,
      occupancyPercentage: 85.5,
      status: 'completed',
      completedBy: 'Night Manager',
      completedAt: '2024-01-20 02:30:00'
    },
    {
      id: 2,
      date: '2024-01-18',
      totalCharges: 198000,
      totalPayments: 196500,
      difference: -1500,
      occupancyPercentage: 78.2,
      status: 'completed',
      completedBy: 'Night Manager',
      completedAt: '2024-01-19 02:45:00'
    }
  ]);

  useEffect(() => {
    // Load initial data
    loadAuditData();
  }, []);

  const loadAuditData = async () => {
    try {
      setLoading(true);
      setError('');

      // Always use mock data for demonstration since API is not fully configured
      console.log('Night Audit: Loading mock data for demonstration');
      
      // Calculate totals from mock data
      const totalCharges = mockCharges.reduce((sum, charge) => sum + charge.amount, 0);
      const totalPayments = mockPayments.reduce((sum, payment) => sum + payment.amount, 0);
      const difference = totalPayments - totalCharges;
      
      const roomCharges = mockCharges.filter(c => c.description === 'Daily Room Charge');
      const extraCharges = mockCharges.filter(c => c.description !== 'Daily Room Charge');
      
      const roomRevenue = roomCharges.reduce((sum, charge) => sum + charge.amount, 0);
      const extraRevenue = extraCharges.reduce((sum, charge) => sum + charge.amount, 0);
      
      const occupiedRooms = roomCharges.length;
      const totalRooms = 50; // Mock total rooms
      const occupancyPercentage = (occupiedRooms / totalRooms) * 100;
      const adr = occupiedRooms > 0 ? roomRevenue / occupiedRooms : 0;
      const revpar = (roomRevenue / totalRooms);

      setAuditData({
        auditId: 1, // Mock audit ID
        businessDate: new Date().toISOString().split('T')[0],
        totalCharges,
        totalPayments,
        difference,
        occupiedRooms,
        totalRooms,
        occupancyPercentage,
        adr,
        revpar,
        roomRevenue,
        extraRevenue,
        totalRevenue: totalCharges
      });

      setCharges(mockCharges);
      setPayments(mockPayments);
      
      // Check for pending issues
      const issues = [];
      if (difference !== 0) {
        issues.push({
          type: 'financial',
          message: `Payment difference of Rs. ${Math.abs(difference).toLocaleString()}`,
          severity: 'high'
        });
      }
      setPendingIssues(issues);

    } catch (error) {
      console.error('Error in loadAuditData:', error);
      setError('Error loading audit data');
    } finally {
      setLoading(false);
    }
  };

  const loadChargesAndPayments = async (auditId) => {
    try {
      const [chargesResponse, paymentsResponse] = await Promise.all([
        axios.get(`/api/nightaudit/${auditId}/charges`),
        axios.get(`/api/nightaudit/${auditId}/payments`)
      ]);

      setCharges(chargesResponse.data.length > 0 ? chargesResponse.data : mockCharges);
      setPayments(paymentsResponse.data.length > 0 ? paymentsResponse.data : mockPayments);
      
    } catch (error) {
      console.error('Error loading charges and payments:', error);
      // Use mock data as fallback
      setCharges(mockCharges);
      setPayments(mockPayments);
    }
  };

  const runNightAudit = async () => {
    if (pendingIssues.length > 0) {
      setError('Cannot run night audit with pending issues. Please resolve them first.');
      return;
    }

    setLoading(true);
    setAuditStatus('running');
    setError('');

    try {
      // Simulate the night audit process with mock data
      console.log('Night Audit: Starting audit process with mock data');
      
      // Simulate audit processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setAuditStatus('completed');
      setSuccess('Night audit completed successfully. Business day closed.');
      setPendingIssues([]); // Clear pending issues after completion
      
    } catch (err) {
      console.error('Night audit error:', err);
      setError('Failed to complete night audit: ' + err.message);
      setAuditStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ClockIcon className="h-5 w-5" />;
      case 'running': return <PlayIcon className="h-5 w-5" />;
      case 'completed': return <CheckCircleIcon className="h-5 w-5" />;
      case 'failed': return <XCircleIcon className="h-5 w-5" />;
      default: return <ClockIcon className="h-5 w-5" />;
    }
  };

  const handleMainPrint = () => {
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString();
    const businessDate = auditData.businessDate || new Date().toISOString().split('T')[0];
    
    const printContent = `
      <html>
        <head>
          <title>Night Audit Summary Report</title>
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
            .section-title { font-size: 16px; font-weight: bold; margin: 20px 0 10px 0; color: #333; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="hotel-name">Grand Palace Hotel</div>
            <div class="report-title">Night Audit Summary Report</div>
            <div class="date">Business Date: ${businessDate} | Generated on: ${currentDate}</div>
          </div>

          <div class="summary-section">
            <div class="section-title">Financial Summary</div>
            <div class="summary-grid">
              <div class="summary-card">
                <div class="card-title">Total Revenue</div>
                <div class="card-value">Rs. ${auditData.totalRevenue?.toLocaleString() || '0'}</div>
              </div>
              <div class="summary-card">
                <div class="card-title">Total Charges</div>
                <div class="card-value">Rs. ${auditData.totalCharges?.toLocaleString() || '0'}</div>
              </div>
              <div class="summary-card">
                <div class="card-title">Total Payments</div>
                <div class="card-value">Rs. ${auditData.totalPayments?.toLocaleString() || '0'}</div>
              </div>
              <div class="summary-card">
                <div class="card-title">Balance</div>
                <div class="card-value">Rs. ${auditData.difference?.toLocaleString() || '0'}</div>
              </div>
            </div>
          </div>

          <div class="summary-section">
            <div class="section-title">Occupancy Summary</div>
            <div class="summary-grid">
              <div class="summary-card">
                <div class="card-title">Occupancy Rate</div>
                <div class="card-value">${auditData.occupancyPercentage?.toFixed(1) || '0'}%</div>
              </div>
              <div class="summary-card">
                <div class="card-title">Occupied Rooms</div>
                <div class="card-value">${auditData.occupiedRooms || '0'}</div>
              </div>
              <div class="summary-card">
                <div class="card-title">ADR</div>
                <div class="card-value">Rs. ${auditData.adr?.toLocaleString() || '0'}</div>
              </div>
              <div class="summary-card">
                <div class="card-title">RevPAR</div>
                <div class="card-value">Rs. ${auditData.revpar?.toLocaleString() || '0'}</div>
              </div>
            </div>
          </div>

          <div class="summary-section">
            <div class="section-title">Today's Charges</div>
            <table>
              <thead>
                <tr><th>Description</th><th>Room</th><th>Amount (Rs.)</th></tr>
              </thead>
              <tbody>
                ${charges.map(charge => `
                  <tr>
                    <td>${charge.description}</td>
                    <td>${charge.roomNumber}</td>
                    <td class="amount">Rs. ${charge.amount.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="summary-section">
            <div class="section-title">Today's Payments</div>
            <table>
              <thead>
                <tr><th>Guest</th><th>Room</th><th>Method</th><th>Amount (Rs.)</th></tr>
              </thead>
              <tbody>
                ${payments.map(payment => `
                  <tr>
                    <td>${payment.guestName}</td>
                    <td>${payment.roomNumber}</td>
                    <td>${payment.paymentMethod}</td>
                    <td class="amount">Rs. ${payment.amount.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="summary-section">
            <div class="section-title">Audit Status</div>
            <p><strong>Current Status:</strong> ${auditStatus.charAt(0).toUpperCase() + auditStatus.slice(1)}</p>
            <p><strong>Pending Issues:</strong> ${pendingIssues.length}</p>
            ${pendingIssues.length > 0 ? `
              <ul>
                ${pendingIssues.map(issue => `<li>${issue.message}</li>`).join('')}
              </ul>
            ` : '<p>No pending issues</p>'}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleMainExport = () => {
    const currentDate = new Date().toLocaleDateString();
    const businessDate = auditData.businessDate || new Date().toISOString().split('T')[0];
    
    let csvContent = `Night Audit Summary Report\n`;
    csvContent += `Business Date: ${businessDate}\n`;
    csvContent += `Generated on: ${currentDate}\n\n`;

    // Financial Summary
    csvContent += `Financial Summary\n`;
    csvContent += `Total Revenue,Rs. ${auditData.totalRevenue?.toLocaleString() || '0'}\n`;
    csvContent += `Total Charges,Rs. ${auditData.totalCharges?.toLocaleString() || '0'}\n`;
    csvContent += `Total Payments,Rs. ${auditData.totalPayments?.toLocaleString() || '0'}\n`;
    csvContent += `Balance,Rs. ${auditData.difference?.toLocaleString() || '0'}\n\n`;

    // Occupancy Summary
    csvContent += `Occupancy Summary\n`;
    csvContent += `Occupancy Rate,${auditData.occupancyPercentage?.toFixed(1) || '0'}%\n`;
    csvContent += `Occupied Rooms,${auditData.occupiedRooms || '0'}\n`;
    csvContent += `Total Rooms,${auditData.totalRooms || '0'}\n`;
    csvContent += `ADR,Rs. ${auditData.adr?.toLocaleString() || '0'}\n`;
    csvContent += `RevPAR,Rs. ${auditData.revpar?.toLocaleString() || '0'}\n\n`;

    // Today's Charges
    csvContent += `Today's Charges\n`;
    csvContent += `Description,Room,Amount (Rs.)\n`;
    charges.forEach(charge => {
      csvContent += `${charge.description},${charge.roomNumber},Rs. ${charge.amount.toLocaleString()}\n`;
    });
    csvContent += `\n`;

    // Today's Payments
    csvContent += `Today's Payments\n`;
    csvContent += `Guest,Room,Method,Amount (Rs.)\n`;
    payments.forEach(payment => {
      csvContent += `"${payment.guestName}",${payment.roomNumber},${payment.paymentMethod},Rs. ${payment.amount.toLocaleString()}\n`;
    });
    csvContent += `\n`;

    // Audit Status
    csvContent += `Audit Status\n`;
    csvContent += `Current Status,${auditStatus.charAt(0).toUpperCase() + auditStatus.slice(1)}\n`;
    csvContent += `Pending Issues,${pendingIssues.length}\n`;
    if (pendingIssues.length > 0) {
      csvContent += `Issues:\n`;
      pendingIssues.forEach(issue => {
        csvContent += `"${issue.message}"\n`;
      });
    }

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Night_Audit_Summary_${businessDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 shadow-xl">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 p-3 rounded-xl">
                <ClockIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Night Audit</h1>
                <p className="text-blue-200 mt-1">Daily Financial Reconciliation & Reporting</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${getStatusColor(auditStatus)}`}>
                {getStatusIcon(auditStatus)}
                <span className="font-medium capitalize">{auditStatus}</span>
              </div>
              <div className="text-right text-white">
                <div className="text-sm opacity-75">Business Date</div>
                <div className="font-semibold">{new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Alert Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <XCircleIcon className="h-5 w-5 text-red-500 mr-3" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-green-700">{success}</span>
            </div>
          </div>
        )}

        {/* Pending Issues */}
        {pendingIssues.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 mr-3" />
              <h3 className="text-lg font-semibold text-yellow-800">Pending Issues</h3>
            </div>
            <div className="space-y-2">
              {pendingIssues.map((issue, index) => (
                <div key={index} className="flex items-center text-yellow-700">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  {issue.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">Rs. {auditData.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupancy</p>
                <p className="text-2xl font-bold text-gray-900">{auditData.occupancyPercentage.toFixed(1)}%</p>
                <p className="text-sm text-gray-500">{auditData.occupiedRooms}/{auditData.totalRooms} rooms</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <HomeIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ADR</p>
                <p className="text-2xl font-bold text-gray-900">Rs. {auditData.adr.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Average Daily Rate</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Balance</p>
                <p className={`text-2xl font-bold ${auditData.difference === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Rs. {auditData.difference.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Payments - Charges</p>
              </div>
              <div className={`p-3 rounded-lg ${auditData.difference === 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                {auditData.difference === 0 ? 
                  <CheckCircleIcon className="h-6 w-6 text-green-600" /> :
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                }
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={runNightAudit}
            disabled={loading || auditStatus === 'completed'}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <PlayIcon className="h-5 w-5" />
            )}
            <span>{loading ? 'Running Audit...' : 'Run Night Audit'}</span>
          </button>

          <button
            onClick={() => setShowReportsModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <DocumentTextIcon className="h-5 w-5" />
            <span>View Reports</span>
          </button>

          <button 
            onClick={handleMainPrint}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <PrinterIcon className="h-5 w-5" />
            <span>Print Reports</span>
          </button>

          <button 
            onClick={handleMainExport}
            className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            <span>Export Data</span>
          </button>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Charges Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Today's Charges</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Room Revenue</span>
                  <span className="font-semibold">Rs. {auditData.roomRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Extra Services</span>
                  <span className="font-semibold">Rs. {auditData.extraRevenue.toLocaleString()}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total Charges</span>
                    <span className="font-bold text-lg">Rs. {auditData.totalCharges.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payments Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Today's Payments</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockPayments.reduce((acc, payment) => {
                  acc[payment.method] = (acc[payment.method] || 0) + payment.amount;
                  return acc;
                }, {}) && Object.entries(mockPayments.reduce((acc, payment) => {
                  acc[payment.method] = (acc[payment.method] || 0) + payment.amount;
                  return acc;
                }, {})).map(([method, amount]) => (
                  <div key={method} className="flex justify-between items-center">
                    <span className="text-gray-600">{method}</span>
                    <span className="font-semibold">Rs. {amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total Payments</span>
                    <span className="font-bold text-lg">Rs. {auditData.totalPayments.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audit History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Audit History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charges</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payments</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difference</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed By</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditHistory.map((audit) => (
                  <tr key={audit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(audit.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rs. {audit.totalCharges.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rs. {audit.totalPayments.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={audit.difference === 0 ? 'text-green-600' : 'text-red-600'}>
                        Rs. {audit.difference.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {audit.occupancyPercentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {audit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {audit.completedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reports Modal */}
      <AuditReports 
        isOpen={showReportsModal} 
        onClose={() => setShowReportsModal(false)}
        auditId={auditData.auditId}
      />
    </div>
  );
};

export default NightAudit;
