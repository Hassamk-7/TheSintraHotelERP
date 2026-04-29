import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  BuildingOffice2Icon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

const Suppliers = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    category: 'Food & Beverage',
    paymentTerms: '30 days',
    taxId: '',
    bankAccount: '',
    status: 'Active',
    isActive: true
  })

  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: 'Metro Cash & Carry',
      contactPerson: 'Ahmed Khan',
      email: 'ahmed@metro.pk',
      phone: '+92-21-1234567',
      address: 'Main Boulevard, Gulberg',
      city: 'Lahore',
      category: 'Food & Beverage',
      paymentTerms: '30 days',
      taxId: 'NTN-1234567',
      bankAccount: 'HBL-12345678',
      status: 'Active',
      isActive: true,
      totalOrders: 45,
      totalAmount: 850000
    },
    {
      id: 2,
      name: 'Unilever Pakistan',
      contactPerson: 'Fatima Ali',
      email: 'fatima@unilever.pk',
      phone: '+92-21-2345678',
      address: 'Industrial Area, SITE',
      city: 'Karachi',
      category: 'Housekeeping',
      paymentTerms: '45 days',
      taxId: 'NTN-2345678',
      bankAccount: 'UBL-23456789',
      status: 'Active',
      isActive: true,
      totalOrders: 32,
      totalAmount: 650000
    },
    {
      id: 3,
      name: 'Gourmet Foods Ltd',
      contactPerson: 'Ali Raza',
      email: 'ali@gourmet.pk',
      phone: '+92-42-3456789',
      address: 'Food Street, MM Alam Road',
      city: 'Lahore',
      category: 'Food & Beverage',
      paymentTerms: '15 days',
      taxId: 'NTN-3456789',
      bankAccount: 'MCB-34567890',
      status: 'Active',
      isActive: true,
      totalOrders: 28,
      totalAmount: 420000
    },
    {
      id: 4,
      name: 'Pak Textiles',
      contactPerson: 'Sara Sheikh',
      email: 'sara@paktextiles.pk',
      phone: '+92-42-4567890',
      address: 'Textile City, Faisalabad Road',
      city: 'Faisalabad',
      category: 'Housekeeping',
      paymentTerms: '30 days',
      taxId: 'NTN-4567890',
      bankAccount: 'ABL-45678901',
      status: 'Active',
      isActive: true,
      totalOrders: 15,
      totalAmount: 280000
    },
    {
      id: 5,
      name: 'Office Depot Pakistan',
      contactPerson: 'Zubair Hussain',
      email: 'zubair@officedepot.pk',
      phone: '+92-51-5678901',
      address: 'Blue Area, F-6',
      city: 'Islamabad',
      category: 'Office Supplies',
      paymentTerms: '30 days',
      taxId: 'NTN-5678901',
      bankAccount: 'NBP-56789012',
      status: 'Active',
      isActive: true,
      totalOrders: 22,
      totalAmount: 180000
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load suppliers on component mount
  useEffect(() => {
    // API calls disabled to show mock data
    console.log('Suppliers component loaded with mock data:', suppliers.length, 'suppliers')
  }, [])

  // Fetch suppliers from API
  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/Inventory/suppliers')
      if (response.data.success) {
        setSuppliers(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching suppliers:', err)
      setError('Failed to load suppliers')
      // Set mock data if API fails
      setSuppliers([
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
      isActive: true
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
      isActive: true
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
      isActive: true
    }
      ])
      setError('')
    } finally {
      setLoading(false)
    }
  }

  const categories = ['Food & Beverage', 'Housekeeping', 'Office Supplies', 'Maintenance', 'Utilities']
  const paymentTermsOptions = ['15 days', '30 days', '45 days', '60 days', 'Cash on Delivery']
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Supplier name is required'
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingId) {
        setSuppliers(prev => prev.map(supplier => 
          supplier.id === editingId 
            ? { ...formData, id: editingId, totalOrders: supplier.totalOrders, totalAmount: supplier.totalAmount }
            : supplier
        ))
      } else {
        const newSupplier = {
          ...formData,
          id: Date.now(),
          totalOrders: 0,
          totalAmount: 0
        }
        setSuppliers(prev => [...prev, newSupplier])
      }
      
      handleCancel()
      alert(editingId ? 'Supplier updated!' : 'Supplier added!')
    } catch (error) {
      alert('Error saving supplier.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (supplier) => {
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      city: supplier.city,
      category: supplier.category,
      paymentTerms: supplier.paymentTerms,
      taxId: supplier.taxId,
      bankAccount: supplier.bankAccount,
      status: supplier.status,
      isActive: supplier.isActive
    })
    setEditingId(supplier.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this supplier?')) {
      setSuppliers(prev => prev.filter(supplier => supplier.id !== id))
      alert('Supplier deleted!')
    }
  }

  const handleCancel = () => {
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      category: 'Food & Beverage',
      paymentTerms: '30 days',
      taxId: '',
      bankAccount: '',
      status: 'Active',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === '' || supplier.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-red-100 text-red-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
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

  const totalSuppliers = suppliers.length
  const activeSuppliers = suppliers.filter(s => s.status === 'Active').length
  const totalPurchaseValue = suppliers.reduce((sum, s) => sum + s.totalAmount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Suppliers</h1>
            <p className="text-purple-100">Manage supplier information and relationships</p>
          </div>
          <BuildingOffice2Icon className="h-12 w-12 text-purple-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <BuildingOffice2Icon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{totalSuppliers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{activeSuppliers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-indigo-100 rounded-lg p-3">
              <BuildingOffice2Icon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Purchase Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPurchaseValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Supplier
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Supplier' : 'Add New Supplier'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Supplier Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ABC Food Suppliers"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.contactPerson ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Muhammad Ahmed"
                />
                {errors.contactPerson && <p className="mt-1 text-sm text-red-600">{errors.contactPerson}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ahmed@abcfood.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+92-21-1234567"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123 Market Street, Saddar"
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Karachi"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Terms</label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {paymentTermsOptions.map(term => (
                    <option key={term} value={term}>{term}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tax ID</label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="NTN-1234567"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Account</label>
                <input
                  type="text"
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({...formData, bankAccount: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="ACC-789456123"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    {editingId ? 'Update' : 'Add'} Supplier
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Suppliers List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Suppliers ({filteredSuppliers.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                      <div className="text-sm text-gray-500">{supplier.contactPerson}</div>
                      <div className="text-sm text-gray-500">{supplier.address}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{supplier.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{supplier.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(supplier.category)}`}>
                      {supplier.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{supplier.totalOrders} orders</div>
                    <div className="text-sm text-gray-500">{formatCurrency(supplier.totalAmount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(supplier.status)}`}>
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(supplier)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Suppliers;
