using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GuestBillsController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<GuestBillsController> _logger;

        public GuestBillsController(HotelDbContext context, ILogger<GuestBillsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/GuestBills
        [HttpGet]
        public async Task<ActionResult<object>> GetGuestBills()
        {
            try
            {
                var bills = await _context.GuestBills
                    .Where(b => b.IsActive)
                    .Include(b => b.Guest)
                    .Include(b => b.CheckIn)
                    .Include(b => b.Reservation)
                    .OrderByDescending(b => b.CreatedAt)
                    .Select(b => new
                    {
                        b.Id,
                        b.BillNumber,
                        b.GuestName,
                        b.RoomNumber,
                        b.CheckInDate,
                        b.CheckOutDate,
                        b.RoomCharges,
                        b.RestaurantCharges,
                        b.LaundryCharges,
                        b.OtherCharges,
                        b.Discount,
                        b.TaxRate,
                        b.Subtotal,
                        b.TaxAmount,
                        b.TotalAmount,
                        b.PaymentMethod,
                        b.Status,
                        b.RecordType,
                        b.BillDate,
                        b.CreatedAt,
                        b.CheckInId,
                        b.CheckOutId,
                        b.ReservationId,
                        b.GuestId
                    })
                    .ToListAsync();

                _logger.LogInformation($"Retrieved {bills.Count} guest bills");

                return Ok(new
                {
                    success = true,
                    data = bills,
                    message = $"Retrieved {bills.Count} guest bills successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving guest bills");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error retrieving guest bills",
                    error = ex.Message
                });
            }
        }

        // GET: api/GuestBills/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetGuestBill(int id)
        {
            try
            {
                var bill = await _context.GuestBills
                    .Include(b => b.Guest)
                    .Include(b => b.CheckIn)
                    .Include(b => b.Reservation)
                    .FirstOrDefaultAsync(b => b.Id == id && b.IsActive);

                if (bill == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Guest bill not found"
                    });
                }

                return Ok(new
                {
                    success = true,
                    data = bill,
                    message = "Guest bill retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving guest bill with ID {id}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error retrieving guest bill",
                    error = ex.Message
                });
            }
        }

        // POST: api/GuestBills
        [HttpPost]
        public async Task<ActionResult<object>> CreateGuestBill([FromBody] GuestBill guestBill)
        {
            try
            {
                if (guestBill == null)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Guest bill data is required"
                    });
                }

                // Auto-populate missing fields from related tables
                await PopulateRelatedData(guestBill);

                // Set default values
                guestBill.CreatedAt = DateTime.Now;
                guestBill.IsActive = true;

                // Add to context
                _context.GuestBills.Add(guestBill);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Created guest bill with ID {guestBill.Id} for guest {guestBill.GuestName}");

                // Return with populated data
                var createdBill = await _context.GuestBills
                    .Include(b => b.Guest)
                    .Include(b => b.CheckIn)
                    .Include(b => b.Reservation)
                    .FirstOrDefaultAsync(b => b.Id == guestBill.Id);

                return CreatedAtAction(nameof(GetGuestBill), new { id = guestBill.Id }, new
                {
                    success = true,
                    data = createdBill,
                    message = "Guest bill created successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating guest bill");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error creating guest bill",
                    error = ex.Message
                });
            }
        }

        // PUT: api/GuestBills/5
        [HttpPut("{id}")]
        public async Task<ActionResult<object>> UpdateGuestBill(int id, [FromBody] GuestBill guestBill)
        {
            try
            {
                if (id != guestBill.Id)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "ID mismatch"
                    });
                }

                var existingBill = await _context.GuestBills.FindAsync(id);
                if (existingBill == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Guest bill not found"
                    });
                }

                // Auto-populate missing fields from related tables
                await PopulateRelatedData(guestBill);

                // Update properties
                existingBill.CheckInId = guestBill.CheckInId;
                existingBill.CheckOutId = guestBill.CheckOutId;
                existingBill.ReservationId = guestBill.ReservationId;
                existingBill.GuestId = guestBill.GuestId;
                existingBill.GuestName = guestBill.GuestName;
                existingBill.RoomNumber = guestBill.RoomNumber;
                existingBill.CheckInDate = guestBill.CheckInDate;
                existingBill.CheckOutDate = guestBill.CheckOutDate;
                existingBill.RoomCharges = guestBill.RoomCharges;
                existingBill.RestaurantCharges = guestBill.RestaurantCharges;
                existingBill.LaundryCharges = guestBill.LaundryCharges;
                existingBill.OtherCharges = guestBill.OtherCharges;
                existingBill.Discount = guestBill.Discount;
                existingBill.TaxRate = guestBill.TaxRate;
                existingBill.Subtotal = guestBill.Subtotal;
                existingBill.TaxAmount = guestBill.TaxAmount;
                existingBill.TotalAmount = guestBill.TotalAmount;
                existingBill.PaymentMethod = guestBill.PaymentMethod;
                existingBill.Status = guestBill.Status;
                existingBill.RecordType = guestBill.RecordType;
                existingBill.BillDate = guestBill.BillDate;

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Updated guest bill with ID {id}");

                return Ok(new
                {
                    success = true,
                    data = existingBill,
                    message = "Guest bill updated successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating guest bill with ID {id}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error updating guest bill",
                    error = ex.Message
                });
            }
        }

        // DELETE: api/GuestBills/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<object>> DeleteGuestBill(int id)
        {
            try
            {
                var bill = await _context.GuestBills.FindAsync(id);
                if (bill == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Guest bill not found"
                    });
                }

                // Soft delete
                bill.IsActive = false;
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Deleted guest bill with ID {id}");

                return Ok(new
                {
                    success = true,
                    message = "Guest bill deleted successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting guest bill with ID {id}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error deleting guest bill",
                    error = ex.Message
                });
            }
        }

        // Helper method to populate related data
        private async Task PopulateRelatedData(GuestBill guestBill)
        {
            try
            {
                // If ReservationId is provided, fetch reservation data
                if (guestBill.ReservationId.HasValue && guestBill.ReservationId > 0)
                {
                    var reservation = await _context.Reservations
                        .Include(r => r.Guest)
                        .Include(r => r.Room)
                        .FirstOrDefaultAsync(r => r.Id == guestBill.ReservationId);

                    if (reservation != null)
                    {
                        // Populate guest information
                        if (!guestBill.GuestId.HasValue)
                            guestBill.GuestId = reservation.GuestId;
                        
                        if (string.IsNullOrEmpty(guestBill.GuestName) && reservation.Guest != null)
                            guestBill.GuestName = reservation.Guest.FullName ?? $"{reservation.Guest.FirstName} {reservation.Guest.LastName}";

                        // Populate room information
                        if (string.IsNullOrEmpty(guestBill.RoomNumber) && reservation.Room != null)
                            guestBill.RoomNumber = reservation.Room.RoomNumber;

                        // Populate dates
                        if (!guestBill.CheckInDate.HasValue)
                            guestBill.CheckInDate = reservation.CheckInDate.Date;
                        
                        if (!guestBill.CheckOutDate.HasValue)
                            guestBill.CheckOutDate = reservation.CheckOutDate.Date;

                        // Find related CheckInId for this reservation
                        if (!guestBill.CheckInId.HasValue)
                        {
                            var checkIn = await _context.CheckInMasters
                                .FirstOrDefaultAsync(c => c.ReservationId == guestBill.ReservationId);
                            if (checkIn != null)
                            {
                                guestBill.CheckInId = checkIn.Id;
                                _logger.LogInformation($"Found and populated CheckInId {checkIn.Id} for Reservation {guestBill.ReservationId}");
                            }
                        }

                        // Find related CheckOutId for this reservation
                        if (!guestBill.CheckOutId.HasValue && guestBill.CheckInId.HasValue)
                        {
                            var checkOut = await _context.CheckOutMasters
                                .FirstOrDefaultAsync(c => c.CheckInId == guestBill.CheckInId);
                            if (checkOut != null)
                            {
                                guestBill.CheckOutId = checkOut.Id;
                                _logger.LogInformation($"Found and populated CheckOutId {checkOut.Id} for CheckIn {guestBill.CheckInId}");
                            }
                        }

                        _logger.LogInformation($"Populated guest bill data from Reservation ID {guestBill.ReservationId}");
                    }
                }

                // If CheckInId is provided, fetch check-in data
                if (guestBill.CheckInId.HasValue && guestBill.CheckInId > 0)
                {
                    var checkIn = await _context.CheckInMasters
                        .Include(c => c.Guest)
                        .Include(c => c.Room)
                        .FirstOrDefaultAsync(c => c.Id == guestBill.CheckInId);

                    if (checkIn != null)
                    {
                        // Populate guest information if not already set
                        if (!guestBill.GuestId.HasValue)
                            guestBill.GuestId = checkIn.GuestId;
                        
                        if (string.IsNullOrEmpty(guestBill.GuestName) && checkIn.Guest != null)
                            guestBill.GuestName = checkIn.Guest.FullName ?? $"{checkIn.Guest.FirstName} {checkIn.Guest.LastName}";

                        // Populate room information if not already set
                        if (string.IsNullOrEmpty(guestBill.RoomNumber) && checkIn.Room != null)
                            guestBill.RoomNumber = checkIn.Room.RoomNumber;

                        // Populate dates if not already set
                        if (!guestBill.CheckInDate.HasValue)
                            guestBill.CheckInDate = checkIn.CheckInDate.Date;
                        
                        if (!guestBill.CheckOutDate.HasValue)
                            guestBill.CheckOutDate = checkIn.ExpectedCheckOutDate.Date;

                        // Get ReservationId from CheckIn if not provided
                        if (!guestBill.ReservationId.HasValue)
                            guestBill.ReservationId = checkIn.ReservationId;

                        // Find related CheckOutId for this CheckIn
                        if (!guestBill.CheckOutId.HasValue)
                        {
                            var checkOut = await _context.CheckOutMasters
                                .FirstOrDefaultAsync(c => c.CheckInId == guestBill.CheckInId);
                            if (checkOut != null)
                            {
                                guestBill.CheckOutId = checkOut.Id;
                                _logger.LogInformation($"Found and populated CheckOutId {checkOut.Id} for CheckIn {guestBill.CheckInId}");
                            }
                        }

                        _logger.LogInformation($"Populated guest bill data from CheckIn ID {guestBill.CheckInId}");
                    }
                }

                // If CheckOutId is provided, fetch check-out data
                if (guestBill.CheckOutId.HasValue && guestBill.CheckOutId > 0)
                {
                    var checkOut = await _context.CheckOutMasters
                        .Include(c => c.CheckIn)
                        .ThenInclude(ci => ci.Guest)
                        .Include(c => c.CheckIn)
                        .ThenInclude(ci => ci.Room)
                        .FirstOrDefaultAsync(c => c.Id == guestBill.CheckOutId);

                    if (checkOut != null && checkOut.CheckIn != null)
                    {
                        // Populate guest information if not already set
                        if (!guestBill.GuestId.HasValue)
                            guestBill.GuestId = checkOut.CheckIn.GuestId;
                        
                        if (string.IsNullOrEmpty(guestBill.GuestName) && checkOut.CheckIn.Guest != null)
                            guestBill.GuestName = checkOut.CheckIn.Guest.FullName ?? $"{checkOut.CheckIn.Guest.FirstName} {checkOut.CheckIn.Guest.LastName}";

                        // Populate room information if not already set
                        if (string.IsNullOrEmpty(guestBill.RoomNumber) && checkOut.CheckIn.Room != null)
                            guestBill.RoomNumber = checkOut.CheckIn.Room.RoomNumber;

                        // Populate dates if not already set
                        if (!guestBill.CheckInDate.HasValue)
                            guestBill.CheckInDate = checkOut.CheckIn.CheckInDate.Date;
                        
                        if (!guestBill.CheckOutDate.HasValue)
                            guestBill.CheckOutDate = checkOut.CheckOutDate.Date;

                        // Set CheckInId and ReservationId if not provided
                        if (!guestBill.CheckInId.HasValue)
                            guestBill.CheckInId = checkOut.CheckInId;
                        
                        if (!guestBill.ReservationId.HasValue)
                            guestBill.ReservationId = checkOut.CheckIn.ReservationId;

                        _logger.LogInformation($"Populated guest bill data from CheckOut ID {guestBill.CheckOutId}");
                    }
                }

                // If only GuestId is provided, get guest info
                if (guestBill.GuestId.HasValue && string.IsNullOrEmpty(guestBill.GuestName))
                {
                    var guest = await _context.Guests.FindAsync(guestBill.GuestId.Value);
                    if (guest != null)
                    {
                        guestBill.GuestName = guest.FullName ?? $"{guest.FirstName} {guest.LastName}";
                        _logger.LogInformation($"Populated guest name from Guest ID {guestBill.GuestId}");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Warning: Could not populate some related data for guest bill");
                // Don't throw - let the bill creation proceed with provided data
            }
        }
    }
}
