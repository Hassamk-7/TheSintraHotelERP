-- Insert sample hotels
INSERT INTO Hotels (HotelName, HotelCode, Address, City, State, Country, PostalCode, PhoneNumber, Email, Website, GSTNumber, PANNumber, LicenseNumber, ManagerName, ManagerPhone, ManagerEmail, TotalRooms, TotalFloors, EstablishedDate, StarRating, Description, IsMainBranch, Currency, TimeZone, IsActive, CreatedAt, UpdatedAt)
VALUES 
('Pearl Continental Hotel Karachi', 'PC-KHI-001', 'Club Road, Karachi', 'Karachi', 'Sindh', 'Pakistan', '75530', '+92-21-111-505-505', 'info@pckarachi.com', 'https://www.pchotels.com', 'GST-001-PC-KHI', 'PAN-001-PC-KHI', 'LIC-001-PC-KHI', 'Ahmed Hassan', '+92-300-1234567', 'manager@pckarachi.com', 350, 15, '1985-06-15', '5 Star', 'Luxury 5-star hotel in the heart of Karachi', 1, 'PKR', 'Asia/Karachi', 1, GETDATE(), GETDATE()),
('Serena Hotel Islamabad', 'SER-ISB-001', 'Khayaban-e-Suharwardy, Islamabad', 'Islamabad', 'Federal Capital Territory', 'Pakistan', '44000', '+92-51-287-4000', 'islamabad@serenahotels.com', 'https://www.serenahotels.com', 'GST-002-SER-ISB', 'PAN-002-SER-ISB', 'LIC-002-SER-ISB', 'Fatima Khan', '+92-300-9876543', 'manager@serenaislamabad.com', 387, 12, '1990-03-20', '5 Star', 'Premium hotel with modern amenities in the capital city', 0, 'PKR', 'Asia/Karachi', 1, GETDATE(), GETDATE()),
('Avari Hotel Lahore', 'AVR-LHR-001', '87 Shahrah-e-Quaid-e-Azam, Lahore', 'Lahore', 'Punjab', 'Pakistan', '54000', '+92-42-3636-2200', 'lahore@avarihotels.com', 'https://www.avarihotels.com', 'GST-003-AVR-LHR', 'PAN-003-AVR-LHR', 'LIC-003-AVR-LHR', 'Ali Raza', '+92-300-5555555', 'manager@avarilahore.com', 180, 8, '1975-12-10', '4 Star', 'Historic luxury hotel in the cultural capital of Pakistan', 0, 'PKR', 'Asia/Karachi', 1, GETDATE(), GETDATE());

-- Insert sample currencies
INSERT INTO Currencies (Name, Code, Symbol, ExchangeRate, IsBaseCurrency, IsActive, CreatedAt, UpdatedAt)
VALUES 
('Pakistani Rupee', 'PKR', 'Rs', 1.00, 1, 1, GETDATE(), GETDATE()),
('US Dollar', 'USD', '$', 0.0036, 0, 1, GETDATE(), GETDATE()),
('Euro', 'EUR', '€', 0.0033, 0, 1, GETDATE(), GETDATE());

-- Insert sample suppliers
INSERT INTO Suppliers (Name, Code, ContactPerson, Email, Phone, Mobile, Address, City, Country, TaxNumber, Notes, IsActive, CreatedAt, UpdatedAt)
VALUES 
('ABC Food Suppliers', 'ABC-001', 'Muhammad Ali', 'ali@abcfood.com', '+92-21-1234567', '+92-300-1111111', 'Industrial Area, Karachi', 'Karachi', 'Pakistan', 'TAX-001-ABC', 'Premium food supplier for hotels', 1, GETDATE(), GETDATE()),
('XYZ Textile Mills', 'XYZ-002', 'Sarah Ahmed', 'sarah@xyztextile.com', '+92-42-2345678', '+92-301-2222222', 'Textile City, Faisalabad', 'Faisalabad', 'Pakistan', 'TAX-002-XYZ', 'Bed sheets and towels supplier', 1, GETDATE(), GETDATE()),
('PQR Electronics', 'PQR-003', 'Hassan Khan', 'hassan@pqrelectronics.com', '+92-51-3456789', '+92-302-3333333', 'Blue Area, Islamabad', 'Islamabad', 'Pakistan', 'TAX-003-PQR', 'Hotel electronics and appliances', 1, GETDATE(), GETDATE());

-- Insert sample guests
INSERT INTO GuestMasters (FirstName, LastName, GuestCode, PhoneNumber, Email, Address, City, Country, IdType, IdNumber, DateOfBirth, Gender, Nationality, Company, GuestType, IsActive, CreatedAt, UpdatedAt)
VALUES 
('Ahmed', 'Hassan', 'GUEST-001', '+92-300-1234567', 'ahmed.hassan@email.com', 'DHA Phase 5, Karachi', 'Karachi', 'Pakistan', 'CNIC', '42101-1234567-1', '1985-05-15', 'Male', 'Pakistani', 'Tech Solutions Ltd', 'Business', 1, GETDATE(), GETDATE()),
('Fatima', 'Khan', 'GUEST-002', '+92-301-2345678', 'fatima.khan@email.com', 'F-7 Islamabad', 'Islamabad', 'Pakistan', 'CNIC', '61101-2345678-2', '1990-08-22', 'Female', 'Pakistani', 'Marketing Agency', 'Business', 1, GETDATE(), GETDATE()),
('John', 'Smith', 'GUEST-003', '+1-555-123-4567', 'john.smith@email.com', '123 Main St, New York', 'New York', 'USA', 'Passport', 'US123456789', '1980-12-10', 'Male', 'American', 'Global Corp', 'International', 1, GETDATE(), GETDATE());

-- Insert sample room types
INSERT INTO RoomTypes (Name, Code, Description, BasePrice, MaxOccupancy, Amenities, IsActive, CreatedAt, UpdatedAt)
VALUES 
('Standard Single', 'STD-S', 'Comfortable single room with basic amenities', 8000.00, 1, 'AC,TV,WiFi,Bathroom', 1, GETDATE(), GETDATE()),
('Deluxe Double', 'DLX-D', 'Spacious double room with premium amenities', 12000.00, 2, 'AC,TV,WiFi,Bathroom,Minibar,Balcony', 1, GETDATE(), GETDATE()),
('Executive Suite', 'EXE-S', 'Luxury suite with separate living area', 25000.00, 4, 'AC,TV,WiFi,Bathroom,Minibar,Balcony,LivingRoom,KitchenArea', 1, GETDATE(), GETDATE());
