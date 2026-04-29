using Microsoft.AspNetCore.Mvc;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestCalendarController : ControllerBase
    {
        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok(new { message = "Calendar API is working!", timestamp = DateTime.UtcNow });
        }

        [HttpGet("bookings")]
        public IActionResult GetBookings([FromQuery] int year = 2025, [FromQuery] int month = 10)
        {
            // Return mock data for now
            var mockBookings = new[]
            {
                new
                {
                    Id = 1,
                    RoomNumber = "101",
                    RoomType = "Standard",
                    GuestName = "Ahmed Hassan",
                    CheckInDate = "2025-10-09",
                    CheckOutDate = "2025-10-12",
                    Status = "Occupied",
                    Phone = "+92-300-1234567",
                    Email = "ahmed.hassan@gmail.com",
                    Adults = 2,
                    Children = 0,
                    TotalAmount = 15000,
                    PaidAmount = 15000,
                    Source = "Direct Booking",
                    SpecialRequests = "Late checkout requested",
                    Nationality = "Pakistani",
                    IdType = "CNIC",
                    IdNumber = "42101-1234567-8"
                },
                new
                {
                    Id = 2,
                    RoomNumber = "102",
                    RoomType = "Standard",
                    GuestName = "Fatima Khan",
                    CheckInDate = "2025-10-10",
                    CheckOutDate = "2025-10-13",
                    Status = "Occupied",
                    Phone = "+92-321-9876543",
                    Email = "fatima.khan@yahoo.com",
                    Adults = 2,
                    Children = 1,
                    TotalAmount = 18000,
                    PaidAmount = 18000,
                    Source = "Online Booking",
                    SpecialRequests = "Extra bed for child",
                    Nationality = "Pakistani",
                    IdType = "Passport",
                    IdNumber = "AB1234567"
                },
                new
                {
                    Id = 3,
                    RoomNumber = "201",
                    RoomType = "Deluxe",
                    GuestName = "Muhammad Ali",
                    CheckInDate = "2025-10-11",
                    CheckOutDate = "2025-10-15",
                    Status = "Occupied",
                    Phone = "+92-333-5555555",
                    Email = "muhammad.ali@hotmail.com",
                    Adults = 3,
                    Children = 2,
                    TotalAmount = 60000,
                    PaidAmount = 60000,
                    Source = "Travel Agent",
                    SpecialRequests = "Airport pickup arranged",
                    Nationality = "Pakistani",
                    IdType = "CNIC",
                    IdNumber = "42301-9876543-2"
                },
                new
                {
                    Id = 4,
                    RoomNumber = "202",
                    RoomType = "Deluxe",
                    GuestName = "Zain Malik",
                    CheckInDate = "2025-10-12",
                    CheckOutDate = "2025-10-16",
                    Status = "Occupied",
                    Phone = "+92-300-7777777",
                    Email = "zain.malik@outlook.com",
                    Adults = 2,
                    Children = 1,
                    TotalAmount = 45000,
                    PaidAmount = 45000,
                    Source = "Corporate Booking",
                    SpecialRequests = "Business center access",
                    Nationality = "Pakistani",
                    IdType = "CNIC",
                    IdNumber = "42401-7777777-7"
                },
                new
                {
                    Id = 5,
                    RoomNumber = "301",
                    RoomType = "Suite",
                    GuestName = "Sarah Khan",
                    CheckInDate = "2025-10-13",
                    CheckOutDate = "2025-10-18",
                    Status = "Reserved",
                    Phone = "+92-321-8888888",
                    Email = "sarah.khan@gmail.com",
                    Adults = 2,
                    Children = 0,
                    TotalAmount = 75000,
                    PaidAmount = 25000,
                    Source = "Online Booking",
                    SpecialRequests = "Honeymoon package",
                    Nationality = "Pakistani",
                    IdType = "CNIC",
                    IdNumber = "42301-8888888-8"
                },
                new
                {
                    Id = 6,
                    RoomNumber = "302",
                    RoomType = "Suite",
                    GuestName = "Hassan Ali",
                    CheckInDate = "2025-10-14",
                    CheckOutDate = "2025-10-17",
                    Status = "Reserved",
                    Phone = "+92-333-9999999",
                    Email = "hassan.ali@yahoo.com",
                    Adults = 1,
                    Children = 0,
                    TotalAmount = 45000,
                    PaidAmount = 15000,
                    Source = "Walk-in",
                    SpecialRequests = "Quiet room preferred",
                    Nationality = "Pakistani",
                    IdType = "CNIC",
                    IdNumber = "42201-9999999-9"
                },
                new
                {
                    Id = 7,
                    RoomNumber = "401",
                    RoomType = "Executive",
                    GuestName = "Ayesha Ahmed",
                    CheckInDate = "2025-10-15",
                    CheckOutDate = "2025-10-20",
                    Status = "Reserved",
                    Phone = "+92-345-1111111",
                    Email = "ayesha.ahmed@gmail.com",
                    Adults = 4,
                    Children = 2,
                    TotalAmount = 100000,
                    PaidAmount = 30000,
                    Source = "Phone Booking",
                    SpecialRequests = "Family suite with connecting rooms",
                    Nationality = "Pakistani",
                    IdType = "CNIC",
                    IdNumber = "42201-5555555-5"
                },
                new
                {
                    Id = 8,
                    RoomNumber = "103",
                    RoomType = "Standard",
                    GuestName = "Usman Khan",
                    CheckInDate = "2025-10-16",
                    CheckOutDate = "2025-10-19",
                    Status = "Reserved",
                    Phone = "+92-301-2222222",
                    Email = "usman.khan@gmail.com",
                    Adults = 2,
                    Children = 0,
                    TotalAmount = 21000,
                    PaidAmount = 10500,
                    Source = "Direct Booking",
                    SpecialRequests = "Non-smoking room",
                    Nationality = "Pakistani",
                    IdType = "CNIC",
                    IdNumber = "42101-2222222-3"
                },
                new
                {
                    Id = 9,
                    RoomNumber = "203",
                    RoomType = "Deluxe",
                    GuestName = "Mariam Sheikh",
                    CheckInDate = "2025-10-17",
                    CheckOutDate = "2025-10-21",
                    Status = "Reserved",
                    Phone = "+92-322-3333333",
                    Email = "mariam.sheikh@yahoo.com",
                    Adults = 3,
                    Children = 1,
                    TotalAmount = 56000,
                    PaidAmount = 28000,
                    Source = "Online Booking",
                    SpecialRequests = "High floor room with city view",
                    Nationality = "Pakistani",
                    IdType = "CNIC",
                    IdNumber = "42201-3333333-4"
                },
                new
                {
                    Id = 10,
                    RoomNumber = "402",
                    RoomType = "Executive",
                    GuestName = "Ali Raza",
                    CheckInDate = "2025-10-18",
                    CheckOutDate = "2025-10-22",
                    Status = "Reserved",
                    Phone = "+92-334-4444444",
                    Email = "ali.raza@hotmail.com",
                    Adults = 2,
                    Children = 0,
                    TotalAmount = 80000,
                    PaidAmount = 40000,
                    Source = "Corporate Booking",
                    SpecialRequests = "Executive lounge access",
                    Nationality = "Pakistani",
                    IdType = "CNIC",
                    IdNumber = "42401-4444444-5"
                },
                new
                {
                    Id = 11,
                    RoomNumber = "104",
                    RoomType = "Standard",
                    GuestName = "Nadia Iqbal",
                    CheckInDate = "2025-10-19",
                    CheckOutDate = "2025-10-23",
                    Status = "Reserved",
                    Phone = "+92-315-5555555",
                    Email = "nadia.iqbal@gmail.com",
                    Adults = 1,
                    Children = 0,
                    TotalAmount = 28000,
                    PaidAmount = 14000,
                    Source = "Travel Agent",
                    SpecialRequests = "Early check-in if possible",
                    Nationality = "Pakistani",
                    IdType = "CNIC",
                    IdNumber = "42101-5555555-6"
                },
                new
                {
                    Id = 12,
                    RoomNumber = "303",
                    RoomType = "Suite",
                    GuestName = "Tariq Mahmood",
                    CheckInDate = "2025-10-20",
                    CheckOutDate = "2025-10-25",
                    Status = "Reserved",
                    Phone = "+92-300-6666666",
                    Email = "tariq.mahmood@outlook.com",
                    Adults = 4,
                    Children = 3,
                    TotalAmount = 125000,
                    PaidAmount = 50000,
                    Source = "Direct Booking",
                    SpecialRequests = "Family package with extra amenities",
                    Nationality = "Pakistani",
                    IdType = "CNIC",
                    IdNumber = "42301-6666666-7"
                },
                new
                {
                    Id = 13,
                    RoomNumber = "204",
                    RoomType = "Deluxe",
                    GuestName = "Sana Malik",
                    CheckInDate = "2025-10-21",
                    CheckOutDate = "2025-10-24",
                    Status = "Reserved",
                    Phone = "+92-331-7777777",
                    Email = "sana.malik@yahoo.com",
                    Adults = 2,
                    Children = 1,
                    TotalAmount = 42000,
                    PaidAmount = 21000,
                    Source = "Online Booking",
                    SpecialRequests = "Baby cot required",
                    Nationality = "Pakistani",
                    IdType = "CNIC",
                    IdNumber = "42201-7777777-8"
                },
                new
                {
                    Id = 14,
                    RoomNumber = "105",
                    RoomType = "Standard",
                    GuestName = "",
                    CheckInDate = "2025-10-22",
                    CheckOutDate = "2025-10-26",
                    Status = "Out of Order",
                    Phone = "",
                    Email = "",
                    Adults = 0,
                    Children = 0,
                    TotalAmount = 0,
                    PaidAmount = 0,
                    Source = "Maintenance",
                    SpecialRequests = "Bathroom renovation and AC repair",
                    Nationality = "",
                    IdType = "",
                    IdNumber = ""
                },
                new
                {
                    Id = 15,
                    RoomNumber = "403",
                    RoomType = "Executive",
                    GuestName = "Kamran Ahmed",
                    CheckInDate = "2025-10-23",
                    CheckOutDate = "2025-10-27",
                    Status = "Reserved",
                    Phone = "+92-323-8888888",
                    Email = "kamran.ahmed@gmail.com",
                    Adults = 3,
                    Children = 0,
                    TotalAmount = 72000,
                    PaidAmount = 36000,
                    Source = "Phone Booking",
                    SpecialRequests = "Business meeting room access",
                    Nationality = "Pakistani",
                    IdType = "CNIC",
                    IdNumber = "42401-8888888-9"
                }
            };

            return Ok(new
            {
                success = true,
                data = mockBookings,
                message = $"Retrieved {mockBookings.Length} bookings for {year}-{month:D2}"
            });
        }

        [HttpGet("rooms")]
        public IActionResult GetRooms()
        {
            var mockRooms = new[]
            {
                new { Id = 1, RoomNumber = "101", RoomType = "Standard", Status = "Available" },
                new { Id = 2, RoomNumber = "102", RoomType = "Standard", Status = "Available" },
                new { Id = 3, RoomNumber = "103", RoomType = "Standard", Status = "Available" },
                new { Id = 4, RoomNumber = "104", RoomType = "Standard", Status = "Available" },
                new { Id = 5, RoomNumber = "105", RoomType = "Standard", Status = "Out of Order" },
                new { Id = 6, RoomNumber = "201", RoomType = "Deluxe", Status = "Available" },
                new { Id = 7, RoomNumber = "202", RoomType = "Deluxe", Status = "Available" },
                new { Id = 8, RoomNumber = "203", RoomType = "Deluxe", Status = "Available" },
                new { Id = 9, RoomNumber = "204", RoomType = "Deluxe", Status = "Available" },
                new { Id = 10, RoomNumber = "301", RoomType = "Suite", Status = "Available" },
                new { Id = 11, RoomNumber = "302", RoomType = "Suite", Status = "Available" },
                new { Id = 12, RoomNumber = "303", RoomType = "Suite", Status = "Available" },
                new { Id = 13, RoomNumber = "401", RoomType = "Executive", Status = "Available" },
                new { Id = 14, RoomNumber = "402", RoomType = "Executive", Status = "Available" },
                new { Id = 15, RoomNumber = "403", RoomType = "Executive", Status = "Available" }
            };

            return Ok(new
            {
                success = true,
                data = mockRooms,
                message = $"Retrieved {mockRooms.Length} rooms"
            });
        }

        [HttpGet("dashboard")]
        public IActionResult GetDashboard([FromQuery] string period = "today")
        {
            var dashboardData = new
            {
                totalBookings = 45,
                occupancyRate = 73.3,
                totalRevenue = 450000,
                averageRate = 15000,
                roomStatus = new
                {
                    occupied = 4,
                    available = 10,
                    outOfOrder = 1
                },
                todayActivity = new
                {
                    checkIns = 3,
                    checkOuts = 2
                },
                upcomingArrivals = new[]
                {
                    new { Id = 1, GuestName = "Sarah Khan", RoomNumber = "301", CheckInTime = "14:00", RoomType = "Suite", Phone = "+92-321-8888888" },
                    new { Id = 2, GuestName = "Hassan Ali", RoomNumber = "302", CheckInTime = "15:00", RoomType = "Suite", Phone = "+92-333-9999999" }
                },
                upcomingDepartures = new[]
                {
                    new { Id = 1, GuestName = "Ahmed Hassan", RoomNumber = "101", CheckOutTime = "12:00", RoomType = "Standard", Phone = "+92-300-1234567" },
                    new { Id = 2, GuestName = "Fatima Khan", RoomNumber = "102", CheckOutTime = "11:00", RoomType = "Standard", Phone = "+92-321-9876543" }
                },
                revenueChart = new[]
                {
                    new { date = "2025-10-03", revenue = 35000, checkIns = 4, checkOuts = 2, reservations = 6 },
                    new { date = "2025-10-04", revenue = 42000, checkIns = 3, checkOuts = 5, reservations = 8 },
                    new { date = "2025-10-05", revenue = 38000, checkIns = 5, checkOuts = 3, reservations = 7 },
                    new { date = "2025-10-06", revenue = 45000, checkIns = 6, checkOuts = 4, reservations = 9 },
                    new { date = "2025-10-07", revenue = 40000, checkIns = 4, checkOuts = 6, reservations = 5 },
                    new { date = "2025-10-08", revenue = 48000, checkIns = 7, checkOuts = 2, reservations = 10 },
                    new { date = "2025-10-09", revenue = 52000, checkIns = 5, checkOuts = 3, reservations = 8 }
                },
                bookingSourceChart = new[]
                {
                    new { source = "Direct Booking", count = 15, percentage = 33, color = "bg-blue-500" },
                    new { source = "Online Booking", count = 12, percentage = 27, color = "bg-green-500" },
                    new { source = "Travel Agent", count = 8, percentage = 18, color = "bg-yellow-500" },
                    new { source = "Corporate", count = 6, percentage = 13, color = "bg-purple-500" },
                    new { source = "Walk-in", count = 4, percentage = 9, color = "bg-red-500" }
                }
            };

            return Ok(new
            {
                success = true,
                data = dashboardData,
                message = "Dashboard data retrieved successfully"
            });
        }
    }
}
