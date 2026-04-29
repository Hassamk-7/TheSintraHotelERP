-- Add Calendar Booking Data for Hotel ERP System
-- This script adds 15+ booking records with various statuses for calendar testing

USE HMS_DB;
GO

-- First, ensure we have room types
IF NOT EXISTS (SELECT 1 FROM RoomTypes WHERE Name = 'Standard')
BEGIN
    INSERT INTO RoomTypes (Name, Code, Description, BasePrice, MaxOccupancy, Amenities, BaseRate, CreatedAt, UpdatedAt, IsActive)
    VALUES 
    ('Standard', 'STD', 'Standard room with basic amenities', 4000.00, 2, 'AC, TV, WiFi', 4000.00, GETDATE(), GETDATE(), 1),
    ('Deluxe', 'DLX', 'Deluxe room with premium amenities', 6000.00, 3, 'AC, TV, WiFi, Mini Bar', 6000.00, GETDATE(), GETDATE(), 1),
    ('Suite', 'STE', 'Luxury suite with separate living area', 10000.00, 4, 'AC, TV, WiFi, Mini Bar, Living Room', 10000.00, GETDATE(), GETDATE(), 1),
    ('Executive', 'EXE', 'Executive room with business facilities', 8000.00, 2, 'AC, TV, WiFi, Business Desk', 8000.00, GETDATE(), GETDATE(), 1),
    ('Presidential', 'PRE', 'Presidential suite with VIP amenities', 15000.00, 6, 'AC, TV, WiFi, Mini Bar, Living Room, Jacuzzi', 15000.00, GETDATE(), GETDATE(), 1);
END

-- Ensure we have rooms
IF NOT EXISTS (SELECT 1 FROM Rooms WHERE RoomNumber = '101')
BEGIN
    DECLARE @StandardTypeId INT = (SELECT Id FROM RoomTypes WHERE Name = 'Standard');
    DECLARE @DeluxeTypeId INT = (SELECT Id FROM RoomTypes WHERE Name = 'Deluxe');
    DECLARE @SuiteTypeId INT = (SELECT Id FROM RoomTypes WHERE Name = 'Suite');
    DECLARE @ExecutiveTypeId INT = (SELECT Id FROM RoomTypes WHERE Name = 'Executive');
    DECLARE @PresidentialTypeId INT = (SELECT Id FROM RoomTypes WHERE Name = 'Presidential');

    INSERT INTO Rooms (RoomNumber, RoomTypeId, FloorNumber, Status, CreatedAt, UpdatedAt, IsActive)
    VALUES 
    -- Standard Rooms (Floor 1)
    ('101', @StandardTypeId, 1, 'Available', GETDATE(), GETDATE(), 1),
    ('102', @StandardTypeId, 1, 'Available', GETDATE(), GETDATE(), 1),
    ('103', @StandardTypeId, 1, 'Available', GETDATE(), GETDATE(), 1),
    ('104', @StandardTypeId, 1, 'Available', GETDATE(), GETDATE(), 1),
    ('105', @StandardTypeId, 1, 'Maintenance', GETDATE(), GETDATE(), 1),
    ('106', @StandardTypeId, 1, 'Available', GETDATE(), GETDATE(), 1),
    ('107', @StandardTypeId, 1, 'Available', GETDATE(), GETDATE(), 1),
    
    -- Deluxe Rooms (Floor 2)
    ('201', @DeluxeTypeId, 2, 'Available', GETDATE(), GETDATE(), 1),
    ('202', @DeluxeTypeId, 2, 'Available', GETDATE(), GETDATE(), 1),
    ('203', @DeluxeTypeId, 2, 'Available', GETDATE(), GETDATE(), 1),
    ('204', @DeluxeTypeId, 2, 'Available', GETDATE(), GETDATE(), 1),
    ('205', @DeluxeTypeId, 2, 'Maintenance', GETDATE(), GETDATE(), 1),
    ('206', @DeluxeTypeId, 2, 'Available', GETDATE(), GETDATE(), 1),
    
    -- Suites (Floor 3)
    ('301', @SuiteTypeId, 3, 'Available', GETDATE(), GETDATE(), 1),
    ('302', @SuiteTypeId, 3, 'Available', GETDATE(), GETDATE(), 1),
    ('303', @SuiteTypeId, 3, 'Available', GETDATE(), GETDATE(), 1),
    ('304', @SuiteTypeId, 3, 'Available', GETDATE(), GETDATE(), 1),
    
    -- Executive Rooms (Floor 4)
    ('401', @ExecutiveTypeId, 4, 'Available', GETDATE(), GETDATE(), 1),
    ('402', @ExecutiveTypeId, 4, 'Available', GETDATE(), GETDATE(), 1),
    ('403', @ExecutiveTypeId, 4, 'Available', GETDATE(), GETDATE(), 1),
    
    -- Presidential Suite (Floor 5)
    ('501', @PresidentialTypeId, 5, 'Available', GETDATE(), GETDATE(), 1);
END

-- Add sample guests for bookings
IF NOT EXISTS (SELECT 1 FROM Guests WHERE Email = 'ahmed.hassan@gmail.com')
BEGIN
    INSERT INTO Guests (GuestId, FullName, FirstName, LastName, Email, PhoneNumber, Country, IdType, IdNumber, CreatedAt, UpdatedAt, IsActive)
    VALUES 
    ('G001', 'Ahmed Hassan', 'Ahmed', 'Hassan', 'ahmed.hassan@gmail.com', '+92-300-1234567', 'Pakistan', 'CNIC', '42101-1234567-8', GETDATE(), GETDATE(), 1),
    ('G002', 'Fatima Khan', 'fatima.khan@yahoo.com', '+92-321-9876543', 'Pakistan', 'Passport', 'AB1234567', GETDATE(), GETDATE(), 1),
    ('G003', 'Muhammad Ali', 'muhammad.ali@hotmail.com', '+92-333-5555555', 'Pakistan', 'CNIC', '42301-9876543-2', GETDATE(), GETDATE(), 1),
    ('G004', 'Zain Malik', 'zain.malik@outlook.com', '+92-300-7777777', 'Pakistan', 'CNIC', '42401-7777777-7', GETDATE(), GETDATE(), 1),
    ('G005', 'Sarah Khan', 'sarah.khan@gmail.com', '+92-321-8888888', 'Pakistan', 'CNIC', '42501-8888888-8', GETDATE(), GETDATE(), 1),
    ('G006', 'Usman Ahmed', 'usman.ahmed@gmail.com', '+92-300-1111111', 'Pakistan', 'CNIC', '42101-1111111-1', GETDATE(), GETDATE(), 1),
    ('G007', 'Ayesha Siddiqui', 'ayesha.siddiqui@yahoo.com', '+92-321-2222222', 'Pakistan', 'CNIC', '42201-2222222-2', GETDATE(), GETDATE(), 1),
    ('G008', 'Hassan Raza', 'hassan.raza@hotmail.com', '+92-333-3333333', 'Pakistan', 'Passport', 'CD9876543', GETDATE(), GETDATE(), 1),
    ('G009', 'Nadia Qureshi', 'nadia.qureshi@gmail.com', '+92-300-4444444', 'Pakistan', 'CNIC', '42301-4444444-4', GETDATE(), GETDATE(), 1),
    ('G010', 'Imran Sheikh', 'imran.sheikh@outlook.com', '+92-321-5555555', 'Pakistan', 'CNIC', '42401-5555555-5', GETDATE(), GETDATE(), 1),
    ('G011', 'Farah Malik', 'farah.malik@gmail.com', '+92-333-6666666', 'Pakistan', 'CNIC', '42501-6666666-6', GETDATE(), GETDATE(), 1),
    ('G012', 'Tariq Hussain', 'tariq.hussain@yahoo.com', '+92-300-7777777', 'Pakistan', 'Passport', 'EF5432109', GETDATE(), GETDATE(), 1),
    ('G013', 'Sana Ahmed', 'sana.ahmed@hotmail.com', '+92-321-8888888', 'Pakistan', 'CNIC', '42601-8888888-8', GETDATE(), GETDATE(), 1),
    ('G014', 'Kashif Ali', 'kashif.ali@gmail.com', '+92-333-9999999', 'Pakistan', 'Passport', 'GH8765432', GETDATE(), GETDATE(), 1),
    ('G015', 'Zainab Hassan', 'zainab.hassan@gmail.com', '+92-300-1010101', 'Pakistan', 'CNIC', '42701-1010101-1', GETDATE(), GETDATE(), 1),
    ('G016', 'Ali Raza', 'ali.raza@yahoo.com', '+92-321-1212121', 'Pakistan', 'CNIC', '42801-1212121-2', GETDATE(), GETDATE(), 1),
    ('G017', 'Mariam Khan', 'mariam.khan@hotmail.com', '+92-333-1313131', 'Pakistan', 'CNIC', '42901-1313131-3', GETDATE(), GETDATE(), 1),
    ('G018', 'Faisal Ahmed', 'faisal.ahmed@gmail.com', '+92-300-1414141', 'Pakistan', 'Passport', 'IJ2468135', GETDATE(), GETDATE(), 1);
END

-- Add calendar bookings with various statuses
DELETE FROM Reservations WHERE CheckInDate >= '2025-10-09';

DECLARE @Room101Id INT = (SELECT Id FROM Rooms WHERE RoomNumber = '101');
DECLARE @Room102Id INT = (SELECT Id FROM Rooms WHERE RoomNumber = '102');
DECLARE @Room103Id INT = (SELECT Id FROM Rooms WHERE RoomNumber = '103');
DECLARE @Room104Id INT = (SELECT Id FROM Rooms WHERE RoomNumber = '104');
DECLARE @Room106Id INT = (SELECT Id FROM Rooms WHERE RoomNumber = '106');
DECLARE @Room107Id INT = (SELECT Id FROM Rooms WHERE RoomNumber = '107');
DECLARE @Room201Id INT = (SELECT Id FROM Rooms WHERE RoomNumber = '201');
DECLARE @Room202Id INT = (SELECT Id FROM Rooms WHERE RoomNumber = '202');
DECLARE @Room203Id INT = (SELECT Id FROM Rooms WHERE RoomNumber = '203');
DECLARE @Room204Id INT = (SELECT Id FROM Rooms WHERE RoomNumber = '204');
DECLARE @Room206Id INT = (SELECT Id FROM Rooms WHERE RoomNumber = '206');
DECLARE @Room301Id INT = (SELECT Id FROM Rooms WHERE RoomNumber = '301');
DECLARE @Room302Id INT = (SELECT Id FROM Rooms WHERE RoomNumber = '302');
DECLARE @Room303Id INT = (SELECT Id FROM Rooms WHERE RoomNumber = '303');
DECLARE @Room304Id INT = (SELECT Id FROM Rooms WHERE RoomNumber = '304');
DECLARE @Room401Id INT = (SELECT Id FROM Rooms WHERE RoomNumber = '401');
DECLARE @Room402Id INT = (SELECT Id FROM Rooms WHERE RoomNumber = '402');
DECLARE @Room501Id INT = (SELECT Id FROM Rooms WHERE RoomNumber = '501');

-- Get guest IDs
DECLARE @Guest1Id INT = (SELECT Id FROM Guests WHERE Email = 'ahmed.hassan@gmail.com');
DECLARE @Guest2Id INT = (SELECT Id FROM Guests WHERE Email = 'fatima.khan@yahoo.com');
DECLARE @Guest3Id INT = (SELECT Id FROM Guests WHERE Email = 'muhammad.ali@hotmail.com');
DECLARE @Guest4Id INT = (SELECT Id FROM Guests WHERE Email = 'zain.malik@outlook.com');
DECLARE @Guest5Id INT = (SELECT Id FROM Guests WHERE Email = 'sarah.khan@gmail.com');
DECLARE @Guest6Id INT = (SELECT Id FROM Guests WHERE Email = 'usman.ahmed@gmail.com');
DECLARE @Guest7Id INT = (SELECT Id FROM Guests WHERE Email = 'ayesha.siddiqui@yahoo.com');
DECLARE @Guest8Id INT = (SELECT Id FROM Guests WHERE Email = 'hassan.raza@hotmail.com');
DECLARE @Guest9Id INT = (SELECT Id FROM Guests WHERE Email = 'nadia.qureshi@gmail.com');
DECLARE @Guest10Id INT = (SELECT Id FROM Guests WHERE Email = 'imran.sheikh@outlook.com');
DECLARE @Guest11Id INT = (SELECT Id FROM Guests WHERE Email = 'farah.malik@gmail.com');
DECLARE @Guest12Id INT = (SELECT Id FROM Guests WHERE Email = 'tariq.hussain@yahoo.com');
DECLARE @Guest13Id INT = (SELECT Id FROM Guests WHERE Email = 'sana.ahmed@hotmail.com');
DECLARE @Guest14Id INT = (SELECT Id FROM Guests WHERE Email = 'kashif.ali@gmail.com');
DECLARE @Guest15Id INT = (SELECT Id FROM Guests WHERE Email = 'zainab.hassan@gmail.com');
DECLARE @Guest16Id INT = (SELECT Id FROM Guests WHERE Email = 'ali.raza@yahoo.com');
DECLARE @Guest17Id INT = (SELECT Id FROM Guests WHERE Email = 'mariam.khan@hotmail.com');
DECLARE @Guest18Id INT = (SELECT Id FROM Guests WHERE Email = 'faisal.ahmed@gmail.com');

-- Insert 18 booking records with various statuses
INSERT INTO Reservations (
    GuestId, RoomId, CheckInDate, CheckOutDate, NumberOfAdults, NumberOfChildren, 
    TotalAmount, TotalPaid, Status, SpecialRequests, CreatedAt, UpdatedAt, IsActive
)
VALUES 
-- Occupied bookings (CheckedIn status)
(@Guest1Id, @Room101Id, '2025-10-09', '2025-10-12', 2, 0, 15000.00, 15000.00, 'CheckedIn', 'Late checkout requested', GETDATE(), GETDATE(), 1),
(@Guest2Id, @Room102Id, '2025-10-10', '2025-10-13', 2, 1, 18000.00, 18000.00, 'CheckedIn', 'Extra bed for child', GETDATE(), GETDATE(), 1),
(@Guest3Id, @Room201Id, '2025-10-11', '2025-10-15', 3, 2, 60000.00, 60000.00, 'CheckedIn', 'Airport pickup arranged', GETDATE(), GETDATE(), 1),
(@Guest4Id, @Room202Id, '2025-10-12', '2025-10-16', 2, 1, 45000.00, 45000.00, 'CheckedIn', 'Business center access', GETDATE(), GETDATE(), 1),
(@Guest7Id, @Room104Id, '2025-10-15', '2025-10-19', 2, 2, 24000.00, 24000.00, 'CheckedIn', 'Family room with connecting door', GETDATE(), GETDATE(), 1),
(@Guest9Id, @Room204Id, '2025-10-17', '2025-10-21', 3, 0, 50000.00, 50000.00, 'CheckedIn', 'Business facilities required', GETDATE(), GETDATE(), 1),
(@Guest11Id, @Room303Id, '2025-10-19', '2025-10-24', 2, 1, 85000.00, 85000.00, 'CheckedIn', 'Late checkout', GETDATE(), GETDATE(), 1),
(@Guest13Id, @Room402Id, '2025-10-21', '2025-10-26', 1, 0, 60000.00, 60000.00, 'CheckedIn', 'Business meeting room', GETDATE(), GETDATE(), 1),
(@Guest16Id, @Room107Id, '2025-10-26', '2025-10-30', 1, 0, 16000.00, 16000.00, 'CheckedIn', 'Extended stay possible', GETDATE(), GETDATE(), 1),
(@Guest18Id, @Room304Id, '2025-10-28', '2025-11-02', 3, 1, 95000.00, 95000.00, 'CheckedIn', 'Conference room booking', GETDATE(), GETDATE(), 1),

-- Reservation bookings (Confirmed status)
(@Guest5Id, @Room301Id, '2025-10-13', '2025-10-18', 2, 0, 75000.00, 25000.00, 'Confirmed', 'Honeymoon package', GETDATE(), GETDATE(), 1),
(@Guest6Id, @Room103Id, '2025-10-14', '2025-10-17', 1, 0, 12000.00, 4000.00, 'Confirmed', 'Quiet room requested', GETDATE(), GETDATE(), 1),
(@Guest8Id, @Room203Id, '2025-10-16', '2025-10-20', 2, 1, 40000.00, 15000.00, 'Confirmed', 'Sea view room', GETDATE(), GETDATE(), 1),
(@Guest10Id, @Room302Id, '2025-10-18', '2025-10-23', 2, 0, 90000.00, 30000.00, 'Confirmed', 'Anniversary celebration', GETDATE(), GETDATE(), 1),
(@Guest12Id, @Room401Id, '2025-10-20', '2025-10-25', 2, 0, 75000.00, 25000.00, 'Confirmed', 'Executive lounge access', GETDATE(), GETDATE(), 1),
(@Guest14Id, @Room501Id, '2025-10-22', '2025-10-28', 4, 2, 180000.00, 60000.00, 'Confirmed', 'VIP treatment, airport transfer', GETDATE(), GETDATE(), 1),
(@Guest15Id, @Room106Id, '2025-10-25', '2025-10-29', 2, 1, 20000.00, 8000.00, 'Confirmed', 'Ground floor room', GETDATE(), GETDATE(), 1),
(@Guest17Id, @Room206Id, '2025-10-27', '2025-11-01', 2, 2, 55000.00, 20000.00, 'Confirmed', 'Family package with meals', GETDATE(), GETDATE(), 1);

-- Update room statuses for maintenance
UPDATE Rooms SET Status = 'Maintenance' WHERE RoomNumber = '105';
UPDATE Rooms SET Status = 'Maintenance' WHERE RoomNumber = '205';

PRINT 'Successfully added 18 booking records and updated room statuses for calendar testing';
PRINT 'Bookings include:';
PRINT '- 10 Occupied bookings (CheckedIn status)';
PRINT '- 8 Reservation bookings (Confirmed status)';
PRINT '- 2 Blocked rooms (Maintenance status)';
