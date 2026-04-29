-- =====================================================
-- INSERT SAMPLE STOCK ALERTS
-- =====================================================

SET IDENTITY_INSERT [dbo].[StockAlerts] ON;

INSERT INTO [dbo].[StockAlerts]
(Id, ItemId, AlertType, AlertDate, CurrentStock, MinimumLevel, ExpiryDate, Status, AlertedTo, ResolvedDate, ResolvedBy, Remarks, IsActive, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy)
VALUES

-- Low Stock Alerts
(1, 1, 'Low Stock', GETUTCDATE(), 15, 50, NULL, 'Active', 'Inventory Manager', NULL, NULL, 'Basmati Rice stock running low', 1, GETUTCDATE(), NULL, 'Admin', NULL),

(2, 2, 'Low Stock', GETUTCDATE(), 25, 100, NULL, 'Active', 'Inventory Manager', NULL, NULL, 'Toilet Paper stock running low', 1, GETUTCDATE(), NULL, 'Admin', NULL),

(3, 3, 'Low Stock', GETUTCDATE(), 8, 30, NULL, 'Active', 'Inventory Manager', NULL, NULL, 'Detergent Powder stock running low', 1, GETUTCDATE(), NULL, 'Admin', NULL),

(4, 4, 'Low Stock', GETUTCDATE(), 20, 75, NULL, 'Active', 'Inventory Manager', NULL, NULL, 'Bed Sheets stock running low', 1, GETUTCDATE(), NULL, 'Admin', NULL),

-- Critical Stock Alert
(5, 5, 'Out of Stock', GETUTCDATE(), 5, 15, NULL, 'Active', 'Inventory Manager', NULL, NULL, 'Cooking Oil critically low - urgent reorder needed', 1, GETUTCDATE(), NULL, 'Admin', NULL),

-- Out of Stock Alert
(6, 6, 'Out of Stock', GETUTCDATE(), 0, 20, NULL, 'Active', 'Inventory Manager', NULL, NULL, 'Hand Soap completely out of stock', 1, GETUTCDATE(), NULL, 'Admin', NULL),

-- Additional Low Stock Alerts
(7, 7, 'Low Stock', GETUTCDATE(), 12, 40, NULL, 'Active', 'Inventory Manager', NULL, NULL, 'Dish Wash Liquid stock low', 1, GETUTCDATE(), NULL, 'Admin', NULL),

(8, 8, 'Low Stock', GETUTCDATE(), 18, 60, NULL, 'Resolved', 'Inventory Manager', DATEADD(DAY, -1, GETUTCDATE()), 'Admin', 'Reordered from Metro Cash & Carry', 1, GETUTCDATE(), NULL, 'Admin', NULL),

(9, 9, 'Low Stock', GETUTCDATE(), 22, 50, NULL, 'Active', 'Inventory Manager', NULL, NULL, 'Laundry Detergent stock running low', 1, GETUTCDATE(), NULL, 'Admin', NULL),

(10, 10, 'Out of Stock', GETUTCDATE(), 2, 25, NULL, 'Active', 'Inventory Manager', NULL, NULL, 'Bleach almost out of stock - urgent', 1, GETUTCDATE(), NULL, 'Admin', NULL);

SET IDENTITY_INSERT [dbo].[StockAlerts] OFF;

-- Verification
SELECT Id, ItemId, AlertType, CurrentStock, MinimumLevel, Status, AlertDate FROM [dbo].[StockAlerts] ORDER BY AlertDate DESC;
