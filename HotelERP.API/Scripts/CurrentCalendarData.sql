-- Add Current Calendar Data for October 2025
USE HMS_DB;
GO

-- Add current month reservations (October 2025)
INSERT INTO Reservations (ReservationNumber, GuestId, RoomId, CheckInDate, CheckOutDate, NumberOfAdults, NumberOfChildren, Status, SpecialRequests, TotalAmount, TotalPaid, PaymentStatus, CreatedAt, UpdatedAt, IsActive)
VALUES 
-- Current bookings for October 2025
('RES101', 1, 1, '2025-10-09 14:00:00', '2025-10-12 11:00:00', 2, 0, 'CheckedIn', 'Late checkout requested', 15000.00, 15000.00, 'Paid', GETDATE(), GETDATE(), 1),
('RES102', 2, 2, '2025-10-10 15:00:00', '2025-10-13 12:00:00', 2, 1, 'CheckedIn', 'Extra bed for child', 18000.00, 18000.00, 'Paid', GETDATE(), GETDATE(), 1),
('RES103', 3, 3, '2025-10-11 16:00:00', '2025-10-14 10:00:00', 2, 0, 'Confirmed', 'Quiet room preferred', 21000.00, 10500.00, 'Partial', GETDATE(), GETDATE(), 1),
('RES104', 4, 4, '2025-10-12 14:30:00', '2025-10-15 11:30:00', 1, 0, 'Confirmed', 'Business traveler', 24000.00, 12000.00, 'Partial', GETDATE(), GETDATE(), 1),
('RES105', 5, 5, '2025-10-13 15:30:00', '2025-10-16 12:00:00', 2, 0, 'Confirmed', 'Anniversary celebration', 18000.00, 9000.00, 'Partial', GETDATE(), GETDATE(), 1),

-- Future bookings
('RES106', 1, 6, '2025-10-15 14:00:00', '2025-10-18 11:00:00', 2, 1, 'Confirmed', 'Family vacation', 21000.00, 10500.00, 'Partial', GETDATE(), GETDATE(), 1),
('RES107', 2, 7, '2025-10-16 15:00:00', '2025-10-19 12:00:00', 1, 0, 'Confirmed', 'Solo traveler', 15000.00, 7500.00, 'Partial', GETDATE(), GETDATE(), 1),
('RES108', 3, 8, '2025-10-17 16:00:00', '2025-10-20 10:00:00', 2, 2, 'Confirmed', 'Family with children', 24000.00, 12000.00, 'Partial', GETDATE(), GETDATE(), 1);

PRINT 'Added current calendar data for October 2025';
