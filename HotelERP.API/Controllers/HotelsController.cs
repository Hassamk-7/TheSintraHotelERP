using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using HotelERP.API.DTOs;
using System.IO;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HotelsController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<HotelsController> _logger;
        private readonly IWebHostEnvironment _env;

        public HotelsController(HotelDbContext context, ILogger<HotelsController> logger, IWebHostEnvironment env)
        {
            _context = context;
            _logger = logger;
            _env = env;
        }

        // GET: api/hotels
        [HttpGet]
        public async Task<IActionResult> GetHotels([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "")
        {
            try
            {
                var query = _context.Hotels
                    .Include(h => h.CityNavigation)
                    .Where(h => h.IsActive);

                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(h => h.HotelName.Contains(search) || 
                                           h.HotelCode.Contains(search) ||
                                           h.City.Contains(search));
                }

                var totalCount = await query.CountAsync();
                var hotels = await query
                    .OrderBy(h => h.HotelName)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(h => new HotelDto
                    {
                        Id = h.Id,
                        HotelName = h.HotelName,
                        HotelCode = h.HotelCode,
                        Address = h.Address,
                        CityId = h.CityId,
                        City = h.CityNavigation != null ? h.CityNavigation.Name : h.City,
                        State = h.State,
                        Country = h.Country,
                        PostalCode = h.PostalCode,
                        PhoneNumber = h.PhoneNumber,
                        Email = h.Email,
                        Website = h.Website,
                        FaxNumber = h.FaxNumber,
                        GSTNumber = h.GSTNumber,
                        PANNumber = h.PANNumber,
                        LicenseNumber = h.LicenseNumber,
                        ManagerName = h.ManagerName,
                        ManagerPhone = h.ManagerPhone,
                        ManagerEmail = h.ManagerEmail,
                        TotalRooms = h.TotalRooms,
                        TotalFloors = h.TotalFloors,
                        EstablishedDate = h.EstablishedDate,
                        StarRating = h.StarRating,
                        Description = h.Description,
                        LogoPath = h.LogoPath,
                        IsMainBranch = h.IsMainBranch,
                        Currency = h.Currency,
                        CheckInTime = h.CheckInTime,
                        CheckOutTime = h.CheckOutTime,
                        TimeZone = h.TimeZone,
                        Latitude = h.Latitude,
                        Longitude = h.Longitude,
                        IsActive = h.IsActive,
                        CreatedAt = h.CreatedAt,
                        UpdatedAt = h.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new { 
                    success = true, 
                    data = hotels, 
                    totalCount, 
                    page, 
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving hotels");
                return StatusCode(500, new { success = false, message = "Error retrieving hotels" });
            }
        }

        // GET: api/hotels/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetHotel(int id)
        {
            try
            {
                var hotel = await _context.Hotels
                    .Include(h => h.CityNavigation)
                    .Where(h => h.Id == id && h.IsActive)
                    .Select(h => new HotelDto
                    {
                        Id = h.Id,
                        HotelName = h.HotelName,
                        HotelCode = h.HotelCode,
                        Address = h.Address,
                        CityId = h.CityId,
                        City = h.CityNavigation != null ? h.CityNavigation.Name : h.City,
                        State = h.State,
                        Country = h.Country,
                        PostalCode = h.PostalCode,
                        PhoneNumber = h.PhoneNumber,
                        Email = h.Email,
                        Website = h.Website,
                        FaxNumber = h.FaxNumber,
                        GSTNumber = h.GSTNumber,
                        PANNumber = h.PANNumber,
                        LicenseNumber = h.LicenseNumber,
                        ManagerName = h.ManagerName,
                        ManagerPhone = h.ManagerPhone,
                        ManagerEmail = h.ManagerEmail,
                        TotalRooms = h.TotalRooms,
                        TotalFloors = h.TotalFloors,
                        EstablishedDate = h.EstablishedDate,
                        StarRating = h.StarRating,
                        Description = h.Description,
                        LogoPath = h.LogoPath,
                        IsMainBranch = h.IsMainBranch,
                        Currency = h.Currency,
                        CheckInTime = h.CheckInTime,
                        CheckOutTime = h.CheckOutTime,
                        TimeZone = h.TimeZone,
                        Latitude = h.Latitude,
                        Longitude = h.Longitude,
                        IsActive = h.IsActive,
                        CreatedAt = h.CreatedAt,
                        UpdatedAt = h.UpdatedAt
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
                return StatusCode(500, new { success = false, message = "Error retrieving hotel" });
            }
        }

        // POST: api/hotels
        [HttpPost]
        public async Task<IActionResult> CreateHotel([FromBody] CreateHotelDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });
                }

                // Check if hotel code already exists
                var existingHotel = await _context.Hotels
                    .AnyAsync(h => h.HotelCode == dto.HotelCode && h.IsActive);

                if (existingHotel)
                {
                    return BadRequest(new { success = false, message = "Hotel code already exists" });
                }

                string cityName = dto.City ?? "";
                int? cityId = dto.CityId;

                if (cityId.HasValue)
                {
                    var city = await _context.Cities.FirstOrDefaultAsync(c => c.Id == cityId.Value && c.IsActive);
                    if (city == null)
                    {
                        return BadRequest(new { success = false, message = "Invalid CityId" });
                    }
                    cityName = city.Name;
                }

                var hotel = new Hotel
                {
                    HotelName = dto.HotelName,
                    HotelCode = dto.HotelCode,
                    Address = dto.Address ?? "",
                    CityId = cityId,
                    City = cityName,
                    State = dto.State ?? "",
                    Country = dto.Country ?? "Pakistan",
                    PostalCode = dto.PostalCode ?? "",
                    PhoneNumber = dto.PhoneNumber ?? "",
                    Email = dto.Email ?? "",
                    Website = dto.Website ?? "",
                    FaxNumber = dto.FaxNumber ?? "",
                    GSTNumber = dto.GSTNumber ?? "",
                    PANNumber = dto.PANNumber ?? "",
                    LicenseNumber = dto.LicenseNumber ?? "",
                    ManagerName = dto.ManagerName ?? "",
                    ManagerPhone = dto.ManagerPhone ?? "",
                    ManagerEmail = dto.ManagerEmail ?? "",
                    TotalRooms = dto.TotalRooms,
                    TotalFloors = dto.TotalFloors,
                    EstablishedDate = dto.EstablishedDate ?? DateTime.Now,
                    StarRating = dto.StarRating ?? "3 Star",
                    Description = dto.Description ?? "",
                    LogoPath = "",
                    IsMainBranch = dto.IsMainBranch,
                    Currency = dto.Currency ?? "PKR",
                    CheckInTime = dto.CheckInTime ?? "",
                    CheckOutTime = dto.CheckOutTime ?? "",
                    TimeZone = dto.TimeZone ?? "Asia/Karachi",
                    Latitude = dto.Latitude,
                    Longitude = dto.Longitude,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Hotels.Add(hotel);
                await _context.SaveChangesAsync();

                var hotelDto = new HotelDto
                {
                    Id = hotel.Id,
                    HotelName = hotel.HotelName,
                    HotelCode = hotel.HotelCode,
                    Address = hotel.Address,
                    CityId = hotel.CityId,
                    City = hotel.City,
                    State = hotel.State,
                    Country = hotel.Country,
                    PostalCode = hotel.PostalCode,
                    PhoneNumber = hotel.PhoneNumber,
                    Email = hotel.Email,
                    Website = hotel.Website,
                    FaxNumber = hotel.FaxNumber,
                    GSTNumber = hotel.GSTNumber,
                    PANNumber = hotel.PANNumber,
                    LicenseNumber = hotel.LicenseNumber,
                    ManagerName = hotel.ManagerName,
                    ManagerPhone = hotel.ManagerPhone,
                    ManagerEmail = hotel.ManagerEmail,
                    TotalRooms = hotel.TotalRooms,
                    TotalFloors = hotel.TotalFloors,
                    EstablishedDate = hotel.EstablishedDate,
                    StarRating = hotel.StarRating,
                    Description = hotel.Description,
                    LogoPath = hotel.LogoPath,
                    IsMainBranch = hotel.IsMainBranch,
                    Currency = hotel.Currency,
                    CheckInTime = hotel.CheckInTime,
                    CheckOutTime = hotel.CheckOutTime,
                    TimeZone = hotel.TimeZone,
                    Latitude = hotel.Latitude,
                    Longitude = hotel.Longitude,
                    IsActive = hotel.IsActive,
                    CreatedAt = hotel.CreatedAt,
                    UpdatedAt = hotel.UpdatedAt
                };

                return CreatedAtAction(nameof(GetHotel), new { id = hotel.Id },
                    new { success = true, data = hotelDto, message = "Hotel created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating hotel");
                return StatusCode(500, new { success = false, message = "Error creating hotel", error = ex.Message });
            }
        }

        // PUT: api/hotels/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHotel(int id, [FromBody] UpdateHotelDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });
                }

                var hotel = await _context.Hotels.FindAsync(id);
                if (hotel == null || !hotel.IsActive)
                {
                    return NotFound(new { success = false, message = "Hotel not found" });
                }

                // Check if hotel code already exists (excluding current hotel)
                var existingHotel = await _context.Hotels
                    .AnyAsync(h => h.HotelCode == dto.HotelCode && h.Id != id && h.IsActive);

                if (existingHotel)
                {
                    return BadRequest(new { success = false, message = "Hotel code already exists" });
                }

                string cityName = dto.City ?? "";
                int? cityId = dto.CityId;

                if (cityId.HasValue)
                {
                    var city = await _context.Cities.FirstOrDefaultAsync(c => c.Id == cityId.Value && c.IsActive);
                    if (city == null)
                    {
                        return BadRequest(new { success = false, message = "Invalid CityId" });
                    }
                    cityName = city.Name;
                }

                // Update hotel properties
                hotel.HotelName = dto.HotelName;
                hotel.HotelCode = dto.HotelCode;
                hotel.Address = dto.Address ?? "";
                hotel.CityId = cityId;
                hotel.City = cityName;
                hotel.State = dto.State ?? "";
                hotel.Country = dto.Country ?? "Pakistan";
                hotel.PostalCode = dto.PostalCode ?? "";
                hotel.PhoneNumber = dto.PhoneNumber ?? "";
                hotel.Email = dto.Email ?? "";
                hotel.Website = dto.Website ?? "";
                hotel.FaxNumber = dto.FaxNumber ?? "";
                hotel.GSTNumber = dto.GSTNumber ?? "";
                hotel.PANNumber = dto.PANNumber ?? "";
                hotel.LicenseNumber = dto.LicenseNumber ?? "";
                hotel.ManagerName = dto.ManagerName ?? "";
                hotel.ManagerPhone = dto.ManagerPhone ?? "";
                hotel.ManagerEmail = dto.ManagerEmail ?? "";
                hotel.TotalRooms = dto.TotalRooms;
                hotel.TotalFloors = dto.TotalFloors;
                hotel.EstablishedDate = dto.EstablishedDate ?? hotel.EstablishedDate;
                hotel.StarRating = dto.StarRating ?? "3 Star";
                hotel.Description = dto.Description ?? "";
                hotel.IsMainBranch = dto.IsMainBranch;
                hotel.Currency = dto.Currency ?? "PKR";
                hotel.CheckInTime = dto.CheckInTime ?? "";
                hotel.CheckOutTime = dto.CheckOutTime ?? "";
                hotel.TimeZone = dto.TimeZone ?? "Asia/Karachi";
                hotel.Latitude = dto.Latitude;
                hotel.Longitude = dto.Longitude;
                hotel.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Hotel updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating hotel with ID {HotelId}", id);
                return StatusCode(500, new { success = false, message = "Error updating hotel" });
            }
        }

        // POST: api/hotels/{id}/logo
        [HttpPost("{id}/logo")]
        [RequestSizeLimit(10_000_000)]
        public async Task<IActionResult> UploadHotelLogo(int id, [FromForm] IFormFile logo)
        {
            try
            {
                if (logo == null || logo.Length == 0)
                {
                    return BadRequest(new { success = false, message = "Logo file is required" });
                }

                var hotel = await _context.Hotels.FindAsync(id);
                if (hotel == null || !hotel.IsActive)
                {
                    return NotFound(new { success = false, message = "Hotel not found" });
                }

                var extension = Path.GetExtension(logo.FileName)?.ToLowerInvariant();
                var allowedExtensions = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { ".jpg", ".jpeg", ".png", ".webp" };
                if (string.IsNullOrWhiteSpace(extension) || !allowedExtensions.Contains(extension))
                {
                    return BadRequest(new { success = false, message = "Invalid logo file type. Allowed: jpg, jpeg, png, webp" });
                }

                var webRootPath = string.IsNullOrWhiteSpace(_env.WebRootPath)
                    ? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")
                    : _env.WebRootPath;

                var uploadsRoot = Path.Combine(webRootPath, "uploads", "logos");
                Directory.CreateDirectory(uploadsRoot);

                var fileName = $"hotel_{id}_{DateTime.UtcNow:yyyyMMddHHmmssfff}{extension}";
                var filePath = Path.Combine(uploadsRoot, fileName);

                await using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await logo.CopyToAsync(stream);
                }

                var relativePath = $"/uploads/logos/{fileName}";
                hotel.LogoPath = relativePath;
                hotel.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Logo uploaded successfully", data = new { logoPath = relativePath } });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading logo for hotel with ID {HotelId}", id);
                return StatusCode(500, new { success = false, message = "Error uploading logo", error = ex.Message });
            }
        }

        // DELETE: api/hotels/{id}
        [HttpDelete("{id}")]
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
                return StatusCode(500, new { success = false, message = "Error deleting hotel" });
            }
        }
    }
}
