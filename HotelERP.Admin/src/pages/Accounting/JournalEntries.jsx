import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { Plus, Edit, Trash2, Search, CheckCircle, XCircle } from 'lucide-react';

const JournalEntries = () => {
  const [entries, setEntries] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [pagination, setPagination] = useState({});
  const [formData, setFormData] = useState({
    entryDate: new Date().toISOString().split('T')[0],
    entryType: 'Manual',
    voucherType: 'Journal',
    reference: '',
    description: '',
    preparedBy: 'Admin',
    notes: '',
    lines: [
      { accountCode: '', description: '', debitAmount: 0, creditAmount: 0 },
      { accountCode: '', description: '', debitAmount: 0, creditAmount: 0 }
    ]
  });

  useEffect(() => {
    fetchEntries();
    fetchAccounts();
  }, [page, perPage, searchTerm, statusFilter]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/JournalEntries', {
        params: { page, perPage, search: searchTerm, status: statusFilter }
      });
      if (response.data.success) {
        setEntries(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('/ChartOfAccounts/posting-accounts');
      if (response.data.success) {
        setAccounts(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const totalDebit = formData.lines.reduce((sum, line) => sum + parseFloat(line.debitAmount || 0), 0);
    const totalCredit = formData.lines.reduce((sum, line) => sum + parseFloat(line.creditAmount || 0), 0);
    
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      alert('Journal entry is not balanced. Debit must equal Credit.');
      return;
    }

    try {
      if (editingEntry) {
        await axios.put(`/JournalEntries/${editingEntry.id}`, formData);
      } else {
        await axios.post('/JournalEntries', formData);
      }
      setShowForm(false);
      setEditingEntry(null);
      resetForm();
      fetchEntries();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving entry');
    }
  };

  const handlePost = async (id) => {
    if (window.confirm('Are you sure you want to post this journal entry?')) {
      try {
        await axios.post(`/JournalEntries/${id}/post`, { postedBy: 'Admin' });
        fetchEntries();
      } catch (err) {
        alert(err.response?.data?.message || 'Error posting entry');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axios.delete(`/JournalEntries/${id}`);
        fetchEntries();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting entry');
      }
    }
  };

  const addLine = () => {
    setFormData({
      ...formData,
      lines: [...formData.lines, { accountCode: '', description: '', debitAmount: 0, creditAmount: 0 }]
    });
  };

  const removeLine = (index) => {
    const newLines = formData.lines.filter((_, i) => i !== index);
    setFormData({ ...formData, lines: newLines });
  };

  const updateLine = (index, field, value) => {
    const newLines = [...formData.lines];
    newLines[index][field] = value;
    setFormData({ ...formData, lines: newLines });
  };

  const resetForm = () => {
    setFormData({
      entryDate: new Date().toISOString().split('T')[0],
      entryType: 'Manual',
      voucherType: 'Journal',
      reference: '',
      description: '',
      preparedBy: 'Admin',
      notes: '',
      lines: [
        { accountCode: '', description: '', debitAmount: 0, creditAmount: 0 },
        { accountCode: '', description: '', debitAmount: 0, creditAmount: 0 }
      ]
    });
  };

  const totalDebit = formData.lines.reduce((sum, line) => sum + parseFloat(line.debitAmount || 0), 0);
  const totalCredit = formData.lines.reduce((sum, line) => sum + parseFloat(line.creditAmount || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Journal Entries</h1>
          <p className="text-gray-600">Record financial transactions</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingEntry(null); resetForm(); }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200"
        >
          <Plus className="w-5 h-5" />
          New Entry
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Posted">Posted</option>
            <option value="Approved">Approved</option>
          </select>
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
        </div>
      </div>

      {/* Entries Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Journal #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Debit</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Credit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    </div>
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No entries found
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {entry.journalNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(entry.entryDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {entry.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {entry.entryType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {entry.totalDebit.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {entry.totalCredit.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        entry.status === 'Posted' ? 'bg-green-100 text-green-800' :
                        entry.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {entry.status === 'Draft' && (
                        <>
                          <button
                            onClick={() => handlePost(entry.id)}
                            className="text-green-600 hover:text-green-900 mr-3"
                            title="Post Entry"
                          >
                            <CheckCircle className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * perPage + 1}</span> to{' '}
                <span className="font-medium">{Math.min(page * perPage, pagination.totalRecords)}</span> of{' '}
                <span className="font-medium">{pagination.totalRecords}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Entry Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.entryDate}
                      onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Entry Type</label>
                    <select
                      value={formData.entryType}
                      onChange={(e) => setFormData({ ...formData, entryType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="Manual">Manual</option>
                      <option value="Auto">Auto</option>
                      <option value="Adjustment">Adjustment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Voucher Type</label>
                    <select
                      value={formData.voucherType}
                      onChange={(e) => setFormData({ ...formData, voucherType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="Journal">Journal</option>
                      <option value="Payment">Payment</option>
                      <option value="Receipt">Receipt</option>
                      <option value="Contra">Contra</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                    <input
                      type="text"
                      value={formData.reference}
                      onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <input
                      type="text"
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Journal Lines */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">Journal Lines</h3>
                    <button
                      type="button"
                      onClick={addLine}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Add Line
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.lines.map((line, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-2 rounded">
                        <div className="col-span-3">
                          <select
                            required
                            value={line.accountCode}
                            onChange={(e) => updateLine(index, 'accountCode', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="">Select Account</option>
                            {accounts.map(acc => (
                              <option key={acc.id} value={acc.accountCode}>
                                {acc.accountCode} - {acc.accountName}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-4">
                          <input
                            type="text"
                            placeholder="Description"
                            value={line.description}
                            onChange={(e) => updateLine(index, 'description', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Debit"
                            value={line.debitAmount}
                            onChange={(e) => updateLine(index, 'debitAmount', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Credit"
                            value={line.creditAmount}
                            onChange={(e) => updateLine(index, 'creditAmount', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right"
                          />
                        </div>
                        <div className="col-span-1 text-center">
                          {formData.lines.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeLine(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-end gap-8 text-sm font-semibold">
                    <div>Total Debit: <span className="text-blue-600">{totalDebit.toFixed(2)}</span></div>
                    <div>Total Credit: <span className="text-green-600">{totalCredit.toFixed(2)}</span></div>
                    <div>
                      Difference: <span className={isBalanced ? 'text-green-600' : 'text-red-600'}>
                        {Math.abs(totalDebit - totalCredit).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  {!isBalanced && (
                    <div className="mt-2 text-red-600 text-sm text-center">
                      ⚠️ Entry is not balanced. Debit must equal Credit.
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditingEntry(null); resetForm(); }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isBalanced}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {editingEntry ? 'Update' : 'Create'} Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalEntries;
