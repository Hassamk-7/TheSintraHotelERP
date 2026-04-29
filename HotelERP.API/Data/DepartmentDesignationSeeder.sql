-- ============================================
-- INSERT DEPARTMENTS DATA
-- ============================================
SET IDENTITY_INSERT [HMS_DB].[dbo].[Departments] ON

INSERT INTO [HMS_DB].[dbo].[Departments] 
([Id], [Name], [Code], [Description], [ParentDepartmentId], [HeadOfDepartment], [Location], [Phone], [Email], [Budget], [CostCenter], [CreatedBy], [UpdatedBy], [CreatedAt], [UpdatedAt], [IsActive])
VALUES
(1, 'Front Office', 'FO', 'Front Office Department - Guest Reception & Check-in', NULL, 'Ali Hassan', 'Ground Floor', '+92-300-1111111', 'frontoffice@hotel.com', 500000.00, 'CC001', 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(2, 'Housekeeping', 'HK', 'Housekeeping Department - Room Cleaning & Maintenance', NULL, 'Fatima Khan', '1st Floor', '+92-300-2222222', 'housekeeping@hotel.com', 600000.00, 'CC002', 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(3, 'Restaurant', 'REST', 'Restaurant Department - Food Service', NULL, 'Ahmed Ali', '2nd Floor', '+92-300-3333333', 'restaurant@hotel.com', 800000.00, 'CC003', 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(4, 'Kitchen', 'KIT', 'Kitchen Department - Food Preparation', NULL, 'Muhammad Hassan', 'Basement', '+92-300-4444444', 'kitchen@hotel.com', 700000.00, 'CC004', 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(5, 'Maintenance', 'MAINT', 'Maintenance Department - Building & Equipment', NULL, 'Usman Ahmed', 'Basement', '+92-300-5555555', 'maintenance@hotel.com', 450000.00, 'CC005', 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(6, 'Administration', 'ADMIN', 'Administration Department - HR & Finance', NULL, 'Ayesha Malik', 'Ground Floor', '+92-300-6666666', 'admin@hotel.com', 550000.00, 'CC006', 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(7, 'Security', 'SEC', 'Security Department - Building Security', NULL, 'Bilal Khan', 'Main Gate', '+92-300-7777777', 'security@hotel.com', 400000.00, 'CC007', 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(8, 'Finance', 'FIN', 'Finance Department - Accounting & Billing', NULL, 'Sara Ahmed', 'Ground Floor', '+92-300-8888888', 'finance@hotel.com', 500000.00, 'CC008', 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(9, 'Human Resources', 'HR', 'Human Resources Department - Recruitment & Payroll', NULL, 'Zainab Ali', 'Ground Floor', '+92-300-9999999', 'hr@hotel.com', 450000.00, 'CC009', 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(10, 'Guest Services', 'GS', 'Guest Services Department - Guest Support', NULL, 'Hassan Raza', 'Ground Floor', '+92-300-1010101', 'guestservices@hotel.com', 350000.00, 'CC010', 'Admin', 'Admin', GETDATE(), GETDATE(), 1)

SET IDENTITY_INSERT [HMS_DB].[dbo].[Departments] OFF

-- ============================================
-- INSERT DESIGNATIONS DATA
-- ============================================
SET IDENTITY_INSERT [HMS_DB].[dbo].[Designations] ON

INSERT INTO [HMS_DB].[dbo].[Designations]
([Id], [Title], [Code], [Description], [DepartmentId], [Level], [MinSalary], [MaxSalary], [Responsibilities], [Requirements], [Skills], [ReportsToDesignationId], [CreatedBy], [UpdatedBy], [CreatedAt], [UpdatedAt], [IsActive])
VALUES
-- Front Office Designations
(1, 'Front Desk Manager', 'FDM', 'Manages front desk operations', 1, 'Manager', 50000.00, 80000.00, 'Oversee guest check-in/check-out, manage staff', 'Bachelor degree, 5+ years experience', 'Leadership, Communication, Customer Service', NULL, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(2, 'Front Desk Executive', 'FDE', 'Handles guest check-in and inquiries', 1, 'Senior', 35000.00, 50000.00, 'Guest reception, booking management', 'Intermediate education, 3+ years experience', 'Communication, Problem Solving', 1, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(3, 'Receptionist', 'REC', 'Guest reception and phone handling', 1, 'Junior', 20000.00, 30000.00, 'Answer phones, greet guests, basic bookings', 'Intermediate education, 1+ year experience', 'Communication, Typing, Courtesy', 2, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),

-- Housekeeping Designations
(4, 'Housekeeping Manager', 'HKM', 'Manages housekeeping operations', 2, 'Manager', 45000.00, 70000.00, 'Supervise cleaning staff, quality control', 'Bachelor degree, 5+ years experience', 'Leadership, Quality Management', NULL, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(5, 'Senior Housekeeper', 'SHK', 'Senior housekeeping staff', 2, 'Senior', 30000.00, 45000.00, 'Room cleaning, inventory management', 'Intermediate education, 3+ years experience', 'Attention to Detail, Time Management', 4, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(6, 'Housekeeper', 'HK', 'Room cleaning and maintenance', 2, 'Junior', 18000.00, 28000.00, 'Clean rooms, change linens, basic maintenance', 'Basic education, 1+ year experience', 'Physical Fitness, Attention to Detail', 5, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),

-- Restaurant Designations
(7, 'Restaurant Manager', 'RM', 'Manages restaurant operations', 3, 'Manager', 55000.00, 85000.00, 'Oversee service, staff management, quality', 'Bachelor degree, 5+ years experience', 'Leadership, Customer Service, Financial', 1, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(8, 'Head Waiter', 'HW', 'Senior service staff', 3, 'Senior', 32000.00, 48000.00, 'Coordinate service, train staff', 'Intermediate education, 4+ years experience', 'Service Excellence, Leadership', 7, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(9, 'Waiter', 'W', 'Guest service and food delivery', 3, 'Junior', 18000.00, 28000.00, 'Serve guests, take orders, deliver food', 'Basic education, 1+ year experience', 'Communication, Courtesy, Efficiency', 8, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),

-- Kitchen Designations
(10, 'Executive Chef', 'EC', 'Head of kitchen operations', 4, 'Manager', 60000.00, 100000.00, 'Menu planning, kitchen management, quality', 'Culinary degree, 7+ years experience', 'Culinary Skills, Leadership, Innovation', NULL, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(11, 'Senior Chef', 'SC', 'Senior cooking staff', 4, 'Senior', 40000.00, 60000.00, 'Food preparation, recipe development', 'Culinary training, 5+ years experience', 'Culinary Skills, Creativity', 10, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(12, 'Chef', 'CH', 'Food preparation and cooking', 4, 'Junior', 25000.00, 40000.00, 'Prepare dishes, follow recipes', 'Culinary training, 2+ years experience', 'Cooking, Food Safety', 11, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),

-- Maintenance Designations
(13, 'Maintenance Manager', 'MM', 'Manages maintenance operations', 5, 'Manager', 40000.00, 65000.00, 'Oversee repairs, maintenance planning', 'Technical degree, 5+ years experience', 'Technical Knowledge, Leadership', NULL, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(14, 'Senior Technician', 'ST', 'Senior maintenance staff', 5, 'Senior', 28000.00, 42000.00, 'Equipment repair, troubleshooting', 'Technical training, 4+ years experience', 'Technical Skills, Problem Solving', 13, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(15, 'Technician', 'TECH', 'General maintenance and repairs', 5, 'Junior', 18000.00, 28000.00, 'Basic repairs, cleaning, maintenance', 'Basic technical training, 1+ year experience', 'Technical Basics, Physical Fitness', 14, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),

-- Administration Designations
(16, 'HR Manager', 'HRM', 'Manages HR operations', 6, 'Manager', 50000.00, 80000.00, 'Recruitment, payroll, employee relations', 'Bachelor degree, 5+ years experience', 'HR Knowledge, Leadership', NULL, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(17, 'HR Executive', 'HRE', 'HR support and recruitment', 6, 'Senior', 32000.00, 48000.00, 'Recruitment, employee records', 'Bachelor degree, 3+ years experience', 'Communication, Organization', 16, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(18, 'Administrative Officer', 'AO', 'Administrative support', 6, 'Junior', 20000.00, 32000.00, 'Data entry, scheduling, documentation', 'Intermediate education, 1+ year experience', 'Organization, Computer Skills', 17, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),

-- Security Designations
(19, 'Security Manager', 'SECM', 'Manages security operations', 7, 'Manager', 38000.00, 60000.00, 'Security planning, staff supervision', 'Security training, 5+ years experience', 'Leadership, Security Knowledge', NULL, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(20, 'Security Officer', 'SO', 'Building and guest security', 7, 'Junior', 18000.00, 28000.00, 'Patrol, access control, incident response', 'Security training, 2+ years experience', 'Vigilance, Communication, Physical Fitness', 19, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),

-- Finance Designations
(21, 'Finance Manager', 'FM', 'Manages financial operations', 8, 'Manager', 55000.00, 85000.00, 'Accounting, budgeting, financial reporting', 'Bachelor degree, 5+ years experience', 'Accounting, Financial Analysis', NULL, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(22, 'Accountant', 'ACC', 'Financial record keeping', 8, 'Senior', 35000.00, 50000.00, 'Bookkeeping, invoice processing', 'Bachelor degree, 3+ years experience', 'Accounting, Attention to Detail', 21, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),

-- Human Resources Designations
(23, 'HR Director', 'HRD', 'Directs HR strategy', 9, 'Director', 70000.00, 120000.00, 'Strategic HR planning, policy development', 'MBA/Master degree, 8+ years experience', 'Strategic Planning, Leadership', NULL, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(24, 'Payroll Officer', 'PO', 'Payroll processing', 9, 'Senior', 30000.00, 45000.00, 'Salary processing, tax calculations', 'Bachelor degree, 3+ years experience', 'Payroll Software, Accuracy', 23, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),

-- Guest Services Designations
(25, 'Guest Services Manager', 'GSM', 'Manages guest services', 10, 'Manager', 45000.00, 70000.00, 'Guest satisfaction, complaint resolution', 'Bachelor degree, 5+ years experience', 'Customer Service, Leadership', NULL, 'Admin', 'Admin', GETDATE(), GETDATE(), 1),
(26, 'Guest Services Executive', 'GSE', 'Guest support and assistance', 10, 'Senior', 28000.00, 42000.00, 'Guest requests, concierge services', 'Intermediate education, 3+ years experience', 'Communication, Problem Solving', 25, 'Admin', 'Admin', GETDATE(), GETDATE(), 1)

SET IDENTITY_INSERT [HMS_DB].[dbo].[Designations] OFF

-- ============================================
-- VERIFY DATA
-- ============================================
SELECT COUNT(*) as DepartmentCount FROM [HMS_DB].[dbo].[Departments] WHERE IsActive = 1
SELECT COUNT(*) as DesignationCount FROM [HMS_DB].[dbo].[Designations] WHERE IsActive = 1
