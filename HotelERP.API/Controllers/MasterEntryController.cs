using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using HotelERP.API.DTOs;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MasterEntryController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<MasterEntryController> _logger;

        public MasterEntryController(HotelDbContext context, ILogger<MasterEntryController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/MasterEntry/hotel-master
        [HttpGet("hotel-master")]
        public async Task<IActionResult> GetHotels([FromQuery] string search = "")
        {
            try
            {
                var query = _context.Hotels.Where(h => h.IsActive);

                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(h => h.HotelName.Contains(search) || 
                                           h.HotelCode.Contains(search) ||
                                           h.City.Contains(search) ||
                                           h.Email.Contains(search));
                }

                var hotels = await query
                    .OrderBy(h => h.HotelName)
                    .Select(h => new
                    {
                        id = h.Id,
                        hotelName = h.HotelName,
                        hotelCode = h.HotelCode,
                        address = h.Address,
                        city = h.City,
                        state = h.State,
                        country = h.Country,
                        pinCode = h.PostalCode,
                        phone = h.PhoneNumber,
                        mobile = h.ManagerPhone,
                        email = h.Email,
                        website = h.Website,
                        fax = "",
                        gstNumber = h.GSTNumber,
                        panNumber = h.PANNumber,
                        licenseNumber = h.LicenseNumber,
                        description = h.Description,
                        isActive = h.IsActive,
                        createdAt = h.CreatedAt,
                        updatedAt = h.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new { 
                    success = true, 
                    data = hotels,
                    message = $"Retrieved {hotels.Count} hotels successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving hotels");
                return StatusCode(500, new { success = false, message = "Error retrieving hotels", error = ex.Message });
            }
        }

        // GET: api/MasterEntry/hotel-master/{id}
        [HttpGet("hotel-master/{id}")]
        public async Task<IActionResult> GetHotel(int id)
        {
            try
            {
                var hotel = await _context.Hotels
                    .Where(h => h.Id == id && h.IsActive)
                    .Select(h => new
                    {
                        id = h.Id,
                        hotelName = h.HotelName,
                        hotelCode = h.HotelCode,
                        address = h.Address,
                        city = h.City,
                        state = h.State,
                        country = h.Country,
                        pinCode = h.PostalCode,
                        phone = h.PhoneNumber,
                        mobile = h.ManagerPhone,
                        email = h.Email,
                        website = h.Website,
                        fax = "",
                        gstNumber = h.GSTNumber,
                        panNumber = h.PANNumber,
                        licenseNumber = h.LicenseNumber,
                        description = h.Description,
                        isActive = h.IsActive,
                        createdAt = h.CreatedAt,
                        updatedAt = h.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                if (hotel == null)
                {
                    return NotFound(new { success = false, message = "Hotel not found" });
                }

                return Ok(new { success = true, data = hotel });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving hotel with ID {HotelId}", id);
                return StatusCode(500, new { success = false, message = "Error retrieving hotel", error = ex.Message });
            }
        }

        // POST: api/MasterEntry/hotel-master
        [HttpPost("hotel-master")]
        public async Task<IActionResult> CreateHotel([FromBody] CreateHotelMasterDto hotelData)
        {
            try
            {
                var hotel = new Hotel
                {
                    HotelName = hotelData.HotelName ?? "",
                    HotelCode = hotelData.HotelCode ?? "",
                    Address = hotelData.Address ?? "",
                    City = hotelData.City ?? "",
                    State = hotelData.State ?? "",
                    Country = hotelData.Country ?? "Pakistan",
                    PostalCode = hotelData.PinCode ?? "",
                    PhoneNumber = hotelData.Phone ?? "",
                    Email = hotelData.Email ?? "",
                    Website = hotelData.Website ?? "",
                    GSTNumber = hotelData.GstNumber ?? "",
                    PANNumber = hotelData.PanNumber ?? "",
                    LicenseNumber = hotelData.LicenseNumber ?? "",
                    ManagerName = "",
                    ManagerPhone = hotelData.Mobile ?? "",
                    ManagerEmail = "",
                    TotalRooms = 0,
                    TotalFloors = 0,
                    EstablishedDate = DateTime.UtcNow,
                    StarRating = "3 Star",
                    Description = hotelData.Description ?? "",
                    LogoPath = "",
                    IsMainBranch = true,
                    Currency = "PKR",
                    TimeZone = "Asia/Karachi",
                    IsActive = hotelData.IsActive,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                // Validation
                if (string.IsNullOrEmpty(hotel.HotelName))
                {
                    return BadRequest(new { success = false, message = "Hotel name is required" });
                }

                if (string.IsNullOrEmpty(hotel.HotelCode))
                {
                    return BadRequest(new { success = false, message = "Hotel code is required" });
                }

                // Check if hotel code already exists
                var existingHotel = await _context.Hotels
                    .AnyAsync(h => h.HotelCode == hotel.HotelCode && h.IsActive);

                if (existingHotel)
                {
                    return BadRequest(new { success = false, message = "Hotel code already exists" });
                }

                _context.Hotels.Add(hotel);
                await _context.SaveChangesAsync();

                var response = new
                {
                    id = hotel.Id,
                    hotelName = hotel.HotelName,
                    hotelCode = hotel.HotelCode,
                    address = hotel.Address,
                    city = hotel.City,
                    state = hotel.State,
                    country = hotel.Country,
                    pinCode = hotel.PostalCode,
                    phone = hotel.PhoneNumber,
                    mobile = hotel.ManagerPhone,
                    email = hotel.Email,
                    website = hotel.Website,
                    fax = "",
                    gstNumber = hotel.GSTNumber,
                    panNumber = hotel.PANNumber,
                    licenseNumber = hotel.LicenseNumber,
                    description = hotel.Description,
                    isActive = hotel.IsActive,
                    createdAt = hotel.CreatedAt,
                    updatedAt = hotel.UpdatedAt
                };

                return Ok(new { success = true, data = response, message = "Hotel created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating hotel");
                return StatusCode(500, new { success = false, message = "Error creating hotel", error = ex.Message });
            }
        }

        // PUT: api/MasterEntry/hotel-master/{id}
        [HttpPut("hotel-master/{id}")]
        public async Task<IActionResult> UpdateHotel(int id, [FromBody] CreateHotelMasterDto hotelData)
        {
            try
            {
                var hotel = await _context.Hotels.FindAsync(id);
                if (hotel == null || !hotel.IsActive)
                {
                    return NotFound(new { success = false, message = "Hotel not found" });
                }

                // Check if hotel code already exists (excluding current hotel)
                if (!string.IsNullOrEmpty(hotelData.HotelCode))
                {
                    var existingHotel = await _context.Hotels
                        .AnyAsync(h => h.HotelCode == hotelData.HotelCode && h.Id != id && h.IsActive);

                    if (existingHotel)
                    {
                        return BadRequest(new { success = false, message = "Hotel code already exists" });
                    }
                }

                // Update hotel properties
                hotel.HotelName = hotelData.HotelName ?? hotel.HotelName;
                hotel.HotelCode = hotelData.HotelCode ?? hotel.HotelCode;
                hotel.Address = hotelData.Address ?? hotel.Address;
                hotel.City = hotelData.City ?? hotel.City;
                hotel.State = hotelData.State ?? hotel.State;
                hotel.Country = hotelData.Country ?? hotel.Country;
                hotel.PostalCode = hotelData.PinCode ?? hotel.PostalCode;
                hotel.PhoneNumber = hotelData.Phone ?? hotel.PhoneNumber;
                hotel.Email = hotelData.Email ?? hotel.Email;
                hotel.Website = hotelData.Website ?? hotel.Website;
                hotel.GSTNumber = hotelData.GstNumber ?? hotel.GSTNumber;
                hotel.PANNumber = hotelData.PanNumber ?? hotel.PANNumber;
                hotel.LicenseNumber = hotelData.LicenseNumber ?? hotel.LicenseNumber;
                hotel.ManagerPhone = hotelData.Mobile ?? hotel.ManagerPhone;
                hotel.Description = hotelData.Description ?? hotel.Description;
                hotel.IsActive = hotelData.IsActive;
                hotel.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Hotel updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating hotel with ID {HotelId}", id);
                return StatusCode(500, new { success = false, message = "Error updating hotel", error = ex.Message });
            }
        }

        // DELETE: api/MasterEntry/hotel-master/{id}
        [HttpDelete("hotel-master/{id}")]
        public async Task<IActionResult> DeleteHotel(int id)
        {
            try
            {
                var hotel = await _context.Hotels.FindAsync(id);
                if (hotel == null || !hotel.IsActive)
                {
                    return NotFound(new { success = false, message = "Hotel not found" });
                }

                // Soft delete
                hotel.IsActive = false;
                hotel.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Hotel deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting hotel with ID {HotelId}", id);
                return StatusCode(500, new { success = false, message = "Error deleting hotel", error = ex.Message });
            }
        }
    }
}
