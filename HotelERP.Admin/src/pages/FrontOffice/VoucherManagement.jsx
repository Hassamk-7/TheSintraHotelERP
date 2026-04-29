import React, { useState, useEffect } from 'react';
import { 
  Ticket, Plus, Search, Edit2, Trash2, X, Calendar, DollarSign, 
  Tag, AlertCircle, CheckCircle, Clock, TrendingDown, Filter
} from 'lucide-react';
import axios from 'axios';
import { apiConfig } from '../../config/api';

const API_URL = apiConfig.baseURL;

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    voucherName: '',
    description: '',
    roomTypeId: '',
    startDate: '',
    endDate: '',
    discountAmount: '',
    discountType: 'Fixed',
    discountPercentage: '',
    minimumAmount: '',
    maximumDiscount: '',
    maxUsageCount: '',
    approvedBy: '',
    terms: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchVouchers();
    fetchRoomTypes();
  }, [statusFilter]);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await axios.get(`${API_URL}/vouchers`, { params });
      
      if (response.data && response.data.success) {
        setVouchers(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching vouchers:', err);
      setError('Failed to load vouchers');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get(`${API_URL}/vouchers/room-types`);
      if (response.data && response.data.success) {
        setRoomTypes(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching room types:', err);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.voucherName.trim()) newErrors.voucherName = 'Voucher name is required';
    if (!formData.roomTypeId) newErrors.roomTypeId = 'Room type is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (!formData.discountAmount || parseFloat(formData.discountAmount) <= 0) {
      newErrors.discountAmount = 'Discount amount must be greater than 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const voucherData = {
        voucherName: formData.voucherName,
        description: formData.description || '',
        roomTypeId: parseInt(formData.roomTypeId),
        startDate: formData.startDate,
        endDate: formData.endDate,
        discountAmount: parseFloat(formData.discountAmount),
        discountType: formData.discountType,
        discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : null,
        minimumAmount: formData.minimumAmount ? parseFloat(formData.minimumAmount) : null,
        maximumDiscount: formData.maximumDiscount ? parseFloat(formData.maximumDiscount) : null,
        maxUsageCount: formData.maxUsageCount ? parseInt(formData.maxUsageCount) : null,
        approvedBy: formData.approvedBy || '',
        terms: formData.terms || ''
      };

      console.log('Sending voucher data:', voucherData);

      if (editingId) {
        await axios.put(`${API_URL}/vouchers/${editingId}`, voucherData);
        setSuccess('Voucher updated successfully!');
      } else {
        await axios.post(`${API_URL}/vouchers`, voucherData);
        setSuccess('Voucher created successfully! Code auto-generated.');
      }

      resetForm();
      fetchVouchers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving voucher:', err);
      console.error('Error response:', err.response?.data);
      
      // Extract validation errors if available
      if (err.response?.data?.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
        setError(validationErrors);
      } else {
        setError(err.response?.data?.message || err.response?.data?.title || 'Failed to save voucher');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (voucher) => {
    setEditingId(voucher.id);
    setFormData({
      voucherName: voucher.voucherName,
      description: voucher.description || '',
      roomTypeId: voucher.roomTypeId.toString(),
      startDate: voucher.startDate.split('T')[0],
      endDate: voucher.endDate.split('T')[0],
      discountAmount: voucher.discountAmount.toString(),
      discountType: voucher.discountType,
      discountPercentage: voucher.discountPercentage?.toString() || '',
      minimumAmount: voucher.minimumAmount?.toString() || '',
      maximumDiscount: voucher.maximumDiscount?.toString() || '',
      maxUsageCount: voucher.maxUsageCount?.toString() || '',
      approvedBy: voucher.approvedBy || '',
      terms: voucher.terms || ''
    });
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this voucher?')) return;

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/vouchers/${id}`);
      setSuccess('Voucher deleted successfully!');
      fetchVouchers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting voucher:', err);
      setError(err.response?.data?.message || 'Failed to delete voucher');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      voucherName: '',
      description: '',
      roomTypeId: '',
      startDate: '',
      endDate: '',
      discountAmount: '',
      discountType: 'Fixed',
      discountPercentage: '',
      minimumAmount: '',
      maximumDiscount: '',
      maxUsageCount: '',
      approvedBy: '',
      terms: ''
    });
    setEditingId(null);
    setShowForm(false);
    setErrors({});
    setError('');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      Inactive: { color: 'bg-gray-100 text-gray-800', icon: Clock },
      Expired: { color: 'bg-red-100 text-red-800', icon: AlertCircle }
    };
    const config = statusConfig[status] || statusConfig.Inactive;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon size={12} />
        {status}
      </span>
    );
  };

  const filteredVouchers = vouchers.filter(voucher =>
    voucher.voucherCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.voucherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.roomType?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <Ticket className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Voucher Management</h1>
              <p className="text-purple-100">Manage discount vouchers and promotional offers</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Add Voucher
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3">
          <CheckCircle size={20} />
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search vouchers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vouchers List - Part 1 of component continues in next message */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading && !showForm ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading vouchers...</p>
          </div>
        ) : filteredVouchers.length === 0 ? (
          <div className="text-center py-12">
            <Ticket size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No vouchers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Code</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Room Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Period</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Discount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVouchers.map((voucher) => (
                  <tr key={voucher.id} className="hover:bg-purple-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-purple-600" />
                        <span className="font-mono font-semibold text-purple-600">{voucher.voucherCode}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{voucher.voucherName}</div>
                      {voucher.description && <div className="text-sm text-gray-500 mt-1">{voucher.description}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{voucher.roomType?.name}</div>
                      <div className="text-sm text-gray-500">{formatCurrency(voucher.roomType?.basePrice)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{formatDate(voucher.startDate)}</div>
                      <div className="text-sm text-gray-500">to {formatDate(voucher.endDate)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-green-600">{formatCurrency(voucher.discountAmount)}</div>
                      {voucher.discountPercentage && <div className="text-sm text-gray-500">{voucher.discountPercentage}% off</div>}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(voucher.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(voucher)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(voucher.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Ticket size={28} />
                {editingId ? 'Edit Voucher' : 'Add New Voucher'}
              </h2>
              <button onClick={resetForm} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Voucher Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.voucherName}
                    onChange={(e) => setFormData({ ...formData, voucherName: e.target.value })}
                    className={`w-full px-4 py-3 border ${errors.voucherName ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-purple-500`}
                    placeholder="e.g., Summer Special Discount"
                  />
                  {errors.voucherName && <p className="text-red-500 text-sm mt-1">{errors.voucherName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Room Type <span className="text-red-500">*</span></label>
                  <select
                    value={formData.roomTypeId}
                    onChange={(e) => setFormData({ ...formData, roomTypeId: e.target.value })}
                    className={`w-full px-4 py-3 border ${errors.roomTypeId ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-purple-500`}
                  >
                    <option value="">Select Room Type</option>
                    {roomTypes.map(rt => (
                      <option key={rt.id} value={rt.id}>{rt.name} - {formatCurrency(rt.basePrice)}</option>
                    ))}
                  </select>
                  {errors.roomTypeId && <p className="text-red-500 text-sm mt-1">{errors.roomTypeId}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  placeholder="Brief description..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className={`w-full px-4 py-3 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-purple-500`}
                  />
                  {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className={`w-full px-4 py-3 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-purple-500`}
                  />
                  {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Fixed">Fixed Amount</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Amount (Rs) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discountAmount}
                    onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                    className={`w-full px-4 py-3 border ${errors.discountAmount ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-purple-500`}
                    placeholder="0.00"
                  />
                  {errors.discountAmount && <p className="text-red-500 text-sm mt-1">{errors.discountAmount}</p>}
                </div>

                {formData.discountType === 'Percentage' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Discount %</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.discountPercentage}
                      onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                      placeholder="0.00"
                      max="100"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Min Amount (Rs)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minimumAmount}
                    onChange={(e) => setFormData({ ...formData, minimumAmount: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Max Discount (Rs)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.maximumDiscount}
                    onChange={(e) => setFormData({ ...formData, maximumDiscount: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Max Usage</label>
                  <input
                    type="number"
                    value={formData.maxUsageCount}
                    onChange={(e) => setFormData({ ...formData, maxUsageCount: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Approved By</label>
                  <input
                    type="text"
                    value={formData.approvedBy}
                    onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="Owner/Director name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Terms & Conditions</label>
                  <input
                    type="text"
                    value={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Valid on weekdays only"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingId ? 'Update Voucher' : 'Create Voucher'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherManagement;
