using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.DTOs;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [ApiController]
    // [Authorize(Roles = "Admin,Manager,Receptionist")] // Temporarily disabled for testing
    public class GuestMasterController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<GuestMasterController> _logger;

        public GuestMasterController(HotelDbContext context, ILogger<GuestMasterController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/guestmaster
        [HttpGet]
        public async Task<IActionResult> GetGuests([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "")
        {
            try
            {
                var query = _context.GuestMasters.Where(g => g.IsActive);

                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(g => g.FirstName.Contains(search) || 
                                           g.LastName.Contains(search) ||
                                           g.Email.Contains(search) ||
                                           g.PhoneNumber.Contains(search) ||
                                           g.IdNumber.Contains(search));
                }

                var totalCount = await query.CountAsync();
                var guests = await query
                    .OrderBy(g => g.FirstName)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(g => new
                    {
                        Id = g.Id,
                        FirstName = g.FirstName,
                        LastName = g.LastName,
                        FullName = g.FirstName + " " + g.LastName,
                        GuestCode = g.GuestCode,
                        Email = g.Email,
                        PhoneNumber = g.PhoneNumber,
                        DateOfBirth = g.DateOfBirth,
                        Gender = g.Gender,
                        Nationality = g.Nationality,
                        IdType = g.IdType,
                        IdNumber = g.IdNumber,
                        Address = g.Address,
                        City = g.City,
                        Country = g.Country,
                        Company = g.Company,
                        GuestType = g.GuestType,
                        IsActive = g.IsActive,
                        CreatedAt = g.CreatedAt,
                        UpdatedAt = g.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new { 
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

        // GET: api/guestmaster/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGuest(int id)
        {
            try
            {
                var guest = await _context.GuestMasters.FindAsync(id);

                if (guest == null)
                {
                    return NotFound(new { success = false, message = "Guest not found" });
                }

                return Ok(new { 
                    success = true, 
                    data = new
                    {
                        Id = guest.Id,
                        FirstName = guest.FirstName,
                        LastName = guest.LastName,
                        GuestCode = guest.GuestCode,
                        Email = guest.Email,
                        PhoneNumber = guest.PhoneNumber,
                        DateOfBirth = guest.DateOfBirth,
                        Gender = guest.Gender,
                        Nationality = guest.Nationality,
                        IdType = guest.IdType,
                        IdNumber = guest.IdNumber,
                        Address = guest.Address,
                        City = guest.City,
                        Country = guest.Country,
                        Company = guest.Company,
                        GuestType = guest.GuestType,
                        IsActive = guest.IsActive,
                        CreatedAt = guest.CreatedAt,
                        UpdatedAt = guest.UpdatedAt
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving guest with ID: {id}");
                return StatusCode(500, new { success = false, message = "Error retrieving guest" });
            }
        }

        // POST: api/guestmaster
        [HttpPost]
        public async Task<IActionResult> CreateGuest([FromBody] GuestMasterDto guestDto)
        {
            try
            {
                // Check if guest with same ID number already exists
                var existingGuest = await _context.GuestMasters
                    .FirstOrDefaultAsync(g => g.IdNumber == guestDto.IdNumber && g.IdType == guestDto.IdType);

                if (existingGuest != null)
                {
                    return BadRequest(new { success = false, message = "Guest with this ID already exists" });
                }

                var guest = new GuestMaster
                {
                    FirstName = guestDto.FirstName,
                    LastName = guestDto.LastName,
                    GuestCode = guestDto.GuestCode,
                    Email = guestDto.Email,
                    PhoneNumber = guestDto.PhoneNumber,
                    DateOfBirth = guestDto.DateOfBirth,
                    Gender = guestDto.Gender,
                    Nationality = guestDto.Nationality,
                    IdType = guestDto.IdType,
                    IdNumber = guestDto.IdNumber,
                    Address = guestDto.Address,
                    City = guestDto.City,
                    Country = guestDto.Country,
                    Company = guestDto.Company,
                    GuestType = guestDto.GuestType,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.GuestMasters.Add(guest);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetGuest), new { id = guest.Id }, 
                    new { success = true, message = "Guest created successfully", data = guest });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating guest");
                return StatusCode(500, new { success = false, message = "Error creating guest" });
            }
        }

        // PUT: api/guestmaster/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGuest(int id, [FromBody] GuestMasterDto guestDto)
        {
            try
            {
                var guest = await _context.GuestMasters.FindAsync(id);

                if (guest == null)
                {
                    return NotFound(new { success = false, message = "Guest not found" });
                }

                // Check if another guest with same ID number already exists
                var existingGuest = await _context.GuestMasters
                    .FirstOrDefaultAsync(g => g.IdNumber == guestDto.IdNumber && g.IdType == guestDto.IdType && g.Id != id);

                if (existingGuest != null)
                {
                    return BadRequest(new { success = false, message = "Guest with this ID already exists" });
                }

                guest.FirstName = guestDto.FirstName;
                guest.LastName = guestDto.LastName;
                guest.GuestCode = guestDto.GuestCode;
                guest.Email = guestDto.Email;
                guest.PhoneNumber = guestDto.PhoneNumber;
                guest.DateOfBirth = guestDto.DateOfBirth;
                guest.Gender = guestDto.Gender;
                guest.Nationality = guestDto.Nationality;
                guest.IdType = guestDto.IdType;
                guest.IdNumber = guestDto.IdNumber;
                guest.Address = guestDto.Address;
                guest.City = guestDto.City;
                guest.Country = guestDto.Country;
                guest.Company = guestDto.Company;
                guest.GuestType = guestDto.GuestType;
                guest.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Guest updated successfully", data = guest });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating guest with ID: {id}");
                return StatusCode(500, new { success = false, message = "Error updating guest" });
            }
        }

        // DELETE: api/guestmaster/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGuest(int id)
        {
            try
            {
                var guest = await _context.GuestMasters.FindAsync(id);

                if (guest == null)
                {
                    return NotFound(new { success = false, message = "Guest not found" });
                }

                guest.IsActive = false;
                guest.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Guest deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting guest with ID: {id}");
                return StatusCode(500, new { success = false, message = "Error deleting guest" });
            }
        }
    }
}
