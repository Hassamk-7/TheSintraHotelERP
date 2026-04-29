using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using System.Text.Json;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomBlockedController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<RoomBlockedController> _logger;

        public RoomBlockedController(HotelDbContext context, ILogger<RoomBlockedController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/RoomBlocked
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetRoomBlocked()
        {
            try
            {
                var roomBlocked = await _context.RoomBlocked
                    .Include(rb => rb.Hotel)
                    .Include(rb => rb.RoomType)
                    .Include(rb => rb.Room)
                    .Where(rb => rb.IsActive)
                    .OrderBy(rb => rb.BlockStartDate)
                    .Select(rb => new
                    {
                        id = rb.Id,
                        hotelId = rb.HotelId,
                        hotelName = rb.Hotel.HotelName,
                        roomTypeId = rb.RoomTypeId,
                        roomTypeName = rb.RoomType.Name,
                        roomId = rb.RoomId,
                        roomNumber = rb.Room.RoomNumber,
                        blockStartDate = rb.BlockStartDate,
                        blockEndDate = rb.BlockEndDate,
                        blockReason = rb.BlockReason,
                        blockType = rb.BlockType,
                        blockedBy = rb.BlockedBy,
                        blockNotes = rb.BlockNotes,
                        blockDuration = (rb.BlockEndDate - rb.BlockStartDate).Days + 1,
                        isCurrentlyBlocked = DateTime.Now >= rb.BlockStartDate && DateTime.Now <= rb.BlockEndDate,
                        isFutureBlock = rb.BlockStartDate > DateTime.Now,
                        isPastBlock = rb.BlockEndDate < DateTime.Now,
                        isActive = rb.IsActive,
                        createdAt = rb.CreatedAt,
                        updatedAt = rb.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = roomBlocked });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room blocked records");
                return StatusCode(500, new { success = false, message = "Internal server error occurred while retrieving room blocked records" });
            }
        }

        // GET: api/RoomBlocked/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetRoomBlocked(int id)
        {
            try
            {
                var roomBlocked = await _context.RoomBlocked
                    .Include(rb => rb.Hotel)
                    .Include(rb => rb.RoomType)
                    .Include(rb => rb.Room)
                    .Where(rb => rb.Id == id)
                    .Select(rb => new
                    {
                        id = rb.Id,
                        hotelId = rb.HotelId,
                        hotelName = rb.Hotel.HotelName,
                        roomTypeId = rb.RoomTypeId,
                        roomTypeName = rb.RoomType.Name,
                        roomId = rb.RoomId,
                        roomNumber = rb.Room.RoomNumber,
                        blockStartDate = rb.BlockStartDate,
                        blockEndDate = rb.BlockEndDate,
                        blockReason = rb.BlockReason,
                        blockType = rb.BlockType,
                        blockedBy = rb.BlockedBy,
                        blockNotes = rb.BlockNotes,
                        isActive = rb.IsActive,
                        createdAt = rb.CreatedAt,
                        updatedAt = rb.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                if (roomBlocked == null)
                {
                    return NotFound(new { success = false, message = $"Room blocked record with ID {id} not found" });
                }

                return Ok(new { success = true, data = roomBlocked });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room blocked record with ID {Id}", id);
                return StatusCode(500, new { success = false, message = "Internal server error occurred while retrieving room blocked record" });
            }
        }

        // GET: api/RoomBlocked/hotel/5
        [HttpGet("hotel/{hotelId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetRoomBlockedByHotel(int hotelId)
        {
            try
            {
                var roomBlocked = await _context.RoomBlocked
                    .Include(rb => rb.Hotel)
                    .Include(rb => rb.RoomType)
                    .Include(rb => rb.Room)
                    .Where(rb => rb.HotelId == hotelId && rb.IsActive)
                    .OrderBy(rb => rb.BlockStartDate)
                    .Select(rb => new
                    {
                        id = rb.Id,
                        hotelId = rb.HotelId,
                        hotelName = rb.Hotel.HotelName,
                        roomTypeId = rb.RoomTypeId,
                        roomTypeName = rb.RoomType.Name,
                        roomId = rb.RoomId,
                        roomNumber = rb.Room.RoomNumber,
                        blockStartDate = rb.BlockStartDate,
                        blockEndDate = rb.BlockEndDate,
                        blockReason = rb.BlockReason,
                        blockType = rb.BlockType,
                        blockedBy = rb.BlockedBy,
                        blockNotes = rb.BlockNotes,
                        isCurrentlyBlocked = DateTime.Now >= rb.BlockStartDate && DateTime.Now <= rb.BlockEndDate,
                        isActive = rb.IsActive
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = roomBlocked });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room blocked records for hotel ID {HotelId}", hotelId);
                return StatusCode(500, new { success = false, message = "Internal server error occurred while retrieving room blocked records" });
            }
        }

        // GET: api/RoomBlocked/calendar/{hotelId}
        [HttpGet("calendar/{hotelId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetRoomBlockedForCalendar(int hotelId, [FromQuery] DateTime? startDate = null, [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var start = startDate ?? DateTime.Today;
                var end = endDate ?? DateTime.Today.AddMonths(3);

                var calendarData = await _context.RoomBlocked
                    .Include(rb => rb.Room)
                    .Include(rb => rb.RoomType)
                    .Where(rb => rb.HotelId == hotelId && rb.IsActive &&
                                rb.BlockEndDate >= start && rb.BlockStartDate <= end)
                    .Select(rb => new
                    {
                        id = rb.Id,
                        roomId = rb.RoomId,
                        roomNumber = rb.Room.RoomNumber,
                        roomTypeName = rb.RoomType.Name,
                        startDate = rb.BlockStartDate,
                        endDate = rb.BlockEndDate,
                        reason = rb.BlockReason,
                        blockType = rb.BlockType,
                        blockedBy = rb.BlockedBy,
                        isActive = rb.IsActive
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = calendarData });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving calendar data for hotel ID {HotelId}", hotelId);
                return StatusCode(500, new { success = false, message = "Internal server error occurred while retrieving calendar data" });
            }
        }

        // GET: api/RoomBlocked/availability/{hotelId}
        [HttpGet("availability/{hotelId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetRoomAvailability(int hotelId, [FromQuery] DateTime? date = null)
        {
            try
            {
                var checkDate = date ?? DateTime.Today;

                var availability = await _context.RoomTypes
                    .Where(rt => rt.IsActive)
                    .Select(rt => new
                    {
                        hotelId = hotelId,
                        roomTypeId = rt.Id,
                        roomTypeName = rt.Name,
                        totalRooms = _context.Rooms.Count(r => r.RoomTypeId == rt.Id && r.IsActive),
                        blockedRooms = _context.RoomBlocked.Count(rb => rb.RoomTypeId == rt.Id && 
                                                                       rb.HotelId == hotelId &&
                                                                       rb.IsActive &&
                                                                       checkDate >= rb.BlockStartDate && 
                                                                       checkDate <= rb.BlockEndDate),
                        availableRooms = _context.Rooms.Count(r => r.RoomTypeId == rt.Id && r.IsActive) -
                                        _context.RoomBlocked.Count(rb => rb.RoomTypeId == rt.Id && 
                                                                        rb.HotelId == hotelId &&
                                                                        rb.IsActive &&
                                                                        checkDate >= rb.BlockStartDate && 
                                                                        checkDate <= rb.BlockEndDate)
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = availability, checkDate = checkDate });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room availability for hotel ID {HotelId}", hotelId);
                return StatusCode(500, new { success = false, message = "Internal server error occurred while retrieving room availability" });
            }
        }

        // GET: api/RoomBlocked/rooms/{hotelId}/{roomTypeId}
        [HttpGet("rooms/{hotelId}/{roomTypeId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetRoomsByHotelAndType(int hotelId, int roomTypeId)
        {
            try
            {
                var rooms = await _context.Rooms
                    .Where(r => r.RoomTypeId == roomTypeId && r.IsActive)
                    .Select(r => new
                    {
                        id = r.Id,
                        roomNumber = r.RoomNumber,
                        roomTypeId = r.RoomTypeId,
                        status = r.Status,
                        isCurrentlyBlocked = _context.RoomBlocked.Any(rb => rb.RoomId == r.Id && 
                                                                           rb.HotelId == hotelId &&
                                                                           rb.IsActive &&
                                                                           DateTime.Now >= rb.BlockStartDate && 
                                                                           DateTime.Now <= rb.BlockEndDate)
                    })
                    .OrderBy(r => r.roomNumber)
                    .ToListAsync();

                return Ok(new { success = true, data = rooms });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving rooms for hotel {HotelId} and room type {RoomTypeId}", hotelId, roomTypeId);
                return StatusCode(500, new { success = false, message = "Internal server error occurred while retrieving rooms" });
            }
        }

        // POST: api/RoomBlocked
        [HttpPost]
        public async Task<ActionResult<object>> CreateRoomBlocked([FromBody] JsonElement requestJson)
        {
            try
            {
                // Parse JSON data
                var hotelId = requestJson.TryGetProperty("hotelId", out var hotelIdProp) ? 
                    (hotelIdProp.ValueKind == JsonValueKind.String ? int.Parse(hotelIdProp.GetString()!) : hotelIdProp.GetInt32()) : 0;
                
                var roomTypeId = requestJson.TryGetProperty("roomTypeId", out var roomTypeIdProp) ? 
                    (roomTypeIdProp.ValueKind == JsonValueKind.String ? int.Parse(roomTypeIdProp.GetString()!) : roomTypeIdProp.GetInt32()) : 0;
                
                var roomId = requestJson.TryGetProperty("roomId", out var roomIdProp) ? 
                    (roomIdProp.ValueKind == JsonValueKind.String ? int.Parse(roomIdProp.GetString()!) : roomIdProp.GetInt32()) : 0;
                
                var blockStartDate = requestJson.TryGetProperty("blockStartDate", out var startDateProp) ? 
                    DateTime.Parse(startDateProp.GetString()!) : DateTime.MinValue;
                
                var blockEndDate = requestJson.TryGetProperty("blockEndDate", out var endDateProp) ? 
                    DateTime.Parse(endDateProp.GetString()!) : DateTime.MinValue;
                
                var blockReason = requestJson.TryGetProperty("blockReason", out var reasonProp) ? reasonProp.GetString() : "";
                var blockType = requestJson.TryGetProperty("blockType", out var typeProp) ? typeProp.GetString() : "Maintenance";
                var blockedBy = requestJson.TryGetProperty("blockedBy", out var blockedByProp) ? blockedByProp.GetString() : "";
                var blockNotes = requestJson.TryGetProperty("blockNotes", out var notesProp) ? notesProp.GetString() : "";

                // Validation
                if (hotelId <= 0 || roomTypeId <= 0 || roomId <= 0 || string.IsNullOrEmpty(blockReason) || string.IsNullOrEmpty(blockedBy))
                {
                    return BadRequest(new { success = false, message = "Hotel, Room Type, Room, Block Reason, and Blocked By are required" });
                }

                if (blockStartDate == DateTime.MinValue || blockEndDate == DateTime.MinValue)
                {
                    return BadRequest(new { success = false, message = "Valid start date and end date are required" });
                }

                if (blockEndDate < blockStartDate)
                {
                    return BadRequest(new { success = false, message = "End date cannot be before start date" });
                }

                // Check for overlapping blocks
                var overlappingBlock = await _context.RoomBlocked
                    .AnyAsync(rb => rb.RoomId == roomId && rb.IsActive &&
                                   ((blockStartDate >= rb.BlockStartDate && blockStartDate <= rb.BlockEndDate) ||
                                    (blockEndDate >= rb.BlockStartDate && blockEndDate <= rb.BlockEndDate) ||
                                    (blockStartDate <= rb.BlockStartDate && blockEndDate >= rb.BlockEndDate)));

                if (overlappingBlock)
                {
                    return BadRequest(new { success = false, message = "Room is already blocked for overlapping dates" });
                }

                var roomBlocked = new RoomBlocked
                {
                    HotelId = hotelId,
                    RoomTypeId = roomTypeId,
                    RoomId = roomId,
                    BlockStartDate = blockStartDate,
                    BlockEndDate = blockEndDate,
                    BlockReason = blockReason,
                    BlockType = blockType,
                    BlockedBy = blockedBy,
                    BlockNotes = blockNotes,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = User?.Identity?.Name ?? "System"
                };

                _context.RoomBlocked.Add(roomBlocked);
                await _context.SaveChangesAsync();

                // Return created record with related data
                var createdRecord = await _context.RoomBlocked
                    .Include(rb => rb.Hotel)
                    .Include(rb => rb.RoomType)
                    .Include(rb => rb.Room)
                    .Where(rb => rb.Id == roomBlocked.Id)
                    .Select(rb => new
                    {
                        id = rb.Id,
                        hotelId = rb.HotelId,
                        hotelName = rb.Hotel.HotelName,
                        roomTypeId = rb.RoomTypeId,
                        roomTypeName = rb.RoomType.Name,
                        roomId = rb.RoomId,
                        roomNumber = rb.Room.RoomNumber,
                        blockStartDate = rb.BlockStartDate,
                        blockEndDate = rb.BlockEndDate,
                        blockReason = rb.BlockReason,
                        blockType = rb.BlockType,
                        blockedBy = rb.BlockedBy,
                        blockNotes = rb.BlockNotes,
                        isActive = rb.IsActive,
                        createdAt = rb.CreatedAt,
                        updatedAt = rb.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                return CreatedAtAction(nameof(GetRoomBlocked), new { id = roomBlocked.Id }, 
                    new { success = true, data = createdRecord });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating room blocked record");
                return StatusCode(500, new { success = false, message = "Internal server error occurred while creating room blocked record" });
            }
        }

        // PUT: api/RoomBlocked/5
        [HttpPut("{id}")]
        public async Task<ActionResult<object>> UpdateRoomBlocked(int id, [FromBody] JsonElement requestJson)
        {
            try
            {
                var roomBlocked = await _context.RoomBlocked.FindAsync(id);
                if (roomBlocked == null)
                {
                    return NotFound(new { success = false, message = $"Room blocked record with ID {id} not found" });
                }

                // Parse JSON data
                var blockStartDate = requestJson.TryGetProperty("blockStartDate", out var startDateProp) ? 
                    DateTime.Parse(startDateProp.GetString()!) : roomBlocked.BlockStartDate;
                
                var blockEndDate = requestJson.TryGetProperty("blockEndDate", out var endDateProp) ? 
                    DateTime.Parse(endDateProp.GetString()!) : roomBlocked.BlockEndDate;
                
                var blockReason = requestJson.TryGetProperty("blockReason", out var reasonProp) ? 
                    reasonProp.GetString() : roomBlocked.BlockReason;
                
                var blockType = requestJson.TryGetProperty("blockType", out var typeProp) ? 
                    typeProp.GetString() : roomBlocked.BlockType;
                
                var blockedBy = requestJson.TryGetProperty("blockedBy", out var blockedByProp) ? 
                    blockedByProp.GetString() : roomBlocked.BlockedBy;
                
                var blockNotes = requestJson.TryGetProperty("blockNotes", out var notesProp) ? 
                    notesProp.GetString() : roomBlocked.BlockNotes;

                // Validation
                if (string.IsNullOrEmpty(blockReason) || string.IsNullOrEmpty(blockedBy))
                {
                    return BadRequest(new { success = false, message = "Block Reason and Blocked By are required" });
                }

                if (blockEndDate < blockStartDate)
                {
                    return BadRequest(new { success = false, message = "End date cannot be before start date" });
                }

                // Check for overlapping blocks (excluding current record)
                var overlappingBlock = await _context.RoomBlocked
                    .AnyAsync(rb => rb.Id != id && rb.RoomId == roomBlocked.RoomId && rb.IsActive &&
                                   ((blockStartDate >= rb.BlockStartDate && blockStartDate <= rb.BlockEndDate) ||
                                    (blockEndDate >= rb.BlockStartDate && blockEndDate <= rb.BlockEndDate) ||
                                    (blockStartDate <= rb.BlockStartDate && blockEndDate >= rb.BlockEndDate)));

                if (overlappingBlock)
                {
                    return BadRequest(new { success = false, message = "Room is already blocked for overlapping dates" });
                }

                // Update properties
                roomBlocked.BlockStartDate = blockStartDate;
                roomBlocked.BlockEndDate = blockEndDate;
                roomBlocked.BlockReason = blockReason;
                roomBlocked.BlockType = blockType;
                roomBlocked.BlockedBy = blockedBy;
                roomBlocked.BlockNotes = blockNotes;
                roomBlocked.UpdatedAt = DateTime.UtcNow;
                roomBlocked.UpdatedBy = User?.Identity?.Name ?? "System";

                await _context.SaveChangesAsync();

                // Return updated record with related data
                var updatedRecord = await _context.RoomBlocked
                    .Include(rb => rb.Hotel)
                    .Include(rb => rb.RoomType)
                    .Include(rb => rb.Room)
                    .Where(rb => rb.Id == id)
                    .Select(rb => new
                    {
                        id = rb.Id,
                        hotelId = rb.HotelId,
                        hotelName = rb.Hotel.HotelName,
                        roomTypeId = rb.RoomTypeId,
                        roomTypeName = rb.RoomType.Name,
                        roomId = rb.RoomId,
                        roomNumber = rb.Room.RoomNumber,
                        blockStartDate = rb.BlockStartDate,
                        blockEndDate = rb.BlockEndDate,
                        blockReason = rb.BlockReason,
                        blockType = rb.BlockType,
                        blockedBy = rb.BlockedBy,
                        blockNotes = rb.BlockNotes,
                        isActive = rb.IsActive,
                        createdAt = rb.CreatedAt,
                        updatedAt = rb.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                return Ok(new { success = true, data = updatedRecord });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating room blocked record with ID {Id}", id);
                return StatusCode(500, new { success = false, message = "Internal server error occurred while updating room blocked record" });
            }
        }

        // DELETE: api/RoomBlocked/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<object>> DeleteRoomBlocked(int id)
        {
            try
            {
                var roomBlocked = await _context.RoomBlocked.FindAsync(id);
                if (roomBlocked == null)
                {
                    return NotFound(new { success = false, message = $"Room blocked record with ID {id} not found" });
                }

                // Soft delete
                roomBlocked.IsActive = false;
                roomBlocked.UpdatedAt = DateTime.UtcNow;
                roomBlocked.UpdatedBy = User?.Identity?.Name ?? "System";

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Room blocked record deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting room blocked record with ID {Id}", id);
                return StatusCode(500, new { success = false, message = "Internal server error occurred while deleting room blocked record" });
            }
        }

        // GET: api/RoomBlocked/hotels
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

        // GET: api/RoomBlocked/roomtypes/{hotelId}
        [HttpGet("roomtypes/{hotelId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetRoomTypesByHotel(int hotelId)
        {
            try
            {
                var query = _context.RoomTypes.AsQueryable();
                query = query.Where(rt => rt.IsActive);

                // hotelId <= 0 means: ALL hotels
                if (hotelId > 0)
                {
                    query = query.Where(rt => rt.HotelId == hotelId);
                }

                var roomTypes = await query
                    .Select(rt => new
                    {
                        id = rt.Id,
                        name = rt.Name,
                        code = rt.Code,
                        totalRooms = _context.Rooms.Count(r => r.RoomTypeId == rt.Id && r.IsActive)
                    })
                    .OrderBy(rt => rt.name)
                    .ToListAsync();

                return Ok(new { success = true, data = roomTypes });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room types for hotel {HotelId}", hotelId);
                return StatusCode(500, new { success = false, message = "Internal server error occurred while retrieving room types" });
            }
        }
    }
}
