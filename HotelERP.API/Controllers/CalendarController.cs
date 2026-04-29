using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using HotelERP.API.DTOs;

namespace HotelERP.API.Controllers
{
    // [Authorize] // Temporarily disabled for testing
    // Temporarily disabled due to model conflicts
    /*
    public class CalendarController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<CalendarController> _logger;

        public CalendarController(HotelDbContext context, ILogger<CalendarController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/calendar/bookings
        [HttpGet("bookings")]
        public async Task<IActionResult> GetCalendarBookings([FromQuery] int year, [FromQuery] int month)
        {
            try
            {
                _logger.LogInformation($"Fetching calendar bookings for {year}-{month:D2}");

                // Get all reservations for the specified month
                var startDate = new DateTime(year, month, 1);
                var endDate = startDate.AddMonths(1).AddDays(-1);

                var reservations = await _context.Reservations
                    .Include(r => r.Guest)
                    .Include(r => r.Room)
                    .ThenInclude(room => room.RoomType)
                    .Where(r => r.CheckInDate <= endDate && r.CheckOutDate >= startDate)
                    .Select(r => new
                    {
                        Id = r.Id,
                        RoomNumber = r.Room.RoomNumber,
                        RoomType = r.Room.RoomType.Name,
                        GuestName = r.Guest.FullName,
                        CheckInDate = r.CheckInDate.ToString("yyyy-MM-dd"),
                        CheckOutDate = r.CheckOutDate.ToString("yyyy-MM-dd"),
                        Status = r.Status == "Confirmed" ? "Reserved" : 
                                r.Status == "CheckedIn" ? "Occupied" : r.Status,
                        Phone = r.Guest.PhoneNumber,
                        Email = r.Guest.Email,
                        Adults = r.NumberOfAdults,
                        Children = r.NumberOfChildren,
                        TotalAmount = r.TotalAmount,
                        PaidAmount = r.TotalPaid,
                        Source = "Direct Booking", // Default for now
                        SpecialRequests = r.SpecialRequests,
                        Nationality = r.Guest.Country ?? "Pakistani",
                        IdType = r.Guest.IdType ?? "CNIC",
                        IdNumber = r.Guest.IdNumber
                    })
                    .ToListAsync();

                // Also get rooms that are out of order
                var outOfOrderRooms = await _context.Rooms
                    .Include(r => r.RoomType)
                    .Where(r => r.Status == "Maintenance" || r.Status == "Out of Order")
                    .Select(r => new
                    {
                        Id = r.Id + 10000, // Offset to avoid ID conflicts
                        RoomNumber = r.RoomNumber,
                        RoomType = r.RoomType.Name,
                        GuestName = "",
                        CheckInDate = startDate.ToString("yyyy-MM-dd"),
                        CheckOutDate = endDate.ToString("yyyy-MM-dd"),
                        Status = "Out of Order",
                        Phone = "",
                        Email = "",
                        Adults = 0,
                        Children = 0,
                        TotalAmount = 0,
                        PaidAmount = 0,
                        Source = "Maintenance",
                        SpecialRequests = r.HousekeepingStatus ?? "Room maintenance required",
                        Nationality = "",
                        IdType = "",
                        IdNumber = ""
                    })
                    .ToListAsync();

                var allBookings = reservations.Concat(outOfOrderRooms).ToList();

                _logger.LogInformation($"Retrieved {allBookings.Count} calendar bookings");

                return Ok(new
                {
                    success = true,
                    data = allBookings,
                    message = $"Retrieved {allBookings.Count} bookings for {year}-{month:D2}"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching calendar bookings");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error fetching calendar bookings",
                    error = ex.Message
                });
            }
        }

        // GET: api/calendar/dashboard
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetCalendarDashboard([FromQuery] string period = "today")
        {
            try
            {
                _logger.LogInformation($"Fetching calendar dashboard data for period: {period}");

                var today = DateTime.Today;
                DateTime startDate, endDate;

                switch (period.ToLower())
                {
                    case "today":
                        startDate = today;
                        endDate = today.AddDays(1);
                        break;
                    case "week":
                        startDate = today.AddDays(-(int)today.DayOfWeek);
                        endDate = startDate.AddDays(7);
                        break;
                    case "month":
                        startDate = new DateTime(today.Year, today.Month, 1);
                        endDate = startDate.AddMonths(1);
                        break;
                    default:
                        startDate = today;
                        endDate = today.AddDays(1);
                        break;
                }

                // Get room statistics
                var totalRooms = await _context.Rooms.CountAsync();
                var occupiedRooms = await _context.Reservations
                    .Where(r => r.Status == "CheckedIn" && r.CheckInDate <= today && r.CheckOutDate > today)
                    .CountAsync();
                var outOfOrderRooms = await _context.Rooms
                    .Where(r => r.Status == "Maintenance" || r.Status == "Out of Order")
                    .CountAsync();
                var availableRooms = totalRooms - occupiedRooms - outOfOrderRooms;

                // Get revenue data
                var totalRevenue = await _context.Reservations
                    .Where(r => r.CheckInDate >= startDate && r.CheckInDate < endDate)
                    .SumAsync(r => r.TotalAmount);

                // Get check-ins and check-outs for today
                var todayCheckIns = await _context.Reservations
                    .Where(r => r.CheckInDate.Date == today)
                    .CountAsync();

                var todayCheckOuts = await _context.Reservations
                    .Where(r => r.CheckOutDate.Date == today)
                    .CountAsync();

                // Get upcoming arrivals and departures
                var upcomingArrivals = await _context.Reservations
                    .Include(r => r.Guest)
                    .Include(r => r.Room)
                    .Where(r => r.CheckInDate.Date == today && r.Status == "Confirmed")
                    .Select(r => new
                    {
                        Id = r.Id,
                        GuestName = r.Guest.FullName,
                        RoomNumber = r.Room.RoomNumber,
                        CheckInTime = "14:00", // Default check-in time
                        RoomType = r.Room.RoomType.Name,
                        Phone = r.Guest.PhoneNumber
                    })
                    .ToListAsync();

                var upcomingDepartures = await _context.Reservations
                    .Include(r => r.Guest)
                    .Include(r => r.Room)
                    .Where(r => r.CheckOutDate.Date == today && r.Status == "CheckedIn")
                    .Select(r => new
                    {
                        Id = r.Id,
                        GuestName = r.Guest.FullName,
                        RoomNumber = r.Room.RoomNumber,
                        CheckOutTime = "12:00", // Default check-out time
                        RoomType = r.Room.RoomType.Name,
                        Phone = r.Guest.PhoneNumber
                    })
                    .ToListAsync();

                var dashboardData = new
                {
                    totalBookings = await _context.Reservations.CountAsync(),
                    occupancyRate = totalRooms > 0 ? Math.Round((double)occupiedRooms / totalRooms * 100, 1) : 0,
                    totalRevenue = totalRevenue,
                    averageRate = occupiedRooms > 0 ? Math.Round(totalRevenue / occupiedRooms, 0) : 0,
                    roomStatus = new
                    {
                        occupied = occupiedRooms,
                        available = availableRooms,
                        outOfOrder = outOfOrderRooms
                    },
                    todayActivity = new
                    {
                        checkIns = todayCheckIns,
                        checkOuts = todayCheckOuts
                    },
                    upcomingArrivals = upcomingArrivals,
                    upcomingDepartures = upcomingDepartures,
                    revenueChart = GenerateRevenueChartData(),
                    bookingSourceChart = GenerateBookingSourceData()
                };

                return Ok(new
                {
                    success = true,
                    data = dashboardData,
                    message = "Dashboard data retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching calendar dashboard data");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error fetching dashboard data",
                    error = ex.Message
                });
            }
        }

        private object[] GenerateRevenueChartData()
        {
            var data = new List<object>();
            var today = DateTime.Today;

            for (int i = 6; i >= 0; i--)
            {
                var date = today.AddDays(-i);
                data.Add(new
                {
                    date = date.ToString("yyyy-MM-dd"),
                    revenue = new Random().Next(20000, 50000),
                    checkIns = new Random().Next(2, 8),
                    checkOuts = new Random().Next(1, 6),
                    reservations = new Random().Next(3, 10)
                });
            }

            return data.ToArray();
        }

        private object[] GenerateBookingSourceData()
        {
            return new object[]
            {
                new { source = "Direct Booking", count = 15, percentage = 33, color = "bg-blue-500" },
                new { source = "Online Booking", count = 12, percentage = 27, color = "bg-green-500" },
                new { source = "Travel Agent", count = 8, percentage = 18, color = "bg-yellow-500" },
                new { source = "Corporate", count = 6, percentage = 13, color = "bg-purple-500" },
                new { source = "Walk-in", count = 4, percentage = 9, color = "bg-red-500" }
            };
        }
    }
    */
}
