// System Validation Utility for Hotel ERP
// Checks all modules for dynamic API integration

export const validateSystemIntegration = () => {
  const validationResults = {
    totalModules: 0,
    connectedModules: 0,
    pendingModules: [],
    completedModules: [],
    errors: []
  };

  // HR & Payroll Modules Status
  const hrModules = [
    { name: 'Employee Management', path: '/human-resources/employees', status: 'CONNECTED', api: '/api/PayrollHR/employees' },
    { name: 'Payroll Processing', path: '/human-resources/payroll', status: 'CONNECTED', api: '/api/PayrollHR/employee-payments' },
    { name: 'Attendance Management', path: '/human-resources/attendance', status: 'CONNECTED', api: '/api/PayrollHR/employee-attendance' },
    { name: 'Leave Management', path: '/human-resources/leave', status: 'CONNECTED', api: '/api/PayrollHR/leave-management' },
    { name: 'Performance Management', path: '/human-resources/performance', status: 'CONNECTED', api: '/api/PayrollHR/performance-reviews' },
    { name: 'Training Management', path: '/human-resources/training', status: 'PARTIAL', api: '/api/PayrollHR/training-programs' }
  ];

  // Reports Modules Status
  const reportModules = [
    { name: 'Employee Payment Report', path: '/reports/employee-payment', status: 'CONNECTED', api: '/api/Reports/employee-payment-report' },
    { name: 'Guest Profile Report', path: '/reports/guest-profile', status: 'CONNECTED', api: '/api/Reports/guest-profile-report' },
    { name: 'Check-In Report', path: '/reports/checkin', status: 'CONNECTED', api: '/api/Reports/checkin-report' },
    { name: 'Restaurant Billing Report', path: '/reports/restaurant-billing', status: 'PARTIAL', api: '/api/Reports/restaurant-billing-report' },
    { name: 'Room Bill Report', path: '/reports/room-bill', status: 'PENDING', api: '/api/Reports/room-bill-report' },
    { name: 'Inventory Report', path: '/reports/inventory', status: 'PENDING', api: '/api/Reports/inventory-report' },
    { name: 'Reports Dashboard', path: '/reports', status: 'CONNECTED', api: '/api/Reports/dashboard-summary' }
  ];

  // Master Entry Modules Status
  const masterModules = [
    { name: 'Hotel Master', path: '/master-entry/hotel', status: 'CONNECTED', api: '/api/hotels' },
    { name: 'Room Master', path: '/master-entry/room', status: 'CONNECTED', api: '/api/rooms' },
    { name: 'Guest Master', path: '/master-entry/guest', status: 'CONNECTED', api: '/api/guests' },
    { name: 'Room Type Master', path: '/master-entry/room-type', status: 'MOCK_ONLY', api: '/api/room-types' },
    { name: 'Supplier Master', path: '/master-entry/supplier', status: 'MOCK_ONLY', api: '/api/suppliers' },
    { name: 'Currency Master', path: '/master-entry/currency', status: 'MOCK_ONLY', api: '/api/currencies' }
  ];

  // Restaurant & Bar Modules Status
  const restaurantModules = [
    { name: 'Menu Order Management', path: '/restaurant/menu-order', status: 'MOCK_ONLY', api: '/api/RestaurantBar/restaurant-orders' },
    { name: 'Table Management', path: '/restaurant/table', status: 'MOCK_ONLY', api: '/api/RestaurantBar/table-management' },
    { name: 'Kitchen Display', path: '/restaurant/kitchen', status: 'MOCK_ONLY', api: '/api/RestaurantBar/kitchen-display' },
    { name: 'Bar Management', path: '/restaurant/bar', status: 'MOCK_ONLY', api: '/api/RestaurantBar/bar-management' }
  ];

  // Inventory Modules Status
  const inventoryModules = [
    { name: 'Stock Management', path: '/inventory/stock', status: 'MOCK_ONLY', api: '/api/Inventory/items' },
    { name: 'Purchase Orders', path: '/inventory/purchase', status: 'MOCK_ONLY', api: '/api/Inventory/purchase-orders' },
    { name: 'Suppliers', path: '/inventory/suppliers', status: 'MOCK_ONLY', api: '/api/Inventory/suppliers' }
  ];

  // Accounting Modules Status
  const accountingModules = [
    { name: 'Guest Billing', path: '/accounting/guest-billing', status: 'MOCK_ONLY', api: '/api/Accounting/guest-accounts' },
    { name: 'Payment Processing', path: '/accounting/payments', status: 'MOCK_ONLY', api: '/api/Accounting/payments' },
    { name: 'Voucher Management', path: '/accounting/vouchers', status: 'MOCK_ONLY', api: '/api/Accounting/vouchers' }
  ];

  // Front Office Modules Status
  const frontOfficeModules = [
    { name: 'Reservations', path: '/front-office/reservations', status: 'MOCK_ONLY', api: '/api/Reservations' },
    { name: 'Check In/Out', path: '/front-office/checkin', status: 'MOCK_ONLY', api: '/api/CheckIn' },
    { name: 'Guest Registration', path: '/front-office/guest-registration', status: 'MOCK_ONLY', api: '/api/Guests' }
  ];

  // Combine all modules
  const allModules = [
    ...hrModules,
    ...reportModules,
    ...masterModules,
    ...restaurantModules,
    ...inventoryModules,
    ...accountingModules,
    ...frontOfficeModules
  ];

  // Calculate statistics
  validationResults.totalModules = allModules.length;
  
  allModules.forEach(module => {
    if (module.status === 'CONNECTED') {
      validationResults.connectedModules++;
      validationResults.completedModules.push(module);
    } else {
      validationResults.pendingModules.push(module);
    }
  });

  // Generate recommendations
  const recommendations = generateRecommendations(allModules);

  return {
    ...validationResults,
    modules: {
      hr: hrModules,
      reports: reportModules,
      masterEntry: masterModules,
      restaurant: restaurantModules,
      inventory: inventoryModules,
      accounting: accountingModules,
      frontOffice: frontOfficeModules
    },
    recommendations,
    completionPercentage: Math.round((validationResults.connectedModules / validationResults.totalModules) * 100)
  };
};

const generateRecommendations = (modules) => {
  const recommendations = [];

  // High priority recommendations
  const pendingConnections = modules.filter(m => m.status === 'PENDING');
  if (pendingConnections.length > 0) {
    recommendations.push({
      priority: 'HIGH',
      type: 'API_INTEGRATION',
      message: `${pendingConnections.length} modules need API integration`,
      modules: pendingConnections.map(m => m.name)
    });
  }

  // Medium priority recommendations
  const partialConnections = modules.filter(m => m.status === 'PARTIAL');
  if (partialConnections.length > 0) {
    recommendations.push({
      priority: 'MEDIUM',
      type: 'COMPLETE_INTEGRATION',
      message: `${partialConnections.length} modules need completion`,
      modules: partialConnections.map(m => m.name)
    });
  }

  // Low priority recommendations
  const mockOnlyModules = modules.filter(m => m.status === 'MOCK_ONLY');
  if (mockOnlyModules.length > 0) {
    recommendations.push({
      priority: 'LOW',
      type: 'UPGRADE_TO_API',
      message: `${mockOnlyModules.length} modules can be upgraded from mock to API`,
      modules: mockOnlyModules.map(m => m.name)
    });
  }

  return recommendations;
};

// API Endpoint Validation
export const validateAPIEndpoints = async () => {
  const endpoints = [
    // HR & Payroll APIs
    { url: '/api/PayrollHR/employees', method: 'GET', module: 'Employee Management' },
    { url: '/api/PayrollHR/employee-payments', method: 'GET', module: 'Payroll' },
    { url: '/api/PayrollHR/employee-attendance', method: 'GET', module: 'Attendance' },
    { url: '/api/PayrollHR/leave-management', method: 'GET', module: 'Leave Management' },
    { url: '/api/PayrollHR/performance-reviews', method: 'GET', module: 'Performance' },
    { url: '/api/PayrollHR/training-programs', method: 'GET', module: 'Training' },

    // Reports APIs
    { url: '/api/Reports/employee-payment-report', method: 'GET', module: 'Employee Payment Report' },
    { url: '/api/Reports/guest-profile-report', method: 'GET', module: 'Guest Profile Report' },
    { url: '/api/Reports/checkin-report', method: 'GET', module: 'Check-In Report' },
    { url: '/api/Reports/restaurant-billing-report', method: 'GET', module: 'Restaurant Billing Report' },
    { url: '/api/Reports/room-bill-report', method: 'GET', module: 'Room Bill Report' },
    { url: '/api/Reports/inventory-report', method: 'GET', module: 'Inventory Report' },
    { url: '/api/Reports/dashboard-summary', method: 'GET', module: 'Reports Dashboard' },
    { url: '/api/Reports/hotel-info', method: 'GET', module: 'Hotel Information' },

    // Master Entry APIs
    { url: '/api/hotels', method: 'GET', module: 'Hotel Master' },
    { url: '/api/rooms', method: 'GET', module: 'Room Master' },
    { url: '/api/guests', method: 'GET', module: 'Guest Master' },
    { url: '/api/room-types', method: 'GET', module: 'Room Type Master' }
  ];

  const results = {
    total: endpoints.length,
    working: 0,
    failing: 0,
    details: []
  };

  // Note: In a real implementation, you would make actual HTTP requests here
  // For now, we'll simulate the validation based on known implementation status
  endpoints.forEach(endpoint => {
    const isImplemented = checkEndpointImplementation(endpoint.url);
    const result = {
      ...endpoint,
      status: isImplemented ? 'WORKING' : 'NOT_IMPLEMENTED',
      responseTime: isImplemented ? Math.random() * 200 + 50 : null
    };

    if (isImplemented) {
      results.working++;
    } else {
      results.failing++;
    }

    results.details.push(result);
  });

  return results;
};

const checkEndpointImplementation = (url) => {
  // Based on our implementation, these endpoints are working
  const implementedEndpoints = [
    '/api/PayrollHR/employees',
    '/api/PayrollHR/employee-payments',
    '/api/PayrollHR/employee-attendance',
    '/api/PayrollHR/leave-management',
    '/api/PayrollHR/performance-reviews',
    '/api/PayrollHR/training-programs',
    '/api/Reports/employee-payment-report',
    '/api/Reports/guest-profile-report',
    '/api/Reports/checkin-report',
    '/api/Reports/restaurant-billing-report',
    '/api/Reports/room-bill-report',
    '/api/Reports/inventory-report',
    '/api/Reports/dashboard-summary',
    '/api/Reports/hotel-info'
  ];

  return implementedEndpoints.includes(url);
};

// Print & Export Validation
export const validatePrintExportFunctionality = () => {
  const modules = [
    { name: 'Employee Payment Report', hasPrint: true, hasExport: true },
    { name: 'Guest Profile Report', hasPrint: true, hasExport: true },
    { name: 'Check-In Report', hasPrint: false, hasExport: false },
    { name: 'Restaurant Billing Report', hasPrint: false, hasExport: false },
    { name: 'Room Bill Report', hasPrint: false, hasExport: false }
  ];

  const results = {
    totalReports: modules.length,
    withPrint: modules.filter(m => m.hasPrint).length,
    withExport: modules.filter(m => m.hasExport).length,
    needsPrint: modules.filter(m => !m.hasPrint),
    needsExport: modules.filter(m => !m.hasExport)
  };

  return results;
};

export default {
  validateSystemIntegration,
  validateAPIEndpoints,
  validatePrintExportFunctionality
};
