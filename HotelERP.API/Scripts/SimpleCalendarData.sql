-- Simple Calendar Data for Testing
USE HMS_DB;
GO

-- Add a few simple booking records for testing
-- First, let's check if we have any existing data
SELECT COUNT(*) as ExistingReservations FROM Reservations;
SELECT COUNT(*) as ExistingGuests FROM Guests;
SELECT COUNT(*) as ExistingRooms FROM Rooms;

-- If we have existing data, let's use it for testing
-- Otherwise, we'll add minimal test data

PRINT 'Calendar API test data check completed';
