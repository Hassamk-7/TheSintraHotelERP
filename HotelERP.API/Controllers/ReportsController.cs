using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using System.Globalization;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<ReportsController> _logger;

        public ReportsController(HotelDbContext context, ILogger<ReportsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // EMPLOYEE PAYMENT REPORT
        [HttpGet("employee-payment-report")]
        public async Task<IActionResult> GetEmployeePaymentReport(
            [FromQuery] DateTime? dateFrom = null,
            [FromQuery] DateTime? dateTo = null,
            [FromQuery] string department = "",
            [FromQuery] string paymentType = "",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                var query = _context.EmployeePayments
                    .Include(ep => ep.Employee)
                    .AsQueryable();

                // Apply filters
                if (dateFrom.HasValue)
                    query = query.Where(ep => ep.PaymentDate >= dateFrom.Value);

                if (dateTo.HasValue)
                    query = query.Where(ep => ep.PaymentDate <= dateTo.Value);

                if (!string.IsNullOrEmpty(department))
                    query = query.Where(ep => ep.Employee.Department == department);

                if (!string.IsNullOrEmpty(paymentType))
                    query = query.Where(ep => ep.PaymentType == paymentType);

                var totalCount = await query.CountAsync();
                var payments = await query
                    .OrderByDescending(ep => ep.PaymentDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(ep => new
                    {
                        ep.Id,
                        PaymentNo = $"PAY-{ep.Id:D6}",
                        ep.PaymentDate,
                        EmployeeId = ep.Employee.EmployeeId,
                        EmployeeName = $"{ep.Employee.FirstName} {ep.Employee.LastName}",
                        Department = ep.Employee.Department,
                        Position = ep.Employee.Designation,
                        ep.PaymentType,
                        ep.PaymentMethod,
                        Amount = ep.NetSalary,
                        ep.Status,
                        Remarks = ep.Notes
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = payments, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating employee payment report");
                return StatusCode(500, new { success = false, message = "Error generating report" });
            }
        }

        // GUEST PROFILE REPORT
        [HttpGet("guest-profile-report")]
        public async Task<IActionResult> GetGuestProfileReport(
            [FromQuery] DateTime? dateFrom = null,
            [FromQuery] DateTime? dateTo = null,
            [FromQuery] string guestType = "",
            [FromQuery] string city = "",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                var query = _context.Guests.AsQueryable();

                // Apply filters
                if (dateFrom.HasValue)
                    query = query.Where(g => g.CreatedAt >= dateFrom.Value);

                if (dateTo.HasValue)
                    query = query.Where(g => g.CreatedAt <= dateTo.Value);

                if (!string.IsNullOrEmpty(city))
                    query = query.Where(g => g.City == city);

                var totalCount = await query.CountAsync();
                var guests = await query
                    .OrderByDescending(g => g.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(g => new
                    {
                        g.Id,
                        g.GuestId,
                        g.FullName,
                        g.Email,
                        g.PhoneNumber,
                        g.Address,
                        g.City,
                        g.Country,
                        g.Gender,
                        g.IdType,
                        g.IdNumber,
                        g.Company,
                        g.CreatedAt,
                        TotalBookings = _context.CheckInMasters.Count(c => c.GuestId == g.Id),
                        LastVisit = _context.CheckInMasters
                            .Where(c => c.GuestId == g.Id)
                            .OrderByDescending(c => c.CheckInDate)
                            .Select(c => c.CheckInDate)
                            .FirstOrDefault()
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = guests, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating guest profile report");
                return StatusCode(500, new { success = false, message = "Error generating report" });
            }
        }

        // CHECK-IN REPORT
        [HttpGet("checkin-report")]
        public async Task<IActionResult> GetCheckInReport(
            [FromQuery] DateTime? dateFrom = null,
            [FromQuery] DateTime? dateTo = null,
            [FromQuery] string roomType = "",
            [FromQuery] string status = "",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                var query = _context.CheckInMasters
                    .Include(c => c.Guest)
                    .Include(c => c.Room)
                    .ThenInclude(r => r.RoomType)
                    .AsQueryable();

                // Apply filters
                if (dateFrom.HasValue)
                    query = query.Where(c => c.CheckInDate >= dateFrom.Value);

                if (dateTo.HasValue)
                    query = query.Where(c => c.CheckInDate <= dateTo.Value);

                if (!string.IsNullOrEmpty(roomType))
                    query = query.Where(c => c.Room.RoomType.Name == roomType);

                if (!string.IsNullOrEmpty(status))
                    query = query.Where(c => c.Status == status);

                var totalCount = await query.CountAsync();
                var checkIns = await query
                    .OrderByDescending(c => c.CheckInDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(c => new
                    {
                        c.Id,
                        CheckInNo = c.CheckInNumber,
                        c.CheckInDate,
                        CheckOutDate = c.ExpectedCheckOutDate,
                        GuestName = c.Guest.FullName,
                        GuestPhone = c.Guest.PhoneNumber,
                        RoomNumber = c.Room.RoomNumber,
                        RoomType = c.Room.RoomType.Name,
                        Adults = c.NumberOfGuests,
                        Children = 0, // CheckInMaster doesn't have separate children count
                        c.TotalAmount,
                        AdvanceAmount = c.AdvancePaid,
                        c.Status,
                        Duration = (c.ExpectedCheckOutDate - c.CheckInDate).Days
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = checkIns, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating check-in report");
                return StatusCode(500, new { success = false, message = "Error generating report" });
            }
        }

        // RESTAURANT BILLING REPORT
        [AllowAnonymous]
        [HttpGet("restaurant-billing-report")]
        public async Task<IActionResult> GetRestaurantBillingReport(
            [FromQuery] DateTime? dateFrom = null,
            [FromQuery] DateTime? dateTo = null,
            [FromQuery] string paymentMethod = "",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                var query = _context.RestaurantOrders
                    .Include(ro => ro.OrderedProducts)
                    .ThenInclude(op => op.Dish)
                    .Include(ro => ro.Reservation)
                    .ThenInclude(r => r.Guest)
                    .Include(ro => ro.Table)
                    .AsQueryable();

                // Apply filters
                if (dateFrom.HasValue)
                    query = query.Where(ro => ro.OrderDate >= dateFrom.Value);

                if (dateTo.HasValue)
                    query = query.Where(ro => ro.OrderDate <= dateTo.Value);

                if (!string.IsNullOrEmpty(paymentMethod))
                    query = query.Where(ro => ro.PaymentStatus == paymentMethod);

                var totalCount = await query.CountAsync();
                var orders = await query
                    .OrderByDescending(ro => ro.OrderDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(ro => new
                    {
                        ro.Id,
                        OrderNo = ro.OrderNumber,
                        ro.OrderDate,
                        ro.OrderType,
                        TableNumber = ro.Table != null ? ro.Table.TableNumber : "N/A",
                        GuestId = ro.GuestId,
                        ro.CheckInId,
                        ro.RoomId,
                        GuestName = !string.IsNullOrEmpty(ro.GuestName)
                            ? ro.GuestName
                            : (ro.Guest != null ? ro.Guest.FullName
                                : (ro.Reservation != null && ro.Reservation.Guest != null ? ro.Reservation.Guest.FullName : "Walk-in")),
                        ItemCount = ro.OrderedProducts.Count,
                        ro.SubTotal,
                        ro.TaxAmount,
                        ro.ServiceCharge,
                        ro.TotalAmount,
                        PaymentMethod = "Cash", // Default since RestaurantOrder doesn't have PaymentMethod
                        ro.PaymentStatus,
                        ro.Status
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = orders, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating restaurant billing report");
                return StatusCode(500, new { success = false, message = "Error generating report" });
            }
        }

        // RESTAURANT INVOICE DETAILS
        [AllowAnonymous]
        [HttpGet("restaurant-invoice/{orderId}")]
        public async Task<IActionResult> GetRestaurantInvoice([FromRoute] int orderId)
        {
            try
            {
                var order = await _context.RestaurantOrders
                    .Include(o => o.Table)
                    .Include(o => o.Room)
                    .Include(o => o.Guest)
                    .FirstOrDefaultAsync(o => o.Id == orderId && o.IsActive);

                if (order == null)
                    return NotFound(new { success = false, message = "Restaurant order not found" });

                var items = await _context.OrderItems
                    .Include(oi => oi.MenuItem)
                    .Include(oi => oi.BarItem)
                    .Where(oi => oi.OrderId == orderId && oi.IsActive)
                    .OrderBy(oi => oi.Id)
                    .Select(oi => new
                    {
                        oi.Id,
                        ItemType = oi.MenuItemId.HasValue ? "Food" : "Drink",
                        Name = oi.MenuItemId.HasValue
                            ? (oi.MenuItem != null ? oi.MenuItem.Name : "Food Item")
                            : (oi.BarItem != null ? oi.BarItem.DrinkName : "Drink Item"),
                        oi.Quantity,
                        UnitPrice = oi.UnitPrice,
                        LineTotal = oi.Quantity * oi.UnitPrice
                    })
                    .ToListAsync();

                var guestName = !string.IsNullOrWhiteSpace(order.GuestName)
                    ? order.GuestName
                    : (order.Guest != null ? order.Guest.FullName : "Walk-in");

                var dto = new
                {
                    order.Id,
                    OrderNo = order.OrderNumber,
                    order.OrderDate,
                    order.OrderType,
                    TableNumber = order.Table != null ? order.Table.TableNumber : null,
                    RoomNumber = order.Room != null ? order.Room.RoomNumber : null,
                    order.CheckInId,
                    order.GuestId,
                    GuestName = guestName,
                    order.SubTotal,
                    order.TaxAmount,
                    order.ServiceCharge,
                    order.TotalAmount,
                    order.PaymentStatus,
                    Items = items
                };

                return Ok(new { success = true, data = dto });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating restaurant invoice details");
                return StatusCode(500, new { success = false, message = "Error generating invoice" });
            }
        }

        // ROOM BILL REPORT
        [HttpGet("room-bill-report")]
        public async Task<IActionResult> GetRoomBillReport(
            [FromQuery] DateTime? dateFrom = null,
            [FromQuery] DateTime? dateTo = null,
            [FromQuery] string roomType = "",
            [FromQuery] string paymentStatus = "",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                var query = _context.GuestAccounts
                    .Include(ga => ga.CheckIn)
                    .ThenInclude(ci => ci.Guest)
                    .Include(ga => ga.CheckIn)
                    .ThenInclude(ci => ci.Room)
                    .ThenInclude(r => r.RoomType)
                    .AsQueryable();

                // Apply filters
                if (dateFrom.HasValue)
                    query = query.Where(ga => ga.TransactionDate >= dateFrom.Value);

                if (dateTo.HasValue)
                    query = query.Where(ga => ga.TransactionDate <= dateTo.Value);

                if (!string.IsNullOrEmpty(paymentStatus))
                    query = query.Where(ga => ga.TransactionType == paymentStatus);

                var totalCount = await query.CountAsync();
                var bills = await query
                    .OrderByDescending(ga => ga.TransactionDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(ga => new
                    {
                        ga.Id,
                        BillNo = ga.AccountNumber,
                        BillDate = ga.TransactionDate,
                        GuestName = ga.CheckIn.Guest.FullName,
                        RoomNumber = ga.CheckIn.Room.RoomNumber,
                        RoomType = ga.CheckIn.Room.RoomType.Name,
                        CheckInDate = ga.CheckIn.CheckInDate,
                        CheckOutDate = ga.CheckIn.ExpectedCheckOutDate,
                        DebitAmount = ga.DebitAmount,
                        CreditAmount = ga.CreditAmount,
                        Balance = ga.Balance,
                        TransactionType = ga.TransactionType,
                        Description = ga.Description,
                        Reference = ga.Reference
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = bills, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating room bill report");
                return StatusCode(500, new { success = false, message = "Error generating report" });
            }
        }

        // INVENTORY REPORT
        [HttpGet("inventory-report")]
        public async Task<IActionResult> GetInventoryReport(
            [FromQuery] string category = "",
            [FromQuery] string stockStatus = "",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                var query = _context.InventoryItems
                    .Include(ii => ii.Category)
                    .AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(category))
                    query = query.Where(ii => ii.Category.Name == category);

                if (!string.IsNullOrEmpty(stockStatus))
                {
                    switch (stockStatus.ToLower())
                    {
                        case "low":
                            query = query.Where(ii => ii.StockQuantity <= ii.ReorderLevel && ii.StockQuantity > 0);
                            break;
                        case "out":
                            query = query.Where(ii => ii.StockQuantity <= 0);
                            break;
                        case "normal":
                            query = query.Where(ii => ii.StockQuantity > ii.ReorderLevel);
                            break;
                    }
                }

                var totalCount = await query.CountAsync();
                var items = await query
                    .OrderBy(ii => ii.Name)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(ii => new
                    {
                        ii.Id,
                        ItemCode = ii.Code,
                        ItemName = ii.Name,
                        Category = ii.Category.Name,
                        ii.StockQuantity,
                        ii.ReorderLevel,
                        UnitPrice = ii.CostPrice,
                        StockValue = ii.StockQuantity * ii.CostPrice,
                        Status = ii.StockQuantity <= ii.ReorderLevel ? "Low Stock" : "Normal",
                        LastUpdated = ii.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = items, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating inventory report");
                return StatusCode(500, new { success = false, message = "Error generating report" });
            }
        }

        // REPORTS DASHBOARD SUMMARY
        [HttpGet("dashboard-summary")]
        public async Task<IActionResult> GetReportsDashboardSummary()
        {
            try
            {
                var today = DateTime.Today;
                var thisMonth = new DateTime(today.Year, today.Month, 1);
                var lastMonth = thisMonth.AddMonths(-1);

                var summary = new
                {
                    // Today's Statistics
                    TodayCheckIns = await _context.CheckInMasters
                        .CountAsync(c => c.CheckInDate.Date == today),
                    
                    TodayCheckOuts = await _context.CheckOutMasters
                        .CountAsync(c => c.CheckOutDate.Date == today),
                    
                    TodayRevenue = await _context.GuestAccounts
                        .Where(ga => ga.TransactionDate.Date == today)
                        .SumAsync(ga => ga.DebitAmount),
                    
                    // This Month Statistics
                    MonthlyCheckIns = await _context.CheckInMasters
                        .CountAsync(c => c.CheckInDate >= thisMonth),
                    
                    MonthlyRevenue = await _context.GuestAccounts
                        .Where(ga => ga.TransactionDate >= thisMonth)
                        .SumAsync(ga => ga.DebitAmount),
                    
                    // Employee Statistics
                    TotalEmployees = await _context.Employees.CountAsync(e => e.IsActive),
                    
                    TodayAttendance = await _context.EmployeeAttendances
                        .CountAsync(ea => ea.AttendanceDate.Date == today && ea.Status == "Present"),
                    
                    // Inventory Alerts
                    LowStockItems = await _context.InventoryItems
                        .CountAsync(ii => ii.StockQuantity <= ii.ReorderLevel && ii.StockQuantity > 0),
                    
                    OutOfStockItems = await _context.InventoryItems
                        .CountAsync(ii => ii.StockQuantity <= 0),
                    
                    // Room Statistics
                    TotalRooms = await _context.Rooms.CountAsync(),
                    
                    OccupiedRooms = await _context.CheckInMasters
                        .CountAsync(c => c.Status == "Checked In"),
                    
                    // Recent Activities
                    RecentCheckIns = await _context.CheckInMasters
                        .Include(c => c.Guest)
                        .Include(c => c.Room)
                        .Where(c => c.CheckInDate >= today.AddDays(-7))
                        .OrderByDescending(c => c.CheckInDate)
                        .Take(5)
                        .Select(c => new
                        {
                            GuestName = c.Guest.FullName,
                            RoomNumber = c.Room.RoomNumber,
                            CheckInDate = c.CheckInDate,
                            Amount = c.TotalAmount
                        })
                        .ToListAsync()
                };

                return Ok(new { success = true, data = summary });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating dashboard summary");
                return StatusCode(500, new { success = false, message = "Error generating summary" });
            }
        }

        // HOTEL INFORMATION FOR REPORT HEADERS
        [HttpGet("hotel-info")]
        public async Task<IActionResult> GetHotelInfo()
        {
            try
            {
                var hotel = await _context.Hotels.FirstOrDefaultAsync();
                
                if (hotel == null)
                {
                    // Return default hotel info if none exists
                    return Ok(new
                    {
                        success = true,
                        data = new
                        {
                            HotelName = "Pearl Continental Hotel",
                            Address = "Club Road, Karachi, Pakistan",
                            Phone = "+92-21-111-505-505",
                            Email = "info@pckarachi.com",
                            Website = "www.pchotels.com",
                            Logo = "/images/hotel-logo.png"
                        }
                    });
                }

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        hotel.HotelName,
                        hotel.Address,
                        hotel.PhoneNumber,
                        hotel.Email,
                        hotel.Website,
                        Logo = "/images/hotel-logo.png"
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting hotel info");
                return StatusCode(500, new { success = false, message = "Error getting hotel info" });
            }
        }
    }
}
