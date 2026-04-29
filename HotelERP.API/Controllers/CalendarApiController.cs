using Microsoft.AspNetCore.Mvc;

namespace HotelERP.API.Controllers
{
    [Route("api/calendar")]
    [ApiController]
    public class CalendarApiController : ControllerBase
    {
        [HttpGet("bookings")]
        public IActionResult GetCalendarBookings([FromQuery] int year = 2025, [FromQuery] int month = 10)
        {
            var mockBookings = new[]
            {
                new
                {
                    id = 1,
                    roomNumber = "101",
                    roomType = "Standard",
                    guestName = "Ahmed Hassan",
                    checkInDate = "2025-10-09",
                    checkOutDate = "2025-10-12",
                    status = "Occupied",
                    phone = "+92-300-1234567",
                    email = "ahmed.hassan@gmail.com",
                    adults = 2,
                    children = 0,
                    totalAmount = 15000,
                    paidAmount = 15000,
                    source = "Direct Booking",
                    specialRequests = "Late checkout requested",
                    nationality = "Pakistani",
                    idType = "CNIC",
                    idNumber = "42101-1234567-8"
                },
                new
                {
                    id = 2,
                    roomNumber = "102",
                    roomType = "Standard",
                    guestName = "Fatima Khan",
                    checkInDate = "2025-10-10",
                    checkOutDate = "2025-10-13",
                    status = "Occupied",
                    phone = "+92-321-9876543",
                    email = "fatima.khan@yahoo.com",
                    adults = 2,
                    children = 1,
                    totalAmount = 18000,
                    paidAmount = 18000,
                    source = "Online Booking",
                    specialRequests = "Extra bed for child",
                    nationality = "Pakistani",
                    idType = "Passport",
                    idNumber = "AB1234567"
                },
                new
                {
                    id = 3,
                    roomNumber = "201",
                    roomType = "Deluxe",
                    guestName = "Muhammad Ali",
                    checkInDate = "2025-10-11",
                    checkOutDate = "2025-10-15",
                    status = "Occupied",
                    phone = "+92-333-5555555",
                    email = "muhammad.ali@hotmail.com",
                    adults = 3,
                    children = 2,
                    totalAmount = 60000,
                    paidAmount = 60000,
                    source = "Travel Agent",
                    specialRequests = "Airport pickup arranged",
                    nationality = "Pakistani",
                    idType = "CNIC",
                    idNumber = "42301-9876543-2"
                },
                new
                {
                    id = 4,
                    roomNumber = "202",
                    roomType = "Deluxe",
                    guestName = "Zain Malik",
                    checkInDate = "2025-10-12",
                    checkOutDate = "2025-10-16",
                    status = "Occupied",
                    phone = "+92-300-7777777",
                    email = "zain.malik@outlook.com",
                    adults = 2,
                    children = 1,
                    totalAmount = 45000,
                    paidAmount = 45000,
                    source = "Corporate Booking",
                    specialRequests = "Business center access",
                    nationality = "Pakistani",
                    idType = "CNIC",
                    idNumber = "42401-7777777-7"
                },
                new
                {
                    id = 5,
                    roomNumber = "301",
                    roomType = "Suite",
                    guestName = "Sarah Khan",
                    checkInDate = "2025-10-13",
                    checkOutDate = "2025-10-18",
                    status = "Reserved",
                    phone = "+92-321-8888888",
                    email = "sarah.khan@gmail.com",
                    adults = 2,
                    children = 0,
                    totalAmount = 75000,
                    paidAmount = 25000,
                    source = "Online Booking",
                    specialRequests = "Honeymoon package",
                    nationality = "Pakistani",
                    idType = "CNIC",
                    idNumber = "42301-8888888-8"
                },
                new
                {
                    id = 6,
                    roomNumber = "302",
                    roomType = "Suite",
                    guestName = "Hassan Ali",
                    checkInDate = "2025-10-14",
                    checkOutDate = "2025-10-17",
                    status = "Reserved",
                    phone = "+92-333-9999999",
                    email = "hassan.ali@yahoo.com",
                    adults = 1,
                    children = 0,
                    totalAmount = 45000,
                    paidAmount = 15000,
                    source = "Walk-in",
                    specialRequests = "Quiet room preferred",
                    nationality = "Pakistani",
                    idType = "CNIC",
                    idNumber = "42201-9999999-9"
                },
                new
                {
                    id = 7,
                    roomNumber = "401",
                    roomType = "Executive",
                    guestName = "Ayesha Ahmed",
                    checkInDate = "2025-10-15",
                    checkOutDate = "2025-10-20",
                    status = "Reserved",
                    phone = "+92-345-1111111",
                    email = "ayesha.ahmed@gmail.com",
                    adults = 4,
                    children = 2,
                    totalAmount = 100000,
                    paidAmount = 30000,
                    source = "Phone Booking",
                    specialRequests = "Family suite with connecting rooms",
                    nationality = "Pakistani",
                    idType = "CNIC",
                    idNumber = "42201-5555555-5"
                },
                new
                {
                    id = 8,
                    roomNumber = "103",
                    roomType = "Standard",
                    guestName = "Usman Khan",
                    checkInDate = "2025-10-16",
                    checkOutDate = "2025-10-19",
                    status = "Reserved",
                    phone = "+92-301-2222222",
                    email = "usman.khan@gmail.com",
                    adults = 2,
                    children = 0,
                    totalAmount = 21000,
                    paidAmount = 10500,
                    source = "Direct Booking",
                    specialRequests = "Non-smoking room",
                    nationality = "Pakistani",
                    idType = "CNIC",
                    idNumber = "42101-2222222-3"
                },
                new
                {
                    id = 9,
                    roomNumber = "203",
                    roomType = "Deluxe",
                    guestName = "Mariam Sheikh",
                    checkInDate = "2025-10-17",
                    checkOutDate = "2025-10-21",
                    status = "Reserved",
                    phone = "+92-322-3333333",
                    email = "mariam.sheikh@yahoo.com",
                    adults = 3,
                    children = 1,
                    totalAmount = 56000,
                    paidAmount = 28000,
                    source = "Online Booking",
                    specialRequests = "High floor room with city view",
                    nationality = "Pakistani",
                    idType = "CNIC",
                    idNumber = "42201-3333333-4"
                },
                new
                {
                    id = 10,
                    roomNumber = "402",
                    roomType = "Executive",
                    guestName = "Ali Raza",
                    checkInDate = "2025-10-18",
                    checkOutDate = "2025-10-22",
                    status = "Reserved",
                    phone = "+92-334-4444444",
                    email = "ali.raza@hotmail.com",
                    adults = 2,
                    children = 0,
                    totalAmount = 80000,
                    paidAmount = 40000,
                    source = "Corporate Booking",
                    specialRequests = "Executive lounge access",
                    nationality = "Pakistani",
                    idType = "CNIC",
                    idNumber = "42401-4444444-5"
                },
                new
                {
                    id = 11,
                    roomNumber = "104",
                    roomType = "Standard",
                    guestName = "Nadia Iqbal",
                    checkInDate = "2025-10-19",
                    checkOutDate = "2025-10-23",
                    status = "Reserved",
                    phone = "+92-315-5555555",
                    email = "nadia.iqbal@gmail.com",
                    adults = 1,
                    children = 0,
                    totalAmount = 28000,
                    paidAmount = 14000,
                    source = "Travel Agent",
                    specialRequests = "Early check-in if possible",
                    nationality = "Pakistani",
                    idType = "CNIC",
                    idNumber = "42101-5555555-6"
                },
                new
                {
                    id = 12,
                    roomNumber = "303",
                    roomType = "Suite",
                    guestName = "Tariq Mahmood",
                    checkInDate = "2025-10-20",
                    checkOutDate = "2025-10-25",
                    status = "Reserved",
                    phone = "+92-300-6666666",
                    email = "tariq.mahmood@outlook.com",
                    adults = 4,
                    children = 3,
                    totalAmount = 125000,
                    paidAmount = 50000,
                    source = "Direct Booking",
                    specialRequests = "Family package with extra amenities",
                    nationality = "Pakistani",
                    idType = "CNIC",
                    idNumber = "42301-6666666-7"
                },
                new
                {
                    id = 13,
                    roomNumber = "204",
                    roomType = "Deluxe",
                    guestName = "Sana Malik",
                    checkInDate = "2025-10-21",
                    checkOutDate = "2025-10-24",
                    status = "Reserved",
                    phone = "+92-331-7777777",
                    email = "sana.malik@yahoo.com",
                    adults = 2,
                    children = 1,
                    totalAmount = 42000,
                    paidAmount = 21000,
                    source = "Online Booking",
                    specialRequests = "Baby cot required",
                    nationality = "Pakistani",
                    idType = "CNIC",
                    idNumber = "42201-7777777-8"
                },
                new
                {
                    id = 14,
                    roomNumber = "105",
                    roomType = "Standard",
                    guestName = "",
                    checkInDate = "2025-10-22",
                    checkOutDate = "2025-10-26",
                    status = "Out of Order",
                    phone = "",
                    email = "",
                    adults = 0,
                    children = 0,
                    totalAmount = 0,
                    paidAmount = 0,
                    source = "Maintenance",
                    specialRequests = "Bathroom renovation and AC repair",
                    nationality = "",
                    idType = "",
                    idNumber = ""
                },
                new
                {
                    id = 15,
                    roomNumber = "403",
                    roomType = "Executive",
                    guestName = "Kamran Ahmed",
                    checkInDate = "2025-10-23",
                    checkOutDate = "2025-10-27",
                    status = "Reserved",
                    phone = "+92-323-8888888",
                    email = "kamran.ahmed@gmail.com",
                    adults = 3,
                    children = 0,
                    totalAmount = 72000,
                    paidAmount = 36000,
                    source = "Phone Booking",
                    specialRequests = "Business meeting room access",
                    nationality = "Pakistani",
                    idType = "CNIC",
                    idNumber = "42401-8888888-9"
                }
            };

            return Ok(new
            {
                success = true,
                data = mockBookings,
                message = $"Retrieved {mockBookings.Length} bookings for {year}-{month:D2}"
            });
        }

        [HttpGet("dashboard")]
        public IActionResult GetCalendarDashboard([FromQuery] string period = "today")
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
                    new { id = 1, guestName = "Sarah Khan", roomNumber = "301", checkInTime = "14:00", roomType = "Suite", phone = "+92-321-8888888" },
                    new { id = 2, guestName = "Hassan Ali", roomNumber = "302", checkInTime = "15:00", roomType = "Suite", phone = "+92-333-9999999" }
                },
                upcomingDepartures = new[]
                {
                    new { id = 1, guestName = "Ahmed Hassan", roomNumber = "101", checkOutTime = "12:00", roomType = "Standard", phone = "+92-300-1234567" },
                    new { id = 2, guestName = "Fatima Khan", roomNumber = "102", checkOutTime = "11:00", roomType = "Standard", phone = "+92-321-9876543" }
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

    [Route("api/mock-rooms")]
    [ApiController]
    public class MockRoomsApiController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetRooms()
        {
            var mockRooms = new[]
            {
                new { id = 1, roomNumber = "101", roomType = "Standard", status = "Available" },
                new { id = 2, roomNumber = "102", roomType = "Standard", status = "Available" },
                new { id = 3, roomNumber = "103", roomType = "Standard", status = "Available" },
                new { id = 4, roomNumber = "104", roomType = "Standard", status = "Available" },
                new { id = 5, roomNumber = "105", roomType = "Standard", status = "Out of Order" },
                new { id = 6, roomNumber = "201", roomType = "Deluxe", status = "Available" },
                new { id = 7, roomNumber = "202", roomType = "Deluxe", status = "Available" },
                new { id = 8, roomNumber = "203", roomType = "Deluxe", status = "Available" },
                new { id = 9, roomNumber = "204", roomType = "Deluxe", status = "Available" },
                new { id = 10, roomNumber = "301", roomType = "Suite", status = "Available" },
                new { id = 11, roomNumber = "302", roomType = "Suite", status = "Available" },
                new { id = 12, roomNumber = "303", roomType = "Suite", status = "Available" },
                new { id = 13, roomNumber = "401", roomType = "Executive", status = "Available" },
                new { id = 14, roomNumber = "402", roomType = "Executive", status = "Available" },
                new { id = 15, roomNumber = "403", roomType = "Executive", status = "Available" }
            };

            return Ok(new
            {
                success = true,
                data = mockRooms,
                message = $"Retrieved {mockRooms.Length} rooms"
            });
        }
    }
}
