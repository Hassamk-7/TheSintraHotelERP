using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using HotelERP.API.DTOs;

namespace HotelERP.API.Controllers
{
    // [Authorize] // Temporarily disabled for testing
    public class CheckInsController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<CheckInsController> _logger;

        public CheckInsController(HotelDbContext context, ILogger<CheckInsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/checkins
        [HttpGet]
        public async Task<IActionResult> GetCheckIns(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? status = null)
        {
            try
            {
                var query = _context.CheckInMasters
                    .Include(c => c.Guest)
                    .Include(c => c.Room)
                    .Include(c => c.Reservation)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(c => c.Status == status);
                }

                var totalCount = await query.CountAsync();
                var checkIns = await query
                    .OrderByDescending(c => c.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(c => new
                    {
                        Id = c.Id,
                        CheckInNumber = c.CheckInNumber,
                        ReservationId = c.ReservationId,
                        GuestId = c.GuestId,
                        RoomId = c.RoomId,
                        CheckInDate = c.CheckInDate,
                        ExpectedCheckOutDate = c.ExpectedCheckOutDate,
                        NumberOfGuests = c.NumberOfGuests,
                        RoomRate = c.RoomRate,
                        TotalAmount = c.TotalAmount,
                        AdvancePaid = c.AdvancePaid,
                        Status = c.Status,
                        SpecialRequests = c.SpecialRequests,
                        CheckedInBy = c.CheckedInBy,
                        Remarks = c.Remarks,
                        Discount = c.Discount,
                        FBCredits = c.FBCredits,
                        PaymentMethod = c.PaymentMethod,
                        PaymentAccount = c.PaymentAccount,
                        RatePlanId = c.RatePlanId,
                        NTN = c.NTN,
                        GuestName2 = c.GuestName2,
                        GuestName3 = c.GuestName3,
                        GroupId = c.GroupId,
                        Source = c.Source,
                        Market = c.Market,
                        Region = c.Region,
                        Industry = c.Industry,
                        Purpose = c.Purpose,
                        ReferenceCompany = c.ReferenceCompany,
                        ReservationMadeBy = c.ReservationMadeBy,
                        Pickup = c.Pickup,
                        PickupStation = c.PickupStation,
                        PickupCarrier = c.PickupCarrier,
                        PickupTime = c.PickupTime,
                        DropOff = c.DropOff,
                        DropStation = c.DropStation,
                        BTCFolio = c.BTCFolio,
                        Folio1 = c.Folio1,
                        Folio2 = c.Folio2,
                        Folio3 = c.Folio3,
                        BTCComments = c.BTCComments,
                        BtcId = c.BtcId,
                        Complimentary = c.Complimentary,
                        Company = c.Company,
                        ComingFrom = c.ComingFrom,
                        Newspaper = c.Newspaper,
                        Meals = c.Meals,
                        VIPStatus = c.VIPStatus,
                        ReservationNotes = c.ReservationNotes,
                        CheckinNotes = c.CheckinNotes,
                        NoPost = c.NoPost,
                        EnteredBy = c.EnteredBy,
                        InclusivePrivileges = c.InclusivePrivileges,
                        CreatedAt = c.CreatedAt,
                        Guest = c.Guest != null ? new
                        {
                            Id = c.Guest.Id,
                            FullName = c.Guest.FullName,
                            Phone = c.Guest.PhoneNumber,
                            Email = c.Guest.Email
                        } : null,
                        Room = c.Room != null ? new
                        {
                            Id = c.Room.Id,
                            RoomNumber = c.Room.RoomNumber,
                            FloorNumber = c.Room.FloorNumber,
                            Status = c.Room.Status,
                            BasePrice = c.Room.BasePrice
                        } : null,
                        Reservation = c.Reservation != null ? new
                        {
                            Id = c.Reservation.Id,
                            ReservationNumber = c.Reservation.ReservationNumber,
                            Status = c.Reservation.Status
                        } : null
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = checkIns,
                    totalCount,
                    page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching check-ins");
                return StatusCode(500, new { success = false, message = "Error fetching check-ins" });
            }
        }

        // GET: api/checkins/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCheckIn(int id)
        {
            try
            {
                var checkIn = await _context.CheckInMasters
                    .Include(c => c.Guest)
                    .Include(c => c.Room)
                    .Include(c => c.Reservation)
                    .Where(c => c.Id == id)
                    .Select(c => new
                    {
                        Id = c.Id,
                        CheckInNumber = c.CheckInNumber,
                        ReservationId = c.ReservationId,
                        GuestId = c.GuestId,
                        RoomId = c.RoomId,
                        CheckInDate = c.CheckInDate,
                        ExpectedCheckOutDate = c.ExpectedCheckOutDate,
                        NumberOfGuests = c.NumberOfGuests,
                        RoomRate = c.RoomRate,
                        TotalAmount = c.TotalAmount,
                        AdvancePaid = c.AdvancePaid,
                        Status = c.Status,
                        SpecialRequests = c.SpecialRequests,
                        CheckedInBy = c.CheckedInBy,
                        Remarks = c.Remarks,
                        Discount = c.Discount,
                        FBCredits = c.FBCredits,
                        PaymentMethod = c.PaymentMethod,
                        PaymentAccount = c.PaymentAccount,
                        RatePlanId = c.RatePlanId,
                        NTN = c.NTN,
                        GuestName2 = c.GuestName2,
                        GuestName3 = c.GuestName3,
                        GroupId = c.GroupId,
                        Source = c.Source,
                        Market = c.Market,
                        Region = c.Region,
                        Industry = c.Industry,
                        Purpose = c.Purpose,
                        ReferenceCompany = c.ReferenceCompany,
                        ReservationMadeBy = c.ReservationMadeBy,
                        Pickup = c.Pickup,
                        PickupStation = c.PickupStation,
                        PickupCarrier = c.PickupCarrier,
                        PickupTime = c.PickupTime,
                        DropOff = c.DropOff,
                        DropStation = c.DropStation,
                        BTCFolio = c.BTCFolio,
                        Folio1 = c.Folio1,
                        Folio2 = c.Folio2,
                        Folio3 = c.Folio3,
                        BTCComments = c.BTCComments,
                        BtcId = c.BtcId,
                        Complimentary = c.Complimentary,
                        Company = c.Company,
                        ComingFrom = c.ComingFrom,
                        Newspaper = c.Newspaper,
                        Meals = c.Meals,
                        VIPStatus = c.VIPStatus,
                        ReservationNotes = c.ReservationNotes,
                        CheckinNotes = c.CheckinNotes,
                        NoPost = c.NoPost,
                        EnteredBy = c.EnteredBy,
                        InclusivePrivileges = c.InclusivePrivileges,
                        CreatedAt = c.CreatedAt,
                        Guest = c.Guest != null ? new
                        {
                            Id = c.Guest.Id,
                            FullName = c.Guest.FullName,
                            Phone = c.Guest.PhoneNumber,
                            Email = c.Guest.Email
                        } : null,
                        Room = c.Room != null ? new
                        {
                            Id = c.Room.Id,
                            RoomNumber = c.Room.RoomNumber,
                            FloorNumber = c.Room.FloorNumber,
                            Status = c.Room.Status,
                            BasePrice = c.Room.BasePrice
                        } : null,
                        Reservation = c.Reservation != null ? new
                        {
                            Id = c.Reservation.Id,
                            ReservationNumber = c.Reservation.ReservationNumber,
                            Status = c.Reservation.Status
                        } : null
                    })
                    .FirstOrDefaultAsync();

                if (checkIn == null)
                {
                    return NotFound(new { success = false, message = "Check-in not found" });
                }

                return Ok(new { success = true, data = checkIn });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching check-in {Id}", id);
                return StatusCode(500, new { success = false, message = "Error fetching check-in" });
            }
        }

        // POST: api/checkins
        [HttpPost]
        public async Task<IActionResult> CreateCheckIn([FromBody] CheckInCreateDto dto)
        {
            try
            {
                var guestId = dto.guestId;
                var roomId = dto.roomId;

                // Verify Guest exists
                var guest = await _context.Guests.FindAsync(guestId);
                if (guest == null)
                {
                    return BadRequest(new { success = false, message = $"Guest with ID {guestId} not found" });
                }

                // Verify Room exists and is available
                var room = await _context.Rooms.FindAsync(roomId);
                if (room == null)
                {
                    return BadRequest(new { success = false, message = $"Room with ID {roomId} not found" });
                }

                // Handle ReservationId validation - SIMPLIFIED (Fixed Option 1)
                int? reservationId = null;
                if (!string.IsNullOrWhiteSpace(dto.reservationId))
                {
                    if (int.TryParse(dto.reservationId, out var parsedResId))
                    {
                        reservationId = parsedResId;
                        
                        // ✅ FIXED: Just log the reservation ID, don't validate strictly
                        _logger.LogInformation("Linking check-in to reservation ID: {ReservationId}", reservationId.Value);
                        
                        // Optional: Try to find reservation for logging, but don't fail if not found
                        try
                        {
                            var reservation = await _context.ReservationMasters.FindAsync(reservationId.Value);
                            if (reservation != null)
                            {
                                _logger.LogInformation("Found reservation: {ReservationNumber} for Guest {GuestId}", reservation.ReservationNumber, reservation.GuestId);
                            }
                            else
                            {
                                _logger.LogWarning("Reservation with ID {ReservationId} not found, but proceeding with check-in", reservationId.Value);
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning(ex, "Could not verify reservation {ReservationId}, but proceeding with check-in", reservationId.Value);
                        }
                    }
                }

                // Generate check-in number FIRST
                var lastCheckIn = await _context.CheckInMasters
                    .OrderByDescending(c => c.Id)
                    .FirstOrDefaultAsync();
                
                var nextNumber = (lastCheckIn?.Id ?? 0) + 1;
                var checkInNumber = $"CI{nextNumber:D6}";

                // Extract and parse values safely
                var checkIn = new CheckInMaster
                {
                    CheckInNumber = checkInNumber, // Set this FIRST
                    ReservationId = reservationId, // Now correctly references ReservationMasters
                    GuestId = guestId,
                    RoomId = roomId,
                    CheckInDate = DateTime.Parse(dto.checkInDate),
                    ExpectedCheckOutDate = DateTime.Parse(dto.expectedCheckOutDate),
                    NumberOfGuests = dto.numberOfGuests > 0 ? dto.numberOfGuests : 1,
                    RoomRate = dto.roomRate > 0 ? dto.roomRate : (room?.BasePrice ?? 0m),
                    TotalAmount = dto.totalAmount > 0 ? dto.totalAmount : (room?.BasePrice ?? 0m),
                    AdvancePaid = dto.advancePaid,
                    Status = "Active",
                    SpecialRequests = dto.specialRequests ?? "", // NOT NULL field
                    CheckedInBy = string.IsNullOrWhiteSpace(dto.checkedInBy) ? "Reception Staff" : dto.checkedInBy,
                    Remarks = dto.remarks,
                    Discount = dto.discount,
                    FBCredits = dto.fbCredits,
                    PaymentMethod = dto.paymentMethod,
                    PaymentAccount = dto.paymentAccount,
                    RatePlanId = dto.ratePlanId,
                    NTN = dto.ntn,
                    GuestName2 = dto.guestName2,
                    GuestName3 = dto.guestName3,
                    GroupId = dto.groupId,
                    Source = dto.source,
                    Market = dto.market,
                    Region = dto.region,
                    Industry = dto.industry,
                    Purpose = dto.purpose,
                    ReferenceCompany = dto.referenceCompany,
                    ReservationMadeBy = dto.reservationMadeBy,
                    Pickup = dto.pickup,
                    PickupStation = dto.pickupStation,
                    PickupCarrier = dto.pickupCarrier,
                    PickupTime = dto.pickupTime,
                    DropOff = dto.dropOff,
                    DropStation = dto.dropStation,
                    BTCFolio = dto.btcFolio,
                    Folio1 = dto.folio1,
                    Folio2 = dto.folio2,
                    Folio3 = dto.folio3,
                    BTCComments = dto.btcComments,
                    BtcId = dto.btcId,
                    Complimentary = dto.complimentary,
                    Company = dto.company,
                    ComingFrom = dto.comingFrom,
                    Newspaper = dto.newspaper,
                    Meals = dto.meals,
                    VIPStatus = dto.vipStatus,
                    ReservationNotes = dto.reservationNotes,
                    CheckinNotes = dto.checkinNotes,
                    NoPost = dto.noPost,
                    EnteredBy = dto.enteredBy,
                    InclusivePrivileges = dto.inclusivePrivileges,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                // Update room status to Occupied
                room.Status = "Occupied";

                // Update reservation status if linked
                if (reservationId.HasValue)
                {
                    try
                    {
                        var reservation = await _context.ReservationMasters.FindAsync(reservationId.Value);
                        if (reservation != null)
                        {
                            reservation.Status = "CheckedIn";
                            _logger.LogInformation("✅ Updated reservation {ReservationId} ({ReservationNumber}) status to CheckedIn", reservationId.Value, reservation.ReservationNumber);
                        }
                        else
                        {
                            _logger.LogWarning("⚠️ Could not find reservation {ReservationId} to update status, but check-in will proceed", reservationId.Value);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "❌ Error updating reservation {ReservationId} status, but check-in will proceed", reservationId.Value);
                    }
                }

                _logger.LogInformation("About to save check-in to database...");
                _context.CheckInMasters.Add(checkIn);
                
                try
                {
                    await _context.SaveChangesAsync();
                    _logger.LogInformation("Check-in created successfully with ID: {CheckInId}", checkIn.Id);
                }
                catch (Exception saveEx)
                {
                    _logger.LogError(saveEx, "Database save failed. Inner exception: {InnerException}", saveEx.InnerException?.Message);
                    throw new Exception($"Database save failed: {saveEx.InnerException?.Message ?? saveEx.Message}");
                }

                // Return simplified response
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

                return CreatedAtAction(nameof(GetCheckIn), new { id = checkIn.Id }, 
                    new { success = true, data = response, message = "Check-in created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating check-in: {Error}", ex.Message);
                return BadRequest(new { success = false, message = $"Error creating check-in: {ex.Message}" });
            }
        }

        // PUT: api/checkins/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCheckIn(int id, [FromBody] CheckInUpdateDto dto)
        {
            if (id != dto.id)
            {
                return BadRequest(new { success = false, message = "ID mismatch" });
            }

            try
            {
                var existing = await _context.CheckInMasters.FirstOrDefaultAsync(c => c.Id == id);
                if (existing == null)
                {
                    return NotFound(new { success = false, message = "Check-in not found" });
                }

                // Update base fields
                int? reservationId = null;
                if (!string.IsNullOrWhiteSpace(dto.reservationId) && int.TryParse(dto.reservationId, out var parsedResId))
                {
                    reservationId = parsedResId;
                }

                existing.ReservationId = reservationId;
                existing.GuestId = dto.guestId;
                existing.RoomId = dto.roomId;
                existing.CheckInDate = DateTime.Parse(dto.checkInDate);
                existing.ExpectedCheckOutDate = DateTime.Parse(dto.expectedCheckOutDate);
                existing.NumberOfGuests = dto.numberOfGuests > 0 ? dto.numberOfGuests : 1;
                existing.RoomRate = dto.roomRate;
                existing.TotalAmount = dto.totalAmount;
                existing.AdvancePaid = dto.advancePaid;
                existing.SpecialRequests = dto.specialRequests ?? "";
                existing.CheckedInBy = string.IsNullOrWhiteSpace(dto.checkedInBy) ? "Reception Staff" : dto.checkedInBy;
                existing.Remarks = dto.remarks;

                // Optional fields
                existing.Discount = dto.discount;
                existing.FBCredits = dto.fbCredits;
                existing.PaymentMethod = dto.paymentMethod;
                existing.PaymentAccount = dto.paymentAccount;
                existing.RatePlanId = dto.ratePlanId;
                existing.NTN = dto.ntn;
                existing.GuestName2 = dto.guestName2;
                existing.GuestName3 = dto.guestName3;
                existing.GroupId = dto.groupId;
                existing.Source = dto.source;
                existing.Market = dto.market;
                existing.Region = dto.region;
                existing.Industry = dto.industry;
                existing.Purpose = dto.purpose;
                existing.ReferenceCompany = dto.referenceCompany;
                existing.ReservationMadeBy = dto.reservationMadeBy;
                existing.Pickup = dto.pickup;
                existing.PickupStation = dto.pickupStation;
                existing.PickupCarrier = dto.pickupCarrier;
                existing.PickupTime = dto.pickupTime;
                existing.DropOff = dto.dropOff;
                existing.DropStation = dto.dropStation;
                existing.BTCFolio = dto.btcFolio;
                existing.Folio1 = dto.folio1;
                existing.Folio2 = dto.folio2;
                existing.Folio3 = dto.folio3;
                existing.BTCComments = dto.btcComments;
                existing.BtcId = dto.btcId;
                existing.Complimentary = dto.complimentary;
                existing.Company = dto.company;
                existing.ComingFrom = dto.comingFrom;
                existing.Newspaper = dto.newspaper;
                existing.Meals = dto.meals;
                existing.VIPStatus = dto.vipStatus;
                existing.ReservationNotes = dto.reservationNotes;
                existing.CheckinNotes = dto.checkinNotes;
                existing.NoPost = dto.noPost;
                existing.EnteredBy = dto.enteredBy;
                existing.InclusivePrivileges = dto.inclusivePrivileges;

                existing.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = existing, message = "Check-in updated successfully" });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await CheckInExists(id))
                {
                    return NotFound(new { success = false, message = "Check-in not found" });
                }
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating check-in {Id}", id);
                return StatusCode(500, new { success = false, message = "Error updating check-in" });
            }
        }

        // DELETE: api/checkins/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCheckIn(int id)
        {
            try
            {
                var checkIn = await _context.CheckInMasters.FindAsync(id);
                if (checkIn == null)
                {
                    return NotFound(new { success = false, message = "Check-in not found" });
                }

                // Update room status back to Available
                var room = await _context.Rooms.FindAsync(checkIn.RoomId);
                if (room != null)
                {
                    room.Status = "Available";
                }

                _context.CheckInMasters.Remove(checkIn);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Check-in deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting check-in {Id}", id);
                return StatusCode(500, new { success = false, message = "Error deleting check-in" });
            }
        }

        // GET: api/checkins/active
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveCheckIns()
        {
            try
            {
                var activeCheckIns = await _context.CheckInMasters
                    .Include(c => c.Guest)
                    .Include(c => c.Room)
                    .Where(c => c.Status == "Active")
                    .Select(c => new
                    {
                        Id = c.Id,
                        CheckInNumber = c.CheckInNumber,
                        GuestName = c.Guest.FullName,
                        RoomNumber = c.Room.RoomNumber,
                        CheckInDate = c.CheckInDate,
                        ExpectedCheckOutDate = c.ExpectedCheckOutDate,
                        NumberOfGuests = c.NumberOfGuests,
                        RoomRate = c.RoomRate,
                        TotalAmount = c.TotalAmount,
                        AdvancePaid = c.AdvancePaid
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = activeCheckIns });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching active check-ins");
                return StatusCode(500, new { success = false, message = "Error fetching active check-ins" });
            }
        }

        private async Task<bool> CheckInExists(int id)
        {
            return await _context.CheckInMasters.AnyAsync(e => e.Id == id);
        }
    }
}
