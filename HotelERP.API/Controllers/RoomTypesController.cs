using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using HotelERP.API.Data;
using HotelERP.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelERP.API.Controllers
{
    // [Authorize(Roles = "Admin,Manager,Receptionist")] // Temporarily disabled for testing
    public class RoomTypesController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<RoomTypesController> _logger;

        public RoomTypesController(HotelDbContext context, ILogger<RoomTypesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/roomtypes/test
        [HttpGet("test")]
        public IActionResult TestEndpoint()
        {
            return Ok(new { message = "RoomTypes API is working!", timestamp = DateTime.UtcNow });
        }

        // GET: api/roomtypes
        [HttpGet]
        public async Task<IActionResult> GetRoomTypes()
        {
            try
            {
                var roomTypes = await _context.RoomTypes
                    .Include(rt => rt.Hotel)
                    .ToListAsync();
                var count = roomTypes.Count;
                _logger.LogInformation($"Retrieved {count} room types from database");
                
                return HandleSuccess(roomTypes, $"Retrieved {count} room types successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room types");
                return HandleError($"Database error: {ex.Message}");
            }
        }

        // GET: api/roomtypes/by-hotel/{hotelId}
        [HttpGet("by-hotel/{hotelId}")]
        public async Task<IActionResult> GetRoomTypesByHotel(int hotelId)
        {
            try
            {
                var query = _context.RoomTypes
                    .Include(rt => rt.Hotel)
                    .Where(rt => rt.IsActive);

                if (hotelId > 0)
                {
                    query = query.Where(rt => rt.HotelId == hotelId);
                }

                var roomTypes = await query
                    .OrderBy(rt => rt.Name)
                    .Select(rt => new
                    {
                        Id = rt.Id,
                        Name = rt.Name,
                        Code = rt.Code,
                        HotelId = rt.HotelId,
                        HotelName = rt.Hotel != null ? rt.Hotel.HotelName : null
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = roomTypes });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room types by hotelId {HotelId}", hotelId);
                return StatusCode(500, new { success = false, message = "Error retrieving room types" });
            }
        }

        // GET: api/roomtypes/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoomType(int id)
        {
            try
            {
                var roomType = await _context.RoomTypes.FindAsync(id);

                if (roomType == null)
                {
                    return HandleNotFound("Room type not found");
                }

                return HandleSuccess(roomType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving room type with ID: {id}");
                return HandleError($"An error occurred while retrieving room type with ID: {id}");
            }
        }

        // POST: api/roomtypes
        [HttpPost]
        // [Authorize(Roles = "Admin,Manager")] // Temporarily disabled for testing
        public async Task<IActionResult> CreateRoomType([FromBody] System.Text.Json.JsonElement requestJson)
        {
            try
            {
                int? ParseNullableInt(System.Text.Json.JsonElement element)
                {
                    if (element.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        return element.GetInt32();
                    }

                    if (element.ValueKind == System.Text.Json.JsonValueKind.String && int.TryParse(element.GetString(), out var parsedValue))
                    {
                        return parsedValue;
                    }

                    return null;
                }

                // Parse JSON data safely
                string typeName = "";
                string description = "";
                int maxOccupancy = 2;
                int? maximumAdults = null;
                int? maximumChildren = null;
                int? hotelId = null;
                bool isActive = true;

                if (requestJson.TryGetProperty("typeName", out var typeNameElement))
                {
                    typeName = typeNameElement.GetString() ?? "";
                }

                if (requestJson.TryGetProperty("description", out var descriptionElement))
                {
                    description = descriptionElement.GetString() ?? "";
                }

                if (requestJson.TryGetProperty("hotelId", out var hotelIdElement))
                {
                    hotelId = ParseNullableInt(hotelIdElement);
                }

                if (requestJson.TryGetProperty("maximumAdults", out var maxAdultsElement))
                {
                    maximumAdults = ParseNullableInt(maxAdultsElement);
                }

                if (requestJson.TryGetProperty("maximumChildren", out var maxChildrenElement))
                {
                    maximumChildren = ParseNullableInt(maxChildrenElement);
                }

                if (requestJson.TryGetProperty("maxOccupancy", out var maxOccupancyElement))
                {
                    maxOccupancy = ParseNullableInt(maxOccupancyElement) ?? 2;
                }

                if (requestJson.TryGetProperty("isActive", out var isActiveElement))
                {
                    isActive = isActiveElement.GetBoolean();
                }

                // Validate required fields
                if (string.IsNullOrWhiteSpace(typeName))
                {
                    return HandleError("Room type name is required");
                }

                if (!hotelId.HasValue || hotelId.Value <= 0)
                {
                    return HandleError("Hotel is required");
                }

                var hotel = await _context.Hotels.FirstOrDefaultAsync(h => h.Id == hotelId.Value && h.IsActive);
                if (hotel == null)
                {
                    return HandleError("Invalid hotel");
                }

                // Generate RoomType Code within DB max length (20)
                var nextSeq = await _context.RoomTypes
                    .Where(rt => rt.HotelId == hotelId.Value && rt.Code != null && rt.Code.StartsWith(hotel.HotelCode + "-RT-"))
                    .Select(rt => rt.Code)
                    .ToListAsync();

                int maxNumber = 0;
                foreach (var code in nextSeq)
                {
                    var parts = code.Split("-RT-");
                    if (parts.Length == 2 && int.TryParse(parts[1], out var n))
                    {
                        if (n > maxNumber) maxNumber = n;
                    }
                }

                var sequencePart = $"RT{(maxNumber + 1).ToString("D4")}";
                var hotelCodePrefix = (hotel.HotelCode ?? "HTL").Replace(" ", "").Trim();
                var maxPrefixLength = Math.Max(1, 20 - sequencePart.Length - 1);
                if (hotelCodePrefix.Length > maxPrefixLength)
                {
                    hotelCodePrefix = hotelCodePrefix.Substring(0, maxPrefixLength);
                }
                var generatedCode = $"{hotelCodePrefix}-{sequencePart}";

                var roomType = new RoomType
                {
                    Name = typeName,
                    Code = generatedCode,
                    Description = string.IsNullOrEmpty(description) ? "" : description,
                    MaxOccupancy = maxOccupancy,
                    HotelId = hotelId,
                    MaximumAdults = maximumAdults,
                    MaximumChildren = maximumChildren,
                    Amenities = "", // Set empty string for amenities
                    IsActive = isActive,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.RoomTypes.Add(roomType);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Created room type: {typeName} with code: {generatedCode}");
                return HandleCreated(roomType, "Room type created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating room type");
                return HandleError(ex.InnerException?.Message ?? ex.Message);
            }
        }

        // PUT: api/roomtypes/5
        [HttpPut("{id}")]
        // [Authorize(Roles = "Admin,Manager")] // Temporarily disabled for testing
        public async Task<IActionResult> UpdateRoomType(int id, [FromBody] System.Text.Json.JsonElement requestJson)
        {
            try
            {
                int? ParseNullableInt(System.Text.Json.JsonElement element)
                {
                    if (element.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        return element.GetInt32();
                    }

                    if (element.ValueKind == System.Text.Json.JsonValueKind.String && int.TryParse(element.GetString(), out var parsedValue))
                    {
                        return parsedValue;
                    }

                    return null;
                }

                var roomType = await _context.RoomTypes.FindAsync(id);
                if (roomType == null)
                {
                    return HandleNotFound("Room type not found");
                }

                // Parse JSON data safely (similar to POST method)
                if (requestJson.TryGetProperty("typeName", out var typeNameElement))
                {
                    string typeName = typeNameElement.GetString();
                    if (!string.IsNullOrEmpty(typeName))
                    {
                        roomType.Name = typeName;
                    }
                }

                if (requestJson.TryGetProperty("description", out var descriptionElement))
                {
                    roomType.Description = descriptionElement.GetString() ?? "";
                }

                if (requestJson.TryGetProperty("hotelId", out var hotelIdElement))
                {
                    int? hotelId = ParseNullableInt(hotelIdElement);

                    if (hotelId.HasValue && hotelId.Value > 0)
                    {
                        var hotel = await _context.Hotels.FirstOrDefaultAsync(h => h.Id == hotelId.Value && h.IsActive);
                        if (hotel == null)
                        {
                            return HandleError("Invalid hotel");
                        }

                        roomType.HotelId = hotelId;
                        if (string.IsNullOrWhiteSpace(roomType.Code))
                        {
                            var hotelCodePrefix = (hotel.HotelCode ?? "HTL").Replace(" ", "").Trim();
                            var sequencePart = "RT0001";
                            var maxPrefixLength = Math.Max(1, 20 - sequencePart.Length - 1);
                            if (hotelCodePrefix.Length > maxPrefixLength)
                            {
                                hotelCodePrefix = hotelCodePrefix.Substring(0, maxPrefixLength);
                            }
                            roomType.Code = $"{hotelCodePrefix}-{sequencePart}";
                        }
                    }
                }

                if (requestJson.TryGetProperty("maximumAdults", out var maxAdultsElement))
                {
                    roomType.MaximumAdults = ParseNullableInt(maxAdultsElement);
                }

                if (requestJson.TryGetProperty("maximumChildren", out var maxChildrenElement))
                {
                    roomType.MaximumChildren = ParseNullableInt(maxChildrenElement);
                }

                if (requestJson.TryGetProperty("maxOccupancy", out var maxOccupancyElement))
                {
                    roomType.MaxOccupancy = ParseNullableInt(maxOccupancyElement) ?? roomType.MaxOccupancy;
                }

                if (requestJson.TryGetProperty("isActive", out var isActiveElement))
                {
                    roomType.IsActive = isActiveElement.GetBoolean();
                }

                roomType.UpdatedAt = DateTime.UtcNow;
                _context.Entry(roomType).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return HandleSuccess(roomType, "Room type updated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating room type with ID: {id}");
                return HandleError(ex.InnerException?.Message ?? ex.Message);
            }
        }

        // DELETE: api/roomtypes/5
        [HttpDelete("{id}")]
        // [Authorize(Roles = "Admin")] // Temporarily disabled for testing
        public async Task<IActionResult> DeleteRoomType(int id)
        {
            try
            {
                var roomType = await _context.RoomTypes
                    .Include(rt => rt.Rooms)
                    .FirstOrDefaultAsync(rt => rt.Id == id);

                if (roomType == null)
                {
                    return HandleNotFound("Room type not found");
                }

                if (roomType.Rooms != null && roomType.Rooms.Any())
                {
                    return HandleError("Cannot delete room type with associated rooms");
                }

                _context.RoomTypes.Remove(roomType);
                await _context.SaveChangesAsync();

                return HandleSuccess(null, "Room type deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting room type with ID: {id}");
                return HandleError($"An error occurred while deleting room type with ID: {id}");
            }
        }
    }

}
