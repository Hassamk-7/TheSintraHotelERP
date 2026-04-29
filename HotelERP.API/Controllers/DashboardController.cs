using System;
using System.Linq;
using System.Threading.Tasks;
using HotelERP.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelERP.API.Controllers
{
    public class DashboardController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(HotelDbContext context, ILogger<DashboardController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/dashboard/overview
        [HttpGet("overview")]
        public async Task<IActionResult> GetDashboardOverview()
        {
            try
            {
                var today = DateTime.Today;
                var tomorrow = today.AddDays(1);
                var thisMonth = new DateTime(today.Year, today.Month, 1);
                var nextMonth = thisMonth.AddMonths(1);

                // ── Room Statistics (from Rooms table) ──
                var totalRooms = await _context.Rooms.CountAsync(r => r.IsActive);
                var occupiedRooms = await _context.Rooms.CountAsync(r => r.Status == "Occupied");
                var availableRooms = await _context.Rooms.CountAsync(r => r.Status == "Available");
                var outOfOrderRooms = await _context.Rooms.CountAsync(r => r.Status == "OutOfOrder" || r.Status == "Out of Order");
                var maintenanceRooms = await _context.Rooms.CountAsync(r => r.Status == "Maintenance");
                var reservedRooms = await _context.Rooms.CountAsync(r => r.Status == "Reserved");
                var occupancyRate = totalRooms > 0 ? Math.Round((double)occupiedRooms / totalRooms * 100, 1) : 0;

                // ── Active Guests (currently checked-in from CheckInMasters) ──
                var activeGuests = await _context.CheckInMasters
                    .CountAsync(c => c.Status == "Active");
                var vipGuests = 0;
                try { vipGuests = await _context.Reservations.CountAsync(r => r.VIPStatus == "VIP" && r.Status == "Confirmed"); } catch { }

                // ── Revenue from GuestFolios (Charge transactions) ──
                decimal todayRevenue = 0;
                decimal monthlyRevenue = 0;
                try
                {
                    todayRevenue = await _context.GuestFolios
                        .Where(f => f.TransactionDate >= today && f.TransactionDate < tomorrow
                                 && f.TransactionType == "Charge" && !f.IsReversed)
                        .SumAsync(f => (decimal?)f.TotalAmount) ?? 0;

                    monthlyRevenue = await _context.GuestFolios
                        .Where(f => f.TransactionDate >= thisMonth && f.TransactionDate < nextMonth
                                 && f.TransactionType == "Charge" && !f.IsReversed)
                        .SumAsync(f => (decimal?)f.TotalAmount) ?? 0;
                }
                catch
                {
                    // Fallback to ReservationPayments if GuestFolios fails
                    todayRevenue = await _context.ReservationPayments
                        .Where(p => p.PaymentDate >= today && p.PaymentDate < tomorrow && p.PaymentStatus == "Completed")
                        .SumAsync(p => (decimal?)p.Amount) ?? 0;
                    monthlyRevenue = await _context.ReservationPayments
                        .Where(p => p.PaymentDate >= thisMonth && p.PaymentDate < nextMonth && p.PaymentStatus == "Completed")
                        .SumAsync(p => (decimal?)p.Amount) ?? 0;
                }

                // ── Employee / Staff on Duty ──
                var totalEmployees = await _context.Employees.CountAsync(e => e.IsActive);
                var staffOnDuty = await _context.EmployeeAttendances
                    .CountAsync(a => a.CheckInTime.HasValue && !a.CheckOutTime.HasValue);

                // ── Today's Activity ──
                var todayCheckIns = await _context.CheckInMasters
                    .CountAsync(c => c.CheckInDate >= today && c.CheckInDate < tomorrow);
                var todayCheckOuts = await _context.CheckOutMasters
                    .CountAsync(c => c.CheckOutDate >= today && c.CheckOutDate < tomorrow);

                // Restaurant
                var todayOrders = 0;
                var pendingOrders = 0;
                try
                {
                    todayOrders = await _context.RestaurantOrders
                        .CountAsync(o => o.OrderDate >= today && o.OrderDate < tomorrow);
                    pendingOrders = await _context.RestaurantOrders
                        .CountAsync(o => o.Status == "Pending" || o.Status == "Preparing");
                }
                catch { }

                // ── Inventory Alerts ──
                var lowStockItems = 0;
                try { lowStockItems = await _context.InventoryItems.CountAsync(i => i.StockQuantity <= i.ReorderLevel); } catch { }

                var overview = new
                {
                    rooms = new
                    {
                        total = totalRooms,
                        occupied = occupiedRooms,
                        available = availableRooms,
                        outOfOrder = outOfOrderRooms,
                        maintenance = maintenanceRooms,
                        reserved = reservedRooms,
                        occupancyRate = occupancyRate
                    },
                    guests = new
                    {
                        active = activeGuests,
                        vip = vipGuests
                    },
                    revenue = new
                    {
                        today = todayRevenue,
                        thisMonth = monthlyRevenue
                    },
                    employees = new
                    {
                        total = totalEmployees,
                        onDuty = staffOnDuty
                    },
                    todayActivity = new
                    {
                        checkIns = todayCheckIns,
                        checkOuts = todayCheckOuts,
                        restaurantOrders = todayOrders,
                        pendingOrders = pendingOrders
                    },
                    inventory = new
                    {
                        lowStockAlerts = lowStockItems
                    }
                };

                return HandleSuccess(overview);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving dashboard overview");
                return HandleError("An error occurred while retrieving dashboard data");
            }
        }

        // GET: api/dashboard/recent-activities
        [HttpGet("recent-activities")]
        public async Task<IActionResult> GetRecentActivities([FromQuery] int limit = 10)
        {
            try
            {
                var activities = new List<object>();

                // Recent check-ins - temporarily disabled
                var recentCheckIns = new List<object>();
                /*
                var recentCheckIns = await _context.Reservations
                    .Include(r => r.Guest)
                    .Include(r => r.Room)
                    .Where(r => r.Status == "CheckedIn")
                    .OrderByDescending(r => r.UpdatedAt)
                    .Take(limit / 2)
                    .Select(r => new
                    {
                        Type = "CheckIn",
                        Description = $"{r.Guest.FirstName} {r.Guest.LastName} checked into Room {r.Room.RoomNumber}",
                        Timestamp = r.UpdatedAt,
                        GuestName = $"{r.Guest.FirstName} {r.Guest.LastName}",
                        RoomNumber = r.Room.RoomNumber
                    })
                    .ToListAsync();
                */

                // Recent orders
                var recentOrders = await _context.RestaurantOrders
                    .Include(o => o.Room)
                    .OrderByDescending(o => o.OrderDate)
                    .Take(limit / 2)
                    .Select(o => new
                    {
                        Type = "Order",
                        Description = $"New {o.OrderType} order #{o.OrderNumber}" + 
                                    (o.Room != null ? $" for Room {o.Room.RoomNumber}" : ""),
                        Timestamp = o.OrderDate,
                        OrderNumber = o.OrderNumber,
                        OrderType = o.OrderType,
                        RoomNumber = o.Room != null ? o.Room.RoomNumber : null
                    })
                    .ToListAsync();

                activities.AddRange(recentCheckIns);
                activities.AddRange(recentOrders);

                var sortedActivities = activities
                    .OrderByDescending(a => a.GetType().GetProperty("Timestamp")?.GetValue(a))
                    .Take(limit)
                    .ToList();

                return HandleSuccess(sortedActivities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving recent activities");
                return HandleError("An error occurred while retrieving recent activities");
            }
        }

        // GET: api/dashboard/revenue-chart
        [HttpGet("revenue-chart")]
        public async Task<IActionResult> GetRevenueChart([FromQuery] int days = 30)
        {
            try
            {
                var startDate = DateTime.Today.AddDays(-days);
                var endDate = DateTime.Today.AddDays(1);

                var dailyRevenue = await _context.ReservationPayments
                    .Where(p => p.PaymentDate >= startDate && p.PaymentDate < endDate && p.PaymentStatus == "Completed")
                    .GroupBy(p => p.PaymentDate.Date)
                    .Select(g => new
                    {
                        Date = g.Key,
                        Revenue = g.Sum(p => p.Amount)
                    })
                    .OrderBy(x => x.Date)
                    .ToListAsync();

                // Fill in missing dates with zero revenue
                var chartData = new List<object>();
                for (var date = startDate; date < endDate; date = date.AddDays(1))
                {
                    var dayRevenue = dailyRevenue.FirstOrDefault(d => d.Date == date);
                    chartData.Add(new
                    {
                        Date = date.ToString("yyyy-MM-dd"),
                        Revenue = dayRevenue?.Revenue ?? 0
                    });
                }

                return HandleSuccess(chartData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving revenue chart data");
                return HandleError("An error occurred while retrieving revenue chart data");
            }
        }

        // GET: api/dashboard/occupancy-chart
        [HttpGet("occupancy-chart")]
        public async Task<IActionResult> GetOccupancyChart([FromQuery] int days = 30)
        {
            try
            {
                var startDate = DateTime.Today.AddDays(-days);
                var endDate = DateTime.Today.AddDays(1);
                var totalRooms = await _context.Rooms.CountAsync();

                var chartData = new List<object>();
                
                for (var date = startDate; date < endDate; date = date.AddDays(1))
                {
                    var occupiedRooms = await _context.Reservations
                        .CountAsync(r => r.CheckInDate <= date && r.CheckOutDate > date && 
                                   (r.Status == "CheckedIn" || r.Status == "Confirmed"));

                    var occupancyRate = totalRooms > 0 ? Math.Round((double)occupiedRooms / totalRooms * 100, 2) : 0;

                    chartData.Add(new
                    {
                        Date = date.ToString("yyyy-MM-dd"),
                        OccupiedRooms = occupiedRooms,
                        TotalRooms = totalRooms,
                        OccupancyRate = occupancyRate
                    });
                }

                return HandleSuccess(chartData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving occupancy chart data");
                return HandleError("An error occurred while retrieving occupancy chart data");
            }
        }
    }
}
