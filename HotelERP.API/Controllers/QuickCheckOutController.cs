using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [Route("api/quick-checkout")]
    [ApiController]
    public class QuickCheckOutController : ControllerBase
    {
        private readonly HotelDbContext _context;

        public QuickCheckOutController(HotelDbContext context)
        {
            _context = context;
        }

        [HttpPost("{checkInId}")]
        public async Task<IActionResult> ProcessQuickCheckOut(int checkInId)
        {
            try
            {
                // Find check-in
                var checkIn = await _context.CheckInMasters.FindAsync(checkInId);
                if (checkIn == null)
                    return BadRequest(new { success = false, message = "Check-in not found" });

                if (checkIn.Status == "CheckedOut")
                    return BadRequest(new { success = false, message = "Already checked out" });

                // Generate checkout number
                var count = await _context.CheckOutMasters.CountAsync();
                var checkOutNumber = $"CO{(count + 1):D6}";

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
                    Remarks = "Quick checkout",
                    LateCheckOut = false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null,
                    IsActive = true
                };

                // Update check-in status
                checkIn.Status = "CheckedOut";

                // Save to database
                _context.CheckOutMasters.Add(checkOut);
                await _context.SaveChangesAsync();

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
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}
