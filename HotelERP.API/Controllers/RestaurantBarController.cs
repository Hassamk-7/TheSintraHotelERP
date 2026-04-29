using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // Temporarily disabled for testing
    public class RestaurantBarController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<RestaurantBarController> _logger;

        public RestaurantBarController(HotelDbContext context, ILogger<RestaurantBarController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // BAR DRINKS (WITH SIZES + STOCK)
        [HttpGet("bar-drinks")]
        public async Task<IActionResult> GetBarDrinksWithSizes([FromQuery] string category = "", [FromQuery] bool? isAlcoholic = null)
        {
            try
            {
                var barQuery = _context.BarManagements.Where(b => b.IsActive && b.IsAvailable);

                if (!string.IsNullOrEmpty(category))
                    barQuery = barQuery.Where(b => b.Category == category);

                if (isAlcoholic.HasValue)
                    barQuery = barQuery.Where(b => b.IsAlcoholic == isAlcoholic.Value);

                var barItems = await barQuery.OrderBy(b => b.DisplayOrder).ThenBy(b => b.DrinkName).ToListAsync();

                var drinkCodes = barItems.Select(b => b.DrinkCode).Distinct().ToList();

                var pricings = await _context.DrinksPricings
                    .Where(p => p.IsActive && drinkCodes.Contains(p.DrinkCode))
                    .ToListAsync();

                var itemMasterIds = pricings.Where(p => p.ItemMasterId.HasValue).Select(p => p.ItemMasterId.Value).Distinct().ToList();
                var stockItems = await _context.ItemMasters
                    .Where(i => i.IsActive && itemMasterIds.Contains(i.Id))
                    .ToListAsync();
                var stockById = stockItems.ToDictionary(i => i.Id, i => i);

                var pricingsByCode = pricings
                    .GroupBy(p => p.DrinkCode)
                    .ToDictionary(
                        g => g.Key,
                        g => g
                            .OrderBy(p => p.Quantity)
                            .Select(p => new
                            {
                                id = p.Id,
                                quantity = p.Quantity,
                                price = p.Price,
                                costPrice = p.CostPrice,
                                itemMasterId = p.ItemMasterId,
                                stock = p.ItemMasterId.HasValue && stockById.TryGetValue(p.ItemMasterId.Value, out var it) ? it.CurrentStock : 0
                            })
                            .ToList()
                    );

                var result = barItems.Select(b => new
                {
                    id = b.Id,
                    drinkName = b.DrinkName,
                    drinkCode = b.DrinkCode,
                    description = b.Description,
                    category = b.Category,
                    isAlcoholic = b.IsAlcoholic,
                    alcoholContent = b.AlcoholContent,
                    brand = b.Brand,
                    ingredients = b.Ingredients,
                    imagePath = b.ImagePath,
                    isAvailable = b.IsAvailable,
                    displayOrder = b.DisplayOrder,
                    sizes = pricingsByCode.TryGetValue(b.DrinkCode, out var sizes)
                        ? sizes.Select(s => (object)s).ToList()
                        : new List<object>()
                });

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving bar drinks with sizes");
                return StatusCode(500, new { success = false, message = "Error retrieving bar drinks" });
            }
        }

        // MENU MANAGEMENT ENDPOINTS
        [HttpGet("menu-management")]
        public async Task<IActionResult> GetMenuManagement([FromQuery] int? hotelId = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string menuType = "", [FromQuery] string category = "", [FromQuery] string cuisine = "")
        {
            try
            {
                var query = _context.MenuManagements.Where(m => m.IsActive);

                if (hotelId.HasValue && hotelId.Value > 0)
                    query = query.Where(m => m.HotelId == hotelId.Value);
                
                if (!string.IsNullOrEmpty(menuType))
                    query = query.Where(m => m.MenuType == menuType);
                
                if (!string.IsNullOrEmpty(category))
                    query = query.Where(m => m.Category == category);
                
                if (!string.IsNullOrEmpty(cuisine))
                    query = query.Where(m => m.Cuisine == cuisine);

                var totalCount = await query.CountAsync();
                var menuItems = await query
                    .OrderBy(m => m.DisplayOrder)
                    .ThenBy(m => m.MenuName)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = menuItems, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving menu management");
                return StatusCode(500, new { success = false, message = "Error retrieving menu management" });
            }
        }

        [HttpGet("menu-management/{id}")]
        public async Task<IActionResult> GetMenuItem(int id)
        {
            try
            {
                var menuItem = await _context.MenuManagements
                    .FirstOrDefaultAsync(m => m.Id == id && m.IsActive);

                if (menuItem == null)
                    return NotFound(new { success = false, message = "Menu item not found" });

                return Ok(new { success = true, data = menuItem });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving menu item");
                return StatusCode(500, new { success = false, message = "Error retrieving menu item" });
            }
        }

        [HttpPost("menu-management")]
        public async Task<IActionResult> CreateMenuItem([FromBody] MenuManagement menuItem)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                // Check if menu code already exists
                var existingItem = await _context.MenuManagements.AnyAsync(m => m.MenuCode == menuItem.MenuCode && m.IsActive);
                if (existingItem)
                    return BadRequest(new { success = false, message = "Menu code already exists" });

                if (menuItem.HotelId.HasValue && menuItem.HotelId.Value > 0)
                {
                    var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == menuItem.HotelId.Value && h.IsActive);
                    if (!hotelExists)
                        return BadRequest(new { success = false, message = "Invalid hotel" });
                }

                menuItem.IsAvailable = menuItem.IsAvailable;
                menuItem.IsActive = true;
                menuItem.CreatedAt = DateTime.UtcNow;
                menuItem.UpdatedAt = DateTime.UtcNow;

                _context.MenuManagements.Add(menuItem);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetMenuItem), new { id = menuItem.Id },
                    new { success = true, data = menuItem, message = "Menu item created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating menu item");
                return StatusCode(500, new { success = false, message = "Error creating menu item" });
            }
        }

        [HttpPut("menu-management/{id}")]
        public async Task<IActionResult> UpdateMenuItem(int id, [FromBody] MenuManagement menuItem)
        {
            try
            {
                var existingItem = await _context.MenuManagements.FindAsync(id);
                if (existingItem == null || !existingItem.IsActive)
                    return NotFound(new { success = false, message = "Menu item not found" });

                if (menuItem.HotelId.HasValue && menuItem.HotelId.Value > 0)
                {
                    var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == menuItem.HotelId.Value && h.IsActive);
                    if (!hotelExists)
                        return BadRequest(new { success = false, message = "Invalid hotel" });
                    existingItem.HotelId = menuItem.HotelId.Value;
                }

                existingItem.MenuName = menuItem.MenuName;
                existingItem.Description = menuItem.Description;
                existingItem.MenuType = menuItem.MenuType;
                existingItem.Category = menuItem.Category;
                existingItem.Price = menuItem.Price;
                existingItem.CostPrice = menuItem.CostPrice;
                existingItem.Cuisine = menuItem.Cuisine;
                existingItem.IsVegetarian = menuItem.IsVegetarian;
                existingItem.IsHalal = menuItem.IsHalal;
                existingItem.IsSpicy = menuItem.IsSpicy;
                existingItem.Ingredients = menuItem.Ingredients;
                existingItem.ImagePath = menuItem.ImagePath;
                existingItem.PreparationTime = menuItem.PreparationTime;
                existingItem.IsAvailable = menuItem.IsAvailable;
                existingItem.DisplayOrder = menuItem.DisplayOrder;
                existingItem.ChefSpecial = menuItem.ChefSpecial;
                existingItem.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Menu item updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating menu item");
                return StatusCode(500, new { success = false, message = "Error updating menu item" });
            }
        }

        // RESTAURANT ORDER ENDPOINTS
        [HttpGet("restaurant-orders")]
        public async Task<IActionResult> GetRestaurantOrders([FromQuery] int? hotelId = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string status = "", [FromQuery] string orderType = "")
        {
            try
            {
                var query = _context.RestaurantOrders
                    .Include(o => o.Table)
                    .Include(o => o.Room)
                    .Include(o => o.Guest)
                    .Include(o => o.CheckIn)
                    .Where(o => o.IsActive);

                if (hotelId.HasValue && hotelId.Value > 0)
                    query = query.Where(o => o.HotelId == hotelId.Value);
                
                if (!string.IsNullOrEmpty(status))
                    query = query.Where(o => o.Status == status);
                
                if (!string.IsNullOrEmpty(orderType))
                    query = query.Where(o => o.OrderType == orderType);

                var totalCount = await query.CountAsync();
                var orders = await query
                    .OrderByDescending(o => o.OrderDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = orders, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving restaurant orders");
                return StatusCode(500, new { success = false, message = "Error retrieving restaurant orders" });
            }
        }

        [HttpGet("restaurant-orders/{id}")]
        public async Task<IActionResult> GetRestaurantOrder(int id)
        {
            try
            {
                var order = await _context.RestaurantOrders
                    .Include(o => o.Table)
                    .Include(o => o.Room)
                    .Include(o => o.Guest)
                    .Include(o => o.CheckIn)
                    .FirstOrDefaultAsync(o => o.Id == id && o.IsActive);

                if (order == null)
                    return NotFound(new { success = false, message = "Restaurant order not found" });

                // Get order items
                var orderItems = await _context.OrderItems
                    .Include(i => i.MenuItem)
                    .Where(i => i.OrderId == id && i.IsActive)
                    .ToListAsync();

                return Ok(new { success = true, data = new { order, items = orderItems } });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving restaurant order");
                return StatusCode(500, new { success = false, message = "Error retrieving restaurant order" });
            }
        }

        [HttpPost("restaurant-orders")]
        public async Task<IActionResult> CreateRestaurantOrder([FromBody] RestaurantOrder order)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                if (order.CheckInId.HasValue)
                {
                    var checkIn = await _context.CheckInMasters
                        .Include(c => c.Guest)
                        .FirstOrDefaultAsync(c => c.Id == order.CheckInId.Value && c.IsActive && c.Status == "Active");

                    if (checkIn == null)
                        return BadRequest(new { success = false, message = "Invalid or inactive check-in" });

                    order.GuestId = checkIn.GuestId;
                    if (checkIn.Guest != null)
                        order.GuestName = checkIn.Guest.FullName;

                    if (!order.RoomId.HasValue)
                        order.RoomId = checkIn.RoomId;
                }

                if (order.GuestId.HasValue)
                {
                    var guestExists = await _context.Guests.AnyAsync(g => g.Id == order.GuestId.Value && g.IsActive);
                    if (!guestExists)
                        return BadRequest(new { success = false, message = "Invalid guest" });
                }

                if (order.HotelId.HasValue && order.HotelId.Value > 0)
                {
                    var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == order.HotelId.Value && h.IsActive);
                    if (!hotelExists)
                        return BadRequest(new { success = false, message = "Invalid hotel" });
                }

                if ((!order.HotelId.HasValue || order.HotelId.Value <= 0) && order.TableId.HasValue)
                {
                    var table = await _context.TableMasters.FirstOrDefaultAsync(t => t.Id == order.TableId.Value);
                    if (table != null && table.HotelId.HasValue)
                        order.HotelId = table.HotelId.Value;
                }

                if ((!order.HotelId.HasValue || order.HotelId.Value <= 0) && order.RoomId.HasValue)
                {
                    var room = await _context.Rooms.Include(r => r.RoomType).FirstOrDefaultAsync(r => r.Id == order.RoomId.Value);
                    if (room?.RoomType?.HotelId != null)
                        order.HotelId = room.RoomType.HotelId.Value;
                }

                var pakistanTime = DateTime.Now; // Use server local time (Pakistan)
                order.OrderNumber = $"ORD{pakistanTime:yyyyMMdd}{new Random().Next(1000, 9999)}";
                order.OrderDate = pakistanTime;
                order.Status = "Pending";
                order.PaymentStatus = "Pending";
                order.IsActive = true;
                order.CreatedAt = pakistanTime;
                order.UpdatedAt = pakistanTime;

                _context.RestaurantOrders.Add(order);
                await _context.SaveChangesAsync();

                if (order.OrderType == "Dine-in" && order.TableId.HasValue)
                {
                    var table = await _context.TableMasters.FirstOrDefaultAsync(t => t.Id == order.TableId.Value);
                    if (table != null)
                    {
                        table.Status = "Occupied";
                        table.UpdatedAt = DateTime.UtcNow;
                        await _context.SaveChangesAsync();
                    }
                }

                return CreatedAtAction(nameof(GetRestaurantOrder), new { id = order.Id },
                    new { success = true, data = order, message = "Restaurant order created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating restaurant order");
                return StatusCode(500, new { success = false, message = "Error creating restaurant order" });
            }
        }

        [HttpPut("restaurant-orders/{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string status)
        {
            try
            {
                var order = await _context.RestaurantOrders.FindAsync(id);
                if (order == null || !order.IsActive)
                    return NotFound(new { success = false, message = "Restaurant order not found" });

                order.Status = status;
                order.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                if (order.OrderType == "Dine-in" && order.TableId.HasValue &&
                    (status == "Completed" || status == "Closed" || status == "Paid"))
                {
                    var table = await _context.TableMasters.FirstOrDefaultAsync(t => t.Id == order.TableId.Value);
                    if (table != null)
                    {
                        table.Status = "Available";
                        table.UpdatedAt = DateTime.UtcNow;
                        await _context.SaveChangesAsync();
                    }
                }
                return Ok(new { success = true, message = "Order status updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order status");
                return StatusCode(500, new { success = false, message = "Error updating order status" });
            }
        }

        // TABLE RESERVATIONS (RestaurantTableReservation)
        [HttpGet("table-reservations")]
        public async Task<IActionResult> GetTableReservations([FromQuery] int? hotelId = null, [FromQuery] DateTime? date = null)
        {
            try
            {
                var query = _context.RestaurantTableReservations
                    .Include(r => r.Table)
                    .Where(r => r.IsActive && !r.IsCancelled);

                if (hotelId.HasValue && hotelId.Value > 0)
                    query = query.Where(r => r.HotelId == hotelId.Value);

                if (date.HasValue)
                {
                    var d = date.Value.Date;
                    query = query.Where(r => r.ReservationDateTime.Date == d);
                }

                var list = await query
                    .OrderByDescending(r => r.ReservationDateTime)
                    .ToListAsync();

                var result = list.Select(r => new
                {
                    id = r.Id,
                    hotelId = r.HotelId,
                    guestId = r.GuestId,
                    checkInId = r.CheckInId,
                    guestName = r.GuestName,
                    guestPhone = r.GuestPhone,
                    guestEmail = r.GuestEmail,
                    roomNumber = r.RoomNumber,
                    tableId = r.TableId,
                    tableName = r.Table != null ? $"Table {r.Table.TableNumber}" : string.Empty,
                    tableLocation = r.Table?.Location,
                    reservationDate = r.ReservationDateTime.ToString("yyyy-MM-dd"),
                    reservationTime = r.ReservationDateTime.ToString("HH:mm"),
                    numberOfGuests = r.NumberOfGuests,
                    duration = r.DurationHours,
                    specialRequests = r.SpecialRequests,
                    advanceAmount = r.AdvanceAmount,
                    status = r.Status,
                    isActive = r.IsActive
                });

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving table reservations");
                return StatusCode(500, new { success = false, message = "Error retrieving table reservations" });
            }
        }

        [HttpGet("table-reservations/{id}")]
        public async Task<IActionResult> GetTableReservation(int id)
        {
            try
            {
                var r = await _context.RestaurantTableReservations
                    .Include(x => x.Table)
                    .FirstOrDefaultAsync(x => x.Id == id && x.IsActive);

                if (r == null)
                    return NotFound(new { success = false, message = "Reservation not found" });

                return Ok(new { success = true, data = r });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving table reservation");
                return StatusCode(500, new { success = false, message = "Error retrieving table reservation" });
            }
        }

        [HttpPost("table-reservations")]
        public async Task<IActionResult> CreateTableReservation([FromBody] RestaurantTableReservation reservation)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                if (reservation.HotelId.HasValue && reservation.HotelId.Value > 0)
                {
                    var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == reservation.HotelId.Value && h.IsActive);
                    if (!hotelExists)
                        return BadRequest(new { success = false, message = "Invalid hotel" });
                }

                // derive hotel from table if not provided
                if ((!reservation.HotelId.HasValue || reservation.HotelId.Value <= 0))
                {
                    var table = await _context.TableMasters.FirstOrDefaultAsync(t => t.Id == reservation.TableId && t.IsActive);
                    if (table?.HotelId != null)
                        reservation.HotelId = table.HotelId.Value;
                }

                if (reservation.CheckInId.HasValue)
                {
                    var checkIn = await _context.CheckInMasters
                        .Include(c => c.Guest)
                        .FirstOrDefaultAsync(c => c.Id == reservation.CheckInId.Value && c.IsActive && c.Status == "Active");
                    if (checkIn == null)
                        return BadRequest(new { success = false, message = "Invalid or inactive check-in" });

                    reservation.GuestId = checkIn.GuestId;
                    if (checkIn.Guest != null)
                        reservation.GuestName = checkIn.Guest.FullName;

                    if (string.IsNullOrWhiteSpace(reservation.RoomNumber))
                        reservation.RoomNumber = checkIn.RoomId.ToString();
                }

                reservation.IsActive = true;
                reservation.CreatedAt = DateTime.UtcNow;
                reservation.UpdatedAt = DateTime.UtcNow;

                _context.RestaurantTableReservations.Add(reservation);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = reservation, message = "Reservation created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating table reservation");
                return StatusCode(500, new { success = false, message = "Error creating table reservation" });
            }
        }

        [HttpPut("table-reservations/{id}")]
        public async Task<IActionResult> UpdateTableReservation(int id, [FromBody] RestaurantTableReservation update)
        {
            try
            {
                var existing = await _context.RestaurantTableReservations.FirstOrDefaultAsync(r => r.Id == id && r.IsActive);
                if (existing == null)
                    return NotFound(new { success = false, message = "Reservation not found" });

                existing.TableId = update.TableId;
                existing.GuestName = update.GuestName;
                existing.GuestPhone = update.GuestPhone;
                existing.GuestEmail = update.GuestEmail;
                existing.RoomNumber = update.RoomNumber;
                existing.ReservationDateTime = update.ReservationDateTime;
                existing.NumberOfGuests = update.NumberOfGuests;
                existing.DurationHours = update.DurationHours;
                existing.SpecialRequests = update.SpecialRequests;
                existing.AdvanceAmount = update.AdvanceAmount;
                existing.Status = update.Status;
                existing.IsCancelled = update.IsCancelled;
                existing.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, data = existing, message = "Reservation updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating table reservation");
                return StatusCode(500, new { success = false, message = "Error updating table reservation" });
            }
        }

        [HttpDelete("table-reservations/{id}")]
        public async Task<IActionResult> DeleteTableReservation(int id)
        {
            try
            {
                var existing = await _context.RestaurantTableReservations.FirstOrDefaultAsync(r => r.Id == id && r.IsActive);
                if (existing == null)
                    return NotFound(new { success = false, message = "Reservation not found" });

                existing.IsActive = false;
                existing.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Reservation deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting table reservation");
                return StatusCode(500, new { success = false, message = "Error deleting table reservation" });
            }
        }

        // ORDER ITEMS ENDPOINTS
        [HttpGet("order-items/{orderId}")]
        public async Task<IActionResult> GetOrderItems(int orderId)
        {
            try
            {
                var items = await _context.OrderItems
                    .Include(i => i.MenuItem)
                    .Include(i => i.BarItem)
                    .Where(i => i.OrderId == orderId && i.IsActive)
                    .ToListAsync();

                return Ok(new { success = true, data = items });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving order items");
                return StatusCode(500, new { success = false, message = "Error retrieving order items" });
            }
        }

        [HttpPost("order-items")]
        public async Task<IActionResult> CreateOrderItem([FromBody] OrderItem item)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                if (!item.MenuItemId.HasValue && !item.BarItemId.HasValue)
                    return BadRequest(new { success = false, message = "Either MenuItemId or BarItemId is required" });

                if (item.MenuItemId.HasValue && item.BarItemId.HasValue)
                    return BadRequest(new { success = false, message = "Only one of MenuItemId or BarItemId should be provided" });

                if (item.MenuItemId.HasValue && item.DrinksPricingId.HasValue)
                    return BadRequest(new { success = false, message = "DrinksPricingId is only allowed for bar items" });

                decimal resolvedUnitPrice = item.UnitPrice;

                if (item.MenuItemId.HasValue)
                {
                    // OrderItems.MenuItemId references MenuItems(MenuItemID) table
                    _logger.LogInformation($"[CreateOrderItem] Received MenuItemId: {item.MenuItemId.Value}");

                    var menuItem = await _context.MenuItems
                        .FirstOrDefaultAsync(m => m.MenuItemID == item.MenuItemId.Value && m.IsActive);

                    if (menuItem == null)
                    {
                        _logger.LogError($"[CreateOrderItem] MenuItemId {item.MenuItemId.Value} NOT found in MenuItems table. Returning 400.");
                        return BadRequest(new { success = false, message = "Invalid menu item" });
                    }

                    _logger.LogInformation($"[CreateOrderItem] Found MenuItem: Id={menuItem.MenuItemID}, Name={menuItem.Name}, Price={menuItem.Price}");
                    resolvedUnitPrice = menuItem.Price;
                }

                if (item.BarItemId.HasValue)
                {
                    var drink = await _context.BarManagements
                        .FirstOrDefaultAsync(b => b.Id == item.BarItemId.Value && b.IsActive);
                    if (drink == null)
                        return BadRequest(new { success = false, message = "Invalid bar item" });

                    DrinksPricing drinkPricing = null;
                    if (item.DrinksPricingId.HasValue)
                    {
                        drinkPricing = await _context.DrinksPricings.FirstOrDefaultAsync(p => p.Id == item.DrinksPricingId.Value && p.IsActive);
                        if (drinkPricing == null)
                            return BadRequest(new { success = false, message = "Invalid drink pricing" });

                        if (!string.Equals(drinkPricing.DrinkCode, drink.DrinkCode, StringComparison.OrdinalIgnoreCase))
                            return BadRequest(new { success = false, message = "Selected drink size does not belong to this drink" });

                        resolvedUnitPrice = drinkPricing.Price;
                    }
                    else
                    {
                        resolvedUnitPrice = drink.Price;
                    }

                    if (drinkPricing != null && drinkPricing.ItemMasterId.HasValue)
                    {
                        var stockItem = await _context.ItemMasters.FirstOrDefaultAsync(i => i.Id == drinkPricing.ItemMasterId.Value && i.IsActive);
                        if (stockItem == null)
                            return BadRequest(new { success = false, message = "Stock item not found for selected drink size" });

                        if (stockItem.CurrentStock < item.Quantity)
                            return BadRequest(new { success = false, message = $"Insufficient stock. Available: {stockItem.CurrentStock}" });

                        stockItem.CurrentStock -= item.Quantity;
                        stockItem.UpdatedAt = DateTime.UtcNow;

                        var stockTx = new StockManagement
                        {
                            ItemId = stockItem.Id,
                            TransactionDate = DateTime.UtcNow,
                            TransactionType = "Issue",
                            Quantity = item.Quantity,
                            UnitPrice = drinkPricing.CostPrice,
                            TotalValue = item.Quantity * drinkPricing.CostPrice,
                            StockBalance = stockItem.CurrentStock,
                            Reference = $"ORDER-{item.OrderId}",
                            Department = "Restaurant & Bar",
                            IssuedTo = "POS",
                            PostedBy = "POS",
                            Remarks = "Auto issue from Restaurant order",
                            IsActive = true,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        };

                        _context.StockManagements.Add(stockTx);
                    }
                }

                item.UnitPrice = resolvedUnitPrice;

                item.TotalPrice = item.Quantity * item.UnitPrice;
                item.Status = "Ordered";
                item.IsActive = true;
                item.CreatedAt = DateTime.Now; // Use server local time (Pakistan)
                item.UpdatedAt = DateTime.Now;

                _context.OrderItems.Add(item);

                // Update order totals
                var order = await _context.RestaurantOrders.FindAsync(item.OrderId);
                if (order != null)
                {
                    var allItems = await _context.OrderItems
                        .Where(i => i.OrderId == item.OrderId && i.IsActive)
                        .ToListAsync();

                    var subTotal = allItems.Sum(i => i.TotalPrice) + item.TotalPrice;

                    decimal servicePercent = 5m;
                    decimal taxPercent = 10m;

                    var serviceSetting = await _context.SystemSettings
                        .Where(s => s.IsActive && s.SettingKey == "POS_SERVICE_CHARGE_PERCENT")
                        .OrderByDescending(s => s.UpdatedAt)
                        .FirstOrDefaultAsync();
                    if (serviceSetting != null && decimal.TryParse(serviceSetting.SettingValue, out var sp))
                        servicePercent = sp;

                    var taxSetting = await _context.SystemSettings
                        .Where(s => s.IsActive && s.SettingKey == "POS_TAX_PERCENT")
                        .OrderByDescending(s => s.UpdatedAt)
                        .FirstOrDefaultAsync();
                    if (taxSetting != null && decimal.TryParse(taxSetting.SettingValue, out var tp))
                        taxPercent = tp;

                    order.SubTotal = subTotal;
                    order.ServiceCharge = subTotal * (servicePercent / 100m);
                    order.TaxAmount = subTotal * (taxPercent / 100m);
                    order.TotalAmount = order.SubTotal + order.ServiceCharge + order.TaxAmount;
                    order.UpdatedAt = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return Ok(new { success = true, data = item, message = "Order item added successfully" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error creating order item");
                return StatusCode(500, new { success = false, message = "Error creating order item" });
            }
        }

        // TABLE MANAGEMENT ENDPOINTS
        [HttpGet("table-management")]
        public async Task<IActionResult> GetTableManagement([FromQuery] string status = "", [FromQuery] string location = "")
        {
            try
            {
                var query = _context.TableManagements.Where(t => t.IsActive);
                
                if (!string.IsNullOrEmpty(status))
                    query = query.Where(t => t.Status == status);
                
                if (!string.IsNullOrEmpty(location))
                    query = query.Where(t => t.Location == location);

                var tables = await query
                    .OrderBy(t => t.Location)
                    .ThenBy(t => t.TableNumber)
                    .ToListAsync();

                return Ok(new { success = true, data = tables });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving table management");
                return StatusCode(500, new { success = false, message = "Error retrieving table management" });
            }
        }

        [HttpPost("table-management")]
        public async Task<IActionResult> CreateTable([FromBody] TableManagement table)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                // Check if table number already exists
                var existingTable = await _context.TableManagements.AnyAsync(t => t.TableNumber == table.TableNumber && t.IsActive);
                if (existingTable)
                    return BadRequest(new { success = false, message = "Table number already exists" });

                table.Status = table.Status ?? "Available";
                table.IsActive = true;
                table.CreatedAt = DateTime.UtcNow;
                table.UpdatedAt = DateTime.UtcNow;

                _context.TableManagements.Add(table);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = table, message = "Table created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating table");
                return StatusCode(500, new { success = false, message = "Error creating table" });
            }
        }

        [HttpPut("table-management/{id}/status")]
        public async Task<IActionResult> UpdateTableStatus(int id, [FromBody] string status)
        {
            try
            {
                var table = await _context.TableManagements.FindAsync(id);
                if (table == null || !table.IsActive)
                    return NotFound(new { success = false, message = "Table not found" });

                table.Status = status;
                table.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Table status updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating table status");
                return StatusCode(500, new { success = false, message = "Error updating table status" });
            }
        }

        // KITCHEN DISPLAY ENDPOINTS
        [HttpGet("kitchen-display")]
        public async Task<IActionResult> GetKitchenDisplay([FromQuery] string status = "", [FromQuery] string kitchenSection = "", [FromQuery] string priority = "")
        {
            try
            {
                var query = _context.KitchenDisplays.Include(k => k.Order).Include(k => k.OrderItem).Where(k => k.IsActive);
                
                if (!string.IsNullOrEmpty(status))
                    query = query.Where(k => k.Status == status);
                
                if (!string.IsNullOrEmpty(kitchenSection))
                    query = query.Where(k => k.KitchenSection == kitchenSection);
                
                if (!string.IsNullOrEmpty(priority))
                    query = query.Where(k => k.Priority == priority);

                var kitchenItems = await query
                    .OrderBy(k => k.Priority == "Urgent" ? 1 : k.Priority == "High" ? 2 : 3)
                    .ThenBy(k => k.OrderTime)
                    .ToListAsync();

                return Ok(new { success = true, data = kitchenItems });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving kitchen display");
                return StatusCode(500, new { success = false, message = "Error retrieving kitchen display" });
            }
        }

        // LIVE KOT: derive kitchen tickets from RestaurantOrders + OrderItems
        [HttpGet("kitchen/orders")]
        public async Task<IActionResult> GetKitchenOrders([FromQuery] int? hotelId = null, [FromQuery] string status = "")
        {
            try
            {
                var ordersQuery = _context.RestaurantOrders
                    .Include(o => o.Room)
                    .Where(o => o.IsActive);

                if (hotelId.HasValue && hotelId.Value > 0)
                    ordersQuery = ordersQuery.Where(o => o.HotelId == hotelId.Value);

                // Default to active kitchen statuses when not specified
                if (string.IsNullOrEmpty(status))
                {
                    ordersQuery = ordersQuery.Where(o => o.Status != "Completed" && o.Status != "Closed" && o.Status != "Cancelled");
                }
                else
                {
                    ordersQuery = ordersQuery.Where(o => o.Status == status);
                }

                var orders = await ordersQuery
                    .OrderByDescending(o => o.OrderDate)
                    .Take(100)
                    .ToListAsync();

                var orderIds = orders.Select(o => o.Id).ToList();
                var items = await _context.OrderItems
                    .Include(i => i.MenuItem)
                    .Include(i => i.BarItem)
                    .Where(i => orderIds.Contains(i.OrderId) && i.IsActive)
                    .ToListAsync();

                // Also fetch table names
                var tableIds = orders.Where(o => o.TableId.HasValue).Select(o => o.TableId.Value).Distinct().ToList();
                var tables = await _context.RestaurantTables
                    .Where(t => tableIds.Contains(t.Id))
                    .ToDictionaryAsync(t => t.Id, t => t.TableNumber);

                var result = orders.Select(o => new
                {
                    id = o.Id,
                    orderNumber = o.OrderNumber,
                    orderTime = o.OrderDate,
                    estimatedTime = 20,
                    priority = "Normal",
                    status = o.Status ?? "Pending",
                    tableName = o.TableId.HasValue && tables.ContainsKey(o.TableId.Value) 
                        ? $"Table {tables[o.TableId.Value]}" 
                        : (o.RoomId.HasValue ? $"Room {o.RoomId.Value}" : "Takeaway"),
                    guestName = !string.IsNullOrWhiteSpace(o.GuestName) ? o.GuestName : "Guest",
                    items = items
                        .Where(i => i.OrderId == o.Id)
                        .Select(i => new
                        {
                            id = i.Id,
                            name = i.MenuItemId.HasValue 
                                ? (i.MenuItem != null ? i.MenuItem.Name : "Food Item")
                                : (i.BarItem != null ? i.BarItem.DrinkName : "Drink Item"),
                            quantity = i.Quantity,
                            status = !string.IsNullOrWhiteSpace(i.Status) ? i.Status : "Pending",
                            station = i.MenuItemId.HasValue ? "Hot Kitchen" : "Bar",
                            specialInstructions = i.SpecialInstructions ?? ""
                        })
                        .ToList()
                }).ToList();

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving kitchen orders");
                return StatusCode(500, new { success = false, message = "Error retrieving kitchen orders" });
            }
        }

        [HttpPost("kitchen-display")]
        public async Task<IActionResult> CreateKitchenDisplay([FromBody] KitchenDisplay kitchenItem)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                kitchenItem.OrderTime = DateTime.UtcNow;
                kitchenItem.Status = "Pending";
                kitchenItem.Priority = kitchenItem.Priority ?? "Normal";
                kitchenItem.IsActive = true;
                kitchenItem.CreatedAt = DateTime.UtcNow;
                kitchenItem.UpdatedAt = DateTime.UtcNow;

                _context.KitchenDisplays.Add(kitchenItem);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = kitchenItem, message = "Kitchen display item created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating kitchen display");
                return StatusCode(500, new { success = false, message = "Error creating kitchen display" });
            }
        }

        [HttpPut("kitchen-display/{id}/status")]
        public async Task<IActionResult> UpdateKitchenDisplayStatus(int id, [FromBody] string status)
        {
            try
            {
                var kitchenItem = await _context.KitchenDisplays.FindAsync(id);
                if (kitchenItem == null || !kitchenItem.IsActive)
                    return NotFound(new { success = false, message = "Kitchen display item not found" });

                kitchenItem.Status = status;
                
                if (status == "Preparing" && !kitchenItem.StartTime.HasValue)
                    kitchenItem.StartTime = DateTime.UtcNow;
                
                if (status == "Ready")
                    kitchenItem.CompletionTime = DateTime.UtcNow;

                kitchenItem.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Kitchen display status updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating kitchen display status");
                return StatusCode(500, new { success = false, message = "Error updating kitchen display status" });
            }
        }

        // BAR MANAGEMENT ENDPOINTS
        [HttpGet("bar-management")]
        public async Task<IActionResult> GetBarManagement([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string category = "", [FromQuery] bool? isAlcoholic = null)
        {
            try
            {
                var query = _context.BarManagements.Where(b => b.IsActive);
                
                if (!string.IsNullOrEmpty(category))
                    query = query.Where(b => b.Category == category);
                
                if (isAlcoholic.HasValue)
                    query = query.Where(b => b.IsAlcoholic == isAlcoholic.Value);

                var totalCount = await query.CountAsync();
                var drinks = await query
                    .OrderBy(b => b.Category)
                    .ThenBy(b => b.DisplayOrder)
                    .ThenBy(b => b.DrinkName)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = drinks, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving bar management");
                return StatusCode(500, new { success = false, message = "Error retrieving bar management" });
            }
        }

        [HttpPost("bar-management")]
        public async Task<IActionResult> CreateBarItem([FromBody] BarManagement drink)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                // Check if drink code already exists
                var existingDrink = await _context.BarManagements.AnyAsync(b => b.DrinkCode == drink.DrinkCode && b.IsActive);
                if (existingDrink)
                    return BadRequest(new { success = false, message = "Drink code already exists" });

                drink.IsAvailable = drink.IsAvailable;
                drink.IsActive = true;
                drink.CreatedAt = DateTime.UtcNow;
                drink.UpdatedAt = DateTime.UtcNow;

                _context.BarManagements.Add(drink);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = drink, message = "Bar item created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating bar item");
                return StatusCode(500, new { success = false, message = "Error creating bar item" });
            }
        }

        [HttpPut("bar-management/{id}")]
        public async Task<IActionResult> UpdateBarItem(int id, [FromBody] BarManagement drink)
        {
            try
            {
                var existingDrink = await _context.BarManagements.FindAsync(id);
                if (existingDrink == null || !existingDrink.IsActive)
                    return NotFound(new { success = false, message = "Bar item not found" });

                existingDrink.DrinkName = drink.DrinkName;
                existingDrink.DrinkCode = drink.DrinkCode;
                existingDrink.Description = drink.Description;
                existingDrink.Category = drink.Category;
                existingDrink.Price = drink.Price;
                existingDrink.CostPrice = drink.CostPrice;
                existingDrink.IsAlcoholic = drink.IsAlcoholic;
                existingDrink.AlcoholContent = drink.AlcoholContent;
                existingDrink.Brand = drink.Brand;
                existingDrink.Ingredients = drink.Ingredients;
                existingDrink.ImagePath = drink.ImagePath;
                existingDrink.IsAvailable = drink.IsAvailable;
                existingDrink.DisplayOrder = drink.DisplayOrder;
                existingDrink.ServingSize = drink.ServingSize;
                existingDrink.IsHappyHourItem = drink.IsHappyHourItem;
                existingDrink.HappyHourPrice = drink.HappyHourPrice;
                existingDrink.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Bar item updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating bar item");
                return StatusCode(500, new { success = false, message = "Error updating bar item" });
            }
        }

        [HttpDelete("bar-management/{id}")]
        public async Task<IActionResult> DeleteBarItem(int id)
        {
            try
            {
                var drink = await _context.BarManagements.FindAsync(id);
                if (drink == null || !drink.IsActive)
                    return NotFound(new { success = false, message = "Bar item not found" });

                drink.IsActive = false;
                drink.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Bar item deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting bar item");
                return StatusCode(500, new { success = false, message = "Error deleting bar item" });
            }
        }

        // ROOM SERVICE ENDPOINTS
        [HttpGet("room-service")]
        public async Task<IActionResult> GetRoomService([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string status = "")
        {
            try
            {
                var query = _context.RoomServices.Include(r => r.Room).Include(r => r.Order).Where(r => r.IsActive);
                
                if (!string.IsNullOrEmpty(status))
                    query = query.Where(r => r.Status == status);

                var totalCount = await query.CountAsync();
                var roomServices = await query
                    .OrderByDescending(r => r.RequestTime)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = roomServices, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room service");
                return StatusCode(500, new { success = false, message = "Error retrieving room service" });
            }
        }

        [HttpPost("room-service")]
        public async Task<IActionResult> CreateRoomService([FromBody] RoomService roomService)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                roomService.ServiceNumber = $"RS{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                roomService.RequestTime = DateTime.UtcNow;
                roomService.Status = "Requested";
                roomService.IsActive = true;
                roomService.CreatedAt = DateTime.UtcNow;
                roomService.UpdatedAt = DateTime.UtcNow;

                _context.RoomServices.Add(roomService);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = roomService, message = "Room service request created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating room service");
                return StatusCode(500, new { success = false, message = "Error creating room service" });
            }
        }

        [HttpPut("room-service/{id}/status")]
        public async Task<IActionResult> UpdateRoomServiceStatus(int id, [FromBody] string status)
        {
            try
            {
                var roomService = await _context.RoomServices.FindAsync(id);
                if (roomService == null || !roomService.IsActive)
                    return NotFound(new { success = false, message = "Room service not found" });

                roomService.Status = status;
                
                if (status == "Delivered")
                    roomService.DeliveryTime = DateTime.UtcNow;

                roomService.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Room service status updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating room service status");
                return StatusCode(500, new { success = false, message = "Error updating room service status" });
            }
        }

        [HttpDelete("room-service/{id}")]
        public async Task<IActionResult> DeleteRoomService(int id)
        {
            try
            {
                var roomService = await _context.RoomServices.FindAsync(id);
                if (roomService == null || !roomService.IsActive)
                    return NotFound(new { success = false, message = "Room service not found" });

                roomService.IsActive = false;
                roomService.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Room service deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting room service");
                return StatusCode(500, new { success = false, message = "Error deleting room service" });
            }
        }

        // KITCHEN HELPERS (for KitchenDisplay frontend)
        [HttpPut("kitchen/orders/{orderId}/status")]
        public async Task<IActionResult> UpdateKitchenOrderStatus(int orderId, [FromBody] KitchenStatusUpdateDto request)
        {
            try
            {
                var order = await _context.RestaurantOrders.FindAsync(orderId);
                if (order == null || !order.IsActive)
                    return NotFound(new { success = false, message = "Restaurant order not found" });

                order.Status = request.Status;
                order.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Order status updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating kitchen order status");
                return StatusCode(500, new { success = false, message = "Error updating kitchen order status" });
            }
        }

        [HttpPut("kitchen/orders/{orderId}/items/{itemId}/status")]
        public async Task<IActionResult> UpdateKitchenOrderItemStatus(int orderId, int itemId, [FromBody] KitchenStatusUpdateDto request)
        {
            try
            {
                var item = await _context.OrderItems.FirstOrDefaultAsync(i => i.Id == itemId && i.OrderId == orderId && i.IsActive);
                if (item == null)
                    return NotFound(new { success = false, message = "Order item not found" });

                item.Status = request.Status;
                item.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Item status updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating kitchen order item status");
                return StatusCode(500, new { success = false, message = "Error updating kitchen order item status" });
            }
        }
    }

    public class KitchenStatusUpdateDto
    {
        public string Status { get; set; }
    }
}
