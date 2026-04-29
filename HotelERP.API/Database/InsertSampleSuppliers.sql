-- =====================================================
-- INSERT SAMPLE SUPPLIERS
-- =====================================================

SET IDENTITY_INSERT [dbo].[Suppliers] ON;

INSERT INTO [dbo].[Suppliers]
(Id, Name, Code, ContactPerson, Email, Phone, Mobile, Address, City, Country, TaxNumber, Notes, IsActive, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy)
VALUES

(1, 'Metro Cash & Carry', 'MCC001', 'Ahmed Khan', 'info@metrocash.pk', '021-111-2222', '0300-1111111', 'Plot 123, Industrial Area', 'Karachi', 'Pakistan', 'PK-123456', 'Wholesale supplier for food & beverages', 1, GETUTCDATE(), NULL, 'Admin', NULL),

(2, 'Unilever Pakistan', 'UNL001', 'Fatima Ali', 'sales@unilever.pk', '021-333-4444', '0321-5555555', 'Clifton, Block 4', 'Karachi', 'Pakistan', 'PK-789012', 'FMCG and personal care products', 1, GETUTCDATE(), NULL, 'Admin', NULL),

(3, 'Fresco Foods', 'FRE001', 'Hassan Raza', 'contact@frescofoods.pk', '021-555-6666', '0333-7777777', 'Gulshan-e-Iqbal', 'Karachi', 'Pakistan', 'PK-345678', 'Fresh meat and poultry supplier', 1, GETUTCDATE(), NULL, 'Admin', NULL),

(4, 'CleanPro Services', 'CPS001', 'Saira Malik', 'sales@cleanpro.pk', '021-777-8888', '0345-9999999', 'Zamzama Commercial', 'Karachi', 'Pakistan', 'PK-901234', 'Cleaning supplies and chemicals', 1, GETUTCDATE(), NULL, 'Admin', NULL),

(5, 'Laundry Solutions Ltd', 'LSL001', 'Muhammad Asif', 'info@laundrysol.pk', '021-999-0000', '0300-2222222', 'Tariq Road', 'Karachi', 'Pakistan', 'PK-567890', 'Laundry detergent and fabric care', 1, GETUTCDATE(), NULL, 'Admin', NULL),

(6, 'Textile Hub Pakistan', 'THP001', 'Amina Siddiqui', 'sales@textilehub.pk', '021-111-3333', '0321-4444444', 'Liaquatabad', 'Karachi', 'Pakistan', 'PK-234567', 'Bed linens, towels and textiles', 1, GETUTCDATE(), NULL, 'Admin', NULL),

(7, 'Office Mart Pakistan', 'OMP001', 'Khalid Hussain', 'contact@officemart.pk', '021-555-6666', '0333-8888888', 'Gulberg', 'Lahore', 'Pakistan', 'PK-678901', 'Office supplies and stationery', 1, GETUTCDATE(), NULL, 'Admin', NULL),

(8, 'Electrical Supplies Co', 'ESC001', 'Rashid Ahmed', 'sales@elecsupp.pk', '021-777-9999', '0345-1111111', 'Korangi Industrial', 'Karachi', 'Pakistan', 'PK-890123', 'Electrical fixtures and supplies', 1, GETUTCDATE(), NULL, 'Admin', NULL),

(9, 'Maintenance Materials Ltd', 'MML001', 'Zainab Khan', 'info@maintmat.pk', '021-999-2222', '0300-3333333', 'SITE', 'Karachi', 'Pakistan', 'PK-012345', 'Paint, tools and maintenance materials', 1, GETUTCDATE(), NULL, 'Admin', NULL);

SET IDENTITY_INSERT [dbo].[Suppliers] OFF;

-- Verification
SELECT Id, Name, Code, ContactPerson, Phone, Mobile, City FROM [dbo].[Suppliers] WHERE Id BETWEEN 1 AND 9 ORDER BY Id;
