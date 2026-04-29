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
    public class FrontOfficeController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<FrontOfficeController> _logger;

        public FrontOfficeController(HotelDbContext context, ILogger<FrontOfficeController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // RESERVATIONS ENDPOINTS
        [HttpGet("reservations")]
        public async Task<IActionResult> GetReservations([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "")
        {
            try
            {
                var query = _context.ReservationMasters.Include(r => r.Guest).Include(r => r.RoomType).Where(r => r.IsActive);
                
                if (!string.IsNullOrEmpty(search))
                    query = query.Where(r => r.ReservationNumber.Contains(search) || r.Guest.FirstName.Contains(search));

                var totalCount = await query.CountAsync();
                var reservations = await query.OrderByDescending(r => r.BookingDate).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

                return Ok(new { success = true, data = reservations, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving reservations");
                return StatusCode(500, new { success = false, message = "Error retrieving reservations" });
            }
        }

        [HttpPost("reservations")]
        public async Task<IActionResult> CreateReservation([FromBody] ReservationMaster reservation)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                reservation.ReservationNumber = $"RES{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                reservation.BookingDate = DateTime.UtcNow;
                reservation.Status = "Confirmed";
                reservation.IsActive = true;
                reservation.CreatedAt = DateTime.UtcNow;
                reservation.UpdatedAt = DateTime.UtcNow;

                _context.ReservationMasters.Add(reservation);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetReservations), new { id = reservation.Id },
                    new { success = true, data = reservation, message = "Reservation created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating reservation");
                return StatusCode(500, new { success = false, message = "Error creating reservation" });
            }
        }

        // CHECK-IN ENDPOINTS
        [HttpGet("checkins")]
        public async Task<IActionResult> GetCheckIns([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.CheckInMasters.Include(c => c.Guest).Include(c => c.Room).Where(c => c.IsActive);
                var totalCount = await query.CountAsync();
                var checkIns = await query.OrderByDescending(c => c.CheckInDate).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

                return Ok(new { success = true, data = checkIns, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving check-ins");
                return StatusCode(500, new { success = false, message = "Error retrieving check-ins" });
            }
        }

        [HttpPost("checkins")]
        public async Task<IActionResult> CreateCheckIn([FromBody] CheckInMaster checkIn)
        {
            try
            {
                checkIn.CheckInNumber = $"CHK{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                checkIn.Status = "Active";
                checkIn.IsActive = true;
                checkIn.CreatedAt = DateTime.UtcNow;
                checkIn.UpdatedAt = DateTime.UtcNow;

                _context.CheckInMasters.Add(checkIn);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = checkIn, message = "Check-in completed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing check-in");
                return StatusCode(500, new { success = false, message = "Error processing check-in" });
            }
        }

        // CHECK-OUT ENDPOINTS
        [HttpGet("checkouts")]
        public async Task<IActionResult> GetCheckOuts([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.CheckOutMasters.Include(c => c.CheckIn).ThenInclude(ci => ci.Guest).Where(c => c.IsActive);
                var totalCount = await query.CountAsync();
                var checkOuts = await query.OrderByDescending(c => c.CheckOutDate).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

                return Ok(new { success = true, data = checkOuts, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving check-outs");
                return StatusCode(500, new { success = false, message = "Error retrieving check-outs" });
            }
        }

        [HttpPost("checkouts")]
        public async Task<IActionResult> CreateCheckOut([FromBody] CheckOutMaster checkOut)
        {
            try
            {
                checkOut.CheckOutNumber = $"OUT{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                checkOut.IsActive = true;
                checkOut.CreatedAt = DateTime.UtcNow;
                checkOut.UpdatedAt = DateTime.UtcNow;

                _context.CheckOutMasters.Add(checkOut);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = checkOut, message = "Check-out completed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing check-out");
                return StatusCode(500, new { success = false, message = "Error processing check-out" });
            }
        }

        // ROOM STATUS ENDPOINTS
        [HttpGet("room-status")]
        public async Task<IActionResult> GetRoomStatus()
        {
            try
            {
                var roomStatus = await _context.RoomStatusMasters
                    .Include(rs => rs.Room)
                    .Where(rs => rs.IsActive)
                    .OrderBy(rs => rs.Room.RoomNumber)
                    .ToListAsync();

                return Ok(new { success = true, data = roomStatus });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room status");
                return StatusCode(500, new { success = false, message = "Error retrieving room status" });
            }
        }

        [HttpPut("room-status/{roomId}")]
        public async Task<IActionResult> UpdateRoomStatus(int roomId, [FromBody] RoomStatusMaster status)
        {
            try
            {
                var existingStatus = await _context.RoomStatusMasters.FirstOrDefaultAsync(rs => rs.RoomId == roomId && rs.IsActive);
                
                if (existingStatus != null)
                {
                    existingStatus.Status = status.Status;
                    existingStatus.HousekeepingStatus = status.HousekeepingStatus;
                    existingStatus.StatusDate = DateTime.UtcNow;
                    existingStatus.UpdatedBy = status.UpdatedBy;
                    existingStatus.Remarks = status.Remarks;
                    existingStatus.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    status.RoomId = roomId;
                    status.StatusDate = DateTime.UtcNow;
                    status.IsActive = true;
                    status.CreatedAt = DateTime.UtcNow;
                    status.UpdatedAt = DateTime.UtcNow;
                    _context.RoomStatusMasters.Add(status);
                }

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Room status updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating room status");
                return StatusCode(500, new { success = false, message = "Error updating room status" });
            }
        }

        // GUEST REGISTRATION ENDPOINTS
        [HttpGet("guest-registrations")]
        public async Task<IActionResult> GetGuestRegistrations([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.GuestRegistrations.Where(gr => gr.IsActive);
                var totalCount = await query.CountAsync();
                var registrations = await query.OrderByDescending(gr => gr.RegistrationDate).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

                return Ok(new { success = true, data = registrations, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving guest registrations");
                return StatusCode(500, new { success = false, message = "Error retrieving guest registrations" });
            }
        }

        [HttpPost("guest-registrations")]
        public async Task<IActionResult> CreateGuestRegistration([FromBody] GuestRegistration registration)
        {
            try
            {
                var incomingEmail = (registration.Email ?? string.Empty).Trim();
                var incomingEmailLower = incomingEmail.ToLower();

                var existing = string.IsNullOrWhiteSpace(incomingEmail)
                    ? null
                    : await _context.GuestRegistrations
                        .FirstOrDefaultAsync(gr => gr.Email != null && gr.Email.Trim().ToLower() == incomingEmailLower);

                if (existing == null)
                {
                    registration.Email = incomingEmail;
                    registration.Gender = registration.Gender ?? string.Empty;
                    registration.PhoneNumber = registration.PhoneNumber ?? string.Empty;
                    registration.Address = registration.Address ?? string.Empty;
                    registration.City = registration.City ?? string.Empty;
                    registration.Country = registration.Country ?? string.Empty;
                    registration.IdType = registration.IdType ?? string.Empty;
                    registration.IdNumber = registration.IdNumber ?? string.Empty;
                    registration.Nationality = registration.Nationality ?? string.Empty;
                    registration.Company = registration.Company ?? string.Empty;
                    registration.Purpose = registration.Purpose ?? string.Empty;
                    registration.RegisteredBy = registration.RegisteredBy ?? string.Empty;
                    registration.Remarks = registration.Remarks ?? string.Empty;
                    registration.RegistrationNumber = $"REG{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                    registration.RegistrationDate = DateTime.UtcNow;
                    registration.IsActive = true;
                    registration.CreatedAt = DateTime.UtcNow;
                    registration.UpdatedAt = DateTime.UtcNow;

                    _context.GuestRegistrations.Add(registration);
                    await _context.SaveChangesAsync();

                    return Ok(new { success = true, data = registration, message = "Guest registered successfully" });
                }

                // Email exists: update current record with latest values
                existing.FirstName = registration.FirstName;
                existing.LastName = registration.LastName;
                if (!string.IsNullOrWhiteSpace(incomingEmail)) existing.Email = incomingEmail;
                if (existing.PhoneNumber == null) existing.PhoneNumber = string.Empty;
                if (registration.PhoneNumber != null) existing.PhoneNumber = registration.PhoneNumber;
                if (existing.Address == null) existing.Address = string.Empty;
                if (registration.Address != null) existing.Address = registration.Address;
                if (existing.City == null) existing.City = string.Empty;
                if (registration.City != null) existing.City = registration.City;
                if (existing.Country == null) existing.Country = string.Empty;
                if (registration.Country != null) existing.Country = registration.Country;
                if (existing.IdType == null) existing.IdType = string.Empty;
                if (registration.IdType != null) existing.IdType = registration.IdType;
                if (existing.IdNumber == null) existing.IdNumber = string.Empty;
                if (registration.IdNumber != null) existing.IdNumber = registration.IdNumber;
                existing.DateOfBirth = registration.DateOfBirth;
                if (existing.Gender == null) existing.Gender = string.Empty;
                if (!string.IsNullOrWhiteSpace(registration.Gender)) existing.Gender = registration.Gender;
                if (existing.Nationality == null) existing.Nationality = string.Empty;
                if (registration.Nationality != null) existing.Nationality = registration.Nationality;
                if (existing.Company == null) existing.Company = string.Empty;
                if (registration.Company != null) existing.Company = registration.Company;
                if (existing.Purpose == null) existing.Purpose = string.Empty;
                if (registration.Purpose != null) existing.Purpose = registration.Purpose;
                if (existing.RegisteredBy == null) existing.RegisteredBy = string.Empty;
                if (registration.RegisteredBy != null) existing.RegisteredBy = registration.RegisteredBy;
                if (existing.Remarks == null) existing.Remarks = string.Empty;
                if (registration.Remarks != null) existing.Remarks = registration.Remarks;
                existing.IsActive = true;
                existing.RegistrationDate = DateTime.UtcNow;
                existing.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = existing, message = "Guest registration updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering guest");
                return StatusCode(500, new { success = false, message = "Error registering guest" });
            }
        }

        // WALK-IN GUESTS ENDPOINTS
        [HttpGet("walk-in-guests")]
        public async Task<IActionResult> GetWalkInGuests([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.WalkInGuests.Include(w => w.RoomType).Where(w => w.IsActive);
                var totalCount = await query.CountAsync();
                var walkIns = await query.OrderByDescending(w => w.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

                return Ok(new { success = true, data = walkIns, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving walk-in guests");
                return StatusCode(500, new { success = false, message = "Error retrieving walk-in guests" });
            }
        }

        [HttpPost("walk-in-guests")]
        public async Task<IActionResult> CreateWalkInGuest([FromBody] WalkInGuest walkIn)
        {
            try
            {
                walkIn.WalkInNumber = $"WLK{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                walkIn.Status = "Inquiry";
                walkIn.IsActive = true;
                walkIn.CreatedAt = DateTime.UtcNow;
                walkIn.UpdatedAt = DateTime.UtcNow;

                _context.WalkInGuests.Add(walkIn);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = walkIn, message = "Walk-in guest recorded successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error recording walk-in guest");
                return StatusCode(500, new { success = false, message = "Error recording walk-in guest" });
            }
        }
    }
}
