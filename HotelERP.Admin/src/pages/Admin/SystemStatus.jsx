import React, { useState, useEffect } from 'react';
import { 
  validateSystemIntegration, 
  validateAPIEndpoints, 
  validatePrintExportFunctionality 
} from '../../utils/SystemValidator';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XCircleIcon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  PrinterIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const SystemStatus = () => {
  const [systemData, setSystemData] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [printData, setPrintData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSystemStatus();
  }, []);

  const loadSystemStatus = async () => {
    setLoading(true);
    
    // Run all validations
    const systemValidation = validateSystemIntegration();
    const apiValidation = await validateAPIEndpoints();
    const printValidation = validatePrintExportFunctionality();
    
    setSystemData(systemValidation);
    setApiData(apiValidation);
    setPrintData(printValidation);
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONNECTED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'PARTIAL':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-orange-500" />;
      case 'MOCK_ONLY':
        return <XCircleIcon className="h-5 w-5 text-gray-400" />;
      default:
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONNECTED':
        return 'bg-green-100 text-green-800';
      case 'PARTIAL':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING':
        return 'bg-orange-100 text-orange-800';
      case 'MOCK_ONLY':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">System Status Dashboard</h1>
            <p className="text-indigo-100">Complete overview of Hotel ERP system integration status</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={loadSystemStatus}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <ArrowPathIcon className="h-5 w-5" />
              <span>Refresh</span>
            </button>
            <CogIcon className="h-16 w-16 text-indigo-200" />
          </div>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Modules</p>
              <p className="text-2xl font-bold text-gray-900">{systemData?.totalModules || 0}</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">API Connected</p>
              <p className="text-2xl font-bold text-green-600">{systemData?.connectedModules || 0}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-blue-600">{systemData?.completionPercentage || 0}%</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">{systemData?.completionPercentage || 0}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">API Endpoints</p>
              <p className="text-2xl font-bold text-purple-600">{apiData?.working || 0}/{apiData?.total || 0}</p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Module Status by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* HR & Payroll Modules */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="bg-indigo-100 rounded-lg p-2 mr-3">
              <ChartBarIcon className="h-5 w-5 text-indigo-600" />
            </div>
            HR & Payroll Modules
          </h3>
          <div className="space-y-3">
            {systemData?.modules?.hr?.map((module, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {getStatusIcon(module.status)}
                  <span className="ml-3 font-medium text-gray-900">{module.name}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(module.status)}`}>
                  {module.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reports Modules */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="bg-green-100 rounded-lg p-2 mr-3">
              <DocumentTextIcon className="h-5 w-5 text-green-600" />
            </div>
            Reports Modules
          </h3>
          <div className="space-y-3">
            {systemData?.modules?.reports?.map((module, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {getStatusIcon(module.status)}
                  <span className="ml-3 font-medium text-gray-900">{module.name}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(module.status)}`}>
                  {module.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {systemData?.recommendations?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-4">
            {systemData.recommendations.map((rec, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{rec.message}</span>
                  <span className="text-xs font-bold">{rec.priority} PRIORITY</span>
                </div>
                <div className="text-sm opacity-75">
                  Modules: {rec.modules.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Endpoints Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Endpoints Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apiData?.details?.map((endpoint, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-gray-900">{endpoint.module}</span>
                {endpoint.status === 'WORKING' ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircleIcon className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="text-xs text-gray-600 mb-1">{endpoint.method} {endpoint.url}</div>
              {endpoint.responseTime && (
                <div className="text-xs text-green-600">Response: {endpoint.responseTime.toFixed(0)}ms</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Print & Export Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <PrinterIcon className="h-5 w-5 text-gray-600 mr-2" />
          Print & Export Functionality
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{printData?.totalReports || 0}</div>
            <div className="text-sm text-gray-600">Total Reports</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{printData?.withPrint || 0}</div>
            <div className="text-sm text-gray-600">With Print</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{printData?.withExport || 0}</div>
            <div className="text-sm text-gray-600">With Export</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
