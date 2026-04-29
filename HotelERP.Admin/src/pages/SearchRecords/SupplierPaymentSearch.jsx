import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  BuildingOffice2Icon,
  FunnelIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const SupplierPaymentSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [supplierFilter, setSupplierFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [amountRange, setAmountRange] = useState({ min: '', max: '' })

  const [paymentRecords] = useState([
    {
      id: 1,
      supplierId: 'SUP-001',
      supplierName: 'ABC Food Suppliers',
      contactPerson: 'Muhammad Ahmed',
      paymentDate: '2024-01-30',
      invoiceNumber: 'INV-2024-001',
      orderNumber: 'PO-2024-001',
      invoiceAmount: 125000,
      discountAmount: 5000,
      taxAmount: 9600,
      netAmount: 129600,
      paidAmount: 129600,
      paymentMethod: 'Bank Transfer',
      bankAccount: 'ACC-789456123',
      status: 'Paid',
      paymentReference: 'PAY-SUP-2024-001',
      processedBy: 'Finance Manager',
      dueDate: '2024-02-15',
      category: 'Food & Beverage'
    },
    {
      id: 2,
      supplierId: 'SUP-002',
      supplierName: 'CleanPro Services',
      contactPerson: 'Fatima Khan',
      paymentDate: '2024-01-25',
      invoiceNumber: 'INV-2024-002',
      orderNumber: 'PO-2024-002',
      invoiceAmount: 85000,
      discountAmount: 2000,
      taxAmount: 6640,
      netAmount: 89640,
      paidAmount: 89640,
      paymentMethod: 'Cheque',
      bankAccount: 'ACC-456789012',
      status: 'Paid',
      paymentReference: 'CHQ-2024-001',
      processedBy: 'Finance Manager',
      dueDate: '2024-02-10',
      category: 'Housekeeping'
    },
    {
      id: 3,
      supplierId: 'SUP-003',
      supplierName: 'Office Mart',
      contactPerson: 'Ali Hassan',
      paymentDate: null,
      invoiceNumber: 'INV-2024-003',
      orderNumber: 'PO-2024-003',
      invoiceAmount: 45000,
      discountAmount: 1000,
      taxAmount: 3520,
      netAmount: 47520,
      paidAmount: 0,
      paymentMethod: 'Bank Transfer',
      bankAccount: 'ACC-123456789',
      status: 'Pending',
      paymentReference: null,
      processedBy: null,
      dueDate: '2024-02-20',
      category: 'Office Supplies'
    },
    {
      id: 4,
      supplierId: 'SUP-004',
      supplierName: 'Fresh Meat Co',
      contactPerson: 'Hassan Malik',
      paymentDate: '2024-01-28',
      invoiceNumber: 'INV-2024-004',
      orderNumber: 'PO-2024-004',
      invoiceAmount: 180000,
      discountAmount: 8000,
      taxAmount: 13760,
      netAmount: 185760,
      paidAmount: 100000,
      paymentMethod: 'Bank Transfer',
      bankAccount: 'ACC-111222333',
      status: 'Partial',
      paymentReference: 'PAY-SUP-2024-002',
      processedBy: 'Finance Manager',
      dueDate: '2024-02-05',
      category: 'Food & Beverage'
    },
    {
      id: 5,
      supplierId: 'SUP-005',
      supplierName: 'TechFix Solutions',
      contactPerson: 'Sara Ahmed',
      paymentDate: '2024-01-20',
      invoiceNumber: 'INV-2024-005',
      orderNumber: 'PO-2024-005',
      invoiceAmount: 25000,
      discountAmount: 0,
      taxAmount: 2000,
      netAmount: 27000,
      paidAmount: 27000,
      paymentMethod: 'Cash',
      bankAccount: null,
      status: 'Paid',
      paymentReference: 'CASH-2024-001',
      processedBy: 'Finance Manager',
      dueDate: '2024-02-01',
      category: 'Maintenance'
    }
  ])

  const suppliers = ['ABC Food Suppliers', 'CleanPro Services', 'Office Mart', 'Fresh Meat Co', 'TechFix Solutions']
  const statuses = ['Paid', 'Pending', 'Partial', 'Overdue', 'Cancelled']
  const paymentMethods = ['Bank Transfer', 'Cheque', 'Cash', 'Online Transfer']

  const filteredRecords = paymentRecords.filter(record => {
    const matchesSearch = record.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.supplierId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (record.paymentReference && record.paymentReference.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesSupplier = supplierFilter === '' || record.supplierName === supplierFilter
    const matchesStatus = statusFilter === '' || record.status === statusFilter
    const matchesPaymentMethod = paymentMethodFilter === '' || record.paymentMethod === paymentMethodFilter
    
    let matchesDateRange = true
    if (dateRange.start && dateRange.end) {
      if (record.paymentDate) {
        const paymentDate = new Date(record.paymentDate)
        const startDate = new Date(dateRange.start)
        const endDate = new Date(dateRange.end)
        matchesDateRange = paymentDate >= startDate && paymentDate <= endDate
      } else {
        matchesDateRange = false
      }
    }
    
    let matchesAmountRange = true
    if (amountRange.min || amountRange.max) {
      const min = parseFloat(amountRange.min) || 0
      const max = parseFloat(amountRange.max) || Infinity
      matchesAmountRange = record.netAmount >= min && record.netAmount <= max
    }
    
    return matchesSearch && matchesSupplier && matchesStatus && matchesPaymentMethod && matchesDateRange && matchesAmountRange
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Partial': return 'bg-orange-100 text-orange-800'
      case 'Overdue': return 'bg-red-100 text-red-800'
      case 'Cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Food & Beverage': return 'bg-blue-100 text-blue-800'
      case 'Housekeeping': return 'bg-green-100 text-green-800'
      case 'Office Supplies': return 'bg-purple-100 text-purple-800'
      case 'Maintenance': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const exportResults = () => {
    alert(`Exporting ${filteredRecords.length} supplier payment records...`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSupplierFilter('')
    setStatusFilter('')
    setPaymentMethodFilter('')
    setDateRange({ start: '', end: '' })
    setAmountRange({ min: '', max: '' })
  }

  // Calculate statistics
  const totalRecords = filteredRecords.length
  const paidRecords = filteredRecords.filter(r => r.status === 'Paid').length
  const pendingRecords = filteredRecords.filter(r => r.status === 'Pending').length
  const totalAmount = filteredRecords.reduce((sum, r) => sum + r.netAmount, 0)
  const totalPaid = filteredRecords.reduce((sum, r) => sum + r.paidAmount, 0)
  const totalOutstanding = totalAmount - totalPaid

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Supplier Payment Search</h1>
            <p className="text-indigo-100">Search and track supplier payment records and invoices</p>
          </div>
          <BuildingOffice2Icon className="h-12 w-12 text-indigo-200" />
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
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
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
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Suppliers</option>
            {suppliers.map(supplier => (
              <option key={supplier} value={supplier}>{supplier}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Payment Methods</option>
            {paymentMethods.map(method => (
              <option key={method} value={method}>{method}</option>
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
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="date"
              placeholder="To Date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Amount"
              value={amountRange.min}
              onChange={(e) => setAmountRange({...amountRange, min: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              placeholder="Max Amount"
              value={amountRange.max}
              onChange={(e) => setAmountRange({...amountRange, max: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-indigo-100 rounded-lg p-3">
              <CreditCardIcon className="h-6 w-6 text-indigo-600" />
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
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPaid)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <ClockIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOutstanding)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
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
            <h3 className="text-lg font-semibold text-gray-900">Supplier Payment Records</h3>
            <p className="text-gray-600">Found {filteredRecords.length} payment records</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <BuildingOffice2Icon className="h-4 w-4 mr-1" />
              Total: {paymentRecords.length}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Breakdown</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-indigo-100 rounded-full p-2 mr-3">
                        <BuildingOffice2Icon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.supplierName}</div>
                        <div className="text-sm text-gray-500">{record.supplierId}</div>
                        <div className="text-sm text-gray-500">{record.contactPerson}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">{record.invoiceNumber}</div>
                      <div className="text-sm text-gray-500">PO: {record.orderNumber}</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(record.category)}`}>
                        {record.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">Invoice: {formatCurrency(record.invoiceAmount)}</div>
                      {record.discountAmount > 0 && (
                        <div className="text-sm text-green-600">Discount: -{formatCurrency(record.discountAmount)}</div>
                      )}
                      <div className="text-sm text-gray-500">Tax: {formatCurrency(record.taxAmount)}</div>
                      <div className="text-sm font-medium text-gray-900">Net: {formatCurrency(record.netAmount)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        Paid: {formatCurrency(record.paidAmount)}
                      </div>
                      {record.paidAmount < record.netAmount && (
                        <div className="text-sm text-red-600">
                          Outstanding: {formatCurrency(record.netAmount - record.paidAmount)}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">{record.paymentMethod}</div>
                      {record.paymentDate && (
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarDaysIcon className="h-4 w-4 mr-1" />
                          {record.paymentDate}
                        </div>
                      )}
                      {record.paymentReference && (
                        <div className="text-sm text-gray-500">{record.paymentReference}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                    {record.processedBy && (
                      <div className="text-sm text-gray-500 mt-1">by {record.processedBy}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                      {record.dueDate}
                    </div>
                    {new Date(record.dueDate) < new Date() && record.status !== 'Paid' && (
                      <div className="text-sm text-red-600 font-medium">Overdue</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <BuildingOffice2Icon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No payment records found</h3>
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
              <div className="text-2xl font-bold text-green-600">{paidRecords}</div>
              <div className="text-sm text-gray-600">Paid Invoices</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{pendingRecords}</div>
              <div className="text-sm text-gray-600">Pending Payments</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalRecords > 0 ? ((totalPaid / totalAmount) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-gray-600">Payment Completion</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupplierPaymentSearch;
