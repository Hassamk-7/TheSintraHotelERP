using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using System.Text.Json;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SimpleCheckInsController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<SimpleCheckInsController> _logger;

        public SimpleCheckInsController(HotelDbContext context, ILogger<SimpleCheckInsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // POST: api/simplecheckins
        [HttpPost]
        public async Task<IActionResult> CreateCheckIn()
        {
            try
            {
                // Read raw JSON
                using var reader = new StreamReader(Request.Body);
                var jsonString = await reader.ReadToEndAsync();
                
                _logger.LogInformation("Received JSON: {Json}", jsonString);
                
                var jsonDoc = JsonDocument.Parse(jsonString);
                var root = jsonDoc.RootElement;

                // Create CheckIn entity
                var checkIn = new CheckInMaster
                {
                    // Handle ReservationId - can be null
                    ReservationId = root.TryGetProperty("reservationId", out var resId) && 
                                   !string.IsNullOrEmpty(resId.GetString()) ? 
                                   int.Parse(resId.GetString()) : null,
                    
                    // Required fields
                    GuestId = root.GetProperty("guestId").GetInt32(),
                    RoomId = root.GetProperty("roomId").GetInt32(),
                    CheckInDate = DateTime.Parse(root.GetProperty("checkInDate").GetString()),
                    ExpectedCheckOutDate = DateTime.Parse(root.GetProperty("expectedCheckOutDate").GetString()),
                    
                    // Optional fields
                    NumberOfGuests = root.TryGetProperty("numberOfGuests", out var ng) ? ng.GetInt32() : 1,
                    RoomRate = root.TryGetProperty("roomRate", out var rr) ? rr.GetDecimal() : 0,
                    TotalAmount = root.TryGetProperty("totalAmount", out var ta) ? ta.GetDecimal() : 0,
                    AdvancePaid = root.TryGetProperty("advancePaid", out var ap) ? ap.GetDecimal() : 0,
                    
                    // String fields
                    Status = "Active",
                    SpecialRequests = root.TryGetProperty("specialRequests", out var sr) ? sr.GetString() : null,
                    CheckedInBy = root.TryGetProperty("checkedInBy", out var cb) ? cb.GetString() : "Reception Staff",
                    Remarks = root.TryGetProperty("remarks", out var rem) ? rem.GetString() : null,
                    
                    // System fields
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                // Generate check-in number
                var lastCheckIn = await _context.CheckInMasters
                    .OrderByDescending(c => c.Id)
                    .FirstOrDefaultAsync();
                
                var nextNumber = (lastCheckIn?.Id ?? 0) + 1;
                checkIn.CheckInNumber = $"CI{nextNumber:D6}";

                // Update room status
                var room = await _context.Rooms.FindAsync(checkIn.RoomId);
                if (room != null)
                {
                    room.Status = "Occupied";
                }

                // Update reservation status if linked
                if (checkIn.ReservationId.HasValue)
                {
                    var reservation = await _context.Reservations.FindAsync(checkIn.ReservationId.Value);
                    if (reservation != null)
                    {
                        reservation.Status = "CheckedIn";
                    }
                }

                // Save to database
                _context.CheckInMasters.Add(checkIn);
                await _context.SaveChangesAsync();

                // Return success response
                var response = new
                {
                    Id = checkIn.Id,
                    CheckInNumber = checkIn.CheckInNumber,
                    GuestId = checkIn.GuestId,
                    RoomId = checkIn.RoomId,
                    CheckInDate = checkIn.CheckInDate,
                    ExpectedCheckOutDate = checkIn.ExpectedCheckOutDate,
                    Status = checkIn.Status,
                    TotalAmount = checkIn.TotalAmount
                };

                return Ok(new { success = true, data = response, message = "Check-in created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating check-in: {Error}", ex.Message);
                return BadRequest(new { success = false, message = $"Error creating check-in: {ex.Message}" });
            }
        }
    }
}
