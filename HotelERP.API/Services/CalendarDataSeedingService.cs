using HotelERP.API.Data;
using HotelERP.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelERP.API.Services
{
    public class CalendarDataSeedingService
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<CalendarDataSeedingService> _logger;

        public CalendarDataSeedingService(HotelDbContext context, ILogger<CalendarDataSeedingService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task SeedCalendarDataAsync()
        {
            try
            {
                _logger.LogInformation("Starting calendar data seeding...");

                // Check if we already have sample data
                var existingReservations = await _context.Reservations.CountAsync();
                if (existingReservations > 0)
                {
                    _logger.LogInformation($"Calendar data already exists ({existingReservations} reservations). Skipping seeding.");
                    return;
                }

                // Ensure we have room types
                await EnsureRoomTypesExist();

                // Ensure we have rooms
                await EnsureRoomsExist();

                // Create sample guests
                await CreateSampleGuests();

                // Create sample reservations
                await CreateSampleReservations();

                await _context.SaveChangesAsync();
                _logger.LogInformation("Calendar data seeding completed successfully!");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during calendar data seeding");
                throw;
            }
        }

        private async Task EnsureRoomTypesExist()
        {
            var roomTypes = new[]
            {
                new RoomType { Name = "Standard", Code = "STD", Description = "Comfortable standard room", BasePrice = 7000, MaxOccupancy = 2, Amenities = "AC, TV, WiFi, Mini Fridge" },
                new RoomType { Name = "Deluxe", Code = "DLX", Description = "Spacious deluxe room", BasePrice = 14000, MaxOccupancy = 3, Amenities = "AC, TV, WiFi, Mini Fridge, Sofa, Work Desk" },
                new RoomType { Name = "Suite", Code = "STE", Description = "Luxury suite with living area", BasePrice = 25000, MaxOccupancy = 4, Amenities = "AC, TV, WiFi, Mini Fridge, Sofa, Work Desk, Kitchenette, Balcony" },
                new RoomType { Name = "Executive", Code = "EXE", Description = "Executive room with premium amenities", BasePrice = 18000, MaxOccupancy = 2, Amenities = "AC, TV, WiFi, Mini Fridge, Work Desk, Executive Lounge Access" }
            };

            foreach (var roomType in roomTypes)
            {
                var existing = await _context.RoomTypes.FirstOrDefaultAsync(rt => rt.Code == roomType.Code);
                if (existing == null)
                {
                    _context.RoomTypes.Add(roomType);
                }
            }
            await _context.SaveChangesAsync();
        }

        private async Task EnsureRoomsExist()
        {
            var roomTypes = await _context.RoomTypes.ToListAsync();
            var standardType = roomTypes.First(rt => rt.Code == "STD");
            var deluxeType = roomTypes.First(rt => rt.Code == "DLX");
            var suiteType = roomTypes.First(rt => rt.Code == "STE");
            var executiveType = roomTypes.First(rt => rt.Code == "EXE");

            var rooms = new[]
            {
                // Standard Rooms (Floor 1)
                new Room { RoomNumber = "101", RoomTypeId = standardType.Id, FloorNumber = 1, Status = "Available", MaxAdults = 2, MaxChildren = 1, BasePrice = 7000 },
                new Room { RoomNumber = "102", RoomTypeId = standardType.Id, FloorNumber = 1, Status = "Available", MaxAdults = 2, MaxChildren = 1, BasePrice = 7000 },
                new Room { RoomNumber = "103", RoomTypeId = standardType.Id, FloorNumber = 1, Status = "Available", MaxAdults = 2, MaxChildren = 1, BasePrice = 7000 },
                new Room { RoomNumber = "104", RoomTypeId = standardType.Id, FloorNumber = 1, Status = "Available", MaxAdults = 2, MaxChildren = 1, BasePrice = 7000 },
                new Room { RoomNumber = "105", RoomTypeId = standardType.Id, FloorNumber = 1, Status = "Out of Order", MaxAdults = 2, MaxChildren = 1, BasePrice = 7000 },

                // Deluxe Rooms (Floor 2)
                new Room { RoomNumber = "201", RoomTypeId = deluxeType.Id, FloorNumber = 2, Status = "Available", MaxAdults = 3, MaxChildren = 2, BasePrice = 14000 },
                new Room { RoomNumber = "202", RoomTypeId = deluxeType.Id, FloorNumber = 2, Status = "Available", MaxAdults = 3, MaxChildren = 2, BasePrice = 14000 },
                new Room { RoomNumber = "203", RoomTypeId = deluxeType.Id, FloorNumber = 2, Status = "Available", MaxAdults = 3, MaxChildren = 2, BasePrice = 14000 },
                new Room { RoomNumber = "204", RoomTypeId = deluxeType.Id, FloorNumber = 2, Status = "Available", MaxAdults = 3, MaxChildren = 2, BasePrice = 14000 },

                // Suite Rooms (Floor 3)
                new Room { RoomNumber = "301", RoomTypeId = suiteType.Id, FloorNumber = 3, Status = "Available", MaxAdults = 4, MaxChildren = 2, BasePrice = 25000 },
                new Room { RoomNumber = "302", RoomTypeId = suiteType.Id, FloorNumber = 3, Status = "Available", MaxAdults = 4, MaxChildren = 2, BasePrice = 25000 },
                new Room { RoomNumber = "303", RoomTypeId = suiteType.Id, FloorNumber = 3, Status = "Available", MaxAdults = 4, MaxChildren = 2, BasePrice = 25000 },

                // Executive Rooms (Floor 4)
                new Room { RoomNumber = "401", RoomTypeId = executiveType.Id, FloorNumber = 4, Status = "Available", MaxAdults = 2, MaxChildren = 1, BasePrice = 18000 },
                new Room { RoomNumber = "402", RoomTypeId = executiveType.Id, FloorNumber = 4, Status = "Available", MaxAdults = 2, MaxChildren = 1, BasePrice = 18000 },
                new Room { RoomNumber = "403", RoomTypeId = executiveType.Id, FloorNumber = 4, Status = "Available", MaxAdults = 2, MaxChildren = 1, BasePrice = 18000 }
            };

            foreach (var room in rooms)
            {
                var existing = await _context.Rooms.FirstOrDefaultAsync(r => r.RoomNumber == room.RoomNumber);
                if (existing == null)
                {
                    _context.Rooms.Add(room);
                }
            }
            await _context.SaveChangesAsync();
        }

        private async Task CreateSampleGuests()
        {
            var guests = new[]
            {
                new Guest { GuestId = "G001", FullName = "Ahmed Hassan", PhoneNumber = "+92-300-1234567", Email = "ahmed.hassan@gmail.com", Country = "Pakistan", IdType = "CNIC", IdNumber = "42101-1234567-8", Address = "Block A, Gulberg, Lahore", City = "Lahore", Gender = "Male" },
                new Guest { GuestId = "G002", FullName = "Fatima Khan", PhoneNumber = "+92-321-9876543", Email = "fatima.khan@yahoo.com", Country = "Pakistan", IdType = "Passport", IdNumber = "AB1234567", Address = "DHA Phase 5, Karachi", City = "Karachi", Gender = "Female" },
                new Guest { GuestId = "G003", FullName = "Muhammad Ali", PhoneNumber = "+92-333-5555555", Email = "muhammad.ali@hotmail.com", Country = "Pakistan", IdType = "CNIC", IdNumber = "42301-9876543-2", Address = "F-8 Markaz, Islamabad", City = "Islamabad", Gender = "Male" },
                new Guest { GuestId = "G004", FullName = "Zain Malik", PhoneNumber = "+92-300-7777777", Email = "zain.malik@outlook.com", Country = "Pakistan", IdType = "CNIC", IdNumber = "42401-7777777-7", Address = "Model Town, Lahore", City = "Lahore", Gender = "Male" },
                new Guest { GuestId = "G005", FullName = "Sarah Khan", PhoneNumber = "+92-321-8888888", Email = "sarah.khan@gmail.com", Country = "Pakistan", IdType = "CNIC", IdNumber = "42301-8888888-8", Address = "Clifton Block 2, Karachi", City = "Karachi", Gender = "Female" },
                new Guest { GuestId = "G006", FullName = "Hassan Ali", PhoneNumber = "+92-333-9999999", Email = "hassan.ali@yahoo.com", Country = "Pakistan", IdType = "CNIC", IdNumber = "42201-9999999-9", Address = "Blue Area, Islamabad", City = "Islamabad", Gender = "Male" },
                new Guest { GuestId = "G007", FullName = "Ayesha Ahmed", PhoneNumber = "+92-345-1111111", Email = "ayesha.ahmed@gmail.com", Country = "Pakistan", IdType = "CNIC", IdNumber = "42201-5555555-5", Address = "Johar Town, Lahore", City = "Lahore", Gender = "Female" },
                new Guest { GuestId = "G008", FullName = "Usman Khan", PhoneNumber = "+92-301-2222222", Email = "usman.khan@gmail.com", Country = "Pakistan", IdType = "CNIC", IdNumber = "42101-2222222-3", Address = "Bahria Town, Karachi", City = "Karachi", Gender = "Male" },
                new Guest { GuestId = "G009", FullName = "Mariam Sheikh", PhoneNumber = "+92-322-3333333", Email = "mariam.sheikh@yahoo.com", Country = "Pakistan", IdType = "CNIC", IdNumber = "42201-3333333-4", Address = "G-9 Markaz, Islamabad", City = "Islamabad", Gender = "Female" },
                new Guest { GuestId = "G010", FullName = "Ali Raza", PhoneNumber = "+92-334-4444444", Email = "ali.raza@hotmail.com", Country = "Pakistan", IdType = "CNIC", IdNumber = "42401-4444444-5", Address = "Cantt Area, Lahore", City = "Lahore", Gender = "Male" },
                new Guest { GuestId = "G011", FullName = "Nadia Iqbal", PhoneNumber = "+92-315-5555555", Email = "nadia.iqbal@gmail.com", Country = "Pakistan", IdType = "CNIC", IdNumber = "42101-5555555-6", Address = "North Nazimabad, Karachi", City = "Karachi", Gender = "Female" },
                new Guest { GuestId = "G012", FullName = "Tariq Mahmood", PhoneNumber = "+92-300-6666666", Email = "tariq.mahmood@outlook.com", Country = "Pakistan", IdType = "CNIC", IdNumber = "42301-6666666-7", Address = "Sector I-8, Islamabad", City = "Islamabad", Gender = "Male" },
                new Guest { GuestId = "G013", FullName = "Sana Malik", PhoneNumber = "+92-331-7777777", Email = "sana.malik@yahoo.com", Country = "Pakistan", IdType = "CNIC", IdNumber = "42201-7777777-8", Address = "Valencia Town, Lahore", City = "Lahore", Gender = "Female" },
                new Guest { GuestId = "G014", FullName = "Kamran Ahmed", PhoneNumber = "+92-323-8888888", Email = "kamran.ahmed@gmail.com", Country = "Pakistan", IdType = "CNIC", IdNumber = "42401-8888888-9", Address = "Gulshan-e-Iqbal, Karachi", City = "Karachi", Gender = "Male" }
            };

            foreach (var guest in guests)
            {
                var existing = await _context.Guests.FirstOrDefaultAsync(g => g.GuestId == guest.GuestId);
                if (existing == null)
                {
                    _context.Guests.Add(guest);
                }
            }
            await _context.SaveChangesAsync();
        }

        private async Task CreateSampleReservations()
        {
            var guests = await _context.Guests.ToListAsync();
            var rooms = await _context.Rooms.Where(r => r.Status == "Available").ToListAsync();

            var reservations = new[]
            {
                // Current bookings (October 2025)
                new Reservation 
                { 
                    ReservationNumber = "RES001", 
                    GuestId = guests.First(g => g.GuestId == "G001").Id, 
                    RoomId = rooms.First(r => r.RoomNumber == "101").Id,
                    CheckInDate = new DateTime(2025, 10, 9), 
                    CheckOutDate = new DateTime(2025, 10, 12), 
                    NumberOfAdults = 2, 
                    NumberOfChildren = 0, 
                    Status = "CheckedIn", 
                    SpecialRequests = "Late checkout requested", 
                    TotalAmount = 21000, 
                    TotalPaid = 21000, 
                    PaymentStatus = "Paid" 
                },
                new Reservation 
                { 
                    ReservationNumber = "RES002", 
                    GuestId = guests.First(g => g.GuestId == "G002").Id, 
                    RoomId = rooms.First(r => r.RoomNumber == "102").Id,
                    CheckInDate = new DateTime(2025, 10, 10), 
                    CheckOutDate = new DateTime(2025, 10, 13), 
                    NumberOfAdults = 2, 
                    NumberOfChildren = 1, 
                    Status = "CheckedIn", 
                    SpecialRequests = "Extra bed for child", 
                    TotalAmount = 21000, 
                    TotalPaid = 21000, 
                    PaymentStatus = "Paid" 
                },
                new Reservation 
                { 
                    ReservationNumber = "RES003", 
                    GuestId = guests.First(g => g.GuestId == "G003").Id, 
                    RoomId = rooms.First(r => r.RoomNumber == "201").Id,
                    CheckInDate = new DateTime(2025, 10, 11), 
                    CheckOutDate = new DateTime(2025, 10, 15), 
                    NumberOfAdults = 3, 
                    NumberOfChildren = 2, 
                    Status = "CheckedIn", 
                    SpecialRequests = "Airport pickup arranged", 
                    TotalAmount = 56000, 
                    TotalPaid = 56000, 
                    PaymentStatus = "Paid" 
                },
                new Reservation 
                { 
                    ReservationNumber = "RES004", 
                    GuestId = guests.First(g => g.GuestId == "G004").Id, 
                    RoomId = rooms.First(r => r.RoomNumber == "202").Id,
                    CheckInDate = new DateTime(2025, 10, 12), 
                    CheckOutDate = new DateTime(2025, 10, 16), 
                    NumberOfAdults = 2, 
                    NumberOfChildren = 1, 
                    Status = "CheckedIn", 
                    SpecialRequests = "Business center access", 
                    TotalAmount = 56000, 
                    TotalPaid = 56000, 
                    PaymentStatus = "Paid" 
                },
                new Reservation 
                { 
                    ReservationNumber = "RES005", 
                    GuestId = guests.First(g => g.GuestId == "G005").Id, 
                    RoomId = rooms.First(r => r.RoomNumber == "301").Id,
                    CheckInDate = new DateTime(2025, 10, 13), 
                    CheckOutDate = new DateTime(2025, 10, 18), 
                    NumberOfAdults = 2, 
                    NumberOfChildren = 0, 
                    Status = "Confirmed", 
                    SpecialRequests = "Honeymoon package", 
                    TotalAmount = 125000, 
                    TotalPaid = 37500, 
                    PaymentStatus = "Partial" 
                },
                new Reservation 
                { 
                    ReservationNumber = "RES006", 
                    GuestId = guests.First(g => g.GuestId == "G006").Id, 
                    RoomId = rooms.First(r => r.RoomNumber == "302").Id,
                    CheckInDate = new DateTime(2025, 10, 14), 
                    CheckOutDate = new DateTime(2025, 10, 17), 
                    NumberOfAdults = 1, 
                    NumberOfChildren = 0, 
                    Status = "Confirmed", 
                    SpecialRequests = "Quiet room preferred", 
                    TotalAmount = 75000, 
                    TotalPaid = 25000, 
                    PaymentStatus = "Partial" 
                },
                new Reservation 
                { 
                    ReservationNumber = "RES007", 
                    GuestId = guests.First(g => g.GuestId == "G007").Id, 
                    RoomId = rooms.First(r => r.RoomNumber == "401").Id,
                    CheckInDate = new DateTime(2025, 10, 15), 
                    CheckOutDate = new DateTime(2025, 10, 20), 
                    NumberOfAdults = 4, 
                    NumberOfChildren = 2, 
                    Status = "Confirmed", 
                    SpecialRequests = "Family suite with connecting rooms", 
                    TotalAmount = 90000, 
                    TotalPaid = 27000, 
                    PaymentStatus = "Partial" 
                },
                new Reservation 
                { 
                    ReservationNumber = "RES008", 
                    GuestId = guests.First(g => g.GuestId == "G008").Id, 
                    RoomId = rooms.First(r => r.RoomNumber == "103").Id,
                    CheckInDate = new DateTime(2025, 10, 16), 
                    CheckOutDate = new DateTime(2025, 10, 19), 
                    NumberOfAdults = 2, 
                    NumberOfChildren = 0, 
                    Status = "Confirmed", 
                    SpecialRequests = "Non-smoking room", 
                    TotalAmount = 21000, 
                    TotalPaid = 10500, 
                    PaymentStatus = "Partial" 
                },
                new Reservation 
                { 
                    ReservationNumber = "RES009", 
                    GuestId = guests.First(g => g.GuestId == "G009").Id, 
                    RoomId = rooms.First(r => r.RoomNumber == "203").Id,
                    CheckInDate = new DateTime(2025, 10, 17), 
                    CheckOutDate = new DateTime(2025, 10, 21), 
                    NumberOfAdults = 3, 
                    NumberOfChildren = 1, 
                    Status = "Confirmed", 
                    SpecialRequests = "High floor room with city view", 
                    TotalAmount = 56000, 
                    TotalPaid = 28000, 
                    PaymentStatus = "Partial" 
                },
                new Reservation 
                { 
                    ReservationNumber = "RES010", 
                    GuestId = guests.First(g => g.GuestId == "G010").Id, 
                    RoomId = rooms.First(r => r.RoomNumber == "402").Id,
                    CheckInDate = new DateTime(2025, 10, 18), 
                    CheckOutDate = new DateTime(2025, 10, 22), 
                    NumberOfAdults = 2, 
                    NumberOfChildren = 0, 
                    Status = "Confirmed", 
                    SpecialRequests = "Executive lounge access", 
                    TotalAmount = 72000, 
                    TotalPaid = 36000, 
                    PaymentStatus = "Partial" 
                },
                new Reservation 
                { 
                    ReservationNumber = "RES011", 
                    GuestId = guests.First(g => g.GuestId == "G011").Id, 
                    RoomId = rooms.First(r => r.RoomNumber == "104").Id,
                    CheckInDate = new DateTime(2025, 10, 19), 
                    CheckOutDate = new DateTime(2025, 10, 23), 
                    NumberOfAdults = 1, 
                    NumberOfChildren = 0, 
                    Status = "Confirmed", 
                    SpecialRequests = "Early check-in if possible", 
                    TotalAmount = 28000, 
                    TotalPaid = 14000, 
                    PaymentStatus = "Partial" 
                },
                new Reservation 
                { 
                    ReservationNumber = "RES012", 
                    GuestId = guests.First(g => g.GuestId == "G012").Id, 
                    RoomId = rooms.First(r => r.RoomNumber == "303").Id,
                    CheckInDate = new DateTime(2025, 10, 20), 
                    CheckOutDate = new DateTime(2025, 10, 25), 
                    NumberOfAdults = 4, 
                    NumberOfChildren = 3, 
                    Status = "Confirmed", 
                    SpecialRequests = "Family package with extra amenities", 
                    TotalAmount = 125000, 
                    TotalPaid = 50000, 
                    PaymentStatus = "Partial" 
                },
                new Reservation 
                { 
                    ReservationNumber = "RES013", 
                    GuestId = guests.First(g => g.GuestId == "G013").Id, 
                    RoomId = rooms.First(r => r.RoomNumber == "204").Id,
                    CheckInDate = new DateTime(2025, 10, 21), 
                    CheckOutDate = new DateTime(2025, 10, 24), 
                    NumberOfAdults = 2, 
                    NumberOfChildren = 1, 
                    Status = "Confirmed", 
                    SpecialRequests = "Baby cot required", 
                    TotalAmount = 42000, 
                    TotalPaid = 21000, 
                    PaymentStatus = "Partial" 
                },
                new Reservation 
                { 
                    ReservationNumber = "RES014", 
                    GuestId = guests.First(g => g.GuestId == "G014").Id, 
                    RoomId = rooms.First(r => r.RoomNumber == "403").Id,
                    CheckInDate = new DateTime(2025, 10, 23), 
                    CheckOutDate = new DateTime(2025, 10, 27), 
                    NumberOfAdults = 3, 
                    NumberOfChildren = 0, 
                    Status = "Confirmed", 
                    SpecialRequests = "Business meeting room access", 
                    TotalAmount = 72000, 
                    TotalPaid = 36000, 
                    PaymentStatus = "Partial" 
                }
            };

            foreach (var reservation in reservations)
            {
                var existing = await _context.Reservations.FirstOrDefaultAsync(r => r.ReservationNumber == reservation.ReservationNumber);
                if (existing == null)
                {
                    _context.Reservations.Add(reservation);
                }
            }
        }
    }
}
