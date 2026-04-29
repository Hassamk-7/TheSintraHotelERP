-- =====================================================
-- INSERT 15 SAMPLE PURCHASE ORDERS INTO PurchaseOrder TABLE
-- =====================================================
-- This script adds realistic purchase orders for testing
-- Run this in SQL Server Management Studio

SET IDENTITY_INSERT [dbo].[PurchaseOrders] ON;

INSERT INTO [dbo].[PurchaseOrders] 
(Id, PONumber, SupplierId, OrderDate, ExpectedDeliveryDate, ActualDeliveryDate, Status, SubTotal, TaxAmount, TotalAmount, OrderedBy, ApprovedBy, ApprovalDate, Terms, Remarks, IsActive, CreatedAt, UpdatedAt)
VALUES

-- FOOD & BEVERAGE SUPPLIERS (1-5)
(1, 'PO-2024-001', 1, '2024-01-15', '2024-01-18', NULL, 'Pending', 14000.00, 0.00, 14000.00, 'Admin', NULL, NULL, 'Net 30', 'Urgent order for kitchen supplies', 1, GETUTCDATE(), NULL),

(2, 'PO-2024-002', 1, '2024-01-16', '2024-01-20', '2024-01-19', 'Received', 22500.00, 0.00, 22500.00, 'Manager', 'Admin', '2024-01-16', 'Net 30', 'Regular monthly stock', 1, GETUTCDATE(), NULL),

(3, 'PO-2024-003', 2, '2024-01-17', '2024-01-22', NULL, 'Approved', 8750.00, 0.00, 8750.00, 'Admin', 'Manager', '2024-01-17', 'Net 15', 'Fresh meat for restaurant', 1, GETUTCDATE(), NULL),

(4, 'PO-2024-004', 3, '2024-01-18', '2024-01-21', '2024-01-21', 'Received', 5600.00, 0.00, 5600.00, 'Chef', 'Admin', '2024-01-18', 'Net 30', 'Cooking oils and spices', 1, GETUTCDATE(), NULL),

(5, 'PO-2024-005', 1, '2024-01-19', '2024-01-25', NULL, 'Draft', 18900.00, 0.00, 18900.00, 'Admin', NULL, NULL, 'Net 30', 'Bulk order for next month', 1, GETUTCDATE(), NULL),

-- HOUSEKEEPING SUPPLIERS (6-10)
(6, 'PO-2024-006', 4, '2024-01-15', '2024-01-17', '2024-01-17', 'Received', 13250.00, 0.00, 13250.00, 'Housekeeping Manager', 'Admin', '2024-01-15', 'Net 30', 'Monthly housekeeping supplies', 1, GETUTCDATE(), NULL),

(7, 'PO-2024-007', 5, '2024-01-16', '2024-01-19', NULL, 'Pending', 9600.00, 0.00, 9600.00, 'Admin', NULL, NULL, 'Net 15', 'Laundry detergent and chemicals', 1, GETUTCDATE(), NULL),

(8, 'PO-2024-008', 4, '2024-01-17', '2024-01-20', '2024-01-20', 'Received', 7200.00, 0.00, 7200.00, 'Housekeeping Manager', 'Admin', '2024-01-17', 'Net 30', 'Cleaning supplies restock', 1, GETUTCDATE(), NULL),

(9, 'PO-2024-009', 6, '2024-01-18', '2024-01-22', NULL, 'Approved', 11500.00, 0.00, 11500.00, 'Admin', 'Manager', '2024-01-18', 'Net 30', 'Bed linens and towels', 1, GETUTCDATE(), NULL),

(10, 'PO-2024-010', 5, '2024-01-19', '2024-01-23', NULL, 'Draft', 6800.00, 0.00, 6800.00, 'Admin', NULL, NULL, 'Net 15', 'Guest amenities', 1, GETUTCDATE(), NULL),

-- OFFICE & MAINTENANCE SUPPLIERS (11-15)
(11, 'PO-2024-011', 7, '2024-01-15', '2024-01-17', '2024-01-17', 'Received', 5750.00, 0.00, 5750.00, 'Admin', 'Manager', '2024-01-15', 'Net 30', 'Office supplies for administration', 1, GETUTCDATE(), NULL),

(12, 'PO-2024-012', 8, '2024-01-16', '2024-01-19', NULL, 'Pending', 8900.00, 0.00, 8900.00, 'Admin', NULL, NULL, 'Net 30', 'Electrical supplies and fixtures', 1, GETUTCDATE(), NULL),

(13, 'PO-2024-013', 9, '2024-01-17', '2024-01-21', '2024-01-21', 'Received', 12400.00, 0.00, 12400.00, 'Maintenance Manager', 'Admin', '2024-01-17', 'Net 30', 'Paint and maintenance materials', 1, GETUTCDATE(), NULL),

(14, 'PO-2024-014', 7, '2024-01-18', '2024-01-22', NULL, 'Approved', 4250.00, 0.00, 4250.00, 'Admin', 'Manager', '2024-01-18', 'Net 30', 'Stationery and printing supplies', 1, GETUTCDATE(), NULL),

(15, 'PO-2024-015', 8, '2024-01-19', '2024-01-24', NULL, 'Draft', 7600.00, 0.00, 7600.00, 'Admin', NULL, NULL, 'Net 30', 'HVAC and plumbing supplies', 1, GETUTCDATE(), NULL);

SET IDENTITY_INSERT [dbo].[PurchaseOrders] OFF;

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
-- Run this to verify the data was inserted correctly:
SELECT 
    Id,
    PONumber,
    SupplierId,
    OrderDate,
    ExpectedDeliveryDate,
    Status,
    TotalAmount,
    OrderedBy,
    ApprovedBy,
    IsActive,
    CreatedAt
FROM [dbo].[PurchaseOrders]
WHERE Id BETWEEN 1 AND 15
ORDER BY Id;

-- =====================================================
-- SUMMARY STATISTICS
-- =====================================================
-- Total POs by status:
SELECT 
    Status,
    COUNT(*) as OrderCount,
    SUM(TotalAmount) as TotalValue
FROM [dbo].[PurchaseOrders]
WHERE Id BETWEEN 1 AND 15
GROUP BY Status
ORDER BY Status;

-- Total PO value:
SELECT 
    SUM(TotalAmount) as TotalPOValue,
    COUNT(*) as TotalOrders,
    AVG(TotalAmount) as AverageOrderValue
FROM [dbo].[PurchaseOrders]
WHERE Id BETWEEN 1 AND 15;

-- POs by supplier:
SELECT 
    p.SupplierId,
    COUNT(*) as OrderCount,
    SUM(p.TotalAmount) as SupplierTotal
FROM [dbo].[PurchaseOrders] p
WHERE p.Id BETWEEN 1 AND 15
GROUP BY p.SupplierId
ORDER BY SupplierTotal DESC;
