import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ArchiveBoxIcon,
  FunnelIcon,
  DocumentTextIcon,
  PrinterIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const PurchasedInventoryReport = () => {
  const [filters, setFilters] = useState({
    category: '',
    supplier: '',
    status: '',
    dateRange: { start: '', end: '' },
    amountRange: { min: '', max: '' }
  })

  const [inventoryPurchases] = useState([
    {
      id: 1,
      purchaseId: 'PUR-2024-001',
      purchaseDate: '2024-01-15',
      supplier: 'ABC Food Suppliers',
      category: 'Food Items',
      itemName: 'Basmati Rice Premium',
      quantity: 50,
      unit: 'kg',
      unitPrice: 180,
      totalAmount: 9000,
      deliveryDate: '2024-01-17',
      receivedDate: '2024-01-17',
      receivedQuantity: 50,
      status: 'Delivered',
      qualityCheck: 'Passed',
      invoiceNumber: 'INV-ABC-001',
      paymentStatus: 'Paid',
      paymentDate: '2024-01-20',
      expiryDate: '2024-07-15',
      storageLocation: 'Dry Storage A',
      orderedBy: 'Kitchen Manager',
      receivedBy: 'Store Keeper'
    },
    {
      id: 2,
      purchaseId: 'PUR-2024-002',
      purchaseDate: '2024-01-18',
      supplier: 'Fresh Vegetables Co',
      category: 'Vegetables',
      itemName: 'Fresh Tomatoes',
      quantity: 25,
      unit: 'kg',
      unitPrice: 120,
      totalAmount: 3000,
      deliveryDate: '2024-01-19',
      receivedDate: '2024-01-19',
      receivedQuantity: 23,
      status: 'Partial Delivery',
      qualityCheck: 'Passed',
      invoiceNumber: 'INV-FVC-002',
      paymentStatus: 'Pending',
      paymentDate: null,
      expiryDate: '2024-01-25',
      storageLocation: 'Cold Storage',
      orderedBy: 'Chef',
      receivedBy: 'Kitchen Staff'
    },
    {
      id: 3,
      purchaseId: 'PUR-2024-003',
      purchaseDate: '2024-01-20',
      supplier: 'CleanPro Supplies',
      category: 'Cleaning Supplies',
      itemName: 'Floor Cleaner Industrial',
      quantity: 12,
      unit: 'bottles',
      unitPrice: 450,
      totalAmount: 5400,
      deliveryDate: '2024-01-22',
      receivedDate: null,
      receivedQuantity: 0,
      status: 'Pending Delivery',
      qualityCheck: 'Pending',
      invoiceNumber: 'INV-CPS-003',
      paymentStatus: 'Advance Paid',
      paymentDate: '2024-01-20',
      expiryDate: '2025-01-20',
      storageLocation: 'Utility Room',
      orderedBy: 'Housekeeping Manager',
      receivedBy: null
    },
    {
      id: 4,
      purchaseId: 'PUR-2024-004',
      purchaseDate: '2024-01-12',
      supplier: 'Dairy Fresh Ltd',
      category: 'Dairy Products',
      itemName: 'Fresh Milk',
      quantity: 100,
      unit: 'liters',
      unitPrice: 85,
      totalAmount: 8500,
      deliveryDate: '2024-01-13',
      receivedDate: '2024-01-13',
      receivedQuantity: 95,
      status: 'Delivered',
      qualityCheck: 'Failed',
      invoiceNumber: 'INV-DFL-004',
      paymentStatus: 'Disputed',
      paymentDate: null,
      expiryDate: '2024-01-15',
      storageLocation: 'Refrigerator',
      orderedBy: 'Kitchen Manager',
      receivedBy: 'Kitchen Staff'
    },
    {
      id: 5,
      purchaseId: 'PUR-2024-005',
      purchaseDate: '2024-01-21',
      supplier: 'Office Supplies Pro',
      category: 'Office Supplies',
      itemName: 'A4 Paper Reams',
      quantity: 20,
      unit: 'reams',
      unitPrice: 350,
      totalAmount: 7000,
      deliveryDate: '2024-01-23',
      receivedDate: '2024-01-23',
      receivedQuantity: 20,
      status: 'Delivered',
      qualityCheck: 'Passed',
      invoiceNumber: 'INV-OSP-005',
      paymentStatus: 'Paid',
      paymentDate: '2024-01-25',
      expiryDate: null,
      storageLocation: 'Office Storage',
      orderedBy: 'Admin Manager',
      receivedBy: 'Office Assistant'
    }
  ])

  const categories = ['All Categories', 'Food Items', 'Vegetables', 'Dairy Products', 'Cleaning Supplies', 'Office Supplies', 'Beverages']
  const suppliers = ['All Suppliers', 'ABC Food Suppliers', 'Fresh Vegetables Co', 'CleanPro Supplies', 'Dairy Fresh Ltd', 'Office Supplies Pro']
  const statuses = ['All Status', 'Delivered', 'Partial Delivery', 'Pending Delivery', 'Cancelled', 'Returned']

  const filteredPurchases = inventoryPurchases.filter(purchase => {
    const matchesCategory = filters.category === '' || filters.category === 'All Categories' || purchase.category === filters.category
    const matchesSupplier = filters.supplier === '' || filters.supplier === 'All Suppliers' || purchase.supplier === filters.supplier
    const matchesStatus = filters.status === '' || filters.status === 'All Status' || purchase.status === filters.status
    
    let matchesDateRange = true
    if (filters.dateRange.start && filters.dateRange.end) {
      const purchaseDate = new Date(purchase.purchaseDate)
      const startDate = new Date(filters.dateRange.start)
      const endDate = new Date(filters.dateRange.end)
      matchesDateRange = purchaseDate >= startDate && purchaseDate <= endDate
    }
    
    let matchesAmountRange = true
    if (filters.amountRange.min || filters.amountRange.max) {
      const min = parseFloat(filters.amountRange.min) || 0
      const max = parseFloat(filters.amountRange.max) || Infinity
      matchesAmountRange = purchase.totalAmount >= min && purchase.totalAmount <= max
    }

    return matchesCategory && matchesSupplier && matchesStatus && matchesDateRange && matchesAmountRange
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800'
      case 'Partial Delivery': return 'bg-yellow-100 text-yellow-800'
      case 'Pending Delivery': return 'bg-blue-100 text-blue-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      case 'Returned': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Advance Paid': return 'bg-blue-100 text-blue-800'
      case 'Disputed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getQualityCheckColor = (status) => {
    switch (status) {
      case 'Passed': return 'bg-green-100 text-green-800'
      case 'Failed': return 'bg-red-100 text-red-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Food Items': return 'bg-orange-100 text-orange-800'
      case 'Vegetables': return 'bg-green-100 text-green-800'
      case 'Dairy Products': return 'bg-blue-100 text-blue-800'
      case 'Cleaning Supplies': return 'bg-purple-100 text-purple-800'
      case 'Office Supplies': return 'bg-gray-100 text-gray-800'
      case 'Beverages': return 'bg-cyan-100 text-cyan-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const exportReport = () => {
    alert(`Exporting purchased inventory report with ${filteredPurchases.length} records...`)
  }

  const printReport = () => {
    window.print()
  }

  // Calculate statistics
  const totalPurchases = filteredPurchases.length
  const totalAmount = filteredPurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0)
  const deliveredPurchases = filteredPurchases.filter(p => p.status === 'Delivered').length
  const pendingPurchases = filteredPurchases.filter(p => p.status === 'Pending Delivery').length
  const paidAmount = filteredPurchases.filter(p => p.paymentStatus === 'Paid').reduce((sum, p) => sum + p.totalAmount, 0)
  const pendingPayments = filteredPurchases.filter(p => p.paymentStatus === 'Pending').reduce((sum, p) => sum + p.totalAmount, 0)
  const qualityIssues = filteredPurchases.filter(p => p.qualityCheck === 'Failed').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-green-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Purchased Inventory Report</h1>
            <p className="text-teal-100">Track inventory purchases, deliveries, and payment status</p>
          </div>
          <ArchiveBoxIcon className="h-12 w-12 text-teal-200" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Report Filters
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={printReport}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </button>
            <button
              onClick={exportReport}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {categories.map(category => (
                <option key={category} value={category === 'All Categories' ? '' : category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
            <select
              value={filters.supplier}
              onChange={(e) => setFilters({...filters, supplier: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {suppliers.map(supplier => (
                <option key={supplier} value={supplier === 'All Suppliers' ? '' : supplier}>{supplier}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {statuses.map(status => (
                <option key={status} value={status === 'All Status' ? '' : status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, start: e.target.value}})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, end: e.target.value}})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-teal-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <TruckIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">{deliveredPurchases}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <ArchiveBoxIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingPurchases}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Quality Issues</p>
              <p className="text-2xl font-bold text-gray-900">{qualityIssues}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Purchase Records ({filteredPurchases.length} records)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item & Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality & Storage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personnel</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{purchase.purchaseId}</div>
                      <div className="text-sm text-gray-500">Date: {purchase.purchaseDate}</div>
                      <div className="text-sm text-gray-500">{purchase.supplier}</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(purchase.category)}`}>
                        {purchase.category}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">Invoice: {purchase.invoiceNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">{purchase.itemName}</div>
                      <div className="text-sm text-gray-500">
                        Ordered: {purchase.quantity} {purchase.unit}
                      </div>
                      <div className="text-sm text-gray-500">
                        Unit Price: {formatCurrency(purchase.unitPrice)}
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        Total: {formatCurrency(purchase.totalAmount)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(purchase.status)}`}>
                        {purchase.status}
                      </span>
                      <div className="text-sm text-gray-500">
                        Expected: {purchase.deliveryDate}
                      </div>
                      {purchase.receivedDate && (
                        <div className="text-sm text-green-600">
                          Received: {purchase.receivedDate}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        Received: {purchase.receivedQuantity} {purchase.unit}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getQualityCheckColor(purchase.qualityCheck)}`}>
                        {purchase.qualityCheck}
                      </span>
                      <div className="text-sm text-gray-500">
                        Storage: {purchase.storageLocation}
                      </div>
                      {purchase.expiryDate && (
                        <div className="text-sm text-orange-600">
                          Expires: {purchase.expiryDate}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(purchase.paymentStatus)}`}>
                        {purchase.paymentStatus}
                      </span>
                      {purchase.paymentDate && (
                        <div className="text-sm text-green-600">
                          Paid: {purchase.paymentDate}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        Ordered: {purchase.orderedBy}
                      </div>
                      {purchase.receivedBy && (
                        <div className="text-sm text-gray-500">
                          Received: {purchase.receivedBy}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPurchases.length === 0 && (
          <div className="text-center py-12">
            <ArchiveBoxIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No purchase records found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      {filteredPurchases.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Purchase Value:</span>
                <span className="font-medium text-green-600">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-medium">{formatCurrency(paidAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Payments:</span>
                <span className="font-medium text-red-600">{formatCurrency(pendingPayments)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Purchase Value:</span>
                <span className="font-medium">{formatCurrency(totalAmount/totalPurchases)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Success Rate:</span>
                <span className="font-medium">{((deliveredPurchases/totalPurchases)*100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quality Pass Rate:</span>
                <span className="font-medium">{(((totalPurchases-qualityIssues)/totalPurchases)*100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Deliveries:</span>
                <span className="font-medium text-blue-600">{pendingPurchases}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quality Issues:</span>
                <span className="font-medium text-red-600">{qualityIssues}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PurchasedInventoryReport;
