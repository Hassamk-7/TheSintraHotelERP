import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  BuildingOffice2Icon,
  FunnelIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'

const SupplierSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [amountRange, setAmountRange] = useState({ min: '', max: '' })

  const [suppliers] = useState([
    {
      id: 1,
      name: 'ABC Food Suppliers',
      contactPerson: 'Muhammad Ahmed',
      email: 'ahmed@abcfood.com',
      phone: '+92-21-1234567',
      address: '123 Market Street, Saddar',
      city: 'Karachi',
      category: 'Food & Beverage',
      paymentTerms: '30 days',
      taxId: 'NTN-1234567',
      bankAccount: 'ACC-789456123',
      status: 'Active',
      totalOrders: 25,
      totalAmount: 450000,
      lastOrderDate: '2024-01-15',
      rating: 4.5,
      contractStart: '2023-01-01',
      contractEnd: '2024-12-31'
    },
    {
      id: 2,
      name: 'CleanPro Services',
      contactPerson: 'Fatima Khan',
      email: 'fatima@cleanpro.com',
      phone: '+92-21-2345678',
      address: '456 Industrial Area',
      city: 'Karachi',
      category: 'Housekeeping',
      paymentTerms: '15 days',
      taxId: 'NTN-2345678',
      bankAccount: 'ACC-456789012',
      status: 'Active',
      totalOrders: 18,
      totalAmount: 280000,
      lastOrderDate: '2024-01-12',
      rating: 4.2,
      contractStart: '2023-03-01',
      contractEnd: '2024-12-31'
    },
    {
      id: 3,
      name: 'Office Mart',
      contactPerson: 'Ali Hassan',
      email: 'ali@officemart.com',
      phone: '+92-21-3456789',
      address: '789 Commercial Plaza',
      city: 'Karachi',
      category: 'Office Supplies',
      paymentTerms: '45 days',
      taxId: 'NTN-3456789',
      bankAccount: 'ACC-123456789',
      status: 'Active',
      totalOrders: 12,
      totalAmount: 150000,
      lastOrderDate: '2024-01-10',
      rating: 3.8,
      contractStart: '2023-06-01',
      contractEnd: '2024-12-31'
    },
    {
      id: 4,
      name: 'Fresh Meat Co',
      contactPerson: 'Hassan Malik',
      email: 'hassan@freshmeat.com',
      phone: '+92-42-1111111',
      address: '321 Food Street',
      city: 'Lahore',
      category: 'Food & Beverage',
      paymentTerms: '7 days',
      taxId: 'NTN-4444444',
      bankAccount: 'ACC-111222333',
      status: 'Active',
      totalOrders: 35,
      totalAmount: 650000,
      lastOrderDate: '2024-01-16',
      rating: 4.8,
      contractStart: '2022-01-01',
      contractEnd: '2024-12-31'
    },
    {
      id: 5,
      name: 'TechFix Solutions',
      contactPerson: 'Sara Ahmed',
      email: 'sara@techfix.com',
      phone: '+92-51-5555555',
      address: '555 Tech Plaza',
      city: 'Islamabad',
      category: 'Maintenance',
      paymentTerms: '30 days',
      taxId: 'NTN-5555555',
      bankAccount: 'ACC-555666777',
      status: 'Inactive',
      totalOrders: 8,
      totalAmount: 95000,
      lastOrderDate: '2023-12-20',
      rating: 3.5,
      contractStart: '2023-01-01',
      contractEnd: '2023-12-31'
    }
  ])

  const categories = ['Food & Beverage', 'Housekeeping', 'Office Supplies', 'Maintenance', 'Utilities']
  const statuses = ['Active', 'Inactive', 'Pending', 'Suspended']
  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad']

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.phone.includes(searchTerm) ||
                         supplier.taxId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === '' || supplier.category === categoryFilter
    const matchesStatus = statusFilter === '' || supplier.status === statusFilter
    const matchesCity = cityFilter === '' || supplier.city === cityFilter
    
    let matchesAmountRange = true
    if (amountRange.min || amountRange.max) {
      const min = parseFloat(amountRange.min) || 0
      const max = parseFloat(amountRange.max) || Infinity
      matchesAmountRange = supplier.totalAmount >= min && supplier.totalAmount <= max
    }
    
    return matchesSearch && matchesCategory && matchesStatus && matchesCity && matchesAmountRange
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-red-100 text-red-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Suspended': return 'bg-gray-100 text-gray-800'
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

  const getRatingStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))
  }

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

  const exportResults = () => {
    alert(`Exporting ${filteredSuppliers.length} supplier records...`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setCategoryFilter('')
    setStatusFilter('')
    setCityFilter('')
    setAmountRange({ min: '', max: '' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Supplier Search</h1>
            <p className="text-purple-100">Search and filter supplier records with advanced criteria</p>
          </div>
          <BuildingOffice2Icon className="h-12 w-12 text-purple-200" />
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
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
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
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Amount"
              value={amountRange.min}
              onChange={(e) => setAmountRange({...amountRange, min: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="number"
              placeholder="Max Amount"
              value={amountRange.max}
              onChange={(e) => setAmountRange({...amountRange, max: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
            <p className="text-gray-600">Found {filteredSuppliers.length} suppliers matching your criteria</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <BuildingOffice2Icon className="h-4 w-4 mr-1" />
              Total: {suppliers.length}
            </div>
            <div className="flex items-center">
              <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
              Filtered: {filteredSuppliers.length}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-purple-100 rounded-full p-2 mr-3">
                        <BuildingOffice2Icon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                        <div className="text-sm text-gray-500">{supplier.contactPerson}</div>
                        <div className="text-sm text-gray-500">Tax ID: {supplier.taxId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {supplier.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {supplier.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(supplier.category)}`}>
                      {supplier.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{supplier.city}</div>
                    <div className="text-sm text-gray-500">{supplier.address}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{supplier.totalOrders}</div>
                    <div className="text-sm text-gray-500">Last: {supplier.lastOrderDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <BanknotesIcon className="h-4 w-4 text-gray-400 mr-1" />
                      {formatCurrency(supplier.totalAmount)}
                    </div>
                    <div className="text-sm text-gray-500">Terms: {supplier.paymentTerms}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-yellow-600">{getRatingStars(supplier.rating)}</div>
                    <div className="text-sm text-gray-500">{supplier.rating}/5.0</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(supplier.status)}`}>
                      {supplier.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSuppliers.length === 0 && (
          <div className="text-center py-12">
            <BuildingOffice2Icon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No suppliers found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search criteria or clearing the filters.
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {filteredSuppliers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {filteredSuppliers.filter(s => s.status === 'Active').length}
              </div>
              <div className="text-sm text-gray-600">Active Suppliers</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(filteredSuppliers.reduce((sum, s) => sum + s.totalAmount, 0))}
              </div>
              <div className="text-sm text-gray-600">Total Purchase Value</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredSuppliers.reduce((sum, s) => sum + s.totalOrders, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {(filteredSuppliers.reduce((sum, s) => sum + s.rating, 0) / filteredSuppliers.length).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupplierSearch;
