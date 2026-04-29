using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SimpleCheckOutController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<SimpleCheckOutController> _logger;

        public SimpleCheckOutController(HotelDbContext context, ILogger<SimpleCheckOutController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // POST: api/simplecheckout/{checkInId}
        [HttpPost("{checkInId}")]
        public async Task<IActionResult> ProcessCheckOut(int checkInId)
        {
            try
            {
                _logger.LogInformation("Processing simple checkout for CheckInId: {CheckInId}", checkInId);

                // Find the check-in
                var checkIn = await _context.CheckInMasters
                    .Include(ci => ci.Room)
                    .FirstOrDefaultAsync(ci => ci.Id == checkInId);

                if (checkIn == null)
                {
                    return BadRequest(new { success = false, message = $"Check-in with ID {checkInId} not found" });
                }

                if (checkIn.Status == "CheckedOut")
                {
                    return BadRequest(new { success = false, message = "Guest has already been checked out" });
                }

                // Generate checkout number
                var lastCheckOut = await _context.CheckOutMasters
                    .OrderByDescending(c => c.Id)
                    .FirstOrDefaultAsync();

                var nextNumber = (lastCheckOut?.Id ?? 0) + 1;
                var checkOutNumber = $"CO{nextNumber:D6}";

                // Create checkout record
                var checkOut = new CheckOutMaster
                {
                    CheckOutNumber = checkOutNumber,
                    CheckInId = checkInId,
                    CheckOutDate = DateTime.UtcNow,
                    RoomCharges = 5000.00m,
                    ServiceCharges = 500.00m,
                    TaxAmount = 550.00m,
                    TotalBill = 6050.00m,
                    TotalPaid = 6050.00m,
                    Balance = 0.00m,
                    LateCheckOutCharges = 0.00m,
                    PaymentMethod = "Cash",
                    PaymentStatus = "Paid",
                    CheckedOutBy = "Reception Staff",
                    Remarks = "Quick checkout via simple API",
                    LateCheckOut = false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null,
                    IsActive = true
                };

                // Update statuses
                checkIn.Status = "CheckedOut";
                if (checkIn.Room != null)
                {
                    checkIn.Room.Status = "Available";
                }

                // Save to database
                _context.CheckOutMasters.Add(checkOut);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Checkout completed successfully: {CheckOutNumber}", checkOutNumber);

                return Ok(new
                {
                    success = true,
                    message = "Check-out completed successfully",
                    data = new
                    {
                        Id = checkOut.Id,
                        CheckOutNumber = checkOut.CheckOutNumber,
                        CheckInId = checkOut.CheckInId,
                        CheckOutDate = checkOut.CheckOutDate,
                        TotalBill = checkOut.TotalBill,
                        PaymentStatus = checkOut.PaymentStatus
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing simple checkout for CheckInId: {CheckInId}", checkInId);
                return StatusCode(500, new { success = false, message = $"Error processing checkout: {ex.Message}" });
            }
        }
    }
}
