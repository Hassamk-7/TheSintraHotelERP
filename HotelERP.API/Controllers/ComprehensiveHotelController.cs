using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ComprehensiveHotelController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<ComprehensiveHotelController> _logger;

        public ComprehensiveHotelController(HotelDbContext context, ILogger<ComprehensiveHotelController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // ROOMS MANAGEMENT ENDPOINTS
        [HttpGet("room-rates")]
        public async Task<IActionResult> GetRoomRates([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.RoomRates.Include(r => r.RoomType).Where(r => r.IsActive);
                var totalCount = await query.CountAsync();
                var rates = await query.OrderBy(r => r.RoomType.Name).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
                return Ok(new { success = true, data = rates, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room rates");
                return StatusCode(500, new { success = false, message = "Error retrieving room rates" });
            }
        }

        [HttpPost("room-rates")]
        public async Task<IActionResult> CreateRoomRate([FromBody] RoomRates rate)
        {
            try
            {
                rate.IsActive = true;
                rate.CreatedAt = DateTime.UtcNow;
                rate.UpdatedAt = DateTime.UtcNow;
                _context.RoomRates.Add(rate);
                await _context.SaveChangesAsync();
                return Ok(new { success = true, data = rate, message = "Room rate created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating room rate");
                return StatusCode(500, new { success = false, message = "Error creating room rate" });
            }
        }

        [HttpGet("room-amenities")]
        public async Task<IActionResult> GetRoomAmenities([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.RoomAmenities.Where(a => a.IsActive);
                var totalCount = await query.CountAsync();
                var amenities = await query.OrderBy(a => a.Category).ThenBy(a => a.AmenityName).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
                return Ok(new { success = true, data = amenities, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room amenities");
                return StatusCode(500, new { success = false, message = "Error retrieving room amenities" });
            }
        }

        [HttpPost("room-amenities")]
        public async Task<IActionResult> CreateRoomAmenity([FromBody] RoomAmenities amenity)
        {
            try
            {
                amenity.IsActive = true;
                amenity.CreatedAt = DateTime.UtcNow;
                amenity.UpdatedAt = DateTime.UtcNow;
                _context.RoomAmenities.Add(amenity);
                await _context.SaveChangesAsync();
                return Ok(new { success = true, data = amenity, message = "Room amenity created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating room amenity");
                return StatusCode(500, new { success = false, message = "Error creating room amenity" });
            }
        }

        [HttpGet("floor-management")]
        public async Task<IActionResult> GetFloorManagement()
        {
            try
            {
                var floors = await _context.FloorManagements.Where(f => f.IsActive).OrderBy(f => f.FloorNumber).ToListAsync();
                return Ok(new { success = true, data = floors });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving floor management");
                return StatusCode(500, new { success = false, message = "Error retrieving floor management" });
            }
        }

        // GUEST SERVICES ENDPOINTS
        [HttpGet("concierge-services")]
        public async Task<IActionResult> GetConciergeServices([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.ConciergeServices.Include(c => c.Guest).Include(c => c.Room).Where(c => c.IsActive);
                var totalCount = await query.CountAsync();
                var services = await query.OrderByDescending(c => c.RequestDate).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
                return Ok(new { success = true, data = services, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving concierge services");
                return StatusCode(500, new { success = false, message = "Error retrieving concierge services" });
            }
        }

        [HttpPost("concierge-services")]
        public async Task<IActionResult> CreateConciergeService([FromBody] ConciergeServices service)
        {
            try
            {
                service.ServiceNumber = $"CON{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                service.Status = "Requested";
                service.IsActive = true;
                service.CreatedAt = DateTime.UtcNow;
                service.UpdatedAt = DateTime.UtcNow;
                _context.ConciergeServices.Add(service);
                await _context.SaveChangesAsync();
                return Ok(new { success = true, data = service, message = "Concierge service request created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating concierge service");
                return StatusCode(500, new { success = false, message = "Error creating concierge service" });
            }
        }

        [HttpGet("spa-wellness")]
        public async Task<IActionResult> GetSpaWellness([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.SpaWellnesses.Include(s => s.Guest).Where(s => s.IsActive);
                var totalCount = await query.CountAsync();
                var bookings = await query.OrderByDescending(s => s.ServiceDate).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
                return Ok(new { success = true, data = bookings, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving spa wellness bookings");
                return StatusCode(500, new { success = false, message = "Error retrieving spa wellness bookings" });
            }
        }

        [HttpPost("spa-wellness")]
        public async Task<IActionResult> CreateSpaWellnessBooking([FromBody] SpaWellness booking)
        {
            try
            {
                booking.BookingNumber = $"SPA{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                booking.Status = "Booked";
                booking.IsActive = true;
                booking.CreatedAt = DateTime.UtcNow;
                booking.UpdatedAt = DateTime.UtcNow;
                _context.SpaWellnesses.Add(booking);
                await _context.SaveChangesAsync();
                return Ok(new { success = true, data = booking, message = "Spa wellness booking created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating spa wellness booking");
                return StatusCode(500, new { success = false, message = "Error creating spa wellness booking" });
            }
        }

        // MARKETING & CRM ENDPOINTS
        [HttpGet("customer-database")]
        public async Task<IActionResult> GetCustomerDatabase([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "")
        {
            try
            {
                var query = _context.CustomerDatabases.Where(c => c.IsActive);
                if (!string.IsNullOrEmpty(search))
                    query = query.Where(c => c.FirstName.Contains(search) || c.LastName.Contains(search) || c.Email.Contains(search));

                var totalCount = await query.CountAsync();
                var customers = await query.OrderBy(c => c.FirstName).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
                return Ok(new { success = true, data = customers, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving customer database");
                return StatusCode(500, new { success = false, message = "Error retrieving customer database" });
            }
        }

        [HttpPost("customer-database")]
        public async Task<IActionResult> CreateCustomer([FromBody] CustomerDatabase customer)
        {
            try
            {
                customer.CustomerCode = $"CUST{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                customer.FirstVisit = DateTime.UtcNow;
                customer.TotalVisits = 1;
                customer.IsActive = true;
                customer.CreatedAt = DateTime.UtcNow;
                customer.UpdatedAt = DateTime.UtcNow;
                _context.CustomerDatabases.Add(customer);
                await _context.SaveChangesAsync();
                return Ok(new { success = true, data = customer, message = "Customer created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating customer");
                return StatusCode(500, new { success = false, message = "Error creating customer" });
            }
        }

        [HttpGet("loyalty-programs")]
        public async Task<IActionResult> GetLoyaltyPrograms([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.LoyaltyPrograms.Include(l => l.Customer).Where(l => l.IsActive);
                var totalCount = await query.CountAsync();
                var programs = await query.OrderByDescending(l => l.CurrentPoints).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
                return Ok(new { success = true, data = programs, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving loyalty programs");
                return StatusCode(500, new { success = false, message = "Error retrieving loyalty programs" });
            }
        }

        [HttpPost("loyalty-programs")]
        public async Task<IActionResult> CreateLoyaltyProgram([FromBody] LoyaltyProgram program)
        {
            try
            {
                program.MembershipNumber = $"LOY{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                program.Status = "Active";
                program.IsActive = true;
                program.CreatedAt = DateTime.UtcNow;
                program.UpdatedAt = DateTime.UtcNow;
                _context.LoyaltyPrograms.Add(program);
                await _context.SaveChangesAsync();
                return Ok(new { success = true, data = program, message = "Loyalty program membership created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating loyalty program");
                return StatusCode(500, new { success = false, message = "Error creating loyalty program" });
            }
        }

        // INVENTORY MANAGEMENT ENDPOINTS
        [HttpGet("stock-management")]
        public async Task<IActionResult> GetStockManagement([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.StockManagements.Include(s => s.Item).Where(s => s.IsActive);
                var totalCount = await query.CountAsync();
                var stocks = await query.OrderByDescending(s => s.TransactionDate).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
                return Ok(new { success = true, data = stocks, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving stock management");
                return StatusCode(500, new { success = false, message = "Error retrieving stock management" });
            }
        }

        [HttpPost("stock-management")]
        public async Task<IActionResult> CreateStockTransaction([FromBody] StockManagement stock)
        {
            try
            {
                stock.IsActive = true;
                stock.CreatedAt = DateTime.UtcNow;
                stock.UpdatedAt = DateTime.UtcNow;
                _context.StockManagements.Add(stock);
                await _context.SaveChangesAsync();
                return Ok(new { success = true, data = stock, message = "Stock transaction created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating stock transaction");
                return StatusCode(500, new { success = false, message = "Error creating stock transaction" });
            }
        }

        [HttpGet("purchase-orders")]
        public async Task<IActionResult> GetPurchaseOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.PurchaseOrders.Include(p => p.Supplier).Where(p => p.IsActive);
                var totalCount = await query.CountAsync();
                var orders = await query.OrderByDescending(p => p.OrderDate).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
                return Ok(new { success = true, data = orders, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving purchase orders");
                return StatusCode(500, new { success = false, message = "Error retrieving purchase orders" });
            }
        }

        [HttpPost("purchase-orders")]
        public async Task<IActionResult> CreatePurchaseOrder([FromBody] PurchaseOrder order)
        {
            try
            {
                order.PONumber = $"PO{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                order.Status = "Draft";
                order.IsActive = true;
                order.CreatedAt = DateTime.UtcNow;
                order.UpdatedAt = DateTime.UtcNow;
                _context.PurchaseOrders.Add(order);
                await _context.SaveChangesAsync();
                return Ok(new { success = true, data = order, message = "Purchase order created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating purchase order");
                return StatusCode(500, new { success = false, message = "Error creating purchase order" });
            }
        }

        // DASHBOARD SUMMARY ENDPOINT
        [HttpGet("dashboard-summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            try
            {
                var summary = new
                {
                    TotalRooms = await _context.Rooms.CountAsync(r => r.IsActive),
                    OccupiedRooms = await _context.CheckInMasters.CountAsync(c => c.Status == "Active" && c.IsActive),
                    TotalGuests = await _context.Guests.CountAsync(g => g.IsActive),
                    TotalReservations = await _context.ReservationMasters.CountAsync(r => r.Status == "Confirmed" && r.IsActive),
                    TotalEmployees = await _context.Employees.CountAsync(e => e.Status == "Active" && e.IsActive),
                    ActiveOrders = await _context.RestaurantOrders.CountAsync(o => o.Status == "Preparing" && o.IsActive),
                    PendingMaintenance = await _context.MaintenanceRequests.CountAsync(m => m.Status == "Pending" && m.IsActive),
                    LoyaltyMembers = await _context.LoyaltyPrograms.CountAsync(l => l.Status == "Active" && l.IsActive)
                };

                return Ok(new { success = true, data = summary });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving dashboard summary");
                return StatusCode(500, new { success = false, message = "Error retrieving dashboard summary" });
            }
        }
    }
}
