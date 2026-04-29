using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using HotelERP.API.Data;
using HotelERP.API.Models;
using HotelERP.API.DTOs;
using HotelERP.API.Services;

namespace HotelERP.API.Controllers
{
    // [Authorize] // Temporarily disabled for testing
    public class ReservationsController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<ReservationsController> _logger;
        private readonly BookLogicService _bookLogic;

        public ReservationsController(HotelDbContext context, ILogger<ReservationsController> logger, BookLogicService bookLogic)
        {
            _context = context;
            _logger = logger;
            _bookLogic = bookLogic;
        }

        private async Task UpsertGuestRegistrationFromGuestAsync(Guest guest, string registeredBy)
        {
            var email = (guest.Email ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(email)) return;

            var emailLower = email.ToLower();

            var firstName = (guest.FirstName ?? string.Empty).Trim();
            var lastName = (guest.LastName ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(firstName) && string.IsNullOrWhiteSpace(lastName))
            {
                var full = (guest.FullName ?? string.Empty).Trim();
                if (!string.IsNullOrWhiteSpace(full))
                {
                    var parts = full.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                    if (parts.Length > 0) firstName = parts[0];
                    if (parts.Length > 1) lastName = string.Join(' ', parts.Skip(1));
                }
            }

            if (string.IsNullOrWhiteSpace(firstName) && string.IsNullOrWhiteSpace(lastName)) return;
            if (string.IsNullOrWhiteSpace(firstName)) firstName = lastName;
            if (string.IsNullOrWhiteSpace(lastName)) lastName = string.Empty;

            var gender = (guest.Gender ?? string.Empty).Trim();

            var existing = await _context.GuestRegistrations
                .FirstOrDefaultAsync(gr => gr.Email != null && gr.Email.Trim().ToLower() == emailLower);

            if (existing == null)
            {
                var reg = new GuestRegistration
                {
                    RegistrationNumber = $"REG{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}",
                    RegistrationDate = DateTime.UtcNow,
                    FirstName = firstName,
                    LastName = lastName,
                    PhoneNumber = guest.PhoneNumber ?? string.Empty,
                    Email = email,
                    Address = guest.Address ?? string.Empty,
                    City = guest.City ?? string.Empty,
                    Country = guest.Country ?? string.Empty,
                    IdType = guest.IdType ?? string.Empty,
                    IdNumber = guest.IdNumber ?? string.Empty,
                    Gender = string.IsNullOrWhiteSpace(gender) ? string.Empty : gender,
                    Nationality = guest.Nationality ?? string.Empty,
                    Company = guest.Company ?? string.Empty,
                    Purpose = string.Empty,
                    RegisteredBy = registeredBy,
                    Remarks = string.Empty,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                };

                _context.GuestRegistrations.Add(reg);
                await _context.SaveChangesAsync();
                return;
            }

            existing.FirstName = firstName;
            existing.LastName = lastName;
            existing.Email = email;
            if (!string.IsNullOrWhiteSpace(guest.PhoneNumber)) existing.PhoneNumber = guest.PhoneNumber;
            if (!string.IsNullOrWhiteSpace(guest.Address)) existing.Address = guest.Address;
            if (!string.IsNullOrWhiteSpace(guest.City)) existing.City = guest.City;
            if (!string.IsNullOrWhiteSpace(guest.Country)) existing.Country = guest.Country;
            if (!string.IsNullOrWhiteSpace(guest.IdType)) existing.IdType = guest.IdType;
            if (!string.IsNullOrWhiteSpace(guest.IdNumber)) existing.IdNumber = guest.IdNumber;
            if (existing.Gender == null) existing.Gender = string.Empty;
            if (!string.IsNullOrWhiteSpace(gender)) existing.Gender = gender;
            if (existing.Nationality == null) existing.Nationality = string.Empty;
            if (!string.IsNullOrWhiteSpace(guest.Nationality)) existing.Nationality = guest.Nationality;
            if (existing.Purpose == null) existing.Purpose = string.Empty;
            if (existing.Remarks == null) existing.Remarks = string.Empty;
            if (!string.IsNullOrWhiteSpace(guest.Company)) existing.Company = guest.Company;
            existing.RegisteredBy = registeredBy;
            existing.IsActive = true;
            existing.RegistrationDate = DateTime.UtcNow;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        // GET: api/reservations
        [HttpGet]
        public async Task<IActionResult> GetReservations(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? status = null,
            [FromQuery] int? hotelId = null,
            [FromQuery] int? roomTypeId = null)
        {
            try
            {
                var query = _context.Reservations
                    .Include(r => r.Guest)
                    .Include(r => r.Room)
                    .ThenInclude(room => room.RoomType)
                    .ThenInclude(rt => rt.Hotel)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(r => r.Status == status);
                }

                if (hotelId.HasValue && hotelId.Value > 0)
                {
                    query = query.Where(r => r.HotelId == hotelId.Value);
                }

                if (roomTypeId.HasValue && roomTypeId.Value > 0)
                {
                    query = query.Where(r => r.RoomTypeId == roomTypeId.Value);
                }

                var totalCount = await query.CountAsync();
                var reservations = await query
                    .OrderByDescending(r => r.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(r => new
                    {
                        Id = r.Id,
                        ReservationNumber = r.ReservationNumber,
                        HotelId = r.HotelId,
                        RoomTypeId = r.RoomTypeId,
                        HotelName = r.Room != null && r.Room.RoomType != null && r.Room.RoomType.Hotel != null
                            ? r.Room.RoomType.Hotel.HotelName
                            : null,
                        RoomTypeName = r.Room != null && r.Room.RoomType != null
                            ? r.Room.RoomType.Name
                            : null,
                        GuestId = r.GuestId,
                        RoomId = r.RoomId,
                        CheckInDate = r.CheckInDate,
                        CheckOutDate = r.CheckOutDate,
                        NumberOfAdults = r.NumberOfAdults,
                        NumberOfChildren = r.NumberOfChildren,
                        Status = r.Status,
                        SpecialRequests = r.SpecialRequests,
                        TotalAmount = r.TotalAmount,
                        TotalPaid = r.TotalPaid,
                        Balance = r.TotalAmount - r.TotalPaid,
                        PaymentStatus = r.PaymentStatus,
                        BookingSource = r.BookingSource,
                        RoomRate = r.RoomRate,
                        Discount = r.Discount,
                        FBCredits = r.FBCredits,
                        NumberOfRooms = r.NumberOfRooms,
                        Nights = r.Nights,
                        AdvanceAmount = r.AdvanceAmount,
                        PaymentMethod = r.PaymentMethod,
                        PaymentAccount = r.PaymentAccount,
                        RatePlanId = r.RatePlanId,
                        NTN = r.NTN,
                        GuestName2 = r.GuestName2,
                        GuestName3 = r.GuestName3,
                        GroupId = r.GroupId,
                        Source = r.Source,
                        Market = r.Market,
                        Region = r.Region,
                        Industry = r.Industry,
                        Purpose = r.Purpose,
                        ReferenceCompany = r.ReferenceCompany,
                        ReservationMadeBy = r.ReservationMadeBy,
                        Pickup = r.Pickup,
                        PickupStation = r.PickupStation,
                        PickupCarrier = r.PickupCarrier,
                        PickupTime = r.PickupTime,
                        DropOff = r.DropOff,
                        DropStation = r.DropStation,
                        BTCFolio = r.BTCFolio,
                        Folio1 = r.Folio1,
                        Folio2 = r.Folio2,
                        Folio3 = r.Folio3,
                        BTCComments = r.BTCComments,
                        BtcId = r.BtcId,
                        Complimentary = r.Complimentary,
                        Company = r.Company,
                        ComingFrom = r.ComingFrom,
                        Newspaper = r.Newspaper,
                        Meals = r.Meals,
                        VIPStatus = r.VIPStatus,
                        ReservationNotes = r.ReservationNotes,
                        CheckinNotes = r.CheckinNotes,
                        NoPost = r.NoPost,
                        EnteredBy = r.EnteredBy,
                        InclusivePrivileges = r.InclusivePrivileges,
                        CreatedAt = r.CreatedAt,
                        Guest = r.Guest != null ? new
                        {
                            Id = r.Guest.Id,
                            FullName = r.Guest.FullName,
                            Phone = r.Guest.PhoneNumber,
                            Email = r.Guest.Email,
                            Company = r.Guest.Company,
                            Nationality = r.Guest.Nationality,
                            Occupation = r.Guest.Occupation,
                            Address = r.Guest.Address,
                            City = r.Guest.City,
                            Country = r.Guest.Country
                        } : null,
                        Room = r.Room != null ? new
                        {
                            Id = r.Room.Id,
                            RoomNumber = r.Room.RoomNumber,
                            FloorNumber = r.Room.FloorNumber,
                            Status = r.Room.Status,
                            BasePrice = r.Room.BasePrice,
                            RoomType = r.Room.RoomType != null ? new
                            {
                                Id = r.Room.RoomType.Id,
                                Name = r.Room.RoomType.Name,
                                HotelId = r.Room.RoomType.HotelId,
                                HotelName = r.Room.RoomType.Hotel != null ? r.Room.RoomType.Hotel.HotelName : null
                            } : null
                        } : null
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = reservations,
                    totalCount,
                    page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving reservations");
                return StatusCode(500, new { success = false, message = "Error retrieving reservations" });
            }
        }

        // GET: api/reservations/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetReservation(int id)
        {
            try
            {
                var reservation = await _context.Reservations
                    .Include(r => r.Guest)
                    .Include(r => r.Room)
                    .FirstOrDefaultAsync(r => r.Id == id);

                if (reservation == null)
                {
                    return NotFound(new { success = false, message = "Reservation not found" });
                }

                var reservationDto = new ReservationDto
                {
                    Id = reservation.Id,
                    ReservationNumber = reservation.ReservationNumber,
                    GuestId = reservation.GuestId,
                    RoomId = reservation.RoomId,
                    CheckInDate = reservation.CheckInDate,
                    CheckOutDate = reservation.CheckOutDate,
                    NumberOfAdults = reservation.NumberOfAdults,
                    NumberOfChildren = reservation.NumberOfChildren,
                    Status = reservation.Status,
                    TotalAmount = reservation.TotalAmount,
                    TotalPaid = reservation.TotalPaid,
                    CreatedAt = reservation.CreatedAt,
                    UpdatedAt = reservation.UpdatedAt
                };

                return Ok(new { success = true, data = reservationDto });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving reservation {ReservationId}", id);
                return StatusCode(500, new { success = false, message = "Error retrieving reservation" });
            }
        }

        // POST: api/reservations
        [HttpPost]
        public async Task<IActionResult> CreateReservation([FromBody] AdminCreateReservationDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });
                }

                // Check if guest exists
                var guest = await _context.Guests.FindAsync(dto.GuestId);
                if (guest == null)
                {
                    return BadRequest(new { success = false, message = "Guest not found" });
                }

                try
                {
                    await UpsertGuestRegistrationFromGuestAsync(guest, "Admin");
                }
                catch (Exception ex2)
                {
                    _logger.LogWarning(ex2, "Failed to upsert guest registration for guest {GuestId}", dto.GuestId);
                }

                // Generate reservation number
                var reservationNumber = await GenerateReservationNumber();

                Hotel? hotel = null;
                RoomType? roomType = null;
                if (dto.RoomId.HasValue)
                {
                    var selectedRoom = await _context.Rooms
                        .Include(r => r.RoomType)
                        .ThenInclude(rt => rt.Hotel)
                        .FirstOrDefaultAsync(r => r.Id == dto.RoomId.Value);
                    hotel = selectedRoom?.RoomType?.Hotel;
                    roomType = selectedRoom?.RoomType;
                }

                var nights = (dto.CheckOutDate - dto.CheckInDate).Days;

                var reservation = new Reservation
                {
                    ReservationNumber = reservationNumber,
                    HotelId = dto.HotelId
                        ?? hotel?.Id
                        ?? roomType?.HotelId,
                    RoomTypeId = dto.RoomTypeId
                        ?? roomType?.Id,
                    GuestId = dto.GuestId,
                    RoomId = dto.RoomId,
                    CheckInDate = dto.CheckInDate,
                    CheckOutDate = dto.CheckOutDate,
                    NumberOfAdults = dto.NumberOfAdults,
                    NumberOfChildren = dto.NumberOfChildren,
                    Status = "Pending",
                    SpecialRequests = dto.SpecialRequests ?? "",
                    TotalAmount = dto.TotalAmount,
                    TotalPaid = 0,
                    PaymentStatus = "Pending",
                    // Pricing & Payment
                    RoomRate = dto.RoomRate,
                    Discount = dto.Discount,
                    FBCredits = dto.FBCredits,
                    NumberOfRooms = dto.NumberOfRooms > 0 ? dto.NumberOfRooms : 1,
                    Nights = dto.Nights > 0 ? dto.Nights : (nights > 0 ? nights : 1),
                    AdvanceAmount = dto.AdvanceAmount,
                    PaymentMethod = dto.PaymentMethod,
                    PaymentAccount = dto.PaymentAccount,
                    RatePlanId = dto.RatePlanId,
                    NTN = dto.NTN,
                    BookingSource = dto.BookingSource,
                    // Guest Companions
                    GuestName2 = dto.GuestName2,
                    GuestName3 = dto.GuestName3,
                    GroupId = dto.GroupId,
                    // Marketing / Source
                    Source = dto.Source,
                    Market = dto.Market,
                    Region = dto.Region,
                    Industry = dto.Industry,
                    Purpose = dto.Purpose,
                    ReferenceCompany = dto.ReferenceCompany,
                    ReservationMadeBy = dto.ReservationMadeBy,
                    // Transport / Pickup
                    Pickup = dto.Pickup,
                    PickupStation = dto.PickupStation,
                    PickupCarrier = dto.PickupCarrier,
                    PickupTime = dto.PickupTime,
                    DropOff = dto.DropOff,
                    DropStation = dto.DropStation,
                    // Folio
                    BTCFolio = dto.BTCFolio,
                    Folio1 = dto.Folio1,
                    Folio2 = dto.Folio2,
                    Folio3 = dto.Folio3,
                    // Additional Info
                    BTCComments = dto.BTCComments,
                    BtcId = dto.BtcId,
                    Complimentary = dto.Complimentary,
                    Company = dto.Company,
                    ComingFrom = dto.ComingFrom,
                    Newspaper = dto.Newspaper,
                    Meals = dto.Meals,
                    VIPStatus = dto.VIPStatus,
                    ReservationNotes = dto.ReservationNotes,
                    CheckinNotes = dto.CheckinNotes,
                    NoPost = dto.NoPost,
                    EnteredBy = dto.EnteredBy,
                    InclusivePrivileges = dto.InclusivePrivileges,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Reservations.Add(reservation);
                await _context.SaveChangesAsync();

                // Auto-push availability to BookLogic to block calendar
                if (reservation.RoomId.HasValue)
                {
                    try
                    {
                        await _bookLogic.NotifyBookLogicAvailability(reservation.Id);
                        // Also send reservation to BookLogic CRS if booking source is not BookLogic
                        if (reservation.BookingSource != "BookLogic")
                            await _bookLogic.SendReservationToBookLogic(reservation.Id);
                    }
                    catch (Exception ex2)
                    {
                        _logger.LogWarning(ex2, "Failed to auto-push to BookLogic for reservation {Id}", reservation.Id);
                    }
                }

                var reservationDto = new ReservationDto
                {
                    Id = reservation.Id,
                    ReservationNumber = reservation.ReservationNumber,
                    GuestId = reservation.GuestId,
                    RoomId = reservation.RoomId,
                    CheckInDate = reservation.CheckInDate,
                    CheckOutDate = reservation.CheckOutDate,
                    NumberOfAdults = reservation.NumberOfAdults,
                    NumberOfChildren = reservation.NumberOfChildren,
                    Status = reservation.Status,
                    TotalAmount = reservation.TotalAmount,
                    TotalPaid = reservation.TotalPaid,
                    CreatedAt = reservation.CreatedAt
                };

                return CreatedAtAction(nameof(GetReservation), new { id = reservation.Id },
                    new { success = true, data = reservationDto, message = "Reservation created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating reservation");
                return StatusCode(500, new { success = false, message = "Error creating reservation", error = ex.Message, innerError = ex.InnerException?.Message });
            }
        }

        // PUT: api/reservations/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReservation(int id, [FromBody] AdminCreateReservationDto dto)
        {
            try
            {
                var reservation = await _context.Reservations.FindAsync(id);
                if (reservation == null)
                {
                    return NotFound(new { success = false, message = "Reservation not found" });
                }

                // Validate guest exists
                var guest = await _context.Guests.FindAsync(dto.GuestId);
                if (guest == null)
                {
                    return BadRequest(new { success = false, message = "Guest not found" });
                }

                try
                {
                    await UpsertGuestRegistrationFromGuestAsync(guest, "Admin");
                }
                catch (Exception ex2)
                {
                    _logger.LogWarning(ex2, "Failed to upsert guest registration for guest {GuestId}", dto.GuestId);
                }

                // Validate room exists
                var room = await _context.Rooms.FindAsync(dto.RoomId);
                if (room == null)
                {
                    return BadRequest(new { success = false, message = "Room not found" });
                }

                var roomWithType = await _context.Rooms
                    .Include(r => r.RoomType)
                    .FirstOrDefaultAsync(r => r.Id == dto.RoomId);

                // Update reservation properties
                var nights = (dto.CheckOutDate - dto.CheckInDate).Days;
                reservation.GuestId = dto.GuestId;
                reservation.RoomId = dto.RoomId;
                reservation.HotelId = dto.HotelId ?? roomWithType?.RoomType?.HotelId;
                reservation.RoomTypeId = dto.RoomTypeId ?? roomWithType?.RoomType?.Id;
                reservation.CheckInDate = dto.CheckInDate;
                reservation.CheckOutDate = dto.CheckOutDate;
                reservation.NumberOfAdults = dto.NumberOfAdults;
                reservation.NumberOfChildren = dto.NumberOfChildren;
                reservation.TotalAmount = dto.TotalAmount;
                reservation.SpecialRequests = dto.SpecialRequests;
                // Pricing & Payment
                reservation.RoomRate = dto.RoomRate;
                reservation.Discount = dto.Discount;
                reservation.FBCredits = dto.FBCredits;
                reservation.NumberOfRooms = dto.NumberOfRooms > 0 ? dto.NumberOfRooms : 1;
                reservation.Nights = dto.Nights > 0 ? dto.Nights : (nights > 0 ? nights : 1);
                reservation.AdvanceAmount = dto.AdvanceAmount;
                reservation.PaymentMethod = dto.PaymentMethod;
                reservation.PaymentAccount = dto.PaymentAccount;
                reservation.RatePlanId = dto.RatePlanId;
                reservation.NTN = dto.NTN;
                reservation.BookingSource = dto.BookingSource;
                // Guest Companions
                reservation.GuestName2 = dto.GuestName2;
                reservation.GuestName3 = dto.GuestName3;
                reservation.GroupId = dto.GroupId;
                // Marketing / Source
                reservation.Source = dto.Source;
                reservation.Market = dto.Market;
                reservation.Region = dto.Region;
                reservation.Industry = dto.Industry;
                reservation.Purpose = dto.Purpose;
                reservation.ReferenceCompany = dto.ReferenceCompany;
                reservation.ReservationMadeBy = dto.ReservationMadeBy;
                // Transport / Pickup
                reservation.Pickup = dto.Pickup;
                reservation.PickupStation = dto.PickupStation;
                reservation.PickupCarrier = dto.PickupCarrier;
                reservation.PickupTime = dto.PickupTime;
                reservation.DropOff = dto.DropOff;
                reservation.DropStation = dto.DropStation;
                // Folio
                reservation.BTCFolio = dto.BTCFolio;
                reservation.Folio1 = dto.Folio1;
                reservation.Folio2 = dto.Folio2;
                reservation.Folio3 = dto.Folio3;
                // Additional Info
                reservation.BTCComments = dto.BTCComments;
                reservation.BtcId = dto.BtcId;
                reservation.Complimentary = dto.Complimentary;
                reservation.Company = dto.Company;
                reservation.ComingFrom = dto.ComingFrom;
                reservation.Newspaper = dto.Newspaper;
                reservation.Meals = dto.Meals;
                reservation.VIPStatus = dto.VIPStatus;
                reservation.ReservationNotes = dto.ReservationNotes;
                reservation.CheckinNotes = dto.CheckinNotes;
                reservation.NoPost = dto.NoPost;
                reservation.EnteredBy = dto.EnteredBy;
                reservation.InclusivePrivileges = dto.InclusivePrivileges;
                reservation.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Auto-push availability to BookLogic
                if (reservation.RoomId.HasValue)
                {
                    try
                    {
                        await _bookLogic.NotifyBookLogicAvailability(reservation.Id);
                        if (reservation.BookingSource != "BookLogic")
                            await _bookLogic.UpdateReservationInBookLogic(reservation.Id);
                    }
                    catch (Exception ex2) { _logger.LogWarning(ex2, "Failed to auto-push to BookLogic for reservation {Id}", reservation.Id); }
                }

                // Return updated reservation with related data
                var updatedReservation = await _context.Reservations
                    .Include(r => r.Guest)
                    .Include(r => r.Room)
                    .FirstOrDefaultAsync(r => r.Id == id);

                return Ok(new { success = true, data = updatedReservation, message = "Reservation updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating reservation {ReservationId}", id);
                return StatusCode(500, new { success = false, message = "Error updating reservation", error = ex.Message });
            }
        }

        // PUT: api/reservations/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateReservationStatus(int id, [FromBody] UpdateReservationStatusDto dto)
        {
            try
            {
                var reservation = await _context.Reservations.FindAsync(id);
                if (reservation == null)
                {
                    return NotFound(new { success = false, message = "Reservation not found" });
                }

                var oldStatus = reservation.Status;
                reservation.Status = dto.Status;
                reservation.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Auto-push availability to BookLogic on cancellation
                if (reservation.RoomId.HasValue && dto.Status == "Cancelled" && oldStatus != "Cancelled")
                {
                    // Release the room
                    var room = await _context.Rooms.FindAsync(reservation.RoomId);
                    if (room != null && room.Status == "Reserved")
                    {
                        room.Status = "Available";
                        await _context.SaveChangesAsync();
                    }
                    try
                    {
                        await _bookLogic.NotifyBookLogicAvailability(reservation.Id, isCancellation: true);
                        if (reservation.BookingSource != "BookLogic")
                            await _bookLogic.CancelReservationInBookLogic(reservation.Id);
                    }
                    catch (Exception ex2) { _logger.LogWarning(ex2, "Failed to auto-push cancellation to BookLogic for reservation {Id}", reservation.Id); }
                }

                return Ok(new { success = true, message = "Reservation status updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating reservation status {ReservationId}", id);
                return StatusCode(500, new { success = false, message = "Error updating reservation status" });
            }
        }

        // DELETE: api/reservations/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            try
            {
                var reservation = await _context.Reservations.FindAsync(id);
                if (reservation == null)
                {
                    return NotFound(new { success = false, message = "Reservation not found" });
                }

                var shouldCancelInBookLogic = reservation.BookingSource != "BookLogic";
                var hadRoomAssignment = reservation.RoomId.HasValue;

                if (shouldCancelInBookLogic)
                {
                    try
                    {
                        await _bookLogic.CancelReservationInBookLogic(reservation.Id);
                    }
                    catch (Exception ex2)
                    {
                        _logger.LogWarning(ex2, "Failed to cancel BookLogic reservation before deleting PMS reservation {Id}", reservation.Id);
                    }
                }

                if (hadRoomAssignment)
                {
                    var room = await _context.Rooms.FindAsync(reservation.RoomId.Value);
                    if (room != null && room.Status == "Reserved")
                    {
                        room.Status = "Available";
                    }
                }

                _context.Reservations.Remove(reservation);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Reservation deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting reservation {ReservationId}", id);
                return StatusCode(500, new { success = false, message = "Error deleting reservation" });
            }
        }

        private async Task<string> GenerateReservationNumber()
        {
            var today = DateTime.Today;
            var prefix = $"R{today:yyyyMMdd}";
            
            var lastReservation = await _context.Reservations
                .Where(r => r.ReservationNumber.StartsWith(prefix))
                .OrderByDescending(r => r.ReservationNumber)
                .FirstOrDefaultAsync();

            var nextNumber = 1;
            if (lastReservation != null)
            {
                var lastNumberStr = lastReservation.ReservationNumber.Substring(prefix.Length);
                if (int.TryParse(lastNumberStr, out var lastNumber))
                {
                    nextNumber = lastNumber + 1;
                }
            }

            return $"{prefix}{nextNumber:D3}"; // R20250927001, R20250927002, etc.
        }
    }
}
