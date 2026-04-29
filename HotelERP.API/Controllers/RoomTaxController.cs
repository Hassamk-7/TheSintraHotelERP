using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using System.Text.Json;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomTaxController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<RoomTaxController> _logger;

        public RoomTaxController(HotelDbContext context, ILogger<RoomTaxController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/RoomTax
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetRoomTaxes()
        {
            try
            {
                var roomTaxes = await _context.RoomTaxes
                    .Include(rt => rt.Hotel)
                    .Include(rt => rt.RoomType)
                    .Where(rt => rt.IsActive)
                    .OrderBy(rt => rt.Hotel.HotelName)
                    .ThenBy(rt => rt.RoomType.Name)
                    .ThenBy(rt => rt.TaxName)
                    .Select(rt => new
                    {
                        id = rt.Id,
                        hotelId = rt.HotelId,
                        hotelName = rt.Hotel.HotelName,
                        roomTypeId = rt.RoomTypeId,
                        roomTypeName = rt.RoomType.Name,
                        taxName = rt.TaxName,
                        taxType = rt.TaxType,
                        taxValue = rt.TaxValue,
                        isActive = rt.IsActive,
                        createdAt = rt.CreatedAt,
                        updatedAt = rt.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = roomTaxes });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room taxes");
                return StatusCode(500, new { success = false, message = "Internal server error occurred while retrieving room taxes" });
            }
        }

        // GET: api/RoomTax/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetRoomTax(int id)
        {
            try
            {
                var roomTax = await _context.RoomTaxes
                    .Include(rt => rt.Hotel)
                    .Include(rt => rt.RoomType)
                    .Where(rt => rt.Id == id)
                    .Select(rt => new
                    {
                        id = rt.Id,
                        hotelId = rt.HotelId,
                        hotelName = rt.Hotel.HotelName,
                        roomTypeId = rt.RoomTypeId,
                        roomTypeName = rt.RoomType.Name,
                        taxName = rt.TaxName,
                        taxType = rt.TaxType,
                        taxValue = rt.TaxValue,
                        isActive = rt.IsActive,
                        createdAt = rt.CreatedAt,
                        updatedAt = rt.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                if (roomTax == null)
                {
                    return NotFound(new { success = false, message = $"Room tax with ID {id} not found" });
                }

                return Ok(new { success = true, data = roomTax });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room tax with ID {Id}", id);
                return StatusCode(500, new { success = false, message = "Internal server error occurred while retrieving room tax" });
            }
        }

        // GET: api/RoomTax/hotel/5
        [HttpGet("hotel/{hotelId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetRoomTaxesByHotel(int hotelId)
        {
            try
            {
                var roomTaxes = await _context.RoomTaxes
                    .Include(rt => rt.Hotel)
                    .Include(rt => rt.RoomType)
                    .Where(rt => rt.HotelId == hotelId && rt.IsActive)
                    .OrderBy(rt => rt.RoomType.Name)
                    .ThenBy(rt => rt.TaxName)
                    .Select(rt => new
                    {
                        id = rt.Id,
                        hotelId = rt.HotelId,
                        hotelName = rt.Hotel.HotelName,
                        roomTypeId = rt.RoomTypeId,
                        roomTypeName = rt.RoomType.Name,
                        taxName = rt.TaxName,
                        taxType = rt.TaxType,
                        taxValue = rt.TaxValue,
                        isActive = rt.IsActive,
                        createdAt = rt.CreatedAt,
                        updatedAt = rt.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = roomTaxes });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room taxes for hotel ID {HotelId}", hotelId);
                return StatusCode(500, new { success = false, message = "Internal server error occurred while retrieving room taxes" });
            }
        }

        // GET: api/RoomTax/roomtype/5
        [HttpGet("roomtype/{roomTypeId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetRoomTaxesByRoomType(int roomTypeId)
        {
            try
            {
                var roomTaxes = await _context.RoomTaxes
                    .Include(rt => rt.Hotel)
                    .Include(rt => rt.RoomType)
                    .Where(rt => rt.RoomTypeId == roomTypeId && rt.IsActive)
                    .OrderBy(rt => rt.Hotel.HotelName)
                    .ThenBy(rt => rt.TaxName)
                    .Select(rt => new
                    {
                        id = rt.Id,
                        hotelId = rt.HotelId,
                        hotelName = rt.Hotel.HotelName,
                        roomTypeId = rt.RoomTypeId,
                        roomTypeName = rt.RoomType.Name,
                        taxName = rt.TaxName,
                        taxType = rt.TaxType,
                        taxValue = rt.TaxValue,
                        isActive = rt.IsActive,
                        createdAt = rt.CreatedAt,
                        updatedAt = rt.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = roomTaxes });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room taxes for room type ID {RoomTypeId}", roomTypeId);
                return StatusCode(500, new { success = false, message = "Internal server error occurred while retrieving room taxes" });
            }
        }

        // POST: api/RoomTax
        [HttpPost]
        public async Task<ActionResult<object>> CreateRoomTax([FromBody] JsonElement requestJson)
        {
            try
            {
                // Parse JSON data
                var hotelId = requestJson.TryGetProperty("hotelId", out var hotelIdProp) ? 
                    (hotelIdProp.ValueKind == JsonValueKind.String ? int.Parse(hotelIdProp.GetString()!) : hotelIdProp.GetInt32()) : 0;
                
                var roomTypeId = requestJson.TryGetProperty("roomTypeId", out var roomTypeIdProp) ? 
                    (roomTypeIdProp.ValueKind == JsonValueKind.String ? int.Parse(roomTypeIdProp.GetString()!) : roomTypeIdProp.GetInt32()) : 0;
                
                var taxName = requestJson.TryGetProperty("taxName", out var taxNameProp) ? taxNameProp.GetString() : "";
                var taxType = requestJson.TryGetProperty("taxType", out var taxTypeProp) ? taxTypeProp.GetString() : "Percentage";
                
                var taxValue = requestJson.TryGetProperty("taxValue", out var taxValueProp) ? 
                    (taxValueProp.ValueKind == JsonValueKind.String ? decimal.Parse(taxValueProp.GetString()!) : taxValueProp.GetDecimal()) : 0;

                // Validation
                if (hotelId <= 0 || roomTypeId <= 0 || string.IsNullOrEmpty(taxName) || taxValue < 0)
                {
                    return BadRequest(new { success = false, message = "Hotel, Room Type, Tax Name, and Tax Value are required" });
                }

                // Check if hotel exists
                var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == hotelId);
                if (!hotelExists)
                {
                    return BadRequest(new { success = false, message = "Hotel not found" });
                }

                // Check if room type exists
                var roomTypeExists = await _context.RoomTypes.AnyAsync(rt => rt.Id == roomTypeId);
                if (!roomTypeExists)
                {
                    return BadRequest(new { success = false, message = "Room type not found" });
                }

                // Check for duplicate tax for same hotel and room type
                var existingTax = await _context.RoomTaxes
                    .AnyAsync(rt => rt.HotelId == hotelId && rt.RoomTypeId == roomTypeId && 
                                   rt.TaxName.ToLower() == taxName.ToLower() && rt.IsActive);
                
                if (existingTax)
                {
                    return BadRequest(new { success = false, message = "Tax with this name already exists for this hotel and room type" });
                }

                var roomTax = new RoomTax
                {
                    HotelId = hotelId,
                    RoomTypeId = roomTypeId,
                    TaxName = taxName,
                    TaxType = taxType,
                    TaxValue = taxValue,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = User?.Identity?.Name ?? "System"
                };

                _context.RoomTaxes.Add(roomTax);
                await _context.SaveChangesAsync();

                // Return created tax with related data
                var createdTax = await _context.RoomTaxes
                    .Include(rt => rt.Hotel)
                    .Include(rt => rt.RoomType)
                    .Where(rt => rt.Id == roomTax.Id)
                    .Select(rt => new
                    {
                        id = rt.Id,
                        hotelId = rt.HotelId,
                        hotelName = rt.Hotel.HotelName,
                        roomTypeId = rt.RoomTypeId,
                        roomTypeName = rt.RoomType.Name,
                        taxName = rt.TaxName,
                        taxType = rt.TaxType,
                        taxValue = rt.TaxValue,
                        isActive = rt.IsActive,
                        createdAt = rt.CreatedAt,
                        updatedAt = rt.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                return CreatedAtAction(nameof(GetRoomTax), new { id = roomTax.Id }, 
                    new { success = true, data = createdTax });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating room tax");
                return StatusCode(500, new { success = false, message = "Internal server error occurred while creating room tax" });
            }
        }

        // PUT: api/RoomTax/5
        [HttpPut("{id}")]
        public async Task<ActionResult<object>> UpdateRoomTax(int id, [FromBody] JsonElement requestJson)
        {
            try
            {
                var roomTax = await _context.RoomTaxes.FindAsync(id);
                if (roomTax == null)
                {
                    return NotFound(new { success = false, message = $"Room tax with ID {id} not found" });
                }

                // Parse JSON data
                var hotelId = requestJson.TryGetProperty("hotelId", out var hotelIdProp) ? 
                    (hotelIdProp.ValueKind == JsonValueKind.String ? int.Parse(hotelIdProp.GetString()!) : hotelIdProp.GetInt32()) : roomTax.HotelId;
                
                var roomTypeId = requestJson.TryGetProperty("roomTypeId", out var roomTypeIdProp) ? 
                    (roomTypeIdProp.ValueKind == JsonValueKind.String ? int.Parse(roomTypeIdProp.GetString()!) : roomTypeIdProp.GetInt32()) : roomTax.RoomTypeId;
                
                var taxName = requestJson.TryGetProperty("taxName", out var taxNameProp) ? taxNameProp.GetString() : roomTax.TaxName;
                var taxType = requestJson.TryGetProperty("taxType", out var taxTypeProp) ? taxTypeProp.GetString() : roomTax.TaxType;
                
                var taxValue = requestJson.TryGetProperty("taxValue", out var taxValueProp) ? 
                    (taxValueProp.ValueKind == JsonValueKind.String ? decimal.Parse(taxValueProp.GetString()!) : taxValueProp.GetDecimal()) : roomTax.TaxValue;

                // Validation
                if (hotelId <= 0 || roomTypeId <= 0 || string.IsNullOrEmpty(taxName) || taxValue < 0)
                {
                    return BadRequest(new { success = false, message = "Hotel, Room Type, Tax Name, and Tax Value are required" });
                }

                // Check for duplicate tax (excluding current record)
                var existingTax = await _context.RoomTaxes
                    .AnyAsync(rt => rt.Id != id && rt.HotelId == hotelId && rt.RoomTypeId == roomTypeId && 
                                   rt.TaxName.ToLower() == taxName.ToLower() && rt.IsActive);
                
                if (existingTax)
                {
                    return BadRequest(new { success = false, message = "Tax with this name already exists for this hotel and room type" });
                }

                // Update properties
                roomTax.HotelId = hotelId;
                roomTax.RoomTypeId = roomTypeId;
                roomTax.TaxName = taxName;
                roomTax.TaxType = taxType;
                roomTax.TaxValue = taxValue;
                roomTax.UpdatedAt = DateTime.UtcNow;
                roomTax.UpdatedBy = User?.Identity?.Name ?? "System";

                await _context.SaveChangesAsync();

                // Return updated tax with related data
                var updatedTax = await _context.RoomTaxes
                    .Include(rt => rt.Hotel)
                    .Include(rt => rt.RoomType)
                    .Where(rt => rt.Id == id)
                    .Select(rt => new
                    {
                        id = rt.Id,
                        hotelId = rt.HotelId,
                        hotelName = rt.Hotel.HotelName,
                        roomTypeId = rt.RoomTypeId,
                        roomTypeName = rt.RoomType.Name,
                        taxName = rt.TaxName,
                        taxType = rt.TaxType,
                        taxValue = rt.TaxValue,
                        isActive = rt.IsActive,
                        createdAt = rt.CreatedAt,
                        updatedAt = rt.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                return Ok(new { success = true, data = updatedTax });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating room tax with ID {Id}", id);
                return StatusCode(500, new { success = false, message = "Internal server error occurred while updating room tax" });
            }
        }

        // DELETE: api/RoomTax/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<object>> DeleteRoomTax(int id)
        {
            try
            {
                var roomTax = await _context.RoomTaxes.FindAsync(id);
                if (roomTax == null)
                {
                    return NotFound(new { success = false, message = $"Room tax with ID {id} not found" });
                }

                // Soft delete
                roomTax.IsActive = false;
                roomTax.UpdatedAt = DateTime.UtcNow;
                roomTax.UpdatedBy = User?.Identity?.Name ?? "System";

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Room tax deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting room tax with ID {Id}", id);
                return StatusCode(500, new { success = false, message = "Internal server error occurred while deleting room tax" });
            }
        }

        // GET: api/RoomTax/hotels
        [HttpGet("hotels")]
        public async Task<ActionResult<IEnumerable<object>>> GetHotels()
        {
            try
            {
                var hotels = await _context.Hotels
                    .Where(h => h.IsActive)
                    .Select(h => new
                    {
                        id = h.Id,
                        name = h.HotelName,
                        code = h.HotelCode
                    })
                    .OrderBy(h => h.name)
                    .ToListAsync();

                return Ok(new { success = true, data = hotels });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving hotels");
                return StatusCode(500, new { success = false, message = "Internal server error occurred while retrieving hotels" });
            }
        }

        // GET: api/RoomTax/roomtypes
        [HttpGet("roomtypes")]
        public async Task<ActionResult<IEnumerable<object>>> GetRoomTypes()
        {
            try
            {
                var roomTypes = await _context.RoomTypes
                    .Where(rt => rt.IsActive)
                    .Select(rt => new
                    {
                        id = rt.Id,
                        name = rt.Name,
                        code = rt.Code
                    })
                    .OrderBy(rt => rt.name)
                    .ToListAsync();

                return Ok(new { success = true, data = roomTypes });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room types");
                return StatusCode(500, new { success = false, message = "Internal server error occurred while retrieving room types" });
            }
        }
    }
}
