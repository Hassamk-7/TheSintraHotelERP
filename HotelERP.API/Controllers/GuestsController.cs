using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using HotelERP.API.DTOs;

namespace HotelERP.API.Controllers
{
    // [Authorize] // Temporarily disabled for testing
    public class GuestsController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<GuestsController> _logger;

        public GuestsController(HotelDbContext context, ILogger<GuestsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/guests
        [HttpGet]
        public async Task<IActionResult> GetGuests(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? search = null)
        {
            try
            {
                if (page < 1) page = 1;
                if (pageSize < 1) pageSize = 20;
                if (pageSize > 30000) pageSize = 30000;

                var query = _context.Guests.AsQueryable();

                if (!string.IsNullOrEmpty(search))
                {
                    var searchValue = search.Trim();
                    if (!string.IsNullOrWhiteSpace(searchValue))
                    {
                        query = query.Where(g =>
                            (g.FullName != null && g.FullName.Contains(searchValue)) ||
                            (g.GuestId != null && g.GuestId.Contains(searchValue)) ||
                            (g.PhoneNumber != null && g.PhoneNumber.Contains(searchValue)) ||
                            (g.Email != null && g.Email.Contains(searchValue)) ||
                            (g.IdNumber != null && g.IdNumber.Contains(searchValue)));
                    }
                }

                var totalCount = await query.CountAsync();
                var guests = await query
                    .OrderByDescending(g => g.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(g => new GuestDto
                    {
                        Id = g.Id,
                        GuestId = g.GuestId,
                        FullName = g.FullName,
                        Email = g.Email,
                        PhoneNumber = g.PhoneNumber,
                        Address = g.Address,
                        City = g.City,
                        Country = g.Country,
                        Gender = g.Gender,
                        IdType = g.IdType,
                        IdNumber = g.IdNumber,
                        Company = g.Company,
                        Notes = g.Notes,
                        Nationality = g.Nationality,
                        DateOfBirth = g.DateOfBirth,
                        Occupation = g.Occupation,
                        EmergencyContact = g.EmergencyContact,
                        EmergencyPhone = g.EmergencyPhone,
                        CreatedAt = g.CreatedAt
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = guests,
                    totalCount,
                    page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving guests");
                return StatusCode(500, new { success = false, message = "Error retrieving guests" });
            }
        }

        // GET: api/guests/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGuest(int id)
        {
            try
            {
                var guest = await _context.Guests.FindAsync(id);
                if (guest == null)
                {
                    return NotFound(new { success = false, message = "Guest not found" });
                }

                var guestDto = new GuestDto
                {
                    Id = guest.Id,
                    GuestId = guest.GuestId,
                    FullName = guest.FullName,
                    Email = guest.Email,
                    PhoneNumber = guest.PhoneNumber,
                    Address = guest.Address,
                    City = guest.City,
                    Country = guest.Country,
                    Gender = guest.Gender,
                    IdType = guest.IdType,
                    IdNumber = guest.IdNumber,
                    Company = guest.Company,
                    Notes = guest.Notes,
                    Nationality = guest.Nationality,
                    DateOfBirth = guest.DateOfBirth,
                    Occupation = guest.Occupation,
                    EmergencyContact = guest.EmergencyContact,
                    EmergencyPhone = guest.EmergencyPhone,
                    CreatedAt = guest.CreatedAt,
                    UpdatedAt = guest.UpdatedAt
                };

                return Ok(new { success = true, data = guestDto });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving guest {GuestId}", id);
                return StatusCode(500, new { success = false, message = "Error retrieving guest" });
            }
        }

        // POST: api/guests
        [HttpPost]
        public async Task<IActionResult> CreateGuest([FromBody] CreateGuestDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });
                }

                // Generate unique guest ID
                var guestId = await GenerateGuestId();

                var guest = new Guest
                {
                    GuestId = guestId,
                    FullName = dto.FullName,
                    Email = dto.Email ?? "",
                    PhoneNumber = dto.PhoneNumber ?? "",
                    Address = dto.Address ?? "",
                    City = dto.City ?? "",
                    Country = dto.Country ?? "Pakistan",
                    Gender = dto.Gender ?? "Male",
                    IdType = dto.IdType ?? "",
                    IdNumber = dto.IdNumber ?? "",
                    IdProof = !string.IsNullOrEmpty(dto.IdProof) ? System.Text.Encoding.UTF8.GetBytes(dto.IdProof) : new byte[0],
                    Company = dto.Company ?? "",
                    Notes = dto.Notes ?? "",
                    Nationality = dto.Nationality ?? "",
                    DateOfBirth = dto.DateOfBirth,
                    Occupation = dto.Occupation ?? "",
                    EmergencyContact = dto.EmergencyContact ?? "",
                    EmergencyPhone = dto.EmergencyPhone ?? "",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Guests.Add(guest);
                await _context.SaveChangesAsync();

                var guestDto = new GuestDto
                {
                    Id = guest.Id,
                    GuestId = guest.GuestId,
                    FullName = guest.FullName,
                    Email = guest.Email,
                    PhoneNumber = guest.PhoneNumber,
                    Address = guest.Address,
                    City = guest.City,
                    Country = guest.Country,
                    Gender = guest.Gender,
                    CreatedAt = guest.CreatedAt
                };

                return CreatedAtAction(nameof(GetGuest), new { id = guest.Id }, 
                    new { success = true, data = guestDto, message = "Guest created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating guest");
                return StatusCode(500, new { success = false, message = "Error creating guest", error = ex.Message, innerError = ex.InnerException?.Message });
            }
        }

        // PUT: api/guests/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGuest(int id, [FromBody] UpdateGuestDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });
                }

                var guest = await _context.Guests.FindAsync(id);
                if (guest == null)
                {
                    return NotFound(new { success = false, message = "Guest not found" });
                }

                guest.FullName = dto.FullName ?? guest.FullName;
                guest.Email = dto.Email ?? guest.Email;
                guest.PhoneNumber = dto.PhoneNumber ?? guest.PhoneNumber;
                guest.Address = dto.Address ?? guest.Address;
                guest.City = dto.City ?? guest.City;
                guest.Country = dto.Country ?? guest.Country;
                guest.Gender = dto.Gender ?? guest.Gender;
                guest.IdType = dto.IdType ?? guest.IdType;
                guest.IdNumber = dto.IdNumber ?? guest.IdNumber;
                if (!string.IsNullOrEmpty(dto.IdProof))
                {
                    guest.IdProof = System.Text.Encoding.UTF8.GetBytes(dto.IdProof);
                }
                guest.Company = dto.Company ?? guest.Company;
                guest.Notes = dto.Notes ?? guest.Notes;
                guest.Nationality = dto.Nationality ?? guest.Nationality;
                guest.DateOfBirth = dto.DateOfBirth ?? guest.DateOfBirth;
                guest.Occupation = dto.Occupation ?? guest.Occupation;
                guest.EmergencyContact = dto.EmergencyContact ?? guest.EmergencyContact;
                guest.EmergencyPhone = dto.EmergencyPhone ?? guest.EmergencyPhone;
                guest.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Guest updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating guest {GuestId}", id);
                var innerMsg = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { success = false, message = $"Error updating guest: {innerMsg}" });
            }
        }

        // DELETE: api/guests/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGuest(int id)
        {
            try
            {
                var guest = await _context.Guests.FindAsync(id);
                if (guest == null)
                {
                    return NotFound(new { success = false, message = "Guest not found" });
                }

                _context.Guests.Remove(guest);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Guest deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting guest {GuestId}", id);
                return StatusCode(500, new { success = false, message = "Error deleting guest" });
            }
        }

        private async Task<string> GenerateGuestId()
        {
            var lastGuest = await _context.Guests
                .OrderByDescending(g => g.Id)
                .FirstOrDefaultAsync();

            var nextNumber = 1;
            if (lastGuest != null && !string.IsNullOrEmpty(lastGuest.GuestId) && lastGuest.GuestId.StartsWith("G"))
            {
                if (int.TryParse(lastGuest.GuestId.Substring(1), out var lastNumber))
                {
                    nextNumber = lastNumber + 1;
                }
            }

            return $"G{nextNumber:D6}"; // G000001, G000002, etc.
        }
    }
}
