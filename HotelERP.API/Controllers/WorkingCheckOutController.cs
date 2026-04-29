using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using System.Text.Json;

namespace HotelERP.API.Controllers
{
    [Route("api/working-checkout")]
    [ApiController]
    public class WorkingCheckOutController : ControllerBase
    {
        private readonly HotelDbContext _context;

        public WorkingCheckOutController(HotelDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> ProcessCheckOut([FromBody] JsonElement json)
        {
            try
            {
                // Extract checkInId safely
                if (!json.TryGetProperty("checkInId", out var checkInIdElement))
                    return BadRequest(new { success = false, message = "checkInId is required" });

                var checkInId = checkInIdElement.GetInt32();

                // Find check-in
                var checkIn = await _context.CheckInMasters
                    .Include(ci => ci.Room)
                    .FirstOrDefaultAsync(ci => ci.Id == checkInId);

                if (checkIn == null)
                    return BadRequest(new { success = false, message = "Check-in not found" });

                if (checkIn.Status == "CheckedOut")
                    return BadRequest(new { success = false, message = "Already checked out" });

                // Generate checkout number
                var count = await _context.CheckOutMasters.CountAsync();
                var checkOutNumber = $"CO{(count + 1):D6}";

                // Extract values with defaults
                var roomCharges = json.TryGetProperty("roomCharges", out var rc) ? rc.GetDecimal() : 5000m;
                var serviceCharges = json.TryGetProperty("serviceCharges", out var sc) ? sc.GetDecimal() : 500m;
                var taxAmount = json.TryGetProperty("taxAmount", out var ta) ? ta.GetDecimal() : 550m;
                var totalBill = json.TryGetProperty("totalBill", out var tb) ? tb.GetDecimal() : 6050m;
                var totalPaid = json.TryGetProperty("totalPaid", out var tp) ? tp.GetDecimal() : 6050m;
                var balance = json.TryGetProperty("balance", out var bal) ? bal.GetDecimal() : 0m;
                var paymentMethod = json.TryGetProperty("paymentMethod", out var pm) ? pm.GetString() : "Cash";
                var paymentStatus = json.TryGetProperty("paymentStatus", out var ps) ? ps.GetString() : "Paid";
                var remarks = json.TryGetProperty("remarks", out var rem) ? rem.GetString() : "Checkout via API";

                // Create checkout record
                var checkOut = new CheckOutMaster
                {
                    CheckOutNumber = checkOutNumber,
                    CheckInId = checkInId,
                    CheckOutDate = DateTime.UtcNow,
                    RoomCharges = roomCharges,
                    ServiceCharges = serviceCharges,
                    TaxAmount = taxAmount,
                    TotalBill = totalBill,
                    TotalPaid = totalPaid,
                    Balance = balance,
                    LateCheckOutCharges = 0m,
                    PaymentMethod = paymentMethod ?? "Cash",
                    PaymentStatus = paymentStatus ?? "Paid",
                    CheckedOutBy = "Reception Staff",
                    Remarks = remarks ?? "Checkout via API",
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
                return StatusCode(500, new { success = false, message = $"Error: {ex.Message}" });
            }
        }
    }
}
