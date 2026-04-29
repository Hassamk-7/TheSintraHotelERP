import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { Search } from 'lucide-react';

const PMSAccountMapping = () => {
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pmsTypeFilter, setPmsTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalRecords: 0 });

  useEffect(() => {
    fetchMappings();
  }, [page, perPage, searchTerm, pmsTypeFilter]);

  const fetchMappings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/PMSAccountMapping', {
        params: {
          page,
          perPage,
          search: searchTerm,
          pmsType: pmsTypeFilter
        }
      });

      if (response.data?.success) {
        setMappings(response.data.data || []);
        setPagination(response.data.pagination || { page: 1, totalPages: 1, totalRecords: 0 });
      } else {
        setMappings([]);
      }
    } catch (error) {
      console.error('Error fetching PMS account mappings:', error);
      setMappings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">PMS Account Mapping</h1>
          <p className="text-gray-600">Map PMS transaction heads to GL account codes</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search PMS code / description / GL..."
              value={searchTerm}
              onChange={(e) => {
                setPage(1);
                setSearchTerm(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <select
            value={pmsTypeFilter}
            onChange={(e) => {
              setPage(1);
              setPmsTypeFilter(e.target.value);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">All PMS Types</option>
            <option value="Revenue">Revenue</option>
            <option value="Charge">Charge</option>
            <option value="Payment">Payment</option>
            <option value="Tax">Tax</option>
            <option value="Liability">Liability</option>
            <option value="Receivable">Receivable</option>
          </select>

          <select
            value={perPage}
            onChange={(e) => {
              setPage(1);
              setPerPage(Number(e.target.value));
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
            <option value="500">500 per page</option>
            <option value="1000">1000 per page</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PMS Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GL Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">Loading mappings...</td>
                </tr>
              ) : mappings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">No mappings found</td>
                </tr>
              ) : (
                mappings.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.pmsCode}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.pmsDescription}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.pmsType}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="font-medium">{item.glAccountCode}</div>
                      <div className="text-xs text-gray-500">{item.glAccountName}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.departmentCode || '-'} {item.departmentName ? `- ${item.departmentName}` : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div>Total Records: {pagination.totalRecords || 0}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page <= 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {pagination.page || page} of {pagination.totalPages || 1}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages || 1))}
            disabled={page >= (pagination.totalPages || 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PMSAccountMapping;
