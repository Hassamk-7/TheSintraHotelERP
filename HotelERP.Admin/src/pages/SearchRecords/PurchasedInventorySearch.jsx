import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  CubeIcon,
  FunnelIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  BuildingOffice2Icon,
  TruckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const PurchasedInventorySearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [supplierFilter, setSupplierFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [amountRange, setAmountRange] = useState({ min: '', max: '' })

  const [inventoryRecords] = useState([
    {
      id: 1,
      purchaseOrderId: 'PO-2024-001',
      invoiceNumber: 'INV-2024-001',
      supplierName: 'ABC Food Suppliers',
      purchaseDate: '2024-01-15',
      deliveryDate: '2024-01-16',
      category: 'Food & Beverage',
      items: [
        { name: 'Rice (Basmati)', quantity: 50, unit: 'kg', rate: 180, amount: 9000 },
        { name: 'Chicken (Fresh)', quantity: 25, unit: 'kg', rate: 450, amount: 11250 },
        { name: 'Cooking Oil', quantity: 10, unit: 'ltr', rate: 320, amount: 3200 }
      ],
      totalQuantity: 85,
      subtotal: 23450,
      discount: 1000,
      tax: 1796,
      totalAmount: 24246,
      paymentStatus: 'Paid',
      deliveryStatus: 'Delivered',
      receivedBy: 'Store Manager',
      status: 'Completed',
      remarks: 'Good quality items received'
    },
    {
      id: 2,
      purchaseOrderId: 'PO-2024-002',
      invoiceNumber: 'INV-2024-002',
      supplierName: 'CleanPro Services',
      purchaseDate: '2024-01-12',
      deliveryDate: '2024-01-14',
      category: 'Housekeeping',
      items: [
        { name: 'Toilet Paper', quantity: 100, unit: 'rolls', rate: 85, amount: 8500 },
        { name: 'Detergent', quantity: 20, unit: 'kg', rate: 250, amount: 5000 },
        { name: 'Floor Cleaner', quantity: 15, unit: 'ltr', rate: 180, amount: 2700 }
      ],
      totalQuantity: 135,
      subtotal: 16200,
      discount: 500,
      tax: 1256,
      totalAmount: 16956,
      paymentStatus: 'Paid',
      deliveryStatus: 'Delivered',
      receivedBy: 'Housekeeping Supervisor',
      status: 'Completed',
      remarks: 'All items in good condition'
    },
    {
      id: 3,
      purchaseOrderId: 'PO-2024-003',
      invoiceNumber: 'INV-2024-003',
      supplierName: 'Office Mart',
      purchaseDate: '2024-01-10',
      deliveryDate: '2024-01-12',
      category: 'Office Supplies',
      items: [
        { name: 'A4 Paper', quantity: 20, unit: 'reams', rate: 450, amount: 9000 },
        { name: 'Printer Ink', quantity: 12, unit: 'cartridges', rate: 800, amount: 9600 },
        { name: 'Pens', quantity: 50, unit: 'pcs', rate: 25, amount: 1250 }
      ],
      totalQuantity: 82,
      subtotal: 19850,
      discount: 850,
      tax: 1520,
      totalAmount: 20520,
      paymentStatus: 'Pending',
      deliveryStatus: 'Delivered',
      receivedBy: 'Admin Officer',
      status: 'Pending Payment',
      remarks: 'Payment due in 15 days'
    },
    {
      id: 4,
      purchaseOrderId: 'PO-2024-004',
      invoiceNumber: 'INV-2024-004',
      supplierName: 'Fresh Meat Co',
      purchaseDate: '2024-01-18',
      deliveryDate: '2024-01-19',
      category: 'Food & Beverage',
      items: [
        { name: 'Beef (Premium)', quantity: 30, unit: 'kg', rate: 1200, amount: 36000 },
        { name: 'Mutton', quantity: 20, unit: 'kg', rate: 1500, amount: 30000 },
        { name: 'Fish (Fresh)', quantity: 15, unit: 'kg', rate: 800, amount: 12000 }
      ],
      totalQuantity: 65,
      subtotal: 78000,
      discount: 3000,
      tax: 6000,
      totalAmount: 81000,
      paymentStatus: 'Partial',
      deliveryStatus: 'Delivered',
      receivedBy: 'Head Chef',
      status: 'Partial Payment',
      remarks: 'Excellent quality meat'
    },
    {
      id: 5,
      purchaseOrderId: 'PO-2024-005',
      invoiceNumber: 'INV-2024-005',
      supplierName: 'TechFix Solutions',
      purchaseDate: '2024-01-20',
      deliveryDate: null,
      category: 'Maintenance',
      items: [
        { name: 'Air Filter', quantity: 8, unit: 'pcs', rate: 450, amount: 3600 },
        { name: 'Electrical Wire', quantity: 100, unit: 'meters', rate: 35, amount: 3500 },
        { name: 'Tools Set', quantity: 2, unit: 'sets', rate: 2500, amount: 5000 }
      ],
      totalQuantity: 110,
      subtotal: 12100,
      discount: 100,
      tax: 960,
      totalAmount: 12960,
      paymentStatus: 'Unpaid',
      deliveryStatus: 'Pending',
      receivedBy: null,
      status: 'Pending Delivery',
      remarks: 'Delivery scheduled for next week'
    }
  ])

  const categories = ['Food & Beverage', 'Housekeeping', 'Office Supplies', 'Maintenance', 'Utilities']
  const suppliers = ['ABC Food Suppliers', 'CleanPro Services', 'Office Mart', 'Fresh Meat Co', 'TechFix Solutions']
  const statuses = ['Completed', 'Pending Payment', 'Partial Payment', 'Pending Delivery', 'Cancelled']

  const filteredRecords = inventoryRecords.filter(record => {
    const matchesSearch = record.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.purchaseOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = categoryFilter === '' || record.category === categoryFilter
    const matchesSupplier = supplierFilter === '' || record.supplierName === supplierFilter
    const matchesStatus = statusFilter === '' || record.status === statusFilter
    
    let matchesDateRange = true
    if (dateRange.start && dateRange.end) {
      const purchaseDate = new Date(record.purchaseDate)
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      matchesDateRange = purchaseDate >= startDate && purchaseDate <= endDate
    }
    
    let matchesAmountRange = true
    if (amountRange.min || amountRange.max) {
      const min = parseFloat(amountRange.min) || 0
      const max = parseFloat(amountRange.max) || Infinity
      matchesAmountRange = record.totalAmount >= min && record.totalAmount <= max
    }
    
    return matchesSearch && matchesCategory && matchesSupplier && matchesStatus && matchesDateRange && matchesAmountRange
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Pending Payment': return 'bg-yellow-100 text-yellow-800'
      case 'Partial Payment': return 'bg-orange-100 text-orange-800'
      case 'Pending Delivery': return 'bg-blue-100 text-blue-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'Paid': return 'bg-green-100 text-green-800'
      case 'Partial': return 'bg-orange-100 text-orange-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Unpaid': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDeliveryStatusColor = (deliveryStatus) => {
    switch (deliveryStatus) {
      case 'Delivered': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'In Transit': return 'bg-blue-100 text-blue-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Food & Beverage': return 'bg-blue-100 text-blue-800'
      case 'Housekeeping': return 'bg-green-100 text-green-800'
      case 'Office Supplies': return 'bg-purple-100 text-purple-800'
      case 'Maintenance': return 'bg-orange-100 text-orange-800'
      case 'Utilities': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const exportResults = () => {
    alert(`Exporting ${filteredRecords.length} purchased inventory records...`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setCategoryFilter('')
    setSupplierFilter('')
    setStatusFilter('')
    setDateRange({ start: '', end: '' })
    setAmountRange({ min: '', max: '' })
  }

  // Calculate statistics
  const totalRecords = filteredRecords.length
  const completedPurchases = filteredRecords.filter(r => r.status === 'Completed').length
  const pendingDeliveries = filteredRecords.filter(r => r.status === 'Pending Delivery').length
  const totalAmount = filteredRecords.reduce((sum, r) => sum + r.totalAmount, 0)
  const totalDiscount = filteredRecords.reduce((sum, r) => sum + r.discount, 0)
  const totalTax = filteredRecords.reduce((sum, r) => sum + r.tax, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Purchased Inventory Search</h1>
            <p className="text-green-100">Search and track purchased inventory records and deliveries</p>
          </div>
          <CubeIcon className="h-12 w-12 text-green-200" />
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Search Filters
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={exportResults}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Export Results
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Suppliers</option>
            {suppliers.map(supplier => (
              <option key={supplier} value={supplier}>{supplier}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex space-x-2">
            <input
              type="date"
              placeholder="From Date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="date"
              placeholder="To Date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Amount"
              value={amountRange.min}
              onChange={(e) => setAmountRange({...amountRange, min: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              placeholder="Max Amount"
              value={amountRange.max}
              onChange={(e) => setAmountRange({...amountRange, max: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CubeIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedPurchases}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <TruckIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Delivery</p>
              <p className="text-2xl font-bold text-gray-900">{pendingDeliveries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <DocumentTextIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Purchased Inventory Records</h3>
            <p className="text-gray-600">Found {filteredRecords.length} purchase records</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <CubeIcon className="h-4 w-4 mr-1" />
              Total: {inventoryRecords.length}
            </div>
            <div className="flex items-center">
              <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
              Filtered: {filteredRecords.length}
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items Purchased</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Breakdown</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">{record.purchaseOrderId}</div>
                      <div className="text-sm text-gray-500">Invoice: {record.invoiceNumber}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {record.purchaseDate}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(record.category)}`}>
                        {record.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-full p-2 mr-3">
                        <BuildingOffice2Icon className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.supplierName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {record.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="text-sm text-gray-900">
                          {item.quantity} {item.unit} {item.name} - {formatCurrency(item.amount)}
                        </div>
                      ))}
                      {record.items.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{record.items.length - 3} more items
                        </div>
                      )}
                      <div className="text-sm text-gray-500 font-medium">
                        Total Qty: {record.totalQuantity}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">Subtotal: {formatCurrency(record.subtotal)}</div>
                      <div className="text-sm text-green-600">Discount: -{formatCurrency(record.discount)}</div>
                      <div className="text-sm text-gray-500">Tax: {formatCurrency(record.tax)}</div>
                      <div className="text-sm font-medium text-gray-900 border-t pt-1">
                        Total: {formatCurrency(record.totalAmount)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {record.deliveryDate ? (
                        <div className="text-sm text-gray-900">
                          Delivered: {record.deliveryDate}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Pending delivery
                        </div>
                      )}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDeliveryStatusColor(record.deliveryStatus)}`}>
                        {record.deliveryStatus}
                      </span>
                      {record.receivedBy && (
                        <div className="text-sm text-gray-500">
                          Received by: {record.receivedBy}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(record.paymentStatus)}`}>
                        {record.paymentStatus}
                      </span>
                      {record.remarks && (
                        <div className="text-sm text-blue-600">
                          {record.remarks}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No inventory records found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search criteria or date range.
            </p>
          </div>
        )}
      </div>

      {/* Additional Stats */}
      {filteredRecords.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalDiscount)}</div>
              <div className="text-sm text-gray-600">Total Discounts</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalTax)}</div>
              <div className="text-sm text-gray-600">Total Tax Paid</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {totalRecords > 0 ? formatCurrency(totalAmount / totalRecords) : formatCurrency(0)}
              </div>
              <div className="text-sm text-gray-600">Average Purchase Value</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PurchasedInventorySearch;
