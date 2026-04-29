-- =====================================================
-- INSERT 15 SAMPLE STOCK ITEMS INTO ItemMaster TABLE
-- =====================================================
-- This script adds realistic inventory items for a hotel
-- Run this in SQL Server Management Studio

SET IDENTITY_INSERT [dbo].[ItemMasters] ON;

INSERT INTO [dbo].[ItemMasters] 
(Id, Name, Code, Description, Category, Unit, PurchasePrice, SalePrice, MinStockLevel, MaxStockLevel, CurrentStock, Supplier, Brand, IsPerishable, ExpiryDate, StorageLocation, IsActive, CreatedAt, UpdatedAt)
VALUES

-- FOOD & BEVERAGE ITEMS (1-6)
(1, 'Basmati Rice', 'RICE001', 'Premium quality basmati rice for biryani and pulao', 'Food & Beverage', 'Kg', 180.00, 220.00, 50, 500, 150, 'Zubair Foods & Supplies', 'Dawat', 0, NULL, 'Kitchen Store - Shelf A', 1, GETUTCDATE(), NULL),

(2, 'Chicken (Fresh)', 'CHKN001', 'Fresh chicken breast for restaurant kitchen', 'Food & Beverage', 'Kg', 450.00, 600.00, 20, 100, 45, 'Fresh Meat Co', 'Premium', 1, DATEADD(DAY, 3, GETUTCDATE()), 'Cold Storage - Freezer 1', 1, GETUTCDATE(), NULL),

(3, 'Cooking Oil', 'OIL001', 'Sunflower cooking oil for kitchen use', 'Food & Beverage', 'Liters', 280.00, 320.00, 10, 50, 28, 'ABC Food Suppliers', 'Golden', 0, NULL, 'Kitchen Store - Shelf B', 1, GETUTCDATE(), NULL),

(4, 'Wheat Flour', 'FLOUR001', 'All-purpose wheat flour for baking', 'Food & Beverage', 'Kg', 45.00, 60.00, 30, 200, 85, 'Zubair Foods & Supplies', 'Aashirwad', 0, NULL, 'Kitchen Store - Shelf C', 1, GETUTCDATE(), NULL),

(5, 'Sugar', 'SUGAR001', 'Refined white sugar for kitchen', 'Food & Beverage', 'Kg', 55.00, 70.00, 20, 150, 60, 'ABC Food Suppliers', 'Shakera', 0, NULL, 'Kitchen Store - Shelf D', 1, GETUTCDATE(), NULL),

(6, 'Tea Leaves', 'TEA001', 'Premium loose leaf tea', 'Food & Beverage', 'Kg', 320.00, 400.00, 5, 30, 12, 'Tea Estates Ltd', 'Darjeeling', 0, NULL, 'Kitchen Store - Shelf E', 1, GETUTCDATE(), NULL),

-- HOUSEKEEPING ITEMS (7-10)
(7, 'Toilet Paper', 'TP001', '2-ply toilet paper rolls for guest rooms', 'Housekeeping', 'Pieces', 25.00, 35.00, 100, 1000, 450, 'CleanPro Services', 'Softex', 0, NULL, 'Housekeeping Store - Rack 1', 1, GETUTCDATE(), NULL),

(8, 'Bed Sheets', 'BS001', 'Cotton bed sheets for guest rooms', 'Housekeeping', 'Pieces', 800.00, 1200.00, 50, 200, 120, 'Textile Supplies Co', 'Premium Cotton', 0, NULL, 'Linen Room - Shelf A', 1, GETUTCDATE(), NULL),

(9, 'Hand Soap', 'SOAP001', 'Liquid hand soap for guest bathrooms', 'Housekeeping', 'Liters', 150.00, 200.00, 20, 100, 55, 'CleanPro Services', 'Dettol', 0, NULL, 'Housekeeping Store - Rack 2', 1, GETUTCDATE(), NULL),

(10, 'Detergent Powder', 'DET001', 'Heavy duty detergent for laundry operations', 'Housekeeping', 'Kg', 150.00, 200.00, 20, 100, 75, 'Laundry Solutions', 'Surf Excel', 0, NULL, 'Laundry Room - Shelf A', 1, GETUTCDATE(), NULL),

-- OFFICE SUPPLIES (11-13)
(11, 'A4 Paper', 'PAPER001', 'White A4 copy paper 500 sheets per ream', 'Office Supplies', 'Reams', 280.00, 350.00, 10, 50, 25, 'Office Depot', 'ITC', 0, NULL, 'Office Store - Shelf A', 1, GETUTCDATE(), NULL),

(12, 'Ballpoint Pens', 'PEN001', 'Blue ballpoint pens box of 50', 'Office Supplies', 'Boxes', 120.00, 150.00, 5, 30, 15, 'Stationery Plus', 'Reynolds', 0, NULL, 'Office Store - Shelf B', 1, GETUTCDATE(), NULL),

(13, 'Notebooks', 'NOTE001', 'A5 spiral notebooks pack of 10', 'Office Supplies', 'Packs', 180.00, 250.00, 10, 50, 22, 'Stationery Plus', 'Classmate', 0, NULL, 'Office Store - Shelf C', 1, GETUTCDATE(), NULL),

-- MAINTENANCE ITEMS (14-15)
(14, 'Light Bulbs (LED)', 'BULB001', 'LED light bulbs 9W equivalent 60W', 'Maintenance', 'Pieces', 80.00, 120.00, 20, 100, 45, 'Electrical Supplies', 'Philips', 0, NULL, 'Maintenance Store - Rack A', 1, GETUTCDATE(), NULL),

(15, 'Paint (White)', 'PAINT001', 'Interior white emulsion paint 20 liters', 'Maintenance', 'Liters', 450.00, 600.00, 5, 30, 12, 'Paint & Coatings Ltd', 'Asian Paints', 0, NULL, 'Maintenance Store - Rack B', 1, GETUTCDATE(), NULL);

SET IDENTITY_INSERT [dbo].[ItemMasters] OFF;

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
-- Run this to verify the data was inserted correctly:
SELECT 
    Id,
    Name,
    Code,
    Category,
    CurrentStock,
    MinStockLevel,
    MaxStockLevel,
    PurchasePrice,
    Supplier,
    StorageLocation,
    IsActive,
    CreatedAt
FROM [dbo].[ItemMasters]
WHERE Id BETWEEN 1 AND 15
ORDER BY Id;

-- =====================================================
-- SUMMARY STATISTICS
-- =====================================================
-- Total items by category:
SELECT 
    Category,
    COUNT(*) as ItemCount,
    SUM(CurrentStock) as TotalStock,
    SUM(CurrentStock * PurchasePrice) as TotalValue
FROM [dbo].[ItemMasters]
WHERE Id BETWEEN 1 AND 15
GROUP BY Category
ORDER BY Category;

-- Items with low stock (below minimum level):
SELECT 
    Name,
    Code,
    CurrentStock,
    MinStockLevel,
    (MinStockLevel - CurrentStock) as ShortageQty,
    Supplier
FROM [dbo].[ItemMasters]
WHERE Id BETWEEN 1 AND 15
    AND CurrentStock <= MinStockLevel
ORDER BY ShortageQty DESC;
